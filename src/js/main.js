(function(window) {
  var toggleCodeBtn = document.getElementById('toggle-code'),
      aboutCode = document.getElementById('code-about'),
      aboutBare = document.getElementById('bare-about'),
      aboutSection = document.getElementById('about');

  var menuBtn = document.getElementById('menu-btn'),
      menuNav = document.getElementById('main-nav'),
      mainMenu = document.querySelector('ul[role="menubar"]'),
      mastHead = document.getElementById('masthead');

  menuBtn.addEventListener('click', function(e) {
    menuBtn.classList.toggle('active');
    mainMenu.classList.toggle('active');
  }, false);

  toggleCodeBtn.addEventListener('click', function(e) {
    var aboutRect = aboutSection.getBoundingClientRect(),
        bareRect = aboutBare.getBoundingClientRect();
    if(e.target.classList.contains('active')) {
      e.target.classList.remove('active');
      aboutCode.classList.remove('active');
      var delayDisplay = window.setTimeout(function() {
        aboutCode.style.display = 'none';
        aboutBare.style.display = 'inline-block';
        window.clearTimeout(delayDisplay);
      }, 1100);
    } else {
      aboutCode.style.top = '0px';
      aboutCode.style.right = '-'+aboutRect.width+'px';
      aboutCode.style.display = 'inline-block';
      aboutBare.style.left = '-'+aboutRect.width+'px';
      var delayDisplay = window.setTimeout(function() {
        aboutBare.style.display = 'none';
        aboutCode.classList.add('active');
        window.clearTimeout(delayDisplay);
      }, 500);
      e.target.classList.add('active');
    }
  }, false);

  function positionNav() { 
    if(window.innerWidth < 740) {
      if(!mainMenu.classList.contains('side-menu')) {
        mainMenu.classList.add('side-menu');
        menuNav.removeChild(mainMenu);
        mastHead.appendChild(mainMenu);
      }
    } else {
      if(mainMenu.classList.contains('side-menu')) {
        mastHead.removeChild(mainMenu);
        menuNav.insertBefore(mainMenu, menuBtn);
        mainMenu.classList.remove('side-menu');
      }
    }
  }

  window.addEventListener('load', positionNav, false);
  window.onresize = positionNav;

})(window);
