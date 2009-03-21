/****************************************/
/* -name:> slider						*/
/* ?help:> adds a slider for a form el  */
/* !dep:>  core,text					*/
/****************************************/
cfe.module.slider = new Class({
    
	Extends: cfe.text,
    type: "Slider",
	selector: "input[class~=slider]"
});