/* ==========================================================================
   Inicializador da Aplicação
   ========================================================================== */
window.UNINTER = window.UNINTER || { };

define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _  = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        Helpers = require('libraries/Helpers'),
        redirecter = require('libraries/redirecter'),
        flashMessage = require('libraries/flashMessage'),
        StorageWrap = require('libraries/StorageWrap'),
        auth = require('libraries/auth'),
        LazyLoader = require('libraries/LazyLoader'),
        AppConfig = require('config/AppConfig'),
        LoadingView = require('views/common/LoadingItemView'),
        SlidingView = require('libraries/SlidingView'),
        viewManager = require('libraries/viewManager'),
        Session = require('models/session'),
        polyfill = require('polyfills/polyfill'),
        logger = require('libraries/logger'),
        textEllipsis = require('libraries/textEllipsis'),
        Storage = require('libraries/sessionStorage'),
        overlay = require('libraries/overlayDialog'),
        printable = require('libraries/printable'),
        location = require('system/location'),

        App = new Marionette.Application();

    // Regiões da Aplicação
    // Podem conter Views, Layouts ou SubRegions, aninhadas conforme necessário
    // Cada Region deve corresponder a um elemento existente na index.html
    App.addRegions({
        'headerItemView': '#headerItemView',
        'mainRegion'  : '#midContentHolder',
        'leftSidebarItemView' : '#leftSidebarItemView',
        'rightSidebarItemView' : '#rightSidebarItemView',
        'footerItemView': '#footerItemView',
        'actionbar': '#actionbar'
    });

    App.on('initialize:before', function () {

        App.config.objetoGlobalUNINTER();
        App.config.ajaxSetup().init();

        App.headerItemView.on('show', function headerItemViewShow() {
            App.headerItemView.currentView.on('logout', function appLogout() {
                App.session.set("menuPrincipal", void (0));
                App.session.set("LeftSideBarSala", void (0));
                App.session.set("MenuHeader", void (0));
                App.session.set("escolasUsuario", void (0));
                App.session.flush();
                App.session.on('destroyed', function() {
                    App.sessionstorage.clear();
                });

            });
        });


         
        // Tratando os erros de AJAX
        $(document).ajaxError(function (x, y) {
            if ( y.status === 401 || y.status === 405 ) {
                
               //407 - 502
                var msg = '';
                if (y.status === 401) {
                    msg = 'Você não tem permissão para visualizar este conteúdo.';
                    App.redirecter({ delay: 0, message: msg });
                }
                else if (y.status === 405) {
                    //msg = 'Você precisa estar autenticado para visualizar este conteúdo!';
                    msg = auth.permissaoAppUninter();
                }
            }
            
        });

        //tooltip
        $('body').tooltip({
            selector: '[data-toggle=tooltip]'            
        });

    });

    var getSession = function getSession() {
            var session = App.session;
            if ( !session ) { session = new Session(); }
            return session;
        },

        registerRouteEventCallback = function registeRouteEventCallback () {
            var Event = Backbone.Model.extend({
                    'type': null,
                    'callback': null
                }),

                Events = Backbone.Collection.extend({
                    model: Event,
                    defaults: {
                        'type': null,
                        'callback': null,
                        'repeat': true,
                        'executed': false
                    }
                }),

                events = null,

                add = function add(attributes) {
                    events.add( new Event(attributes) );
                },

                get = function get(type) {
                    return Events.byType(type);
                },

                listenToAdd = function listenToAdd () {
                    events.on('add', function onAdd(model) {
                        var m = model.toJSON();

                        App.vent.on('route:' + m.type + ':fuck', m.callback);

                        // Ajusta o item para executed = true
                        model.set('executed', true);
                    });
                },

                init = function init() {
                    events = events || new Events();
                    listenToAdd();
                };

            init();

            return {
                'add': add,
                'get': get
            };
        };

    App.addInitializer(function addInitializer() {
        // Iniciando o History, necessário para o funcionamento dos Routers
        Backbone.history.start();

        var registerRouteEvent = registerRouteEventCallback();

        App.vent.on('route:before', function onRouterBefore () {
            if ( typeof  App.onRouteBefore === 'function' ) {
//                registerRouteEvent.add({ 'type': 'before', 'callback': App.onRouteBefore });
                App.onRouteBefore();
            }

            if ( typeof  window.UNINTER.onRouteBefore === 'function' ) {
                window.UNINTER.onRouteBefore();
//                registerRouteEvent.add({ 'type': 'before', 'callback': window.UNINTER.onRouteBefore });
            }
        });

        App.vent.on('route:after', function onRouterAfter () {

            if ( typeof  App.onRouteAfter === 'function' ) {
                App.onRouteAfter();
            }

            if ( typeof  App.onRouteAfter === 'function' ) {
                window.UNINTER.onRouteAfter();
            }

            // Focando um elemento da página após a troca de rota
            // Isso é feito devido por uma questão de acessibilidade = avisa aos leitores de tela que o conteúdo
            // foi modificado.
            setTimeout(App.setPageFocus, 5000);
            App.setPageFocus();

        });

        polyfill();
    });

    // Namespace Global
    //window.UNINTER = window.UNINTER || {};

    // Tornando as Libraries, Helpers e Config disponíveis a
    // instância de App para facilitar a utilização dentro da
    // aplicação.
    App.Helpers = Helpers;
    App.redirecter = redirecter;
    App.flashMessage = window.UNINTER.flashMessage = flashMessage;
    App.StorageWrap = StorageWrap;
    App.auth = auth;
    App.config = AppConfig;

    App.registerRouterEventCallback = window.UNINTER.registerRouterEventCallback = registerRouteEventCallback();

    App.session = window.UNINTER.session = getSession();
    App.sessionstorage = window.UNINTER.sessionStorage = new Storage();

    App.logger = window.UNINTER.logger = logger();
    App.LazyLoader = LazyLoader;
    App.loadingView = window.UNINTER.loadingView = LoadingView;
    App.slidingView = SlidingView;
    App.viewManager = window.viewManager = viewManager();
    App.overlay = window.UNINTER.overlay = overlay;
    App.printable = window.UNINTER.printable = printable;

    App.onRouteBefore = window.UNINTER.onRouteBefore = null;

    App.onRouteAfter = window.UNINTER.onRouteAfter = null;

    App.location = window.UNINTER.location = location;

    App.Historico = {
        all : function(){
            return Helpers.cookie.get("historiconavegacao").split("|");
        },
        ultimaPagina: function () {
            var all = Helpers.cookie.get("historiconavegacao").split("|");
            var total = (all.length - 2);
            return all[total];
        },
        paginaAtual: function () {
            var all = Helpers.cookie.get("historiconavegacao").split("|");
            var total = (all.length - 1);
            return all[total];
        },
        set: function(rotina){
            var cookie = Helpers.cookie.get("historiconavegacao");
            cookie = cookie + "|" + rotina;
            Helpers.cookie.set("historiconavegacao", cookie, 1);
        }
    };

    // Flag para sinalizar
    window.UNINTER.ajaxLoadBypass = false;

    //Tornamos o metodo de exibição de mensagens aberto.
    window.UNINTER.flashMessage = App.flashMessage;

    window.UNINTER.redirecter = App.redirecter;

    //Deixamos as funções de ajuda disponiveis para os JS dos HTML utilizados pea view dinamica..
    window.UNINTER.Helpers = Helpers;

    window.UNINTER.Helpers.textEllipsis = textEllipsis;

    //Funcao que retorna a URL do Webservice.
    window.UNINTER.AppConfig = AppConfig;

    //Metodos para capturar dados do usuario logado.
    window.UNINTER.StorageWrap = StorageWrap;

    App.setPageFocus = window.UNINTER.setPageFocus = function setPageFocus() {
        $('#page').focus();
    };

    window.UNINTER.Helpers.Auth = App.auth;

    // Helper para buscar o nome da sala virtual pelo id. Foi colocado aqui para evitar problemas de dependência circular
    // entre config e helpers.
    App.Helpers.getNomeSalaVirtual = window.UNINTER.Helpers.getNomeSalaVirtual = function getNomeSalaVirtual(id) {
       
        var url;
        if (!isNaN(id)) {
            url = AppConfig.UrlWs('ava') + 'SalaVirtual/' + id + '/Get';
        }
        else {
            url = AppConfig.UrlWs('ava') + 'SalaVirtual/0/Get?id=' + encodeURIComponent(id);
        }

        var config = { url: url }, req;
        try {
            req = this.ajaxRequest(config);
        } catch (e) { App.logger.dir(e); }
        var data = false;
        if ( req.salaVirtual ) {
            data = req.salaVirtual.titulo;
        }

        data = data || '';

        return data;
    };

    App.Helpers.getSalaVirtual = window.UNINTER.Helpers.getSalaVirtual = function getNomeSalaVirtual(id) {
       
     
        if (!isNaN(id)) {
            var config = { url: AppConfig.UrlWs('ava') + 'SalaVirtual/' + id + '/Get' }, req;
        }
        else {
            var config = { url: AppConfig.UrlWs('ava') + 'SalaVirtual/0/Get?id='+ encodeURIComponent(id)  }, req;
        }
        try {
            req = this.ajaxRequest(config);
        } catch (e) { App.logger.dir(e); }
        var data = false;
        if (req.salaVirtual) {
            data = req.salaVirtual;
        }

        data = data || '';

        return data;
    };
    
    App.Helpers.getCodigoOfertAtual = window.UNINTER.Helpers.getCodigoOfertAtual = function getCodigoOfertAtual(id) {
        
        var user = StorageWrap.getItem('user');
        var objSala = StorageWrap.getItem('leftSidebarItemView');

        if (objSala != void (0) && user != void(0) && objSala.idSalaVirtual == id && objSala.idUsuario == user.idUsuario) {
            return objSala;
        } else {


            var config = { url: AppConfig.UrlWs('sistema') + 'UsuarioSalaVirtualOferta/' + id + '/Atual' }, req;

            try {
                req = this.ajaxRequest(config);
            } catch (e) { App.logger.dir(e); }
            var data = false;
            if (req.usuarioSalaVirtualOferta) {
                data = req.usuarioSalaVirtualOferta;
            }

            data = data || '';

            delete data.disciplinaOferta;

            data.ofertaMaster = (data.totalFilhas > 0);
            data.idUsuario = user.idUsuario;

            StorageWrap.setItem('leftSidebarItemView', data);

            return data;

        }

        /*

        var config = { url: AppConfig.UrlWs('sistema') + 'UsuarioSalaVirtualOferta/' + id + '/Atual' }, req;

        try {
            req = this.ajaxRequest(config);
        } catch (e) { App.logger.dir(e); }
        var data = false;
        if (req.usuarioSalaVirtualOferta) {
            data = req.usuarioSalaVirtualOferta;
        }

        data = data || '';

        return data;
        */
    };

    App.Helpers.getPermissaoTCC = window.UNINTER.Helpers.getPermissaoTCC = function getPermissaoTCC(id) {
        console.info("Faz requisicao permissao TCC");
        var config = { url: AppConfig.UrlWs('interacao') + 'PermissaoTCCSalaVirtual/' + id + '/GetPermissaoSalaVirtual' }, req;

        try {
            req = this.ajaxRequest(config);
        } catch (e) { App.logger.dir(e); }

        var data = false;

        if (req.permissaoTCCSalaVirtuais) {
            data = true;
        }

       // data = data || '';

        return data;
    };

    // Concentra as regiões principais e as mostra.
    // Mostra a região somente se a nova for diferente da atual.
    App.showMainRegions = function showMainRegions (regions) {
        var regionNames = _.keys(regions),
            system = App.location().sistema;
        _.each(regionNames, function appRegionIterator (regionName) {

            if (!App[regionName]) { console.error('O nome da Region é inválido: "%s"', regionName); }

            var name;

            if ( App[regionName].currentView ) {
                name = App[regionName].currentView.name;
            }
            // Não há uma view armazenada na region
            if (!App[regionName].currentView) {
                App[regionName].show(regions[regionName]);
            }

            // Há uma view armazenada na region e ela é diferente da nova view
            else if (
                (App[regionName].currentView !== regions[regionName]) || ((name) && (system !== name))
            ) {
                // Se o tipo de region for 'mainRegion', o tratamento será diferenciado: Se trata de uma view do tipo "slide".
                // Por esse motivo, não será executado o "show" para evitar que o conteúdo seja apagado da region.
                if ( regionName === 'mainRegion' ) {
                    App[regionName].attachView(regions[regionName]);
                }

                // Views do tipo "static". Efetuar o "show".
                else {
                    App[regionName].show(regions[regionName]);
                }
            }
        });
    };

    // Methods
    App.mobile = App.Helpers.isMobile();

    // Trata os Headers recebidos via requisições XHR
    // @TODO: Substituir as mensagens por strings localizadas, de acordo com o idioma definido pelo usuário

    // Detecta a seção atual do site e mostra a logo do pap/ava.
    // Seta a classe relacionada no elemento #page.
    App.setCurrentLocation = function setCurrentLocation (section) {
        var loc = {
            systems: {
                'ava': 'Ava',
                'pap': 'Pap',
                'eja': 'Eja',
                'public': 'Public'
            },
            system: App.location().sistema,
            isEJA: function isEJA () {
                var eja = App.sessionstorage.get('isEja');
                eja = _.isUndefined(eja) ? false : true;
                return eja;
            },
            handler: function handler ( s ) {
                var keys = _.keys(this.systems),
                    systemsToOmit = _.without(keys, s),
                    section = (s === 'public') ? 'public' : 'inner',
                    sys = this.systems[s];

//                if ( this.isEJA() ) {
//                    sys = this.systems.eja;
//                    s = 'eja';
//                    systemsToOmit = _.without(keys, s);
//                }

                $('#logo' + sys).closest('a').removeClass('hide');
                $('#page').addClass(section + ' ' + s).removeClass( systemsToOmit.join(' ') );
            },
            execute: function init () {
                var sys = this.system || 'public';
                this.handler.call(this, sys);
            }
        };

        loc.execute();
    };

    // Seta as ações para a localidade atual
    App.setActions = function (permissions) {
        var perms = {
                'GET': 'visualizar',
                'POST': 'cadastrar',
                'PUT': 'editar',
                'DELETE': 'remover'
            },
            arr = [];

        _.each(permissions, function (value, index) {
            arr.push(perms[value]);
        });

        return arr;
    };

    App.handleActions = function (actions, callback, handleResultingElement) {
    /**
     * Seta os botões de ação do usuário para as telas e para o menu lateral (leftSidebarItemView)
     * @param {array} actions As ações permitidas para o usuário. É tratado primeiramente pelo App.setActions, no controller
     * @param {object} callback Object literal com as funções de callback para as ações
     * @param {object} handleResultingElement Função para tratar o callback
     *
     * *** Exemplo de utilização ****
     *
     * var callbackObject = {
     *	  cadastrar: function () {
     *		  return { id: 'cadastrar', title: 'Cadastrar', icon: 'plus-sign' };
     *	  },
     *	  editar: function () {
     *		  return { id: 'editar', title: 'Editar', icon: 'edit-sign' };
     *	  },
     *	  default: function () {
     *		  return { id: 'editar', title: 'Remover', icon: 'trash-sign' };
     *	  }
     *	};
     *
     *	App.handleActions(actions, callbackObject, elementHandlerFunction );
     */
		var viewOptions = null;
		var el = null;

		_.each(actions, function (value) {
			if (callback[value]) {
				viewOptions = callback[value]();
				handleResultingElement(viewOptions);
			}
		});
	};

    App.handleActions();

	App.siteAreasToSingular = {
		solicitacoes: 'Solicitação',
		comunicados: 'Comunicado',
		relatorios: 'Relatório',
		atividades: 'Atividade'
	};

    // Define o PageLayout
    App.pageLayout = function pageLayout (layout) {
        var el = $('#main-content'),
        activeLayout = el.data('active-layout'),
        lt = layout || null;

        if ( !lt ) { throw new Error('Parâmetro layout nulo ou indefinido'); }

        var setLayout = function () {
            el.data('active-layout', lt)
            .removeClass(activeLayout)
            .addClass(lt);
        };

        var setPageLayout = function setPageLayout () {
            if ( activeLayout !== lt ) {
                setLayout();
            }
        };

        return {
            set: setPageLayout
        };
    };

    // Cria um listener para click no botão de mostrar/esconder menu responsivo
    App.responsiveMenuHandler = function responsiveMenuHandler () {
        var mainContent = $('#main-content');
        mainContent.off('click.responsivemenu');
        mainContent.on('click.responsivemenu', '#dock', function () {
            $(this).toggleClass('active');
            mainContent.toggleClass('undocked');
        });
    };

    // Envia ao servidor um log com o histórico de navegação
    App.logNavigationHistory = function logNavigationHistory (params) {
        var data = params.data;
        if ( !data ) { throw new Error('Parâmetro data nulo ou indefinido'); }
        if ( typeof data.parametros === 'object' ) { data.parametros = JSON.stringify(data.parametros); }

        Helpers.ajaxRequest({
            type: 'POST',
            url: App.config.UrlWs('sistema')+'usuarioHistoricoNavegacao',
            data: data,
            successCallback: params.success,
            errorCallback: params.error
        });
    };

	// Backbone History Extend
	_.extend(Backbone.History.prototype, {
		refresh: function() {
            this.loadUrl(this.fragment);
		}
	});

	Backbone.History.prototype.navigateTo = function (fragment, options) {
		var routeStripper = /^[#\/]/;
		var origNavigate = Backbone.History.prototype.navigate;
		var frag = (fragment || '').replace(routeStripper, '');
		if (this.fragment == frag){
            this.refresh();
		}
		else {
            origNavigate.call(this, fragment, options);
		}
	};

    // Criando os títulos
    App.config._generateDocumentTitles();

    return App;
});
