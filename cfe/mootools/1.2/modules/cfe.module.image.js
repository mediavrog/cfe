/****************************************/
/* §name:> image						*/
/* ?help:> replaces image buttons		*/
/* !dep:>  core							*/
/****************************************/
cfe.module.image = new Class({
	
	type:"Image",
	
	noBuild: true,
	
	selector: "input[type=image]",
	
	initialize:function(original,opt){
		this.setOptions(this.options,opt);
		this.o=original.addEvents({
			"mouseover":this.hover.bind(this),
			"mouseout":this.unhover.bind(this),
			"mousedown": this.press.bind(this),
			"mouseup": this.release.bind(this)
		});
		
		this.boundRelease = this.release.bindWithEvent(this);
	},
	
	hover:function(){
		$chk(this.pressed)?this.press.bind(this)():this.hoverState.bind(this)();
	},
	
	unhover:function(){
		this.o.src=this.oSrc;
	},
	
	release:function(){
		this.o.src=this.oSrc;
		this.pressed = false;
		window.removeEvent("mouseup", this.boundRelease);
	},
	
	press:function(){
		if(!$chk(this.pressed)){
			this.pressed = true;
			this.o.src=this.oSrc;
		}
		
		this.pressState.bind(this)();
		window.addEvent("mouseup", this.boundRelease);
	},
	
	hoverState: function(){
		this.setState.attempt("H",this);
	},
	
	pressState: function(){
		this.setState.attempt("P",this);
	},
	
	setState: function(state){
		this.oSrc=this.o.src;
		var tmpSrc=this.oSrc;
		var ind=tmpSrc.lastIndexOf(".");
		var nSrc=tmpSrc.substring(0,ind)+state+tmpSrc.substring(ind);
		this.o.src=nSrc;
	}
});

cfe.module.image.implement(new Options,new Events);