/**
 * @module button
 */

/**
 * Extends the generic module to replace inputs of type 'submit'
 *
 * @class submit
 * @namespace cfe.module
 * 
 * @requires generic
 * @extends cfe.generic
 *
 * @constructor
 *
 * bug: - press then click outside > press state doesn't clear
 */
cfe.module.submit = $.inherit(
    cfe.generic,
    {

        /**
     * Describes the type of this element (Submit)
     * @property type
     * @type string
     */
        type:"Submit",

        /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
        selector: "input[type=submit]",

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
            slidingDoors: true
        },

        /**
     * Hides the original element and adds class jsButton to decorator
     *
     * @method initializeAdv
     */
        initializeAdv: function()
        {
            this.__base();
            this.hideOriginal();
            this.a.addClass("jsButton");
        },

        /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} an input field of type "submit"
     */
        createOriginal: function()
        {
            return $("<input type='submit' />");
        },

        /**
     * customize the "decorator" (=> sliding doors wrappers)
     * disables text selection on the injected label
     *
     * @method build
     * @protected
     */
        build: function()
        {
            this.lab = $("<span class='label'>"+this.o.val()+"</span>").appendTo(this.a);
            this.lab.disableTextSelection();
        
            if( this.options.slidingDoors )
            {
                var additionalWrapper = $("<span class='js"+this.type+"' />");
                this.lab.wrap(additionalWrapper);
            
                this.a.addClass("js"+this.type+"Slide").removeClass("js"+this.type).append(additionalWrapper);
            }
        }
    });