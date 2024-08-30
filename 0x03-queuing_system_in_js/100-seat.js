import express from 'express';
import { createClient, print } from 'redis';
import kue from 'kue';
import { promisify } from 'util';

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

let reservationEnabled = true;
const queue = kue.createQueue({
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});

async function reserveSeat(number) {
  try {
    const reply = await client.set('available_seats', number, print);
    console.log('Reply:', reply);
  } catch (err) {
    console.log('Error reserving seat:', err.message);
  }
}

async function getCurrentAvailableSeats() {
  try {
    const availableSeats = await client.get('available_seats');
    return parseInt(availableSeats, 10) || 0;
  } catch (err) {
    console.log('Error getting current seats:', err.message);
    return 0;
  }
}

// Set initial number of available seats
client.connect().then(async () => {
  await reserveSeat(50);
});

const app = express();
const port = 1245;

app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.send({ numberOfAvailableSeats });
});

app.get('/reserve_seat', async (req, res) => {
  const currentAvailableSeats = await getCurrentAvailableSeats();

  // Check if reservations are already blocked or if seats are zero
  if (!reservationEnabled || currentAvailableSeats <= 0) {
    res.send({ "status": "Reservations are blocked" });
    return;
  }

  const job = queue.create('reserve_seat')
  .save((err) => {
    if (err) {
      console.log('Error with saving:', err.message);
      res.send({ "status": "Reservation failed" });
    } else {
      console.log('Saved Job reservation');
      res.send({ "status": "Reservation in process" });
    }
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
  });
});

app.get('/process', async (req, res) => {
  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats('available_seats');
    //console.log(typeof(availableSeats))
    if (availableSeats > 0) {
      await reserveSeat(availableSeats - 1);

      if (availableSeats - 1 === 0) {
        reservationEnabled = false;
      }
      done();
    } else {
      done(new Error('Not enough seats available'));
    }
  });

  res.send({ "status": "Queue processing" })
});

app.listen(port, async () => {
  console.log(`Server runing at localhost:${port}`);
})
