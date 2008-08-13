/****************************************/
/* §name:> password						*/
/* ?help:> replaces password fields		*/
/* !dep:>  core,text					*/
/****************************************/
cfe.module.password = new Class({
	Implements: cfe.module.text,
	type:"Password",
	selector: "input[type=password]"
});