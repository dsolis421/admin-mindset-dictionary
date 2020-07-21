$(document).ready(function(){

  $('#letter-search-go').click(function() {
    var $letter = $('#letter').val()
    var $quick = "/dictionary/" + $letter;
    console.log('selected letter '+ $quick);
    window.location.href = $quick;
  });

});
