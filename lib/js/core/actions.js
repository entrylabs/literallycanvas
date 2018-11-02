var AddShapeAction, ClearAction, EditShapeAction, RemoveAction;

ClearAction = (function() {
  function ClearAction(lc, oldShapes, newShapes1) {
    this.lc = lc;
    this.oldShapes = oldShapes;
    this.newShapes = newShapes1;
  }

  ClearAction.prototype["do"] = function() {
    this.lc.shapes = this.newShapes.slice(0);
    return this.lc.repaintLayer('main');
  };

  ClearAction.prototype.undo = function() {
    this.lc.shapes = this.oldShapes.slice(0);
    return this.lc.repaintLayer('main');
  };

  return ClearAction;

})();

RemoveAction = (function() {
  function RemoveAction(lc, oldShapes, newShapes1) {
    this.lc = lc;
    this.oldShapes = oldShapes;
    this.newShapes = newShapes1;
  }

  RemoveAction.prototype["do"] = function() {
    this.lc.shapes = this.newShapes.slice(0);
    return this.lc.repaintLayer('main');
  };

  RemoveAction.prototype.undo = function() {
    this.lc.shapes = this.oldShapes.slice(0);
    return this.lc.repaintLayer('main');
  };

  return RemoveAction;

})();

AddShapeAction = (function() {
  function AddShapeAction(lc, shape1, previousShapeId) {
    this.lc = lc;
    this.shape = shape1;
    this.previousShapeId = previousShapeId != null ? previousShapeId : null;
  }

  AddShapeAction.prototype["do"] = function() {
    var found, i, len, newShapes, ref, shape;
    if (!this.lc.shapes.length || this.lc.shapes[this.lc.shapes.length - 1].id === this.previousShapeId || this.previousShapeId === null) {
      this.lc.shapes.push(this.shape);
    } else {
      newShapes = [];
      found = false;
      ref = this.lc.shapes;
      for (i = 0, len = ref.length; i < len; i++) {
        shape = ref[i];
        newShapes.push(shape);
        if (shape.id === this.previousShapeId) {
          newShapes.push(this.shape);
          found = true;
        }
      }
      if (!found) {
        newShapes.push(this.shape);
      }
      this.lc.shapes = newShapes;
    }
    return this.lc.repaintLayer('main');
  };

  AddShapeAction.prototype.undo = function() {
    var i, len, newShapes, ref, shape;
    if (this.lc.shapes[this.lc.shapes.length - 1].id === this.shape.id) {
      this.lc.shapes.pop();
    } else {
      newShapes = [];
      ref = this.lc.shapes;
      for (i = 0, len = ref.length; i < len; i++) {
        shape = ref[i];
        if (shape.id !== this.shape.id) {
          newShapes.push(shape);
        }
      }
      this.lc.shapes = newShapes;
    }
    return this.lc.repaintLayer('main');
  };

  return AddShapeAction;

})();

EditShapeAction = (function() {
  function EditShapeAction(lc, shape1, opts, prevOpts) {
    this.lc = lc;
    this.shape = shape1;
    this.opts = opts;
    this.prevOpts = prevOpts != null ? prevOpts : null;
  }

  EditShapeAction.prototype["do"] = function() {
    var key, newOpts;
    newOpts = {};
    for (key in this.opts) {
      newOpts[key] = this.shape[key];
      this.shape[key] = this.opts[key];
    }
    if (this.prevOpts) {
      this.opts = this.prevOpts;
    } else {
      this.opts = newOpts;
    }
    return this.lc.repaintLayer('main');
  };

  EditShapeAction.prototype.undo = function() {
    var key, newOpts;
    newOpts = {};
    for (key in this.opts) {
      newOpts[key] = this.shape[key];
      this.shape[key] = this.opts[key];
    }
    this.opts = newOpts;
    return this.lc.repaintLayer('main');
  };

  return EditShapeAction;

})();

module.exports = {
  ClearAction: ClearAction,
  RemoveAction: RemoveAction,
  AddShapeAction: AddShapeAction,
  EditShapeAction: EditShapeAction
};
