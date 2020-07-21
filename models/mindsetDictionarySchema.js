var mongoose = require('mongoose');

const relatedSchema = new mongoose.Schema({
  'relatedterm' : {
    type: String,
    required: false
  },
  'relatedquick' : {
    type: String,
    required: false
  }
})

const dictionarySchema = new mongoose.Schema({
  'term' : {
    type: String,
    required: true
  },
  'termquick' : {
    type: String,
    required: true
  },
  'definition' : {
    type : String,
    required : true
  },
  'synonyms' : {
    type : [String],
    required : false
  },
  'relatedterms' : {
    type : [relatedSchema],
    required : false
  },
  'lettercategory' : {
    type : String,
    required: true
  }
});

module.exports = mongoose.model('mindsetphotodefs', dictionarySchema);
