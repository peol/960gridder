/* Release: 1.3 2009-04-14 */

/*
 * Copyright (c) Andrée Hansson (peolanha AT gmail DOT com)
 * MIT License - http://www.opensource.org/licenses/mit-license.php
 * Idea loosely based on JASH, http://billyreisinger.com/jash/
 *
 * This JavaScript is JSLINT "validated". Settings:
 * - Recommended Options PLUS:
 * - Assume a browser
 * - Strict white space (2)
 * - Tolerate unfiltered for in
 * - And of course, "jQuery" as predefined
 * The "Bad Escapement" error is a false positive.
 *
 * Changelog:
 * - Shortcut commands added for toggling Gutters, Paragraph and Both.
 *   Usage: CTRL+ALT+Z for gutters,
 *          CTRL+ALT+X for paragraphs,
 *          CTRL+ALT+C for both
 * - An override variable has been added to allow the user to disable the setup
 *   window. With the added shortcut commands, this is great in a development
 *   environment.
 * - Refactored the namespace usage, it should be all self-contained now,
 *   relative to the Grid object instead of calling it's namespace. Column
 *   ength used is now based on 80, a few lines are a tad longer but most of the
 *   script complies with this now.
 * - Changes to the setVariable method, it now takes ONE or TWO
 *   arguments. One if it's an object and two if it's a "normal" call.
 *   Example:
 *   setVariable({ gColor : '#EFEFEF', pColor : '#000000' }); or 
 *   setVariable('gColor', '#EFEFEF');
 */

/* Create an instance of the Gridder,
 * everything inside is relative to this object.
 */
function Grid() {

	// Initialize the reference to this object
	var me = this;

	/* Default values for 960 Gridder, you can override any of these.
	 * (read on 960 Gridder's website)
	 */
	me.settingsDef = {
		urlBase: 'http://960gridder.keep.se/releases/1.3/',
		gColor: '#EEEEEE',
		gColumns: 12,
		gOpacity: 0.35,
		gWidth: 10,
		pColor: '#C0C0C0',
		pHeight: 15,
		pOffset: 0,
		pOpacity: 0.55,
		center: true,
		gEnabled: true,
		pEnabled: true,
		size: 960,
		fixFlash: true,
		setupEnabled: true,
		pressedKeys: []
	};
	
	// Initialize grid settings object
	me.settings =
		(typeof(window.gOverride) === "undefined") ? {} : window.gOverride;

	// Loop through and set to default where it isn't overridden
	for (var i in me.settingsDef) {

		if (typeof(me.settings[i]) === "undefined") {
			me.settings[i] = me.settingsDef[i];
		}
	}

	// Load latest jQuery if needed
	if (typeof(window.jQuery) === "undefined" ||
		jQuery().jquery.match(new RegExp("^1\.3")) === null) {

		// Reset the jQuery variable, "removing" current jQuery version
		window.jQuery = undefined;

		// Inject the newest version of jQuery :-)
		var scriptEl = document.createElement('script');
		scriptEl.type = "text/javascript";
		scriptEl.src = me.settings.urlBase + "jquery.js";
		document.body.appendChild(scriptEl);
	}

	/* Create Setup Window for 960 Gridder and hook all of its functions
	 * and stuff. This could theoretically be without its own method, but to
	 * safe-guard the loading of jQuery before running this made me solve the
	 * issue by wrapping it in an own method.
	 */
	me.setupWindow = function () {

		/* Add all the CSS needed for 960 Gridder to work.
		 * This could easily be grabbed by a ajax call instead/own file, but why
		 * do that and add another HTTP-call? ;-)
		 * This is generated when a new version is being released, source can be
		 * found in the jquery.gridder.src.css file.
		 */
		 jQuery('<style type"text/css">#g-setup *{margin:0!important;padding:0!important;font-family:Verdana,Geneva,sans-serif!important;font-size:12px!important;font-weight:normal!important;color:#58517c!important;z-index:2000!important;background:none!important;list-style-type:none!important;letter-spacing:normal!important;line-height:normal!important;border:0!important;text-indent:0!important;text-decoration:none!important;text-transform:none!important;}#g-setup{width:350px;background-color:#EEE;border:5px solid #CCC;position:absolute;top:0;left:50%;margin-left:-175px;z-index:2000;}#g-setup .grouphead{text-align:center!important;font-weight:bold!important;font-size:14px!important;border-bottom:1px dotted #CCC!important;margin-bottom:5px!important;}#g-setup .inputdesc,#g-setup input{font-size:10px!important;float:left!important;width:40%!important;display:block!important;}#g-setup input{padding:2px!important;background-color:#FFF!important;border:1px inset!important;}#g-setup .inputwrap{margin-bottom:3px!important;}#g-setup .inputdesc{text-align:right!important;line-height:1.7!important;padding-right:5px!important;}#g-setup-head{width:100%!important;list-style-type:none!important;}#g-setup-head li{padding:4px!important;}#g-setup-head .title{float:left!important;width:210px!important;text-align:right!important;font-weight:bold!important;}#g-setup-head .switch{float:right!important;width:50px!important;text-align:right!important;}#g-setup-content{border-top:5px solid #CCC!important;display:none;}#g-setup .g-setup-left-column,#g-setup .g-setup-right-column{width:165px!important;float:left!important;padding:4px!important;border-bottom:5px solid #CCC!important;}#g-setup .g-setup-left-column{border-right:4px solid #CCC!important;}#g-setup .input-check .inputdesc{padding-left:25px!important;width:220px!important;text-align:right!important;}#g-setup .input-check input{width:15px!important;height:15px!important;background:none!important;}.g-label{position:absolute;z-index:1000;}.g-label span{padding:4px;}.g-label .id{background-color:#069;color:#EEE;}.g-label .class{background-color:#0FF;color:#000;}#g-grid{left:0;position:absolute;z-index:500;top:0;}#g-grid .g-vertical,#g-grid .g-horizontal{position:absolute;z-index:1000;}*:first-child+html #g-grid .g-horizontal,*:first-child+html #g-grid .g-vertical{margin-left:-1px;}#g-grid .g-horizontal{min-height:1px;height:1px;font-size:0;line-height:0;}.clearfix:after{content:".";display:block;clear:both;visibility:hidden;line-height:0;height:0;}.clearfix{display:inline-block;}html[xmlns] .clearfix{display:block;}* html .clearfix{height:1%;}</style>').appendTo('head');
		
		// Get initial document height
		me.settings.height = jQuery(document).height();

		if (me.settings.setupEnabled) {
			
			// Same as for the CSS, all the HTML used to setup 960 Gridder
			jQuery('<div id="g-setup"><ul id="g-setup-head" class="clearfix">' +
			'<li class="title">960 Gridder 1.3</li><li class="switch"><a href="java' +
			'script:void(0);">Show</a></li></ul><div id="g-setup-content" class="' +
			'clearfix"><div class="clearfix"><div class="g-setup-left-column"><p ' +
			'class="grouphead">Gutter</p><div class="inputwrap clearfix"><p class=' +
			'"inputdesc">Color</p><input id="g-setup-gColor" /></div><div class=' +
			'"inputwrap clearfix"><p class="inputdesc">Opacity</p><input ' +
			'id="g-setup-gOpacity" /></div><div class="inputwrap clearfix"><p ' +
			'class="inputdesc">Width</p><input id="g-setup-gWidth" /></div><div ' +
			'class="inputwrap clearfix"><p class="inputdesc">Columns</p><input ' +
			'id="g-setup-gColumns" /></div></div><div class="g-setup-right-column">' +
			'<p class="grouphead">Paragraph</p><div class="inputwrap clearfix"><p ' +
			'class="inputdesc">Color</p><input id="g-setup-pColor" /></div><div ' +
			'class="inputwrap clearfix"><p class="inputdesc">Opacity</p><input ' +
			'id="g-setup-pOpacity" /></div><div class="inputwrap clearfix"><p ' +
			'class="inputdesc">Height</p><input id="g-setup-pHeight" /></div>' +
			'<div class="inputwrap clearfix"><p class="inputdesc">Offset</p>' +
			'<input id="g-setup-pOffset" /></div></div></div><p class="grouphead">' +
			'Miscellaneous</p><div class="input-wrap clearfix input-check"><p ' +
			'class="inputdesc">Center the Grid</p><input id="g-setup-center" ' +
			'type="checkbox" /></div><div class="input-wrap clearfix input-check">' +
			'<p class="inputdesc">Enable gutters (vertical)</p><input ' +
			'id="g-setup-gEnabled" type="checkbox" /></div><div class="input-wrap ' +
			'clearfix input-check"><p class="inputdesc">Enable paragraphs ' +
			'(horizontal)</p><input id="g-setup-pEnabled" type="checkbox" /></div>' +
			'</div>').appendTo('body');

			// Populate setup input boxes with the default values
			for (var i in me.settings) {
				if (jQuery('#g-setup-' + i).length !== 0) {
					if (jQuery('#g-setup-' + i).parent().is('.input-check')) {
						jQuery('#g-setup-' + i).attr('checked', 'checked');
					}
					else {
						jQuery('#g-setup-' + i).val(me.settings[i]);
					}
				}
			}
		
			// Hook the show/hide text to toggle
			jQuery('#g-setup').css('top', jQuery(window).scrollTop());
			jQuery('#g-setup .switch a').click(function () {
				me.toggleSetupWindow();
			});
			
			// Hook "normal" input boxes to update values
			jQuery('#g-setup input').keyup(function () {
				me.setVariable(jQuery(this).attr('id'), jQuery(this).val());
			});
			
			// Hook checkboxes to update values
			jQuery('#g-setup .input-check input').click(function () {
				me.setVariable(jQuery(this).attr('id'), jQuery(this).attr('checked'));
			});

			// Hook keypresses, used to know when a user pressed the right combo
			jQuery().keydown(function (e) {
				if (jQuery.inArray(e.which, me.settings.pressedKeys) === -1) {
					me.settings.pressedKeys.push(e.which);
				}
			});
		
			jQuery(window).scroll(function () {
				jQuery('#g-setup').css('top', jQuery().scrollTop());
			});
		}
		
		// We're checking if CTRL+ALT and one of toggle keys has been pressed
		jQuery().keyup(function (e) {
			 // CTRL + ALT is pressed
			if (jQuery.inArray(17, me.settings.pressedKeys) !== -1 &&
				jQuery.inArray(18, me.settings.pressedKeys) !== -1) {

				// 'Z' pressed, toggle gutters
				if (jQuery.inArray(90, me.settings.pressedKeys) !== -1) {
					me.setVariable('gEnabled', !me.settings.gEnabled);
				}
				// 'X' pressed, toggle paragraphs
				else if (jQuery.inArray(88, me.settings.pressedKeys) !== -1) {
					me.setVariable('pEnabled', !me.settings.pEnabled);
				}
				// 'C' pressed, toggle both
				else if (jQuery.inArray(67, me.settings.pressedKeys) !== -1) {
					me.setVariable({
						gEnabled : !me.settings.gEnabled,
						pEnabled : !me.settings.pEnabled
					});
				}
			}
			
			// Remove this key from the keys that are pressed
			var splicePos = jQuery.inArray(e.which, me.settings.pressedKeys);
			me.settings.pressedKeys.splice(splicePos, splicePos);
		});
	};

	/* This method will set a variable to the object, this should ALWAYS be used
	 * AFTER 960 Gridder has been implemented to the website. For example to
	 * interact and change values from the website itself.
	 */
	me.setVariable = function () {
		
		// Check if it's an object or 'normal' values passed to this method
		if (typeof(arguments[0]) === "object") {
			for (var i in arguments[0]) {
				me._setVariable(i, arguments[0][i]);
			}
		}
		else {
			me._setVariable(arguments[0], arguments[1]);
		}
		
		me.createGrid();
	};

	// Internal method to actually set a value to a variable
	me._setVariable = function (variable, value) {

		// Trim 'g-setup-' from the variable name (passed by GUI methods)
		variable = variable.replace(/g-setup-/, '');
		
		// First, set the grid objects values
		if (isNaN(parseInt(value, 10)) || parseInt(value, 10) === 0) {
			me.settings[variable] = value;
		}
		else {
			me.settings[variable] = parseInt(value, 10);
		}

		// Secondly, set the GUI to the new value
		if (value === true) {
			jQuery('#g-setup-' + variable).attr('checked', 'checked');
		}
		else if (value === false) {
			jQuery('#g-setup-' + variable).removeAttr('checked');
		}
		else {
			jQuery('#g-setup-' + variable).val(value);
		}
	};

	/* This method should switch between open/close of the setup window.
	 * This is an own method call because of versatile use. You can use this
	 * to toggle the setup window when you are heavy developing a website,
	 * just add window.grid.toggleSetupWindow(); after the initiation.
	 */
	me.toggleSetupWindow = function () {
		if (jQuery('#g-setup-content').is(':visible')) {
			jQuery('#g-setup .switch a').fadeOut('fast', function () {
					jQuery(this).text('Show').fadeIn('fast');
				});

			jQuery('#g-setup-content').slideUp();
		}
		else {
			jQuery('#g-setup .switch a').fadeOut('fast', function () {
				jQuery(this).text('Hide').fadeIn('fast');
			});

			jQuery('#g-setup-content').slideDown();
		}
	};
	
	/* Main method, at least visually. It'll create (and remove existing)
	 * grid on the website.
	 */
	me.createGrid = function () {
		/* This makes sure that all flash and/or other embedded content
		 * doesn't block our scripts menu or grid.
		 */
		jQuery('embed').each(function () {
			if (me.settings.fixFlash) {
				jQuery(this).attr('wmode', 'transparent');
			}
			else {
				jQuery(this).removeAttr('wmode');
			}
		
			/* We need to remove the HTML and let the browser re-render it
			 * Instead of .clone(), which does not work on IE on <embed>, we do me...
			 */
			var tmpEl = jQuery(this).wrap('<div></div>').parent().html();
			jQuery(this).parent().replaceWith(tmpEl);
			jQuery(this).remove();
		});
	
		// Remove any existing grid before we continue
		jQuery('#g-grid').remove();
		
		// Create a object that'll help us control the grid objects
		jQuery('<div id="g-grid"></div>').appendTo('body').css('width', me.settings.size);
	
		// Center our grid if specified to do so
		if (me.settings.center) {
			jQuery('#g-grid').css({
				left: '50%',
				marginLeft: -((me.settings.size / 2) + me.settings.gWidth)
			});
		}
	
		// Create vertical columns
		if (me.settings.gEnabled && me.settings.gColumns > 0) {
			
			// Loop through until we have as many vertical columns as defined
			for (i = 0; i <= me.settings.gColumns; i++) {
				jQuery('<div class="g-vertical"></div>').appendTo('#g-grid').css({
					left: ((me.settings.size / me.settings.gColumns) * i),
					height: me.settings.height,
					width: (me.settings.gWidth * 2),
					backgroundColor: me.settings.gColor,
					opacity: me.settings.gOpacity
				});
			}
		}

		// Create horizontal paragraph lines
		if (me.settings.pEnabled && me.settings.pHeight > 1) {
			// Calculate how many rows the document should have
			var horColumns =
				((me.settings.height - me.settings.pOffset) / me.settings.pHeight);
			
			// Loop until every row has been created
			for (i = 0; i <= horColumns; i++) {
				jQuery('<div class="g-horizontal">&nbsp;</div>').appendTo('#g-grid').css({
					top: ((me.settings.height / horColumns) * i) + me.settings.pOffset,
					left: '50%',
					marginLeft: -(me.settings.size / 2),
					width: (me.settings.size + (me.settings.gWidth * 2)),
					backgroundColor: me.settings.pColor,
					opacity: me.settings.pOpacity
				});
			}
		}
	};
}

/* This method will loop itself until jQuery is loaded, pausing the script.
 * When jQuery is loaded it'll continue the script.
 */
var checkJQuery = function () {
	if (typeof(window.jQuery) === "undefined") {
		setTimeout(function () {
			checkJQuery();
		}, 10);
	}
	else {
		window.grid.setupWindow();
		window.grid.createGrid();
	}
};

// Initiate the script, if it already is initiated, toggle setup window
if (typeof(window.grid) === "undefined") {
	window.grid = new Grid();
	checkJQuery();
}
else {
	window.grid.toggleSetupWindow();
}
