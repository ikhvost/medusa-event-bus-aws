export type EventBusAwsModuleOptions = {
  region: string
  credentials: {
    accessKeyId: string
    secretAccessKey: string
  }
  eventBusName: string
}
