/* ==========================================================================
   Process Collection
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 28/04/2014
   ========================================================================== */
define(function (require) {
	'use strict';

	var $ = require('jquery');
	var _ = require('underscore');

	return function (options) {

        var defaults = {
            containerViewInstance: null,
            serverResponse: null,
            viewClass: null,
            viewTemplate: null,
            viewDataHandler: null, // function
            nestedViewClass: null,
            nestedViewTemplate: null,
            nestedViewDataHandler: null, // function
            nestedViewModelProperty: null,
            nestedViewHTMLElementSelector: null,
            onRenderAfter: null,
            exibirDetalhesAtividade: false
            

        },

		opts = _.defaults(options, defaults),

		toJSON = function (model) {
			var data;
			if ( model instanceof Backbone.Model ) { data = model.toJSON(); } 
			else { data = model; }

			return data;
		},

		argumentsToArray = function (args) {
			return [].slice.apply(args);
		},

		itemRendered,

		render = function () {
			var args = argumentsToArray(arguments),                
				val = args[0],
				dataHandler = args[1],
				template = args[2],
				dataHandlerData = args[3],                
				data = toJSON(val), item, el;
			
			if ( dataHandler && typeof dataHandler === 'function' ) {
				dataHandlerData.dataHandlerData.attrs = val;
				data = dataHandler( dataHandlerData.dataHandlerData );
			}
			var idSalaVirtualEstrutura = dataHandlerData.dataHandlerData.attrs.id;
			
			if (opts.viewClass) {			    
			    item = new opts.viewClass({ 'id': (data.idPrefix) ? data.idPrefix + idSalaVirtualEstrutura : idSalaVirtualEstrutura, 'template': template });
			    
			    el = item.render(data).$el;			    
			    itemRendered = el;

			   
			    if (opts.exibirDetalhesAtividade) {			        
			        if (!data.ativa)
			            el.addClass("disabled");			        
			    }
			}
			else {
				item = new opts.nestedViewClass({'id': data.salaVirtualAtividadeId, 'template': template, 'idAtividade': data.idAtividade, 'salaVirtualAtividadeId': data.salaVirtualAtividadeId });
				el = item.render(data).$el;
				
				// Encontra o item pai atual (estrutura) e renderiza o conteúdo
				$('#' + data.svEstruturaId).find(opts.nestedViewHTMLElementSelector).append(el);

			    //el.trigger('click');
				if (opts.exibirDetalhesAtividade) {
				    
				    if (!data.ativa)
				        el.addClass("disabled");
				    var eleHeader = el.find('.uninter-atv-header').trigger('click');
				}
			}
			
			
			if (data.classeAtividade) {
			    el.addClass(data.classeAtividade);
			}
			if ( opts.onRenderAfter && typeof opts.onRenderAfter === 'function' ) {
				opts.onRenderAfter();
			}
		},

		process = function (viewDataHandler, nestedViewDataHandler) {
			var items;

			if ( opts.serverResponse.models ) { items = opts.serverResponse.models; }
			else { items = opts.serverResponse; }

			// Backbone Model && parent view
			if ( opts.serverResponse.models ) {
				_.each(items, function (val, key, obj) {
					itemRendered = itemRendered || null;
					render( val, viewDataHandler, opts.viewTemplate, {dataHandlerData: { 'key': key, 'obj': obj }} );

					opts.containerViewInstance.addOne(itemRendered);
				});
			} 

			// Normal Ajax Request && nested view
			else {
				_.each(opts.serverResponse, function(val, key, obj) {
					itemRendered = ( $('#unAccordion li.un-accordion-item').length ) ? $('#unAccordion li.un-accordion-item') : null;
					render(val, nestedViewDataHandler, opts.nestedViewTemplate, {dataHandlerData: { 'key': key, 'obj': obj }});
				});
			}

			if (opts.exibirDetalhesAtividade) {
			    var el = itemRendered.find('.uninter-atv-item').addClass('active');
			    el.find('.uninter-atv-header').addClass('clicked');
			}
		};
		process(opts.viewDataHandler, opts.nestedViewDataHandler);
	};

});