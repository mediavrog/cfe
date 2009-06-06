/**
 * generates a slider for a text field
 *
 * @class slider
 * @namespace cfe.module
 *
 * @requires text
 * @extends cfe.module.text
 *
 */
cfe.module.slider = new Class({
    
	Extends: cfe.module.text,
    type: "Slider",
	selector: "input[class~=slider]"
});