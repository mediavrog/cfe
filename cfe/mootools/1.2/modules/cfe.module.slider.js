/****************************************/
/* $name:> slider						*/
/* ?help:> adds a slider for a form el  */
/* !dep:>  core,text					*/
/****************************************/
cfe.module.slider = new Class({
	Extends: cfe.module.generic,

	type: "Slider",

	selector: "input[class~=slider]",

    initializeAdv: function(){
		this.parent();
		this.a = this.o;
	},

    build: function(){}
});

//cfe.module.text.selector = cfe.module.text.selector+":not(input[class~=slider])";