const React = require('../reactGUI/React-shim');
const SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
const StrokeThickness = require('../reactGUI/StrokeThickness');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle(
    'stroke-and-fill',
    React.createClass({
        displayName: 'StrokeAndFill',

        render: function() {
            const { lc, tool } = this.props;
            const { name } = tool;

            return (
                <div className="strokePalette">
                    <div className="entryStrokePaletteTitle">{Lang.Workspace[name]}</div>
                    <StrokeThickness lc={lc} tool={this.props.tool} />
                    <SelectedColorPanel
                        tool={this.props.tool}
                        imageURLPrefix={this.props.imageURLPrefix}
                        strokeColor="#000000"
                        fillColor="#000000"
                        lc={lc}
                    />
                </div>
            );
        },
    })
);

module.exports = {};
