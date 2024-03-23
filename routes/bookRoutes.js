const express = require('express');
const router = express.Router();
const bookCont = require('../controllers/bookCont');
const verifyToken = require('../middlewares/verifyToken');
const checkLoggedIn = require('../middlewares/checkLoggedIn');


router.post('/',verifyToken,bookCont.bookRes );
router.delete('/:bookID',verifyToken,bookCont.deleteBooking );
router.get('/',verifyToken,bookCont.showAllBookings );


module.exports = router;