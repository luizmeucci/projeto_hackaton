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

	var Model = Backbone.Model.extend({});

	return Backbone.Collection.extend({
	    initialize: function (contract) {
	        this.contract = contract;
	    },
	    contract: null,
	    parse: function (response) {
	        var retorno;
	        try{
	            retorno = response[this.contract];
	        } catch (e) {
	            retorno = response;
	        }
	        return retorno;
		},
		model: Model
	});
});