/**
 *  Base FamousPlugin class
 *  @private
 *  @class FamousPlugin
 */
function FamousPlugin () {}

/**
 *  The one function FamousPlugins must implement.
 *  @returns Instantiated Famo.us renderable, ready to be added to a context.
 */
FamousPlugin.prototype.init = function () { 
};

module.exports = FamousPlugin;
