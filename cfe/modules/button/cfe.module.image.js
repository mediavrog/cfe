/**
 * @module Button
 */

/**
 * Provides replacement for input[type=image]<br />
 * This module dynamically appends the current state (hover, press) to the image filename given in the src attribute
 *
 * <h6>Tested in:</h6>
 * <ul>
 *   <li>Safari 4.</li>
 *   <li>Firefox 3.6.</li>
 *   <li>Google Chrome 6.</li>
 *   <li>Opera 10.62.</li>
 *   <li>IE 7.</li>
 *   <li>IE 8.</li>
 * </ul>
 *
 * @class Image
 * @namespace cfe.module
 *
 * @extends cfe.module.Button
 *
 * @constructor
 */
cfe.module.Image = new Class({
    
  Extends: cfe.module.Button,
    
  /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
  selector: "input[type=image]",

  hideOriginalElement: false,

  options: {
    slidingDoors: false,
    buttonStyle: false,
    statePrefix: "-state-",
    states: ["H", "F", "P", "D"]
  },

  /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} an input field of type "image"
     */
  createOriginal: function()
  {
    return new Element("input", {
      type: "image"
    });
  },

  setupInnerLabel: function(){
    return this.o;
  },

  afterInitialize: function()
  {
    this.stateRegEx = new RegExp(this.options.statePrefix+"(["+this.options.states.join()+"])");

    // preloading of state images
    var ind = this.o.src.lastIndexOf(".");
    var part1 = this.o.src.substring(0,ind) + this.options.statePrefix;
    var part2 = this.o.src.substring(ind);

    if(Asset) new Asset.images( this.options.states.map(function(state){
      return  part1 + state + part2;
    }));

    this.parent();

  },

  /**
     * sets a given state
     *
     * @method setState
     * @protected
     */
  setState: function(state)
  {
    if(this.options.states.indexOf(state) != -1)
    {
      this.clearState();
      var ind = this.o.src.lastIndexOf(".");
      this.o.src = this.o.src.substring(0,ind) + this.options.statePrefix + state + this.o.src.substring(ind);
    }
  },

  /**
     * clears all states
     *
     * @method clearState
     * @protected
     */
  clearState: function()
  {
    this.o.src = this.o.src.replace(this.stateRegEx, "");
  },

  /**
     * wrapper method for event onMouseOver<br />
     * sets the "hover" state of the image button
     *
     * @method hover
     * @protected
     */
  hover: function()
  {
    if(this.isDisabled()) return

    this.parent();
    this.setState("H");
  },

  /**
     * wrapper method for event onMouseOut<br />
     * clears the "hover" state of the image button
     *
     * @method unhover
     * @protected
     */
  unhover: function()
  {
    if(this.isDisabled()) return
    
    this.parent();
    this.clearState();
    if(this.a.hasClass("F")) this.setState("F");
  },

  /**
     * wrapper method for event onFocus<br />
     * sets the "focus" state of the image button
     *
     * @method setFocus
     * @protected
     */
  setFocus: function()
  {
    if(this.isDisabled()) return

    this.parent();
    if(!this.a.hasClass("P")) this.setState("F");
  },

  /**
     * wrapper method for event onBlur<br />
     * clears the "focus" state of the image button
     *
     * @method removeFocus
     * @protected
     */
  removeFocus: function()
  {
    if(this.isDisabled()) return

    this.parent();
    this.clearState();
  },

  /**
     * wrapper method for event onPress<br />
     * sets the "pressed" state of the image button
     *
     * @method press
     * @protected
     */
  press: function()
  {
    if(this.isDisabled()) return

    this.parent();
    this.setState("P");
  },

  /**
     * wrapper method for event onRelease<br />
     * clears the "pressed" state of the image button
     *
     * @method release
     * @protected
     */
  release: function()
  {
    if(this.isDisabled()) return

    this.parent();
        this.clearState();
    if(this.a.hasClass("F")) this.setState("F");
  },

  /**
     * wrapper method for event onEnable<br />
     *
     * @method enable
     * @protected
     */
  enable: function()
  {
    this.parent();
    this.clearState();
  },

  /**
     * wrapper method for event onDisable<br />
     *
     * @method disable
     * @protected
     */
  disable: function()
  {
    this.parent();
    this.setState("D");
  }
});