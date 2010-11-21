/**
 * @module Text
 */

/**
 * generates a slider for a text field
 *
 * @class Slider
 * @namespace cfe.module
 *
 * @requires text
 * @extends cfe.module.text
 *
 */
cfe.module.Slider = new Class({
    
    Extends: cfe.module.Text,

    instance: 0,
   
    selector: "input[class~=slider]"
});