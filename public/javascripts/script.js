function expandNewTermForm() {
  $('.new-term-container').animate({height: "700px"},"slow","swing");
}

function clearNewValues() {
  $('.new-term-form > input, .new-term-form > textarea').val('');
}

function postNewTerm(newterm) {
  $.post("/dictionary", newterm, function(data,status,xhr){
    if(status == "success") {
      clearNewValues();
      $(".new-term-response-container").html('<span class="new-term-good">New Term Added to Dictionary</span>')
    } else if (status == "error") {
      $(".new-term-response-container").html('<span class="new-term-bad">A Server Error Occured, Could Not Insert New Term</span>');
    } else if (status == "timeout") {
      $(".new-term-response-container").html('<span class="new-term-bad">A Timeout Error Occured, Check Your Connetion and Try Again</span>');
    }
  });
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

function deletePhotoTerm(id) {
  $.post("/dictionary/delete/" + id,function(data,status,xhr){
    if(status == "success") {
      location.reload(true);
    }
  });
}

$(document).ready(function(){
  clearNewValues();

  $('#letter').change(function() {
    var $letter = $('#letter').val()
    var $quick = "/dictionary/" + $letter;
    console.log('selected letter '+ $quick);
    window.location.href = $quick;
  })

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

  $('.delete-photo-term').click(function() {
    console.log('deleting a new term');
    $(this).siblings(".confirm-delete-term, .cancel-delete-term").animate({width: "100px"},"slow","swing");
  });

  $('.cancel-delete-term').click(function() {
    console.log('cancel deleting a new term');
    $(this).siblings(".confirm-delete-term").animate({width: "0px"},"slow","swing");
    $(this).animate({width: "0px"},"slow","swing");
  });

  $('.confirm-delete-term').click(function() {
    console.log('confirm deleting a new term');
    var $deleteid = $(this).attr('data-id');
    deletePhotoTerm($deleteid);
    var $deleteid = '';
  });
});
