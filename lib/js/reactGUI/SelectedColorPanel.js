'use strict';

var React = require('../reactGUI/React-shim');
var createReactClass = require('create-react-class');
var createSetStateOnEventMixin = require('./createSetStateOnEventMixin');

var _require = require('entry-tool/component/index'),
    ColorPicker = _require.ColorPicker;

var SelectedColorPanel = createReactClass({
    displayName: 'SelectedColorPanel',

    componentDidMount: function componentDidMount() {
        var _this = this;

        var lc = this.props.lc;
        this.unsubscribePrimary = lc.on('primaryColorChange', function (strokeColor) {
            _this.setState({ strokeColor: strokeColor });
        });
        this.unsubscribeSecondary = lc.on('secondaryColorChange', function (fillColor) {
            _this.setState({ fillColor: fillColor });
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.unsubscribePrimary();
        this.unsubscribeSecondary();
    },

    getInitialState: function getInitialState() {
        var fillColor = this.props.lc.getColor('secondary');
        var strokeColor = this.props.lc.getColor('primary');
        var isStroke = this.props.isStroke === undefined ? true : this.props.isStroke;
        return {
            isFill: this.props.isFill === undefined ? true : this.props.isFill,
            isPicker: false,
            isStroke: isStroke,
            selected: isStroke ? 'primary' : 'secondary',
            fillColor: fillColor,
            strokeColor: strokeColor
        };
    },

    onClickFillPanel: function onClickFillPanel() {
        this.setState({ selected: 'secondary' });
    },

    onClickStrokePanel: function onClickStrokePanel() {
        this.setState({ selected: 'primary' });
    },

    colorPicked: function colorPicked(colorCode) {
        if (this.state.selected === 'primary') this.setState({ strokeColor: colorCode });else this.setState({ fillColor: colorCode });
        this.props.lc.setColor(this.state.selected, colorCode);
    },

    onColorCodeChange: function onColorCodeChange(e) {
        var colorCode = e.target.value;
        if (this.state.selected === 'primary') this.setState({ strokeColor: colorCode });else this.setState({ fillColor: colorCode });
        this.props.lc.setColor(this.state.selected, colorCode);
    },

    render: function render() {
        var _this2 = this;

        console.log();
        console.log();
        var _state = this.state,
            isFill = _state.isFill,
            isStroke = _state.isStroke,
            strokeColor = _state.strokeColor,
            fillColor = _state.fillColor,
            isPicker = _state.isPicker;

        var fillStyle = {
            backgroundColor: this.state.fillColor,
            zIndex: this.state.selected === 'secondary' ? 100 : 0
        };
        var strokeStyle = {
            backgroundColor: this.state.strokeColor
        };
        return React.createElement(
            'div',
            { className: 'entrySelectedColorPanel' },
            isPicker && React.createElement(ColorPicker, {
                className: 'entryToolColorPicker',
                ColorPickAction: function ColorPickAction() {},
                parentRect: this.parentRect
            }),
            isStroke && React.createElement(
                'div',
                { className: 'strokeColor' },
                React.createElement(
                    'div',
                    { className: 'title' },
                    '\uC724\uACFD\uC120 \uC0C9\uC0C1[*]'
                ),
                React.createElement(
                    'div',
                    {
                        className: 'colorPicker',
                        ref: function ref(d) {
                            _this2.strokeDom = d;
                            window.a = d;
                        },
                        onClick: function onClick(e) {
                            var target = e.target;

                            _this2.parentRect = target.getBoundingClientRect();
                            _this2.setState({
                                isPicker: true
                            });
                        }
                    },
                    React.createElement(
                        'div',
                        { className: 'colorViwer' },
                        React.createElement('div', { className: 'color', style: { backgroundColor: strokeColor } })
                    ),
                    React.createElement('div', { className: 'colorPickerButton' })
                )
            ),
            isFill && React.createElement(
                'div',
                { className: 'fillColor' },
                React.createElement(
                    'div',
                    { className: 'title' },
                    '\uCC44\uC6B0\uAE30 \uC0C9\uC0C1[*]'
                ),
                React.createElement(
                    'div',
                    {
                        className: 'colorPicker',
                        ref: function ref(d) {
                            window.b = d;
                        },
                        onClick: function onClick() {
                            alert('컬러피커 추가예정');
                        }
                    },
                    React.createElement(
                        'div',
                        { className: 'colorViwer' },
                        React.createElement('div', { className: 'color', style: { backgroundColor: fillColor } })
                    ),
                    React.createElement('div', { className: 'colorPickerButton' })
                )
            )
        );
    }
});

module.exports = SelectedColorPanel;