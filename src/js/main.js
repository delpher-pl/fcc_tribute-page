// $(function(){

//   $('form').submit(function(ev){
//     let $input = $(ev.target).find('input');
//     console.log(ev.target);
//     let comment = $input.val();

//     if(comment != "") {
//       let html = $('<li>').text(comment);
//       html.prependTo('#comments');
//     }

//     return false;
//   });

// });



/*
let sidebarMenu = document.querySelector('.sidebar-menu');
let sidebarMenuHandler = function(ev){
  ev.path.some(function (el) {
    if(el.tagName.toLowerCase() === "a"){
      console.log(el);
      return true;
    }
    return false;
  });
  console.log(ev.target.tagName);
  if(ev.target.tagName.toLowerCase() === "a"){
    console.log(1);

  }
  // console.log(ev.target);
  // console.log(ev.srcElement);
  // console.log(ev);
};
sidebarMenu.addEventListener("click",sidebarMenuHandler);
*/

let form1Location = document.querySelector("#form1__location");
form1Location.addEventListener("change", function(ev){
  console.log(ev.target);
  ev.target.classList.remove("uu-placeholder");    
});