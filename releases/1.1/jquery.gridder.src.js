/* Release: 1.1 2009-03-10 */

/*
 * Authored by Andrée Hansson (peolanha AT gmail DOT com)
 * Copyright (c) Andrée Hansson (peolanha AT gmail DOT com)
 * MIT License - http://www.opensource.org/licenses/mit-license.php
 * Idea loosely based on JASH, http://billyreisinger.com/jash/
 *
 * Changelog:
 * - Completely re-made the initialization of the script, it should now work better with a whole lot more
 *   websites
 * - Overriding is re-made from scratch, you can now override whichever variables you want, and let it default
 *   the other ones
 * - Renamed a lot of variables and methods to better mirror what they actually are
 * - Optimized (read: faster) injection into the website
 * - Internet Explorer 6 is now fully supported
 * - A whole lot minor changes and fixes!
 */
	
function Grid() {
	// Default values for jQuery 960 Gridder, you can override any of these (read on 960 Gridder's website)
	window.gridSettingsDef = {
		urlBase: 'http://960gridder.keep.se/releases/1.1/',
		center: 'checked',
		gColor: '#EEEEEE',
		gColumns: 12,
		gEnabled: 'checked',
		gOpacity: 0.35,
		gWidth: 10,
		pColor: '#C0C0C0',
		pEnabled: 'checked',
		pHeight: 15,
		pOffset: 0,
		pOpacity: 0.55,
		size: 960
	}

	// Initialize gridSettings object if it's not already exists
	if (typeof(window.gridSettings) == "undefined") {
		window.gridSettings = {};
	}

	// Loop through and default every variable that isn't overridden
	for (var i in window.gridSettingsDef) {
		if (typeof(window.gridSettings[i]) == "undefined") {
			window.gridSettings[i] = window.gridSettingsDef[i];
		}
	}

	// Load latest jQuery if needed
	if (typeof(window.jQuery) == "undefined" || jQuery().jquery.match(new RegExp('^1\.3')) == null) {
		// Let the user know that we've replaced the jQuery version
		if (typeof(window.jQuery) != "undefined") {
			alert('Warning!\njQuery version on this website is too old for 960 Gridder.\nIt has been replaced by the latest version.');
		}

		window.jQuery = undefined;

		elObj = document.createElement('script');
		elObj.type = "text/javascript";
		elObj.src  = window.gridSettings.urlBase + "jquery.js";

		document.body.appendChild(elObj);
	}

	// Add additional CSS used by jQuery Gridder
	elObj = document.createElement('link');
	elObj.rel = "stylesheet";
	elObj.type = "text/css";
	elObj.href  = window.gridSettings.urlBase + "jquery.gridder.css";

	document.getElementsByTagName('head')[0].appendChild(elObj);

	/*
	 * Create Setup Window for jQuery 960 Gridder and hook all of its functions and stuff.
	 * This could theoretically be without its own method, but to safe-guard the loading
	 * of jQuery before running this made me solve the issue by wrapping it in an own method.
	 */
	this.setupWindow = function() {
		// Get initial document height
		window.gridSettings.height = jQuery(document).height();
	
		/*
		 * Add all elements to the setup window, this could easily be grabbed by a ajax call
		 * instead, but why do that and add another HTTP-call? ;-)
		 */
		jQuery('<div id="g-setup"></div>').appendTo('body');
		
		jQuery('<p id="g-title" class="clearfix"> \
				<span id="g-name">jQuery 960 Gridder 1.1</span> \
				<span id="g-show-hide">SHOW</span></p> \
			<h6>Gutter Settings</h6> \
			<div class="clearfix"> \
				<label for="g-color">Color</label> \
				<input id="g-color" value="'+ window.gridSettings.gColor +'" /></div> \
			<div class="clearfix"> \
				<label for="g-columns">Columns</label> \
				<input id="g-columns" value="'+ window.gridSettings.gColumns +'" /></div> \
			<div class="clearfix"> \
				<label for="g-width">Width (Single)</label> \
				<input id="g-width" value="'+ window.gridSettings.gWidth +'" /></div> \
			<div class="clearfix"> \
				<label for="g-opacity">Opacity (float)</label> \
				<input id="g-opacity" value="'+ window.gridSettings.gOpacity +'" /></div> \
			<h6>Paragraph Settings</h6> \
			<div class="clearfix"> \
				<label for="p-color">Color</label> \
				<input id="p-color" value="'+ window.gridSettings.pColor +'" /></div> \
			<div class="clearfix"> \
				<label for="p-height">Height (Single)</label> \
				<input id="p-height" value="'+ window.gridSettings.pHeight +'" /></div> \
			<div class="clearfix"> \
				<label for="p-offset">Offset</label> \
				<input id="p-offset" value="'+ window.gridSettings.pOffset +'" /></div> \
			<div class="clearfix"> \
				<label for="p-opacity">Opacity (float)</label> \
				<input id="p-opacity" value="'+ window.gridSettings.pOpacity +'" /></div> \
			<h6>Misc. Settings</h6> \
			<div class="clearfix"> \
				<label for="m-g-enabled">Enable Gutters</label> \
				<input id="m-g-enabled" type="checkbox" checked="checked" /></div> \
			<div class="clearfix"> \
			<label for="m-p-enabled">Enable Paragraphs</label> \
			<input id="m-p-enabled" type="checkbox" checked="checked" /></div> \
			<div class="clearfix"> \
				<label for="m-center">Center Grid</label> \
				<input id="m-center" type="checkbox" checked="checked" /></div> \
			<a style="display: block;" id="g-submit" href="javascript:void(0);">Update Grid</a> \
		').appendTo('#g-setup');
	
		if (window.gridSettings.gEnabled != "checked") {
			jQuery('#m-g-enabled').removeAttr('checked');
		}
	
		if (window.gridSettings.pEnabled != "checked") {
			jQuery('#m-p-enabled').removeAttr('checked');
		}
	
		if (window.gridSettings.center != "checked") {
			jQuery('#m-center').removeAttr('checked');
		}
	
		// Hook the show/hide text to toggle between show/hide, and then initialize
		jQuery('#g-show-hide').click(function() { window.grid.toggleSetupWindow(); });
		jQuery('#g-setup').css('top', jQuery(window).scrollTop());
		window.grid.toggleSetupWindow();
		
		// Hook up the "update" button to do its magic
		jQuery('#g-submit').click(function() {
			window.gridSettings.center = (jQuery('#m-center').is(':checked')) ? 'checked' : '';
			window.gridSettings.gColor = jQuery('#g-color').val();
			window.gridSettings.gColumns = parseInt(jQuery('#g-columns').val(), 10);
			window.gridSettings.gEnabled = (jQuery('#m-g-enabled').is(':checked')) ? 'checked' : '';
			window.gridSettings.gOpacity = jQuery('#g-opacity').val();
			window.gridSettings.gWidth = parseInt(jQuery('#g-width').val(), 10);
			window.gridSettings.pColor = jQuery('#p-color').val();
			window.gridSettings.pEnabled = (jQuery('#m-p-enabled').is(':checked')) ? 'checked' : '';
			window.gridSettings.pHeight = parseInt(jQuery('#p-height').val(), 10);
			window.gridSettings.pOffset = parseInt(jQuery('#p-offset').val(), 10);
			window.gridSettings.pOpacity = jQuery('#p-opacity').val();

			// Set up the setup window to hide, then create the grid
			window.grid.toggleSetupWindow();
			window.grid.createGrid();
		});

		// Hook the scrolling of the page so that the setup follows you around
		jQuery(window).scroll(function() {
			jQuery('#g-setup').css('top', jQuery(window).scrollTop());
		});
	}

	/*
	 * This method should switch between open/close of the setup window.
	 * This is an own method call because of versatile use. You can use this
	 * to toggle the setup window when you are heavy developing a website,
	 * just add window.grid.toggleSetupWindow(); after the initiation.
	 */
	this.toggleSetupWindow = function() {
		if (jQuery('#g-color').is(':visible')) {
			jQuery('#g-show-hide').text('SHOW');
			jQuery('#g-setup').animate({ height: 20 }, 300);
			jQuery('#g-setup *').hide();
			jQuery('#g-title, #g-title *').show();
		}
		else {
			jQuery('#g-setup').animate({ height: 326 }, 300);
			jQuery('#g-show-hide').text('HIDE');
			jQuery('#g-setup *').show();
		}
	}
	
	/*
	 * Main method, at least visually. It'll create (and remove existing)
	 * grid on the website.
	 */
	this.createGrid = function() {
		// Remove any existing grid before we continue
		jQuery('#g-grid, #g-grid *').remove();
		
		// Create a object that'll help us control the grid objects
		jQuery('<div id="g-grid"></div>').appendTo('body').css('width', window.gridSettings.size);
	
		// Center our grid if specified to do so
		if (window.gridSettings.center == "checked") {
			jQuery('#g-grid').css({left: '50%', marginLeft: -((window.gridSettings.size / 2) + window.gridSettings.gWidth)});
		}
	
		// Create vertical columns
		if (window.gridSettings.gEnabled == "checked") {
			for (i = 0; i <= window.gridSettings.gColumns; i++) {
				jQuery('<div class="g-vertical"></div>').appendTo('#g-grid').css({
					left: ((window.gridSettings.size / window.gridSettings.gColumns) * i),
					height: window.gridSettings.height,
					width: (window.gridSettings.gWidth * 2),
					backgroundColor: window.gridSettings.gColor,
					opacity: window.gridSettings.gOpacity
				});
			}
		}

		/* Create horizontal paragraph lines */
		if (window.gridSettings.pEnabled == "checked") {
			horColumns = ((window.gridSettings.height - window.gridSettings.pOffset) / window.gridSettings.pHeight);
			for (i = 0; i <= horColumns; i++) {
				jQuery('<div class="g-horizontal"></div>').appendTo('#g-grid').css({
					top: ((window.gridSettings.height / horColumns) * i) + window.gridSettings.pOffset,
					left: '50%',
					marginLeft: -(window.gridSettings.size / 2),
					width: (window.gridSettings.size + (window.gridSettings.gWidth * 2)),
					backgroundColor: window.gridSettings.pColor,
					opacity: window.gridSettings.pOpacity
				});
			}
		}
	}
}

/*
 * This method will loop itself until jQuery is loaded, pausing the script.
 * When jQuery is loaded it'll continue the script.
 */
checkJQuery = function() {
	if (typeof(window.jQuery) == "undefined") {
		setTimeout(function() { checkJQuery(); }, 10);
	}
	else {
		window.grid.setupWindow();
		window.grid.createGrid();
	}
}

// Initiate the script, if it already is initiated, toggle setup window
if (typeof(window.grid) == "undefined") {
	window.grid = new Grid();
	checkJQuery();
}
else {
	window.grid.toggleSetupWindow();
}
