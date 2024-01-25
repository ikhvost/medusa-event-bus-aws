import { EmitData, Logger } from '@medusajs/types'
import { AbstractEventBusModuleService } from '@medusajs/utils'
import { EventBridgeClient, PutEventsCommand, PutEventsRequestEntry } from '@aws-sdk/client-eventbridge'
import { EOL } from 'os'
import { EventBusAwsModuleOptions } from '../types'

type InjectedDependencies = {
  eventBridgeClient: EventBridgeClient
  logger: Logger
}

export default class AwsEventBridgeEventBus extends AbstractEventBusModuleService {
  #client: EventBridgeClient
  #logger: Logger
  #options: EventBusAwsModuleOptions

  constructor({ logger, eventBridgeClient }: InjectedDependencies, options: EventBusAwsModuleOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.#client = eventBridgeClient
    this.#logger = logger
    this.#options = options
  }

  /**
   * Emit a single event
   * @param {string} eventName - the name of the event to be process.
   * @param data - the data to send to the subscriber.
   * @param options - options to add the job with
   */
  async emit<T>(eventName: string, data: T, options: Record<string, unknown>): Promise<void>

  /**
   * Emit a number of events
   * @param {EmitData} data - the data to send to the subscriber.
   */
  async emit<T>(data: EmitData<T>[]): Promise<void>

  async emit<T, TInput extends string | EmitData<T>[] = string>(
    eventOrData: TInput,
    data?: T,
  ): Promise<void> {
    const events: EmitData[] = Array.isArray(eventOrData) ? eventOrData : [{ eventName: eventOrData, data }]

    for (const event of events) {
      const payload: PutEventsRequestEntry = {
        EventBusName: this.#options.eventBusName,
        Source:       this.#options.eventBusName,
        DetailType:   event.eventName,
        Detail:       JSON.stringify(event.data),
      }

      const command = new PutEventsCommand({ Entries: [payload] })

      await this.#client.send(command)
        .catch(error => { this.#logger.error(`Error sending event to AWS EventBridge:${EOL} ${error}`) })
    }
  }
}
