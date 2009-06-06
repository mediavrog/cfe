/**
 * @module check
 */

/**
 * replaces checkboxes
 *
 * @class checkbox
 * @namespace cfe.modules
 *
 * @requires generic
 * @extends cfe.generic
 *
 * bug:
 * opera        - ori update triggers twince when clicking the ori
 * ie 8         - ori update triggers twince when clicking the ori
 * ie 7         - ori update triggers twince when clicking the ori
 */
cfe.module.checkbox = new Class({
    
	Extends: cfe.generic,
	type: "Checkbox",
	selector: "input[type=checkbox]",

    getFull: function()
    {
        return [this.a, this.l];
    },

    initializeAdv: function()
    {
        this.parent();
        this.hideOriginal();

        // important for resetting dynamically created cfe
        this.o.defaultChecked = this.o.checked;

        // fix for internet explorer and opera > raises new probs: see above
        if(Browser.Engine.presto)
        {
            if(!this.o.implicitLabel){
                this.a.addEvent( "click", this.update.bind(this) );
                if(this.l)
                {
                    this.l.addEvent( "click", this.update.bind(this) );
                }
            }else
            {
                this.o.addEvent( "click", this.update.bind(this) );
            }
        }

        if(Browser.Engine.trident)
        {
            this.o.addEvent( "click", this.update.bind(this) );
        }
    },

    createOriginal: function()
    {
        return new Element("input",{
            type: "checkbox",
            checked: this.options.checked
            });
    },
	
    build: function()
    {
        new Element("img",{"src": this.options.spacer, "class": "spc"}).inject(this.a, "top");
        this.update();
    },

    setStateTo: function(state)
    {
        state?this.check():this.uncheck();
    },

    check: function()
    {
        this.a.addClass("A");
        this.fireEvent("onCheck");
    },

    uncheck: function()
    {
        this.a.removeClass("A");
        this.fireEvent("onUncheck");
    },

    update: function()
    {
        this.setStateTo(this.o.checked);
        this.parent();
    }
});