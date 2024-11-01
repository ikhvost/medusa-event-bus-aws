import { ModuleExports } from '@medusajs/framework/types'

import Loader from './loaders'
import AwsEventBus from './services/event-bus-aws'

export const service = AwsEventBus
export const loaders = [Loader]

const moduleDefinition: ModuleExports = { service, loaders }

export default moduleDefinition
export * from './initialize'
