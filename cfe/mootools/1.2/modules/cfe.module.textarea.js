/****************************************/
/* §name:> textarea						*/
/* ?help:> replaces textarea elements 	*/
/* !dep:>  core,text					*/
/****************************************/
cfe.module.textarea = new Class({
	Extends: cfe.module.text,
	type:"Textarea",
	selector: "textarea"
});