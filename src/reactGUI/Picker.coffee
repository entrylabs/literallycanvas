React = require './React-shim'
createReactClass = require 'create-react-class'
DOM = require 'react-dom-factories';
ClearButton = React.createFactory require './ClearButton'
UndoRedoButtons = React.createFactory require './UndoRedoButtons'
ZoomButtons = React.createFactory require './ZoomButtons'

# {_} = require '../core/localization'
# ColorWell = React.createFactory require './ColorWell'
#
# ColorPickers = React.createFactory createReactClass
#   displayName: 'ColorPickers'
#   render: ->
#     {lc} = @props
#     {div} = DOM
#     (div {className: 'lc-color-pickers'},
#       (ColorWell {lc, colorName: 'primary', label: _('stroke')})
#       (ColorWell {lc, colorName: 'secondary', label: _('fill')}),
#       (ColorWell {lc, colorName: 'background', label: _('bg')})
#     )


Picker = createReactClass
  displayName: 'Picker'
  getInitialState: -> {selectedTool: "SelectShape"}
  componentWillMount: ->
    @unobserve = @props.lc.on("toolChange", @applyTool)
  componentWillUnmount:
    @unobserve() if @unobserve
  applyTool: (attr) ->
    tool = attr.tool
    @setState({selectedTool: tool.name})
  renderBody: ->
    {div} = DOM
    {toolButtonComponents, lc, imageURLPrefix} = @props
    (div {className: 'lc-picker-contents'},
      toolButtonComponents.map((component, ix) =>
        (component \
          {
            lc, imageURLPrefix,
            key: ix
            selected: @state.selectedTool,
            onSelect: (tool) =>
              tool.isSelect = true;
              lc.setTool(tool)
          }
        )
      ),
      if toolButtonComponents.length % 2 != 0
        (div {className: 'toolbar-button thin-button disabled'})
      (div style: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }
        # ColorPickers({lc: @props.lc})
        # UndoRedoButtons({lc, imageURLPrefix})
        # ZoomButtons({lc, imageURLPrefix})
        # ClearButton({lc})
      )
    )
  render: ->
    {div} = DOM
    (div {className: 'lc-picker'},
      this.renderBody()
    )


module.exports = Picker
