var widgetId = Fliplet.Widget.getDefaultId();
var data = Fliplet.Widget.getData(widgetId) || {};

if (typeof data.style === 'undefined' || data.style === 'bar-menu') {
  $('input[name="menu-style"][value="bar-menu"]').prop('checked', true);
} else {
  $('input[name="menu-style"][value="' + data.style + '"]').prop('checked', true);
}

Fliplet.Widget.onSaveRequest(function() {
  var style = $('input[name="menu-style"]:checked').val();
  var bar;

  if (style === 'bar-menu') {
    bar = true;
  } else {
    bar = false;
  }

  Fliplet.Widget.save({
    bar: bar,
    style: style
  }).then(function() {
    Fliplet.Widget.complete();
  });
});

Fliplet.Widget.onCancelRequest(function() {
  Fliplet.Widget.complete();
});