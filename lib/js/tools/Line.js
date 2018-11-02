var Line, Pencil, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Pencil = require('./Pencil');

createShape = require('../core/shapes').createShape;

module.exports = Line = (function(superClass) {
  extend(Line, superClass);

  function Line() {
    return Line.__super__.constructor.apply(this, arguments);
  }

  Line.prototype.name = 'Line';

  Line.prototype.iconName = 'line';

  Line.prototype.cursor = 'none';

  Line.prototype.usesSimpleAPI = false;

  Line.prototype.didBecomeActive = function(lc) {
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
        return _this.currentShape = createShape('Line', {
          x1: x,
          y1: y,
          x2: x,
          y2: y,
          strokeWidth: _this.strokeWidth,
          dash: (function() {
            switch (false) {
              case !this.isDashed:
                return [this.strokeWidth * 2, this.strokeWidth * 4];
              default:
                return null;
            }
          }).call(_this),
          endCapShapes: _this.hasEndArrow ? [null, 'arrow'] : null,
          color: lc.getColor('primary')
        });
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerdrag', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        _this.currentShape.x2 = x;
        _this.currentShape.y2 = y;
        lc.setShapesInProgress([_this.currentShape, _this.cursorShape]);
        return lc.repaintLayer('main', false);
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerup', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        if ((_this.currentShape.x1 === _this.currentShape.x2) && (_this.currentShape.y1 === _this.currentShape.y2)) {
          _this.convertToPoint(x, y, lc);
        }
        lc.saveShape(_this.currentShape);
        _this.currentShape = void 0;
        _this.updateCursor(x, y, lc);
        lc.setShapesInProgress([_this.cursorShape]);
        return lc.drawShapeInProgress(_this.cursorShape);
      };
    })(this)));
    return unsubscribeFuncs.push(lc.on('setStrokeWidth', (function(_this) {
      return function(strokeWidth) {
        _this.strokeWidth = strokeWidth;
        return lc.trigger('toolDidUpdateOptions');
      };
    })(this)));
  };

  return Line;

})(Pencil);
