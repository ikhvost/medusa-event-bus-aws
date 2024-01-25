import { describe, it, beforeEach, expect, vi } from 'vitest'
import { EventBridgeClient } from '@aws-sdk/client-eventbridge'
import { Logger } from '@medusajs/types'
import { EOL } from 'os'
import { EventBusAwsModuleOptions } from '../../src/types'

import AwsEventBridgeEventBus from '../../src/services/event-bus-aws'

describe('Unit: AwsEventBridgeEventBus', () => {
  let eventBridgeClient: EventBridgeClient
  let logger: Logger
  let eventBus: AwsEventBridgeEventBus

  beforeEach(() => {
    eventBridgeClient = { send: vi.fn().mockResolvedValue({}) } as unknown as EventBridgeClient
    logger = { error: vi.fn() } as unknown as Logger

    eventBus = new AwsEventBridgeEventBus(
      { eventBridgeClient, logger },
      { eventBusName: 'eventbus' } as EventBusAwsModuleOptions,
    )
  })

  it('should emit a single event successfully', async () => {
    const name = 'product.created'
    const data = { id: 'productid' }
    const payload = {
      Detail:       JSON.stringify(data),
      DetailType:   name,
      EventBusName: 'eventbus',
      Source:       'eventbus',
    }

    await eventBus.emit(name, data, {})

    expect(eventBridgeClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: { Entries: [payload] },
      }),
    )
  })

  it('should emit multiple events successfully', async () => {
    const events = [
      {
        eventName: 'product.created',
        data:      { id: 'productid-1' },
      },
      {
        eventName: 'product.updated',
        data:      { id: 'productid-2' },
      },
    ]
    const payload1 =  {
      Detail:       JSON.stringify({ id: 'productid-1' }),
      DetailType:   'product.created',
      EventBusName: 'eventbus',
      Source:       'eventbus',
    }
    const payload2 = {
      Detail:       JSON.stringify({ id: 'productid-2' }),
      DetailType:   'product.updated',
      EventBusName: 'eventbus',
      Source:       'eventbus',
    }

    await eventBus.emit(events)

    expect(eventBridgeClient.send).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        input: { Entries: [payload1] },
      }),
    )
    expect(eventBridgeClient.send).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        input: { Entries: [payload2] },
      }),
    )
  })

  it('should handle errors when emitting events', async () => {
    const name = 'product.created'
    const data = { id: 'productid' }
    const error = new Error('some error')

    eventBridgeClient.send = vi.fn().mockRejectedValue(error)

    await eventBus.emit(name, data, {})

    expect(logger.error).toHaveBeenCalledWith(`Error sending event to AWS EventBridge:${EOL} ${error}`)
  })
})
