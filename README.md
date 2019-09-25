# Sheetbase Module: @sheetbase/server

Build server app on Google Apps Script.

<!-- <block:header> -->

[![Build Status](https://travis-ci.com/sheetbase/server.svg?branch=master)](https://travis-ci.com/sheetbase/server) [![Coverage Status](https://coveralls.io/repos/github/sheetbase/server/badge.svg?branch=master)](https://coveralls.io/github/sheetbase/server?branch=master) [![NPM](https://img.shields.io/npm/v/@sheetbase/server.svg)](https://www.npmjs.com/package/@sheetbase/server) [![License][license_badge]][license_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </block:header> -->

<!-- <block:body> -->

## Getting started

Install: `npm install --save @sheetbase/server`

Usage:

```ts
import { sheetbase } from "@sheetbase/server";

const Sheetbase = sheetbase({
  /* configs */
});

Sheetbase.Router.get("/", (req, res) => {
  return res.send("Hello!");
});
```

<!-- </block:body> -->

## License

**@sheetbase/server** is released under the [MIT](https://github.com/sheetbase/server/blob/master/LICENSE) license.

<!-- <block:footer> -->

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/sheetbase/server/blob/master/LICENSE
[patreon_badge]: https://lamnhan.github.io/assets/images/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan
[paypal_donate_badge]: https://lamnhan.github.io/assets/images/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan
[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/sheetbase

<!-- </block:footer> -->
