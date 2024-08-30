import { createClient, print } from 'redis';

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
  console.log('There was an error:', err.message)
});

// Explicitly attempt to connect
client.connect().catch((err) => {
  console.error('Redis client not connected to the server:', err);
});


function setNewSchool(schoolName, value) {
  //await client.connect();
  client.SET(schoolName, value, print);
  // Using print logs OK
}

function displaySchoolValue(schoolName) {
  client.GET(schoolName, (err, value) => {
    if (err) {
      console.log('Error getting redis value:', err);
      return;
    } else {
      console.log(`${value}`);
    }
  });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');

