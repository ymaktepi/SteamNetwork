'use strict';

function setTitle(title)
{
  document.title = title;
}

function setPage_title(page_title)
{
  $("#page_title").html(page_title);
}

function setPage_subtitle(page_subtitle)
{
  $("#page_subtitle").html(page_subtitle);
}

// enables tooltips https://v4-alpha.getbootstrap.com/components/tooltips/#example-enable-tooltips-everywhere
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
