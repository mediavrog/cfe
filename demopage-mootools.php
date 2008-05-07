<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Demopage for custom form elements - mootools 1.1</title>

<link rel="stylesheet" type="text/css" href="css/cfe.css" />
<!--[if IE]>
<link rel="stylesheet" type="text/css" href="css/fixPrematureIE.css" />
<![endif]-->

<link rel="stylesheet" type="text/css" href="css/demopage.css" />
	

<script type="text/javascript" src="cfe/mootools/1.1/lib/mootools.js"></script>

<!-- add modules -->
<script type="text/javascript" src="cfe/mootools/1.1/base/cfe.base.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/modules/cfe.module.checkbox.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/modules/cfe.module.radio.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/modules/cfe.module.text.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/modules/cfe.module.textarea.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/modules/cfe.module.select.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/modules/cfe.module.image.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/modules/cfe.module.submit.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/modules/cfe.module.reset.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/modules/cfe.module.file.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/modules/cfe.module.password.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/modules/cfe.module.fieldset.js"></script>

<!-- add extensions -->
<script type="text/javascript" src="cfe/mootools/1.1/addons/cfe.addon.toolTips.js"></script>
<script type="text/javascript" src="cfe/mootools/1.1/addons/cfe.addon.dependencies.js"></script>

<script type="text/javascript">
// <![CDATA[
window.addEvent('domready', function(){
	var myCfe = new cfe.base(true);
	
		// no fieldset enhancement	
		myCfe.unregisterModule("fieldset");
		
		// add dependencies for a checkbox by passing input elements
		myCfe.addDependencies($("chb23"),["chb22","chb21"]);
		
		// no sliding doors for pw fields
		myCfe.setModuleOptions("password",{slidingDoors:false});

		// set some options for select and file modules
		myCfe.setModuleOptions("select",{scrolling:true, scrollSteps: 5});
		myCfe.setModuleOptions("file",{fileIcons:true,trimFilePath:true});
		
		// sets options for all checkbox modules
		//myCfe.setModuleOption("checkbox", "onActive", function(){console.log("activate",this)});
		//myCfe.setModuleOption("checkbox", "onInactive", function(){console.log("deactivate",this)});
		
		
		// initialize cfe
		myCfe.init({spacer: "gfx/spacer.gif", toolTipsStyle: "normal"});
		
		// add selectAll/deselectAll functionality to links
		$('selectAll').addEvent("click", function(e){
			var e = new Event(e).stop();
			this.selectAll($E("fieldset.chb1"));
		}.bind(myCfe));
		
		$('deselectAll').addEvent("click", function(e){
			var e = new Event(e).stop();
			this.deselectAll($E("fieldset.chb1"));
		}.bind(myCfe));
		
	
});
// ]]>
</script>

</head>

<body>
<h2>Demo</h2>
<h4>Postvariables:</h4>
<pre>
<?php var_dump($_POST); ?>
</pre>

<h4>Files</h4>
<pre>
<?php var_dump($_FILES); ?>
</pre>

	
<form id="form" method="post" action="#" enctype="multipart/form-data">


<fieldset class="chb1"><legend class="tog"><strong>Checkboxes</strong> (input[checkbox])</legend>
<ul>
	<li><input title="One important checkbox" id="chb1" type="checkbox" <?php if($_POST['checkbox1'] || $_SERVER['REQUEST_METHOD'] != "POST"){echo 'checked="checked" ';}?>value="Checkbox1:Great!" name="checkbox1" />
		<label for="chb1">Checkbox #1 - checked by default</label>
		</li>

	<li><input id="chb2" type="checkbox" <?php if($_POST['checkbox2']){echo 'checked="checked" ';}?>value="Checkbox2:Wow!" name="checkbox2" />
		<label for="chb2">Checkbox #2</label>
	</li>

	<li><input id="chb3" type="checkbox" value="Checkbox3:Fascinating!" name="checkbox3" <?php if($_POST['checkbox3']){echo 'checked="checked" ';}?> />
		<label for="chb3">Checkbox #3</label></li>


	<li><a href="index.php?select=group1" id="selectAll">select all Checkboxes above</a>
		</li>
		
	<li><a href="index.php?deselect=group1" id="deselectAll">deselect all Checkboxes above</a>
		</li>

</ul>
</fieldset>

<fieldset class="chb2"><legend class="tog"><strong>Checkboxes</strong> with implicit labelling <em>NOTE: 3rd Checkbox has dependencies: 1st and 2nd get automatically checked if not already</em></legend>
<ul>
	<li><label><input title="One important checkbox" id="chb21" type="checkbox" <?php if($_POST['checkbox21'] || $_SERVER['REQUEST_METHOD'] != "POST"){echo 'checked="checked" ';}?>value="Checkbox1:Great!" name="checkbox21" />Checkbox #1 - checked by default</label>
		</li>

	<li><label><input id="chb22" type="checkbox" <?php if($_POST['checkbox22']){echo 'checked="checked" ';}?>value="Checkbox2:Wow!" name="checkbox22" />Checkbox #2</label>
	</li>

	<li><label><input id="chb23" type="checkbox" value="Checkbox3:Fascinating!" name="checkbox23" <?php if($_POST['checkbox23']){echo 'checked="checked" ';}?> />Checkbox #3</label></li>

</ul>
</fieldset>
		
<fieldset class="chb3"><legend class="tog"><strong>Checkboxes</strong> without labelling</legend>
<ul>
	<li><input title="Click it or leave it" id="chb31" type="checkbox" <?php if($_POST['checkbox31'] || $_SERVER['REQUEST_METHOD'] != "POST"){echo 'checked="checked" ';}?>value="Checkbox3:Great!" name="checkbox31" />
		</li>

	<li><input id="chb32" type="checkbox" <?php if($_POST['checkbox32']){echo 'checked="checked" ';}?>value="Checkbox3:Wow!" name="checkbox32" />
	</li>

	<li><input id="chb33" type="checkbox" value="Checkbox3:Fascinating!" name="checkbox33" <?php if($_POST['checkbox33']){echo 'checked="checked" ';}?> /></li>

</ul>
</fieldset>

<fieldset class="rb1"><legend class="tog"><strong>Radiobuttons</strong> (input[radio])</legend>
<ul>
	<li><input id="rb1" title="The first element has a title-Attribute" type="radio" <?php if($_POST['radio']=="1:Choice1:Hooray!" || $_SERVER['REQUEST_METHOD'] != "POST"){echo 'checked="checked" ';}?>value="1:Choice1:Hooray!" name="radio" />
		<label for="rb1">Radiobutton #1 - checked by default</label>
		</li>

	<li><input id="rb2" type="radio" <?php if($_POST['radio'] == "1:Choice2:Woot!"){echo 'checked="checked" ';}?>value="1:Choice2:Woot!" name="radio" />
		<label for="rb2">Radiobutton #2</label>
		</li>

	<li><input id="rb3" type="radio" value="1:Choice3:Trembling!" name="radio" <?php if($_POST['radio'] == "1:Choice3:Trembling!"){echo 'checked="checked" ';}?> />
		<label for="rb3">Radiobutton #3</label>
		</li>

</ul>
</fieldset>

<fieldset class="rb2"><legend class="tog"><strong>Radiobuttons</strong> with implicit labelling</legend>
<ul>
	<li><label>
			<input type="radio" title="The first element has a title-Attribute" <?php if($_POST['radio2']["hallo"]=="2:Choice1:Hooray!" || $_SERVER['REQUEST_METHOD'] != "POST"){echo 'checked="checked" ';}?>value="2:Choice1:Hooray!" name="radio2[hallo]" />
			Radiobutton #1 - checked by default
			</label>
		</li>

	<li><label>
			<input type="radio" <?php if($_POST['radio2']["hallo"] == "2:Choice2:Woot!"){echo 'checked="checked" ';}?>value="2:Choice2:Woot!" name="radio2[hallo]" />
			Radiobutton #2</label>
		</li>

	<li><label>
			<input type="radio" value="2:Choice3:Trembling!" name="radio2[hallo]" <?php if($_POST['radio2']["hallo"] == "2:Choice3:Trembling!"){echo 'checked="checked" ';}?> />
			Radiobutton #3</label>
		</li>
</ul>
</fieldset>
				
<fieldset class="rb3"><legend class="tog"><strong>Radiobuttons</strong> without labelling</legend>
<ul>
	<li><input type="radio" title="The first element has a title-Attribute" <?php if($_POST['radio3']["hallo"]=="3:Choice1:Hooray!" || $_SERVER['REQUEST_METHOD'] != "POST"){echo 'checked="checked" ';}?>value="3:Choice1:Hooray!" name="radio3[hallo]" />
		</li>

	<li><input type="radio" <?php if($_POST['radio3']["hallo"] == "3:Choice2:Woot!"){echo 'checked="checked" ';}?>value="3:Choice2:Woot!" name="radio3[hallo]" />
		</li>

	<li><input type="radio" value="3:Choice3:Trembling!" name="radio3[hallo]" <?php if($_POST['radio3']["hallo"] == "3:Choice3:Trembling!"){echo 'checked="checked" ';}?> />
		</li>
</ul>
</fieldset>

<fieldset class="txt1"><legend class="tog"><strong>Textinput&amp;-area</strong>(input[text,password],textarea)- w/ slidingDoors</legend>
<ul>
	<li><label for="input1">This toggles a text field</label>
		<input id="input1" class="mediumInput" type="text" value="<?php echo($_POST['input1'])?>" name="input1" />
		</li>
		
	<li><label for="input2">This toggles a second text field</label>
		<input id="input2" type="text" value="<?php echo($_POST['input2'])?>" name="input2" />
		</li>
		
	<li><label for="input3">This toggles a smaller third text field</label>
		<input id="input3" class="shortInput" title="Put your initials here" type="text" value="<?php echo($_POST['input3'])?>" name="input3" />
		</li>
		
	<li><label for="password">Secret password field</label>
		<input id="password" title="SlidingDoors was disabled for password fields by calling cfe.setModuleOptions(cfePassword,{slidingDoors:false});" type="password" value="<?php echo($_POST['password'])?>" name="password" />
		</li>

	<li><label for="textarea1">And this one a text area</label>
		<textarea name="textarea1" id="textarea1" rows="4" cols="5"><?php echo($_POST['textarea1'])?></textarea>
		</li>
</ul>
</fieldset>
			
<fieldset class="txt2"><legend class="tog"><strong>Textinput&amp;-area</strong> with implicit labelling</legend>
<ul>
	<li><label>This toggles a text field
		<input type="text" class="mediumInput" value="<?php echo($_POST['input1'])?>" name="input1" /></label>
		</li>
		
	<li><label >This toggles a second text field
		<input type="text" value="<?php echo($_POST['input2'])?>" name="input2" /></label>
		</li>
		
	<li><label>This toggles a smaller third text field
		<input class="shortInput" title="Put your initials here" type="text" value="<?php echo($_POST['input3'])?>" name="input3" /></label>
		</li>
		
	<li><label>Secret password field
		<input title="SlidingDoors was disabled for password fields by calling cfe.setModuleOptions(cfePassword,{slidingDoors:false});" type="password" value="<?php echo($_POST['password'])?>" name="password" /></label>
		</li>

	<li><label>And this one a text area
		<textarea name="textarea1" rows="4" cols="5"><?php echo($_POST['textarea1'])?></textarea></label>
		</li>
</ul>
</fieldset>

<fieldset class="sel1"><legend class="tog"><strong>Selectfield</strong> (select)<!--with and--> without multiple option</legend>
<ul>

	<li><label for="sel-norm">Normal select box</label>
		<select id="sel-norm" name="selectNormal" title="select your occupation">
			<option value="op1">Option 1</option>
			<option value="op2">znother option 2</option>
			<option value="op3">3rd option superfancywide</option>
			<option value="op4">z Option 4</option>
			<option value="op5">g Option 5</option>
			<option value="op6">jl Option 6</option>
			<option value="op7">jOption 7</option>
			<option value="op8">jOption 8</option>
			<option value="op9">h opt 43</option>
			<option value="op10">hui</option>
		</select>
		</li>
	<!--<li><label for="sel-mult">Multiple select box</label>
		<span>~ Coming soon ~</span>
		<select id="sel-mult" multiple="multiple" name="selectMultiple[]">
			<option value="op1">Option 1</option>
			<option value="op2">Option 2</option>
			<option value="op3">Option 3</option>
			<option value="op4">Option 4</option>
			<option value="op5">Option 5</option>
			<option value="op6">Option 6</option>
			<option value="op7">Option 7</option>
			<option value="op8">Option 8</option>
		</select>
		</li>-->
</ul>
</fieldset>
				
<fieldset class="up1"><legend class="tog"><strong>Upload-Field</strong> (input[file])</legend>
<ul>
	<li><label for="upload">Upload a file</label>
		<input id="upload" type="file" name="file" title="Upload a nice picture of yours. Maybe jpeg,jpg,gif." />
		</li>
</ul>
</fieldset>
			
<fieldset class="btn1">
	<legend>Check POST Data or Reset Data via <strong>Buttons</strong> (input[submit], input[reset], input[image])</legend>
	
	<input type="submit" id="submitNorm" name="submit[normal]" title="via submit..." value="Submit" />
	
	<input type="reset" id="reset" name="none" title="Reset the form..." value="Reset" />
	
	<br /><br />
	
	<input type="image" id="submitImg"  name="submit[image]" src="gfx/cfeImage.gif" title="via input type=image button" value="Image" />
</fieldset>

</form>
</body></html>