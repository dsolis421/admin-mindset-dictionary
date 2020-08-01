function setBlogHandlers() {
  $('.delete-blog-button').click(function() {
    console.log('deleting a blog');
    $(this).siblings(".confirm-delete-blog, .cancel-delete-blog").animate({width: "100px"},"slow","swing");
  });

  $('.cancel-delete-blog').click(function() {
    console.log('cancel delete blog');
    $(this).siblings(".confirm-delete-blog").animate({width: "0px"},"slow","swing");
    $(this).animate({width: "0px"},"slow","swing");
  });

  $('.confirm-delete-blog').click(function() {
    console.log('confirm delete a blog');
    var $deleteid = $(this).attr('data-id');
    deleteBlogPost($deleteid);
    var $deleteid = '';
  });

  $('.edit-blog-button').click(function() {
    console.log('editing a blog');
    var $id = $(this).attr('data-id')
    var $quick = "/blog/edit/" + $id;
    window.location.href = $quick;
  });

  $('.show-post-toggle').click(function() {
    var show = {
      id : $(this).attr('data-id'),
      showpost : $(this).attr('data-switchto')
    }
    console.log('toggle post to ' + show.showpost);
    if($(this).attr('data-switchto') == 'n') {
      $(this).attr('data-switchto','y');
      $(this).html('<i class="fad fa-toggle-off fa-lg"></i>');
      console.log("toggled off");
    } else {
      $(this).attr('data-switchto','n');
      $(this).html('<i class="fad fa-toggle-on fa-lg"></i>');
      console.log("toggled on");
    }
    toggleShowPost(show);
  });
}

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

function postUpdatedBlog(blogupdate) {
  $.post("/blog/update/" + blogupdate.id, blogupdate, function(data,status,xhr){
    if(status == "success") {
      //clearFormValues();
      alert("Updated blog post!");
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
    $subcontent.postsubimagecaption = jQuery(this).find('#new-blog-subimagecaption').val();
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

function buildUpdatedBlog() {
  console.log('Updating blog post');
  var $updatedblogdata = {};
  var $updatedblogcontent = [];
  $('.form-textarea-input').each(function(){
    var $subcontent = {};
    $subcontent.postsubheader = jQuery(this).find('#edit-blog-subheader').val();
    $subcontent.postsubimage = jQuery(this).find('#edit-blog-subimage').val();
    $subcontent.postsubimagecaption = jQuery(this).find('#edit-blog-subimagecaption').val();
    $subcontent.postsubtext = jQuery(this).find('#edit-blog-subtext').val();
    $subcontent.postsuborder = jQuery(this).find('#edit-blog-suborder').val();
    console.log("Adding subcontent " + $subcontent);
    $updatedblogcontent.push($subcontent);
  });
  $updatedblogdata.id = $('.edit-blog-form').attr('data-id');
  $updatedblogdata.title = $('#edit-blog-title').val();
  $updatedblogdata.topic = $('#edit-blog-topic').val();
  $updatedblogdata.summary = $('#edit-blog-summary').val();
  $updatedblogdata.image = $('#edit-blog-image').val();
  $updatedblogdata.tnail = $('#edit-blog-tnail').val();;
  $updatedblogdata.content = JSON.stringify($updatedblogcontent);
  console.log($updatedblogdata);
  postUpdatedBlog($updatedblogdata);
}

function toggleShowPost(post) {
  $.post("/blog/togglepost/" + post.id, post, function(data,status,xhr){
    console.log(status);
  });
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

function deleteBlogPost(id) {
  $.post("/blog/delete/" + id,function(data,status,xhr){
    if(status == "success") {
      location.reload(true);
    }
  });
}

function sendBlogSearch(text) {
  var searchfor = {};
  searchfor.text = text;
  $.post("/blog/search/",searchfor,function(data, status, xhr){
    console.log(data);
    /*$("#blog-search-results").load(document.URL+" #blog-search-results>*", function() {
      setBlogHandlers();
    });*/
    $('#blog-search-results').empty();
    var resultcount = data.length;
    if(resultcount == 0){
      $('#blog-search-results').append('<div class="blog-landing-listing">\
        <h4>No Results Found</h4></div>')
    } else {
      for (x=0; x < resultcount; x++) {
        var togglesetting = '';
        var formatteddate = '';
        if(data[x].showpost == 'y') {
          togglesetting = '<span class="show-post-toggle" data-id="'+data[x]._id+'" data-switchto="n">\
          <i class="fad fa-toggle-on fa-lg"></i></span>'
        } else {
          togglesetting = '<span class="show-post-toggle" data-id="'+data[x]._id+'" data-switchto="y">\
          <i class="fad fa-toggle-off fa-lg"></i></span>'
        };
        formatteddate = data[x].postdate;
        $('#blog-search-results').append('<div class="blog-landing-listing">\
          <a class="blog-post-preview" href="/blog/preview/'+data[x].postquick+'">\
          <i class="fad fa-eye fa-lg"></i></a>\
          <h4>'+data[x].posttitle+'</h4>\
          <h5>'+data[x].postsummary+'</h5>\
          <span>'+formatteddate+'</span>\
          <div class="blog-post-menu">'+togglesetting+'\
          <span class="edit-blog-button" data-id="'+data[x]._id+'">\
          <i class="fad fa-pencil fa-lg"></i></span>\
          <span class="delete-blog-button">\
          <i class="fad fa-trash fa-lg"></i></span>\
          <span class="confirm-delete-blog" data-id="'+data[x]._id+'">Confirm</span>\
          <span class="cancel-delete-blog">Cancel</span></div></div>')
      }
    }
    setBlogHandlers();
  });
}

$(document).ready(function(){
  //clearFormValues();
  setBlogHandlers();

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
    console.log('canceling a new term');
    var cancel = confirm('You want to cancel this edit? Changes will be lost...');
    if(cancel) {
      clearFormValues();
      $('.new-term-container').animate({height: "0px"},"slow","swing");
    }
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
    var cancel = confirm('You want to cancel this edit? Changes will be lost...');
    if(cancel) {
      clearFormValues();
      $('.edit-term-container').fadeOut();
    }
  });

  $('#add-new-blog').click(function() {
    console.log('adding a new blog');
    window.location.href = '/blog/create';
    clearFormValues();
  });

  $('.new-blog-cancel').click(function() {
    console.log('canceling a new blog');
    var cancel = confirm('You want to cancel this new blog? Changes will be lost...');
    if(cancel) {
      clearFormValues();
      window.location.href = '/blog';
    }
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

  $('.edit-blog-save').click(function() {
    console.log('saving an updated blog');
    buildUpdatedBlog();
  });

  $('.edit-blog-cancel').click(function() {
    console.log('canceling a blog edit');
    var cancel = confirm('You want to cancel this blog edit? Changes will be lost...');
    if(cancel) {
      clearFormValues();
      window.location.href = '/blog';
    }
  });

  $('input#edit-blog-suborder').change(function() {
    //onsole.log('updating suborder');
    var order = $(this).val();
    $('input#edit-blog-suborder').not(this).each(function(){
      if($(this).val() >= order) {
        var setorder = parseInt($(this).val()) + 1;
        //console.log('this order needs an update');
        $(this).val(setorder);
      }
    });
  });

  $('.blog-search-button').click(function() {
    var searchtext = $('#blog-search-input').val();
    console.log('searching for: ' + searchtext);
    sendBlogSearch(searchtext);
  });
});
