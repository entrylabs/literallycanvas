const React = require('../reactGUI/React-shim');

var FontAttributes = React.createClass({
  getInitialState: function() {
      var font = this.props.lc.getFont();
      var fontArray = font.split(" ")
      return {
          style: fontArray.shift(),
          size: fontArray.shift().replace("px", ""),
          font: fontArray.join(" ")
      }
  },
  onChangeSize: function(e) {
    this.setState({
      size: e.target.value
    }, function() {
        this.applyFont();
    }.bind(this))
  },
  onChangeFont: function(e) {
    this.setState({
      font: e.target.value
    }, function() {
        this.applyFont();
    }.bind(this))
  },
  onChangeStyle: function(e) {
    this.setState({
      style: e.target.value
    }, function() {
        this.applyFont();
    }.bind(this))
  },
  applyFont: function() {
    var font = this.state.style + " " + this.state.size + "px " + this.state.font;
    this.props.lc.setFont(font);
  },
  render: function() {
    let fontThickness = []
    for (var i = 1; i <= 65; i++)
        fontThickness.push(i)

    return <div id="painterAttrFont" className="entryPlaygroundPainterAttrFont">
        <div className="entryPlaygroundPainterAttrTop">
            <div className="entryPlaygroundPaintAttrTop_"></div>
            <select value={this.state.font} id="entryPainterAttrFontName" className="entryPlaygroundPainterAttrFontName" size="1" onChange={this.onChangeFont}>
                <option value="KoPub Batang">바탕체</option>
                <option value="Nanum Myeongjo">명조체</option>
                <option value="Nanum Gothic">고딕체</option>
                <option value="Nanum Pen Script">필기체</option>
                <option value="Jeju Hallasan">한라산체</option>
                <option value="Nanum Gothic Coding">코딩고딕체</option>
            </select>
        </div>
        <div className="painterAttrFontSizeArea">
            <div className="painterAttrFontSizeTop"></div>
            <select value={this.state.size}  id="entryPainterAttrFontSize" className="entryPlaygroundPainterAttrFontSize" size="1" onChange={this.onChangeSize}>
                { fontThickness.map(size => {
                    return <option key={size} value={size}>{size}</option>
                })}
            </select>
        </div>
        <div className="entryPlaygroundPainterAttrFontStyleArea">
            <div className="entryPlaygroundPainterAttrFontTop"></div>
            <select value={this.state.style} id="entryPainterAttrFontStyle" className="entryPlaygroundPainterAttrFontStyle" size="1" onChange={this.onChangeStyle}>
                <option value="normal">보통</option>
                <option value="bold">굵게</option>
                <option value="italic">기울임</option>
            </select>
        </div>
    </div>
  }
});

module.exports = FontAttributes;
