const express = require('express');
const router = express.Router();
const borrowCont = require('../controllers/retCont');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', borrowCont.retBorrow);
router.delete('/', borrowCont.deleteBorrow);

module.exports = router;