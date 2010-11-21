/**
 * @module Group
 */

/**
 * enhances fieldsets
 *
 * @class Fieldset
 * @namespace cfe.module
 *
 * @extends cfe.module.Button
 *
 */
cfe.module.Fieldset = new Class({
    
    Extends: cfe.module.Button,
    
    instance: 0,

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