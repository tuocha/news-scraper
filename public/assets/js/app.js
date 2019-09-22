$(document).ready(function() {
  $(".slider").slider();
});

$(function() {  

$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append(
        // "<li class='collection-item avatar' data-id='" + data[i]._id + "'>" + 
        // "<img src='/assets/images/news-icon.png' style='height:50px; width:50px'>" +
        // "<span class='title'>" + data[i].title +"</span>"+ 
        // "<br />" + 
        // "<span class='article-body'>"+ data[i].link +"</span>" + "</li>"

        "<a href='" + data[i].link + "'" +
        "class='collection-item'" + ">" + 
        data[i].title + 
        "</a>"
        );
    }
  });
})

M.AutoInit();