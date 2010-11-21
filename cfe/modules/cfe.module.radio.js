/****************************************/
/* §name:> radiobuttons					*/
/* ?help:> replaces radiobuttons		*/
/* !dep:>  core,interface				*/
/****************************************/

cfe.module.radio = cfe.module.generic.extend({
	
	type: "Radiobutton",
	
	selector: "input[type=radio]",

	initializeAdv: function(){
		this.parent();
		this.hideAndReplace.bind(this)();
		this.elName = this.o.getProperty("name").replace("]","").replace("[","-");
	},
	
	build: function(){
		// config alias
		this.a.addClass("cfe_radiogroup_"+this.elName).adopt(new Element("img",{"src": this.options.spacer}));
		this.o.checked?this.a.addClass("A"):"";
		this.a.input = this.o;
		this.o.addEvent("keydown",this.toggleBySpace.bindWithEvent(this));
	},
	
	toggleBySpace: function(e){
		var event = new Event(e);
		event.key == 'space'?this.clicked.bind(this)():"";
	},
	
	unhover: function(){
		this.parent();
		this.a.removeClass(!this.o.checked?"A":"");
	},
	
	clicked: function(){
		this.parent();
		
		$$(".cfe_radiogroup_"+this.elName).each(function(el){
			el.input.removeProperty("checked");
			el.removeClass(!el.input.checked?"A":"");
		}.bind(this));
	
		this.o.checked = "true";
		this.a.addClass("A");
	}
});

cfe.base.prototype.registerModule("radio");