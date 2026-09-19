const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/audit-logs',
  method: 'GET',
  headers: {
    // We need to bypass auth for testing, or we just write a quick script to hit the DB with the same logic
  }
};
