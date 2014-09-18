var FamousPlugin = require('./FamousPlugin');
var ClassToImages = require('../dom/ClassToImages');
var Engine = require('famous/core/Engine');

Engine.setOptions({
  appMode: false
});

/**
 *  @method FamousContainer
 *  @param element {String|DomElement} DOM element or a query selector.
 *  @param famousClass {FamousPlugin} Famous Plugin to insert into the selected area in the DOM.
 */
function FamousContainer(element, famousClass) {
  var container = (typeof element === 'string' ? document.querySelector(element) : element);
  var mainContext = Engine.createContext(container);
  if (!(famousClass instanceof FamousPlugin)) {
    famousClass = famousClass();
  }
  var instantiatedClass = famousClass.init(ClassToImages(querySelector));
  mainContext.add(instantiatedClass);
  return instantiatedClass;
}

global.FamousContainer = FamousContainer;
module.exports = FamousContainer;
