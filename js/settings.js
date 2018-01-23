var widgetId = Fliplet.Widget.getDefaultId();
var data = Fliplet.Widget.getData(widgetId) || {};

if (typeof data.controls === 'undefined' || data.controls) {
  $('input[name="controls-menu"][value="yes"]').prop('checked', true);
} else {
  $('input[name="controls-menu"][value="no"]').prop('checked', true);
}

Fliplet.Widget.onSaveRequest(function() {
  var controls;
  var controlsMenu = $('input[name="controls-menu"]:checked').val();

  if (controlsMenu === 'yes') {
    controls = true;
  } else {
    controls = false;
  }

  Fliplet.Widget.save({
    controls: controls
  }).then(function() {
    Fliplet.Widget.complete();
  });
});
