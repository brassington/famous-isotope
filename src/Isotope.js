/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owners: <tim@famo.us> <arkady@famo.us>
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
var View          = require('famous/core/View');
var Surface       = require('famous/core/Surface');
var Transform     = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');


function Block(width, height, num, content) {
    this.width = width;
    this.height = height;
    this.id = num;

    this.background = new Surface({
        size: [width, height],
        content: content.innerHTML,
        properties: {
            color: 'white',
            textAlign: 'center',
            backgroundColor: 'black',
            border: '1px solid white'
        }
    })
}

function Column(block, width, height, stop) {
    this.width = width;
    this.height = height;
    this.space = height - block.height;
    if (!stop) {
        this.storage = [new Row(block,width,block.height,true)];
    } else {
        this.storage = [block];
    }
}

function Row(block, width, height, stop) {
    this.width = width;
    this.height = height;
    this.space = width - block.width;
    if (!stop) {
        this.storage = [new Column(block,block.width,height,true)];
    } else {
        this.storage = [block];
    }
}

Column.prototype.add = Row.prototype.add = function(item) {
    this.storage.push(item);
}


function GetComputedStyles(element) {
  var styles= [];

// The DOM Level 2 CSS way
//
if ('getComputedStyle' in window) {
  var cs= getComputedStyle(element, '');
  if (cs.length!==0)
    for (var i= 0; i<cs.length; i++)
      styles.push([cs.item(i), cs.getPropertyValue(cs.item(i))]);

    // Opera workaround. Opera doesn't support `item`/`length`
    // on CSSStyleDeclaration.
    //
    else
      for (var k in cs)
        if (cs.hasOwnProperty(k))
          styles.push([k, cs[k]]);

// The IE way
//
} else if ('currentStyle' in element) {
    var cs= element.currentStyle;
    for (var k in cs)
      styles.push([k, cs[k]]);
  }
  return styles;
}
//    this.computedWidth = parseInt(getComputedStyle(block)['width']);
//    this.space = width - this.computedW


/**
 * Isotope takes content directly directly from the HTML DOM, from JavaScript DocumentFragments,
 * or direct references to Famo.us Renderables. Carousel allows content to be viewed in a
 * range of customizable layouts with smooth transitions. 
 *
 * @class Carousel
 * @param {Object} [options] An object of configurable options.
 * @param {Layout} [options.contentLayout] Determines the initial layout of the carousel. Defaults to FamousCarousel.SingularSoftScale. Other valid options are layouts attached to the FamousCarousel class. 
 * @param {Boolean} [options.responsiveSizing] Automatically scales items down to fit inside of the carousel.
 *
 * @param {Array | Number 2D} [options.size] Famo.us only** Change the size of the container. Supports strings, which are parsed as percentages of the container.
 * @param {Array | Number 2D} [options.contentPadding] Plugin Only** set XY padding from bounding CSS Box.
 *
 * @param {Boolean} [options.arrowsEnabled] Whether the next and previous arrows are visible. Defaults to true.
 * @param {String} [options.arrowsPosition] Valid options: ["bottom" | "middle" | "top"]. Determines the vertical placement of the arrows. The horizontal position of the arrows are flush against left/right bounding border of the carousel. This can be modified by using arrowsPadding. Defaults to "middle".
 * @param {Array | Number 2D} [options.arrowsPadding] Determines the displacement from the arrow position. The first value in the array corresponds to the horizontal offset where a positive value pushes the arrows towards the center of the carousel. The second value in the array corresponds to the vertical offset where a positive value pushes the arrow down towards the bottom of the carousel. Defaults to [10, 0].
 * @param {String} [options.arrowsPreviousIconURL] URL of an image to use for the previous button skin.
 * @param {String} [options.arrowsNextIconURL] URL of an image to use for the next button skin.
 * @param {Boolean} [options.arrowsAnimateOnClick] Determines whether arrows animate on click. Defaults to true.
 * @param {Boolean} [options.arrowsToggleDisplayOnHover] Determines whether arrows should be animated in/out when user hovers over the carousel. A value of false signifies that the arrows will always be displayed. Defaults to true.
 *
 * @param {Boolean} [options.dotsEnabled] Determines whether the selection dots are to be used. Defaults to true.
 * @param {String} [options.dotsPosition] Valid options: ["left" | "middle" | "right"]. Determines the horizontal placement of the dots. The vertical position of the dots are flush against bottom bounding box of the carousel. This can be modified by dotsPadding. Defaults to "middle".
 * @param {Array | Number 2D} [options.dotsPadding] Determines the displacement from dot position set by dotsPosition. The first value in the array corresponds to the horizontal offset where a positive value pushes the dots to right and a negative value pushes them to the left. The second value in the array corresponds to the vertical offset where a negative value pushes the dots up towards the top of the carousel and a positive value pushes them down. Defaults to [0, -10].
 * @param {Array | Number 2D} [options.dotsSize] The width and height (in pixels) of the selection dots. Defaults to [10,10].
 * @param {Number} [options.dotsHorizontalSpacing] The horizontal spacing (in pixels) between each dot. Defaults to 10.
 *
 * @param {Number} [options.selectedIndex] The index of the item to initially display. Corresponds to the index of the items in the options array, if given. Defaults to 0.
 * @param {Array} [options.items] For Carousel's not affixed to HTML DOM Elements, items specifies the DOM Elements or Famo.us renderables (Famo.us objects which support render(), commit() and getSize()) to be displayed in the carousel. Typically, this would be an array of Surfaces, Views or references to HTML DOM Elements.
 * @param {Boolean} [options.loop] Whether or not to loop from the last item back to the first (when going forward), or from the first back to the last (when going backwards). Defaults to true.
 * @param {Boolean} [options.keyboardEnabled] Automatically listen for right / left arrow keyboard presses to trigger next / previous. Defaults to true.
 * @param {Boolean} [options.mouseEnabled] Enable dragging of slides with mice on layouts that respect direct manipulation. Defaults to true.
 * @param {Boolean} [options.touchEnabled] Enable dragging of slides with touch on layouts that respect direct manipulation. Defaults to true.
 *
 * @css {.famous-carousel-container} Container div to set background color on.
 * @css {.famous-carousel-dot} If dots are enabled, the class corresponding to each dot.
 * @css {.famous-carousel-dot-selected} Applied to dot representing the current page.
 * @css {.famous-carousel-arrow} CSS class applied to the arrows, if enabled.
 * 
 */
function Isotope (options, isPlugin) {
  View.apply(this, arguments);
  this._isPlugin = isPlugin;

  this._data = {
    items: undefined,
    blocks: undefined,
    renderables: [],
    containers: [],
    length: undefined
  }
  Isotope.DEFAULT_OPTIONS.numBoxes = options.items.length;

  Isotope.prototype.createBlocks.call(this, options.items);
  // _populateCols.call(this);
  Isotope.prototype.populateRows.call(this);
  // _renderColContainers.call(this,0,0);
  Isotope.prototype.renderRowContainers.call(this,0,0);

}

Isotope.prototype = Object.create(View.prototype);
Isotope.prototype.constructor = Isotope;


Isotope.prototype.createBlocks = function createBlocks(items) {
  var width, height;
  var contentItems = items;
  var block;
  var rand1, rand2;
  for (var i = 0; i < this.options.numBoxes; i++) {
    rand1 = Math.random();
    rand2 = Math.random();
    width =  rand1 < 0.67 ? rand1 < 0.33 ? 200 : 100 : 50
    height = rand2 < 0.67 ? rand2 < 0.33 ? 200 : 100 : 50
    // width =  rand1 < 0.75 ? rand1 < 0.5 ? rand1 < 0.25 ? 200 : 100 : 50 : 25
    // height = rand2 < 0.75 ? rand2 < 0.5 ? rand2 < 0.25 ? 200 : 100 : 50 : 25
    // width =  (rand1 < 0.75) ? (rand1 < 0.5) ? (rand1 < 0.25) ? 200 : 100 : 50 : 25
    // width =  (rand1 < 0.8) ? (rand1 < 0.6) ? (rand1 < 0.4) ? (rand1 < 0.2) ? 400 : 200 : 100 : 50 : 25
    // height = (rand2 < 0.8) ? (rand2 < 0.6) ? (rand2 < 0.4) ? (rand1 < 0.2) ? 400 : 200 : 100 : 50 : 25
    // width = rand1 < 0.5 ? 100 : 50 
    //height = rand2 < 0.5 ? 100 : 50

    // width = 25 + 100 * Math.random();
    // height = 25 + 100 * Math.random();

    block = new Block(width, height, i, contentItems[i]);
    this.options.blocks.push(block);
  }
}

Isotope.prototype.placeInCol= function placeInCol(block, col) {
    if (!col || col instanceof Block) return false;
    if (block.width > col.width) return false;
    var j = 0;
    var row = col.storage[0];
    while (!this.placeInRow(block,row)) {
        if (!row) {
            if (block.height > col.space) return false;
            col.add( new Row(block, col.width, block.height, true) );
            col.space -= block.height;
            return true;
        } else {
            row = col.storage[++j];
        }
    }
    return true;
}

Isotope.prototype.placeInRow = function placeInRow(block, row) {
    if (!row || row instanceof Block) return false;
    if (block.height > row.height) return false;
    var j = 0;
    var col = row.storage[0];
    while (!this.placeInCol(block,col)) {
        if (!col) {
            if (block.width > row.space) return false;
            row.add( new Column(block, block.width, row.height, true) );
            row.space -= block.width;
            return true;
        } else {
            col = row.storage[++j];
        }
    }
    return true;
}

Isotope.prototype.populateCols = function populateCols() {
    var blocks = this.options.blocks;
    var containers = this.options.containers;
    var col;
    var block;
    var j;
    for (var i = 0; i < blocks.length; i++) {
        block = blocks[i];
        j = 0;
        col = containers[0];
        while (!this.placeInCol(block, col)) {
            if (!col) {
                containers.push( new Column(block, 
                    this.options.width/this.options.numContainers,
                    this.options.height) );
                break;
            }
            col = containers[++j];
        }
    }
}

Isotope.prototype.populateRows = function populateRows() {
    var blocks = this.options.blocks;
    var containers = this.options.containers;
    var row;
    var block;
    var j;
    for (var i = 0; i < blocks.length; i++) {
        block = blocks[i];
        j = 0;
        row = containers[0];
        while (!this.placeInRow(block, row)) {
            if (!row) {
                containers.push( new Row(block, 
                    this.options.width,
                    this.options.height/this.options.numContainers) );
                break;
            }
            row = containers[++j];
        }
    }
}

Isotope.prototype.renderCol = function renderCol(x,y,col) {
    if (col instanceof Block) {

        var stateModifier = new StateModifier();

        stateModifier.setTransform(
            Transform.translate(x, y, 0),
            { duration : 1000, curve: 'easeInOut' }
        );

        // Good for debugging layout without animations
        // var positionModifier = new StateModifier({     
        //     transform: Transform.translate(x, y, 0)
        // });

        return this.add(stateModifier).add(col.background);    
    }

    var offset = y;
    var row;
    for (var i = 0; i < col.storage.length; i++) {
        row = col.storage[i];
        this.renderRow.call(this,x,offset,row);
        offset += row.height;
    }
}

Isotope.prototype.renderRow = function renderRow(x,y,row) {
    if (row instanceof Block) {
        var stateModifier = new StateModifier();

        stateModifier.setTransform(
            Transform.translate(x, y, 0),
            { duration : 1000, curve: 'easeInOut' }
        );

        // Good for debugging layout without animations
        // var positionModifier = new StateModifier({     
        //     transform: Transform.translate(x, y, 0)
        // });

        return this.add(stateModifier).add(row.background);
    }
    var offset = x;
    var col;
    for (var i = 0; i < row.storage.length; i++) {
        col = row.storage[i];
        this.renderCol.call(this,offset,y,col);
        offset += col.width;
    }
}

Isotope.prototype.renderColContainers = function renderColContainers(x,y) {
    var containers = this.options.containers;
    var col;
    var offset = x;
    for (var i = 0; i < containers.length; i++) {
        col = containers[i];
        this.renderCol.call(this,offset,y,col);
        offset += col.width;
    }
}

Isotope.prototype.renderRowContainers = function renderRowContainers(x,y) {
    var containers = this.options.containers;
    var row;
    var offset = y;
    for (var i = 0; i < containers.length; i++) {
        row = containers[i];
        this.renderRow.call(this,x,offset,row);
        offset += row.height;
    }
}

Isotope.DEFAULT_OPTIONS = {
  items: [],
  blocks: [],
  containers: [],
  width: 500,
  height: 1000,
  numContainers: 5,
  numBoxes: null
}

module.exports = Isotope;
