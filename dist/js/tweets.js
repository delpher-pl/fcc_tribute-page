"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}var moment=require("moment");moment().format();var browserWidth=window.innerWidth,margin=30,filters={},dragStartX=-1,dragDeltaX=-1,dragThreshold=10,dragStartTime=-1,dragTimeThreshold=1e3,form=document.querySelector("#tweets__form"),formAll=document.querySelector("#tweets__form--all"),formCheckboxes=document.querySelectorAll("#tweets__form > [data-profile]"),tweetsSection=document.querySelector("#tweets"),tweetsOverflow=document.querySelector("#tweets__overflow"),tweetsContainer=document.querySelector("#tweets__tweets");tweetsContainer.style.transform="translateX(0px)";var loaderContainer=document.querySelector("#tweets__loader"),tweetsCollection=document.querySelectorAll(".tweets__tweet"),leftButton=document.querySelector("#tweets__nav-button--left"),rightButton=document.querySelector("#tweets__nav-button--right"),track=document.querySelector("#tweets__nav-track"),scrollbar=document.querySelector("#tweets__nav-scrollbar"),tweetsOffsetCount=0,tweetsCount=tweetsCollection.length,tweetsVisibleCount=tweetsCount,tweetWidth=(tweetsContainer.offsetWidth-margin)/2,offsetX=-(tweetWidth+margin);function updateFilters(){Array.prototype.forEach.call(formCheckboxes,function(e){e.checked?filters[e.dataset.profile]=!0:filters[e.dataset.profile]=!1})}function updateTweets(e){tweetsVisibleCount=0,Array.prototype.forEach.call(e,function(e){!0===filters[e.dataset.user]?(e.classList.remove("tweets__hidden"),tweetsVisibleCount+=1):e.classList.add("tweets__hidden")})}function updateScrollbar(){var e=!(0<arguments.length&&void 0!==arguments[0])||arguments[0];scrollbar.style.width=tweetsVisibleCount?100/tweetsVisibleCount*2+"%":"100%",e&&(scrollbar.style.marginLeft=tweetsOffsetCount*(scrollbar.scrollWidth/2)+"px")}function updateOffset(){tweetWidth=(tweetsContainer.offsetWidth-margin)/2,offsetX=-(tweetWidth+margin),tweetsContainer.style.transform="translateX("+tweetsOffsetCount*offsetX+"px)"}function takeUserNames(e){e.forEach(function(e){filters[e[0].user.screen_name.toLowerCase()]=!0})}function showTweets(e){var t,r=(t=[]).concat.apply(t,_toConsumableArray(e));r=r.sort(function(e,t){return Date.parse(t.created_at)-Date.parse(e.created_at)});for(var m=document.createDocumentFragment(),n=0;n<r.length;n++)a(r[n]);function a(e){var t=document.createElement("article");t.dataset.user=e.user.screen_name.toLowerCase(),!1===filters[t.dataset.user]&&t.classList.add("tweets__hidden"),t.classList.add("tweets__tweet"),t.style.backgroundImage="linear-gradient(rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.9)), url('"+e.user.profile_image_url.split("_normal").join("")+"'";var r=document.createElement("div");r.classList.add("tweets__header");var n=document.createElement("img");n.classList.add("tweets__avatar"),n.src=e.user.profile_image_url,n.alt="Avatar";var a=document.createElement("div");a.classList.add("tweets__author");var s=document.createElement("span");s.classList.add("tweets__name"),s.innerText=e.user.name;var o=document.createElement("a");o.classList.add("tweets__login"),o.classList.add("u-link-darkbg"),o.href="https://twitter.com/"+e.user.screen_name,o.innerText="@"+e.user.screen_name;var d=document.createElement("div");if(d.classList.add("tweets__content"),e.retweeted_status){d.classList.add("tweets__content--retweeted");var i=document.createElement("div");i.classList.add("tweets__retweeted"),i.classList.add("u-debug6"),i.innerText="Original tweet from ";var l=document.createElement("a");l.classList.add("tweets__login"),l.classList.add("u-link-darkbg"),l.href="https://twitter.com/"+e.retweeted_status.user.screen_name+"/status/"+e.retweeted_status.id_str,l.innerText="@"+e.retweeted_status.user.screen_name,i.appendChild(l),d.appendChild(i)}var c=document.createElement("p");c.classList.add("tweets__text"),c.innerHTML=e.text;var u=document.createElement("p");u.classList.add("tweets__bottom");var f=document.createElement("a");f.classList.add("tweets__logo"),f.href="https://twitter.com/",f.target="_blank",f.alt="twitter";var w=document.createElement("a");w.classList.add("u-link-darkbg"),w.href="https://twitter.com/"+e.user.screen_name+"/status/"+e.id_str,w.innerText=new Date(moment(e.created_at,"ddd MMM DD HH:mm:ss ZZ YYYY")).toLocaleString([],{day:"numeric",month:"short"}),a.appendChild(s),a.appendChild(document.createElement("br")),a.appendChild(o),r.appendChild(n),r.appendChild(a),d.appendChild(c),u.appendChild(w),u.appendChild(f),t.appendChild(r),t.appendChild(d),t.appendChild(u),m.appendChild(t)}tweetsContainer.appendChild(m),tweetsCollection=document.querySelectorAll(".tweets__tweet"),tweetsCount=tweetsCollection.length,tweetsVisibleCount=tweetsCount}function injectLinks(){}function toggleClassOnFetch(){loaderContainer.classList.add("u-dnone"),loaderContainer.classList.remove("u-dflex"),tweetsOverflow.classList.add("a-tweets__loaded"),tweetsOverflow.classList.remove("u-dnone")}function moveTweets(e){tweetsVisibleCount-2<(tweetsOffsetCount+=e||0)&&(tweetsOffsetCount=tweetsVisibleCount-2),tweetsOffsetCount<0&&(tweetsOffsetCount=0),tweetsContainer.style.transform="translateX("+tweetsOffsetCount*offsetX+"px)"}function fillDebug(){debug.innerHTML="",debug.innerHTML+="BROWSER WIDTH: "+window.innerWidth+"<br/>",debug.innerHTML+="CONTAINER WIDTH: "+tweetsContainer.offsetWidth+" / "+tweetsContainer.scrollWidth+"<br/>",debug.innerHTML+="TWEETS COUNT: "+tweetsCollection.length+"<br/>",debug.innerHTML+="TWEETS VISIBLE: "+tweetsVisibleCount+"<br/>",debug.innerHTML+="TWEET WIDTH: "+(tweetsContainer.offsetWidth-margin)/2+"<br/>",debug.innerHTML+="SCROLLBAR WIDTH: "+scrollbar.style.width+"<br/>",debug.innerHTML+="TRACK WIDTH: "+track.offsetWidth+"<br/>",debug.innerHTML+="tweetsOffsetCount: "+tweetsOffsetCount+"<br/>"}fetch("http://delpher.pl/twittertribute.php").then(function(e){return e.json()}).then(function(e){toggleClassOnFetch(),takeUserNames(e),showTweets(e),updateTweets(tweetsCollection),updateScrollbar(),updateOffset()}).catch(function(e){console.log("FETCH ERROR: ",e)}),form.addEventListener("change",function(e){e.target.id!==formAll.id&&!1===e.target.checked&&!0===formAll.checked&&(formAll.checked=!1),Array.prototype.every.call(formCheckboxes,function(e){return!0===e.checked})&&(formAll.checked=!0),updateFilters(),updateTweets(tweetsCollection),moveTweets(),updateScrollbar(!1),fillDebug()},!1),formAll.addEventListener("change",function(e){!0===e.target.checked&&Array.prototype.forEach.call(formCheckboxes,function(e){e.checked=!0}),updateFilters(),updateTweets(tweetsCollection),moveTweets(),updateScrollbar(),fillDebug()},!1),tweetsContainer.addEventListener("transitionend",function(){updateScrollbar()},!1),tweetsSection.addEventListener("touchstart",function(e){dragStartTime=+new Date,dragStartX=e.touches[0].clientX},!1),tweetsSection.addEventListener("touchend",function(e){if(dragDeltaX=e.changedTouches[0].clientX-dragStartX,+new Date-dragStartTime>dragTimeThreshold)return!1;0<dragDeltaX&&(moveTweets(-1),updateScrollbar()),dragDeltaX<0&&(moveTweets(1),updateScrollbar())},!1),tweetsSection.addEventListener("mousedown",function(e){dragStartTime=+new Date,dragStartX=e.clientX},!1),tweetsSection.addEventListener("mouseup",function(e){if(+new Date-dragStartTime>dragTimeThreshold)return!1;dragDeltaX=e.clientX-dragStartX,dragThreshold<dragDeltaX&&(moveTweets(-1),updateScrollbar()),dragDeltaX<-dragThreshold&&(moveTweets(1),updateScrollbar()),dragDeltaX=dragStartX=-1},!1),setTimeout(function(){leftButton.addEventListener("click",function(e){0<tweetsOffsetCount&&(moveTweets(-1),updateScrollbar(),fillDebug()),e.stopPropagation()},!1),rightButton.addEventListener("click",function(e){tweetsOffsetCount<tweetsVisibleCount-2&&(moveTweets(1),updateScrollbar(),fillDebug()),e.stopPropagation()},!1),leftButton.addEventListener("mousedown",function(e){e.stopPropagation()},!1),leftButton.addEventListener("mouseup",function(e){e.stopPropagation()},!1),rightButton.addEventListener("mousedown",function(e){e.stopPropagation()},!1),rightButton.addEventListener("mouseup",function(e){e.stopPropagation()},!1);document.querySelector("#debug");window.addEventListener("resize",function(){updateOffset(),updateScrollbar(),fillDebug()},!1)},2e3);