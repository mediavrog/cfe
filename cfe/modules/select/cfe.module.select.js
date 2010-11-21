/**
 * @module select
 */

/**
 * replaces select fields
 *
 * bug:
 * height of options too small if option with linebreak; standalone and scrolling bug
 *
 * @class select
 * @namespace cfe.module
 *
 * @requires generic
 * @extends cfe.generic
 *
 */
cfe.module.select = $.inherit(
    cfe.generic,
    {
        //Binds: ["wheelListener", "clickedOutsideListener"],

        instance: 0,
        /**
     * Describes the type of this element
     * @property type
     * @type string
     */
        type: "Selector",

        /**
     * CSS Selector to fetch "original" HTMLElements for replacement with this module
     * @property selector
     * @type string
     */
        selector: "select:not(select[multiple])",

        options: {
            size: 4,
            scrolling: true,
            scrollSteps: 5
        },

        initializeAdv: function()
        {
            this.__base();

            this.hideOriginal();

            this.o.bind({
                "keyup": $.proxy(this.keyup, this),
                "keydown": $.proxy(this.keydown, this)
            });

            this.origOptions = this.o.children();
            this.selectedIndex = this.o.selectedIndex || 0;

            // integrity check
            if(this.options.size > this.origOptions.length || this.options.scrolling != true) this.options.size = this.origOptions.length;
        },

        /**
     * Method to programmatically create an "original" HTMLElement
     *
     * @method createOriginal
     * @return {HTMLElement} a select input
     */
        createOriginal: function()
        {
            var ori = $("<select />");

            if( this.options.options )
            {
                for(var key in this.options.options)
                {
                    ori.adopt( $("<option value='"+key+"'>"+this.options.options[key].label+"</option>").attr("selected", this.options.options[key].selected?"selected":"") );
                }
            }
            return ori;
        },

        build: function()
        {
            /* build the select element showing the currently selected item */
            this.arrow = $("<img class='js"+this.type+"Arrow' src='"+this.options.spacer+"'/>").css({
                "float":"right",
                "display":"inline"
            });

            this.ai = $("<span class='js"+this.type+"Slide' />");

            this.activeEl = $("<span class='jsOptionSelected' />").css({
                "float":"left",
                "display":"inline"
            });

            // add selected option and arrow to sliding doors wrapper
            this.ai.append(this.activeEl, this.arrow);

            // add wrapper to decorator
            this.a.append(this.ai);

            // build container which shows on click
            this.buildContainer();

            // select default option
            this.selectOption(this.selectedIndex, false, true);
        },

        buildContainer: function()
        {
            this.aliasOptions = $("<div class='js"+this.type+"Container' />").css("overflow", "hidden")

            this.aliasOptions.setSlidingDoors(4, "div", "jsSelectorContent").appendTo(this.a);

            this.cContent = this.aliasOptions.parent();
            this.containerSlide = this.cContent.parents(".jsSelectorContentSlide1");

            if( parseInt(this.cContent.css("width")) === 0){
                var letFloat = true;
            }

            // insert option elements
            this.aOptions = [];
            
            this.origOptions.each( $.proxy(function(i, el)
            {
                this.aOptions.push( this.buildOption( $(el), i) );
            }, this));

            $(this.aOptions).appendTo(this.aliasOptions);

            this.gfxHeight = this.aOptions[0].height()*this.options.size;
            this.gfxWidth = this.cContent.width()-parseInt(this.cContent.css("padding-left"))-parseInt(this.cContent.css("padding-right"));

            // scroller if scrolling enabled
            if(this.options.scrolling)
            {
                //this.setupScrolling();
                //this.gfxWidth = this.gfxWidth-this.scrollerWrapper.width();
            }

            if(this.gfxHeight != 0) this.aliasOptions.css("height", this.gfxHeight);
            if(this.gfxWidth != 0 && !letFloat) this.aliasOptions.css("width", this.gfxWidth);
        },

        buildOption: function(el, i)
        {
            // TODO: fix passing of event data
            return $("<div class='jsOption jsOption"+i+( el.attr('class') ? ' '+el.attr('class') : '')+"'>"+el.html()+"</div>").bind("mouseover mouseout", {index: i, dontScroll: true} , $.proxy( this.highlightOption, this) ).disableTextSelection().data("index", i);
        },

        selectOption: function(index,stayOpenAfterSelect, dontScroll)
        {
            index = index < 0 ? 0 : (index > this.origOptions.length-1 ? this.origOptions.length-1 : index);

            this.highlightOption(index, dontScroll);

            this.selectedIndex = index;

            this.activeEl.html( this.aOptions[index].html() );

            if( !stayOpenAfterSelect ) this.hideContainer();
        },

        highlightOption: function(index, dontScroll)
        {
            console.log(index);
            console.log(dontScroll);

            // fix for jquery passing parameters to bound fn
            if( index && index.data ){
                dontScroll = index.data.dontScroll;
                index = index.data.index;
            }

            index = index < 0 ? 0 : ( (index > this.origOptions.length-1) ? this.origOptions.length-1 : index);

            if(this.highlighted) this.highlighted.removeClass("H");

            this.highlighted = this.aOptions[index].addClass("H");

            this.highlightedIndex = index;

            if( !dontScroll ) this.scrollToSelectedItem(this.highlightedIndex);
        },

        updateOption: function(by)
        {
            this.o.selectedIndex = (this.highlightedIndex+by).limit(0,this.origOptions.length-1);
            this.o.trigger("change");
        },

        /**
     * creates handles and sets up a slider object
     */
        setupScrolling: function()
        {
            // slider config
            this.scrollerWrapper = $("<div class='js"+this.type+"ScrollerWrapper' />").css("height", this.gfxHeight).appendTo(this.cContent);

            this.scrollerTop = (new cfe.generic()).toElement().addClass("scrollTop").bind("click", $.proxy(function(){
                this.moveScroller.pass(-1*this.options.scrollSteps,this)();
            }, this));

            this.scrollerBottom = (new cfe.generic()).toElement().addClass("scrollBottom").bind("click", $.proxy(function(){
                this.moveScroller.pass(this.options.scrollSteps,this)();
            }, this));

            this.scrollerKnob = $("<span class='scrollKnob spc' />");

            this.scrollerBack = $("<div />");

            this.scrollerBack.append(this.scrollerKnob);
            this.scrollerWrapper.append(this.scrollerTop, this.scrollerBack, this.scrollerBottom);

            this.scrollerBack.css("height",this.gfxHeight - 2*this.scrollerTop.first().height());

            // slider
            this.sliderSteps = this.aliasOptions.scrollTop() - (this.options.size*this.aliasOptions.scrollTop()/this.aOptions.length);

            this.slider = new Slider(this.scrollerBack, this.scrollerKnob, {
                steps: this.sliderSteps,
                mode: "vertical" ,
                onChange: $.proxy(function(step){
                    this.aliasOptions.scrollTo(false,step);
                }, this)
            }).set(0);
        },

        scrollToSelectedItem: function(index)
        {
//            if( this.options.scrolling ) this.slider.set( (this.sliderSteps/(this.aOptions.length-this.options.size))*index );
        },

        moveScroller:function(by)
        {
            var scrol = this.aliasOptions.getScroll().y;
            this.slider.set( scrol+by<this.sliderSteps?scrol+by:this.sliderSteps );
        },

        hideContainer: function()
        {
            $(document.body).unbind("mousewheel", $.proxy(this.wheelListener, this) );
            $(document.body).unbind("click", $.proxy(this.clickedOutsideListener, this) );

            this.containerSlide.css("display","none");
            this.isShown = false;
        },

        showContainer: function()
        {
            $(document.body).bind("mousewheel", $.proxy(this.wheelListener, this) );
            $(document.body).bind("click", $.proxy(this.clickedOutsideListener, this) );

            // show container
            this.containerSlide.css({
                display:"block",
                position:"absolute",
                top: this.a.offset().top,
                left: this.a.offset().left,
                "z-index": 1000 - this.instance
            });

            this.isShown = true;

            this.highlightOption(this.o.selectedIndex);
        },

        clicked: function(ev)
        {
            if(!this.isDisabled())
            {
                if( ev.target )
                {
                    var oTarget = $(ev.target);

                    if( oTarget.parent() == this.aliasOptions )
                    {
                        this.selectOption(oTarget.data("index"), true, true);
                        this.hideContainer();
                        this.__base();
                        this.o.selectedIndex = oTarget.data("index");
                        this.o.trigger("change");
                        return;
                    }
                    else if(this.options.scrolling && this.scrollerWrapper && oTarget.parent("."+this.scrollerWrapper.attr("class")) == this.scrollerWrapper)
                    {
                        //console.log("no toggle");
                        return;
                    }
                }

                this.toggle();
                this.__base();
            }
        },

        toggle: function()
        {
            this.isShown?this.hideContainer():this.showContainer();
        },

        keyup: function(ev)
        {
            // toggle on alt+arrow
            if(ev.alt && (ev.key == "up" || ev.key == "down") )
            {
                this.toggle();
                return;
            }

            switch(ev.key){
                case "enter":
                case "space":
                    this.toggle();
                    break;

                case "up":
                    this.updateOption(-1);
                    break;

                case "down":
                    this.updateOption(1);
                    break;

                case "esc":
                    this.hideContainer();
                    break;

                default:
                    this.o.fireEvent("change");
                    break;
            }
        },

        keydown: function(ev)
        {
            if(ev.key == "tab")
            {
                this.hideContainer();
            }
        },

        wheelListener: function(ev)
        {
            ev.stop();
            this.updateOption(-1*ev.wheel);
        },

        clickedOutsideListener: function(ev)
        {
            if ($(ev.target).parent(".js"+this.type) != this.a && !( ($.browser.msie || ($.browser.opera && $.browser.version > 950)) && ev.target == this.o) && ( !this.l || (this.l && $(ev.target) != this.l) ) ) this.hideContainer();
        },

        update: function()
        {
            this.__base();
            this.selectOption(this.o.selectedIndex, true);
        }
    });