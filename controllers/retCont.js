const bcrypt = require('bcrypt');
const connection = require('../database/connection');

exports.retBorrow = (req, res) => {
    const  borrowID  = req.body.borrow_id;
    console.log(borrowID);

    // Start a transaction
    connection.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ message: 'Error starting transaction', error: err });
        }

        // Check if the borrow record exists and its status
        const checkBorrowSQL = 'SELECT MaterialID, expired, returned FROM Borrow WHERE borrow_id = ?';

        // Execute the check query
        connection.query(checkBorrowSQL, [borrowID], (checkError, checkResults) => {
            if (checkError) {
                connection.rollback(() => {
                    res.status(500).json({ message: 'Error checking borrow record', error: checkError });
                });
                return;
            }

            // If the borrow record does not exist
            if (checkResults.length === 0) {
                connection.rollback(() => {
                    res.status(404).json({ message: 'Borrow ID does not exist.' });
                });
                return;
            }

            const { MaterialID, expired, returned } = checkResults[0];

            // If the borrow record is not expired
            if (expired === 'no') {
                connection.rollback(() => {
                    res.status(400).json({ message: 'Process can\'t be done, borrow is not expired.' });
                });
                return;
            }

            // If the item has already been returned
            if (returned === 'yes') {
                connection.rollback(() => {
                    res.status(400).json({ message: 'Process can\'t be done, item is already returned.' });
                });
                return;
            }

            // If the item is expired and not returned, proceed with updating the quantity
            const updateMaterialSQL = `
                UPDATE Material 
                SET Quantity = Quantity + 1
                WHERE MaterialID = ?;
            `;

            // Execute the update query for the Material table
            connection.query(updateMaterialSQL, [MaterialID], (materialError) => {
                if (materialError) {
                    connection.rollback(() => {
                        res.status(500).json({ message: 'Error updating Material record', error: materialError });
                    });
                    return;
                }

                // Update the Available status if necessary
                const updateAvailableSQL = `
                    UPDATE Material 
                    SET Available = CASE 
                        WHEN Quantity > 0 THEN 'yes' 
                        ELSE Available 
                    END 
                    WHERE MaterialID = ?;
                `;

                connection.query(updateAvailableSQL, [MaterialID], (availableError) => {
                    if (availableError) {
                        connection.rollback(() => {
                            res.status(500).json({ message: 'Error updating Material availability', error: availableError });
                        });
                        return;
                    }

                    // Update the Borrow record to mark the item as returned
                    const updateBorrowSQL = `
                        UPDATE Borrow 
                        SET returned = 'yes' 
                        WHERE borrow_id = ?;
                    `;

                    connection.query(updateBorrowSQL, [borrowID], (borrowError) => {
                        if (borrowError) {
                            connection.rollback(() => {
                                res.status(500).json({ message: 'Error marking the Borrow record as returned', error: borrowError });
                            });
                            return;
                        }

                        // Commit the transaction
                        connection.commit(commitError => {
                            if (commitError) {
                                connection.rollback(() => {
                                    res.status(500).json({ message: 'Error committing transaction', error: commitError });
                                });
                                return;
                            }
                            res.status(200).json({ message: 'Item successfully returned and inventory updated.' });
                        });
                    });
                });
            });
        });
    });
};

exports.deleteBorrow = (req, res) => {
    const borrowID = req.body.borrow_id;

    // Start a transaction
    connection.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ message: 'Error starting transaction', error: err });
        }

        // Check if the borrow record is expired and returned
        const checkBorrowSQL = 'SELECT expired, returned FROM Borrow WHERE borrow_id = ?';

        // Execute the check query
        connection.query(checkBorrowSQL, [borrowID], (checkError, checkResults) => {
            if (checkError) {
                connection.rollback(() => {
                    return res.status(500).json({ message: 'Error checking borrow record', error: checkError });
                });
            } else if (checkResults.length === 0) {
                connection.rollback(() => {
                    return res.status(404).json({ message: 'Borrow ID does not exist.' });
                });
            } else {
                const { expired, returned } = checkResults[0];

                // Proceed with delete only if the record is expired and returned
                if (expired === 'yes' && returned === 'yes') {
                    const deleteBorrowSQL = 'DELETE FROM Borrow WHERE borrow_id = ?';

                    // Execute the delete query
                    connection.query(deleteBorrowSQL, [borrowID], (deleteError) => {
                        if (deleteError) {
                            connection.rollback(() => {
                                return res.status(500).json({ message: 'Error deleting borrow record', error: deleteError });
                            });
                        } else {
                            // Commit the transaction
                            connection.commit(commitError => {
                                if (commitError) {
                                    connection.rollback(() => {
                                        return res.status(500).json({ message: 'Error committing transaction', error: commitError });
                                    });
                                } else {
                                    return res.status(200).json({ message: 'Borrow record successfully deleted.' });
                                }
                            });
                        }
                    });
                } else {
                    connection.rollback(() => {
                        return res.status(400).json({ message: 'Cannot delete borrow record. It must be expired and returned.' });
                    });
                }
            }
        });
    });
};








