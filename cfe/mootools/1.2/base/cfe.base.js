/*
customFormElements for mootools 1.2 - v0.8b - style form elements on your own
by Maik Vlcek (http://www.mediavrog.net) - MIT-style license.
Copyright (c) 2008 Maik Vlcek (mediavrog.net)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

###CHANGELOG

#0.8.1
- decoupling of addon tooltips and core
- select now handles mousewheel scrolling
- ie still buggy
- some code sweeping

#0.8b
- initial port of cfe 0.8b for mootools 1.1

*/

var cfe = {};
cfe.module = {};
cfe.addon = {};

cfe.base = new Class({
	
	version: "0.8.1",
	
	options:{
		scope: false,
		spacer: "gfx/spacer.gif",

		onInit: $empty,
		onInitSingle: $empty,
		onBeforeInitSingle: $empty,
		onSetModuleOption: $empty,
		onRegisterModule: $empty,
		onUnregisterModule: $empty,
		onComplete: $empty
	},
		
	modules: {},
	moduleOptions: {},
	moduleOptionsAll: {},
	
	initialize: function(debug){
		this.options.debug = debug | false;
		
		this.registerAllModules.bind(this)();
		
	},
	
	getVersion: function(){return this.version;},
	
	throwMsg: function(errText){
		this.options.debug?alert(errText):"";
	},
	
	/**
	 * registeres all loaded modules onInitialize
	 */
	registerAllModules: function(){
		
		//console.log("Register all modules");
		
		$each(cfe.module, function(modObj, modType){
			//console.log("Registering type "+modType);
			if(modType != "generic")
				this.registerModule(modType);
				
		}.bind(this));
	},
	
	/* call to register module */
	registerModule: function(mod){
		
		//console.log("Call to registerModule with arg:"+mod);
		
		modObj = cfe.module[mod];
		
		/*if(false){
		//if(!modObj.prototype.build && !modObj.prototype.noBuild){
			this.throwMsg.bind(this)("CustomFormElements: registration of Module '"+modObj.prototype.type+"' failed. It will NOT be available.\nReason: lack of obligatory 'build' function.");
			return false;
		}
		else{*/
			this.fireEvent("onRegisterModule", [mod,modObj]);
			this.modules[mod] = modObj;
			this.moduleOptions[mod] = {};
			
			return true;
		//}
	},
	
	registerModules: function(mods){
		$each(mods,function(mod){
			this.registerModule(mod);
		},this);
	},
	
	unregisterModule: function(mod){
		modObj = cfe.module[mod];
		
		this.fireEvent("onUnregisterModule", [mod,modObj]);
		delete this.modules[mod];
	},
	
	unregisterModules: function(mods){
		$each(mods,function(mod){
			this.unregisterModule(mod);
		},this);
	},
	/**
	 * sets a single option for a specified module
	 * if no module was given, it sets the options for all modules
	 * 
	 * @param {String} 	mod 	Name of the module
	 * @param {String} 	opt 	Name of the option
	 * @param {Mixed} 	val		The options value
	 */
	setModuleOption: function(mod,opt,val){
		
		modObj = cfe.module[mod];
		
		this.fireEvent("onSetModuleOption", [mod,modObj,opt,val]);
		
		if(!modObj){
			this.moduleOptionsAll[opt] = val;
		}
		else{
			this.moduleOptions[mod][opt] = val;
		}
	},

	setModuleOptions: function(mod,opt){
		
		$each(opt, function(optionValue, optionName){
			this.setModuleOption(mod,optionName,optionValue);
		}.bind(this));
		
	},

	init: function(options){

		this.setOptions(this.options, options);

		if($type(this.options.scope) != "element"){
			this.options.scope = $(document.body);
		}

		this.fireEvent("onInit");
		
		$each(this.modules,function(module,moduleName,i){
			
			var selector = module.prototype.selector;
			
			this.options.scope.getElements(selector).each(function(el,i){
				
				var basicOptions = {"instanceID": i,"spacer":this.options.spacer};

				this.fireEvent("onBeforeInitSingle", [el,i,basicOptions]);
			
				var single = new module(el,$merge(basicOptions,$merge(this.moduleOptions[moduleName],this.moduleOptionsAll)));
				
				this.fireEvent("onInitSingle", single);
				
			},this);
		},this);
		
		this.fireEvent("onComplete");
	}
});

cfe.base.implement(new Options,new Events);

// basic generic module; may be extended by modules to start off with standard behaviours
cfe.module.generic = new Class({
	// type of cfe; e.g. Selector, Checkbox or Radiobutton
	type : "interface",
	
	// basic options for all cfes and always available
	options: {
		instanceID:0,
		spacer:false,
		aliasType: "span",
		onHover: Class.empty,
		onUnHover: Class.empty,
		onFocus: Class.empty,
		onBlur: Class.empty,
		onClick: Class.empty	
	},
	
	/**
	 * initialization of cfe
	 * set options, add focus/blur-Events to original
	 * [call procedeLabel] 			add events to label of cfe
	 * !call build					must be implemented by cfe; 
	 * 
	 * @param {Object} original
	 * @param {Object} opt
	 */ 
	initialize: function(original,opt){
			this.setOptions(this.options, opt);
			
		// set original element and add focus/blur-Events
			this.o = original.addEvents({
				"focus": this.setFocus.bind(this),
				"blur": this.removeFocus.bind(this)
			});
			
		// store a reference to this "in" the original form element
			this.o.store("cfe", this);
			
		// specific initialization
			this.initializeAdv.bind(this)();
		
		// each cfe must implement this function
			this.build.bind(this)();	
	},
	
	// may be extended by cfe
	initializeAdv: function(){
		// get label for this element
		this.procedeLabel.bind(this)();
	},
	
	/**
	 * checks for appropriate label and adds events if found 
	 */
	procedeLabel: function(){
		
		this.implicitLabel = false;
		
		// get label for original input element
		if(this.o.id){
			this.l = $$("label[for="+this.o.id+"]")[0];
		}
		
		// no label was found for id, so try to get parent as label
		if(!this.l){
			this.l = this.o.getParent('label');
			
			if($type(this.l) == "element"){
				this.implicitLabel = true;
			}
		}
		
		if(this.l){
			
			// remove for property
			this.dontRemoveForFromLabel?"":this.l.removeProperty("for");
			
			// add adequate className, add stdEvents
			this.l.addClass("for_"+ (this.o.id || (this.o.name+this.o.value).replace("]","-").replace("[","") )+" js"+this.type+"L");

			// add stdevents
			this.l.addEvents({
				"mouseover": this.hover.bind(this),
				"mouseout": this.unhover.bind(this),
				"click":this.clicked.bindWithEvent(this)
			});
		}
		
		// no label found
		else{
			return false;
		}
	},
	
	/**
	 * hides the original input element and creates a span as replacement/alias
	 */
	hideAndReplace: function(){
		// hide original input
			this.o.setStyles({"position":"absolute","left":"-999px"});
			
			// fix for internet explorer
			if(Browser.Engine.trident){this.o.setStyles({"position":"static","width":"0"});}
			
		// create standard span as replacement
			this.a = new Element(this.options.aliasType,{
				"class": "js"+this.type+" "+"js"+this.o.id,
				"events": {
					"mouseover": this.hover.bind(this),
					"mouseout": this.unhover.bind(this),
					"click": this.setFocus.bind(this)	
				}
			}).setStyle("cursor","pointer").injectBefore(this.o);
			
		// check for implicit labels;
			if(!this.implicitLabel){
				this.a.addEvent("click",this.clicked.bind(this));
			}
	},

	/**
	 * standard mouseover-behaviour
	 * add hover state to alias and label (if existent)
	 */
	hover: function(){
		this.a.addClass("H");
		this.l?this.l.addClass("H"):"";
		
		this.fireEvent("onHover");
	},
	
	/**
	 * standard mouseout-behaviour
	 * removes hover state from alias and label (if existent)
	 */
	unhover: function(){
		this.a.removeClass("H");
		this.l?this.l.removeClass("H"):"";
		
		this.fireEvent("onUnHover");
	},

	/**
	 * standard focus-behaviour
	 * adds focus state to alias and label (if existent)
	 */
	setFocus: function(){
		this.a.addClass("F");
		this.l?this.l.addClass("F"):"";
		
		this.fireEvent("onFocus");
	},

	/**
	 * standard blur-behaviour
	 * removes focus state from alias and label (if existent)
	 */
	removeFocus: function(){
		this.a.removeClass("F");
		this.l?this.l.removeClass("F"):"";
		
		this.fireEvent("onBlur");
	},
	
	clicked: function(){
		this.o.focus();
		//this.setFocus.bind(this)();
		
		this.fireEvent("onClick");
	}
});
cfe.module.generic.implement(new Options,new Events);