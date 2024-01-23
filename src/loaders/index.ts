import { EventBridgeClient, ListEventBusesCommand } from '@aws-sdk/client-eventbridge'
import { asValue } from 'awilix'
import { LoaderOptions } from '@medusajs/modules-sdk'
import { EventBusAwsModuleOptions } from '../types'

export default async ({
  container,
  logger,
  options,
}: LoaderOptions): Promise<void> => {
  const client = new EventBridgeClient(options as EventBusAwsModuleOptions)
  const command = new ListEventBusesCommand({})

  try {
    await client.send(command)

    logger?.info("Connection to AWS Event Bridge in module 'medusa-event-bus-aws' established")
  } catch (error) {
    logger?.error(" `An error occurred while connecting to Redis in module 'medusa-event-bus-aws':", error)
  }

  container.register({ eventBridgeClient: asValue(client) })
}
