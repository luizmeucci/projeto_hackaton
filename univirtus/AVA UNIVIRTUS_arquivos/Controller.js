/* ==========================================================================
   Login Controller
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 04/02/2014
   ========================================================================== */

define(function (require) {
    'use strict';

    // Dependências
    var App = require('app');
    var Marionette = require('marionette');
    var HeaderItemView = require('views/login/HeaderLoginItemView');
    var FooterItemView = require('views/common/FooterItemView');
    var $ = require('jquery');
    var _ = require('underscore');
    var animatedIconsLib = require('libraries/animatedIcons');
    var Helpers = require('libraries/Helpers');
    var Session = require('models/session');
    require('bootstrap');

    var layout = 'two-columns';

    var usuarioCursos = null;

    var formActionsView;

    var optionsLogin = {};

    var rotinasOneColumn = ['provas', 'cursogradecronograma'];

//    var headerItemView = new HeaderItemView();
//    var footerItemView = new FooterItemView();
    App.footer = App.footer || new FooterItemView();

    return Marionette.Controller.extend({
        initialize: function () {
            // Common View Loader
            this.viewLoader = new App.LazyLoader('views');
        },

        notFound: function () {
            App.logger.info('Rota Default. Redirecionando para o index.');
            this.index();
        },

        // Método mapeado nas rotas do MainRouter
        index: function (sistema, rotina, id, metodo, idAcao, idAux) {

            $("html").css("overflow", '');

            var self = this;

            // Define o PageLayout
            if (rotinasOneColumn.indexOf(rotina.toLowerCase()) > -1) {
                App.pageLayout('one-column').set();
            } else {
                App.pageLayout(layout).set();
            }
            
            

            if (App.Helpers.stringValida(sistema)) {
                sistema = sistema.toLowerCase();
            }


            if (App.Helpers.stringValida(rotina)) {
                rotina = rotina.toLowerCase();
            }

            if (App.Helpers.stringValida(metodo)) {
                metodo = metodo.toLowerCase();
            }

            //App.Historico.set(rotina);

            if ( App.Helpers.stringValida(rotina) ) {
                // Pega as ações através do metodo:
                App.auth.checkCredentials();
                self.areaPerms = App.auth.getAreaPermsMetodo(rotina);
                
                if (!self.areaPerms) {
                    var opcoes = {
                        body: "Você não tem permissão para acessar a área solicitada.",
                        strong: "",
                        type: "danger"
                    };
                    App.flashMessage(opcoes);
                    return false;
                }

                this.parametros = {
                    rotina: rotina,
                    metodo: metodo,
                    idUrl: id,
                    sistema: sistema,
                    idAcao: idAcao,
                    areaPerms: self.areaPerms,
                    renderizarNovoContexto: true,
                    View: window.UNINTER.View,
                    idAux: idAux
                };
                this.dinamico();

            } else {
                this.login();
            }
        },
        parametros: null,
        sidebarHomeRoutes: ['usuario', 'simular', 'pacoteusuario', 'pacoteusuariogerenciar', 'lotecorrecao', 'avaliacaousuarioconfigurar', 'entregatrabalhocorrecao', 'avaliacaousuariocorrecao', 'tutoriaresposta',
            'usuarioperfil', 'usuariopermissaorotinaacao', 'usuariopermissaogrupoestrutura', 'calendarioevento', 'evento', 'avaliacaousuarioimpressao', 'questaoperfil', 'desempenho', 'avaliacaousuarioresumo',
            'lotecorrecaofiltros', 'lotecorrecaousuario', 'lotecorrecao', 'coordenadorcurso', 'salavirtual', 'questaotema', 'acervo', 'minhabiblioteca', 'acessosexternos', 'enquete', 'enqueteconfiguracao',
            'solicitacaoassunto', 'grupoestrutura', 'solicitacaoassuntogrupoestrutura', 'solicitacaoassuntoresponsavel', 'enquetebloco', 'bloco', 'enqueteblocoquestao', 'solicitacao', 'comunicado',
            'enqueteadministrador', 'enqueteusuario', 'disciplinaoferta', 'laboratorio', 'computador', 'downloads', 'disponibilidadeusuario', 'mensagemfidelizacao', 'autorizacaoprova', 'voip', 'avaliacaousuariotoken',
            'grupoestruturacodigoprovas', 'avaliacaousuarioprotocolo', 'relatorio', 'resolucoesuninter', 'avaliacaousuariodigitalizacao', 'curso', 'objetoaprendizagem', 'agendamento', 'agendamentousuario', 'manualaluno',
            'fidelizacaohistorico', 'fidelizacaosolicitacao', 'avaliacaousuarioimpressaosianee', 'questaofeedbackclassificacao', 'questaofeedback', 'questaosituacaohistorico',
		    'termoaceiteofertausuario', 'informacoesextensao', 'popup', 'cpa', 'usuariosianee', , 'roa', 'cursoatividade', 'interacaocontrolevalidacao', 'composicaomedia',
            'usuarioperfilpermissaosala', 'entregatrabalhocorrecao', 'usuariopermissaoturma', 'avaliacaoescolaesquema', 'aulaaovivo', 'financeiro', 'boleto', 'contrato', 'servico', 'biblioteca','arvoresolicitacao',
            'bonusamigo', 'quitacaoanualdebitos', 'materialdidatico', 'informacaoir', 'regimetutorial', 'distribuirpolocma', 'admlive', 'salavirtualoferta', 'solicitacaogrupoestrutura', 'usuariopermissaogrupoestruturasolicitacao',
            'alunoeletiva', 'financeironegociacoes', 'grade', 'pacotecorrecaoentregatrabalho', 'trabalhocorrecao', 'aplicativoprova','calendarioacademico','solicitacaoaluno',
            'dispensa', 'dispensadisciplina', 'alunoeletiva', 'financeironegociacoes', 'grade', 'pacotecorrecaoentregatrabalho', 'trabalhocorrecao', 'ciclo', 'cursogradecronograma', 'modulo', 'trabalhoentregafichadefesa',
            'trabalhoentregafichadefesavalidar', 'correcaogrupo', 'correcaogrupousuariocurso', 'correcaogrupousuariocursosalavirtual', 'trabalhoentregafichadefesadigitalizacao', 'trabalhocorrecaocoordenador', 'avaliacaousuariosimularappprovas',
            'aplicativoprovainternacional', 'aplicativoprova', 'trabalhocorrecaoestagio', 'trabalhoentregaficharescisao', 'itemaprendizagemusuariosalavirtualoferta', 'salavirtualofertaresumo', 'trabalhoestagionaoobrigatorio',
            'avaliacaovestibular', 'trabalhoentregapolo', 'vestibularnovatentativa', 'assinaturadigital', 'trabalhousuarioresumo', 'trabalhoentregaagendamento', 'trabalhocorrecaoaluno', 'termoaceiteperiodousuario', 'algeteclaboratorio',
            'algeteclaboratoriooferta', 'provas', 'conferencia', 'integracaousuarioadobe', 'cursosituacaoadobe', 'rotinadocumento', 'superpolo', 'superpologrupo', 'calendarioacademicomoduloconfirmacaologistica', 'office', 'financeirointernacional', 'superpolocronograma',
            'fidelizacao', 'calendarioaulapratica', 'livrodidatico', 'formacaodocente', 'formacaodocentegrupo', 'validacaocertificado', 'integracaocurso', 'externointegracaousuario', 'exportacaoavaliacaousuariovestibular', 'imersyslaboratoriooferta', 'trabalhoentregaadministrativo',
            'termoaceiteimagem','certificado','videointerativo', 'videointerativoquestao', 'dispensanivel'
        ],
        precisaRecarregar: function () {
            var self = this;
            var recarregar = true;

            //Valida se está logado!
            App.auth.checkCredentials();

            //Se está na mesma rotina, testamos se o conteudo já existe. Caso contrario, criamos a nova view.
            //var ultimaPagina = App.Historico.ultimaPagina();
            //var paginaAtual = App.Historico.paginaAtual();
            var grid = $("#grid" + self.parametros.rotina).html();
            var form = $("#view" + self.parametros.rotina).html();
            
            //Se a pagina que pediu é diferente da anterior, precisamos construir:
            if (  grid !== void(0) || form !== void(0) )  {
                recarregar = false;
            } else {
                recarregar = true;
            }
            return recarregar;
        },
        // Determina a Sidebar a ser carregada
        checkSidebar: function checkSidebar () {
            var req;
            // PAP
            if ( this.parametros.sistema === 'pap' ) {
                req = 'pap/LeftSidebarItemView';
            }
                // AVA
            else {
                // Verifica as regiões do AVA que devem mostrar a sidebar da HOME
                if (_.contains(this.sidebarHomeRoutes, this.parametros.rotina) || this.parametros.idAcao == 'home' || this.parametros.idUrl == 'home') {
                    req = 'ava/common/LeftSidebarHomeItemView';
                }
                    // Estas são as regiões que mostram a sidebar normal
                else {
                    req = 'ava/common/LeftSidebarItemView';
                }

            }
            return req;
        },
        dinamico: function () {
            var self = this;

            $.when( this.viewLoader.get( this.checkSidebar() ) )
                .done(function leftSidebarRequire (LeftSidebarItemView) {

                //var leftSidebarItemView = App.leftSidebarItemView.currentView || new LeftSidebarItemView({ actions: self.areaPerms });

                //// Método para recuperar o id da salavirtual, que será usado na url do link do roteiro de estudo.
                //if ( leftSidebarItemView.retrieveSvId ) { leftSidebarItemView.retrieveSvId(); }

                var recarregar = self.precisaRecarregar();
                var formActionsView, mainLayout;

                if (recarregar === false) {

                    var leftSidebarItemView = App.leftSidebarItemView.currentView || new LeftSidebarItemView({ actions: self.areaPerms });

                    // Método para recuperar o id da salavirtual, que será usado na url do link do roteiro de estudo.
                    if (leftSidebarItemView.retrieveSvId) { leftSidebarItemView.retrieveSvId(); }

                    window.UNINTER.viewGenerica.initialize(self.parametros);

                    //A view que controi o menu lateral contem a combo ofertas?
                    if (typeof leftSidebarItemView.setChangeOferta == "function")
                    {
                        leftSidebarItemView.setChangeOferta(window.UNINTER.viewGenerica.getNomeFnInicializar(true));
                    }

                    window.UNINTER.viewGenerica.continuar();
                    // $.when(
                    //    this.commonViewLoader.get('ViewGenerica')
                    //).done(function (View) {

                    //    var contentView = new View(self.parametros);
                    //    contentView.continuar();
                    //    //var contentView = new View(self.parametros);
                    //    //contentView.continuar();
                    //    UNINTER.viewGenerica.continuar();
                    //});
                } else {
                    //Conteudo
                    $.when(
                            self.viewLoader.get('common/ViewGenerica'),
                            self.viewLoader.get('common/BreadcrumbView'),
                            self.viewLoader.get('common/FormActionsView'),
                            self.viewLoader.get('common/HeaderItemView'),
                            self.viewLoader.get('common/MainLayout'),
                            self.viewLoader.get('ava/EnqueteUsuario/EnqueteUsuarioView')
                        ).done(function (View, BreadcrumbView, FormActionsView, HeaderItemView, MainLayout, EnqueteUsuarioView) {

                            var options = {
                                breadcrumbItems: [{ text: "Carregando..." }],
                                rotina: self.parametros.rotina,
                                idUrl: self.parametros.idUrl
                            };

                            var breadcrumbView = new BreadcrumbView(options);

                            //var contentView = new View(self.parametros);
                            window.UNINTER.View = View;
                            self.parametros.View = window.UNINTER.View;
                            //self.parametros.breadcrumb = breadcrumbView;
                            window.UNINTER.viewGenerica = new View(self.parametros);
                            
                            var mainLayout = new MainLayout();

                            var leftSidebarItemView = App.leftSidebarItemView.currentView || new LeftSidebarItemView({ actions: self.areaPerms });

                            // Método para recuperar o id da salavirtual, que será usado na url do link do roteiro de estudo.
                            if (leftSidebarItemView.retrieveSvId) { leftSidebarItemView.retrieveSvId(); }

//                    var headerItemView = new HeaderItemView();
                            //Atualizamos o titulo com o nome da rotina atual.

                            // Passa as permissões da área para o módulo de ações de formulário.
                            // Ele aplicará os botões de acordo com as permissões do usuário atual.
                            formActionsView = new FormActionsView();

                            mainLayout.on('show', function () {
                                mainLayout.breadcrumb.show(breadcrumbView);
                                mainLayout.actions.show(formActionsView);

                                // Mostrar Sidebars
                                App.viewManager.set({ 'viewName': 'leftSidebarItemView', 'viewInstance': leftSidebarItemView, 'layoutInstance': App, 'type': 'static' });

                                // Fechar sidebar direita
                                App.rightSidebarItemView.close();

                                mainLayout.content.show(window.UNINTER.viewGenerica);
                                try{
                                    leftSidebarItemView.setChangeOferta(window.UNINTER.viewGenerica.getNomeFnInicializar(true));
                                }catch(e)
                                {
                                    //Não exitse combo de oferta;
                                }

                                var enqueteUsuario = new EnqueteUsuarioView({ rotina: self.parametros.rotina, acao: self.parametros.metodo });

                            });

                            //Conteudo:
                            App.mainRegion.show(mainLayout);

                            //Para arrumar o topo, caso tenha trocado d AVA para PAP por exemplo.
                            App.setCurrentLocation();

                            //breadcrumb
                            window.UNINTER.viewGenerica.on('all', function (event, data) {

                                switch (event) {
                                    case 'updatebreadcrumb':
                                        breadcrumbView.update(data);
                                        break;
                                    case 'restorebreadcrumb':
                                        breadcrumbView.restore();
                                        break;
                                    case 'renderbreadcrumb':
                                        breadcrumbView.initialize(data);
                                        breadcrumbView.render();
                                        break;
                                }
                            });

                            // Eventos
                            formActionsView.on('all', function (action) {
                                if (action === 'cadastrar') {

                                    //contentView.toggleVisibility();
                                    //contentView.renderForm();
                                    //contentView.setPlaceholderHeight();
                                    window.UNINTER.viewGenerica.toggleVisibility();
                                    window.UNINTER.viewGenerica.renderForm();
                                    window.UNINTER.viewGenerica.setPlaceholderHeight();
                                }
                            });

                        });
                }
            });
        },//Fim do controller generico.

        loginPersonalizado: function (hash) {

            var self = this;

            //Reset caso troque a rota.
            $("html").css("overflow", '');
            $("#midContentHolder").html('<div class="main-loading-message">Carregando conteúdo. Por favor, aguarde...</div>');

            Helpers.ajaxRequest({
                url: App.config.UrlWs('integracao') + 'GrupoEstruturaConfiguracao/' + hash + '/Url',
                async: true,
                successCallback: function (data) {

                    var options = data.grupoEstruturaConfiguracoes;

                    $(options).each(function () {
                        try {                            
                            optionsLogin[this.parametro] = JSON.parse(this.valor);
                        } catch (e)
                        {
                            optionsLogin[this.parametro] = this.valor;
                        }
                    });

                    self.login();
                },
                errorCallback: function (error) {
                    self.login();
                }
            });


        },

        checkCancelamento: function (user) { 
            if (user.alunoEmPreCancelamento) {

                var loginCancelamentoTemplate = null;

                var RenderDadosCancelamento = function () {

                    $('#dialogModal').find('.modal-body').html(_.template(loginCancelamentoTemplate, { usuarioCursos: usuarioCursos, user: user }));

                    $('#dialogModal [data-action="reativar"]').on('click', function (e) {
                        debugger;
                        var $container = $(e.currentTarget).closest('[data-cancelamento]');

                        var posicaoAtual = parseInt($container.data('cancelamento'));

                        $container.find('div').html('<div class="alert alert-warning">Por favor, aguarde enquanto atualizamos o status do protocolo.</div>');

                        var usuarioCurso = _.findWhere(usuarioCursos, { id: $container.data('id') });

                        App.Helpers.ajaxRequest({
                            async: true,
                            url: App.config.UrlWs('interacao') + 'MensagemFidelizacaoProtocoloCancelamento/' + usuarioCurso.idCurso + '/ConfirmarCancelamentoProtocolo',
                            headers: {
                                "Authorization": user.token,
                            },
                            successCallback: function (data) {
                                PoximoCancelamento(posicaoAtual);
                            },
                            errorCallback: function () {
                                PoximoCancelamento(posicaoAtual);
                            }
                        });
                    });

                    $('#dialogModal [data-action="cancelar"]').on('click', function (e) {
                        debugger;
                        var $container = $(e.currentTarget).closest('[data-cancelamento]');

                        var posicaoAtual = parseInt($container.data('cancelamento'));

                        var usuarioCurso = _.findWhere(usuarioCursos, { id: $container.data('id') });

                        $container.find('div').html('<div class="alert alert-warning">Por favor, aguarde enquanto atualizamos o status do protocolo.</div>');

                        App.Helpers.ajaxRequest({
                            async: true,
                            type: 'PUT',
                            url: App.config.UrlWs('interacao') + 'MensagemFidelizacaoProtocoloCancelamento/' + usuarioCurso.idCurso + '/ConfirmarCancelamentoMatricula/' + usuarioCurso.idUsuario,
                            headers: {
                                "Authorization": user.token,
                            },
                            successCallback: function (data) {
                                PoximoCancelamento(posicaoAtual);
                            },
                            errorCallback: function () {
                                PoximoCancelamento(posicaoAtual);
                            }
                        });
                    });
                };

                var PoximoCancelamento = function (atual) {

                    //Ainda tem mais protocolos para exibir?
                    atual = atual + 1;
                    if ($('[data-cancelamento="' + atual + '"]').length > 0) {

                        $('[data-cancelamento="' + (atual - 1) + '"]').slideUp(function () {
                            $('[data-cancelamento="' + atual + '"]').slideDown();
                        });

                    } else {
                        $('#dialogModal').modal('hide');
                        App.session.flush();
                        window.location.reload();
                    }

                }

                App.Helpers.showModal({
                    'size': 'modal-lg',
                    'title': 'Estamos felizes em tê-lo de volta!',
                    'body': '<div class="alert alert-warning">Por favor aguarde, consultando status da solicitação de cancelamento de curso.</div>',
                    botaoFechar: false,
                    'modal': {
                        backdrop: 'static',
                        keyboard: false
                    },
                    'buttons': [{
                        'type': "button",
                        'klass': "btn btn-default hide",
                        'text': "Fechar",
                        'dismiss': 'modal',
                        'id': 'modal-cancel'
                    }]
                });

                var templateLoader = new App.LazyLoader('text!templates');

                $.when(
                        templateLoader.get('login/login-cancelamentocurso.html')
                ).done(function (LoginCancelamentoTemplate) {

                    loginCancelamentoTemplate = LoginCancelamentoTemplate;

                    App.Helpers.ajaxRequest({
                        async: true,
                        url: App.config.UrlWs('sistema') + 'UsuarioCurso/0/Usuario',
                        headers: {
                            "Authorization": user.token,
                        },
                        successCallback: function (data) {
                            if (data.UsuarioCursos && data.UsuarioCursos.length > 0) {

                                //Qual curso está em cancelamento:
                                usuarioCursos = _.where(data.UsuarioCursos, { idTipoSituacaoAlunoCurso: 26 });

                                if (usuarioCursos != void (0) && usuarioCursos.length > 0) {
                                    var totalProcessado = 0;
                                    $(usuarioCursos).each(function (i, item) {

                                        App.Helpers.ajaxRequest({
                                            async: true,
                                            url: App.config.UrlWs('interacao') + 'MensagemFidelizacaoProtocoloCancelamento/'+item.id+'/GetDadosProtocoloById',
                                            headers: {
                                                "Authorization": user.token,
                                            },
                                            successCallback: function (data) {
                                                item.etiquetas = data;
                                                item.data = (data.dataCriacao != void (0) ? Helpers.dateTimeFormatter({ dateTime: data.dataCriacao }).date() : '');
                                                totalProcessado++;
                                                if (totalProcessado == usuarioCursos.length) {
                                                    RenderDadosCancelamento();
                                                }
                                            },
                                            errorCallback: function () {
                                                totalProcessado++;
                                                if (totalProcessado == usuarioCursos.length) {
                                                    RenderDadosCancelamento();
                                                }
                                            }
                                        });

                                    });

                                } else {
                                    $('#dialogModal').find('.modal-body').html("Não foi possível conultar o andamento do cancelamento do curso.");
                                    $('#modal-cancel').removeClass('hide');
                                }
                            }
                        },
                        errorCallback: function () {
                            $('#dialogModal').find('.modal-body').html("Não foi possível conultar o andamento do cancelamento do curso.");
                            $('#modal-cancel').removeClass('hide');
                        },
                    });

                });

            }
        },

        login: function () {

            var options = $.extend({}, optionsLogin);
            optionsLogin = {};

            if (options.LOCATIONSAIR != void (0)) {
                sessionStorage.setItem('LOCATIONSAIR', options.LOCATIONSAIR);
            } else {
                sessionStorage.setItem('LOCATIONSAIR', options.URLHASH != void (0) ? '#/login/' + options.URLHASH : '#/');
            }

            $("html").css("overflow", '');

            App.pageLayout('one-column').set();

            App.loadingView.hide();

            $('#page').removeClass('inner');
            var loginLayout, loginBox, adv, self = this, viewLoader, templateLoader;

            // Instancia o LazyLoader para carregas as views e o template dinamicamente e sob demanda
            viewLoader = new App.LazyLoader('views/login');
            templateLoader = new App.LazyLoader('text!templates');
            
            $.when(
                viewLoader.get('LoginLayout'),
                viewLoader.get('AdvItemView'),
                viewLoader.get('LoginBoxItemView'),
                templateLoader.get('login/loginbox-template.html'),
                templateLoader.get('login/login-cancelamentocurso.html'))

                .done(function (LoginLayout, AdvItemView, LoginBoxItemView, LoginBoxTemplate, LoginCancelamentoTemplate) {
                    App.auth.setTokenHeader();

                    // Remove o header
                    App.headerItemView.close();

                    // Login Layout
                    loginLayout = new LoginLayout();

                    // Advertising Area
                    adv = new AdvItemView(options.CAPA);
                    loginBox = new LoginBoxItemView({ template: _.template(LoginBoxTemplate), options: options });

                    // Adicionando o slider de adv na region do layout
                    loginLayout.on('show', function () {
                        loginLayout.advArea.show(adv);
                        loginLayout.loginBox.show(loginBox);
                    });
//                    footerItemView = new FooterItemView();

                    //  Click no aviso de update do browser
                    $('#browsehappy').find('button').on('click', function () {
                        $('#browsehappy').remove();
                    });

//                    App.headerItemView.show(new HeaderItemView());
                    App.mainRegion.show(loginLayout);
                    App.footerItemView.show(App.footer);

                    // Remove as barras laterais
                    App.leftSidebarItemView.close();
                    App.rightSidebarItemView.close();

                    // Eventos
                    // Login
                    loginLayout.on('itemview:login', function (credentials) {

                        if (credentials.login == void (0) || credentials.login.length == 0) {
                            App.flashMessage({ body: 'Login/RU inválido.', type: 'danger', appendTo: '#login-form' });
                            $('#loginBoxSpinner').addClass('fade');
                            return;
                        }

                        if (credentials.senha == void (0) || credentials.senha.length == 0) {
                            App.flashMessage({ body: 'Senha inválida.', type: 'danger', appendTo: '#login-form' });
                            $('#loginBoxSpinner').addClass('fade');
                            return;
                        }

                        if ($('li.recaptcha').is(':visible') == true && (credentials.recaptcha == void (0) || credentials.recaptcha.length < 5))
                        {
                            App.flashMessage({ body: 'reCaptcha/Não sou um robô inválido', type: 'danger', appendTo: '#login-form' });
                            $('#loginBoxSpinner').addClass('fade');
                            return;
                        }

                        App.session = window.UNINTER.session = new Session();

                        // Faz a checagem das credenciais do usuário, enviando os dados para o servidor
                        var checkCreds = App.session.checkCreds(credentials),                            
                        // Instancia o LazyLoader para carregar as views e o template sob demanda
                            viewLoader = new App.LazyLoader('views/common');                        

                        

                        $.when(checkCreds).done(function (r) {                            
                            var user = r.toJSON();

                            $.when(viewLoader.get('AmbienteEscolhaItemView')).done(function (AmbienteEscolhaItemView) {
                                var ambienteEscolhaView = new AmbienteEscolhaItemView({ 'userProfiles': user.perfis, 'ativo': user.ativo, mensagem: r.mensagem });

                                ambienteEscolhaView.on('itemview:loginerror', function () {
                                    App.flashMessage({ 'body': 'Você não tem permissão para executar esta ação. Erro #002', 'type': 'danger', 'appendTo': '#login-form' });
                                });

                                ambienteEscolhaView.on('itemview:loggedin', function () {
                                    // Carregar ícones
                                    loginBox.$el.find('div.choose').html(ambienteEscolhaView.$el);
                                    // Faz a Caixa dos ícones aparecer
                                    loginBox.$el.find('#login-form').addClass('loggedin');

                                    // Torna
                                    $('#loginToAVA').attr('aria-hidden', true);

                                    // Põe o foco no cabeçalho
                                    $('.choose h2').focus();

                                    // Grava no sessionStorage uma referência a ser utilizada posteriormente, a fim de
                                    // indicar que o usuário efetuou login para o EJA.
                                    if ( App.location().isEja() ) {
                                        App.sessionstorage.set({ 'isEja': true });
                                    }

                                    App.auth.setTokenHeader();
                                    App.setPageFocus();
                                    self.checkCancelamento(user, LoginCancelamentoTemplate);
                                });

                                ambienteEscolhaView.on('itemview:logintoclaroline', function loginToClaroline () {
                                    // Faz o login do usuário no claroline
                                    $('#loginToClarolineLogin').val(credentials.login);
                                    $('#loginToClarolinePassword').val(credentials.senha);
                                    $('#loginToClaroline').submit();

                                    App.session.flush();

                                    setTimeout(function redirectToClaroline() {
                                        document.location = 'http://ava.grupouninter.com.br/claroline176/claroline/auth/login.php';
                                    }, 1000);
                                });

                                // Deve ser renderizado somente após os listeners terem sido registrados
                                // já que o método delegateEvents da view é executado durante a execução do render
                                ambienteEscolhaView.render();
                            });
                        })
                        .fail(function (xhr, error, objResponse) { 

                             var statusResponse = objResponse.xhr.status;
                             

                             if(statusResponse == 500){
                                 App.flashMessage({ body: 'Não foi possível realizar o login. Tente novamente, caso o erro persista, contate o suporte.', type: 'danger', appendTo: '#login-form' });
                                 $('#loginBoxSpinner').addClass('fade');
                             }

                             if (statusResponse == 404) {
                                 var mensagem = 'A sua combinação de RU e senha está incorreta.';

                                 if (error.responseJSON != void (0) && error.responseJSON.mensagem != void (0) && error.responseJSON.mensagem.length > 0)
                                 {
                                     mensagem = error.responseJSON.mensagem;
                                 }

                                 App.flashMessage({ body: mensagem, type: 'danger', appendTo: '#login-form' });
                             }

                             if (statusResponse == 412) {
                                 App.flashMessage({ body: 'A sua combinação de RU e senha está incorreta.<br>Para ajudar a preservar seus dados, necessário validação extra (não sou um robô).', type: 'danger', appendTo: '#login-form' });
                                 grecaptcha.reset();
                                 $('.recaptcha').fadeIn();
                                 return;
                             }

                             if(statusResponse == 502){
                                 App.flashMessage({ body: 'Sem conexão - 502.', type: 'danger', appendTo: '#login-form' });
                             }  

                              if(statusResponse == 407){
                                 App.flashMessage({ body: 'Erro de Proxy - 407.', type: 'danger', appendTo: '#login-form' });
                              }

                              if(statusResponse == 303)
                              {
                                  if (error.responseJSON != void (0) && error.responseJSON.url != void (0) && error.responseJSON.url.length > 0)
                                  {
                                      window.location = error.responseJSON.url;
                                      return;
                                  }
                              }
                            

                            $('#login-form .alert').focus();
                        })
                        .always(function () {
                            // Escondendo o spinner e removendo o livicon
                            $('#loginBoxSpinner').addClass('fade');
                        });

                        // Limpa o form
                        $('form')[0].reset();
                    });
                }
            );
        },

        centralDeAjuda: function () {
            console.info('Central de Ajuda');
        },

        perguntasFrequentes: function () {
            console.info('Perguntas Frequentes');
        },

        atividades: function () {
            var templateLoader = new App.LazyLoader('text!templates');

            $.when( templateLoader.get('atividades.html') ).done(function (template) {
                App.headerItemView.show( new HeaderItemView() );
                $('#main-content').html(template);
//                App.footerItemView.show( new FooterItemView() );
            });
        },
        defaultRoute: function () {
            console.info('Default Route');
        },
        toggleVisibility: function () {
            this.$el.find('.block-item').toggleClass('active');
            App.Helpers.animatedScrollTop();
            this.setPlaceholderHeight();
        },
        setPlaceholderHeight: function () {
            var itemHeight = null,
            addHeight = null;
            // Armazena a altura do item sendo mostrado no momento
            itemHeight = $('#blockContainer .block-item.active').height();

            // Aumentar o tamnho do item no valor abaixo
            addHeight = 80;
            // Aplica o tamanho ao placeholder principal acrescido do tamanho adicional
            this.$el.css({ "min-height": itemHeight + addHeight + "px" });
        }
    });

});