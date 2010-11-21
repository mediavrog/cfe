/**
 * @module Button
 */

/**
 * Provides replacement for input[type=reset]
 *
 * <h6>Tested in:</h6>
 * <p>See cfe.module.Submit PLUS</p>
 * <ul>
 *   <li>Safari 4</li>
 *   <li>Firefox 3.6.</li>
 *   <li>Google Chrome 6.</li>
 *   <li>Opera 10.62.</li>
 *   <li>IE 7.</li>
 *   <li>IE 8.</li>
 * </ul>
 *
 * @class Reset
 * @namespace cfe.module
 *
 * @extends cfe.module.Submit
 *
 * @constructor
 *
 * bug: - press then click outside > press state doesn't clear
 */
cfe.module.Reset = new Class({

    Extends: cfe.module.Submit,

    /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
    selector: "input[type=reset]",

    /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} an input field of type "reset"
     */
    createOriginal: function()
    {
        return new Element("input",{
            type: "reset"
        });
    },

    /**
     * adds an additional click event to the button to procede a form's reset
     *
     * @method setupOriginal
     */
    setupOriginal: function()
    {
        this.parent();
        this.o.form.addEvent("reset", function(){
            this.getElements("input, textarea, select").fireEvent("change", [], 40);
        });
    }
});