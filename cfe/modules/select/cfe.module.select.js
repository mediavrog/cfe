cfe.helper = cfe.helper || {}

/**
 * SCROLLING functionality for select boxes;
 * TODO: refactor to standalone module
 * 
 * creates handles and sets up a slider object
 */
cfe.helper.Scrollable = {

  options: {
    size: 4,
    scrolling: true
  },
  
  setupScrolling: function()
  {
    // slider config
    this.scrollerWrapper = new Element("span",{
      "class": cfe.prefix+"ScrollerWrapper",
      "styles":{
        height: this.container.getHeight()
      }
    }).inject(this.container, "after");

    var scrollTimer, scrollTimeout;
    var scrollStepHeight = this.allOptions[0].getHeight();

    function scroll(by){
      clearInterval(scrollTimer);
      clearTimeout(scrollTimeout);

      slider.set(slider.step+by);

      scrollTimeout = (function(){
        scrollTimer = (function(){
          slider.set(slider.step+by);
        }.bind(this)).periodical(50)
      }.bind(this)).delay(200)
    }

    function clearScroll(){
      clearInterval(scrollTimer);
      clearTimeout(scrollTimeout);
    }

    this.scrollerTop = $(new cfe.module.Button({
      delegateClick: false
    }).addEvent("release", clearScroll).addEvent("press", scroll.pass(-1))).addClass("scrollTop");

    this.scrollerBottom = $(new cfe.module.Button({
      delegateClick: false
    }).addEvent("release", clearScroll).addEvent("press", scroll.pass(1))).addClass("scrollBottom")

    this.scrollerKnob = new Element("span").addClass("scrollKnob");
    this.scrollerBack = new Element("span").addClass("scrollRail");

    this.scrollerBack.adopt(this.scrollerKnob);
    this.scrollerWrapper.adopt(this.scrollerBack, this.scrollerTop, this.scrollerBottom);

    var slider = new Slider(this.scrollerBack, this.scrollerKnob, {
      steps: this.allOptions.length-this.options.size,
      mode: "vertical" ,
      onChange: function(step){
        this.container.scrollTo(false,step*scrollStepHeight);
      }.bind(this)
    }).set(this.selectedIndex);

    this.scrollerKnob.setStyle("position", "absolute");

    // scrolling
    function wheelListener(ev)
    {
      ev.stop();
      slider.set(slider.step-ev.wheel);
    }

    this.boundWheelListener = wheelListener.bindWithEvent(this)

    this.addEvent("containerShow", function(){
      $(document.body).addEvent("mousewheel", this.boundWheelListener)

      slider.set(this.o.selectedIndex);
      this.container.scrollTo(false,this.o.selectedIndex*scrollStepHeight);
    })

    this.addEvent("containerHide", function(){
      $(document.body).removeEvent("mousewheel", this.boundWheelListener);
    })

    this.o.addEvent("change", function(){
      slider.set(this.o.selectedIndex)
    }.bind(this))
  }
}

/**
 * @module Selectable
 */

/**
 * replaces select fields
 *
 * <p>Box wont show on click on alias</p>
 * <p>scolling bugs</p>
 * <p>highlighting > scoll to bottom bug</p>
 * <p>disabled should also disable scrolling</p>
 * 
 * <h6>Tested in:</h6>
 * <ul>
 * <li>Safari 4.</li>
 * <li>Firefox 3.6.</li>
 * <li>Google Chrome 6.</li>
 * <li>Opera 10.62 - key autocompletion closes box.</li>
 * <li>IE 7 - no function</li>
 * <li>IE 8.</li>
 *  </ul>
 *
 * @class Select
 * @namespace cfe.module
 *
 * @extends cfe.module.Button
 *
 */
cfe.module.Select = new Class({
	
  Extends: cfe.module.Button,
  Implements: cfe.helper.Scrollable,
  
  Binds: "clickedOutsideListener",

  instance: 0,

  /**
   * CSS Selector to fetch "original" HTMLElements for replacement with this module
   * @property selector
   * @type string
   */
  selector: "select:not(select[multiple])",
	
  selectedIndex: 0,

  setupOriginal: function()
  {
    this.parent();
        
    this.o.addEvents({
      "keyup": this.keyup.bind(this),
      "keydown": this.keydown.bind(this)
    });
  },

  afterInitialize: function()
  {

    this.parent();

    // set width to widest option if no width is given to select via css
    if(this.cssWidth == "auto") this.a.setStyle("width", this.container.getWidth())

    // select default option
    this.selectOption(this.selectedIndex, true);

    if(this.options.scrolling)
    {
      this.container.setStyle("height", this.allOptions[0].getHeight()*this.options.size);
      this.setupScrolling();
    }

    this.hideContainer();
  },

  /**
   * Method to programmatically create an "original" HTMLElement
   *
   * @method createOriginal
   * @return {HTMLElement} a select input
   */
  createOriginal: function()
  {
    var ori = new Element("select");

    if( $chk(this.options.options) )
    {
      for(var key in this.options.options)
      {
        ori.adopt( new Element("option", {
          value: key,
          selected: this.options.options[key].selected?"selected":""
        }).set("html", this.options.options[key].label ) );
      }
    }
    return ori;
  },

  build: function()
  {
    this.origOptions = this.o.getChildren();

    this.selectedIndex = this.o.selectedIndex || this.selectedIndex;

    // integrity check
    if(this.options.size > this.origOptions.length || this.options.scrolling != true) this.options.size = this.origOptions.length;
        
    this.parent();

    this.a.setStyle("position", "relative");

    // build container which shows on click
    this.buildContainer();

    this.cssWidth = this.a.getStyle("width");
  },

  buildContainer: function()
  {
    this.container = new Element("span",{
      "class": cfe.prefix+this.type+"Container",
      "styles":{
        "overflow":"hidden"
      }
    });
        
    this.containerWrapper = this.container.setSlidingDoors(4, "span", cfe.prefix).addClass(cfe.prefix+this.type+"ContainerWrapper").setStyles({
      position: "absolute",
      "z-index": this.instance + 1
    }).inject(this.a);

    // insert option elements
    this.allOptions = [];
    this.origOptions.each(function(el,i)
    {
      this.allOptions.push(this.buildOption(el, i))
    }.bind(this));

    this.container.adopt(this.allOptions);

  },

  buildOption: function(el, i)
  {
    return new Element("span",{
      "class": cfe.prefix+"Option "+cfe.prefix+"Option"+i+(el.get('class')?" "+el.get('class'):""),
      "events":{
        "mouseover": this.highlightOption.pass([i,true],this)/*,
                "mouseout": this.highlightOption.pass([i,true],this)*/
      }
    }).set('html', el.innerHTML.replace(/\s/g, "&nbsp;")).disableTextSelection().store("index", i);
  },

  selectOption: function(index)
  {
    index = index.limit(0,this.origOptions.length-1);

    this.highlightOption(index);

    this.selectedIndex = index;

    this.innerlabel.set('html', (this.allOptions[index]).innerHTML);

    this.fireEvent("onSelectOption", index);
  },

  highlightOption: function(index)
  {
    index = index.limit(0,this.origOptions.length-1);

    if(this.highlighted) this.highlighted.removeClass("H");

    this.highlighted = this.allOptions[index].addClass("H");

    this.highlightedIndex = index;

    this.fireEvent("onHighlightOption", index);
  },

  updateOption: function(by)
  {
    // fix for IE 7
    if(this.containerWrapper.retrieve("hidden") != true && !Browser.Engine.trident5) this.o.selectedIndex = (this.highlightedIndex+by).limit(0,this.origOptions.length-1);
    this.o.fireEvent("change");
  },

  hideContainer: function()
  {
    $(document.body).removeEvent("click", this.clickedOutsideListener);
        
    this.containerWrapper.setStyle("display","none").removeClass("F").store("hidden", true);

    this.fireEvent("onContainerHide", this.selectedIndex);
  },

  showContainer: function()
  {
    $(document.body).addEvent("click", this.clickedOutsideListener);

    this.containerWrapper.setStyle("display", "block").addClass("F").store("hidden", false);

    this.highlightOption(this.o.selectedIndex);

    this.fireEvent("onContainerShow", this.selectedIndex);
  },

  clicked: function(ev)
  {
    if(!this.isDisabled())
    {
      if( $defined(ev.target) )
      {
        var oTarget = $(ev.target);

        if( oTarget.getParent() == this.container )
        {
          this.selectOption(oTarget.retrieve("index"), true);
          this.hideContainer();
          this.parent();
          this.o.selectedIndex = oTarget.retrieve("index");
          this.o.fireEvent("change");
          return;
        }
        else if(this.options.scrolling && oTarget.getParent("."+this.scrollerWrapper.getProperty("class")) == this.scrollerWrapper)
        {
          //console.log("no toggle");
          return;
        }
      }

      this.toggle();
      this.parent();
    }
  },

  toggle: function()
  {
    this.containerWrapper.retrieve("hidden") == true ? this.showContainer() : this.hideContainer();
  },
	
  keyup: function(ev)
  {
    // toggle on alt+arrow
    if(ev.alt && (ev.key == "up" || ev.key == "down") )
    {
      this.toggle();
      return;
    }

    switch(ev.key){
      case "enter":
      case "space":
        this.toggle();
        break;

      case "up":
        this.updateOption(-1);
        break;

      case "down":
        this.updateOption(1);
        break;

      case "esc":
        this.hideContainer();
        break;
                
      default:
        this.o.fireEvent("change");
        break;
    }
  },

  keydown: function(ev)
  {
    if(ev.key == "tab")
    {
      this.hideContainer();
    }
  },

  clickedOutsideListener: function(ev)
  {
    if ($(ev.target).getParent("."+cfe.prefix+this.type) != this.a && !( (Browser.Engine.trident || (Browser.Engine.presto && Browser.Engine.version > 950)) && ev.target == this.o) && ( !$chk(this.l) || (this.l && $(ev.target) != this.l) ) ) this.hideContainer();
  },

  update: function()
  {
    this.parent();
    this.selectOption(this.o.selectedIndex);
  }
});