/**
 * Provides replacement for input[type=reset]
 *
 * @class reset
 * @namespace cfe.module
 *
 * @requires submit
 * @extends cfe.module.submit
 *
 * @constructor
 *
 * bug: - press then click outside > press state doesn't clear
 */
cfe.module.reset = $.inherit(
cfe.module.submit,
{

    /**
     * Describes the type of this element
     * @property type
     * @type string
     */
    type:"Reset",

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
        return $("<input type='reset' />")
    },

    /**
     * adds an additional click event to the button to procede a form's reset
     *
     * @method setupOriginal
     */
    setupOriginal: function()
    {
        this.__base();
        this.o.bind("click", $.proxy(this.notifyReset, this));
    },

    /**
     * traverses all input, textarea, select elements in the current scope (form)
     * and fires their change event to notify all listeners, the elements have beed resetted
     *
     * @method notifyReset
     */
    notifyReset: function()
    {
//        $.proxy(function(){
//            this.o.form.find( "input, textarea, select" ).each( function(i, el)
//            {
//                el.context.trigger("change");
//            });
//        }, this).setTimeout(40);
    }
});