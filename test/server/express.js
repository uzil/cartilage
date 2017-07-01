'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const Joi = require('joi');
const cartilage = require('../../index');

app.use(bodyParser.json());

// every key in this schema is optional
// you can pass only what you need
const schema = {
  headers: {
    'x-access-code': Joi.string().required(),
    'x-tag': Joi.string().default('no_tag') 
  },
  body: {
    name: Joi.string(),
    username: Joi.string().required(),
    role: Joi.string().default('normal')
  },
  params: {
    id: Joi.number().required()
  },
  query: {
    q: Joi.string()
  },
  /**
   * this is a invalid key as it is not
   * present in req object of express
   * so it will be silently ignored
   */
  someInvalidKey: {
    name: Joi.string().required()
  }
};

app.route('/cartilage-test/:id')
  .post(cartilage(schema), (req, res) => {
    res.json({
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query
    })
  });

app.use((error, req, res, next) => res.status(400).json(error));  

module.exports = app;