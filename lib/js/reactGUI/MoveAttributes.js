'use strict';

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
        if (!width) width = 0;
        this.setState({ width: width });
        this.state.shape.width = width;
        this.props.lc.trigger('drawingChange');
    },
    onChangeY: function onChangeY(e) {
        var height = parseInt(e.target.value);
        if (!height) height = 0;
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
        if (!rotate) rotate = 0;
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
            width = _state.width,
            height = _state.height,
            rotate = _state.rotate,
            shape = _state.shape;


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
                            value: Math.round(width * 10) / 10,
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
                            value: Math.round(height * 10) / 10,
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
                    '(\xBA)'
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
                        value: Math.round(rotate * 10) / 10,
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
                    '\uBC18\uC804'
                ),
                React.createElement('div', {
                    id: 'entryPictureFlipX',
                    onClick: this.flipX,
                    title: '\uC88C\uC6B0\uB4A4\uC9D1\uAE30',
                    alt: '\uC88C\uC6B0\uB4A4\uC9D1\uAE30',
                    className: 'entryPlaygroundPainterFlipX'
                }),
                React.createElement('div', {
                    id: 'entryPictureFlipY',
                    onClick: this.flipY,
                    title: '\uC0C1\uD558\uB4A4\uC9D1\uAE30',
                    alt: '\uC0C1\uD558\uB4A4\uC9D1\uAE30',
                    className: 'entryPlaygroundPainterFlipY'
                })
            ) : null
        );
    }
});

module.exports = MoveAttributes;