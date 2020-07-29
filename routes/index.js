var express = require('express');
var router = express.Router();
const dictionaryController = require('../controllers/dictionaryController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Admin' });
});

router.get('/dictionary', function(req, res, next) {
  res.render('dictionarylanding', {title: 'DICTIONARY'});
});

router.get('/blog', function(req, res, next) {
  res.render('bloglanding', {title: 'BLOG'});
});

router.get('/dictionary/:letter', dictionaryController.getDictionaryLetter);

router.post('/dictionary/add', dictionaryController.addPhotoTerm);

router.get('/blog/create', (req, res) => {
  res.render('newblogform', {title: 'CREATE NEW BLOG POST'});
});

router.post('/blog/add', dictionaryController.addNewBlog);

router.post('/dictionary/delete/:id', dictionaryController.deletePhotoTerm);

router.post('/dictionary/edit/:id', dictionaryController.editPhotoTerm);

module.exports = router;
