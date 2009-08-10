/**
 * @module group
 */

/**
 * enhances fieldsets
 *
 * @class fieldset
 * @namespace cfe.modules
 *
 * @requires generic
 * @extends cfe.generic
 *
 */
cfe.module.fieldset = new Class({
    
	Extends: cfe.generic,

    /**
     * Describes the type of this element
     * @property type
     * @type string
     */
	type: "Fieldset",

    /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
	selector: "fieldset",
	
    buildWrapper: function()
    {
        this.a = this.options.replaces;
        this.setupWrapper();
        this.a.setStyle("cursor","default");
    },

	build: function()
    {
		this.a.setProperty("tabindex", 0);
	},

    clicked: function()
    {
        this.a.addClass("F");
        this.fireEvent("onClick");
    }
});