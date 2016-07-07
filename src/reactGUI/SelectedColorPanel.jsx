const React = require('../reactGUI/React-shim');

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
  getDefaultProps: function() {
    return {
        colourCodes: Entry.getColourCodes()
    };
  },

  getInitialState: function() {
      return {
        paletteStyles: this.props.colourCodes.map(color => {
            if (color === 'transparent') {
                return { backgroundImage: `url(${this.props.imageURLPrefix}/transparent.png)` };
            } else {
                return { backgroundColor: color};
            }
        })
      };
  },

  onClickWithColor: function(colorCode) {
      this.props.colorPicked(colorCode);
  },

  render: function() {
    var colourCodes = this.props.colourCodes;
    console.log('Palette render!');
    return <div className="entryPlaygroundPainterAttrColorContainer">
        {this.state.paletteStyles.map( (style, idx) => {
            var colorCode = colourCodes[idx];
            var colorBindOnClick = this.onClickWithColor.bind(this, colorCode);
            return <div key={idx} className="entryPlaygroundPainterAttrColorElement" onClick={colorBindOnClick} style={style} />
        })}
    </div>
  }
});

var ColorSpoid = React.createClass({
  getInitialState: function() {
      var spoidOFF = {
          width: 27,
          height: 27,
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${this.props.imageURLPrefix}/color_off_spoid.png)`,
      };

      var spoidON = Object.assign({}, spoidOFF);
      spoidON.backgroundImage = `url(${this.props.imageURLPrefix}/color_on_spoid.png)`;

      return {
        isOn: false,
        spoidON: spoidON,
        spoidOFF: spoidOFF,
      };
  },

  toggleSpoid: function(e) {
      var isOn = this.state.isOn;
      this.setState({ isOn: !isOn})
  },

  render: function() {
    // console.log('Palette render! isOn:', this.state.isOn);
    return <div className="entryColorSpoid" style={this.state.spoidON} onClick={this.toggleSpoid} >
        { this.state.isOn ? null : <div className="entryColorSpoidOFF" style={this.state.spoidOFF} /> }
    </div>
  }
});

var SelectedColorPanel = React.createClass({
  getFillPanelShow: function(props) {
      return (props.tool.name === 'Rectangle' || props.tool.name === 'Ellipse')
  },

  componentWillReceiveProps: function(nextProps) {
    // console.log('SelectedColorPanel componentWillReceiveProps nextProps:', nextProps);
    var isFillPanelShow = this.getFillPanelShow(nextProps);
    if (isFillPanelShow) {
        this.setState({isFillPanelShow: isFillPanelShow});
    } else {
        var state = this.getStrokeColorState();
        state.isFillPanelShow = isFillPanelShow;
        this.setState(state);
    }
  },

  getInitialState: function() {
      var isFillPanelShow = true;
      return {
          isFillPanelShow: this.getFillPanelShow(this.props),
          colorCode: this.props.strokeColor,
          fillColorCode: this.props.fillColor,
          strokeColorCode: this.props.strokeColor,
          fillStyle: { zIndex: 0, backgroundColor: this.props.fillColor},
          strokeStyle: { zIndex: 99, backgroundColor: this.props.strokeColor},
      }
  },

  getFillColorState: function(fillColorCode) {
      fillColorCode = fillColorCode || this.state.fillColorCode;
      return {
          fillStyle: { zIndex: 99, backgroundColor: fillColorCode},
          strokeStyle: { zIndex: 0, backgroundColor: this.state.strokeColorCode},
          colorCode: fillColorCode,
          fillColorCode: fillColorCode,
      };
  },

  getStrokeColorState: function(strokeColorCode) {
      strokeColorCode = strokeColorCode || this.state.strokeColorCode;
      return {
          fillStyle: { zIndex: 0, backgroundColor: this.state.fillColorCode},
          strokeStyle: { zIndex: 99, backgroundColor: strokeColorCode},
          colorCode: strokeColorCode,
          strokeColorCode: strokeColorCode,
      };
  },

  onClickFillPanel: function() {
      console.log('onClickFillPanel this.state', this.state);
      this.setState(this.getFillColorState());
  },

  onClickStokePanel: function() {
      console.log('onClickStokePanel this.state', this.state);
      this.setState(this.getStrokeColorState());
  },

  onColorCodeChange: function(e) {
      this.setState({colorCode: e.target.value});
  },

  colorPicked: function(colorCode) {
      if (this.state.colorCode === this.state.strokeColorCode) {
          this.setState(this.getStrokeColorState(colorCode));
      } else {
          this.setState(this.getFillColorState(colorCode));
      }
  },

  render: function() {
    // console.log('Palette render! isOn:', this.state.isOn);
    var { fillStyle, strokeStyle } = this.state;
    return <div className="entrySelectedColorPanel" >
        {this.state.isFillPanelShow ? <div className="entrySelectedColorPanelFill" style={fillStyle} onClick={this.onClickFillPanel} /> : null}
        <div className="entrySelectedColorPanelStroke" style={strokeStyle} onClick={this.onClickStokePanel} >
            <div className="entrySelectedColorPanelStrokeInner" />
        </div>
        <input value={this.state.colorCode} onChange={this.onColorCodeChange} />

        <Palette colorPicked={this.colorPicked} imageURLPrefix={this.props.imageURLPrefix} />
        <ColorSpoid imageURLPrefix={this.props.imageURLPrefix} />
    </div>
  }
});

module.exports = SelectedColorPanel;
