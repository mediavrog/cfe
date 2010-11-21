/**
 * @module Checkable
 */

/**
 * <p><strong>replaces checkboxes</strong></p>
 * 
 * <h6>Tested in:</h6>
 * <ul>
 * <li>Safari 4.</li>
 * <li>Firefox 3.6.</li>
 * <li>Google Chrome 6.</li>
 * <li>Opera 10.62.</li>
 *
 *  <li>IE 7
 *    <ul>
 *      <li>default checked element wont be triggered by label</li>
 *      <li>implicit labels - no trigger</li>
 *    </ul>
 *  </li>
 *
 *  <li>IE 8
 *    <ul>
 *      <li>labels dont work for normal labelled elements</li>
 *    </ul>
 *  </li>
 *
 *  </ul>
 *
 * @class Checkbox
 * @namespace cfe.module
 * 
 * @extends cfe.module.Button
 */
cfe.module.Checkbox = new Class({
    
  Extends: cfe.module.Button,
    
  instance: 0,

  /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
  selector: "input[type=checkbox]",

  options:{
    /**
         * @inherit
         */
    slidingDoors: false
  /**
         * Fired when the original element gets checked
         * @event onCheck
         */
  //onCheck: Class.empty,
  /**
         * Fired when the original element's checked state is set to false
         * @event onUnCheck
         */
  //onUncheck: Class.empty
  },

  afterInitialize: function()
  {
    this.parent();

    // important for resetting dynamically created cfe
    this.o.defaultChecked = this.o.checked;

    // update fix for internet explorer and opera
    if( Browser.Engine.presto || Browser.Engine.trident)
    {
      this.o.addEvent( "click", this.update.bind(this) );
    }

    this.update();
  },

  /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} an input field of type "checkbox"
     * @protected
     */
  createOriginal: function()
  {
    return new Element("input",{
      type: "checkbox",
      checked: this.options.checked
    });
  },

  /**
     * public method to check a checkbox programatically
     *
     * @method check
     * @public
     */
  check: function()
  {
    this.a.addClass("A");
    this.fireEvent("onCheck");
  },

  /**
   * public method to uncheck a checkbox programatically
   *
   * @method uncheck
   * @public
   */
  uncheck: function()
  {
    this.a.removeClass("A");
    this.fireEvent("onUncheck");
  },

  update: function()
  {
    this.o.checked ? this.check() : this.uncheck();
    this.parent();
  }
});