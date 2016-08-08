const React = require('../reactGUI/React-shim');

var MoveAttributes = React.createClass({
  getInitialState: function() {
      return {
          rotate: this.props.rotate,
      }
  },
  componentDidMount: function() {
      var lc = this.props.lc;
      this.unsubscribe = lc.on("shapeSelected", this.setShape);
  },
  setShape: function(shape) {
    this.setState({
      shape: shape
    })
    if (shape)
      this.setState({
        width: shape.width,
        height: shape.height,
      })
  },
  componentWillUnmount: function() {
      this.unsubscribe();
  },
  onChangeX: function(e) {
    var width = e.target.value;
    this.setState({width});
    this.state.shape.width = width;
    this.props.lc.trigger('drawingChange');
  },
  onChangeY: function(e) {
    var height = e.target.value;
    this.setState({height});
    this.state.shape.height = height;
    this.props.lc.trigger('drawingChange');
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
    let { width, height, rotate, shape } = this.state;

    return <div className="entryMoveAttributes">
        {this.state.shape ? <fieldset id="painterAttrResize" className="entryPlaygroundPainterAttrResize">
            <legend>크기</legend>
            <div id="painterAttrWrapper" className="painterAttrWrapper">
                <div className="entryPlaygroundPainterAttrResizeX">
                    <div className="entryPlaygroundPainterAttrResizeXTop">X</div>
                    <input id="entryPainterAttrWidth" className="entryPlaygroundPainterNumberInput"
                        value={width} onChange={this.onChangeX} />
                </div>
                <div className="entryPlaygroundPainterSizeText">x</div>
                <div className="entryPlaygroundAttrReiszeY">
                    <div className="entryPlaygroundPainterAttrResizeYTop">Y</div>
                    <input id="entryPainterAttrHeight" className="entryPlaygroundPainterNumberInput"
                        value={height} onChange={this.onChangeY} />
                </div>
            </div>
        </fieldset> : null}

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
