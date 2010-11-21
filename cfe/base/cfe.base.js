/**
 * The core of custom form elements. Includes cfe.generic and some slight addons to the native Element object. 
 *
 * @module core
 * @namespace cfe
 */

var cfe = {};
cfe.module = {};
cfe.addon = {};

cfe.version = "0.1";

/**
 * cfe.generic gets extended by modules to start off with standard, button-like behaviours.
 * @class generic
 */
cfe.generic = $.inherit(
    {

        //    Implements: [new Options, new Events],

        /**
     * Describes the type of this element (e.g. Selector, Checkbox or Radiobutton)
     * @property type
     * @type string
     */
        type: 'Generic',

        instance: 0,
    
        /**
     * basic options for all cfes and always available
     * @property options
     */
        options: {

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

            /**
         * if this cfe is created programatically, it's possible to set the name attribute of the generated input element
         * @config name
         * @type string
         */
            name: "",

            /**
         * setting this to true will create a disabled element
         * @config disabled
         * @type boolean
         */
            disabled: false

        /**
         * Fired when the mouse is moved over the "decorator" element
         * @event onMouseOver
         */
        //onMouseOver: Class.empty,

        /**
         * Fired when the mouse is moved away from the "decorator" element
         * @event onMouseOut
         */
        //onMouseOut: Class.empty,

        /**
         * Fired when the "original" element gets focus (e.g. by tabbing)
         * @event onFocus
         */
        //onFocus: Class.empty,

        /**
         * Fired when the "original" element loses focus
         * @event onBlur
         */
        //onBlur: Class.empty,

        /**
         * Fired when "decorator" is clicked by mouse
         * @event onClick
         */
        //onClick: Class.empty,

        /**
         * Fired when pressing down with the mouse button on the "decorator"
         * Fired when pressing the space key while "original" has focus
         * @event onPress
         */
        //onPress: Class.empty,

        /**
         * Fired when "decorator" was pressed and the mouse button is released
         * Fired when "original" was pressed by space key and this key is released
         * @event onRelease
         */
        //onRelease: Class.empty,

        /**
         * Fired when "original"'s value changes
         * @event onUpdate
         */
        //onUpdate: Class.empty,

        /**
         * Fired when "original" gets disabled by HTMLElement.enable()
         * @event onEnable
         */
        //onEnable: Class.empty,

        /**
         * Fired when "original" gets disabled by HTMLElement.disable()
         * @event onDisable
         */
        //onDisable: Class.empty
        },

        /**
     * constructor<br />
     * building algorithm for cfe (template method)<br />
     * <ol>
     * <li>setOptions: set Options</li>
     * <li>buildWrapper: setup the "decorator"</li>
     * <li>setupOriginal: procede the "original" element (add Events...)</li>
     * <li>addLabel: add and procede the label</li>
     * <li>initializeAdv: last chance for subclasses to do initialization</li>
     * <li>build: various specific dom handling and "decorator" building</li>
     *
     * @method initialize
     * @constructor
     *
     * @param {Object} options
     */
        __constructor: function(opt)
        {
            // sets instance id
            this.instance = this.constructor.prototype.instance++;

            // little fix for inheritance of events > anybody got an idea of solving this more neatly?
            this.$events = {};

            this.setOptions(opt);

            if(!this.options.spacer) this.options.spacer = cfe.spacer;

            // build standard wrapping element
            this.buildWrapper();

            // prepares original html element for use with cfe
            this.setupOriginal();

            // add a label, if present
            var label = this.o.getLabel();
            this.addLabel( label ? label : this.setupLabel(this.options.label) );

            // specific initialization
            this.initializeAdv();

            // each cfe must implement this function
            this.build();
        },
    
        /**
     * retreive the "decorator"
     * mootools supports the use of $(myCfe) if toElement is defined
     *
     * @method toElement
     * @return {HTMLElement}
     */
        toElement: function()
        {
            return this.a;
        },

        /**
     * retreive the label and the alias
     *
     * @method toElements
     * @return {HTMLElement[label, alias]}
     */
        toElements: function()
        {
            return [this.l, this.a];
        },

        /**
     * retreive the label
     *
     * @method getLabel
     * @return {HTMLElement}
     */
        getLabel: function()
        {
            return this.l;
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
            //this.a = new Element(this.options.aliasType);
            this.a = $("<"+this.options.aliasType+"></"+this.options.aliasType+">");

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
            //            this.a.addClass("js"+this.type).addEvents({
            //                mouseover: this.hover.bind(this),
            //                mouseout: this.unhover.bind(this),
            //                mousedown: this.press.bind(this),
            //                mouseup: this.release.bind(this),
            //                disable: this.disable.bind(this),
            //                enable: this.enable.bind(this)
            //            }).setStyle("cursor","pointer");

            this.a.addClass("js"+this.type).bind({
                mouseover: $.proxy(this.hover, this),
                mouseout: $.proxy(this.unhover, this),
                mousedown: $.proxy(this.press, this),
                mouseup: $.proxy(this.release, this),
                disable: $.proxy(this.disable, this),
                enable: $.proxy(this.enable, this)
            }).css("cursor","pointer");
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
            if( this.options.replaces )
            {
                this.o = this.options.replaces;
                //this.a.inject(this.o, 'before');

                this.a.insertBefore(this.o);
            }
            else // standalone
            {
                this.o = this.createOriginal();

                if(this.options.id) this.o.attr("id", this.options.id) //this.o.setProperty("id", this.options.id);

                if(this.options.disabled) this.o.disable()

                if(this.options.name)
                {
                    //this.o.setProperty("name", this.options.name);
                    this.o.attr("name", this.options.name);

                    if( !this.o.attr("id") ) this.o.attr("id", this.options.name+this.instance) // this.o.setProperty("id", this.options.name+this.instance);
                }

                if(this.options.value) this.o.val(this.options.value) //  this.o.setProperty("value", this.options.value);

                //this.a.adopt(this.o);
                this.a.append(this.o);
            }

            //this.a.addClass("js"+this.type+this.o.id.capitalize());
            this.a.addClass("js" + this.type + ($.string(this.o.attr("id")).capitalize().str) );

            this.o.bind({
                focus: $.proxy(this.setFocus, this),
                blur: $.proxy(this.removeFocus, this),
                change: $.proxy(this.update, this),
                keydown: $.proxy(function(e){
                    //if(e.key == "space") this.press();
                    if(e.which == 32) this.press();
                }, this),
                keyup: $.proxy(function(e){
                    if(e.which == 32) this.release();
                }, this),
                onDisable: $.proxy(function(){
                    this.a.trigger("disable");
                }, this),
                onEnable: $.proxy(function(){
                    this.a.trigger("enable");
                }, this)
            });

            // store a reference to this cfe "in" the original form element
            this.o.data("cfe", this);
        },

        /**
     * getter for retrieving the disabled state of the "original" element
     *
     * @method isDisabled
     * @return boolean
     */
        isDisabled: function()
        {
            return this.o.attr("disabled");
        },

        /**
     * programatically creates an "original" element<br />
     * each subclass has to implement this
     *
     * @method createOriginal
     * @return {HTMLElement}
     */
        createOriginal: function()
        {
            return $("<img class='spc' src='"+this.options.spacer+"' />");
        },

        /**
     * hides the original input element by pushing it out of the viewport <br />
     * (no display:none since it's important for screenreaders to parse the original element)
     *
     * @method hideOriginal
     * @protected
     */
        hideOriginal: function()
        {
            // hide original input
            this.o.css({
                position: "absolute",
                left: "-9999px",
                opacity: 0.01
            });

            // fix for internet explorer 7;
            if($.browser.msie && $.browser.version == 7){
                this.o.css({
                    width: 0,
                    height: "1px"
                });
            }
        },

        /*
     * creates a label element and fills it with the contents (may be html) given by option "label"
     *
     * @method setupLabel
     * @protected
     *
     * @return {HTMLElement or NULL} if option "label" is not set
     */
        setupLabel: function()
        {
            if( this.options.label ) return $("<label for='"+this.o.attr("id")+"'>"+this.options.label+"</label>");

            return null;
        },

        /*
     * adds a label element to this cfe
     *
     * @method addLabel
     * @protected
     *
     * @param {HTMLElement} the label element to set as label for this cfe
     */
        addLabel: function(label)
        {
            if( !label || label.length == 0 ) return;

            this.l = label;

            // remove for property
            if(!this.dontRemoveForFromLabel) this.l.removeAttr("for");

            // add adequate className, add stdEvents
            this.l.addClass("js"+this.type+"L");

            if(this.o.attr("id") || this.o.attr("name") ) this.l.addClass("for_"+ (this.o.attr("id") || (this.o.attr("name")+this.o.val()).replace("]","-").replace("[","") ));

            // add stdevents
            this.l.bind({
                mouseover: $.proxy(this.hover, this),
                mouseout: $.proxy(this.unhover, this),
                mousedown: $.proxy(this.press, this),
                mouseup: $.proxy(this.release, this)
            });

            if( !this.o.data("implicitLabel") || (this.o.data("implicitLabel") && !$.browser.mozilla) ) this.l.bind("click", $.proxy(this.clicked, this));

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

        /**
     * part of the main template method for building the "decorator"<br />
     * gets called immediately before the build-method<br />
     * may be extended by subclasses
     *
     * @method initializeAdv
     * @protected
     */
        initializeAdv: function()
        {
            if(!this.o.data("implicitLabel") && !this.dontRemoveForFromLabel) this.a.bind("click", $.proxy(this.clicked, this));

            if(this.isDisabled()) this.a.trigger("disable");
        },

        /**
     * part of the main template method for building the "decorator"<br />
     * must be extended by subclasses
     *
     * @method build
     * @protected
     */
        build: function(){},


        /**
     * wrapper method for event onPress<br />
     * may be extended by subclasses
     *
     * @method press
     * @protected
     */
        press: function()
        {
            if( !this.isDisabled() )
            {
                this.a.addClass("P");
                this.fireEvent("onPress");
            }
        },

        /**
     * wrapper method for event onRelease<br />
     * may be extended by subclasses
     *
     * @method release
     * @protected
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
     * wrapper method for event onMouseOver<br />
     * may be extended by subclasses
     *
     * @method onMouseOver
     * @protected
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
     * wrapper method for event onMouseOut<br />
     * may be extended by subclasses
     *
     * @method unhover
     * @protected
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
     * wrapper method for event onFocus<br />
     * may be extended by subclasses
     *
     * @method setFocus
     * @protected
     */
        setFocus: function()
        {
            this.a.addClass("F");
            this.fireEvent("onFocus");
        },

        /**
     * wrapper method for event onBlur<br />
     * may be extended by subclasses
     *
     * @method removeFocus
     * @protected
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
     * wrapper method for event onClick<br />
     * delegates the click to the "original" element<br />
     * may be extended by subclasses
     *
     * @method clicked
     * @protected
     */
        clicked: function()
        {
            if(!this.isDisabled())
            {
                if( $.isFunction(this.o.click) ){
                    this.o.click();
                    this.o.trigger("change");
                }

                this.o.focus();

                this.fireEvent("onClick");
            }
        },

    /**
     * wrapper method for event onUpdate<br />
     * may be extended by subclasses
     *
     * @method update
     * @protected
     */
        update: function()
        {
            this.fireEvent("onUpdate");
        },

        /**
     * wrapper method for event onEnable<br />
     * may be extended by subclasses
     *
     * @method enable
     * @protected
     */
        enable: function()
        {
            this.a.removeClass("D");
            this.fireEvent("onEnable");
        },

        /**
     * wrapper method for event onDisable<br />
     * may be extended by subclasses
     *
     * @method disable
     * @protected
     */
        disable: function()
        {
            this.a.addClass("D");
            this.fireEvent("onDisable");
        },

        /* support for setOptions */
        setOptions: function(opt){
            $.extend(this.options, opt);

            // add events which were set as options
            // taken from mootools 1.2: Options
            for (var option in this.options){
                if ( !$.isFunction( this.options[option] ) || !(/^on[A-Z]/).test(option) ) continue;
                this.addEvent(option, this.options[option]);
                delete this.options[option];
            }
        }
    });

$.extend(cfe.generic.prototype, Events);

/**
 * extend Elements with some Helper functions
 * @class Helpers
 * @namespace Element
 */
/**
 * cross-browser method for disabling the text selection by setting css attributes
 *
 * @method disableTextSelection
 */
$.fn.disableTextSelection = function(){
    if( $.browser.msie || $.browser.opera){
        return $(this).attr("unselectable","on");
    }
    else if($.browser.mozilla){
        return $(this).css("MozUserSelect","none");
    }
    else if($.browser.webkit){
        return $(this).css("KhtmlUserSelect","none");
    }

    return $(this)
}

/**
 * disables a HTMLElement if its a form element by setting the disabled attribute to true
 *
 * @method disable
 * @return element itself
 */
$.fn.disable = function()
{
    var el = $(this);
    
    if( el.is("button", "input", "option", "optgroup", "select", "textarea") )
    {
        return el.attr("disabled", true).trigger("onDisable");
    }

    return el;
}

/**
 * enables a HTMLElement if its a form element by setting the disabled attribute to false
 *
 * @method enable
 * @return {boolean} true, if element could be enabled
 */
$.fn.enable = function()
{
    var el = $(this);
    
    if( el.is("button", "input", "option", "optgroup", "select", "textarea") )
    {
        return el.removeAttr("disabled").trigger("onEnable");
    }

    return el;
}

/**
 * enables or disabled a HTMLElement if its a form element depending on it's current state
 *
 * @method toggleDisabled
 * @return {boolean} true, if element could be toggled
 */
$.fn.toggleDisabled = function()
{
    var el = $(this);

    if( el.is("button", "input", "option", "optgroup", "select", "textarea") )
    {
        return el.attr("disabled", !el.attr("disabled") ).trigger(el.attr("disabled")?"onDisable":"onEnable");
    }

    return el;
}

/**
 * returns the label-element which belongs to this element
 *
 * @method getLabel
 * @return HTMLElement or NULL
 */
$.fn.getLabel = function()
{
    var label = null;
    var el = $(this);

    // get label by id/for-combo
    if( el.attr("id") ) label = $("label[for="+el.attr("id")+"]");

    // no label was found for id/for, let's see if it's implicitly labelled
    if( !label || label.length == 0)
    {
        label = el.parent('label');

        if( label && label.length > 0 ){
            el.data("implicitLabel", true);
        }else{
            label = null;
        }
    }

    //console.log("fetched label ", label, " for ", el);
    return label;
}

/**
 * generates the markup used by sliding doors css technique to use with this element
 *
 * @method setSlidingDoors
 *
 * @param count
 * @param type
 * @param prefix
 *
 * @return HTMLElement or NULL the wrapped HTMLElement
 */
$.fn.setSlidingDoors = function(count, type, prefix)
{
    var slide = null;
    var wrapped = $(this);
    prefix = prefix || "sd";

    for(var i = count; i > 0; i--)
    {
        slide = $("<"+type+"/>").addClass(i==count?prefix:i==0?prefix+"Slide":prefix+"Slide"+i);

        slide.append(wrapped);
        wrapped = slide;
    }

    wrapped = null;

    return slide;
}