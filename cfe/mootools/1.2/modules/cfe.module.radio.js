/****************************************/
/* -name:> radiobuttons					*/
/* ?help:> replaces radiobuttons		*/
/* !dep:>  checkbox      				*/
/* #bug:>
 * ie 8         - rb alias w/o implicit labelling trigger update twice; ori triggers update twice
 * ie 7         - rb alias w/o implicit labelling trigger update twice; ori triggers update twice
/****************************************/
cfe.module.radio = new Class({

    Extends: cfe.module.checkbox,
    type: "Radiobutton",
    selector: "input[type=radio]",

    createOriginal: function()
    {
        return new Element("input",{
            "type": "radio",
            "checked": this.options.checked
        });
    },

    initializeAdv: function()
    {
        this.parent();
        
        if( !(Browser.Engine.trident || Browser.Engine.gecko) ) this.o.addEvent("click", this.update.bind(this));
    },

    check: function()
    {
        this.parent();

        $$('input[clearName="'+this.o.getProperty("clearName")+'"]').each(function(el)
        {
            if(el != this.o) el.retrieve("cfe").uncheck();
        }.bind(this));
    }
});