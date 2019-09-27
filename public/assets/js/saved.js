$(document).ready(function() {
    $(".slider").slider();
    $('.modal').modal();
  });

  let buttonID;

$(document).on("click", ".note-button", function() {
    // Save the id from the collection item
    buttonID = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + buttonID
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
        //   $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#note-body").val(data.note.body);
        }
      });
  });

  $("#save-note").on("click", function() {
    // $(this).attr("data-id", )
    // Grab the id associated with the article from the submit button
    // var thisId = $(this).attr("data-id");
    console.log("saved!", buttonID);
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + buttonID,
      data: {
        // Value taken from note textarea
        body: $("#note-body").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#bodyinput").val();
  });
  
  $("#clear-recipe").on("click", function() {
      
  })