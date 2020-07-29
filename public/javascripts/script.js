function expandNewTermForm() {
  $('.new-term-container').animate({height: "400px"},"slow","swing");
}

function closeNewTermForm() {
  $('.new-term-container').animate({height: "0px"},"slow","swing");
}

function clearFormValues() {
  $('.form-text-input > input, .form-textarea-input > textarea, .form-textarea-input > input').val('');
}

function postNewTerm(newterm) {
  $.post("/dictionary/add", newterm, function(data,status,xhr){
    if(status == "success") {
      clearFormValues();
      closeNewTermForm();
      location.reload(true);
      $(".response-message-container").html('<span class="new-term-good">New Term Added to Dictionary</span>')
    } else if (status == "error") {
      $(".response-message-container").html('<span class="new-term-bad">A Server Error Occured, Could Not Insert New Term</span>');
    } else if (status == "timeout") {
      $(".response-message-container").html('<span class="new-term-bad">A Timeout Error Occured, Check Your Connetion and Try Again</span>');
    }
  });
}

function postUpdatedTerm(updateterm) {
  $.post("/dictionary/edit/" + updateterm.id, updateterm, function(data,status,xhr){
    if(status == "success") {
      clearFormValues();
      location.reload(true);
      $(".response-message-container").html('<span class="new-term-good">Term update successful</span>')
    } else if (status == "error") {
      $(".response-message-container").html('<span class="new-term-bad">A Server Error Occured, Could Not Update Term</span>');
    } else if (status == "timeout") {
      $(".response-message-container").html('<span class="new-term-bad">A Timeout Error Occured, Check Your Connetion and Try Again</span>');
    }
    console.log(status);
  });
}

function postNewBlog(newblog) {
  $.post("/blog/add", newblog, function(data,status,xhr){
    if(status == "success") {
      clearFormValues();
      alert("New blog post created!");
      $(".response-message-container").html('<span class="new-term-good">New Term Added to Dictionary</span>')
    } else if (status == "error") {
      $(".response-message-container").html('<span class="new-term-bad">A Server Error Occured, Could Not Insert New Term</span>');
    } else if (status == "timeout") {
      $(".response-message-container").html('<span class="new-term-bad">A Timeout Error Occured, Check Your Connetion and Try Again</span>');
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

function buildUpdatedTerm() {
  console.log("Building Updated Term");
  var updatetermdata = {};
  var $lettercategory = $('#edit-dictionary-term').val().charAt(0).toLowerCase();
  var $updatetermquick = $('#edit-term-quick').val();
  var $updatesynonyms = $('#edit-term-synonyms').val().replace(/, /g,",").split(",");
  var $updaterelated = $('#edit-term-related').val().replace(/, /g,",").split(",");
  updatetermdata.id = $('#edit-term-id').val();
  updatetermdata.term = $('#edit-dictionary-term').val();
  updatetermdata.termquick = $updatetermquick;
  updatetermdata.definition = $('#edit-term-def').val();
  updatetermdata.synonyms = $updatesynonyms;
  updatetermdata.relatedterms = $updaterelated;
  updatetermdata.lettercategory = $lettercategory;
  postUpdatedTerm(updatetermdata);
}

function buildNewBlog() {
  console.log('Building new blog post');
  var $newblogdata = {};
  var $newblogcontent = [];
  $('.form-textarea-input').each(function(){
    var $subcontent = {};
    $subcontent.postsubheader = jQuery(this).find('#new-blog-subheader').val();
    $subcontent.postsubimage = jQuery(this).find('#new-blog-subimage').val();
    $subcontent.postsubtext = jQuery(this).find('#new-blog-subtext').val();
    $subcontent.postsuborder = jQuery(this).find('#new-blog-suborder').val();
    console.log("Adding subcontent " + $subcontent);
    $newblogcontent.push($subcontent);
  });
  $newblogdata.title = $('#new-blog-title').val();
  $newblogdata.topic = $('#new-blog-topic').val();
  $newblogdata.summary = $('#new-blog-summary').val();
  $newblogdata.image = $('#new-blog-image').val();
  $newblogdata.tnail = $('#new-blog-tnail').val();;
  $newblogdata.content = JSON.stringify($newblogcontent);
  console.log($newblogdata);
  postNewBlog($newblogdata);
}

function arrangeEditTerm(editterm) {
  //console.log(editterm.attr("data-relatedterms"));
  var $ineditrelated = editterm.attr("data-relatedterms")
  .replace(/[\r\n]/g,"")
  .replace(/\{.+?term:/g,"")
  .replace(/relatedquick:.+?}/g,"")
  .replace(/',  , '/g,",")
  .replace("'","")
  .replace("',","")
  .trim();
  //console.log($ineditrelated);
  $("label[for='edit-dictionary-term']").text("Edit Term: " + editterm.attr("data-term"));
  $('#edit-dictionary-term').val(editterm.attr("data-term"));
  $('#edit-term-id').val(editterm.attr("data-id"));
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
  //clearFormValues();

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
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#add-new-term").offset().top - 100
    }, 1000);
  });

  $('#edit-dictionary-term').change(function() {
    $changingtermquick = $(this).val().toLowerCase().replaceAll("(","").replaceAll(")","").replaceAll(" ","-");
    $('#edit-term-quick').val($changingtermquick);
  });

  $('.edit-term-submit').click(function() {
    console.log('submitting updated term');
    buildUpdatedTerm();
    $('.edit-term-container').fadeOut();
  });

  $('.edit-term-cancel').click(function() {
    console.log('canceling edit term');
    clearFormValues();
    $('.edit-term-container').fadeOut();
  });

  $('.new-blog-save').click(function() {
    console.log('saving new blog');
    buildNewBlog();
  });

  $('.new-blog-addsection').click(function() {
    console.log('adding new blog subsection');
    $('.new-blog-form').append('<div class="form-textarea-input">\
      <input id="new-blog-subheader" type="text" name="new-blog-subheader" placeholder="Subsection Header"></input><br>\
      <input id="new-blog-subimage" type="text" name="new-blog-subimage" placeholder="Subsection Image Link"></input><br>\
      <textarea id="new-blog-subtext" type="text" name="new-blog-subtext" placeholder="Subsection Text"></textarea><br>\
      <input id="new-blog-suborder" type="number" name="new-blog-suborder" placeholder="#"></input><br><br>\
      </div>')
  });
});
