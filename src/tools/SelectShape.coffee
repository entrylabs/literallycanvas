{Tool} = require './base'
{createShape} = require '../core/shapes'

getIsPointInBox = (point, box) ->
  if point.x < box.x then return false
  if point.y < box.y then return false
  if point.x > box.x + box.width then return false
  if point.y > box.y + box.height then return false
  return true

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

      point = {x, y}
      if @selectedShape
        selectionShape = createShape('SelectionBox', {shape: @selectedShape})
        if getIsPointInBox(point, selectionShape.getBottomRightHandleRect())
          @dragAction = 'resizeBottomRight'
        else if getIsPointInBox(point, selectionShape.getTopLeftHandleRect())
          @dragAction = 'resizeTopLeft'
        else if getIsPointInBox(point, selectionShape.getBottomLeftHandleRect())
          @dragAction = 'resizeBottomLeft'
        else if getIsPointInBox(point, selectionShape.getTopRightHandleRect())
          @dragAction = 'resizeTopRight'
        else if @selectedShape is shape
          @dragAction = 'move'
          @setShape(lc, shape)

        @initialShapeBoundingRect = @selectedShape.getBoundingRect(lc.ctx)
        @prevOpts = {
          x: @selectedShape.x,
          y: @selectedShape.y,
          width: @selectedShape.width,
          height: @selectedShape.height
        }
        br = @selectedShape.getBoundingRect()
        @dragOffset = {
          x: x - br.x,
          y: y - br.y
        }
      if !@dragAction?
        @setShape(lc, null)
        @oldPosition = lc.position
        @pointerStart = {x: rawX, y: rawY}

    onDrag = ({ x, y, rawX, rawY }) =>
      lc.setCursor('url("/lib/literallycanvas/lib/img/handclosed.cur"), default')
      if @dragAction
        br = @initialShapeBoundingRect
        brRight = br.x + br.width
        brBottom = br.y + br.height
        switch @dragAction
          when 'resizeBottomRight'
            @selectedShape.setSize(
              x - (@dragOffset.x - @initialShapeBoundingRect.width) - br.x,
              y - (@dragOffset.y - @initialShapeBoundingRect.height) - br.y)
          when 'resizeTopLeft'
            @selectedShape.setSize(
              brRight - x + @dragOffset.x,
              brBottom - y + @dragOffset.y)
            @selectedShape.setPosition(x - @dragOffset.x, y - @dragOffset.y)
          when 'resizeBottomLeft'
            @selectedShape.setSize(
              brRight - x + @dragOffset.x,
              y - (@dragOffset.y - @initialShapeBoundingRect.height) - br.y)
            @selectedShape.setPosition(x - @dragOffset.x, @selectedShape. y)
          when 'resizeTopRight'
            @selectedShape.setSize(
              x - (@dragOffset.x - @initialShapeBoundingRect.width) - br.x,
              brBottom - y + @dragOffset.y)
            @selectedShape.setPosition(@selectedShape.x, y - @dragOffset.y)
          when 'move'
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
      if @dragAction
        if @didDrag
          @didDrag = false
          lc.editShape(@selectedShape, {
            x: x - @dragOffset.x,
            y: y - @dragOffset.y
          }, @prevOpts)
          lc.trigger('shapeMoved', { shape: @selectedShape })
        else
          lc.editShape(@selectedShape, {
            x: @selectedShape.x,
            y: @selectedShape.y,
            width: @selectedShape.width,
            height: @selectedShape.height
          }, @prevOpts)
          lc.trigger('shapeResized', {shape: @selectedShape})
        lc.trigger('drawingChange', {})
        lc.repaintLayer('main')
        @_drawSelectCanvas(lc)
        @dragAction = null
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
