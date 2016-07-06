const React = require('../reactGUI/React-shim');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle('stroke-palette', React.createClass({
  displayName: 'StrokePalettePicker',
  getState: function(props) {
      var props = props || this.props;
    //   console.log('getState');
      return {
          toolName: props.tool.name,
          strokeWidth: props.tool.strokeWidth,
      };
  },
  getInitialState: function() { return this. getState(); },

  componentWillReceiveProps: function(nextProps) {
    //   console.log('componentWillReceiveProps nextProps:', nextProps);
    if (this.state.toolName !== nextProps.tool.name) {
        console.log('tool changed!');
        this.setState(this.getState(nextProps));
    }
  },

  onChange: function(e) {
    // console.log('e.target.value=', e.target.value);
    var strokeWidth = +e.target.value;
    this.setState({strokeWidth: strokeWidth});
    this.props.lc.trigger('setStrokeWidth', strokeWidth);
  },

  render: function() {
    const lc = this.props.lc;
    // console.log('lc:', lc);
    // console.log('tool.name:', lc.tool.name);
    // console.log('strokeWidth:', this.state.strokeWidth);

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
