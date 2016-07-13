const SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle('color-palette', React.createClass({
  displayName: 'ColorPalette',

  render: function() {
    var lc = this.props.lc;

    return <SelectedColorPanel tool={this.props.tool} imageURLPrefix={this.props.imageURLPrefix}
            strokeColor="#000000" fillColor="#000000" lc={lc} />
  }
}));

module.exports = {}
