/**
 * @author Maik
 */
cfe.addon.toolTips = new Class({
	
	options: $merge(this.parent, {
		ttStyle: "label",
		ttClass: "jsQM"	
	}),
	
	initToolTips: function(){
		
		if(!Tips && this.options.debug){
			this.throwMsg.bind(this)("CustomFormElements: initialization of toolTips failed.\nReason: Mootools Plugin 'Tips' not available.");
			return false;			
		}
	
		switch(this.options.ttStyle){
			default:case 'label': this.toolTipsLabel.bind(this)();break;	
		}
	},
	
	toolTipsLabel: function(){
		
		var labels = this.options.scope.getElements('label');
		
		labels.each(function(lbl,i){
			
			forEl = lbl.getProperty("for");
			
			if(!forEl){
				var cl = lbl.getProperty("class");
				
				if(cl){
					var forEl = cl.match(/for_[a-zA-Z0-9\-]+/).toString();
					forEl = forEl.replace(/for_/,"");
					el = $(forEl);
				}
				
				if(!el){
					el = lbl.getElement("input");
				}
			}else{
				el = $(forEl);
			}

			if(el){
				if($chk(qmTitle = el.getProperty("title"))){
					
					el.setProperty("title","");
					
					var qm = new Element("img",{
						"src": this.options.spacer,
						"class": this.options.ttClass,
						"title": qmTitle
					}).injectInside(lbl);
				}
			}
		},this);
		
		new Tips($$('.'+this.options.ttClass+'[title]'));
	}
});

cfe.base.implement(new cfe.addon.toolTips);

cfe.base.prototype.addEvent("onComplete", function(){this.initToolTips();});