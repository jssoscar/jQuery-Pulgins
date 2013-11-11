/**
 * Author		jssoscar
 * Date			2013-11-11 17:20:42
 * Version		1.0
 * Description	jQuery plugin for auto email suggest when input email
 */

$.fn.autoEmailSuggest = function(options) {
	// The default configuration for the plugin
	var config = (function() {
		var defaultCfg = {
			showSuggestText : true, // whether show the suggest text
			suggestText : "Input your email", // the email suggest text
			mail : ["gmail.com", "qq.com", "sina.com", "163.com", "126.com", "sohu.com", "hotmail.com"], // supported email suffix
			mouseoverColor : "#DDDDDD", // mouseover color for the email suggest content
			mouseoutColor : "#FFFFFF" // mouseout color for the email suggest content
		};
		// Extend the configuration
		$.extend(defaultCfg, options);
		return defaultCfg;
	})(), _this = $(this);

	/**
	 * Deal with the email suggest input
	 *
	 * . Generate the email suggest block,insert it after email input
	 * . Deal with the email input parent node
	 * . Bind event handler for the email suggest input : focus,blur,keyup 3 kinds of event
	 *
	 */
	_this.each(function() {
		var emailSuggest = $("<div class='autoEmailSuggest' tabIndex='-1'></div>"), _email = $(this), parent = _email.parent();

		/**
		 * Deal with the email suggest
		 * . Deal with the style
		 * . Insert the email suggest block after the input
		 */
		emailSuggest.css({
			"position" : "absolute",
			"left" : _email.position().left,
			"top" : _email.offset().top - parent.offset().top + _email.outerHeight(),
			"_width" : _email.width(),
			"min-width" : _email.width()
		}).hide().insertAfter(_email);

		/**
		 *  Deal with the email parent node
		 */
		if (parent.css('position') === 'static') {
			parent.css('position', 'relative');
		}

		/**
		 * Bind event handler for the email suggest input
		 * 
		 * blur : empty the email suggest content, then hide it
		 * keyup : 	. If the value is emplty : then empty the email suggest content, then hide it
		 * 			. If the value is not empty : According to the email value,generate the email suggest block, then show it
		 */
		_email.bind("blur keyup", function(event) {
			switch(event.type) {
				case "blur" : {
					emailSuggest.empty().hide();
					break;
				}
				case "keyup" : {
					var emailVal = _email.val();
					if (emailVal) {
						emailSuggest.empty().html(generateEmailSuggest(emailVal)).show();
					} else {
						emailSuggest.empty().hide();
					}
					break;
				}
			}
		});

		/**
		 * Deal with the email suggest node
		 *
		 * mouseover : deal with the mouseover background color
		 * mouseout : deal with the mouseout background color
		 * mousedown : set the email value
		 *
		 */
		emailSuggest.delegate("li", "mouseover mouseout mousedown", function(event) {
			switch(event.type) {
				case "mouseover" : {
					$(this).css("background-color", config.mouseoverColor);
					break;
				}
				case "mouseout" : {
					$(this).css("background-color", config.mouseoutColor);
					break;
				}
				case "mousedown" : {
					_email.val($(this).text());
					emailSuggest.empty().hide();
					break;
				}
			}
		});
	});

	/**
	 * 
	 * According to the input value , Generate the email suggest conent block
	 * 
	 * . According to the email value , filter the mail list
	 * . Generate the email suggest content
	 */
	function generateEmailSuggest(emailVal) {
		var emailPrefix = emailVal.replace(/@.*/, ""), 
			emailSuffix = emailVal.replace(/.*@/, ""), 
			mailArray = config.mail, 
			result = [];
		// Filter the mail list
		if (/@/.test(emailVal) && emailSuffix) {
			emailSuffix = "^" + emailSuffix;
			mailArray = $.map(config.mail, function(index) {
				if (new RegExp(emailSuffix).test(index)) {
					return index;
				}
			});
		}
		// Generate the content
		for (var i = 0, len = mailArray.length; i < len; i++) {
			result[i] = "<li><a href='javascript:void(0)'><span>" + emailPrefix + "</span>@" + mailArray[i] + "</a></li>";
		}
		return "<ul>" + result.join("") + "</ul>";
	}
};