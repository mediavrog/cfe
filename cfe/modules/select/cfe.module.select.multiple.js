/**
 * @module Selectable
 */

/**
 * replaces select fields with attribute multiple set
 *
 * bug:
 * mouseWheel support needed
 * 
 * @class SelectMultiple
 * @namespace cfe.module
 *
 * @extends cfe.module.Select
 */
cfe.module.SelectMultiple = new Class({
	
  Extends: cfe.module.Select,
  instance: 0,

  /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
  selector: "select[multiple]",

  options: {
    buttonStyle: false
  },

  afterInitialize: function()
  {
    this.containerWrapper.addClass(cfe.prefix+"SelectContainerWrapper").setStyles({
      "position": "relative",
      "z-index": "auto"
    });
    this.container.addClass(cfe.prefix+"SelectContainer");

    this.o.addEvents({
      onDisable: function(){
        this.containerWrapper.getElements("input, button").each(function(el){
          el.disable();
        });
      }.bind(this),
      onEnable: function(){
        this.containerWrapper.getElements("input, button").each(function(el){
          el.enable();
        });
      }.bind(this)
    });
    
    this.parent();
  },

  setupWrapperEvents: function()
  {
    this.a = this.containerWrapper;
    this.parent();
  },

  buildOption: function(el, index)
  {
    var oOpt = new cfe.module.Checkbox({
      label: el.innerHTML,
      checked: (el.selected != null),
      disabled: this.isDisabled()
    });
    oOpt.index = index;

    oOpt.addEvents({
      "check": function(index){
        this.origOptions[index].selected = true;
        this.o.fireEvent("change")
      }.pass(index, this),
      "uncheck": function(index){
        this.origOptions[index].selected = false;
        this.o.fireEvent("change")
      }.pass(index, this)
    });

    $(oOpt).addClass(cfe.prefix+"Option "+cfe.prefix+"Option"+index+(el.get('class')?" ".el.get('class'):"")).disableTextSelection();
    oOpt.getLabel().removeEvents().inject( $(oOpt) );

    return $(oOpt);
  },

  selectOption: function(index)
  {
    index = index.limit(0,this.origOptions.length-1);

    this.highlightOption(index);
  },

  clicked: function()
  {
    if(!this.isDisabled())
    {
      this.o.focus();
      this.fireEvent("onClick");
    }
  },

  update: function()
  {
    this.fireEvent("onUpdate");
  },

  toggle: function(){},
  keydown: function(){},
  hideContainer: function(){},
  showContainer: function(){}
});