const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cron = require('node-cron');

require('dotenv').config();
//console.log(process.env.JWT_SECRET);

const cronJobs = require('./schedulers/cronJobs');

const { notifyUsersOfExpiredBorrows } = require('./schedulers/emailNotificationService');

const app = express();

const userRouter = require('./routes/userRoutes');
const resRouter = require('./routes/resRoutes');
const bookRouter= require('./routes/bookRoutes');
const borrowRouter = require('./routes/borrowRoutes');
const retRouter = require('./routes/retRoutes');

const PORT = process.env.PORT || 3000;

app.use(express.json());


// all Routes here
app.use('/api/users', userRouter);
app.use('/api/resources', resRouter);
app.use('/api/bookingRes', bookRouter);
app.use('/api/borrowRes',borrowRouter );
app.use('/api/retBor',retRouter );


app.listen(PORT, () => {
    console.log(`App running on port ${PORT} .....`);


  //cron.schedule('0 0 * * *', cronJobs.updateExpiredBorrows);
  cron.schedule('0 0 * * *', async () => {
    try {
      const updatedBorrowIds = await cronJobs.updateExpiredBorrows();
      if (updatedBorrowIds.length > 0) {
        notifyUsersOfExpiredBorrows(updatedBorrowIds);
      }
    } catch (error) {
      console.error('Error in scheduled job:', error);
    }
  });

   
});

//testing if updateExpiredBorrows works proberly
//cronJobs.updateExpiredBorrows();

cronJobs.updateExpiredBorrows().then(notifyUsersOfExpiredBorrows);


// process.on('SIGINT', () => {
//     // Close database connections, file streams, etc.
//     database.close();
//     server.close(() => {
//       console.log('HTTP server closed.');
//       process.exit(0);
//     });
//   });