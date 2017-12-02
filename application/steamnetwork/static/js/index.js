'use strict';

var app = new Vue({
  el: "#app1",
  delimiters: ["[[", "]]"],
  data: {
      state: "UserPicking",
      user_id: undefined,
  },
  methods:
  {
      buttonIdClicked: function (event)
      {
          app.state = "Loading";
          
          alert(app.user_id);
      }
  }
});
