/****************************************/
/* §name:> textarea						*/
/* ?help:> replaces textarea elements 	*/
/* !dep:>  core,text					*/
/****************************************/

cfe.module.textarea = cfe.module.text.extend({
	type:"Textarea",
	selector: "textarea"
});

cfe.base.prototype.registerModule("textarea");