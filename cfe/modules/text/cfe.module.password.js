/**
 * @module Text
 */

/**
 * Replacement for elements of type: input[type=password]
 *
 * <h6>Tested in:</h6>
 * <p>See cfe.module.Text</p>
 *
 * @class Password
 * @namespace cfe.module
 *
 * @extends cfe.module.Text
 *
 */
cfe.module.Password = new Class({
    
    Extends: cfe.module.Text,
    
    instance: 0,

    /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
    selector: "input[type=password]",

    /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} an input field of type "password"
     */
    createOriginal: function()
    {
        return new Element("input").set("type", "password");
    }
});