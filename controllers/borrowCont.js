const bcrypt = require('bcrypt');
const connection = require('../database/connection');




exports.createBorrow = (req, res) => {
    const { MaterialID } = req.body;
    const UserID = req.user.id;  // Extracted by verifyToken middleware

    // Start a transaction
    connection.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ message: 'Error starting transaction', error: err });
        }

        // Check if the material exists and is available
        const queryMaterial = 'SELECT Price, Quantity, Available FROM Material WHERE MaterialID = ?';
        connection.query(queryMaterial, [MaterialID], (error, results, fields) => {
            if (error) {
                return connection.rollback(() => {
                    res.status(500).json({ message: 'Error querying the Material', error });
                });
            }
            if (results.length === 0 || results[0].Quantity <= 0 || results[0].Available !== 'yes') {
                return connection.rollback(() => {
                    res.status(404).json({ message: 'Material not found or not available' });
                });
            }
            
            const material = results[0];
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);
            const cost = material.Price * 0.01;

            // Insert into Borrow table
            const insertBorrow = 'INSERT INTO Borrow (UserID, MaterialID, startDate, endDate, cost, expired) VALUES (?, ?, ?, ?, ?, "no")';
            connection.query(insertBorrow, [UserID, MaterialID, startDate, endDate, cost], (error, results, fields) => {
                if (error) {
                    return connection.rollback(() => {
                        res.status(500).json({ message: 'Error creating the Borrow record', error });
                    });
                }

                // Update Material table
                const newQuantity = material.Quantity - 1;
                const updateMaterial = 'UPDATE Material SET Quantity = ?, Available = ? WHERE MaterialID = ?';
                const newAvailable = newQuantity > 0 ? 'yes' : 'no';
                connection.query(updateMaterial, [newQuantity, newAvailable, MaterialID], (error, results, fields) => {
                    if (error) {
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Error updating the Material record', error });
                        });
                    }
                    // Commit the transaction
                    connection.commit(err => {
                        if (err) {
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Error committing transaction', error: err });
                            });
                        }
                        res.status(201).json({ message: 'Borrow created successfully' });
                    });
                });
            });
        });
    });
};

