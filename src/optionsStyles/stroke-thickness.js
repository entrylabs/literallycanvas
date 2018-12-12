const React = require('react');
const createReactClass = require('create-react-class');
const StrokeThickness = require('../reactGUI/StrokeThickness');
const { defineOptionsStyle } = require('./optionsStyles');
import Utils from '../utils';

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
                    <StrokeThickness
                        {...this.props}
                        name={Utils.getLang('Painter.thickness_of_eraser')}
                    />
                </div>
            );
        },
    })
);

module.exports = {};
