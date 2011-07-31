// publisher side options
window.EmbedCodeSettings = {
	domain : "example.com"
};

// embed side options
window.EmbedCodeOptions = {
	host : "example.com",
	filePath : '/js/starter.js',
	v: '0.5'
};

/**
 * If the code is included twice, the second instance will not adversely
 * affect the first.  
 *   @param {Object} params - see bottom of this file for the definition
 *       of params.  It contains the partner settings for the EmbedCode Bar. 
 */

window.EmbedCode || (function(params) {
	var win = window;
	
	/**
	 * This is the exported EmbedCode API function 'EmbedCode' that lives in the 
	 * global scope.  Partners can execute API functions by calling
	 *     EmbedCode("<name of API method>", arg1, arg2, ...);
	 * Some partners also set custom parameters on the EmbedCode object for
	 * controlling certain aspects of the bar.
	 * 
	 * The EmbedCode object also acts as an onload handler for EmbedCode.  To
	 * be notified when the EmbedCode Bar loads, a partner can call:
	 *     EmbedCode(function() {
	 *         ... this function runs once the EmbedCode Bar loads ...
	 *     });
	 */
	
	var EmbedCode = win.EmbedCode = win.EmbedCode || function() { (EmbedCode._ = EmbedCode._ || []).push(arguments); },
		
		doc = document,
		body = 'body',
		bodyEl = doc[body],
		caller;
	
	/**
	 * If the embed code is placed (incorrectly) in the HEAD of a document,
	 * we will try initializing the bar again once the BODY element exists. 
	 */
	
	if(!bodyEl) {
		caller = arguments.callee;
		return setTimeout(function() { caller(params); }, 100);
	}
	
	/**
	 * These properties are used for logging certain events that happen
	 * while the EmbedCode Bar loads.  We use these to monitor, tune, and
	 * optimize the performance of the EmbedCode Bar to ensure it doesn't 
	 * block partner sites and minimize the impact of loading the bar.
	 */
	EmbedCode.$ = {0: +new Date};
	EmbedCode.T = function(key) {
		EmbedCode.$[key] = new Date - EmbedCode.$[0];
	};
	
	/**
	 * This is the internal version number of the EmbedCode Bar embed code.
	 */
	EmbedCode.v = (window.EmbedCodeOptions && window.EmbedCodeOptions.v) ? EmbedCodeOptions.v : '1';
	
	/**
	 * Storing string values for certain properties improves the minification of
	 * the code when using the closure compiler.
	 */
	var load = 'load',
		appendChild = 'appendChild',
		createElement = 'createElement',
		src = 'src',
		lang = 'lang',
		domain = 'domain',
		
		/**
		 * Create placeholder DOM where the EmbedCode Bar will go.
		 */
		ecDiv = doc[createElement]('div'),
		el = ecDiv[appendChild](doc[createElement]('m')),
		iframe = doc[createElement]('iframe'),
		
		/**
		 * Here we listen for the load event of the page to monitor page 
		 * load times.  This must be done in the embed code since the bar
		 * itself defers to the page for loading priority.  In some cases,
		 * this means the bar will load after the page loads, in which case
		 * we wouldn't be able to measure this value.
		 */
		addEventListener = 'addEventListener',
		attachEvent = 'attachEvent',
		documentS = 'document',
		contentWindow = 'contentWindow',
		domainSrc,
		onload = function() {
			EmbedCode.T(load);
			EmbedCode(load);
		};
	
	if (win[addEventListener]) {
		win[addEventListener](load, onload, false);
	} else {
		win[attachEvent]('on' + load, onload);
	}
	
	/**
	 * Prepare the placeholder DOM (make it invisible) and insert it
	 * into the DOM.
	 */
	ecDiv.style.display = 'none';

	/**
	 * For the extensions, we'd like to append the #ec div to the bottom of
	 * the page so that we're drawn on top of elements with the same z-index.
	 * Unfortunately, there is an IE issue when appending elements with
	 * innerHTML'ed contents while parsing happening. This special case should
	 * be safe for extensions, in which the DOM has finished loading at the time
	 * of embed code execution.
	 */
	bodyEl[appendChild](ecDiv).id = 'ec';
	iframe.frameBorder = "0";
	iframe.id = "ec-iframe";
	iframe.allowTransparency = "true";
	el[appendChild](iframe);

	/**
	 * Try to start writing into the blank iframe. In IE, this will fail if document.domain has been set, 
	 * so fail back to using a javascript src for the frame. In IE > 6, these urls will normally prevent 
	 * the window from triggering onload, so we only use the javascript url to open the document and set 
	 * its document.domain
	 */
	try {
		iframe[contentWindow][documentS].open();
	} catch(e) {
		params[domain] = doc[domain];
		domainSrc = "javascript:var d=" + documentS + ".open();d.domain='" + doc.domain + "';";
		iframe[src] = domainSrc + "void(0);";
	}

	/**
	 * html() builds the string for the HTML of the iframe.
	 */	
	function html() {
		return [
			'<', body, ' onload="var d=', documentS, ";d.getElementsByTagName('head')[0].",
			appendChild, '(d.', createElement, "('script')).", src, "='//",
			window.EmbedCodeOptions && EmbedCodeOptions.host ||
				window.location.host,
			window.EmbedCodeOptions && EmbedCodeOptions.filePath ||
				'/cim',
			'?iv=',
			EmbedCode.v,
			//'&extension=true',
			//params[lang] ? '&' + lang + '=' + params[lang] : '',
			params[domain] ? '&' + domain + '=' + params[domain] : '',
			'\'"></', body, '>'
		].join('');
	};

	/**
	 * Set the HTML of the iframe. In IE 6, the document.domain from the iframe src hasn't had time to 
	 * "settle", so trying to access the contentDocument will throw an error. Luckily, in IE 7 we can 
	 * finish writing the html with the iframe src without preventing the page from onloading
	 */
	try {
		var d = iframe[contentWindow][documentS];
		d.write(html());
		d.close();
	} catch(e) {
		iframe[src] = domainSrc + 'd.write("' + html().replace(/"/g, '\\"') + '");d.close();';
	}

	/**
	 * All done! Record the time it took to run this code (should be < 10ms).
	 */
	EmbedCode.T(1);
})(window.EmbedCodeSettings);
