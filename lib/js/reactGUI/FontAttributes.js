'use strict';

var React = require('../reactGUI/React-shim');
var createReactClass = require('create-react-class');
var fontStyleList = ['normal', 'bold', 'italic'];

var FontAttributes = createReactClass({
    displayName: 'FontAttributes',

    getInitialState: function getInitialState() {
        var _this = this;

        this.fontStyle = {
            italic: false,
            bold: false
        };
        var font = this.props.lc.getFont();
        var fontItems = font.split(' ');
        var styles = [];
        var item = null;
        while (true) {
            item = fontItems.shift();
            if (!item || fontStyleList.indexOf(item) == -1) {
                break;
            }
            styles.push(item);
        }
        var fontStyle = styles.join(' ');
        var fontSize = parseInt(item, 10);

        var keys = Object.keys(this.fontStyle);
        keys.forEach(function (key) {
            _this.fontStyle[key] = fontStyle.indexOf(key) > -1;
        });
        return {
            style: fontStyle,
            size: fontSize,
            font: fontItems.join(' '),
            isShowFontDropdown: false
        };
    },
    closeFontDropdown: function closeFontDropdown(e) {
        var isShowFontDropdown = this.state.isShowFontDropdown;

        if (isShowFontDropdown) {
            this.setState({
                isShowFontDropdown: false
            });
        }
    },
    componentDidMount: function componentDidMount() {
        document.addEventListener('click', this.closeFontDropdown);
    },
    componentWillUnmount: function componentWillUnmount() {
        document.removeEventListener('click', this.closeFontDropdown);
    },
    onChangeSize: function onChangeSize(size) {
        var _this2 = this;

        var fontSize = +size;
        if (!isNaN(fontSize) && fontSize !== 0) {
            fontSize = Math.max(Math.min(fontSize, 65), 1);
        } else {
            fontSize = 20;
        }
        this.setState({ size: fontSize }, function () {
            _this2.applyFont();
        });
    },
    handleFontSize: function handleFontSize(type, target) {
        var _target$value = target.value,
            value = _target$value === undefined ? 0 : _target$value;

        value = parseInt(value, 10);
        if (type === 'minus') {
            value -= 1;
        } else if (type === 'plus') {
            value += 1;
        }
        this.onChangeSize(value);
    },
    onChangeFont: function onChangeFont(font) {
        var _this3 = this;

        this.setState({
            font: font
        }, function () {
            _this3.applyFont();
        });
    },
    getFontStyleText: function getFontStyleText() {
        var _this4 = this;

        var keys = Object.keys(this.fontStyle);
        var styleList = [];
        keys.forEach(function (key) {
            if (_this4.fontStyle[key]) {
                styleList.push(key);
            }
        });
        var styleText = styleList.join(' ');

        return styleText.length ? styleText : 'normal';
    },
    onChangeStyle: function onChangeStyle(styleName) {
        var _this5 = this;

        this.fontStyle[styleName] = !this.fontStyle[styleName];
        this.setState({
            style: this.getFontStyleText()
        }, function () {
            _this5.applyFont();
        });
    },
    applyFont: function applyFont() {
        var font = this.state.style + ' ' + this.state.size + 'px ' + this.state.font;
        this.props.lc.setFont(font);
    },
    getNowFontName: function getNowFontName() {
        var font = this.state.font;

        var fontData = _.find(EntryStatic.fonts, { family: font }) || { name: '바탕체' };
        return fontData.name;
    },
    makeDropdownList: function makeDropdownList() {
        var _this6 = this;

        var list = EntryStatic.fonts.map(function (font) {
            return React.createElement(
                'div',
                {
                    key: font.name,
                    onClick: function onClick() {
                        _this6.onChangeFont(font.family);
                    }
                },
                font.name
            );
        });
        return React.createElement(
            'div',
            { className: 'fontDropdownList' },
            list
        );
    },
    render: function render() {
        var _this7 = this;

        var fontThickness = [];
        var isShowFontDropdown = this.state.isShowFontDropdown;

        for (var i = 1; i <= 65; i++) {
            fontThickness.push(i);
        }return React.createElement(
            'div',
            { id: 'painterAttrFont', className: 'entryPlaygroundPainterAttrFont' },
            React.createElement(
                'div',
                { className: 'entryPlaygroundPainterAttrTop' },
                React.createElement(
                    'div',
                    { className: 'title' },
                    '\uAE00\uAF34[*]'
                ),
                React.createElement(
                    'div',
                    {
                        className: 'fontDropdown',
                        onClick: function onClick(e) {
                            e.nativeEvent.stopImmediatePropagation();
                            _this7.setState(function () {
                                return {
                                    isShowFontDropdown: !isShowFontDropdown
                                };
                            });
                        }
                    },
                    React.createElement(
                        'div',
                        { className: 'fontName', id: 'entryPainterAttrFontName' },
                        this.getNowFontName()
                    ),
                    React.createElement('div', { className: 'fontDropdownButton' })
                ),
                isShowFontDropdown && this.makeDropdownList()
            ),
            React.createElement(
                'div',
                { className: 'painterAttrFontSizeArea' },
                React.createElement(
                    'div',
                    { className: 'title' },
                    '\uAE00\uAF34 \uD06C\uAE30[*]'
                ),
                React.createElement(
                    'div',
                    { className: 'entryPainterAttrFontSizeControll' },
                    React.createElement('div', {
                        className: 'entryPainterAttrFontSizeMinus',
                        onClick: function onClick() {
                            _this7.handleFontSize('minus', _this7.fontSizeInput);
                        }
                    }),
                    React.createElement('input', {
                        type: 'number',
                        ref: function ref(dom) {
                            _this7.fontSizeInput = dom;
                        },
                        id: 'entryPainterAttrFontSize',
                        className: 'entryPlaygroundPainterAttrFontSizeInput',
                        onChange: function onChange(e) {
                            var _e$target = e.target,
                                target = _e$target === undefined ? {} : _e$target;
                            var _target$value2 = target.value,
                                value = _target$value2 === undefined ? 0 : _target$value2;

                            _this7.onChangeSize(value);
                        },
                        value: this.state.size,
                        min: '1',
                        max: '65'
                    }),
                    React.createElement('div', {
                        className: 'entryPainterAttrFontSizePlus',
                        onClick: function onClick() {
                            _this7.handleFontSize('plus', _this7.fontSizeInput);
                        }
                    })
                )
            ),
            React.createElement('br', null),
            React.createElement(
                'div',
                { className: 'entryPlaygroundPainterAttrFontStyleArea' },
                React.createElement(
                    'div',
                    { className: 'title' },
                    '\uAE00\uAF34 \uC2A4\uD0C0\uC77C[*]'
                ),
                React.createElement(
                    'div',
                    { className: 'entryPainterAttrFontStyle' },
                    React.createElement('div', {
                        className: 'fontStyleBold ' + (this.fontStyle.bold ? 'select' : ''),
                        alt: Lang.Workspace.bold,
                        title: Lang.Workspace.bold,
                        onClick: function onClick() {
                            return _this7.onChangeStyle('bold');
                        }
                    }),
                    React.createElement('div', {
                        className: 'fontStyleItalic ' + (this.fontStyle.italic ? 'select' : ''),
                        alt: Lang.Workspace.italic,
                        title: Lang.Workspace.italic,
                        onClick: function onClick() {
                            return _this7.onChangeStyle('italic');
                        }
                    })
                )
            ),
            this.props.children
        );
    }
});

module.exports = FontAttributes;