/**
 * Author		jssoscar
 * Date			2014-3-5 18:24:56
 * Version		1.0
 * Description	Singleton an object
 * Usage
 * 				var instance = $.singleton(function(){
 * 					return document.body.appendChild(document.createElement("div"));
 * 				})();
 */
/**
 * The singleton object 
 * @param {Object} callback : callback for the singleton object to deal with the user configuration
 */
$(function(){
	if(typeof $.singleton != "function"){
		$.singleton = function(callback) {
			var instance;
			return function() {
				if(!instance){
					try{
						instance = callback.apply(this, arguments);
					}catch(error){
						throw new Error("Invalid parameter.");
					}
				}
				return instance;
			};
		};
	}
});

