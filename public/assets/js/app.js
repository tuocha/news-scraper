$(document).ready(function() {
  $(".slider").slider();
});

$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      $("#articles").append(

      "<a href='" + data[i].link + "'" +
      "class='collection-item blue lighten-4 data-id='" 
      + data[i]._id + "'>" +
      ">" + 
      data[i].title + 
      "<a class='note-button waves-effect waves-light btn blue darken-3 modal-trigger' href='#modal1' data-id='" +
      data[i]._id + "'>" + 
      ">add a note</a>"
      
      );
  }
  });

  $(document).on("click", ".note-button", function() {
  // Save the id from the collection item
  var thisId = $(this).attr("data-id");
console.log(thisId)
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h6>" + data.title + "</h6>");
      // An input to enter a new title
      $("#notes").append("<p>" + data.note.title + "</p>");
      // A textarea to add a new note body
      $("#notes").append("<p>" + data.note.body + "/p>");
      // A button to submit a new note, with the id of the article saved to it
      // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

$("#save-note").on("click", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#note-title").val(),
      // Value taken from note textarea
      body: $("#note-body").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");

})

M.AutoInit();