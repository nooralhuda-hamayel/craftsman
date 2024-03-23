const express = require('express');
const router = express.Router();
const borrowCont = require('../controllers/borrowCont');
const verifyToken = require('../middlewares/verifyToken');

router.post('/',verifyToken, borrowCont.createBorrow);

module.exports = router;