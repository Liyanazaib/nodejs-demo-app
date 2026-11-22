const assert = require('assert');
const { getMessage } = require('./app');

assert.strictEqual(getMessage(), 'welcome to DevOps CI/CD Pipeline!');
console.log('All tests passed!');