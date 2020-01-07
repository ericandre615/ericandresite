(function(window) {
  var menuBtn = document.getElementById('menu-btn'),
      menuNav = document.getElementById('main-nav'),
      mainMenu = document.querySelector('ul[role="menubar"]'),
      mastHead = document.getElementById('masthead');

  var copyDate = document.getElementById('copy-date');
  copyDate.innerText = new Date().getFullYear();

  menuBtn.addEventListener('click', function(e) {
    menuBtn.classList.toggle('active');
    mainMenu.classList.toggle('active');
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
