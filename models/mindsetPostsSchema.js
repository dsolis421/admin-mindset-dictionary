var mongoose = require('mongoose');

const postsSubText = new mongoose.Schema({
  'postsubheader' : {
    type : String,
    required : false
  },
  'postsubimage' : {
    type : String,
    required : false
  },
  'postsubimagecaption' : {
    type : String,
    required : false
  },
  'postsubtext' : {
    type : String,
    required : true
  },
  'postsuborder' : {
    type : Number,
    required : true
  }
});

const postsSchema = new mongoose.Schema({
  'posttitle' : {
    type: String,
    required: true
  },
  'postdate' : {
    type : Date,
    required : false
  },
  'posttopic' : {
    type : String,
    required : true
  },
  'postquick' : {
    type: String,
    required: true
  },
  'postsummary' : {
    type : String,
    required : true
  },
  'postcontent' : {
    type : [postsSubText],
    required : true
  },
  'postimage' : {
    type : String,
    required : true
  },
  'posttnail' : {
    type: String,
    required : true
  },
  'showpost' : {
    type : String,
    required : true
  }
});

module.exports = mongoose.model('mindsetposts', postsSchema);
