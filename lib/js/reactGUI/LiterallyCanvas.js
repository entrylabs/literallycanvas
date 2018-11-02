'use strict';

var React = require('../reactGUI/React-shim');
var createReactClass = require('create-react-class');

var _require = require('../reactGUI/ReactDOM-shim'),
    findDOMNode = _require.findDOMNode;

var _require2 = require('../core/util'),
    classSet = _require2.classSet;

var Picker = require('./Picker');
var Options = require('./Options');
var createToolButton = require('./createToolButton');
var LiterallyCanvasModel = require('../core/LiterallyCanvas');
var defaultOptions = require('../core/defaultOptions');

require('../optionsStyles/font');
require('../optionsStyles/stroke-width');
require('../optionsStyles/color-palette');
require('../optionsStyles/select-cut');
require('../optionsStyles/stroke-palette');
require('../optionsStyles/stroke-thickness');
require('../optionsStyles/move-attributes');
require('../optionsStyles/font-attributes-color-palette');
require('../optionsStyles/line-options-and-stroke-width');
require('../optionsStyles/polygon-and-stroke-width');
require('../optionsStyles/null');

var CanvasContainer = createReactClass({
    displayName: 'CanvasContainer',
    shouldComponentUpdate: function shouldComponentUpdate() {
        // Avoid React trying to control this DOM
        return false;
    },
    render: function render() {
        return React.createElement('div', { key: 'literallycanvas', className: 'lc-drawing with-gui' });
    }
});

var CanvasTopMenu = createReactClass({
    displayName: 'CanvasTopMenu',
    render: function render() {
        return React.createElement('div', { id: 'canvas-top-menu', className: 'canvas-top-menu' });
    }
});

var LiterallyCanvas = createReactClass({
    displayName: 'LiterallyCanvas',

    getDefaultProps: function getDefaultProps() {
        return defaultOptions;
    },
    bindToModel: function bindToModel() {
        var canvasContainerEl = findDOMNode(this.canvas);
        var opts = this.props;
        this.lc.bindToElement(canvasContainerEl);

        if (typeof this.lc.opts.onInit === 'function') {
            this.lc.opts.onInit(this.lc);
        }
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        if (this.lc) return;

        if (this.props.lc) {
            this.lc = this.props.lc;
        } else {
            this.lc = new LiterallyCanvasModel(this.props);
        }

        this.toolButtonComponents = this.lc.opts.tools.map(function (ToolClass) {
            var tool = new ToolClass(_this.lc);
            _this.lc.registerTool(tool);
            return createToolButton(tool);
        });
    },
    componentDidMount: function componentDidMount() {
        if (!this.lc.isBound) {
            this.bindToModel();
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        if (this.lc) {
            this.lc._teardown();
        }
    },
    render: function render() {
        var _this2 = this;

        var lc = this.lc,
            toolButtonComponents = this.toolButtonComponents,
            props = this.props;
        var _lc$opts = this.lc.opts,
            imageURLPrefix = _lc$opts.imageURLPrefix,
            toolbarPosition = _lc$opts.toolbarPosition;


        var pickerProps = { lc: lc, toolButtonComponents: toolButtonComponents, imageURLPrefix: imageURLPrefix };
        var topOrBottomClassName = classSet({
            'toolbar-at-top': toolbarPosition === 'top',
            'toolbar-at-bottom': toolbarPosition === 'bottom',
            'toolbar-hidden': toolbarPosition === 'hidden'
        });
        return React.createElement(
            'div',
            { className: 'literally ' + topOrBottomClassName },
            React.createElement(CanvasTopMenu, null),
            React.createElement(CanvasContainer, { ref: function ref(item) {
                    return _this2.canvas = item;
                } }),
            React.createElement(Picker, pickerProps),
            React.createElement(Options, { lc: lc, imageURLPrefix: imageURLPrefix })
        );
    }
});

module.exports = LiterallyCanvas;