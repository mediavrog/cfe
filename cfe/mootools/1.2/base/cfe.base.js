/*
customFormElements for mootools 1.2 - style form elements on your own
by Maik Vlcek (http://www.mediavrog.net)

Copyright (c) Maik Vlcek (mediavrog.net)

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

var cfe = {};
cfe.module = {};
cfe.addon = {};

cfe.version = "0.9";
cfe.spacer = "spacer.gif";

// basic generic module; may be extended by modules to start off with standard, button-like behaviours
cfe.generic = new Class(
{
    // type of cfe; derived elements may be Selector, Checkbox or Radiobutton
    type : "Generic",

    // basic options for all cfes and always available
    options: {
        instanceID:0,           // set automatically
        spacer: "",             // path to transparent spacer.gif; it's used for easy css-styling
        aliasType: "span",      // the element's wrapper will be of this type
        replaces: null,         // if this element shall replace an existing html form element, put it here
        label: null,            // may pass any element as a label (toggling, hovering,..) for this cfe
        name: "",

        onMouseOver: Class.empty,   // event placeholders; may be used for custom events
        onMouseOut: Class.empty,
        onFocus: Class.empty,
        onBlur: Class.empty,
        onClick: Class.empty,
        onPress: Class.empty,
        onRelease: Class.empty,
        onUpdate: Class.empty
    },

    /**
	 * initialization of cfe
	 * set options, defines basic algorithm as template method
	 *
	 * @param {Object} original
	 * @param {Object} opt
	 */
    initialize: function(opt)
    {
        this.setOptions(this.options, opt);
        
        if(!this.options.spacer) this.options.spacer = cfe.spacer;

        // build standard wrapping element
        this.buildWrapper.bind(this)();

        // prepares original html element for use with cfe
        this.setupOriginal();

        // add a label, if present
        this.addLabel( $pick(this.o.getLabel(), this.setupLabel(this.options.label) ) );

        // specific initialization
        this.initializeAdv();

        // each cfe must implement this function
        this.build();

    },

    /*
     * some getter methods to retreive the "decorator" elements
     */
    getAlias: function()
    {
        return this.a;
    },

    getLabel: function()
    {
        return this.l;
    },

    getFull: function()
    {
        return [this.l, this.a];
    },

    /*
     * methods related to creation of the alias
     */
    buildWrapper: function()
    {
        // create standard span as replacement
        this.a = new Element(this.options.aliasType);

        this.setupWrapper();
    },

    setupWrapper: function()
    {
        this.a.addClass("js"+this.type).addEvents({
            mouseover: this.hover.bind(this),
            mouseout: this.unhover.bind(this),
            mousedown: this.press.bind(this),
            mouseup: this.release.bind(this)
        }).setStyle("cursor","pointer");
    },

    /*
     * methods related to creation/handling of the original form element
     */
    setupOriginal: function()
    {
        // get original element
        if($defined(this.options.replaces))
        {
            this.o = this.options.replaces;

            // if this shall replace a form element, add id as class
            this.a.addClass("js"+this.o.id).inject(this.o, 'before');
        }
        else // standalone
        {
            this.o = this.createOriginal();

            if(this.options.id) this.o.setProperty("id", this.options.id);

            if(this.options.name)
            {
                this.o.setProperty("name", this.options.name);
                
                if( !$chk(this.o.id)) this.o.setProperty("id", this.options.name+this.options.instanceID);
            }
            
            if(this.options.value) this.o.setProperty("value", this.options.value);

            this.a.adopt(this.o);
        }

        // little hack since mootools doesn't support selectors like input[name="fieldName[foo]"]
        if( $chk(this.o.name) ) this.o.setProperty("clearname", this.o.name.replace("]", "b-.-d").replace("[", "d-.-b") );

        this.o.addEvents({
            focus: this.setFocus.bind(this),
            blur: this.removeFocus.bind(this),
            change: this.update.bind(this),
            keydown: function(e){
                if(new Event(e).key == "space") this.press();
            }.bind(this),
            keyup: function(e){
                if(new Event(e).key == "space") this.release();
            }.bind(this)
        });

        // store a reference to this cfe "in" the original form element
        this.o.store("cfe", this);
    },

    createOriginal: function()
    {
        return new Element("img", {
            "src": this.options.spacer,
            "class": "spc"
        });
    },

    /**
	 * hides the original input element
	 */
    hideOriginal: function()
    {
        // hide original input
        this.o.setStyles({
            position: "absolute",
            left: "-999px"
        });

        // fix for internet explorer 7;
        if(Browser.Engine.trident && !Browser.Features.query){
            this.o.setStyles({
                width: 0,
                height: "1px"
            });
        }
    },

    /*
     * methods related to creation/handling of the corresponding label
     */
    setupLabel: function()
    {
        if( $defined(this.options.label) ) return new Element("label").set("html", this.options.label).setProperty("for", this.o.id);
        
        return null;
    },

    addLabel: function(label)
    {
        if( !$defined(label) ) return;

        this.l = label;

        // remove for property
        if(!this.dontRemoveForFromLabel) this.l.removeProperty("for");

        // add adequate className, add stdEvents
        this.l.addClass("js"+this.type+"L");

        if(this.o.id || this.o.name) this.l.addClass("for_"+ (this.o.id || (this.o.name+this.o.value).replace("]","-").replace("[","") ));

        // add stdevents
        this.l.addEvents({
            "mouseover": this.hover.bind(this),
            "mouseout": this.unhover.bind(this),
            "mousedown": this.press.bind(this),
            "mouseup": this.release.bind(this)
        });

        if(!this.o.implicitLabel || (this.o.implicitLabel && !Browser.Engine.gecko)) this.l.addEvent("click", this.clicked.bindWithEvent(this));

        this.addEvents({
            "press": function()
            {
                this.l.addClass("P");
            },
            "release": function()
            {
                this.l.removeClass("P");
            },
            "mouseOver": function()
            {
                this.l.addClass("H");
            },
            "mouseOut": function()
            {
                this.l.removeClass("H");
                this.l.removeClass("P");
            },
            "focus": function()
            {
                this.l.addClass("F");
            },
            "blur": function()
            {
                this.l.removeClass("F");
                //this.l.removeClass("P");
            }
        });
    },

    // may be extended by cfe
    initializeAdv: function()
    {
        if(!this.o.implicitLabel) this.a.addEvent("click", this.clicked.bindWithEvent(this));
    },
    
    // must be implemented by cfe
    build: function(){},
    
    /**
	 * behaviour
	 */
    
    /**
	 * standard press-behaviour
	 * add press state to alias
	 */
    press: function()
    {
        this.a.addClass("P");
        this.fireEvent("onPress");
    },

    /**
	 * standard press-behaviour
	 * removes press state to alias
	 */
    release: function()
    {
        this.a.removeClass("P");
        this.fireEvent("onRelease");
    },

    /**
	 * standard mouseover-behaviour
	 * add hover state to alias
	 */
    hover: function()
    {
        this.a.addClass("H");
        this.fireEvent("onMouseOver");
    },

    /**
	 * standard mouseout-behaviour
	 * removes hover state from alias
	 */
    unhover: function()
    {
        this.a.removeClass("H");

        this.fireEvent("onMouseOut");

        this.release();
    },

    /**
	 * standard focus-behaviour
	 * adds focus state to alias
	 */
    setFocus: function()
    {
        this.a.addClass("F");
        this.fireEvent("onFocus");
    },

    /**
	 * standard blur-behaviour
	 * removes focus state from alias
	 */
    removeFocus: function()
    {
        //console.log("o blurred");
        this.a.removeClass("F");
        // if cfe gets blurred, also clear press state
        //this.a.removeClass("P");
        this.fireEvent("onBlur");
    },

    /*
     * delegate click events to original item
     */
    clicked: function()
    {
        if( $chk(this.o.click) ) this.o.click();
        this.o.focus();

        this.fireEvent("onClick");
    },

    update: function()
    {
        this.fireEvent("onUpdate");
    }
});
cfe.generic.implement(new Options,new Events);

// extend Elements with some Helper functions
Element.Helpers = new Class({

    disableTextSelection: function(){
        if(Browser.Engine.trident || Browser.Engine.presto){
            this.setProperty("unselectable","on");
        }
        else if(Browser.Engine.gecko){
            this.setStyle("MozUserSelect","none");
        }
        else if(Browser.Engine.webkit){
            this.setStyle("KhtmlUserSelect","none");
        }
    },

    getLabel: function()
    {
        var label = null;

        // get label by id/for-combo
        if(this.id) label = $$("label[for="+this.id+"]")[0];
        
        // no label was found for id/for, let's see if it's implicitly labelled
        if(!label)
        {
            label = this.getParents('label')[0];

            if(label) this.implicitLabel = true;
        }

        return label;
    },

    setSlidingDoors: function(dir, type, prefix)
    {
        var slide = null;
        var wrapped = this;
        prefix = $pick(prefix, "sd");

        for(i = dir; i > 0; i--)
        {
            slide = new Element(type);
            slide.addClass(i==dir?prefix:i==0?prefix+"Slide":prefix+"Slide"+i);

            slide.grab(wrapped);
            wrapped = slide;
        }

        wrapped = null;

        return slide;
    }
});
Element.implement(new Element.Helpers);