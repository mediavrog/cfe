/**
 * Replacement for elements of type: input[type=password]
 *
 * @class password
 * @namespace cfe.module
 *
 * @requires text
 * @extends cfe.module.text
 *
 */
cfe.module.password = $.inherit(
cfe.module.text,
{
    instance: 0,
    /**
     * Describes the type of this element
     * @property type
     * @type string
     */
    type: "Password",

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
        return $("<input type='password' />")
    }
});