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
    if (shape) {
      this.setState({
        width: shape.width,
        height: shape.height,
      })
      this.width = shape.width;
      this.height = shape.height;
      this.rotate = shape.rotate;
    }
  },
  componentWillUnmount: function() {
      this.unsubscribe();
  },
  onChangeX: function(e) {
    var width = parseInt(e.target.value);
    if (!width) width = 0
    this.setState({width});
    this.state.shape.width = width;
    this.props.lc.trigger('drawingChange');
  },
  onChangeY: function(e) {
    var height = parseInt(e.target.value);
    if (!height) height = 0
    this.setState({height});
    this.state.shape.height = height;
    this.props.lc.trigger('drawingChange');
  },
  applyX: function() {
    this.props.lc.editShape(
      this.state.shape,
      {width: this.state.width},
      {width: this.width}
    );
    this.width = this.state.width;
  },
  applyY: function() {
    this.props.lc.editShape(
      this.state.shape,
      {height: this.state.height},
      {height: this.height}
    );
    this.height = this.state.height;
  },
  onChangeRotate: function(e) {
    var rotate = parseInt(e.target.value);
    if (!rotate) rotate = 0
    this.setState({rotate});
    this.state.shape.rotate = rotate;
    this.props.lc.trigger('drawingChange');
  },
  flipX: function() {
    this.props.lc.editShape(
      this.state.shape,
      {flipX: !this.state.shape.flipX}
    );
  },
  flipY: function() {
    this.props.lc.editShape(
      this.state.shape,
      {flipY: !this.state.shape.flipY}
    );
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
                        value={width} onChange={this.onChangeX} onBlur={this.applyX}/>
                </div>
                <div className="entryPlaygroundPainterSizeText">x</div>
                <div className="entryPlaygroundAttrReiszeY">
                    <div className="entryPlaygroundPainterAttrResizeYTop">Y</div>
                    <input id="entryPainterAttrHeight" className="entryPlaygroundPainterNumberInput"
                        value={height} onChange={this.onChangeY} onBlur={this.applyY} />
                </div>
            </div>
        </fieldset> : null}

        {this.state.shape ? <div id="painterAttrRotateArea" className="painterAttrRotateArea">
            <div className="painterAttrRotateName">회전</div>
            <fieldset id="entryPainterAttrRotate" className="entryPlaygroundPainterAttrRotate">
                <div className="painterAttrRotateTop">ο</div>
                <input id="entryPainterAttrDegree" className="entryPlaygroundPainterNumberInput"
                    value={rotate} onChange={this.onChangeRotate} onBlur={this.applyRotate} />
            </fieldset>
        </div> : null}

        <div id="entryPictureFlip" className="entryPlaygroundPainterFlip  ">
            <div id="entryPictureFlipX" onClick={this.flipX} title="좌우뒤집기" className="entryPlaygroundPainterFlipX"></div>
            <div id="entryPictureFlipY" onClick={this.flipY} title="상하뒤집기" className="entryPlaygroundPainterFlipY"></div>
        </div>
    </div>
  }
});

module.exports = MoveAttributes;
