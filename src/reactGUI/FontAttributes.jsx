const React = require('../reactGUI/React-shim');

const fontStyleList = ['normal', 'bold', 'italic'];
var FontAttributes = React.createClass({
    getInitialState: function() {
        this.fontStyle = {
            italic: false,
            bold: false,
        };
        var font = this.props.lc.getFont();
        var fontItems = font.split(' ');
        const styles = [];
        let item = null;
        while (true) {
            item = fontItems.shift();
            if (!item || fontStyleList.indexOf(item) == -1) {
                break;
            }
            styles.push(item);
        }
        const fontStyle = styles.join(' ');
        const fontSize = parseInt(item, 10);

        const keys = Object.keys(this.fontStyle);
        keys.forEach((key) => {
            this.fontStyle[key] = fontStyle.indexOf(key) > -1;
        });
        return {
            style: fontStyle,
            size: fontSize,
            font: fontItems.join(' '),
            isShowFontDropdown: false,
        };
    },
    closeFontDropdown: function(e) {
        const { isShowFontDropdown } = this.state;
        if (isShowFontDropdown) {
            this.setState({
                isShowFontDropdown: false,
            });
        }
    },
    componentDidMount: function() {
        console.log('componentDidMount');
        document.addEventListener('click', this.closeFontDropdown);
    },
    componentWillUnmount: function() {
        console.log('componentWillUnmount');
        document.removeEventListener('click', this.closeFontDropdown);
    },
    onChangeSize: function(size) {
        let fontSize = +size;
        if (!isNaN(fontSize) && fontSize !== 0) {
            fontSize = Math.max(Math.min(fontSize, 65), 1);
        } else {
            fontSize = 20;
        }
        this.setState({ size: fontSize }, () => {
            this.applyFont();
        });
    },
    handleFontSize: function(type, target) {
        let { value = 0 } = target;
        value = parseInt(value, 10);
        if (type === 'minus') {
            value -= 1;
        } else if (type === 'plus') {
            value += 1;
        }
        this.onChangeSize(value);
    },
    onChangeFont: function(font) {
        this.setState(
            {
                font,
            },
            () => {
                this.applyFont();
            }
        );
    },
    getFontStyleText: function() {
        const keys = Object.keys(this.fontStyle);
        const styleList = [];
        keys.forEach((key) => {
            if (this.fontStyle[key]) {
                styleList.push(key);
            }
        });
        const styleText = styleList.join(' ');

        return styleText.length ? styleText : 'normal';
    },
    onChangeStyle: function(styleName) {
        this.fontStyle[styleName] = !this.fontStyle[styleName];
        this.setState(
            {
                style: this.getFontStyleText(),
            },
            () => {
                this.applyFont();
            }
        );
    },
    applyFont: function() {
        var font = this.state.style + ' ' + this.state.size + 'px ' + this.state.font;
        this.props.lc.setFont(font);
    },
    getNowFontName: function() {
        const { font } = this.state;
        const fontData = _.find(EntryStatic.fonts, { family: font }) || { name: '바탕체' };
        return fontData.name;
    },
    makeDropdownList: function() {
        const list = EntryStatic.fonts.map((font) => {
            return (
                <div
                    key={font.name}
                    onClick={() => {
                        this.onChangeFont(font.family);
                    }}
                >
                    {font.name}
                </div>
            );
        });
        return <div className="fontDropdownList">{list}</div>;
    },
    render: function() {
        let fontThickness = [];
        const { isShowFontDropdown } = this.state;
        for (var i = 1; i <= 65; i++) fontThickness.push(i);

        return (
            <div id="painterAttrFont" className="entryPlaygroundPainterAttrFont">
                <div className="entryPlaygroundPainterAttrTop">
                    <div className="title">글꼴[*]</div>
                    <div
                        className="fontDropdown"
                        onClick={(e) => {
                            e.nativeEvent.stopImmediatePropagation();
                            this.setState(() => {
                                return {
                                    isShowFontDropdown: !isShowFontDropdown,
                                };
                            });
                        }}
                    >
                        <div className="fontName" id="entryPainterAttrFontName">
                            {this.getNowFontName()}
                        </div>
                        <div className="fontDropdownButton" />
                    </div>
                    {/* <select
                        value={this.state.font}
                        id="entryPainterAttrFontName"
                        className="entryPlaygroundPainterAttrFontName"
                        size="1"
                        onChange={this.onChangeFont}
                    >
                        <option value="KoPub Batang">{Lang.Fonts.batang}</option>
                        <option value="Nanum Myeongjo">{Lang.Fonts.myeongjo}</option>
                        <option value="Nanum Gothic">{Lang.Fonts.gothic}</option>
                        <option value="Nanum Pen Script">{Lang.Fonts.pen_script}</option>
                        <option value="Jeju Hallasan">{Lang.Fonts.jeju_hallasan}</option>
                        <option value="Nanum Gothic Coding">{Lang.Fonts.gothic_coding}</option>
                    </select> */}
                    {isShowFontDropdown && this.makeDropdownList()}
                </div>
                <div className="painterAttrFontSizeArea">
                    <div className="title">글꼴 크기[*]</div>
                    <div className="entryPainterAttrFontSizeControll">
                        <div
                            className="entryPainterAttrFontSizeMinus"
                            onClick={() => {
                                this.handleFontSize('minus', this.fontSizeInput);
                            }}
                        />
                        <input
                            type="number"
                            ref={(dom) => {
                                this.fontSizeInput = dom;
                            }}
                            id="entryPainterAttrFontSize"
                            className="entryPlaygroundPainterAttrFontSizeInput"
                            onChange={(e) => {
                                const { target = {} } = e;
                                const { value = 0 } = target;
                                this.onChangeSize(value);
                            }}
                            value={this.state.size}
                            min="1"
                            max="65"
                        />
                        <div
                            className="entryPainterAttrFontSizePlus"
                            onClick={() => {
                                this.handleFontSize('plus', this.fontSizeInput);
                            }}
                        />
                    </div>
                    {/* <select
                        value={this.state.size}
                        id="entryPainterAttrFontSize"
                        className="entryPlaygroundPainterAttrFontSize"
                        size="1"
                        onChange={this.onChangeSize}
                    >
                        {fontThickness.map((size) => {
                            return (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            );
                        })}
                    </select> */}
                </div>
                <br />
                <div className="entryPlaygroundPainterAttrFontStyleArea">
                    <div className="title">글꼴 스타일[*]</div>
                    <div className="entryPainterAttrFontStyle">
                        <div
                            className={`fontStyleBold ${this.fontStyle.bold ? 'select' : ''}`}
                            alt={Lang.Workspace.bold}
                            title={Lang.Workspace.bold}
                            onClick={() => this.onChangeStyle('bold')}
                        />
                        <div
                            className={`fontStyleItalic ${this.fontStyle.italic ? 'select' : ''}`}
                            alt={Lang.Workspace.italic}
                            title={Lang.Workspace.italic}
                            onClick={() => this.onChangeStyle('italic')}
                        />
                    </div>
                    {/* <select
                        value={this.state.style}
                        id="entryPainterAttrFontStyle"
                        className="entryPlaygroundPainterAttrFontStyle"
                        size="1"
                        onChange={this.onChangeStyle}
                    >
                        <option value="normal">{Lang.Workspace.regular}</option>
                        <option value="bold">{Lang.Workspace.bold}</option>
                        <option value="italic">{Lang.Workspace.italic}</option>
                    </select> */}
                </div>
                {this.props.children}
            </div>
        );
    },
});

module.exports = FontAttributes;
