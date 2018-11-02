'use strict';

var React = require('../reactGUI/React-shim');
var createReactClass = require('create-react-class');
var SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
var StrokeThickness = require('../reactGUI/StrokeThickness');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('stroke-palette', createReactClass({
    displayName: 'StrokePalettePicker',

    render: function render() {
        var _props = this.props,
            lc = _props.lc,
            tool = _props.tool;
        var name = tool.name;

        return React.createElement(
            'div',
            { className: 'strokePalette' },
            React.createElement(
                'div',
                { className: 'entryStrokePaletteTitle' },
                Lang.Workspace[name]
            ),
            React.createElement(StrokeThickness, { lc: lc, tool: this.props.tool }),
            React.createElement(SelectedColorPanel, {
                tool: this.props.tool,
                imageURLPrefix: this.props.imageURLPrefix,
                disableTransparent: true,
                strokeColor: '#000000',
                lc: lc,
                isFill: false
            })
        );
    }
}));

module.exports = {};