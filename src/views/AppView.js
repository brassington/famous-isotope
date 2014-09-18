    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var BlocksView = require('../views/BlocksView');

    function AppView() {
        View.apply(this, arguments);

        _createBlocksView.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
    };

    function _createBlocksView() {
        var blocksView = new BlocksView();

        var positionModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0)
        });


        var stateModifier = new StateModifier();

        stateModifier.setTransform(
            Transform.translate(50, 50, 0),
            { duration : 1000, curve: 'easeInOut' }
        );

        this.add(positionModifier).add(stateModifier).add(blocksView);;
    }

    module.exports = AppView;
