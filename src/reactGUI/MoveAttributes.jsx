const React = require('react');
const createReactClass = require('create-react-class');
import Utils from '../utils';

var MoveAttributes = createReactClass({
    getInitialState: function() {
        return {
            rotate: this.props.rotate,
        };
    },
    componentDidMount: function() {
        const { isDefaultShape, lc, tool } = this.props;
        this.unsubscribe = lc.on('shapeSelected', this.setShape);
        this.unsubscribePaint = lc.on('handleShape', this.updateShape);
        // if (isDefaultShape) {
        //     let shape = tool.selectedShape || lc.shapes[0];
        //     this.setShape(shape);
        // }
    },
    setShape: function(shape) {
        this.setState({
            shape: shape,
        });
        if (shape) {
            this.setState({
                width: shape.width,
                height: shape.height,
                rotate: shape.rotate,
            });
            this.width = shape.width;
            this.height = shape.height;
            this.rotate = shape.rotate;
        }
    },
    updateShape: function() {
        if (this.state.shape) {
            var shape = this.state.shape;
            this.setState({
                width: shape.width,
                height: shape.height,
                rotate: shape.rotate,
            });
            this.width = shape.width;
            this.height = shape.height;
            this.rotate = shape.rotate;
        }
    },
    componentWillUnmount: function() {
        this.unsubscribe();
        this.unsubscribePaint();
    },
    onChangeX: function(e) {
        var width = parseInt(e.target.value);
        if (!width) width = 0;
        this.setState({ width });
        this.state.shape.width = width;
        this.props.lc.trigger('drawingChange');
    },
    onChangeY: function(e) {
        var height = parseInt(e.target.value);
        if (!height) height = 0;
        this.setState({ height });
        this.state.shape.height = height;
        this.props.lc.trigger('drawingChange');
    },
    applyX: function() {
        this.props.lc.editShape(
            this.state.shape,
            { width: this.state.width },
            { width: this.width }
        );
        this.width = this.state.width;
    },
    applyY: function() {
        this.props.lc.editShape(
            this.state.shape,
            { height: this.state.height },
            { height: this.height }
        );
        this.height = this.state.height;
    },
    onChangeRotate: function(e) {
        var rotate = parseInt(e.target.value);
        if (!rotate) rotate = 0;
        this.setState({ rotate });
        this.state.shape.rotate = rotate;
        this.props.lc.trigger('drawingChange');
    },
    applyRotate: function(e) {
        this.props.lc.editShape(
            this.state.shape,
            { rotate: this.state.rotate },
            { rotate: this.rotate }
        );
        this.rotate = this.state.rotate;
    },
    flipX: function() {
        this.props.lc.editShape(this.state.shape, { flipX: !this.state.shape.flipX });
    },
    flipY: function() {
        this.props.lc.editShape(this.state.shape, { flipY: !this.state.shape.flipY });
    },
    render: function() {
        let { width = 0, height = 0, rotate = 0 } = this.state;

        return (
            <div className="entryMoveAttributes">
                <div className="entryMoveTitle">{Lang.Workspace.SelectShape}</div>
                {this.state.shape ? (
                    <div id="painterAttrResize" className="entryPlaygroundPainterAttrResize">
                        <div className="title">
                            {Lang.Workspace.picture_size}
                            (Pixel)
                        </div>
                        <div id="painterAttrWrapper" className="painterAttrWrapper">
                            <div className="entryPlaygroundPainterAttrResizeX">
                                <div className="entryPlaygroundPainterAttrResizeXTop">X</div>
                                <input
                                    id="entryPainterAttrWidth"
                                    type="number"
                                    className="entryPlaygroundPainterNumberInput"
                                    value={Math.round(width * 10) / 10}
                                    onChange={this.onChangeX}
                                    onBlur={this.applyX}
                                />
                            </div>
                            <div className="entryPlaygroundPainterAttrReiszeY">
                                <div className="entryPlaygroundPainterAttrResizeYTop">Y</div>
                                <input
                                    id="entryPainterAttrHeight"
                                    type="number"
                                    className="entryPlaygroundPainterNumberInput"
                                    value={Math.round(height * 10) / 10}
                                    onChange={this.onChangeY}
                                    onBlur={this.applyY}
                                />
                            </div>
                        </div>
                    </div>
                ) : null}

                {this.state.shape ? (
                    <div id="painterAttrRotateArea" className="painterAttrRotateArea">
                        <div className="painterAttrRotateName">
                            {Lang.Workspace.picture_rotation}
                            (º)
                        </div>
                        <div
                            id="entryPainterAttrRotate"
                            className="entryPlaygroundPainterAttrRotate"
                        >
                            <input
                                id="entryPainterAttrDegree"
                                type="number"
                                className="entryPlaygroundPainterNumberInput"
                                value={Math.round(rotate * 10) / 10}
                                onChange={this.onChangeRotate}
                                onBlur={this.applyRotate}
                            />
                        </div>
                    </div>
                ) : null}

                {this.state.shape ? (
                    <div id="entryPictureFlip" className="entryPlaygroundPainterFlip">
                        <div className="painterAttrFlipName">
                            {Utils.getLang('Painter.inversion')}
                        </div>
                        <div
                            id="entryPictureFlipX"
                            onClick={this.flipX}
                            title="좌우뒤집기"
                            alt="좌우뒤집기"
                            className="entryPlaygroundPainterFlipX"
                        />
                        <div
                            id="entryPictureFlipY"
                            onClick={this.flipY}
                            title="상하뒤집기"
                            alt="상하뒤집기"
                            className="entryPlaygroundPainterFlipY"
                        />
                    </div>
                ) : null}
            </div>
        );
    },
});

module.exports = MoveAttributes;
