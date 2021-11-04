/* ==========================================================================
   Header View
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 04/02/2014
   ========================================================================== */


define(function(require) {
    'use strict';

    var templateDocumentos = '<div class="form-group"><div class="un-input-lg">'
                + '<h2 class="main-title"><%= assunto %></h2></div></div>'
                + '<div class="form-group"><div class="un-input-lg"><%= texto %></div></div>';

    var templateNotificationBar = '<div id="<%=divId%>" class="notification-div" >' 
        + '<a class="notification-container" href="<%=urlNotification%>" id="<%=idBtn%>"><%=icone%>' 
        + '<div class="<%=classe%>" id="<%=id%>"></div>'
        + '<a class="notification-title" href="<%=urlNotification%>" id="<%=idLink%>"><%=nome%></a>'
        + '</a></div>';
    var dataAnterior = new Date();
    var listaPermissoes = [];
    var listaObjPermissoes = null;
    var acessibilidade = ["provas"];
    var App = require('app'),
        $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        LazyLoader = require('libraries/LazyLoader'),
        viewLoader = new LazyLoader('views/'),
        headerTemplate = require('text!templates/partials/header-template.html'),
        headerTemplateRoa = require('text!views/ava/roa/header-template.html'),
        headerTemplateSimular = require('text!templates/partials/header-simular-template.html'),
        avaCheckLocation = function avaCheckLocation () {
            var location = document.location.hash,
                isAVA = location.indexOf('ava') !== -1,
                isPap = location.indexOf('pap') !== -1,
                isAvaHome = _.isUndefined(location.split('/')[2]) || ((location.split('/')[2]) === '') || acessibilidade.indexOf(location.toLowerCase().split('/')[2]) > -1,
                isRoteiroDeEstudo = location.indexOf('roteiro-de-estudo') !== -1,
                isRoa = location.indexOf('acessoroa') !== -1 || (location.indexOf('roa') !== -1 && (location.indexOf('editar') !== -1 || location.indexOf('novo') !== -1));
            return {
                isAva: isAVA,
                isPap: isPap,
                isAvaHome: isAvaHome,
                isRoteiroDeEstudo: isRoteiroDeEstudo,
                isRoa: isRoa
            };
        };

    var mostrarDocumentos = true;



    return Backbone.Marionette.ItemView.extend({
        initialize: function () {
            var location = avaCheckLocation();
            var self = this;



            
            if (location.isRoa) {                                
                self.template = _.template(headerTemplateRoa);
                return;
            }

            // Ouvindo o change dos itens da session.
            this.listenTo(App.session, 'change', function headerListenToSessionUserInfoChange(model) {
                
                listaObjPermissoes = App.session.get('MenuHeader');
                
                _.each(model.changed, function setNewItems(value, key) {

                    // Tenta executar um método da view.
                    try {
                        this['change'+key].call(this, model.get(key));
                    }
                    catch (e) {
//                        App.logger.info('Método não existente: change%s', key);
                    }
                }, this);
            });
            
            // ouvindo mudanças de rota
            this.listenTo(Backbone.history, 'all', function listenToHistoryChange() {
                this.setViewName();
            });
            this.fillAppContainer();

            //Demo:
            if (window.location.pathname.toLowerCase().indexOf("/qa/") > -1)
            {
                $("#headerItemView").css("background", "#167d19");
            }

            this.simular();

        },
        /*template: _.template(headerTemplate, { perfilGOB: perfilGOB }),*/

        template: _.template(headerTemplate),

        setViewName: function setViewName () {
            this.name = App.location().sistema;
        },

        name: null,

        serializeData: function () {
            
            // Dados do Usuário logado
            var name = App.session.get('nome') || '',
                image = App.session.get('imagem') || 'img/icons/default-user.jpg',
                RU = App.session.get('RU'),
                login = App.session.get('login');

            name = App.Helpers.username( name );
            
            return {
                "nome": name,
                "imagem": image,
                "RU": RU,
                'login': login
            };
            
        },

        events: {
            'click #logout': 'logoutClick',
            'click .apps-link': 'showAppOptions',
            //'count .notification-container':'checkAvisosPendentes',
            'click #btnHSimular': 'showSimulacao',
            'click #divHSimular': 'showSimulacao',
            'click #divHOferta': 'showBuscarOferta',
            'click #btnHOferta': 'showBuscarOferta',
        },
        setlogoutLinkLabel: function () {
            var location = avaCheckLocation(),
                label, title;
            
            if ( location.isAvaHome || location.isPap ) {
                title = 'sair do sistema'; label = 'Sair';

            }
            else {
                title = 'ir para a página inicial'; label = 'Voltar';
            }

            $('#logout')
                .attr('title', title)
                .html(label);
        },

        logout: function () {
            console.info('logout');
            $('.main-enquete').remove();
            $("#atendimento-container").remove();
            $('#status-bar').remove();
            $('#main-content').show();
            this.trigger('logout');
        },

        changeimagem: function changeUserImage (src) {
            $('#user-bar').find('.user-img img').attr('src', src);
        },

        changenome: function changeUserName(name) {
            $('#user-bar').find('.user-name').html(App.Helpers.username(name));
        },

        StatusBar: {
            check: function () {
                var hash = window.location.hash || '#/ava/none';
                if (acessibilidade.indexOf(hash.toLowerCase().split('/')[2]) > -1) {
                    this.popular();
                    $('#divNotificationBar').remove();
                    $('.config .icon-gear').closest('a').remove();
                }
            },
            initZoom: 1,
            zoom: function (val) {
                var self = this;

                if (val == void (0)) {
                    self.initZoom = 1;
                } else {
                    self.initZoom = (self.initZoom + val)
                }
                $('#midContentHolder').css('zoom', self.initZoom);
                UNINTER.viewGenerica.setPlaceholderHeight();

            },
            popular: function () {

                var self = this;

                $("#status-bar").remove();


                var $header = $("<header>", { id: "status-bar", class: "status-bar", "aria-hidden": "false" });

                var zoomMais = $("<a>", { href: "javascript:void(0)" }).html('<i class="icon-search-plus"></i>').on('click', function (e) {
                    self.zoom(0.1);
                });

                var zoomMenos = $("<a>", { href: "javascript:void(0)" }).html('<i class="icon-search-minus"></i>').on('click', function (e) {
                    self.zoom(-0.1);
                });

                var resetZoon = $("<a>", { href: "javascript:void(0)" }).html('<i class="icon-compress"></i>').on('click', function (e) {
                    self.zoom(void (0));
                });

                var zoom = $("<span>", { class: "zoom-controllers" }).append(resetZoon).append(zoomMais).append(zoomMenos);

                $header.html($("<div>").append(zoom));

                $('#headerItemView').after($header);


            }
        },

        logoutClick: function (e) {
            var location = avaCheckLocation(),
                didFeedback = false,
                self = this,
                feedbackView;

            $.when(
                viewLoader.get('ava/Feedback/FeedbackItemView')
            ).done(function (FeedbackItemView) {

                // Para o AVA, faz logout somente se for a Home.
                if ( location.isAvaHome ) {
                    self.logout();
                    App.logger.info('logout');
                }

                // Se for alguma página interna do AVA, redirecionar para página inicial do ava.
                else {

                    if ( location.isAva ) {
                        // Se o usuário não respondeu à pesquisa de feedback,
                        // mostrá-la.
                        feedbackView = new FeedbackItemView();

                        didFeedback = feedbackView.checkFeedback();

                        // Se o usuário ainda não respondeu a pesquisa e for o Roteiro de estudo
                        if ( !didFeedback &&  location.isRoteiroDeEstudo ) {

                            feedbackView = new FeedbackItemView();
                            App.Helpers.showModal({
//                                'body': feedbackView.render().$el,
                                'onClose': function (dialog) {
                                    App.redirecter({ 'url': '#/ava' });
                                    dialog.modal('hide');
                                },
                                'callback': function renderModalBody(dialog) {
                                    dialog.find('.modal-body').html(feedbackView.render().$el);
                                    dialog.find('.modal-footer').hide();
                                }
                            });

                        }
                        else {
                            App.redirecter({ 'url': '#/ava' });
                        }
                    }

                    // Se For PAP, fazer logout
                    else {
                        self.logout();
                        App.logger.info('logout');
                    }

                }
            });
        },

        makeContentVisibleToScreenReaders: function makeContentVisibleToScreenReaders () {
            $('#headerItemView').attr('aria-hidden', false);
        },

        onRender: function () {
            
            this.delegateEvents();
            this.makeContentVisibleToScreenReaders();
            this.simular();
        },

        showAppOptions : function showAppOptions(e){           
            e.preventDefault();
            e.stopPropagation();
            this.fillAppContainer();            
            $(".switch-app-container").toggle();
        },

        fillAppContainer : function(){

            $(function(){     


            $("html").on('click',function(e){
                if($(".switch-app-container").is(":visible"))
                {
                    $(".switch-app-container").hide();
                }         
            });    

                var idsSistema = [];
                var perfis = UNINTER.session.attributes.perfis;
                var avaLi = ' <li><a href="#/ava"><img src="img/ava.png" alt="ava icone"/></a></li> ';
                var papLi = ' <li><a href="#/pap"><img src="img/pap.png" alt="pap icone"/></a></li> ';
                var pap = false;
                var ava = false;

                _.each(perfis, function (profile) {
                    idsSistema.push(profile.idSistema);
                });



                if(_.contains(idsSistema, 4)){ 

                    if($("#page").hasClass("ava")){
                       $(".apps ul").html(papLi);          
                    }


                    if($("#page").hasClass("pap")){
                       $(".apps ul").html(avaLi);          
                    }

                    ava = true;
                    pap = true;                   
                                                 
                }

                if(_.contains(idsSistema, 5)){
                    if(!ava === true){
                        $(".switch-app").hide();
                    }
                    if(!pap === true){
                        $(".switch-app").hide();
                    }
                                           
                }

                if(_.contains(idsSistema, 1)){
                    if(!ava === true){
                        $(".switch-app").hide();
                    }
                    if(!pap === true){
                        $(".switch-app").hide();
                    }                   
                }

                if(_.contains(idsSistema, 2)){
                    if(!ava === true){
                        $(".switch-app").hide();
                    }
                    if(!pap === true){
                        $(".switch-app").hide();
                    }                  
                }

            });
        },
        timer: null,
        onShow: function () {
            var self = this;
            console.log('onshow');
            var location = avaCheckLocation();            
            if (location.isRoa)
                return;

            self.getPermissoesMenu();
            self.StatusBar.check();
            
            var perfis = UNINTER.session.attributes.perfis;;

            var perfilGOB = perfis.filter(function (item) {
                return item.idPerfil == 181 || item.idPerfil == 182;
            });

            if (perfilGOB.length > 0) {
                $('.main-logo-group-gob').show();
                /*$('#brand a').hide();*/
            }
            
        },
        onClose: function onClose() {
            clearInterval(this.timer);
        },
        getPermissoesMenu: function () {
            var self = this;
            if (listaObjPermissoes == null) {
                App.Helpers.ajaxRequest({
                    async: true,
                    type: 'GET',
                    url: App.config.UrlWs('sistema') + 'Menu/43/GetMenusFilhos',
                    successCallback: function (r) {
                        App.session.set('MenuHeader', r.MenusFilhos);
                        listaObjPermissoes = App.session.get('MenuHeader');
                        self.fillNotificationBar();
                    }, errorCallback: function () {}
                });
            }
            else self.fillNotificationBar();
        },
        fillNotificationBar: function (){
            var nome = null;
            var self = this;
            
            $(listaObjPermissoes).each(function (i, item) {
                nome = item.ExpressaoIdioma.replace(".", "").replace("ç", "c").replace("õ", "o")
                $('#divNotificationBar').append(_.template(templateNotificationBar,
                {
                    urlNotification: item.url,
                    icone: item.icone,
                    divId: "div" + nome,
                    id: "idTotal" + nome,
                    idLink: "idLink" + nome,
                    idBtn: "idBtn" + nome,
                    classe: "",
                    nome: item.ExpressaoIdioma
                }));
                listaPermissoes[i] = nome;
            });
            $("#idLinkDocPendentes").on("click", function () {
                self.verificarDocumentos();
            });

            self.checkPendentes();
            $('#divNotificationBar').off('change.atualizarPendentes');
            $('#divNotificationBar').on('change.atualizarPendentes', function (e) {
                var dataAtual = new Date();
                var timeDiff = dataAtual - dataAnterior;
                timeDiff = timeDiff / 60000;
                if (timeDiff > 2) {
                    self.checkPendentes();
                }
                else {
                    self.checkPendentes('sala');
                }
                dataAnterior = dataAtual;
            })
        },

        /*  
            Avisos
            DocPendentes
            Comunicados
            Solicitacoes
        */
        checkPendentes: function checkPendentes(tipo) {
           

          /*  if (tipo == 'sala') {*/
                this.mostrarItensHeader();
          /*  }
          */
            if ((listaPermissoes.indexOf("Avisos") != -1 || listaPermissoes.indexOf("DocPendentes") != -1))
            {
                if(listaObjPermissoes[listaPermissoes.indexOf("Avisos")] != void(0) && listaObjPermissoes[listaPermissoes.indexOf("Avisos")].verSalaHeader == true || tipo == 'sala') {
                    this.checkTotalAvisosDocumentos();
                }
            }
            if ((listaPermissoes.indexOf("Solicitacoes") != -1 || listaPermissoes.indexOf("Comunicados") != -1) ){
                if (listaObjPermissoes[listaPermissoes.indexOf("Solicitacoes")] != void(0) && listaObjPermissoes[listaPermissoes.indexOf("Solicitacoes")].verSalaHeader == true || tipo == 'sala') {
                    this.checkSolicitacaoComunicado();
                }
            }

            if (listaPermissoes.indexOf("Contatos") != -1 ) {
                //if (listaObjPermissoes[listaPermissoes.indexOf("Contatos")].verSalaHeader == true || tipo == 'sala') {
                    this.checkContatos();
                //}
            }
        },

        popularCountsAvisoDocumento: function popularCountsAvisoDocumento(totalAvisos,totalDocumentos,exibirDocumentos) {
            $("#divAvisos").show();
            
            var self = this;
            if (totalAvisos > 0) {
                var totalAvisosAux = $("#idTotalAvisos").html();
                $("#idTotalAvisos").attr("class", "notification-counter");
                var totalAvisosAux = $("#idTotalAvisos").html();
                $("#idTotalAvisos").attr('data-total', totalAvisos);
                if (totalAvisosAux != totalAvisos) {
                    if (totalAvisos <= 50) {
                        $("#idTotalAvisos").hide();
                        $("#idTotalAvisos").html(totalAvisos).slideDown('slow');
                    }
                    else {
                        $("#idTotalAvisos").html("50+");
                    }
                    
                }
            }
            if (totalDocumentos > 0) {
                var totalDocumentosAux = $("#idTotalDocPendentes").html();
                $("#idTotalDocPendentes").attr("class", "notification-counter");
                $("#divDocPendentes").show();
                if (totalDocumentosAux != totalDocumentos) {
                    if (totalDocumentos <= 50) {
                        $("#idTotalDocPendentes").hide();
                        $("#idTotalDocPendentes").html(totalDocumentos).slideDown('slow');
                    }
                    else {
                        $("#idTotalDocPendentes").html("50+");
                    }
                }
                if(exibirDocumentos == true){
                    this.verificarDocumentos();
                }
            }
            else {
                $("#divDocPendentes").html('');
            }
            $('#idTotalAvisos').off('change.atualizarTotaisSala');
            $('#idTotalAvisos').on('change.atualizarTotaisSala', function (e) {
                 self.checkAvisosNaoLidos();
            })
            $('#idTotalAvisos').off('change.atualizarTotais');
            $('#idTotalAvisos').on('change.atualizarTotais', function (e) {
                var total = parseInt($(e.currentTarget).attr('data-total'));
                if ((total - 1) <= 0) {
                    $(e.currentTarget).html("");
                    $(e.currentTarget).attr("class", "");
                }
                else if (total <= 50) {
                    $(e.currentTarget).hide();
                    $(e.currentTarget).html(total - 1).slideDown('slow');
                }
                $(e.currentTarget).attr("data-total", (total - 1));
            })

        },

        checkTotalAvisosDocumentos: function checkTotalAvisosDcumentos() {

            var self = this;
            var config = {
                url: App.config.UrlWs('sistema') + 'Aviso/0/GetTotalAvisosNaoLidosDocumentosPendentes',
                async: true,
                successCallback: function (resposta) {
                    self.popularCountsAvisoDocumento(resposta.totalAvisos, resposta.totalDocumentos,resposta.exibirAlerta);
                },
                errorCallback: function () { }
            };
            App.Helpers.ajaxRequest(config);
        },

        checkAvisosNaoLidos: function checkAvisosNaoLidos() {

            var self = this;
            self.esconderItensSala();
            $('#idTotalAvisos').html("");
            $('#idTotalAvisos').attr("class", "");
            
        },
        esconderItensSala: function esconderItensSala() {
            $(listaObjPermissoes).each(function (i, item) {
                if(!item.verSalaHeader){
                    $('#div' + item.ExpressaoIdioma.replace(".", "").replace("ç", "c").replace("õ", "o")).hide();
                }
            })
        },
        mostrarItensHeader: function mostrarItensHeader() {
            $(listaObjPermissoes).each(function (i, item) {
                if (!item.verSalaHeader) {
                    $('#div' + item.ExpressaoIdioma.replace(".", "").replace("ç", "c").replace("õ", "o")).show();
                }
            });
            this.simular();
        },



        checkSolicitacaoComunicado: function checkSolicitacaoComunicado() {

            var self = this;
            var config = {
                url: App.config.UrlWs('pap') + 'solicitacao/0/TotalSolicitacaoComunicadoPendentes',
                async: true,
                successCallback: function (resposta) {
                    self.popularCountsSolicitacaoComunicado(resposta.vSolicitacaoComunicadoContagem.totalSolicitacao, resposta.vSolicitacaoComunicadoContagem.totalComunicado);
                },
                errorCallback: function () { }
            };

            App.Helpers.ajaxRequest(config);
        },

        popularCountsSolicitacaoComunicado: function popularCountsSolicitacaoComunicado(totalSolicitacao, totalComunicado) {
            $("#divSolicitacoes").show();
            $("#divComunicados").hide();
            if (totalSolicitacao > 0) {
                var totalSolicitacaoAux = $("#idTotalDocPendentes").html();
                $("#idTotalSolicitacoes").attr("class", "notification-counter");
                $("#idTotalSolicitacoes").attr('data-total', totalSolicitacao);
                if (totalSolicitacaoAux != totalSolicitacao) {
                    if (totalSolicitacao <= 50) {
                        $("#idTotalSolicitacoes").hide();
                        $("#idTotalSolicitacoes").html(totalSolicitacao).slideDown('slow');
                    }
                    else {
                        $("#idTotalSolicitacoes").html("50+");
                    }
                }
            }
            //if (totalComunicado > 0) {
            //    var totalComunicadoAux = $("#idTotalDocPendentes").html();
            //    $("#idTotalComunicados").attr("class", "notification-counter");
            //    $("#idTotalComunicados").attr('data-total', totalComunicado);
            //    if (totalComunicadoAux != totalComunicado) {
            //        if (totalComunicado <= 50) {
            //            $("#idTotalComunicados").hide();
            //            $("#idTotalComunicados").html(totalComunicado).slideDown('slow');
            //        }
            //        else {
            //            $("#idTotalComunicados").html("50+");
            //        }
            //    }
            //}
            $('#idTotalSolicitacoes, #idTotalComunicados').on('change.atualizarTotais', function (e) {
               
                var total = parseInt($(e.currentTarget).attr('data-total'));
                if ((total - 1) <= 0) {
                    $(e.currentTarget).html("");
                    $(e.currentTarget).attr("class", "");
                }
                else if (total <= 50) {
                    $(e.currentTarget).hide();
                    $(e.currentTarget).html(total - 1).slideDown('slow');
                }

                $(e.currentTarget).attr("data-total",(total - 1));

            })
        },

        checkContatos: function checkContatos() {

            var self = this;

            var config = {
                url: App.config.UrlWs('interacao') + 'MensagemFidelizacao/0/GetTotalContatosNaoLidos/',
                async: true,
                successCallback: function (resposta) {
                    var total = resposta.totalContatosNaoLidos;

                    if ((total) <= 0) {
                        $('#idTotalContatos').html("");
                        $('#idTotalContatos').attr("class", "");
                    }
                    else if (total <= 50) {
                        $('#idTotalContatos').attr("class", "notification-counter");
                        $('#idTotalContatos').attr("data-total", total);
                        $('#idTotalContatos').html(total).slideDown('slow');
                    }
                    else {
                        $('#idTotalContatos').attr("class", "notification-counter");
                        $('#idTotalContatos').attr("data-total", "50+");
                        $('#idTotalContatos').html("50+").slideDown('slow');
                    }
                    $('#idTotalContatos').off('change.AumentarTotalContatos');
                    $('#idTotalContatos').on('change.AumentarTotalContatos', function (e) {

                        var total = parseInt($(e.currentTarget).attr('data-total'));
                        if ((total + 1) <= 0) {
                            $(e.currentTarget).html("");
                            $(e.currentTarget).attr("class", "");
                        }
                        else if (total <= 50) {
                            $(e.currentTarget).hide();
                            $(e.currentTarget).html(total + 1).slideDown('slow');
                        }

                        $(e.currentTarget).attr("data-total", (total + 1));

                    })
                    $('#idTotalContatos').off('change.DiminuirTotalContatos');
                    $('#idTotalContatos').on('change.DiminuirTotalContatos', function (e) {

                        var total = parseInt($(e.currentTarget).attr('data-total'));
                        if ((total - 1) <= 0) {
                            $(e.currentTarget).html("");
                            $(e.currentTarget).attr("class", "");
                        }
                        else if (total <= 50) {
                            $(e.currentTarget).hide();
                            $(e.currentTarget).html(total - 1).slideDown('slow');
                        }

                        $(e.currentTarget).attr("data-total", (total - 1));

                    })

                },
                errorCallback: function () { }
            };

            App.Helpers.ajaxRequest(config);
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
        },

        simular: function () {

            var perms = UNINTER.Helpers.Auth.getAreaPermsMetodo('simular');
            if (perms == void (0) || perms== false || perms.length == 0) {
                return;
            }

            $('#divHSimular').remove();
            $('#divHOferta').remove();
            $('#divNotificationBar')
                .append('<div id="divHSimular" class="notification-div hidden-md" style="display: block;"><a class="notification-container" href="javascript:void(0)" id="btnHSimular"><i class="icon-simulator"></i><div></div></a><a class="notification-title" href="javascript:void(0)" id="linkHSimular">Simular</a></div>');

            perms = UNINTER.Helpers.Auth.getAreaPermsMetodo('buscarOferta');
            if (perms == void (0) || perms == false || perms.length == 0) {
                return;
            }

            $('#divNotificationBar')
                .append('<div id="divHOferta" class="notification-div hidden-md" style="display: block;"><a class="notification-container" href="javascript:void(0)" id="btnHOferta"><i class="icon-search"></i><div></div></a><a class="notification-title" href="javascript:void(0)" id="linkHOferta">Oferta</a></div>');

        },


        showSimulacao: function () {

            var eveBuscar = function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                var login = $('#ruHSimularBuscar').val().trim();
                if (login.length == 0)
                {
                    return;
                }

                buscarUsuario(login);
            };

            var buscarUsuario = function (login) {

                $('#resultadoHBuscaUsuario').html('');

                UNINTER.Helpers.ajaxRequest({ 
                    url: UNINTER.AppConfig.UrlWs('autenticacao') + "Usuario/" + login + "/GetUsuarioSimular",
                    type: 'GET',
                    async: true,
                    successCallback: function (data) {
                        $('#resultadoHBuscaUsuario').html(_.template($('#templateHDadosUsuario').html(), data));
                        $('#btnHAtualizarOfertas').on('click', atualizacaoOferta);
                    },
                    errorCallback: function (error) {

                        var msg = 'Erro ao buscar usuário';

                        switch (error.status) {
                            case 401:
                                msg = "Falha de autenticação";
                                break;
                            case 405:
                                msg = "Seu perfil não permite a simulação deste usuário";
                                break;
                        }

                        $('#resultadoHBuscaUsuario').html('<div class="alert alert-danger">' + msg + '</div>');
                    }
                });
            };

            var atualizacaoOferta = function () {

                $('#resultadoHBuscaUsuario .btn-default').hide();
                $('#resultadoHAtualizarOfertas').html('<div class="alert alert-warning">Atualizando as ofertas, por favor aguarde!</div>');

                UNINTER.Helpers.ajaxRequest({
                    url: UNINTER.AppConfig.UrlWs('autenticacao') + "Autenticar/" + $('#ruHSimularBuscar').val().trim() + "/Get/0",
                    type: 'GET',
                    async: true,
                    successCallback: function (data) {
                        $('#resultadoBuscaUsuario .btn-default').show();
                        $("#viewsimularlista #mensagem").empty();

                        var html = "<p>Todas as ofertas já estão sincronizadas de acordo com o sistema acadêmico. </p><p>Caso ainda não visualize alguma disciplina consulte o aproveitamento do aluno.</p>";

                        if (data != null && data.ofertasAtualizadas != null) {
                            var total = { inserida: 0, atualizada: 0, removida: 0 };

                            $.each(data.usuario.perfis, function (i, perfil) {

                                if (data.ofertasAtualizadas[perfil.idPerfil] != void (0)) {
                                    total.inserida += parseInt(data.ofertasAtualizadas[perfil.idPerfil].totalOfertasInseridas);
                                    total.atualizada += parseInt(data.ofertasAtualizadas[perfil.idPerfil].totalOfertasAtualizadas);
                                    total.removida += parseInt(data.ofertasAtualizadas[perfil.idPerfil].totalOfertasExcluidas);
                                }

                            });

                            if (total.inserida > 0 || total.removida > 0 || total.atualizada > 0) {
                                var template = $('#templateHAtualizacaoOfertas').html();
                                html = _.template(template, { total: total });
                            }
                        }

                        $('#resultadoHAtualizarOfertas').html(html);

                    },
                    errorCallback: function () {
                        $('#resultadoHBuscaUsuario .btn-default').show();
                        $('#resultadoHAtualizarOfertas').html('<div class="alert alert-danger">Não foi possível atualizar as ofertas do aluno neste momento</div>');
                    }
                });

            };

            UNINTER.Helpers.showModal({
                size: "",
                title: 'Simular',
                body: headerTemplateSimular,
                callback: function () {

                    $('#btnHBuscarUsuario').off('click').on('click', eveBuscar);
                    $('#formHSimularBuscar').off('submit').on('submit', eveBuscar);

                    setTimeout(function () {
                        $('#ruHSimularBuscar').focus();
                        document.execCommand('paste');
                    }, 500);

                },
                buttons: []
            });

        },

        showBuscarOferta: function () {
            var tmp = $('<div>').html(headerTemplateSimular);

            var templateModal = $(tmp.find('#tplBuscarOferta')[0]).html();
            var templateResultado = $(tmp.find('#tplBuscarOfertaResultado')[0]).html();

            var eveBuscar = function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                var oferta = parseInt($('#codigoOfertaH').val().trim());
                if (! (parseInt(oferta) > 0) ) {
                    return;
                }

                $('#resultadoBuscaOferta').html('');

                UNINTER.Helpers.ajaxRequest({
                    url: UNINTER.AppConfig.UrlWs('ava') + "SalaVirtualOferta/" + oferta + "/CodigoOferta",
                    type: 'GET',
                    async: true,
                    successCallback: function (data) {
                        $('#resultadoBuscaOferta').html(_.template(templateResultado, data));
                    },
                    errorCallback: function (error) {

                        var msg = 'Erro ao buscar oferta';

                        switch (error.status) {
                            case 401:
                                msg = "Falha de autenticação";
                                break;
                            case 405:
                                msg = "Seu perfil não permite pesquisa por oferta";
                                break;
                            case 404:
                                msg = "Nenhuma oferta localizada";
                                break;
                        }

                        $('#resultadoBuscaOferta').html('<div class="alert alert-danger">' + msg + '</div>');
                    }
                });
                
            };

            UNINTER.Helpers.showModal({
                size: "",
                title: 'Pesquisar oferta',
                body: templateModal,
                callback: function () {

                    $('#btnBuscarOfertaH').off('click').on('click', eveBuscar);
                    $('#formHOfertaBuscar').off('submit').on('submit', eveBuscar);

                    setTimeout(function () {
                        $('#ruHSimularBuscar').focus();
                        document.execCommand('paste');
                    }, 500);

                },
                buttons: []
            });
        },
    });
});
