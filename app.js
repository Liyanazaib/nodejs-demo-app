const http = require('http');

function getMessage() {
  return 'welcome to DevOps CI/CD Pipeline!';
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(getMessage());
});

const PORT = process.env.PORT || 3000;

// Only start the server when run directly (not when imported by test.js)
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { getMessage };