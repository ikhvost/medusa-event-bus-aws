import { describe, it, beforeEach, expect, vi } from 'vitest'
import { EventBridgeClient } from '@aws-sdk/client-eventbridge'
import { InternalModuleDeclaration, Logger, MedusaContainer } from '@medusajs/framework/types'

import { EventBusAwsModuleOptions } from '../../src/types'
import AwsEventBridgeEventBus, { InjectedDependencies } from '../../src/services/event-bus-aws'

describe('Unit: AwsEventBridgeEventBus', () => {
  let eventBridgeClient: EventBridgeClient
  let eventBus: AwsEventBridgeEventBus
  let logger: Logger

  beforeEach(() => {
    vi.clearAllMocks()

    eventBridgeClient = { send: vi.fn().mockResolvedValue({}) } as unknown as EventBridgeClient
    logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() } as unknown as Logger

    eventBus = new AwsEventBridgeEventBus(
      { eventBridgeClient, logger } as unknown as MedusaContainer & InjectedDependencies,
      { eventBusName: 'eventbus' } as EventBusAwsModuleOptions,
      {} as unknown as InternalModuleDeclaration,
    )
  })

  describe('emit()', () => {
    it('should emit an event', async () => {
      await eventBus.emit({
        name: 'eventName',
        data: { hi: '1234' },
      })

      expect(eventBridgeClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Entries: [{
              EventBusName: 'eventbus',
              Source:       'eventbus',
              DetailType:   'eventName',
              Detail:       JSON.stringify({
                name: 'eventName',
                data: { hi: '1234' },
              }),
            }],
          },
        }),
      )
    })

    it('should emit multiple events', async () => {
      await eventBus.emit([
        { name: 'event-1', data: { hi: '1234' } },
        { name: 'event-2', data: { hi: '5678' } },
      ])

      expect(eventBridgeClient.send).toHaveBeenCalledTimes(2)
    })

    it('should group events when eventGroupId is provided', async () => {
      await eventBus.emit([
        {
          name:     'test-event',
          data:     { test: '1234' },
          metadata: { eventGroupId: 'test' },
        },
        {
          name:     'test-event',
          data:     { test: 'test-1' },
          metadata: { eventGroupId: 'test' },
        },
      ])

      // eslint-disable-next-line dot-notation
      expect(eventBus['events'].get('test')).toHaveLength(2)
      expect(eventBridgeClient.send).not.toHaveBeenCalled()
    })

    it('should release grouped events', async () => {
      await eventBus.emit([
        {
          name:     'event-1',
          data:     { test: '1' },
          metadata: { eventGroupId: 'group-1' },
        },
        {
          name:     'event-2',
          data:     { test: '2' },
          metadata: { eventGroupId: 'group-1' },
        },
      ])

      await eventBus.releaseGroupedEvents('group-1')

      // eslint-disable-next-line dot-notation
      expect(eventBus['events'].get('group-1')).toBeUndefined()
      expect(eventBridgeClient.send).toHaveBeenCalledTimes(2)
    })

    it('should clear grouped events', async () => {
      await eventBus.emit([
        {
          name:     'event-1',
          data:     { test: '1' },
          metadata: { eventGroupId: 'group-1' },
        },
        {
          name:     'event-2',
          data:     { test: '2' },
          metadata: { eventGroupId: 'group-2' },
        },
      ])

      // eslint-disable-next-line dot-notation
      expect(eventBus['events'].get('group-1')).toHaveLength(1)
      // eslint-disable-next-line dot-notation
      expect(eventBus['events'].get('group-2')).toHaveLength(1)

      await eventBus.clearGroupedEvents('group-1')
      // eslint-disable-next-line dot-notation
      expect(eventBus['events'].get('group-1')).toBeUndefined()
      // eslint-disable-next-line dot-notation
      expect(eventBus['events'].get('group-2')).toHaveLength(1)
    })
  })
})
