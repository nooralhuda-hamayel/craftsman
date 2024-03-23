// cronJobs.js

// const connection = require('../database/connection');

// const updateExpiredBorrows = () => {
//   const sql = `
//     UPDATE Borrow
//     SET expired = 'yes'
//     WHERE endDate < CURDATE() AND expired = 'no';
//   `;

//   connection.query(sql, (error, results) => {
//     if (error) {
//       return console.error('Error updating expired borrows:', error);
//     }
//     console.log(`Borrows updated as expired: ${results.affectedRows}`);
//   });
// };

// module.exports = {
//   updateExpiredBorrows
// };


// cronJobs.js

const connection = require('../database/connection');

const updateExpiredBorrows = () => {
  return new Promise((resolve, reject) => {
    const updateSql = `
      UPDATE borrow
      SET expired = 'yes'
      WHERE endDate < CURDATE() AND expired = 'no';
    `;

    connection.query(updateSql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        const selectUpdatedSql = `
          SELECT borrow_id FROM borrow
          WHERE endDate < CURDATE() AND expired = 'yes' AND notified = 0;
        `;
        connection.query(selectUpdatedSql, (selectError, borrows) => {
          if (selectError) {
            reject(selectError);
          } else {
            resolve(borrows.map(borrow => borrow.borrow_id));
          }
        });
      }
    });
  });
};

module.exports = {
  updateExpiredBorrows
};

