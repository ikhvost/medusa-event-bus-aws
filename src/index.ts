import { ModuleExports } from '@medusajs/modules-sdk'

import Loader from './loaders'
import AwsEventBus from './services/event-bus-aws'

export const service = AwsEventBus
export const loaders = [Loader]

const moduleDefinition: ModuleExports = { service, loaders }

export default moduleDefinition
export * from './initialize'
