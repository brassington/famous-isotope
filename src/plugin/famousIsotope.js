// load css
require('../styles');
// Load polyfills
require('famous-polyfills');

var Engine            = require('famous/core/Engine');
var Modifier          = require('famous/core/Modifier');
var Timer             = require('famous/utilities/Timer');
// var RegisterEasing    = require('../registries/Easing');
// var RegisterPhysics   = require('../registries/Physics');
var ClassToImages     = require('../dom/ClassToImages');
var Isotope          = require('../Isotope');
var FamousContainer   = require('./FamousContainer');
var FamousPlugin      = require('./FamousPlugin');


/**
 *  Wraps the creation of the Isotope Plugin. Exposed as FamousIsotope
 *  @example
 *    // default options
 *    FamousContainer('#some-div', FamousIsotope)
 *
 *    // custom options
 *    FamousContainer('#some-div', FamousIsotope({ 
 *      loop: false
 *    })
 *
 *  @method FamousIsotope
 */
function FamousIsotope (opts) {
  if (!opts) { opts = {}; }
  return new IsotopePlugin(opts);
}

/**
 *  FamousIsotope Plugin.
 */
function IsotopePlugin (opts) {
  FamousPlugin.apply(this, arguments);
  this.opts = opts;
}

IsotopePlugin.prototype = Object.create(FamousPlugin.prototype);
IsotopePlugin.prototype.constructor = IsotopePlugin;

/**
 *  Initialize the Isotope
 *  @method init
 */
IsotopePlugin.prototype.init = function (items) {
  if (!this.opts.items) {
    this.opts.items = items;
  }
  var Isotope = new Isotope(this.opts, true);
  return Isotope;
};

// FamousIsotope.GridLayout          = Isotope.GridLayout;
// FamousIsotope.CoverflowLayout     = Isotope.CoverflowLayout;
// FamousIsotope.SequentialLayout    = Isotope.SequentialLayout;
// FamousIsotope.SingularOpacity     = Isotope.SingularOpacity;
// FamousIsotope.SingularSlideIn     = Isotope.SingularSlideIn;
// FamousIsotope.SingularSlideBehind = Isotope.SingularSlideBehind;
// FamousIsotope.SingularParallax    = Isotope.SingularParallax;
// FamousIsotope.SingularTwist       = Isotope.SingularTwist;
// FamousIsotope.SingularSoftScale   = Isotope.SingularSoftScale;

module.exports = FamousIsotope;
