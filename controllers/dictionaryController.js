var mongoose = require('mongoose');

const mindsetphotodefs = mongoose.model('mindsetphotodefs');

exports.getDictionaryLetter = (req, res) => {
  var leadpost = {};
  leadpost.posttopic = 'PHOTOGRAPHY DICTIONARY - ' + req.params.letter.toUpperCase();
  mindsetphotodefs.find({lettercategory: req.params.letter}).sort({term: 1}).exec()
  .then(letterlisting => {
    if (letterlisting.length == 0) {
      letterlisting[0] = {
        term : "",
        termquick : "no-entry",
        definition : "No entries currently for this letter",
        synonyms : [],
        relatedterms : [{
          relatedterm : "",
          relatedquick : ""
        }]
      };
      console.log(letterlisting);
    }
    res.render('dictionaryalphalist', {title: 'Dictionary Admin Letter - ' + leadpost.posttopic, letterlisting, leadpost});
  })
  .catch(err => {
    next(err);
  });
}
