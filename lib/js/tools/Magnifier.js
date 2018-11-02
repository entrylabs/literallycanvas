var Magnifier, Tool, createShape, util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

createShape = require('../core/shapes').createShape;

util = require('../core/util');

module.exports = Magnifier = (function(superClass) {
  extend(Magnifier, superClass);

  Magnifier.prototype.optionsStyle = 'magnify';

  Magnifier.prototype.name = 'Magnifier';

  Magnifier.prototype.iconName = 'magnifier';

  function Magnifier(lc) {
    this.cursor = 'url("' + lc.opts.imageURLPrefix + '/zoom-in.cur"), default';
    Magnifier.__super__.constructor.call(this, lc);
  }

  Magnifier.prototype.didBecomeActive = function(lc) {
    var eventUnsubscribeFuncs, onKeyDown, onKeyUp;
    eventUnsubscribeFuncs = [];
    this._eventUnsubscribe = (function(_this) {
      return function() {
        var func, i, len, results;
        results = [];
        for (i = 0, len = eventUnsubscribeFuncs.length; i < len; i++) {
          func = eventUnsubscribeFuncs[i];
          results.push(func());
        }
        return results;
      };
    })(this);
    onKeyDown = (function(_this) {
      return function(e) {
        if (e.shiftKey && (e.keyCode === 16 || e.which === 16)) {
          _this.isShift = true;
          return lc.setCursor('url("' + lc.opts.imageURLPrefix + '/zoom-out.cur"), default');
        }
      };
    })(this);
    onKeyUp = (function(_this) {
      return function(e) {
        if (e.keyCode === 16 || e.which === 16) {
          _this.isShift = false;
          return lc.setCursor(_this.cursor);
        }
      };
    })(this);
    eventUnsubscribeFuncs.push(lc.on('keyDown', onKeyDown));
    return eventUnsubscribeFuncs.push(lc.on('keyUp', onKeyUp));
  };

  Magnifier.prototype.willBecomeInactive = function(lc) {
    return this._eventUnsubscribe();
  };

  Magnifier.prototype.end = function(x, y, lc) {
    var oldPosition, panX, panY, scale;
    scale = util.getBackingScale(lc.ctx);
    oldPosition = lc.position;
    if ((lc.scale <= 0.5 && this.isShift) || (lc.scale >= 3 && !this.isShift)) {
      return;
    }
    panX = (x - lc.canvas.width / 2 / scale) * lc.scale * 0.1;
    panY = (y - lc.canvas.height / 2 / scale) * lc.scale * 0.1;
    if (this.isShift) {
      lc.setZoom(lc.scale - 0.1);
      return lc.pan(-panX, -panY);
    } else {
      lc.setZoom(lc.scale + 0.1);
      return lc.pan(panX, panY);
    }
  };

  return Magnifier;

})(Tool);
