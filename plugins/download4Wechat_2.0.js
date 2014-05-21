/**
 * Author		jssoscar
 * Date			2014-5-20 17:53:42
 * Version		1.0
 * Description	download link plugin for wechat
 * Note			the wechat block the download app action,so link should jump to yingyongbao to download the app
 * Usage		$(".download").download4Wechat({
 * 					ios : "http://download.com/",
 * 					other : "http://download.com/"
 * 				});
 * 
 * Date			2014-5-21 10:18:10
 * Version		2.0
 * Changelog	. If not wechat browser,judge the 'target' attribute. Accroding to the attribute,execute the acction
 */

/**
 * Judgement the user agent
 */
var currentUserAgent = navigator.userAgent.toLowerCase(),
	isMicroMessager = /micromessenger/.test(userAgent),
	isIOS = /iphone|ipod/.test(userAgent);

/**
 * the download link for wechat
 *  
 * @param {Object} options : the download link configuration
 * 			@param {String} ios : the link for the ios app
 * 			@param {String} other : the link for other app
 */
$.fn.download4Wechat = function(options) {
	$(this).each(function() {
		var _this = $(this);
		_this.bind("click", function(event) {
			if (isMicroMessager) {
				event.preventDefault();
				if (isIOS) {
					loaction.href = options.ios;
				} else {
					loaction.href = options.other;
				}
			}
		});
	});
}; 
