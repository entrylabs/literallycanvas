const React = require('../reactGUI/React-shim');

var MoveAttributes = React.createClass({
  getInitialState: function() {
      return {
          x: this.props.x,
          y: this.props.y,
          rotate: this.props.rotate,
      }
  },
  onChangeX: function(e) {
    this.setState({x: e.target.value})
  },
  onChangeY: function(e) {
    this.setState({y: e.target.value})
  },
  onChangeRotate: function(e) {
    this.setState({rotate: e.target.value})
  },
  flipX: function() {
    console.log('flipX');
  },
  flipY: function() {
    console.log('flipY');
  },
  render: function() {
    let { x, y, rotate } = this.state;

    return <div className="entryMoveAttributes">
        <fieldset id="painterAttrResize" className="entryPlaygroundPainterAttrResize">
            <legend>크기</legend>
            <div id="painterAttrWrapper" className="painterAttrWrapper">
                <div className="entryPlaygroundPainterAttrResizeX">
                    <div className="entryPlaygroundPainterAttrResizeXTop">X</div>
                    <input id="entryPainterAttrWidth" className="entryPlaygroundPainterNumberInput"
                        value={x} onChange={this.onChangeX} />
                </div>
                <div className="entryPlaygroundPainterSizeText">x</div>
                <div className="entryPlaygroundAttrReiszeY">
                    <div className="entryPlaygroundPainterAttrResizeYTop">Y</div>
                    <input id="entryPainterAttrHeight" className="entryPlaygroundPainterNumberInput"
                        value={y} onChange={this.onChangeY} />
                </div>
            </div>
        </fieldset>

        <div id="painterAttrRotateArea" className="painterAttrRotateArea">
            <div className="painterAttrRotateName">회전</div>
            <fieldset id="entryPainterAttrRotate" className="entryPlaygroundPainterAttrRotate">
                <div className="painterAttrRotateTop">ο</div>
                <input id="entryPainterAttrDegree" className="entryPlaygroundPainterNumberInput"
                    value={rotate} onChange={this.onChangeRotate} />
            </fieldset>
        </div>

        <div id="entryPictureFlip" className="entryPlaygroundPainterFlip  ">
            <div id="entryPictureFlipX" onClick={this.flipX} title="좌우뒤집기" className="entryPlaygroundPainterFlipX"></div>
            <div id="entryPictureFlipY" onClick={this.flipY} title="상하뒤집기" className="entryPlaygroundPainterFlipY"></div>
        </div>
    </div>
  }
});

module.exports = MoveAttributes;
