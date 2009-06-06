/**
 * The core of custom form elements. Includes cfe.generic and some slight addons to the native Element object. 
 *
 * @module core
 * @namespace cfe
 */

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

cfe.version = "0.9.2";
cfe.spacer = "spacer.gif";

/**
 * cfe.generic gets extended by modules to start off with standard, button-like behaviours.
 * @class generic
 */
cfe.generic = new Class(
{
    /**
     * Describes the type of this element (e.g. Selector, Checkbox or Radiobutton)
     * @property type
     * @type string
     */
    type : "Generic",

    /**
     * basic options for all cfes and always available
     * @property options
     */
    options: {
        instanceID:0,           // set automatically
        
        /**
         * path to transparent spacer.gif; it's used for easy css-styling
         * @config spacer
         * @type string
         */
        spacer: "",

        /**
         * the element's wrapper will be of this type (e.g. span or div)
         * @config aliasType
         * @type string
         */
        aliasType: "span",

        /**
         * if this element shall replace an existing html form element, pass it here
         * @config replaces
         * @type HTMLElement
         */
        replaces: null,

        /**
         * may pass any element as a label (toggling, hovering,..) for this cfe
         * @config label
         * @type HTMLElement
         */
        label: null,

        name: "",

        /**
         * setting this to true will create a disabled element
         * @config disabled
         * @type boolean
         */
        disabled: false,

        // event placeholders; may be used to add custom events
        onMouseOver: Class.empty,   
        onMouseOut: Class.empty,
        onFocus: Class.empty,
        onBlur: Class.empty,
        onClick: Class.empty,
        onPress: Class.empty,
        onRelease: Class.empty,
        onUpdate: Class.empty
    },

    /**
	 * constructor
	 * set options, defines basic replacement and building algorithm for cfe (template method)
	 *
     * @method initialize
     * @constructor
     *
     * @param {Object} options
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

    /**
     * retreive the "decorator"
     * 
     * @method getAlias
     * @return HTMLElement
     */
    getAlias: function()
    {
        return this.a;
    },

    /**
     * retreive the label
     *
     * @method getLabel
     * @return HTMLElement
     */
    getLabel: function()
    {
        return this.l;
    },

    /**
     * retreive the label and the alias
     *
     * @method getFull
     * @return HTMLElement[label, alias]
     */
    getFull: function()
    {
        return [this.l, this.a];
    },

    /**
     * builds the "decorator"
     *
     * @method buildWrapper
     * @protected
     */
    buildWrapper: function()
    {
        // create standard span as replacement
        this.a = new Element(this.options.aliasType);

        this.setupWrapper();
    },

    /**
     * adds events and mousepointer style to the "decorator"
     * usually gets called by buildWrapper
     *
     * @method setupWrapper
     * @protected
     */
    setupWrapper: function()
    {
        this.a.addClass("js"+this.type).addEvents({
            mouseover: this.hover.bind(this),
            mouseout: this.unhover.bind(this),
            mousedown: this.press.bind(this),
            mouseup: this.release.bind(this),
            disable: this.disable.bind(this),
            enable: this.enable.bind(this)
        }).setStyle("cursor","pointer");
    },

    /**
     * handles the creation of the underlying original form element <br />
     * stores a reference to the cfe object in the original form element
     *
     * @method setupOriginal
     * @protected
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
                
            if(this.options.disabled) this.o.disable();

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
            }.bind(this),
            onDisable: function(){ 
                this.a.fireEvent("disable");
            }.bind(this),
            onEnable: function(){  
                this.a.fireEvent("enable");
            }.bind(this)
        });

        // store a reference to this cfe "in" the original form element
        this.o.store("cfe", this);
    },

    isDisabled: function()
    {
        return this.o.getProperty("disabled");
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
            mouseover: this.hover.bind(this),
            mouseout: this.unhover.bind(this),
            mousedown: this.press.bind(this),
            mouseup: this.release.bind(this)
        });

        if(!this.o.implicitLabel || (this.o.implicitLabel && !Browser.Engine.gecko)) this.l.addEvent("click", this.clicked.bindWithEvent(this));

        this.addEvents({
            "onPress": function()
            {
                this.l.addClass("P");
            },
            "onRelease": function()
            {
                this.l.removeClass("P");
            },
            "onMouseOver": function()
            {
                this.l.addClass("H");
            },
            "onMouseOut": function()
            {
                this.l.removeClass("H");
                this.l.removeClass("P");
            },
            "onFocus": function()
            {
                this.l.addClass("F");
            },
            "onBlur": function()
            {
                this.l.removeClass("F");
            //this.l.removeClass("P");
            },
            "onEnable": function()
            {
                this.l.removeClass("D");
            },
            "onDisable": function()
            {
                this.l.addClass("D");
            }
        });        
    },

    // may be extended by cfe
    initializeAdv: function()
    {
        if(!this.o.implicitLabel) this.a.addEvent("click", this.clicked.bindWithEvent(this));

        if(this.isDisabled()) this.a.fireEvent("disable");
    },
    
    // must be implemented by cfe
    build: function(){},
    
    
    /**
	 * standard press-behaviour
	 * add press state to alias
     * @event press
	 */
    press: function()
    {
        if(!this.isDisabled())
        {
            this.a.addClass("P");
            this.fireEvent("onPress");
        }
    },

    /**
	 * standard press-behaviour
	 * removes press state to alias
     * @event release
	 */
    release: function()
    {
        if(!this.isDisabled())
        {
            this.a.removeClass("P");
            this.fireEvent("onRelease");
        }
    },

    /**
     * standard mouseover-behaviour
     * add hover state to alias
     * @event hover
     */
    hover: function()
    {
        if(!this.isDisabled())
        {
            this.a.addClass("H");
            this.fireEvent("onMouseOver");
        }
    },

    /**
     * standard mouseout-behaviour
     * removes hover state from alias
     * @event unhover
     */
    unhover: function()
    {
        if(!this.isDisabled())
        {
            this.a.removeClass("H");
            this.fireEvent("onMouseOut");
            this.release();
        }
    },

    /**
     * standard focus-behaviour
     * adds focus state to alias
     * @event onFocus
     */
    setFocus: function()
    {
        this.a.addClass("F");
        this.fireEvent("onFocus");
    },

    /**
     * standard blur-behaviour
     * removes focus state from alias
     * @event onBlur
     */
    removeFocus: function()
    {
        //console.log("o blurred");
        this.a.removeClass("F");
        // if cfe gets blurred, also clear press state
        //this.a.removeClass("P");
        this.fireEvent("onBlur");

    },

    /**
     * delegate click events to original item
     * @event onClick
     */
    clicked: function()
    {
        if(!this.isDisabled())
        {
            if( $chk(this.o.click) ) this.o.click();
            this.o.focus();

            this.fireEvent("onClick");
        }
    },

    /**
     * fires if the original element changes
     * @event onUpdate
     */
    update: function()
    {
        this.fireEvent("onUpdate");
    },

    /**
     * if element get enabled
     * @event onEnable
     */
    enable: function()
    {
        this.a.removeClass("D");
        this.fireEvent("onEnable");
    },

    /**
     * if element get disabled
     * @event onDisable
     */
    disable: function()
    {
        this.a.addClass("D");
        this.fireEvent("onDisable");
    }
});
cfe.generic.implement(new Options,new Events);

/**
 * extend Elements with some Helper functions
 * @class Helpers
 * @namespace Element
 */
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

    disable: function()
    {
        if($type(this) === "element" && ["button", "input", "option", "optgroup", "select", "textarea"].contains( this.get("tag") )            )
        {
            this.setProperty("disabled", true);
            this.fireEvent("onDisable");
            return true;
        }

        return false;
    },

    enable: function()
    {
        if($type(this) === "element" && ["button", "input", "option", "optgroup", "select", "textarea"].contains( this.get("tag") )            )
        {
            this.setProperty("disabled", false);
            this.fireEvent("onEnable");
            return true;
        }

        return false;
    },

    toggleDisabled: function()
    {
        if($type(this) === "element" && ["button", "input", "option", "optgroup", "select", "textarea"].contains( this.get("tag") )            )
        {
            this.setProperty("disabled", !this.getProperty("disabled") );
            this.fireEvent(this.getProperty("disabled")?"onDisable":"onEnable");
            console.log(this.getProperty("disabled"));
            return true;
        }
        return false;
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