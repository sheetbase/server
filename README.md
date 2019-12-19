<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

# @sheetbase/server

**Build server app on Google Apps Script.**

</section>

<section id="tocx" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

- [Installation](#installation)
- [Options](#options)
- [Main](#main)
  - [Main methods](#main-methods)
    - [`http()`](#main-http-0)
    - [`middleware()`](#main-middleware-0)
    - [`monitoring()`](#main-monitoring-0)
    - [`registerRoutes()`](#main-registerroutes-0)
    - [`router()`](#main-router-0)
    - [`server()`](#main-server-0)
- [Routing](#routing)
  - [Endpoint](#routing-endpoint)
  - [Disabled](#routing-disabled)
  - [Errors](#routing-errors)
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
const Server = server(/* options */);

// 3. start using
const getOptions = Server.getOptions();
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

<h3><a name="main-methods"><p>Main methods</p>
</a></h3>

| Function                                   | Returns type                                                                                                     | Description                 |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | --------------------------- |
| [http()](#main-http-0)                     | <code><a href="https://sheetbase.github.io/server/classes/http.html" target="_blank">Http</a></code>             | Get the Http instance       |
| [middleware()](#main-middleware-0)         | <code><a href="https://sheetbase.github.io/server/classes/middleware.html" target="_blank">Middleware</a></code> | Get the Middleware instance |
| [monitoring()](#main-monitoring-0)         | <code><a href="https://sheetbase.github.io/server/classes/monitoring.html" target="_blank">Monitoring</a></code> | Get the Monitoring instance |
| [registerRoutes()](#main-registerroutes-0) | <code>any</code>                                                                                                 | Expose the module routes    |
| [router()](#main-router-0)                 | <code><a href="https://sheetbase.github.io/server/classes/router.html" target="_blank">Router</a></code>         | Get the Router instance     |
| [server()](#main-server-0)                 | <code><a href="https://sheetbase.github.io/server/classes/server.html" target="_blank">Server</a></code>         | Get the Server instance     |

<h4><a name="main-http-0" href="https://sheetbase.github.io/server/classes/main.html#http"><p><code>http()</code></p>
</a></h4>

**Get the Http instance**

**Returns**

<code><a href="https://sheetbase.github.io/server/classes/http.html" target="_blank">Http</a></code>

---

<h4><a name="main-middleware-0" href="https://sheetbase.github.io/server/classes/main.html#middleware"><p><code>middleware()</code></p>
</a></h4>

**Get the Middleware instance**

**Returns**

<code><a href="https://sheetbase.github.io/server/classes/middleware.html" target="_blank">Middleware</a></code>

---

<h4><a name="main-monitoring-0" href="https://sheetbase.github.io/server/classes/main.html#monitoring"><p><code>monitoring()</code></p>
</a></h4>

**Get the Monitoring instance**

**Returns**

<code><a href="https://sheetbase.github.io/server/classes/monitoring.html" target="_blank">Monitoring</a></code>

---

<h4><a name="main-registerroutes-0" href="https://sheetbase.github.io/server/classes/main.html#registerroutes"><p><code>registerRoutes()</code></p>
</a></h4>

**Expose the module routes**

**Returns**

<code>any</code>

---

<h4><a name="main-router-0" href="https://sheetbase.github.io/server/classes/main.html#router"><p><code>router()</code></p>
</a></h4>

**Get the Router instance**

**Returns**

<code><a href="https://sheetbase.github.io/server/classes/router.html" target="_blank">Router</a></code>

---

<h4><a name="main-server-0" href="https://sheetbase.github.io/server/classes/main.html#server"><p><code>server()</code></p>
</a></h4>

**Get the Server instance**

**Returns**

<code><a href="https://sheetbase.github.io/server/classes/server.html" target="_blank">Server</a></code>

---

</section>

<section id="routing" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="routing"><p>Routing</p>
</a></h2>

**Server** module provides REST API endpoints allowing clients to access server resources. Theses enpoints are not public by default, to expose the endpoints:

```ts
Server.registerRoutes(/* routing options */);
```

See detail addon routes options at [AddonRoutesOptions](https://sheetbase.github.io/server/interfaces/addonroutesoptions.html).

<h3><a name="routing-endpoint"><p>Endpoint</p>
</a></h3>

The default endpoint: **`xxx`**. The endpoint can be changed by passing `endpoint` property when [`registerRoutes`](#routing).

<h3><a name="routing-disabled"><p>Disabled</p>
</a></h3>

These routes are disabled by default but can be changed by passing `disabledRoutes` property when [`registerRoutes`](#routing):

| Enpoint  | Methods       |
| -------- | ------------- |
| /logging | `POST`, `PUT` |
| /system  | `*`           |

<h3><a name="routing-errors"><p>Errors</p>
</a></h3>

**Server** module returns these routing errors, you may use the error code to customize the message:

- `code1`: Message 1
- `code2`: Message 2

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
