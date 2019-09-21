// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();

// Database configuration
var databaseUrl = "newsScraperDB";
var collections = ["Article"];

//serve static files
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//handlebars stuff
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });
var db = require("./models")

//routes
// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);

app.get("/", function(req, res) {
  res.render("index");
});

// app.get("*", function(req, res) {
//   res.render("404");
// });

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request via axios for the news section of `ycombinator`
  axios
    .get("https://www.nytimes.com/section/technology")
    .then(function(response) {
      // Load the html body from axios into cheerio
      var $ = cheerio.load(response.data);
      // For each element with a "title" class
      $("h2.css-y3otqb").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element)
          .children("a")
          .text();
        var link = $(element)
          .children("a")
          .attr("href");

        // If this found element had both a title and a link
        if (title && link) {
          // Insert the data in the scrapedData db
          db.Article.create(
            {
              title: title,
              link: link
            },
            function(err, inserted) {
              if (err) {
                // Log the error if one is encountered during the query
                console.log(err);
              } else {
                // Otherwise, log the inserted data
                console.log(inserted);
              }
            }
          );
        }
      });
    });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});
