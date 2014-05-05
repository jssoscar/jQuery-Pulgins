/**
 * Author		jssoscar
 * Date			2013-11-11 17:20:42
 * Version		1.0
 * Description	jQuery plugin for auto email suggest when input email
 *
 * Version		1.0.2
 * Date			2013-11-12 13:45:09
 * Changelog	. Add the HTML5 'placeholder' attribute support for the email input
 * 				. Support custom the 'placeholder' text color
 * Note			Some browser not support custom the placeholder text color,such as Chrome
 * 
 * Version		2.0
 * Date			2013-11-13 15:33:22
 * Changelog	. Add key UP,key DOWN handler to switch the suggest email
 * 				. Add the key Enter handler to set the email value
 * 				. Fixed the bug when filter the email
 * 
 * Version		2.0.1
 * Date			2014-5-5 11:14:59
 * Changelog	. Fixed the bug when trigger keydown event handler
 * 				. Fixed the bug when focus in the input
 * 				. Optimize the code
 */
$.fn.autoEmailSuggest = function(options) {
	/**
	 * The default configuration for the plugin
	 *
	 * showPlaceholder : whether show the placeholder
	 * placeholder : the placeholder text
	 * placeholderColor : the placeholder text color (Some browser not support custom the placeholder text color,such as Chrome)
	 * mail : supported email suffix
	 * mouseoverColor : the background color when mouseover the suggest email
	 * mouseoutColor : the background color when mouseout the suggest email
	 * 
	 * placeHolderSupported : detect whether the browser support the 'placeholder' attribute
	 * controller : the email suggest content event controller
	 * setController : set the controller
	 * emailKeyHandler : event handler for the UP and DOWN key
	 */
	var config = (function() {
		var defaultCfg = {
			showPlaceholder : false,
			placeholder : "Input your email",
			placeholderColor : "#A9A9A9",
			mail : ["gmail.com", "qq.com", "sina.com", "163.com", "126.com", "sohu.com", "hotmail.com"],
			mouseoverColor : "#DDDDDD",
			mouseoutColor : "#FFFFFF"
		};
		// Extend the configuration
		$.extend(defaultCfg, options);
		return defaultCfg;
	})(), placeHolderSupported = "placeholder" in document.createElement("input"), controller = {
		current : -1,
		li_length : 0
	}, setController = function(size) {
		controller = {
			current : -1,
			li_length : size
		};
	}, emailKeyHandler = function(obj, up) {
		if (up) {
			if (controller.current === 0 || controller.current === -1) {
				controller.current = controller.li_length - 1;
			} else {
				controller.current--;
			}
		} else {
			controller.current++;
			if (controller.current === controller.li_length) {
				controller.current = 0;
			}
		}
		obj.find("ul li:eq(" + controller.current + ")").css("background-color", config.mouseoverColor).addClass("currentEmail")
			.siblings().css("background-color", config.mouseoutColor).removeClass("currentEmail");
	};

	/**
	 * Deal with the email suggest input
	 *
	 * . Generate the email suggest block,insert it after email input
	 * . Deal with the email input parent node
	 * . Bind event handler for the email suggest input : focus,blur,keyup 3 kinds of event
	 *
	 */
	$(this).each(function() {
		var emailSuggest = $("<div class='autoEmailSuggest' tabIndex='-1'></div>"), _email = $(this), parent = _email.parent(), dealPlaceholder = function(obj, emailVal) {
			if (emailVal) {
				obj.css("color", "");
			} else {
				obj.css("color", config.placeholderColor);
			}
		};

		/**
		 *  Deal with the placeholder attrobite
		 */
		if (config.showPlaceholder) {
			if (placeHolderSupported) {
				_email.attr("placeholder", config.placeholder).css('color', config.placeholderColor);
			} else {
				_email.attr("value", config.placeholder).css("color", config.placeholderColor);
			}
		}

		/**
		 * Deal with the email suggest
		 * . Deal with the style
		 * . Insert the email suggest block after the input
		 */
		var outerWidth = _email.outerWidth();
		emailSuggest.css({
			"position" : "absolute",
			"left" : _email.position().left,
			"top" : _email.offset().top - parent.offset().top + _email.outerHeight(),
			"_width" : outerWidth,
			"min-width" : outerWidth
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
		 * focus : deal with the 'placeholder' attribute
		 */
		_email.bind("blur keyup focus", function(event) {
			var emailVal = $.trim(_email.val()), keyCode = event.keyCode;
			switch(event.type) {
				case "blur" : {
					emailSuggest.empty().hide();
					if (config.showPlaceholder) {
						if (!placeHolderSupported) {
							if (!emailVal) {
								_email.attr("value", config.placeholder).css("color", config.placeholderColor);
							} else {
								if (emailVal !== config.placeholder) {
									_email.css("color", "");
								}
							}
						} else {
							dealPlaceholder(_email, emailVal);
						}
					}
					break;
				}
				case "keyup" : {
					if (keyCode === 38 || keyCode === 40 || keyCode === 13) {
						if (controller.li_length > 0) {
							switch(keyCode) {
								case 38 : {// Up
									emailKeyHandler(emailSuggest, true);
									break;
								}
								case 40 : {// Down
									emailKeyHandler(emailSuggest, false);
									break;
								}
								case 13 : {// Enter
									emailSuggest.find("ul li.currentEmail").trigger("mousedown");
									break;
								}
							}
						}
					} else {
						_email.trigger("focus");
					}
					break;
				}
				case "focus" : {
					if (config.showPlaceholder) {
						if (!placeHolderSupported) {
							if (emailVal) {
								if (emailVal !== config.placeholder) {
									_email.css("color", "");
								} else {
									_email.attr("value", "");
								}
							}
						} else {
							dealPlaceholder(_email, emailVal);
						}
					}
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
		 * Deal with the email suggest node.Here,must use the delegate to deal with the event.
		 *
		 * mouseover : deal with the mouseover background color
		 * mouseout : deal with the mouseout background color
		 * mousedown : set the email value
		 *
		 */
		emailSuggest.delegate("li", "mouseover mouseout mousedown", function(event) {
			switch(event.type) {
				case "mouseover" : {
					$(this).css("background-color", config.mouseoverColor).siblings().css("background-color", config.mouseoutColor);
					controller.current = $(this).index();
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
		if (!/^[A-Z_a-z0-9-\.]+/.test(emailVal)) {
			setController(0);
			return "";
		}
		var emailPrefix = emailVal.replace(/@.*/, ""), emailSuffix = emailVal.replace(/^[A-Z_a-z0-9-\.]*@/, ""), mailArray = config.mail, result = [];
		// Filter the mail list
		if (/@/.test(emailVal) && emailSuffix) {
			if (/^[A-Z_a-z0-9-]+(\.[A-Z_a-z0-9-])*$/.test(emailSuffix)) {
				emailSuffix = "^" + emailSuffix;
				mailArray = $.map(config.mail, function(index) {
					if (new RegExp(emailSuffix).test(index)) {
						return index;
					}
				});
			} else {
				setController(0);
				return "";
			}
		}
		// set the controller
		setController(mailArray.length);
		// Generate the email suggest content
		for (var i = 0; i < controller.li_length; i++) {
			result[i] = "<li><a href='javascript:void(0)'><span>" + emailPrefix + "</span>@" + mailArray[i] + "</a></li>";
		}
		return "<ul>" + result.join("") + "</ul>";
	}

};
