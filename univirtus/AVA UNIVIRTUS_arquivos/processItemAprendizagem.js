/* ==========================================================================
   Process Item Aprendizagem
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 29/05/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var $ = require('jquery');
	var _ = require('underscore');
	var AnexosView = require('views/common/AnexosView');

	return function (parameters) {
		var parsedArray = [],
		allowedTypes = {
			anexo: 3,
			video: 4,
			rota: 6 
		},
		type = null;

		// Handlers
		var itemAprendizagemhandlers = {
			'anexo': function(parameters) {
				/*
				 * @param ind id
				 * @param int salaVirtualAtividadeId
				 * @param string nome
				 * @param string extensao
				 * @param string url
				 * @param string nomeAcao
				 */
				var arr = [], idTipoRotulo = 3,
					Collection = Backbone.Collection.extend({
						model: Backbone.Model.extend({})
					});

				arr.push({
					nome: parameters.item.nome,
					extensao: parameters.item.extensao,
					id: parameters.item.id,
					url: parameters.item.url,
					nomeAcao: parameters.item.nomeAcao
				});

				// Montando a collection
				var collection = new Collection(arr),
				actions = parameters.atvAdmActions({
					'salaVirtualAtividadeId': parameters.salaVirtualAtividadeId,
					'editar': parameters.viewCheckPerms('editar', parameters.perms),
					'remover': parameters.viewCheckPerms('remover', parameters.perms)
				}), 
				rendered = null;
				rendered = new AnexosView({'collection': collection, 'totalAnexos': collection.models.length});
				
				var view = $('<div>').append(actions).append(rendered.render().$el);
				return view;
			},

			'video': function (parameters) {
				/*
				 * @param int salaVirtualAtividadeId
				 * @param string nome
				 * @param string texto
				 * @param function viewCheckPerms
				 * @param object perms
				 */
				var actions, idTipoRotulo = 4;
				actions = atvActions({
					'salaVirtualAtividadeId': parameters.item.salaVirtualAtividadeId,
					'atvArquivoUrl': parameters.item.texto,
					'atvAcao': parameters.nomeAcao,
					'editar': parameters.viewCheckPerms('editar', parameters.perms),
					'remover': parameters.viewCheckPerms('remover', parameters.perms),
					'atvType': 'video'
				});
				return actions;			
			},

			'rota': function (parameters) {
				var actions, idTipoRotulo = 6;
				actions = atvActions({
					'salaVirtualAtividadeId': null,
					'atvArquivoUrl': parameters.item.texto,
					'atvAcao': parameters.item.nomeAcao,
					'atvType': 'rota',
					'editar': false,
					'remover': false
				});
			return actions;
			}
		};

		function parse(data) {
			_.each(data, function (atvItemAprendizagem) {
				var obj = _.pick(atvItemAprendizagem, ['id', 'idAtividade', 'nomeAcao']);

				_.each(atvItemAprendizagem.itemAprendizagemEtiquetas, function (itemAprendizagemEtiqueta) {
					var etiquetaProps = _.pick(itemAprendizagemEtiqueta, 'idTipoRotulo');
					var repositorioProps = {};
					_.extend(repositorioProps, itemAprendizagemEtiqueta.sistemaRepositorio);
					_.extend(etiquetaProps, repositorioProps);
					_.extend(obj, etiquetaProps);
				});
				parsedArray.push(obj);
			});
		};

		function process (parameters) {
			var types = _.invert(allowedTypes), arr = [];
			_.each(parameters.data, function (item) {
				debugger;
				parameters.item = item;
				arr.push(itemAprendizagemhandlers[ types[item.idTipoRotulo] ](parameters));
			});
		};

		// Renderiza o item com base no handler informado
		function render (fnParams) {
			/*
			 * @param object fnParams
			 * @param function fnParams.viewCheckPerms
			 * @param object fnParams.perms
			 * @param int fnParams.salaVirtualAtividadeId
			 */
			var handlerParams = _.pick(fnParams, ['viewCheckPerms', 'perms', 'atvAdmActions', 'salaVirtualAtividadeId']);
			handlerParams.data = parsedArray;

			if ( !fnParams.viewCheckPerms ) { throw new Error('viewCheckPerms indefinido.'); }
			if ( !fnParams.perms ) { throw new Error('perms indefinido.'); }			

			process(handlerParams);
		};

		// Monta o JSON
		parse(parameters.atividadeItemAprendizagens);

		return {
			'render': render,
			'getJSON': parsedArray
		}
	};
});