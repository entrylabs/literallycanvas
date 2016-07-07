{ToolWithStroke} = require './base'
{createShape} = require '../core/shapes'


module.exports = class SelectCut extends ToolWithStroke

  name: 'SelectCut'
  iconName: 'select-cut'
  optionsStyle: null

  begin: (x, y, lc) ->
    @currentShape = createShape('SelectCut', {
      x, y, @strokeWidth,
      strokeColor: lc.getColor('primary'),
      fillColor: lc.getColor('secondary')})

  continue: (x, y, lc) ->
    @currentShape.width = x - @currentShape.x
    @currentShape.height = y - @currentShape.y
    lc.drawShapeInProgress(@currentShape)

  end: (x, y, lc) ->
    lc.saveShape(@currentShape)
