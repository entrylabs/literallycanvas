const React = require('../reactGUI/React-shim');

var MagnifyPanel = React.createClass({
    getInitialState: function() {
        var lc = this.props.lc;
        return {value: lc.scale};
    },
    setZoom: function(amount) {
        var lc = this.props.lc;
        amount = Math.max(amount, lc.config.zoomMin);
        amount = Math.min(amount, lc.config.zoomMax);
        lc.setZoom(amount);
        this.setState({value: amount});
    },
    zoomIn: function() {
        var lc = this.props.lc;
        this.setZoom(lc.scale + 0.1);
    },
    zoomOut: function() {
        var lc = this.props.lc;
        this.setZoom(lc.scale - 0.1);
    },
    handleChange: function(event) {
        var lc = this.props.lc;
        var value = Number(event.target.value.replace("%", "")) / 100;
        this.setZoom(value);
    },
    zoomEvent: function(event) {
        this.setState({value: event.newScale});
    },
    componentDidMount: function() {
        var lc = this.props.lc;
        this.unsubscribe = lc.on("zoom", this.zoomEvent);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    render: function() {
        return <div className="entryPaintMagnifier" >
            <div onClick={this.zoomOut} id="zoomOut">-</div>
            <input value={Math.round(this.state.value * 100) + "%"} onChange={this.handleChange}/>
            <div onClick={this.zoomIn} id="zoomIn">+</div>
        </div>;
    }
});

module.exports = MagnifyPanel;
