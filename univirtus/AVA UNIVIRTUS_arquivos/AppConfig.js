/* ==========================================================================
   Require Config
   ========================================================================== */
define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Helpers = require('libraries/Helpers'),
        loadingView = require('views/common/LoadingItemView'),
        location = require('system/location'),

        Config = {
            // Modo de debug da aplicação: Mostra os logs no console entre outras coisas
            debugMode: false,

            // O Protocolo atual
            protocol : document.location.protocol,

            port : function () {
                var port = document.location.port;
                return (port !== '') ? ':' + port : '';
            },

            // Ips dos servidores:
            // - Production
            // - Homologation
            // - Development (pega a URL atual)
            //servers : {
            //    production : '0.0.0.0/',
            //    homologation: 'univirtus-277877701.sa-east-1.elb.amazonaws.com/ava/',
            //    development: '172.16.254.42/ericson/',
            //    pdfProduction: '0.0.0.0/',

            //    pdfHomologation: 'ec2-54-94-178-251.sa-east-1.compute.amazonaws.com/ava/',

            //    pdfDevelopment : '172.16.254.42/ericson/'
            //},

            servers : {
                production: window.location.host + "/ava/",
                homologation: window.location.host + "/ava/",
                development: '172.16.254.42/ericson/',
                pdfProduction: 'ec2-54-94-178-251.sa-east-1.compute.amazonaws.com/ava/',
                pdfHomologation: 'ec2-54-94-178-251.sa-east-1.compute.amazonaws.com/ava/',
                pdfDevelopment : '172.16.254.42/ericson/'
            },

            _env: null, // Não utilizar diretamente. Usar 'getEnv' no lugar.
            _envPdf: null, // Não utilizar diretamente. Usar 'getEnv' no lugar.

            // Retorna o Ambiente: Development, Homologation ou Production
            getEnv : function () {
                if ( this._env ) { return this._env; }

                window.UNINTER = window.UNINTER || {};

                var url = document.location.hostname,
                    isDevelopmentServer = (url.indexOf('172.16.41.110') !== -1 || url.indexOf('172.16.254.42') !== -1 || url.indexOf('127.0.0.1') !== -1 || url.indexOf('localhost') !== -1),
                    isHomologation = (url.indexOf(this.servers.homologation) === -1);

                if ( isDevelopmentServer ) {
                    this._env = 'development';
                    this.debugMode = window.UNINTER.debugMode = true;
                }
                else if ( isHomologation ) {
                    this._env = 'homologation';
                }
                else {
                    this._env = 'production';
                }

                return this._env;
            },

            getEnvPdf : function () {
                if ( this._envPdf ) { return this._envPdf; }

                window.UNINTER = window.UNINTER || {};

                var url = document.location.hostname,
                    isDevelopmentServer = (url.indexOf('172.16.41.110') !== -1 || url.indexOf('172.16.254.42') !== -1 ||  url.indexOf('127.0.0.1') !== -1 || url.indexOf('localhost') !== -1 ),
                    isHomologation = (url.indexOf(this.servers.homologation) === -1);

                if ( isDevelopmentServer ) {
                    this._envPdf = 'pdfDevelopment';
                    this.debugMode = window.UNINTER.debugMode = true;
                }
                else if ( isHomologation ) {
                    this._envPdf = 'pdfHomologation';
                }
                else {
                    this._envPdf = 'pdfProduction';
                }

                return this._envPdf;
            },

            // Base URL para requisições ajax
            baseUrl : function () {
                var url = this.protocol + '//',
                    env = this.getEnv(),
                    server = (typeof this.servers[env] === 'function') ? this.servers[env]() : this.servers[env];
                // server = server + this.port();
                return url + server;
            },
			// Base URL para requisições ajax
            baseUrlROA : function () {
                var url = 'http://',
                    env = this.getEnv(),
                    server = (typeof this.servers[env] === 'function') ? this.servers[env]() : this.servers[env];
                // server = server + this.port();
                return url + server;
            },
            publicRoutes: ['notFound', 'login', 'email', 'eja', 'esqueci-senha', 'loginPersonalizado','acessoroa'],

            UrlWs : function (ws) {
                ws = ws.toLowerCase();

                var server = (typeof this.servers[this.getEnv()] === 'function') ? this.servers[this.getEnv()]() : this.servers[this.getEnv()];
                var pdfServer = (typeof this.servers[this.getEnvPdf()] === 'function') ? this.servers[this.getEnvPdf()]() : this.servers[this.getEnvPdf()];

                var servers = {
                    pap: this.protocol + "//" + server + "pap/",
                    ava: this.protocol + "//" + server + "ava/",
                    adm: this.protocol + "//" + server + "adm/",
                    atv: this.protocol + "//" + server + "atv/",
                    roa: this.protocol + "//" + server + "roa/",
                    bqs: this.protocol + "//" + server + "bqs/",
                    sistema: this.protocol + "//" + server + "sistema/",
                    interacao: this.protocol + "//" + server + "interacao/",
					academico: this.protocol + "//" + server + "academico/",
                    autenticacao: this.protocol + "//" + server + "autenticacao/",
                    repositorio: this.protocol + "//" + server + "repositorio/",
                    //pdf: this.protocol + "//" + pdfServer,
					pdf: this.protocol + "//" + server + "repositorio/Redirect?path=",

                    relatorio: this.protocol + "//" + server + "relatorio/",
                    integracao: this.protocol + "//" + server + "integracao/",
					integracaov2: this.protocol + "//" + server + "integracaoV2/"
                };
                return servers[ws];
            },

            permissionsUrl: function (sectionId) {
                var url = this.baseUrl()+'Sistema/Rotina/'+sectionId+'/PermissaoMenu';
                return url;
            },


            permissionsUrlMetodo: function (sectionId, metodoPermissao) {
                if (sectionId == void (0)) {
                    return;
                }
                if (metodoPermissao == null) {
                    metodoPermissao = 'RotinaPermissaoMenu';
                }
                var url = this.UrlWs("sistema") + 'Rotina/' + sectionId + '/' + metodoPermissao;
                return url;
            },
			
            ajaxSetup: function () {
                var loc = location();
                var defaults = {
                    beforeSend: function(xhr) {
                        var reveal = true;
                        if ( loc.rotina && loc.rotina.toLowerCase() === 'chathistorico' ) {
                            reveal = false;
                        }

                        if ( reveal ) {
                            loadingView.reveal();
                        }

//                        console.info('Ajax: START');
                    },
                    complete: function() {
                        loadingView.hide();
//                        console.info('Ajax: COMPLETE');
                    }
                };
                var config = {};
                config.beforeSend = function (xhr) {
                    defaults.beforeSend(xhr);
                };
                config.complete = function () {
                    defaults.complete();
                };

                var addToken = function (opcoes) {
                    if (!opcoes) {
                        throw new Error('Token não informado.');
                    }

                    config.beforeSend = function (xhr) {
                        defaults.beforeSend(xhr);
                        xhr.setRequestHeader('Authorization', opcoes.token);
                        xhr.setRequestHeader('MacAddress', opcoes.macAddress);
                        xhr.setRequestHeader('PC', opcoes.computador);
                        if (opcoes.userAgent !== null && opcoes.userAgent !== void (0)) {
                            xhr.setRequestHeader('X-User-Agent', opcoes.userAgent);
                        }
                    };

                    $.ajaxSetup( config );
                };

                return {
                    init: function () {
                        $.ajaxSetup(defaults);
                    },
                    setToken: function (token) {
                        addToken(token);
                    }
                };
            },

            objetoGlobalUNINTER: function () {

                if (_.isUndefined(window.UNINTER)) {
                    window.UNINTER = {};
                }

                //Callback
                if (_.isUndefined(window.UNINTER.callback)) {
                    window.UNINTER.callback = {};
                }

                //Inicializar
                if (_.isUndefined(window.UNINTER.inicializar)) {
                    window.UNINTER.inicializar = {};
                }

                //Swap (objeto selecionado)
                if (_.isUndefined(window.UNINTER.objetoSelecionado)) {
                    window.UNINTER.objetoSelecionado = {};
                }
            },

            // Social
            social: {
                userPic: 'https://univirtuscdn.uninter.com/public/img/social/default-user.jpg',
                userCover: function() {
                    var rand = Helpers.getRandomInt(1, 26);
                    return 'https://univirtuscdn.uninter.com/public/img/social/default-user-cover-' + rand + '.jpg';
                }
            },

            _generateDocumentTitles: function _generateDocumentTitles () {
                var types = ['ava', 'pap', 'forms'],
                    self = this;

                _.each(types, function (type) {
                    var beget = {};
                    _.each(self.documentTitles[type].titles, function (value, index) {
                        beget[index] = value;
                        if ( type === 'forms' ) {
                            beget[index + '_novo'] = value + ' - Criar';
                            beget[index + '_editar'] = value + ' - Editar';
                            beget[index + '_excluir'] = value + ' - Excluir';
                        }
                    });

                    self.documentTitles[type].titles = beget;
                });
            },

            // Document Titles
            documentTitles: {
                'ava': {
                    'prefix': '',
                    'separator': ' - ',
                    'suffix': 'AVA UNIVIRTUS',
                    'titles': {
                        'roteiro-de-estudo': 'Roteiro de Estudo',
                        'historico': 'Histórico',
                        'calendario': 'Calendário',
                        'mensagens': 'Mensagens',
                        'desempenho': 'Desempenho',
                        'informacoes': 'Informações',
                        'index': 'Página Inicial',
                        'default': ''
                    }
                },

                'pap': {
                    'prefix': '',
                    'separator': ' - ',
                    'suffix': 'PAP UNINTER',
                    'titles': {
                        'solicitacoes': 'Solicitações',
                        'comunicados': 'Comunicados',
                        'calendario': 'Calendário',
                        'relatorios': 'Relatórios',
                        'default': ''
                    }
                },

                'forms': {
                    'prefix': '',
                    'separator': ' - ',
                    'suffix': 'AVA UNIVIRTUS',
                    'titles': {
                        'salavirtualatividade': 'Sala Virtual Atividade',
                        'sistemarepositoriopublico': 'Sistema Repositório Público',
                        'salavirtual': 'Sala Virtual',
                        'questao': 'Banco de Questões',
                        'evento': 'Evento',
                        'capes': 'Capes',
                        'bancoquestao': 'Banco de Questões',
                        'avaliacaousuario': 'Avaliação Usuário',
                        'avaliacao': 'Avaliação',
                        'salavirtualtipo': 'Sala Virtual Tipo',
                        'salavirtualsituacao': 'Sala Virtual Situação',
                        'salavirtualmetodoinscricao': 'Sala Virtual Método de Inscrição',
                        'salavirtualestruturarotulo': 'Sala Virtual Estrutura Rótulo',
                        'rotulo': 'Rótulo',
                        'recurso': 'Recurso',
                        'atividadetipo': 'Atividade Tipo',
                        'default': ''
                    }
                }
            }
        };

	return Config;
});

/**
 *	Erros da App
 *	#001: Usuário tentou efetuar o autologin utilizando hash e falhou. Provavelmente a validade do link expirou.
 *	#002: Houve uma tentativa de login e o idSistema do usuário está com um valor diferente de 1, 2, 3 ou 4.
 */
 