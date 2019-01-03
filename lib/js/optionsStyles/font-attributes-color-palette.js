'use strict';

var React = require('react');
var createReactClass = require('create-react-class');
var FontAttributes = require('../reactGUI/FontAttributes');
var SelectedColorPanel = require('../reactGUI/SelectedColorPanel');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('font-attributes-color-palette', createReactClass({
    displayName: 'FontAttributesColorPalette',

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
            React.createElement(
                'div',
                { className: 'entryStrokePalettePalette' },
                React.createElement(
                    FontAttributes,
                    { lc: lc, tool: this.props.tool },
                    React.createElement(SelectedColorPanel, {
                        tool: this.props.tool,
                        imageURLPrefix: this.props.imageURLPrefix,
                        strokeColor: '#000000',
                        fillColor: '#FFFFFF',
                        colorPrefix: 'font',
                        strokeOption: {
                            canTransparent: false,
                            label: 'Painter.font_color'
                        },
                        fillOption: {
                            canTransparent: true
                        },
                        lc: lc
                    })
                )
            )
        );
    }
}));

module.exports = {};