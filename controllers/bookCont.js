const bcrypt = require('bcrypt');
const connection = require('../database/connection');

//book or buy resource -material by user-
exports.bookRes = (req, res) => {
    console.log('Received request body for bookRes:', req.body);

    if (!req.body.MaterialID) {
        console.error('MaterialID not provided in the request body');
        return res.status(400).json({ message: 'MaterialID is required.' });
    }

    const materialId = parseInt(req.body.MaterialID, 10);
    if (isNaN(materialId)) {
        console.error('MaterialID is not a valid number');
        return res.status(400).json({ message: 'MaterialID must be a valid number.' });
    }

    const userId = req.user.id;
    console.log(`Booking resource: User ID ${userId} is booking MaterialID ${materialId}`);

    // Start a database transaction
    connection.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction', err);
            return res.status(500).json({ message: 'Error starting transaction', error: err });
        }

        // Step 1: Check the current quantity and availability of the material
        const checkMaterialSql = 'SELECT Quantity, Available FROM material WHERE MaterialID = ?';
        connection.query(checkMaterialSql, [materialId], (err, results) => {
            if (err) {
                console.error('Error checking material', err);
                return connection.rollback(() => {
                    res.status(500).json({ message: 'Error checking material', error: err });
                });
            }

            if (results.length === 0 || results[0].Quantity <= 0 || results[0].Available.toLowerCase() !== 'yes') {
                console.log('Material is not available or does not exist', results);
                return connection.rollback(() => {
                    res.status(400).json({ message: 'Material is not available for booking or does not exist.' });
                });
            }

            // Step 2: Update the material's quantity and availability
            let newQuantity = results[0].Quantity - 1;
            let newAvailable = newQuantity > 0 ? 'yes' : 'no';

            const updateMaterialSql = 'UPDATE material SET Quantity = ?, Available = ? WHERE MaterialID = ?';
            connection.query(updateMaterialSql, [newQuantity, newAvailable, materialId], (err, updateResult) => {
                if (err) {
                    console.error('Error updating material', err);
                    return connection.rollback(() => {
                        res.status(500).json({ message: 'Error updating material', error: err });
                    });
                }

                // Step 3: Insert the booking record
                const insertBookingSql = 'INSERT INTO user_res_book (UserID, MaterialID, booking_date) VALUES (?, ?, NOW())';
                connection.query(insertBookingSql, [userId, materialId], (err, insertResult) => {
                    if (err) {
                        console.error('Error recording the booking', err);
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Error recording the booking', error: err });
                        });
                    }

                    // Commit the transaction
                    connection.commit(err => {
                        if (err) {
                            console.error('Error during transaction commit', err);
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Error during transaction commit', error: err });
                            });
                        }

                        console.log('Booking successful', `Booking ID: ${insertResult.insertId}`);
                        res.status(200).json({ message: 'Booking successful', bookingId: insertResult.insertId });
                    });
                });
            });
        });
    });
};


exports.deleteBooking = (req, res) => {
    console.log('Received params for deletion:', req.params);

    // Extract the bookID from the route parameters
    const bookID = parseInt(req.params.bookID, 10);

    // Check if bookID is a valid number
    if (isNaN(bookID)) {
        console.error('Invalid bookID:', req.params.bookID);
        return res.status(400).json({ message: 'Invalid booking ID provided.' });
    }

    const userID = req.user.id; // User ID from the verified token

    // SQL query to delete the booking only if it belongs to the user
    const deleteSql = 'DELETE FROM user_res_book WHERE booking_id = ? AND UserID = ?';

    connection.query(deleteSql, [bookID, userID], (err, result) => {
        if (err) {
            console.error('Error deleting booking:', err);
            return res.status(500).json({ message: 'Error deleting booking', error: err });
        }

        // Check if the booking was actually deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found or user does not have permission to delete this booking.' });
        }

        res.status(200).json({ message: 'Booking successfully deleted' });
    });
};

//showAllBookings

exports.showAllBookings = (req, res) => {
    // SQL query to select all bookings
    const sql = 'SELECT * FROM user_res_book';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving bookings:', err);
            return res.status(500).json({ message: 'Error retrieving bookings', error: err });
        }

        // If no bookings are found, return an appropriate message
        if (results.length === 0) {
            return res.status(404).json({ message: 'No bookings found' });
        }

        // Return all bookings
        res.status(200).json(results);
    });
};


