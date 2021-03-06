/**
 * Author		jssoscar
 * Date			2014-2-20 15:26:00
 * Description	jQuery plugin for the lazy load image
 * Usage		$(".lazyload").lazyload()
 * 
 * Version		1.0.0
 * Date			2014-2-20 15:26:00
 * Description	First version
 * 
 * Version		1.0.2
 * Date			2014-2-24 15:26:35
 * Changelog	.	Fixed the bug
 * 
 * Version		2.0
 * Date			2014-2-28 15:27:15
 * Changelog	.	Fixed the bug
 * 				.	Optimize the code
 * 				.	Cache the lazyload DOM element
 */

/**
 * Define the lazyload function
 * 
 * @param {Object} options : the customer configuration
 * 			 @param {Number} height : the visible area height
 */
$.fn.lazyload = function(options) {
	var defaultCfg = $.extend({
		height : 800
	},options),imgCollection = $(this), lazyloadLength = imgCollection.length, finished = true, loadImg = function() {
		if (lazyloadLength === 0 || !finished) {
			return;
		}
		finished = false;
		var spliceIndex = [];
		imgCollection.each(function(index) {
			if ( typeof ($(this).attr("data-src")) != "undefined" && $(this).offset().top < $(document).scrollTop() + $(window).height() + defaultCfg.height) {
				$(this).attr("src", $(this).attr("data-src")).removeAttr("data-src");
				spliceIndex.push(index);
			}
		});
		
		/**
		 * Splice the lazy load image index 
		 */
		for (var index = 0, len = spliceIndex.length; index < len; index++) {
			imgCollection.splice(imgCollection[spliceIndex[index]], 1);
			lazyloadLength--;
		}
		finished = true;
	};

	/**
	 * Bind  scroll && resize event handler for the window
	 */
	$(window).bind("scroll resize", function() {
		loadImg();
	});

	/**
	 * Load image after document ready 
	 */
	loadImg();
};