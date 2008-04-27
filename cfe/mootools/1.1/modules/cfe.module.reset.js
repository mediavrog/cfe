/****************************************/
/* §name:> reset						*/
/* ?help:> replaces reset buttons		*/
/* !dep:>  core,submit					*/
/****************************************/
cfe.module.reset = cfe.module.submit.extend({
	type:"Reset",
	selector: "input[type=reset]"
});

cfe.base.prototype.registerModule("reset");