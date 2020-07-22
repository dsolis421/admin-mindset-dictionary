function buildNewTerm() {
  $('.new-term-container').animate({height: "675px"},"slow","swing");
}

function clearNewValues() {
  $('.new-term-form > input, .new-term-form > textarea').val('');
}


$(document).ready(function(){

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
    buildNewTerm();
  });

  $('.new-term-submit').click(function() {
    console.log('submit a new term');
    clearNewValues();
  });

  $('.new-term-cancel').click(function() {
    console.log('adding a new term');
    clearNewValues();
    $('.new-term-container').animate({height: "0px"},"slow","swing");
  });

});
