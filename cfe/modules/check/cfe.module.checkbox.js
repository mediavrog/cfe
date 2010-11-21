/**
 * @module check
 */

/**
 * replaces checkboxes
 *
 * bug:
 * opera        - original update triggers twince when clicking the ori
 * ie 7         - original update triggers twince when clicking the ori
 *
 * @class checkbox
 * @namespace cfe.modules
 * 
 * @requires generic
 * @extends cfe.generic
 */
cfe.module.checkbox = $.inherit(
cfe.generic,
{
    instance: 0,
    /**
     * Describes the type of this element
     * @property type
     * @type string
     */
    type: 'Checkbox',

    /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
    selector: "input[type=checkbox]",

    options:{
    /**
         * Fired when the original element gets checked
         * @event onCheck
         */
    //onCheck: Class.empty,
    /**
         * Fired when the original element's checked state is set to false
         * @event onUnCheck
         */
    //onUncheck: Class.empty
    },
    /**
     * retreive the label and the alias in inverted direction, since with checkboxes, the decorator is more often placed in front of the label
     *
     * @method toElements
     * @return {HTMLElement[label, alias]}
     */
    toElements: function()
    {
        return [this.a, this.l];
    },

    initializeAdv: function()
    {
        this.__base();
        
        this.hideOriginal();

        // important for resetting dynamically created cfe
        this.o.attr("defaultChecked", this.o.attr("checked"));

        // fix for internet explorer and opera below v10 > raises new probs: see above
        if( $.browser.opera )
        {
            if(!this.o.data("implicitLabel")){
                this.a.bind( "click", $.proxy(this.update, this) );
                if(this.l)
                {
                    this.l.bind( "click", $.proxy(this.update, this) );
                }
            }else
            {
                this.o.bind( "click", $.proxy(this.update, this) );
            }
        }

        // IE - refresh the state of the checkbox immediately after clicking
        if( $.browser.msie )
        {
            this.o.bind( "click", $.proxy(this.update, this) );
        }

        // IE 8+: fixes bug with events being fired multiple times
        if( $.browser.msie && $.browser.version >= 8)
        {
            if(this.l)
            {
                this.l.unbind( "click" );
            }
        }
    },

    /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} an input field of type "checkbox"
     * @protected
     */
    createOriginal: function()
    {
        return $("<input type='checkbox'></input>").attr("checked", this.options.checked || false)
    },

    /**
     * creates the decorator checkbox as simple img[src=spacer] element
     * after creation, update is called to properly set the state
     *
     * @method build
     * @protected
     */
    build: function()
    {
        $("<img src='"+this.options.spacer+"' class='spc' />").prependTo(this.a);
        this.update();
    },
    /**
     * public method to check a checkbox programatically
     *
     * @method check
     * @public
     */
    check: function()
    {
        this.a.addClass("A");
        this.fireEvent("onCheck");
    },

    /**
     * public method to uncheck a checkbox programatically
     *
     * @method uncheck
     * @public
     */
    uncheck: function()
    {
        this.a.removeClass("A");
        this.fireEvent("onUncheck");
    },

    /**
     * @inherit
     */
    update: function()
    {
        this.o.attr("checked") ? this.check() : this.uncheck();
        this.parent();
    }
});