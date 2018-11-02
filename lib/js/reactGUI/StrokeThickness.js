'use strict';

var React = require('../reactGUI/React-shim');
var createReactClass = require('create-react-class');

var StrokeThickness = createReactClass({
    displayName: 'StrokeThickness',

    getState: function getState(props) {
        var props = props || this.props;
        //   console.log('getState');
        return {
            toolName: props.tool.name,
            strokeWidth: props.tool.strokeWidth
        };
    },

    getInitialState: function getInitialState() {
        return this.getState();
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        //   console.log('componentWillReceiveProps nextProps:', nextProps);
        if (this.state.toolName !== nextProps.tool.name) {
            this.setState(this.getState(nextProps));
        }
    },

    onChange: function onChange(size) {
        var strokeWidth = +size;
        if (!isNaN(strokeWidth) && strokeWidth !== 0) {
            strokeWidth = Math.max(Math.min(strokeWidth, 70), 1);
        } else {
            strokeWidth = 5;
        }
        this.setState({ strokeWidth: strokeWidth });
        this.props.lc.trigger('setStrokeWidth', strokeWidth);
    },

    handleThickSize: function handleThickSize(type, target) {
        var _target$value = target.value,
            value = _target$value === undefined ? 0 : _target$value;

        value = parseInt(value, 10);
        if (type === 'minus') {
            value -= 1;
        } else if (type === 'plus') {
            value += 1;
        }
        this.onChange(value);
    },

    render: function render() {
        var _this = this;

        var _props = this.props,
            lc = _props.lc,
            name = _props.name;

        var thickness = [];
        for (var i = 1; i <= 70; i++) {
            thickness.push(i);
        }
        var displayName = name || Lang.Workspace.thickness;
        return React.createElement(
            'div',
            { className: 'entryPlaygroundentryPlaygroundPainterAttrThickArea' },
            React.createElement(
                'div',
                { className: 'painterAttrThickName' },
                displayName
            ),
            React.createElement(
                'div',
                { id: 'entryPainterAttrThick', className: 'entryPlaygroundPainterAttrThick' },
                React.createElement(
                    'div',
                    { className: 'entryPainterAttrThickControll' },
                    React.createElement('div', {
                        className: 'entryPainterAttrThickMinus',
                        onClick: function onClick() {
                            _this.handleThickSize('minus', _this.thickInput);
                        }
                    }),
                    React.createElement('input', {
                        type: 'number',
                        ref: function ref(dom) {
                            _this.thickInput = dom;
                        },
                        id: 'entryPainterAttrThick',
                        className: 'entryPlaygroundPainterAttrThickInput',
                        onChange: function onChange(e) {
                            var _e$target = e.target,
                                target = _e$target === undefined ? {} : _e$target;
                            var _target$value2 = target.value,
                                value = _target$value2 === undefined ? 0 : _target$value2;

                            _this.onChange(value);
                        },
                        value: this.state.strokeWidth,
                        min: '1',
                        max: '70'
                    }),
                    React.createElement('div', {
                        className: 'entryPainterAttrThickPlus',
                        onClick: function onClick() {
                            _this.handleThickSize('plus', _this.thickInput);
                        }
                    })
                ),
                React.createElement(
                    'div',
                    {
                        id: 'entryPainterShapeLineColor',
                        className: 'painterAttrShapeLineColor entryRemove'
                    },
                    React.createElement('div', {
                        id: 'entryPainterShapeInnerBackground',
                        className: ' painterAttrShapeInnerBackground'
                    })
                )
            )
        );
    }
});

module.exports = StrokeThickness;