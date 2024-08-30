import { createClient } from 'redis';

const client = createClient({
  url: 'redis://127.0.0.1:6379',
  socket: {
    connectTimeout: 5000 // Set a timeout to prevent long waits
}
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

//client.on('error', (err) => {
//  console.log('There was an error:', err)
//});

// Explicitly attempt to connect
client.connect().catch((err) => {
  console.error('Redis client not connected to the server:', err);
});
