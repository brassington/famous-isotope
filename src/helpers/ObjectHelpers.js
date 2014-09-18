/*
 *  Shallow copy b into a.
 *  @method extend
 */
function extend (a, b) {
  for (var key in b) a[key] = b[key];
}

/*
 * Set up prototypal inheritance chain.
 * @method inherits
 */
function inherits (a, b) {
  a.prototype = Object.create(b.prototype);
  a.prototype.constructor = a;
}

/*
 * Return new object with combination of a & b.
 * @method merge
 */
function merge (a, b) {
  var obj = {};
  extend(obj, a);
  extend(obj, b);
  return obj;
}

module.exports = { 
  extend: extend,
  inherits: inherits,
  merge: merge
};
