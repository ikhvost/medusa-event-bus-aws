import { MedusaModule } from '@medusajs/framework/modules-sdk'
import {
  ExternalModuleDeclaration,
  IEventBusService,
  InternalModuleDeclaration,
} from '@medusajs/framework/types'
import { Modules } from '@medusajs/framework/utils'
import { EventBusAwsModuleOptions } from '../types'

export const initialize = async (
  options?: EventBusAwsModuleOptions | ExternalModuleDeclaration,
): Promise<IEventBusService> => {
  const serviceKey = Modules.EVENT_BUS
  const loaded = await MedusaModule.bootstrap<IEventBusService>({
    moduleKey:   serviceKey,
    defaultPath: 'medusa-event-bus-aws',
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
  })

  return loaded[serviceKey]
}
