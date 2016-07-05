const React = require('../reactGUI/React-shim');
const { defineOptionsStyle } = require('./optionsStyles');
const createSetStateOnEventMixin = require('../reactGUI/createSetStateOnEventMixin');

defineOptionsStyle('stroke-palette', React.createClass({
  displayName: 'StrokePalettePicker',
  getState: function() {
      return {
          strokeWidth: this.props.tool.strokeWidth,
          strokeOrFill: 'stroke',
      };
  },
  getInitialState: function() { return this. getState(); },
  mixins: [createSetStateOnEventMixin('toolChange')],

  onChange: function(e) {
    // console.log('e.target.value=', e.target.value);
    this.setState({strokeWidth: e.target.value});
  },

  render: function() {
    const lc = this.props.lc;

    return <div className="entryPlaygroundentryPlaygroundPainterAttrThickArea">
      <span> {this.state.strokeWidth} </span>
      <legend className="painterAttrThickName">굵기</legend>
      <fieldset id="entryPainterAttrThick" className="entryPlaygroundPainterAttrThick">
        <div className="paintAttrThickTop"></div>
        <select id="entryPainterAttrThick" className="entryPlaygroundPainterAttrThickInput" size="1" value={this.state.strokeWidth} onChange={this.onChange}>
            {[1,2,3,4,5,6,7,8,9,10,11].map((num) => {
                return <option key={num} value={num} >{num}</option>
            })}
        </select>
        <div id="entryPainterShapeLineColor" className="painterAttrShapeLineColor entryRemove">
            <div id="entryPainterShapeInnerBackground" className=" painterAttrShapeInnerBackground"></div>
        </div>
      </fieldset>
    </div>;
  }
}));

module.exports = {}
