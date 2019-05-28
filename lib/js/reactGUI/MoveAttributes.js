'use strict';

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = require('react');
var createReactClass = require('create-react-class');


var MoveAttributes = createReactClass({
    displayName: 'MoveAttributes',

    getInitialState: function getInitialState() {
        return {
            rotate: this.props.rotate
        };
    },
    componentDidMount: function componentDidMount() {
        var _props = this.props,
            isDefaultShape = _props.isDefaultShape,
            lc = _props.lc,
            tool = _props.tool;

        this.unsubscribe = lc.on('shapeSelected', this.setShape);
        this.unsubscribePaint = lc.on('handleShape', this.updateShape);
        // if (isDefaultShape) {
        //     let shape = tool.selectedShape || lc.shapes[0];
        //     this.setShape(shape);
        // }
    },
    setShape: function setShape(shape) {
        this.setState({
            shape: shape
        });
        if (shape) {
            this.setState({
                width: shape.width,
                height: shape.height,
                rotate: shape.rotate
            });
            this.width = shape.width;
            this.height = shape.height;
            this.rotate = shape.rotate;
        }
    },
    updateShape: function updateShape() {
        if (this.state.shape) {
            var shape = this.state.shape;
            this.setState({
                width: shape.width,
                height: shape.height,
                rotate: shape.rotate
            });
            this.width = shape.width;
            this.height = shape.height;
            this.rotate = shape.rotate;
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribePaint();
    },
    onChangeX: function onChangeX(e) {
        var width = parseInt(e.target.value);
        width = width ? Math.round(width * 10) / 10 : "";
        this.setState({ width: width });
        this.state.shape.width = width;
        this.props.lc.trigger('drawingChange');
    },
    onChangeY: function onChangeY(e) {
        var height = parseInt(e.target.value);
        height = height ? Math.round(height * 10) / 10 : "";
        this.setState({ height: height });
        this.state.shape.height = height;
        this.props.lc.trigger('drawingChange');
    },
    applyX: function applyX() {
        this.props.lc.editShape(this.state.shape, { width: this.state.width }, { width: this.width });
        this.width = this.state.width;
    },
    applyY: function applyY() {
        this.props.lc.editShape(this.state.shape, { height: this.state.height }, { height: this.height });
        this.height = this.state.height;
    },
    onChangeRotate: function onChangeRotate(e) {
        var rotate = parseInt(e.target.value);
        rotate = rotate ? Math.round(rotate * 10) / 10 : "";
        this.setState({ rotate: rotate });
        this.state.shape.rotate = rotate;
        this.props.lc.trigger('drawingChange');
    },
    applyRotate: function applyRotate(e) {
        this.props.lc.editShape(this.state.shape, { rotate: this.state.rotate }, { rotate: this.rotate });
        this.rotate = this.state.rotate;
    },
    flipX: function flipX() {
        this.props.lc.editShape(this.state.shape, { flipX: !this.state.shape.flipX });
    },
    flipY: function flipY() {
        this.props.lc.editShape(this.state.shape, { flipY: !this.state.shape.flipY });
    },
    render: function render() {
        var _state = this.state,
            _state$width = _state.width,
            width = _state$width === undefined ? 0 : _state$width,
            _state$height = _state.height,
            height = _state$height === undefined ? 0 : _state$height,
            _state$rotate = _state.rotate,
            rotate = _state$rotate === undefined ? 0 : _state$rotate;


        return React.createElement(
            'div',
            { className: 'entryMoveAttributes' },
            React.createElement(
                'div',
                { className: 'entryMoveTitle' },
                Lang.Workspace.SelectShape
            ),
            this.state.shape ? React.createElement(
                'div',
                { id: 'painterAttrResize', className: 'entryPlaygroundPainterAttrResize' },
                React.createElement(
                    'div',
                    { className: 'title' },
                    Lang.Workspace.picture_size,
                    '(Pixel)'
                ),
                React.createElement(
                    'div',
                    { id: 'painterAttrWrapper', className: 'painterAttrWrapper' },
                    React.createElement(
                        'div',
                        { className: 'entryPlaygroundPainterAttrResizeX' },
                        React.createElement(
                            'div',
                            { className: 'entryPlaygroundPainterAttrResizeXTop' },
                            'X'
                        ),
                        React.createElement('input', {
                            id: 'entryPainterAttrWidth',
                            type: 'number',
                            className: 'entryPlaygroundPainterNumberInput',
                            value: width,
                            onChange: this.onChangeX,
                            onBlur: this.applyX
                        })
                    ),
                    React.createElement(
                        'div',
                        { className: 'entryPlaygroundPainterAttrReiszeY' },
                        React.createElement(
                            'div',
                            { className: 'entryPlaygroundPainterAttrResizeYTop' },
                            'Y'
                        ),
                        React.createElement('input', {
                            id: 'entryPainterAttrHeight',
                            type: 'number',
                            className: 'entryPlaygroundPainterNumberInput',
                            value: height,
                            onChange: this.onChangeY,
                            onBlur: this.applyY
                        })
                    )
                )
            ) : null,
            this.state.shape ? React.createElement(
                'div',
                { id: 'painterAttrRotateArea', className: 'painterAttrRotateArea' },
                React.createElement(
                    'div',
                    { className: 'painterAttrRotateName' },
                    Lang.Workspace.picture_rotation,
                    '(\xB0)'
                ),
                React.createElement(
                    'div',
                    {
                        id: 'entryPainterAttrRotate',
                        className: 'entryPlaygroundPainterAttrRotate'
                    },
                    React.createElement('input', {
                        id: 'entryPainterAttrDegree',
                        type: 'number',
                        className: 'entryPlaygroundPainterNumberInput',
                        value: rotate,
                        onChange: this.onChangeRotate,
                        onBlur: this.applyRotate
                    })
                )
            ) : null,
            this.state.shape ? React.createElement(
                'div',
                { id: 'entryPictureFlip', className: 'entryPlaygroundPainterFlip' },
                React.createElement(
                    'div',
                    { className: 'painterAttrFlipName' },
                    _utils2.default.getLang('Painter.inversion')
                ),
                React.createElement('div', {
                    id: 'entryPictureFlipX',
                    onClick: this.flipX,
                    title: Lang.Workspace.flip_horizontal,
                    alt: Lang.Workspace.flip_horizontal,
                    className: 'entryPlaygroundPainterFlipX'
                }),
                React.createElement('div', {
                    id: 'entryPictureFlipY',
                    onClick: this.flipY,
                    title: Lang.Workspace.flip_vertical,
                    alt: Lang.Workspace.flip_vertical,
                    className: 'entryPlaygroundPainterFlipY'
                })
            ) : null
        );
    }
});

module.exports = MoveAttributes;