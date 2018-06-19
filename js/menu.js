var $menuElement = $('[data-name="Swipe"]');
var menuInstanceId = $menuElement.data('id');

if (menuInstanceId) {
  init();
}

function init() {
  var data = Fliplet.Widget.getData(menuInstanceId) || {};
  var deviceWidth = $('body').width();
  var tabletBreakPoint = 640;

  if ($('li.with-icon').length) {
    $('.main-menu').addClass('with-icons');
  }

  if (Modernizr.backdropfilter) {
    $('.body').addClass('backdropfilter');
  }

  if (typeof data.style === 'undefined' || data.style === 'bar-menu') {
    $('body').addClass('fl-bar-padding');
  }

  if (data.style === 'controls-menu' || (deviceWidth >= tabletBreakPoint && data.style !== 'bar-menu')) {
    $('body').addClass('fl-minimal-padding');
  }

  if (data.style === 'no-controls-menu') {
    $('.fl-viewport-menu').addClass('to-hide');
  }

  $(window).resize(function() {
    deviceWidth = $('body').width();
    if (deviceWidth <= tabletBreakPoint && data.style === 'no-controls-menu') {
      $('body').removeClass('fl-minimal-padding');
      return;
    }
    if (deviceWidth >= tabletBreakPoint && data.style === 'no-controls-menu') {
      $('body').addClass('fl-minimal-padding');
      return;
    }
  });

  Fliplet().then(function() {
  	var pageId = Fliplet.Env.get('pageId');

    function checkNavigation() {
      var backNavigation = $('.fl-viewport-menu li.active').prev().not('.fl-menu-arrow').length;
      var forwardNavigation = $('.fl-viewport-menu li.active').next().not('.fl-menu-arrow').length;

      $('.fl-viewport-menu').removeClass('hidden');

      if (backNavigation > 0) {
        $('.fl-menu-arrow.fl-menu-prev').addClass('show');
      } else {
        $('.fl-menu-arrow.fl-menu-prev').removeClass('show');
      }
      if (forwardNavigation > 0) {
        $('.fl-menu-arrow.fl-menu-next').addClass('show');
      } else {
        $('.fl-menu-arrow.fl-menu-next').removeClass('show');
      }
    }

    function checkHiddenNavigation() {
      var backNavigation = $('.fl-viewport-header li.active').prev().length;
      var forwardNavigation = $('.fl-viewport-header li.active').next().length;

      $('.fl-viewport-header').removeClass('hidden');

      if (backNavigation > 0) {
        $('.fl-viewport-header .nav-left-arrow').addClass('show');
      } else {
        $('.fl-viewport-header .nav-left-arrow').removeClass('show');
      }
      if (forwardNavigation > 0) {
        $('.fl-viewport-header .nav-right-arrow').addClass('show');
      } else {
        $('.fl-viewport-header .nav-right-arrow').removeClass('show');
      }
    }
    
    function revertTransition(linkAction) {
      var transition;
      var direction;

      transition = (linkAction.transition || 'slide').split('.');
      direction = transition[1] || 'left';
      transition = transition[0];

      switch (direction) {
        case 'up':
          direction = 'down'; break;
        case 'down':
          direction = 'up'; break;
        case 'right':
          direction = 'left'; break;
        default:
          direction = 'right'; break;
      }

      linkAction.transition = transition + '.' + direction;
      return linkAction;
    }

    function attachBarHandlers() {
      // Selects current dot
      $('.fl-viewport-header li[data-page-id="' + pageId + '"]').addClass('active');

      // Click events
      $('.fl-viewport-header .nav-right-arrow').on('click', function() {
        var linkAction = $('.fl-viewport-header li.active').next().data('fl-action');
        Fliplet.Navigate.to(linkAction);
      });

      $('.fl-viewport-header .nav-left-arrow').on('click', function() {
        var linkAction = $('.fl-viewport-header li.active').prev().data('fl-action');
        var revertLinkAction;

        if (linkAction) {
          revertLinkAction = revertTransition(linkAction);
          Fliplet.Navigate.to(revertLinkAction);
        }
      });

      // Swipe events
      Fliplet.Navigator.toggleSwipeBack(false);
      var body = document.body;
      var hammer = new Hammer(body);

      hammer.on('swipeleft', function() {
        var linkAction = $('.fl-viewport-header li.active').next().data('fl-action');

        if (linkAction) {
          Fliplet.Navigate.to(linkAction);
        }
      });
      hammer.on('swiperight', function() {
        var linkAction = $('.fl-viewport-header li.active').prev().data('fl-action');
        var revertLinkAction;

        if (linkAction) {
          revertLinkAction = revertTransition(linkAction);
          Fliplet.Navigate.to(revertLinkAction);
        }
      });

      $('.fl-menu-overlay').click(function() {
        $(this).closest('.fl-menu').removeClass('active');
      });

      $('[open-about-overlay]').on('click', function() {
        Fliplet.Navigate.to({
          action: 'about-overlay'
        });
      });

      $('[data-fl-toggle-menu]').click(function (event) {
        event.preventDefault();
        $('.fl-viewport-header .hamburger').toggleClass('is-active');
      });
    }

    function attachNonBarHandlers() {
      // Selects current dot
      $('.fl-viewport-menu li[data-page-id="' + pageId + '"]').addClass('active');
      
      // Click events
      $('.fl-viewport-menu li[data-fl-action]').on('click', function() {
        var linkAction = $(this).data('fl-action');
        var foundElements = $(this).nextUntil('li.active');
        var lengthOfFound = $(this).nextUntil('li.active').length;

        if (lengthOfFound === 0 || $(foundElements[lengthOfFound - 1]).next().hasClass('active')) {
          revertLinkAction = revertTransition(linkAction);
          Fliplet.Navigate.to(revertLinkAction);
          return;
        }

        Fliplet.Navigate.to(linkAction);
      });

      $('.fl-menu-arrow.fl-menu-next').on('click', function() {
        var linkAction = $('.fl-viewport-menu li.active').next().not('.fl-menu-arrow').data('fl-action');
        Fliplet.Navigate.to(linkAction);
      });
      
      $('.fl-menu-arrow.fl-menu-prev').on('click', function() {
        var linkAction = $('.fl-viewport-menu li.active').prev().not('.fl-menu-arrow').data('fl-action');
        var revertLinkAction;

        if (linkAction) {
          revertLinkAction = revertTransition(linkAction);
          Fliplet.Navigate.to(revertLinkAction);
        }
      });
      
      // Swipe events
      Fliplet.Navigator.toggleSwipeBack(false);
      var body = document.body;
      var hammer = new Hammer(body);
      
      hammer.on('swipeleft', function() {
        var linkAction = $('.fl-viewport-menu li.active').next().not('.fl-menu-arrow').data('fl-action');

        if (linkAction) {
          Fliplet.Navigate.to(linkAction);
        }
      });
      hammer.on('swiperight', function() {
        var linkAction = $('.fl-viewport-menu li.active').prev().not('.fl-menu-arrow').data('fl-action');
        var revertLinkAction;

        if (linkAction) {
          revertLinkAction = revertTransition(linkAction);
          Fliplet.Navigate.to(revertLinkAction);
        }
      });
    }

    // INIT
    if (typeof data.style !== 'undefined' && data.style !== 'bar-menu') {
      attachNonBarHandlers();
      checkNavigation();

      // Show menus
      $('ul.main-menu').addClass('init');
    } else {
      attachBarHandlers();
      checkHiddenNavigation();
    }
  });
}