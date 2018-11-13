'use strict';

var React = require('../reactGUI/React-shim');
var createReactClass = require('create-react-class');
var createSetStateOnEventMixin = require('./createSetStateOnEventMixin');

var _require = require('entry-tool/component/index'),
    ColorPicker = _require.ColorPicker;

var throttle = require('lodash/throttle');

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
    closeColorPicker: function closeColorPicker() {
        var isShowPicker = this.state.isShowPicker;

        if (isShowPicker) {
            this.setState({
                isShowPicker: false
            });
        }
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

    colorPicked: throttle(function (colorCode) {
        if (this.state.selected === 'primary') this.setState({ strokeColor: colorCode });else this.setState({ fillColor: colorCode });
        this.props.lc.setColor(this.state.selected, colorCode);
    }, 150),

    onColorCodeChange: function onColorCodeChange(e) {
        var colorCode = e.target.value;
        if (this.state.selected === 'primary') this.setState({ strokeColor: colorCode });else this.setState({ fillColor: colorCode });
        this.props.lc.setColor(this.state.selected, colorCode);
    },

    toggleSpoid: function toggleSpoid(e) {
        var lc = this.props.lc;
        var selected = this.state.selected;

        lc.tools.Eyedropper.setPrevious(lc.tool, selected);
        lc.setTool(lc.tools.Eyedropper);
    },

    render: function render() {
        var _this2 = this;

        var _state = this.state,
            isFill = _state.isFill,
            isStroke = _state.isStroke,
            strokeColor = _state.strokeColor,
            fillColor = _state.fillColor,
            isShowPicker = _state.isShowPicker,
            selected = _state.selected;

        var color = selected === 'primary' ? strokeColor : fillColor;
        var defaultColor = selected === 'primary' ? '#000000' : '#FFFFFF';
        return React.createElement(
            'div',
            { className: 'entrySelectedColorPanel' },
            isShowPicker && React.createElement(ColorPicker, {
                key: selected,
                canTransparent: true,
                defaultColor: defaultColor,
                className: 'entryToolColorPicker',
                onChangeColorPicker: function onChangeColorPicker(color) {
                    var colorState = {};
                    if (selected === 'primary') {
                        colorState['strokeColor'] = color;
                    } else {
                        colorState['fillColor'] = color;
                    }
                    _this2.setState(colorState);
                    _this2.colorPicked(color);
                },
                onOutsideClick: this.closeColorPicker,
                onSpoidClick: this.toggleSpoid,
                color: color,
                positionDom: this.positionDom,
                marginRect: {
                    x: -18,
                    y: -2
                }
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
                            _this2.strokeColor = d;
                        },
                        onClick: function onClick(e) {
                            e.nativeEvent.stopImmediatePropagation();
                            _this2.positionDom = _this2.strokeColor;
                            var isShow = true;
                            if (selected === 'primary') {
                                isShow = !isShowPicker;
                            }
                            _this2.setState({
                                isShowPicker: isShow,
                                selected: 'primary'
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
                            _this2.fillColor = d;
                        },
                        onClick: function onClick(e) {
                            e.nativeEvent.stopImmediatePropagation();
                            _this2.positionDom = _this2.fillColor;
                            var isShow = true;
                            if (selected === 'secondary') {
                                isShow = !isShowPicker;
                            }
                            _this2.setState({
                                isShowPicker: isShow,
                                selected: 'secondary'
                            });
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