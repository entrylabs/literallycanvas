const React = require('../reactGUI/React-shim');

var Entry = Entry || {
    getColourCodes: function () {
        return [
            'transparent', '#660000', '#663300', '#996633', '#003300', '#003333', '#003399', '#000066', '#330066', '#660066',
            '#FFFFFF', '#990000', '#993300', '#CC9900', '#006600', '#336666', '#0033FF', '#000099', '#660099', '#990066',
            '#000000', '#CC0000', '#CC3300', '#FFCC00', '#009900', '#006666', '#0066FF', '#0000CC', '#663399', '#CC0099',
            '#333333', '#FF0000', '#FF3300', '#FFFF00', '#00CC00', '#009999', '#0099FF', '#0000FF', '#9900CC', '#FF0099',
            '#666666', '#CC3333', '#FF6600', '#FFFF33', '#00FF00', '#00CCCC', '#00CCFF', '#3366FF', '#9933FF', '#FF00FF',
            '#999999', '#FF6666', '#FF6633', '#FFFF66', '#66FF66', '#66CCCC', '#00FFFF', '#3399FF', '#9966FF', '#FF66FF',
            '#BBBBBB','#FF9999', '#FF9966', '#FFFF99', '#99FF99', '#66FFCC', '#99FFFF', '#66CCff', '#9999FF', '#FF99FF',
            '#CCCCCC','#FFCCCC', '#FFCC99', '#FFFFCC', '#CCFFCC', '#99FFCC', '#CCFFFF', '#99CCFF', '#CCCCFF', '#FFCCFF'
        ];
    }
}

var Palette = React.createClass({
    getDefaultProps: function() {
        return {
            colourCodes: Entry.getColourCodes()
        };
    },

    getInitialState: function() {
        return {
            paletteStyles: this.props.colourCodes.map(color => {
                if (color === 'transparent') {
                    return { backgroundImage: `url(${this.props.imageURLPrefix}/transparent.png)` };
                } else {
                    return { backgroundColor: color};
                }
            })
        };
    },

    onClickWithColor: function(colorCode) {
        this.props.colorPicked(colorCode);
    },

    render: function() {
        var colourCodes = this.props.colourCodes;
        return <div className="entryPlaygroundPainterAttrColorContainer">
        {this.state.paletteStyles.map( (style, idx) => {
            var colorCode = colourCodes[idx];
            var colorBindOnClick = this.onClickWithColor.bind(this, colorCode);
            return <div key={idx} className="entryPlaygroundPainterAttrColorElement" onClick={colorBindOnClick} style={style} />
        })}
        </div>
    }
});

var ColorSpoid = React.createClass({
    getInitialState: function() {
        var spoidOFF = {
            width: 27,
            height: 27,
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${this.props.imageURLPrefix}/color_off_spoid.png)`,
        };

        var spoidON = Object.assign({}, spoidOFF);
        spoidON.backgroundImage = `url(${this.props.imageURLPrefix}/color_on_spoid.png)`;

        return {
            isOn: false,
            spoidON: spoidON,
            spoidOFF: spoidOFF,
        };
    },

    toggleSpoid: function(e) {
        var isOn = this.state.isOn;
        this.setState({ isOn: !isOn});
        var lc = this.props.lc;
        lc.tools.Eyedropper.setPrevious(lc.tool, this.props.selected);
        lc.setTool(lc.tools.Eyedropper)
    },

    render: function() {
        // console.log('Palette render! isOn:', this.state.isOn);
        return <div className="entryColorSpoid" style={this.state.spoidON} onClick={this.toggleSpoid} >
        { this.state.isOn ? null : <div className="entryColorSpoidOFF" style={this.state.spoidOFF} /> }
        </div>
    }
});

var SelectedColorPanel = React.createClass({
    componentDidMount: function() {
        var lc = this.props.lc;
        this.unsubscribePrimary = lc.on("primaryColorChange", (strokeColor) => {
            this.setState({ strokeColor });
        });
        this.unsubscribeSecondary = lc.on("secondaryColorChange", (fillColor) => {
            this.setState({ fillColor });
        });
    },
    componentWillUnmount: function() {
        this.unsubscribePrimary();
        this.unsubscribeSecondary();
    },

    getInitialState: function() {
        var fillColor = this.props.lc.getColor("secondary");
        var strokeColor = this.props.lc.getColor("primary");
        var isStroke = this.props.isStroke === undefined ? true : this.props.isStroke;
        return {
            isFill: this.props.isFill === undefined ? true : this.props.isFill,
            isStroke: isStroke,
            selected: isStroke ? "primary" : "secondary",
            fillColor: fillColor,
            strokeColor: strokeColor
        }
    },

    onClickFillPanel: function() {
        this.setState({ selected: "secondary" });
    },

    onClickStrokePanel: function() {
        this.setState({ selected: "primary" });
    },

    onColorCodeChange: function(e) {
        this.setState({colorCode: e.target.value});
    },

    colorPicked: function(colorCode) {
        if (this.state.selected === "primary")
            this.setState({strokeColor: colorCode});
        else
            this.setState({fillColor: colorCode});
        this.props.lc.setColor(this.state.selected, colorCode)
    },

    render: function() {
        // console.log('Palette render! isOn:', this.state.isOn);
        var { isFill, isStroke } = this.state;
        var fillStyle = {
            backgroundColor: this.state.fillColor,
            zIndex: this.state.selected === "secondary" ? 100 : 0
        };
        var strokeStyle = {
            backgroundColor: this.state.strokeColor
        };

        return <div className="entrySelectedColorPanel" >
        {isFill ? <div className={"entrySelectedColorPanelFill " +
            (this.state.fillColor === "transparent" ? "transparent" : "") +
            (this.state.isStroke ? "" : " dominant")}
            style={fillStyle} onClick={this.onClickFillPanel} /> : null}
        {isStroke ? <div className={"entrySelectedColorPanelStroke " + (this.state.strokeColor === "transparent" ? "transparent" : "")}
            style={strokeStyle} onClick={this.onClickStrokePanel} >
            <div className="entrySelectedColorPanelStrokeInner" />
            </div> : null}
            <input value={this.state.fillColor} onChange={this.onColorCodeChange} />

            <Palette colorPicked={this.colorPicked} imageURLPrefix={this.props.imageURLPrefix} />
            <ColorSpoid imageURLPrefix={this.props.imageURLPrefix} lc={this.props.lc} selected={this.state.selected}/>
            </div>
    }
});

module.exports = SelectedColorPanel;
