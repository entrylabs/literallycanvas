const React = require('../reactGUI/React-shim');

var MagnifyPanel = React.createClass({
    getInitialState: function() {
        return {value: 1};
    },
    zoomIn: function() {
        var lc = this.props.lc;
        lc.setZoom(lc.scale + 0.1);
        this.setState({value: lc.scale});
    },
    zoomOut: function() {
        var lc = this.props.lc;
        lc.setZoom(lc.scale - 0.1);
        this.setState({value: lc.scale});
    },
    handleChange: function(event) {
        var lc = this.props.lc;
        var value = Number(event.target.value.replace("%", "")) / 100;
        lc.setZoom(value);
        this.setState({value: value});
    },
    render: function() {
        var value = this.state.value;
        return <div className="entryPaintMagnifier" >
            <div onClick={this.zoomOut} id="zoomOut">-</div>
            <input value={Math.round(this.state.value * 100) + "%"} onChange={this.handleChange}/>
            <div onClick={this.zoomIn} id="zoomIn">+</div>
        </div>;
    }
});

module.exports = MagnifyPanel;
