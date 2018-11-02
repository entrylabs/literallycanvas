'use strict';

var React = require('react');
var createReactClass = require('create-react-class');
var MoveAttributes = require('../reactGUI/MoveAttributes');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('move-attributes', createReactClass({
    displayName: 'MoveAttributes',

    render: function render() {
        var _props = this.props,
            lc = _props.lc,
            isDefaultShape = _props.isDefaultShape,
            imageURLPrefix = _props.imageURLPrefix,
            tool = _props.tool;


        return React.createElement(
            'div',
            null,
            React.createElement(MoveAttributes, {
                imageURLPrefix: imageURLPrefix,
                isDefaultShape: isDefaultShape,
                lc: lc,
                tool: tool,
                x: '0',
                y: '0',
                rotate: '0'
            })
        );
    }
}));

module.exports = {};