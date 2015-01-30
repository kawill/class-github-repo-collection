// ;(function){

// function GithubClient(){}

// GithubClient.prototype = {
//     getData: function() {

// },

//     draw: function(){

//     }
// }

// window.GithubClient = GithubClient;

// })();


;
(function() {

    function GithubClient(token) {
        this.token = token;
        this.members = [];
        // this.repos = [];
        var self = this;

        var GithubRouter = Backbone.Router.extend({
            routes: {
                ":username": "drawUserInfo"
                    // "/#username/:repo": "drawRepoInfo",
            },
            drawUserInfo: function(username) {
                self.drawUser(username)
            },
            // drawRepoInfo: function(repo) {
            //     self.drawRepo2(repo);
            // },
            initialize: function() {
                Backbone.history.start();
            }
        })
        var router = new GithubRouter();

        this.draw();
    }

    GithubClient.prototype = {
        URLs: {
            members: "https://api.github.com/orgs/TIY-Houston-Front-End-Engineering/members"
            // repos: "http://api.github.com/users/" + this.username + "/repos"
        },
        access_token: function() {
            return "?access_token=" + this.token
        },
        /**
         * getData
         * @arguments none.
         * @return promise
         */
        getData: function() {
            var x = $.Deferred();

            if (this.members.length > 0) {
                x.resolve(this.members);
            } else {
                var p = $.get(this.URLs.members + this.access_token());
                p.then(function(data) {
                    x.resolve(data);
                    this.members = data;
                })
            }

            return x;
        },

        loadTemplate: function(name) {
            // modify the event context, return only the data
            return $.get("./templates/" + name + ".html").then(function(data) {
                return data;
            })
        },

        draw: function() {
            $.when(
                this.getData(),
                this.loadTemplate("menu-item")
            ).then(function(members, html) {
                var left_column = document.querySelector(".github-grid > *:nth-child(1)");
                left_column.innerHTML = _.template(html, {
                    members: members
                }); //rearrange data feed for _.template("string", {object})
            })
        },

        drawUser: function(username) {
            getUserInfo = function() {  
                return $.get("http://api.github.com/users/" + this.username + "?access_token=" + this.token)
            };

            getReposInfo = function() {  
                return $.get("http://api.github.com/users/" + this.username + "/repos?access_token=" + this.token)
            };

            getTemplateLeft = function() {  
                return $.get("./templates/userInfo.html")
            };

            getTemplateRightRepo = function() {  
                return $.get("./templates/repos.html")
            };

            getAllData = function() {  
                return $.when(this.getUserInfo(), this.getReposInfo(), this.getTemplateLeft(), this.getTemplateRightRepo())
            };

            drawToPage = function() {  
                this.getAllData().then(function(userInfo, repoInfo, templateLeft, templateRightRepo) {

                    document.body.querySelector('.userInfo').innerHTML = _.template(templateLeft[0], userInfo[0]);

                    var current = {};

                    for (var i = 0; i < repoInfo[0].length; i++) {
                        current = repoInfo[0][i];

                        document.body.querySelector('.repo').innerHTML += _.template(templateRightRepo[0], current);

                    }

                })
            };

        },

        // /////////////



        // getRepoData: function() {
        //     var x = $.Deferred();

        //     if (this.repos.length > 0) {
        //         x.resolve(this.repos);
        //     } else {
        //         var p = $.get(this.URLs.repos + this.access_token());
        //         p.then(function(repoData) {
        //             x.resolve(repoData);
        //             this.repos = repoData;
        //         })
        //     }

        //     return x;
        // },

        // loadTemplateRepo: function(repos) {
        //     // modify the event context, return only the data
        //     return $.get("./templates/" + repos + ".html").then(function(repoData) {
        //         return repoData;
        //     })
        // },

        // drawRepo: function() {
        //     $.when(
        //         this.getRepoData(),
        //         this.loadTemplateRepo("repos")
        //     ).then(function(repos, html) {
        //         var right_column = document.querySelector(".github-grid > *:nth-child(1)");
        //         right_column.innerHTML = _.template(html, {
        //             repos: repos
        //         });
        //     })
        // },




    }

    window.GithubClient = GithubClient;

})();
