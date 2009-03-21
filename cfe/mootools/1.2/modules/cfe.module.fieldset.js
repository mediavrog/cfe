/****************************************/
/* -name:> fieldset						*/
/* ?help:> enhances fieldsets	 		*/
/* !dep:>  generic      				*/
/* +ok:>
 * ff 3.0.7
 * chrome
 * opera
 * safari
 * ie 8
 * ie 7
/****************************************/
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