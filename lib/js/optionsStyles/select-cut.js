'use strict';

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
                _utils2.default.getLang('Painter.select_cut')
            )
        );
    }
}));

module.exports = {};