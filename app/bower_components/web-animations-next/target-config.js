(function() {

  var scopeSrc = [
      'dst/scope.js'];

  var minifillSrc = [
      'dst/animation-node.js',
      'dst/effect.js',
      'dst/property-interpolation.js',
      'dst/animation.js',
      'dst/apply-preserving-inline-style.js',
      'dst/element-animatable.js',
      'dst/interpolation.js',
      'dst/matrix-interpolation.js',
      'dst/player.js',
      'dst/tick.js',
      'dst/matrix-decomposition.js',
      'dst/handler-utils.js',
      'dst/shadow-handler.js',
      'dst/number-handler.js',
      'dst/visibility-handler.js',
      'dst/color-handler.js',
      'dst/dimension-handler.js',
      'dst/box-handler.js',
      'dst/transform-handler.js',
      'dst/font-weight-handler.js',
      'dst/position-handler.js',
      'dst/shape-handler.js',
      'dst/property-names.js',
  ];

  var liteMinifillSrc = [
      'dst/animation-node.js',
      'dst/effect.js',
      'dst/property-interpolation.js',
      'dst/animation.js',
      'dst/apply.js',
      'dst/element-animatable.js',
      'dst/interpolation.js',
      'dst/player.js',
      'dst/tick.js',
      'dst/handler-utils.js',
      'dst/shadow-handler.js',
      'dst/number-handler.js',
      'dst/visibility-handler.js',
      'dst/color-handler.js',
      'dst/dimension-handler.js',
      'dst/box-handler.js',
      'dst/transform-handler.js',
      'dst/property-names.js',
  ];


  var sharedSrc = [
      'dst/timing-utilities.js',
      'dst/normalize-keyframes.js'];

  var maxifillSrc = [
      'dst/timeline.js',
      'dst/maxifill-player.js',
      'dst/animation-constructor.js',
      'dst/effect-callback.js',
      'dst/group-constructors.js'];

  var minifillTest = [
      'test/js/animation-node.js',
      'test/js/apply-preserving-inline-style.js',
      'test/js/box-handler.js',
      'test/js/color-handler.js',
      'test/js/dimension-handler.js',
      'test/js/effect.js',
      'test/js/interpolation.js',
      'test/js/matrix-interpolation.js',
      'test/js/number-handler.js',
      'test/js/player.js',
      'test/js/player-finish-event.js',
      'test/js/property-interpolation.js',
      'test/js/tick.js',
      'test/js/timing.js',
      'test/js/transform-handler.js'];

  var maxifillTest = minifillTest.concat(
      'test/js/animation-constructor.js',
      'test/js/effect-callback.js',
      'test/js/group-constructors.js',
      'test/js/group-player.js',
      'test/js/group-player-finish-event.js',
      'test/js/timeline.js');

  // This object specifies the source and test files for different Web Animation build targets.
  var targetConfig = {
    'web-animations': {
      scopeSrc: scopeSrc,
      sharedSrc: sharedSrc,
      minifillSrc: minifillSrc,
      maxifillSrc: [],
      src: scopeSrc.concat(sharedSrc).concat(minifillSrc),
      test: minifillTest,
    },
    'web-animations-next': {
      scopeSrc: scopeSrc,
      sharedSrc: sharedSrc,
      minifillSrc: minifillSrc,
      maxifillSrc: maxifillSrc,
      src: scopeSrc.concat(sharedSrc).concat(minifillSrc).concat(maxifillSrc),
      test: maxifillTest,
    },
    'web-animations-next-lite': {
      scopeSrc: scopeSrc,
      sharedSrc: sharedSrc,
      minifillSrc: liteMinifillSrc,
      maxifillSrc: maxifillSrc,
      src: scopeSrc.concat(sharedSrc).concat(liteMinifillSrc).concat(maxifillSrc),
      test: [],
    },
  };

  if (typeof module != 'undefined')
    module.exports = targetConfig;
  else
    window.webAnimationsTargetConfig = targetConfig;
})();
