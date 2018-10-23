React = require './React-shim'
{classSet} = require '../core/util'
{_} = require '../core/localization'


createToolButton = (tool) ->
  displayName = tool.name
  imageName = tool.iconName
  React.createFactory React.createClass
    displayName: displayName,
    getDefaultProps: -> {selected: null, lc: null}
    componentWillMount: ->
      if @props.selected is displayName
        # prevent race condition with options, tools getting set
        # (I've already forgotten the specifics of this; should reinvestigate
        # and explain here. --steve)
        @props.lc.setTool(tool)
    render: ->
      {div, img} = React.DOM
      {imageURLPrefix, selected, onSelect} = @props
      className = classSet
        'lc-pick-tool': true
        'toolbar-button': true
        'thin-button': true
        'selected': selected is displayName
        "#{imageName}-icon": true
      if (imageName is "none")
        style = {'display': 'none'}
      (div {
        className,
        style: style,
        # iconName: tool.iconName,
        onClick: (-> onSelect(tool)), 
        title: _(Lang.Workspace[displayName]),
        alt: _(Lang.Workspace[displayName])})


module.exports = createToolButton