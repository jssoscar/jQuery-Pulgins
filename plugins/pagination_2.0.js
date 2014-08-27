/**
 * Author		jssoscar
 * Date			2014-7-29 10:09:18
 * Version		1.0
 * Description	jQuery plugin for Pagination
 * Usage		$(function(){
				 	$(".pager").pagination(7);
				});
 *
 * Version		2.0
 * Date			2014-7-30 12:09:33
 * Changelog	. Fixed the bug when num_edge_entry equal 0
 * 				. Optimize the code
 * 
 * Version		2.1
 * Date			2014-8-12 16:53:52
 * Changelog	. Fixed the bug
 * 				. Optimize the code
 * 
 * Version		2.2
 * Date			2014-8-27 16:22:30
 * Changelog	. Fixed the bug
 * 				. Optimize the code
 * 				. Add parameters :
 * 					. linkable : whether the pagination linkable
					. link : the page link
					. jumpable : whether show the jump text and button
 */

/**
 * The Pagination model
 * 
 * @param {Integer} totalEntries : total entries
 * @param {Object} options : the configuration for the pagination plugin
 * @param {Object} container : the container for the pagination
 */
function Pagination(totalEntries, options, container){
	if(this instanceof Pagination){
		this.totalEntries = totalEntries;
		this.options = options;
		this.container = container;
		this.totalPage = Math.ceil(this.totalEntries / this.options.pageSize);
		if(this.totalPage <= 0){
			this.totalPage = 1;
		}
		this.currentPage = options.currentPage;
		this.init();
	}else{
		return new Pagination(totalEntries, options, container);
	}
}

/**
 * The prototype for the Pagination model
 * 
 * init : initialize the pagination
 * _render : the render for the pagination
 * _bind : bind event handler for the page link
 * _pageRange : calculate the start and end point for the pagination
 */
Pagination.prototype = {
	init : function(){
		this._render();
		this._bind();
	},
	_render : function(){
		var pageRange = this._pageRange(),
			paginationContent = ['<span>Total number:' + this.totalEntries + '</span>'],
			options = this.options,
			halfPage = Math.ceil(options.numDisplays / 2),
			start = pageRange.start,
			end = pageRange.end,
			index = 1,
			numEdgeEntry = options.numEdgeEntry,
			currentPage = this.currentPage,
			totalPage = this.totalPage,
			ellipseText = options.ellipseText,
			linkable = options.linkable,
			link = options.link;
			
		// Generate "First" and "Previous" link
		
		if (currentPage > 1) {
			if (options.showFirst) {
				var href = linkable ? link.replace(/{{#page}}/, 1) : "javascript:void(0)";
				paginationContent.push('<a href="' + href + '" data-pager-pageno="1">' + options.first + '</a>');
			}
			if (options.showPrev) {
				var href = linkable ? link.replace(/{{#page}}/, currentPage - 1) : "javascript:void(0)";
				paginationContent.push('<a href="' + href + '" class="prev" data-pager-pageno="' + (currentPage - 1) + '">' + options.prev + '</a>');
			}
		}

		// Genereate the start link
		if (start > numEdgeEntry) {
			if (linkable) {
				for (; index <= numEdgeEntry; index++) {
					paginationContent.push('<a href="' + link.replace(/{{#page}}/, index) + '" data-pager-pageno="' + index + '">' + index + '</a>');
				}
			} else {
				for (; index <= numEdgeEntry; index++) {
					paginationContent.push('<a href="javascript:void(0)" data-pager-pageno="' + index + '">' + index + '</a>');
				}
			}
			if ((start - numEdgeEntry > 1) && ellipseText && numEdgeEntry > 0) {
				paginationContent.push('<span>' + ellipseText + '</span>');
			}
		} else {
			if (linkable) {
				for (; index < start; index++) {
					paginationContent.push('<a href="' + link.replace(/{{#page}}/, index) + '" data-pager-pageno="' + index + '">' + index + '</a>');
				}
			} else {
				for (; index < start; index++) {
					paginationContent.push('<a href="javascript:void(0)" data-pager-pageno="' + index + '">' + index + '</a>');
				}
			}

		}

		// Generate the pagination link
		if (linkable) {
			for (var index = start; index <= end; index++) {
				if (index === currentPage) {
					paginationContent.push("<em>" + index + "</em>");
				} else {
					paginationContent.push('<a href="' + link.replace(/{{#page}}/, index) + '" data-pager-pageno="' + index + '">' + index + '</a>');
				}
			}
		} else {
			for (var index = start; index <= end; index++) {
				if (index === currentPage) {
					paginationContent.push("<em>" + index + "</em>");
				} else {
					paginationContent.push('<a href="javascript:void(0)" data-pager-pageno="' + index + '">' + index + '</a>');
				}
			}
		}

		// Generate the end link
		if (end < totalPage - numEdgeEntry) {
			if ((totalPage - numEdgeEntry - end >= 1) && ellipseText && numEdgeEntry > 0) {
				paginationContent.push('<span>' + ellipseText + '</span>');
			}
			if (linkable) {
				for ( index = totalPage - numEdgeEntry + 1; index <= totalPage; index++) {
					paginationContent.push('<a href="' + link.replace(/{{#page}}/, index) + '" data-pager-pageno="' + index + '">' + index + '</a>');
				}
			} else {
				for ( index = totalPage - numEdgeEntry + 1; index <= totalPage; index++) {
					paginationContent.push('<a href="javascript:void(0)" data-pager-pageno="' + index + '">' + index + '</a>');
				}
			}
		} else {
			if (linkable) {
				for ( index = totalPage - numEdgeEntry + 1; index <= totalPage; index++) {
					paginationContent.push('<a href="' + link.replace(/{{#page}}/, index) + '" data-pager-pageno="' + index + '">' + index + '</a>');
				}
			} else {
				for ( index = end + 1; index <= totalPage; index++) {
					paginationContent.push('<a href="javascript:void(0)" data-pager-pageno="' + index + '">' + index + '</a>');
				}
			}
		}

		// Generate "Next" and "Last" link
		if (currentPage < totalPage) {
			if (options.showNext) {
				var href = linkable ? link.replace(/{{#page}}/, currentPage + 1) : "javascript:void(0)";
				paginationContent.push('<a href="' + href + '" class="next" data-pager-pageno="' + (currentPage + 1) + '">' + options.next + '</a>');
			}
			if (options.showLast) {
				var href = linkable ? link.replace(/{{#page}}/, totalPage) : "javascript:void(0)";
				paginationContent.push('<a href="' + href + '" class="last" data-pager-pageno="' + totalPage + '">' + options.last + '</a>');
			}
		}

		// Generate the jump area
		if (options.jumpable) {
			paginationContent.push('<span>To</span><input type="text" class="pagination_plugin_jump">page<input type="button" class="pagination_plugin_button" value="Confirm">');
		}
		
		// Generate the content
		$(this.container).html(paginationContent.join(""));
	},
	_bind : function(){
		var $this = this,
			container = $($this.container),
			options = $this.options;
		container.delegate("a","click",function(){
			var currentPage = parseInt($(this).attr("data-pager-pageno"),10);
			$this.currentPage = currentPage;
			$this._render();
			options.callback && options.callback(currentPage);
		});
		
		if($this.options.jumpable){
			container.delegate(".pagination_plugin_button","click",function(){
				var jumpValue = $.trim(container.find(".pagination_plugin_jump").val());
				if(jumpValue !== ""){
					jumpValue = parseInt(jumpValue,10);
					if(jumpValue > $this.totalPage){
						jumpValue = $this.totalPage;
					}
					if(jumpValue !== $this.currentPage){
						$this.currentPage = jumpValue;
						$this._render();
						options.callback && options.callback(jumpValue);
					}
				}
			}).delegate(".pagination_plugin_jump","keyup keydown",function(event){
				var keyCode = event.keyCode;
				if( (keyCode < 48 && keyCode !== 8) || keyCode > 57){
					event.preventDefault();
				}
			});
		}
	},
	_pageRange : function(){
		var start, end, 
			halfPage = Math.ceil(this.options.numDisplays / 2), 
			upperLimit = this.totalPage - this.options.numDisplays,
			currentPage = this.currentPage;
		start = currentPage > halfPage ? Math.max(Math.min(upperLimit, currentPage - halfPage), 1) : 1;
		end = currentPage > halfPage ? Math.min(currentPage + halfPage - 1, this.totalPage) : Math.min(this.options.numDisplays, this.totalPage);
		return {
			start : start,
			end : end
		};
	}
};

/**
 * 
 * @param {Integer} totalEntries : the total entries
 * @param {Object} options : the configuration for the Pagination
 * 		@param {Integer} pageSize : the pageSize
 * 		@param {String} first : the text for the first page button
 * 		@param {String} last : the text for the last page button
 * 		@param {String} prev : the text for the previous button
 * 		@param {String} next : the next for the next button
 * 		@param {Integer} currentPage : current page index
 * 		@param {Boolean} showFirst : whether always show the first page button
 * 		@param {Boolean} showLast : whether always show the last page button
 * 		@param {Boolean} showPrev : whether always show the previous page button
 * 		@param {Boolean} showNext : whether always show the next page button
 * 		@param {Integer} numDisplays : Number of pages to show
 * 		@param {Integer} numEdgeEntry : side to display for the pagination
 * 		@param {String} ellipseText : the ellipse text
 * 		@param {Function} callback : the callback
 * 		@param {Boolean} linkable : whether the pagination linkable
 * 		@param {String} link : the link for the pagination
 */
jQuery.fn.pagination = function(totalEntries,options){
	options = $.extend({
		pageSize : 10,
		first : "First",
		last : "Last",
		prev : "Prev",
		next : "Next",
		currentPage : 1,
		showFirst : true,
		showLast : true,
		showPrev : true,
		showNext : true,
		numDisplays : 6,
		numEdgeEntry : 1,
		ellipseText : "...",
		callback : function() {
			return false;
		},
		linkable : false,
		link : "",
		jumpable : false
	}, options || {});

	this.each(function() {
		Pagination(totalEntries, options, $(this));
	});
};