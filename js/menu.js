var $menuElement = $('[data-name="Swipe"]');
var menuInstanceId = $menuElement.data('id');

if (menuInstanceId) {
  init();
}

function init() {
  var data = Fliplet.Widget.getData(menuInstanceId) || {};
  var deviceWidth = $('body').width();
  var tabletBreakPoint = 640;

  Fliplet.Hooks.on('addExitAppMenuLink', function() {
    var $exitButton = $([
      '<li class="linked with-icon" data-fl-exit-app>',
      '<div class="fl-menu-icon">',
      '<i class="fa fa-fw fa-sign-out"></i>',
      '</div>',
      '<i class="fa fa-angle-right linked-icon" aria-hidden="true"></i>',
      '<span class="internal-link buttonControl">' + T('widgets.menu.sequential.actions.exit') + '</span>',
      '</li>'
    ].join(''));

    $exitButton.on('click', function onExitClick() {
      Fliplet.Navigate.exitApp();
    });

    $menuElement.find('ul').append($exitButton);

    // Prevent default "Exit" link from being added
    return Promise.reject();
  });

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

    $menuElement.translate();

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

    function goToNextScreen() {
      var linkAction = $('.fl-viewport-header li.active').next().data('fl-action');

      if (linkAction) {
        Fliplet.Navigate.to(linkAction);
      }
    }

    function goToPrevScreen() {
      var linkAction = $('.fl-viewport-header li.active').prev().data('fl-action');
      var revertLinkAction;

      if (linkAction) {
        revertLinkAction = revertTransition(linkAction);
        Fliplet.Navigate.to(revertLinkAction);
      }
    }

    function attachBarHandlers() {
      // Selects current dot
      $('.fl-viewport-header li[data-page-id="' + pageId + '"]').addClass('active');

      // Click events
      $('.fl-viewport-header .nav-right-arrow').on('click keydown', function(event) {
        if (event.type !== 'click' && event.which !== 32 && event.which !== 13) {
          return;
        }

        goToNextScreen();
      });

      $('.fl-viewport-header .nav-left-arrow').on('click keydown', function(event) {
        if (event.type !== 'click' && event.which !== 32 && event.which !== 13) {
          return;
        }

        goToPrevScreen();
      });

      $menuElement.on('keydown', function(event) {
        switch (event.which) {
          // Right arrow
          case 39:
            goToNextScreen();

            break;
          // Left arrow
          case 37:
            goToPrevScreen();

            break;
          default:
            break;
        }
      });

      // Swipe events
      Fliplet.Navigator.toggleSwipeBack(false);

      var body = document.body;
      var hammer = new Hammer(body);

      hammer.on('swipeleft', function() {
        goToNextScreen();
      });
      hammer.on('swiperight', function(event) {
        event.stopPropagation();
        goToPrevScreen();
      });

      $('.fl-menu-overlay').click(function() {
        $(this).closest('.fl-menu').removeClass('active');
        $('.hamburger').removeClass('is-active');
        $('.fl-menu').addClass('hidden');
      });

      $('[open-about-overlay]').on('click', function() {
        Fliplet.Navigate.to({
          action: 'about-overlay'
        });
      });

      $('[data-fl-toggle-menu]').on('click keydown', function(event) {
        if (event.type !== 'click' && event.which !== 32 && event.which !== 13) {
          return;
        }

        $menuElement.find('.fl-menu.fl-app-menu').toggleClass('hidden');

        setTimeout(function() {
          $('.fl-viewport-header .hamburger').toggleClass('is-active');

          if (event.type === 'keydown') {
            $('body').find('.fl-menu').toggleClass('active');
          }
        }, 0);
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
        var revertLinkAction;

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
