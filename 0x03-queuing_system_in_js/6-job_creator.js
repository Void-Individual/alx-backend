import { createClient } from 'redis';
import { createQueue} from 'kue'

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

const queue = createQueue({
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});

// Function to create a job
function createJob(phoneNumber, message) {
  const jobData = {
    phoneNumber: phoneNumber,
    message: message
  };

  // Process jobs in the queue
  const job = queue.create('push_notification_code', jobData)
    .save((err) => {
      if (err) {
        console.log('Error creating job:', err);
      } else {
        console.log('Notification job created:', job.id)
      }
    });

  // Handle job events
  job.on('complete', () => {
    console.log('Notification job completed');
  });

  job.on('error', (err) => {
    console.log('Notification job failed');
    console.error('Error message:', err);
  });
}

// Example job creation
createJob('123-456-7890', 'Your notification message here');
