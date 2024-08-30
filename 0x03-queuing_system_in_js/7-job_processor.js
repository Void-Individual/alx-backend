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

const blackList = [ '4153518780', '4153518781' ];

function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100); // Initial progress
  if (blackList.includes(phoneNumber.toString())) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }
  job.progress(50, 100); // Increase progress

  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  done(); // Mark the job as completed
}

// Queue to process 2 jobs at a time
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;

  sendNotification(phoneNumber, message, job, done);

  done();
});
