/****************************************/
/* §name:> password						*/
/* ?help:> replaces password fields		*/
/* !dep:>  core,text					*/
/****************************************/
cfe.module.password = cfe.module.text.extend({
	type:"Password",
	selector: "input[type=password]"
});

cfe.base.prototype.registerModule("password");