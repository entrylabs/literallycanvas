var SelectCut, Tool, createShape, util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

createShape = require('../core/shapes').createShape;

util = require('../core/util');

module.exports = SelectCut = (function(superClass) {
  extend(SelectCut, superClass);

  function SelectCut() {
    return SelectCut.__super__.constructor.apply(this, arguments);
  }

  SelectCut.prototype.name = 'SelectCut';

  SelectCut.prototype.iconName = 'select-cut';

  SelectCut.prototype.cursor = 'crosshair';

  SelectCut.prototype.optionsStyle = 'select-cut';

  SelectCut.prototype.begin = function(x, y, lc) {
    this.dragStart = {
      x: x,
      y: y
    };
    return this.currentShape = createShape('Rectangle', {
      x: x,
      y: y,
      strokeWidth: 0,
      dash: [2, 2]
    });
  };

  SelectCut.prototype["continue"] = function(x, y, lc) {
    if (!this.dragStart) {
      return;
    }
    this.currentShape.width = x - this.currentShape.x;
    this.currentShape.height = y - this.currentShape.y;
    lc.setShapesInProgress([this.currentShape]);
    return lc.repaintLayer('main');
  };

  SelectCut.prototype.end = function(x, y, lc) {
    var height, image, newErase, newShape, tCtx, tempCanvas, width;
    image = new Image();
    lc.setShapesInProgress([]);
    lc.repaintLayer('main');
    this.currentShape.x = Math.ceil(this.currentShape.x);
    this.currentShape.y = Math.ceil(this.currentShape.y);
    this.currentShape.width = Math.ceil(this.currentShape.width);
    this.currentShape.height = Math.ceil(this.currentShape.height);
    x = this.currentShape.x;
    if (this.currentShape.width < 0) {
      x += this.currentShape.width;
    }
    y = this.currentShape.y;
    if (this.currentShape.height < 0) {
      y += this.currentShape.height;
    }
    width = Math.abs(this.currentShape.width);
    height = Math.abs(this.currentShape.height);
    if (width && height) {
      tempCanvas = document.createElement("canvas");
      tCtx = tempCanvas.getContext("2d");
      tempCanvas.width = width;
      tempCanvas.height = height;
      tCtx.drawImage(lc.getImage(), -x, -y);
      image.src = tempCanvas.toDataURL();
      newErase = createShape('ErasedRectangle', {
        x: x,
        y: y,
        width: width,
        height: height
      });
      newShape = createShape('Image', {
        x: x + width / 2,
        y: y + height / 2,
        image: image,
        width: width,
        height: height
      });
      newErase.isPass = true;
      newShape.isPass = true;
      lc.saveShape(newErase);
      lc.saveShape(newShape);
      lc.setTool(lc.tools.SelectShape);
      lc.tool.setShape(lc, newShape);
    }
    this.currentShape = null;
    return this.dragStart = null;
  };

  return SelectCut;

})(Tool);
