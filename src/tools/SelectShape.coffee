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

  nextIsPass: false

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

      @dragAction = @_getPixel(x, y, lc, @selectCtx)

      if @dragAction
        @prevPoint = {x, y}
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
      else
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
          when 1 #drag
            @didDrag = true

            @selectedShape.setUpperLeft {
              x: @selectedShape.x - @prevPoint.x + x,
              y: @selectedShape.y - @prevPoint.y + y
            }
            @prevPoint = {x, y}
          when 2 # resize
            width = Math.abs(Math.abs(@selectedShape.x - x) - 5) * 2
            height = Math.abs(Math.abs(@selectedShape.y - y) - 5) * 2
            @selectedShape.setSize(width, height)
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
            x: @selectedShape.x,
            y: @selectedShape.y,
            isPass: @nextIsPass
          }, @prevOpts)
          lc.trigger('shapeMoved', { shape: @selectedShape })
        else
          lc.editShape(@selectedShape, {
            x: @selectedShape.x,
            y: @selectedShape.y,
            width: @selectedShape.width,
            height: @selectedShape.height,
            isPass: @nextIsPass
          }, @prevOpts)
          lc.trigger('shapeResized', {shape: @selectedShape})
        @nextIsPass = false
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

    onKeyDown = (e) =>
      if (!@selectedShape)
        return
      pos = {
        x: @selectedShape.x
        y: @selectedShape.y
      }
      diff = 5
      if (e.shiftKey)
        diff = 1
      switch e.keyCode
        when 38 then pos.y = pos.y - diff
        when 40 then pos.y = pos.y + diff
        when 37 then pos.x = pos.x - diff
        when 39 then pos.x = pos.x + diff
      lc.editShape(@selectedShape, pos)

    selectShapeUnsubscribeFuncs.push lc.on 'lc-pointerdown', onDown
    selectShapeUnsubscribeFuncs.push lc.on 'lc-pointerdrag', onDrag
    selectShapeUnsubscribeFuncs.push lc.on 'lc-pointerup', onUp
    selectShapeUnsubscribeFuncs.push lc.on 'undo', dispose
    selectShapeUnsubscribeFuncs.push lc.on 'drawingChange', update
    selectShapeUnsubscribeFuncs.push lc.on 'keyDown', onKeyDown

    @_drawSelectCanvas(lc)

  willBecomeInactive: (lc) ->
    @_selectShapeUnsubscribe()
    lc.setShapesInProgress []

  setShape: (lc, shape, @nextIsPass) ->
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
    @_drawSelectCanvas(lc)

  _drawSelectCanvas: (lc) ->
    @selectCanvas.width = lc.canvas.width
    @selectCanvas.height = lc.canvas.height
    @selectCtx.clearRect(0, 0, @selectCanvas.width, @selectCanvas.height)
    if (@selectedShape)
      shape = createShape('SelectionBox', {
        shape: @selectedShape,
        backgroundColor: "#000001",
        isMask: true
      })
      lc.draw([shape], @selectCtx)

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
