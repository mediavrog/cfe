/****************************************/
/* §name:> fileupload					*/
/* ?help:> replaces file upload fields	*/
/* !dep:>  core,interface				*/
/****************************************/
cfe.module.file = new Class({
	
	Extends: cfe.module.generic,

	type: "File",
	
	selector: "input[type=file]",
	
	options: {
		fileIcons: true,
		trimFilePath: true
	},
	
	build: function(){
		
		this.a = new Element("div",{
			"class": "js"+this.type+"Wrapper",
			"events": {
				"mouseover":this.hover.bind(this),
				"mouseout":this.unhover.bind(this),
				"mousemove":this.follow.bindWithEvent(this)
			}
		}).setStyle("overflow","hidden").injectBefore(this.o).adopt(this.o);
				
		this.initO.bind(this)();
		
		this.v = new Element("div",{"class": "js"+this.type+"Path"}).inject(this.a, 'after').addClass("hidden");
		
		this.options.fileIcons?this.fileIcon = new Element("img",{"src": this.options.spacer}).inject(this.v):"";
		
		this.path = new Element("span",{"class":"filePath"}).inject(this.v);
		this.cross = new Element("img",{
			"src": this.options.spacer,
			"class":"delete"
		}).addEvent("click",this.deleteCurrentFile.bind(this)).inject(this.v);

		this.updateFilePath.bind(this)();
		this.unhover.bind(this)();
	},
	
	initO: function(){
		this.o.addEvents({
			"mouseout":this.updateFilePath.bind(this),
			"change": this.updateFilePath.bind(this)
		});
		
		this.o.setStyles({"cursor":"pointer","opacity":"0","visibility":"visible","height": this.a.getHeight(),"width": "auto","position":"relative"});
		if(window.gecko){this.o.setStyle("MozOpacity","0");}
	},
	
	follow: function(e){
		var ev = new Event(e);
		this.o.setStyle("left",(ev.client.x-this.a.getLeft()-(this.o.getWidth()-30)));
		
		/* special treatment for internet explorer as the fileinput will not be cut off by overflow:hidden */
		if(window.ie){
			if(ev.client.x < this.a.getLeft() || ev.client.x > this.a.getLeft()+this.a.getWidth())
				this.o.setStyle("left", -999);
		}
	},
	
	updateFilePath: function(){
		if(this.o.value != ""){// && (this.path.get("text") != this.o.getProperty("value"))){
				
			var path = this.o.getProperty("value");
			path = this.options.trimFilePath?this.trimFilePath(path):path;
			this.path.set("html", path);
			
			if(this.options.fileIcons){
				var ind = path.lastIndexOf(".");
				this.fileIcon.setProperty("class",path.substring(++ind).toLowerCase());
			}
			this.v.removeClass("hidden");
		}else{
			this.path.set("html", "");
			this.v.addClass("hidden");
		}
	},
	
	deleteCurrentFile: function(){
		var newFileinput = new Element("input",{
			"type": "file",
			"class": this.o.getProperty("class"),
			"name": this.o.name,
			"id": this.o.id
		})
		newFileinput.replaces(this.o);
		this.o = newFileinput;
		
		this.initO.bind(this)();
		
		this.updateFilePath.bind(this)();
	},
	
	trimFilePath: function(path){
		var ind = false;
		if(!(ind = path.lastIndexOf("\\")))
			if(!(ind = path.lastIndexOf("\/")))
				ind = 0;
	
		return path.substring(++ind);
	}
});