let browserWidth = window.innerWidth;
let margin = 30; //px

let imagesList = [
  'img/img1.jpg',
  'img/img2.jpg',
  'img/img3.jpg',
  'img/img4.jpg',
  'img/img5.jpg'
];

let imgFullSizePostfix = "_full";
let galleryContainer = document.querySelector("#top-gallery__images");
let firstImage = galleryContainer.querySelector("img");
let imageWidth = firstImage.offsetWidth;
let imgCount = galleryContainer.childElementCount;
let imgRequired = 2*(~~(browserWidth/(imageWidth+margin))+1);


function updateGallery() {

  if( imgCount < imgRequired ){
    let imgEl;
    let altAttr = firstImage.getAttribute('alt');
    for( let i = imgCount; i < imgRequired; i++ ){
      imgEl = document.createElement("img");
      imgEl.setAttribute("alt", altAttr);
      imgEl.src = imagesList[i%imagesList.length];
      imgEl.classList.add("top-gallery__img");
      galleryContainer.appendChild(imgEl);
    }
  }
  
  if( imgCount > imgRequired ){
    for(let i = imgCount; i>imgRequired; i--){
      galleryContainer.removeChild(galleryContainer.lastChild);
    }
  }

}

updateGallery();

window.addEventListener("resize",function(){
  browserWidth = window.innerWidth;
  imageWidth = firstImage.offsetWidth;
  imgCount = galleryContainer.childElementCount;
  imgRequired = 2 * ( ~~(browserWidth / (imageWidth + margin)) + 1 );

  updateGallery();
});










































