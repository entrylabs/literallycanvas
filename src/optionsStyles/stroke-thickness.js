const React = require('react');
const createReactClass = require('create-react-class');
const StrokeThickness = require('../reactGUI/StrokeThickness');
const { defineOptionsStyle } = require('./optionsStyles');

// defineOptionsStyle('stroke-thickness', StrokeThickness);
defineOptionsStyle(
    'stroke-thickness',
    createReactClass({
        displayName: 'StrokeThicknessPicker',

        render: function() {
            const { lc, tool } = this.props;
            const { name } = tool;
            return (
                <div className="strokePalette">
                    <div className="entryStrokePaletteTitle">{Lang.Workspace[name]}</div>
                    <StrokeThickness {...this.props} name="지우개 굵기[*]" />
                </div>
            );
        },
    })
);

module.exports = {};
