/* ==========================================================================
 Ava Controller
 @author: Thyago Weber (thyago.weber@gmail.com)
 @date: 05/02/2014
 ========================================================================== */
define(function (require) {
    'use strict';

    // Dependências
    var App = require('app'),
        Marionette = require('marionette'),
        $ = require('jquery'),
        _ = require('underscore'),

        viewLoader,
        commonViewLoader,
        libraryLoader,
        templateLoader,

        mainLayout,

        layout = 'three-columns',

        urlToRotina = {
            'roteiro-de-estudo': 'atividade',
            inicio: 'salavirtual',
            historico: 'salavirtual',
            atividadesteste: 'atividade',
            atividadesteste2: 'salavirtual'
        };

    // @TODO MainLayout deve ser o mesmo para todos. Deve ser reinstanciado somente quando a página é recarregada.
    // Novas regions e métodos devem ser adicionados / verificados a cada mudança de rota.

    return Marionette.Controller.extend({
        initialize: function initialize () {
            viewLoader = new App.LazyLoader('views/ava');
            commonViewLoader = new App.LazyLoader('views/common');
            libraryLoader = new App.LazyLoader('libraries');
            templateLoader = new App.LazyLoader('text!templates');
        },

        index: function index(idCurso, idSala) {
            
            $("html").css("overflow", '');

            $.when(
                viewLoader.get('Home/MainLayoutHome'),
//                viewLoader.get('Home/SlidingBlockLayout'),
                commonViewLoader.get('SlidingBlockBaseLayout'),
                viewLoader.get('common/LeftSidebarHomeItemView'),
                viewLoader.get('common/RightSidebarItemView'),
                viewLoader.get('Home/HomeHeaderItemView'),
                
                //viewLoader.get('Home/ActionsItemView'),                
                viewLoader.get('Home/HomeNavbarView'),
                viewLoader.get('EnqueteUsuario/EnqueteUsuarioView')
            ).done(function (MainLayout, SlidingBlockLayout, LeftSidebarItemView, RightSidebarItemView, HomeHeaderItemView, HomeNavbarView, EnqueteUsuarioView) {
                App.pageLayout(layout).set();
                
                // Pega as ações
                var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina.inicio),
                    leftSidebarItemView = new LeftSidebarItemView({ 'actions': areaPerms }),
                    rightSidebarItemView = new RightSidebarItemView({ 'areaPerms': areaPerms });

//                mainLayout = mainLayout || new MainLayout();
                mainLayout = new MainLayout();

                var contentView = new SlidingBlockLayout({ 'areaPerms': areaPerms, 'template': _.template('<div id="slidingBlocksContainer"></div>') });

                var homeHeader = new HomeHeaderItemView();
                
                //var actions = new ActionsView({'areaPerms': areaPerms, 'areaName': 'salavirtual'});
                
                contentView.on('show', function contentViewShow() {
                    var accordionView = new HomeNavbarView({ 'areaPerms': areaPerms, historico: false });
                    contentView.$('#slidingBlocksContainer').append(accordionView.render().$el);
                });

                mainLayout.on('show', function () {
                    mainLayout.content.show(contentView);
                    mainLayout.homeHeader.show(homeHeader);                    
                    //mainLayout.actions.show(actions);

                    setTimeout(function () {
                        var tamanhoDireita = parseInt($("#rightSidebarItemView").height());
                        var tamanhoEsquerda = parseInt($("#leftSidebarItemView").height());

                        var tamanho = tamanhoEsquerda;
                        if (tamanhoDireita > tamanhoEsquerda) { tamanho = tamanhoDireita };

                        if (tamanho != void (0) && tamanho > 0) {
                            tamanho = tamanho + 30;
                            $("#midContentHolder").css("min-height", tamanho);
                        }
                    }, 500);

                });

                // Listener para o header do header da página inicial
                homeHeader.on('show', function homeHeaderShow() {
                    this.$('h1').focus();                                    
                });
                
                // Mostrar Sidebars
                // App.viewManager.set({ 'viewName': 'leftSidebarItemView', 'viewInstance': leftSidebarItemView, 'layoutInstance': App, 'type': 'static' });
                // App.viewManager.set({ 'viewName': 'rightSidebarItemView', 'viewInstance': rightSidebarItemView, 'layoutInstance': App, 'type': 'static' });
                App.leftSidebarItemView.show(leftSidebarItemView);
                App.rightSidebarItemView.show(rightSidebarItemView);

                // Mostra as regiões principais
                // App.showMainRegions({'headerItemView': headerItemView, 'mainRegion': mainLayout, 'footerItemView': footerItemView});
                App.mainRegion.show(mainLayout);

                var enqueteUsuario = new EnqueteUsuarioView({ rotina: "home", acao: "exibir" });

            });
        },

        'roteiro-de-estudo': function (id, idSalaVirtualOferta, idTema, idAtividade, clean) {

            if (clean == 'true') {
                App.StorageWrap.removeItem("leftSidebarItemView");
                var location = '#/ava/roteiro-de-estudo/' + encodeURIComponent(id) + '/' + encodeURIComponent(idSalaVirtualOferta);
                if (idTema != void (0) && idTema.length > 1) {
                    location += '/' + idTema;
                    if (idAtividade != void (0) && idAtividade.length > 1) {
                        location += '/' + idAtividade;
                    }
                }
                window.location = location;
                return;
            }


            $("html").css("overflow", '');

            var selfIdSalaVirtualOferta = null;
            var cIdSalaVirtualOferta = null;
            var redirecionarCentralMidia = false;
            var sessao = App.StorageWrap.getItem("leftSidebarItemView");
            try{
                selfIdSalaVirtualOferta = sessao != null ? sessao.idSalaVirtualOferta : null;
                cIdSalaVirtualOferta = sessao != null ? App.StorageWrap.getItem("leftSidebarItemView").cIdSalaVirtualOferta: null;
                cIdSalaVirtualOferta = cIdSalaVirtualOferta == null ? idSalaVirtualOferta : cIdSalaVirtualOferta;
            } catch (e) {
                if (idSalaVirtualOferta > 0)
                    selfIdSalaVirtualOferta = idSalaVirtualOferta;
                else
                    selfIdSalaVirtualOferta = null;
            }

            //verifica se nao deve ser redirecionado para central de midia
            if (UNINTER.StorageWrap.getItem('user').usuarioSianee) {
                try {
                    if (_.findWhere(UNINTER.StorageWrap.getItem('user').usuarioSianee, { "idSianeeAtendimento": 19 })) {
                        redirecionarCentralMidia = true;
                    }
                }
                catch (e) { }
            }

            App.pageLayout('two-columns').set();

            $.when(
                viewLoader.get('Atividades/MainLayout'),
                viewLoader.get('Atividades/SlidingBlockLayout'),
                viewLoader.get('common/LeftSidebarItemView'),
                viewLoader.get('common/RightSidebarItemView'),
                commonViewLoader.get('BreadcrumbView'),
                viewLoader.get('Atividades/ActionsItemView'),
                viewLoader.get('EnqueteUsuario/EnqueteUsuarioView')                
            ).done(function (MainLayout, SlidingBlockLayout, LeftSidebarItemView, RightSidebarItemView, BreadcrumbView, ActionsView, EnqueteUsuarioView) {
             
                // Checagem do MainLayout
                //                mainLayout = mainLayout || new MainLayout();
                mainLayout = new MainLayout();
                //var contentView = null;

                //Ações
                var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina['roteiro-de-estudo']);
                
                var idSalaVirtualOfertaPai,
                    idSalaVirtualOfertaAproveitamento,
                    idSalaVirtualMetodoInscricao,
                    totalFilhas,
                    idCurso,
                    nomeCurso,
                    gerarRoteiro = true,
                    idCursoModalidade,
                    usuarioInscrito = true;

                var objSalaVirtual = App.Helpers.getSalaVirtual(id);
                var nomeSala = objSalaVirtual.nome;
                var idCursoModalidade = objSalaVirtual.idCursoModalidade;
                var idCurso = objSalaVirtual.idCurso;
                var idSalaVirtualMetodoInscricao = objSalaVirtual.idSalaVirtualMetodoInscricao;
                var totalAvaliacao = 0;
                var totalTrabalho = 0;
                var idUsuarioSalaVirtualOferta = 0;
           
               

                if (!_.contains(areaPerms, "cadastrar")) {
                   
                    var data = App.Helpers.getCodigoOfertAtual(objSalaVirtual.id);
                    if (data.idSalaVirtualOferta > 0) {
                        selfIdSalaVirtualOferta = data.idSalaVirtualOferta;
                        try {
                            idUsuarioSalaVirtualOferta = data.id;
                            totalAvaliacao = data.totalAvaliacao;
                            totalTrabalho = data.totalTrabalho;
                            idSalaVirtualOfertaAproveitamento = data.idSalaVirtualOfertaAproveitamento;
                            totalFilhas = data.totalFilhas;
                            idCurso = data.idCurso;
                            nomeCurso = data.nomeCurso;
                            idSalaVirtualOfertaPai = data.idSalaVirtualOfertaPai;
                            idCursoModalidade = data.idCursoModalidade;
                            idCurso = data.idCurso;
                            if (data.idSalaVirtualOfertaAproveitamento > 0 && data.nomeSalaVirtual) {
                                nomeSala = data.nomeSalaVirtual;
                            }
                        } catch (e) { }
                    }
                }
                else {
                    gerarRoteiro = false;
                }
                
                                
                var options = {
                    breadcrumbItems: [{ text: 'Roteiro de Estudo' }]
                };
                    
               

                // Fechar RightSidebar
                App.rightSidebarItemView.close();

                // App.showMainRegions({ 'headerItemView': headerItemView, 'mainRegion': mainLayout, 'footerItemView': footerItemView });
                App.mainRegion.show(mainLayout);

                var fnChangeSalaVirtualOferta = function () {                    
                    
                    try {
                        selfIdSalaVirtualOferta = App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOferta;
                    } catch (e) {
                        selfIdSalaVirtualOferta = null;
                    }
                                        
                    var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina['roteiro-de-estudo']);
                    
                    if (UNINTER.StorageWrap.getItem('leftSidebarItemView').usuarioInscrito) {
                        //remove permissoes que nao sejam visualizacao
                        if (areaPerms) {
                            areaPerms = ['visualizar'];
                        }
                    }

                    //Se não estiver sendo simulado.
                    if (UNINTER.StorageWrap.getItem('user').idUsuarioSimulador == 0 && UNINTER.StorageWrap.getItem('leftSidebarItemView').usuarioInscrito) {
                        if (UNINTER.StorageWrap.getItem('AssistenteVirtual') == null || UNINTER.StorageWrap.getItem('AssistenteVirtual').exibido == false) {

                            //Verificamos se existem solicitações de tentativas para apol's
                            UNINTER.Helpers.ajaxRequest({
                                url: UNINTER.AppConfig.UrlWs('bqs') + "AvaliacaoUsuarioExpiracao/0/Pendentes?idSalaVirtualOferta=" + selfIdSalaVirtualOferta,
                                successCallback: function (data) {
                                    
                                    UNINTER.StorageWrap.setItem('AssistenteVirtual', { 'idAssistenteVirtualTipo': 1, 'assistente': data, 'exibido': true });
                                    UNINTER.redirecter({ 'url': '#/ava/assistentevirtual' });
                                }
                            });

                        }

                        if (UNINTER.StorageWrap.getItem('AssistenteVirtualTrabalho') == null || UNINTER.StorageWrap.getItem('AssistenteVirtualTrabalho').exibido == false) {

                            //Verificamos se existem solicitações de tentativas para apol's
                            UNINTER.Helpers.ajaxRequest({
                                url: UNINTER.AppConfig.UrlWs('interacao') + "TrabalhoEntregaAceite/" + selfIdSalaVirtualOferta + "/BuscarPendente",
                                successCallback: function (data) {

                                    UNINTER.StorageWrap.setItem('AssistenteVirtualTrabalho', { 'idAssistenteVirtualTipo': 1, 'assistente': data, 'exibido': true });
                                    UNINTER.redirecter({ 'url': '#/ava/assistentevirtualtrabalho' });
                                }
                            });

                        }
                    }
                   
                    var breadcrumbView = new BreadcrumbView(options),
                    actions = new ActionsView({ 'areaPerms': areaPerms, 'areaName': 'SalaVirtualAtividade', 'salaVirtualId': id, 'idCursoModalidade': idCursoModalidade, 'idCurso': idCurso }),
                    contentView = new SlidingBlockLayout({ 'areaPerms': areaPerms, 'svId': id, 'idTema': idTema, 'idAtividade': idAtividade, 'idSalaVirtualOferta': selfIdSalaVirtualOferta, 'redirecionarCentralMidia': redirecionarCentralMidia });

                    mainLayout.content.show(contentView);

                    mainLayout.breadcrumb.show(breadcrumbView);
                    mainLayout.actions.show(actions);

                    // Ação disparada ao ser criado um novo módulo
                    actions.on('modulecreated', function () {
                        mainLayout.content.show(contentView);
                    });

                };
       
                var leftSidebarItemView = new LeftSidebarItemView(
                    {
                        'actions': areaPerms,
                        'idSalaVirtual': objSalaVirtual.id,
                        'cIdSalaVirtual': id,
                        'nomeSalaVirtual': nomeSala,
                        'idSalaVirtualOferta': selfIdSalaVirtualOferta,
                        'cIdSalaVirtualOferta': cIdSalaVirtualOferta,
                        'idSalaVirtualOfertaPai': idSalaVirtualOfertaPai,
                        'idSalaVirtualOfertaAproveitamento': idSalaVirtualOfertaAproveitamento,
                        'totalFilhas': totalFilhas,
                        'fnChangeSalaVirtualOferta': fnChangeSalaVirtualOferta,
                        idCurso: idCurso,
                        nomeCurso: nomeCurso,
                        idCursoModalidade: idCursoModalidade,
                        usuarioInscrito: usuarioInscrito,
                        idSalaVirtualMetodoInscricao: idSalaVirtualMetodoInscricao,
                        totalAvaliacao: totalAvaliacao,
                        totalTrabalho: totalTrabalho,
                        idUsuarioSalaVirtualOferta: idUsuarioSalaVirtualOferta,
                    });
               
                // Armazena o id da sala virtual para uso posterior.
                leftSidebarItemView.storeSvId();
                
                // Mostrar Sidebars
                // App.leftSidebarItemView.show(leftSidebarItemView);
                App.viewManager.set({ 'viewName': 'leftSidebarItemView', 'viewInstance': leftSidebarItemView, 'layoutInstance': App, 'type': 'static' });
                
                var enqueteUsuario = new EnqueteUsuarioView({ rotina: "roteiro-de-estudo", acao: "exibir" });

                $("#sidebar-link-based header.active").focus();


            });
        },

        historico: function index(idCurso, idSala) {

            $("html").css("overflow", '');

            $.when(
                viewLoader.get('Home/MainLayoutHome'),
//                viewLoader.get('Home/SlidingBlockLayout'),
                commonViewLoader.get('SlidingBlockBaseLayout'),
                viewLoader.get('common/LeftSidebarHomeItemView'),
                viewLoader.get('common/RightSidebarItemView'),
                viewLoader.get('Home/HomeHeaderItemView'),                
                viewLoader.get('Home/HomeNavbarView')
                
            ).done(function (MainLayout, SlidingBlockLayout, LeftSidebarItemView, RightSidebarItemView, HomeHeaderItemView, HomeNavbarView) {
            
                App.pageLayout(layout).set();
                
                var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina.inicio),
                    leftSidebarItemView = new LeftSidebarItemView({ 'actions': areaPerms }),
                    rightSidebarItemView = new RightSidebarItemView({ 'areaPerms': areaPerms });

                mainLayout = new MainLayout();

                var contentView = new SlidingBlockLayout({ 'areaPerms': areaPerms, 'template': _.template('<div id="slidingBlocksContainer" class="block"><a href="#/ava" ><i class="icon-arrow-circle-left goBack"></i></a></div>') });
                
                var optionsBreadCrumb = {
                    breadcrumbItems: [{ text: "Histórico" }]
                };
                

                contentView.on('show', function contentViewShow() {
                    var accordionView = new HomeNavbarView({ 'areaPerms': areaPerms, historico: true });
                    contentView.$('#slidingBlocksContainer').append(accordionView.render().$el);
                });

              
                mainLayout.on('show', function () {
                    mainLayout.content.show(contentView);                    
                    

                });

                App.leftSidebarItemView.show(leftSidebarItemView);
                App.rightSidebarItemView.show(rightSidebarItemView);

                // Mostra as regiões principais
                App.mainRegion.show(mainLayout);
            });
        },

        desempenho: function desempenho () {

            $("html").css("overflow", '');

            var slider = App.slidingView();
            $.when(
                    commonViewLoader.get('MainLayout'),
                    commonViewLoader.get('SlidingBlockBaseLayout'),
                    viewLoader.get('common/LeftSidebarHomeItemView'),
                    viewLoader.get('common/RightSidebarItemView'),
                    viewLoader.get('Desempenho/DesempenhoItemView'),
                    commonViewLoader.get('BreadcrumbView'),
                    templateLoader.get('common/slidingview/slidingview-template.html')
                ).done(function (MainLayout, SlidingBlockLayout, LeftSidebarItemView, RightSidebarItemView, DesempenhoView, BreadcrumbView, slidingViewTemplate) {
                    App.pageLayout(layout).set();

                    // Pega as ações
                    var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina.inicio),
                        leftSidebarItemView = new LeftSidebarItemView({actions: areaPerms}),
                        rightSidebarItemView = new RightSidebarItemView(),
                        desempenhoView = new DesempenhoView(),
                        contentView,
                        options = {
                            breadcrumbItems: [{ text: 'Desempenho' }]
                        },
                        breadcrumbView = new BreadcrumbView(options);

                    // Checagem do MainLayout
//                mainLayout = mainLayout || new MainLayout();
                    mainLayout = new MainLayout();
                    contentView = new SlidingBlockLayout({ 'template': _.template(slidingViewTemplate), 'areaPerms': areaPerms });
                    contentView.addRegion('blockItemContent', '.block-item-content');

                    contentView.on('show', function () {
                        slider.init();
                        contentView.blockItemContent.show(desempenhoView);
                        contentView.$('.goBack').on('click', function goBackAction () {
                            App.redirecter({'url': '#/ava'});
                        });
                    });

                    mainLayout.on('show', function () {
                        mainLayout.content.show(contentView);
                        mainLayout.breadcrumb.show(breadcrumbView);
                    });

                    // Mostra as regiões principais
                    App.showMainRegions({'leftSidebarItemView': leftSidebarItemView, 'rightSidebarItemView': rightSidebarItemView});
                    App.mainRegion.show(mainLayout);
                });
        },

        calendario: function calendario () {
            var slider = App.slidingView();
            $.when(
                commonViewLoader.get('MainLayout'),
                commonViewLoader.get('SlidingBlockBaseLayout'),
                viewLoader.get('common/LeftSidebarHomeItemView'),
                viewLoader.get('common/RightSidebarItemView'),
                viewLoader.get('calendario/CalendarioItemView'),
                commonViewLoader.get('BreadcrumbView'),
                templateLoader.get('common/slidingview/slidingview-template.html')
            ).done(function (MainLayout, SlidingBlockLayout, LeftSidebarItemView, RightSidebarItemView, CalendarioView, BreadcrumbView, slidingViewTemplate) {
                App.pageLayout(layout).set();

                // Pega as ações
                var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina.inicio),
                    leftSidebarItemView = new LeftSidebarItemView({actions: areaPerms}),
                    rightSidebarItemView = new RightSidebarItemView(),
                    calendarioView = new CalendarioView(),
                    ml,
                    contentView,
                    options = {
                        breadcrumbItems: [{ text: 'Calendário' }]
                    },
                    breadcrumbView = new BreadcrumbView(options);

                // Checagem do MainLayout
//                mainLayout = mainLayout || new MainLayout();
                mainLayout = new MainLayout();
                contentView = new SlidingBlockLayout({ 'template': _.template(slidingViewTemplate), 'areaPerms': areaPerms });
                contentView.addRegion('blockItemContent', '.block-item-content');

                contentView.on('show', function () {
                    slider.init();
                    contentView.blockItemContent.show(calendarioView);
                    contentView.$('.goBack').on('click', function goBackAction () {
                        App.redirecter({'url': '#/ava/calendarioEvento'});
                    });
                });


                calendarioView.on('show', function () {
                    $('#breadcrumb .breadcrumb').focus();
                });

                mainLayout.on('show', function () {
                    mainLayout.content.show(contentView);
                    mainLayout.breadcrumb.show(breadcrumbView);
                });

                // Mostra as regiões principais
                App.showMainRegions({'leftSidebarItemView': leftSidebarItemView, 'rightSidebarItemView': rightSidebarItemView});
                App.mainRegion.show(mainLayout);
            });
        },

        administracao: function calendario () {

            $("html").css("overflow", '');

            var slider = App.slidingView();
            $.when(
                commonViewLoader.get('MainLayout'),
                commonViewLoader.get('SlidingBlockBaseLayout'),
                viewLoader.get('common/LeftSidebarHomeItemView'),
                viewLoader.get('common/RightSidebarItemView'),
                viewLoader.get('administracao/AdministracaoView'),
                commonViewLoader.get('BreadcrumbView'),
                templateLoader.get('common/slidingview/slidingview-template.html')
            ).done(function (MainLayout, SlidingBlockLayout, LeftSidebarItemView, RightSidebarItemView, AdministracaoView, BreadcrumbView, slidingViewTemplate) {
                App.pageLayout(layout).set();

                // Pega as ações
                var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina.inicio),
                    leftSidebarItemView = new LeftSidebarItemView({actions: areaPerms}),
                    rightSidebarItemView = new RightSidebarItemView(),
                    administracaoView = new AdministracaoView(),
                    ml,
                    contentView,
                    options = {
                        breadcrumbItems: [{ text: 'Administração' }]
                    },
                    breadcrumbView = new BreadcrumbView(options);

                // Checagem do MainLayout
                //                mainLayout = mainLayout || new MainLayout();
                mainLayout = new MainLayout();
                contentView = new SlidingBlockLayout({ 'template': _.template(slidingViewTemplate), 'areaPerms': areaPerms });
                contentView.addRegion('blockItemContent', '.block-item-content');

                contentView.on('show', function () {
                    slider.init();
                    contentView.blockItemContent.show(administracaoView);
                    contentView.$('.goBack').on('click', function goBackAction () {
                        App.redirecter({'url': '#/ava'});
                    });
                });


                administracaoView.on('show', function () {
                    $('#breadcrumb .breadcrumb').focus();
                });

                mainLayout.on('show', function () {
                    mainLayout.content.show(contentView);
                    mainLayout.breadcrumb.show(breadcrumbView);
                });

                // Mostra as regiões principais
                App.showMainRegions({'leftSidebarItemView': leftSidebarItemView, 'rightSidebarItemView': rightSidebarItemView});
                App.mainRegion.show(mainLayout);
            });
        },

        mensagens: function mensagens () {
            var slider = App.slidingView();
            $.when(
                commonViewLoader.get('MainLayout'),
                commonViewLoader.get('SlidingBlockBaseLayout'),
                viewLoader.get('common/LeftSidebarHomeItemView'),
                viewLoader.get('common/RightSidebarItemView'),
                viewLoader.get('notificacoes/NotificacoesItemView'),
                commonViewLoader.get('BreadcrumbView'),
                templateLoader.get('common/slidingview/slidingview-template.html')
            ).done(function (MainLayout, SlidingBlockLayout, LeftSidebarItemView, RightSidebarItemView, NotificacoesView, BreadcrumbView, slidingViewTemplate) {
                App.pageLayout(layout).set();

                // Pega as ações
                var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina.inicio),
                    leftSidebarItemView = new LeftSidebarItemView({actions: areaPerms}),
                    rightSidebarItemView = new RightSidebarItemView(),
                    notificacoesView = new NotificacoesView(),
                    contentView,
                    options = {
                        breadcrumbItems: [{ text: 'Mensagens' }]
                    },
                    breadcrumbView = new BreadcrumbView(options);

                // Checagem do MainLayout
//                mainLayout = mainLayout || new MainLayout();
                mainLayout = new MainLayout();

                contentView = new SlidingBlockLayout({ 'template': _.template(slidingViewTemplate), 'areaPerms': areaPerms });
                contentView.addRegion('blockItemContent', '.block-item-content');

                contentView.on('show', function () {
                    slider.init();
                    contentView.blockItemContent.show(notificacoesView);
                    contentView.$('.goBack').on('click', function goBackAction () {
                        App.redirecter({'url': '#/ava'});
                    });
                });

                mainLayout.on('show', function () {
                    mainLayout.content.show(contentView);
                    mainLayout.breadcrumb.show(breadcrumbView);
                });

                // Mostra as regiões principais
                App.showMainRegions({'leftSidebarItemView': leftSidebarItemView, 'rightSidebarItemView': rightSidebarItemView});

                App.mainRegion.show(mainLayout);
            });
        },

        informacoes: function informacoes (id) {

            $("html").css("overflow", '');

            var selfIdSalaVirtualOferta = null;

            App.pageLayout('two-columns').set();

            $.when(
                viewLoader.get('Atividades/MainLayout'),
                viewLoader.get('Atividades/SlidingBlockLayout'),
                viewLoader.get('common/LeftSidebarHomeItemView'),
                viewLoader.get('common/RightSidebarItemView'),
                commonViewLoader.get('BreadcrumbView'),
                viewLoader.get('Home/ActionsItemView'),
                viewLoader.get('Informacoes/InformacoesView')
            ).done(function (MainLayout, SlidingBlockLayout, LeftSidebarItemView, RightSidebarItemView, BreadcrumbView, ActionsView, InformacoesView) {

                // Checagem do MainLayout
                //                mainLayout = mainLayout || new MainLayout();
                mainLayout = new MainLayout();
                //var contentView = null;

                //Ações
                var areaPerms = App.auth.getAreaPermsMetodo('cursoEstrutura'),
                informacoesView,
                idSalaVirtualEstruturaRotuloTipo = 4;

                var leftSidebarItemView = new LeftSidebarItemView({ 'actions': areaPerms }),
                rightSidebarItemView = new RightSidebarItemView({ 'areaPerms': areaPerms });
                
                var areaPermsAtividade = App.auth.getAreaPermsMetodo('cursoAtividade');
                
               
                    


                informacoesView = new InformacoesView({ 'areaPerms': areaPerms, 'idCurso': id, 'idSalaVirtualEstruturaRotuloTipo': idSalaVirtualEstruturaRotuloTipo });

                
                if (_.contains(areaPermsAtividade, "editar")) {                    
                    //verifica se é coordenador do curso
                    if (!informacoesView.verificarPermissao()) {
                        areaPermsAtividade = _.without(areaPermsAtividade, "editar");
                        if (_.contains(areaPermsAtividade, "cadastrar")) areaPermsAtividade = _.without(areaPermsAtividade, "cadastrar");
                        if (_.contains(areaPerms, "cadastrar")) areaPerms = _.without(areaPerms, "cadastrar");
                        if (_.contains(areaPerms, "editar")) areaPerms = _.without(areaPerms, "editar");
                        informacoesView.areaPerms = areaPerms;
                        informacoesView.areaPermsAtividade = areaPermsAtividade;
                    }
                }

                
                $.when(informacoesView.render()).done(function () {
                    var editar = '';
                    var urlBuscarAtividade = 'ava/<%= rotinaAtividade %>/0/Estrutura/0/?id=<%= cIdSalaVirtualEstrutura %>&actionid='+ encodeURIComponent(id) + '&idSalaVirtualEstruturaRotulo=<%= idSalaVirtualEstruturaRotulo %>';
                    if (_.contains(areaPerms, "cadastrar")) {
                        editar = "&editar=true";
                        urlBuscarAtividade += "&editar=true";
                    }

                    var nomeSala = App.Helpers.getNomeSalaVirtual(id),
                        options = {
                            breadcrumbItems: [{ text: 'Informações' }, { text: informacoesView.nomeCurso }]
                        },
                        breadcrumbView = new BreadcrumbView(options),
                        contentView = new SlidingBlockLayout({
                            'areaPerms': areaPerms,
                            'svId': id,
                            'idSalaVirtualEstruturaRotuloTipo': idSalaVirtualEstruturaRotuloTipo,
                            'urlBuscarEstrutura': 'ava/CursoEstrutura/0/Tipo/<%= idSalaVirtualEstruturaRotuloTipo %>/?id=' + encodeURIComponent(id) + editar,
                            'contractEstrutura': 'cursoEstruturas',
                            'nomeCadastrarItem': 'Informações',
                            'urlCadastroAtividade': 'CursoAtividade',
                            'contractAtividade': 'cursoAtividades',
                            'urlBuscarAtividade': urlBuscarAtividade,
                            'rotinaAtividade': 'CursoAtividade',
                            'rotinaEstrutura': 'CursoEstrutura',
                            'idModulo': id,
                            'urlEditarAtividade': '#/ava/CursoAtividade/<%= id %>/editar/Curso',
                            'urlExcluirAtividade': '#/ava/cursoAtividade/<%= id %>/excluir',
                            'ocultarStatusAtividade': true,
                            'areaPermsAtividade': areaPermsAtividade,
                            'urlEditarEstrutura': '#/ava/CursoEstrutura/' + encodeURIComponent(id),
                            'urlAposCadastroAtividade': '#/ava/CursoAtividade/<%= cId %>/novo/Curso',
                            'ocultarMaterialDidatico': true,
                            'exibirDetalhesAtividade': true,
                            'renderizarBtnVoltar': true,
                            'exibirItemInicial': true
                        });
                 
                    //actions = new ActionsView(options);
             
                    var actions = new ActionsView({ 'areaPerms': areaPerms });
                    mainLayout.on('show', function () {
                        mainLayout.content.show(contentView);
                        contentView.slider.setActiveItem(1);
                        mainLayout.breadcrumb.show(breadcrumbView);
                        //mainLayout.actions.show(actions);
                        
                    });

                

                    App.leftSidebarItemView.show(leftSidebarItemView);
                    App.rightSidebarItemView.show(rightSidebarItemView);
                    // App.showMainRegions({ 'headerItemView': headerItemView, 'mainRegion': mainLayout, 'footerItemView': footerItemView });
                    App.mainRegion.show(mainLayout);
                    informacoesView.buscarInformacoesCurso();



                    // Ação disparada ao ser criado um novo módulo
                    actions.on('modulecreated', function () {                        
                        mainLayout.content.show(contentView);
                    });

                    
                    $("#sidebar-link-based header.active").focus();
                    
                });
            });
        },

        atividadesteste: function (rotina, id) {
            $.when(
                viewLoader.get('Atividades/MainLayout'),
                viewLoader.get('common/LeftSidebarItemView'),
                viewLoader.get('Atividades/AtividadesAccordionViewTeste'),
                commonViewLoader.get('BreadcrumbView'),
                viewLoader.get('Atividades/ActionsItemView')
            ).done(function (MainLayout, LeftSidebarItemView, AtividadesAccordionView, BreadcrumbView, ActionsView) {
                var nomeSala = App.Helpers.getNomeSalaVirtual(id);
                var options = {
                    breadcrumbItems: [{ text: 'Atividades' }, {text: nomeSala}]
                };

                // Pega as ações
                var areaPerms = App.auth.getAreaPermsMetodo( urlToRotina['roteiro-de-estudo'] );
                var leftSidebarItemView = new LeftSidebarItemView({'actions': areaPerms, 'atividadeId': id, 'nomeSalaVirtual': nomeSala});

                // Checagem do MainLayout
                var ml = new MainLayout();
                if ( mainLayout !== ml ) {
                    mainLayout = ml;
                }
                var breadcrumbView = new BreadcrumbView(options);
                var contentView = new AtividadesAccordionView({'areaPerms': areaPerms, 'svId': id});

                var actions = new ActionsView({'areaPerms': areaPerms, 'areaName': 'SalaVirtualAtividade', 'salaVirtualId': id });

                mainLayout.on('show', function () {
                    mainLayout.actions.show(actions);
                    mainLayout.breadcrumb.show( breadcrumbView );

                    // Mostrar Sidebars
                    App.viewManager.set({ 'viewName': 'leftSidebarItemView', 'viewInstance': leftSidebarItemView, 'layoutInstance': App, 'type': 'static' });
                });

                actions.on('modulecreated', function () {
                    mainLayout.content.show(contentView);
                });

                contentView.on('viewrendered', function viewRenderedHandler (data) {
                    data.layoutInstance = mainLayout;
                    App.viewManager.set(data);
                });

                contentView.render();

                $('#dock').on('click', function () {
                    $(this).toggleClass('active');
                    $('#three-columns').toggleClass('undocked');
                });
            });
        },

        // Redirecionamento de emails dos relatórios
        email: function () {
            var param = Backbone.history.fragment.split('?')[1];
            $.when(
                viewLoader.get('common/LeftSidebarItemView'),
                App.session.loginByURL(param)
                ).done(function (LeftSidebarItemView, response) {
                    if (response.url) {
                        try {
                            //
                            App.config.ajaxSetup().setToken({ token: response.usuario.token });
                            //Quebramos a string da url de destino
                            var caminho = response.url.split('/');
                            //Verificamos a rotina e ação
                            if (caminho[2] === 'interacaoControle' && caminho[4] === 'Exibir') {
                                //Carregamos a sala virtual e sala virtual oferta
                                var urlConsumo = UNINTER.AppConfig.UrlWs("ava") + "SalaVirtual/" + caminho[5] + "/InteracaoControle";
                                var opcoes = { url: urlConsumo, type: "GET", async: false };
                                var retornoConsumo = UNINTER.Helpers.ajaxRequestError(opcoes);
                                if (retornoConsumo.status != 200) {
                                    return false;
                                } else {
                                    //Buscamos as permissões da rotina
                                    var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina['InteracaoControle']);
                                    //Criamos um objeto do tipo LeftSidebarItemView
                                    var leftSidebarItemView = new LeftSidebarItemView({ 'actions': areaPerms, 'idSalaVirtual': retornoConsumo.resposta.salaVirtual.id, 'nomeSalaVirtual': null, 'idSalaVirtualOferta': null, 'fnChangeSalaVirtualOferta': null });
                                    //Setamos o id
                                    leftSidebarItemView.storeSvId();
                                }
                            }
                            //Redirecionamos para a pagina passada como parametro.
                            document.location = response.url;
                        }
                        catch (err) {
                            App.redirecter({ delay: 5000, message: 'Erro de acesso' });
                        }
                    } else {
                        App.redirecter({ delay: 5000, message: 'Erro de acesso' });
                    }
                });
        },
        
        atividadesteste2: function (rotina, id) {
            $.when(
                    viewLoader.get('Home/MainLayoutHomeTeste'),
                    viewLoader.get('Home/LeftSidebarHomeItemView'),
                    viewLoader.get('common/RightSidebarItemView'),
                    viewLoader.get('Home/HomeHeaderItemView'),
                    viewLoader.get('Home/HomeNavbarView'),
                    viewLoader.get('Home/ActionsItemView')
                ).done(function (MainLayout, LeftSidebarItemView, RightSidebarItemView, HomeHeaderItemView, HomeNavbarView, ActionsView) {
                    var areaPerms, newMainLayout, contentView, homeHeader, actions, leftSidebarItemView, rightSidebarItemView;

                    // Sidebars
                    leftSidebarItemView = new LeftSidebarItemView({actions: areaPerms});
                    rightSidebarItemView = new RightSidebarItemView();

                    // Pega as ações
                    areaPerms = App.auth.getAreaPermsMetodo(urlToRotina.inicio);

                    // Checagem do MainLayout
                    var ml = new MainLayout();
                    if ( mainLayout !== ml ) {
                        mainLayout = ml;
                    }

                    // Adicionando novas regiões ao layout
                    mainLayout.addRegion('homeHeader', '#home-header');
                    mainLayout.addRegion('actions', '#actions');

                    // View do conteúdo principal
                    contentView = new HomeNavbarView({ 'areaPerms': areaPerms });

                    // View do Header
                    homeHeader = new HomeHeaderItemView();

                    // View das ações possíveis do usuário
                    actions = new ActionsView({'areaPerms': areaPerms, 'areaName': 'salavirtual'});

                    // Ao 'show'do mainLayout
                    mainLayout.on('show', function () {
                        mainLayout.homeHeader.show(homeHeader);
                        mainLayout.actions.show(actions);

                        // Mostrar Sidebars
                        App.viewManager.set({ 'viewName': 'leftSidebarItemView', 'viewInstance': leftSidebarItemView, 'layoutInstance': App, 'type': 'static' });
                        App.viewManager.set({ 'viewName': 'rightSidebarItemView', 'viewInstance': rightSidebarItemView, 'layoutInstance': App, 'type': 'static' });
                    });

                    // Eventos da contentView
                    contentView.on('viewrendered', function (data) {
                        data.layoutInstance = mainLayout;
                        data.type = 'slider';
                        App.viewManager.set(data);
                        
                    });

                    // Executando a renderização
                    contentView.render();

                    // Click no botão do Menu Responsivo
                    $('#dock').on('click', function () {
                        $(this).toggleClass('active');
                        $('#three-columns').toggleClass('undocked');
                    });

                });
        },

        'form-upload': function (rotina, id) {

            $("html").css("overflow", '');

            $.when(
                viewLoader.get('Atividades/MainLayout'),
                viewLoader.get('Atividades/SlidingBlockLayout'),
                viewLoader.get('common/LeftSidebarItemView'),
                commonViewLoader.get('BreadcrumbView'),
                libraryLoader.get('uploadManager2')
            ).done(function (MainLayout, SlidingBlockLayout, LeftSidebarItemView, BreadcrumbView, uploadManager) {
                var options = {
                    breadcrumbItems: [{ text: 'Atividades' }]
                };

                // Pega as ações
                var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina['roteiro-de-estudo'] );
                var leftSidebarItemView = new LeftSidebarItemView({actions: areaPerms});

                var mainLayout = new MainLayout();
                var breadcrumbView = new BreadcrumbView(options);


                mainLayout.on('show', function () {
                    App.leftSidebarItemView.show(leftSidebarItemView);
                    mainLayout.breadcrumb.show( breadcrumbView );
                });

                // Regiões principais
                // showRegion({'RegionCaller': App, 'regionInstance': 'headerRegion', 'RegionView': HeaderItemView });
                // showRegion({'RegionCaller': App, 'regionInstance': 'mainRegion', 'RegionView': MainLayout, 'renderCheck': false });
                // showRegion({'RegionCaller': App, 'regionInstance': 'footerRegion', 'RegionView': FooterItemView });

                App.mainRegion.show(mainLayout);

                var uploadManagerOpts = {};
                uploadManagerOpts.element = $('#main-holder');
                uploadManagerOpts.onFileDone = function onFileDone (data) {
                    
                };
                uploadManagerOpts.onStop = function onFileDone (data) {
                    console.dir(data);
                };
                var uploadMngr = uploadManager(uploadManagerOpts);

                $('#dock').on('click', function () {
                    $(this).toggleClass('active');
                    $('#three-columns').toggleClass('undocked');
                });
            });
        },
        'relatorio-trabalho': function (idSalaVirtual, idSalaVirtualOferta, idInteracaoControle, idInteracaoEtapa){

            $("html").css("overflow", '');

            var nomeSala = App.Helpers.getNomeSalaVirtual(idSalaVirtual);
            

            $.when(
                viewLoader.get('Atividades/MainLayout'),
                viewLoader.get('Atividades/SlidingBlockLayout'),
                viewLoader.get('common/LeftSidebarItemView')
                
            ).done(function (MainLayout, SlidingBlockLayout, LeftSidebarItemView) {
                mainLayout = new MainLayout();

                var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina['roteiro-de-estudo']);                
                App.mainRegion.show(mainLayout);

                var fnChangeSalaVirtualOferta = null;

                var leftSidebarItemView = new LeftSidebarItemView({ 'actions': areaPerms, 'idSalaVirtual': idSalaVirtual, 'nomeSalaVirtual': nomeSala, 'idSalaVirtualOferta': idSalaVirtualOferta, 'fnChangeSalaVirtualOferta': fnChangeSalaVirtualOferta });

                // Armazena o id da sala virtual para uso posterior.
                leftSidebarItemView.storeSvId();
                App.viewManager.set({ 'viewName': 'leftSidebarItemView', 'viewInstance': leftSidebarItemView, 'layoutInstance': App, 'type': 'static' });
                UNINTER.session.set('idInteracaoEtapaFiltro', idInteracaoEtapa);
                window.location = '#/ava/interacaoControleRelatorio/5/Exibir/' + idInteracaoControle;

            });
        },
        acessoroa: function (id, idUsuario, token, metodo, redirecionar, idSalaVirtualOferta) {            
            $("html").css("overflow", '');
            App.Historico.set("roa");
            //var param = Backbone.history.fragment.split('?')[1];
            
            
            var perfis = new Array();
            perfis.push({ idSistema: 1 });
            App.session.set({
                idUsuario: idUsuario,
                token: token,
                perfis: perfis,
                nome: "nome"
            });            
            if (!metodo) metodo = "editar";

            if (parseInt(idSalaVirtualOferta) > 0) {
                UNINTER.StorageWrap.setAdaptor(sessionStorage);
                UNINTER.StorageWrap.setItem('leftSidebarItemView', { idSalaVirtualOferta: parseInt(idSalaVirtualOferta) });
            }
            
            //App.StorageWrap.setItem('acessoRoa', {});
            
            //document.location = "#/ava/roa/" + id;
            document.location = "#/ava/roa/" + id + "/" + metodo + "/" + redirecionar;
          
        },
        'importacao-planilha': function (idSalaVirtual, idSalaVirtualOferta){

            $("html").css("overflow", '');

            var nomeSala = App.Helpers.getNomeSalaVirtual(idSalaVirtual);
            

            $.when(
                viewLoader.get('Atividades/MainLayout'),
                viewLoader.get('Atividades/SlidingBlockLayout'),
                viewLoader.get('common/LeftSidebarItemView')
                
            ).done(function (MainLayout, SlidingBlockLayout, LeftSidebarItemView) {
                mainLayout = new MainLayout();

                var areaPerms = App.auth.getAreaPermsMetodo(urlToRotina['roteiro-de-estudo']);                
                App.mainRegion.show(mainLayout);

                var fnChangeSalaVirtualOferta = null;

                var leftSidebarItemView = new LeftSidebarItemView({ 'actions': areaPerms, 'idSalaVirtual': idSalaVirtual, 'nomeSalaVirtual': nomeSala, 'idSalaVirtualOferta': idSalaVirtualOferta, 'fnChangeSalaVirtualOferta': fnChangeSalaVirtualOferta });

                // Armazena o id da sala virtual para uso posterior.
                leftSidebarItemView.storeSvId();
                App.viewManager.set({ 'viewName': 'leftSidebarItemView', 'viewInstance': leftSidebarItemView, 'layoutInstance': App, 'type': 'static' });

                window.location = '#/ava/salaVirtualImportacao/' + idSalaVirtualOferta + "/novo";

            });
        },
        
        
    });
});