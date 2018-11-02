var Eyedropper, Tool, getPixel, util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

util = require('../core/util');

getPixel = function(ctx, arg) {
  var pixel, x, y;
  x = arg.x, y = arg.y;
  pixel = ctx.getImageData(x, y, 1, 1).data;
  if (pixel[3]) {
    return "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
  } else {
    return null;
  }
};

module.exports = Eyedropper = (function(superClass) {
  extend(Eyedropper, superClass);

  Eyedropper.prototype.name = 'Eyedropper';

  Eyedropper.prototype.iconName = 'none';

  function Eyedropper(lc) {
    this.cursor = 'url("' + lc.opts.imageURLPrefix + '/spoid.cur"), default';
    Eyedropper.__super__.constructor.call(this, lc);
    this.strokeOrFill = 'stroke';
  }

  Eyedropper.prototype.readColor = function(x, y, lc) {
    var canvas, color, newColor, scale;
    if (x < 0 || y < 0 || x > lc.width || y > lc.height) {
      return;
    }
    canvas = lc.getImage();
    scale = util.getBackingScale(lc.ctx);
    newColor = getPixel(canvas.getContext('2d'), {
      x: x,
      y: y
    });
    color = newColor || lc.getColor('background');
    return lc.setColor(this.selected, color);
  };

  Eyedropper.prototype.begin = function(x, y, lc) {
    return this.readColor(x, y, lc);
  };

  Eyedropper.prototype["continue"] = function(x, y, lc) {
    return this.readColor(x, y, lc);
  };

  Eyedropper.prototype.end = function(x, y, lc) {
    return lc.setTool(this.previousTool);
  };

  Eyedropper.prototype.setPrevious = function(tool, selected) {
    this.optionsStyle = tool.optionsStyle;
    this.previousTool = tool;
    return this.selected = selected;
  };

  return Eyedropper;

})(Tool);
