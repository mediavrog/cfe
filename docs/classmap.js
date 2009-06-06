YAHOO.env.classMap = {"cfe.module.password": "text", "toolTips": "addon", "cfe.generic": "core", "cfe.modules.select": "select", "cfe.module.slider": "text", "cfe.modules.file": "file", "cfe.modules.radio": "check", "autotab": "addon", "themes": "addon", "cfe.module.select_multiple": "select", "cfe.module.reset": "button", "cfe.module.text": "text", "cfe.module.submit": "button", "Element.Helpers": "core", "toggleCheckboxes": "addon", "cfe.modules.checkbox": "check", "cfe.module.image": "button"};

YAHOO.env.resolveClass = function(className) {
    var a=className.split('.'), ns=YAHOO.env.classMap;

    for (var i=0; i<a.length; i=i+1) {
        if (ns[a[i]]) {
            ns = ns[a[i]];
        } else {
            return null;
        }
    }

    return ns;
};
