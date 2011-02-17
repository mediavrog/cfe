/**
 * If you pass no scope parameter, then cfe tries to replace all form elements on the whole page
 */
window.addEvent('domready', function()
{
  var myCfe = new cfe.Replace();

  // initialize cfe for form with id=seachform
  if($('searchform'))
    myCfe.engage({
      scope: $('searchform')
    });

  // initialize cfe for form with id=commentform
  if($('commentform'))
    myCfe.engage({
      scope: $('commentform')
    });

  // initialize cfe for form with id=form
  // set some options in advance
  if( $('form') ){

    // add dependencies for checkbox with id 'chb23' by passing input elements
    if(cfe.addon.Dependencies){
      myCfe.addDependencies($("chb23"),["chb22","chb21"]);
    }

    // set some options for select and file modules
    myCfe.setModuleOptions("Select",{
      scrolling: true,
      scollSteps: 5
    });

    myCfe.setModuleOptions("File",{
      fileIcons: true,
      trimFilePath: true
      //hides the select file button, when a file is selected
      ,
      onUpdate: function(){
        if(this.o.value != ""){
          this.a.addClass("hidden");
        }else{
          this.a.removeClass("hidden");
        }
      }
    });

    myCfe.engage({
      scope: $('form')
    });

    // add selectAll/deselectAll functionality to links
    $('selectAll').addEvent("click", function(e){
      e.stop();
      this.selectAllCheckboxes($$("fieldset.chb1"));
    }.bind(myCfe));

    $('deselectAll').addEvent("click", function(e){
      e.stop();
      this.deselectAllCheckboxes($$("fieldset.chb1"));
    }.bind(myCfe));

    // sample to tween label on hover and back onUnhover => use custom events
    if($('chb1').retrieve("cfe")){
      $('chb1').retrieve("cfe").addEvent("mouseOver", function(){
        this.l.tween('margin-left', 10);
      }).addEvent("mouseOut", function(){
        this.l.tween('margin-left', 0);
      });
    }
    // sample for triggering disabled/enabled attribute on specific elements
    $("trigger").addEvent("click", function(e){
      e.stop();
      $("chb4").toggleDisabled();
    });

    $("trigger2").addEvent("click", function(e){
      e.stop();
      $("sel-norm3").toggleDisabled();
    });

    $("trigger3").addEvent("click", function(e){
      e.stop();
      $("sel-mult2").toggleDisabled();
    });

    $("triggertxt").addEvent("click", function(e){
      e.stop();
      $("input4").toggleDisabled();
    });

    $("triggerta").addEvent("click", function(e){
      e.stop();
      $("textarea2").toggleDisabled();
    });
  }
});