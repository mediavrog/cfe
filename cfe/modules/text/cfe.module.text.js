/**
 * @module Text
 */

/**
 * replaces input[type=text]
 *
 * <h6>Tested in:</h6>
 * <ul>
 * <li>Safari 4.</li>
 * <li>Firefox 3.6.</li>
 * <li>Google Chrome 6.</li>
 * <li>Opera 10.62.</li>
 * <li>IE 7
 *    <ul>
 *      <li>problems with inline-block?</li>
 *      <li>implicit labels - no trigger</li>
 *    </ul>
 *  </li>
 * <li>IE 8.</li>
 *  </ul>
 *
 * @class Text
 * @namespace cfe.module
 *
 * @extends cfe.module.Button
 *
 */
cfe.module.Text = new Class({
	
  Extends: cfe.module.Button,
    
  instance: 0,

  /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
  selector: "input[type=text]",

  options: {
    buttonStyle: false
  },
    
  /**
     * flag to prevent deleting the for attribute from the label<br />
     * for text fields this is important, since the "original" element doesn't get hidden
     * @property dontRemoveForFromLabel
     * @type boolean
     * @protected
     */
  dontRemoveForFromLabel: true,

  hideOriginalElement: false,

  /**
     * since there's no real "decorator" (just wrapping for sliding doors) for textfields, it won't fetch events
     * instead, the original input field will solely handle events
     *
     * @method setupWrapper
     * @protected
     */
  setupWrapperEvents: function()
  {
    this.a.addEvents({
      disable: this.disable.bind(this),
      enable: this.enable.bind(this)
    });
  },

  /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} an input field of type "text"
     */
  createOriginal: function()
  {
    return new Element("input").set("type", "text");
  },

  setupInnerLabel: function(){
    return this.o
  }
});