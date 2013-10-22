/**
 * Author		jssoscar
 * Date			2013-10-22 16:30:23
 * Version		1.0.0
 * Description	An object that maps keys to values
 * Since		1.0.0
 * 
 */
$(function(){
	function Map(){
		/**
		 * The map container which used to store the key & value data 
		 */
		this.container = [];
		
		/**
		 * Data counter : In order to judge whether the data not exists or the data is null.
		 * Such as put the (1,null) into the container , according to the key 1 to get value. 
		 * Here,First judge whether the key exists,if exists , get the index , set counter, then return the value. 
		 * If not exists, return null;
		 */
		this.counter = 0;
	}
	
	/**
	 * The map data 
	 * 
	 * @param {Object} key : the data key attribute
	 * @param {Object} value : the data value attribute
	 */
	function mapData(key,value){
		this.key = key;
		this.value = value;
	}
	
	/**
	 * Define the Map prototype 
	 */
	Map.prototype = {
		/**
		 * Put the key & value into the container. If the map contains the key , then update the value
		 * If not contains, then put the data into the map
		 *
		 * @param {Object} key : the data key attribute
		 * @param {Object} value : the data value attribute
		 */
		put : function(key,value){
			var length = this.container.length;
			for (var i = 0; i < length; i++) {
				if (this.container[i].key === key) {
					this.container[i].value = value;
					return;
				}
			}
			this.container[length] = new mapData(key, value);
		},
		
		/**
		 * According to the key, return the value
		 * 
		 * @param {Object} key : the data key attribute
		 */
		get : function(key) {
			if(this.containsKey(key)){
				return this.container[this.index].value;
			}else{
				return null;
			}
		},
		
		/**
		 * According to the index , get the element
		 * 
		 * @param {Integer} index : the key index
		 */
		element : function(index) {
			if (index < 0 || index >= this.container.length) {
				return null;
			} else {
				return this.container[index];
			}
		},
		
		/**
		 * According to the key , remove the object from container
		 * 
		 * @param {Object} key : the data key attribute
		 */
		remove : function(key) {
			var count = -1;
			var length = this.container.length;
			for (var i = 0, length = this.container.length; i < length; i++) {
				if (this.container[i].key === key) {
					count = i;
					break;
				}
			}
			if (count != -1) {
				this.container.slice(0, count).concat(this.slice(count + 1, length));
			}
		},
		
		/**
		 * Get all the keys
		 */
		keySet : function() {
			var result = [];
			for (var i = 0, length = this.container.length; i < length; i++) {
				result.push(this.container[i].key);
			}
			return result;
		},
		
		/**
		 * Get all the values
		 */
		valueSet : function() {
			var result = [];
			for (var i = 0, length = this.container.length; i < length; i++) {
				result.push(this.container[i].value);
			}
			return result;
		},
		
		/**
		 * Judge whether the map contains the key
		 * 
		 * @param {Object} key : the map key attribute
		 */
		containsKey : function(key) {
			for (var i = 0, length = this.container.length; i < length; i++) {
				if (this.container[i].key === key) {
					this.counter = i;
					return true;
				}
			}
			return false;
		},
		
		/**
		 * Judge whether the map contains the value
		 * 
		 * @param {Object} value : the map value attribute
		 */
		containsValue : function(value) {
			for (var i = 0, length = this.container.length; i < length; i++) {
				if (this.container[i].value === value) {
					return true;
				}
			}
			return false;
		},
		
		/**
		 *  Get the map size
		 */
		size : function() {
			return this.container.length;
		},
		
		/**
		 *  Clear the map
		 */
		clear : function() {
			// whitch is the best
			this.container = [];
			// this.container.length = 0;
		},
		/**
		 * Judgement whether the map is empty
		 */
		isEmpty : function() {
			return this.size() == 0;
		}
	};
	
	$.Map = Map;
})(jQuery);