'use strict';

var app = new Vue({
    el: "#app1",
    delimiters: ["[[", "]]"],
    data: {
        state: "userPicking",
        user_id: undefined,
        error: false,
    },
    methods: {
        clearError: function(event) {
            app.error = false;
        },
        buttonIdClicked: function(event) {
            if (app.user_id === undefined) {
                return;
            }
            app.state = "loading";
            fetch('/api/validate_user/' + app.user_id, {
                    method: "GET",
                })
                .then((resp) => resp.json())
                .then(function(data) {
                    if (data.status === "ok") {
                        app.state = "userPicking";
                        window.location.href = "./user/" + app.user_id;
                    } else {
                        app.state = "userPicking";
                        app.error = true;
                    }
                }).catch((error) => console.log("Error getting the data: " + error));
        }
    }
});
