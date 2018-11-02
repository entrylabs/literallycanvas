'use strict';

var React = require('../reactGUI/React-shim');
var createReactClass = require('create-react-class');

var MagnifyPanel = createReactClass({
    displayName: 'MagnifyPanel',

    getInitialState: function getInitialState() {
        var lc = this.props.lc;
        return { value: Math.round(lc.scale * 100) + '%' };
    },
    setZoom: function setZoom(amount) {
        var lc = this.props.lc;
        amount = Math.max(amount, lc.config.zoomMin);
        amount = Math.min(amount, lc.config.zoomMax);
        lc.setZoom(amount);
    },
    zoomIn: function zoomIn() {
        var lc = this.props.lc;
        this.setZoom(lc.scale + 0.1);
    },
    zoomOut: function zoomOut() {
        var lc = this.props.lc;
        this.setZoom(lc.scale - 0.1);
    },
    handleChange: function handleChange(event) {
        event.target.value;
        this.setState({ value: event.target.value });
    },
    handleBlur: function handleBlur(event) {
        var lc = this.props.lc;
        var value = parseInt(event.target.value);
        if (isNaN(value)) value = 100;
        this.setZoom(value / 100);
    },
    handleEnter: function handleEnter(event) {
        if (event.key === 'Enter') {
            var value = parseInt(this.state.value);
            if (isNaN(value)) value = 100;
            this.setZoom(value / 100);
        }
    },
    zoomEvent: function zoomEvent(event) {
        var value = event.newScale;
        this.setState({ value: Math.round(value * 100) + '%' });
    },
    componentDidMount: function componentDidMount() {
        var lc = this.props.lc;
        this.unsubscribe = lc.on('zoom', this.zoomEvent);
    },
    componentWillUnmount: function componentWillUnmount() {
        this.unsubscribe();
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'entryPaintMagnifier' },
            React.createElement(
                'div',
                { className: 'entryPaintMagnifierControll' },
                React.createElement('div', { className: 'entryPaintMagnifierMinus', onClick: this.zoomOut }),
                React.createElement('input', {
                    type: 'text',
                    id: 'entryPaintMagnifier',
                    className: 'entryPaintMagnifierInput',
                    onChange: this.handleChange,
                    onKeyPress: this.handleEnter,
                    onBlur: this.handleBlur,
                    value: this.state.value
                }),
                React.createElement('div', { className: 'entryPaintMagnifierPlus', onClick: this.zoomIn })
            )
        );
    }
});

module.exports = MagnifyPanel;