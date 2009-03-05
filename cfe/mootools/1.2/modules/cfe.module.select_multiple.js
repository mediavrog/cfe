/****************************************/
/* �name:> select						*/
/* ?help:> replaces select-elements		*/
/* !dep:>  core,interface				*/
/****************************************/
cfe.module.select_multiple = new Class({
	
	Extends: cfe.module.generic,
	
	type: "Selector",
	
	selector: "select[multiple]",
	
	options: {
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
		this.preSelectedIndex = this.o.selectedIndex || 0;
		
		// key indices
		this.kind = [];
		
		// integrity check
		if(this.options.size > this.origOptions.length || this.options.scrolling != true){this.options.size = this.origOptions.length;}
		
		// needed for adding and removing events
		this.boundKeyListener = this.keyListener.bindWithEvent(this);
		this.boundWheelListener = this.mouseListener.bindWithEvent(this);
        this.boundClickedOutsideListener = this.clickOutsideListener.bindWithEvent(this);

        window.addEvent("click", this.boundClickedOutsideListener);

        this.a.addClass("jsSelectorMultiple clearfix");
						
	},
	
	build: function(){
	
		var i = this.options.instanceID;
				
		/* build the select element showing the currently selected item */
		this.a.addClass("jsSelector"+i);
				
		// get important css styles
		//this.aWidth = this.a.getStyle("width").toInt();
				
		
		
		/* always shown */
		this.container = new Element("div",{
									 "class": "js"+this.type+"CWrapper js"+this.type+"CWrapper"+i,
									 "styles":{
										 "overflow":"hidden"
										}
									 }).injectInside(this.a);

		this.cContent = new Element("div",{
			"class":"js"+this.type+"Content",
			"styles":{
                "position":"relative"
			}
		}).injectInside(this.container);

    	this.aliasOptions = new Element("div",{
			"class": "js"+this.type+"C",
			"styles":{
				"width": "100%",
				"overflow":"hidden"
			}
		}).injectInside(this.cContent);


		// insert option elements
        var oOpt = null;

        this.origOptions.each(function(el,i){

            console.log(el);

            oOpt = new Element("div",{
				"class": "jsOption jsOption"+i,
				"events":{
					"mouseover": this.selectOption.pass([i,true,true],this),
					"mouseout": this.selectOption.pass([i,true,true],this),
					"click": this.selectOption.pass(i,this)
				}
			}).set('html', el.innerHTML);

            new Element("img",{"src": this.options.spacer}).inject(oOpt, "top");

            if($chk(el.selected)){
                oOpt.addClass("A");
            }

            oOpt.disableTextSelection();
            oOpt.injectInside(this.aliasOptions);
					
		}.bind(this));
        oOpt = null;

        this.gfxHeight = this.aliasOptions.getFirst().getHeight()*this.options.size;
        this.aliasOptions.setStyle("height", this.gfxHeight);
        
		this.aOptions = this.aliasOptions.getChildren();

        // scroller if scrolling enabled
		if(this.options.scrolling)
        {
			this.scrollerWrapper = new Element("div",{
				"class": "js"+this.type+"ScrollerWrapper",
				"styles":{
					"height": this.gfxHeight,
                    "position": "absolute",
                    "top": "0",
                    "right": "0"
					}
				}).injectInside(this.cContent);

            this.scrollerTop = new Element("img",{
			   "class": "scrollTop",
			   "src": this.options.spacer,
			   "events": this.stdEvents
			  }).addEvent("click", function(ev){
                    ev.preventDefault();
                    this.moveScoller.pass(-1*this.options.scrollSteps,this);
              }.bind(this));
			
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

            this.sliderSteps = this.aliasOptions.getScrollSize().y - (this.options.size*this.aliasOptions.getScrollSize().y/this.aOptions.length);
            this.slider = new Slider(this.scrollerBack, this.scrollerKnob, {steps: this.sliderSteps, mode: "vertical" ,onChange: function(step){this.aliasOptions.scrollTo(false,step);}.bind(this)}).set(0);

            // fix ie 2 pixel bug
            if(Browser.Engine.trident){this.container.setStyle("left",this.a.getLeft()+2);}

            // scroller
            if(this.options.scrolling){

                // fix for opera bug; getHeigth of this.aliasOptions returns 0 while initializing component
                if(Browser.Engine.presto)
                {
                    this.scrollerBack.setStyle("height",this.gfxHeight - (2*this.scrollerTop.getStyle("height").toInt()) );
                }
            }
		}
	},
	
	moveScoller:function(by){
		var scrol = this.aliasOptions.getScroll().y;
		this.slider.set(scrol+by<this.sliderSteps?scrol+by:this.sliderSteps);
    },
	
	selectOption: function(index,stayOpenAfterSelect,highlightOnly, focusOnElement){
		
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
            selectit.selected = !selectit.selected;

            console.log(selectit.selected);

            if($chk(selectit.selected)){
                this.highlighted.addClass("A");
                this.fireEvent("onActive", this.highlighted);
            }else{
                this.highlighted.removeClass("A");
                this.fireEvent("onInActive", this.highlighted);
            }
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
			this.selectOption(this.kind[key][ind+1]?this.kind[key][ind+1]:this.kind[key][0],true,true,true);
		}
	},
	
	clicked: function(action)
    {
		this.parent();
	},
	
	keyListener: function(e){
		
    	var ev = new Event(e).stop();
		
		switch(ev.key){
			case "up":
				this.scrollToSelectedItem(this.highlightedID-1,true);
                this.selectOption(this.highlightedID-1,true, true);
				break;
				
			case "down":
				this.scrollToSelectedItem(this.highlightedID+1,true);
                this.selectOption(this.highlightedID-1,true, true);
				break;
			
			case "enter":this.selectOption(this.highlightedID);break;
			
			default: this.selectOptionByKey(ev.key);break;
		}
	},
	
	mouseListener: function(e){
    	var ev = new Event(e).stop();

		this.scrollToSelectedItem(this.highlightedID-ev.wheel,true);
        this.selectOption(this.highlightedID-ev.wheel,true,true);
	},

    scrollToSelectedItem:function(index,onlyIfNotVisible)
    {
		this.slider.set((this.sliderSteps/(this.aOptions.length-this.options.size))*index);
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
	
    clickOutsideListener: function(event){
		event = new Event(event).stop();

		if(!(this.a.hasChild(event.target) || this.container.hasChild(event.target) || this.l == event.target ))
		{
		   this.highlighted?this.highlighted.removeClass("H"):"";
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
	}
});