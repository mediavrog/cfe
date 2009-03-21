/****************************************/
/* -name:> textarea						*/
/* ?help:> replaces textarea elements 	*/
/* !dep:>  generic  					*/
/****************************************/
cfe.module.textarea = new Class({

	Extends: cfe.module.text,
	type:"Textarea",
	selector: "textarea",
    
    options: {
		slidingDoors: true,
        slidingDoorsCount: 4
	},

    createOriginal: function()
    {
        return new Element("textarea");
    }
});