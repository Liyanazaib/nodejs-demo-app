const assert = require('assert');
const { getMessage } = require('./app');

assert.strictEqual(getMessage(), 'Hello from DevOps CI/CD Pipeline!');
console.log('All tests passed!');