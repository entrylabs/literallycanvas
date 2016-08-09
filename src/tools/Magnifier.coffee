{Tool} = require './base'
{createShape} = require '../core/shapes'
util = require '../core/util'


module.exports = class Magnifier extends Tool
  optionsStyle: 'magnify'

  name: 'Magnifier'
  iconName: 'magnifier'
  cursor: 'zoom-in'


  end: (x, y, lc) ->
    scale = util.getBackingScale(lc.ctx)
    if (lc.scale > 3)
      return
    lc.setZoom(lc.scale + 0.1)
    oldPosition = lc.position
    lc.pan(
      (x - lc.canvas.width / 2 / scale) * lc.scale * 0.1,
      (y - lc.canvas.height / 2 / scale) * lc.scale * 0.1,
    )
