/* ==========================================================================
   Main Layout
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 05/02/2014
   ========================================================================== */

define(function(require) {
	'use strict';
	var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        template = require('text!templates/ava/three-columns-template.html');
	require('livicons');

	return Marionette.Layout.extend({
		template: _.template(template),
		regions: {
			breadcrumb: '#breadcrumb',
			actions: '#actions',
			content: '#main-holder',
			flashMessageInner: '#flashMessageInner'
		},
		onShow: function () {
		    try{
		        $('#dock i').addLivicon({ size: 26, color: '#4270a1' });
		    }catch(e)
		    {
		        console.error("Erro ao iniciar icones animados por dependencia");
		    }
		    try {
		        $(document).ready(function () {
		            $('#dock i').addLivicon({ size: 26, color: '#4270a1' });
		        });
		    }catch(e)
		    {
		        console.error("Erro ao iniciar icones animados no domcument.ready");
		    }
		}
	});
});
