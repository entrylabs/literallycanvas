const React = require('../reactGUI/React-shim');
const SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
const StrokeThickness = require('../reactGUI/StrokeThickness');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle(
    'color-palette',
    React.createClass({
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
                        fillColor="#000000"
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
