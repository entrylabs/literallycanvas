var ClearButton, DOM, Picker, React, UndoRedoButtons, ZoomButtons, createReactClass;

React = require('./React-shim');

createReactClass = require('create-react-class');

DOM = require('react-dom-factories');

ClearButton = React.createFactory(require('./ClearButton'));

UndoRedoButtons = React.createFactory(require('./UndoRedoButtons'));

ZoomButtons = React.createFactory(require('./ZoomButtons'));

Picker = createReactClass({
  displayName: 'Picker',
  getInitialState: function() {
    return {
      selectedTool: "SelectShape"
    };
  },
  componentWillMount: function() {
    return this.unobserve = this.props.lc.on("toolChange", this.applyTool);
  },
  componentWillUnmount: this.unobserve ? this.unobserve() : void 0,
  applyTool: function(attr) {
    var tool;
    tool = attr.tool;
    return this.setState({
      selectedTool: tool.name
    });
  },
  renderBody: function() {
    var div, imageURLPrefix, lc, ref, toolButtonComponents;
    div = DOM.div;
    ref = this.props, toolButtonComponents = ref.toolButtonComponents, lc = ref.lc, imageURLPrefix = ref.imageURLPrefix;
    return div({
      className: 'lc-picker-contents'
    }, toolButtonComponents.map((function(_this) {
      return function(component, ix) {
        return component({
          lc: lc,
          imageURLPrefix: imageURLPrefix,
          key: ix,
          selected: _this.state.selectedTool,
          onSelect: function(tool) {
            tool.isSelect = true;
            return lc.setTool(tool);
          }
        });
      };
    })(this)), toolButtonComponents.length % 2 !== 0 ? div({
      className: 'toolbar-button thin-button disabled'
    }) : void 0, div({
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
      }
    }));
  },
  render: function() {
    var div;
    div = DOM.div;
    return div({
      className: 'lc-picker'
    }, this.renderBody());
  }
});

module.exports = Picker;
