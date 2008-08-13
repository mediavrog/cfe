/**
 * @author Maik
 */

cfe.module.fieldset = cfe.module.generic.extend({
	
	type: "Fieldset",
	
	selector: "fieldset",
	
	initializeAdv: function(){
		
		this.a = this.o;
		
	},
	
	build: function(){
		
		// create standard span as replacement
		this.a.addEvents({
				"mouseover": this.hover.bind(this),
				"mouseout": this.unhover.bind(this),
				"click": this.setFocus.bind(this)								
			}
		);
		
		window.addEvent("click", function(ev){
			
			var e = new Event(ev).stop();
			
			console.log(e);
			
			var aSize = this.a.getSize();
			var aPos = this.a.getPosition();
					
			if( e.page.x < aPos.x || e.page.x > aPos.x+aSize.size.x || e.page.y < aPos.y || e.page.y > aPos.y+aSize.size.y ){
				this.removeFocus();
			}	
		}.bind(this));			
	},
	
	setFocus: function(){
		this.a.addClass("A");
				
		this.fireEvent("onFocus");
	},
	
	removeFocus: function(){
		this.a.removeClass("A");
		
		this.fireEvent("onBlur");
		
	}
});

cfe.base.prototype.registerModule("fieldset");