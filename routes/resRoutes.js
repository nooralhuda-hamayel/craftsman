const express = require('express');
const router = express.Router();
const resCont = require('../controllers/resCont');


router.post('/EnterResource', resCont.createRes );
router.get('/:ResourceID', resCont.getRes);
router.put('/',resCont.updateRes);
router.delete('/:id', resCont.deleteRes);
router.get('/', resCont.getAllRes);
module.exports = router;