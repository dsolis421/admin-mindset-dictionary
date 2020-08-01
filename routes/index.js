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

router.get('/blog', dictionaryController.getBlogListing);

router.get('/dictionary/:letter', dictionaryController.getDictionaryLetter);

router.get('/blog/preview/:blogquick', dictionaryController.getBlogPost);

router.get('/blog/create', (req, res) => {
  console.log('going to blog create');
  res.render('newblogform', {title: 'CREATE NEW BLOG POST'});
});

router.get('/blog/edit/:id', dictionaryController.getEditBlog);

router.post('/blog/add', dictionaryController.addNewBlog);

router.post('/blog/update/:id', dictionaryController.editBlogPost);

router.post('/blog/togglepost/:id', dictionaryController.toggleShowPost);

router.post('/blog/delete/:id', dictionaryController.addDeleteBlogPost);

router.post('/blog/search/', dictionaryController.postSearchBlog);

router.post('/dictionary/add', dictionaryController.addPhotoTerm);

router.post('/dictionary/delete/:id', dictionaryController.deletePhotoTerm);

router.post('/dictionary/edit/:id', dictionaryController.editPhotoTerm);

module.exports = router;
