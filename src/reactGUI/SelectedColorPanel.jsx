const React = require('../reactGUI/React-shim');
const createReactClass = require('create-react-class');
var createSetStateOnEventMixin = require('./createSetStateOnEventMixin');
const { ColorPicker } = require('entry-tool/component/index');
const throttle = require('lodash/throttle');
import Utils from '../utils';

var SelectedColorPanel = createReactClass({
    componentDidMount: function() {
        var lc = this.props.lc;
        this.unsubscribePrimary = lc.on('primaryColorChange', (strokeColor) => {
            const { canTransparent = true } = this.getColorOption();
            if (!canTransparent && strokeColor === 'transparent') {
                return;
            }
            this.setState({ strokeColor });
        });
        this.unsubscribeSecondary = lc.on('secondaryColorChange', (fillColor) => {
            this.setState({ fillColor });
        });
    },
    componentWillUnmount: function() {
        this.unsubscribePrimary();
        this.unsubscribeSecondary();
    },
    closeColorPicker: function() {
        const { isShowPicker } = this.state;
        if (isShowPicker) {
            this.setState({
                isShowPicker: false,
            });
        }
    },
    getInitialState: function() {
        var fillColor = this.props.lc.getColor('secondary');
        var strokeColor = this.props.lc.getColor('primary');
        if(this.props.colorPrefix) {
            fillColor = this.props.lc.getColor(`${this.props.colorPrefix}-secondary`) || this.props.fillColor;
            this.props.lc.setColor('secondary', fillColor);
            strokeColor = this.props.lc.getColor(`${this.props.colorPrefix}-primary`) || this.props.strokeColor;
            this.props.lc.setColor('primary', strokeColor);
        }
        var isStroke = this.props.isStroke === undefined ? true : this.props.isStroke;
        return {
            isFill: this.props.isFill === undefined ? true : this.props.isFill,
            isPicker: false,
            isStroke: isStroke,
            selected: isStroke ? 'primary' : 'secondary',
            fillColor: fillColor,
            strokeColor: strokeColor,
        };
    },

    colorPicked: function(colorCode) {
        if (!this.isRunRAF) {
            this.isRunRAF = true;
            requestAnimationFrame(() => {
                this.isRunRAF = false;
                if (this.state.selected === 'primary') this.setState({ strokeColor: colorCode });
                else this.setState({ fillColor: colorCode });
                this.props.lc.setColor(this.state.selected, colorCode);
                if(this.props.colorPrefix) this.props.lc.setColor(`${this.props.colorPrefix}-${this.state.selected}`, colorCode);
            });
        }
    },

    onColorCodeChange: function(e) {
        var colorCode = e.target.value;
        if (this.state.selected === 'primary') this.setState({ strokeColor: colorCode });
        else this.setState({ fillColor: colorCode });
        this.props.lc.setColor(this.state.selected, colorCode);
        if(this.props.colorPrefix) this.props.lc.setColor(`${this.props.colorPrefix}-${this.state.selected}`, colorCode);
    },

    toggleSpoid: function(e) {
        const { lc, tool } = this.props;
        const { selected } = this.state;
        if (tool !== lc.tools.Eyedropper) {
            lc.tools.Eyedropper.setPrevious(lc.tool, selected);
            lc.setTool(lc.tools.Eyedropper);
        }
    },

    getColorOption: function() {
        const { strokeOption = {}, fillOption = {}, tool, lc } = this.props;
        const { isStroke, isFill, pickerType } = this.state;
        let option = {};
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

        const { canTransparent = true, canSpoide = true } = option;

        let activeSpoid = false;
        if (tool === lc.tools.Eyedropper) {
            activeSpoid = true;
        }

        return {
            canTransparent,
            canSpoide,
            activeSpoid,
        };
    },

    render: function() {
        const { canTransparent = true, canSpoid = true, activeSpoid } = this.getColorOption();
        const { strokeOption = {}, fillOption={} } = this.props;
        var { isFill, isStroke, strokeColor, fillColor, isShowPicker, selected } = this.state;
        const color = selected === 'primary' ? strokeColor : fillColor;
        const defaultColor = selected === 'primary' ? '#000000' : '#FFFFFF';
        return (
            <div className="entrySelectedColorPanel">
                {isShowPicker && (
                    <ColorPicker
                        key={selected}
                        canSpoide={canSpoid}
                        canTransparent={canTransparent}
                        defaultColor={defaultColor}
                        className="entryToolColorPicker"
                        onChangeColorPicker={(color) => {
                            const colorState = {};
                            if (!canTransparent && color === 'transparent') {
                                return;
                            }
                            if (selected === 'primary') {
                                colorState['strokeColor'] = color;
                            } else {
                                colorState['fillColor'] = color;
                            }
                            this.setState(colorState);
                            this.colorPicked(color);
                        }}
                        onOutsideClick={this.closeColorPicker}
                        onSpoidClick={this.toggleSpoid}
                        activeSpoid={activeSpoid}
                        color={color}
                        positionDom={this.positionDom}
                        marginRect={{
                            x: -18,
                            y: -2,
                        }}
                    />
                )}
                {isStroke && (
                    <div className="strokeColor">
                        <div className="title">{Utils.getLang(strokeOption.label || 'Painter.outline_color')}</div>
                        <div
                            className="colorPicker"
                            ref={(d) => {
                                this.strokeColor = d;
                            }}
                            onClick={(e) => {
                                e.nativeEvent.stopImmediatePropagation();
                                this.positionDom = this.strokeColor;
                                let isShow = true;
                                if (selected === 'primary') {
                                    isShow = !isShowPicker;
                                }
                                this.setState({
                                    isShowPicker: isShow,
                                    selected: 'primary',
                                    pickerType: 'stroke',
                                });
                            }}
                        >
                            <div className="colorViwer">
                                <div className="color" style={{ backgroundColor: strokeColor }} />
                            </div>
                            <div className="colorPickerButton" />
                        </div>
                    </div>
                )}
                {isFill && (
                    <div className="fillColor">
                        <div className="title">{Utils.getLang(fillOption.label || 'Painter.fill_color')}</div>
                        <div
                            className="colorPicker"
                            ref={(d) => {
                                this.fillColor = d;
                            }}
                            onClick={(e) => {
                                e.nativeEvent.stopImmediatePropagation();
                                this.positionDom = this.fillColor;
                                let isShow = true;
                                if (selected === 'secondary') {
                                    isShow = !isShowPicker;
                                }
                                this.setState({
                                    isShowPicker: isShow,
                                    selected: 'secondary',
                                    pickerType: 'fill',
                                });
                            }}
                        >
                            <div className="colorViwer">
                                <div className="color" style={{ backgroundColor: fillColor }} />
                            </div>
                            <div className="colorPickerButton" />
                        </div>
                    </div>
                )}
            </div>
        );
    },
});

module.exports = SelectedColorPanel;
