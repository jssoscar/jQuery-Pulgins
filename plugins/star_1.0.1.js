/**
 * Author		jssoscar
 * Date			2013-10-9 12:15:29
 * Version		1.0.1
 * Description	jQuery plugin for NM star
 * Since		1.0
 * Note			This is the first time that I try to write jQuery plugin.
 * 				I really hope to receive your comments and suggestions
 * 
 * Added		.	Generate the star content automatically
 * 				.	Add socre information attribute for the star block,current added: scoreLevel and scoreWidth
 * 				.	Remove the attribute : star inner class and the star text class
 */
$.fn.NM_Stars = function(config) {
	// NM star default config
	var defaults = {
		scoreLevel : {
			"1" : "Worst",
			"2" : "Bad",
			"3" : "OK",
			"4" : "Good",
			"5" : "Best"
		},
		starWidth : 17,
		// starInnerClassName : "starsInner",
		starLength : 5,
		showStarText : false,
		// starTextClassName : "starText",
		callback : null
	},starClasses = {
		starInnerClass : "starsInner",
		starTextClass : "starText"
	};

	// Extend the score config
	$.extend(defaults, config);

	/**
	 * Gennerate the star content and bind event handler for the star element
	 * Current , the star plugin support click,mousemove,mouseleave 3 kinds of event handler
	 */
	this.each(function() {
		// gennerate star content
		gennerateStarContent($(this));

		var _this = $(this), selectedStar = _this.find("."+starClasses.starInnerClass), starAttrObj = {
			scoreWidth : 0
		};
		
		// Bind event handler
		_this.find(".stars").bind({
			click : function(event) {
				var _stars = $(this);
				starAttrObj = calculateScore(parseInt(event.pageX) - parseInt(_stars.offset().left));
				starEventHandler(_stars, selectedStar, starAttrObj);
				// Set the score info
				elementScoreInfo(_this, starAttrObj);

				if (defaults.callback) {
					// defaults.callback.call(this, starAttrObj.scoreLevel,starAttrObj.scoreWidth);
					defaults.callback.call(this, starAttrObj);
				}
			},
			mousemove : function(event) {
				starEventHandler($(this), selectedStar, calculateScore(parseInt(event.pageX) - parseInt($(this).offset().left)));
			},
			mouseleave : function() {
				starEventHandler($(this), selectedStar, starAttrObj);
			}
		});
	});

	/**
	 * Gennerate star content : prepend the star content to the element as the first child
	 * @param {Object} element : the star content parent node
	 */
	function gennerateStarContent(element) {
		element.prepend("<div class='starContainer clearfix'>" + 
							"<div class='icons stars'>" + 
								"<div class='icons starsInner'>" + 
								"</div>" + 
							"</div>" + 
							"<p class='starText'></p>" +
						"</div>");
	}

	/**
	 * Star event handler
	 * @param {Object}  star : star object
	 * @param {Object} 	starInner : starInner object
	 * @param {Object} 	scoreObj : star score object which contains the score width and the score level
	 */
	function starEventHandler(star, starInner, scoreObj) {
		starInner.css("width", scoreObj.scoreWidth);
		if (defaults.showStarText) {
			if (scoreObj.scoreLevel != undefined) {
				star.siblings("."+starClasses.starTextClass).text(defaults.scoreLevel[scoreObj.scoreLevel]);
			} else {
				star.siblings("."+starClasses.starTextClass).text("");
			}
		}
	}

	/**
	 * Calculate the selected width : Accroing to the width , calculate the score level and score width
	 * @param {Object} width : star total width
	 */
	function calculateScore(width) {
		var score = Math.ceil(width / defaults.starWidth);
		if (score <= 0) {
			score = 1;
		} else if (score > defaults.starLength) {
			score = defaults.starLength;
		}
		return {
			scoreLevel : score,
			scoreWidth : score * defaults.starWidth
		};
	}

	/**
	 * Set the score element attribute : add score attributes to the caller
	 * @param {Object} caller : the caller
	 * @param {Object} scoreInfo : score information
	 */
	function elementScoreInfo(caller, scoreInfo) {
		caller.attr("scoreLevel", scoreInfo.scoreLevel);
		caller.attr("scoreWidth", scoreInfo.scoreWidth);
	}
};