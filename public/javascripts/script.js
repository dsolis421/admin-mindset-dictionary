function expandNewTermForm() {
  $('.new-term-container').animate({height: "400px"},"slow","swing");
}

function clearFormValues() {
  $('.form-text-input > input, .form-textarea-input > textarea').val('');
}

function postNewTerm(newterm) {
  $.post("/dictionary/add", newterm, function(data,status,xhr){
    if(status == "success") {
      clearFormValues();
      $(".new-term-response-container").html('<span class="new-term-good">New Term Added to Dictionary</span>')
    } else if (status == "error") {
      $(".new-term-response-container").html('<span class="new-term-bad">A Server Error Occured, Could Not Insert New Term</span>');
    } else if (status == "timeout") {
      $(".new-term-response-container").html('<span class="new-term-bad">A Timeout Error Occured, Check Your Connetion and Try Again</span>');
    }
  });
}

function postUpdatedTerm(updateterm) {
  $.post("/dictionary/edit", updateterm, function(data,status,xhr){
    /*if(status == "success") {
      clearNewValues();
      $(".new-term-response-container").html('<span class="new-term-good">New Term Added to Dictionary</span>')
    } else if (status == "error") {
      $(".new-term-response-container").html('<span class="new-term-bad">A Server Error Occured, Could Not Insert New Term</span>');
    } else if (status == "timeout") {
      $(".new-term-response-container").html('<span class="new-term-bad">A Timeout Error Occured, Check Your Connetion and Try Again</span>');
    }*/
    console.log(status);
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

function buildUpdatedTerm() {
  var updatetermdata = {};
  var $lettercategory = $('#edit-dictionary-term').val().charAt(0).toLowerCase();
  var $updatetermquick = $('#edit-term-quick').val();
  var $updatesynonyms = $('#edit-term-synonyms').val().replace(/, /g,",").split(",");
  var $updaterelated = $('#edit-term-related').val().replace(/, /g,",").split(",");
  updatetermdata.term = $('#new-dictionary-term').val();
  updatetermdata.termquick = $updatetermquick;
  updatetermdata.definition = $('#new-term-def').val();
  updatetermdata.synonyms = $updatesynonyms;
  updatetermdata.relatedterms = $updaterelated;
  updatetermdata.lettercategory = $lettercategory;
  console.log(updatetermdata);
  //postNewTerm(newtermdata);
}

function arrangeEditTerm(editterm) {
  console.log(editterm.attr("data-relatedterms"));
  var $ineditrelated = editterm.attr("data-relatedterms")
  .replace(/[\r\n]/g,"")
  .replace(/\{.+?term:/g,"")
  .replace(/relatedquick:.+?}/g,"")
  .replace(/',  , '/g,",")
  .replace("'","")
  .replace("',","")
  .trim();
  //$ineditrelated.replace(/:/gm,"REPLACED");
  //var $ineditrelated = editterm.attr("data-relatedterms").replace(/\{  _.+?,/g,"");
  console.log($ineditrelated);
  $("label[for='edit-dictionary-term']").text("Edit Term: " + editterm.attr("data-term"));
  $('#edit-dictionary-term').val(editterm.attr("data-term"));
  $('#edit-term-quick').val(editterm.attr("data-termquick"));
  $('#edit-term-def').val(editterm.attr("data-definition"));
  $('#edit-term-synonyms').val(editterm.attr("data-synonyms"));
  $('#edit-term-related').val($ineditrelated);
}

function deletePhotoTerm(id) {
  $.post("/dictionary/delete/" + id,function(data,status,xhr){
    if(status == "success") {
      location.reload(true);
    }
  });
}

$(document).ready(function(){
  clearFormValues();

  $('#letter').change(function() {
    var $letter = $('#letter').val()
    var $quick = "/dictionary/" + $letter;
    console.log('selected letter '+ $quick);
    window.location.href = $quick;
  });

  $('#add-new-term').click(function() {
    console.log('adding a new term');
    clearFormValues();
    expandNewTermForm();
  });

  $('.new-term-submit').click(function() {
    console.log('submit a new term');
    buildNewTerm();
  });

  $('.new-term-cancel').click(function() {
    console.log('adding a new term');
    clearFormValues();
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

  $('.edit-photo-term').click(function() {
    var editterm = $(this).parent().attr("data-term");
    var edittermelement = $(this).parent();
    console.log('editing term - ' + editterm);
    arrangeEditTerm(edittermelement);
    $('.edit-term-container').fadeIn();
  });

  $('#edit-dictionary-term').change(function() {
    $changingtermquick = $(this).val().toLowerCase().replaceAll("(","").replaceAll(")","").replaceAll(" ","-");
    $('#edit-term-quick').val($changingtermquick);
  });

  $('.edit-term-submit').click(function() {
    console.log('submitting updated term');
    buildUpdatedTerm();
    clearFormValues();
    $('.edit-term-container').fadeOut();
  });

  $('.edit-term-cancel').click(function() {
    console.log('canceling edit term');
    clearFormValues();
    $('.edit-term-container').fadeOut();
  });

});
