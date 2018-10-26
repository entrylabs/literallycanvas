const React = require('../reactGUI/React-shim');
const MagnifyPanel = require('../reactGUI/MagnifyPanel');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle(
    'magnify',
    React.createClass({
        displayName: 'magnify',
        render: function() {
            const { lc, tool } = this.props;
            const { name } = tool;
            return (
                <div className="magnifierPalette">
                    <div className="entryPaintMagnifierTitle">{Lang.Workspace[name]}</div>
                    <MagnifyPanel {...this.props} />
                </div>
            );
        },
    })
);

module.exports = {};
