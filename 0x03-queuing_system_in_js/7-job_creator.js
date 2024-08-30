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

const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account'
  }
];

for (let x = 0; x < jobs.length; x += 1) {
  // Process jobs in the queue
  const job = queue.create('push_notification_code_2', jobs[x])
  .save((err) => {
    if (err) {
      console.log('Error creating job:', err);
    } else {
      console.log('Notification job created:', job.id)
    }
  });

  // Handle job events
  job.on('complete', () => {
  console.log(`Notification job ${job.id} completed`);
  });

  job.on('error', (err) => {
  console.log(`Notification job ${job.id} failed: ${err.message}`);
  });

  job.on('progress', (progress) => {
    console.log(`Notification job ${job.id} ${progress}% complete`);
  });
}
