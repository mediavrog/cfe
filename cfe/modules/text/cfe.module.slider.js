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
cfe.module.slider = $.inherit(
cfe.module.text,
{
    instance: 0,

    type: "Slider",
   
    selector: "input[class~=slider]"
});