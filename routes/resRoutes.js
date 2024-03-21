const express = require('express');
const router = express.Router();
const resCont = require('../controllers/resCont');
const verifyToken = require('../middlewares/verifyToken');
const checkLoggedIn = require('../middlewares/checkLoggedIn');





//Resources operation by user
router.get('/show', verifyToken, checkLoggedIn ,resCont.showRes);
router.get('/search', verifyToken, checkLoggedIn, resCont.searchMaterialByName);

//Resources operation by Admin
router.post('/EnterResource', resCont.createRes );
router.get('/:ResourceID', resCont.getRes);
router.put('/',resCont.updateRes);
router.delete('/:id', resCont.deleteRes);
router.get('/', resCont.getAllRes);





module.exports = router;