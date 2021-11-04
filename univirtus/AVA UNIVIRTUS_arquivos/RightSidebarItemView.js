/* ==========================================================================
   ExpandableSidebar ItemView
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 09/04/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var App = require('app'),
        $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        template = require('text!templates/ava/right-sidebar-template.html'),
        animatedIconsLib = require('libraries/animatedIcons'),
        animatedIcons = animatedIconsLib({ 'selector': '#sidebar-widgets i.livicon', 'iconOptions': { 'size': 56, 'color': '#4270a1' } });

    var popover = require('libraries/popover');

    //var templateAtendimentoOnline = require('text!templates/ava/atendimento-online-template.html');
    var iframe = require('libraries/carregarRota');

    var self = void (0);
	return Marionette.ItemView.extend({
	    initialize: function initialize() {
	        self = this;

	        self.menu = App.session.get('menuPrincipal');


            /*
            this.areaPerms = App.auth.getAreaPermsMetodo('simular');
            this.areaRadio = App.auth.getAreaPermsMetodo('radioweb');
            this.areaAgendamento = App.auth.getAreaPermsMetodo('agendamentocomputador');
            this.areaCorrecao = App.auth.getAreaPermsMetodo('pacoteusuario');
            this.areaAjustarAvaliacao = App.auth.getAreaPermsMetodo('AvaliacaoUsuarioConfigurar');
            this.areaImpressaoAvaliacao = App.auth.getAreaPermsMetodo('AvaliacaoUsuarioImpressao');
            this.areaQuestaoPerfil = App.auth.getAreaPermsMetodo('QuestaoPerfil');
            this.areaFidelizacao = App.auth.getAreaPermsMetodo('Fidelizacao');
            */
        },

		

        events: {
			'click #expander': 'expanderClick',

			'click #expander-horizontal': 'expanderHorizontalClick',
			'click a.sidebar-expandable-link[data-id="89"]': 'imprimeAi',
			'click a.sidebar-expandable-link[data-id="116"]': 'univirtusLive',
			'click .sidebar-expandable-link': 'itemClickHandler',
			'click a.sidebar-expandable-link[data-id="79"]': 'resolvaOnline',
			/*'click a.sidebar-expandable-link[data-id="85"]': 'codigosProva',*/
			
			
		},

        //renderCodigoProvas: function () {
        //    var codigos = App.session.get('codigosProvas');

        //    if(codigos == void(0) || codigos.length == 0)
        //    {
        //        return;
        //    }

        //    $('a.sidebar-expandable-link[data-id="85"]').removeClass('hide');

        //    if (codigos.length > 1) {

        //        var direcao = 'bottom';
        //        if ($(window).width() > 979)
        //        {
        //            direcao = 'left'
        //        }

        //        var string = '<div class="codigo-liberacao-provas-popover">';
        //        $(codigos).each(function (i, item) {
        //            string += "<span class='nome-polo'>" + item.nome + "</span><span class='codigo-liberacao-provas text-danger'>" + item.codigo + "</span><br>"
        //        });
        //        string += '</div>';

        //        $('a.sidebar-expandable-link[data-id="85"]').parent().attr('data-container', "body").attr("data-placement", direcao).attr("data-content", string).attr("data-toggle", "popover").attr("data-html", "true").attr("data-title", "P&oacute;los <span class='pull-right'>&times;</span>");
        //        $('a.sidebar-expandable-link[data-id="85"] i').addClass('codigo-liberacao-provas-icon').after('<span class="codigo-liberacao-provas-text">Polo?</span>');
        //        //$('[data-toggle="popover"]').popover();
        //        popover({
        //            target: '[data-toggle="popover"]',
        //            placement: direcao,
        //            title: '<button class="close" data-dismiss="popover" onclick="$(\'li[data-toggle]\').popover(\'hide\')">&times;</button>P&oacute;los',
        //            html: true,
        //            content: string
        //        });


        //        $('a.sidebar-expandable-link[data-id="85"]').parent().bind("click", function (e) {
        //            e.stopImmediatePropagation();
        //        });


        //    } else {
        //        $('a.sidebar-expandable-link[data-id="85"] i').addClass('codigo-liberacao-provas-icon').after('<span class="codigo-liberacao-provas text-danger">' + codigos[0].codigo + '</span>');
        //    }

        //},

        resolvaOnline: function () {

            UNINTER.Helpers.atendimentoOnline();

        },

        getCodigosProvas: function () {

            if ($('a.sidebar-expandable-link[data-id="85"]').length == 0)
            {
                return;
            }

            var codigos = App.session.get('codigosProvas');

            if (codigos == void (0)) {

                App.Helpers.ajaxRequest({
                    url: App.config.UrlWs('sistema') + 'GrupoEstruturaCodigoProvas/0/Usuario',
                    async: true,
                    successCallback: function (data) {
                        App.session.set("codigosProvas", data.grupoEstruturaCodigoProvas);
                        self.renderCodigoProvas();
                    },
                    errorCallback: function () { }
                });

            } else {
                self.renderCodigoProvas();
            }

        },
        imprimeAi: function imprimeAi(e) {
            e.stopImmediatePropagation();
            
            var $el = $(e.currentTarget),
                url = $el.data('url');

            var user = App.StorageWrap.getItem('user');
            App.Helpers.ajaxRequest({
                url: App.config.UrlWs('integracao') + 'ImprimeAi/' + user.RU + '/GET/' + user.idUsuario,
                async: true,
                successCallback: function (data) {
                    if (data.permissao) {
                        App.loadingView.reveal();

                        if (url) { self.showModalImpressaoRedirect(url) };
                    }
                    else if (data.mensagem) {
                        self.showModalImpressaoMensagem('', data.mensagem);
                    }
                    
                },
                errorCallback: function (e) {
                    
                    if (e.status == 404) {
                        self.showModalImpressaoConfirmacao();
                    }
                    else self.showModalImpressaoMensagem('', e.responseText);

                    
                }
            });
        },
        showModalImpressaoConfirmacao: function showModalImpressao() {            
            var user = App.StorageWrap.getItem('user');
            UNINTER.Helpers.showModal({                
                body: '<span>Para utilizar a oção "Imprime aí" clique no botão cadastrar.</span><br><span style="vertical-align:super">Para remover seu cadastro utilize o menu "Configurações" localizado no menu superior </span> <i class="icon-gear text-primary" style="font-size:1.5em;"></i>',
                title: "IMPRIME AÍ",                
                buttons: [{
                    'type': "button",
                    'klass': "btn btn-primary",
                    'text': "Cadastrar",
                    'dismiss': null,
                    'id': 'modal-ok',
                    'onClick': function (event, jQModalElement) {
                        
                        App.Helpers.ajaxRequest({
                            url: App.config.UrlWs('integracao') + 'ImprimeAi/' ,
                            async: true,
                            type: 'POST',
                            data: {RU: user.RU, idUsuario: user.idUsuario},
                            successCallback: function (data) {
                                self.showModalImpressaoMensagem('', "Sua solicitação foi registrada, o acesso será liberado em até 2 horas.");
                            },
                            errorCallback: function (e) {
                                
                                self.showModalImpressaoMensagem('', e.responseText);
                            }
                        });

                        jQModalElement.modal('hide');
                    }
                }, {
                    'type': "button",
                    'klass': "btn btn-default",
                    'text': "Cancelar",
                    'dismiss': 'modal',
                    'id': 'modal-cancel'
                }]
            });
        },
        showModalImpressaoMensagem: function showModalImpressao(titulo, mensagem) {            
            var user = App.StorageWrap.getItem('user');
            UNINTER.Helpers.showModal({                
                body: mensagem,
                title: titulo,
                //callback: eventosModalTentativa,
                buttons: [ {
                    'type': "button",
                    'klass': "btn btn-default",
                    'text': "Fechar",
                    'dismiss': 'modal',
                    'id': 'modal-cancel'
                }]
            });
        },
        showModalImpressaoRedirect: function showModalImpressaoRedirect(url) {
            
            App.Helpers.showModal({
                size: "modal-sm",
                body: 'Este item será aberto em uma nova aba.',
                title: null,
                buttons: [{
                    'type': "button",
                    'klass': "btn btn-primary",
                    'text': "Ok",
                    'dismiss': null,
                    'id': 'modal-ok',
                    'onClick': function (event, jQModalElement) {
                        window.open(url, '_blank');
                        jQModalElement.modal('hide');
                    }
                }, {
                    'type': "button",
                    'klass': "btn btn-default",
                    'text': "Cancelar",
                    'dismiss': 'modal',
                    'id': 'modal-cancel'
                }]
            });
        },
        univirtusLive: function (e) {
            e.stopImmediatePropagation();
            var $el = $(e.currentTarget),
                url = $el.data('url');

            var user = App.StorageWrap.getItem('user');

            var ModalAoVivoNaoDisponivel = function () {
                App.Helpers.showModal({
                    size: "modal-sm",
                    body: 'Nenhum evento ao vivo disponível para seu perfil.',
                    title: null,
                    buttons: [{
                        'type': "button",
                        'klass': "btn btn-default",
                        'text': "Fechar",
                        'dismiss': 'modal',
                        'id': 'modal-cancel'
                    }]
                });
            }

            //Verifica se está na usuário beta:
            App.Helpers.ajaxRequest({
                url: App.config.UrlWs('autenticacao') + 'UsuarioBeta/'+user.idUsuario+'/Usuario?idRotina=4397',
                async: true,
                successCallback: function (data) {
                    
                    if (data == void (0) || data.usuarioBetas == void (0) || data.usuarioBetas.length == 0)
                    {
                        ModalAoVivoNaoDisponivel();
                        return;
                    }

                    UNINTER.Helpers.showModal({
                        body: 'Este link será aberto em uma nova janela.',
                        title: $el.find('.sidebar-expandable-title').html(),
                        buttons: [{
                            'type': "button",
                            'klass': "btn btn-primary",
                            'text': "Continuar",
                            'dismiss': null,
                            'id': 'modal-ok',
                            'onClick': function (event, jQModalElement) {

                                jQModalElement.modal('hide');
                                App.redirecter({ 'url': url });

                            }
                        }, {
                            'type': "button",
                            'klass': "btn btn-default",
                            'text': "Fechar",
                            'dismiss': 'modal',
                            'id': 'modal-cancel'
                        }]
                    });
                    
                },
                errorCallback: function () {
                    ModalAoVivoNaoDisponivel();
                }
            });


        },
		getUsuarioVoip: function () {
            
		    return;

            App.Helpers.ajaxRequest({
                url: UNINTER.AppConfig.baseUrl() + 'Voip/Endpoints/' + App.session.get('RU'),
                async: true,
                successCallback: function (data) {
                    $("#menu-voip").show();
                },
                errorCallback: function (data) { }
            });

        },
        getUsuarioCurso: function () {
            
            if (UNINTER.StorageWrap.getItem('user').internacional) {
                if(UNINTER.StorageWrap.getItem('user').menuApp == void(0)) {
                    App.Helpers.ajaxRequest({
                        url: App.config.UrlWs('sistema') + 'UsuarioCurso/' + UNINTER.StorageWrap.getItem('user').idUsuario + '/GetByIdUsuario',
                        async: true,
                        successCallback: function (data) {
                            
                            var usuarioCurso = data.UsuarioCursos;
    
                            var cursoNivel = [4, 12, 13];

                            var user = UNINTER.StorageWrap.getItem('user');
    
                            if (usuarioCurso.filter(function (e) { return (cursoNivel.indexOf(e.curso.idCursoNivel) > -1)}).length > 0) {
                                $("[data-id='172']").removeClass('hide');
                                user.menuApp = true;
                                UNINTER.StorageWrap.setItem('user', user);
                            }  else {
                                user.menuApp = false;
                                UNINTER.StorageWrap.setItem('user', user);
                            }
    
                        },
                        errorCallback: function (data) { UNINTER.StorageWrap.setItem('menu', 'false'); }
                    });
                } else {
                    if (UNINTER.StorageWrap.getItem('user').menuApp == true) {
                        $("[data-id='172']").removeClass('hide');
                    }
                }
                
            }
        },

        expanderClick: function expanderClick () {
            $('#main-content').toggleClass('sidebar-collapsed');
            this.trigger('expanderclicked');
        },

        expanderHorizontalClick: function expandHorizontalClick () {
            $('#main-content').toggleClass('sidebar-top-expanded');
            this.trigger('expanderclicked');
        },

        itemClickHandler: function itemClickHandler (e) {
            var $el = $(e.currentTarget),
                url  = $el.data('url');

            App.loadingView.reveal();

            if ( url ) { App.redirecter({ 'url': url }); }
        },

        buscarMenu: function() {

            var self = this;
            if (self.menu == void (0)) {

                App.Helpers.ajaxRequest({
                    async: true,
                    type: 'GET',
                    url: App.config.UrlWs('sistema') + 'Menu/27/GetMenusFilhos',
                    successCallback: function (r) {
                        App.session.set('menuPrincipal', r.MenusFilhos);
                        self.menu = App.session.get('menuPrincipal');
                        self.renderMenu();
                    }, errorCallback: function () {
                        self.renderMenu();
                    }
                });
            }
            else
                self.renderMenu();
        },
        renderMenu: function () {
            var self = this;
            var perfis = UNINTER.StorageWrap.getItem("user").perfis;
            var perfilGOB = false;
            var html = _.template(template, {
                menu: self.menu                
            });
            if (perfis.filter(function (e) {
                return (e.idPerfil == 181 || e.idPerfil == 182)
            }).length > 0) {
                perfilGOB = true;
            }
            $.when(self.$el.html(html)).then(function () {
                animatedIcons.add();
		        self.getCodigosProvas();
                self.getUsuarioVoip();
                if (perfilGOB) {
                    $("[data-id='137']").addClass('hide');
                }
                if (App.session.get("internacional")) {
                    /*$("[data-id='137']").addClass('hide');*/
                    $("[data-id='137']").data('url', 'https://www.uninteramericas.com/addamigos/#')
                }
                $("[data-id='172']").addClass('hide');
                self.getUsuarioCurso();
            });            
        },
		render: function show () {
            this.buscarMenu();
		    
		}
	});
});