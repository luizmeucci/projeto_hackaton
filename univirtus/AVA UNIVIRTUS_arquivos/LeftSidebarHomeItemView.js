/* ==========================================================================
   Left Sidebar ItemView
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 05/02/2014
   ========================================================================== */

define(function (require) {
    'use strict';

    var App = require('app');
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var template = require('text!templates/ava/left-sidebar-home-template.html');

    //var templateAtendimentoOnline = require('text!templates/ava/atendimento-online-template.html');
    var iframe = require('libraries/carregarRota');
    
    require('bootstrap');
    

    var SocialNetwork = function (sn) {
        this.socialNetwork = sn;
    };

	var socialNetworksArray = [];

    function showPopover() {
        $('#social-login-toggle').popover({
			html: true,
			placement: 'bottom',
			content: $('#userProfileSocial'),
			container: 'body',
			trigger: 'click'
		});

		setTimeout(function () {
			$('.popover').on('click', function (e) {
				e.stopImmediatePropagation();
			});
		}, 200);

		// Some com a popover ao clicar fora dela
		$('html').on('click', function(e) {
			if ( typeof $(e.target).data('original-title') == 'undefined' && !$(e.target).parents().is('.popover.in') ) {
                $('#social-login-toggle').removeClass('active');
                $('[data-original-title]').popover('hide');
            }
        });
    }

    return Marionette.ItemView.extend({
        initialize: function (options) {
	        
            this.menu = App.session.get('menuEsquerdoHome');
            if ( options && options.actions ) { this.actions = options.actions; }
            
            // Listener para as mudanças realizadas na session, fazendo update no nome do usuário
            this.listenTo(App.session, 'change', function leftSidebarListenToSessionUserInfoChange(model) {
                _.each(model.changed, function setNewItems(value, key) {
                    if (key === 'nome') {
                        $('#userProfile').find('.user-profile-name h3').html(value);
                    }
                }, this);
            });
        },		
        events: {
            'click #social-login-toggle': function (e) {
                e.stopImmediatePropagation();
                var socialIcons, sn, self = this;
                //				setTimeout(function () {
                //					socialLogin(self);
                //				}, 100);
            },
            'click #imgConhecaAva': function (e) {
                e.stopImmediatePropagation();
                $("#conhecaNovoAvaFooter a").trigger("click");
            },
            'click .item-menu-left-home a': function (e) {
			    
                var $el = $(e.currentTarget),
                url = $el.data('url');
                if (url) {
                    e.stopImmediatePropagation();
                    if (url.indexOf("#") > -1) {
                        App.loadingView.reveal();

                        if (url) { App.redirecter({ 'url': url }); }
                    }
                    else {
                        window.open(url,'_blank' );
                    }
                }
            },
            'click .clouduninter': function (e) {

                //Se estiver simulando, não pode acessar o UNINTER Cloud:
                var user = App.StorageWrap.getItem('user');

                if (user.idUsuarioSimulador > 0 && user.idUsuario != user.idUsuarioSimulador)
                {
                    UNINTER.Helpers.showModal({
                        size: "",
                        body: "Não é possível acessar a ferramenta UNINTER CLOUD simulando aluno.",
                        title: 'Acesso negado',
                        buttons: [{
                            'type': "button",
                            'klass': "btn btn-default",
                            'text': "Fechar",
                            'dismiss': 'modal',
                            'id': 'modal-cancel'
                        }]
                    });

                    return;
                }

                App.Helpers.ajaxRequest({
                    async: true,
                    url: App.config.UrlWs('integracao') + 'Cloud',
                    successCallback: function (data) {
                        //data.url;
                        UNINTER.Helpers.showModal({
                            size: "",
                            body: 'Uma nova janela será aberta e você permanecerá autenticado no Univirtus.',
                            title: 'Atenção',
                            buttons: [{
                                'type': "button",
                                'klass': "btn btn-primary",
                                'text': "OK",
                                'dismiss': null,
                                'id': 'modal-ok',
                                'onClick': function (event, jQModalElement) {
                                    window.open(data.url, '_blank')
                                    jQModalElement.modal('hide');
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
                    errorCallback: function (error) {
                        var mensagem = 'Não foi possível realizar a autenticação no ambiente Uninter Cloud.<br>Uma nova janela será aberta, mas será necessário inserir seu usuario e senha para autenticação.<br>Deseja continuar?';
			            
                        UNINTER.Helpers.showModal({
                            size: "",
                            body: mensagem,
                            title: 'Atenção',
                            buttons: [{
                                'type': "button",
                                'klass': "btn btn-primary",
                                'text': "Sim",
                                'dismiss': null,
                                'id': 'modal-ok',
                                'onClick': function (event, jQModalElement) {
                                    window.open('https://cloud.uninter.com/login', '_blank');
                                    jQModalElement.modal('hide');
                                }
                            }, {
                                'type': "button",
                                'klass': "btn btn-default",
                                'text': "Não",
                                'dismiss': 'modal',
                                'id': 'modal-cancel'
                            }]
                        });

                    }
                });
            },
            'click .atendimentoonline': function (e) {

                UNINTER.Helpers.atendimentoOnline();

            }
        },
        
        buscarMenu: function () {
            App.StorageWrap.setAdaptor(sessionStorage);
            
            var self = this;
            if (self.menu == void (0)) {

                App.Helpers.ajaxRequest({
                    async: true,
                    type: 'GET',
                    url: App.config.UrlWs('sistema') + 'Menu/121/GetMenusFilhos',
                    successCallback: function (r) {

                        var ehDuplo = function (menu) {
                            return (menu != void (0) && menu.classe != void (0) && menu.classe.split(' ').indexOf('box-duplo') > -1);
                        };

                        //Ajusta as classes dos elementos exibidos lado a lado;
                        $(r.MenusFilhos).each(function (i, item) {
                            item.classe = item.classe || '';

                            //Se é box duplo, o menu anterior ou o proximo também tem que ser:
                            if (ehDuplo(item) == true && ehDuplo(r.MenusFilhos[i - 1]) == false && ehDuplo(r.MenusFilhos[i + 1]) == false) {
                                var ar_classes = item.classe.split(' ');
                                ar_classes.splice(ar_classes.indexOf('box-duplo'), 1);
                                item.classe = ar_classes.join(' ');
                            }
                        });


                        App.session.set('menuEsquerdoHome', r.MenusFilhos);
                        self.menu = App.session.get('menuEsquerdoHome');
                        self.renderMenu();
                    }, errorCallback: function () {
                        self.renderMenu();
                    }
                });
            }
            else {
                self.renderMenu();
            }
            
        },
        renderMenu: function () {
            var user = App.StorageWrap.getItem('user').imagem || 'img/icons/default-user.jpg';
            var perfis = UNINTER.StorageWrap.getItem("user").perfis; 
            var perfilGOB = false;
            var self = this;

            if (perfis.filter(function (e) {
                return (e.idPerfil == 181 || e.idPerfil == 182)
            }).length > 0) {
                perfilGOB = true;
            }

            var html = _.template(template, {
                menu: self.menu,
                image: user,
                perfilGOB: perfilGOB
            });
            $.when(self.$el.html(html)).then(function () {
                self.getUserInfo();
            });            
        },
        getUserInfo: function () {
            var username = '<h3>' + App.Helpers.username(App.session.get("nome")) + '</h3>',
				email = App.session.get('email'),
//				location = '<i class="icon-map-marker"></i> Curitiba - PR';
				location = '';

            var login = App.session.get("login");
            var ru = App.session.get("RU");

            var txtLogin = 'Login: ' + login;

            if(ru == login)
            {
                txtLogin = 'RU: ' + login;
            }

            this.$el.find('.user-profile-name').html(username);
            this.$el.find('.user-profile-email').html(email);
            this.$el.find('.user-profile-location').html(location);
            this.$el.find('.user-profile-ru').html(txtLogin);
            this.$el.find('#user-profile-cover img').attr('src', App.config.social.userCover());
            this.checkInternacional();
        },

        checkInternacional: function(){
            //Se for internacional esconde o menu financeiro brasileiro até determinar se ele possui curso brasileiro ou não.
            if (App.session.get("internacional")) {
                $('.item-menu-left-home a[data-id="122"]').closest('.item-menu-left-home').hide();
                $('.item-menu-left-home a[data-id="137"]').closest('.item-menu-left-home').hide();
            }
        },
        
        render: function () {
            
            this.buscarMenu();
            return this;
        }
	});
});