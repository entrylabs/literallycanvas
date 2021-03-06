module.exports = {
  imageURLPrefix: 'lib/img',
  primaryColor: '#000000',
  secondaryColor: '#FFFFFF',
  backgroundColor: 'transparent',
  strokeWidths: [1, 2, 5, 10, 20, 30],
  defaultStrokeWidth: 5,
  toolbarPosition: 'top',
  keyboardShortcuts: false,
  imageSize: {width: 'infinite', height: 'infinite'},
  backgroundShapes: [],
  watermarkImage: null,
  watermarkScale: 1,
  zoomMin: 0.2,
  zoomMax: 4.0,
  zoomStep: 0.2,
  snapshot: null,
  onInit: function() { },
  tools: [
    //require('../tools/Pan'),
    require('../tools/SelectShape'),
    require('../tools/SelectCut'),
    require('../tools/Pencil'),
    require('../tools/Line'),
    require('../tools/Rectangle'),
    require('../tools/Ellipse'),
    require('../tools/Text'),
    require('../tools/Fill'),
    require('../tools/Eraser'),
    //require('../tools/Coordinate'),
    require('../tools/Magnifier'),
    require('../tools/Eyedropper'),
  ]
}
