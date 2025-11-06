//* ======================== Slide Control ===================== */
// Find all dot menus on the page
var menus = document.getElementsByClassName("dots");
for (let k = 0; k < menus.length; k++) {
  let menu = menus[k];
  menu.addEventListener("click", function(e) {
    // Only respond to clicks on .dot elements (not the <ul> or something else)
    if (!e.target.classList.contains('dot')) return;
    const dots = Array.from(this.children).filter(el => el.className.indexOf('dot') > -1);
    const idx = dots.indexOf(e.target);

    if (idx >= 0) {
      // Remove "active" from previous .dot in this menu, and set on clicked dot
      var prev = this.querySelector(".dot.active");
      if (prev) prev.classList.remove("active");
      e.target.classList.add("active");

      // Find the slide-content siblings. The parent .slide-menu is a sibling of several .slide-content divs (see html snippet)
      // So this menu's parent is the slide-menu container's parent (e.g., .container)
      // We want the .slide-content elements under the same parent as this menu
      var container = menu.closest('.container');
      if (!container) return;
      var localContents = container.getElementsByClassName("slide-content");
      for (var i = 0; i < localContents.length; i++) {
        if (i == idx) {
          localContents[i].style.display = "block";
        } else {
          localContents[i].style.display = "none";
        }
      }
    }
  });
}

//* ======================== Video Control ===================== */
function ToggleVideo(x) {
  var videos = document.getElementsByClassName(x + '-video');
  for (var i = 0; i < videos.length; i++) {
      if (videos[i].paused) {
          videos[i].play();
      } else {
          videos[i].pause();
      }
  }
};


function SlowVideo(x) {
  var videos = document.getElementsByClassName(x + '-video');
  for (var i = 0; i < videos.length; i++) {
    videos[i].playbackRate = videos[i].playbackRate * 0.9;
    videos[i].play();
  }
  
  var msg = document.getElementById(x + '-msg');
  msg.innerHTML = 'Speed: ' + '×' + videos[0].playbackRate.toFixed(2);

  msg.classList.add("fade-in-out");
  msg.style.animation = 'none';
  msg.offsetHeight; /* trigger reflow */
  msg.style.animation = null; };


function FastVideo(x) {
  var videos = document.getElementsByClassName(x + '-video');
  for (var i = 0; i < videos.length; i++) {
    videos[i].playbackRate = videos[i].playbackRate / 0.9;
    videos[i].play();
  }

  var msg = document.getElementById(x + '-msg');
  msg.innerHTML = 'Speed: ' + '×' + videos[0].playbackRate.toFixed(2);

  msg.classList.add("fade-in-out");
  msg.style.animation = 'none';
  msg.offsetHeight; /* trigger reflow */
  msg.style.animation = null; 
};

function RestartVideo(x) {
  var videos = document.getElementsByClassName(x + '-video');
  for (var i = 0; i < videos.length; i++) {
    videos[i].pause();
    videos[i].playbackRate = 1.0;
    videos[i].currentTime = 0;
    videos[i].play();
  }
  
  var msg = document.getElementById(x + '-msg');
  msg.innerHTML = 'Speed: ' + '×' + videos[0].playbackRate.toFixed(2);

  msg.classList.add("fade-in-out");
  msg.style.animation = 'none';
  msg.offsetHeight; /* trigger reflow */
  msg.style.animation = null; 
};

// //* ======================== Slide Show Control ===================== */
// const slider = document.querySelector('.container .slider');
// const [btnLeft, btnRight] = ['prev_btn', 'next_btn'].map(id => document.getElementById(id));
// let interval;

// // Set positions
// const setPositions = () => 
//     [...slider.children].forEach((item, i) => 
//         item.style.left = `${(i-1) * 440}px`);

// // Initial setup
// setPositions();

// // Set transition speed
// const setTransitionSpeed = (speed) => {
//     [...slider.children].forEach(item => 
//         item.style.transitionDuration = speed);
// };

// // Slide functions
// const next = (isAuto = false) => { 
//     setTransitionSpeed(isAuto ? '1.5s' : '0.2s');
//     slider.appendChild(slider.firstElementChild); 
//     setPositions(); 
// };

// const prev = () => { 
//     setTransitionSpeed('0.2s');
//     slider.prepend(slider.lastElementChild); 
//     setPositions(); 
// };

// // Auto slide
// const startAuto = () => interval = interval || setInterval(() => next(true), 2000);
// const stopAuto = () => { clearInterval(interval); interval = null; };

// // Event listeners
// btnRight.addEventListener('click', () => next(false));
// btnLeft.addEventListener('click', prev);

// // Mouse hover controls
// [slider, btnLeft, btnRight].forEach(el => {
//     el.addEventListener('mouseover', stopAuto);
//     el.addEventListener('mouseout', startAuto);
// });

// // Start auto slide
// startAuto();


// * ======================== Slide Show Control ===================== */
function toPx(value, slider) {
  if (value == null || value === '') return NaN;
  const sliderWidth = slider.clientWidth || slider.offsetWidth;
  const sliderHeight = slider.clientHeight || slider.offsetHeight;
  const s = String(value).trim();
  if (s.endsWith('vw')) return (parseFloat(s) / 100) * sliderWidth;
  if (s.endsWith('vh')) return (parseFloat(s) / 100) * sliderHeight;
  if (s.endsWith('px')) return parseFloat(s);
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

document.querySelectorAll('.slideshow').forEach((host) => {
  const slider   = host.querySelector('.slider');
  const btnLeft  = host.querySelector('.prev_btn');
  const btnRight = host.querySelector('.next_btn');
  if (!slider || !btnLeft || !btnRight) return;

  let interval;
  let offset = 20;

  // Base width per slideshow (fallback 400). Step is base + 40 (padding-left in CSS).
  // const base = Number(host.dataset.width) || 400;
  // const step = base + 40;
  // console.log("Step: " + step);
  let base = toPx(host.dataset.width, slider);
  let padding = toPx(host.dataset.padding, slider);
  if (!Number.isFinite(base)) base = 400;
  if (!Number.isFinite(padding)) padding = 20;
  let step = base + 2 * padding;
  console.log('Step:', step);

  function updateSliderHeight() {
    let max = 0;
    slider.querySelectorAll('.slider-item img, .slider-item video').forEach((el) => {
      const natW = el.naturalWidth  || el.videoWidth  || el.clientWidth;
      const natH = el.naturalHeight || el.videoHeight || el.clientHeight;
      if (natW > 0) {
        const scaledH = (natH / natW) * base; // base is the computed slide width
        if (scaledH > max) max = scaledH;
      }
    });
    if (max > 0) slider.style.height = `${Math.ceil(max)}px`;
  }

  const setPositions = () => {
    [...slider.children].forEach((item, i) => {
      item.style.left = `${(i - 2) * step + offset}px`;
      item.style.width = `${base}px`;
    });
    updateSliderHeight();
  };

  const setTransitionSpeed = (speed) => {
    [...slider.children].forEach((item) => {
      item.style.transitionDuration = speed;
    });
  };

  const next = (isAuto = false) => {
    setTransitionSpeed(isAuto ? '1.5s' : '0.2s');
    slider.appendChild(slider.firstElementChild);
    setPositions();
  };

  const prev = () => {
    setTransitionSpeed('0.2s');
    slider.prepend(slider.lastElementChild);
    setPositions();
  };

  const startAuto = () => {
    if (!interval) interval = setInterval(() => next(true), 3000);
  };
  const stopAuto = () => {
    clearInterval(interval);
    interval = null;
  };

  const recalc = () => {
    const parsed = toPx(host.dataset.width, slider);
    const parsedPadding = toPx(host.dataset.padding, slider);
    base = Number.isFinite(parsed) ? parsed : 400;
    padding = Number.isFinite(parsedPadding) ? parsedPadding : 20;
    step = base + 2 * padding;

    const sliderWidth = slider.clientWidth || slider.offsetWidth;
    const remainderWidth = (sliderWidth % step);
    offset = (padding + remainderWidth / 2);
    console.log(offset);
    setTransitionSpeed('0.01s'); // force immediate transition
    setPositions();
  };
  
  // run once and whenever the viewport changes
  recalc();
  window.addEventListener('resize', recalc);

  btnRight.addEventListener('click', () => next(false));
  btnLeft.addEventListener('click', prev);

  [slider, btnLeft, btnRight].forEach((el) => {
    el.addEventListener('mouseover', stopAuto);
    el.addEventListener('mouseout', startAuto);
  });

  setPositions();
  startAuto();
});
