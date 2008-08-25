/****************************************/
/* §name:> submit						*/
/* ?help:> replaces submitbutton		*/
/* !dep:>  core,interface				*/
/****************************************/
cfe.module.submit = new Class({
	
	Extends: cfe.module.generic,
	
	type:"Submit",
	
	options: {
		slidingDoors: true
	},
	
	selector: "input[type=submit]",
	
	initializeAdv: function(){
		this.hideAndReplace.bind(this)();
		
		this.boundRelease = this.release.bindWithEvent(this);
		this.boundToggleBySpace = this.toggleBySpace.bindWithEvent(this);
	},
	
	build: function(){
		this.a.addEvents({
			"mousedown": this.press.bind(this),
			"mouseup": this.boundRelease
		}).addClass("jsButton").adopt(this.o);		
		
		this.o.addEvents({
			"keydown":this.boundToggleBySpace,
			"keyup":this.boundToggleBySpace
		});
		
		this.lab = new Element("span").addClass("label").set("html", this.o.value).inject(this.a);
		
		if($chk(this.options.slidingDoors)){
			this.slidingDoors = new Element("span",{"class": "js"+this.type+"Slide"}).inject(this.a);
			this.slidingDoors.adopt(this.o).adopt(this.lab);
		}
	
		// disable text selection of label
		this.lab.disableTextSelection();
	},
	
	unhover: function(){
		this.parent();
		this.a.removeClass("P");
		this.over = false;
	},
	
	toggleBySpace: function(ev){

		if(ev.key == 'space'){
			switch(ev.type){
				case "keyup":this.a.removeClass("H").removeClass("P"); this.pressed = false;this.o.click();break;
				case "keydown": this.pressed = true;this.a.fireEvent("mouseover")
			}
		}
	},
	
	hover: function(){
		this.a.addClass(this.pressed?"P H":"H");
		this.over = true;
	},
	
	press: function(){
		if(!this.pressed){
			this.pressed = true;
		}
		this.a.addClass("P");
		window.addEvent("mouseup",this.boundRelease);
	},
	
	release: function(ev){
			
		if(this.over && (ev.event.button == 0 || (Browser.Engine.trident && ev.event.button == 1))){
			this.o.click();
			this.over = false;
		}
		else{
			window.removeEvent("mouseup", this.boundRelease);
		}
		
		this.a.removeClass("P");		
		this.pressed = false;
	}	
});