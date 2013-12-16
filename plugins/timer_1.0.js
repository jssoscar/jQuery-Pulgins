/**
 * Author       jssoscar
 * Date         2013-12-15 15:00:40
 * Version      1.0
 * Description  jQuery plugin for timer
 */
jQuery.fn.timer = function(options) {
    /**
     * The configuration for the timer plugin
     *  
     * @param {String} startTime : start time for the timer.The data format: 2013,11,15,23,59,59
     * @param {String} endTime : end time for the timer.The data format: 2013,11,15,23,59,59
     * @param {Function} callback : the timer code to be executed
     * @param {Number} serverTime : the server time(mill seconds)
     * 
     * PS: Here,about the server time.Why not the client time?
     * The client time is not safe because client can define or change the time.
     * So,if use the client time to execute the the callback code,may cause error.
     * 
     * Such as,you want to use the timer to change the website Logo today 23:59 on December 15th.
     * Here,you use the client time to deal the code,but the client time is not correct(the client timer
     * is December 16th),the code may never be executed.
     * So,get the server time is the most effective and safest way to run the timer.
     * 
     */
    var config = (function() {
        var defaultCfg = $.extend({
            startTime : null,
            endTime : null,
            callback : null,
            serverTime : null
        }, options);
        if(defaultCfg.startTime){
            try{
                defaultCfg.startTime = new Date(defaultCfg.startTime).getMilliseconds();
            }catch(error){
                // TODO
                defaultCfg.startTime = 0;
            }
        }else{
            defaultCfg.startTime = 0;
        }
        if(defaultCfg.endTime){
            try{
                defaultCfg.endTime = new Date(defaultCfg.endTime).getMilliseconds();
            }catch(error){
                // TODO
                defaultCfg.endTime = 0;
            }
        }else{
            defaultCfg.endTime = 0;
        }
        return defaultCfg;
    });
    
    if(config.startTime !== 0 && config.endTime !== 0){
        if(config.startTime<= config.serverTime && config.serverTime <= config.endTime){
            config.callback();
        }
    }else if(config.startTime === 0){
        if(config.serverTime <= config.endTime){
            config.callback();
        }
    }else if(config.endTime === 0){
        if(config.startTime <= config.serverTime){
            config.callback();
        }
    }
};