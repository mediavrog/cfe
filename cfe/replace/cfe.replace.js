/**
 * replacement class for automated replacment of scoped form elements
 *
 * @module replace
 * @namespace cfe
 *
 */

cfe.replace = $.inherit(
    {
        options:{
            scope: false,
		
            spacer: ""
		
//            onInit: $empty,
//            onInitSingle: $empty,
//            onBeforeInitSingle: $empty,
//            onSetModuleOption: $empty,
//            onRegisterModule: $empty,
//            onUnregisterModule: $empty,
//            onComplete: $empty
        },
		
        modules: {},
        moduleOptions: {},
        moduleOptionsAll: {},
	
        __constructor: function()
        {
            this.options.spacer = cfe.spacer;
            this.registerAllModules();
        },
	
        /**
     * @method registerAllModules
	 * registeres all loaded modules onInitialize
	 */
        registerAllModules: function(){
		
            //console.log("Register all modules");

            $.each(cfe.module, $.proxy(function(modType, modObj){
                //console.log("Registering type "+modType);
                if(modType != "Generic")
                    this.registerModule(modType);
				
            }, this));
        },
	
        /* call to register module */
        registerModule: function(mod){
		
            //console.log("Call to registerModule with arg:"+mod);
            modObj = cfe.module[mod];
		
            this.fireEvent("onRegisterModule", [mod,modObj]);
            this.modules[mod] = modObj;
            this.moduleOptions[mod] = {};

            return true;
        },
	
        registerModules: function(mods)
        {
            $.each(mods, $.proxy(function(i, mod){
                this.registerModule(mod);
            },this) );
        },
	
        unregisterModule: function(mod)
        {
            modObj = cfe.module[mod];
		
            this.fireEvent("onUnregisterModule", [mod,modObj]);

            delete this.modules[mod];
        },
	
        unregisterModules: function(mods)
        {
            $.each(mods, $.proxy(function(i, mod){
                this.unregisterModule(mod);
            },this) );
        },
        /**
	 * sets a single option for a specified module
	 * if no module was given, it sets the options for all modules
	 *
     * @method setModuleOption
     *
	 * @param {String} 	mod 	Name of the module
	 * @param {String} 	opt 	Name of the option
	 * @param {Mixed} 	val		The options value
	 */
        setModuleOption: function(mod,opt,val){
		
            modObj = cfe.module[mod];
		
            this.fireEvent("onSetModuleOption", [mod,modObj,opt,val]);
		
            if(!modObj){
                this.moduleOptionsAll[opt] = val;
            }
            else{
                this.moduleOptions[mod][opt] = val;
            }
        },

        setModuleOptions: function(mod,opt){
		
            $.each(opt, $.proxy(function(optionValue, optionName){
                this.setModuleOption(mod,optionName,optionValue);
            }, this));
		
        },

        init: function(options){

            this.setOptions(options);

            if( !this.options.scope){
                this.options.scope = $(document);
            }

            this.fireEvent("onInit");
		
            $.each(this.modules, $.proxy(function(moduleName,module,i){

                var selector = module.prototype.selector;

                this.options.scope.find(selector).each( $.proxy(function(i,el){
				
                    var basicOptions = {
                        spacer: this.options.spacer,
                        replaces: $(el)
                    };

                    this.fireEvent("onBeforeInitSingle", [el,i,basicOptions]);

                    //console.log(module);

                    var single = new module( $.extend(basicOptions, $.extend(this.moduleOptions[moduleName],this.moduleOptionsAll)) );
				
                    this.fireEvent("onInitSingle", single);
				
                },this ));
            },this ));
		
            this.fireEvent("onComplete");
        },
        /* support for setOptions */
        setOptions: function(opt){
            $.extend(this.options, opt);

            // add events which were set as options
            // taken from mootools 1.2: Options
            for (var option in this.options){
                if ( !$.isFunction( this.options[option] ) || !(/^on[A-Z]/).test(option) ) continue;
                this.addEvent(option, this.options[option]);
                delete this.options[option];
            }
        }
    });

    $.extend(cfe.replace.prototype, Events);