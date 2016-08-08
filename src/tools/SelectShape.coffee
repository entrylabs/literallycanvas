{Tool} = require './base'
{createShape} = require '../core/shapes'

module.exports = class SelectShape extends Tool
  name: 'SelectShape'
  iconName: 'pan'
  usesSimpleAPI: false
  optionsStyle: 'move-attributes'
  cursor: 'url("/lib/literallycanvas/lib/img/handopen.cur"), default'

  constructor: (lc) ->
    # This is a 'shadow' canvas -- we'll reproduce the shapes here, each shape
    # with a different color that corresponds to their index. That way we'll
    # be able to find which shape to select on the main canvas by pixel color.
    @selectCanvas = document.createElement('canvas')
    @selectCanvas.style['background-color'] = 'transparent'
    @selectCtx = @selectCanvas.getContext('2d')

  didBecomeActive: (lc) ->
    selectShapeUnsubscribeFuncs = []
    @_selectShapeUnsubscribe = =>
      for func in selectShapeUnsubscribeFuncs
        func()

    onDown = ({ x, y, rawX, rawY }) =>
      @didDrag = false

      shapeIndex = @_getPixel(x, y, lc, @selectCtx)
      shape = lc.shapes[shapeIndex]

      if @selectedShape is shape
        @setShape(lc, shape)

        br = @selectedShape.getBoundingRect()
        @dragOffset = {
          x: x - br.x,
          y: y - br.y
        }
        @prevOpts = {
          x: @selectedShape.x,
          y: @selectedShape.y
        }
      else
        @setShape(lc, null)
        @oldPosition = lc.position
        @pointerStart = {x: rawX, y: rawY}

    onDrag = ({ x, y, rawX, rawY }) =>
      lc.setCursor('url("/lib/literallycanvas/lib/img/handclosed.cur"), default')
      if @selectedShape?
        @didDrag = true

        @selectedShape.setUpperLeft {
          x: x - @dragOffset.x,
          y: y - @dragOffset.y
        }
        lc.setShapesInProgress [@selectedShape, createShape('SelectionBox', {
          shape: @selectedShape
        })]
        lc.repaintLayer 'main'
      else
        dp = {
          x: (rawX - @pointerStart.x) * lc.backingScale,
          y: (rawY - @pointerStart.y) * lc.backingScale
        }
        lc.setPan(@oldPosition.x + dp.x, @oldPosition.y + dp.y)

    onUp = ({ x, y }) =>
      if @didDrag
        @didDrag = false
        lc.editShape(@selectedShape, {
          x: x - @dragOffset.x,
          y: y - @dragOffset.y
        }, @prevOpts)
        lc.trigger('shapeMoved', { shape: @selectedShape })
        lc.trigger('drawingChange', {})
        lc.repaintLayer('main')
        @_drawSelectCanvas(lc)
      lc.setCursor(@cursor)

    dispose = () =>
      @setShape(lc, null)

    update = () =>
      if (@selectedShape)
        lc.setShapesInProgress [@selectedShape, createShape('SelectionBox', {
          shape: @selectedShape
        })]
        lc.repaintLayer 'main'


    selectShapeUnsubscribeFuncs.push lc.on 'lc-pointerdown', onDown
    selectShapeUnsubscribeFuncs.push lc.on 'lc-pointerdrag', onDrag
    selectShapeUnsubscribeFuncs.push lc.on 'lc-pointerup', onUp
    selectShapeUnsubscribeFuncs.push lc.on 'undo', dispose
    selectShapeUnsubscribeFuncs.push lc.on 'drawingChange', update

    @_drawSelectCanvas(lc)

  willBecomeInactive: (lc) ->
    @_selectShapeUnsubscribe()
    lc.setShapesInProgress []

  setShape: (lc, shape) ->
    if (!shape)
      @selectedShape = null;
      lc.setShapesInProgress []
    else
      @selectedShape = shape;
      lc.setShapesInProgress [shape, createShape('SelectionBox', {
        shape: shape
      })]
    lc.trigger("shapeSelected", @selectedShape)
    lc.repaintLayer 'main'

  _drawSelectCanvas: (lc) ->
    @selectCanvas.width = lc.canvas.width
    @selectCanvas.height = lc.canvas.height
    @selectCtx.clearRect(0, 0, @selectCanvas.width, @selectCanvas.height)
    shapes = lc.shapes.map (shape, index) =>
      createShape('SelectionBox', {
        shape: shape,
        backgroundColor: "##{@_intToHex(index)}"
      })
    lc.draw(shapes, @selectCtx)

  _intToHex: (i) ->
    "000000#{i.toString 16}".slice(-6)

  _getPixel: (x, y, lc, ctx) ->
    p = lc.drawingCoordsToClientCoords x, y
    pixel = ctx.getImageData(p.x, p.y, 1, 1).data
    if pixel[3]
      parseInt @_rgbToHex(pixel[0], pixel[1], pixel[2]), 16
    else
      null

  _componentToHex: (c) ->
    hex = c.toString(16);
    "0#{hex}".slice -2

  _rgbToHex: (r, g, b) ->
    "#{@_componentToHex(r)}#{@_componentToHex(g)}#{@_componentToHex(b)}"
