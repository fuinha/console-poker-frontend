import $ from 'jquery';

var $window = $(window);
$window.resize(doResize);

export function doResize(event, ui) {
  var scale;
  var $el = $("#room__table");
  var elHeight = $el.height();
  var elWidth = $el.width();
    
  scale = Math.min(
    $window.width() / elWidth,    
    $window.height() / elHeight
  );
  
  $el.css("transform", "translate(-50%, -50%) scale(" + scale + ")");
}