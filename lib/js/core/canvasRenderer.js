var _drawRawLinePath, defineCanvasRenderer, drawErasedEllipse, drawErasedEllipseLatest, drawErasedLinePath, drawErasedLinePathLatest, drawErasedRect, drawErasedRectLatest, drawImage, drawImageLatest, drawLinePath, drawLinePathLatest, lineEndCapShapes, noop, renderShapeToCanvas, renderShapeToContext, renderers;

lineEndCapShapes = require('./lineEndCapShapes');

renderers = {};

defineCanvasRenderer = function(shapeName, drawFunc, drawLatestFunc) {
  return renderers[shapeName] = {
    drawFunc: drawFunc,
    drawLatestFunc: drawLatestFunc
  };
};

noop = function() {};

renderShapeToContext = function(ctx, shape, opts) {
  var bufferCtx;
  if (opts == null) {
    opts = {};
  }
  if (opts.shouldIgnoreUnsupportedShapes == null) {
    opts.shouldIgnoreUnsupportedShapes = false;
  }
  if (opts.retryCallback == null) {
    opts.retryCallback = noop;
  }
  if (opts.shouldOnlyDrawLatest == null) {
    opts.shouldOnlyDrawLatest = false;
  }
  if (opts.bufferCtx == null) {
    opts.bufferCtx = null;
  }
  bufferCtx = opts.bufferCtx;
  if (renderers[shape.className]) {
    if (opts.shouldOnlyDrawLatest && renderers[shape.className].drawLatestFunc) {
      return renderers[shape.className].drawLatestFunc(ctx, bufferCtx, shape, opts.retryCallback);
    } else {
      return renderers[shape.className].drawFunc(ctx, shape, opts.retryCallback);
    }
  } else if (opts.shouldIgnoreUnsupportedShapes) {
    return console.warn("Can't render shape of type " + shape.className + " to canvas");
  } else {
    throw "Can't render shape of type " + shape.className + " to canvas";
  }
};

renderShapeToCanvas = function(canvas, shape, opts) {
  return renderShapeToContext(canvas.getContext('2d'), shape, opts);
};

defineCanvasRenderer('Rectangle', function(ctx, shape) {
  var x, y;
  x = shape.x;
  y = shape.y;
  if (shape.strokeWidth % 2 !== 0) {
    x += 0.5;
    y += 0.5;
  }
  if (shape.fillPattern) {
    ctx.fillStyle = ctx.createPattern(shape.fillPattern, "repeat");
  } else {
    ctx.fillStyle = shape.fillColor;
  }
  ctx.fillRect(x, y, shape.width, shape.height);
  ctx.lineWidth = shape.strokeWidth;
  ctx.strokeStyle = shape.strokeColor;
  if (shape.dash) {
    ctx.setLineDash(shape.dash);
  }
  return ctx.strokeRect(x, y, shape.width, shape.height);
});

defineCanvasRenderer('Ellipse', function(ctx, shape) {
  var centerX, centerY, halfHeight, halfWidth;
  ctx.save();
  halfWidth = Math.floor(shape.width / 2);
  halfHeight = Math.floor(shape.height / 2);
  centerX = shape.x + halfWidth;
  centerY = shape.y + halfHeight;
  ctx.translate(centerX, centerY);
  ctx.scale(1, Math.abs(shape.height / shape.width));
  ctx.beginPath();
  ctx.arc(0, 0, Math.abs(halfWidth), 0, Math.PI * 2);
  ctx.closePath();
  ctx.restore();
  ctx.fillStyle = shape.fillColor;
  ctx.fill();
  ctx.lineWidth = shape.strokeWidth;
  ctx.strokeStyle = shape.strokeColor;
  return ctx.stroke();
});

drawErasedEllipse = function(ctx, shape) {
  var centerX, centerY, halfWidth;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  halfWidth = Math.floor(shape.width / 2);
  centerX = shape.x + halfWidth;
  centerY = shape.y + halfWidth;
  ctx.translate(centerX, centerY);
  ctx.beginPath();
  ctx.arc(0, 0, Math.abs(halfWidth), 0, Math.PI * 2);
  ctx.fillStyle = shape.fillColor;
  ctx.fill();
  return ctx.restore();
};

drawErasedEllipseLatest = function(ctx, bufferCtx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  bufferCtx.save();
  bufferCtx.globalCompositeOperation = "destination-out";
  ctx.restore();
  return bufferCtx.restore();
};

defineCanvasRenderer('ErasedEllipse', drawErasedEllipse, drawErasedEllipseLatest);

defineCanvasRenderer('SelectionBox', (function() {
  var _drawHandle;
  _drawHandle = function(ctx, arg, handleSize, shape) {
    var x, y;
    x = arg.x, y = arg.y;
    if (handleSize === 0) {
      return;
    }
    x -= shape.shape.x;
    y -= shape.shape.y;
    if (shape.isMask) {
      ctx.fillStyle = '#000002';
    } else {
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x, y, handleSize, handleSize);
      ctx.fillStyle = '#fff';
    }
    return ctx.fillRect(x, y, handleSize, handleSize);
  };
  return function(ctx, shape) {
    var handleSize;
    ctx.translate(shape.shape.x, shape.shape.y);
    if (shape.shape.rotate) {
      ctx.rotate(shape.shape.rotate * Math.PI / 180);
    }
    handleSize = shape.handleSize;
    _drawHandle(ctx, shape.getTopLeftHandleRect(), handleSize, shape);
    _drawHandle(ctx, shape.getTopRightHandleRect(), handleSize, shape);
    _drawHandle(ctx, shape.getBottomLeftHandleRect(), handleSize, shape);
    _drawHandle(ctx, shape.getBottomRightHandleRect(), handleSize, shape);
    if (shape.isMask) {
      ctx.fillStyle = '#000003';
    } else {
      ctx.strokeStyle = '#000';
      ctx.strokeRect(-5, -shape.shape.height / 2 - 30, handleSize, handleSize);
      ctx.fillStyle = '#fff';
    }
    ctx.fillRect(-5, -shape.shape.height / 2 - 30, handleSize, handleSize);
    if (shape.backgroundColor) {
      ctx.fillStyle = shape.backgroundColor;
      ctx.fillRect(-shape.shape.width / 2 - shape.margin, -shape.shape.height / 2 - shape.margin, shape._br.width + shape.margin * 2, shape._br.height + shape.margin * 2);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.setLineDash([2, 4]);
    ctx.strokeRect(-shape.shape.width / 2 - shape.margin, -shape.shape.height / 2 - shape.margin, shape._br.width + shape.margin * 2, shape._br.height + shape.margin * 2);
    ctx.strokeRect(0, -shape.shape.height / 2, 0, -20);
    return ctx.setLineDash([]);
  };
})());

defineCanvasRenderer('SelectTool', (function() {
  var _drawHandle;
  _drawHandle = function(ctx, arg, handleSize) {
    var x, y;
    x = arg.x, y = arg.y;
    if (handleSize === 0) {
      return;
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, handleSize, handleSize);
    ctx.strokeStyle = '#000';
    return ctx.strokeRect(x, y, handleSize, handleSize);
  };
  return function(ctx, shape) {
    _drawHandle(ctx, shape.getTopLeftHandleRect(), shape.handleSize);
    _drawHandle(ctx, shape.getTopRightHandleRect(), shape.handleSize);
    _drawHandle(ctx, shape.getBottomLeftHandleRect(), shape.handleSize);
    _drawHandle(ctx, shape.getBottomRightHandleRect(), shape.handleSize);
    if (shape.backgroundColor) {
      ctx.fillStyle = shape.backgroundColor;
      ctx.fillRect(shape._br.x - shape.margin, shape._br.y - shape.margin, shape._br.width + shape.margin * 2, shape._br.height + shape.margin * 2);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.setLineDash([2, 4]);
    ctx.strokeRect(shape._br.x - shape.margin, shape._br.y - shape.margin, shape._br.width + shape.margin * 2, shape._br.height + shape.margin * 2);
    return ctx.setLineDash([]);
  };
})());

drawImage = function(ctx, shape, retryCallback) {
  var height, scaleX, scaleY, shapeDx, shapeDy, shapeHeight, shapeWidth, width, x, y;
  if (shape.image.width) {
    ctx.save();
    if (!shape.isLoaded) {
      shape.width = shape.image.width;
      shape.height = shape.image.height;
      shape.isLoaded = true;
    }
    x = shape.x;
    y = shape.y;
    width = shape.width * shape.scale;
    height = shape.height * shape.scale;
    scaleX = 1;
    scaleY = 1;
    shapeDx = Math.abs(Math.round(width / 2));
    shapeDy = Math.abs(Math.round(height / 2));
    shapeWidth = -Math.abs(width);
    shapeHeight = -Math.abs(height);
    if (shape.flipX) {
      scaleX = -1;
    }
    if (shape.flipY) {
      scaleY = -1;
    }
    ctx.translate(x, y);
    ctx.rotate(shape.rotate * Math.PI / 180);
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(shape.image, shapeDx, shapeDy, shapeWidth, shapeHeight);
    return ctx.restore();
  } else if (retryCallback) {
    return shape.image.onload = retryCallback;
  }
};

drawImageLatest = function(ctx, bufferCtx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  bufferCtx.save();
  bufferCtx.globalCompositeOperation = "destination-out";
  ctx.restore();
  return bufferCtx.restore();
};

defineCanvasRenderer('Image', drawImage, drawImageLatest);

defineCanvasRenderer('Line', function(ctx, shape) {
  var arrowWidth, x1, x2, y1, y2;
  if (shape.x1 === shape.x2 && shape.y1 === shape.y2) {
    return;
  }
  x1 = shape.x1;
  x2 = shape.x2;
  y1 = shape.y1;
  y2 = shape.y2;
  if (shape.strokeWidth % 2 !== 0) {
    x1 += 0.5;
    x2 += 0.5;
    y1 += 0.5;
    y2 += 0.5;
  }
  ctx.save();
  ctx.lineWidth = shape.strokeWidth;
  ctx.strokeStyle = shape.color;
  ctx.lineCap = shape.capStyle;
  if (shape.dash) {
    ctx.setLineDash(shape.dash);
  }
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  if (shape.dash) {
    ctx.setLineDash([]);
  }
  ctx.restore();
  arrowWidth = Math.max(shape.strokeWidth * 2.2, 5);
  if (shape.endCapShapes[0]) {
    lineEndCapShapes[shape.endCapShapes[0]].drawToCanvas(ctx, x1, y1, Math.atan2(y1 - y2, x1 - x2), arrowWidth, shape.color);
  }
  if (shape.endCapShapes[1]) {
    return lineEndCapShapes[shape.endCapShapes[1]].drawToCanvas(ctx, x2, y2, Math.atan2(y2 - y1, x2 - x1), arrowWidth, shape.color);
  }
});

_drawRawLinePath = function(ctx, points, close, lineCap) {
  var i, len, point, ref;
  if (close == null) {
    close = false;
  }
  if (lineCap == null) {
    lineCap = 'round';
  }
  if (!points.length) {
    return;
  }
  ctx.lineCap = lineCap;
  ctx.lineJoin = "round";
  ctx.strokeStyle = points[0].color;
  ctx.lineWidth = points[0].size;
  ctx.beginPath();
  if (points[0].size % 2 === 0) {
    ctx.moveTo(points[0].x, points[0].y);
  } else {
    ctx.moveTo(points[0].x + 0.5, points[0].y + 0.5);
  }
  ref = points.slice(1);
  for (i = 0, len = ref.length; i < len; i++) {
    point = ref[i];
    if (points[0].size % 2 === 0) {
      ctx.lineTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x + 0.5, point.y + 0.5);
    }
  }
  if (close) {
    return ctx.closePath();
  }
};

drawLinePath = function(ctx, shape) {
  _drawRawLinePath(ctx, shape.smoothedPoints);
  return ctx.stroke();
};

drawLinePathLatest = function(ctx, bufferCtx, shape) {
  var drawEnd, drawStart, segmentStart;
  if (shape.tail) {
    segmentStart = shape.smoothedPoints.length - shape.segmentSize * shape.tailSize;
    drawStart = segmentStart < shape.segmentSize * 2 ? 0 : segmentStart;
    drawEnd = segmentStart + shape.segmentSize + 1;
    _drawRawLinePath(bufferCtx, shape.smoothedPoints.slice(drawStart, drawEnd));
    return bufferCtx.stroke();
  } else {
    _drawRawLinePath(bufferCtx, shape.smoothedPoints);
    return bufferCtx.stroke();
  }
};

defineCanvasRenderer('LinePath', drawLinePath, drawLinePathLatest);

drawErasedLinePath = function(ctx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  drawLinePath(ctx, shape);
  return ctx.restore();
};

drawErasedLinePathLatest = function(ctx, bufferCtx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  bufferCtx.save();
  bufferCtx.globalCompositeOperation = "destination-out";
  drawLinePathLatest(ctx, bufferCtx, shape);
  ctx.restore();
  return bufferCtx.restore();
};

defineCanvasRenderer('ErasedLinePath', drawErasedLinePath, drawErasedLinePathLatest);

drawErasedRect = function(ctx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
  return ctx.restore();
};

drawErasedRectLatest = function(ctx, bufferCtx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  bufferCtx.save();
  bufferCtx.globalCompositeOperation = "destination-out";
  ctx.restore();
  return bufferCtx.restore();
};

defineCanvasRenderer('ErasedRectangle', drawErasedRect, drawErasedRectLatest);

defineCanvasRenderer('Text', function(ctx, shape) {
  if (!shape.renderer) {
    shape._makeRenderer(ctx);
  }
  return shape.renderer.draw(ctx, shape.x, shape.y, shape.color, shape.bgColor);
});

defineCanvasRenderer('Polygon', function(ctx, shape) {
  ctx.fillStyle = shape.fillColor;
  _drawRawLinePath(ctx, shape.points, shape.isClosed, 'butt');
  ctx.fill();
  return ctx.stroke();
});

module.exports = {
  defineCanvasRenderer: defineCanvasRenderer,
  renderShapeToCanvas: renderShapeToCanvas,
  renderShapeToContext: renderShapeToContext
};
