/* ==========================================================================
   Comunicados Collection
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 03/03/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');

	var RelatorioPericulosidadeModel = Backbone.Model.extend({});

	return Backbone.Collection.extend({
	    parse: function (response) {
	        if (response.usuarios !== null && response.usuarios !== null) {
	            return response.usuarios;
	        } else {
	            return null;
	        }
		},
		model: RelatorioPericulosidadeModel
	});
});