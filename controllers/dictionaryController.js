var mongoose = require('mongoose');

const mindsetphotodefs = mongoose.model('mindsetphotodefs');
const mindsetblogposts = mongoose.model('mindsetposts');

async function buildRelatedTermsArray(relatedterms) {
  var relatedtermsready = [];
  var loopnum = relatedterms.length;
  for(var x = 0; x < loopnum; x++) {
    await mindsetphotodefs.find({term: relatedterms[x]}).exec()
    .then(term => {
      if(term[0]){
        console.log("Found term --> ", term[0].term)
        var addedrelatedterm = {};
        var addedrelatedletter = term[0].term.charAt(0).toLowerCase();
        addedrelatedterm.relatedterm = term[0].term;
        addedrelatedterm.relatedquick = addedrelatedletter + "/#" + term[0].termquick;
        console.log("Added this related term --> ",addedrelatedterm);
        relatedtermsready.push(addedrelatedterm);
      }
      console.log("Related Terms are ready ",relatedtermsready);
    })
    .catch(err => {
      //return res.status(500).send(err);
      next(err);
    });
  }
  if (relatedtermsready.length < 1) {
    console.log("New related terms was empty");
    relatedtermsready.push({relatedterm: "",relatedquick: ""});
  };
  return relatedtermsready;
}

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

exports.getEditBlog = (req, res) => {
  mindsetblogposts.find({_id: req.params.id}).exec()
  .then(editpost => {
    //console.log(editpost);
    var blogpost = editpost[0];
    console.log(blogpost)
    res.render('editblogform', {title: 'EDIT BLOG', blogpost});
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
  newrelatedterms = await buildRelatedTermsArray(req.body['relatedterms[]']);
  newdictionaryterm = {
    term: req.body.term,
    termquick: req.body.termquick,
    definition: req.body.definition,
    synonyms: req.body['synonyms[]'] || [],
    relatedterms: newrelatedterms,
    lettercategory: req.body.lettercategory
  };
  console.log("Delivering new term to [MONGODB]");
  const READYPHOTOTERM = new mindsetphotodefs(newdictionaryterm);
  READYPHOTOTERM.save(err => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      return res.status(201).send({error: false});
    }
  });
}

exports.editPhotoTerm = async (req, res) => {
  var updatedDictionaryTerm = {};
  var editedRelatedTerms = [];
  if (typeof req.body['relatedterms[]'] == "string") {
    console.log("Need to change relatedterms to ARRAY");
    req.body['relatedterms[]'] = [req.body['relatedterms[]']]
  }
  editedRelatedTerms = await buildRelatedTermsArray(req.body['relatedterms[]']);
  updatedDictionaryTerm = {
    term: req.body.term,
    termquick: req.body.termquick,
    definition: req.body.definition,
    synonyms: req.body['synonyms[]'] || [],
    relatedterms: editedRelatedTerms,
    lettercategory: req.body.lettercategory
  }
  console.log("Delivering new term to [MONDGODB]");
  mindsetphotodefs.findByIdAndUpdate({_id: req.body.id},updatedDictionaryTerm, (err, result) => {
    if(err) {
      return res.status(500).send(err);
    } else {
      return res.status(202).send({error: false});
    }
  });
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

exports.addNewBlog = (req, res) => {
  console.log("Add new blog request received");
  var newcontent = JSON.parse(req.body.content);
  console.log(newcontent);
  var newdate = new Date();
  var newquick = req.body.title.toLowerCase().replace(/ /g,"-");
  const newblogpost = {
    posttitle : req.body.title,
    postdate : newdate,
    posttopic : req.body.topic,
    postquick : newquick,
    postsummary : req.body.summary,
    postcontent : newcontent,
    postimage : req.body.image,
    posttnail : req.body.tnail,
    showpost : 'n'
  };
  console.log("Delivering new blog to [MONGODB]");
  const READYPHOTOBLOG = new mindsetblogposts(newblogpost);
  READYPHOTOBLOG.save(err => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } else {
      return res.status(201).send({error: false});
    }
  });
}

exports.getBlogListing = (req, res) => {
  mindsetblogposts.find().sort({postdate: -1}).exec()
  .then(bloglisting => {
    console.log(bloglisting);
    res.render('bloglanding',{title: 'BLOG',bloglisting});
  })
  .catch(err => {
    return res.status(500).send(err);
    next(err);
  });
}

exports.getBlogPost = (req, res) => {
  mindsetblogposts.find({postquick:req.params.blogquick}).exec()
  .then(blogpost => {
    var article = blogpost[0];
    res.render('blogsampleview',{title: 'BLOG PREVIEW',article});
  })
  .catch(err => {
    next(err);
  });
}

exports.editBlogPost = (req, res) => {
  console.log("Made it to the server", req.body);
  var newdate = new Date();
  var newquick = req.body.title.toLowerCase().replace(/ /g,"-");
  var updatedBlogPost = {};
  var newcontent = JSON.parse(req.body.content);
  updatedBlogPost = {
    posttitle : req.body.title,
    posttopic : req.body.topic,
    postdate : newdate,
    postquick : newquick,
    postsummary : req.body.summary,
    postcontent : newcontent,
    postimage : req.body.image,
    posttnail : req.body.tnail,
  };
  console.log("Delivering new blog to [MONDGODB]");
  console.log(updatedBlogPost);
  mindsetblogposts.findByIdAndUpdate({_id: req.body.id},updatedBlogPost, (err, result) => {
    if(err) {
      return res.status(500).send(err);
    } else {
      return res.status(202).send({error: false});
    }
  });
}

exports.toggleShowPost = (req, res) => {
  mindsetblogposts.findByIdAndUpdate(req.params.id,
    {$set :   {showpost : req.body.showpost}}, (err, post) => {
      if (err) {
        return res.status(500).send(err);
        next(err);
      } else {
        return res.status(202).send({error: false});
      }
    }
  )
};

exports.addDeleteBlogPost = (req, res) => {
  mindsetblogposts.findByIdAndRemove(req.params.id).exec()
  .then(() => {
    return res.status(202).send({error: false});
  })
  .catch(err => {
    return res.status(500).send(err);
    next(err);
  });
}
