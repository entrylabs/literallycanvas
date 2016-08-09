{Tool} = require './base'
{createShape} = require '../core/shapes'


module.exports = class Magnifier extends Tool
  optionsStyle: 'magnify'

  name: 'Magnifier'
  iconName: 'magnifier'
  cursor: 'zoom-in'


  end: (x, y, lc) ->
    lc.setZoom(lc.scale + 0.1)
    oldPosition = lc.position
    #lc.setPan(lc.canvas.width, oldPosition.y + dp.y)

