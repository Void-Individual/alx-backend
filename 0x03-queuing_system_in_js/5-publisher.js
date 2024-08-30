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
});

client.on('error', (err) => {
  console.log('There was an error:', err.message);
});

// Explicitly attempt to connect
client.connect().catch((err) => {
  console.error('Redis client not connected to the server:', err.message);
});

function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);

    const channel_name = 'holberton school channel'
    client.publish(channel_name, message, (err, reply) => {
      if (err) {
        console.log('Error with publishing:', err);
      } else {
        console.log('Message:', reply)
      }
    });
  }, time);

}

//publishMessage("Holberton Student #1 starts course", 100);
//publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);
