/**
 * @module group
 */

/**
 * enhances fieldsets
 *
 * @module fieldset
 * @namespace cfe.modules
 *
 * @requires generic
 * @extends cfe.generic
 *
 */
cfe.module.fieldset = new Class({
    
	Extends: cfe.generic,
	type: "Fieldset",
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