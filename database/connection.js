const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1', // e.g., 'localhost' or IP address
  user: 'root',
  password: '',
  database: 'comm_craft'
});

module.exports = connection;
