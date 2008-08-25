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
			this.slidingDoors = new Element("span",{"class": "js"+this.type+"Slide"}).inject(this.o, 'before');
			
			// ie hack to avoid scolling backgrounds
			if(Browser.Engine.trident){
				var additionalWrapper = new Element("span",{"class": "js"+this.type}).inject(this.slidingDoors);
				additionalWrapper.adopt(this.o);
				
				this.o.setStyles({
					"background": "none",
					"padding": 0,
					"margin": 0
				});
			}
			else{
				this.slidingDoors.adopt(this.o);
				if(this.o.id){this.o.addClass("js"+this.o.id);}
			}
			
			this.a=this.slidingDoors;
			this.o.addClass("js"+this.type);

		}else{this.a=this.o;}
		
		this.a.addEvents({
			"mouseover": this.hover.bind(this),
			"mouseout": this.unhover.bind(this),
			"click":this.clicked.bind(this)
		});	
	}
});