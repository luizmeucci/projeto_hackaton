/* ==========================================================================
 Atividades Accordion View
 @author: Thyago Weber (thyago.weber@gmail.com)
 @date: 22/04/2014
 ========================================================================== */
define(function (require) {
    'use strict';
    var App = require('app'),

        $ = require('jquery'),

        _ = require('underscore'),

        Backbone = require('backbone'),

        processCollection,

        AnexosView,

        CadastrarAtividadeItemView,
        ItemAprendizagemView,
        processItemAprendizagem,

        templateLoader = new App.LazyLoader('text!templates/ava/views'),

        collectionLoader = new App.LazyLoader('collections/ava'),

        libraryLoader = new App.LazyLoader('libraries'),

        commonViewLoader = new App.LazyLoader('views/common'),

        atividadesViewLoader = new App.LazyLoader('views/ava/Atividades'),

        bootstrapSwitch = new App.LazyLoader('vendor/bootstrap-switch-master/dist/js'),

        popover,

       
    // View para uma linha do accordion
        RowView = Backbone.View.extend({
    
            initialize: function (options) {
                this.template = _.template(options.template);
            },
            tagName: 'li',
            className: 'uninter-atv-theme-item un-accordion-item',
            render: function (model) {
                this.$el
                    .append(this.template(model))
                    .find('.uninter-atv-theme');

                return this;
            }
        }),

    // View para uma linha aninhada do accordion
        NestedRowView = RowView.extend({
            initialize: function (options) {

                this.template = _.template(options.template);
                this.idAtividade = options.idAtividade;
                this.salaVirtualAtividadeId = options.salaVirtualAtividadeId;



            },
            className: 'uninter-atv-item un-accordion-item',
            render: function (model) {

                this.$el.append(this.template(model))
                    .find('.uninter-atv-header')
                    .data({ 'idatividade': this.idAtividade, 'salaVirtualAtividadeId': this.salaVirtualAtividadeId, 'ordem': model.ordem });
                return this;
            }
        }),

    // TPL dos botões de ação administrativa da atividade
        atvActions = function (data) {
            var tpl = _.template('<div class="uninter-atv-actions">' +
                '<ul class="list-unstyled"><%= content %></ul>' +
                '<% if(exibirDownload == true) { %>' +
                '<div class="pull-right lnk-download"><span><i class="icon-download"></i> baixar </span><a href="javascript:void(0)" data-toggle="popover" class="" data-tipo="video"><span>vídeos</span></a>| <a href="javascript:void(0)" data-toggle="popover" class="" data-tipo="videolibras"><span>vídeos (libras)</span></a>| <a href="javascript:void(0)" data-toggle="popover" class="" data-tipo="audio"><span>áudios</span></a></div>' +
                '<% } %>' +
                '</div>');
            return tpl(data);
        },
        atvMultiplosActions = function (data) {
            var tpl = _.template(
                '<p>' +
                '<a href="javascript: void(0);" title="<%=atvDescricao%>"' +
                ' data-type="<%= atvType %>" data-url="<%= atvArquivoUrl %>" class="lnk-arrow-right uninter-atv-action-btn">' +
                '<span><%= atvAcao %></span>' +
                '<i class="icon-arrow-circle-o-right"></i>' +
                '</a>' +
                '<span> <%= atvTitulo %></span>' +
                '<% if(exibirDownload == true) { %>' +
                '<span class="pull-right lnk-download"><span><i class="icon-download"></i> baixar </span><a href="javascript:void(0)" data-toggle="popover" class="" data-tipo="video"><span>vídeos</span></a>| <a href="javascript:void(0)" data-toggle="popover" class="" data-tipo="videolibras"><span>vídeos (libras)</span></a>| <a href="javascript:void(0)" data-toggle="popover" class="" data-tipo="audio"><span>áudios</span></a></span>' +
                '<% } %> ' +
                '</p>'
                );
            return tpl(data);
        },

        atvAdmActions = function (data) {

            var tpl = _.template('<div class="uninter-atv-actions uninter-atv-actions-adm">' +
                '<% if ( editar ) { %>' +
                '<a href="' + this.urlEditarAtividade + '" class="btn btn-warning btn-sm">Editar</a>' +
                '<% } %>' +
                '<% if ( remover ) { %>' +
                '<a href="' + this.urlExcluirAtividade + '" class="uninter-atv-remove btn btn-link btn-sm"><i class="icon-trash-o"></i></a>' +
                '<% } %>' +
                '</div>');

            return tpl(data);
        },

        renderItemAprendizagem = function (data, perms, salaVirtualAtividadeId, self) {


            var tituloLabelType = 1,
                descricaoLabelType = 2,
                arquivoRepositorioLabelType = 3, // Link arquivo repositório
                videoLabelType = 4, // Link video
                rotaLabelType = 6,
                linkLabelType = 7,
                avaliacaoLabelType = 13,
                forumLabelType = 15,
                hyperibookLabelType = 9,
                view,
                anexos = false,
                links = false,
                videos = false,
                Collection = Backbone.Collection.extend({
                    model: Backbone.Model.extend({})
                }),
                anexosArr = [],
                linksArr = [],
                videosArr = [],
                actions,
                itemAprendizagemTitle = self.idSalaVirtualEstruturaRotuloTipoInformacaoCurso == self.idSalaVirtualEstruturaRotuloTipo ? '' : '<h3 class="uninter-atv-actions-title">Material Didático</h3>';

            // Determina se o link tem o protocolo. Se não tiver, concatena-o.
            function linkChecker(link) {
                var lnk = link;
                var hasProtocol = (lnk.search(/http/i) !== -1) ? true : false;
                if (!hasProtocol) { lnk = 'http://' + lnk; }
                return lnk;
            }

            var mcItem = new ItemAprendizagemView({ 'areaPerms': perms, exibirDownload: true });
            var mcItemEl = mcItem.render(data.atividadeItemAprendizagens).$el;
            var $div = $("<div>").html(mcItemEl);

            if (!mcItem.exibirLabelMaterial) itemAprendizagemTitle = '';

            actions = atvActions({
                'salaVirtualAtividadeId': salaVirtualAtividadeId,
                'atvArquivoUrl': '',
                'atvAcao': '',
                'atvType': '',
                'editar': App.auth.viewCheckPerms('editar', perms),
                'remover': App.auth.viewCheckPerms('remover', perms),
                'exibirDownload': '',
                'atvTitulo': '',
                'content': $div.html()
            });

            view = $('<div>')
                    .append(itemAprendizagemTitle)
                    .append(actions);
            return view;



        },

        setNomeSalaVirtualEstruturaRotulo = function () {
            var label = $('#unAccordion li:first-child .uninter-atv-theme .uninter-atv-title-main').text().split(' ')[0];
            if (label) {
                $('#actions .action-bar-icon-text').html(label);
            }
        };

    return Backbone.View.extend({
        initialize: function (options) {
            var self = this;
            this.areaPerms = options.areaPerms;
            this.idSalaVirtual = options.svId;
            this.idTema = options.temaId;
            this.idAtividadeParam = options.atividadeId;
          
            this.idSalaVirtualOferta = options.idSalaVirtualOferta;

            this.idSalaVirtualEstruturaRotuloTipo = (options.idSalaVirtualEstruturaRotuloTipo) ? options.idSalaVirtualEstruturaRotuloTipo : 1;
            this.urlBuscarEstrutura = options.urlBuscarEstrutura;
            this.contractEstrutura = (options.contractEstrutura) ? options.contractEstrutura : 'salaVirtualEstruturas';
            this.urlBuscarAtividade = options.urlBuscarAtividade;
            this.contractAtividade = (options.contractAtividade) ? options.contractAtividade : 'salaVirtualAtividades';
            this.nomeCadastrarItem = (options.nomeCadastrarItem) ? options.nomeCadastrarItem : "Atividade";
            this.urlEditarEstrutura = options.urlEditarEstrutura;
            //this.rotinaCadastroAtividade = (options.rotinaCadastroAtividade) ? options.rotinaCadastroAtividade : "atividade";
            this.rotinaAtividade = (options.rotinaAtividade) ? options.rotinaAtividade : "salaVirtualAtividade";
            this.rotinaEstrutura = (options.rotinaEstrutura) ? options.rotinaEstrutura : "salaVirtualEstrutura";
            this.idModulo = (options.idModulo) ? options.idModulo : this.idSalaVirtualOferta;
            this.urlEditarAtividade = (options.urlEditarAtividade) ? options.urlEditarAtividade : '#/ava/salavirtualatividade/<%= cId %>/editar';
            this.urlAposCadastroAtividade = (options.urlAposCadastroAtividade) ? options.urlAposCadastroAtividade : '#/ava/salavirtualatividade/<%= id %>/editar';
            this.urlExcluirAtividade = (options.urlExcluirAtividade) ? options.urlExcluirAtividade : '#/ava/salavirtualatividade/<%= id %>/excluir';
            this.ocultarStatusAtividade = (options.ocultarStatusAtividade) ? options.ocultarStatusAtividade : false;
            this.areaPermsAtividade = (options.areaPermsAtividade) ? options.areaPermsAtividade : this.areaPerms;

            this.idSalaVirtualEstruturaRotuloTipoInformacaoCurso = 4;
            this.idSalaVirtualEstruturaRotuloBloqueado = 24;
            this.exibirTodasAtividades = true;
            this.exibirDetalhesAtividade = (options.exibirDetalhesAtividade) ? options.exibirDetalhesAtividade : false;
            this.exibirItemInicial = (options.exibirItemInicial) ? options.exibirItemInicial : false;
            this.idSalaVirtualOfertaPai = null;
            this.idSalaVirtualOfertaAproveitamento = null;

            this.idAtividadeAtual = null;
            this.idSalaVirtualEstruturaAtual = null;

            this.barraProgressoDesempenho = options.barraProgressoDesempenho == true ? true : false;

            this.estuturaRotulo = {
                "43": {
                    elemento: "obraFisica",
                    funcao: function (e, state) {

                        var setarObraFisica = function (elemento) {
                            var $el = $(elemento.currentTarget),
                                svEstruturaId = $el.closest("li.un-accordion-item.clicked.active").find('.uninter-atv-theme').data('svestruturaid'),
                                check = $el.is(':checked');

                            UNINTER.Helpers.ajaxRequest({
                                url: UNINTER.AppConfig.UrlWs('sistema') + 'Curso/0/AtualizarObraImpressaCurso',
                                type: 'PUT',
                                async: true,
                                data: {
                                    id: UNINTER.informacoesCurso.id,
                                    obraImpressa: check
                                },
                                successCallback: function (data) { },
                                errorCallback: function (error) {
                                    var revert = (check == true) ? false : true;

                                    $el.bootstrapSwitch('state', revert, true);
                                }
                            });
                        }

                        if (state) {
                            setarObraFisica(e);
                        }

                        var btnsModal = [];

                        btnsModal.push({
                            'type': "button",
                            'klass': "btn btn-primary",
                            'text': "Confirmar",
                            'dismiss': null,
                            'id': 'modal-ativar',
                            'onClick': function (event, jQModalElement) {
                                jQModalElement.modal('hide');
                                setarObraFisica(e);
                            }
                        });

                        btnsModal.push({
                            'type': "button",
                            'klass': "btn btn-default",
                            'text': "Fechar",
                            'dismiss': 'modal',
                            'id': 'modal-cancel',
                            'onClick': function (event, jQModalElement) {
                                var revert = (state == true) ? false : true;
                                $(e.currentTarget).bootstrapSwitch('state', revert, true);
                                jQModalElement.modal('hide');
                            }
                        });

                        if (!state) {
                            UNINTER.Helpers.showModal({
                                size: "modal-md",
                                title: 'Obra Fisica',
                                body: "Ao desativar a obra física do curso, todas as grades e disciplinas que estão com a opção de obra física selecionada, serão desmarcadas. Nenhuma disciplina deste curso terá obra física.",
                                buttons: btnsModal,
                                botaoFechar: false,
                                modal: { backdrop: 'static', keyboard: false }
                            });
                        }

                    }
                },
                "44": {
                    elemento: "conferencia",
                    funcao: function (e, state) {

                        if (state) {
                            self.setarConferencia(e);
                        }

                        var btnsModal = [];

                        btnsModal.push({
                            'type': "button",
                            'klass': "btn btn-primary",
                            'text': "Confirmar",
                            'dismiss': null,
                            'id': 'modal-ativar',
                            'onClick': function (event, jQModalElement) {
                                jQModalElement.modal('hide');
                                self.setarConferencia(e);
                            }
                        });

                        btnsModal.push({
                            'type': "button",
                            'klass': "btn btn-default",
                            'text': "Fechar",
                            'dismiss': 'modal',
                            'id': 'modal-cancel',
                            'onClick': function (event, jQModalElement) {
                                var revert = (state == true) ? false : true;
                                $(e.currentTarget).bootstrapSwitch('state', revert, true);
                                jQModalElement.modal('hide');
                            }
                        });

                        if (!state) {
                            UNINTER.Helpers.showModal({
                                size: "modal-md",
                                title: 'Obra Fisica',
                                body: "Ao confirmar essa ação o curso deixará de utilizar salas de conferência.",
                                buttons: btnsModal,
                                botaoFechar: false,
                                modal: { backdrop: 'static', keyboard: false }
                            });
                        }
                        
                    }
                },
                "45": {
                    elemento: "conferenciaLive",
                    funcao: function (e, state) {

                        if (state) {
                            self.setarConferenciaLive(e);
                        }

                        var btnsModal = [];

                        btnsModal.push({
                            'type': "button",
                            'klass': "btn btn-primary",
                            'text': "Confirmar",
                            'dismiss': null,
                            'id': 'modal-ativar',
                            'onClick': function (event, jQModalElement) {
                                jQModalElement.modal('hide');
                                self.setarConferenciaLive(e);
                            }
                        });

                        btnsModal.push({
                            'type': "button",
                            'klass': "btn btn-default",
                            'text': "Fechar",
                            'dismiss': 'modal',
                            'id': 'modal-cancel',
                            'onClick': function (event, jQModalElement) {
                                var revert = (state == true) ? false : true;
                                $(e.currentTarget).bootstrapSwitch('state', revert, true);
                                jQModalElement.modal('hide');
                            }
                        });

                        if (!state) {
                            UNINTER.Helpers.showModal({
                                size: "modal-md",
                                title: 'Obra Fisica',
                                body: "Ao confirmar essa ação o curso deixará de utilizar lives de conferência.",
                                buttons: btnsModal,
                                botaoFechar: false,
                                modal: { backdrop: 'static', keyboard: false }
                            });
                        }
                        
                    }
                },
                "46": {
                    elemento: "frequenciaAluno",
                    funcao: function (e, state) {

                        if (state) {
                            self.setarFrequenciaAluno(e);
                        }

                        var btnsModal = [];

                        btnsModal.push({
                            'type': "button",
                            'klass': "btn btn-primary",
                            'text': "Confirmar",
                            'dismiss': null,
                            'id': 'modal-ativar',
                            'onClick': function (event, jQModalElement) {
                                jQModalElement.modal('hide');
                                self.setarFrequenciaAluno(e);
                            }
                        });

                        btnsModal.push({
                            'type': "button",
                            'klass': "btn btn-default",
                            'text': "Fechar",
                            'dismiss': 'modal',
                            'id': 'modal-cancel',
                            'onClick': function (event, jQModalElement) {
                                var revert = (state == true) ? false : true;
                                $(e.currentTarget).bootstrapSwitch('state', revert, true);
                                jQModalElement.modal('hide');
                            }
                        });

                        if (!state) {
                            UNINTER.Helpers.showModal({
                                size: "modal-md",
                                title: 'Diário de classe - Frequência',
                                body: "Ao confirmar essa ação o aluno não poderá mais marcar presença nas aulas.",
                                buttons: btnsModal,
                                botaoFechar: false,
                                modal: { backdrop: 'static', keyboard: false }
                            });
                        }

                    }
                }
            }

            try {
                this.idSalaVirtualOfertaPai = (App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaPai) ? App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaPai : null;
            } catch (e) { }
            try {
                this.idSalaVirtualOfertaAproveitamento = (App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaAproveitamento) ? App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaAproveitamento : null;
            } catch (e) { }

            // Fazendo o carregamento das views/libraries sob demanda
            $.when(
                libraryLoader.get('processCollection'),
                libraryLoader.get('popover'),
                libraryLoader.get('processItemAprendizagem'),
                commonViewLoader.get('AnexosView'),
                atividadesViewLoader.get('CadastrarAtividadeItemView'),
                atividadesViewLoader.get('ItemAprendizagemView'),
                bootstrapSwitch.get('bootstrap-switch.min'),
            ).done(function (pc, pop, pia, av, ca, item, switchBootstrap) {

                processCollection = pc;
                popover = pop;
                processItemAprendizagem = pia;
                AnexosView = av;
                CadastrarAtividadeItemView = ca;
                ItemAprendizagemView = item;
                self.render();

            });
        },

        tagName: 'ul',

        className: 'atividades un-accordion parent',

        id: 'unAccordion',

        // Eventos da view: Realizam a chamada de um método existente na própria view.
        events: {
            'click .uninter-atv-theme-item.un-accordion-item': 'renderSubItems',
            //'click .uninter-atv-theme-item.un-accordion-item #obraFisica': 'obraFisica',
            'click .un-accordion.child .un-accordion-item .uninter-atv-header': 'renderContent',
            'click .un-accordion.child .uninter-atv-adm-actions-uninter-atv-remove': 'removeAtividade',
            'click .uninter-atv-title-sec .btn-edit': 'atvTitleSecClick',
            'click .uninter-atv-cadastrar': 'atvCadastrarLinkClick',
            'click .uninter-atv-ativar': 'atvAtivarEstruturaClick',
            'click .uninter-atv-actions .uninter-atv-action-btn': 'actionButtonClick',
            'click .uninter-atv-adm-actions-remove': 'removeItem',
            'keydown .uninter-atv-theme-item.un-accordion-item .uninter-atv-title-main': App.Helpers.enterTriggerClick,
            'keydown .uninter-atv-theme-item.un-accordion-item .uninter-atv-title-sec': App.Helpers.enterTriggerClick,
            'click .uninter-atv-adm-actions-atv a[data-ativa]': 'ativarAtividade',
            'click .un-accordion.child .uninter-atv-number .uninter-atv-edit-order .orderUp': 'alterarOrdenacaoAtividade',
            'click .un-accordion.child .uninter-atv-number .uninter-atv-edit-order .orderDown': 'alterarOrdenacaoAtividade'

        },

        setarConferenciaLive: function (elemento) {
            var $el = $(elemento.currentTarget),
                svEstruturaId = $el.closest("li.un-accordion-item.clicked.active").find('.uninter-atv-theme').data('svestruturaid'),
                check = $el.is(':checked');

            UNINTER.Helpers.ajaxRequest({
                url: UNINTER.AppConfig.UrlWs('sistema') + 'CursoConferencia/' + UNINTER.informacoesCurso.conferencia.id + '/MarcarConferenciaLive/' + check,
                type: 'PUT',
                async: true,
                successCallback: function (data) { },
                errorCallback: function (error) {
                    var revert = (check == true) ? false : true;

                    $el.bootstrapSwitch('state', revert, true);
                }
            });
        },

        setarConferencia: function (elemento) {
            var $el = $(elemento.currentTarget),
                svEstruturaId = $el.closest("li.un-accordion-item.clicked.active").find('.uninter-atv-theme').data('svestruturaid'),
                check = $el.is(':checked');

            UNINTER.Helpers.ajaxRequest({
                url: UNINTER.AppConfig.UrlWs('sistema') + 'CursoConferencia/' + UNINTER.informacoesCurso.conferencia.id + '/MarcarConferencia/' + check,
                type: 'PUT',
                async: true,
                successCallback: function (data) { },
                errorCallback: function (error) {
                    var revert = (check == true) ? false : true;

                    $el.bootstrapSwitch('state', revert, true);
                }
            });
        },

        setarFrequenciaAluno: function (elemento) {

            var $el = $(elemento.currentTarget),
                svEstruturaId = $el.closest("li.un-accordion-item.clicked.active").find('.uninter-atv-theme').data('svestruturaid'),
                check = $el.is(':checked');

            UNINTER.Helpers.ajaxRequest({
                url: UNINTER.AppConfig.UrlWs('sistema') + 'CursoConferencia/' + UNINTER.informacoesCurso.conferencia.id + '/MarcarFrequenciaAluno/' + check,
                type: 'PUT',
                async: true,
                successCallback: function (data) { },
                errorCallback: function (error) {
                    var revert = (check == true) ? false : true;

                    $el.bootstrapSwitch('state', revert, true);
                }
            });

        },

        // Remove um item do accordion
        removeItem: function removeItem(e) {
            e.stopImmediatePropagation();
            var $el = $(e.currentTarget),
                $item = $el.closest('.uninter-atv-theme-item'),
                itemName = $item.find('.uninter-atv-title-main').text() + ' - ' + $item.find('.uninter-atv-title-text').text(),
                idSalaVirtualEstrutura = $item.prop('id'),
                successHandler = function successHandler(response) {
                    $('#' + idSalaVirtualEstrutura).addClass('un-accordion-item-removed');
                    setTimeout(function () {
                        $('#' + idSalaVirtualEstrutura).remove();
                    }, 600);
                };

            // Modal de Confirmação
            App.Helpers.showModal({
                size: "modal-sm",
                body: 'Deseja realmente excluir o item <br> <b>"' + itemName + '"</b> ?',
                buttons: [{
                    'type': "button",
                    'klass': "btn btn-primary",
                    'text': "Ok",
                    'dismiss': null,
                    'id': 'modal-ok',
                    'onClick': function (event, jQModalElement) {

                        App.Helpers.ajaxRequest({
                            type: 'DELETE',
                            url: App.config.UrlWs('ava') + 'SalaVirtualEstrutura/' + idSalaVirtualEstrutura,
                            async: true,
                            successCallback: successHandler
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

        //Ativa ou inativa uma atividade:
        ativarAtividade: function (e) {
            e.stopImmediatePropagation();
            var $el = $(e.currentTarget);
            var idSalaVirtualAtividade = $el.data('id');
            var ativa = $el.data('ativa');

            var visivel = ativa === true ? false : true;
            var title = ativa === true ? 'visível' : 'invisível';

            App.Helpers.ajaxRequest({
                url: App.config.baseUrl() + 'ava/' + this.rotinaAtividade + '/' + idSalaVirtualAtividade + '/Visivel/' + visivel,
                successCallback: function (data) {
                    $el.attr('title', 'Clique para tornar ' + title);
                    $el.data('ativa', visivel);
                    $el.find('i').toggleClass('icon-eye-slash').toggleClass('icon-eye');
                },
                errorCallback: function () {

                },
                async: true
            });
        },
        alterarOrdenacaoAtividade: function (e) {
            e.stopImmediatePropagation();
            var $el = $(e.currentTarget);
            var movimento = $el.data("order");
            var liClicada = $el.closest(".uninter-atv-item");
            var ordemClicada = liClicada.find(".uninter-atv-header").data('ordem');
            var liIrmao;
            var replace = false;
            var novaOrdemClicada;
            var novaOrdemAnterior;
            if (movimento == "up")
                liIrmao = liClicada.prev(); //busca irmao anterior
            else
                liIrmao = liClicada.next(); //busca irmao posterior            

            if (liIrmao.length > 0) {

                var ordemIrmao = liIrmao.find(".uninter-atv-header").data('ordem');
                var splitOrdemIrmao = parseInt(ordemIrmao, 10);

                //se li irmão é de oferta master...
                if (liIrmao.hasClass("disabled")) {
                    //verifica se ordem está como inteiro ou decimal

                    if (movimento == "up") {
                        splitOrdemIrmao = splitOrdemIrmao - 1;
                        var anteriorIrmaoVinculada = liClicada.prevAll(":not(.disabled)").filter(function () { return parseInt($(this).find(".uninter-atv-header").data('ordem'), 10) == splitOrdemIrmao });//busca anterior atividade da vinculada
                    }
                    else {
                        splitOrdemIrmao = splitOrdemIrmao + 1;
                        var anteriorIrmaoVinculada = liClicada.nextAll(":not(.disabled)").filter(function () { return parseInt($(this).find(".uninter-atv-header").data('ordem'), 10) == splitOrdemIrmao }); //busca proxima atividade da vinculada
                    }
                    if (anteriorIrmaoVinculada.length > 0) {
                        anteriorIrmaoVinculada = anteriorIrmaoVinculada.last()
                        var ordemanteriorIrmaoVinculada = anteriorIrmaoVinculada.find(".uninter-atv-header").data('ordem');

                        if (movimento == "up")
                            novaOrdemClicada = ordemanteriorIrmaoVinculada + 0.1;
                        else novaOrdemClicada = ordemanteriorIrmaoVinculada - 0.1;

                    } else {

                        novaOrdemClicada = splitOrdemIrmao + 0.1;
                    }
                }
                else {
                    replace = true;
                    //nao é oferta maste, inverte ordens
                    novaOrdemAnterior = ordemClicada;
                    novaOrdemClicada = ordemIrmao;
                }

                var idSalaVirtualAtividade = liClicada.find(".uninter-atv-header").data('salaVirtualAtividadeId');
                var url = App.config.baseUrl() + 'ava/' + this.rotinaAtividade + '/' + idSalaVirtualAtividade + '/AlterarOrdem/' + novaOrdemClicada;

                if (replace) {
                    var idSalaVirtualAtividadeIrmao = liIrmao.find(".uninter-atv-header").data('salaVirtualAtividadeId');
                    url = App.config.baseUrl() + 'ava/' + this.rotinaAtividade + '/' + idSalaVirtualAtividade + '/InverterOrdem/' + idSalaVirtualAtividadeIrmao + "/?ordem1=" + novaOrdemClicada + "&ordem2=" + novaOrdemAnterior;
                }



                App.Helpers.ajaxRequest({
                    url: url,
                    successCallback: function (data) {
                        if (replace) {
                            liIrmao.find(".uninter-atv-header").data('ordem', novaOrdemAnterior);
                        }
                        liClicada.find(".uninter-atv-header").data('ordem', novaOrdemClicada);

                        var textoOrdemIrmao = liIrmao.find(".uninter-atv-order-number").text();
                        var textoOrdemClicada = liClicada.find(".uninter-atv-order-number").text();
                        liIrmao.find(".uninter-atv-order-number").html(textoOrdemClicada);
                        liClicada.find(".uninter-atv-order-number").html(textoOrdemIrmao);

                        if (movimento == "up") {
                            liIrmao.before(liClicada);
                        }
                        else {
                            liIrmao.after(liClicada);
                        }

                        if (liClicada.is(":first-child"))
                            liClicada.find(".orderUp").addClass("hidden");
                        else
                            liClicada.find(".orderUp").removeClass("hidden");
                        if (liClicada.is(":last-child"))
                            liClicada.find(".orderDown").addClass("hidden");
                        else liClicada.find(".orderDown").removeClass("hidden");

                        if (liIrmao.is(":first-child")) liIrmao.find(".orderUp").addClass("hidden");
                        else liIrmao.find(".orderUp").removeClass("hidden");
                        if (liIrmao.is(":last-child")) liIrmao.find(".orderDown").addClass("hidden");
                        else liIrmao.find(".orderDown").removeClass("hidden");
                    },
                    errorCallback: function () {

                    },
                    async: false
                });

            }
            //var idSalaVirtualAtividade = $el.data('id');

        },


        actionButtonClick: function (e) {
            var $el = $(e.currentTarget),
                self = this,
                atvUrl = $el.data('url'),
                atvType = $el.data('type'),
                regexp = '/aulas/aula[1-6]{1}/index.html',
                isAvaUrl = atvUrl.match(regexp);

            // Se a url for do ava, abrir na mesma janela.
            // Forçar o tipo 'rota'.
            if (isAvaUrl && atvType === 'hyperibook') {
                atvType = 'rota';
                App.logger.warn('Tipo de atividade: "hyperibook"; "rota" esperado.');
            }

            $el.closest('li.uninter-atv-item').addClass('complete');
            App.Helpers.animatedScrollTop();

            var idAtividade = $el.closest('.uninter-atv-item').prop('id'),
                acao = $el.find('span').text().toLowerCase();

            self.trigger('actionbtnclick', {
                type: atvType,
                url: atvUrl,
                idAtividade: idAtividade,
                acao: acao
            });
        },

        atvCadastrarLinkClick: function (e) {
            e.stopImmediatePropagation();
            var self = this;
            var el = $(e.currentTarget),
                activeItemId = el.closest('.un-accordion-item').prop('id'),
                idrotulotipo = el.data('idrotulotipo');
            $('#slidingBlocksHolder').data('active-item', activeItemId);

            if (el.hasClass("clicked"))
                return;

            //CadastrarAtividadeItemView.getAtividadesTipo();
            var cadastrarAtividadeItemView = new CadastrarAtividadeItemView({
                'idSalaVirtualEstruturaRotuloTipo': idrotulotipo,
                'idSalaVirtualEstrutura': activeItemId,
                'rotinaAtividade': self.rotinaAtividade,
                'urlEditarAtividade': self.urlAposCadastroAtividade

            }),
            linkCadastrar = $('#' + activeItemId).find('.uninter-atv-cadastrar');
            cadastrarAtividadeItemView.render();

            // Executar popover somente após os dados tiverem sido processados
            cadastrarAtividadeItemView.on('rendered', function () {
                el.addClass("clicked");
                popover({
                    'target': linkCadastrar,
                    'content': cadastrarAtividadeItemView.$el
                });
                linkCadastrar.trigger("click");
            });
        },
        atvAtivarEstruturaClick: function (e) {
            e.stopImmediatePropagation();
            var el = $(e.currentTarget),
                activeItemId = el.closest('.un-accordion-item').prop('id'),
                ativo = el.closest('.uninter-atv-theme').data('ativa'),
                self = this;

            var alteraAtivar = (ativo == true) ? false : true; //faz assim pois é string

            App.Helpers.ajaxRequest({
                url: App.config.UrlWs('ava') + self.rotinaEstrutura + "/" + activeItemId + "/Ativar/" + alteraAtivar,
                type: 'GET',
                async: true,
                successCallback: function (response) {
                    el.closest('.uninter-atv-theme').data('ativa', alteraAtivar);

                    if (alteraAtivar) {
                        el.closest('.un-accordion-item').removeClass("disabled");

                        el.prop('title', "Ocultar informação para aluno");

                        //el.find('i').removeClass("icon-eye-slash uninter-atv-ativar-eye-closed").addClass("icon-eye uninter-atv-ativar-eye-open");
                    }
                    else {
                        el.closest('.un-accordion-item').addClass("disabled");

                        el.prop('title', "Exibir informação para aluno");
                        //el.find('i').removeClass("icon-eye uninter-atv-ativar-eye-open").addClass("icon-eye-slash uninter-atv-ativar-eye-closed");

                    }
                }
            });


        },
        atvTitleSecClick: function (e) {

            e.stopImmediatePropagation();
       
            var el = $(e.currentTarget),
                idEstrutura = el.parents('.uninter-atv-theme').data('svestruturaid'),
                cIdEstrutura = el.parents('.uninter-atv-theme').data('svestruturacid'),
                actualName = el.parents('.uninter-atv-title-sec').find('.uninter-atv-title-text').text();
            if (this.idSalaVirtualEstruturaRotuloTipo == this.idSalaVirtualEstruturaRotuloTipoInformacaoCurso) {
                var redirectUrl = '#/ava/' + this.rotinaEstrutura + '/' + cIdEstrutura + '/editar/' + encodeURIComponent(this.idModulo);
                // Fecha as popovers abertas
                $('html').trigger('click.popover');

                document.location = redirectUrl;
            }
            else {
                setTimeout(function () {
                    $('#atv-estrutura-nome-form')
                        .data('svestruturaid', idEstrutura)
                        .data('svestruturacid', cIdEstrutura)
                        .find('input[type=text]').val(actualName).focus().select();
                }, 100);
            }

        },
        atvCursoSecClick: function (e) {
            e.stopImmediatePropagation();

        },
        removeAtividade: function (e) {
            var self = this;
            e.preventDefault();
            e.stopImmediatePropagation();
            var $el = $(e.currentTarget),
                listItem = $el.parents('li.uninter-atv-item'),
                itemName = listItem.find('.uninter-atv-item-title-text').text(),
                idAtividade = listItem.prop('id'),
                successHandler = function (response) {
                    $('#' + idAtividade).addClass('un-accordion-item-removed');
                    setTimeout(function () {
                        $('#' + idAtividade).remove();
                    }, 600);
                };

            // Confirmação
            App.Helpers.showModal({
                size: "modal-sm",
                body: 'Deseja realmente excluir o item <br> <b>"' + itemName + '"</b> ?',
                buttons: [{
                    'type': "button",
                    'klass': "btn btn-primary",
                    'text': "Ok",
                    'dismiss': null,
                    'id': 'modal-ok',
                    'onClick': function (event, jQModalElement) {

                        App.Helpers.ajaxRequest({
                            type: 'DELETE',
                            url: App.config.UrlWs('ava') + self.rotinaAtividade + '/' + idAtividade,
                            async: true,
                            successCallback: successHandler
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

        renderContent: function (e) {

        

            var $el = $(e.currentTarget),
                self = this,
                actionsHolder = $el.parents('.uninter-atv-item.un-accordion-item').find('.uninter-atv-actions-holder'),
                hasContents = !!actionsHolder.contents().length,
                idAtividade = null,
                currentUrl = document.location.href;

            // Envia ao servidor um log com o histórico de navegação
            /*App.logNavigationHistory({
                'data': {
                    'parametros': {
                        'idSala': self.idSalaVirtual,
                        'idAtividade': idAtividade
                    },
                    'url': currentUrl
                }
            });*/

            // detecta se os itens já foram populados.
            var hasContent = !!$el.find('.un-accordion.child').children(".un-accordion-item").length,

            // flag para evitar que o usuário clique no item várias vezes durante o carregamento
                hasBeenClicked = $el.hasClass('clicked');

            // Fecha as popovers abertas
            $('html').trigger('click.popover');

            if (hasContent || hasBeenClicked) {
                $(".uninter-atv-item.un-accordion-item.active article.uninter-atv-description").focus();
                return;
            }

            $el.addClass('clicked');

            // Renderiza os anexos somente se já não houverem sido renderizados
            if (!hasContents) {
                idAtividade = $el.data('idatividade');
                var salaVirtualAtividadeId = $el.data('salaVirtualAtividadeId'),

                    dataHandler = function (r) {
                        var itemAprendizagem;
                        if (r.atividadeItemAprendizagens.length) {
                            itemAprendizagem = renderItemAprendizagem(r, self.areaPerms, salaVirtualAtividadeId, self);
                        }

                        actionsHolder.append(itemAprendizagem);

                        if ($("#" + salaVirtualAtividadeId).hasClass('active') == false) {
                            $("#" + salaVirtualAtividadeId).addClass('active');
                        }

                        // Click no link: Abre uma modal para informar ao usuário que o link será aberto em uma nova aba/janela
                        $('#unAccordion .uninter-atv-links a').on('click', function (e) {
                            e.preventDefault();
                            var $el = $(e.currentTarget);
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
                                        window.open($el.prop('href'), '_blank');
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
                        });

                        self.buscarItensAprendizagemAcessados(idAtividade);
                    };

                // Requisição ao servidor
                App.Helpers.ajaxRequest({
                    url: App.config.baseUrl() + 'atv/AtividadeItemAprendizagem/' + idAtividade + '/Atividade?complementar=false',
                    successCallback: dataHandler,
                    async: true
                });
            }
            $(".uninter-atv-item.un-accordion-item.active article.uninter-atv-description").focus();
        },

        // Renderiza as atividades da aula ao ser clicada
        renderSubItems: function (e) {
            var $el = $(e.currentTarget),
                self = this,
                svEstruturaId = $el.find('.uninter-atv-theme').data('svestruturaid'),
                svEstruturacId = $el.find('.uninter-atv-theme').data('svestruturacid'),
                estuturaRotuloId = $el.find('.uninter-atv-theme').data('estuturarotuloid'),
                descricaoEstrutura = $el.find('.uninter-atv-theme .descricaoEstrutura').html(),
            // detecta se os itens já foram populados.
                hasContent = !!$el.find('.un-accordion.child').children(".uninter-atv-item").length,

            // flag para evitar que o usuário clique no item várias vezes durante o carregamento
                hasBeenClicked = $el.hasClass('clicked');

            // Fecha as popovers abertas
            $('html').trigger('click.popover');

            if (hasContent || hasBeenClicked) { return; }

            $el.addClass('clicked');

            if (descricaoEstrutura) {
                var tplDescricaoEstrutura = '';

                if (estuturaRotuloId == 43 || estuturaRotuloId == 44 || estuturaRotuloId == 45 || estuturaRotuloId == 46) {
                    
                    var check;//UNINTER.informacoesCurso.obraImpressa == true ? 'checked' : '';
                    var podeEditar = 'disabled';

                    if (estuturaRotuloId == 43)
                        check = UNINTER.informacoesCurso.obraImpressa == true ? 'checked' : '';
                    else if (estuturaRotuloId == 44)
                        check = UNINTER.informacoesCurso.conferencia.conferencia == true ? 'checked' : '';
                    else if (estuturaRotuloId == 45)
                        check = UNINTER.informacoesCurso.conferencia.conferenciaLive == true ? 'checked' : '';
                    else if (estuturaRotuloId == 46)
                        check = UNINTER.informacoesCurso.conferencia.alunoPodeMarcarPresenca == true ? 'checked' : '';
                    
                    if (UNINTER.permissoesCurso != void (0) && UNINTER.permissoesCurso.indexOf('editar') > -1) {
                        podeEditar = '';
                    }

                    tplDescricaoEstrutura = '<li class="uninter-atv-item un-accordion-item">' +
                        '<div class="uninter-atv-number"></div>' +
                        '<div class="uninter-atv-holder header">' +
                        '<div class="un-accordion-item-content">' +
                        '<div class="uninter-atv-description-content"> ' +
                        '<span class="uninter-atv-item-description">' + descricaoEstrutura + ' <input type="checkbox" id="' + self.estuturaRotulo[estuturaRotuloId].elemento + '" ' + check + ' ' + podeEditar + '></span>' +
                        '</div>' +
                        '</div>' +
                        '</div></li>';
                } else {
                    tplDescricaoEstrutura = '<li class="uninter-atv-item un-accordion-item">' +
                        '<div class="uninter-atv-number"></div>' +
                        '<div class="uninter-atv-holder header">' +
                        '<div class="un-accordion-item-content">' +
                        '<div class="uninter-atv-description-content"> ' +
                        '<span class="uninter-atv-item-description">' + descricaoEstrutura + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</div></li>';
                }

                $el.find('ul.child').append(tplDescricaoEstrutura);

                if (estuturaRotuloId == 43 || estuturaRotuloId == 44 || estuturaRotuloId == 45 || estuturaRotuloId == 46) {
                    $("#" + self.estuturaRotulo[estuturaRotuloId].elemento).bootstrapSwitch({
                        onText: "<i class='icon-check'>",
                        offText: "<i class='icon-times' style='font-size: 0.9em'>",
                        size: "large",
                        onColor: 'success',
                        offColor: 'danger',
                        onSwitchChange: function (e, state) {

                            self.estuturaRotulo[estuturaRotuloId].funcao(e, state);

                        }
                    });
                }

            }

            //var setarObraFisica = function (e) {
                
            //    var $el = $(e.currentTarget),
            //        svEstruturaId = $el.closest("li.un-accordion-item.clicked.active").find('.uninter-atv-theme').data('svestruturaid'),
            //        check = $el.is(':checked');

            //    UNINTER.Helpers.ajaxRequest({
            //        url: UNINTER.AppConfig.UrlWs('sistema') + 'Curso/0/AtualizarObraImpressaCurso',
            //        type: 'PUT',
            //        async: true,
            //        data: {
            //            id: UNINTER.informacoesCurso.id,
            //            obraImpressa: check
            //        },
            //        successCallback: function (data) { },
            //        errorCallback: function (error) {
            //            //$el.prop('checked', !check);
            //            var revert = (check == true) ? false : true;
            //            $el.bootstrapSwitch('state', revert, true);
            //        }
            //    });
            //}

            // App.loadingView.reveal();
            var errorCalbackAtividade = function (r) {

                if (r.status == 404) {
                    if ($el.find('.un-accordion.child').children(".uninter-atv-item").length == 0) {
                        var semAtividadesTemplate = '<li class="uninter-atv-item un-accordion-item">' +
                               '<div class="uninter-atv-number"></div>' +
                               '<div class="uninter-atv-holder header">' +
                               '<div class="flashMessageInnerAtv"></div>' +
                               '</div></li>';

                        $el.find('ul.child').append(semAtividadesTemplate);

                        App.flashMessage({
                            'body': 'Ainda não há informações cadastradas para este item',
                            'appendTo': $el.find('.flashMessageInnerAtv')
                        });
                    }
                }
                return;
            }
            // Faz requisição para pegar os subitems
            var nestedViewDataHandler = function (r) {
         
                var hasAtividades = r[self.contractAtividade].length;

                if (!hasAtividades) {
                    var semAtividadesTemplate = '<li class="uninter-atv-item un-accordion-item">' +
                        '<div class="uninter-atv-number"></div>' +
                        '<div class="uninter-atv-holder header">' +
                        '<div class="flashMessageInnerAtv"></div>' +
                        '</div></li>';

                    $el.find('ul.child').append(semAtividadesTemplate);

                    App.flashMessage({
                        'body': 'Ainda não há atividades cadastradas para este item',
                        'appendTo': $el.find('.flashMessageInnerAtv')
                    });

                    return;
                }

                $.when(
                        templateLoader.get('atividades-accordion-nested-row-template.html')
                    )
                    .done(function (nestedRowTemplate) {

                        var obj = {
                            'exibirDetalhesAtividade': self.exibirDetalhesAtividade,
                            'containerViewInstance': self,
                            'serverResponse': r[self.contractAtividade],
                            'nestedViewClass': NestedRowView,
                            'nestedViewTemplate': nestedRowTemplate,
                            'nestedViewDataHandler': function atvDescriptionHandler(props) {
                                
                                var atvTitulo = null,
                                    tempContainer = $('<div tab=index="0">'),
                                    possuiImagemApoio = true,
                                    idAtividadeTipoRotuloImagem = [167, 168, 169, 170, 171, 172, 173, 174, 175];

                                var urlImagem = "";

                                if (props.attrs.urlSistemaRepositorio != void (0) && props.attrs.urlSistemaRepositorio != "") {
                                    urlImagem = props.attrs.urlSistemaRepositorio
                                } else {
                                    if (self.permissaoEditarAtividade) {
                                        possuiImagemApoio = false;
                                        urlImagem = 'https://univirtuscdn.uninter.com/public/img/imagemApoioRoteiroEstudo.jpg';
                                    }

                                }

                                var possuiImagem = false;

                                // Descrição: 2, Orientação: 5
                                _.each(props.attrs.atividadeEtiquetas, function getTituloDescricao(etiqueta) {

                                    var posicao;

                                    _.each(props.attrs.atividadeEtiquetas, function getTituloDescricao(etiqueta, key) {
                                        if (etiqueta.idRecurso == 23) {
                                            posicao = key;
                                        }
                                    });

                                    // Título da atividade
                                    if (etiqueta.idTipoRotulo === 1 && !self.ocultarStatusAtividade) { atvTitulo = etiqueta.texto ? App.Helpers.newLineToBr(etiqueta.texto) : '(Sem Título)'; }

                                        // Items da descrição da atividade.
                                    else {
                                        // O campo foi preenchido

                                        if (possuiImagem === false && urlImagem != "" && posicao != void (0)) {
                                            var divImg = $('<div>', { 'class': 'pull-left', 'id': 'tagImgAtv', 'data-idatividade': props.attrs.idAtividade, 'data-id': props.attrs.atividadeEtiquetas[posicao].id, 'data-idatividadetipo': props.attrs.idAtividadeTipo, 'data-idatividadetiporotulo': props.attrs.atividadeEtiquetas[posicao].idAtividadeTipoRotulo }),
                                                tagRemoveImageAtividade = $('<a>', { 'href': 'javascript: void(0);', 'id': 'removerImagemAtividade', 'data-id': props.attrs.atividadeEtiquetas[posicao].id, 'class': possuiImagemApoio ? '' : 'hidden' }).html('remover'),
                                                tagEditImageAtividade = $('<a>', { 'href': 'javascript: void(0);', 'id': 'tagEditImageAtividade', 'data-id': props.attrs.atividadeEtiquetas[posicao].id }).html(possuiImagemApoio ? 'alterar' : 'inserir'),
                                                tagEditImg = $('<a>', { 'href': 'javascript: void(0);', 'id': 'tagEditImageAtividade', 'data-idAtividade': props.attrs.idAtividade, 'data-id': props.attrs.atividadeEtiquetas[posicao].id }),
                                                tagImg = $('<img>', { 'src': urlImagem }),
                                                divUpload = $('<div>', { 'id': 'uploadArquivoViewGenerica', 'class': 'hidden' }),
                                                divLink = $('<div>');

                                            if (self.permissaoEditarAtividade) {

                                                divLink.append(tagEditImageAtividade).append(tagRemoveImageAtividade);

                                                tagEditImg.append(tagImg);
                                                divImg.append(tagEditImg);
                                                divImg.append(divLink).append(divUpload);
                                            } else {
                                                divImg.append(tagImg);
                                            }

                                            tempContainer.append(divImg);

                                            possuiImagem = true;
                                        }

                                        if (etiqueta.texto && idAtividadeTipoRotuloImagem.indexOf(etiqueta.idAtividadeTipoRotulo) == -1) {
                                            etiqueta.texto = App.Helpers.newLineToBr(etiqueta.texto);
                                            var classe = '';
                                            if (possuiImagem) {
                                                classe = 'uninter-atv-description-content';
                                            } else {
                                                classe = 'uninter-atv-description-content';
                                            }
                                            var holder = $('<div>', { 'class': classe }),
                                                itemTitle = $('<span>', { 'class': 'uninter-atv-item-description-title' }),
                                                itemDescription = $('<span>', { 'class': 'uninter-atv-item-description' }).html(etiqueta.texto || '(Vazio)');

                                            if (etiqueta.nomeRotulo)
                                                itemTitle.html(etiqueta.nomeRotulo + ': ');
                                            holder.html(itemTitle).append(itemDescription);
                                            tempContainer.append(holder);

                                        }

                                        if (self.permissaoEditarAtividade) {

                                            $("#accordionContainer #tagImgAtv[data-idatividade='" + props.attrs.idAtividade + "'] #uploadArquivoViewGenerica").empty();

                                            var fnPlaceHolder = function () { };

                                            var fnOnComplete = function (links) { };

                                            var extensoesPermitidas = "png,gif,jpeg,jpg";

                                            var fnUpload = function (uploadManager) {
                                                uploadManager({
                                                    element: "#accordionContainer #tagImgAtv[data-idatividade='" + props.attrs.idAtividade + "'] #uploadArquivoViewGenerica",
                                                    onStop: UNINTER.UploadImagemAtividade,
                                                    acceptFileTypes: extensoesPermitidas,
                                                    maxNumberOfFiles: 1
                                                });

                                                UNINTER.viewGenerica.setPlaceholderHeight();
                                            }

                                            var getUploadArquivo = UNINTER.viewGenerica.getUploadArquivo(fnUpload);

                                        }
                                        // else {
                                        //                                        App.logger.info('Campo não preenchido - ID: "'+props.attrs.id+'"; Propriedade: "' + etiqueta.nomeRotulo +'"');
                                        //}
                                    }

                                });
                                
                                var tpl = _.template(self.urlEditarAtividade);
                                var urlEditarAtividade = tpl(props.attrs);

                                var tpl = _.template(self.urlExcluirAtividade);
                                var urlExcluirAtividade = tpl(props.attrs);


                                //var permissaoEditarAtividade = App.auth.viewCheckPerms('editar', self.areaPermsAtividade);
                                //var permissaoRemoverAtividade = App.auth.viewCheckPerms('remover', self.areaPermsAtividade);
                                if (self.idSalaVirtualEstruturaRotuloBloqueado == estuturaRotuloId) {
                                    self.permissaoEditarAtividade = null;
                                    self.permissaoRemoverAtividade = null;
                                }
                                var editarAtividade = self.permissaoEditarAtividade,
                                    removerAtividade = self.permissaoRemoverAtividade,
                                    exibirIconeExclusiva = false,
                                    totalFilhas = 0,
                                    classeAtividade = "";

                                try {
                                    totalFilhas = App.StorageWrap.getItem("leftSidebarItemView").totalFilhas;
                                } catch (e) { }

                                if (editarAtividade && (props.attrs.atividadeOfertaMaster || (totalFilhas > 0 && !props.attrs.exclusiva)))
                                    exibirIconeExclusiva = true;

                                if (props.attrs.atividadeOfertaMaster) {
                                    editarAtividade = null;
                                    removerAtividade = null;
                                    classeAtividade = "atividadeOfertaMaster";
                                }
                                var total = props.obj.length;

                                var tempProgress = $('<div tab=index="0">');

                                var arrIdAtividadeTipo = [1, 2, 5, 10, 13, 14, 15];

                                return {
                                    'svEstruturaId': svEstruturaId,
                                    'svEstruturacId': svEstruturacId,
                                    'salaVirtualAtividadeId': props.attrs.id,
                                    'idAtividade': props.attrs.idAtividade,
                                    'ativa': props.attrs.ativa,
                                    'atvNum': props.key + 1,
                                    'atvTitulo': atvTitulo,
                                    'atvDataFim': props.attrs.dataFim,
                                    'atvNomeTipoAtividade': props.attrs.nomeTipoAtividade,
                                    'idAtividadeTipo': props.attrs.idAtividadeTipo,
                                    'exibeBarraProgresso': arrIdAtividadeTipo.indexOf(props.attrs.idAtividadeTipo) < 0 ? false : true,
                                    'atvDescription': tempContainer.html(),
                                    'icone': props.attrs.icone,
                                    'atvActions': '',
                                    'atvAdmActions': '',
                                    'editar': editarAtividade,
                                    'remover': removerAtividade,
                                    'urlEditarAtividade': urlEditarAtividade,
                                    'urlExcluirAtividade': urlExcluirAtividade,
                                    'ocultarStatusAtividade': self.ocultarStatusAtividade,
                                    'exclusiva': props.attrs.exclusiva,
                                    'exibirIconeExclusiva': exibirIconeExclusiva,
                                    'classeAtividade': classeAtividade,
                                    'ordem': props.attrs.ordem,
                                    'total': total,
                                    'pendencia': props.attrs.pendencia,
                                    'idItemAprendizagem': props.attrs.idItemAprendizagem,
                                    'porcentagemAcessado': props.attrs.porcentagemAcessado,
                                    'totalAcessado': props.attrs.totalAcessado,
                                    'totalItemAprendizagem': props.attrs.totalItemAprendizagem
                                };
                            },
                            nestedViewHTMLElementSelector: 'ul.child',
                            onRenderAfter: function () {
                                //Ajusta o evento de ativar ou inativar a atividade:
                                
                                self.trigger('atividaderendered');

                            }
                        };
                        processCollection(obj);

                        var idSalaVirtualEstrutura = $("#unAccordion li.uninter-atv-theme-item.un-accordion-item.active").attr('id');

                        self.buscarIndicadorEstrutura(idSalaVirtualEstrutura);

                    });
            };

            self.permissaoEditarAtividade = App.auth.viewCheckPerms('editar', self.areaPermsAtividade);
            self.permissaoRemoverAtividade = App.auth.viewCheckPerms('remover', self.areaPermsAtividade);



            var objParam = {
                rotinaAtividade: self.rotinaAtividade,
                idSalaVirtualEstrutura: svEstruturaId,
                cIdSalaVirtualEstrutura: svEstruturacId,
                idModulo: self.idModulo,
                idSalaVirtualEstruturaRotulo: estuturaRotuloId,
                editar: self.permissaoEditarAtividade,
                idSalaVirtualOfertaPai: self.idSalaVirtualOfertaPai,
                idSalaVirtualOfertaAproveitamento: self.idSalaVirtualOfertaAproveitamento
            }
  
            var urlBuscarAtividade = (self.urlBuscarAtividade) ? (self.urlBuscarAtividade) : 'ava/<%= rotinaAtividade %>/0/EstruturaOferta/<%= idModulo %>/?id=<%= idSalaVirtualEstrutura %>&editar=<%= editar %>&idSalaVirtualOfertaPai=<%= idSalaVirtualOfertaPai %>&idSalaVirtualOfertaAproveitamento=<%= idSalaVirtualOfertaAproveitamento %>';
            var SVUrl = _.template(App.config.baseUrl() + urlBuscarAtividade);
            var url = SVUrl(objParam);
            App.Helpers.ajaxRequest({
                url: url,
                successCallback: nestedViewDataHandler,
                errorCallback: errorCalbackAtividade,
                async: true
            });
        },

        //obraFisica: function (e) {

        //    var $el = $(e.currentTarget),
        //        svEstruturaId = $el.closest("li.un-accordion-item.clicked.active").find('.uninter-atv-theme').data('svestruturaid'),
        //        check = $el.is(':checked');

        //    UNINTER.Helpers.ajaxRequest({
        //        url: UNINTER.AppConfig.UrlWs('ava') + 'CursoEstrutura',
        //        type: 'PUT',
        //        async: true,
        //        data: {
        //            id: svEstruturaId,
        //            ativa: true,
        //            descricao: check,
        //            excluido: false
        //        },
        //        successCallback: function (data) { },
        //        errorCallback: function (error) {
        //            $el.prop('checked', !check);
        //        }
        //    });

        //},

        // Renderiza as aulas
        renderItems: function () {
            var self = this, collection;
            $.when(
                    collectionLoader.get('SalaVirtual'),
                    templateLoader.get('atividades-accordion-row-template.html')
                )
                .done(function (Entity, rowTemplate) {
                    collection = new Entity({
                        'idSalaVirtual': self.idSalaVirtual,
                        'idSalaVirtualOferta': self.idSalaVirtualOferta,
                        'idSalaVirtualOfertaPai': self.idSalaVirtualOfertaPai,
                        'idSalaVirtualOfertaAproveitamento': self.idSalaVirtualOfertaAproveitamento,
                        'idSalaVirtualEstruturaRotuloTipo': self.idSalaVirtualEstruturaRotuloTipo,
                        'urlBuscarEstrutura': self.urlBuscarEstrutura,
                        'contractEstrutura': self.contractEstrutura
                    });
                    collection.fetch({
                        success: function (r) {
                  
                            $('#flashMessageInner').empty();
                            if (r.models.length === 0) {
                                self.noItems('#slidingBlocksContainer .activities-box', 'Não há nenhum roteiro de estudo cadastrado para esta sala virtual. <br> <a href="#/ava">Voltar</a>');
                            }
                            var obj = {
                                containerViewInstance: self,
                                exibirDetalhesAtividade: self.exibirDetalhesAtividade,
                                serverResponse: r,
                                viewClass: RowView,
                                viewTemplate: rowTemplate,
                                viewDataHandler: function (props) {
                                    var properties = props.attrs.toJSON();
                                    // Carrega o dropdown de cadastrar nova atividade
                                    setTimeout(function triggerViewProcessedHandler() {
                                        self.trigger('viewProcessed', properties.id);
                                    }, 500);

                                    var permissaoEdicao = App.auth.viewCheckPerms('editar', self.areaPerms);
                                    var permissaoIncluirAtividade = App.auth.viewCheckPerms('cadastrar', self.areaPerms);
                                    var permissaoRemover = App.auth.viewCheckPerms('remover', self.areaPerms);
                                    var permissaoEdicaoAtivo = null;
                                    if (self.exibirDetalhesAtividade)
                                        permissaoEdicaoAtivo = App.auth.viewCheckPerms('editar', self.areaPerms);

                                    if (properties.idSalaVirtualEstruturaRotulo == self.idSalaVirtualEstruturaRotuloBloqueado) {
                                        permissaoEdicao = null;
                                        permissaoIncluirAtividade = null;
                                        permissaoEdicaoAtivo = null;
                                    }
                                    if (properties.estruturaOfertaMaster) {
                                        permissaoEdicao = null;
                                        permissaoEdicaoAtivo = null;
                                        permissaoRemover = null;
                                    }

                                    var titleAtivar = properties.ativa ? 'Ocultar informação para aluno' : 'Exibir informação para aluno';
                                    var temaNomeCompleto = properties.nome || '(Sem Nome)';
                                    return {
                                        'nome': temaNomeCompleto,
                                        'nomeCompleto': temaNomeCompleto,
                                        'totalAtividades': properties.totalAtividades,
                                        'idSalaVirtual': properties.idSalaVirtual,
                                        'svEstruturaId': properties.id,
                                        'svEstruturacId': properties.cId,
                                        'estuturaRotuloId': properties.idSalaVirtualEstruturaRotulo,
                                        'ordem': properties.ordem,
                                        'nomeSalaVirtualEstruturaRotulo': properties.nomeSalaVirtualEstruturaRotulo,
                                        'idSalaVirtualEstruturaRotuloTipo': properties.idSalaVirtualEstruturaRotuloTipo,
                                        'ativa': properties.ativa,
                                        'descricaoSalaVirtualEstruturaRotulo': properties.descricao,
                                        'editar': permissaoEdicao,
                                        'editarAtivo': permissaoEdicaoAtivo,
                                        'remover': permissaoRemover,
                                        'cadastrar': permissaoIncluirAtividade,
                                        "nomeCadastrarItem": self.nomeCadastrarItem,
                                        'urlEditarEstrutura': self.urlEditarEstrutura,
                                        'titleAtivar': titleAtivar

                                    };
                                }
                            };

                            processCollection(obj);
                            // Abre o ítem inicial
                            self.setInitialActive();

                            self.on('viewProcessed', function (idSalaVirtualEstrutura) {

                                // Instância da view de cadastro de novo item
                                /*if (App.auth.viewCheckPerms('cadastrar', self.areaPerms)) {
                                    
                                    var cadastrarAtividadeItemView = new CadastrarAtividadeItemView({
                                        'idSalaVirtualEstruturaRotuloTipo': self.idSalaVirtualEstruturaRotuloTipo,
                                        'idSalaVirtualEstrutura': idSalaVirtualEstrutura,
                                        'rotinaAtividade': self.rotinaAtividade,
                                        'urlEditarAtividade': self.urlAposCadastroAtividade
                                        
                                        }),
                                        linkCadastrar = $('#'+idSalaVirtualEstrutura).find('.uninter-atv-cadastrar');                                    
                                    cadastrarAtividadeItemView.render();
                                    
                                    
                                    // Executar popover somente após os dados tiverem sido processados
                                    cadastrarAtividadeItemView.on('rendered', function () {
                                        popover({
                                            'target': linkCadastrar,
                                            'content': cadastrarAtividadeItemView.$el
                                        });
                                    });
                                    
                                }*/


                                if (App.auth.viewCheckPerms('cadastrar', self.areaPerms) && App.auth.viewCheckPerms('editar', self.areaPerms)) {
                                    if (self.idSalaVirtualEstruturaRotuloTipo != self.idSalaVirtualEstruturaRotuloTipoInformacaoCurso) {
                                        // popover
                                        var popoverContent = '<form id="atv-estrutura-nome-form" class="form-horizontal">' +
                                            '<div class="input-group">' +
                                            '<input type="text" class="form-control">' +
                                            '<span class="input-group-btn">' +
                                            '<button class="btn-primary btn"><i class="icon-check"></i></button>' +
                                            '</span>' +
                                            '</div>' +
                                            '</form>';

                                        var pop = popover({
                                            'target': '#unAccordion .uninter-atv-title-sec .btn-edit',
                                            'content': popoverContent
                                        });
                                    }
                                    // Evento de submit do form uninter-atv-estrutura-nome
                                    $('body').off('submit.uninter-atv-estrutura-nome-form')
                                        .on('submit.uninter-atv-estrutura-nome-form', '#atv-estrutura-nome-form', function (e) {
                                            e.preventDefault();


                                            var el = $(e.currentTarget),
                                                svEstruturaId = el.data('svestruturaid'),
                                                estruturaNome = el.find('input[type=text]').val(),
                                                atvTitleSec = $('#' + svEstruturaId + ' .uninter-atv-title-sec');

                                            if (estruturaNome) {
                                                var data = {
                                                    'id': el.data('svestruturaid'),
                                                    'nome': estruturaNome,
                                                    'ativa': true
                                                };
                                                App.Helpers.ajaxRequest({
                                                    'async': true,
                                                    'type': 'PUT',
                                                    'url': App.config.UrlWs('ava') + 'SalaVirtualEstrutura',
                                                    'data': data,
                                                    'successCallback': function () {
                                                        pop.hide();

                                                        atvTitleSec.find('.uninter-atv-title-text').text(estruturaNome);

                                                        // Success icon
                                                        atvTitleSec.find('.btn-edit').removeClass('in');
                                                        atvTitleSec.find('i.success-feedback').addClass('in');

                                                        setTimeout(function () {
                                                            atvTitleSec.find('i').removeClass('in');
                                                            atvTitleSec.find('.btn-edit').addClass('in');
                                                        }, 3000);
                                                    }
                                                });
                                            }

                                        });
                                }
                                setNomeSalaVirtualEstruturaRotulo();
                            });

                            self.trigger('rendered');
                        },
                        error: function error(response) {
                            self.noItems(null, 'Nenhum roteiro de estudo a listar.');
                            self.trigger('rendered');
                        }
                    });
                });
        },

        // Mostra mensagem na tela informando que não há itens a mostrar
        noItems: function (element, msg) {
            // Mudando o elemento para 'DIV
            msg = msg || 'Nenhum roteiro de estudo a listar <br> <a href="#/ava">Voltar</a>';
            element = element || '#flashMessageInner';

            App.flashMessage({
                body: msg,
                appendTo: element
            });
        },

        addOne: function (item) {
            this.$el.append(item);
        },

        // Define o item do accordion que deverá ser aberto.
        // Recebe os parâmetros da url "idTema" e "idAtividade", percorre os itens e executa um evento "click" no item que
        // possui o mesmo id;
        // Caso não existam esses parâmetros, abre o item default, no caso, o primeiro item do accordion.
        setInitialActive: function () {

            if (UNINTER.StorageWrap.getItem("leftSidebarItemView") != void(0) && !UNINTER.StorageWrap.getItem("leftSidebarItemView").usuarioInscrito)
                return;

            var atividadeEstruturaAtual = UNINTER.StorageWrap.getItem("atividadeEstruturaAtual");

            if (atividadeEstruturaAtual != undefined) {
                this.idTema = atividadeEstruturaAtual.idTema;
                this.idAtividadeParam = atividadeEstruturaAtual.idSalaVirtualAtividade
            }


            var tema = $('#' + this.idTema),
                atividade,
                doNotOpenDefault = !!tema.length;



            // Não há id do tema ou da atividade na url
            if (!doNotOpenDefault) {
                //$('#unAccordion li:first-child').trigger('click');                
                $('#unAccordion>li:first-child').trigger('click');
                return;
            }

            // Há o id do tema
            if (this.idTema) { tema.trigger('click'); }

            // Há o id da atividade
            if (this.idAtividadeParam) {
                this.on('atividaderendered', function () {
                    atividade = $('#' + this.idAtividadeParam);
                    atividade.find('.uninter-atv-header').trigger('click');

                });
            }

        },

        // Buscamos a última atividade/estrutura acessada pelo aluno
        buscaAtividadeEstruturaAtual: function () {

            UNINTER.StorageWrap.removeItem("atividadeEstruturaAtual");
            
            /*if (this.idSalaVirtualOferta != null) {*/
                App.Helpers.ajaxRequest({
                    type: 'GET',
                    url: App.config.UrlWs('ava') + 'SalaVirtualAtividade/' + this.idSalaVirtualOferta + "/SalaVirtualEstruturaAtividadeAtual",
                    async: true,
                    successCallback: function (response) {

                        var retorno = response.salaVirtualAtividade;

                        this.idAtividadeAtual = retorno.idAtividade;
                        this.idSalaVirtualEstruturaAtual = retorno.idSalaVirtualEstrutura;

                        if (this.idSalaVirtualEstruturaAtual != undefined && this.idSalaVirtualEstruturaAtual > 0) {

                            this.idTema = retorno.idSalaVirtualEstrutura;
                            this.idAtividadeParam = retorno.id;

                            this.exibirItemInicial = true;

                            var exibirItemInicial = true;

                        }

                        var objSessao = {
                            idAtividadeAtual: retorno.idAtividade,
                            idSalaVirtualEstruturaAtual: retorno.idSalaVirtualEstrutura,
                            idTema: retorno.idSalaVirtualEstrutura,
                            idAtividadeParam: retorno.idAtividade,
                            exibirItemInicial: exibirItemInicial,
                            idSalaVirtualAtividade: retorno.id
                        };

                        UNINTER.StorageWrap.setItem("atividadeEstruturaAtual", objSessao);
                    }
                });
           /* }*/

        },

        // Buscamos o desempenho do aluno nos itens de aprendizagem
        buscarDesempenhoItemAprendizagem: function () {

            // Colocado o return para não montar a barra de progresso da sala
            return;

            var self = this, collection;

            UNINTER.StorageWrap.removeItem("desempenhoItemAprendizagem");

            App.Helpers.ajaxRequest({
                type: 'GET',
                url: App.config.UrlWs('atv') + 'AtividadeItemAprendizagem/' + this.idSalaVirtualOferta + "/GetAtividadeItemAprendizagemBuscarDesempenho",
                async: true,
                successCallback: function (response) {

                    var retorno = response.atividadeItemAprendizagem;

                    var objSessao = {
                        totalItemAprendizagem: retorno.totalItemAprendizagem,
                        totalItemAprendizagemAcessado: retorno.totalItemAprendizagemAcessado,
                        totalSemanasOferta: retorno.totalSemanasOferta,
                        totalSemanasOfertaAgora: retorno.totalSemanasOfertaAgora,
                        totalDiasOferta: retorno.totalDiasOferta,
                        totalDiasOfertaAgora: retorno.totalDiasOfertaAgora,
                        vigente: retorno.vigente,
                        porcentagemAcesso: null,
                        porcentagemIndicado: null,
                        mensagemDesempenho: null,
                        porcentagemSemanaIndicado: null,
                        porcentagemPorSemana: null
                    };

                    UNINTER.StorageWrap.setItem("desempenhoItemAprendizagem", objSessao);

                    self.calcularPorcentagemAcessoItem();

                    self.renderBarraProgresso();

                }

            });

        },

        // Calculamos a porcentagem de acesso do aluno nos itens de aprendizagem
        calcularPorcentagemAcessoItem: function () {

            var objSessao = UNINTER.StorageWrap.getItem("desempenhoItemAprendizagem");

            var porcentagemAcesso, porcentagemAcessoSemana, porcentagemSemanaIndicado, porcentagemPorSemana, porcentagemIndicado, mensagem;

            // Calcular o percentual de acesso aos itens de aprendizagem
            porcentagemAcesso = (objSessao.totalItemAprendizagemAcessado * 100) / objSessao.totalItemAprendizagem;

            // Se o período da oferta estiver vigente, verifica o percentual de acesso com o indicado para montar a mensagem
            if (objSessao.vigente == true) {

                // Percentual que o aluno teria que ter concluído baseado no total de dias da oferta
                porcentagemIndicado = (objSessao.totalDiasOfertaAgora * 100) / objSessao.totalDiasOferta;

                // Percentual que o aluno teria que ter concluído baseado no total de Semanas da oferta
                porcentagemSemanaIndicado = (objSessao.totalSemanasAgora * 100) / objSessao.totalSemanasOferta;

                // Percentual que o aluno tem que ter concluído por semana
                porcentagemPorSemana = 100 / objSessao.totalSemanasOferta;

            } else {
                porcentagemIndicado = 100;

            }

            objSessao.porcentagemAcesso = parseInt(porcentagemAcesso);
            objSessao.porcentagemIndicado = parseInt(porcentagemIndicado);
            objSessao.mensagemDesempenho = mensagem;
            objSessao.porcentagemPorSemana = parseInt(porcentagemPorSemana);
            objSessao.porcentagemSemanaIndicado = parseInt(porcentagemSemanaIndicado);

            UNINTER.StorageWrap.setItem("desempenhoItemAprendizagem", objSessao);

        },

        CriarTelaUpload: function () {

            $("#accordionContainer #tagImgAtv[data-idatividade='" + idAtividade + "'] #uploadArquivoViewGenerica").empty();

            var fnPlaceHolder = function () { };

            var fnOnComplete = function (links) { };

            var extensoesPermitidas = "png,gif,jpeg,jpg";

            var fnUpload = function (uploadManager) {
                uploadManager({
                    element: "#accordionContainer #tagImgAtv[data-idatividade='" + idAtividade + "'] #uploadArquivoViewGenerica",
                    //element: "#accordionContainer #uploadArquivoViewGenerica",
                    onStop: self.UploadImagemAtividade,
                    acceptFileTypes: extensoesPermitidas,
                    maxNumberOfFiles: 1
                });

                UNINTER.viewGenerica.setPlaceholderHeight();
            }

            var getUploadArquivo = UNINTER.viewGenerica.getUploadArquivo(fnUpload);
        },

        // Renderiza a barra de progresso na tela para o aluno
        renderBarraProgresso: function () {

            // Colocado o return para não montar o gráfico referente a todos os itens de aprendizagem 
            return;

            if (UNINTER.StorageWrap.getItem("desempenhoItemAprendizagem")) {

                $("#progressoContainer").html('');

                var objSessao = UNINTER.StorageWrap.getItem("desempenhoItemAprendizagem");

                var porcentagemAcesso, porcentagemIndicado, mensagem;

                porcentagemAcesso = parseInt(objSessao.porcentagemAcesso);
                porcentagemIndicado = parseInt(objSessao.porcentagemIndicado) - porcentagemAcesso;
                mensagem = objSessao.mensagemDesempenho;

                $("#breadcrumb .breadcrumb li:eq(1)").remove();
                $("#breadcrumb .breadcrumb li:eq(1)").remove();

                $("#breadcrumb .breadcrumb").append('<li></li><li class="svg-container" style="max-width: 50px;margin-top: -50px;" id="breadcrumbProgress"></li>');



                UNINTER.viewGenerica.circliful($("#breadcrumbProgress"), {
                    trailWidth: 1.8,
                    animation: 1,
                    animationStep: 10,
                    textSize: 64,
                    textColor: '#4270a1',
                    fontColor: '#4270a1',
                    percent: porcentagemAcesso,
                    showPercent: 1,
                    target: 0,
                    halfCircle: 1,
                    alwaysDecimals: 1
                });



                $("#breadcrumbProgress svg").attr('viewBox', '0 0 80 85');

                $("#breadcrumbProgress").before("");

            }

        },

        buscarIndicadorEstrutura: function (id) {

            if (UNINTER.StorageWrap.getItem("leftSidebarItemView") != void(0) && !UNINTER.StorageWrap.getItem("leftSidebarItemView").usuarioInscrito)
                return;

            var ofertaMaster = (UNINTER.StorageWrap.getItem("leftSidebarItemView") && UNINTER.StorageWrap.getItem("leftSidebarItemView").ofertaMaster);
            var idSalaVirtualOfertaAproveitamento = ofertaMaster ? this.idSalaVirtualOfertaAproveitamento : null;

            App.Helpers.ajaxRequest({
                type: 'GET',
                url: App.config.UrlWs('ava') + 'SalaVirtualAtividade/' + id + "/SalaVirtualEstruturaAtividadeDesempenho/" + this.idSalaVirtualOferta + "?idSalaVirtualOfertaPai=" + idSalaVirtualOfertaAproveitamento,//this.idSalaVirtualOfertaAproveitamento,
                async: true,
                successCallback: function (response) {

                    var retorno = response.salaVirtualAtividades;

                    _.each(retorno, function (valor, key) {

                        $("#barraProgressoAtividade[data-idestrutura='" + valor.id + "']").attr('data-totalacessado', valor.totalAcessado);
                        $("#barraProgressoAtividade[data-idestrutura='" + valor.id + "']").attr('data-totalitem', valor.totalItemAprendizagem);
                        $("#barraProgressoAtividade[data-idestrutura='" + valor.id + "']").attr('data-porcentagemacessado', valor.porcentagemAcessado);
                        $("#barraProgressoAtividade[data-idestrutura='" + valor.id + "'] .progress .progress-bar").attr('aria-valuenow', valor.porcentagemAcessado);
                        $("#barraProgressoAtividade[data-idestrutura='" + valor.id + "'] .progress .progress-bar").css('width', valor.porcentagemAcessado + '%');
                        $("#barraProgressoAtividade[data-idestrutura='" + valor.id + "'] #textProgressBar span").html(valor.porcentagemAcessado + '%')

                        $("#barraProgressoAtividade[data-idestrutura='" + valor.id + "'] #mensagem").addClass('hidden');
                        $("#barraProgressoAtividade[data-idestrutura='" + valor.id + "'] #actions").removeClass('hidden');

                    });
                },
                errorCallback: function () {
                    $('#' + id + ' #mensagem').addClass('hidden');
                    $('#' + id + ' #actions').removeClass('hidden');
                }

            });

        },

        buscarItensAprendizagemAcessados: function (id) {

            if (UNINTER.StorageWrap.getItem("leftSidebarItemView") != void(0) && !UNINTER.StorageWrap.getItem("leftSidebarItemView").usuarioInscrito)
                return;

            App.Helpers.ajaxRequest({
                type: 'GET',
                url: App.config.UrlWs('atv') + 'AtividadeItemAprendizagem/' + id + "/GetAtividadeItemAprendizagemAcessado/",
                async: true,
                successCallback: function (response) {

                    var retorno = response.atividadeItemAprendizagens;

                    _.each(retorno, function (valor, key) {

                        $("#statusitemAprendizagem_" + valor.idItemAprendizagem).removeClass('hidden');

                    });


                }

            });

        },

        setInitialActiveItem: function () {

            if (UNINTER.StorageWrap.getItem("leftSidebarItemView") != void(0) && UNINTER.StorageWrap.getItem("leftSidebarItemView").usuarioInscrito == null) {
                return;
            }

            var atividadeEstruturaAtual = UNINTER.StorageWrap.getItem("atividadeEstruturaAtual");

            var atividade = $("#" + this.idAtividadeParam),
                doNotOpenDefault = !!atividade.length;;

            if (!doNotOpenDefault) {

                $(".un-accordion.child .un-accordion-item .uninter-atv-header:first-child").trigger('click');
                return;
            }

            if (this.idAtividadeParam) {
                atividade.trigger('click');
            }

        },

        render: function () {
            
            if (this.idSalaVirtual) {

                if (UNINTER.StorageWrap.getItem("leftSidebarItemView") != void(0) && UNINTER.StorageWrap.getItem("leftSidebarItemView").usuarioInscrito) {
                    this.buscarDesempenhoItemAprendizagem();
                }

                this.buscaAtividadeEstruturaAtual();

                this.renderItems();
            }
            else if (this.barraProgressoDesempenho == false) { this.noItems(); }
            return this;
        }
    });

});



UNINTER.UploadImagemAtividade = function (e) {

    var $el = $(e.currentTarget)
    var elemento = $("#unAccordion li.active li.active #tagImgAtv");

    var id = $("#unAccordion li.active li.active #tagImgAtv a#tagEditImageAtividade").attr('data-id');
    var idAtividade = elemento.data('idatividade');
    var arquivosTemporarios = $("#unAccordion li.active li.active #tagImgAtv #uploadArquivoViewGenerica input[name='arquivosTemporarios']").val();
    var idAtividadeTipo = elemento.data('idatividadetipo');
    var idAtividadeTipoRotulo = elemento.data('idatividadetiporotulo');

    UNINTER.Helpers.ajaxRequest({
        url: UNINTER.AppConfig.UrlWs('atv') + 'AtividadeEtiqueta',
        type: 'PUT',
        data: {
            id: id,
            idAtividade: idAtividade,
            valorEtiqueta: arquivosTemporarios,
            idAtividadeTipoRotulo: idAtividadeTipoRotulo,
            idRecurso: 23
        },
        async: true,
        successCallback: function (data) {

            UNINTER.Helpers.ajaxRequest({
                url: UNINTER.AppConfig.UrlWs('atv') + 'AtividadeEtiqueta/' + data.id + '/Get',
                type: 'GET',
                async: true,
                successCallback: function (data) {

                    $("#tagImgAtv[data-idatividade='" + idAtividade + "']").attr('data-id', data.atividadeEtiqueta.id);
                    $("#tagImgAtv[data-idatividade='" + idAtividade + "'] #removerImagemAtividade").attr('data-id', data.atividadeEtiqueta.id);
                    $("#tagEditImageAtividade[data-idatividade='" + idAtividade + "']").attr('data-id', data.atividadeEtiqueta.id);
                    $("#tagEditImageAtividade[data-idatividade='" + idAtividade + "']").children().attr('src', data.atividadeEtiqueta.urlSistemaRepositorio);

                    $("#tagImgAtv[data-idatividade='" + idAtividade + "'] div:first a:first").attr('data-id', data.atividadeEtiqueta.id);
                    $("#tagImgAtv[data-idatividade='" + idAtividade + "'] div:first a:first").html('alterar');

                    $("#tagImgAtv[data-idatividade='" + idAtividade + "'] div:first a:eq(1)").removeClass('hidden').children().data('id', data.atividadeEtiqueta.id);

                },
                errorCallback: function (data) {

                }
            });

        },
        errorCallback: function (data) {

        }
    });

    $("#accordionContainer #tagImgAtv[data-idatividade='" + idAtividade + "'] #uploadArquivoViewGenerica").empty();

    var fnPlaceHolder = function () { };

    var fnOnComplete = function (links) { };

    var extensoesPermitidas = "png,gif,jpeg,jpg";

    var fnUpload = function (uploadManager) {
        uploadManager({
            element: "#accordionContainer #tagImgAtv[data-idatividade='" + idAtividade + "'] #uploadArquivoViewGenerica",
            //element: "#accordionContainer #uploadArquivoViewGenerica",
            onStop: UNINTER.UploadImagemAtividade,
            acceptFileTypes: extensoesPermitidas,
            maxNumberOfFiles: 1
        });

        UNINTER.viewGenerica.setPlaceholderHeight();
    }

    var getUploadArquivo = UNINTER.viewGenerica.getUploadArquivo(fnUpload);

}