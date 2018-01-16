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

  // Selects current dot
	$('li[data-page-id="' + pageId + '"]').addClass('active');

  // Click events
  $('.fl-menu-arrow.fl-menu-next').on('click', function() {
    var linkAction = $('li.active').next().not('.fl-menu-arrow').data('fl-navigate');
    Fliplet.Navigate.to(linkAction);
  });
  $('.fl-menu-arrow.fl-menu-prev').on('click', function() {
    var linkAction = $('li.active').prev().not('.fl-menu-arrow').data('fl-navigate');
    Fliplet.Navigate.to(linkAction);
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

    if (linkAction) {
      Fliplet.Navigate.to(linkAction);
    }
  });

  checkNavigation();
  // Show menu
  $('ul.main-menu').addClass('init');
});;