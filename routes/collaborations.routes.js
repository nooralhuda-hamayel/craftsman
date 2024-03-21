const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const checkLoggedIn = require('../middlewares/checkLoggedIn');
const collaborationsController = require('../controllers/collaborations.controller');

router.post('/', verifyToken, checkLoggedIn, collaborationsController.createCollaboration)
router.get('/', verifyToken, checkLoggedIn, collaborationsController.getLoggedInUserCollaborations)
router.get('/:id', verifyToken, checkLoggedIn, collaborationsController.getLoggedInUserCollaborationById)

module.exports = router;