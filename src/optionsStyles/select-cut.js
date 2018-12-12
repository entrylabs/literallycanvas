const React = require('../reactGUI/React-shim');
const createReactClass = require('create-react-class');
// const SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
// const StrokeThickness = require('../reactGUI/StrokeThickness');
const { defineOptionsStyle } = require('./optionsStyles');
import Utils from '../utils';

defineOptionsStyle(
    'select-cut',
    createReactClass({
        displayName: 'selectCut',

        render: function() {
            const { lc, tool } = this.props;
            const { name } = tool;

            return (
                <div className="selectCut">
                    <div className="selectCutImage" />
                    <div className="selectCutDesc">{Utils.getLang('Painter.select_cut')}</div>
                </div>
            );
        },
    })
);

module.exports = {};
