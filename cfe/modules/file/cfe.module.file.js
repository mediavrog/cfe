/**
 * @module file
 */

/**
 * replaces file upload fields
 *
 * bug:
 * update event onMouseOut triggers even if nothing changed
 * ff 3.0.7     - no pointer
 * opera        - no pointer; no focus on label if ori focussed, click event triggers twice
 * ie 8         - no focus on label if ori focussed
 * ie 7         - no focus on label if ori focussed
 *
 * @class file
 * @namespace cfe.modules
 *
 * @requires generic
 * @extends cfe.generic
 */
cfe.module.file = $.inherit(
cfe.generic,
{
    
    instance: 0,
    /**
     * Describes the type of this element
     * @property type
     * @type string
     */
    type: "File",

    /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
    selector: "input[type=file]",
	
    options: {
        /**
         * enables the use of fileicons through a bit of markup and css
         * @config fileIcons
         * @type boolean
         * @default true
         */
        fileIcons: true,
        /**
         * show only the filename, not the whole path
         * @config trimFilePath
         * @type boolean
         * @default true
         */
        trimFilePath: true
    },

    /**
     * retreive the filepath
     *
     * @method getFilePath
     * @return {HTMLElement}
     */
    getFilePath: function()
    {
        return this.v;
    },

    /**
     * retreive the label, the alias and the filepath
     *
     * @method toElements
     * @return {HTMLElement[label, alias, filePath]}
     */
    toElements: function()
    {
        return [this.l, this.a, this.v];
    },

    initializeAdv: function()
    {
        // fixes safari double click bug
        if(!this.o.data("implicitLabel") && !$.browser.webkit)
        {
            this.a.bind("click", $.proxy(this.clicked, this));
        }

        if(this.isDisabled()) this.a.trigger("disable");
    },

    build: function()
    {
        this.a.bind("mousemove", $.proxy(this.follow, this)).css("overflow","hidden");
        this.o.appendTo(this.a);

        this.initO();

        // add filepath
        this.v = $("<div class='js"+this.type+"Path hidden' />").insertAfter(this.a);
		
        if(this.options.fileIcons){
            this.fileIcon = $("<img class='fileIcon' src='"+this.options.spacer+"' />").appendTo(this.v);
        }
		
        this.path = $("<span class='filePath' />").appendTo(this.v);
        
        this.cross = (new cfe.generic()).toElement().unbind("click").bind("click", $.proxy(this.deleteCurrentFile, this)).addClass("delete").appendTo(this.v);

        this.a.unbind("click");

        this.update();
    },

    /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} an input field of type "file"
     */
    createOriginal: function()
    {
        return $("<input type='file' />");
    },

    initO: function()
    {
        this.o.bind({
            "mouseout": $.proxy(this.update, this),
            "change": $.proxy(this.update, this)
        }).css({
            cursor: "pointer",
            opacity: "0",
            visibility: "visible",
            height: "100%",
            width: "auto",
            position: "relative"
        });
    },
	
    follow: function(ev)
    {
        this.o.css("left",(ev.clientX-this.a.offset().left-(this.o.width()-30)));
		
        /* special treatment for internet explorer as the fileinput will not be cut off by overflow:hidden */
        if($.browser.msie){
            if(ev.clientX < this.a.offset().left || ev.clientX > this.a.offset().left()+this.a.width())
                this.o.css("left", -999);
        }
    },
	
    update: function()
    {
        if( this.o.val() != "" )
        {
            this.oldValue = this.o.val();
            this.oldValue = this.options.trimFilePath?this.trimFilePath(this.oldValue):this.oldValue;
            this.path.html(this.oldValue);
			
            if(this.options.fileIcons)
            {
                var ind = this.oldValue.lastIndexOf(".");
                this.fileIcon.addClass("fileIcon "+this.oldValue.substring(++ind).toLowerCase());
            }
            this.v.removeClass("hidden");
        }
        else
        {
            this.path.html("");
            this.v.addClass("hidden");
        }

        this.__base();
    },

    deleteCurrentFile: function()
    {
        // maybe better: this.setupOriginal()
        var newFileinput = this.createOriginal();

        newFileinput.addClass(this.o.attr("class")).attr({
            name: this.o.attr("name"),
            id: this.o.attr("id")
        });
        
        this.o.replaceWith(newFileinput);
        this.o = newFileinput;
		
        this.initO();
		
        this.update();
    },
	
    trimFilePath: function(path)
    {
        var ind = false;
        if(!(ind = path.lastIndexOf("\\")))
            if(!(ind = path.lastIndexOf("\/")))
                ind = 0;
	
        return path.substring(++ind);
    }
});