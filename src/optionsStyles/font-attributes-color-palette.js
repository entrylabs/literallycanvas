const FontAttributes = require('../reactGUI/FontAttributes');
const SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle('font-attributes-color-palette', React.createClass({
  displayName: 'FontAttributesColorPalette',

  render: function() {
    var lc = this.props.lc;

    return <div className="strokePalette">
        <FontAttributes lc={lc} tool={this.props.tool}/>
        <SelectedColorPanel tool={this.props.tool} imageURLPrefix={this.props.imageURLPrefix}
            strokeColor="#FF00FF" fillColor="#0000FF" />
    </div>;
  }
}));

module.exports = {}
