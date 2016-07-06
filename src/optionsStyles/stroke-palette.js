const React = require('../reactGUI/React-shim');
const { defineOptionsStyle } = require('./optionsStyles');

var StrokeThickness = React.createClass({
  getState: function(props) {
      var props = props || this.props;
    //   console.log('getState');
      return {
        toolName: props.tool.name,
        strokeWidth: props.tool.strokeWidth,
      };
  },

  getInitialState: function() { return this.getState(); },

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
      {/*<span> {this.state.strokeWidth} </span>*/}
      <legend className="painterAttrThickName">굵기</legend>
      <fieldset id="entryPainterAttrThick" className="entryPlaygroundPainterAttrThick">
        <div className="paintAttrThickTop"></div>
        <select id="entryPainterAttrThick" className="entryPlaygroundPainterAttrThickInput" size="1" value={this.state.strokeWidth} onChange={this.onChange}>
            {[1,2,3,4,5,6,7,8,9,10].map((num) => {
                return <option key={num} value={num} >{num}</option>
            })}
        </select>
        <div id="entryPainterShapeLineColor" className="painterAttrShapeLineColor entryRemove">
            <div id="entryPainterShapeInnerBackground" className=" painterAttrShapeInnerBackground"></div>
        </div>
      </fieldset>
    </div>;
  }
});

var Entry = Entry || {
    getColourCodes: function () {
        return [
            'transparent', '#660000', '#663300', '#996633', '#003300', '#003333', '#003399', '#000066', '#330066', '#660066',
            '#FFFFFF', '#990000', '#993300', '#CC9900', '#006600', '#336666', '#0033FF', '#000099', '#660099', '#990066',
            '#000000', '#CC0000', '#CC3300', '#FFCC00', '#009900', '#006666', '#0066FF', '#0000CC', '#663399', '#CC0099',
            '#333333', '#FF0000', '#FF3300', '#FFFF00', '#00CC00', '#009999', '#0099FF', '#0000FF', '#9900CC', '#FF0099',
            '#666666', '#CC3333', '#FF6600', '#FFFF33', '#00FF00', '#00CCCC', '#00CCFF', '#3366FF', '#9933FF', '#FF00FF',
            '#999999', '#FF6666', '#FF6633', '#FFFF66', '#66FF66', '#66CCCC', '#00FFFF', '#3399FF', '#9966FF', '#FF66FF',
            '#BBBBBB','#FF9999', '#FF9966', '#FFFF99', '#99FF99', '#66FFCC', '#99FFFF', '#66CCff', '#9999FF', '#FF99FF',
            '#CCCCCC','#FFCCCC', '#FFCC99', '#FFFFCC', '#CCFFCC', '#99FFCC', '#CCFFFF', '#99CCFF', '#CCCCFF', '#FFCCFF'
        ];
    }
}

var Palette = React.createClass({
  getInitialState: function() {
      return {
        paletteStyles: Entry.getColourCodes().map(color => {
            if (color === 'transparent') {
                return { backgroundImage: `url(${this.props.imageURLPrefix}/transparent.png)` };
            } else {
                return { backgroundColor: color};
            }
        })
      };
  },

  onClick: function(e) {
      console.log('selected color:', e.target.style.backgroundColor);
  },

  render: function() {
    console.log('Palette render!');
    return <div className="entryPlaygroundPainterAttrColorContainer">
        {this.state.paletteStyles.map( (style, idx) => {
            return <div key={idx} className="entryPlaygroundPainterAttrColorElement" onClick={this.onClick} style={style} />
        })}
    </div>
  }
});

defineOptionsStyle('stroke-palette', React.createClass({
  displayName: 'StrokePalettePicker',

  render: function() {
    console.log('StrokePalettePicker render! this.props=', this.props);
    var lc = this.props.lc;

    return <div className="strokePalette">
        <StrokeThickness lc={lc} tool={this.props.tool}/>

        <Palette imageURLPrefix={this.props.imageURLPrefix} />
    </div>;
  }
}));

module.exports = {}
