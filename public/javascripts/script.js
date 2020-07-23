function expandNewTermForm() {
  $('.new-term-container').animate({height: "675px"},"slow","swing");
}

function clearNewValues() {
  $('.new-term-form > input, .new-term-form > textarea').val('');
}

function postNewTerm(newterm) {
  $.post("/dictionary", newterm);
}

function buildNewTerm() {
  var newtermdata = {};
  var $lettercategory = $('#new-dictionary-term').val().charAt(0).toLowerCase();
  var $newtermquick = $('#new-dictionary-term').val().replace(/\)/g,"").replace(/\(/g,"").replace(/ /g,"-").toLowerCase();
  var $synonyms = $('#new-term-synonyms').val().replace(/, /g,",").split(",");
  var $relatedterms = $('#new-term-related').val().replace(/, /g,",").split(",");
  newtermdata.term = $('#new-dictionary-term').val();
  newtermdata.termquick = $newtermquick;
  newtermdata.definition = $('#new-term-def').val();
  newtermdata.synonyms = $synonyms;
  newtermdata.relatedterms = $relatedterms;
  newtermdata.lettercategory = $lettercategory;
  console.log(newtermdata);
  postNewTerm(newtermdata);
}

$(document).ready(function(){
  clearNewValues();

  $('#letter-search-go').click(function() {
    var $letter = $('#letter').val()
    var $quick = "/dictionary/" + $letter;
    console.log('selected letter '+ $quick);
    window.location.href = $quick;
  });

  $('.edit-photo-term').click(function() {
    console.log('editing this term')
  });

  $('#add-new-term').click(function() {
    console.log('adding a new term');
    clearNewValues();
    expandNewTermForm();
  });

  $('.new-term-submit').click(function() {
    console.log('submit a new term');
    buildNewTerm();
  });

  $('.new-term-cancel').click(function() {
    console.log('adding a new term');
    clearNewValues();
    $('.new-term-container').animate({height: "0px"},"slow","swing");
  });
});
