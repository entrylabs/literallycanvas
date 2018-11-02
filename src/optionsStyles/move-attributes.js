const React = require('react');
const createReactClass = require('create-react-class');
const MoveAttributes = require('../reactGUI/MoveAttributes');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle(
    'move-attributes',
    createReactClass({
        displayName: 'MoveAttributes',

        render: function() {
            const { lc, isDefaultShape, imageURLPrefix, tool } = this.props;

            return (
                <div>
                    <MoveAttributes
                        imageURLPrefix={imageURLPrefix}
                        isDefaultShape={isDefaultShape}
                        lc={lc}
                        tool={tool}
                        x="0"
                        y="0"
                        rotate="0"
                    />
                </div>
            );
        },
    })
);

module.exports = {};
