const React = require('../reactGUI/React-shim');
const createReactClass = require('create-react-class');

var StrokeThickness = createReactClass({
    getState: function(props) {
        var props = props || this.props;
        return {
            toolName: props.tool.name,
            strokeWidth: props.tool.strokeWidth || 5,
        };
    },

    getInitialState: function() {
        return this.getState();
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.state.toolName !== nextProps.tool.name) {
            this.setState(this.getState(nextProps));
        }
    },

    onValidValue: function(size) {
        let strokeWidth = +size;
        if (!isNaN(strokeWidth) && strokeWidth !== 0) {
            strokeWidth = Math.max(Math.min(strokeWidth, 70), 1);
        } else {
            strokeWidth = 5;
        }
        this.onChange(strokeWidth);
    },

    onChange: function(strokeWidth) {
        this.setState({ strokeWidth });
        this.props.lc.trigger('setStrokeWidth', strokeWidth);
    },

    handleThickSize: function(type, target) {
        let { value = 0 } = target;
        value = parseInt(value, 10);
        if (type === 'minus') {
            value -= 1;
        } else if (type === 'plus') {
            value += 1;
        }
        this.onChange(value);
    },

    render: function() {
        const { lc, name } = this.props;
        const { strokeWidth = 5 } = this.state;
        let thickness = [];
        for (var i = 1; i <= 70; i++) {
            thickness.push(i);
        }
        const displayName = name || Lang.Workspace.thickness;
        return (
            <div className="entryPlaygroundentryPlaygroundPainterAttrThickArea">
                {/*<span> {this.state.strokeWidth} </span>*/}
                <div className="painterAttrThickName">{displayName}</div>
                <div id="entryPainterAttrThick" className="entryPlaygroundPainterAttrThick">
                    <div className="entryPainterAttrThickControll">
                        <div
                            className="entryPainterAttrThickMinus"
                            onClick={() => {
                                this.handleThickSize('minus', this.thickInput);
                            }}
                        />
                        <input
                            type="number"
                            ref={(dom) => {
                                this.thickInput = dom;
                            }}
                            id="entryPainterAttrThick"
                            className="entryPlaygroundPainterAttrThickInput"
                            onChange={(e) => {
                                const { target = {} } = e;
                                const { value = 0 } = target;
                                this.onChange(value);
                            }}
                            onBlur={(e) => {
                                const { target = {} } = e;
                                const { value = 0 } = target;
                                this.onValidValue(value);
                            }}
                            value={strokeWidth}
                            min="1"
                            max="70"
                        />
                        <div
                            className="entryPainterAttrThickPlus"
                            onClick={() => {
                                this.handleThickSize('plus', this.thickInput);
                            }}
                        />
                    </div>
                    <div
                        id="entryPainterShapeLineColor"
                        className="painterAttrShapeLineColor entryRemove"
                    >
                        <div
                            id="entryPainterShapeInnerBackground"
                            className=" painterAttrShapeInnerBackground"
                        />
                    </div>
                </div>
            </div>
        );
    },
});

module.exports = StrokeThickness;
