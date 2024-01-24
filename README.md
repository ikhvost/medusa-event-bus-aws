# medusa-event-bus-aws

![npm](https://img.shields.io/npm/v/medusa-event-bus-aws?color=blue) ![npm](https://img.shields.io/npm/l/medusa-event-bus-aws)

## Overview

The `medusa-event-bus-aws` package is a specialized solution designed to bridge Medusa, an extensible open-source headless commerce platform, with AWS EventBridge, an event bus service offered by Amazon Web Services (AWS). This package provides an efficient and streamlined approach for developers to integrate Medusa’s core system with AWS services, enhancing the capabilities and reach of Medusa-based e-commerce solutions.

*Note*: Currently, this package does not support subscribing to events directly within the Medusa application. This is a feature we hope to add in the future. Contributions towards this are highly welcomed and appreciated.

## Features

* Easy integration between Medusa and AWS EventBridge.
* Customizable event mappings.
* Real-time event triggering.
* (Upcoming) Support for subscribing to Medusa events within the application.

## Installation

1. Install the plugin via npm:

```bash
npm install medusa-event-bus-aws
```
or with yarn
```bash
yarn add medusa-event-bus-aws
```

2. Add the plugin to your `medusa-config.js`:

```javascript
const modules = {
  eventBus: {
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
};
```

## Configuration

Configure the plugin by specifying the following options in `medusa-config.js`:

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
    "id": "8d57f4fd-58c7-2248-b4c5-0dbbd1675dea",
    "detail-type": "cart.updated",
    "source": "test",
    "account": "359213897458",
    "time": "2024-01-24T18:25:38Z",
    "region": "us-east-1",
    "resources": [],
    "detail": {
        "id": "cart_01HMYBG8VD5N6F1RE0XTJEC140",
        "type": "default",
        "email": "asd@ad.com",
        "object": "cart",
        "context": {
            "ip": "::1",
            "user_agent": "axios/0.24.0"
        },
        "metadata": null,
        "discounts": [],
        "region_id": "reg_01HMYAWE8SY3N0PYAY8YWVXYXS",
        "created_at": "2024-01-24T18:25:16.634Z",
        "deleted_at": null,
        "payment_id": null,
        "updated_at": "2024-01-24T18:25:33.209Z",
        "customer_id": "cus_01HMYBGS215KN5BJZ8BZZ9QVZN",
        "completed_at": null,
        "idempotency_key": null,
        "sales_channel_id": "sc_01HMYAT2YBXWEGK76V17TYSP5E",
        "shipping_methods": [
            {
                "id": "sm_01HMYBGT8YT2X7YQ9GA1RN59PY",
                "data": {},
                "price": 1200,
                "cart_id": "cart_01HMYBG8VD5N6F1RE0XTJEC140",
                "swap_id": null,
                "order_id": null,
                "return_id": null,
                "claim_order_id": null,
                "shipping_option": {
                    "id": "so_01HMYAWE9FVJ87ZMKRTNRXWK27",
                    "data": {
                        "id": "manual-fulfillment"
                    },
                    "name": "FakeEx Express",
                    "amount": 1200,
                    "metadata": null,
                    "is_return": false,
                    "region_id": "reg_01HMYAWE8SY3N0PYAY8YWVXYXS",
                    "admin_only": false,
                    "created_at": "2024-01-24T18:14:26.753Z",
                    "deleted_at": null,
                    "price_type": "flat_rate",
                    "profile_id": "sp_01HMYAT2XZQH3REH7H76FNSWPT",
                    "updated_at": "2024-01-24T18:14:26.753Z",
                    "provider_id": "manual"
                },
                "shipping_option_id": "so_01HMYAWE9FVJ87ZMKRTNRXWK27"
            }
        ],
        "billing_address_id": "addr_01HMYBGS2BCTZAK6ASX5KWA9A8",
        "shipping_address_id": "addr_01HMYBGS2BXHFEAH2T734ASY6Z",
        "payment_authorized_at": null
    }
}
```

# Contributing

We welcome contributions from the community! If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/ikhvost/medusa-event-bus-aws).

## License

This library is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the [LICENSE](./LICENSE) file for more details.
