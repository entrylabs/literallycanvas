const React = require('../reactGUI/React-shim');
const createReactClass = require('create-react-class');
var createSetStateOnEventMixin = require('./createSetStateOnEventMixin');
const { ColorPicker } = require('entry-tool/component/index');
const { throttle } = require('lodash');

var SelectedColorPanel = createReactClass({
    componentDidMount: function() {
        var lc = this.props.lc;
        this.unsubscribePrimary = lc.on('primaryColorChange', (strokeColor) => {
            this.setState({ strokeColor });
        });
        this.unsubscribeSecondary = lc.on('secondaryColorChange', (fillColor) => {
            this.setState({ fillColor });
        });
        document.addEventListener('click', this.closeColorPicker);
    },
    componentWillUnmount: function() {
        this.unsubscribePrimary();
        this.unsubscribeSecondary();
        document.removeEventListener('click', this.closeColorPicker);
    },
    closeColorPicker: function() {
        console.log('?!');
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

    colorPicked: throttle(function(colorCode) {
        if (this.state.selected === 'primary') this.setState({ strokeColor: colorCode });
        else this.setState({ fillColor: colorCode });
        this.props.lc.setColor(this.state.selected, colorCode);
    }, 150),

    onColorCodeChange: function(e) {
        var colorCode = e.target.value;
        if (this.state.selected === 'primary') this.setState({ strokeColor: colorCode });
        else this.setState({ fillColor: colorCode });
        this.props.lc.setColor(this.state.selected, colorCode);
    },
    render: function() {
        var { isFill, isStroke, strokeColor, fillColor, isShowPicker, selected } = this.state;
        const color = selected === 'primary' ? strokeColor : fillColor;
        return (
            <div className="entrySelectedColorPanel">
                {isShowPicker && (
                    <ColorPicker
                        key={selected}
                        className="entryToolColorPicker"
                        ColorPickAction={(color) => {
                            const colorState = {};
                            if (selected === 'primary') {
                                colorState['strokeColor'] = color;
                            } else {
                                colorState['fillColor'] = color;
                            }
                            this.setState(colorState);
                            this.colorPicked(color);
                        }}
                        color={color}
                        positionDom={this.positionDom}
                        marginRect={{
                            marginLeft: -20,
                            marginTop: -8,
                        }}
                    />
                )}
                {isStroke && (
                    <div className="strokeColor" ref={(dom) => (this.strokeColor = dom)}>
                        <div className="title">윤곽선 색상[*]</div>
                        <div
                            className="colorPicker"
                            ref={(d) => {
                                this.strokeDom = d;
                                window.a = d;
                            }}
                            onClick={(e) => {
                                e.nativeEvent.stopImmediatePropagation();
                                this.positionDom = this.strokeColor;
                                this.setState({
                                    isShowPicker: true,
                                    selected: 'primary',
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
                    <div className="fillColor" ref={(dom) => (this.fillColor = dom)}>
                        <div className="title">채우기 색상[*]</div>
                        <div
                            className="colorPicker"
                            ref={(d) => {
                                window.b = d;
                            }}
                            onClick={(e) => {
                                e.nativeEvent.stopImmediatePropagation();
                                this.positionDom = this.fillColor;
                                this.setState({
                                    isShowPicker: true,
                                    selected: 'secondary',
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
