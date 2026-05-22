const http = require('http');
const data = JSON.stringify({
  name: 'Test User',
  email: 'testuser@example.com',
  phone: '+1234567890',
  trackingRef: 'KCS00346789-CARGO',
  message: 'This is a test inquiry from the website.'
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/contact',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  console.log('status:', res.statusCode);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('body:', body);
  });
});

req.on('error', err => {
  console.error('error:', err.message);
});
req.write(data);
req.end();
