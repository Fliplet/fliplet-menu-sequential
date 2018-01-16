Fliplet().then(function() {
	var pageId = Fliplet.Env.get('pageId');

  function checkNavigation() {
    var backNavigation = $('li.active').prev().not('.fl-menu-arrow').length;
    var forwardNavigation = $('li.active').next().not('.fl-menu-arrow').length;

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

  // Selects current dot
	$('li[data-page-id="' + pageId + '"]').addClass('active');

  // Click events
  $('.fl-menu-arrow.fl-menu-next').on('click', function() {
    var linkAction = $('li.active').next().not('.fl-menu-arrow').data('fl-navigate');
    Fliplet.Navigate.to(linkAction);
  });
  $('.fl-menu-arrow.fl-menu-prev').on('click', function() {
    var linkAction = $('li.active').prev().not('.fl-menu-arrow').data('fl-navigate');
    var revertLinkAction;

    if (linkAction) {
      revertLinkAction = revertTransition(linkAction);
      Fliplet.Navigate.to(revertLinkAction);
    }
  });

  // Swipe events
  $('.fl-menu-swipe-left-handler').hammer().bind('swipeleft', function() {
    var linkAction = $('li.active').next().not('.fl-menu-arrow').data('fl-navigate');

    if (linkAction) {
      Fliplet.Navigate.to(linkAction);
    }
  });

  $('.fl-menu-swipe-right-handler').hammer().bind('swiperight', function() {
    var linkAction = $('li.active').prev().not('.fl-menu-arrow').data('fl-navigate');
    var revertLinkAction;

    if (linkAction) {
      revertLinkAction = revertTransition(linkAction);
      Fliplet.Navigate.to(revertLinkAction);
    }
  });

  checkNavigation();
  // Show menu
  $('ul.main-menu').addClass('init');
});;