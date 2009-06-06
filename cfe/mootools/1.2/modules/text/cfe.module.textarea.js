/**
 * replaces textarea
 *
 * @module text
 * @namespace cfe.module
 *
 * @requires text
 * @extends cfe.module.text
 *
 */
cfe.module.textarea = new Class({

	Extends: cfe.module.text,
	type:"Textarea",
	selector: "textarea",
    
    options: {
		slidingDoors: true,
        slidingDoorsCount: 4
	},

    createOriginal: function()
    {
        return new Element("textarea");
    }
});