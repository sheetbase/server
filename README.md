<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

# @sheetbase/server

**Build server app on Google Apps Script.**

</section>

<section id="tocx" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

- [Installation](#installation)
- [Options](#options)
- [Main](#main)
  - [Main properties](#main-properties)
  - [Main methods](#main-methods)
    - [`registerRoutes()`](#main-registerroutes-0)
- [Routing](#routing)
  - [Endpoint](#routing-endpoint)
  - [Routes](#routing-routes)
    - [Routes overview](#routing-routes-overview)
    - [Routes detail](#routing-routes-detail)
      - [`GET` /system](#GET__system)
      - [`PUT` /logging](#PUT__logging)
- [Detail API reference](https://sheetbase.github.io/server)


</section>

<section id="installation" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="installation"><p>Installation</p>
</a></h2>

- Install: `npm install --save @sheetbase/server`

- Usage:

```ts
// 1. import constructor
import { server } from "@sheetbase/server";

// 2. create an instance
const ServerModule = server(/* options */);

// 3. start using
const getOptions = ServerModule.getOptions();
```

</section>

<section id="options" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="options"><p>Options</p>
</a></h2>

| Name                                                                           | Type                                                                                                          | Description                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [apiKeys?](https://sheetbase.github.io/server/interfaces/options.html#apikeys) | <code><a href="https://sheetbase.github.io/server/interfaces/apikeys.html" target="_blank">ApiKeys</a></code> | Multiple api keys                     |
| [failure?](https://sheetbase.github.io/server/interfaces/options.html#failure) | <code>function</code>                                                                                         | Handler for invalid api key           |
| [key?](https://sheetbase.github.io/server/interfaces/options.html#key)         | <code>string</code>                                                                                           | Single api key                        |
| [trigger?](https://sheetbase.github.io/server/interfaces/options.html#trigger) | <code>function</code>                                                                                         | Trigger every time an api key is used |
| [views?](https://sheetbase.github.io/server/interfaces/options.html#views)     | <code>string</code>                                                                                           | The view template folder              |

</section>

<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="main" href="https://sheetbase.github.io/server/classes/main.html"><p>Main</p>
</a></h2>

**The `Main` class.**

<h3><a name="main-properties"><p>Main properties</p>
</a></h3>

| Name                                                                                        | Type                                                                                                                           | Description |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| [apiKeyService](https://sheetbase.github.io/server/classes/main.html#apikeyservice)         | <code><a href="https://sheetbase.github.io/server/classes/apikeyservice.html" target="_blank">APIKeyService</a></code>         |             |
| [httpService](https://sheetbase.github.io/server/classes/main.html#httpservice)             | <code><a href="https://sheetbase.github.io/server/classes/httpservice.html" target="_blank">HttpService</a></code>             |             |
| [middlewareService](https://sheetbase.github.io/server/classes/main.html#middlewareservice) | <code><a href="https://sheetbase.github.io/server/classes/middlewareservice.html" target="_blank">MiddlewareService</a></code> |             |
| [monitoringService](https://sheetbase.github.io/server/classes/main.html#monitoringservice) | <code><a href="https://sheetbase.github.io/server/classes/monitoringservice.html" target="_blank">MonitoringService</a></code> |             |
| [responseService](https://sheetbase.github.io/server/classes/main.html#responseservice)     | <code><a href="https://sheetbase.github.io/server/classes/responseservice.html" target="_blank">ResponseService</a></code>     |             |
| [routeService](https://sheetbase.github.io/server/classes/main.html#routeservice)           | <code><a href="https://sheetbase.github.io/server/classes/routeservice.html" target="_blank">RouteService</a></code>           |             |
| [routerService](https://sheetbase.github.io/server/classes/main.html#routerservice)         | <code><a href="https://sheetbase.github.io/server/classes/routerservice.html" target="_blank">RouterService</a></code>         |             |
| [serverService](https://sheetbase.github.io/server/classes/main.html#serverservice)         | <code><a href="https://sheetbase.github.io/server/classes/serverservice.html" target="_blank">ServerService</a></code>         |             |

<h3><a name="main-methods"><p>Main methods</p>
</a></h3>

| Function                                   | Returns type                                                                                                           | Description              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| [registerRoutes()](#main-registerroutes-0) | <code><a href="https://sheetbase.github.io/server/classes/routerservice.html" target="_blank">RouterService</a></code> | Expose the module routes |

<h4><a name="main-registerroutes-0" href="https://sheetbase.github.io/server/classes/main.html#registerroutes"><p><code>registerRoutes()</code></p>
</a></h4>

**Expose the module routes**

**Returns**

<code><a href="https://sheetbase.github.io/server/classes/routerservice.html" target="_blank">RouterService</a></code>

---

</section>

<section id="routing" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="routing"><p>Routing</p>
</a></h2>

**ServerModule** module provides REST API endpoints allowing clients to access server resources. Theses enpoints are not public by default, to expose the endpoints:

```ts
ServerModule.registerRoutes(/* routing options */);
```

See detail addon routes options at [AddonRoutesOptions](https://sheetbase.github.io/server/interfaces/addonroutesoptions.html).

<h3><a name="routing-endpoint"><p>Endpoint</p>
</a></h3>

The default endpoint: **``**. The endpoint can be changed by passing `endpoint` property when [`registerRoutes`](#routing).

<h3><a name="routing-routes"><p>Routes</p>
</a></h3>

<h4><a name="routing-routes-overview"><p>Routes overview</p>
</a></h4>

| Route                     | Method | Description               |
| ------------------------- | ------ | ------------------------- |
| [/system](#GET__system)   | `GET`  | Get the system infomation |
| [/logging](#PUT__logging) | `PUT`  | Set a server log          |

<h4><a name="routing-routes-detail"><p>Routes detail</p>
</a></h4>

<h5><a name="GET__system"><p><code>GET</code> /system</p>
</a></h5>

Get the system infomation

**Response**

`object`

---

<h5><a name="PUT__logging"><p><code>PUT</code> /logging</p>
</a></h5>

Set a server log

**Request body**

| Name      | Type             | Description       |
| --------- | ---------------- | ----------------- |
| **level** | <a data-sref="LoggingLevel" href="https://sheetbase.github.io/server/globals.html#logginglevel"><code>LoggingLevel</code></a> | The logging level |
| **value** | <a data-sref="LoggingValue" href="https://sheetbase.github.io/server/globals.html#loggingvalue"><code>LoggingValue</code></a> | The logging value |

**Response**

`void`

---

</section>

<section id="license" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

## License

**@sheetbase/server** is released under the [MIT](https://github.com/sheetbase/server/blob/master/LICENSE) license.

</section>
