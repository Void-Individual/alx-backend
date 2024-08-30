import { createClient, print, hset } from 'redis';

const key = 'HolbertonSchools';

const client = createClient({
  url: 'redis://127.0.0.1:6379',
  socket: {
    connectTimeout: 5000 // Set a timeout to prevent long waits
}
});

client.on('connect', () => {
  console.log('Redis client connected to the server');

  const data = {
    'Portland': 50,
    'Seattle': 80,
    'New York': 20,
    'Bogota': 20,
    'Cali': 40,
    'Paris': 2
  };

  // Ensure operations run only after connection is established
  hashFields(key, data, () => {
  getAll(key);
  });
});

client.on('error', (err) => {
  console.log('There was an error:', err.message);
});

// Explicitly attempt to connect
client.connect().catch((err) => {
  console.error('Redis client not connected to the server:', err.message);
});

function hashFields(key, details) {
  client.hSet(key, details, (err, reply) => {
    if (err) {
      console.log('Error setting hash fields:', err.message);
    } else {
      console.log('Hash fields set: ', reply);
      if (callback) callback();  // Call the callback only after setting the fields
    }
  });
}

function getAll(key) {
  client.hGetAll(key, (err, reply) => {
    if (err) {
      console.log('Error getting hash fields:', err.message);
    } else {
      console.log(reply);
    }
  });
}
