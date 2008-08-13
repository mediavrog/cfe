/****************************************/
/* §name:> select						*/
/* ?help:> replaces select-elements		*/
/* !dep:>  core,interface				*/
/****************************************/
cfe.module.select = new Class({
	
	Extends: cfe.module.generic,
	
	type: "Selector",
	
	selector: "select",
	
	options: {
		defaultSelect:1,
		size: 4,
		scrolling: true,
		scrollSteps: 5
	},
	
	stdEvents: {
		"mouseover":function(){this.addClass("H");},
		"mouseout":function(){this.removeClass("H");},
		"mousedown":function(){this.addClass("A");},
		"mouseup":function(){this.removeClass("A");}
	},
	
	initializeAdv: function(){
		this.parent();
		
		this.hideAndReplace.bind(this)();

		this.origOptions = this.o.getChildren();
		
		// key indices
		this.kind = [];
		
		// integrity check
		if(this.options.size > this.origOptions.length || this.options.scrolling != true){this.options.size = this.origOptions.length;}
		
		// needed for adding and removing events
		this.boundKeyListener = this.keyListener.bindWithEvent(this);
		this.boundWheelListener = this.mouseListener.bindWithEvent(this);
		this.boundClickedOutsideListener = this.clickOutsideListener.bindWithEvent(this);
						
	},
	
	build: function(){
	
		var i = this.options.instanceID;
				
		/* build the select element showing the currently selected item */
		this.a.addClass("jsSelector"+i);
		
		this.arrow = new Element("img",{
			"class": "js"+this.type+"Arrow",
			"src": this.options.spacer,
			"styles": {
				"float":"right",
				"display":"inline"
				}
			}).injectInside(this.a);
		
		// get important css styles
		this.aWidth = this.a.getStyle("width").toInt();
		this.gfxWidth = this.arrow.getWidth();
		
		this.ai = new Element("span").addClass("js"+this.type+"Slide").injectInside(this.a).adopt(this.arrow);
		this.aWidth += this.ai.getStyle("padding").toInt()*2;
				
		this.activeEl = new Element("span",{
			"class": "jsOption",
			"styles": {
				"float":"left",
				"display":"inline"
				}
		}).set('html', this.origOptions[0].get("text") ).injectBefore(this.arrow);
			
		this.gfxHeight = this.a.getHeight()*this.options.size;
		
		/* shows on click */
		this.container = new Element("div",{
									 "class": "js"+this.type+"CWrapper js"+this.type+"CWrapper"+i,
									 "styles":{
										 "display":"none",
										 "overflow":"hidden"
										}
									 }).injectAfter(this.a);

		this.cContent = new Element("div",{
			"class":"js"+this.type+"Content",
			"styles":{
				"float":"left",
				"display":"inline"
			}
		}).injectInside(this.container);
		
		this.aliasOptions = new Element("div",{
			"class": "js"+this.type+"C",
			"styles":{
				"height": this.gfxHeight,
				"width": this.options.scrolling?(this.cContent.getStyle("width").toInt()-this.gfxWidth):"100%",
				"overflow":"hidden",
				"float":"left",
				"display":"inline"
			}
		}).injectInside(this.cContent);

		
		// insert option elements
		this.origOptions.each(function(el,i){
			new Element("div",{
				"class": "jsOption jsOption"+i,
				"styles":{
					"float":"left",
					"width":"100%",
					"clear":"left"
				},
				"events":{
					"mouseover": this.selectOption.pass([i,true,true],this),
					"mouseout": this.selectOption.pass([i,true,true],this),
					"click": this.selectOption.pass(i,this)
				}
			}).set('html', el.innerHTML).injectInside(this.aliasOptions);
					
		}.bind(this));
		
		this.aOptions = this.aliasOptions.getChildren();
		
		// scroller if scrolling enabled
		if(this.options.scrolling){
			this.scrollerWrapper = new Element("div",{
				"class": "js"+this.type+"ScrollerWrapper",
				"styles":{
					"height": this.gfxHeight,
					"float":"left",
					"display":"inline"
					}
				}).injectInside(this.cContent);
				
			this.scrollerTop = new Element("img",{
			   "class": "scrollTop",
			   "src": this.options.spacer,
			   "events": this.stdEvents
			  }).addEvent("click",this.moveScoller.pass(-1*this.options.scrollSteps,this));
			
			this.scrollerBottom = new Element("img",{
			  "class": "scrollBottom",
			  "src": this.options.spacer,
			  "events": this.stdEvents
		 	 }).addEvent("click",this.moveScoller.pass(this.options.scrollSteps,this));

			this.scrollerWrapper.adopt(this.scrollerTop);

			this.scrollerBack = new Element("div").setStyle("height",this.gfxHeight - 2*this.scrollerTop.getStyle("height").toInt());
			
			this.scrollerKnob = new Element("img",{
											"class": "scrollKnob",
											"src": this.options.spacer,
											"events": this.stdEvents							
										});
			
			this.scrollerBack.adopt(this.scrollerKnob);
					
			this.scrollerWrapper.adopt(this.scrollerBack).adopt(this.scrollerBottom);
		}

		// select default option
		this.selectOption.attempt(this.options.defaultSelect-1,this);
		
	},
	
	moveScoller:function(by){
		var scrol = this.aliasOptions.getScroll().y;
		this.slider.set(scrol+by<this.sliderSteps?scrol+by:this.sliderSteps);
	},
	
	selectOption: function(index,stayOpenAfterSelect,highlightOnly,focusOnElement){
		
		//console.log(index);
		index = index.limit(0,this.origOptions.length-1);
		
		this.highlighted?this.highlighted.removeClass("H"):"";
		this.highlighted = this.aOptions[index];
		this.highlighted.addClass("H");
		this.highlightedID = index;
		
		if(focusOnElement && this.options.scrolling){
			this.scrollToSelectedItem(this.highlightedID);
		}
		
		if(highlightOnly!=true){
			
			var selectit = this.origOptions[index];
				selectit.selected = "selected";
				
			this.selectedID = index;
			
			this.activeEl.set('html', selectit.innerHTML);
		
			stayOpenAfterSelect?"":this.clicked.attempt("hide",this);
		}
	},
	
	scrollToSelectedItem:function(index,onlyIfNotVisible){
		
		if(this.container.getStyle("display") == "block"){
			this.slider.set((this.sliderSteps/(this.aOptions.length-this.options.size))*index);
		}	
	},
	
	selectOptionByKey: function(key){
		
		if(!this.kind[key]){
			this.kind[key] = [];
			
			this.origOptions.each(function(el,i){
				if(el.get('text').charAt(0).toLowerCase() == key){
					this.kind[key][this.kind[key].length] = i;
				}
			}.bind(this));
			//console.log("new indizees for key "+key+";Res:"+this.kind[key]);
		}
		
		if($defined(this.kind[key][0])){
			var ind = this.kind[key].indexOf(this.highlightedID);
			this.selectOption(this.kind[key][ind+1]?this.kind[key][ind+1]:this.kind[key][0],true,false,true);
		}
	},
	
	clicked: function(action){
		
		if(this.container.getStyle("display") == "block" || action == "hide"){
			this.container.setStyle("display","none");
			window.removeEvent("keyup", this.boundKeyListener);
			window.removeEvent("click", this.boundClickedOutsideListener);
		
		}
		else{
			
			this.parent();
			
			// show container
			this.container.setStyles({
					"display":"block",
					"position":"absolute",
					"top": this.a.getTop(),
					"left": this.a.getLeft(),
					"width": this.ai.getWidth()
					});
			
			// fix ie 2 pixel bug
			if(window.ie){this.container.setStyle("left",this.a.getLeft()+2);}
							
			// scroller
			if(this.options.scrolling){
				this.sliderSteps = this.aliasOptions.getScrollSize().y - (this.options.size*this.aliasOptions.getScrollSize().y/this.aOptions.length);
				this.slider = new Slider(this.scrollerBack, this.scrollerKnob, {steps: this.sliderSteps, mode: "vertical" ,onChange: function(step){this.aliasOptions.scrollTo(false,step);}.bind(this)}).set(0);
				this.scrollToSelectedItem(this.selectedID);
			}
			
			// hide the container after click outside of it
			window.addEvent("click", this.boundClickedOutsideListener);
		}
	},
	
	keyListener: function(e){
		
    	var ev = new Event(e).stop();
		
		switch(ev.key){
			case "up":
				this.scrollToSelectedItem(this.highlightedID-1,true);
				this.selectOption(this.highlightedID-1,true);
				break;
				
			case "down":
				this.scrollToSelectedItem(this.highlightedID+1,true);
				this.selectOption(this.highlightedID+1,true);
				break;
			
			case "enter":this.selectOption(this.highlightedID);break;
			
			default: this.selectOptionByKey(ev.key);break;
		}
	},
	
	mouseListener: function(e){
    	var ev = new Event(e).stop();

		this.scrollToSelectedItem(this.highlightedID-ev.wheel,true);
		this.selectOption(this.highlightedID-ev.wheel,true);

	},
	
	clickOutsideListener: function(event){
		event = new Event(event).stop();
		
		if(!(this.a.hasChild(event.target) || this.container.hasChild(event.target) || this.l == event.target ))
		{   
		   this.clicked("hide");
		}
	},
	
	setFocus: function(){
		
		this.parent();
		
		if(!this.hasFocusEvents){
			
			this.hasFocusEvents = true;
			
			// change value on key press
			window.addEvent("keyup",this.boundKeyListener);
			window.addEvent("mousewheel",this.boundWheelListener);
		}
	},
	
	removeFocus: function(){
		
		this.parent();
		
		if(this.hasFocusEvents){
			
			this.hasFocusEvents = false;
			
			// change value on key press
			window.removeEvent("keyup",this.boundKeyListener);
			window.removeEvent("mousewheel",this.boundWheelListener);
		}
	},
	
	
});