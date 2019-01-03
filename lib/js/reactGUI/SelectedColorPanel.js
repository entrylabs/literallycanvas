'use strict';

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
            var _getColorOption = _this.getColorOption(),
                _getColorOption$canTr = _getColorOption.canTransparent,
                canTransparent = _getColorOption$canTr === undefined ? true : _getColorOption$canTr;

            if (!canTransparent && strokeColor === 'transparent') {
                return;
            }
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
        if (this.props.colorPrefix) {
            fillColor = this.props.lc.getColor(this.props.colorPrefix + '-secondary') || this.props.fillColor;
            this.props.lc.setColor('secondary', fillColor);
            strokeColor = this.props.lc.getColor(this.props.colorPrefix + '-primary') || this.props.strokeColor;
            this.props.lc.setColor('primary', strokeColor);
        }
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

    colorPicked: function colorPicked(colorCode) {
        var _this2 = this;

        if (!this.isRunRAF) {
            this.isRunRAF = true;
            requestAnimationFrame(function () {
                _this2.isRunRAF = false;
                if (_this2.state.selected === 'primary') _this2.setState({ strokeColor: colorCode });else _this2.setState({ fillColor: colorCode });
                _this2.props.lc.setColor(_this2.state.selected, colorCode);
                if (_this2.props.colorPrefix) _this2.props.lc.setColor(_this2.props.colorPrefix + '-' + _this2.state.selected, colorCode);
            });
        }
    },

    onColorCodeChange: function onColorCodeChange(e) {
        var colorCode = e.target.value;
        if (this.state.selected === 'primary') this.setState({ strokeColor: colorCode });else this.setState({ fillColor: colorCode });
        this.props.lc.setColor(this.state.selected, colorCode);
        if (this.props.colorPrefix) this.props.lc.setColor(this.props.colorPrefix + '-' + this.state.selected, colorCode);
    },

    toggleSpoid: function toggleSpoid(e) {
        var _props = this.props,
            lc = _props.lc,
            tool = _props.tool;
        var selected = this.state.selected;

        if (tool !== lc.tools.Eyedropper) {
            lc.tools.Eyedropper.setPrevious(lc.tool, selected);
            lc.setTool(lc.tools.Eyedropper);
        }
    },

    getColorOption: function getColorOption() {
        var _props2 = this.props,
            _props2$strokeOption = _props2.strokeOption,
            strokeOption = _props2$strokeOption === undefined ? {} : _props2$strokeOption,
            _props2$fillOption = _props2.fillOption,
            fillOption = _props2$fillOption === undefined ? {} : _props2$fillOption,
            tool = _props2.tool,
            lc = _props2.lc;
        var _state = this.state,
            isStroke = _state.isStroke,
            isFill = _state.isFill,
            pickerType = _state.pickerType;

        var option = {};
        if (isStroke) {
            option = strokeOption;
        } else if (isFill) {
            option = fillOption;
        }

        if (isStroke && isFill && pickerType) {
            switch (pickerType) {
                case 'stroke':
                    option = strokeOption;
                    break;
                case 'fill':
                    option = fillOption;
                    break;
            }
        }

        var _option = option,
            _option$canTransparen = _option.canTransparent,
            canTransparent = _option$canTransparen === undefined ? true : _option$canTransparen,
            _option$canSpoide = _option.canSpoide,
            canSpoide = _option$canSpoide === undefined ? true : _option$canSpoide;


        var activeSpoid = false;
        if (tool === lc.tools.Eyedropper) {
            activeSpoid = true;
        }

        return {
            canTransparent: canTransparent,
            canSpoide: canSpoide,
            activeSpoid: activeSpoid
        };
    },

    render: function render() {
        var _this3 = this;

        var _getColorOption2 = this.getColorOption(),
            _getColorOption2$canT = _getColorOption2.canTransparent,
            canTransparent = _getColorOption2$canT === undefined ? true : _getColorOption2$canT,
            _getColorOption2$canS = _getColorOption2.canSpoid,
            canSpoid = _getColorOption2$canS === undefined ? true : _getColorOption2$canS,
            activeSpoid = _getColorOption2.activeSpoid;

        var _props3 = this.props,
            _props3$strokeOption = _props3.strokeOption,
            strokeOption = _props3$strokeOption === undefined ? {} : _props3$strokeOption,
            _props3$fillOption = _props3.fillOption,
            fillOption = _props3$fillOption === undefined ? {} : _props3$fillOption;
        var _state2 = this.state,
            isFill = _state2.isFill,
            isStroke = _state2.isStroke,
            strokeColor = _state2.strokeColor,
            fillColor = _state2.fillColor,
            isShowPicker = _state2.isShowPicker,
            selected = _state2.selected;

        var color = selected === 'primary' ? strokeColor : fillColor;
        var defaultColor = selected === 'primary' ? '#000000' : '#FFFFFF';
        return React.createElement(
            'div',
            { className: 'entrySelectedColorPanel' },
            isShowPicker && React.createElement(ColorPicker, {
                key: selected,
                canSpoide: canSpoid,
                canTransparent: canTransparent,
                defaultColor: defaultColor,
                className: 'entryToolColorPicker',
                onChangeColorPicker: function onChangeColorPicker(color) {
                    var colorState = {};
                    if (!canTransparent && color === 'transparent') {
                        return;
                    }
                    if (selected === 'primary') {
                        colorState['strokeColor'] = color;
                    } else {
                        colorState['fillColor'] = color;
                    }
                    _this3.setState(colorState);
                    _this3.colorPicked(color);
                },
                onOutsideClick: this.closeColorPicker,
                onSpoidClick: this.toggleSpoid,
                activeSpoid: activeSpoid,
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
                    _utils2.default.getLang(strokeOption.label || 'Painter.outline_color')
                ),
                React.createElement(
                    'div',
                    {
                        className: 'colorPicker',
                        ref: function ref(d) {
                            _this3.strokeColor = d;
                        },
                        onClick: function onClick(e) {
                            //e.nativeEvent.stopImmediatePropagation();
                            _this3.positionDom = _this3.strokeColor;
                            var isShow = true;
                            if (selected === 'primary') {
                                isShow = !isShowPicker;
                            }
                            _this3.setState({
                                isShowPicker: isShow,
                                selected: 'primary',
                                pickerType: 'stroke'
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
                    _utils2.default.getLang(fillOption.label || 'Painter.fill_color')
                ),
                React.createElement(
                    'div',
                    {
                        className: 'colorPicker',
                        ref: function ref(d) {
                            _this3.fillColor = d;
                        },
                        onClick: function onClick(e) {
                            //e.nativeEvent.stopImmediatePropagation();
                            _this3.positionDom = _this3.fillColor;
                            var isShow = true;
                            if (selected === 'secondary') {
                                isShow = !isShowPicker;
                            }
                            _this3.setState({
                                isShowPicker: isShow,
                                selected: 'secondary',
                                pickerType: 'fill'
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