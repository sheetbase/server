<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

# @sheetbase/server

**Build server app on Google Apps Script.**

</section>

<section id="tocx" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

- [Installation](#installation)
- [Options](#options)
- [Lib](#lib)
  - [Lib properties](#lib-properties)
  - [Lib methods](#lib-methods)
    - [`registerRoutes(routeEnabling?)`](#lib-registerroutes-0)
- [Routing](#routing)
  - [Routes](#routing-routes)
    - [Routes overview](#routing-routes-overview)
    - [Routes detail](#routing-routes-detail)
      - [`PUT` /logging](#PUT__logging)
      - [`GET` /system](#GET__system)
- [Detail API reference](https://sheetbase.github.io/server)


</section>

<section id="installation" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="installation"><p>Installation</p>
</a></h2>

- Install: `npm install --save @sheetbase/server`

- Usage:

```ts
// 1. import module
import { ServerModule } from "@sheetbase/server";

// 2. create an instance
export class App {
  // the object
  serverModule: ServerModule;

  // initiate the instance
  constructor() {
    this.serverModule = new ServerModule(/* options */);
  }
}
```

</section>

<section id="options" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="options"><p>Options</p>
</a></h2>

| Name                                                                           | Type                                                                                                          | Description                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [apiKeys?](https://sheetbase.github.io/server/interfaces/options.html#apikeys) | <code><a href="https://sheetbase.github.io/server/interfaces/apikeys.html" target="_blank">ApiKeys</a></code> | Multiple api keys                     |
| [failure?](https://sheetbase.github.io/server/interfaces/options.html#failure) | <code>undefined \| function</code>                                                                            | Handler for invalid api key           |
| [key?](https://sheetbase.github.io/server/interfaces/options.html#key)         | <code>undefined \| string</code>                                                                              | Single api key                        |
| [trigger?](https://sheetbase.github.io/server/interfaces/options.html#trigger) | <code>undefined \| function</code>                                                                            | Trigger every time an api key is used |
| [views?](https://sheetbase.github.io/server/interfaces/options.html#views)     | <code>undefined \| string</code>                                                                              | The view template folder              |

</section>

<section id="lib" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="lib" href="https://sheetbase.github.io/server/classes/lib.html"><p>Lib</p>
</a></h2>

**The `Lib` class.**

<h3><a name="lib-properties"><p>Lib properties</p>
</a></h3>

| Name                                                                                       | Type                                                                                                                           | Description |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| [apiKeyMiddleware](https://sheetbase.github.io/server/classes/lib.html#apikeymiddleware)   | <code><a href="https://sheetbase.github.io/server/classes/apikeymiddleware.html" target="_blank">APIKeyMiddleware</a></code>   |             |
| [apiKeyService](https://sheetbase.github.io/server/classes/lib.html#apikeyservice)         | <code><a href="https://sheetbase.github.io/server/classes/apikeyservice.html" target="_blank">APIKeyService</a></code>         |             |
| [httpService](https://sheetbase.github.io/server/classes/lib.html#httpservice)             | <code><a href="https://sheetbase.github.io/server/classes/httpservice.html" target="_blank">HttpService</a></code>             |             |
| [loggingRoute](https://sheetbase.github.io/server/classes/lib.html#loggingroute)           | <code><a href="https://sheetbase.github.io/server/classes/loggingroute.html" target="_blank">LoggingRoute</a></code>           |             |
| [monitoringService](https://sheetbase.github.io/server/classes/lib.html#monitoringservice) | <code><a href="https://sheetbase.github.io/server/classes/monitoringservice.html" target="_blank">MonitoringService</a></code> |             |
| [optionService](https://sheetbase.github.io/server/classes/lib.html#optionservice)         | <code><a href="https://sheetbase.github.io/server/classes/optionservice.html" target="_blank">OptionService</a></code>         |             |
| [responseService](https://sheetbase.github.io/server/classes/lib.html#responseservice)     | <code><a href="https://sheetbase.github.io/server/classes/responseservice.html" target="_blank">ResponseService</a></code>     |             |
| [routerService](https://sheetbase.github.io/server/classes/lib.html#routerservice)         | <code><a href="https://sheetbase.github.io/server/classes/routerservice.html" target="_blank">RouterService</a></code>         |             |
| [serverService](https://sheetbase.github.io/server/classes/lib.html#serverservice)         | <code><a href="https://sheetbase.github.io/server/classes/serverservice.html" target="_blank">ServerService</a></code>         |             |
| [systemRoute](https://sheetbase.github.io/server/classes/lib.html#systemroute)             | <code><a href="https://sheetbase.github.io/server/classes/systemroute.html" target="_blank">SystemRoute</a></code>             |             |

<h3><a name="lib-methods"><p>Lib methods</p>
</a></h3>

| Function                                                | Returns type                                                                                                           | Description              |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| [registerRoutes(routeEnabling?)](#lib-registerroutes-0) | <code><a href="https://sheetbase.github.io/server/classes/routerservice.html" target="_blank">RouterService</a></code> | Expose the module routes |

<h4><a name="lib-registerroutes-0" href="https://sheetbase.github.io/server/classes/lib.html#registerroutes"><p><code>registerRoutes(routeEnabling?)</code></p>
</a></h4>

**Expose the module routes**

**Parameters**

| Param         | Type                                                                                                                                | Description |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| routeEnabling | <code>true \| <a href="https://sheetbase.github.io/server/interfaces/disabledroutes.html" target="_blank">DisabledRoutes</a></code> |             |

**Returns**

<code><a href="https://sheetbase.github.io/server/classes/routerservice.html" target="_blank">RouterService</a></code>

---

</section>

<section id="routing" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="routing"><p>Routing</p>
</a></h2>

**ServerModule** provides REST API endpoints allowing clients to access server resources. Theses enpoints are not exposed by default, to expose the endpoints:

```ts
ServerModule.registerRoutes(routeEnabling?);
```

<h3><a name="routing-routes"><p>Routes</p>
</a></h3>

<h4><a name="routing-routes-overview"><p>Routes overview</p>
</a></h4>

| Route                     | Method | Disabled | Description               |
| ------------------------- | ------ | -------- | ------------------------- |
| [/logging](#PUT__logging) | `PUT`  | `true`   | Set a server log          |
| [/system](#GET__system)   | `GET`  |          | Get the system infomation |

<h4><a name="routing-routes-detail"><p>Routes detail</p>
</a></h4>

<h5><a name="PUT__logging"><p><code>PUT</code> /logging</p>
</a></h5>

`DISABLED` Set a server log

**Request body**

| Name      | Type             | Description |
| --------- | ---------------- | ----------- |
| **level** | <a data-sref="LoggingLevel" href="https://sheetbase.github.io/server/globals.html#logginglevel"><code>LoggingLevel</code></a> |             |
| **value** | <a data-sref="LoggingValue" href="https://sheetbase.github.io/server/globals.html#loggingvalue"><code>LoggingValue</code></a> |             |

**Response**

`void`

---

<h5><a name="GET__system"><p><code>GET</code> /system</p>
</a></h5>

Get the system infomation

**Response**

`object`

---

</section>

<section id="license" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

## License

**@sheetbase/server** is released under the [MIT](https://github.com/sheetbase/server/blob/master/LICENSE) license.

</section>
