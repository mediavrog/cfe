/**
 * this adds theming functionality to cfe
 * @class themes
 */

cfe.addon.themes = new Class({
	
	options: $merge(this.parent, {
		themeFolder: "cfe/themes/",
		theme: "basic"
	}),
	
	useTheme: function(theme){
		
		if(!Asset && this.options.debug){
			this.throwMsg.bind(this)("CustomFormElements: initialization of addon 'themes' failed.\nReason: Mootools Plugin 'Asset' not available.");
			return false;			
		}
		
		// load new theme
		Asset.css(this.options.themeFolder+theme+"/css/cfe.css",{
			id: "cfeTheme"+theme
		});
		
		if(this.lastTheme){
			$("cfeTheme"+this.lastTheme).dispose();
		}
		
		this.lastTheme = theme;
	}
});

cfe.replace.implement(new cfe.addon.themes);
cfe.replace.prototype.addEvent("onInit", function(){this.useTheme.attempt(this.options.theme,this);});