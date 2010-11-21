/**
 * replaces radiobuttons
 *
 * bug:
 * ie 8         - rb alias w/o implicit labelling trigger update twice; ori triggers update twice
 * ie 7         - rb alias w/o implicit labelling trigger update twice; ori triggers update twice
 * 
 * @class radio
 * @namespace cfe.modules
 *
 * @requires checkbox
 * @extends cfe.modules.checkbox
 */
cfe.module.radio = $.inherit(
    cfe.module.checkbox,
    {
        instance: 0,

        /**
     * Describes the type of this element
     * @property type
     * @type string
     */
        type: "Radiobutton",

        /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
        selector: "input[type=radio]",

        /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} an input field of type "radio"
     */
        createOriginal: function()
        {
            return $("<input type='radio'></input>").attr("checked", this.options.checked || false)
        },

        /**
     * fixes a bug in other browsers than those with trident or gecko engine
     *
     * @method initializeAdv
     * @protected
     */
        initializeAdv: function()
        {
            this.__base();
        
            if( !($.browser.msie || $.browser.mozilla) ) this.o.bind("click", $.proxy(this.update, this));

            // on check, disable all other radiobuttons in this group
            this.addEvent("check", function(){
                $("input[name='"+this.o.attr("name")+"']").each( $.proxy(function(i, el)
                {
                    el = $(el);
                    if(el.context != this.o.context && el.data("cfe")) el.data("cfe").uncheck();
                }, this));
            })
        }
    });