/* ==========================================================================
   Model Publicidade Página de Login
   ========================================================================== */

define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	var publicidadeLogin = Backbone.Model.extend({

		defaults : {
			title   	: "Não Especificado",
			description : "Não Especificado",
			img  		: "Não Especificado",
			href  		: "Não Especificado"
		}

	});

	return publicidadeLogin;
});