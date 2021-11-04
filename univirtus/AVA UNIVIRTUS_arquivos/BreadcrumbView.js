/* ==========================================================================
   Breadcrumb View
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 03/03/2014
   ========================================================================== */
define(function (require) {
    'use strict';

    require('livicons');

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        App = require('app'),

        animatedIconsLib = require('libraries/animatedIcons'),
        animatedIcons = animatedIconsLib({ 'selector': '#dock i.livicon', 'iconOptions': { 'size': 26, 'color': '#4270a1' } }),

        BreadCrumbItemView = Backbone.View.extend({
            tagName: 'li',
            render: function (item) {
                if ( item.href ) {
                    var link = $('<a>', { href: item.href });

                    if (item.titleHref) {
                        link.attr("title", item.titleHref);
                    }

                    link.text(item.text);
                    this.$el.append(link);
                }
                else {
                    this.$el.text(item.text);
                }

                if (item.className) {
                    this.$el.addClass(item.className);
                }

                if (item.expressaoIdioma) {

                    var dados = {
                        id: item.expressaoIdioma
                    };

                    var link = $('<i>', { 'class': "icon-question-circle icon-left-margin-pointer" })
                    link.on('click', function () {
                        var opcoes = {
                            url: UNINTER.AppConfig.UrlWs("Sistema") + "/ExpressaoIdioma/" + item.expressaoIdioma + "/Exibir",
                            type: 'GET',
                            data: null,
                            async: false
                        }
                        var retorno = UNINTER.Helpers.ajaxRequestError(opcoes);

                        UNINTER.Helpers.showModal({
                            size: "",
                            body: retorno.resposta.expressaoIdioma.nome,
                            title: 'Ajuda',
                            buttons: [{
                                'type': "button",
                                'klass': "btn btn-primary",
                                'text': "Fechar",
                                'dismiss': null,
                                'id': 'modal-ok',
                                'onClick': function (event, jQModalElement) {
                                    jQModalElement.modal('hide');
                                }
                            }],
                            'onClose': function (jQModalElement) {
                                jQuery(".modal-body").empty();
                            }
                        });
                    });
                    this.$el.append(link);
                }
                return this;
            }
        }),

        BreadCrumbView = Backbone.View.extend({
            initialize: function (options) {
                this.breadcrumbItems = options.breadcrumbItems;
                this.rotina = options.rotina;
                this.idUrl = options.idUrl;
                this.permissaoRelatorio = void (0);
                animatedIcons.add();
            },
            tagName: 'ol',
            className: 'breadcrumb',
            breadcrumbItems: null,
            
            validarRelatorio: function () {

                //return;

                var self = this;

                //Verifica se já testou permissao de relatorio:
                this.permissaoRelatorio = UNINTER.session.get('permissaoRelatorio');

                //Se ainda não testou, vamos testar...
                if (this.permissaoRelatorio == void (0)) {
                    var areaPerms = App.auth.getAreaPermsMetodo('relatorio');
                    
                    var permitido = App.auth.viewCheckPerms('visualizar', areaPerms);

                    if (permitido) {
                        UNINTER.session.set('permissaoRelatorio', true);
                        this.permissaoRelatorio = true;
                    } else {
                        UNINTER.session.set('permissaoRelatorio', false);
                        this.permissaoRelatorio = false;
                    }
                }

                //Tem permissão na ação? Então pesquisa permissao na rotina:
                if (this.permissaoRelatorio == true && self.rotina != void (0) && (
                        self.rotina.toLowerCase() == 'avaliacao'
                    || (self.rotina.toLowerCase() == 'aluno' && (self.idUrl != null && self.idUrl.toLowerCase() == "home"))
                    || self.rotina.toLowerCase() == 'dispensa'
                    ))
                {


                    //Restrito a 1 e 11 por hora:
                    //var perfil = _.where(UNINTER.StorageWrap.getItem('user').perfis, { idPerfil: 11 });
                    //if (perfil == null || perfil == void (0) || perfil.length == 0)
                    //{
                    //    var perfil = _.where(UNINTER.StorageWrap.getItem('user').perfis, { idPerfil: 1 });
                    //}

                    $("#iconeRelatorio div").html('<a href="#/ava/relatorio/' + self.rotina + '"><span class="action-bar-icon"><i class="icon-paper-alt"></i></span><span class="action-bar-icon-text">&nbsp; Relatórios</span></a>');
                    //if(perfil.length > 0)
                    //{
                    //    $("#iconeRelatorio div").html('<a href="#/ava/relatorio/' + self.rotina + '"><span class="action-bar-icon"><i class="icon-paper-alt"></i></span><span class="action-bar-icon-text">&nbsp; Relatórios</span></a>');
                    //}

                    /*
                    var opt = {
                        url: App.config.UrlWs('relatorio') + '/relatorio/' + self.rotina + '/PermissaoNomeRotina',
                        type: 'GET',
                        async: true,
                        successCallback: function (data) {
                            $("#iconeRelatorio div").html('<a href="#/ava/relatorio/' + self.rotina + '"><span class="action-bar-icon"><i class="icon-paper-alt"></i></span><span class="action-bar-icon-text">&nbsp; Relatórios</span></a>');
                        },
                        errorCallback: function (data) {
                            $("#iconeRelatorio div").empty();
                        }
                    };
                    App.Helpers.ajaxRequest(opt);
                    */
                }
            },
            update: function (item) {
                if ( this.breadcrumbItems === '' ) {
                    throw new Error('O primeiro item do Breadcrumb não foi informado');
                }
                if ( !item ) {
                    throw new Error('O novo item do Breadcrumb não foi informado');
                }
                var items = _.clone(this.breadcrumbItems);
                items.push({text: item});
                this.render(items);
                $("#breadcrumb ol").focus();
                this.validarRelatorio();
            },
            restore: function () {
                this.render(this.breadcrumbItems);
            },
            render: function (item) {
                this.validarRelatorio();
                if ( !this.breadcrumbItems ) {
                    throw new Error('O primeiro item do Breadcrumb não foi informado');
                }
                if ( typeof this.breadcrumbItems !== "object" ) {
                    throw new TypeError('Informado \'<'+typeof this.breadcrumbItems+'>\'; \'<Object>\' esperado.');
                }
                var bcItems = item || this.breadcrumbItems;
                this.$el.empty();

                _.each(bcItems, function (bcItem) {
                    var itemView = new BreadCrumbItemView();
                    this.$el.append(itemView.render(bcItem).$el);
                }, this);

                this.$el.attr('tabindex', -1);
                $("#breadcrumb ol").focus();
                return this;
            }
        });

    return BreadCrumbView;
});