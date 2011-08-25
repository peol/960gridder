/* Release: 1.0 2009-03-07 */

/*
 * Copyright (c) Andrée Hansson (peolanha AT gmail DOT com)
 * MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * Idea loosely based on JASH, http://billyreisinger.com/jash/
 */

// URL to latest jQuery Gridder
var gridderUrl = "http://960gridder.keep.se/releases/1.0/";

// Load latest jQuery if needed
if (typeof(window.jQuery) == "undefined" || !jQuery().jquery.match('1.3')) {
	elObj      = document.createElement('script');
	elObj.type = "text/javascript";
	elObj.src  = gridderUrl + "jquery.js";
	document.body.appendChild(elObj);
}

/*
 * Initialize our grid object and set it to default if no override is in effect.
 * You can override these values by adding a <script></script> in your HEAD tag
 * specifying new values.
 * 
 * Please note that ALL values are required if overriding!
 */
if (typeof(window.gObj) == "undefined") {
	var gObj = {
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
}


/*
 * We are creating an object that we can use to initialize and interact with
 * after injection in the webpage.
 */
function Gridder() {

	// Inject page with additional CSS used by jQuery Gridder
	jQuery('<link rel="stylesheet" type="text/css" href="' + gridderUrl + 'jquery.gridder.css" media="all" />').appendTo('head');

	window.gObj.height = jQuery(document).height(); // Hook this now so that we know for sure.

	/*
	 * This method adds a setup area to the webpage where the user can edit
	 * the grid in realtime.
	 */
	this.setup = function() {
		/*
		 * Add all elements to the setup page, this could easily be grabbed by a ajax call,
		 * but why do that and add another HTTP-call? ;-)
		 */
		jQuery('<div id="g-setup"></div>').appendTo('body');

		jQuery('<p id="g-title" class="clearfix"> \
				<span id="g-name">jQuery 960 Gridder</span> \
				<span id="g-show-hide">SHOW</span></p> \
			<h6>Gutter Settings</h6> \
			<div class="clearfix"> \
				<label for="g-color">Color</label> \
				<input id="g-color" value="'+ window.gObj.gColor +'" /></div> \
			<div class="clearfix"> \
				<label for="g-columns">Columns</label> \
				<input id="g-columns" value="'+ window.gObj.gColumns +'" /></div> \
			<div class="clearfix"> \
				<label for="g-width">Width (Single)</label> \
				<input id="g-width" value="'+ window.gObj.gWidth +'" /></div> \
			<div class="clearfix"> \
				<label for="g-opacity">Opacity (float)</label> \
				<input id="g-opacity" value="'+ window.gObj.gOpacity +'" /></div> \
			<h6>Paragraph Settings</h6> \
			<div class="clearfix"> \
				<label for="p-color">Color</label> \
				<input id="p-color" value="'+ window.gObj.pColor +'" /></div> \
			<div class="clearfix"> \
				<label for="p-height">Height (Single)</label> \
				<input id="p-height" value="'+ window.gObj.pHeight +'" /></div> \
			<div class="clearfix"> \
				<label for="p-offset">Offset</label> \
				<input id="p-offset" value="'+ window.gObj.pOffset +'" /></div> \
			<div class="clearfix"> \
				<label for="p-opacity">Opacity (float)</label> \
				<input id="p-opacity" value="'+ window.gObj.pOpacity +'" /></div> \
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

		if (window.gObj.gEnabled != "checked") {
			jQuery('#m-g-enabled').removeAttr('checked');
		}

		if (window.gObj.pEnabled != "checked") {
			jQuery('#m-p-enabled').removeAttr('checked');
		}

		if (window.gObj.center != "checked") {
			jQuery('#m-center').removeAttr('checked');
		}


		/* Hook the show/hide text to toggle between show/hide, and then initialize */
		jQuery('#g-show-hide').click(function() { window.gridder.switcher(); });
		jQuery('#g-setup').css('top', jQuery(window).scrollTop());
		window.gridder.switcher();

		/* Hook up the "update" button to do its magic */
		jQuery('#g-submit').click(function() {
			window.gObj.center = (jQuery('#m-center').is(':checked')) ? 'checked' : '';
			window.gObj.gColor = jQuery('#g-color').val();
			window.gObj.gColumns = parseInt(jQuery('#g-columns').val(), 10);
			window.gObj.gEnabled = (jQuery('#m-g-enabled').is(':checked')) ? 'checked' : '';
			window.gObj.gOpacity = jQuery('#g-opacity').val();
			window.gObj.gWidth = parseInt(jQuery('#g-width').val(), 10);
			window.gObj.pColor = jQuery('#p-color').val();
			window.gObj.pEnabled = (jQuery('#m-p-enabled').is(':checked')) ? 'checked' : '';
			window.gObj.pHeight = parseInt(jQuery('#p-height').val(), 10);
			window.gObj.pOffset = parseInt(jQuery('#p-offset').val(), 10);
			window.gObj.pOpacity = jQuery('#p-opacity').val();

			window.gridder.switcher();
			window.gridder.run();
		});
	}

	/* This method should switch between open/close of the setup window */
	this.switcher = function() {
		if (jQuery('#g-color').is(':visible')) {
			jQuery('#g-show-hide').text('SHOW');
			jQuery('#g-setup').animate({ height: 22 }, 300);
			jQuery('#g-setup *').hide();
			jQuery('#g-title, #g-title *').show();
		}
		else {
			jQuery('#g-setup').animate({ height: 326 }, 300);
			jQuery('#g-show-hide').text('HIDE');
			jQuery('#g-setup *').show();
		}
	}

	/* Initializing function, starts the whole procedure */
	this.run = function() {
		if (jQuery('#g-grid') != "") {
			jQuery('#g-grid, #g-grid *').remove();
		}
		jQuery('<div id="g-grid"></div>').appendTo('body').css('width', window.gObj.size);

		/* Center our grid if specified to do so */
		if (window.gObj.center == "checked") {
			jQuery('#g-grid').css({left: '50%', marginLeft: -((window.gObj.size / 2) + window.gObj.gWidth)});
		}

		/* Create vertical columns */
		if (window.gObj.gEnabled == "checked") {
			for (i = 0; i <= window.gObj.gColumns; i++) {
				jQuery('<div class="g-vertical"></div>').appendTo('#g-grid').css({
					left: ((window.gObj.size / window.gObj.gColumns) * i),
					height: window.gObj.height,
					width: (window.gObj.gWidth * 2),
					backgroundColor: window.gObj.gColor,
					opacity: window.gObj.gOpacity
				});
			}
		}

		/* Create horizontal paragraph lines */
		if (window.gObj.pEnabled == "checked") {
			horColumns = ((window.gObj.height - window.gObj.pOffset) / window.gObj.pHeight);
			for (i = 0; i <= horColumns; i++) {
				jQuery('<div class="g-horizontal"></div>').appendTo('#g-grid').css({
					top: ((window.gObj.height / horColumns) * i) + window.gObj.pOffset,
					left: '50%',
					marginLeft: -(window.gObj.size / 2),
					height: 1,
					width: (window.gObj.size + (window.gObj.gWidth * 2)),
					backgroundColor: window.gObj.pColor,
					opacity: window.gObj.pOpacity
				});
			}
		}
	}
	
	/* Hook the scrolling of the page so that the setup follows you around */
	jQuery(window).scroll(function() {
		jQuery('#g-setup').css('top', jQuery(window).scrollTop());
	});
}

/*
 * This activates the whole injection procedure, waiting one second before
 * firing of the real script to be certain that the jQuery, if loaded, has
 * been fully loaded before it starts.
 */

initNewGridder = function() {
	window.gridder = new Gridder();
	window.gridder.setup();
	window.gridder.run();
}

if (typeof(window.gridder) == "undefined") {
	if (typeof(jQuery) == "undefined") {
		setTimeout(function() {
			initNewGridder();
		}, 150);
	}
	else {
			initNewGridder();
	}
}
else {
	window.gridder.switcher();
}
