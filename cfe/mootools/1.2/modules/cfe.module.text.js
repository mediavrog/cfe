/****************************************/
/* -name:> text							*/
/* ?help:> replaces textfields			*/
/* !dep:>  generic      				*/
/****************************************/
cfe.module.text = new Class({
	
	Extends: cfe.generic,
	type: "Text",
	selector: "input[type=text]",
	
	options: {
		slidingDoors: true,
        slidingDoorsCount: 2
	},

    dontRemoveForFromLabel: true,

    setupWrapper: function()
    {
       this.a.addClass("js"+this.type).addEvents({
            disable: this.disable.bind(this),
            enable: this.enable.bind(this)
        });
    },

    createOriginal: function()
    {
        return new Element("input", {
            type: "text"
        });
    },

	build: function()
    {
		if( $chk(this.options.slidingDoors) )
        {
			this.a.addClass("js"+this.type+"Slide");

            this.o.setSlidingDoors(this.options.slidingDoorsCount-1, "span", "js"+this.type).inject(this.a);

            this.o.setStyles({
                background: "none",
                padding: 0,
                margin: 0,
                border: "none"
            });
		}
        else
        {
            this.a.wraps(this.o);
        }
    }
});