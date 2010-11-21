/**
 * @module text
 */

/**
 * replaces input[type=text]
 *
 * @class text
 * @namespace cfe.module
 *
 * @requires generic
 * @extends cfe.generic
 *
 */
cfe.module.text = $.inherit(
cfe.generic,
{
    
    instance: 0,
    /**
     * Describes the type of this element
     * @property type
     * @type string
     */
    type: "Text",

    /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
    selector: "input[type=text]",
	
    options: {
        /**
         * if > 0, it will create markup for css sliding doors tech<br />
         * the number defines the amount of wrappers to create around this element<br />
         * 2: standard sliding doors (x- or y-Axis)<br />
         * 4: sliding doors in all directions (x/y-Axis)
         * @config slidingDoors
         * @type int
         * @default 2
         */
        slidingDoors: 2
    },

    /**
     * flag to prevent deleting the for attribute from the label<br />
     * for text fields this is important, since the "original" element doesn't get hidden
     * @property dontRemoveForFromLabel
     * @type boolean
     * @protected
     */
    dontRemoveForFromLabel: true,

    /**
     * since there's no real "decorator" (just wrapping for sliding doors) for textfields, it won't fetch events
     * @method setupWrapper
     * @protected
     */
    setupWrapper: function()
    {
        this.a.addClass("js"+this.type).bind({
            disable: $.proxy(this.disable, this),
            enable: $.proxy(this.enable, this)
        });
    },

    /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} an input field of type "text"
     */
    createOriginal: function()
    {
        return $("<input type='text' />")
    },

    /**
     * customize the "decorator" (=> sliding doors wrappers)
     *
     * @method build
     * @protected
     */
    build: function()
    {
        if( this.options.slidingDoors )
        {
            this.a.addClass("js"+this.type+"Slide");

            this.o.setSlidingDoors(this.options.slidingDoors-1, "span", "js"+this.type).appendTo(this.a);

            this.o.css({
                background: "none",
                padding: 0,
                margin: 0,
                border: "none"
            });
        }
        else
        {
            this.o.wrap(this.a);
        }
    }
});