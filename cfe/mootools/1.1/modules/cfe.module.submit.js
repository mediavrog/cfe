/****************************************/
/* §name:> submit						*/
/* ?help:> replaces submitbutton		*/
/* !dep:>  core,interface				*/
/****************************************/

cfe.module.submit = cfe.module.generic.extend({
	
	type:"Submit",
	
	options: {
		slidingDoors: true
	},
	
	selector: "input[type=submit]",
	
	initializeAdv: function(){
		this.hideAndReplace.bind(this)();
	},
	
	build: function(){
		this.a.addEvents({
			"mousedown": this.press.bind(this),
			"mouseup": this.release.bind(this)
		}).addClass("jsButton").adopt(this.o);		
		
		this.o.addEvents({
			"keydown":this.toggleBySpace.bindWithEvent(this),
			"keyup":this.toggleBySpace.bindWithEvent(this)
		});
		
		this.lab = new Element("span").addClass("label").setHTML(this.o.value).injectInside(this.a);
		
		if($chk(this.options.slidingDoors)){
			this.slidingDoors = new Element("span",{"class": "js"+this.type+"Slide"}).injectInside(this.a);
			this.slidingDoors.adopt(this.o).adopt(this.lab);
		}
	
		// disable text selection of label
		if(window.ie || window.opera){this.lab.setProperty("unselectable","on");}
		if(window.gecko){this.lab.setStyle("MozUserSelect","none");}
		if(window.webkit){this.lab.setStyle("KhtmlUserSelect","none");}
	},
	
	unhover: function(){
		this.parent();
		this.a.removeClass("P");
		this.over = false;
	},
	
	toggleBySpace: function(e){
		var event = new Event(e);
		if(event.key == 'space'){
			switch(event.type){
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
		window.addEvent("mouseup",this.release.bindAsEventListener(this));
	},
	
	release: function(e){
		var ev = new Event(e);
		
		if(this.over && (ev.event.button == 0 || (window.ie && ev.event.button == 1))){
			this.o.click();
			this.over = false;
		}
		else{
			window.removeEvent("mouseup");
		}
		
		this.a.removeClass("P");		
		this.pressed = false;
	}	
});

cfe.base.prototype.registerModule("submit");