/****************************************/
/* $name:> slider						*/
/* ?help:> adds a slider for a form el  */
/* !dep:>  core,text					*/
/****************************************/
cfe.module.slider = new Class({
	Extends: cfe.module.text,
	type: "Slider",
	selector: "input[class=slider]"
});

//cfe.module.text.selector = cfe.module.text.selector+"[class!=slider]";