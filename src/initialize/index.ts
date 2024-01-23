import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  Modules,
} from '@medusajs/modules-sdk'
import { IEventBusService } from '@medusajs/types'
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
