var db = require("../models");

module.exports = function(app) {

// Retrieve data from the db
app.get("/all", function(req, res) {
  
    // Find all results from the scrapedData collection in the db
    db.scrapedData.find({}, function(error, found) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        res.json(found);
      }
    });
  });
}