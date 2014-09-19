var ObjectHelpers = require('../helpers/ObjectHelpers');
var Engine = require('famous/core/Engine');
var Isotope          = require('../Isotope');
var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');

(function ($) {
    $.fn.FamousIsotope = function (options) {
        global.FamousIsotope = Isotope;

        var isotopes = [];
        this.each(function () {
            var $children = $(this.children).css('visibility', 'hidden');
            
            var isotopeOpts = {};
            isotopeOpts.items = $children;
            ObjectHelpers.extend(isotopeOpts, options);

            Engine.setOptions({ 
                appMode: false
            });

            var mainContext = Engine.createContext(this);

            var isotope = new Isotope(isotopeOpts);

            //mainContext.add(appView);

            //app.add(isotope);

            View.apply(this, arguments);

            var positionModifier = new StateModifier({
                transform: Transform.translate(0, 0, 0)
            });


            var stateModifier = new StateModifier();

            stateModifier.setTransform(
                Transform.translate(50, 50, 0),
                { duration : 1000, curve: 'easeInOut' }
            );

            mainContext.add(this).add(positionModifier).add(stateModifier).add(isotope);
            
            isotopes.push(isotope);
            $children.detach();
        });

        if (isotopes.length == 1) return isotopes[0];
        else return isotopes;
    }
}(jQuery));
