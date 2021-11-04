/* ==========================================================================
   PAP Controller
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 05/02/2014
   ========================================================================== */

define(function (require) { 
    'use strict';
    // Dependências
    var $ = require('jquery');
    var App = require('app');
    var Marionette = require('marionette');
    var MainLayout = require('views/pap/MainLayout');
    var LeftSidebarItemView = require('views/pap/LeftSidebarItemView');
    var Backbone = require('backbone');

    var layout = 'two-columns';

    var formActionsView;
    var leftSidebarItemView;

    return Marionette.Controller.extend({
        initialize: function () {
            // View Loader
            this.viewLoader = new App.LazyLoader('views/pap');

            // Common View Loader
            this.commonViewLoader = new App.LazyLoader('views/common');
        },

        indexPap: function () {
            App.Historico.set("indexPap");
            App.auth.checkCredentials();

            document.location = '#/pap/comunicados';
        },

        // Método mapeado nas rotas do papRouter
        solicitacoes: function (id) {
            App.pageLayout(layout).set();
            App.Historico.set("solicitacoes");

            var mainLayout = new MainLayout();

            // Content
            $.when(
                this.viewLoader.get('SolicitacoesLayout'),
                this.commonViewLoader.get('BreadcrumbView'),
                this.commonViewLoader.get('FormActionsView')
            ).done(function (SolicitacoesLayout, BreadcrumbView, FormActionsView) {
                var options = {
                    breadcrumbItems: [{ text: 'Solicitações' }]
                };
                var contentView = new SolicitacoesLayout({'solicitacaoId': id });
                var breadcrumbView = new BreadcrumbView(options);

                 // Pega as ações
                var area = 'solicitacao';
                var areaPerms = App.auth.getAreaPermsMetodo(area);
                leftSidebarItemView = leftSidebarItemView ||  new LeftSidebarItemView({'actions': areaPerms});

                formActionsView = new FormActionsView({'actions': areaPerms });

                mainLayout.on('show', function () {
                    mainLayout.content.show(contentView);
                    mainLayout.actions.show( formActionsView );
                    mainLayout.breadcrumb.show( breadcrumbView );
                });
                
                // Mostra as regiões principais
                App.mainRegion.show(mainLayout);

                // Mostra / Fecha sidebars
                App.leftSidebarItemView.show(leftSidebarItemView);
                App.rightSidebarItemView.close();


                // Listener para o evento disparado pela view de solicitacoes para mudar o estado atual do Breadcrumb
                App.vent.on('solicitacoes:updateBreadcrumb', function (data) {
                    breadcrumbView.update(data);
                });

                // Listener do evento de restaurar o status original do Breadcrumb
                App.vent.on('solicitacoes:restoreBreadcrumb', function () {
                    breadcrumbView.restore();
                });

                // Listener para definir qual item do slider deve ser mostrado
                App.vent.on('solicitacoes:slide', function (n) {
                    contentView.slider.setActiveItem(n);
                });

                // View das Ações do Formulário - Eventos
                formActionsView.on('all', function (action) {
                    if ( action === 'cadastrar' ) {
                        contentView.slider.setActiveItem(2);
                        App.vent.trigger('solicitacoes:rendercadastrarform');
                    }
                });

                // Click na seta de "voltar"
                $('.goBack').on('click', function () {
                    contentView.slider.setActiveItem(1);
                    breadcrumbView.restore();
                });
            });
        },

        comunicados: function () {
            App.Historico.set("comunicados");
            App.pageLayout(layout).set();

            var mainLayout = new MainLayout();
            
            // Content
            $.when(
                this.viewLoader.get('ComunicadosLayout'), 
                this.commonViewLoader.get('BreadcrumbView'),
                this.commonViewLoader.get('FormActionsView')
            ).done( function (ComunicadosLayout, BreadcrumbView, FormActionsView) {
                // Content
                var options = {
                    breadcrumbItems: [{ text: 'Comunicados' }]
                };
                var contentView = new ComunicadosLayout();
                var breadcrumbView = new BreadcrumbView(options);

                // Pega as ações
                var area = 'comunicado';
                var areaPerms = App.auth.getAreaPermsMetodo(area);

                leftSidebarItemView = leftSidebarItemView ||  new LeftSidebarItemView({actions: areaPerms});

                // Passa as permissões da área para o módulo de ações de formulário.
                // Ele aplicará os botões de acordo com as permissões do usuário atual.
                formActionsView = new FormActionsView({ actions: areaPerms });
                
                mainLayout.on('show', function () {
                    mainLayout.breadcrumb.show( breadcrumbView );
                    mainLayout.actions.show( formActionsView );
                    mainLayout.content.show( contentView ); 
                });

                // Mostra as regiões principais
                App.showMainRegions({'leftSidebarItemView': leftSidebarItemView});
                App.mainRegion.show(mainLayout);
                App.rightSidebarItemView.close();

                contentView.on('all', function (event, data) {
                    switch(event) {
                        case 'updatebreadcrumb':
                            breadcrumbView.update(data);
                            break;
                        case 'restorebreadcrumb':
                            breadcrumbView.restore();
                            break;
                    }
                });

                // View das Ações do Formulário - Eventos
                formActionsView.on('all', function (action) {
                    if ( action === 'cadastrar' ) {
                        contentView.slider.setActiveItem(2);
                        contentView.renderForm();
                    }
                });
                
            });
        },

        relatorios: function (type) {
            App.pageLayout(layout).set();
            var relatoriosTipos = {}, relatorioTipo;
            relatoriosTipos['relatorio-periculosidade'] = 'relatorioPericulosidade';
            relatoriosTipos['relatorio-usuarios'] = 'relatorioUsuariosPolo';
            relatorioTipo = relatoriosTipos[type];
            return this[ relatorioTipo ]();
        },

        relatorioUsuariosPolo: function () {
            App.Historico.set("RelatorioUsuariosPolo");

            var mainLayout = new MainLayout();
            leftSidebarItemView = leftSidebarItemView ||  new LeftSidebarItemView();

            $.when(
                this.viewLoader.get('RelatorioUsuariosPolo'),
                this.commonViewLoader.get('BreadcrumbView'),
                this.commonViewLoader.get('FormActionsView')
            ).done(function (ComunicadosLayout, BreadcrumbView) {

                var options = {
                    breadcrumbItems: [{ text: 'Relatórios' }]
                };
                var breadcrumbView = new BreadcrumbView(options);

                // Content
                var RelatorioPericulosidadeItemView = require('views/pap/RelatorioUsuariosPolo');
                var content = new RelatorioPericulosidadeItemView();

                mainLayout.on('show', function () {
                    mainLayout.breadcrumb.show( breadcrumbView );
                    mainLayout.content.show( content ); 
                });

                // Mostra as regiões principais
                App.showMainRegions({'leftSidebarItemView': leftSidebarItemView});
                App.mainRegion.show(mainLayout);
                App.rightSidebarItemView.close();
            });
        },
        relatorioPericulosidade: function () {
            App.Historico.set("relatorioPericulosidade");

            var mainLayout = new MainLayout();
            leftSidebarItemView = leftSidebarItemView ||  new LeftSidebarItemView();

            $.when(
                this.viewLoader.get('RelatorioPericulosidadeItemView'),
                this.commonViewLoader.get('BreadcrumbView'),
                this.commonViewLoader.get('FormActionsView')
            ).done(function (ComunicadosLayout, BreadcrumbView) {
                
                var options = {
                    breadcrumbItems: [{ text: 'Relatórios' }]
                };
                var breadcrumbView = new BreadcrumbView(options);

                // Content
                var RelatorioPericulosidadeItemView = require('views/pap/RelatorioPericulosidadeItemView');
                var contentView = new RelatorioPericulosidadeItemView();
                
                mainLayout.on('show', function () {
                    mainLayout.content.show( contentView );
                    mainLayout.breadcrumb.show( breadcrumbView );
                });

                // Mostra as regiões principais
                App.showMainRegions({'leftSidebarItemView': leftSidebarItemView});
                App.mainRegion.show(mainLayout);
                App.rightSidebarItemView.close();
            });
        },

        // Redirecionamento de emails dos relatórios
        email: function email () {
            App.Historico.set("email");
            var param = Backbone.history.fragment.split('?')[1];
            var response = App.session.loginByURL(param);
            if ( response.url ) {
                // Backbone.history.navigate(response.url);
                document.location = response.url;
            } else {
                App.redirecter({ delay: 5000, message: 'Este link perdeu a validade. Redirecionando para a página de login... Erro #001' });
            }
        }
    });

});