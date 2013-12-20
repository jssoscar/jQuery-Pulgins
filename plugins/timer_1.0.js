/**
 * Author       jssoscar
 * Date         2013-12-15 15:00:40
 * Version      1.0
 * Description  jQuery plugin for timer
 * Usage		$.timer({
					startTime : new Date(2013,11,16,23,12,10),
					endTime : new Date(2013,11,16,23,12,14),
					serverTime : 1387206732000,// new Date(2013,11,16,23,12,12)
					callback : function(){
						alert("Hello world!");
					}
				});
 */
jQuery.timer = function(options) {
    /**
     * The configuration for the timer plugin
     *  
     * @param {String} startTime : start time for the timer.The data format: new Date(2013,11,15,23,59,59)
     * @param {String} endTime : end time for the timer.The data format: new Date(2013,11,15,23,59,59).
     * @param {Function} callback : the timer code to be executed
     * @param {Number} serverTime : the server time(mill seconds).This parameter is required.
     * 
     * Here,about the server time.Why not the client time?
     * The client time is not safe because client can define or change the time.
     * So,if use the client time to execute the the callback code,may cause error.
     * 
     * Such as,you want to use the timer to change the website Logo today 23:59 on December 15th.
     * Here,you use the client time to deal the code,but the client time is not correct(the client timer
     * is December 16th),the code may never be executed.
     * So,get the server time is the most effective and safest way to run the timer.
     * 
     * Last,about the server time.This parmeter can be writed on the page.
     * Such as,you can write the server timer in the page bottom of the page(because the bottom is stationary).
     * eg: <input type="hidden" id="serverTime" value="116544788" name="serverTime">
     */
    var config = (function() {
        var defaultCfg = $.extend({
            startTime : null,
            endTime : null,
            callback : function(){
            },
            serverTime : null
        }, options);
        if(defaultCfg.startTime){
            try{
                defaultCfg.startTime = defaultCfg.startTime.getTime();
            }catch(error){
                // TODO
                defaultCfg.startTime = 0;
            }
        }else{
            defaultCfg.startTime = 0;
        }
        if(defaultCfg.endTime){
            try{
                defaultCfg.endTime = defaultCfg.endTime.getTime();
            }catch(error){
                // TODO
                defaultCfg.endTime = 0;
            }
        }else{
            defaultCfg.endTime = 0;
        }
        return defaultCfg;
    })();
    
    /**
     * Compare the server time with the custom time
     * 
     * . Server between the start time and the end time: execute the callback code
     * . Start time equal 0 : If the server time less than the end time,execute the callback code
     * . End time equal 0 : If the server time greater than the start time,execute the callback code
     */
    if(!config.serverTime || config.startTime > config.serverTime || config.serverTime > config.endTime){
    	return;
    }
 	config.callback();
};