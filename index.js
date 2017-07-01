var joi = require('joi');
var Promise = require('bluebird');

function validate(method, candidate, schema, options) {
  return new Promise(function (resolve, reject) {
    if (method === 'headers') schema = joi.compile(schema).unknown();

    joi.validate(candidate, schema, options, function (error, value) {
      if (error) return reject(error);
      resolve({ method: method, value: value });
    });
  });
}

function validationMiddleware(schema, joiOptions) {
  return function (req, res, next) {
    var options = joiOptions || {};
    var operations = Object.keys(schema).reduce(function (acc, method) {
      if (req[method]) acc.push(validate(method, req[method], schema[method], options));
      return acc;
    }, []);

    Promise.all(operations)
      .then(function (results) {
        results.forEach(function (result) {
          req[result.method] = result.value;
        });

        next();
      })
      .catch(next);
  }
}

module.exports = validationMiddleware;