/****************************************/
/* -name:> submit						*/
/* ?help:> replaces submitbutton		*/
/* !dep:>  generic      				*/
/* #bug      - press then click outside > press state doesn't clear
/****************************************/
cfe.module.submit = new Class({
	
	Extends: cfe.generic,
	type:"Submit",
	selector: "input[type=submit]",

	options: {
		slidingDoors: true
	},

	initializeAdv: function()
    {
        this.parent();
		this.hideOriginal();
        this.a.addClass("jsButton");
	},

    createOriginal: function()
    {
        return new Element("input",{
            type: "submit"
            });
    },
	
	build: function()
    {
		this.lab = new Element("span").addClass("label").set("html", this.o.value).inject(this.a);
        this.lab.disableTextSelection();
        
		if( $chk(this.options.slidingDoors) )
        {
            var additionalWrapper = new Element("span",{"class": "js"+this.type});
            additionalWrapper.wraps(this.lab);
            
			this.a.addClass("js"+this.type+"Slide").removeClass("js"+this.type).adopt(additionalWrapper);
		}
	}
});