/* ==========================================================================
   Collection Publicidade Página de Login
   ========================================================================== */

define([
	'underscore',
	'backbone',
	'models/AdvLoginModel'
], function(_, Backbone, AdvLoginModel) {
	var PublicidadesLoginCollection = Backbone.Collection.extend({

		model : AdvLoginModel,

		initialize : function () {
			var self = this;

			// @TODO: Aguardando implementação server-side. Aqui está hardcoded.
			var adv = [
                {
                    "title": "Enade 2020",
                    "description": 'Clique na imagem e saiba mais. ',
                    "img": "enade2020.jpg",
                    "href": "https://portal.uninter.com/enade-home/"
                },
                {
                    "title": "",
                    "description": 'Participe do ADD AMIGOS, programa de indicações da Uninter, e descubra que uma amizade é mais valiosa do que imagina.',
                    "img": "slider-add-amigo-2019.jpg",
                    "href": "https://www.uninter.com/addamigos/"
                }
			];

			// Para cada item do json, cria um model.
			_.each(adv, function(ad) {
				self.addOne(ad);
			});

		}, 

		addOne : function (obj) {
			var self = this;
			var pub = new AdvLoginModel({ 'title': obj.title, 'description' : obj.description, 'img' : obj.img, 'href' : obj.href });
			self.add(pub);
		},


	});

	return PublicidadesLoginCollection;
});