'use strict';

var React = require('../reactGUI/React-shim');
var createReactClass = require('create-react-class');
var MagnifyPanel = require('../reactGUI/MagnifyPanel');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('magnify', createReactClass({
    displayName: 'magnify',
    render: function render() {
        var _props = this.props,
            lc = _props.lc,
            tool = _props.tool;
        var name = tool.name;

        return React.createElement(
            'div',
            { className: 'magnifierPalette' },
            React.createElement(
                'div',
                { className: 'entryPaintMagnifierTitle' },
                Lang.Workspace[name]
            ),
            React.createElement(MagnifyPanel, this.props)
        );
    }
}));

module.exports = {};