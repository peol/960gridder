/*!
 * Release: 1.3.1 2009-04-26
 */

/*!
 * Copyright (c) Andrée Hansson (peolanha AT gmail DOT com)
 * MIT License - http://www.opensource.org/licenses/mit-license.php
 * Idea loosely based on JASH, http://billyreisinger.com/jash/
 *
 * Website: http://gridder.andreehansson.se/
 *
 * Changelog:
 * - New GUI! The new GUI should be less obtrusive and has been repositioned.
 *   It is also featuring a slight delay on inputs so that you'll have a chance
 *   to change the settings before it is re-rendering the grid
 * - Due to a lot of inquries regarding affiliation with jQuery the filenames has
 *   been changed, I'm very sorry for the inconvenience!
 * - CSS issues with the GUI should also be fixed in more websites, please report
 *   in any issue you stumble upon
 * - A small bug in IE that made the paragraph lines not position correctly has been
 *   fixed
 * - A dropdown box has replaced the columns input box, 960 Gridder calculates the
 *   proper number of columns that can be used with the specified grid width
 * - The 960 Gridder is now displaying perfectly (into the very pixels) in all
 *   A-grade browsers (according to browsershots.org)
 * - An option to invert the gutters has been added, set this to 'true' if
 *   you want to use it, OR use the shortcut CTRL+ALT+A
 * - Some other minor changes...
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
		urlBase: 'http://gridder.andreehansson.se/releases/1.3.1/',
		gColor: '#EEEEEE',
		gColumns: 12,
		gOpacity: 0.45,
		gWidth: 10,
		pColor: '#C0C0C0',
		pHeight: 15,
		pOffset: 0,
		pOpacity: 0.55,
		center: true,
		invert: false,
		gEnabled: true,
		pEnabled: true,
		size: 960,
		fixFlash: true,
		setupEnabled: true,
		pressedKeys: [],
		delayTimer: ''
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
		jQuery().jquery.match(/^1\.3/) === null) {

		// Reset the jQuery variable, "removing" current jQuery version
		window.jQuery = undefined;

		// Inject the newest version of jQuery :-)
		var scriptEl = document.createElement('script');
		scriptEl.type = "text/javascript";
		scriptEl.src = me.settings.urlBase + "jquery.js";
		document.body.appendChild(scriptEl);
	}
	
	/* Internal method to create an grid entity.
	 * @param type
	 * Either 'vertical' or 'horizontal'
	 * @param options
	 * All css attributes that should be set to this object
	 */
	me._createEntity = function (type, options) {
		jQuery('<div class="g-' + type + '">&nbsp;</div>')
			.appendTo('#g-grid')
			.css(options);
	};

	/* Internal method for setting a single variable to a new value, it updates
	 * both GUI and object values, should only be used internally. Use setVariable
	 * instead.
	 */
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
		 jQuery('<style type"text/css">#g-setup{position:absolute;top:150px;left:-310px;padding:6px;margin:0;list-style:none;width:320px!important;background-color:#d1cfe6;border:2px solid #a19bd1;z-index:2100;}#g-setup *{background:transparent!important;border:0!important;color:#58517c!important;font-family:Verdana,Geneva,sans-serif!important;font-size:10px!important;font-weight:normal!important;letter-spacing:normal!important;line-height:1!important;list-style-type:none!important;margin:0!important;padding:0!important;text-decoration:none!important;text-indent:0!important;text-transform:none!important;word-spacing:0!important;z-index:2100!important;}#g-setup .head{font-weight:bold!important;text-align:center;border-bottom:1px solid #7cb267!important;}#g-setup ul{width:150px;float:left!important;}#g-setup li{clear:left;padding:5px!important;}* html #g-setup li{clear:none!important;padding:4px!important;}#g-setup span{float:left!important;width:50px;padding:1px 4px 0 0!important;text-align:right!important;line-height:1.5!important;}#g-setup input,#g-setup select{float:left!important;width:70px;border:1px solid #a19bd1!important;background-color:#e7e6ee!important;padding:2px!important;}#g-setup select{width:77px;padding:0!important;}#g-setup-misc{margin-top:5px!important;clear:left;float:none!important;width:300px!important;border-top:1px solid #7cb267!important;}#g-setup-misc span{line-height:1.1!important;width:200px;}#g-setup-misc input{width:15px;padding:0!important;height:15px;}#g-setup-tab{width:26px;overflow:hidden;position:absolute;top:0;left:100%;margin-left:-26px!important;z-index:2100!important;}#g-setup-tab img{left:0;position:relative;}#g-grid{left:0;position:absolute;z-index:500;top:0;}#g-grid .g-vertical,#g-grid .g-horizontal{position:absolute;z-index:1000;}*:first-child+html #g-grid .g-horizontal,*:first-child+html #g-grid .g-vertical{margin-left:-1px;}#g-grid .g-horizontal{min-height:1px;height:1px;font-size:0;line-height:0;}</style>').appendTo('head');
		
		// Get initial document height
		me.settings.height = jQuery(document).height();

		if (me.settings.setupEnabled) {
			
			// Same as for the CSS, all the HTML used to setup 960 Gridder
			jQuery('<div id="g-setup"><ul><li class="head">Vertical</li><li><span>Color</span><input id="g-setup-gColor" /></li><li><span>Opacity</span><input id="g-setup-gOpacity" /></li><li><span>Width</span><input id="g-setup-gWidth" /></li><li><span>Columns</span><select id="g-setup-gColumns"></select></li></ul><ul><li class="head">Horizontal</li><li><span>Color</span><input id="g-setup-pColor" /></li><li><span>Opacity</span><input id="g-setup-pOpacity" /></li><li><span>Height</span><input id="g-setup-pHeight" /></li><li><span>Offset</span><input id="g-setup-pOffset" /></li></ul><ul id="g-setup-misc"><li><span>Enable vertical (gutters)</span><input id="g-setup-gEnabled" type="checkbox" /></li><li><span>Enable horizontal (paragraphs)</span><input id="g-setup-pEnabled" type="checkbox" /></li><li><span>Invert vertical</span><input id="g-setup-invert" type="checkbox" /></li><li><span>Center grid</span><input id="g-setup-center" type="checkbox" /></li></ul><div style="clear: left;"></div><div id="g-setup-tab"><a href="javascript:;"><img src="http://gridder.andreehansson.se/releases/1.3.1/logo-sprite.png" alt="" /></a></div></div>').appendTo('body');

			// Calculate suitable number of columns based on width
			for (var i = 2; i < 48; i++) {
				if (Math.round((me.settings.size / i)) === (me.settings.size / i)) {
					jQuery('<option value="' + i + '">' + i + '</option>').appendTo('#g-setup-gColumns');
				}
			}

			// Populate setup input boxes with the default values
			for (var i in me.settings) {
				if (jQuery('#g-setup-' + i).length !== 0) {
					if (jQuery('#g-setup-' + i).parent().parent().is('#g-setup-misc') && me.settings[i]) {
						jQuery('#g-setup-' + i).attr('checked', 'checked');
					}
					else {
						jQuery('#g-setup-' + i).val(me.settings[i]);
					}
				}
			}
		
			// Hook the show/hide text to toggle
			jQuery('#g-setup').css('top', jQuery(window).scrollTop() + 150);
			jQuery('#g-setup-tab a').click(function () {
				me.toggleSetupWindow();
			});
			
			// Hook "normal" input boxes to update values
			jQuery('#g-setup input').keyup(function () {
				var that = this;
				clearTimeout(me.settings.delayTimer);
				me.settings.delayTimer = setTimeout(function () {
					me.setVariable(jQuery(that).attr('id'), jQuery(that).val());
				}, 700);
			});
			
			// Hook selection box to update values
			jQuery('#g-setup-gColumns').change(function() {
				me.setVariable('gColumns', $(this).val());
			});
			
			// Hook checkboxes to update values
			jQuery('#g-setup-misc input').click(function () {
				me.setVariable(jQuery(this).attr('id'), jQuery(this).attr('checked'));
			});

			// Hook keypresses, used to know when a user pressed the right combo
			jQuery().keydown(function (e) {
				if (jQuery.inArray(e.which, me.settings.pressedKeys) === -1) {
					me.settings.pressedKeys.push(e.which);
				}
			});

			// FIXME: I wan't to remove this, replace it with position: fixed;
			jQuery(window).scroll(function () {
				jQuery('#g-setup').css('top', jQuery().scrollTop() + 150);
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
				// 'A' is pressed, toggle inverting of gutters
				else if (jQuery.inArray(65, me.settings.pressedKeys) !== -1) {
					me.setVariable('invert', !me.settings.invert);
				}
				// 'C' pressed, toggle both gutters and paragraphs
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

	/* This method should switch between open/close of the setup window.
	 * This is an own method call because of versatile use. You can use this
	 * to toggle the setup window when you are heavy developing a website,
	 * just add window.grid.toggleSetupWindow(); after the initiation.
	 */
	me.toggleSetupWindow = function () {
		var img = jQuery('#g-setup-tab img');
		img.css('left', img.position().left === 0 ? -26 : 0);
		if (parseInt(jQuery('#g-setup').css('left'), 10) === 0) {
			jQuery('#g-setup').animate({ left: -310 }, 200);
		}
		else {
			jQuery('#g-setup').animate({ left: 0 }, 200);
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
		jQuery('<div id="g-grid"></div>')
			.appendTo('body')
			.css('width', me.settings.size);
	
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
			if (me.settings.invert) {
				jQuery().css('overflow-x', 'hidden');
				var outerSpacing = (jQuery(window).width() - me.settings.size) / 2;
				
				// Create left outer line
				me._createEntity('vertical', {
					left: -outerSpacing,
					width: outerSpacing,
					height: me.settings.height,
					backgroundColor: me.settings.gColor,
					opacity: me.settings.gOpacity
				});
				
				// Create inner columns
				for (var i = 0; i < me.settings.gColumns; i++) {
					var w = (me.settings.size / me.settings.gColumns) - (me.settings.gWidth * 2);
					var gW = (me.settings.gWidth * 2);

					me._createEntity('vertical', {
						left: ((w + gW) * i) + gW,
						width: w + 'px',
						height: me.settings.height,
						backgroundColor: me.settings.gColor,
						opacity: me.settings.gOpacity
					});
				}

				// Avoid creating a horizontal scrollbar
				if ((me.settings.height+10) > jQuery(window).height()) {
					outerSpacing -= 10;
				}

				// Create right outer line
				me._createEntity('vertical', {
					left: '100%',
					marginLeft: 20,
					width: outerSpacing,
					height: me.settings.height,
					backgroundColor: me.settings.gColor,
					opacity: me.settings.gOpacity
				});
			}
			else {
				for (var i = 0; i <= me.settings.gColumns; i++) {
					me._createEntity('vertical', {
						left: ((me.settings.size / me.settings.gColumns) * i),
						width: (me.settings.gWidth * 2),
						height: me.settings.height,
						backgroundColor: me.settings.gColor,
						opacity: me.settings.gOpacity
					});
				}
			}
		}

		// Create horizontal paragraph lines
		if (me.settings.pEnabled && me.settings.pHeight > 1) {
			// Calculate how many rows the document should have
			var horColumns =
				((me.settings.height - me.settings.pOffset) / me.settings.pHeight);
			
			for (i = 0; i <= horColumns; i++) {
				me._createEntity('horizontal', {
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
