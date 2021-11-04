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

	var GrupoEstruturaModel = Backbone.Model.extend({});

	return Backbone.Collection.extend({
		parse: function (response) {
		    return response.grupoEstruturas;
		},
		model: GrupoEstruturaModel
	});
});