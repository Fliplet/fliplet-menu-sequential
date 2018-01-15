var widgetId = Fliplet.Widget.getDefaultId();
var data = Fliplet.Widget.getData(widgetId) || {};

if (data && data.location === 'menu-top') {
  $('#menu-location').val('menuTop').trigger('change');
} else if (data && data.location === 'menu-bottom') {
  $('#menu-location').val('menuBottom').trigger('change');
}

Fliplet.Widget.onSaveRequest(function() {
  var location;
  var menuLocation = $('#menu-location').val();
  if (menuLocation === 'menuTop') {
    location = 'menu-top';
  } else {
    location = 'menu-bottom';
  }

  Fliplet.Widget.save({
    location: location
  }).then(function() {
    Fliplet.Widget.complete();
  });
});
