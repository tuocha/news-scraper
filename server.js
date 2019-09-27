//dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

//dependencies for scraping
var axios = require("axios");
var cheerio = require("cheerio");

//link to our data models
var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

//handlebars stuff
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//serves static files
app.use(express.static(__dirname + '/public'));

//mongodb connection
mongoose.connect("mongodb://localhost/recipeScraper", {
  useNewUrlParser: true
});


//home route
app.get("/", function(req, res) {
  db.Article.find({saved: false})
  .then(function(dbArticle) {
    res.render("index", { recipes: dbArticle })
    })
  .catch(function(err) {
    res.json(err);
  });

})

//route for scraping
app.get("/scrape", function(req, res) {
  axios
    .get("https://minimalistbaker.com/recipe-index/")
    .then(function(response) {
      var $ = cheerio.load(response.data);

      $("article h2").each(function(i, element) {
        var result = {};

        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        db.Article.create(result)
          .then(function(dbArticle) {
            // console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      res.redirect("/");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with its note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
     res.redirect("/")
    })
    .catch(function(err) {
      res.json(err);
    });
});

//route for grabbing all articles that have been saved
app.get("/saved", function(req, res) {
  db.Article.find({saved: true})
  .then(function(dbArticle) {
    res.render("saved", { recipes: dbArticle })
    })
  .catch(function(err) {
    res.json(err);
  });

});

//route that changes an article from unsaved to saved
app.get("/save/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: req.params.id },
    { saved: true },
    { new: true }
  )
    .then(function() {
      res.redirect("/")
    })
    .catch(function(err) {
      res.json(err);
    });
});

//route that changes a saved article to unsaved
app.get("/clear/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: req.params.id },
    { saved: false },
    { new: true }
  )
  .then(function() {
    res.redirect("/")
  })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
