/**
 * @author Maik
 */
cfe.addon.toolTips = new Class({
	
	initToolTips: function(){
		if(!Tips){
			this.throwMsg.bind(this)("CustomFormElements: initialization of toolTips failed.\nReason: Mootools Plugin 'Tips' not available.");
			return false;			
		}
				
		switch(this.options.toolTipsStyle){
			default:case 'label': this.toolTipsLabel.bind(this)();break;	
		}
	},
	
	toolTipsLabel: function(){
		var labels = (this.options.scope || document.body).getElements('label');
		labels.each(function(lbl,i){
			if(!(forEl = lbl.getProperty("for"))){
				var cl = lbl.getProperty("class");
				
				if(cl){
					var forEl = cl.match(/for_[a-zA-Z0-9\-]+/).toString();
					forEl = forEl.replace(/for_/,"");
					el = $(forEl);
				}
				else{
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
						"class": "jsQM",
						"title": qmTitle
					}).injectInside(lbl);
				}
			}
		},this);
		
		new Tips($$('.jsQM[title]'));
	}
});

cfe.base.implement(new cfe.addon.toolTips);

cfe.base.prototype.addEvent("onComplete", cfe.base.prototype.initToolTips.bind(cfe.base.prototype));
