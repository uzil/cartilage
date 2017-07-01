## Cartilage

[![Build Status](https://travis-ci.org/uzil/cartilage.svg?branch=master)](https://travis-ci.org/uzil/cartilage)
[![Coverage Status](https://coveralls.io/repos/github/uzil/cartilage/badge.svg?branch=master)](https://coveralls.io/github/uzil/cartilage?branch=master)

`cartilage` is a Express Middleware for validation of incoming requests. It is a wrapper around [joi](https://github.com/hapijs/joi) validation library, and allows you to ensure all your inputs are valid, before passing it down to actual controller function.

`cartilage` allows you to validate `req.headers`, `req.params`, `req.query` and `req.body` (given are using `body-parser`). But is not limited to those four only, it can validtate any object in `req` object of express (for example `req.token`).

`Why cartilage?` It not only validates, but it validate efficiently. Every validation is async and runs in parallel to each other. Also it applies all the changes made by `joi` back to the specified `express` incomming request object.

`cartilage` uses npm `peerDependencies` to manage the version of `joi` it will use. This peer dependency is not automatically installed using `npm install` since npm@3, so you must install a version of `joi` compatible (10.x.x) along with `cartilage`, for it to work correctly.

## Usage

Example of validating `req.body` using `cartilage`.
```js
const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const cartilage = require('cartilage');

const app = express();
app.use(bodyParser.json());

const signupSchema = {
  body: {
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().default('normal')
  }
};

app.post('/register', cartilage(registerSchema), (req, res, next) => {
  // your logic here
  // at this point your req.body is validated and contains
  // desired values
});
```

Example of validating `req.headers`, `req.body` and `req.params` all at a time.

```js
const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const cartilage = require('cartilage');

const app = express();
app.use(bodyParser.json());

const blogCreateSchema = {
  headers: {
    token: Joi.string().required(),
  },
  params: {
    id: Joi.string().uuid().required(),
  },
  body: {
    title: Joi.string(),
    description: Joi.string(),
    content: Joi.string()
  }
};

app.put('/blogs/:id', cartilage(blogUpdateSchema), (req, res, next) => {
  // your logic here
  // at this point your req.body is validated and contains
  // desired values
});
```

Similarly you can validate all `req.headers`, `req.params`, `req.query` and `req.headers` at a time by specifing in schema.

## API

### `cartilage(schema, [options])`

Returns a middleware function `(req, res, next)`

- `schema` is object where the key can be any of the `req` object's key (`params`, `headers`, `query`, `body`). Only the specified keys are validated against `req` object. And these keys must be a valid `joi` schema.

- `[options]` is the `joi` validate [options](https://github.com/hapijs/joi/blob/master/API.md#validatevalue-schema-options-callback), it is directly passed to validate function.

`Note:` For key `headers` in object `schema`, joi option `allowUnknown` is always set to `true`.