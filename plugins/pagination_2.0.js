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
 * Usage		$(function(){
				 	$(".pager").pagination({
				 		totalEntries : 200,
						currentPage : 8,
						numEdgeEntry : 3,
						alwaysShowFirst : true,
						jumpable : true,
						linkable : false,
						link : "{{page}}.html"
					});
				});
					
 * Version		2.3
 * Date			2014-8-28 19:40:10
 * Changelog	. Optimize the code
 * 
 * Version		2.4
 * Date			2014-9-2 11:18:18
 * Changelog	. Optimize the code
 * 				. Add parameter 'showTotalInfo'
 * 				. Add parameter 'showTotalpage'
 * Usage		$(function(){
				 	$(".pager").pagination({
				 		totalEntries : 7,
						currentPage : 8,
						numEdgeEntry : 3,
						alwaysShowFirst : true,
						jumpable : true,
						linkable : false,
						link : "{{page}}.html"
					});
				});
 */

/**
 * The Pagination model
 * 
 * @param {Integer} totalEntries : total entries
 * @param {Object} options : the configuration for the pagination plugin
 * @param {Object} container : the container for the pagination
 */
function Pagination(options, container){
	if(this instanceof Pagination){
		this.options = options;
		this.container = container;
		this.totalPage = Math.ceil(options.totalEntries / this.options.pageSize);
		if(this.totalPage <= 0){
			this.totalPage = 1;
		}
		this.currentPage = options.currentPage;
		this.init();
	}else{
		return new Pagination(options, container);
	}
}

/**
 * The prototype for the pagination model
 * 
 * init : initialize the pagination
 * _render : the render for the pagination
 * _bind : bind event handler for the page link
 * _pageRange : calculate the start and end point for the pagination
 * _bind : event handler for the pagination
 * _pageLinkGenerator : the page link generator
 */
Pagination.prototype = {
	init : function(){
		this._render();
		this._bind();
	},
	_render : function(){
		var pageRange = this._pageRange(),
			options = this.options,
			paginationContent = [],
			halfPage = Math.ceil(options.numDisplays / 2),
			start = pageRange.start,
			end = pageRange.end,
			index = 1,
			numEdgeEntry = options.numEdgeEntry,
			currentPage = this.currentPage,
			totalPage = this.totalPage,
			ellipseText = options.ellipseText,
			linkable = options.linkable,
			link = options.link,
			edgeEntry;
			
		// Generate total info
		if(options.showTotalInfo){
			paginationContent.push('<span>Items: ' + options.totalEntries + '</span>');
		}
			
		// Generate "First" and "Previous" link
		if (currentPage > 1) {
			if (options.showFirst) {
				paginationContent.push('<a href="' + this._pageLinkGenerator(1) + '" data-pager-pageno="1">' + options.first + '</a>');
			}
			if (options.showPrev) {
				paginationContent.push('<a href="' + this._pageLinkGenerator(currentPage - 1) + '" class="prev" data-pager-pageno="' + (currentPage - 1) + '">' + options.prev + '</a>');
			}
		}

		// Genereate the start link
		edgeEntry = start > numEdgeEntry ? numEdgeEntry + 1 : start;
		for (; index < edgeEntry; index++) {
			paginationContent.push('<a href="' + this._pageLinkGenerator(index) + '" data-pager-pageno="' + index + '">' + index + '</a>');
		}
		if ( (start - numEdgeEntry > 1) && ellipseText) {
				paginationContent.push('<span>' + ellipseText + '</span>');
		}

		// Generate the pagination link
		for (var index = start; index <= end; index++) {
			if (index === currentPage) {
				paginationContent.push("<em>" + index + "</em>");
			} else {
				paginationContent.push('<a href="' + this._pageLinkGenerator(index) + '" data-pager-pageno="' + index + '">' + index + '</a>');
			}
		}

		// Generate the end link
		edgeEntry = end < totalPage - numEdgeEntry ? totalPage - numEdgeEntry + 1 : end + 1;
		if ((totalPage - numEdgeEntry - end >= 1) && ellipseText) {
			paginationContent.push('<span>' + ellipseText + '</span>');
		}
		for ( index = edgeEntry; index <= totalPage; index++) {
			paginationContent.push('<a href="' + this._pageLinkGenerator(index) + '" data-pager-pageno="' + index + '">' + index + '</a>');
		}

		// Generate "Next" and "Last" link
		if (currentPage < totalPage) {
			if (options.showNext) {
				paginationContent.push('<a href="' + this._pageLinkGenerator(currentPage + 1) + '" class="next" data-pager-pageno="' + (currentPage + 1) + '">' + options.next + '</a>');
			}
			if (options.showLast) {
				paginationContent.push('<a href="' + this._pageLinkGenerator(totalPage) + '" class="last" data-pager-pageno="' + totalPage + '">' + options.last + '</a>');
			}
		}

		// Generate the jump area
		if (options.jumpable) {
			paginationContent.push('<span>To</span><input type="text" class="pagination_plugin_jump"><input type="button" class="pagination_plugin_button" value="Confirm">');
		}
		
		// Generate the total page
		if(options.showTotalPage){
			paginationContent.push('<span>Pages :' + totalPage + '</span>');
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
		start = currentPage > halfPage ? Math.max(Math.min(upperLimit + 1, currentPage - halfPage), 1) : 1;
		end = currentPage > halfPage ? Math.min(currentPage + halfPage + 1, this.totalPage) : Math.min(this.options.numDisplays, this.totalPage);
		return {
			start : start,
			end : end
		};
	},
	_pageLinkGenerator : function(pageNum){
		return this.options.linkable ? this.options.link.replace(/{{page}}/, pageNum) : "javascript:void(0)";
	}
};

/**
 * The pagination plugin
 * 
 * @param {Object} options : the configuration for the pagination
 * 		@param {Integer} totalEntries : the total entries
 * 		@param {Integer} pageSize : the pageSize
 * 		@param {String} first : the text for the first page button
 * 		@param {String} last : the text for the last page button
 * 		@param {String} prev : the text for the previous button
 * 		@param {String} next : the next for the next button
 * 		@param {Integer} currentPage : current page index
 * 		@param {Boolean} showTotalInfo : whether show the total info
 * 		@param {Boolean} showFirst : whether show the first page
 * 		@param {Boolean} showLast : whether show the last page
 * 		@param {Boolean} showPrev : whether show the previous page
 * 		@param {Boolean} showNext : whether show the next page
 * 		@param {Boolean} showTotalPage : whether show the total page info
 * 		@param {Integer} numDisplays : Number of pages to show
 * 		@param {Integer} numEdgeEntry : side to display for the pagination
 * 		@param {String} ellipseText : the ellipse text
 * 		@param {Function} callback : the callback
 * 		@param {Boolean} linkable : whether the pagination linkable
 * 		@param {String} link : the link for the pagination.If the parameter 'linkable' is 'true',ensure this parameter contains '{{page}}'
 */
jQuery.fn.pagination = function(options){
	options = $.extend({
		totalEntries : 0,
		pageSize : 10,
		first : "首页",
		last : "末页",
		prev : "上一页",
		next : "下一页",
		currentPage : 1,
		showTotalInfo : true,
		showFirst : true,
		showLast : true,
		showPrev : true,
		showNext : true,
		showTotalPage : true,
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
		Pagination(options, $(this));
	});
};