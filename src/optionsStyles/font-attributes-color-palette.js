const React = require('react');
const createReactClass = require('create-react-class');
const FontAttributes = require('../reactGUI/FontAttributes');
const SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle(
    'font-attributes-color-palette',
    createReactClass({
        displayName: 'FontAttributesColorPalette',

        render: function() {
            const { lc, tool } = this.props;
            const { name } = tool;

            return (
                <div className="strokePalette">
                    <div className="entryStrokePaletteTitle">{Lang.Workspace[name]}</div>
                    <div className="entryStrokePalettePalette">
                        <FontAttributes lc={lc} tool={this.props.tool}>
                            <SelectedColorPanel
                                tool={this.props.tool}
                                imageURLPrefix={this.props.imageURLPrefix}
                                strokeColor="#000000"
                                fillColor="transparent"
                                colorPrefix="font"
                                strokeOption={{
                                    canTransparent: false,
                                }}
                                fillOption={{
                                    canTransparent: true,
                                }}
                                lc={lc}
                            />
                        </FontAttributes>
                    </div>
                </div>
            );
        },
    })
);

module.exports = {};
