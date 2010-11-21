/**
 * @module Button
 */

/**
 * Extends the generic module to replace inputs of type 'submit'
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
 *
 * @class Submit
 * @namespace cfe.module
 * 
 * @extends cfe.module.Button
 *
 * @constructor
 *
 * bug: - press then click outside > press state doesn't clear
 */
cfe.module.Submit = new Class({
	
    Extends: cfe.module.Button,

    /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
    selector: "input[type=submit]",

    build: function(){
        this.parent();
        this.innerlabel.set("text", this.o.value);
    },

    /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} an input field of type "submit"
     */
    createOriginal: function()
    {
        return new Element("input",{
            type: "submit"
        });
    }
});