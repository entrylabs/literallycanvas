const MoveAttributes = require('../reactGUI/MoveAttributes');
const { defineOptionsStyle } = require('./optionsStyles');


defineOptionsStyle('move-attributes', React.createClass({
  displayName: 'MoveAttributes',

  render: function() {
    var lc = this.props.lc;

    return <div>
        <MoveAttributes imageURLPrefix={this.props.imageURLPrefix}
            x="234" y="345" rotate="0" />
    </div>;
  }
}));

module.exports = {}
