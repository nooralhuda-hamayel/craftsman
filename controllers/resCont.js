const bcrypt = require('bcrypt');
const connection = require('../database/connection');

exports.createRes = (req, res) => {
    const { MaterialID, MaterialName, Price, Quantity, Available } = req.body;

    // Check if the MaterialID already exists
    const checkSql = 'SELECT * FROM material WHERE MaterialID = ?';
    connection.query(checkSql, [MaterialID], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking material existence in the database:', checkErr);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        
        if (checkResult.length > 0) {
            // MaterialID already exists
            res.status(400).json({ error: 'Resource with this Material Code already exists' });
            return;
        }

        // Proceed with inserting the new resource
        const insertSql = 'INSERT INTO material (MaterialID, MaterialName, Price, Quantity, Available) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertSql, [MaterialID, MaterialName, Price, Quantity, Available], (insertErr, result) => {
            if (insertErr) {
                console.error('Error inserting material resources into database:', insertErr);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.status(200).json({ message: 'Resource created successfully' });
        });
    });
};

exports.getRes = (req, res) => {
    const resID = req.params.ResourceID;

    const sql = 'SELECT * FROM material WHERE MaterialID = ?';
    connection.query(sql, [resID], (err, result) => {
        if (err) {
            console.error('Error retrieving resource from database:', err);
            res.status(500).json({error: 'Internal server error'});
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: ' Resource not found'});
            return;
        }
        res.status(200).json(result[0]);
    });
};

exports.updateRes = (req, res) => {
    const { resourceId, MaterialName, Price, Quantity, Available } = req.body;
    const sql = 'SELECT * FROM material WHERE MaterialID = ?';

    connection.query(sql, [resourceId], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking material existence in the database:', checkErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (checkResult.length === 0) {
            res.status(404).json({ error: 'Resource not found' });
            return;
        }

        const updateSql = 'UPDATE material SET MaterialName = ?, Price = ?, Quantity = ?, Available = ? WHERE MaterialID = ?';
        connection.query(updateSql, [MaterialName, Price, Quantity, Available, resourceId], (updateErr, result) => {
            if (updateErr) {
                console.error('Error updating material resource in database:', updateErr);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.status(200).json({ message: 'Resource updated successfully' });
        });
    });
};

exports.deleteRes = (req, res) => {
    const resourceId = req.params.id; // Assuming the resource ID is provided in the URL params

    // Check if the resource exists based on the provided ID
    const checkSql = 'SELECT * FROM material WHERE MaterialID = ?';
    connection.query(checkSql, [resourceId], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking material existence in the database:', checkErr);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
          //console.log(resourceId);
        if (checkResult.length === 0) {
            // Resource with the provided ID does not exist
            res.status(404).json({ error: 'Resource not found' });
            return;
        }

        // Proceed with deleting the resource
        const deleteSql = 'DELETE FROM material WHERE MaterialID = ?';
        connection.query(deleteSql, [resourceId], (deleteErr, result) => {
            if (deleteErr) {
                console.error('Error deleting material resource from database:', deleteErr);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.status(200).json({ message: 'Resource deleted successfully' });
        });
    });
};

exports.getAllRes = (req, res) => {

    // Query to select all resources from the database
    const sql = 'SELECT * FROM material';

    // Execute the query
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving resources from the database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // If no resources are found, return a 404 error
        if (results.length === 0) {
            res.status(404).json({ error: 'No resources found' });
            return;
        }

        // Return the retrieved resources
        res.status(200).json(results);
    });
};
