/* Release: 1.2.1 2009-04-01 */

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
 */

/**
 * Creates an element and injects it into the document.
 *
 * @param name
 * Tag name of the element to be created
 * @param insertTag
 * Tag to the location where to append the new element
 * @param params
 * Object containing parameters that the new element should have.
 * Valid types: everything that the specified name parameter can have.
 */
function createObject(name, insertTag, params) {
	// Create temporary object
	var tmpObj = document.createElement(name);

	// Create every attribute for the object
	for (var i in params) {
		if ((i === "src" || i === "href") && params.noCache) {
			params[i] = params[i] + "?" + (new Date()).getTime();
		}

		// As long as param isn't "noCache"...
		if (i !== "noCache") {
			tmpObj[i] = params[i];
		}
	}

	/**
	 * Append the temporary object we just created into our target.
	 * NOTE! It is grabbing the first matched element of the tag...
	 */
	document.getElementsByTagName(insertTag)[0].appendChild(tmpObj);
}

/**
 * Create an instance of the Gridder,
 * everything inside is relative to this object.
 */
function Grid() {
	// Default values for jQuery 960 Gridder, you can override any of these (read on 960 Gridder's website)
	window.gridSettingsDef = {
		urlBase: 'http://960gridder.keep.se/releases/1.2.1/',
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
		showWarning: true
	};
	
	// Initialize gridSettings object if it's not already existing
	if (typeof(window.gridSettings) === "undefined") {
		window.gridSettings = {};
	}

	// Loop through and default every variable that isn't overridden
	for (var i in window.gridSettingsDef) {
		if (typeof(window.gridSettings[i]) === "undefined") {
			window.gridSettings[i] = window.gridSettingsDef[i];
		}
	}

	// Load latest jQuery if needed
	if (typeof(window.jQuery) === "undefined" || jQuery().jquery.match(new RegExp("^1\.3")) === null) {
		// Let the user know that we've replaced the jQuery version
		if (typeof(window.jQuery) !== "undefined" && window.gridSettings.showWarning) {
			alert('Warning!\njQuery version on this website is too old for 960 Gridder.\nIt has been replaced by the latest version.');
		}

		// Reset the jQuery variable, "removing" current jQuery version
		window.jQuery = undefined;

		// Inject the newest version of jQuery :-)
		createObject("script", "body", {
			type : "text/javascript",
			src : window.gridSettings.urlBase + "jquery.js",
			noCache : false
		});
	}
		
	// Inject additional CSS used by 960 Gridder
	createObject("link", "head", {
		rel : "stylesheet",
		type : "text/css",
		media : "all",
		href : window.gridSettings.urlBase + "jquery.gridder.css",
		noCache : true
	});

	/*
	 * Create Setup Window for jQuery 960 Gridder and hook all of its functions and stuff.
	 * This could theoretically be without its own method, but to safe-guard the loading
	 * of jQuery before running this made me solve the issue by wrapping it in an own method.
	 */
	this.setupWindow = function () {
		// Get initial document height
		window.gridSettings.height = jQuery(document).height();

		/*
		 * Add all elements to the setup window, this could easily be grabbed by a ajax call
		 * instead, but why do that and add another HTTP-call? ;-)
		 */
		jQuery('<div id="g-setup"><ul id="g-setup-head" class="clearfix"><li class="title">960 Gridder</li><li class="switch"><a href="javascript:void(0);">Show</a></li></ul><div id="g-setup-content" class="clearfix"><div class="clearfix"><div class="g-setup-left-column"><p class="grouphead">Gutter</p><div class="inputwrap clearfix"><p class="inputdesc">Color</p><input id="g-setup-gColor" /></div><div class="inputwrap clearfix"><p class="inputdesc">Opacity</p><input id="g-setup-gOpacity" /></div><div class="inputwrap clearfix"><p class="inputdesc">Width</p><input id="g-setup-gWidth" /></div><div class="inputwrap clearfix"><p class="inputdesc">Columns</p><input id="g-setup-gColumns" /></div></div><div class="g-setup-right-column"><p class="grouphead">Paragraph</p><div class="inputwrap clearfix"><p class="inputdesc">Color</p><input id="g-setup-pColor" /></div><div class="inputwrap clearfix"><p class="inputdesc">Opacity</p><input id="g-setup-pOpacity" /></div><div class="inputwrap clearfix"><p class="inputdesc">Height</p><input id="g-setup-pHeight" /></div><div class="inputwrap clearfix"><p class="inputdesc">Offset</p><input id="g-setup-pOffset" /></div></div></div><p class="grouphead">Miscellaneous</p><div class="input-wrap clearfix input-check"><p class="inputdesc">Center the Grid</p><input id="g-setup-center" type="checkbox" /></div><div class="input-wrap clearfix input-check"><p class="inputdesc">Enable gutters (vertical)</p><input id="g-setup-gEnabled" type="checkbox" /></div><div class="input-wrap clearfix input-check"><p class="inputdesc">Enable paragraphs (horizontal)</p><input id="g-setup-pEnabled" type="checkbox" /></div></div>').appendTo('body');

		for (var i in window.gridSettings) {
			if (jQuery('#g-setup-' + i).length !== 0) {
				if (jQuery('#g-setup-' + i).parent().is('.input-check')) {
					jQuery('#g-setup-' + i).attr('checked', 'checked');
				}
				else {
					jQuery('#g-setup-' + i).val(window.gridSettings[i]);
				}
			}
		}
	
		// Hook the show/hide text to toggle between show/hide, and then initialize
		jQuery('#g-setup').css('top', jQuery(window).scrollTop());
		jQuery('#g-setup .switch a').click(function () {
			window.grid.toggleSetupWindow();
		});
		
		// Hook "normal" input boxes to update values
		jQuery('#g-setup input').keyup(function () {
			window.grid.setVariable(jQuery(this).attr('id').replace('g-setup-', ''), jQuery(this).val());
		});
		
		// Hook checkboxes to update values
		jQuery('#g-setup .input-check input').click(function () {
			window.grid.setVariable(jQuery(this).attr('id').replace('g-setup-', ''), jQuery(this).attr('checked'));
		});

		// Hook the scrolling of the page so that the setup follows you around
		jQuery(window).scroll(function () {
			jQuery('#g-setup').stop().animate({top : jQuery(window).scrollTop() }, 150);
		});
	};

	/*
	 * This method will set a variable to the oject, this should ALWAYS be used AFTER
	 * 960 Gridder has been implemented to the website. For example to interact and
	 * change values from the website itself.
	 *
	 * @param variable
	 * Variable that should be changed, e.g. "pOpacity" or "center"
	 * @param value
	 * New value of the variable that is specified in previous parameter
	 */
	this.setVariable = function (variable, value) {
		// First, set the object's value for the variable
		if (isNaN(parseInt(value, 10)) || parseInt(value, 10) === 0) {
			window.gridSettings[variable] = value;
		}
		else {
			window.gridSettings[variable] = parseInt(value, 10);
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
		
		window.grid.createGrid();
	};

	/*
	 * This method should switch between open/close of the setup window.
	 * This is an own method call because of versatile use. You can use this
	 * to toggle the setup window when you are heavy developing a website,
	 * just add window.grid.toggleSetupWindow(); after the initiation.
	 */
	this.toggleSetupWindow = function () {
		if (jQuery('#g-setup-content').is(':visible')) {
			jQuery('#g-setup .switch a').text('Show');
			jQuery('#g-setup-content').slideUp();
		}
		else {
			jQuery('#g-setup .switch a').text('Hide');
			jQuery('#g-setup-content').slideDown();
		}
	};
	
	/*
	 * Main method, at least visually. It'll create (and remove existing)
	 * grid on the website.
	 */
	this.createGrid = function () {
		// Remove any existing grid before we continue
		jQuery('#g-grid, #g-grid *').remove();
		
		// Create a object that'll help us control the grid objects
		jQuery('<div id="g-grid"></div>').appendTo('body').css('width', window.gridSettings.size);
	
		// Center our grid if specified to do so
		if (window.gridSettings.center) {
			jQuery('#g-grid').css({left: '50%', marginLeft: -((window.gridSettings.size / 2) + window.gridSettings.gWidth)});
		}
	
		// Create vertical columns
		if (window.gridSettings.gEnabled && window.gridSettings.gColumns > 0) {
			
			// Loop through until we have as many vertical columns as defined
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

		// Create horizontal paragraph lines
		if (window.gridSettings.pEnabled && window.gridSettings.pHeight > 1) {

			// Calculate how many horizontal columns the document should have
			var horColumns = ((window.gridSettings.height - window.gridSettings.pOffset) / window.gridSettings.pHeight);
			
			// Loop until every column has been created
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
	};
}

/*
 * This method will loop itself until jQuery is loaded, pausing the script.
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
