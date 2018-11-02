var DOM, React, _, classSet, createReactClass, createToolButton;

React = require('./React-shim');

createReactClass = require('create-react-class');

DOM = require('react-dom-factories');

classSet = require('../core/util').classSet;

_ = require('../core/localization')._;

createToolButton = function(tool) {
  var displayName, imageName;
  displayName = tool.name;
  imageName = tool.iconName;
  return React.createFactory(createReactClass({
    displayName: displayName,
    getDefaultProps: function() {
      return {
        selected: null,
        lc: null
      };
    },
    componentWillMount: function() {
      if (this.props.selected === displayName) {
        return this.props.lc.setTool(tool);
      }
    },
    render: function() {
      var className, div, imageURLPrefix, img, obj, onSelect, ref, selected, style;
      div = DOM.div, img = DOM.img;
      ref = this.props, imageURLPrefix = ref.imageURLPrefix, selected = ref.selected, onSelect = ref.onSelect;
      className = classSet((
        obj = {
          'lc-pick-tool': true,
          'toolbar-button': true,
          'thin-button': true,
          'selected': selected === displayName
        },
        obj[imageName + "-icon"] = true,
        obj
      ));
      if (imageName === "none") {
        style = {
          'display': 'none'
        };
      }
      return div({
        className: className,
        style: style,
        onClick: (function() {
          return onSelect(tool);
        }),
        title: _(Lang.Workspace[displayName]),
        alt: _(Lang.Workspace[displayName])
      });
    }
  }));
};

module.exports = createToolButton;
