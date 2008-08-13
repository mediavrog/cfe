/****************************************/
/* §name:> reset						*/
/* ?help:> replaces reset buttons		*/
/* !dep:>  core,submit					*/
/****************************************/
cfe.module.reset = new Class({
	Extends: cfe.module.submit,
	type:"Reset",
	selector: "input[type=reset]"
});