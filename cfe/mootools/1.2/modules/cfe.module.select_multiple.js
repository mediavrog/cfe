/****************************************/
/* -name:> select						*/
/* ?help:> replaces select-elements		*/
/* !dep:>  select               		*/
/* #bug:> mouseWheel support needed
/****************************************/
cfe.module.select_multiple = new Class({
	
    Extends: cfe.module.select,
    type: "Selector",
    selector: "select[multiple]",
	
    options: {
        size: 4,
        scrolling: true,
        scrollSteps: 5
    },

    build: function()
    {	
        this.a.addClass("jsSelectorMultiple jsSelectorMultiple"+this.options.instanceID);
        this.a.removeClass("jsSelector");

        this.buildContainer();

        this.o.addEvents({
            onDisable: function(){
                this.aliasOptions.getChildren().each(function(el){
                    el.getChildren("input")[0].disable();
                });
            }.bind(this),
            onEnable: function(){
                this.aliasOptions.getChildren().each(function(el){
                   el.getChildren("input")[0].enable();
                });
            }.bind(this)
        });
    },

    buildOption: function(el, index)
    {
        var oOpt = new cfe.module.checkbox({
            label: el.innerHTML,
            checked: $chk(el.selected),
            aliasType: "div",
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

        oOpt.getAlias().addClass("jsOption jsOption"+index).disableTextSelection();
        oOpt.getLabel().removeEvents().inject(oOpt.getAlias());

        return oOpt.getAlias();
    },

    selectOption: function(index)
    {
        index = index.limit(0,this.origOptions.length-1);

        this.highlightOption(index);
    },

    scrollToSelectedItem: function(index){},
	
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
    }
});