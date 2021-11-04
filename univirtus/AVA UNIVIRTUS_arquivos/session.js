/* ==========================================================================
   Model Session
   ========================================================================== */

define([
    'jquery',
    'underscore',
    'backbone',
    'libraries/storageWrap',
    'config/AppConfig',
    'libraries/Helpers',
    'libraries/redirecter',
    'libraries/logger',
    'libraries/sessionStorage'
], function ($, _, Backbone, Storage, Config, Helpers, redirecter, logger) {
    'use strict';

    var session = Backbone.Model.extend({
        initialize : function initialize (options) {
            var self = this;
            this.mensagem;
            Storage.setAdaptor(sessionStorage);

            // Monitora as mudanças no model e armazena uma nova Sessão no sessionStorage
            self.on('change', function (model) {                
                self.create();
            });
        },

        idAttribute: 'idUsuario',
        status: 'statusTeste',

        parse: function parse(resp) {            
            if (resp.mensagem) this.mensagem = resp.mensagem;
            return resp.usuario;
        },

        url: Config.baseUrl() + 'autenticacao/autenticar',

		checkCreds : function checkCreds (creds) {
			// Credenciais não informadas. Tentar pegar a informação da session Storage.
            if ( !creds ) {
                var user = Storage.getItem('user');
                if ( user ) { this.set(user); }
                else { redirecter({'message': 'Sua sessão expirou. Por favor, efetue o login novamente.'}); }
            }

            // Tentar efetuar o login com as credenciais fornecidas
            else {
                
                // Lógica para checagem das credenciais
                // Fazer POST dos dados para a url de autenticação do servidor
                var response = this.fetchCollection({'url': this.url, type: 'POST', data: creds });
                return response;
            }
		},

		loginByURL : function loginByURL (hash) {
		    var url = this.url + '?' + hash;

		    //pode haver enquetes na session do usuario anterior, então, remove:
		    Storage.removeItem('enquetes');
		    Storage.removeItem('lastOpenedCourse');		    
		    Storage.removeItem('acessoRoa');
		    Storage.removeItem('appId');
			var response = Helpers.ajaxRequest({ 'url': url });
			if ( response ) { this.set(response.usuario); }

			return response;
		},

		fetchCollection: function fetchCollection (options) {

			var defer = $.Deferred();

            var defaults = {
				url: this.url,
				type: 'GET',              
				success: function (r) {
				    
				    Storage.removeItem('acessoRoa');
				    defer.resolve(r);
				    
				},
				error: function (xhr, error, objResponse) {     
                              
				defer.reject(xhr, error, objResponse);
				}
			};

			var opts = _.defaults(options, defaults);
			
            if ( options.data ) { opts.data = options.data; }
            
            this.fetch(opts);
			
            return defer.promise();
		},

		// Cria uma sessão
		create: function create() {

		    if(!window.name)
		    {
		        window.name = Helpers.getRandomInt(999,999999);
		    }

		    if (this.attributes.window == void(0))
		    {
		        this.attributes.window = window.name;
		    }

		    
			Storage.setItem('user', this.attributes);
		},

        // Cria novos itens
        setItems: function setItems (items) {
            if (typeof items !== 'object') {
                throw new Error('Esperado: "object"; Fornecido: %s', typeof item);
            }
            this.set(items);
        },

		// Destrói a sessão
		flush : function flush () {
            var self = this,
                fadeAndRedirect = function fadeAndRedirect () {
                    $.when($('#page').fadeOut()).done(function () {
                        var storage = Storage.getItem('storage');
                        // Limpa o conteúdo antes de redirecionar (para evitar itens não estilizados aparecendo na página)
                        $('#midContentHolder').empty().html('Carregando conteúdo. Por favor, aguarde...');
                        $('#headerItemView').empty();

                        // Remove os itens do sessionStorage
                        Storage.removeItem('user');
                        Storage.removeItem('leftSidebarItemView');
                        Storage.removeItem('enquetes');                        
                        Storage.removeItem('lastOpenedCourse');                        
                        Storage.removeItem('acessoRoa');
                        // Redireciona para a página de login
                        if ( storage && storage.isEja ) {
                            redirecter({ 'url': '#/eja' });
                        } else {
                            redirecter();
                        }

                        $('#page').removeClass('pap inner eja ava hide');

                        setTimeout(function () {
                            $('#page').fadeIn();

                            self.trigger('destroyed');
                        }, 500);
                    });
                };

            this.destroy({
                success: function successCallback (x, y, z) {
                    fadeAndRedirect();
                },
                error: function errorCallback (x, y, z) {
                    fadeAndRedirect();
                }
            });
		}
	});

	return session;
});