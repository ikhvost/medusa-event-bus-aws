# medusa-event-bus-aws

![npm](https://img.shields.io/npm/v/medusa-event-bus-aws?color=blue) ![npm](https://img.shields.io/npm/l/medusa-event-bus-aws)

## Overview

The `medusa-event-bus-aws` package is a specialized solution designed to bridge Medusa v2.x, an extensible open-source headless commerce platform, with AWS EventBridge, an event bus service offered by Amazon Web Services (AWS). This package provides an efficient and streamlined approach for developers to integrate Medusa's core system with AWS services, enhancing the capabilities and reach of Medusa-based e-commerce solutions.

*Note*: Currently, this package does not support subscribing to events directly within the Medusa application. This is a feature we hope to add in the future. Contributions towards this are highly welcomed and appreciated.

## Compatibility

This plugin requires Medusa v2.x or higher. It's specifically designed to work with Medusa's new modular architecture introduced in version 2.0.

- ✅ Medusa v2.x
- ❌ Medusa v1.x (use plugin version 1.x instead)

## Installation

1. Install the plugin via npm:

```bash
npm install medusa-event-bus-aws
```
or with yarn
```bash
yarn add medusa-event-bus-aws
```
or with pnpm
```bash
pnpm add medusa-event-bus-aws
```

2. Add the plugin to your `medusa-config.ts`:

```typescript
export default defineConfig({
  modules: {
    [Modules.EVENT_BUS]: {
      resolve: 'medusa-event-bus-aws',
      options: {
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        eventBusName: process.env.AWS_EVENT_BUS_NAME
      }
    },
  // other modules
},
  projectConfig: { ... }
});
```

## Configuration

Configure the plugin by specifying the following options in `medusa-config.ts`:

* `eventBusName`: Name of the AWS EventBridge bus to send events to.
* `region`: AWS region for the EventBridge.
* `accessKeyId`: AWS access key ID.
* `secretAccessKey`: AWS secret access key.

## Usage

The plugin listens to Medusa events (e.g., order creation, product updates) and sends these events to the configured AWS EventBridge event bus. Events in EventBridge can then be used to trigger various AWS services such as Lambda, SNS, SQS, etc.

## Example

```json
{
  "version": "0",
  "id": "1281b54b-7930-44d1-2568-dd4f730b0ce2",
  "detail-type": "LinkLocationFulfillmentProvider.attached",
  "source": "my-event-bus",
  "account": "211125766710",
  "time": "2024-11-01T20:14:46Z",
  "region": "us-east-1",
  "resources": [],
  "detail": {
      "name": "LinkLocationFulfillmentProvider.attached",
      "metadata": {
          "source": "StockLocationStockLocationFulfillmentFulfillmentProviderLink",
          "action": "attached",
          "object": "LinkLocationFulfillmentProvider"
      },
      "data": {
          "id": "locfp_01JBMNVE140Y1D9S01K90HHJS9"
      }
  }
}
```

# Contributing

We welcome contributions from the community! If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/ikhvost/medusa-event-bus-aws).

## License

This library is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the [LICENSE](./LICENSE) file for more details.
