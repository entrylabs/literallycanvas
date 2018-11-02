var SelectShape, Tool, createShape, getIsPointInBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

createShape = require('../core/shapes').createShape;

getIsPointInBox = function(point, box) {
  if (point.x < box.x) {
    return false;
  }
  if (point.y < box.y) {
    return false;
  }
  if (point.x > box.x + box.width) {
    return false;
  }
  if (point.y > box.y + box.height) {
    return false;
  }
  return true;
};

module.exports = SelectShape = (function(superClass) {
  extend(SelectShape, superClass);

  SelectShape.prototype.name = 'SelectShape';

  SelectShape.prototype.iconName = 'pan';

  SelectShape.prototype.usesSimpleAPI = false;

  SelectShape.prototype.optionsStyle = 'move-attributes';

  SelectShape.prototype.nextIsPass = false;

  function SelectShape(lc) {
    this.cursor = 'url("' + lc.opts.imageURLPrefix + '/handopen.cur"), default';
    this.selectCanvas = document.createElement('canvas');
    this.selectCanvas.style['background-color'] = 'transparent';
    this.selectCtx = this.selectCanvas.getContext('2d');
  }

  SelectShape.prototype.didBecomeActive = function(lc) {
    var dispose, onDown, onDrag, onKeyDown, onMove, onUp, selectShapeUnsubscribeFuncs, update;
    selectShapeUnsubscribeFuncs = [];
    this._selectShapeUnsubscribe = (function(_this) {
      return function() {
        var func, j, len, results;
        results = [];
        for (j = 0, len = selectShapeUnsubscribeFuncs.length; j < len; j++) {
          func = selectShapeUnsubscribeFuncs[j];
          results.push(func());
        }
        return results;
      };
    })(this);
    onDown = (function(_this) {
      return function(arg) {
        var br, rawX, rawY, x, y;
        x = arg.x, y = arg.y, rawX = arg.rawX, rawY = arg.rawY;
        _this._drawSelectCanvas(lc);
        _this.didDrag = false;
        _this.dragAction = _this._getPixel(x, y, lc, _this.selectCtx);
        if (_this.dragAction) {
          _this.prevPoint = {
            x: x,
            y: y
          };
          _this.initialShapeBoundingRect = _this.selectedShape.getBoundingRect(lc.ctx);
          _this.prevOpts = {
            x: _this.selectedShape.x,
            y: _this.selectedShape.y,
            width: _this.selectedShape.width,
            height: _this.selectedShape.height,
            rotate: _this.selectedShape.rotate
          };
          br = _this.selectedShape.getBoundingRect();
          return _this.dragOffset = {
            x: x - br.x,
            y: y - br.y
          };
        } else {
          _this.setShape(lc, null);
          _this.selectedShape = null;
          _this.oldPosition = lc.position;
          return _this.pointerStart = {
            x: rawX,
            y: rawY
          };
        }
      };
    })(this);
    onMove = (function(_this) {
      return function(arg) {
        var dragAction, rotate, x, y;
        x = arg.x, y = arg.y;
        if (!_this.selectedShape) {
          return;
        }
        _this._drawSelectCanvas(lc);
        dragAction = _this._getPixel(x, y, lc, _this.selectCtx);
        switch (dragAction) {
          case 1:
            return lc.setCursor("move");
          case 2:
            rotate = -Math.atan2(-(_this.selectedShape.y - y), _this.selectedShape.x - x) / Math.PI * 180 - 90;
            if (rotate < 0) {
              rotate += 360;
            }
            switch (Math.round(rotate / 45) % 4) {
              case 0:
                return lc.setCursor('ns-resize');
              case 1:
                return lc.setCursor('nesw-resize');
              case 2:
                return lc.setCursor('ew-resize');
              case 3:
                return lc.setCursor('nwse-resize');
            }
            break;
          case 3:
            return lc.setCursor('url("' + lc.opts.imageURLPrefix + '/rotate.cur") 8 8, default');
          default:
            return lc.setCursor(_this.cursor);
        }
      };
    })(this);
    onDrag = (function(_this) {
      return function(arg) {
        var br, brBottom, brRight, dp, height, rawX, rawY, rotate, width, x, xC, y, yC;
        x = arg.x, y = arg.y, rawX = arg.rawX, rawY = arg.rawY;
        lc.setCursor('url("' + lc.opts.imageURLPrefix + '/handclosed.cur"), default');
        if (_this.dragAction) {
          br = _this.initialShapeBoundingRect;
          brRight = br.x + br.width;
          brBottom = br.y + br.height;
          switch (_this.dragAction) {
            case 1:
              _this.didDrag = true;
              _this.selectedShape.setUpperLeft({
                x: _this.selectedShape.x - _this.prevPoint.x + x,
                y: _this.selectedShape.y - _this.prevPoint.y + y
              });
              _this.prevPoint = {
                x: x,
                y: y
              };
              break;
            case 2:
              rotate = -_this.selectedShape.rotate * Math.PI / 180;
              xC = (_this.selectedShape.x - x) * 2;
              yC = (_this.selectedShape.y - y) * 2;
              width = Math.abs(Math.abs(Math.cos(rotate) * xC - Math.sin(rotate) * yC) - 5);
              height = Math.abs(Math.abs(Math.sin(rotate) * xC + Math.cos(rotate) * yC) - 5);
              _this.selectedShape.setSize(width, height);
              break;
            case 3:
              rotate = -Math.atan2(-(_this.selectedShape.y - y), _this.selectedShape.x - x) / Math.PI * 180 - 90;
              if (rotate < 0) {
                rotate += 360;
              }
              _this.selectedShape.rotate = rotate;
          }
          lc.trigger('handleShape');
          lc.setShapesInProgress([
            _this.selectedShape, createShape('SelectionBox', {
              shape: _this.selectedShape
            })
          ]);
          return lc.repaintLayer('main');
        } else {
          dp = {
            x: (rawX - _this.pointerStart.x) * lc.backingScale,
            y: (rawY - _this.pointerStart.y) * lc.backingScale
          };
          return lc.setPan(_this.oldPosition.x + dp.x, _this.oldPosition.y + dp.y);
        }
      };
    })(this);
    onUp = (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        if (_this.dragAction) {
          switch (_this.dragAction) {
            case 1:
              _this.didDrag = false;
              lc.editShape(_this.selectedShape, {
                x: _this.selectedShape.x,
                y: _this.selectedShape.y,
                isPass: _this.nextIsPass
              }, _this.prevOpts);
              lc.trigger('shapeMoved', {
                shape: _this.selectedShape
              });
              break;
            case 2:
              lc.editShape(_this.selectedShape, {
                x: _this.selectedShape.x,
                y: _this.selectedShape.y,
                width: _this.selectedShape.width,
                height: _this.selectedShape.height,
                isPass: _this.nextIsPass
              }, _this.prevOpts);
              lc.trigger('shapeResized', {
                shape: _this.selectedShape
              });
              break;
            case 3:
              lc.editShape(_this.selectedShape, {
                rotate: _this.selectedShape.rotate,
                isPass: _this.nextIsPass
              }, _this.prevOpts);
              lc.trigger('shapeResized', {
                shape: _this.selectedShape
              });
          }
          _this.nextIsPass = false;
          lc.trigger('handleShape');
          lc.trigger('drawingChange', {});
          lc.repaintLayer('main');
          _this.dragAction = null;
        }
        return lc.setCursor(_this.cursor);
      };
    })(this);
    dispose = (function(_this) {
      return function() {
        return _this.setShape(lc, null);
      };
    })(this);
    update = (function(_this) {
      return function() {
        if (_this.selectedShape) {
          lc.setShapesInProgress([
            _this.selectedShape, createShape('SelectionBox', {
              shape: _this.selectedShape
            })
          ]);
          return lc.repaintLayer('main');
        }
      };
    })(this);
    onKeyDown = (function(_this) {
      return function(e) {
        var diff, pos;
        if (!_this.selectedShape) {
          return;
        }
        pos = {
          x: _this.selectedShape.x,
          y: _this.selectedShape.y
        };
        diff = 5;
        if (e.shiftKey) {
          diff = 1;
        }
        switch (e.keyCode) {
          case 38:
            pos.y = pos.y - diff;
            break;
          case 40:
            pos.y = pos.y + diff;
            break;
          case 37:
            pos.x = pos.x - diff;
            break;
          case 39:
            pos.x = pos.x + diff;
        }
        return lc.editShape(_this.selectedShape, pos);
      };
    })(this);
    dispose = (function(_this) {
      return function(e) {
        _this.setShape(lc, null);
        return _this.selectedShape = null;
      };
    })(this);
    selectShapeUnsubscribeFuncs.push(lc.on('lc-pointerdown', onDown));
    selectShapeUnsubscribeFuncs.push(lc.on('lc-pointerdrag', onDrag));
    selectShapeUnsubscribeFuncs.push(lc.on('lc-pointermove', onMove));
    selectShapeUnsubscribeFuncs.push(lc.on('lc-pointerup', onUp));
    selectShapeUnsubscribeFuncs.push(lc.on('undo', dispose));
    selectShapeUnsubscribeFuncs.push(lc.on('drawingChange', update));
    selectShapeUnsubscribeFuncs.push(lc.on('keyDown', onKeyDown));
    selectShapeUnsubscribeFuncs.push(lc.on('dispose', dispose));
    return this._drawSelectCanvas(lc);
  };

  SelectShape.prototype.willBecomeInactive = function(lc) {
    this._selectShapeUnsubscribe();
    return lc.setShapesInProgress([]);
  };

  SelectShape.prototype.setShape = function(lc, shape, nextIsPass) {
    this.nextIsPass = nextIsPass;
    if (!shape) {
      this.selectedShape = null;
      lc.setShapesInProgress([]);
    } else {
      this.selectedShape = shape;
      lc.setShapesInProgress([
        shape, createShape('SelectionBox', {
          shape: shape
        })
      ]);
    }
    lc.trigger("shapeSelected", this.selectedShape);
    lc.repaintLayer('main');
    return this._drawSelectCanvas(lc);
  };

  SelectShape.prototype._drawSelectCanvas = function(lc) {
    var shape;
    this.selectCanvas.width = lc.canvas.width;
    this.selectCanvas.height = lc.canvas.height;
    this.selectCtx.clearRect(0, 0, this.selectCanvas.width, this.selectCanvas.height);
    if (this.selectedShape) {
      shape = createShape('SelectionBox', {
        shape: this.selectedShape,
        backgroundColor: "#000001",
        isMask: true
      });
      return lc.draw([shape], this.selectCtx);
    }
  };

  SelectShape.prototype._intToHex = function(i) {
    return ("000000" + (i.toString(16))).slice(-6);
  };

  SelectShape.prototype._getPixel = function(x, y, lc, ctx) {
    var p, pixel;
    p = lc.drawingCoordsToClientCoords(x, y);
    pixel = ctx.getImageData(p.x, p.y, 1, 1).data;
    if (pixel[3]) {
      return parseInt(this._rgbToHex(pixel[0], pixel[1], pixel[2]), 16);
    } else {
      return null;
    }
  };

  SelectShape.prototype._componentToHex = function(c) {
    var hex;
    hex = c.toString(16);
    return ("0" + hex).slice(-2);
  };

  SelectShape.prototype._rgbToHex = function(r, g, b) {
    return "" + (this._componentToHex(r)) + (this._componentToHex(g)) + (this._componentToHex(b));
  };

  return SelectShape;

})(Tool);
