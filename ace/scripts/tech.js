$("#link4").on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: $("#myFooter").position().top }, "slow");
  });
  
  // view counter lol
  fetch('https://api.kratos23.com/analytics/views');
  
  var myIndex = 0;
  function reset(index) {
    myIndex = index;
  
    resetMany(myIndex);
  }
  
  function triggerDisplay(index) {
    myIndex = index;
  
    displayMany(myIndex);
  }
  
  //added alignment to navbar
  var navbaralignment = document.getElementById('pages');
  function adjustNavbarAlignment() {
    if (window.innerWidth <= 1200) {
      navbaralignment.classList.remove('justify-content-center');
      navbaralignment.classList.add('justify-content-end');
      navbaralignment.style.marginRight = "5em";
    }
    if (window.innerWidth > 1200) {
      navbaralignment.classList.add('justify-content-center');
      navbaralignment.classList.remove('justify-content-end');
    }
  }
  $(window).resize(adjustNavbarAlignment);
  $('body').ready(adjustNavbarAlignment);
  
  function displayMany(i) {
    var plus = document.getElementById(`plus${i}`);
    var details = document.getElementById(`details${i}`);
    var vl = document.getElementById(`vl${i}`);
    var bText = document.getElementById(`bText${i}`);
    var content = document.getElementById(`content${i}`);
    var upArrow = document.getElementById(`upArrow${i}`);
    var rules = document.getElementById(`cardRules${i}`);
    var card = document.getElementById(`card${i}`);
    var cardImg = document.getElementById(`cardImage${i}`);
    var regButton = document.getElementById(`regButton${i}`);
  
    if (window.innerWidth >= 768) {
      card.style.width = '100%';
      cardImg.style.width = '33%';
    } else {
      card.style.width = 'auto';
      cardImg.style.width = '100%';
    }
    details.style.display = 'flex';
    vl.style.display = 'flex';
    bText.style.display = 'flex';
    content.style.display = 'flex';
    upArrow.style.display = 'flex';
    rules.style.display = 'inline-block';
    plus.style.display = 'none';
    regButton.style.display = 'flex'
  
    setTimeout(function () {
      setOpacity(i);
    }, 300);
  }
  
  function setOpacity(i) {
    var plus = document.getElementById(`plus${i}`);
    var details = document.getElementById(`details${i}`);
    var vl = document.getElementById(`vl${i}`);
    var bText = document.getElementById(`bText${i}`);
    var content = document.getElementById(`content${i}`);
    var upArrow = document.getElementById(`upArrow${i}`);
    var rules = document.getElementById(`cardRules${i}`);
    var card = document.getElementById(`card${i}`);
    var cardImg = document.getElementById(`cardImage${i}`);
    var regButton = document.getElementById(`regButton${i}`);
  
    details.style.opacity = '1.0';
    vl.style.opacity = '1.0';
    content.style.opacity = '1.0';
    bText.style.opacity = '1.0';
    upArrow.style.opacity = '1.0';
    plus.style.opacity = '1.0';
    rules.style.opacity = '1.0';
    regButton.style.opacity = '1.0';
  }
  
  function setDisplayTime(i) {
    var plus = document.getElementById(`plus${i}`);
    var details = document.getElementById(`details${i}`);
    var vl = document.getElementById(`vl${i}`);
    var bText = document.getElementById(`bText${i}`);
    var content = document.getElementById(`content${i}`);
    var upArrow = document.getElementById(`upArrow${i}`);
    var rules = document.getElementById(`cardRules${i}`);
    var card = document.getElementById(`card${i}`);
    var cardImg = document.getElementById(`cardImage${i}`);
    var regButton = document.getElementById(`regButton${i}`);
  
    cardImg.style.width = '100%';
    if (window.innerWidth >= 768) {
      card.style.width = '25%';
    } else {
      card.style.width = 'auto';
    }
     
    details.style.display = 'none';
    vl.style.display = 'none';
    content.style.display = 'none';
    bText.style.display = 'none';
    upArrow.style.display = 'none';
    plus.style.display = 'flex';
    rules.style.display = 'none';
    regButton.style.display = 'none';
  
  }
  
  function resetMany(i) {
    var plus = document.getElementById(`plus${i}`);
    var details = document.getElementById(`details${i}`);
    var vl = document.getElementById(`vl${i}`);
    var bText = document.getElementById(`bText${i}`);
    var content = document.getElementById(`content${i}`);
    var upArrow = document.getElementById(`upArrow${i}`);
    var rules = document.getElementById(`cardRules${i}`);
    var card = document.getElementById(`card${i}`);
    var cardImg = document.getElementById(`cardImage${i}`);
    var regButton = document.getElementById(`regButton${i}`);
  
    details.style.opacity = '0';
    vl.style.opacity = '0';
    bText.style.opacity = '0';
    content.style.opacity = '0';
    upArrow.style.opacity = '0';
    rules.style.opacity = '0';
    regButton.style.opacity = '0';
  
    setTimeout(function () {
      setDisplayTime(myIndex);
    }, 300);
  }
  
  var sympo = document.getElementsByClassName('sympo')[0];
  var tech = document.getElementsByClassName('tech')[0];
  var ntech = document.getElementsByClassName('ntech')[0];
  
  
  $('#techButton').click((e) => {
    e.preventDefault();
    techClick();
    $("html, body").animate(
      { scrollTop: $(".banner").position().top },
      "slow"
    );
  });
  
  $('#workshopButton').click((e) => {
    e.preventDefault();
    sympoClick();
    $("html, body").animate(
      { scrollTop: $(".banner").position().top },
      "slow"
    );
  });
  
  $('#homeButton').click((e) => {
    e.preventDefault();
    homeClick();
    $("html, body").animate(
      { scrollTop: $(".banner").position().top },
      "slow"
    );
  });
  
  $('#nonTechbutton').click((e) => {
    e.preventDefault();
    ntechClick();
    $("html, body").animate(
      { scrollTop: $(".banner").position().top },
      "slow"
    );
  });
  //may use in future
  // $('#contributorsButton').click((e) => {
  //   e.preventDefault();
  //   contributorsClick();
  //   $("html, body").animate(
  //     { scrollTop: $(".banner").position().top },
  //     "slow"
  //   );
  // });
  
  function sympoClick() {
    displayWorkshop();
    updateSlides('workshop');
  }
  
  function techClick() {
    displaytech();
    updateSlides('technical');
  }
  
  function ntechClick() {
    displayntech();
    updateSlides('nonTechnical');
  }
  function contributorsClick(){
    displaycontributors();
  }
  
  //displaying card holder
  var technicalPage = document.getElementById('technicalPage');
  var nontechnicalPage = document.getElementById('nontechnicalPage');
  // var workshopPage = document.getElementById('workshopPage');
  var homePage = document.getElementById('mainPage');
  var contributorsPage=document.getElementById('contributorsPage');
  var slideshowContainer = document.getElementById('slideshowContainer');
  var markers = document.getElementById('slideshowMarkers');
  var bannerVideo = document.getElementById('video');
  var navbarMobileAnimation = document.getElementsByClassName('navbar-collapse');
  var footerContact=document.getElementById('myFooter');
  //hacky way of fixing the bug xd
  contributorsPage.style.display='none';
  
  function displayWorkshop() {
    $('.register-btn-section').css('display', 'flex')
    // workshopPage.style.display = 'flex';
    nontechnicalPage.style.display = 'none';
    technicalPage.style.display = 'none';
    homePage.style.display = 'none';
    contributorsPage.style.display='none';
  
    bannerVideo.style.display = 'none';
    slideshowContainer.style.display = 'flex';
    markers.style.display = 'flex';
    footerContact.style.display='flex';
  }
  
  function displaytech() {
    $('.register-btn-section').css('display', 'flex')
    // workshopPage.style.display = 'none';
    nontechnicalPage.style.display = 'none';
    technicalPage.style.display = 'flex';
    homePage.style.display = 'none';
    contributorsPage.style.display='none';
  
    bannerVideo.style.display = 'none';
    slideshowContainer.style.display = 'flex';
    markers.style.display = 'flex';
    footerContact.style.display='flex';
  
  }
  
  function displayntech() {
    $('.register-btn-section').css('display', 'flex')
    // workshopPage.style.display = 'none';
    nontechnicalPage.style.display = 'flex';
    technicalPage.style.display = 'none';
    homePage.style.display = 'none';
    contributorsPage.style.display='none';
  
    bannerVideo.style.display = 'none';
    slideshowContainer.style.display = 'flex';
    markers.style.display = 'flex';
    footerContact.style.display='flex';
  
  }
  
  function homeClick() {
    $('.register-btn-section').css('display', 'none')
  
    homePage.style.display = 'flex';
    // workshopPage.style.display = 'none';
    nontechnicalPage.style.display = 'none';
    technicalPage.style.display = 'none';
    contributorsPage.style.display='none';
  
    bannerVideo.style.display = 'flex';
    slideshowContainer.style.display = 'none';
    markers.style.display = 'none';
    footerContact.style.display='flex';
  
  }
  
  
  function displaycontributors(){
    homePage.style.display = 'none';
    // workshopPage.style.display = 'none';
    nontechnicalPage.style.display = 'none';
    technicalPage.style.display = 'none';
    contributorsPage.style.display='flex';
    bannerVideo.style.display = 'flex';
    slideshowContainer.style.display = 'none';
    markers.style.display = 'none';
    footerContact.style.display='none';
  
  }
   
  AOS.init({
    duration: 1000,
  })