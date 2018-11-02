'use strict';

var React = require('../reactGUI/React-shim');
var createReactClass = require('create-react-class');
// const SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
// const StrokeThickness = require('../reactGUI/StrokeThickness');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('select-cut', createReactClass({
    displayName: 'selectCut',

    render: function render() {
        var _props = this.props,
            lc = _props.lc,
            tool = _props.tool;
        var name = tool.name;


        return React.createElement(
            'div',
            { className: 'selectCut' },
            React.createElement('div', { className: 'selectCutImage' }),
            React.createElement(
                'div',
                { className: 'selectCutDesc' },
                '\uC0AC\uAC01 \uC810\uC120 \uBAA8\uC591\uC73C\uB85C \uC624\uB9B4 \uC218 \uC788\uC5B4\uC694.[*]'
            )
        );
    }
}));

module.exports = {};