console.log("Hello World!");
var $ = require('jquery');
var handlebars = require('handlebars');
var _ = require('underscore');
var moment = require('moment');
var baseUrl = 'https://api.github.com';

var githubtoken = require('./token.js').token;
//////Creates User token for ajax requests
if(typeof(githubtoken) !== "undefined"){
  $.ajaxSetup({
    headers: {
      'Authorization': 'token ' + githubtoken,
    }
  });
}
console.log();
/////////////////////////////////////////////










//fetches and creates the header thumbnail
function fetchThumbnail(){
  var userUrl = baseUrl + '/users/awadewilli';

$.ajax(userUrl).done(function(data){
  var source   = $("#thumbnail").html();
  var template = handlebars.compile(source);

  var context = {url: data.avatar_url};
  var html    = template(context);
  console.log(context);
$('#thumbnail_pic').html(html);
});
}
/////////////////////////////////////////////

//fetches and creates the sidebar containing the profile and user information
function fetchUserData(){
  var userUrl = baseUrl + '/users/awadewilli';

$.ajax(userUrl).done(function(data){
  var source   = $("#user-info").html();
  var template = handlebars.compile(source);

  var context = {full_name: data.name, username: data.login, email: data.email, created_date:moment(data.created_at).format('MMMM, DD YYYY'), url: data.avatar_url,followers:data.followers, following:data.following};
  var html    = template(context);
  console.log(context);
$('.profile-info').html(html);
});
}
/////////////////////////////////////////////
//fetches the information on the users starred repositories
function fetchStarredData(){
  var userUrl = baseUrl + '/users/awadewilli/starred';

$.ajax(userUrl).done(function(data){
  var source   = $("#favorites").html();
  var template = handlebars.compile(source);

  var context = {starred:data.length};
  var html    = template(context);
  console.log(context);
$('.star-repo').append(html);
});
}
/////////////////////////////////////////////
//fetches and creates each of the user's repositories
function fetchRepoData(){
  var userUrl = baseUrl + '/users/awadewilli/repos';

$.ajax(userUrl).done(function(list){
  var source   = $("#repositories").html();
  var template = handlebars.compile(source);

  var sortedArray = _.sortBy(list,'created_at');
  console.log(sortedArray);
_.each(sortedArray.reverse(),function(data){
  var context = {full_name: data.name, updated_at:moment(data.updated_at).fromNow(), lang:data.language, repo_url:data.clone_url, forks:data.forks_count, stargazers:data.stargazers_count};
  var html  = template(context);

  $('.repo-wrapper').append(html);
  $('#repo-tab').addClass('active');
  $('#collab-tab').removeClass('active');
  $('#pub-tab').removeClass('active');
});

});
}
/////////////////////////////////////////////
$('#repo-tab').click(fetchRepoData());
fetchUserData();
fetchStarredData();
fetchThumbnail();
