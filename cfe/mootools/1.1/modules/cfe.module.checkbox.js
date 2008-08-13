/****************************************/
/* §name:> checkbox						*/
/* ?help:> replaces checkboxes	 		*/
/* !dep:>  core,interface				*/
/****************************************/
cfe.module.checkbox = new Class({
	
	Extends: cfe.module.generic,
	
	type: "Checkbox",
	
	selector: "input[type=checkbox]",
		
	initializeAdv: function(){
		this.parent();
		this.hideAndReplace.bind(this)();
	},
	
	build: function(){
		// config alias
		this.a.adopt(new Element("img",{"src": this.options.spacer}));
		this.o.checked?this.a.addClass("A"):"";
		
		this.o.addEvent("keyup",this.toggleBySpace.bindWithEvent(this));
	},
	
	toggleBySpace: function(e){
	
		var ev = new Event(e);

		if(ev.key == 'space'){
			!this.o.checked?this.a.addClass("A"):this.a.removeClass("A");
			
			// little bugfix because when pressing space, the checkbox gets triggered twice - why
			// maybe: space > (un)check input[type=checkbox] AND trigger label for input[type=checkbox]
			if(this.implicitLabel)
				this.o.checked = !this.o.checked;
		}
	},
	
	unhover: function(){
		this.parent();
		this.a.removeClass(this.o.checked!=true?"A":"");
	},
	
	setStateTo: function(state){
		
		if(state){
			this.o.checked = true;
			this.a.addClass("A");
			this.fireEvent("onActive");
		}else{
			this.o.checked = false;
			this.a.removeClass("A");
			this.fireEvent("onInActive");
		}
	},
	
	clicked: function(){
		this.parent();

		this.setStateTo(this.o.checked?false:true);
	}
});

// implements selectAll/deselectAll functionality into custom form elements
cfe.addon.selectCheckboxes = new Class({
	
	// select all checkboxes in scope
	selectAll: function(scope){
		(scope || $(document.body)).getElements("input[type='checkbox']")[0].each(function(el, i){
			el.retrieve('cfe').setStateTo(true);
		});
	},
	
	// deselect all checkboxes in scope
	deselectAll: function(scope){
		(scope || $(document.body)).getElements("input[type='checkbox']")[0].each(function(el){
			el.retrieve('cfe').setStateTo(false);
		});
	}	
});
cfe.base.implement(new cfe.addon.selectCheckboxes);
