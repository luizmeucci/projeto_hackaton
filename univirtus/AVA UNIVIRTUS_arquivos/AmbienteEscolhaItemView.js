/* ==========================================================================
   AmbienteEscolha View
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 19/02/2014
   ========================================================================== */

define([
    'app',
    'jquery',
    'underscore',
    'backbone',
    'marionette'
], function (App, $, _, Backbone, Marionette) {
    'use strict';
    return Marionette.ItemView.extend({
        initialize: function initialize (options) {
            this.profiles = options.userProfiles;
            this.mensagem = options.mensagem;
            this.ativo = options.ativo;
        },

        template : _.template("<h2 tabindex='0'><%= title %></h2><ul><li><%= links %></li>"),

        events: {
            'click .site-area': 'handleLinkClick'
            
        },

        // Remove o conteúdo da região principal antes de redirecionar para evitar flickering
        handleLinkClick: function handleLinkClick (e) {
            e.preventDefault();
            var self = this,
                $el = $(e.currentTarget),
                link = $el.attr('href');

            if (link.indexOf('#') !== -1) {
                if (self.ativo) {
                    App.mainRegion.close();
                    document.location = link;
                    return;                    
                }
                else {
                    App.Helpers.showModal({
                        'size': 'modal-md',
                        'title': 'Aviso',
                        'body': self.mensagem,
                        'buttons': [{
                            'type': "button",
                            'klass': "btn btn-default",
                            'text': "Fechar",
                            'dismiss': 'modal',
                            'id': 'modal-cancel'
                        }]
                    });
                }

                
            } else {

                if ($(e.currentTarget).attr('id') == 'loginBoxPap') {

                    var $aSolicitacao = $('<a>', { href: '#/ava/solicitacao' }).html('> Acessar o novo menu de solicitações').on('click', function (e) { $('#modal-cancel').trigger('click'); $('#loginPage').hide(100); });
                    var $aComunicados = $('<a>', { href: '#/ava/comunicado' }).html('> Acessar o novo menu de comunicados').on('click', function (e) { $('#modal-cancel').trigger('click'); $('#loginPage').hide(100); });

                    var $body = $('<div>')
                        .append('<p>O ambiente PAP foi integrado ao Univirtus. </p><p>As ferramentas Comunicados e Solicitações agora estão disponíveis no Univirtus e os relatórios foram subtituidos pela ferramenta Fidelização.</p>')
                        .append($aSolicitacao)
                        .append('<br>')
                        .append($aComunicados);


                    App.Helpers.showModal({
                        'size': 'modal-md',
                        'title': 'Aviso',
                        'body': $body,
                        'buttons': [{
                            'type': "button",
                            'klass': "btn btn-default",
                            'text': "Cancelar",
                            'dismiss': 'modal',
                            'id': 'modal-cancel'
                        }]
                    });
                } 
                else {
                    this.trigger('itemview:logintoclaroline');
                }


                
            }
        },
        
        serializeData: function serializeData() {

            var StorageWrap = require('libraries/StorageWrap');
            var user = StorageWrap.getItem('user');

            var financeiroServicoHtml = '<div class="box-financeiro-servico">'
                    + '<div class="box-financeiro">'
                    + '<a href="' + (user.internacional == true ? '#/ava/financeirointernacional' : '#/ava/financeiro') + '"><i aria-hidden="true" class="icon-dollar"></i><span class="">FINANCEIRO</span></a>'
                    + '</div>'
                    + '<div class="box-servico">'
                    + '<a href="#/ava/servico"><i aria-hidden="true" class="icon-gears"></i><span class="">SERVIÇO</span></a>'
                    + '</div>'
                + '</div>';

            var data = { title: "Escolha o ambiente" },
                link = "",
                hrefPap = "javascript:void(0)",
                hrefAva = "#/ava",
                hrefProvasVestibular = "#/ava/provas/vestibular",
                hrefProvas = "#/ava/provas",
                idsSistema = [];

            _.each(this.profiles, function (profile) {
                idsSistema.push(profile.idSistema);
            });
            
            
            
            var avalogin = StorageWrap.getItem('avalogin');
            
            if (avalogin != void (0))
            {
                hrefAva = '#/' + avalogin;

                if (hrefAva.toLowerCase().indexOf('solicitacao') > -1) {
                    App.mainRegion.close();
                    document.location = hrefAva;
                    return;
                } else {
                    hrefAva = "#/ava";
                }

            }

            if (user != void (0) && user.location != '#/ava')
            {
                hrefAva = user.location;
            }


//            idsSistema = [5];
            var adicionouAVA = false,
                adicionouPAP = false,
                adicionouProvasVestibular = false,
                adicionouProvas = false;
                

            if (_.contains(idsSistema, 4)) {                

                link += "<a title='acessar o AVA' class='site-area' href=\"" + hrefAva + "\" id='loginBoxAva'><i class='loginbox-ava'></i></a>";
                link += "<a title='acessar o PAP' class='site-area' href=\"" + hrefPap + "\" id='loginBoxPap'><i class='loginbox-pap'></i></a>";

                if (user.vestibularVigente) {
                    //link += "<a title='acessar as Provas de Vestibular' class='site-area' href=\"" + hrefProvasVestibular + "\" id='loginBoxClaroline'><i class='loginbox-claroline'></i></a>";
                    link += "<div class='box-financeiro-servico'><a title='acessar as Provas' class='site-area' href=\"" + hrefProvas + "\" id='loginBoxProvas'><i class='loginbox-provas'></i></a><a title='acessar as Provas de Vestibular' class='site-area' href=\"" + hrefProvasVestibular + "\" id='loginBoxClaroline'><i class='loginbox-claroline'></i></a></div>";
                    adicionouProvasVestibular = true;
                } else {
                    link += "<a title='acessar as Provas' class='site-area' href=\"" + hrefProvas + "\" id='loginBoxProvas'><i class='loginbox-provas'></i></a>";
                }
                
                adicionouAVA = true;
                adicionouPAP = true;
                adicionouProvas = true;
                
            }

            if (_.contains(idsSistema, 5)) {
                if(adicionouAVA === false){
                    link += "<a title='acessar o AVA' class='site-area' href=\"" + hrefAva + "\" id='loginBoxAva'><i class='loginbox-ava'></i></a>";
                    adicionouAVA = true;
                }

                if (adicionouProvasVestibular === false && user.vestibularVigente) {
                    //link += "<a title='acessar as Provas de Vestibular' class='site-area' href=\"" + hrefProvasVestibular + "\" id='loginBoxClaroline'><i class='loginbox-claroline'></i></a>";
                    link += "<div class='box-financeiro-servico'><a title='acessar as Provas' class='site-area' href=\"" + hrefProvas + "\" id='loginBoxProvas'><i class='loginbox-provas'></i></a><a title='acessar as Provas de Vestibular' class='site-area' href=\"" + hrefProvasVestibular + "\" id='loginBoxClaroline'><i class='loginbox-claroline'></i></a></div>";
                    adicionouProvasVestibular = true;
                    adicionouProvas = true;
                } else if (adicionouProvas === false) {
                    link += "<a title='acessar as Provas' class='site-area' href=\"" + hrefProvas + "\" id='loginBoxProvas'><i class='loginbox-provas'></i></a>";
                    adicionouProvas = true;
                }
                
            }
            if (_.contains(idsSistema, 1)) {
                if (adicionouAVA === false) {
                    link += "<a title='acessar o AVA' class='site-area' href=\"" + hrefAva + "\" id='loginBoxAva'><i class='loginbox-ava'></i></a>";
                    adicionouAVA = true;
                }

                if (adicionouProvasVestibular === false && user.vestibularVigente) {
                    //link += "<a title='acessar as Provas de Vestibular' class='site-area' href=\"" + hrefProvasVestibular + "\" id='loginBoxClaroline'><i class='loginbox-claroline'></i></a>";
                    link += "<div class='box-financeiro-servico'><a title='acessar as Provas' class='site-area' href=\"" + hrefProvas + "\" id='loginBoxProvas'><i class='loginbox-provas'></i></a><a title='acessar as Provas de Vestibular' class='site-area' href=\"" + hrefProvasVestibular + "\" id='loginBoxClaroline'><i class='loginbox-claroline'></i></a></div>";
                    adicionouProvasVestibular = true;
                    adicionouProvas = true;
                }

                if (adicionouProvas === false) {
                    link += "<a title='acessar as Provas' class='site-area' href=\"" + hrefProvas + "\" id='loginBoxProvas'><i class='loginbox-provas'></i></a>";
                    adicionouProvas = true;
                }
                
                
            }

            if (_.contains(idsSistema, 2)) {
                if (adicionouPAP === false) {
                    adicionouPAP = true;
                    link += "<a class='site-area' href=\"" + hrefPap + "\" id='loginBoxPap'><i class='loginbox-pap'></i></a>";
                }
            }

            if ( _.contains(idsSistema, 3) ) {
                console.info('Opção não implementada');
            }

            if (adicionouAVA === true || adicionouAVAClaroline === true || adicionouPAP === true) {
                this.trigger("itemview:loggedin");

                
                if (_.contains(idsSistema, 1) && UNINTER.Helpers.Auth.getAreaPermsMetodo("financeiro").length > 0) {
                    
                    link += financeiroServicoHtml;
                }
                
            }



            data.links = link;

            return data;
        },

        onRender: function () { 
            try {
                setTimeout(function () { $("#login-form .choose a")[0].focus(); }, 500); 
            } catch (e) { };

            var StorageWrap = require('libraries/StorageWrap');
            var user = StorageWrap.getItem('user');

            if (user.usuarioTermoAceiteLogin != void (0) && user.usuarioTermoAceiteLogin.idTermoAceiteOferta > 0) {
                debugger
                var body = '<h4 class="title text-primary">' + user.usuarioTermoAceiteLogin.descricao + '</h4><p>Por favor, leia e concorde com os novos termos.</p><iframe style="width: 100%; height:50vh" src="' + user.usuarioTermoAceiteLogin.url + '"></iframe>';
                var check = '<div class="form-group" ><div class="un-input-md"><div class="checkbox"><label><input type="checkbox" id="checkAceito" name="checkAceito">Declaro que li o termo acima.</label></div></div></div>';
                body = body + check;
                App.Helpers.showModal({
                    'size': 'modal-lg',
                    'title': 'Atualizamos nossos termos',
                    'botaoFechar': true,
                    modal: {
                        keyboard: false,
                        backdrop: 'static',
                    },
                    'body': body,
                    'buttons': [{
                        'type': "button",
                        'klass': "btn btn-primary",
                        'text': "Li e aceito",
                        'id': 'modal-ok',
                        onClick: function (e, modalElment) {

                            $(modalElment).modal('hide');
                            App.Helpers.ajaxRequest({
                                url: UNINTER.AppConfig.UrlWs('integracao') + 'TermoAceite/0/Aceitar',
                                data: { id: user.usuarioTermoAceiteLogin.hash, actionid: false}
                            })
                        }
                    },
                    {
                        'type': "button",
                        'klass': "btn btn-danger",
                        'text': "Não aceito",
                        'id': 'modal-cancel',
                        onClick: function (e, modalElment) {
                            $(modalElment).modal('hide');
                            App.Helpers.ajaxRequest({
                                url: UNINTER.AppConfig.UrlWs('integracao') + 'TermoAceite/0/Aceitar',
                                data: { id: user.usuarioTermoAceiteLogin.hash, actionid: true }
                            })
                        }
                    }]
                });
                $("#modal-ok").attr('disabled', true);
                $("#modal-cancel").attr('disabled', true);
                $("#checkAceito").off('click').on('click', function (e) {
                    if($("#checkAceito").is(':checked')){
                        $("#modal-ok").attr('disabled', false);
                        $("#modal-cancel").attr('disabled', false);
                    }
                    else {
                        $("#modal-ok").attr('disabled', true);
                        $("#modal-cancel").attr('disabled', true);
                    }
                });
            
            }
        }
    });
});
