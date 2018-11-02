var ColorPickers, ColorWell, DOM, Options, React, createReactClass, createSetStateOnEventMixin, optionsStyles;

React = require('./React-shim');

createReactClass = require('create-react-class');

DOM = require('react-dom-factories');

createSetStateOnEventMixin = require('./createSetStateOnEventMixin');

optionsStyles = require('../optionsStyles/optionsStyles').optionsStyles;

ColorWell = React.createFactory(require('./ColorWell'));

ColorPickers = React.createFactory(createReactClass({
  displayName: 'ColorPickers',
  render: function() {
    var div, lc;
    lc = this.props.lc;
    div = DOM.div;
    return div({
      className: 'lc-color-pickers'
    }, ColorWell({
      lc: lc,
      colorName: 'primary'
    }), ColorWell({
      lc: lc,
      colorName: 'secondary'
    }));
  }
}));

Options = createReactClass({
  displayName: 'Options',
  getState: function() {
    var ref;
    return {
      style: (ref = this.props.lc.tool) != null ? ref.optionsStyle : void 0,
      tool: this.props.lc.tool
    };
  },
  getInitialState: function() {
    return this.getState();
  },
  mixins: [createSetStateOnEventMixin('toolChange')],
  applyTool: function() {
    if (this.props.lc.tool.isSelect) {
      this.isDefaultShape = true;
      return this.props.lc.tool.isSelect = false;
    } else {
      return this.isDefaultShape = false;
    }
  },
  componentWillMount: function() {
    return this.unobserve = this.props.lc.on("toolChange", this.applyTool);
  },
  componentWillUnmount: this.unobserve ? this.unobserve() : void 0,
  renderBody: function() {
    var style;
    style = "" + this.state.style;
    return optionsStyles[style] && optionsStyles[style]({
      lc: this.props.lc,
      tool: this.state.tool,
      imageURLPrefix: this.props.imageURLPrefix,
      isDefaultShape: this.isDefaultShape
    });
  },
  render: function() {
    var div, style;
    style = this.state.style;
    div = DOM.div;
    return div({
      className: "lc-options horz-toolbar " + style
    }, this.renderBody());
  }
});

module.exports = Options;
