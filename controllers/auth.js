const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../database/connection');

exports.signup = (req, res) => {
  const { Username, Email, Password, FullName, Bio, Locations, Birthdate, Gender, Phone, SocialLinks } = req.body;

  // Hash the password
  bcrypt.hash(Password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Stringify socialLinks
    const socialLinksStr = JSON.stringify(SocialLinks);

    // Insert user data into the database
    const sql = 'INSERT INTO user (Username, Email, Password, FullName, Bio, Locations, Birthdate, Gender, Phone, SocialLinks) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [Username, Email, hash, FullName, Bio, Locations, Birthdate, Gender, Phone, SocialLinks], (err, result) => {
      if (err) {
        console.error('Error inserting user into database:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(200).json({ message: 'User registered successfully' });
    });
  });
};

exports.login = (req, res) => {
  const { Username, Password } = req.body;
  const sql = 'SELECT * FROM user WHERE Username = ?';

  connection.query(sql, [Username], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];

    bcrypt.compare(Password, user.Password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Ensure JWT_SECRET is loaded
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined.');
        return res.status(500).json({ message: 'Internal server error' });
      }

      // User authenticated, create a JWT token
      const token = jwt.sign({ id: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    });
  });
};

exports.getUserProfile = (req, res) => {
  // The JWT token should have included 'id' in its payload, and
  // the verifyToken middleware should have decoded this and set it on req.user.
  // Make sure your verifyToken middleware is attached to the route that uses this controller method.
  const userId = req.user.id; // Ensure this matches the payload property name in the token.

  connection.query(
    'SELECT UserID, Username, Email, FullName, Bio, Locations, Birthdate, Gender, Phone, SocialLinks FROM user WHERE UserID = ?', [userId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Assuming the database fields are named as above and the password field is named 'Password'.
      // The password should not have been selected in the first place if it's not needed.
      const userProfile = results[0];
      return res.status(200).json({ userProfile });
    }
  );
};