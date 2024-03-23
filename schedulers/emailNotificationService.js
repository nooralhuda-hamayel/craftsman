// emailNotificationService.js
const nodemailer = require('nodemailer');
const connection = require('../database/connection'); // Ensure this path is correct to your database connection module

// Configure the transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your specific email service
    auth: {
      user: '',
      pass: ''
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

// This function sends an email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'dima.eid11@gmail.com', // Replace with your email
    to: to,
    subject: subject,
    text: text
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

// This function will check for expired borrows and send notifications
const notifyUsersOfExpiredBorrows = (updatedBorrowIds) => {
    if (updatedBorrowIds.length === 0) {
      console.log('No expired borrows to notify.');
      return;
    }
  
    const idsString = updatedBorrowIds.join(',');
    const sql = `
      SELECT b.borrow_id, b.UserID, b.MaterialID, b.endDate, u.Email 
      FROM borrow b
      JOIN user u ON b.UserID = u.UserID 
      WHERE b.borrow_id IN (${idsString})
    `;
  
    connection.query(sql, (error, results) => {
      if (error) {
        console.error('Error fetching expired borrows for notification:', error);
        return;
      }
  
      if (results.length === 0) {
        console.log('No results found for the expired borrows.');
        return;
      }
  
      results.forEach((result) => {
        const emailSubject = 'Borrowed Item Expiration Notice';
        const emailBody = `Dear User, the item with ID: ${result.MaterialID} you borrowed has now expired on ${result.endDate}. Please return it as soon as possible.`;
  
        sendEmail(result.Email, emailSubject, emailBody)
          .then((response) => {
            console.log(`Email sent to User ID: ${result.UserID}, Borrow ID: ${result.borrow_id}`);
  
            const updateNotifiedSql = `
              UPDATE borrow 
              SET notified = 1 
              WHERE borrow_id = ${result.borrow_id}
            `;
  
            connection.query(updateNotifiedSql, (updateError) => {
              if (updateError) {
                console.error('Error updating notified status:', updateError);
                return;
              }
              console.log(`Notified status updated for Borrow ID: ${result.borrow_id}`);
            });
          })
          .catch((sendError) => {
            console.error('Error sending email:', sendError);
          });
      });
    });
  };
  
  
  module.exports = {
    notifyUsersOfExpiredBorrows
  };