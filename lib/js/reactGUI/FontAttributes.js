'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
            font: fontItems.join(' ').replace(/"/gi, ''),
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
    onValidSize: function onValidSize(size) {
        var fontSize = +size;
        if (!isNaN(fontSize) && fontSize !== 0) {
            fontSize = Math.max(Math.min(fontSize, 65), 1);
        } else {
            fontSize = 20;
        }
        this.onChangeSize(fontSize);
    },
    onChangeSize: function onChangeSize(size) {
        var _this2 = this;

        this.setState({ size: size }, function () {
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
        var _EntryStatic = EntryStatic,
            fonts = _EntryStatic.fonts;

        var _fonts = _slicedToArray(fonts, 1),
            _fonts$ = _fonts[0],
            firstFont = _fonts$ === undefined ? {} : _fonts$;

        var fontData = _.find(EntryStatic.fonts, { family: font }) || firstFont;
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
                    _utils2.default.getLang('Painter.font')
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
                    _utils2.default.getLang('Painter.font_size')
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
                        onBlur: function onBlur(e) {
                            var _e$target2 = e.target,
                                target = _e$target2 === undefined ? {} : _e$target2;
                            var _target$value3 = target.value,
                                value = _target$value3 === undefined ? 0 : _target$value3;

                            _this7.onValidSize(value);
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
                    _utils2.default.getLang('Painter.font_family')
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