var express = require('express');
var router = express.Router();
const dictionaryController = require('../controllers/dictionaryController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Admin' });
});

router.get('/dictionary/:letter', dictionaryController.getDictionaryLetter);

router.post('/dictionary', dictionaryController.addPhotoTerm);

router.post('/dictionary/delete/:id', dictionaryController.deletePhotoTerm);

module.exports = router;
