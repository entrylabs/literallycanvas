var Fill, Tool, getPixel,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

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

module.exports = Fill = (function(superClass) {
  extend(Fill, superClass);

  Fill.prototype.name = 'Fill';

  Fill.prototype.iconName = 'fill';

  Fill.prototype.optionsStyle = 'color-palette';

  function Fill(lc) {
    this.cursor = 'url("' + lc.opts.imageURLPrefix + '/paint_line.cur"), default';
    Fill.__super__.constructor.call(this, lc);
  }

  Fill.prototype.threshold = 20;

  Fill.prototype.end = function(x, y, lc) {
    var didFinish, fillColor, fillPoint, rect, startPoint;
    didFinish = void 0;
    fillColor = void 0;
    fillPoint = void 0;
    rect = void 0;
    startPoint = void 0;
    rect = lc.getDefaultImageRect();
    startPoint = {
      x: Math.floor(x),
      y: Math.floor(y)
    };
    if (!this.getIsPointInRect(startPoint.x, startPoint.y, rect)) {
      return null;
    }
    fillPoint = {
      x: startPoint.x - rect.x,
      y: startPoint.y - rect.y
    };
    fillColor = lc.colors.secondary;
    didFinish = false;
    lc.setCursor("progress");
    return this.getFillImage(lc.getImage({
      rect: rect
    }), fillPoint, fillColor, this.threshold, (function(_this) {
      return function(image, isDone) {
        var ref1, shape;
        shape = void 0;
        if (didFinish) {
          lc.setCursor(_this.cursor);
          return;
        }
        shape = LC.createShape('Image', {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
          image: image,
          erase: (ref1 = fillColor === 'transparent') != null ? ref1 : {
            "true": false
          }
        });
        if (isDone) {
          lc.setShapesInProgress([]);
          lc.saveShape(shape);
          lc.setCursor(_this.cursor);
          return didFinish = true;
        } else {
          lc.setShapesInProgress([shape]);
          return lc.repaintLayer('main');
        }
      };
    })(this));
  };

  Fill.prototype.getIsPointInRect = function(x, y, rect) {
    if (x < rect.x) {
      return false;
    }
    if (y < rect.y) {
      return false;
    }
    if (x >= rect.x + rect.width) {
      return false;
    }
    if (y >= rect.y + rect.height) {
      return false;
    }
    return true;
  };

  Fill.prototype.getIndex = function(x, y, width) {
    return (y * width + x) * 4;
  };

  Fill.prototype.getColorArray = function(imageData, i) {
    return [imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]];
  };

  Fill.prototype.getAreColorsEqual = function(a, b, threshold) {
    var d, i, j, len, ref;
    d = void 0;
    i = void 0;
    j = void 0;
    len = void 0;
    ref = void 0;
    d = 0;
    ref = [0, 1, 2, 3];
    j = 0;
    len = ref.length;
    while (j < len) {
      i = ref[j];
      d += Math.abs(a[i] - b[i]);
      j++;
    }
    return d <= threshold;
  };

  Fill.prototype.getFillImage = function(canvas, point, fillColor, threshold, callback) {
    var ctx, ewCanvas, ewCtx, imageData, lastCheckpoint, outputData, outputPoints, pixelStack, rect, run, startColor;
    ctx = void 0;
    imageData = void 0;
    lastCheckpoint = void 0;
    ewCanvas = void 0;
    ewCtx = void 0;
    outputData = void 0;
    outputPoints = void 0;
    pixelStack = void 0;
    rect = void 0;
    run = void 0;
    startColor = void 0;
    rect = {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    };
    ctx = canvas.getContext('2d');
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    outputData = new ArrayBuffer(imageData.length);
    outputPoints = [];
    pixelStack = [[point.x, point.y]];
    startColor = this.getColorArray(imageData, this.getIndex(point.x, point.y, rect.width));
    ewCanvas = document.createElement('canvas');
    ewCanvas.width = canvas.width;
    ewCanvas.height = canvas.height;
    ewCanvas.backgroundColor = 'transparent';
    ewCtx = ewCanvas.getContext('2d');
    ewCtx.fillStyle = fillColor;
    lastCheckpoint = Date.now();
    run = (function(_this) {
      return function() {
        var color, i, image, isDone, p, x, y;
        color = void 0;
        i = void 0;
        image = void 0;
        isDone = void 0;
        p = void 0;
        x = void 0;
        y = void 0;
        while (pixelStack.length && Date.now() - lastCheckpoint < 90) {
          p = pixelStack.pop();
          x = p[0];
          y = p[1];
          i = _this.getIndex(x, y, rect.width);
          if (!_this.getIsPointInRect(x, y, rect)) {
            continue;
          }
          if (outputData[i]) {
            continue;
          }
          color = _this.getColorArray(imageData, i);
          if (!_this.getAreColorsEqual(color, startColor, threshold)) {
            continue;
          }
          outputData[i] = true;
          ewCtx.fillRect(x, y, 1, 1);
          outputPoints.push(p);
          pixelStack.push([x, y + 1]);
          pixelStack.push([x + 1, y]);
          pixelStack.push([x - 1, y]);
          pixelStack.push([x, y - 1]);
        }
        isDone = pixelStack.length === 0;
        image = new Image;
        image.src = ewCanvas.toDataURL();
        if (!isDone) {
          setTimeout(run, 0);
        }
        lastCheckpoint = Date.now();
        if (image.width) {
          return callback(image, isDone);
        } else {
          return LC.util.addImageOnload(image, function() {
            return callback(image, isDone);
          });
        }
      };
    })(this);
    return run();
  };

  return Fill;

})(Tool);
