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

client.on('error', (err) => {
  console.log('There was an error:', err.message);
});

// Explicitly attempt to connect
client.connect().then(() => {
  const channel_name = 'holberton school channel';

  client.subscribe(channel_name, (message) => {
    console.log(message);

    if (message == 'KILL_SERVER') {
      console.log('Unsubscribing and closing...')

      client.unsubscribe(channel_name, (err) => {
        if (err) {
          console.error('Error unsubscribing from channel:', err.message);
        } else {
          console.log('Unsubscribed from channel');

          client.quit().then(() => {
            console.log('Closed connection')
          }).catch((err) => {
            console.log('Error closing connection:', err);
          });
        }
      });
    }
  });
}).catch((err) => {
  console.log('Error with connection:', err);
});
