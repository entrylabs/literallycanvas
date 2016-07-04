Pencil = require './Pencil'
{createShape} = require '../core/shapes'


module.exports = class Coordinate extends Pencil

  name: 'Coordinate'
  iconName: 'coordinate'

  makePoint: (x, y, lc) ->
    createShape('Point', {x, y, size: @strokeWidth, color: '#000'})
  makeShape: -> createShape('ErasedLinePath')
