/**
 * @module File
 */

/**
 * replaces file upload fields
 *
 * <p>is not resetted onReset</p>
 * 
 * <h6>Tested in:</h6>
 * <ul>
 * <li>Safari 4 - implicitly labelled triggers when deletin a file; reset doesnt trigger</li>
 * <li>Firefox 3.6.</li>
 * <li>Google Chrome 6 - implicitly labelled triggers twice, when using alias button & triggers when deletin a file.</li>
 * <li>Opera 10.62.</li>
 * <li>IE 7 - gaga.</li>
 * <li>IE 8 - implicitly labelled triggers when deletin a file.</li>
 *  </ul>
 *
 * @class File
 * @namespace cfe.modules
 *
 * @extends cfe.module.Button
 */

cfe.module.File = new Class({
    
    Extends: cfe.module.Button,
    
    instance: 0,

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
        trimFilePath: true,

        innerLabel: "Choose File"
    },

    hideOriginalElement: false,

    toElement: function()
    {
        return this.wrapa
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

    afterInitialize: function()
    {
        this.a = this.button;
        
        if(this.hideOriginalElement) this.o.hideInPlace();

        if(this.o.id) this.wrapa.addClass(cfe.prefix+this.type+this.o.id.capitalize());

        // various additions
        if(!this.o.implicitLabel && !Browser.safari && !Browser.chrome) this.wrapa.addEvent("click", this.clicked.pass([e],this));

        if(this.isDisabled()) this.disable();

        if(!this.options.slidingDoors) this.wrapa.addClass(cfe.prefix+this.type)

        if(this.options.buttonStyle) this.a.addClass(cfe.prefix+"Button")

        this.a.removeClass(cfe.prefix+this.type)
    },

    build: function()
    {
        this.parent();
        this.innerlabel.set("text", Array.pick(this.options.innerLabel, ""));

        // make original element follow mouse
        // setup wrapper
        this.wrapa = new Element("span",{
            "class": cfe.prefix+this.type,
            styles:
            {
                overflow: "hidden",
                position: "relative"
            }
        }).cloneEvents(this.a)
        
        this.wrapa.inject(this.a, "after").adopt(this.a, this.o);

        // add positioning styles and events to "hidden" file input
        this.o.addEvents({
            "mouseout": this.update.bind(this),
            "change": this.update.bind(this),
            onDisable: this.disable.bind(this),
            onEnable: this.enable.bind(this)
        }).setStyles({
            opacity: "0",
            visibility: "visible",
            height: "100%",
            width: "auto",
            position: "absolute",
            top: 0,
            right: 0,
            margin: 0
        });

        this.wrapa.addEvent("mousemove", this.follow.pass([e],this));

        this.button = this.a;
        this.a = this.wrapa;
        
        // add filepath
        this.v = new Element("span").addClass(cfe.prefix+this.type+"Path hidden");
		
        this.path = new Element("span").addClass("filePath");

        if(this.options.fileIcons)
        {
            this.path.addClass("fileIcon");
        }

        this.cross = $( new cfe.module.Button({delegateClick: false}).addEvent("click", this.deleteCurrentFile.bind(this)) ).addClass("delete");

        this.v.adopt(this.path, this.cross).inject(this.wrapa, "after");

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
        return new Element("input",{
            type: "file"
        });
    },
	
    follow: function(ev)
    {
        this.o.setStyle("left",(ev.client.x-this.a.getLeft()-(this.o.getWidth()-30)));
		
        /* special treatment for internet explorer as the fileinput will not be cut off by overflow:hidden */
        if(Browser.ie){
            if(ev.client.x < this.a.getLeft() || ev.client.x > this.a.getLeft()+this.a.getWidth())
                this.o.setStyle("left", -9999);
        }
    },
	
    update: function()
    {
        // only do stuff if original element is not disabled
        if( this.o.disabled == null )
        {
            if( this.o.value != "" )
            {
                this.o.disable().blur();

                this.oldValue = this.o.getProperty("value");
                if(this.options.trimFilePath) this.oldValue = this.oldValue.trimFilePath();
                this.path.set("html", this.oldValue);

                if(this.options.fileIcons)
                {
                    var ind = this.oldValue.lastIndexOf(".");
                    this.path.setProperty("class","filePath fileIcon " + this.oldValue.substring(++ind).toLowerCase());
                }
                this.v.removeClass("hidden");
            }
            else
            {
                this.o.enable().focus();

                this.path.set("html", "");
                this.v.addClass("hidden");
            }

            this.parent();
        }
    },
	
    deleteCurrentFile: function()
    {
        // we dont clone the old file input here, since the attribute "value" would be cloned, too
        // and we cannot modify the value of an file input field without user interaction
        this.o = this.createOriginal().addClass(this.o.getProperty("class")).setProperties({
            name: this.o.getProperty("name"),
            id: this.o.getProperty("id"),
            style: this.o.getProperty("style"),
            title: this.o.getProperty("title")
        }).cloneEvents(this.o).replaces(this.o);
		
        this.update();
    }
});

// add trimFilePath to Native String for convenience
String.implement({
    trimFilePath: function()
    {
        var ind = false;
        if(!(ind = this.lastIndexOf("\\")))
            if(!(ind = this.lastIndexOf("\/")))
                ind = 0;

        return this.substring(++ind);
    }
});