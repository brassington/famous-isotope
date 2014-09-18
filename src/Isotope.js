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



// var RenderNode         = require('famous/core/RenderNode');
// var Modifier           = require('famous/core/Modifier');
// var Engine             = require('famous/core/Engine');
// var Surface            = require('famous/core/Surface');
// var SizeAwareView      = require('./constructors/SizeAwareView');
// var Timer              = require('famous/utilities/Timer');
// var FastClick          = require('famous/inputs/FastClick');
// // Register the curves
// var RegisterEasing     = require('./registries/Easing');
// var RegisterPhysics    = require('./registries/Physics');
// // Syncs
// var GenericSync        = require('famous/inputs/GenericSync');
// var TouchSync          = require('famous/inputs/TouchSync');
// var MouseSync          = require('famous/inputs/MouseSync');
// var ScrollSync         = require('famous/inputs/ScrollSync');
// var ScaleSync          = require('famous/inputs/ScaleSync');
// var Slide              = require('./slides/Slide');
// var ResponsiveSlide    = require('./slides/ResponsiveSlide');
// var Arrows             = require('./components/Arrows');
// var Dots               = require('./components/Dots');
// var LayoutController   = require('./layouts/LayoutController');
// var LayoutFactory      = require('./layouts/LayoutFactory');

// GenericSync.register({
//   'mouse': MouseSync,
//   'touch': TouchSync,
//   'scroll': ScrollSync
// });

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

  // this.layoutDefinition;

  // this.sync = new GenericSync();
  // this.scaleSync = new ScaleSync();

  // this.layoutController = new LayoutController({
  //   classes: ['famous-isotope-container'],
  //   itemsPerPage: this._data.itemsPerPage,
  //   responsiveSizing: this.options.responsiveSizing,
  //   loop: this.options.loop,
  //   sync: this.sync,
  //   resizeTransition: Isotope._resizeTransition
  // });
  // this.layoutController._connectContainer(this); //Pipe ContainerSurface

  // this.isThrottleResizeActive = false;
  // this.isHoverActive = false;

  // this._init();
}

Isotope.prototype = Object.create(View.prototype);
Isotope.prototype.constructor = Isotope;

// Isotope.EVENTS = { 
//   /**
//    * New index that the Isotope is set to. Triggered by arrow clicks, 
//    * keyboard events or dot clicks. Calling setSelectedIndex will not trigger 
//    * a selectionChange event.
//    * 
//    * @event selectionChange
//    * @param {Number} index
//    */
//   selection: 'selectionChange',

//   /**
//    * Index of the clicked item.
//    * 
//    * @event itemClick
//    * @param {Number} index
//    */
//   itemClick: 'itemClick'
// }

// Isotope._resizeTransition = {duration: 200, curve: 'linear'};

// *
//  *  Calls next for right arrow key press, previous for left arrow key press.
//  *
//  *  @method _handleKeyup
//  *  @static
//  *  @protected
//  *  @param {Event} Keyboard event.
 
// Isotope._handleKeyup = function _handleKeyup(e) {
//   if (e.keyCode == 37) { // left arrow
//     this.previous();
//     this._eventOutput.emit(Isotope.EVENTS.selection, this._data.index);
//   }
//   else if (e.keyCode == 39) {  // right arrow
//     this.next();
//     this._eventOutput.emit(Isotope.EVENTS.selection, this._data.index);
//   }
// }

// PUBLIC API METHODS

/**
 *
 * @method setContentLayout
 * @param layoutDefinition {Layout} Wrapped Layout class wrapped in LayoutFactory. Permitted values
 * are enumerated on the FamousIsotope class. Specific layout options can be passed in as initialization
 * parameters to these classes. See individual classes for layout options and documentation.
 *
 * @example
 *    // Standalone Plugin
 *    var Isotope = FamousContainer("#parentDiv", FamousIsotope({
 *      contentLayout: FamousIsotope.SingularSlideIn
 *    });
 *
 *    // Famous App
 *    var FamousIsotope = require('Isotope');
 *    var Isotope = FamousIsotope({
 *      contentLayout: FamousIsotope.SingularSlideIn
 *    });
 *
 *    // set with default options
 *    Isotope.setContentLayout(FamousIsotope.Grid);
 *
 *    // choose Grid layout with customized options.
 *    Isotope.setContentLayout(FamousIsotope.Grid({
 *      gridSize: [5, 5]
 *    });
 *
 */
// Isotope.prototype.setContentLayout = function setContentLayout(layoutDefinition) {
//   if (!layoutDefinition) throw 'No layout definition given!';
//   this.layoutDefinition = layoutDefinition;
//   this.layoutController.setLayout(this.layoutDefinition);
//   return this;
// }

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


// /**
//  * Returns the currently active layout.
//  * @method getContentLayout
//  * @return {Object} Current layout definition.
//  */
// Isotope.prototype.getContentLayout = function getContentLayout() {
//   return this.layoutDefinition;

// }

// /**
//  * @method getSelectedIndex
//  * @return {Number} Get the currently selected index.
//  */
// Isotope.prototype.getSelectedIndex = function getSelectedIndex() {
//   return this._data.index;
// }

// /**
//  * Set the current selected index of the Isotope. Respects looping.
//  * Triggers animation unless method is explicitly invoked with a flag to prevent animation. (Use case is when there is a simultaneous layout and index change).
//  * This will NOT trigger a selectionChange event.
//  * 
//  * @method setSelectedIndex
//  * @param index {Number} Index to set to.
//  * @param triggerAnimation {Boolean} Flag indicating whether to trigger animation. Defaults to 'true'.
//  * @return {Number} Updated index.
//  */
// Isotope.prototype.setSelectedIndex = function setSelectedIndex(index , triggerAnimation) {
//   if (index == this.this.data.index) return this._data.index;

//   //Calculate new index
//   this._data.index = this._clamp(index);
//   this._data.paginatedIndex = this._clamp(Math.floor(this._data.index / this._data.itemsPerPage));

//   //Update LayoutController.
//   triggerAnimation = (triggerAnimation === undefined) ? true : triggerAnimation;
//   this.layoutController.setIndex(this._data.index, triggerAnimation);

//   //Update dots.
//   if(this.dots) this.dots.setIndex(this._data.paginatedIndex);

//   return this._data.index;
// }

// /**
//  * Convenience function to go to the next index. For layouts that contain more than one item (grid), moves the layout to the next page.
//  * @method next
//  * @return {Number} New index after applying next.
//  */
// Isotope.prototype.next = function next() {
//   var index = this._data.index + this._data.itemsPerPage;
//   return this.setSelectedIndex(index);
// }

// /**
//  * Convenience function to go to the previous index. For layouts that contain more than one item (grid), moves the layout to the previous page.
//  * @method previous
//  * @return {Number} New index after applying previous.
//  */
// Isotope.prototype.previous = function previous() {
//   var index = this._data.index - this._data.itemsPerPage;
//   return this.setSelectedIndex(index);
// }

// /**
//  * @method getItems
//  * @return {Array} Items the Isotope is composed of.
//  */
// Isotope.prototype.getItems = function getItems() {
//   return this._data.items;
// }

// /**
//  * Recreate the Isotope with a new set of items. See also options.items for more details.
//  * @method setItems
//  * @param itemArray {Array} New items to create the Isotope with.
//  */
// Isotope.prototype.setItems = function setItems( itemArray ) {
//   this._data.items = itemArray.slice(0);
//   this._data.length = this._data.items.length;
//   this._initItems();
//   this.layoutController.setItems( this._data.renderables );
//   return this;
// }

// /**
//  * Get the current size of the Isotope. 
//  * @method getSize
//  * @return {Array | Number} Current size in pixels of the Isotope.
//  */
// Isotope.prototype.getSize = function getSize() {
//   return this.getParentSize();
// }

// /**
//  *  TODO
//  *  @method setSize
//  */
// Isotope.prototype.setSize = function setSize(size) {

// }

// // PROTECTED METHODS

// /**
//  * Initalizes the Isotope.
//  * @method _init
//  * @protected
//  */
// Isotope.prototype._init = function _init() {
//   this.setItems(this.options.items);
//   this.setSelectedIndex(this.options.selectedIndex, false);
//   this._initContent();
//   this._events();

//   Timer.after(function(){
//     this._resize();
//     this.setContentLayout(this.options.contentLayout);
//   }.bind(this), 2);
// }

// /**
//  * Initializes the current content.
//  * @method _initContent
//  * @protected
//  */
// Isotope.prototype._initContent = function _initContent() {
//   if (this.options['arrowsEnabled']) {
//     this.arrows = new Arrows({
//       'position'             : this.options['arrowsPosition'],
//       'padding'              : this.options['arrowsPadding'],
//       'previousIconURL'      : this.options['arrowsPreviousIconURL'],
//       'nextIconURL'          : this.options['arrowsNextIconURL'],
//       'animateOnClick'       : this.options['arrowsAnimateOnClick'],
//       'toggleDisplayOnHover' : this.options['arrowsToggleDisplayOnHover']
//     });
//     this.add(this.arrows);
//   }

//   if (this.options['dotsEnabled']) {
//     this.dots = new Dots({
//       'position'                  : this.options['dotsPosition'],
//       'padding'                   : this.options['dotsPadding'],
//       'size'                      : this.options['dotsSize'],
//       'horizontalSpacing'         : this.options['dotsHorizontalSpacing'],
//       'length'                    : Math.ceil(this._data.items.length / this._data.itemsPerPage),
//       'selectedIndex'             : this.options['selectedIndex'],
//       'arrowsToggleDisplayOnHover': this.options['arrowsToggleDisplayOnHover']
//     });
//     this.add(this.dots);
//   }

//   this._sizeModifier = new Modifier({
//     size: this._getIsotopeSize(),
//     origin: [0.5, 0.5],
//     align: [0.5, 0.5]
//   });

//   this.add(this._sizeModifier).add(this.layoutController);
  
// }

// /**
//  *  Initializes the items.
//  *  @method _initItems
//  *  @protected
//  */
// Isotope.prototype._initItems = function _initItems() {
//   var slideConstructor = (this.options.responsiveSizing) ? ResponsiveSlide : Slide;

//   for (var i = 0; i < this._data.items.length; i++) {
//     if (this._data.items[i].render) { 
//       this._data.renderables.push(this._data.items[i]);
//     }
//     else {
//       var slide = new slideConstructor(this._data.items[i], Isotope._resizeTransition);
//       this._data.renderables.push(slide);
//     }

//     // Trigger event on 'tap' (i.e., mouse or touch)
//     // Avoid triggering event on 'drag'
//     var startTime = null;
//     var timeDiff = null;

//     var setStartTime = function() {
//       startTime = new Date();
//     }
//     var triggerEvent = function(i) {
//       if ((new Date() - startTime) < 150) {
//         this._eventOutput.emit(Isotope.EVENTS.itemClick, i);
//       }
//     }

//     this._data.renderables[i].on('mousedown', setStartTime);
//     this._data.renderables[i].on('touchstart', setStartTime);
//     this._data.renderables[i].on('mouseup', triggerEvent.bind(this, i));
//     this._data.renderables[i].on('touchend', triggerEvent.bind(this, i));
//   };
// }

// /**
//  *  Internal event listener setup.
//  *  @method _events
//  *  @protected
//  */
// // Isotope.prototype._events = function _events() {
// //   this._eventInput.on('parentResize', this._throttleResize.bind(this));

// //   //------------------------Sync Events------------------------//
// //   var inputs = [];
// //   if (this.options['touchEnabled']) inputs.push('touch');
// //   if (this.options['mouseEnabled']) inputs.push('mouse');
// //   this.sync.addSync(inputs);

// //   var startTime = null;
// //   this.sync.on('start', function() {
// //     // Display arrows on touch device
// //     if (this.options['arrowsEnabled'] && this.options['arrowsToggleDisplayOnHover'] && !this.isHoverActive) {
// //       this._flashArrows();
// //     }
// //   }.bind(this));

// //   this.sync.on('end', function() {
// //     this.isHoverActive = false;
// //   });


// //   //------------------------Pinch Sync Events------------------------//
// //   var pinchStartDist;
// //   var pinchDistanceDiff;
// //   var blockPinchUpdate = false;

// //   this.scaleSync.on('start', function(data){
// //     startDist = data.distance;
// //     blockPinchUpdate = false;
// //   });

// //   this.scaleSync.on('update', function(data){
// //     if(blockPinchUpdate) return;

// //     pinchDistanceDiff = Math.abs(startDist - data.distance);
// //     if (pinchDistanceDiff > 50) {
// //       blockPinchUpdate = true;
// //       if(data.scale > 1) {
// //         this._eventOutput.emit('pinchOut');
// //       } else {
// //         this._eventOutput.emit('pinchIn');
// //       }
// //     }
// //   }.bind(this));

// //   //------------------------Keyboard Events------------------------//
// //   if (this.options['keyboardEnabled']) { 
// //     this._handleKeyup = Isotope._handleKeyup.bind(this);
// //     Engine.on('keyup', this._handleKeyup);
// //   }

// //   //------------------------Arrow Events------------------------//
// //   if (this.arrows) {
// //     this.arrows.on('previous', (function (e) { 
// //       this.previous();
// //       this._eventOutput.emit(Isotope.EVENTS.selection, this._data.index);
// //     }).bind(this));

// //     this.arrows.on('next', (function (e) { 
// //       this.next();
// //       this._eventOutput.emit(Isotope.EVENTS.selection, this._data.index);
// //     }).bind(this));

// //     this.arrows.on('click', function(){
// //       if (!this.isHoverActive) this._flashArrows();
// //     }.bind(this));
// //   }

// //   if (this.options['arrowsToggleDisplayOnHover'] && this.arrows) {
// //     this._eventInput.on('mouseover', function(){
// //       this.arrows.show.call(this.arrows);
// //       this.isHoverActive = true;
// //     }.bind(this));

// //     this._eventInput.on('mouseout', function(){
// //       this.arrows.hide.call(this.arrows)
// //       this.isHoverActive = false;
// //     }.bind(this));
// //   }

// //   //------------------------Dots Events------------------------//
// //   if (this.dots) {
// //     this.dots.on('set', function(index){
// //       this.setSelectedIndex(index * this._data.itemsPerPage);
// //       this._eventOutput.emit(Isotope.EVENTS.selection, this._data.index);
// //     }.bind(this));
// //   }
// //   if (this.dots && this.arrows) {
// //     this.dots.on('showArrows', this.arrows.show.bind(this.arrows));
// //     this.dots.on('hideArrows', this.arrows.hide.bind(this.arrows));
// //   }

// //   //------------------------Layout Controller Events------------------------//
// //   this.layoutController.on('paginationChange', this._setItemsPerPage.bind(this));
// //   this.layoutController.on('previous', (function (e) { 
// //     this.previous();
// //     this._eventOutput.emit(Isotope.EVENTS.selection, this._data.index);
// //   }).bind(this));

// //   this.layoutController.on('next', (function (e) { 
// //     this.next();
// //     this._eventOutput.emit(Isotope.EVENTS.selection, this._data.index);
// //   }).bind(this));

// //   this.layoutController.on('set', (function (index) { 
// //     this.setSelectedIndex(index);
// //     this._eventOutput.emit(Isotope.EVENTS.selection, this._data.index);
// //   }).bind(this));
// // }

// /**
//  *  Items per page changes the number of dots, and the number of items that are
//  *  animated on each arrow click.
//  *
//  *  @method _setItemsPerPage
//  *  @protected
//  *  @param itemsPerPage {Number}
//  *  @param forceDotAnimation {Boolean} Boolean indicating whether to trigger dot animation even if items per page hasn't changed (used on resize).
//  */
// Isotope.prototype._setItemsPerPage = function _setItemsPerPage(itemsPerPage, forceDotAnimation) {
//   if((this._data.itemsPerPage === itemsPerPage) && !forceDotAnimation) return;

//   this._data.itemsPerPage = itemsPerPage;
//   if(this.dots) {
//     this.dots.setLength(
//       Math.ceil(this._data.items.length / itemsPerPage), //length
//       itemsPerPage,
//       this._data.index
//     );
//   }
// }

// /**
//  *  Internal resize callback. 
//  *
//  *  @method _resize
//  *  @protected
//  */
// Isotope.prototype._resize = function _resize() {
//   // Update size
//   var IsotopeSize = this._getIsotopeSize();
//   this._sizeModifier.setSize(IsotopeSize);
  
//   // Update LayoutController
//   this.layoutController.setSize(IsotopeSize);

//   // Update dots
//   this._setItemsPerPage(this._data.itemsPerPage, true);
// }

// /**
//  *  Throttles _reszie to ensure it's only triggered once per time window.
//  *
//  *  @method _throttleResize
//  *  @protected
//  */
// Isotope.prototype._throttleResize = function _throttleResize() {
//   if(this.isThrottleResizeActive) return;

//   this.isThrottleResizeActive = true;
//   var context = this;
//   Timer.setTimeout(function(){
//     context.isThrottleResizeActive = false;
//     context._resize();
//   }, 500);
// }

// /**
//  *  Gets the current size of the Isotope.
//  *
//  *  @method _getIsotopeSize
//  *  @protected
//  */
// Isotope.prototype._getIsotopeSize = function () {
//   var size = [];
//   var parentSize = this.getSize();

//   if (this._isPlugin) {
//     size[0] = parentSize[0] - this.options['contentPadding'][0];
//     size[1] = parentSize[1] - this.options['contentPadding'][1];
//   }
//   else {
//     size[0] = typeof this.options['IsotopeSize'][0] == 'number' ?
//       this.options['IsotopeSize'][0] :
//       parseFloat(this.options['IsotopeSize'][0]) / 100 * parentSize[0];

//     size[1] = typeof this.options['IsotopeSize'][1] == 'number' ?
//       this.options['IsotopeSize'][1] :
//       parseFloat(this.options['IsotopeSize'][1]) / 100 * parentSize[1];
//   }

//   return size;
// }

// /**
//  *  Clamp or loop a number based on options.
//  *  @param index {Number} number to clamp or loop.
//  *  @returns index {Number} clamped or looped number
//  *  @protected
//  *  @method clamp 
//  */
// Isotope.prototype._clamp = function clamp( index, loop ) {
//   if (typeof loop == 'undefined') loop = this.options['loop'];
//   if (index > this._data.length - 1) {
//     if (loop) index = 0
//     else {
//       index = this._data.length - 1;
//     }
//   } else if (index < 0 ) {
//     if (loop) index = this._data.length - 1;
//     else {
//       index = 0;
//     }
//   }
//   return index;
// }

// /**
//  *  Displays then hides arrows. Used to display an arrow on touch devices.
//  *  @protected
//  *  @method _flashArrows 
//  */
// Isotope.prototype._flashArrows = function _flashArrows() {
//   Timer.clear(this.arrowsHide);
  
//   var arrows = this.arrows;
//   arrows.show();
//   this.arrowsHide = Timer.setTimeout(function(){
//     arrows.hide();
//   }, 2000);
// }


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
