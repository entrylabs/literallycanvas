var Pencil, ToolWithStroke, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ToolWithStroke = require('./base').ToolWithStroke;

createShape = require('../core/shapes').createShape;

module.exports = Pencil = (function(superClass) {
  extend(Pencil, superClass);

  function Pencil() {
    return Pencil.__super__.constructor.apply(this, arguments);
  }

  Pencil.prototype.name = 'Pencil';

  Pencil.prototype.iconName = 'pencil';

  Pencil.prototype.cursor = 'none';

  Pencil.prototype.usesSimpleAPI = false;

  Pencil.prototype.eventTimeThreshold = 10;

  Pencil.prototype.didBecomeActive = function(lc) {
    var unsubscribeFuncs;
    unsubscribeFuncs = [];
    this.unsubscribe = (function(_this) {
      return function() {
        var func, i, len, results;
        results = [];
        for (i = 0, len = unsubscribeFuncs.length; i < len; i++) {
          func = unsubscribeFuncs[i];
          results.push(func());
        }
        return results;
      };
    })(this);
    this.cursorShape = this.createCursor();
    this.cursorShape.width = 10;
    this.cursorShape.height = 10;
    unsubscribeFuncs.push(lc.on('lc-pointermove', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        _this.updateCursor(x, y, lc);
        return lc.drawShapeInProgress(_this.cursorShape);
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerdown', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        _this.color = lc.getColor('primary');
        _this.currentShape = _this.makeShape();
        _this.currentShape.addPoint(_this.makePoint(x, y, lc));
        _this.lastEventTime = Date.now();
        return lc.drawShapeInProgress(_this.cursorShape);
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerdrag', (function(_this) {
      return function(arg) {
        var timeDiff, x, y;
        x = arg.x, y = arg.y;
        timeDiff = Date.now() - _this.lastEventTime;
        if (timeDiff > _this.eventTimeThreshold) {
          _this.lastEventTime += timeDiff;
          _this.currentShape.addPoint(_this.makePoint(x, y, lc));
          _this.updateCursor(x, y, lc);
          lc.setShapesInProgress([_this.currentShape, _this.cursorShape]);
          return lc.repaintLayer('main', false);
        }
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerup', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        if (_this.currentShape.points.length === 1) {
          _this.convertToPoint(x, y, lc);
        }
        if (_this.currentShape) {
          lc.saveShape(_this.currentShape);
        }
        _this.currentShape = void 0;
        _this.updateCursor(x, y, lc);
        lc.drawShapeInProgress(_this.cursorShape);
        return lc.setShapesInProgress([]);
      };
    })(this)));
    return unsubscribeFuncs.push(lc.on('setStrokeWidth', (function(_this) {
      return function(strokeWidth) {
        _this.strokeWidth = strokeWidth;
        return lc.trigger('toolDidUpdateOptions');
      };
    })(this)));
  };

  Pencil.prototype.willBecomeInactive = function(lc) {
    this.unsubscribe();
    lc.setShapesInProgress([]);
    return lc.repaintLayer('main', false);
  };

  Pencil.prototype.makePoint = function(x, y, lc) {
    return createShape('Point', {
      x: x,
      y: y,
      size: this.strokeWidth,
      color: this.color
    });
  };

  Pencil.prototype.makeShape = function() {
    return createShape('LinePath');
  };

  Pencil.prototype.convertToPoint = function(x, y, lc) {
    if (!this.currentShape) {
      return;
    }
    return this.currentShape = createShape('Ellipse', {
      x: x - this.strokeWidth / 2,
      y: y - this.strokeWidth / 2,
      0: 0,
      width: this.strokeWidth,
      height: this.strokeWidth,
      strokeColor: 'transparent',
      fillColor: lc.getColor('primary')
    });
  };

  Pencil.prototype.createCursor = function() {
    return createShape('Ellipse', {
      x: 0,
      y: 0,
      strokeWidth: 0,
      strokeColor: 'transparent',
      fillColor: "#000"
    });
  };

  Pencil.prototype.updateCursor = function(x, y, lc) {
    this.cursorShape.setUpperLeft({
      x: x - this.strokeWidth / 2,
      y: y - this.strokeWidth / 2
    });
    this.cursorShape.width = this.strokeWidth + 1;
    this.cursorShape.height = this.strokeWidth + 1;
    return this.cursorShape.fillColor = lc.getColor('primary');
  };

  return Pencil;

})(ToolWithStroke);
