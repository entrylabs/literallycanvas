const React = require('../reactGUI/React-shim');
const createReactClass = require('create-react-class');
const SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
const StrokeThickness = require('../reactGUI/StrokeThickness');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle(
    'color-palette',
    createReactClass({
        displayName: 'ColorPalette',

        render: function() {
            const { lc, tool } = this.props;
            const { name } = tool;

            return (
                <div className="strokePalette">
                    <div className="entryStrokePaletteTitle">{Lang.Workspace[name]}</div>
                    <SelectedColorPanel
                        tool={this.props.tool}
                        imageURLPrefix={this.props.imageURLPrefix}
                        fillColor="#FF0000"
                        colorPrefix="palette"
                        lc={lc}
                        isStroke={false}
                        disableTransparent={true}
                    />
                </div>
            );
        },
    })
);

module.exports = {};
