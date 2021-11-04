/* ==========================================================================
   HomeHeader ItemView
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 05/05/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var App = require('app'),
        $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        animatedIconsLib = require('libraries/animatedIcons'),
        animatedIcons = animatedIconsLib({ 'selector': '#dock i.livicon', 'iconOptions': { 'size': 26, 'color': '#4270a1' } }),
        popover = require('libraries/popover'),
	    JsSocials = require('vendor/jssocials-1.2.1/dist/jssocials');

	    require('livicons');

    //$(imgteste).fadeOut(1500);
    //$(imgteste).fadeIn(1500);


	var template = [
		'<div id="dock" aria-hidden="true">',
			'<i data-name="responsive-menu" class="livicon"></i>',
		'</div>',
        '',
		'<h1 tabindex="0"><%= i18nOla %>, <%= i18nUsername %>, <%= i18nBemVindo %>!</h1>' /*,
		'<h2 title = "<%= i18nVisualizarMensagens %>"><ul class="list-inline">',
        '<li class="hide"><a href="#/ava/aviso/home" id="homeHeaderUnreadMessages"><i class="icon-bell-o text-danger"></i> <span>0</span> <%= i18nAvisos %> <%= i18nAvisosNaoLidas %></a></li>',
         '<li class="hide"><a href="javascript:void(0)" id="homeHeaderDocumentosPendentes"><i class="icon-folder text-danger"></i> <span>0</span> <%= i18nDocumentos %> <%= i18nPendentes %></a></li></ul></h2>'*/
	].join('');
	var templateDocumentos = '<div class="form-group"><div class="un-input-lg">'                    
                                + '<h2 class="main-title"><%= assunto %></h2>'                    
                            + '</div></div>'
                            + '<div class="form-group"><div class="un-input-lg">'
                                + '<%= texto %>'
                            + '</div></div>';

	return Marionette.ItemView.extend({
		className: 'home-header',

		template: _.template(template),		
		events: {
		    /*'click #homeHeaderDocumentosPendentes': 'verificarDocumentos'*/
		},
        // Passa valores para as variáveis presentes no template
		serializeData: function serializeData () {
			App.StorageWrap.setAdaptor(sessionStorage);
            var user = App.StorageWrap.getItem('user');
            return {
                'i18nOla': 'Olá',
                'i18nUsername': App.Helpers.username( user.nome ),
                'i18nBemVindo': 'bem-vindo ao AVA UNIVIRTUS' /*,
                'i18nVisualizarMensagens': 'Visualizar mensagens',
                'i18nAvisos': 'avisos',
                'i18nAvisosNaoLidas': 'não lidos',
                'i18nDocumentos': 'documentos',
                'i18nPendentes': 'pendentes'*/
            };
		},

        // link para verificação de novas mensagens
		link: App.config.UrlWs('sistema') + 'Aviso/0/GetTotalAvisosNaoLidosDocumentosPendentes',

        // Temporizador utilizado para controlar a operação de intervalo
        timer: null,

        // Verifica a existência de novas mensagens
        checkForUpdates: function checkForUpdates(successCallback, errorCallback) {

            /*var config = {
                url: this.link,
                async: true,
                successCallback: successCallback
                ,
                errorCallback: errorCallback
            };

            App.Helpers.ajaxRequest(config);*/

            //this.timer = setInterval(function check () {
            //    App.Helpers.ajaxRequest(config);
            //}, 30000);

            
        },

        // Adiciona os ícones animados ao mostrar a view (#dock)
        // Faz a verificação de novas mensagens
		onShow: function onShow () {
		    animatedIcons.add();

		    var self = this;
		    
		    this.fecharBanner = function (pop, data) {

		        var timeOut = 10000;
		        if ( data != void(0) && parseInt(data.timeOut) > 0) {
		            timeOut = parseInt(data.timeOut);
		        }

		        if (pop != void (0)) {
		            setTimeout(function () {
		                $("#imgBanner").fadeOut(data.fadeOut, function () {
		                    pop.show();
		                    $(".popover .close").on("click", function () {
		                        pop.hide();
		                    });

		                    $('#homeHeaderUnreadMessages').on("remove", function () {
		                        pop.hide();
		                    });

		                    setTimeout(function () {
		                        pop.hide();
		                    }, 15000);
		                });
		            }, timeOut);
		        } else {
		            setTimeout(function () {
		                $("#imgBanner").fadeOut(data.fadeOut);
		            }, timeOut);
		        }

		    };

		    this.checkBanner = function (pop) {

		        try{

		            var user = App.StorageWrap.getItem('user');
		            if(user.RU != user.login)
		            {
		                return;
		            }

		            var self = this;

		            var config = {
		                url: 'json/bannerrotina.json?data='  + (new Date()).getTime(),
		                async: true,
		                successCallback: function (data) {

                            if (data != void (0) && data.src != void (0)) {
                                if (user.internacional == true) {
                                    data.href = "https://www.uninteramericas.com/addamigos/#";
                                }
                              

		                        //Tem idRotina no banner? Se sim, precisa testar permissão antes de exibir
		                        if (data.idRotina == void (0) || !parseInt(data.idRotina) > 0) {
		                            self.renderBanner(data, pop);
		                        } else {

		                            var idUsuario = App.StorageWrap.getItem('user').idUsuario;

		                            var configPerms = {
		                                url: App.config.UrlWs('autenticacao') + 'UsuarioBeta/' + idUsuario + '/Usuario?idRotina='+data.idRotina,
		                                async: true,
		                                successCallback: function (dataPerms) {
		                                    self.renderBanner(data, pop);
		                                },
		                                errorCallback: function (errorPerms) {
		                                    self.fecharBanner(pop, data);
		                                }
		                            };

		                            App.Helpers.ajaxRequest(configPerms);

		                        }

		                    } else {
		                        self.fecharBanner(pop, data);
		                    }

		                },
		                errorCallback: function (error) {
		                    self.fecharBanner(pop);
		                }
		            };

		            App.Helpers.ajaxRequest(config);
		        } catch (e) {

		            //Erro ao construir banner.
		        }
		    };

		    this.renderBanner = function (data, pop) {

                if (data.href.indexOf("{RU}") > -1) {
                    data.href = data.href.replace("{RU}", App.session.get('RU'));
                }
                if (data.href.indexOf("{Nome}") > -1) {
                    data.href = encodeURI(data.href.replace("{Nome}", App.session.get('nome')));
                }

		        $("#imgBanner img").attr("src", data.src);
		        $("#imgBanner").fadeIn(data.fadeIn);
		        $("#imgBanner a").attr("href", data.href);
		        
		        if (data.shares != void(0) && data.shares.length > 0)
		        {
		            var mobile = App.Helpers.isMobile();
		            var shares = [];
		            $.each(data.shares, function (i, item) {
		                if (item.dispositivo == void (0)
                            || (mobile == true && item.dispositivo == "mobile")
                            || (mobile == false && item.dispositivo == "web")
                            || item.dispositivo == "todos"
                            )
		                {
		                    shares.push(item);
		                }
		            });

		            if(shares.length > 0)
		            {
		                var a = {
		                    url: data.href.replace('{ru}', App.session.get('RU') ),
		                    text: data.title.replace('{ru}', App.session.get('RU')),
		                    showCount: false,
		                    showLabel: false,
		                    shares: shares
		                };

		                $("#socialShare").jsSocials(a);
		            }

		        }

		        self.fecharBanner(pop, data);

		    };

		    this.checkForUpdates(function update(response) {
		        
		        $('#homeHeaderUnreadMessages').closest("li").addClass("hide");
		        $('#homeHeaderDocumentosPendentes').closest("li").addClass("hide");
		        //if (response.exception > 0)
		        {
                    //verifica avisos
		            
		            $('#homeHeaderUnreadMessages span').html(response.totalAvisos);

		            if (parseInt(response.totalAvisos) > 0) {
		                $('#homeHeaderUnreadMessages').closest("li").removeClass("hide");		                
		            }

		            //verifica documentos
		            $('#homeHeaderDocumentosPendentes span').html(response.totalDocumentos);		            
		            
		            if (parseInt(response.totalDocumentos) > 0) {
		                $('#homeHeaderDocumentosPendentes').closest("li").removeClass("hide");
		                
		                if (response.exibirAlerta)
		                    self.verificarDocumentos();
		            }            
		        }

		        self.checkBanner();
		        //App.logger.info('Verificação de mensagens realizada com sucesso');
                

            });

		    this.checkBanner();

            ////Mostrar o modal ao carregar o HomeHeader
            // App.Helpers.showModal({
            //    body: '<img src="img/Fbanner-manutencao.jpg" alt="imagem modal">',
            //    title: null,
            //    buttons: null
            //});
           

          
		},

        // Limpa o timer quando a view for fechada
        onClose: function onClose () {
            clearInterval(this.timer);
        },
        verificarDocumentos: function verificarDocumentos (e) {		      
                
            App.Helpers.ajaxRequest({
                url: App.config.UrlWs('sistema') + 'Aviso/0/DocumentosUsuario?pagina=1&numRegistros=1',
                successCallback: this.montarModalDocumentos,                    
                async: true
            });

        },
        confirmarAtualizarDocumentoEntregue: function (idAviso) {
            App.Helpers.ajaxRequest({
                url: App.config.UrlWs('sistema') + 'Aviso/' + idAviso + '/DocumentoEnviadoUsuario',                
                async: true
                
            });
        },
        montarModalDocumentos: function (r) {
            var self = this;
            if (r.avisos.length == 1 && r.avisos[0].id > 0) {
                try{
                    var tpl = _.template(templateDocumentos);                    
                    var mensagem = tpl(r.avisos[0]);

                    var buttons =  new Array();
                    if (!r.avisos[0].lido) {
                        buttons.push({
                            'type': "button",
                            'klass': "btn btn-primary",
                            'text': "Documento entregue",
                            'dismiss': null,
                            'id': 'modal-ok',
                            //'modal':{backdrop: 'static', keyboard: false},
                            'onClick': function (event, jQModalElement) {

                                App.Helpers.ajaxRequest({
                                    url: App.config.UrlWs('sistema') + 'Aviso/' + r.avisos[0].id + '/DocumentoEnviadoUsuario',
                                    async: true

                                });
                                jQModalElement.modal('hide');
                            }
                        });
                    }
                    buttons.push({
                        'type': "button",
                        'klass': "btn btn-default",
                        'text': "Fechar",
                        'dismiss': 'modal',
                        'id': 'modal-cancel'
                    });
                    UNINTER.Helpers.showModalAdicionarFila({
                        size: "",
                        body: mensagem,
                        modal: {keyboard: false},
                        //title: r.avisos[0].assunto,
                        buttons: buttons
                    });
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        
        

        
	});
});