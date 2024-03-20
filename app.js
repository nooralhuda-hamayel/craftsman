const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
require('dotenv').config();
console.log(process.env.JWT_SECRET);
const app = express();


const userRouter = require('./routes/userRoutes');
const resRouter = require('./routes/resRoutes');

const PORT = process.env.PORT || 3000;

app.use(express.json());

// all Routes here
app.use('/api/users', userRouter);
app.use('/api/resources', resRouter);





app.listen(PORT, () => {
    console.log(`App running on port ${PORT} .....`);
});

// process.on('SIGINT', () => {
//     // Close database connections, file streams, etc.
//     database.close();
//     server.close(() => {
//       console.log('HTTP server closed.');
//       process.exit(0);
//     });
//   });