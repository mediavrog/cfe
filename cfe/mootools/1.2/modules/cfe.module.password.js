/****************************************/
/* -name:> password						*/
/* ?help:> replaces password fields		*/
/* !dep:>  text         				*/
/****************************************/
cfe.module.password = new Class({
    
    Extends: cfe.module.text,
    type:"Password",
    selector: "input[type=password]",
   
    createOriginal: function()
    {
        return new Element("input",{
            type: "password"
            });
    }
});