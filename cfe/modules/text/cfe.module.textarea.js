/**
 * @module Text
 */

/**
 * replaces textarea
 *
 * <h6>Tested in:</h6>
 * <p>See cfe.module.Text PLUS</p>
 * <ul>
 * <li>IE 8
 *    <ul>
 *      <li>original textarea overlaps bottom of sldiding doors by a pixel</li>
 *    </ul>
 *  </li>
 *
 *
 *  </ul>
 * @class Teaxtarea
 * @namespace cfe.module
 *
 * @extends cfe.module.Text
 *
 */
cfe.module.Textarea = new Class({

    Extends: cfe.module.Text,
    
    instance: 0,

    /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
    selector: "textarea",

    /**
     * @inherit
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
        slidingDoors: 4
    },

    /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} a textarea element
     */
    createOriginal: function()
    {
        return new Element("textarea");
    }
});