/* ==========================================================================
   Carregar Rota
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 27/05/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var $ = require('jquery');
	var _ = require('underscore');

	return function (url) {
		var rotasUrl = {
			'flash': 'http://ava.grupouninter.com.br/claroline176/courses/U9143D24821/document/aulas/aula1/index.html',
			'html': 'http://172.16.41.73:1000/rota/rota.htm'
		},

		iframe = $('<iframe>', { 'class': 'un-iframe-content', 'src': url, 'allowfullscreen': true });

		return iframe;
	};
});