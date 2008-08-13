/****************************************/
/* §name:> text							*/
/* ?help:> replaces textfields			*/
/* !dep:>  core,interface				*/
/****************************************/
cfe.module.text = new Class({
	
	Extends: cfe.module.generic,
		
	type: "Text",
	
	selector: "input[type=text]",
	
	options: {
		slidingDoors: true
	},

	initializeAdv: function(){
		this.dontRemoveForFromLabel = true;
		this.parent();
	},
	
	build: function(){
		if($chk(this.options.slidingDoors)){
			this.slidingDoors = new Element("span",{"class": "js"+this.type+"Slide"}).injectBefore(this.o);
			this.slidingDoors.adopt(this.o);
			this.a=this.slidingDoors;
		}else{this.a=this.o;}
		
		this.a.addEvents({
			"mouseover": this.hover.bind(this),
			"mouseout": this.unhover.bind(this),
			"click":this.clicked.bind(this)
		});	
	}
});