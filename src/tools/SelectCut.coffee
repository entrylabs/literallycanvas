{Tool} = require './base'
{createShape} = require '../core/shapes'
util = require '../core/util'

module.exports = class SelectCut extends Tool

  name: 'SelectCut'
  iconName: 'select-cut'

  begin:(x, y, lc) ->
    @dragStart = {
        x: x,
        y: y
    }
    @currentShape = createShape('Rectangle', {
        x: x,
        y: y,
        strokeWidth: 0,
        dash: [2, 2]
    });

  continue:(x, y, lc) ->
    if (!@dragStart)
      return
    @currentShape.width = x - @currentShape.x
    @currentShape.height = y - @currentShape.y
    lc.setShapesInProgress([@currentShape])
    lc.repaintLayer('main')

  end:(x, y, lc) ->
    lc.setShapesInProgress([])
    lc.repaintLayer('main')
    x = Math.min(@currentShape.x)
    y = Math.min(@currentShape.y)
    width = Math.abs(@currentShape.width)
    height = Math.abs(@currentShape.height)
    console.log(width)
    if (width && height)
      image = new Image()
      tempCanvas = document.createElement("canvas")
      tCtx = tempCanvas.getContext("2d")
      scale = util.getBackingScale(lc.ctx)
      tempCanvas.width = width * scale
      tempCanvas.height = height * scale
      tCtx.drawImage(lc.canvas, -x * scale, -y * scale)
      image.src = tempCanvas.toDataURL()
      lc.saveShape(createShape('Image', {x, y, image, scale: 1/scale}))
      lc.setTool(lc.tools.SelectShape)
    @currentShape = null
    @dragStart = null
