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
    }
    res.render('dictionaryalphalist', {title: 'Dictionary Admin Letter - ' + leadpost.posttopic, letterlisting, leadpost});
  })
  .catch(err => {
    next(err);
  });
}

exports.addPhotoTerm = async (req, res) => {
  var newdictionaryterm = {};
  var newrelatedterms = [];
  if (typeof req.body['relatedterms[]'] == "string") {
    console.log("Need to change relatedterms to ARRAY");
    req.body['relatedterms[]'] = [req.body['relatedterms[]']]
  }
  for(var x = 0; x < req.body['relatedterms[]'].length; x++) {
    await mindsetphotodefs.find({term: req.body['relatedterms[]'][x]}).exec()
    .then(term => {
      if(term[0]){
        console.log("Found term --> ", term[0].term)
        var addedrelatedterm = {};
        var addedrelatedletter = term[0].term.charAt(0).toLowerCase();
        addedrelatedterm.relatedterm = term[0].term;
        addedrelatedterm.relatedquick = addedrelatedletter + "/#" + term[0].termquick;
        console.log("Added this related term --> ",addedrelatedterm);
        newrelatedterms.push(addedrelatedterm);
        console.log("New related terms = ",newrelatedterms);
        //return addedrelatedterm;
      }
    })
    .catch(err => {
      return res.status(500).send(err);
      next(err);
    });
  }
  if (newrelatedterms.length < 1) {
    console.log("New related terms was empty");
    newrelatedterms.push({relatedterm: "",relatedquick: ""});
  };
  newdictionaryterm = {
    term: req.body.term,
    termquick: req.body.termquick,
    definition: req.body.definition,
    synonyms: req.body['synonyms[]'] || [],
    relatedterms: newrelatedterms,
    lettercategory: req.body.lettercategory
  };
  console.log("Delivering new term to [MONGODB] = ",newdictionaryterm);
  const READYPHOTOTERM = new mindsetphotodefs(newdictionaryterm);
  READYPHOTOTERM.save(err => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      return res.status(201).send({error: false});
    }
  })
}

exports.deletePhotoTerm = (req, res) => {
  mindsetphotodefs.findByIdAndRemove(req.params.id).exec()
  .then(() => {
    return res.status(202).send({error: false});
  })
  .catch(err => {
    return res.status(500).send(err);
    next(err);
  });
}
