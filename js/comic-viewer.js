/**************************************

 ** NAVIGATION

 **************************************/
//
const aPages = [];
const pageMarkers = document.querySelectorAll(".menu-item-trigger");
pageMarkers.forEach(function(btn, index) {
  btn.addEventListener('click', function() {
    goToPageMarker(index);
  });
  aPages.push(btn);
});
//
const mainStage = document.getElementById("mainstage");
var imagestage;
//
function addImageSequence() {
  for(var i = 0; i < aPages.length; i++) {
    imagestage = document.createElement("img");
    imagestage.setAttribute("id", "imgstage");
    imagestage.setAttribute("alt", "loaded bitmap");
    imagestage.name = "img" + i;
    imagestage.src = aComicBookPages[i];
    imagestage.style.position = "relative";
    imagestage.style.width = "100%";
    imagestage.style.height = "auto";
    imagestage.style.zIndex = i + 1;
    imagestage.style.visibility = "hidden";
    mainStage.insertBefore(imagestage, mainStage.childNodes[0]);
  }
}
//end function
//
function goToPageMarker(id) {
  imagestage.src = aComicBookPages[id];
  imagestage.style.zIndex = id;
  imagestage.style.visibility = "visible";
}
//end function
/**************************************

 ** AUTO PLAY & LINEAR NAVIGATION

 **************************************/
//
var ss;
var ssDelay = 1000;
var currentImg = 0;
var isPlaying = false;
var prevB = document.getElementById('prevBtn');
var nextB = document.getElementById('nextBtn');
//
function changeImages() {
  currentImg++;
  if(currentImg === aComicBookPages.length - 1) {
    stopSequence();
  }
  //
  goToPageMarker(currentImg);
  aPages[currentImg].focus();
  //
  getDataFromNetwork(currentImg);
  getDataFromCache(currentImg);
}
//end function
//
function playSequence(num) {
  ss = setInterval(changeImages, num);
}
//end function
//
function stopSequence() {
  clearInterval(ss);
}
//end function
//
function linearNav() {
  prevB.addEventListener('click', function() {
    if(currentImg == 0) {
      return;
      aPages[0].focus();
    }
    currentImg--;
    goToPageMarker(currentImg);
    //console.log(e.currentTarget);
  });
  //
  nextB.addEventListener('click', function() {
    if(currentImg == aComicBookPages.length - 1) {
      return;
    }
    currentImg++;
    goToPageMarker(currentImg);
  });
}
//end function
//
function getDataFromNetwork() {
  return fetch(`currentImg`)
    .then(response => {
      return response.json();
    })
    .catch(() => {
      return null;
    });
}
//end function
//
function getDataFromCache() {
  if(!('caches' in window)) {
    return null;
  }
  return caches.match(`currentImg`)
    .then((response) => {
      if(response) {
        return response.json();
      }
      return null;
    })
    .catch((err) => {
      console.error('Error getting data from cache', err);
      return null;
    });
}
//end function
//
/*******************************************************

 ** INIT APP

 *******************************************************/
function init() {
  addImageSequence();
  linearNav();
  goToPageMarker(0);
}
//end function
//
init();