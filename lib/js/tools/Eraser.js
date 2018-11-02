var Eraser, Pencil, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Pencil = require('./Pencil');

createShape = require('../core/shapes').createShape;

module.exports = Eraser = (function(superClass) {
  extend(Eraser, superClass);

  function Eraser() {
    return Eraser.__super__.constructor.apply(this, arguments);
  }

  Eraser.prototype.name = 'Eraser';

  Eraser.prototype.iconName = 'eraser';

  Eraser.prototype.optionsStyle = 'stroke-thickness';

  Eraser.prototype.makePoint = function(x, y, lc) {
    return createShape('Point', {
      x: x,
      y: y,
      size: this.strokeWidth,
      color: '#000'
    });
  };

  Eraser.prototype.makeShape = function() {
    return createShape('ErasedLinePath');
  };

  Eraser.prototype.createCursor = function() {
    return createShape('Ellipse', {
      x: 0,
      y: 0,
      strokeWidth: 1,
      strokeColor: "#000",
      fillColor: 'transparent'
    });
  };

  Eraser.prototype.updateCursor = function(x, y, lc) {
    this.cursorShape.setUpperLeft({
      x: x - this.strokeWidth / 2,
      y: y - this.strokeWidth / 2
    });
    this.cursorShape.width = this.strokeWidth + 1;
    return this.cursorShape.height = this.strokeWidth + 1;
  };

  Eraser.prototype.convertToPoint = function(x, y, lc) {
    if (!this.currentShape) {
      return;
    }
    return this.currentShape = null;
  };

  return Eraser;

})(Pencil);
