const React = require('../reactGUI/React-shim');

var MagnifyPanel = React.createClass({
    getInitialState: function() {
        var lc = this.props.lc;
        return {value: lc.scale};
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
