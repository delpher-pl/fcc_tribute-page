const moment = require('moment'); // because IE11
moment().format();



let browserWidth = window.innerWidth;
let margin = 30; //px

let filters = {};

let dragStartX = -1;
let dragDeltaX = -1;
let dragThreshold = 10;
let dragStartTime = -1;
let dragTimeThreshold = 1000;


let form = document.querySelector("#tweets__form");
let formAll = document.querySelector("#tweets__form--all");
let formCheckboxes = document.querySelectorAll("#tweets__form > [data-profile]");

let tweetsSection = document.querySelector("#tweets");
let tweetsOverflow = document.querySelector("#tweets__overflow");
let tweetsContainer = document.querySelector("#tweets__tweets");
tweetsContainer.style.transform = "translateX(0px)";
let loaderContainer = document.querySelector("#tweets__loader");
let tweetsCollection = document.querySelectorAll('.tweets__tweet');

let leftButton = document.querySelector('#tweets__nav-button--left');
let rightButton = document.querySelector('#tweets__nav-button--right');
let track = document.querySelector('#tweets__nav-track');
let scrollbar = document.querySelector('#tweets__nav-scrollbar');

let tweetsOffsetCount = 0;
let tweetsCount = tweetsCollection.length; 
let tweetsVisibleCount = tweetsCount; 

let tweetWidth = ( tweetsContainer.offsetWidth - margin ) / 2;
let offsetX = -( tweetWidth + margin );

function updateFilters(){
  Array.prototype.forEach.call(formCheckboxes, el => {
    if( el.checked ){
      filters[el.dataset.profile] = true;
    } else {
      filters[el.dataset.profile] = false;
    }
  });
}

function updateTweets(elCollection){
  tweetsVisibleCount = 0;
  Array.prototype.forEach.call(elCollection, el => {
    if( filters[el.dataset.user] === true ){
      el.classList.remove("tweets__hidden");
      tweetsVisibleCount += 1;
    } else {
      el.classList.add("tweets__hidden");
    }
  });
}

function updateScrollbar(flag = true){
  
  if ( tweetsVisibleCount ){
    // CHANGE "2" TO VARIABLE ///////////////////////////////////////////////////////////////////
    scrollbar.style.width = 100 / tweetsVisibleCount * 2 + "%";
  } else {
    scrollbar.style.width = "100%";
  }

  if( flag ){
    // CHANGE "2" TO VARIABLE ///////////////////////////////////////////////////////////////////
    scrollbar.style.marginLeft = tweetsOffsetCount * ( scrollbar.scrollWidth / 2 ) + "px";
    
  }
}

function updateOffset() {
  tweetWidth = ( tweetsContainer.offsetWidth - margin ) / 2;
  offsetX = -( tweetWidth + margin );
  tweetsContainer.style.transform = "translateX(" + tweetsOffsetCount * offsetX + "px)";
}

function takeUserNames(dataObj) {
  dataObj.forEach(arr => {filters[arr[0].user.screen_name.toLowerCase()] = true;});
}

function showTweets(response) {

  // Put all tweets to one array
  let tweetsArr = [].concat(...response);
  
  tweetsArr = tweetsArr.sort( (a,b) => Date.parse(b.created_at) - Date.parse(a.created_at) );

  // console.log(tweetsArr.map(o => o.user.screen_name));
  // let tweetsArr = tweetsArr.filter(o => filters[o.user.screen_name.toLowerCase()] === true );
  let tweetsFragment = document.createDocumentFragment();
  for (let i = 0; i < tweetsArr.length; i++) {
    createTweet(tweetsArr[i]);
  }
  
  tweetsContainer.appendChild(tweetsFragment);
  tweetsCollection = document.querySelectorAll('.tweets__tweet');
  tweetsCount = tweetsCollection.length; 
  tweetsVisibleCount = tweetsCount; 
  
  // FUNCTIONS
  function createTweet(data) {
    let tweetEl = document.createElement("article");
    tweetEl.dataset.user = data.user.screen_name.toLowerCase();
    if( filters[tweetEl.dataset.user] === false ){
      tweetEl.classList.add("tweets__hidden");
    }
    tweetEl.classList.add("tweets__tweet");
    tweetEl.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.9)), " + "url('" + (data.user.profile_image_url).split("_normal").join("") + "'";

    let header = document.createElement("div");
    header.classList.add("tweets__header");

    let avatar = document.createElement("img");
    avatar.classList.add("tweets__avatar");
    avatar.src = data.user.profile_image_url;
    avatar.alt = "Avatar";

    let author = document.createElement("div");
    author.classList.add("tweets__author");

    let name = document.createElement("span");
    name.classList.add("tweets__name");
    name.innerText = data.user.name;

    let login = document.createElement("a");
    login.classList.add("tweets__login");
    login.classList.add("u-link-darkbg");
    login.href = "https://twitter.com/" + data.user.screen_name;
    login.innerText = "@" + data.user.screen_name;

    let content = document.createElement("div");
    content.classList.add("tweets__content");

    if( data.retweeted_status ){
      content.classList.add("tweets__content--retweeted");

      let retweetedInfo = document.createElement("div");
      retweetedInfo.classList.add("tweets__retweeted");
      retweetedInfo.classList.add("u-debug6");
      retweetedInfo.innerText = "Original tweet from ";

      let retweetedLogin = document.createElement("a");
      retweetedLogin.classList.add("tweets__login");
      retweetedLogin.classList.add("u-link-darkbg");
      retweetedLogin.href = "https://twitter.com/" + data.retweeted_status.user.screen_name + "/status/" + data.retweeted_status.id_str;
      retweetedLogin.innerText = "@" + data.retweeted_status.user.screen_name;

      retweetedInfo.appendChild(retweetedLogin);
      content.appendChild(retweetedInfo);
    }

    let text = document.createElement("p");
    text.classList.add("tweets__text");
    text.innerHTML = data.text;

    let bottom = document.createElement("p");
    bottom.classList.add("tweets__bottom");

    // let logo = document.createElement("img");
    // logo.classList.add("tweets__logo");
    // logo.src = "img/twitter_logo.svg";
    // logo.alt = "twitter";
    
    let logo = document.createElement("a");
    logo.classList.add("tweets__logo");
    logo.href = "https://twitter.com/";
    logo.target = "_blank";    
    logo.alt = "twitter";

    let dateLink = document.createElement("a");
    dateLink.classList.add("u-link-darkbg");
    dateLink.href = "https://twitter.com/" + data.user.screen_name + "/status/" + data.id_str;
    // dateLink.innerText = Date.parse(data.created_at);
    dateLink.innerText = new Date(moment(data.created_at, "ddd MMM DD HH:mm:ss ZZ YYYY")).toLocaleString([], {
      day: 'numeric',
      month: 'short'
    });
    // dateLink.innerText = new Date(Date.parse(data.created_at)).toLocaleString([], {
    //   day: 'numeric',
    //   month: 'short'
    // });
  
    author.appendChild(name);
    author.appendChild(document.createElement("br"));
    author.appendChild(login);
    
    header.appendChild(avatar);
    header.appendChild(author);

    // content.appendChild(text); // retweet
    content.appendChild(text);
    // content.appendChild(text); // quote
  
    bottom.appendChild(dateLink);
    bottom.appendChild(logo);
  
    tweetEl.appendChild(header);
    tweetEl.appendChild(content);
    tweetEl.appendChild(bottom);
  
    tweetsFragment.appendChild(tweetEl);
  }
}

// TODO dynamically create links in DOM using JSON data
function injectLinks() {}

function toggleClassOnFetch() {
  loaderContainer.classList.add("u-dnone");
  loaderContainer.classList.remove("u-dflex");
  // tweetsContainer.classList.add("u-dflex");
  tweetsOverflow.classList.add("a-tweets__loaded");
  tweetsOverflow.classList.remove("u-dnone");
}


fetch('http://delpher.pl/twittertribute.php')
  .then(function(response) {
    return response.json();
  })
  .then(function(response) {
    // showTweets(response);
    toggleClassOnFetch();
    takeUserNames(response);
    showTweets(response);
    updateTweets(tweetsCollection);
    updateScrollbar();
    updateOffset();
  }).catch(function (err) {
    console.log("FETCH ERROR: ", err);    
  });


form.addEventListener('change', function(e){
  if(e.target.id !== formAll.id && e.target.checked === false && formAll.checked === true ){
    formAll.checked = false;
  }
  if( Array.prototype.every.call(formCheckboxes, el => el.checked === true)){
    formAll.checked = true;
  }
  updateFilters();
  updateTweets(tweetsCollection);
  moveTweets();
  updateScrollbar(false);
},false);

formAll.addEventListener('change', function(e){
  if(e.target.checked === true){
    Array.prototype.forEach.call(formCheckboxes, el => { el.checked = true; });
  }
  updateFilters();
  updateTweets(tweetsCollection);
  moveTweets();
  updateScrollbar();
},false);

tweetsContainer.addEventListener('transitionend', function () {
  updateScrollbar();
},false);

tweetsSection.addEventListener('touchstart', function(e){
  dragStartTime = + new Date();
  dragStartX = e.touches[0].clientX;
},false);

tweetsSection.addEventListener('touchend', function(e){
  dragDeltaX = e.changedTouches[0].clientX - dragStartX;
  if ( + new Date() - dragStartTime > dragTimeThreshold ) {
    return false;
  }
  if ( dragDeltaX > 0  ) {
    moveTweets(-1);
    updateScrollbar();
  };
  if ( dragDeltaX < 0  ) {
    moveTweets(1);
    updateScrollbar();
  };
},false);

tweetsSection.addEventListener('mousedown', function(e){
  dragStartTime = + new Date();
  dragStartX = e.clientX;
},false);

tweetsSection.addEventListener('mouseup', function(e){
  if ( + new Date() - dragStartTime > dragTimeThreshold ) {
    return false;
  }

  dragDeltaX = e.clientX - dragStartX;
  if ( dragDeltaX > dragThreshold  ) {
    moveTweets(-1);
    updateScrollbar();
  };
  if ( dragDeltaX < -dragThreshold  ) {
    moveTweets(1);
    updateScrollbar();
  };

  dragStartX = -1;
  dragDeltaX = -1;
},false);


function moveTweets(val) {
  tweetsOffsetCount += val || 0;
  // CHANGE "2" TO VARIABLE ///////////////////////////////////////////////////////////////////  
  if ( tweetsOffsetCount > tweetsVisibleCount - 2 ) {
    tweetsOffsetCount = tweetsVisibleCount - 2;
  }
  if ( tweetsOffsetCount < 0 ) {
    tweetsOffsetCount = 0;
  }
  tweetsContainer.style.transform = "translateX(" + tweetsOffsetCount * offsetX + "px)";  
}


leftButton.addEventListener("click", function(e){
  if( tweetsOffsetCount > 0 ){
    moveTweets(-1);
    updateScrollbar();
  }
  e.stopPropagation();
},false);

rightButton.addEventListener("click", function(e){
  if( tweetsOffsetCount < tweetsVisibleCount - 2 ){
    moveTweets(1);
    updateScrollbar();
  }
  e.stopPropagation();
},false);

leftButton.addEventListener("mousedown", function(e){
  e.stopPropagation();
},false);
leftButton.addEventListener("mouseup", function(e){
  e.stopPropagation();
},false);
rightButton.addEventListener("mousedown", function(e){
  e.stopPropagation();
},false);
rightButton.addEventListener("mouseup", function(e){
  e.stopPropagation();
},false);

window.addEventListener("resize", function(){
  updateOffset();
  updateScrollbar();
},false);