var Coordinate, Tool, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

createShape = require('../core/shapes').createShape;

module.exports = Coordinate = (function(superClass) {
  extend(Coordinate, superClass);

  function Coordinate() {
    return Coordinate.__super__.constructor.apply(this, arguments);
  }

  Coordinate.prototype.name = 'Coordinate';

  Coordinate.prototype.iconName = 'coordinate';

  Coordinate.prototype.makePoint = function(x, y, lc) {
    return createShape('Point', {
      x: x,
      y: y,
      size: this.strokeWidth,
      color: '#000'
    });
  };

  Coordinate.prototype.makeShape = function() {
    return createShape('ErasedLinePath');
  };

  return Coordinate;

})(Tool);
