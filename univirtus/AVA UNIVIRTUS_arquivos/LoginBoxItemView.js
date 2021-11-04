/* ==========================================================================
   LoginBox ItemView
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 04/02/2014
   ========================================================================== */

define([
    'app',
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'libraries/videoplayer'
], function (App, $, _, Backbone, Marionette, Videoplayer) {
    'use strict';
    return Marionette.ItemView.extend({
        defaultSerialize: {
            'titulo': 'Informe seu RU e Senha',
            'placeholderLogin': 'RU',
            'placeholderSenha':'Senha',
            'entrar': 'Entrar',
            'conhecaNovoAva': 'Conheça o AVA',
            'esqueciMinhaSenha': 'Esqueci minha senha',
        },
        initialize: function (data) {

            this.defaultSerialize = {
                'titulo': 'Informe seu RU e Senha',
                'placeholderLogin': 'RU',
                'placeholderSenha': 'Senha',
                'entrar': 'Entrar',
                'conhecaNovoAva': 'Conheça o AVA',
                'esqueciMinhaSenha': 'Esqueci minha senha',
            };

            if (data.options != void (0)) {
                if (data.options.LABELFORM != void (0)) {
                    this.defaultSerialize.titulo = data.options.LABELFORM
                }

                if (data.options.PLACEHOLDERLOGIN != void (0)) {
                    this.defaultSerialize.placeholderLogin = data.options.PLACEHOLDERLOGIN
                }

                if (data.options.PLACEHOLDERSENHA != void (0)) {
                    this.defaultSerialize.placeholderSenha = data.options.PLACEHOLDERSENHA
                }

                if (data.options.PLACEHOLDERCONHECAAVA != void (0)) {
                    this.defaultSerialize.conhecaNovoAva = data.options.PLACEHOLDERCONHECAAVA
                }
            }

        },
        events: {
            'submit #loginToAVA' : function (e) {
                e.preventDefault();
                var credentials = {};

                // Mostrando o spinner
                // Foca no spinner para avisar ao usuário de necessidades especiais que a página está carregando.
                $('#loginBoxSpinner')
                    .removeClass('fade')
                    .attr('aria-hidden', false)
                    .attr('tabindex', 0)
                    .focus();

                credentials.login = $.trim( $('#ru').val() );
                credentials.senha = $('#senha').val();
                credentials.recaptcha = $("#g-recaptcha-response").val();
                this.trigger("login", credentials);
            },
            'focus input': function () {
                $('#flashMessage').find('button[data-dismiss]').trigger('click');
            },
            'click #conhecaNovoAva': 'openOverlay',

            'click #esqueciMinhaSenha': 'esqueciMinhaSenha',
            'click #voltarLoginToAva': 'voltarLoginToAva',
            'change #containerEsqueciSenha input': function () { $("#erroEmailEsqueciMinhaSenha").empty() },
            'submit #containerEsqueciSenha': 'confirmarEsqueciMinhaSenha',
            'submit #containerEsqueciSenhaSMS': 'confirmarEsqueciMinhaSenhaSMS',
            'click #recuperarPorSMS': 'esqueciMinhaSenhaSMS',
            'keypress #senha': 'capslock'
        },

        capslock: function(e){
            var s = String.fromCharCode(e.which);
            if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
                $('#labelCapslockLigada').removeClass('hide');
            } else {
                $('#labelCapslockLigada').addClass('hide');
            }
        },

        esqueciMinhaSenha: function () {

            $("#containerEsqueciSenha").animate({ left: 20 });
            $("#login-form").addClass("loggedin");
            
        },

        esqueciMinhaSenhaSMS: function () {
            $('#containerEsqueciSenhaSMS').animate({ left: 20 });
            $("#containerEsqueciSenha").animate({ left: 400 });
            $("#login-form").addClass("loggedin");
        },

        voltarLoginToAva: function () {

            $("#containerEsqueciSenha").animate({ left: 400 });
            $("#containerEsqueciSenhaSMS").animate({ left: 400 });
            setTimeout(function () {
                $("#login-form").removeClass("loggedin");
            }, 800);

        },

        confirmarEsqueciMinhaSenha: function (e) {

            e.stopImmediatePropagation();
            e.preventDefault();

            function validateEmail(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

            function showModalInfo()
            {

                App.Helpers.showModal({
                    title: 'Redefinição de senha',
                    size: 'modal-lg',
                    body: '<div class="text-primary" style="font-size: 1.2em;">Dentro de alguns instantes você receberá um e-mail do Univirtus com as instruções de redefinição de senha.<br>Verifique na caixa de entrada, caso não localize o e-mail consulte o lixo eletrônico (spam).</div>',
                    modal: {
                        backdrop: 'static',
                        keyboard: false
                    },
                    botaoFechar: false,
                    buttons: [{
                        text: 'OK',
                        klass: 'btn btn-primary',
                        onClick: function (e, modalElment) {
                            self.voltarLoginToAva();
                            $(modalElment).modal('hide');
                        }
                    }]
                });
            }

            function enviarEmailRedefinicao()
            {

                App.Helpers.ajaxRequest({
                    url: App.config.UrlWs('autenticacao') + 'Contato/' + email + '/EnviarRedefinicao',
                    async: true,
                    successCallback: function () { },
                    errorCallback: function (error) { }
                });

                showModalInfo();
            }

            $("#erroEmailEsqueciMinhaSenha").empty();

            var self = this;
            
            var email = $("#containerEsqueciSenha #email").val();

            var valido = validateEmail(email);

            if(valido === false)
            {
                $("#erroEmailEsqueciMinhaSenha").html('<div class="text-danger">O e-mail informado não é válido</div>');
                return;
            }

            //Verifica se o e-mail corresponde a algum usuario:
            App.Helpers.ajaxRequest({
                url: App.config.UrlWs('autenticacao') + 'Contato/' + email + '/CheckUsuario',
                async: true,
                successCallback: function () {
                    enviarEmailRedefinicao();
                },
                errorCallback: function (error) {

                    switch(error.status)
                    {
                        case 404:
                            $("#erroEmailEsqueciMinhaSenha").html('<div class="text-danger">O e-mail informado não corresponde a nenhum usuário do Univirtus.</div>');
                            break;
                        case 401: 
                            $("#erroEmailEsqueciMinhaSenha").html('<div class="text-danger">O e-mail informado está associado a mais de uma usuário no Univirtus.</div>');
                            break;
                        default:
                            $("#erroEmailEsqueciMinhaSenha").html('<div class="text-danger">Não foi possível confirmar o e-mail. Tente novamente, caso o erro persista, contete o suporte.</div>');
                            break
                    }

                }
            });

        },

        confirmarEsqueciMinhaSenhaSMS: function (e) {

            e.stopImmediatePropagation();
            e.preventDefault();

            var self = this;

            var ru = $("#containerEsqueciSenhaSMS #ruSMS").val();
            var ddd = parseInt($("#containerEsqueciSenhaSMS #ddd").val());
            var celular = parseInt($("#containerEsqueciSenhaSMS #celular").val());

            function showModalInfoSMS()
            {

                App.Helpers.showModal({
                    title: 'Redefinição por SMS',
                    size: 'modal-lg',
                    body: '<div class="text-primary" style="font-size: 1.2em;">Dentro de alguns instantes você receberá um SMS com uma senha temporária. Insira essa senha no formulário de login. Será necessário trocá-la no primeiro acesso.</div>',
                    modal: {
                        backdrop: 'static',
                        keyboard: false
                    },
                    botaoFechar: false,
                    buttons: [{
                        text: 'OK',
                        klass: 'btn btn-primary',
                        onClick: function (e, modalElment) {
                            self.voltarLoginToAva();
                            $(modalElment).modal('hide');
                            $('#loginToAVA #ru').val(ru);
                        }
                    }]
                });
            }

            $("#erroEmailEsqueciMinhaSenhaSMS").empty();

            if (isNaN(ddd) || ddd == 0 || isNaN(celular) || celular == 0 || ru == void(0) || ru.length == 0)
            {
                $("#erroEmailEsqueciMinhaSenhaSMS").html('<div class="text-danger">Dados incorretos. Informe RU e celular, sendo DDD 2 dígitos e celular 9 dígitos</div>');
                return;
            }

            //Verifica se o e-mail corresponde a algum usuario:
            App.Helpers.ajaxRequest({
                url: App.config.UrlWs('autenticacao') + 'Contato/' + ru + '/CheckUsuarioSMS/' + celular,
                async: true,
                successCallback: function () {
                    showModalInfoSMS();
                },
                errorCallback: function (error) {

                    switch(error.status)
                    {
                        case 404:
                            $("#erroEmailEsqueciMinhaSenhaSMS").html('<div class="text-danger">Combinação de telefone e RU inválido.</div>');
                            break;
                        case 409: 
                            $("#erroEmailEsqueciMinhaSenhaSMS").html('<div class="text-danger">O SMS não foi enviado. Verifique se é um telefone válido.</div>');
                            break;
                        default:
                            $("#erroEmailEsqueciMinhaSenhaSMS").html('<div class="text-danger">Não foi possível confirmar os dados ou enviar o SMS. Tente novamente, caso o erro persista, contete o suporte.</div>');
                            break
                    }

                }
            });

        },

        openOverlay: function openOverlay () {
            //var iframe = $('<iframe>', {'id': 'frameConhecaNovoAva',
            //        'src': 'documentos/AVA-Univirtus-Guia-de-Referencia-Rapida-help/index.html',
            //        'class': 'un-iframe-content'
            //    });
            App.Helpers.showModal({
                'size': 'modal-lg',
                'body': '<div id="containerConhecaNovoAva">',
                onClose: function () {
                    $('#containerConhecaNovoAva').remove()
                },
                //'body': '<iframe width="854" height="510" src="https://www.youtube.com/embed/6JSFFDbmWf0" frameborder="0" allowfullscreen></iframe>',
                'callback': function renderModalBody(dialog) {

                    var videoplayer = new Videoplayer();
                    //videoplayer.sourceMP4 = 'http://vod.grupouninter.com.br/2015/FEV/28244.mp4';
                    videoplayer.sourceMP4 = 'http://vod.grupouninter.com.br/especiais/2018/CMA/201801097-P45.mp4';
                    videoplayer.domId = "#containerConhecaNovoAva";                   
                    videoplayer.width = "800px";
                    videoplayer.height = "600px";
                    videoplayer.videoId = "ConhecaAva";
                    videoplayer.render();
                    $("#containerConhecaNovoAva div:first").css("margin","0 auto");
                    dialog.find('.modal-body').css({ 'height': '670px' });
                    dialog.find('.modal-footer').hide();
                }
            });
        },

        createLogo: function createLogo () {
            var univirtusLogoTpl = '<span class="main-logo-group" title="Univirtus">' +
                    '<i aria-hidden="true" class="icon-logo-univirtus-round"></i>' +
                    '<i aria-hidden="true" class="icon-logo-univirtus-text"></i>' +
                '</span>',
                ejaLogoTemplate = '<img class="logo-eja-alt" src="img/logo/logo-eja-alt.png" alt="UNINTER Centro de Educação Básica para Jovens e Adultos" width="330">',
                logo = univirtusLogoTpl;

            if ( App.location().sistema && App.location().sistema.toLowerCase() === 'eja' ) {
                logo = ejaLogoTemplate;
            }

            return logo;
        },

        serializeData: function serializeData() {

            this.defaultSerialize.logo = this.createLogo();

            return this.defaultSerialize;
            //return {
            //    'titulo': 'Informe seu RU e Senha',
            //    'entrar': 'Entrar',
            //    'conhecaNovoAva': 'Conheça o AVA',
            //    'esqueciMinhaSenha': 'Esqueci minha senha',
            //    'logo': this.createLogo()
            //};
        },

        onShow: function () {

            var hash = window.location.hash;

            if (hash != void (0) && hash.toLowerCase() == "#/esquecisenha")
            {
                this.esqueciMinhaSenha();
            }

            if (hash != void (0) && hash.toLowerCase() == "#/esquecisenhasms") {
                this.esqueciMinhaSenhaSMS();
            }
        }
    });
});