/**
 * @module Button
 */

/**
 *  gets extended by modules to start off with standard, button-like behaviours.
 *
 *  when focused and pressed, form gets submitted
 *
 * @class Button
 * @namespace cfe.module
 *
 */
cfe.module.Button = new Class(
{
  Implements: [new Options, new Events],

  selector: "button",

  instance: 0,

  /**
   * basic options for all cfes and always available
   * @property options
   */
  options: {
    /**
     * if > 0, it will create markup for css sliding doors tech<br />
     * the number defines the amount of wrappers to create around this element<br />
     * 2: standard sliding doors (x- or y-Axis)<br />
     * 4: sliding doors in all directions (x/y-Axis)
     *
     * @config slidingDoors
     * @type int
     * @default 4
     */
    slidingDoors: 2,

    /**
     * if this element shall replace an existing html form element, pass it here
     * @config replaces
     * @type HTMLElement
     */
    replaces: null,

    /**
     * determines if a click on the decorator should be delegated to the original element
     * @config delegateClick
     * @type Boolean
     */
    delegateClick: true,

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
    disabled: false,

    buttonStyle: true

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
  //onDisable: Class.empty,

    /**
     * Fired when decorator is completely loaded and is ready to use
     * @event onLoad
     */
  //onLoad: Class.empty


  },

  hideOriginalElement: true,

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
   **/
  initialize: function(opt)
  {
    // sets instance id
    this.instance = this.constructor.prototype.instance++;

    this.setOptions(opt);

    this.type = $pick(this.options.type, $H(cfe.module).keyOf(this.constructor));

    this.buildWrapper();

    // prepares original html element for use with cfe and injects decorator into dom
    this.setupOriginal();

    // add a label, if present
    this.addLabel( $pick(this.o.getLabel(), this.setupLabel(this.options.label) ) );

    this.build();

    // add events to wrapping element
    this.setupWrapperEvents();

    // specific initialization
    this.afterInitialize();

    this.fireEvent("load")
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
   * template method STEP 1
 */
  buildWrapper: function(){
    this.a = new Element("span");
  },

  /**
     * handles the creation of the underlying original form element <br />
     * stores a reference to the cfe object in the original form element
        * template method STEP 2
        *
     * @method setupOriginal
     * @protected
     */
  setupOriginal: function()
  {
    // get original element
    if( $defined(this.options.replaces) )
    {
      this.o = this.options.replaces;
      this.a.inject(this.o, 'before');
    }
    else // standalone
    {
      this.o = this.createOriginal();

      if(this.options.id) this.o.setProperty("id", this.options.id);

      if(this.options.disabled) this.o.disable();

      if(this.options.name)
      {
        this.o.setProperty("name", this.options.name);

        if( !$chk(this.o.id) ) this.o.setProperty("id", this.options.name+this.instance);
      }

      if(this.options.value) this.o.setProperty("value", this.options.value);

      this.a.adopt(this.o);
    }

    this.o.addEvents({
      focus: this.setFocus.bind(this),
      blur: this.removeFocus.bind(this),
      change: this.update.bind(this),
      keydown: function(e){
        if(e.key == "space") this.press();
      }.bind(this),
      keyup: function(e){
        if(e.key == "space") this.release();
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

  /*
   * adds a label element to this cfe
   * template method STEP 3
   *
   * @method addLabel
   * @protected
   *
   * @param {HTMLElement} the label element to set as label for this cfe
   */
  addLabel: function(label)
  {
    if( !$defined(label) ) return;

    this.l = label;

    // remove for property
    if(!this.dontRemoveForFromLabel) this.l.removeProperty("for");

    // add adequate className, add stdEvents
    this.l.addClass(cfe.prefix+this.type+"L");

    if(this.o.id || this.o.name) this.l.addClass("for_"+ (this.o.id || (this.o.name+this.o.value).replace("]","-").replace("[","") ));

    // add stdevents
    this.l.addEvents({
      mouseover: this.hover.bind(this),
      mouseout: this.unhover.bind(this),
      mousedown: this.press.bind(this),
      mouseup: this.release.bind(this),
      click: this.clicked.bindWithEvent(this)
    });

    this.addEvents({
      press: function()
      {
        this.l.addClass("P");
      },
      release: function()
      {
        this.l.removeClass("P");
      },
      mouseOver: function()
      {
        this.l.addClass("H");
      },
      mouseOut: function()
      {
        this.l.removeClass("H");
        this.l.removeClass("P");
      },
      focus: function()
      {
        this.l.addClass("F");
      },
      blur: function()
      {
        this.l.removeClass("F");
      //this.l.removeClass("P");
      },
      enable: function()
      {
        this.l.removeClass("D");
      },
      disable: function()
      {
        this.l.addClass("D");
      }
    });
  },

  /**
     * part of the main template method for building the "decorator"<br />
     * must be extended by subclasses
     *
     * template method STEP 4
     *
     * @method build
     * @protected
     */
  build: function(){

    this.innerlabel = this.setupInnerLabel();
    this.a.adopt(this.innerlabel);

    if( $chk(this.options.slidingDoors) )
    {
      this.a = this.a.setSlidingDoors(this.options.slidingDoors-1, "span", cfe.prefix).addClass(cfe.prefix+this.type);
    }
  },


  /**
   * adds events and mousepointer style to the "decorator"
   * usually gets called by buildWrapper
   *
   * template method STEP 5
   *
   * @method setupWrapperEvents
   * @protected
   */
  setupWrapperEvents: function()
  {
    if(!this.o.implicitLabel)
    {
      this.a.addEvents({
        mouseover: this.hover.bind(this),
        mouseout: this.unhover.bind(this),
        mousedown: this.press.bind(this),
        mouseup: this.release.bind(this)
      });
    }

    this.a.addEvents({
      disable: this.disable.bind(this),
      enable: this.enable.bind(this)
    })
    
  },

  /**
     * part of the main template method for building the "decorator"<br />
     * gets called immediately before the build-method<br />
     * may be extended by subclasses
     *
     * template method STEP 6
     *
     * @method initializeAdv
     * @protected
     */
  afterInitialize: function()
  {
    if(this.hideOriginalElement) this.o.hideInPlace();

    if(this.o.id) this.a.addClass(cfe.prefix+this.type+this.o.id.capitalize());

    // various additions
    if(!this.o.implicitLabel) this.a.addEvent("click", this.clicked.bindWithEvent(this));

    if(this.isDisabled()) this.a.fireEvent("disable");

    if(!this.options.slidingDoors) this.a.addClass(cfe.prefix+this.type)

    if(this.options.buttonStyle) this.a.addClass(cfe.prefix+"Button")
  },

  setupInnerLabel: function(){
    return new Element("span").addClass("label").disableTextSelection();
  },


  /**
     * getter for retrieving the disabled state of the "original" element
     *
     * @method isDisabled
     * @return boolean
     */
  isDisabled: function()
  {
    return this.o.getProperty("disabled")
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
    return new Element("button")
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
    if( $defined(this.options.label) ) return new Element("label").set("html", this.options.label).setProperty("for", this.o.id);

    return null;
  },

  /**
     * wrapper method for event onPress<br />
     * may be extended by subclasses
     *
     * @method press
     * @protected
     */
  press: function()
  {
    if(this.isDisabled()) return

    this.a.addClass("P");
    this.fireEvent("onPress");

    console.log(this.type + "pressed");
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
    if(this.isDisabled()) return

    this.a.removeClass("P");
    this.fireEvent("onRelease");
    
    console.log(this.type + "released");

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
    if(this.isDisabled()) return

    this.a.addClass("H");
    this.fireEvent("onMouseOver");

  //console.log(this.type + "hovered");
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
    if(this.isDisabled()) return

    this.a.removeClass("H");
    this.fireEvent("onMouseOut");
    this.release();

  //console.log(this.type + "unhovered");
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

  //console.log(this.type + "focused");
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

  //console.log(this.type + "blurred");

  },

  /**
     * wrapper method for event onClick<br />
     * delegates the click to the "original" element<br />
     * may be extended by subclasses
     *
     * @method clicked
     * @protected
     */
  clicked: function(e)
  {
    if(this.isDisabled()) return

    if( $chk(this.o.click) && $chk(this.options.delegateClick) ) this.o.click();
    this.o.focus();

    this.fireEvent("onClick");

    //console.log(this.type + " clicked");
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

    //console.log("o was updated");
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

    //console.log(this.type+"-"+this.instance+" now enabled");
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

    //console.log(this.type+"-"+this.instance+" now disabled");
  }
});