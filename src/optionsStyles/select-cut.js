const React = require('../reactGUI/React-shim');
const createReactClass = require('create-react-class');
// const SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
// const StrokeThickness = require('../reactGUI/StrokeThickness');
const { defineOptionsStyle } = require('./optionsStyles');

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
                    <div className="selectCutDesc">사각 점선 모양으로 오릴 수 있어요.[*]</div>
                </div>
            );
        },
    })
);

module.exports = {};
