'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'otp') {
      await transporter.sendMail({
        from: process.env.SMTP_USER || '"Threadbase" <noreply@threadbase.dev>',
        to: job.data.to,
        subject: 'Your verification code',
        text: `Your OTP is ${job.data.otp}`,
      });
    }
  },
  {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} (${job.name}) completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`);
});

worker.on('error', (err) => {
  console.error('Worker error:', err.message);
});

module.exports = { worker };
