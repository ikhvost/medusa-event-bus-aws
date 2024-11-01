import { InternalModuleDeclaration, Logger, MedusaContainer, Message } from '@medusajs/framework/types'
import { AbstractEventBusModuleService } from '@medusajs/framework/utils'
import { EventBridgeClient, PutEventsCommand, PutEventsRequestEntry } from '@aws-sdk/client-eventbridge'
import { EOL } from 'os'
import { EventBusAwsModuleOptions } from '../types'

export type InjectedDependencies = {
  eventBridgeClient: EventBridgeClient
  logger: Logger
}

export default class AwsEventBridgeEventBus extends AbstractEventBusModuleService {
  private readonly client: EventBridgeClient
  private readonly logger: Logger
  private readonly options: EventBusAwsModuleOptions
  private readonly events: Map<string, Message[]>

  public constructor(
    container: MedusaContainer & InjectedDependencies,
    options: EventBusAwsModuleOptions,
    declaration: InternalModuleDeclaration,
  ) {
    super(container, options, declaration)

    this.client = container.eventBridgeClient
    this.logger = container.logger
    this.options = options
    this.events = new Map()
  }

  public async emit<T = unknown>(eventsData: Message<T> | Message<T>[]): Promise<void> {
    const normalized = Array.isArray(eventsData) ? eventsData : [eventsData]

    for (const eventData of normalized) {
      await this.groupOrEmitEvent(eventData)
    }
  }

  public async releaseGroupedEvents(groupId: string) {
    const grouped = this.events.get(groupId) || []

    for (const event of grouped) {
      await this.emitToEventBridge(event)
    }

    await this.clearGroupedEvents(groupId)
  }

  public async clearGroupedEvents(groupId: string) {
    await Promise.resolve(this.events.delete(groupId))
  }

  private async groupOrEmitEvent<T = unknown>(eventData: Message<T>) {
    const eventGroupId = eventData.metadata?.eventGroupId

    if (eventGroupId) {
      this.groupEvent(eventGroupId, eventData)
    } else {
      await this.emitToEventBridge(eventData)
    }
  }

  private async emitToEventBridge<T>(eventData: Message<T>) {
    const payload: PutEventsRequestEntry = {
      EventBusName: this.options.eventBusName,
      Source:       this.options.eventBusName,
      DetailType:   eventData.name,
      Detail:       JSON.stringify(eventData),
    }

    const command = new PutEventsCommand({ Entries: [payload] })

    await this.client.send(command)
      .catch(error => { this.logger.error(`Error sending event to AWS EventBridge:${EOL} ${error}`) })
  }

  private groupEvent<T = unknown>(groupId: string, eventData: Message<T>) {
    const grouped = this.events.get(groupId) || []
    grouped.push(eventData)
    this.events.set(groupId, grouped)
  }
}
