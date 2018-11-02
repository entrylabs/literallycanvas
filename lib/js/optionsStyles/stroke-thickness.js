'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var createReactClass = require('create-react-class');
var StrokeThickness = require('../reactGUI/StrokeThickness');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

// defineOptionsStyle('stroke-thickness', StrokeThickness);


defineOptionsStyle('stroke-thickness', createReactClass({
    displayName: 'StrokeThicknessPicker',

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
            React.createElement(StrokeThickness, _extends({}, this.props, { name: '\uC9C0\uC6B0\uAC1C \uAD75\uAE30[*]' }))
        );
    }
}));

module.exports = {};