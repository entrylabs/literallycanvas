React = require '../reactGUI/React-shim'
DOM = require 'react-dom-factories';
createReactClass = require 'create-react-class'
{defineOptionsStyle} = require './optionsStyles'


defineOptionsStyle 'null', createReactClass
  displayName: 'NoOptions'
  render: -> DOM.div()


module.exports = {}