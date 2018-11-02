var DOM, React, createReactClass, defineOptionsStyle;

React = require('../reactGUI/React-shim');

DOM = require('react-dom-factories');

createReactClass = require('create-react-class');

defineOptionsStyle = require('./optionsStyles').defineOptionsStyle;

defineOptionsStyle('null', createReactClass({
  displayName: 'NoOptions',
  render: function() {
    return DOM.div();
  }
}));

module.exports = {};
