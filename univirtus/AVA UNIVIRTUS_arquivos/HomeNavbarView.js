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
        Helpers = require('libraries/Helpers'),
        //processCollection = require('libraries/processCollection'),
        templateLoader = new App.LazyLoader('text!templates/ava/views'),
        collectionLoader = new App.LazyLoader('collections/ava'),
        eletivasView = new require('views/ava/Home/EletivasView'),
        //alertaView = new require('views/ava/Home/AlertaView'),
        PopupCls = require('libraries/popup'),
        BreadcrumbView = new require('views/common/BreadcrumbView'),
        ActionsItemView = new require('views/ava/Home/ActionsItemView'),
        templateBuscarSala = require("text!views/ava/SalaVirtual/SalaVirtualLista.html"),
        idEscolaTipoFiltroRecentes = 1,
        idEscolaTipoFiltroEscolas = 2,
        idEscolaTipoFiltroMeusCursos = 3,
        idEscolaTipoFiltroHistorico = 4,        
        idEscolaExtensao = 7,
        idEscolaFormacao = 11,
        idCursoNivelExterno = 10,        
        iconeOfertaFilha = '<span title="oferta vinculada" data-toggle="tooltip" data-placement="right" data-delay=\'{"hide":2500}\' class="badge-master badge bg-default">V</span>',
        iconeOfertaMaster = '<span  title="oferta mestre" data-toggle="tooltip" data-placement="right" class="badge-master badge bg-danger">M</span>',
        iconeOfertaMasterInterdisciplinar = '<span title="oferta mestre interdisciplinar" data-toggle="tooltip" data-placement="right" class="badge-master badge bg-danger">M I</span>',
        iconeOfertaEletiva = '<span title="oferta eletiva" data-toggle="tooltip" data-placement="right" class="badge-master badge bg-warning">E</span>',
		
        idCursoExtensao = null,
        codigoitemAXLastOpened = null,
        listaCursosExtensaoNovo = [],
        contratoPendente = false,
        idCursoFormacao = null,
        listaCursosFormacao = [],
        arrPerfisTutor = _.filter(UNINTER.StorageWrap.getItem('user').perfis, function (obj) {
                        return obj.idPerfil != 10 //aluno
                            && obj.idPerfil != 12 //claroline
                            && obj.idPerfil != 47 //imprime ai
                            && obj.idPerfil != 55 //acesso imprime ai
                            && obj.idPerfil != 29 //aluno externo
                            && obj.idPerfil != 75 //acesso aluno servico financeiro
                            && obj.idPerfil != 76 //Aluno extensão
                            && obj.idPerfil != 77 //Aluno formação
                            && obj.idPerfil != 78 //Cloud Uninter
        }),
        permissaoFavoritos = UNINTER.Helpers.Auth.getAreaPermsMetodo("OfertasFavoritas").toString(),

        EscolasView = Backbone.View.extend({
            tagName: 'li',
            className: '',
            initialize: function (options) {
                this.template = _.template('<a href="javascript: void(0)" id="escola_<%=id%>" class="link-escola <%=classe%>" title="Acessar - <%=nomeCompleto%>" data-idescolatipo="<%=idEscolaTipo%>" data-nomecompleto="<%=nomeCompleto%>"><i class="<%=icone%>"></i> <%=nome%></a>');
            },
            render: function (model) {                
                this.$el.append(this.template(model));
                return this;
            }
        }),
        DisciplinasView = EscolasView.extend({
            className: 'sv-item un-accordion-item',

            initialize: function (options) {
                var self = this;
                this.template = _.template(options.template);
                if (this.model != null) {
                    // Ao remover o item
                    this.listenTo(this.model, 'destroy', function () {
                        // Animar item excluído para fora da área de visualização
                        this.$el.addClass('un-accordion-item-removed');
                        // Aguardar por um instante e remover item da página
                        setTimeout(function () {
                            self.remove();
                        }, 600);
                    });
                }
            }
        }),    


        svInfo = function (data) {            
            var tit, desc, idTipoRotuloTitulo = 1, idTipoRotuloDescricao = 2;

            _.each(data, function (item) {
                
                if (item.idTipoRotulo === idTipoRotuloTitulo) {
                    tit = item;
                } else if (item.idTipoRotulo === idTipoRotuloDescricao) {
                    desc = item;
                } else {
                    App.logger.error('idTipoRotulo não previsto: %s', item.idTipoRotuloDescricao);
                }
            });
            return {
                titulo: tit,
                descricao: desc
            };
        },

        getId = function (id) {            
            return id.split('_')[1];
        };

    return Backbone.View.extend({
        events: {
            'click .link-escola': 'openEscola',
            'click .link-curso': 'openCurso',
            'click .link-voltar-curso': 'voltarCurso',
            'click .link-disciplina': 'openDisciplina',
            'click .link-disciplinaExterna': 'openDisciplinaExterna',
            'click .sv-adm-actions .sv-adm-actions-sv-remove ': 'removeSv',
            'click #actionbar-home .actions a.sv-adm-action-search': 'openBuscarOferta',
            'click .salas-virtuais #viewsalavirtuallista #btnOfertaBuscar': 'buscarOferta',
            'submit #viewsalavirtuallista #formOfertaBuscar': 'buscarOferta',
            'click #btnExtensao': 'renderFiltro',
            'click .checkStatusCurso ': 'aplicarFiltro',
            'click .pendencias': 'togglePendencias',
            'click .ofertasFavoritas' : 'toggleOfertasFavoritas'
        },

        initialize: function (options) {            

            var self = this;
            this.areaPerms = options.areaPerms;
            
            
            this.clearIdSalaVirtual();
            $('#divNotificationBar').trigger('change.atualizarPendentes');
            this.on('recarregar', function () {
                $("#navbar-avahome").empty();
                this.render();
                
            });
        },

        //limpa sessao da sala
        clearIdSalaVirtual: function clearIdSalaVirtual() {            
            App.StorageWrap.setAdaptor(sessionStorage);
            App.StorageWrap.removeItem('leftSidebarItemView');
            App.StorageWrap.removeItem('AssistenteVirtual');
            App.StorageWrap.removeItem('atividadeEstruturaAtual');
            App.StorageWrap.removeItem('desempenhoItemAprendizagem');
            App.StorageWrap.removeItem('AssistenteVirtualTrabalho');
            App.StorageWrap.removeItem('formacaoDocente');
            App.StorageWrap.removeItem("rus");
            App.StorageWrap.removeItem("polo");
        },

        //busca oferta informada
        buscarOferta: function buscarOferta(e) {
            e.preventDefault();
            
            var self = this;

            var elemento = "#viewsalavirtuallista #resultadoBuscarOferta";
            $(elemento).empty();

            var codigoOferta = parseInt($('#viewsalavirtuallista #ofertaBuscar').val());

            if (!codigoOferta > 0) {
                App.flashMessage({
                    'body': 'Código da oferta inválido.',
                    'appendTo': elemento,
                    type: 'warning'
                });
                return;
            }

            $.when(
              collectionLoader.get('SalaVirtualOfertas'),
              templateLoader.get('home-navbar-nested-row-template.html')

          ).done(function (SvEntity, nestedRowTemplate) {
              
              var collection = new SvEntity({ url: App.config.UrlWs('AVA') + "SalaVirtualOferta/" + codigoOferta + "/CodigoOferta" });
              

              collection.fetch({
                  success: function (response) {                      
                      if (response.models.length) {

                          var $ul = $("<ul>").addClass("un-accordion child");
                         
                          $(response.models).each(function (i, model) {
                      
                              var idEscola = model.get('idEscola'),
                                idCurso = model.get('idCurso'),
                                idSalaVirtual = model.get('idSalaVirtual'),
                                idSalaVirtualOferta = model.get('id'),
                                sigla = model.get("siglaCursoNivel") ? model.get("siglaCursoNivel") + " - " : "",
                                usuarioInscrito = model.get("usuarioInscrito"),
                                  ofertaAgrupamento = '';

                              

                              if (usuarioInscrito == 0) {

                                  if (model.get("idSalaVirtualOfertaPai") > 0) {
                                      var span = $(iconeOfertaFilha).clone();

                                      if (model.get("codigoOfertaPai") > 0) {
                                          var title = span.prop("title");
                                          span.prop("title", title + " à oferta " + model.get("codigoOfertaPai"));
                                      }
                                      var div = $("<div>").html(span);

                                      ofertaAgrupamento = div.html();
                                  }
                                  else if (model.get("totalFilhas") > 0 && model.get("idMultidisciplinar") > 0) {
                                      ofertaAgrupamento = iconeOfertaMasterInterdisciplinar;
                                  }
                                  else if (model.get("totalFilhas") > 0) {
                                      ofertaAgrupamento = iconeOfertaMaster;
                                  }

                                  if(model.get('eletiva') == true)
                                  {
                                      ofertaAgrupamento += '<a href="#/ava/salavirtualoferta/' + idSalaVirtualOferta +'">'+ iconeOfertaEletiva + '</a>';
                                  }
                              }
                   
                              /*Verifica se o usuário tem permissão de adicionar ofertas favoritas*/
                              var favoritosClasse = '';
                              
                              var manterRegistro = model.get("manterRegistro");

                              if (permissaoFavoritos.match('editar')) {
                                  if (manterRegistro == true) {
                                      favoritosClasse = 'icon-star';
                                  }
                                  else {
                                      favoritosClasse = 'icon-star-o';
                                  }
                              }
                              else {
                                  favoritosClasse = '';
                              }



                              var parsedModel = {
                                  editar: (usuarioInscrito == 0) ? true : false,
                                  remover: false,
                                  titulo: model.get("nomeSalaVirtual") ? model.get("nomeSalaVirtual") : "Sem título",
                                  ativa: model.get("ativa"),
                                  tipo: 'Disciplina',
                                  classe: 'link-disciplina',
                                  codigo: (model.get("codigoOferta")) ? " (" + model.get("codigoOferta") + ")" : '',
                                  statusTitulo: '',
                                  statusClasse: 'icon-circle text-primary',
                                  idEscola: idEscola,
                                  idCurso: idCurso,
                                  idCursoNivel: (model.get("idCursoNivel")) ? model.get("idCursoNivel") : '',
                                  idSalaVirtual: idSalaVirtual,
                                  idSalaVirtualOferta: idSalaVirtualOferta,
                                  cIdSalaVirtual: model.get("cIdSalaVirtual"),
                                  cIdSalaVirtualOferta: model.get("cIdSalaVirtualOferta"),
                                  descricao: '<div class="mini-block">' + sigla + model.get("nomeCurso") + ' (' + model.get("idCurso5e") + ')</div>',
                                  idSalaVirtualOfertaAproveitamento: model.get("idSalaVirtualOfertaAproveitamento"),
                                  ofertaAgrupamento: ofertaAgrupamento,
                                  usuarioInscrito: true, //Força usuario inscrito para mostrar o nome do modulo e o tipo da oferta
                                  infoCurso: false,
                                  exibirDatas: false,
                                  dataInicio: null,
                                  dataFim: null,
                                  nivel: null,
                                  codigoItemAX: null,
                                  importarPlanilha: false,
                                  exibirPendencias: usuarioInscrito,
                                  pendencias: 0,
                                  idUsuarioSalaVirtualOferta: 0,
                                  nomeTipoSituacao: "",
                                  idUsuarioCurso: 0,
                                  classeLabelGradeDisciplinaModuloTipo: model.get('classeLabelGradeDisciplinaModuloTipo'),
                                  descricaoGradeDisciplinaModuloTipo: model.get('descricaoGradeDisciplinaModuloTipo'),
                                  nomeGradeDisciplinaModuloTipo: model.get('nomeGradeDisciplinaModuloTipo'),
                                  nomeTurma: "",
                                  idAssinaturaContratoStatus: null,
                                  cursoTemContrato: null,
                                  idCurso5e: null,
                                  cdAluno: null,
                                  favoritosClasse: '',
                                  favoritosTitulo: '',
                                  idUsuarioHistoricoCursoOferta: '',
                                  manterRegistro: '',
                                  disciplinaIsolada: model.get('isolada')
                              };

                              if (model.get('ativo') == false) {
                                  parsedModel.codigo += ' <i class="icon-eye-slash" data-placement="bottom" data-toggle="tooltip" title="oferta inativa - não está visível aos alunos" title="oferta inativa"></i>';
                              } else {
                                  parsedModel.codigo += ' <i class="icon-eye" data-placement="bottom" data-toggle="tooltip" title="oferta ativa - visível aos alunos"></i>';
                              }

                              if (model.get('modulo') != null || model.get('modulo') != 'undefined') {
                                  parsedModel.descricao += '<span style="margin-top: 5px;">' + model.get('modulo') + '</span>';
                              }

                              var nestedRowView = new DisciplinasView({ 'model': model, 'id': 'salavirtual_' + model.id, 'template': nestedRowTemplate });
                              var nestedRowViewEl = nestedRowView.render(parsedModel).$el;

                              $ul.append(nestedRowViewEl);

                          });

                          
                          $(elemento).append($ul);

                          //self.salvarHistoricoNavegacao(idEscola, idCurso, idSalaVirtual, idSalaVirtualOferta);
                          //redireciona para oferta caso tenha permissao
                          //window.location = "#/ava/roteiro-de-estudo/" + idSalaVirtual + "/" + idSalaVirtualOferta;
                      }
                      else {
                          App.flashMessage({
                              'body': 'Não foi possível localizar a oferta solicitada.',
                              'appendTo': elemento,
                              type: 'warning'
                          });
                      }
                  },
                  error: function () {
                      App.flashMessage({
                          'body': 'Não foi possível localizar a oferta solicitada.',
                          'appendTo': elemento,
                          type: 'warning'
                      });
                  }
              });
          });
        },
        //exibe opcao para buscar ofertas
        openBuscarOferta: function openBuscarOferta(e) {
            $("#navbar-avahome #navbarEscolas li").removeClass("active");
            $("#breadcrumb-home").empty();
            $("#home-listar-disciplinas").hide();
            $('#viewsalavirtuallista #ofertaBuscar').val("");
            $("#home-listar-cursos .divCursosEscola").hide();
            this.clearLastOpened();

            if ($("#home-listar-cursos #home-buscar-oferta").length == 0) {
                $("#home-listar-cursos").append($("<div>").attr('id', 'home-buscar-oferta').addClass("divCursosEscola"));
                $("#home-listar-cursos #home-buscar-oferta").html(_.template(templateBuscarSala));                
            }            
            $("#viewsalavirtuallista #resultadoBuscarOferta").empty();
            $("#home-listar-cursos").find("#ofertaBuscar").focus();
            $("#home-listar-cursos #home-buscar-oferta").fadeIn("slow");
        },
        
        //eveno de clique em determinada escola
        openEscola: function openEscola(e) {

            var self = this;
        
            var $el;
            if ( e.currentTarget ) { $el = $(e.currentTarget); }
            else if ( e instanceof $ ) { $el = e; }
            else { $el = $('#'+e); }
            

            if($("#navbar-avahome").is(":hidden"))
                $("#navbar-avahome").fadeIn('slow');

            var parentItem = $el.closest('li');
            var idEscola = $el.prop('id').replace('escola_', '');
            var idEscolaTipo = $el.data("idescolatipo");
            
            $("#home-listar-cursos .divCursosEscola").hide();
            
            if (!parentItem.hasClass('active')) {
                var lastOpened = this.getLastOpened();

                //se nao esta ativo, carrega lista de cursos
                $("#home-listar-disciplinas").hide();
                //$("#home-listar-cursos").fadeIn("slow").empty();
                parentItem.toggleClass('active').siblings('li').removeClass('active');

                this.clearLastOpened();
                if (lastOpened && idEscolaTipo != idEscolaTipoFiltroRecentes) {
                    var idCurso = lastOpened.idCurso;
                    var idUsuarioCurso = lastOpened.idUsuarioCurso;
                    if (idCurso > 0) {
                        this.renderLastOpened(idEscola, idCurso, idUsuarioCurso);
                    }
                    else {
                        this.renderLastOpenedEscola(idEscola, idEscolaTipo, $el)
                    }
                }
                else {
                    var nomeEscola = $el.data("nomecompleto");

                    var text = "selecione o curso";
                    if (idEscolaTipo == idEscolaTipoFiltroRecentes)
                        text = "selecione a disciplina";

                    this.renderBreadcrumb([{ text: nomeEscola }]);

                    switch (idEscolaTipo) {
                        case idEscolaTipoFiltroRecentes:
                            //renderiza disciplinas recentes
                            this.renderRecentes($el);
                            break;
                        default:
                            //renderiza cursos
                            this.renderCursos($el);
                            break;
                    }
                }
 
                if (idEscola == idEscolaExtensao ) {
                    var actions = new ActionsItemView({ 'areaPerms': self.areaPerms, 'areaName': 'curso' });
                    var actionsEl = actions.render().$el;
                    $("#actionbar-home #group-action").html(actionsEl);
                    this.renderBreadcrumb([{ text: 'Extensão (Modelo novo)' }, { text: '' }]);
                }
                else if (idEscola == idEscolaFormacao) {
                    var actions = new ActionsItemView({ 'areaPerms': self.areaPerms, 'areaName': 'curso' });
                    var actionsEl = actions.render().$el;
                    $("#actionbar-home #group-action").html(actionsEl);
                    this.renderBreadcrumb([{ text: 'Formação Continuada' }, { text: '' }]);
                }
                else {
                    var actions = new ActionsItemView({ 'areaPerms': self.areaPerms, 'areaName': 'salavirtual' });
                    var actionsEl = actions.render().$el;
                    $("#actionbar-home #group-action").html(actionsEl);
                }

            
                $(".Cadastrarcurso, .Cadastrarsalavirtual").on("click", function (e) {
                  
                    var el = $(e.currentTarget);
                    var idescola = $el.prop('id').replace('escola_', '');
                    var idCurso = el.data("idcurso") != null ? el.data("idcurso") : 0 ;
                    var idUsuarioCurso = el.data("idusuariocurso") != null ? el.data("idusuariocurso") : 0;
                    idCursoExtensao = idCurso;
                    self.setLastOpened(idEscola, idCurso, idUsuarioCurso);
                    
                });
            }
            else if ($("#home-listar-cursos #divCursoEscola_" + idEscola).is(":hidden")) {
                this.voltarCurso($el);
            }
        },

        //evento de clique em determinado curso
        openCurso: function openCurso(e) {
            
            var $el;
            if ( e.currentTarget ) { $el = $(e.currentTarget); }
            else if ( e instanceof $ ) { $el = e; }
            else { $el = $('#'+e); }
            
            var idEscola = $el.data('idescola'),
               idCurso = $el.data('idcurso'),
           idSalaVirtual = $el.data('idsalavirtual'),
           idSalaVirtualOferta = $el.data('idsalavirtualoferta');


            $("#home-listar-cursos .divCursosEscola").hide();
            
            $("#home-listar-disciplinas").fadeIn("slow").empty();
            
            var nomeCurso = $el.find('.titulo').text() + $el.closest('h4').find('.codigo5e').text();

            this.renderBreadcrumb([{ text:nomeCurso, }]);
            var breadFirst = $("#breadcrumb-home li:first");
            if (breadFirst.length) {
                breadFirst.html('<i class="icon-chevron-circle-left link-voltar-curso" title="Voltar para lista de cursos"></i>' + breadFirst.text());
            }

            var idEscola = this.getIdEscolaAtiva();
            
            var obj = null;
            if (idEscola == idEscolaFormacao) {
                obj = $el.closest('a');
                idCurso = obj.data('idcurso');
                codigoitemAXLastOpened = null;
            }
            else if (idEscola != idEscolaExtensao) {
                obj = $el.closest('li');
                idCurso = obj.prop('id').replace('curso_', '');
                codigoitemAXLastOpened = null;
            }
            else {
                var codigoItemAX = $el.data('codigoitemax');
                if (codigoItemAX != null) {
                    codigoitemAXLastOpened = codigoItemAX; 
                }
                idCursoExtensao = idCurso;
            }

            //renderiza disciplinas
            this.renderDisciplinas($el);
        
        },
        //evento de click em determinada disciplina
        openDisciplina: function openDisciplina(e) {            
            var $el = $(e.currentTarget);
            var selfA = this;

            App.loadingView.reveal();
            
            var idEscola = $el.data('idescola'),
                idCurso = $el.data('idcurso'),
                idSalaVirtual = $el.data('idsalavirtual'),
                idSalaVirtualOferta = $el.data('idsalavirtualoferta'),
                cIdSalaVirtual = $el.data('cidsalavirtual'),
                cIdSalaVirtualOferta = $el.data('cidsalavirtualoferta'),
                idSalaVirtualOfertaAproveitamento = $el.data('idsalavirtualofertaaproveitamento'),
                usuarioInscrito = $el.data('usuarioinscrito'),
                idUsuarioCurso = $el.data('idusuariocurso'),
                idEscolaAbas = self.idEscola,
                codigoItemAX = $el.data('codigoitemax');

            try {                
                idEscolaAbas = this.getIdEscolaAtiva();                
            } catch (e) { console.warn("Não foi possível localizar escola pela aba") };

            var url = "#/ava/roteiro-de-estudo/" + cIdSalaVirtual + "/" + cIdSalaVirtualOferta;

            var idUsuarioCurso = $el.data('idusuariocurso');
            var idCicloTipo = $el.data('idciclotipo');

            var cicloNaoIntrodutorio = (idCicloTipo != 3);

         
            if (cicloNaoIntrodutorio && contratoPendente === true) {
                
                    UNINTER.Helpers.showModal({
                        size: "",
                        body: '<p><b>O CENTRO UNIVERSITÁRIO INTERNACIONAL UNINTER</b> informa: </p></br>' +
                                '<p><b>O SEU CONTRATO AINDA NÃO FOI ASSINADO</b></p></br>' +
                                '<p>Prezado(a) aluno(a) informamos que para acessar o ambiente de aula você deverá primeiramente dar aceite no seu contrato de prestação de serviços educacionais.</p></br>' +
                                '<p>Clique em ‘ASSINAR”, logo abaixo, você será redirecionado ao portal de contratos digitais.</p></br>' +
                                '<p>No portal você deverá informar o RU e senha para acessar o contrato e assiná-lo digitalmente.</p></br>' +
                                '<p>Boas aulas</p>',
                        title: '',
                        buttons: [{
                            'type': "button",
                            'klass': "btn btn-primary",
                            'text': "Assinar",
                            'dismiss': null,
                            'id': 'modal-ok',
                            'onClick': function (event, jQModalElement) {
                                window.open("https://contratodigital.uninter.com", '_blank');
                            }
                        }]
                    });
                    jQuery('.link-voltar-curso').click();
                        
                    
            } else {

                //redireciona para sala
                Backbone.history.navigate(url);
                //salva historico de navegacao
                this.salvarHistoricoNavegacao(idEscola, idCurso, idSalaVirtual, idSalaVirtualOferta, idSalaVirtualOfertaAproveitamento, usuarioInscrito);
                //idCursoExtensao = idCurso;
                this.setLastOpened(idEscola, idCurso, idUsuarioCurso);
            }
  
        },
        //evento de click em determinada disciplina
        openDisciplinaExterna: function openDisciplinaExterna(e) {
            var $el = $(e.currentTarget);
            
            App.loadingView.reveal();
            
            var idEscola = $el.data('idescola'),
                idCurso = $el.data('idcurso'),
                idUsuarioCurso = $el.data('idusuariocurso'),
                idSalaVirtual = $el.data('idsalavirtual'),
                idSalaVirtualOferta = $el.data('idsalavirtualoferta'),
                idSalaVirtualOfertaAproveitamento = $el.data('idsalavirtualofertaaproveitamento'),
                usuarioInscrito = $el.data('usuarioinscrito'),
                idEscolaAbas = self.idEscola;

            try {                
                idEscolaAbas = this.getIdEscolaAtiva();                
            } catch (e) { console.warn("Não foi possível localizar escola pela aba") };

            
            App.Helpers.ajaxRequest({
                type: 'GET',
                url: App.config.UrlWs('integracao') + "TermoAceiteOfertaUsuario/" + idSalaVirtualOferta + '/GetTermoOferta/' + UNINTER.StorageWrap.getItem('user').login,
                async: true,
                successCallback: function (data) {
                    var url = data.termoAceiteOfertaUsuario.url;
                    if (data.termoAceiteOfertaUsuario.url) {
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
                                    window.open(url, '_blank');
                                    jQModalElement.modal('hide');
                                    //salva historico de navegacao
                                    self.salvarHistoricoNavegacao(idEscola, idCurso, idSalaVirtual, idSalaVirtualOferta, idSalaVirtualOfertaAproveitamento, usuarioInscrito);
                                    self.setLastOpened(idEscolaAbas, idCurso, idUsuarioCurso);
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
                    }
                    else {
                        console.error("Url voxy não localizada");
                        App.Helpers.showModal({
                            size: "modal-sm",
                            body: 'Você não tem permissão para acessar o conteúdo',                            
                            buttons: [{
                                'type': "button",
                                'klass': "btn btn-primary",
                                'text': "Ok",
                                'dismiss': null,
                                'id': 'modal-ok',
                                'onClick': function (event, jQModalElement) {                                    
                                    // Fecha a modal
                                    jQModalElement.modal('hide');
                                }
                            }]
                        });

                    }
                },
                errorCallback: function (erro) {
                    
                    if (erro.status == 404) {                        
                        Backbone.history.navigate("#/ava/termoAceiteOfertaUsuario/" + idSalaVirtualOferta);
                    }
                    else {
                        var mensagem = (erro.responseText) ? erro.responseText : 'Você não tem permissão para acessar o conteúdo';
                        
                        App.Helpers.showModal({
                            size: "modal-sm",
                            body: mensagem,                            
                            buttons: [{
                                'type': "button",
                                'klass': "btn btn-primary",
                                'text': "Ok",
                                'dismiss': null,
                                'id': 'modal-ok',
                                'onClick': function (event, jQModalElement) {
                                    // Fecha a modal
                                    jQModalElement.modal('hide');
                                }
                            }]
                        });
                    }
                }                
            });            
        },
        
        //evento de click no breadcrumb do curso para voltar para sala
        voltarCurso: function voltarCurso(e) {
            var idEscola = this.getIdEscolaAtiva();
            var obj = this.getEscolaAtiva();            
            var nomeEscola = obj.data('nomecompleto');
            var idEscolaTipo = obj.data('idescolatipo');
            var text = "selecione o curso";
            if (idEscolaTipo == idEscolaTipoFiltroRecentes)
                text = "selecione a disciplina";

            this.renderBreadcrumb([{ text: nomeEscola }]);
            var idEScola = obj.prop('id').replace('escola_', '');

            $("#home-listar-disciplinas").hide();
            $("#home-listar-cursos #divCursoEscola_" + idEscola).fadeIn("slow");
            $("#home-listar-cursos .divCursosEscola").hide();
            //se tem empty.. foi direto para as disciplinas(historico) sem carregar a lista de curso, entao precisar carregar lista
            
            this.renderCursos(obj);
            if (idEscola == idEscolaExtensao) {
                var actions = new ActionsItemView({ 'areaPerms': self.areaPerms, 'areaName': 'curso' });
                var actionsEl = actions.render().$el;
                $("#actionbar-home #group-action").html(actionsEl);
                this.renderBreadcrumb([{ text: 'Extensão (Modelo novo)' }, { text: '' }]);
            } else {
                var actions = new ActionsItemView({ 'areaPerms': self.areaPerms, 'areaName': 'salavirtual' });
                var actionsEl = actions.render().$el;
                $("#actionbar-home #group-action").html(actionsEl);
            }
                        
        },

        //salva historico de navegacao na disciplina
        salvarHistoricoNavegacao: function (idEscola, idCurso, idSalaVirtual, idSalaVirtualOferta, idSalaVirtualOfertaAproveitamento, usuarioInscrito) {
            console.log('idEscola: ' + idEscola + ' idCurso: ' + idCurso + ' idSalaVirtual: ' + idSalaVirtual + ' idSalaVirtualOferta ' + idSalaVirtualOferta);
            if ((App.session.get('idUsuarioSimulador') == 0 || App.session.get('idUsuarioSimulador') == null) && idEscola > 0 && idCurso > 0 && idSalaVirtual > 0 && idSalaVirtualOferta > 0) {
                //console.info('idEscola: ' + idEscola + ' idCurso: ' + idCurso + ' idSalaVirtual: ' + idSalaVirtual + ' idSalaVirtualOferta ' + idSalaVirtualOferta);
                var data = {
                    idEscola: idEscola,
                    idCurso: idCurso,
                    idSalaVirtual: idSalaVirtual,
                    idSalaVirtualOferta: idSalaVirtualOferta,
                    idSalaVirtualOfertaAproveitamento:idSalaVirtualOfertaAproveitamento,
                    usuarioInscrito: usuarioInscrito
                }
                App.Helpers.ajaxRequest({
                    type: 'POST',
                    url: App.config.UrlWs('sistema') + "UsuarioHistoricoCursoOferta",
                    async: true,
                    'data': data
                });
            }
        },

        //exclui sala
        removeSv: function (e) {            
            // faz um DELETE em salaVirtual/1246
            // onde 1246 é  o idSalaVirtual]
            
            var $el = $(e.currentTarget),
                itemId = $el.closest('.sv-item').attr('id'),
                idSalaVirtual = getId(itemId),
                tituloSalaVirtual = $.trim($el.closest('.sv-item').find('.sv-item-title .link-disciplina').text()),
                model = this.collection.url = App.config.UrlWs('ava') + 'SalaVirtual/',
                model = this.collection.get(idSalaVirtual);

            // Confirmar
            App.Helpers.showModal({
                size: "modal-sm",
                body: 'Deseja realmente excluir a sala virtual <br> <i>"' + tituloSalaVirtual + '"</i> ?',
                title: null,
                buttons: [{
                    'type': "button",
                    'klass': "btn btn-primary",
                    'text': "Ok",
                    'dismiss': null,
                    'id': 'modal-ok',
                    'onClick': function (event, jQModalElement) {
                        model.destroy();
                        // Fecha a modal
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

        //seta ultima escola/curso visitado
        setLastOpened: function setLastOpened(idEscola, idCurso, idUsuarioCurso) {
            if (idEscola > 0 && idCurso >= 0) {
         
                App.StorageWrap.setItem('lastOpenedCourse', { 'idEscola': idEscola, 'idCurso': idCurso, 'idUsuarioCurso': idUsuarioCurso });
               
            }
            else console.warn('idEscola ou idCurso null. Escola:' + idEscola + " Curso:" + idCurso + " UsuarioCurso:" + idUsuarioCurso);
            return this;
        },

        //pega ultima escola/curso visitado
        getLastOpened: function getLastOpened() {            
            var lastOpen = App.StorageWrap.getItem('lastOpenedCourse');
            return lastOpen;
        },
        //limpa sessao
        clearLastOpened: function clearLastOpened() {            
            App.StorageWrap.setAdaptor(sessionStorage);
            App.StorageWrap.removeItem('lastOpenedCourse');
        },
        //busca ultimo curso para renderizar disciplinas
        renderLastOpened: function renderLastOpened(idEscola, idCurso, idUsuarioCurso) {
            var self = this;
                
            $.when(
               collectionLoader.get('curso'),
               templateLoader.get('home-navbar-nested-row-template.html')
               
           ).then(function (cursoEntity, nestedRowTemplate) {
               //busca curso especifico
               var url = App.config.UrlWs('sistema') + 'Curso/' + idCurso + '/Get';
               var collection = new cursoEntity({url: url});

               collection.fetch({
                   success: function (response) {
                       
                       var model = response.models[0];
                       if (response.models.length) {
                           var parsedModel = {
                               editar: false,
                               remover: false,
                               titulo: model.get("nome"),
                               ativa: null,
                               tipo: null,
                               classe: null,
                               codigo: null,
                               statusTitulo: null,
                               statusClasse: null,
                               idEscola: idEscola,
                               idCurso: model.get("id"),
                               idCursoNivel: '',
                               idSalaVirtual: 0,
                               idSalaVirtualOferta: 0,
                               idSalaVirtualOfertaAproveitamento: null,
                               ofertaAgrupamento: '',
                               usuarioInscrito: null,
                               descricao: null,
                               infoCurso: null,
                               exibirDatas: false,
                               dataInicio: null,
                               dataFim: null,
                               nivel: null,
                               codigoItemAX: null,
                               importarPlanilha: false,
                               exibirPendencias: false,
                               pendencias: 0,
                               idUsuarioSalaVirtualOferta: 0,
                               nomeTipoSituacao: null,
                               idUsuarioCurso: idUsuarioCurso,
                               nomeTurma: null,
                                idAssinaturaContratoStatus: model.get("idAssinaturaContratoStatus"),
                                cursoTemContrato: model.get("temContrato"),
                                idCurso5e: model.get("idCurso5e"),
                                cdAluno: model.get("cdAluno"),
                               favoritosClasse: '',
                               favoritosTitulo: '',
                               idUsuarioHistoricoCursoOferta: '',
                               manterRegistro: '',
                               disciplinaIsolada: model.get('isolada')
                           };
                           //cria elemento liCurso para e abre o curso
                           var nestedRowView = new DisciplinasView({ 'model': model, 'id': 'curso_' + model.id, 'template': nestedRowTemplate });
                           var nestedRowViewEl = nestedRowView.render(parsedModel).$el;
                           var aCurso = nestedRowViewEl.find("a:first");
                           
                           //$("#home-listar-cursos").addClass("empty");
                           self.openCurso(aCurso);                           
                       }
                   }
               });
           });
        },

        //busca ultima escola para renderizar cursos
        renderLastOpenedEscola: function renderLastOpenedEscola(idEscola, idEscolaTipo, $el) {
            
            var self = this;

            var nomeEscola = $el.data("nomecompleto");

            var text = "selecione o curso";
            if (idEscolaTipo == idEscolaTipoFiltroRecentes)
                text = "selecione a disciplina";

           

            if (idEscola == idEscolaExtensao) {
                var actions = new ActionsItemView({ 'areaPerms': self.areaPerms, 'areaName': 'curso' });
                var actionsEl = actions.render().$el;
                $("#actionbar-home #group-action").html(actionsEl);
                this.renderBreadcrumb([{ text: 'Extensão (Modelo novo)' }]);
            } else {
                var actions = new ActionsItemView({ 'areaPerms': self.areaPerms, 'areaName': 'salavirtual' });
                var actionsEl = actions.render().$el;
                $("#actionbar-home #group-action").html(actionsEl);
                this.renderBreadcrumb([{ text: nomeEscola }]);
            }
            $.when(
               collectionLoader.get('curso'),
               templateLoader.get('home-navbar-nested-row-template.html')
               
           ).then(function (cursoEntity, nestedRowTemplate) {
               //busca curso especifico


               $("#home-listar-cursos .divCursosEscola").hide();
               //adiciona actions (criacao de sala e pesquisa)          

               //$(".actions").html('<a title="cadastrar" href="#/ava/salavirtual/0/novo"><i class="icon-plus-circle"></i></a><a title="pesquisar" class="sv-adm-action-search" href="javascript: void(0)"><i class="icon-search"></i></a>');

               if (idEscola == idEscolaExtensao) {
                   if ($('#main-content').attr("class") == 'three-columns') {
                       $('#expander').trigger("click");
                   }
                   self.renderLastOpenedEscolaExtensao(idEscola, idEscolaTipo);
                   return;
               }
               else if (idEscola == idEscolaFormacao) {
                   if ($('#main-content').attr("class") == 'three-columns') {
                       $('#expander').trigger("click");
                   }
                   self.renderLastOpenedEscolaFormacao(idEscola, idEscolaTipo);
                   return;
               }
               else $('#main-content').attr("class", "three-columns")

               if ($("#home-listar-cursos #divCursoEscola_" + idEscola).length > 0) {
                   $("#home-listar-cursos #divCursoEscola_" + idEscola).show();
               }
               else {
                   $("#home-listar-cursos").append($("<div>").attr('id', "divCursoEscola_" + idEscola).addClass("divCursosEscola"));
                   $("#home-listar-cursos #divCursoEscola_" + idEscola).html("<ul class='un-accordion child'></ul>");

                   $.when(
                       collectionLoader.get('Cursos'),
                       templateLoader.get('home-navbar-nested-row-template.html')
                   ).then(function (SvEntity, nestedRowTemplate) {

                       var historico = false;
                       var url = null;
                       switch (idEscolaTipo) {
                           case idEscolaTipoFiltroHistorico:
                               url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=false&cache=' +new Date().getTime();
                               historico = true;
                               break;
                           case idEscolaTipoFiltroMeusCursos:
                               url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=true&cache=' + new Date().getTime();
                               break;
                           case idEscolaTipoFiltroEscolas:
                           default:
                               url = App.config.UrlWs('sistema') + 'Curso/' + idEscola + '/EscolaUsuario/false/?emCurso=true&cache=' + new Date().getTime();
                               break;
                       }

                       var collection = new SvEntity({ url: url });
                       collection.fetch({
                           success: function (response) {

                               var editar = false;
                               if (response.models.length) {
                                   var html = $('#home-listar-cursos #divCursoEscola_' + idEscola).find('.un-accordion.child');
                                   _.each(response.models, function (model) {

                                       var parsedModel,
                                           nestedRowView,
                                           nestedRowViewEl;
                                       var codigoItemAX = model.get("codigoItemAX");

                                       
                                       parsedModel = {
                                           editar: false,
                                           remover: false,
                                           titulo: model.get("nome"),
                                           ativa: model.get("ativa"),
                                           tipo: 'Curso',
                                           classe: 'link-curso text-uppercase',
                                           codigo: (model.get("idCurso5e")) ? " (" + model.get("idCurso5e") + ")" : '',
                                           statusTitulo: null,
                                           statusClasse: "icon-caret-right text-blue-light",
                                           nivel: model.get("siglaCursoNivel") ? model.get("siglaCursoNivel") + " - " : "",
                                           idSalaVirtualOfertaAproveitamento: null,
                                           ofertaAgrupamento: '',
                                           usuarioInscrito: null,
                                           idEscola: idEscola,
                                           idCurso: model.get("idCurso"),
                                           cIdCurso: model.get("cIdCurso"),
                                           idSalaVirtual: 0,
                                           idSalaVirtualOferta: 0,
                                           descricao: '',
                                           infoCurso: true,
                                           exibirDatas: false,
                                           dataInicio: null,
                                           dataFim: null,
                                           recorrencia: null,
                                           codigoItemAX: codigoItemAX,
                                           importarPlanilha: false,
                                           exibirPendencias: false,
                                           pendencias: 0,
                                           idUsuarioSalaVirtualOferta: 0,
                                           nomeTipoSituacao: model.get("nomeTipoSituacao") ? model.get("nomeTipoSituacao") : '',
                                           idUsuarioCurso: model.get("idUsuarioCurso"),
                                           nomeTurma: model.get("turma") ? model.get("turma") : '',
                                           idAssinaturaContratoStatus: null,
                                           cursoTemContrato: null,
                                           idCurso5e: null,
                                           cdAluno: null,
                                           favoritosClasse: '',
                                           favoritosTitulo: '',
                                           idUsuarioHistoricoCursoOferta: '',
                                           manterRegistro: '',
                                           disciplinaIsolada: model.get('isolada')
                                       };

                                       nestedRowView = new DisciplinasView({ 'model': model, 'id': 'curso_' + parsedModel.idCurso, 'template': nestedRowTemplate });
                                       nestedRowViewEl = nestedRowView.render(parsedModel).$el;
                                       html.append(nestedRowViewEl);


                                   });
                                   $(".EditarSala, .EditarCurso, .InfoCurso").on("click", function (e) {
                                       
                                       var el = $(e.currentTarget);
                                       var idescola = el.data("idescola");
                                       var idCurso = el.data("idcurso");;
                                       idCursoExtensao = idCurso;
                                       self.setLastOpened(idEscola, 0, 0);
                                    
                                   });
                               }
                               else {
                                   //resposta vazia
                                   self.renderEmptyCurso(idEscola, idEscolaTipo);
                               }
                           },
                           error: function () {
                               //resposta vazia
                               self.renderEmptyCurso(idEscola, idEscolaTipo);
                           }

                       }).done(function () {
                           //seta focus no 1º curso (necessário para navegacao com tab)
                           if (self.permiteFocus)
                               $("#home-listar-cursos #divCursoEscola_" + idEscola + " a:first").focus();
                       });
                   });
               }
           });
        },

        //busca ultimo Escola para renderizar cursos quando for extensão
        renderLastOpenedEscolaExtensao: function renderLastOpenedEscolaExtensao(idEscola, idEscolaTipo, $el) {
            $("#home-listar-cursos .divCursosEscola").hide();
           
            var self = this;

            if ($("#home-listar-cursos #divCursoEscola_" + idEscola).length > 0) {
                $("#home-listar-cursos #divCursoEscola_" + idEscola).show();
            }
            else {
                $("#home-listar-cursos").append($("<div>").attr('id', "divCursoEscola_" + idEscola).addClass("divCursosEscola"));
                $("#home-listar-cursos #divCursoEscola_" + idEscola).html();

                $.when(collectionLoader.get('Cursos'),
                        templateLoader.get('home-accordion-extensao-template.html')
                    ).then(function (SvEntity, nestedRowTemplate) {
                        var historico = false;
                        var url = null;
                        switch (idEscolaTipo) {
                            case idEscolaTipoFiltroHistorico:
                                url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=false&cache=' +new Date().getTime();
                                historico = true;
                                break;
                            case idEscolaTipoFiltroMeusCursos:
                                url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=true&cache=' + new Date().getTime();
                                break;
                            case idEscolaTipoFiltroEscolas:
                            default:
                                url = App.config.UrlWs('sistema') + 'Curso/' + idEscola + '/EscolaUsuario/false/?emCurso=true&cache=' + new Date().getTime();
                                break;
                        }

                        var collection = new SvEntity({ url: url });
                        collection.fetch({
                            success: function (response) {

                                var editar = false;

                                if (response.models.length) {
                                    var html = $('#home-listar-cursos #divCursoEscola_' + idEscola);
                                    html.append('<table id="idTabelaExtensaoNovo" class="table table-hover table-striped uninter-grid list clickable"><thead>' +
                                            '<th style="width:72%;">NOME DO CURSO</th>' +
                                            '<th><div class="dropdown" id="divFiltroCoordenacao"><button type="button" id="btnCoordenacao" style="justify-content: center; display: flex;margin:0px;padding-left:0px;border: 0px;background-color: white;color: #666;"' +
                                            'data-toggle="dropdown">ACADEM&nbsp;<i class="icon-filter" style="color:#4270a1" ></i>' +
                                            '</button><ul class="dropdown-menu"  id="uldivFiltroCoordenacao">' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkCoordenacaoAguardando"  checked><span style="text-transform:none;">&nbsp;aguardando</span></input></li>' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkCoordenacaoLiberado" checked><span style="text-transform:none;">&nbsp;liberado</span></input></li></ul></th></div>' +

                                            '<th style="width:7%;"><div class="dropdown" id="divFiltroExtensao"><button type="button" id="btnExtensao" style="justify-content: center; display: flex;margin:0px;padding-left:0px;border: 0px;background-color: white;color: #666;"' +
                                            'data-toggle="dropdown">EXTENSÃO&nbsp;<i class="icon-filter" style="color:#4270a1" ></i>' +
                                            '</button><ul class="dropdown-menu"  id="uldivFiltroExtensao">' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkExtensaoAguardando"  checked><span style="text-transform:none;">&nbsp;aguardando</span></input></li>' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkExtensaoLiberado" checked><span style="text-transform:none;">&nbsp;liberado</span></input></li></ul></th></div>' +

                                            '<th style="width:7%;"><div class="dropdown" id="divFiltroPortal"><button type="button" id="btnPortal" style="justify-content: center; display: flex;margin:0px;padding-left:0px;border: 0px;background-color: white;color: #666;"' +
                                            'data-toggle="dropdown">PORTAL&nbsp;<i class="icon-filter" style="color:#4270a1" ></i>' +
                                            '</button><ul class="dropdown-menu"  id="uldivFiltroPortal">' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkPortalAguardando" checked><span style="text-transform:none;">&nbsp;aguardando</span></input></li>' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkPortalLiberado" checked><span style="text-transform:none;">&nbsp;liberado</span></input></li></ul></th></div>' +

                                            '<th style="text-align:center;width:7%;">EDITAR</th></thead><tbody id="tableCursoEscola1" ></tbody></table>'

                                            )


                                    html.append('<div id="actionbar-home"><div id="breadcrumb-home">' +
                                        '<ol id="idBreadcrumbExtensaoAntigos" class="breadcrumb" tabindex="-1" style="cursor:pointer;"><li>Extensão (Modelo antigo)</li></ol></div><div class="actions">' +
                                        '<a title="cadastrar" href="#/ava/salavirtual/0/novo" class="EditarSalaExtensao"><i class="icon-plus-circle"></i></a>' +
                                        '<a title="pesquisar" class="sv-adm-action-search" href="javascript: void(0)"><i class="icon-search"></i></a></div>' +
                                        '<table id="idTabelaExtensaoAntigos" class="table table-hover table-striped uninter-grid list clickable"><tbody id="tableCursoEscola2"></tbody></table>')

                                    var html1 = $('#home-listar-cursos #divCursoEscola_' + idEscola).find('#tableCursoEscola1');
                                    var html2 = $('#home-listar-cursos #divCursoEscola_' + idEscola).find('#tableCursoEscola2');

                                    var permissao = UNINTER.Helpers.Auth.getAreaPermsMetodo("Curso").toString();
                                    if (permissao.match('editar')) {
                                        editar = true;
                                    }
                                    _.each(response.models, function (model) {
                                        var parsedModel,
                                            nestedRowView,
                                            nestedRowViewEl;


                                        var statusFluxoVenda = model.get("idSituacaoVenda");
                                        var coordenacao = null;
                                        var extensao = null;
                                        var financeiro = null;
                                        var portal = null;
                                        var codigoItemAX = model.get("codigoItemAX");

                                        switch (statusFluxoVenda) {
                                            case 1: //EmCriacaoPeloCoordenador
                                                coordenacao = '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                extensao = '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                portal = '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                break;
                                            case 2: //AguardandoValidacaoPelaExtensao
                                                coordenacao = '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                extensao = '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                portal = '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                break;
                                            case 3: //AguardandoValidacaoPeloFincanceiro
                                                coordenacao = '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                extensao = '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                portal = '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                break;

                                            case 4: //LiberadoParaVenda
                                                coordenacao = '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                extensao = '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                portal = '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                break;
                                            default:
                                                coordenacao = null;
                                                extensao = null;
                                                portal = null;
                                                break;
                                        }

                                        if (codigoItemAX != null) {
                                            parsedModel = {
                                                editar: editar,
                                                remover: false,
                                                titulo: model.get("nome"),
                                                ativa: model.get("ativa"),
                                                tipo: 'Curso',
                                                classe: 'link-curso text-uppercase',
                                                codigo: (model.get("idCurso5e")) ? " (" + model.get("idCurso5e") + ")" : '',
                                                statusTitulo: null,
                                                statusClasse: "icon-caret-right text-blue-light",
                                                nivel: model.get("siglaCursoNivel") ? model.get("siglaCursoNivel") + " - " : "",
                                                idSalaVirtualOfertaAproveitamento: null,
                                                ofertaAgrupamento: '',
                                                usuarioInscrito: null,
                                                idEscola: idEscola,
                                                idCurso: model.get("idCurso"),
                                                cIdCurso: model.get("cIdCurso"),
                                                idSalaVirtual: 0,
                                                idSalaVirtualOferta: 0,
                                                descricao: '',
                                                infoCurso: false,
                                                exibirDatas: false,
                                                dataInicio: null,
                                                dataFim: null,
                                                coordenacao: coordenacao,
                                                extensao: extensao,
                                                financeiro: financeiro,
                                                portal: portal,
                                                codigoItemAX: codigoItemAX,
                                                importarPlanilha: false,
                                                idAssinaturaContratoStatus: null,
                                                cursoTemContrato: null,
                                                idCurso5e: null,
                                                cdAluno: null
                                            }
                                            html1.append(_.template(nestedRowTemplate, parsedModel));
                                            listaCursosExtensaoNovo.push(parsedModel);



                                        }
                                        else {
                                            parsedModel = {
                                                editar: false,
                                                remover: false,
                                                titulo: model.get("nome"),
                                                ativa: model.get("ativa"),
                                                tipo: 'Curso',
                                                classe: 'link-curso text-uppercase',
                                                codigo: (model.get("idCurso5e")) ? " (" + model.get("idCurso5e") + ")" : '',
                                                statusTitulo: null,
                                                statusClasse: "icon-caret-right text-blue-light",
                                                nivel: model.get("siglaCursoNivel") ? model.get("siglaCursoNivel") + " - " : "",
                                                idSalaVirtualOfertaAproveitamento: null,
                                                ofertaAgrupamento: '',
                                                usuarioInscrito: null,
                                                idEscola: idEscola,
                                                idCurso: model.get("idCurso"),
                                                cIdCurso: model.get("cIdCurso"),
                                                idSalaVirtual: 0,
                                                idSalaVirtualOferta: 0,
                                                descricao: '',
                                                infoCurso: true,
                                                exibirDatas: false,
                                                dataInicio: null,
                                                dataFim: null,
                                                coordenacao: coordenacao,
                                                extensao: extensao,
                                                financeiro: financeiro,
                                                portal: portal,
                                                codigoItemAX: codigoItemAX,
                                                importarPlanilha: false
                                            }

                                            html2.append(_.template(nestedRowTemplate, parsedModel));
                                        }

                                    });
                                    if ($('#tableCursoEscola1').html() == '') {
                                        $('#tableCursoEscola1').append('<td style="width:72%">Nenhum curso localizado.</td><td></td><td></td><td></td><td></td>');
                                    }
                                    $(".EditarCurso, .InfoCurso, .EditarSalaExtensao").on("click", function (e) {
                                  
                                        var el = $(e.currentTarget);
                                        var idescola = el.data("idescola");
                                        var idCurso = el.data("idcurso");
                                        idCursoExtensao = idCurso;
                                        self.setLastOpened(idEscola, 0, 0);
                                     
                                    });
                                }
                                else {
                                    //resposta vazia
                                    self.renderEmptyCurso(idEscola, idEscolaTipo);
                                }
                            },
                            error: function () {
                                //resposta vazia
                                self.renderEmptyCurso(idEscola, idEscolaTipo);
                            }

                        }).done(function () {
                            //seta focus no 1º curso (necessário para navegacao com tab)
                            if (self.permiteFocus)
                                $("#home-listar-cursos #divCursoEscola_" + idEscola + " a:first").focus();
                        });
                    });
            }
        },

        //busca ultimo Escola para renderizar cursos quando for extensão
        renderLastOpenedEscolaFormacao: function renderLastOpenedEscolaExtensao(idEscola, idEscolaTipo, $el) {
            $("#home-listar-cursos .divCursosEscola").hide();
           
            var self = this;

            if ($("#home-listar-cursos #divCursoEscola_" + idEscola).length > 0) {
                $("#home-listar-cursos #divCursoEscola_" + idEscola).show();
            }
            else {
                $("#home-listar-cursos").append($("<div>").attr('id', "divCursoEscola_" + idEscola).addClass("divCursosEscola"));
                $("#home-listar-cursos #divCursoEscola_" + idEscola).html();

                $.when(collectionLoader.get('Cursos'),
                        templateLoader.get('home-accordion-extensao-template.html')
                    ).then(function (SvEntity, nestedRowTemplate) {
                        var historico = false;
                        var url = null;
                        switch (idEscolaTipo) {
                            case idEscolaTipoFiltroHistorico:
                                url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=false&cache=' +new Date().getTime();
                                historico = true;
                                break;
                            case idEscolaTipoFiltroMeusCursos:
                                url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=true&cache=' + new Date().getTime();
                                break;
                            case idEscolaTipoFiltroEscolas:
                            default:
                                url = App.config.UrlWs('sistema') + 'Curso/' + idEscola + '/EscolaUsuario/false/?emCurso=true&cache=' + new Date().getTime();
                                break;
                        }

                        var collection = new SvEntity({ url: url });
                        collection.fetch({
                            success: function (response) {

                                var editar = false;

                                if (response.models.length) {
                                    var html = $('#home-listar-cursos #divCursoEscola_' + idEscola);
                                    html.append('<table id="idTabelaExtensaoNovo" class="table table-hover table-striped uninter-grid list clickable"><thead>' +
                                            '<th style="width:86%;">NOME DO CURSO</th>' +
                                            '<th style="text-align:center;width:7%;">EDITAR</th>' +
                                            '<th style="text-align:center;width:7%;">INFORMAÇÕES</th>' +
                                            '</thead><tbody id="tableCursoEscola3" ></tbody></table>'

                                            )

                                    var html1 = $('#home-listar-cursos #divCursoEscola_' + idEscola).find('#tableCursoEscola3');

                                    var permissao = UNINTER.Helpers.Auth.getAreaPermsMetodo("Curso").toString();
                                    if (permissao.match('editar')) {
                                        editar = true;
                                    }
                                    _.each(response.models, function (model) {
                                        var parsedModel,
                                            nestedRowView,
                                            nestedRowViewEl;


                                        var statusFluxoVenda = model.get("idSituacaoVenda");
                                        var coordenacao = null;
                                        var extensao = null;
                                        var financeiro = null;
                                        var portal = null;

                                       
                                            parsedModel = {
                                                editar: editar,
                                                remover: false,
                                                titulo: model.get("nome"),
                                                ativa: model.get("ativa"),
                                                tipo: 'Curso',
                                                classe: 'link-curso text-uppercase',
                                                codigo: (model.get("idCurso5e")) ? " (" + model.get("idCurso5e") + ")" : '',
                                                statusTitulo: null,
                                                statusClasse: "icon-caret-right text-blue-light",
                                                nivel: model.get("siglaCursoNivel") ? model.get("siglaCursoNivel") + " - " : "",
                                                idSalaVirtualOfertaAproveitamento: null,
                                                ofertaAgrupamento: '',
                                                usuarioInscrito: null,
                                                idEscola: idEscola,
                                                idCurso: model.get("idCurso"),
                                                cIdCurso: model.get("cIdCurso"),
                                                idSalaVirtual: 0,
                                                idSalaVirtualOferta: 0,
                                                descricao: '',
                                                infoCurso: true,
                                                exibirDatas: false,
                                                dataInicio: null,
                                                dataFim: null,
                                                coordenacao: coordenacao,
                                                extensao: extensao,
                                                financeiro: financeiro,
                                                portal: portal,
                                                codigoItemAX: null,
                                                importarPlanilha: false
                                            }
                                            html1.append(_.template(nestedRowTemplate, parsedModel));
                                            listaCursosExtensaoNovo.push(parsedModel);

                                    });
                                    if ($('#tableCursoEscola1').html() == '') {
                                        $('#tableCursoEscola1').append('<td style="width:72%">Nenhum curso localizado.</td><td></td><td></td><td></td><td></td>');
                                    }
                                    $(".EditarCurso, .InfoCurso, .EditarSalaExtensao").on("click", function (e) {
                                  
                                        var el = $(e.currentTarget);
                                        var idescola = el.data("idescola");
                                        var idCurso = el.data("idcurso");
                                        idCursoExtensao = idCurso;
                                        self.setLastOpened(idEscola, 0, 0);
                                     
                                    });
                                }
                                else {
                                    //resposta vazia
                                    self.renderEmptyCurso(idEscola, idEscolaTipo);
                                }
                            },
                            error: function () {
                                //resposta vazia
                                self.renderEmptyCurso(idEscola, idEscolaTipo);
                            }

                        }).done(function () {
                            //seta focus no 1º curso (necessário para navegacao com tab)
                            if (self.permiteFocus)
                                $("#home-listar-cursos #divCursoEscola_" + idEscola + " a:first").focus();
                        });
                    });
            }
        },

        //pega primeira escola da lista
        getFirstEscola: function getFirstEscola() {
            var elemento = $('#navbar-avahome .navbar-nav').find('li:first a');
            if (elemento.length == 0) elemento = null;
            return elemento;
        },
        //pega escola ativa
        getEscolaAtiva: function getEscolaAtiva() {
            var elemento = $('#navbar-avahome .navbar-nav').find('li.active:first a');
            if (elemento.length == 0) elemento = null;
            return elemento;
        },
        //pega id da Escola ativa
        getIdEscolaAtiva: function getIdEscolaAtiva() {
            var idEscola;
            var objEscola = $('#navbar-avahome .navbar-nav').find('li.active:first a');
            if (objEscola.length == 0) idEscola = null;
            else idEscola = objEscola.prop('id').replace('escola_', '');
            return idEscola ;
        },
        //busca elemento da escola
        findEscola: function findEscola(idEscola) {
            var elemento = $('#navbar-avahome .navbar-nav').find("a#escola_" + idEscola + ":first");
            if (elemento.length == 0) elemento = null;
            return elemento;
        },
        findEscolaByTipo: function findEscola(idEscolaTipo) {
            var elemento = $('#navbar-avahome .navbar-nav').find("a[data-idescolatipo=" + idEscolaTipo + "]:first");
            if (elemento.length == 0) elemento = null;
            return elemento;
        },
        //renderiza breadcrumb de escolas/curso
        renderBreadcrumb: function (breadItem) {
            $("#breadcrumb-home").empty();
            if (breadItem) {
                var breadcrumbView = new BreadcrumbView({
                    breadcrumbItems: breadItem
                });
                var breadcrumbViewEl = breadcrumbView.render().$el;
                $("#breadcrumb-home").html(breadcrumbViewEl);
            }
        },
        //renderiza abas de escolas
        renderEscolas: function () {            
            var self = this, collection;
            $.when(
               collectionLoader.get('Escolas')
               
               ,templateLoader.get('home-navbar-template.html')
           ).then(function (EscolasEntity, escolaTemplate) {
               
               var template = _.template(escolaTemplate);
               self.$el.html(template());

               //adiciona actions (criacao de sala e pesquisa)               
               var actions = new ActionsItemView({ 'areaPerms': self.areaPerms, 'areaName': 'salavirtual' });
               var actionsEl = actions.render().$el;
               $("#actionbar-home #group-action").html(actionsEl);

               if (App.session.get('escolasUsuario') == null ) {
                   

                   // se tiver perfil de tutor, faz busca em escolas, senao, pega escola fixa
                   if (arrPerfisTutor.length > 0) {

                       //carrega escolas
                       var urlEscolas = App.config.UrlWs('sistema') + 'Escola/0/Usuario';
                       collection = new EscolasEntity({ url: urlEscolas });

                       collection.fetch({

                           success: function success(response) {
                               if (response.models.length) {
                                   var responseEscola = self.montarArrayAbas(response.models);
                                   self.renderTemplateEscola(responseEscola);

                               }
                               // Resposta vazia
                               else {
                                   self.renderEmptyEscola();
                               }
                           },
                           error: function () {
                               // Resposta vazia
                               //self.renderEmptyEscola();

                               var responseEscola = self.montarArrayAbas(null);
                               self.renderTemplateEscola(responseEscola);

                           }
                       });
                   }
                   else {
                        var responseEscola = self.montarArrayAbas(null);
                        self.renderTemplateEscola(responseEscola);
                   }
                   
               }
               else{     
					console.info("BUSCA DA SESSAO");              
                   var escolaUsuario = _.clone(App.session.get('escolasUsuario'));
                   
                   
                   
                   self.renderTemplateEscola( escolaUsuario);
               }
               
                   
                   
           }).done(function () {

               //insere focus na 1º escola
               setTimeout(function () {
                   self.permiteFocus = true;
                   $("#navbar-avahome #navbarEscolas li:first").focus();
               }, 3000);
           });
        },

        renderTemplateRecentes: function (accordionItem, visivel, irProximaEscola) {
            var self = this,
                idEscola = accordionItem.prop('id').replace('escola_', '');
            
           if ($("#home-listar-cursos #divCursoEscola_" + idEscola).length > 0) {
               /*$("#home-listar-cursos #divCursoEscola_" + idEscola).show();*/
               $("#home-listar-cursos #divCursoEscola_" + idEscola).remove();

            }
            /*else {*/

                $("#home-listar-cursos").append($("<div>").attr('id', "divCursoEscola_" + idEscola).addClass("divCursosEscola"));
                if (visivel)
                    $("#home-listar-cursos #divCursoEscola_" + idEscola).show();
                else
                    $("#home-listar-cursos #divCursoEscola_" + idEscola).hide();

                $.when(
                    collectionLoader.get('UsuarioHistoricoCursoOfertas'),
                    templateLoader.get('home-navbar-nested-row-template.html')
                ).then(function (SvEntity, nestedRowTemplate) {

                    var validarPermissao = ($(".link-escola[data-idescolatipo=2]").length == 0) ? false : true;
                    var collection = new SvEntity({ url: App.config.UrlWs('sistema') + 'UsuarioHistoricoCursoOferta/' + validarPermissao + '/Usuario/?cache=' + new Date().getTime() });

                    collection.fetch({                        
                        success: function (response) {

                            if (response.models.length) {
                                
                                $("#home-listar-cursos #divCursoEscola_" + idEscola).html("<ul class='un-accordion child'></ul>");
                                
                                _.each(response.models, function (model) {
                                    var parsedModel,
                                        nestedRowView,
                                        nestedRowViewEl;

                                    var acoes = model.get("acoes");
                                    var editar = false,
                                        remover = false,
                                        usuarioInscrito = model.get("usuarioInscrito"),
                                        ofertaAgrupamento = '';
                                    //verifica acoes PUT DELETE
                                    if (acoes) {
                                        if (acoes.indexOf(7) > -1) editar = true;
                                        if (acoes.indexOf(9) > -1) remover = true;
                                    }
                                    
                                    if (usuarioInscrito == 0) {
                                        if (model.get("idSalaVirtualOfertaPai") > 0) {                                            
                                            var span = $(iconeOfertaFilha).clone();

                                            if (model.get("codigoOfertaPai") > 0) {
                                                var title = span.prop("title");
                                                span.prop("title", title + " à oferta " + model.get("codigoOfertaPai"));
                                            }
                                            var div = $("<div>").html(span);

                                            ofertaAgrupamento = div.html();
                                            
                                        }
                                        else if (model.get("totalFilhas") > 0 && model.get("idMultidisciplinar") > 0) {
                                            ofertaAgrupamento = iconeOfertaMasterInterdisciplinar;
                                        }
                                        else if (model.get("totalFilhas") > 0) {
                                            ofertaAgrupamento = iconeOfertaMaster;
                                        }
                                    }

                                    var classe = 'link-disciplina';
                                    if (model.get("idCursoNivel") == idCursoNivelExterno)
                                        classe = 'link-disciplinaExterna';                                        
                                    
                                    /*Verifica se o usuário tem permissão de adicionar ofertas favoritas*/
                                    var favoritosClasse = '';
                                    
                                    var manterRegistro = model.get("manterRegistro");
                             
                                    if (permissaoFavoritos.match('editar')) {
                                        if (manterRegistro == true) {
                                            favoritosClasse = 'icon-star';
                                        }
                                        else {
                                            favoritosClasse = 'icon-star-o';
                                        }
                                    }
                                    else {
                                        favoritosClasse = '';
                                    }


                                    var sigla = model.get("siglaCursoNivel") ? model.get("siglaCursoNivel") + " - " : "";
                                    parsedModel = {
                                        editar: editar,
                                        remover: remover,
                                        titulo: model.get("nomeSalaVirtual") ? model.get("nomeSalaVirtual") : "Sem título",
                                        ativa: model.get("ativa"),
                                        tipo: 'Disciplina',
                                        classe: classe,
                                        codigo: (model.get("codigoOferta")) ? " (" + model.get("codigoOferta") + ")" : '',
                                        codigoItemAX: (model.get("codigoItemAX")) ?  model.get("codigoItemAX") : '',
                                        statusClasse: 'icon-circle text-primary',
                                        statusTitulo: '',
                                        idEscola: model.get("idEscola"),
                                        idCurso: model.get("idCurso"),
                                        idCursoNivel: (model.get("idCursoNivel")) ? model.get("idCursoNivel") : '',
                                        idSalaVirtual: model.get("idSalaVirtual"),
                                        idSalaVirtualOferta: model.get("idSalaVirtualOferta"),
                                        cIdSalaVirtual: model.get("cId"),
                                        cIdSalaVirtualOferta: model.get("cIdSalaVirtualOferta"),
                                        idSalaVirtualOfertaAproveitamento: model.get("idSalaVirtualOfertaAproveitamento"),
                                        ofertaAgrupamento: ofertaAgrupamento,
                                        usuarioInscrito: usuarioInscrito,
                                        descricao: sigla + model.get("nomeCurso"),                                        
                                        infoCurso: false,
                                        exibirDatas: false,
                                        dataInicio: null,
                                        dataFim: null,
                                        nivel: null,
                                        importarPlanilha: false,
                                        exibirPendencias: usuarioInscrito,
                                        pendencias: 0,
                                        idUsuarioSalaVirtualOferta: model.get('idUsuarioSalaVirtualOferta'),
                                        nomeTipoSituacao: model.get("nomeTipoSituacao") ? model.get("nomeTipoSituacao") : '',
                                        idUsuarioCurso: model.get("idUsuarioCurso"),
                                        nomeTurma: model.get("turma") ? model.get("turma") : '',
                                        idAssinaturaContratoStatus: model.get("idAssinaturaContratoStatus"),
                                        cursoTemContrato: model.get("temContrato"),
                                        idCurso5e: model.get("idCurso5e"),
                                        cdAluno: model.get("cdAluno"),
                                        favoritosClasse: favoritosClasse,
                                        favoritosTitulo: 'Clique para marcar como oferta favorita.',
                                        idUsuarioHistoricoCursoOferta: model.get("id"),
                                        manterRegistro: manterRegistro,
                                        disciplinaIsolada: model.get('isolada')

                                    };

                                    nestedRowView = new DisciplinasView({ 'model': model, 'id': 'salavirtual_' + model.id, 'template': nestedRowTemplate });
                                    nestedRowViewEl = nestedRowView.render(parsedModel).$el;

                                    $('#home-listar-cursos #divCursoEscola_' + idEscola).find('.un-accordion.child').append(nestedRowViewEl);

                                });
                            }
                            else {
                                self.renderEmptyRecentes(accordionItem, irProximaEscola);
                            }
                        },
                        error: function () {
                            
                            self.renderEmptyRecentes(accordionItem, irProximaEscola);
                        }
                    }).done(function () {
                        $("#navbar-avahome").fadeIn('slow');
                        if (self.permiteFocus)
                            $("#home-listar-cursos #divCursoEscola_" + idEscola + " a:first").focus();
                    });
                });
           /* }*/
        },

        renderTemplateEscola: function (responseEscola) {
            var self = this;
            
            var html = self.$el.find('#navbarEscolas')

            var parsedModel,
                    nestedRowView,
                    nestedRowViewEl;
            
            if (responseEscola.length) {
                _.each(responseEscola, function (model) {                                        

                    parsedModel = {
                        'nomeCompleto': model.nome,
                        'nome': model.nomeSimplificado,
                        'classe': model.classe,
                        'id': model.id,
                        'idEscolaTipo': model.idEscolaTipo,
                        'icone': model.icone
                    };
                    
                    nestedRowView = new EscolasView({'id': 'liEscola_' + model.id });
                    nestedRowViewEl = nestedRowView.render(parsedModel).$el;
                    html.append(nestedRowViewEl);
                });
            }
            
            var elemento = self.getFirstEscola();
            
            //verifica se tem ultimo curso acessado
            var lastOpened = self.getLastOpened();
            var somenteAluno = false;
            var abrirRecente = false;
                       

            if (lastOpened) {
                var elementoUltimaEscola = self.findEscola(lastOpened.idEscola);

                if (elementoUltimaEscola) {
                    elemento = elementoUltimaEscola;
                    abrirRecente = true;
                }
                else self.clearLastOpened();
            }
            
            try {                
                if (!abrirRecente) {
                    
                     
                    
                    if (arrPerfisTutor.length > 0) {
                        
                        var elementoRecentes = self.findEscolaByTipo(idEscolaTipoFiltroRecentes);

                        if (elementoRecentes) {
                            elemento = elementoRecentes;
                            //somenteAluno = true;
                        }
                    }
                }
            }
            catch (e) { console.warn('nao foi possivel localizar perfil');}
            self.openEscola(elemento);
            /*
            if (somenteAluno) {
                var elementoRecentes = self.findEscolaByTipo(idEscolaTipoFiltroRecentes);
                if (elementoRecentes) {
                    self.renderTemplateRecentes(elementoRecentes, false, false);
                }
            }*/
        },
        montarArrayAbas: function (objetoEscola) {
            var arrayRetorno = []; 

            //aba Meus cursos
            arrayRetorno.push({
                'nome': "Meus cursos",
                'nomeSimplificado': "Meus cursos",
                'classe': "link-escola-meus-cursos",
                'id': 9,
                'idEscolaTipo': 3,
                'icone': "icon-graduate-hat"
            });

            //aba recentes
            arrayRetorno.push({
                'nome': "Disciplinas Recentes",
                'nomeSimplificado': "Recentes",
                'classe': null,
                'id': 8,
                'idEscolaTipo': 1,
                'icone': "icon-clock-o"
            });

            if (objetoEscola) {                
                $(objetoEscola).map(function (k, item) {                    
                    if(item.attributes.idEscolaTipo != 3 && item.attributes.idEscolaTipo != 1 && item.attributes.idEscolaTipo != 4)
                    arrayRetorno.push(item.attributes);
                });
            }

            //aba historico
            arrayRetorno.push({
                'nome': "Histórico de Cursos",
                'nomeSimplificado': "Histórico",
                'classe': null,
                'id': 10,
                'idEscolaTipo': 4,
                'icone': null
            });
            

            

            App.session.set('escolasUsuario', arrayRetorno);
            return arrayRetorno;
        },
        //renderiza lista de cursos
        renderCursos: function ($el) {            
            $("#home-listar-cursos .divCursosEscola").hide();
            //adiciona actions (criacao de sala e pesquisa)          

            var self = this,
                accordionItem = $el,
                idEscola = accordionItem.prop('id').replace('escola_', ''),
                idEscolaTipo = accordionItem.data('idescolatipo');

            //$(".actions").html('<a title="cadastrar" href="#/ava/salavirtual/0/novo"><i class="icon-plus-circle"></i></a><a title="pesquisar" class="sv-adm-action-search" href="javascript: void(0)"><i class="icon-search"></i></a>');

            if (idEscola == idEscolaExtensao) {
                if ($('#main-content').attr("class") == 'three-columns'  ){
                    $('#expander').trigger("click");
                }
                this.renderCursosExtensao($el);
                return;
            }
            else if (idEscola == idEscolaFormacao) {
                if ($('#main-content').attr("class") == 'three-columns') {
                    $('#expander').trigger("click");
                }
                this.renderCursosFormacao($el);
                return;
            }
            else $('#main-content').attr("class", "three-columns")
            
            if ($("#home-listar-cursos #divCursoEscola_" + idEscola).length > 0) {
                $("#home-listar-cursos #divCursoEscola_" + idEscola).show();
            }
            else {
                $("#home-listar-cursos").append($("<div>").attr('id', "divCursoEscola_" + idEscola).addClass("divCursosEscola"));
                $("#home-listar-cursos #divCursoEscola_" + idEscola).html("<ul class='un-accordion child'></ul>");

                $.when(
                    collectionLoader.get('Cursos'),
                    templateLoader.get('home-navbar-nested-row-template.html')
                ).then(function (SvEntity, nestedRowTemplate) {

                    var historico = false;
                    var url = null;
                    switch (idEscolaTipo) {
                        case idEscolaTipoFiltroHistorico:
                            url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=false&cache=' + new Date().getTime();
                            historico = true;
                            break;
                        case idEscolaTipoFiltroMeusCursos:
                            url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=true&cache=' + new Date().getTime();
                            break;
                        case idEscolaTipoFiltroEscolas:
                        default:
                            url = App.config.UrlWs('sistema') + 'Curso/' + idEscola + '/EscolaUsuario/false/?emCurso=true&cache=' + new Date().getTime();
                            break;
                    }

                    var collection = new SvEntity({ url: url });
                    collection.fetch({
                        success: function (response) {
                            
                            var editar = false;
                            if (response.models.length) {
                                var html = $('#home-listar-cursos #divCursoEscola_' + idEscola).find('.un-accordion.child');
                                _.each(response.models, function (model) {
                                  
                                    var parsedModel,
                                        nestedRowView,
                                        nestedRowViewEl;
                                    var codigoItemAX = model.get("codigoItemAX");

                               
                                       /* parsedModel = {
                                            editar: false,
                                            remover: false,
                                            titulo: model.get("nome"),
                                            ativa: model.get("ativa"),
                                            tipo: 'Curso',
                                            classe: 'link-curso text-uppercase',
                                            codigo: (model.get("idCurso5e")) ? " (" + model.get("idCurso5e") + ")" : '',
                                            statusTitulo: null,
                                            statusClasse: "icon-caret-right text-blue-light",
                                            nivel: model.get("siglaCursoNivel") ? model.get("siglaCursoNivel") + " - " : "",
                                            idSalaVirtualOfertaAproveitamento: null,
                                            ofertaAgrupamento: '',
                                            usuarioInscrito: null,
                                            idEscola: idEscola,
                                            idCurso: model.get("idCurso"),
                                            idSalaVirtual: 0,
                                            idSalaVirtualOferta: 0,
                                            descricao: '',
                                            infoCurso: true,
                                            exibirDatas: false,
                                            dataInicio: null,
                                            dataFim: null,
                                            recorrencia: null,
                                            codigoItemAX: codigoItemAX
                                        };*/

                                      
                                    parsedModel = {
                                        editar: false,
                                        remover: false,
                                        titulo: model.get("nome"),
                                        ativa: model.get("ativa"),
                                        tipo: 'Curso',
                                        classe: 'link-curso text-uppercase',
                                        codigo: (model.get("idCurso5e")) ? " (" + model.get("idCurso5e") + ")" : '',
                                        statusTitulo: null,
                                        statusClasse: "icon-caret-right text-blue-light",
                                        nivel: model.get("siglaCursoNivel") ? model.get("siglaCursoNivel") + " - " : "",
                                        idSalaVirtualOfertaAproveitamento: null,
                                        ofertaAgrupamento: '',
                                        usuarioInscrito: null,
                                        idEscola: idEscola,
                                        idCurso: model.get("idCurso"),
                                        cIdCurso: model.get("cIdCurso"),
                                        idCursoNivel: (model.get("idCursoNivel")) ? model.get("idCursoNivel") : '',
                                        idSalaVirtual: 0,
                                        idSalaVirtualOferta: 0,
                                        descricao: '',
                                        infoCurso: true,
                                        exibirDatas: false,
                                        dataInicio: null,
                                        dataFim: null,
                                        recorrencia: null,
                                        codigoItemAX: codigoItemAX,
                                        importarPlanilha: false,
                                        exibirPendencias: false,
                                        pendencias: 0,
                                        idUsuarioSalaVirtualOferta: 0,
                                        nomeTipoSituacao: model.get("nomeTipoSituacao") ? model.get("nomeTipoSituacao") : '',
                                        idUsuarioCurso: model.get("idUsuarioCurso"),
                                        nomeTurma: model.get("turma") ? model.get("turma") : '',
                                        idAssinaturaContratoStatus: model.get("idAssinaturaContratoStatus"),
                                        cursoTemContrato: model.get("temContrato"),
                                        idCurso5e: model.get("idCurso5e"),
                                        cdAluno: model.get("cdAluno"),
                                        favoritosClasse: '',
                                        favoritosTitulo: '',
                                        idUsuarioHistoricoCursoOferta: '',
                                        manterRegistro: '',
                                        disciplinaIsolada: model.get("isolada")
                                    };

                                    model.set('idEscola', idEscola);

                                    nestedRowView = new DisciplinasView({ 'model': model, 'id': 'curso_' + parsedModel.idCurso, 'template': nestedRowTemplate });
                                    nestedRowViewEl = nestedRowView.render(parsedModel).$el;
                                    html.append(nestedRowViewEl);


                                });
                                $(" .EditarCurso, .InfoCurso").on("click", function (e) {
                                    
                                    var el = $(e.currentTarget);
                                    var idescola = el.data("idescola");
                                    var idCurso = el.data("idcurso");
                                    idCursoExtensao = idCurso;
                                    self.setLastOpened(idEscola, idCurso, 0);

                                });

                                self.alunoOptanteLogistica(response.models);

                            }
                            else {
                                //resposta vazia
                                self.renderEmptyCurso(idEscola, idEscolaTipo);
                            }
                        },
                        error: function () {
                            //resposta vazia
                            self.renderEmptyCurso(idEscola, idEscolaTipo);
                        }

                    }).done(function () {
                        //seta focus no 1º curso (necessário para navegacao com tab)
                        if (self.permiteFocus)
                            $("#home-listar-cursos #divCursoEscola_" + idEscola + " a:first").focus();

                        jQuery(".enviarHistoricoBtn").off('click').on('click', function (e) {

                            UNINTER.Helpers.showModal({
                                //size: "modal-sm",
                                body: 'Deseja mover este item para o Histórico?',
                                title: null,
                                buttons: [{
                                    'type': "button",
                                    'klass': "btn btn-primary",
                                    'text': "Ok",
                                    'dismiss': null,
                                    'id': 'modal-ok',
                                    'onClick': function (event, jQModalElement) {

                                        var idUsuarioCurso = jQuery(e.currentTarget).data('idusuariocurso');

                                        var url = App.config.UrlWs('sistema') + 'UsuarioCurso/' + idUsuarioCurso + '/MoverHistorico/true/?cache=' + new Date().getTime();

                                        var opcoes = {
                                            url: url,
                                            type: "PUT",
                                            async: false,
                                            data: {}
                                        };

                                        var retorno = UNINTER.Helpers.ajaxRequest(opcoes);
                                        console.log(retorno);

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
                    });
                });
            }
        },

        alunoOptanteLogistica: function (cursos) {

            var userStorage = App.StorageWrap.getItem('user');

            if (userStorage == null || userStorage.RU == null || userStorage.RU == "") {
                return;
            }

            //se já apareceu hoje não mostra mais:
            var jaExibiu = App.session.get('logistica');

            if (jaExibiu == true || jaExibiu == 'true') {
                return;
            }

            App.session.set('logistica', true);

            var AlterarOpcaoAluno = function (item, tipo, jModalElement) {

                $('.modal-footer .btn').hide();
                $('.modal-footer').append('<div class="alert alert-warning">Aguarde enquanto salvamos a opção selecionada.</div>');

                item.idCalendarioAcademicoModuloTipoConfirmacaoLogistica = tipo;
                item.id = item.idCalendarioAcademicoModuloConfirmacaoLogistica

                UNINTER.Helpers.ajaxRequest({
                    url: UNINTER.AppConfig.UrlWs('academico') + "CalendarioAcademicoModuloConfirmacaoLogistica",
                    type: 'PUT',
                    async: true,
                    data: item,
                    successCallback: function (data) {
                        $('#containerLista').html('');
                        BuscarHistorico();
                        jModalElement.modal('hide');
                    }, errorCallback: function (error) {
                        $('.modal-footer .alert').html('Erro ao salvar a opção selecionada');
                    }
                });

            };

            UNINTER.Helpers.ajaxRequest({
                url: UNINTER.AppConfig.UrlWs('academico') + "CalendarioAcademicoModuloConfirmacaoLogistica/0/vigente",
                async: true,
                successCallback: function (data) {

                    var urlTermo = 'https://univirtuscdn.uninter.com/public/documentos/015.20-PJA-TERMO_RESPONSABILIDADE-ALUNO_OPTANTE_MATERIAL_DIDATICO.pdf';

                    var template = [
                        '<h3 class="text-primary"><%= curso %> (<%= cdAluno %>)</h3>',
                        '<p><small>(Situação atual no curso: <%= nomeTipoSituacao %>)</small></p>',
                        '<p>Hey, a logística já está trabalhando para enviar os livros do módulo <%= modulo %>/<%= ano %> e para isso precisamos saber: Você deseja continuar recebendo seus livros físicos, ou prefere estudar pelos livros digitais?</p>',
                        '<p>Lembre-se: optando pelo livro digital, além da praticidade, você contribui com o meio ambiente!</p>',
                        '<iframe width="100%" src="<%= url %>" style="height: 58vh"></iframe>'
                    ];

                    $(cursos).each(function (i, model) {

                        var cdAluno = model.get("cdAluno");

                        var historico = _.findWhere(data.calendarioAcademicoModuloConfirmacoesLogistica, { cdAluno: cdAluno });

                        if (historico == void (0)) {
                            return;
                        }

                        historico.curso = model.get("nome");
                        historico.turma = model.get("turma");
                        historico.nomeTipoSituacao = model.get("nomeTipoSituacao");
                        historico.url = urlTermo;
                        
                        UNINTER.Helpers.showModalAdicionarFila({
                            title: 'Confirmação de envio de livros para Módulo ' + historico.modulo + ' ' + historico.ano,
                            body: _.template(template.join(''), historico),
                            botaoFechar: false,
                            size: 'modal-lg',
                            callback: function () {
                                if (parseInt(userStorage.idUsuarioSimulador) > 0) {
                                    $('.modal-footer').append('<p class="text-danger">Não pode alterar opção simulando aluno</p>');
                                    $('.modal-footer .btn').not('.btn-warning').remove();
                                }
                            },
                            modal: {
                                backdrop: 'static',
                                keyboard: false,
                            },
                            buttons: [{
                                'type': "button",
                                'klass': "btn btn-warning",
                                'text': "lembrar mais tarde",
                                'id': 'btnFechar',
                                'dismiss': 'modal',
                                'onClick': function (ev, jModalElement) {
                                    jModalElement.modal('hide');
                                },
                            }, {
                                'type': "button",
                                'klass': "btn btn-default",
                                'text': "quero livro impresso",
                                'id': 'btnQueroLivro',
                                //'onClose': null,
                                'onClick': function (ev, jModalElement) {
                                    AlterarOpcaoAluno(historico, 2, jModalElement);
                                },
                            }, {
                                'type': "button",
                                'klass': "btn btn-primary",
                                'text': "não quero livro impresso",
                                'id': 'btnNaoQueroLivro',
                                'onClose': null,
                                'onClick': function (ev, jModalElement) {
                                    AlterarOpcaoAluno(historico, 3, jModalElement);
                                }
                            }]
                        });

                    });

                }, errorCallback: function (error) {}
            });

        },

        renderCursosExtensao: function ($el) {
            $("#home-listar-cursos .divCursosEscola").hide();
            
            var self = this,
                accordionItem = $el,
                idEscola = accordionItem.prop('id').replace('escola_', ''),
                idEscolaTipo = accordionItem.data('idescolatipo');
            self.setLastOpened(idEscola, 0, 0);
            if ($("#home-listar-cursos #divCursoEscola_" + idEscola).length > 0) {
                $("#home-listar-cursos #divCursoEscola_" + idEscola).show();
            }
            else {
                $("#home-listar-cursos").append($("<div>").attr('id', "divCursoEscola_" + idEscola).addClass("divCursosEscola"));
                $("#home-listar-cursos #divCursoEscola_" + idEscola).html();

                $.when( collectionLoader.get('Cursos'),
                        templateLoader.get('home-accordion-extensao-template.html')
                    ).then(function (SvEntity, nestedRowTemplate) {
                        var historico = false;
                        var url = null;
                        switch (idEscolaTipo) {
                            case idEscolaTipoFiltroHistorico:
                                url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=false&cache=' +new Date().getTime();
                                historico = true;
                                break;
                            case idEscolaTipoFiltroMeusCursos:
                                url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=true&cache=' + new Date().getTime();
                                break;
                            case idEscolaTipoFiltroEscolas:
                            default:
                                url = App.config.UrlWs('sistema') + 'Curso/' + idEscola + '/EscolaUsuario/false/?emCurso=true&cache=' + new Date().getTime();
                                break;
                        }

                        var collection = new SvEntity({ url: url });
                        collection.fetch({
                            success: function (response) {

                                var editar = false;
                        
                                if (response.models.length) {
                                    var html = $('#home-listar-cursos #divCursoEscola_' + idEscola);
                                    html.append('<table id="idTabelaExtensaoNovo" class="table table-hover table-striped uninter-grid list clickable"><thead>' +
                                            '<th style="width:72%;">NOME DO CURSO</th>' +
                                            '<th><div class="dropdown" id="divFiltroCoordenacao"><button type="button" id="btnCoordenacao" style="justify-content: center; display: flex;margin:0px;padding-left:0px;border: 0px;background-color: white;color: #666;"' +
                                            'data-toggle="dropdown">ACADEM&nbsp;<i class="icon-filter" style="color:#4270a1" ></i>' +
                                            '</button><ul class="dropdown-menu"  id="uldivFiltroCoordenacao">' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkCoordenacaoAguardando"  checked><span style="text-transform:none;">&nbsp;aguardando</span></input></li>' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkCoordenacaoLiberado" checked><span style="text-transform:none;">&nbsp;liberado</span></input></li></ul></th></div>' +

                                            '<th style="width:7%;"><div class="dropdown" id="divFiltroExtensao"><button type="button" id="btnExtensao" style="justify-content: center; display: flex;margin:0px;padding-left:0px;border: 0px;background-color: white;color: #666;"' +
                                            'data-toggle="dropdown">EXTENSÃO&nbsp;<i class="icon-filter" style="color:#4270a1" ></i>' +
                                            '</button><ul class="dropdown-menu"  id="uldivFiltroExtensao">' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkExtensaoAguardando"  checked><span style="text-transform:none;">&nbsp;aguardando</span></input></li>' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkExtensaoLiberado" checked><span style="text-transform:none;">&nbsp;liberado</span></input></li></ul></th></div>' +
                                            
                                            '<th style="width:7%;"><div class="dropdown" id="divFiltroPortal"><button type="button" id="btnPortal" style="justify-content: center; display: flex;margin:0px;padding-left:0px;border: 0px;background-color: white;color: #666;"' +
                                            'data-toggle="dropdown">PORTAL&nbsp;<i class="icon-filter" style="color:#4270a1" ></i>' +
                                            '</button><ul class="dropdown-menu"  id="uldivFiltroPortal">' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkPortalAguardando" checked><span style="text-transform:none;">&nbsp;aguardando</span></input></li>' +
                                            '<li>&nbsp;&nbsp;<input type="checkbox" value="true" class="checkStatusCurso" id="checkPortalLiberado" checked><span style="text-transform:none;">&nbsp;liberado</span></input></li></ul></th></div>' +
                             
                                            '<th style="text-align:center;width:7%;">EDITAR</th></thead><tbody id="tableCursoEscola1" ></tbody></table>'
                                            
                                            )

                            
                                    html.append('<div id="actionbar-home"><div id="breadcrumb-home">' +
                                        '<ol id="idBreadcrumbExtensaoAntigos" class="breadcrumb" tabindex="-1" style="cursor:pointer;"><li>Extensão (Modelo antigo)</li></ol></div><div class="actions">' +
                                        '<a title="cadastrar" href="#/ava/salavirtual/0/novo" class="EditarSalaExtensao"><i class="icon-plus-circle"></i></a>' +
                                        '<a title="pesquisar" class="sv-adm-action-search" href="javascript: void(0)"><i class="icon-search"></i></a></div>' +
                                        '<table id="idTabelaExtensaoAntigos" class="table table-hover table-striped uninter-grid list clickable"><tbody id="tableCursoEscola2"></tbody></table>')

                                    var html1 = $('#home-listar-cursos #divCursoEscola_' + idEscola).find('#tableCursoEscola1');
                                    var html2 = $('#home-listar-cursos #divCursoEscola_' + idEscola).find('#tableCursoEscola2');

                                    var permissao = UNINTER.Helpers.Auth.getAreaPermsMetodo("Curso").toString();
                                    if (permissao.match('editar')) {
                                        editar = true;
                                    }
                                    _.each(response.models, function (model) {
                                        var parsedModel,
                                            nestedRowView,
                                            nestedRowViewEl;
                                

                                        var statusFluxoVenda = model.get("idSituacaoVenda");
                                        var coordenacao = null;
                                        var extensao = null;
                                        var financeiro = null;
                                        var portal = null;
                                        var codigoItemAX = model.get("codigoItemAX"); 

                                        switch (statusFluxoVenda) {
                                            case 1: //EmCriacaoPeloCoordenador
                                                coordenacao = '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                extensao =    '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                portal =      '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                break;        
                                            case 2: //AguardandoValidacaoPelaExtensao
                                                coordenacao = '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                extensao =    '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                portal =      '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                break;        
                                            case 3: //AguardandoValidacaoPeloFincanceiro
                                                coordenacao = '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                extensao =    '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                portal =      '<i class = "icon-clock-o" style="color:#999;justify-content: center; display: flex;font-size:1.3em;" title = "Aguardando"></i>';
                                                break;         

                                            case 4: //LiberadoParaVenda
                                                coordenacao = '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                extensao =    '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                portal =      '<i class = "icon-check" style="color:green;justify-content: center; display: flex;font-size:1.3em;" title = "Liberado" ></i>';
                                                break;
                                            default:
                                                coordenacao = null;
                                                extensao = null;
                                                portal = null;
                                                break;
                                        }

                                        if (codigoItemAX != null) {
                                            parsedModel = {
                                                editar: editar,
                                                remover: false,
                                                titulo: model.get("nome"),
                                                ativa: model.get("ativa"),
                                                tipo: 'Curso',
                                                classe: 'link-curso text-uppercase',
                                                codigo: (model.get("idCurso5e")) ? " (" + model.get("idCurso5e") + ")" : '',
                                                statusTitulo: null,
                                                statusClasse: "icon-caret-right text-blue-light",
                                                nivel: model.get("siglaCursoNivel") ? model.get("siglaCursoNivel") + " - " : "",
                                                idSalaVirtualOfertaAproveitamento: null,
                                                ofertaAgrupamento: '',
                                                usuarioInscrito: null,
                                                idEscola: idEscola,
                                                idCurso: model.get("idCurso"),
                                                cIdCurso: model.get("cIdCurso"),   
                                                idSalaVirtual: 0,
                                                idSalaVirtualOferta: 0,
                                                descricao: '',
                                                infoCurso: false,
                                                exibirDatas: false,
                                                dataInicio: null,
                                                dataFim: null,
                                                coordenacao: coordenacao,
                                                extensao: extensao,
                                                financeiro: financeiro,
                                                portal: portal,
                                                codigoItemAX: codigoItemAX,
                                                importarPlanilha: false
                                            }
                                            html1.append(_.template(nestedRowTemplate, parsedModel));
                                            listaCursosExtensaoNovo.push(parsedModel);
                                            
                                            
                                    
                                        }
                                        else {
                                            parsedModel = {
                                                editar: false,
                                                remover: false,
                                                titulo: model.get("nome"),
                                                ativa: model.get("ativa"),
                                                tipo: 'Curso',
                                                classe: 'link-curso text-uppercase',
                                                codigo: (model.get("idCurso5e")) ? " (" + model.get("idCurso5e") + ")" : '',
                                                statusTitulo: null,
                                                statusClasse: "icon-caret-right text-blue-light",
                                                nivel: model.get("siglaCursoNivel") ? model.get("siglaCursoNivel") + " - " : "",
                                                idSalaVirtualOfertaAproveitamento: null,
                                                ofertaAgrupamento: '',
                                                usuarioInscrito: null,
                                                idEscola: idEscola,
                                                idCurso: model.get("idCurso"),
                                                cIdCurso: model.get("cIdCurso"),
                                                idSalaVirtual: 0,
                                                idSalaVirtualOferta: 0,
                                                descricao: '',
                                                infoCurso: true,
                                                exibirDatas: false,
                                                dataInicio: null,
                                                dataFim: null,
                                                coordenacao: coordenacao,
                                                extensao: extensao,
                                                financeiro: financeiro,
                                                portal: portal,
                                                codigoItemAX: codigoItemAX,
                                                importarPlanilha: false
                                            }
                                            
                                            html2.append(_.template(nestedRowTemplate, parsedModel));  
                                        }
                                        
                                    });
                                    if ($('#tableCursoEscola1').html() == ''){
                                        $('#tableCursoEscola1').append('<td style="width:72%">Nenhum curso localizado.</td><td></td><td></td><td></td><td></td>');
                                    }
                                    $(".EditarCurso, .InfoCurso, .EditarSalaExtensao").on("click", function (e) {
                                       
                                        var el = $(e.currentTarget);
                                        var idescola = el.data("idescola");
                                        var idCurso = el.data("idcurso");
                                        idCursoExtensao = idCurso;
                                        


                                    });
                                }
                                else {
                                    //resposta vazia
                                    self.renderEmptyCurso(idEscola, idEscolaTipo);
                                }
                            },
                            error: function () {
                                //resposta vazia
                                self.renderEmptyCurso(idEscola, idEscolaTipo);
                            }

                        }).done(function () {
                            //seta focus no 1º curso (necessário para navegacao com tab)
                            if (self.permiteFocus)
                                $("#home-listar-cursos #divCursoEscola_" + idEscola + " a:first").focus();
                        });
                    });
            }
        },

        // Renderiza os cursos de formação continuada 
        renderCursosFormacao: function ($el) {
            $("#home-listar-cursos .divCursosEscola").hide();
           
            var self = this,
                accordionItem = $el,
                idEscola = accordionItem.prop('id').replace('escola_', ''),
                idEscolaTipo = accordionItem.data('idescolatipo');
            self.setLastOpened(idEscola, 0, 0);
            if ($("#home-listar-cursos #divCursoEscola_" + idEscola).length > 0) {
                $("#home-listar-cursos #divCursoEscola_" + idEscola).show();
            }
            else {
                $("#home-listar-cursos").append($("<div>").attr('id', "divCursoEscola_" + idEscola).addClass("divCursosEscola"));
                $("#home-listar-cursos #divCursoEscola_" + idEscola).html();

                $.when( collectionLoader.get('Cursos'),
                        templateLoader.get('home-accordion-extensao-template.html')
                    ).then(function (SvEntity, nestedRowTemplate) {
                        var historico = false;
                        var url = null;
                        switch (idEscolaTipo) {
                            case idEscolaTipoFiltroHistorico:
                                url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=false&cache=' +new Date().getTime();
                                historico = true;
                                break;
                            case idEscolaTipoFiltroMeusCursos:
                                url = App.config.UrlWs('sistema') + 'Curso/0/EscolaUsuario/true/?emCurso=true&cache=' + new Date().getTime();
                                break;
                            case idEscolaTipoFiltroEscolas:
                            default:
                                url = App.config.UrlWs('sistema') + 'Curso/' + idEscola + '/EscolaUsuario/false/?emCurso=true&cache=' + new Date().getTime();
                                break;
                        }

                        var collection = new SvEntity({ url: url });
                        collection.fetch({
                            success: function (response) {

                                var editar = false;
                        
                                if (response.models.length) {
                                    var html = $('#home-listar-cursos #divCursoEscola_' + idEscola);
                                    html.append('<table id="idTabelaExtensaoNovo" class="table table-hover table-striped uninter-grid list clickable"><thead>' +
                                            '<th style="width:86%;">NOME DO CURSO</th><th style="text-align:center;width:7%;">EDITAR</th><th style="text-align:center;width:7%;">INFORMAÇÕES</th>' +
                                            '</thead><tbody id="tableCursoEscola3" ></tbody></table>');  

                                    var html1 = $('#home-listar-cursos #divCursoEscola_' + idEscola).find('#tableCursoEscola3');
                                    /*var html2 = $('#home-listar-cursos #divCursoEscola_' + idEscola).find('#tableCursoEscola2');*/

                                    var permissao = UNINTER.Helpers.Auth.getAreaPermsMetodo("Curso").toString();
                                    if (permissao.match('editar')) {
                                        editar = true;
                                    }
                                    _.each(response.models, function (model) {
                                        var parsedModel,
                                            nestedRowView,
                                            nestedRowViewEl;
                                

                                        var statusFluxoVenda = model.get("idSituacaoVenda");
                                        var coordenacao = null;
                                        var extensao = null;
                                        var financeiro = null;
                                        var portal = null;
                                        var codigoItemAX = model.get("codigoItemAX"); 
                                    

                                        parsedModel = {
                                            editar: editar,
                                            remover: false,
                                            titulo: model.get("nome"),
                                            ativa: model.get("ativa"),
                                            tipo: 'Curso',
                                            classe: 'link-curso text-uppercase',
                                            codigo: (model.get("idCurso5e")) ? " (" + model.get("idCurso5e") + ")" : '',
                                            statusTitulo: null,
                                            statusClasse: "icon-caret-right text-blue-light",
                                            nivel: model.get("siglaCursoNivel") ? model.get("siglaCursoNivel") + " - " : "",
                                            idSalaVirtualOfertaAproveitamento: null,
                                            ofertaAgrupamento: '',
                                            usuarioInscrito: null,
                                            idEscola: idEscola,
                                            idCurso: model.get("idCurso"),
                                            cIdCurso: model.get("cIdCurso"),             
                                            idSalaVirtual: 0,
                                            idSalaVirtualOferta: 0,
                                            descricao: '',
                                            infoCurso: true,
                                            exibirDatas: false,
                                            dataInicio: null,
                                            dataFim: null,
                                            coordenacao: coordenacao,
                                            extensao: extensao,
                                            financeiro: financeiro,
                                            portal: portal,
                                            codigoItemAX: codigoItemAX,
                                            importarPlanilha: false
                                        }
                                        html1.append(_.template(nestedRowTemplate, parsedModel));
                                        listaCursosExtensaoNovo.push(parsedModel);
                                  
                                    });
                                    if ($('#tableCursoEscola3').html() == ''){
                                        $('#tableCursoEscola3').append('<td style="width:72%">Nenhum curso localizado.</td><td></td><td></td><td></td><td></td>');
                                    }
                                    $(".EditarCurso, .InfoCurso, .EditarSalaExtensao").on("click", function (e) {
                                       
                                        var el = $(e.currentTarget);
                                        var idescola = el.data("idescola");
                                        var idCurso = el.data("idcurso");
                                        idCursoExtensao = idCurso;
                                        self.setLastOpened(idEscola, 0, 0);


                                    });
                                }
                                else {
                                    //resposta vazia
                                    self.renderEmptyCurso(idEscola, idEscolaTipo);
                                }
                            },
                            error: function () {
                                //resposta vazia
                                self.renderEmptyCurso(idEscola, idEscolaTipo);
                            }

                        }).done(function () {
                            //seta focus no 1º curso (necessário para navegacao com tab)
                            if (self.permiteFocus)
                                $("#home-listar-cursos #divCursoEscola_" + idEscola + " a:first").focus();
                        });
                    });
            }
        },

        //renderiza disciplinas
        renderDisciplinas: function ($el) {            
            var self = this,
                accordionItem = null;
            
            var idEscola_ = $el.data('idescola')
            var idCurso = null;
            var emCurso = (idEscola_ != 10); //10 = Historico
            var idUsuarioCurso = $el.data('idusuariocurso') != "" ? $el.data('idusuariocurso') : 0;

            if (idEscola_ == idEscolaFormacao) {
                accordionItem = $el.closest('a');
                idCurso = accordionItem.data('idcurso');
            }
            else if (idEscola_ != idEscolaExtensao) {
                accordionItem = $el.closest('li');
                idCurso = accordionItem.prop('id').replace('curso_', '');
            }
            else {
                if (!idCursoExtensao > 0) {
                    accordionItem = $el.closest('tr');

                    idCurso = accordionItem.prop('id').replace('curso_', '');
                }
                else {

                    idCurso = idCursoExtensao;
                }
            }


            $("#home-listar-disciplinas").append("<ul class='un-accordion child'></ul>");
            
            $.when(
                collectionLoader.get('SalasVirtuais'),
                templateLoader.get('home-navbar-nested-row-template.html'),
                templateLoader.get('home-navbar-nested-row-pendencias-template.html')
            ).then(function (SvEntity, nestedRowTemplate, nestedRowPendenciaTemplate) {

                var elementoEscola = self.getEscolaAtiva();
                var idTipoEscola = elementoEscola.data('idescolatipo');

                var usuarioInscrito = true;
                if (idTipoEscola == idEscolaTipoFiltroEscolas)
                    usuarioInscrito = false;

                var url = App.config.UrlWs('ava') + 'SalaVirtual/' + idCurso + '/CursoUsuarioPermissao/' + usuarioInscrito + "/?emCurso=" + emCurso + "&idUsuarioCurso=" + idUsuarioCurso + "&cache=" + new Date().getTime();
                
                var idEscola = self.getIdEscolaAtiva();

                var labelsGrupos = {
                    1: "DISCIPLINAS EM ANDAMENTO (obrigatórias da fase)",
                    2: "DISCIPLINAS EM ANDAMENTO (prazo estendido) <i class='icon-question-circle clickable' data-toggle='tooltip' data-placement='bottom' title='Disciplinas ofertadas em um período maior do que as disciplinas regulares. Atenção para as datas de entrega e avaliações!'></i>",
                    3: "DISCIPLINAS PENDENTES OU FUTURAS",
                    4: "DISCIPLINAS CONCLUÍDAS"
                };

                var fnContinue = function () {
                    self.collection = new SvEntity({ url: url });
                    self.collection.fetch({
                        success: function (response) {

                            if (response.models.length) {
                                var objGroup = _.groupBy(response.models, function (item) {
                                    var statusClasse = 1;
                                    if (item.get('statusConcluido') == false && item.get('ofertaFlexivel')) {
                                        statusClasse = 2;
                                    } else if (item.get('statusConcluido') || item.get('idDisciplinaModuloTipo') == 3) {
                                        statusClasse = 4;
                                    } else if (!item.get('vigente')) {
                                        statusClasse = 3;
                                    }
                                    return statusClasse;
                                });

                                _.each(objGroup, function (_model, label) {
                                    $('#home-listar-disciplinas').find('.un-accordion.child').append("<li class='titulo-status'>" + labelsGrupos[label] + "</li>");
                                    _.each(_model, function (model) {

                                        var parsedModel,
                                            nestedRowView,
                                            nestedRowViewEl,
                                            nestedRowViewPendencias;

                                        //verifica status da disciplina
                                        var classe = 'link-disciplina';

                                        if (model.get("idCursoNivel") == idCursoNivelExterno)
                                            classe = 'link-disciplinaExterna';

                                        var statusClasse = "icon-circle text-primary";
                                        var statusTitulo = "disciplinas vigentes";

                                        if (label == 1) {
                                            statusClasse = 'icon-flag-alt text-blue-light';
                                        }

                                        if (model.get("statusConcluido")) {
                                            classe += " inativo";
                                            statusClasse = "icon-thumbs-o-up text-blue-light";
                                            statusTitulo = "disciplinas concluidas";
                                        }
                                        else if (!model.get("vigente")) {
                                            classe += " inativo";
                                            statusClasse = "icon-circle text-muted";
                                            statusTitulo = "disciplinas anteriores/futuras";
                                        }

                                        //verifica acoes
                                        var acoes = model.get("acoes");
                                        var usuarioInscrito = model.get("usuarioInscrito");
                                        var editar = false,
                                            remover = false,
                                            importacaoPlanilha = false;

                                        if (acoes && !usuarioInscrito) {
                                            if (acoes.indexOf(7) > -1) editar = true; //PUT
                                            if (acoes.indexOf(9) > -1) remover = true; //DELETE
                                        }
                                        var dataInicio = null,
                                            dataFim = null,
                                            ofertaAgrupamento;

                                        if (model.get("idCursoNivel") == idCursoNivelExterno && editar) {
                                            var permissaoImportacao = UNINTER.Helpers.Auth.getAreaPermsMetodo("SalaVirtualImportacao").toString();

                                            if (permissaoImportacao.match('cadastrar')) {
                                                importacaoPlanilha = true;
                                            }
                                        }
                                        //se nao tem permissão de edicao (aluno) mostra
                                        if (label != 2 && model.get("dataInicio")) dataInicio = Helpers.dateTimeFormatter({ dateTime: model.get("dataInicio"), yearFull: false }).date();
                                        if (label != 2 && model.get("dataFim")) dataFim = Helpers.dateTimeFormatter({ dateTime: model.get("dataFim"), yearFull: false }).date();
                                        parsedModel = {
                                            editar: editar,
                                            remover: remover,
                                            titulo: model.get("nome") ? model.get("nome") : "Sem Título",
                                            ativa: model.get("ativa"),
                                            tipo: 'Disciplina',
                                            classe: classe,
                                            codigo: (model.get("codigoOferta") && usuarioInscrito) ? " (" + model.get("codigoOferta") + ")" : '',
                                            statusTitulo: statusTitulo,
                                            statusClasse: statusClasse,
                                            idEscola: idEscola,
                                            idCurso: idCurso,
                                            idCurspNivel: (model.get("idCursoNivel")) ? model.get("idCursoNivel") : '',
                                            idSalaVirtual: model.get("id"),
                                            idSalaVirtualOferta: model.get("idSalaVirtualOfertaAtual"),
                                            cIdSalaVirtual: model.get("cId"),
                                            cIdSalaVirtualOferta: model.get("cIdSalaVirtualOfertaAtual"),
                                            idSalaVirtualOfertaAproveitamento: model.get("idSalaVirtualOfertaAproveitamento"),
                                            ofertaAgrupamento: '',
                                            usuarioInscrito: usuarioInscrito,
                                            descricao: '',
                                            infoCurso: false,
                                            exibirDatas: usuarioInscrito,
                                            dataInicio: dataInicio,
                                            dataFim: dataFim,
                                            nivel: null,
                                            codigoItemAX: null,
                                            importarPlanilha: importacaoPlanilha,
                                            exibirPendencias: usuarioInscrito,
                                            pendencias: parseInt(model.get("pendenciaTotalAvaliacao")) + parseInt(model.get("pendenciaTotalTrabalho")),
                                            idUsuarioSalaVirtualOferta: model.get('idUsuarioSalaVirtualOferta'),
                                            nomeTipoSituacao: model.get("nomeTipoSituacao") ? model.get("nomeTipoSituacao") : '',
                                            idUsuarioCurso: idUsuarioCurso,
                                            classeLabelGradeDisciplinaModuloTipo: model.get('classeLabelGradeDisciplinaModuloTipo'),
                                            descricaoGradeDisciplinaModuloTipo: model.get('descricaoGradeDisciplinaModuloTipo'),
                                            nomeGradeDisciplinaModuloTipo: model.get('nomeGradeDisciplinaModuloTipo'),
                                            nomeTurma: model.get("turma") ? model.get("turma") : '',
                                            idAssinaturaContratoStatus: model.get("idAssinaturaContratoStatus"),
                                            cursoTemContrato: model.get("cursoTemContrato"),
                                            idCurso5e: model.get("idCurso5e"),
                                            cdAluno: model.get("cdAluno"),
                                            idCicloTipo: model.get("idCicloTipo"),
                                            favoritosClasse: '',
                                            favoritosTitulo: '',
                                            idUsuarioHistoricoCursoOferta: '',
                                            manterRegistro: '',
                                            disciplinaIsolada: model.get('isolada')
                                        };

                                        if (model.get('modulo') != null || model.get('modulo') != 'undefined') {
                                            parsedModel.descricao = model.get('modulo');
                                        }

                                        nestedRowView = new DisciplinasView({ 'model': model, 'id': 'disciplina_' + model.id, 'template': nestedRowTemplate });
                                        nestedRowViewEl = nestedRowView.render(parsedModel).$el;

                                        nestedRowViewPendencias = new DisciplinasView({ 'model': model, 'id': 'disciplina_pendencias_' + model.id, 'template': nestedRowPendenciaTemplate, className: 'sv-item un-accordion-item un-accordion-item-block' }).render(parsedModel).$el;
                                        nestedRowViewPendencias.css({ display: 'none' });

                                        $('#home-listar-disciplinas').find('.un-accordion.child').append(nestedRowViewEl).append(nestedRowViewPendencias);
                                    });

                                });
                            }
                            $(".EditarSala").on("click", function (e) {

                                var el = $(e.currentTarget);
                                var idescola = el.data("idescola");
                                var idCurso = el.data("idcurso");
                                idCursoExtensao = idCurso;
                                self.setLastOpened(idEscola, idCurso, idUsuarioCurso);
                            });
                        },
                        error: function () {
                            var string = "<div class='alert alert-info alert-dismissable'>Nenhuma disciplina localizada.</div>";
                            $('#home-listar-disciplinas').html(string);
                        }
                    }).done(function () {
                        //coloca focus na 1º disciplina (navegacao por tab)
                        if (self.permiteFocus) {
                            $("#home-listar-disciplinas a:first").focus();
                        }

                        $('#home-listar-disciplinas').append('<hr><ul id="legenda-disciplina" class="list-unstyled">'
                            + '<li><i class="icon-flag-alt text-blue-light" title="disciplinas vigentes obrigatórias da fase"></i> disciplinas vigentes (obrigatórias da fase)</li>'
                            + '<li><i class="icon-circle text-primary" title="disciplinas vigentes"></i> disciplinas vigentes</li>'
                            + '<li><i class="icon-circle text-muted" ></i> ofertas anteriores/futuras</li>'
                            + '<li><i class="icon-thumbs-o-up text-blue-light"></i> ofertas concluidas</li>'
                            + '</ul>');
                    });
                };
                contratoPendente = false;
                if ($el.data('cursotemcontrato') == true && !(parseInt($el.data('idassinaturacontratostatus')) > 0) && parseInt($el.data('cdaluno')) > 0 && parseInt($el.data('idusuariocurso')) > 0) {
                    UNINTER.Helpers.ajaxRequest({
                        type: 'GET',
                        url: UNINTER.AppConfig.UrlWs('integracao') + "ContratoDigital/" + $el.data('cdaluno') + "/ContratoAssinado/" + $el.data('idcurso5e') + "?idUsuarioCurso=" + $el.data('idusuariocurso'),
                        async: true,
                        successCallback: function (data) {
                            if (data.bloqueado) {
                                contratoPendente = true;
                                var nome = UNINTER.StorageWrap.getItem('user').nome.split(' ')[0];
                                $('#home-listar-disciplinas .un-accordion.child').before('<div class="callout callout-danger">Olá <span class="primeira-letra-maiuscula">' + nome + '</span>, você ainda não assinou o contrato desse curso. Acesse o <a target="_blank" href="https://contratodigital.uninter.com/#/login">portal do contrato digital</a> para assiná-lo digitalmente.</div>');
                            } 
                            fnContinue();
                        },
                        errorCallback: function (erro) {
                            fnContinue();
                        }
                    });
                } else {
                    fnContinue();
                }


            });
        },
        //renderiza disciplinas recentes
        renderRecentes: function ($el) {                        
            var self = this;
            $("#home-listar-cursos .divCursosEscola").hide();
            self.renderTemplateRecentes($el, true, true);
            
            if ($('#main-content').attr("class") != 'three-columns') {
                $('#expander').trigger("click");
            }
            
      
                
        },
        
        //renderiza mensagem de escolas vazias
        renderEmptyEscola: function () {            
            var emptyContainer = $('<div>', { 'id': 'empty' });
            $('#home-listar-cursos').html(emptyContainer);

            var mensagem = "Nenhum curso em andamento localizado."
            
            $('#home-listar-cursos').fadeIn('slow');
            App.flashMessage({
                'body': mensagem,
                'appendTo': '#empty'
            });
        },
        //renderiza mensagem de cursos vazios
        renderEmptyCurso: function (idEscola, idEscolaTipo) {
            
            idEscolaTipoFiltroMeusCursos
            if (idEscolaTipo == idEscolaTipoFiltroHistorico)
                var mensagem = "Nenhum curso localizado no histórico."
            else if (idEscolaTipo == idEscolaTipoFiltroMeusCursos && $(".link-escola[data-idescolatipo=" + idEscolaTipoFiltroHistorico + "]").length > 0)
                var mensagem = "Nenhum curso em andamento localizado. Consulte o histórico para cursos concluidos."
            else
                var mensagem = "Nenhum curso em andamento localizado."
            
            var emptyContainer = '<div class="alert alert-info alert-dismissable" tabindex="0">' + mensagem + '</div>';
            $("#home-listar-cursos #divCursoEscola_" + idEscola).html(emptyContainer).show();

            /*
            if (historico)
                var mensagem = "Nenhum curso localizado no histórico."
            else if($(".link-escola[data-idescolatipo=4]").length > 0)
                var mensagem = "Nenhum curso em andamento localizado. Consulte o histórico para cursos concluidos."
            else
                var mensagem = "Nenhum curso em andamento localizado."
            App.flashMessage({
                'body': mensagem,
                'appendTo': '#empty'
            });*/
        },
        //renderiza mensagem de recentes vazios
        renderEmptyRecentes: function ($el, irProximo) {
            
            var accordionItem = $el,
            idEscola = accordionItem.prop('id').replace('escola_', '');

            $el.closest('li').remove();
            $("#home-listar-cursos #divCursoEscola_" + idEscola).remove();
            $("#breadcrumb-home").empty();


            var element = this.getFirstEscola();
            
            if (element) {
                if(irProximo)
                    this.openEscola(element);
            }
            else this.renderEmptyEscola();
        },

        render: function () {            
            // Mostra o spinner, com a opção de bypass true para controlar manualmente a visualização
            App.loadingView.reveal({ 'bypass': true, 'text': 'Por favor aguarde...' });
            
            var self = this;
            this.renderEscolas();
            self.verificarTermoAceiteDivulgacaoTrabalho();
            var eletivas = new eletivasView({ homeNavbarView: self });
            eletivas.render();
    
            var jaExibiuPopup = App.session.get('jaExibiuPopup');
            
            if (jaExibiuPopup == void(0)) {
                App.Helpers.ajaxRequest({
                    url: App.config.UrlWs('Sistema') + 'Aviso/false/PopupVigente',
                    async: true,
                    successCallback: function (data) {
                        new PopupView({ avisos: data.avisos});
                    }
                });

                App.session.set('jaExibiuPopup', true);
            }

            var jaBuscouDocsPendentes = App.session.get('jaBuscouDocsPendentes');

            if (jaBuscouDocsPendentes == null) {
                this.buscarDocumentosPendentes();

                App.session.set('jaBuscouDocsPendentes', true);
            }

            return this;
        },

        aplicarFiltro: function (e) {
                
                var html1 = $('#home-listar-cursos #divCursoEscola_7').find('#tableCursoEscola1');
                
                var editar = null;
                var self = this;
                var checkCoordenacaoAguardando = $('#checkCoordenacaoAguardando').is(":checked");
                var checkCoordenacaoLiberado = $('#checkCoordenacaoLiberado').is(":checked");

                var checkExtensaoAguardando = $('#checkExtensaoAguardando').is(":checked");
                var checkExtensaoLiberado = $('#checkExtensaoLiberado').is(":checked");

                var checkFinanceiroAguardando = $('#checkFinanceiroAguardando').is(":checked");
                var checkFinanceiroLiberado = $('#checkFinanceiroLiberado').is(":checked");

                var checkPortalAguardando = $('#checkPortalAguardando').is(":checked");
                var checkPortalLiberado = $('#checkPortalLiberado').is(":checked");

                if (checkCoordenacaoAguardando == false || checkCoordenacaoLiberado == false) {
                    $("#btnCoordenacao").find('i').attr("style", "color:#d4130d");
                }
                else {
                    $("#btnCoordenacao").find('i').attr("style", "color:#4270a1");
                }

                if (checkExtensaoAguardando == false || checkExtensaoLiberado == false) {
                    $("#btnExtensao").find('i').attr("style", "color:#d4130d");
                }
                else {
                    $("#btnExtensao").find('i').attr("style", "color:#4270a1");
                }
                if (checkFinanceiroAguardando == false || checkFinanceiroLiberado == false) {
                    $("#btnFinanceiro").find('i').attr("style", "color:#d4130d");
                }
                else {
                    $("#btnFinanceiro").find('i').attr("style", "color:#4270a1");
                }
                if (checkPortalAguardando == false || checkPortalLiberado == false) {
                    $("#btnPortal").find('i').attr("style", "color:#d4130d");
                }
                else {
                    $("#btnPortal").find('i').attr("style", "color:#4270a1");
                }

                $.when( collectionLoader.get('Cursos'),
                    templateLoader.get('home-accordion-extensao-template.html')
                ).then(function (SvEntity, nestedRowTemplate) {
           
                    var permissao = UNINTER.Helpers.Auth.getAreaPermsMetodo("Curso").toString();
                    if (permissao.match('editar')) {
                        editar = true;
                    }
                    html1.html('');
                    _.each(listaCursosExtensaoNovo, function (model) {

                        var parsedModel,
                            nestedRowView,
                            nestedRowViewEl;
                       
                        
                        
                        if (checkCoordenacaoAguardando == false && model.coordenacao.match('Aguardando')) {
                            return;
                        }
                        if (checkCoordenacaoLiberado == false && model.coordenacao.match('Liberado')) {
                            return;
                        }

                        if (checkExtensaoAguardando == false && model.extensao.match('Aguardando')) {
                            return;
                        }
                        if (checkExtensaoLiberado == false && model.extensao.match('Liberado')) {
                            return;
                        }

                       /* if (checkFinanceiroAguardando == false && model.financeiro.match('Aguardando')) {
                            return;
                        }
                        if (checkFinanceiroLiberado == false && model.financeiro.match('Liberado')) {
                            return;
                        }*/

                        if (checkPortalAguardando == false && model.portal.match('Aguardando')) {
                            return;
                        }
                        if (checkPortalLiberado == false && model.portal.match('Liberado')) {
                            return;                                                    
                        }
                       

                        html1.append(_.template(nestedRowTemplate, model));
                        
                    });
                    if ($('#tableCursoEscola1').html() == '') {
                        $('#tableCursoEscola1').append('<td style="width:72%">Nenhum curso localizado.</td><td></td><td></td><td></td><td></td>');
                    }
                });
           },
        verificarTermoAceiteDivulgacaoTrabalho: function(){
                var idUsuario = App.StorageWrap.getItem('user').idUsuario;
                var self = this;
		        var configPerms = {
		            url: App.config.UrlWs('autenticacao') + 'UsuarioBeta/' + idUsuario + '/Usuario?idRotina=4510',
		            async: true,
		            successCallback: function (dataPerms) {
		                self.buscarTermoAceite(2, dataPerms.usuarioBetas[0].id);
		            },
		            errorCallback: function (errorPerms) {		                
		            }
		        };

		        App.Helpers.ajaxRequest(configPerms);
            },
        excluirUsuarioBeta: function(id){
            var idUsuario = App.StorageWrap.getItem('user').idUsuario;
            var self = this;
		    var configPerms = {
		        url: App.config.UrlWs('autenticacao') + 'UsuarioBeta/' + id,
		        async: true, type: "DELETE",
		        successCallback: function (dataPerms) {		                
		        },
		        errorCallback: function (errorPerms) {		                
                    App.flashMessage({
                        'body': 'Não foi possível realizar ação. Tente novamente',                          
                        type: 'danger'
                    });
		        }
		    };

		    App.Helpers.ajaxRequest(configPerms);
        },
        buscarTermoAceite: function(idTermo, idUsuarioBeta){
            var self = this;
            App.Helpers.ajaxRequest({
                type: 'GET',
                url: App.config.UrlWs('integracao') + "TermoAceiteOfertaUsuario/" + idTermo + '/GetByUsuarioTermo',
                async: true,
                successCallback: function (data) {
                        
                },
                errorCallback: function (erro) {
                        
                    if (erro.status == 404) {                        
                        //Backbone.history.navigate("#/ava/termoAceiteOfertaUsuario/" + idSalaVirtualOferta);
                        App.Helpers.showModal({
                            size: "modal-md",
                            body: '<div style="text-align: center; font-size: 1.2em;"><b>TERMO DE AUTORIZAÇÃO</b></div><br>'
                                    + 'Declaro estar ciente e autorizo à <b>CONTRATADA</b> a utilização de imagem e de trabalhos autorais desenvolvidos, vinculados em material produzido tais como: fotos, vídeos, áudio, textos, entre outros, em todos os meios de divulgação possíveis, quer sejam na mídia impressa (livros, catálogos, revista, jornal, entre outros), escrita e falada, Internet, banco de dados informatizados, multimídia, galeria virtual, entre outros, e nos meios de comunicação interna, como, UNIVIRTUS, repositório institucional, jornal e periódicos em geral, na forma de impresso, voz e imagem.'
                                    + '<br><br>A utilização e exposição de imagem e de trabalhos autorais desenvolvidos, que se refere o presente termo, não visa fins lucrativos. ',
                            title: null,
                            buttons: [{
                                'type': "button",
                                'klass': "btn btn-primary",
                                'text': "Aceito",
                                'dismiss': null,
                                'id': 'modal-ok',
                                'onClick': function (event, jQModalElement) {
                                    self.salvarTermoAceiteTrabalho(idTermo);
                                    jQModalElement.modal('hide');
                                }
                            }, {
                                'type': "button",
                                'klass': "btn btn-default",
                                'text': "Não aceito",
                                'dismiss': null,
                                'id': 'modal-cancel',
                                'onClick': function (event, jQModalElement) {
                                    self.excluirUsuarioBeta(idUsuarioBeta);
                                    jQModalElement.modal('hide');
                                }
                            }]
                        });
                    }                        
                }                
            });         
        },
        salvarTermoAceiteTrabalho: function(idTermoAceite){
            UNINTER.Helpers.ajaxRequest({
                type: 'POST',
                url: UNINTER.AppConfig.UrlWs('integracao') + "TermoAceiteOfertaUsuario/0/PostTermoAceiteTrabalho",
                async: true,
                data: {                        
                    idTermoAceite: idTermoAceite,
                    login: App.StorageWrap.getItem('user').login
                },
                successCallback: function (data) {                        
                },
                errorCallback: function (erro) {
                    App.flashMessage({ body: "Não foi possível realizar a ação solicitada. Tente novamente", type: "danger" });
                }
            });
        },
        togglePendencias: function (e) {

            var getExpiracao = function (item) {

                var retorno = {
                    expiracao: 'expira em ',
                    classeLabel: 'label-danger',
                    classeLista: 'list-danger'
                };

                if (
                    (item.diasExpiracao == 0 && item.horasExpiracao == 0 && item.minutosExpiracao == 0) || //Tudo zero já está expirado.
                    (item.diasExpiracao < 0 || item.horasExpiracao < 0 || item.minutosExpiracao < 0) // Negativo também está expirado.
                )
                {
                    retorno.expiracao = 'consulte o período da atividade';
                }

                if (item.diasExpiracao > 0)
                {

                    retorno.expiracao += item.diasExpiracao + ' dias';

                    if (item.diasExpiracao == 1) {
                        retorno.expiracao += item.diasExpiracao + ' dia';
                    }

                    if (item.diasExpiracao > 7) {
                        retorno.classeLabel = 'label-warning';
                        retorno.classeLista = 'list-warning';
                    }

                    if (item.diasExpiracao > 30) {
                        retorno.expiracao = 'expira em ' + Helpers.dateTimeFormatter({ dateTime: item.dataFim, yearFull: false }).date();
                        retorno.classeLista = 'list-oil';
                        retorno.classeLabel = 'label-oil';
                    }


                }
                else if (item.horasExpiracao > 0 )
                {
                    if (item.horasExpiracao == 1) {
                        retorno.expiracao += item.horasExpiracao + ' hora';
                    } else {
                        retorno.expiracao += item.horasExpiracao + ' horas';
                    }
                }
                else if (item.minutosExpiracao > 0)
                { 
                    if (item.minutosExpiracao == 1) {
                        retorno.expiracao += item.minutosExpiracao + ' minuto';
                    } else {
                        retorno.expiracao += item.minutosExpiracao + ' minutos';
                    }
                }
                
                return retorno;
            };

            var tipos = {
                1: { icone: '<i class="icon-checklist-alt"></i>', tipo: 'Avaliação' },
                2: { icone: '<i class="icon-wheelbarrow"></i>', tipo: 'Trabalho'},
                3: { icone: '<i class="icon-wheelbarrow"></i>', tipo: 'Trabalho' }
            };

            var $el = $(e.currentTarget);
            var oferta = $el.data('oferta');
            var idUsuarioSalaVirtualOferta = $el.data('id');

            var $li = $('.containerPendencias[data-oferta="' + oferta + '"]').parent();

            $el.toggleClass('active');

            if ($el.hasClass('active') == true) {
                $el.attr('title', $el.attr('title').replace('exibir', 'fechar'))
            } else {
                $el.attr('title', $el.attr('title').replace('fechar', 'exibir'))
            }

            $li.slideToggle(400, function (e) {

                if ($li.is(':visible') == true) {
                    $li.get(0).focus();
                } else {
                    var proximo = $li.next().get(0);
                    if (proximo != void (0)) {
                        proximo.focus();
                    }
                    
                }
            });

            if ($li.find('.list-group').is(':visible') == true) {
                $li.find('.list-group li:first').get(0).focus();
            } else {

                if ($li.find('[data-container="aguarde"] p').length == 0) {
                    $li.find('[data-container="aguarde"]').fadeOut(300, function () {
                        $li.find('.list-group').fadeIn(400, function () {
                            $li.find('.list-group li:first').get(0).focus();
                        });
                    });

                    return
                }

                $li.find('[data-container="aguarde"] p').get(0).focus();

                var template = '<li tabindex="0" class="list-group-item <%= classeLista %>" title="<%= titleSianee %>"><span class="well-inline"><%= tipo %></span><span class="text-primary"><%= titulo %></span><% if(expiracao != ""){ %><span class="margin-md label label-radius <%= expiracaoClass %>"><%= expiracao %></span><% } %></li>';

                var templateAcessarSala = '<a class="list-group-item list-primary" title="<%= titulo %>" href="<%= href %>"><span class="text-primary"><%= titulo %></span></a>';

                Helpers.ajaxRequest({
                    url: App.config.UrlWs('bqs') + 'PendenciaUsuario/' + idUsuarioSalaVirtualOferta + '/Get/',
                    async: true,
                    successCallback: function (data) {

                        if (data != void (0) && data.pendenciaUsuarios != void (0) && data.pendenciaUsuarios.length > 0)
                        {

                            $(data.pendenciaUsuarios).each(function (i, item) {

                                var objExpiracao = getExpiracao(item);

                                item.titleSianee = tipos[item.idPendenciaTipo].tipo + ': ' + item.titulo + ' - ' + objExpiracao.expiracao;
                                item.expiracao = objExpiracao.expiracao;
                                item.expiracaoClass = objExpiracao.classeLabel;
                                item.classeLista = objExpiracao.classeLista;
                                item.icone = tipos[item.idPendenciaTipo].icone;

                                $li.find('.list-group').append(_.template(template, item));
                            });
                           
                            var $aDisciplina = $el.closest('.sv-item-title').find('.link-disciplina');

                            $li.find('.list-group').append(_.template(templateAcessarSala, {
                                titulo: "Acessar disciplina: " + $aDisciplina.find('.titulo').text(),
                                href: '#/ava/roteiro-de-estudo/' + $aDisciplina.data('cidsalavirtual') + '/' + $aDisciplina.data('cidsalavirtualoferta')
                            }));

                        } else {
                            $li.find('.list-group').append(_.template(template, { titulo: 'Nenhuma pendência localizada.', titleSianee: 'Nenhuma pendência localizada.', expiracao: '', classeLista: 'list-primary', }));
                        }

                        $li.find('[data-container="aguarde"]').fadeOut(300, function () {
                            $li.find('[data-container="aguarde"]').remove();
                            $li.find('.list-group').fadeIn(400, function () {
                                $li.find('.list-group li:first').get(0).focus();
                            });
                        });

                    },
                    errorCallback: function (error) {
                        $li.find('.list-group').append(_.template(template, { titulo: 'Não foi possível consultar as pendências', titleSianee: 'Não foi possível consultar as pendências.', expiracao: '' }));
                    }
                });

                //var url = App.config.UrlWs('ava') + 'SalaVirtual/' + idCurso + '/CursoUsuarioPermissao/' + usuarioInscrito + "/?emCurso=" + emCurso + "&cache=" + new Date().getTime();
                /*
                setTimeout(function () {
                    $li.find('[data-container="aguarde"]').fadeOut(300, function () {
                        $li.find('[data-container="aguarde"]').remove();
                        $li.find('.list-group').fadeIn(400, function () {
                            $li.find('.list-group li:first').get(0).focus();
                        })
                    })
                }, 1500)
                */
            }
        },

        toggleOfertasFavoritas: function (e) {

            var el = $(e.currentTarget);
            var idUsuarioHistoricoCursoOferta = el.data("idusuariohistoricocursooferta") != null ? el.data("idusuariohistoricocursooferta") : 0;
            var idEscola = el.data("idescola") != null ? el.data("idescola") : 0;
            var idCurso = el.data("idcurso") != null ? el.data("idcurso") : 0;
            var idSalaVirtual = el.data("idsalavirtual") != null ? el.data("idsalavirtual") : 0;
            var idSalaVirtualOferta = el.data("idsalavirtualoferta") != null ? el.data("idsalavirtualoferta") : 0;
            var idSalaVirtualOfertaAproveitamento = el.data("idsalavirtualofertaaproveitamento") != null ? el.data("idsalavirtualofertaaproveitamento") : 0;
            var usuarioInscrito = el.data("usuarioinscrito") != null ? el.data("usuarioinscrito") : "false";
            var manterRegistro = el.data("manterregistro") == true ? false : true;
   
            el.data("manterregistro", manterRegistro);
            if (manterRegistro == true) {
                el.children().removeClass('icon-star-o');
                el.children().addClass('icon-star');
            }
            else {
                el.children().removeClass('icon-star');
                el.children().addClass('icon-star-o');
            }
    
            
            
            var dataOfertasFavoritas = {
                id: idUsuarioHistoricoCursoOferta,
                idEscola: idEscola,
                idCurso: idCurso,
                idSalaVirtual: idSalaVirtual,
                idSalaVirtualOferta: idSalaVirtualOferta,
                idSalaVirtualOfertaAproveitamento: idSalaVirtualOfertaAproveitamento,
                usuarioInscrito: usuarioInscrito,
                manterRegistro: manterRegistro,
            }
            var metodo;

            if (dataOfertasFavoritas.id == 0)
            {
                metodo = 'POST';
            }
            else {
                metodo = 'PUT';
            }


            UNINTER.Helpers.ajaxRequest({
                type: metodo,
                data: dataOfertasFavoritas,
                url: UNINTER.AppConfig.UrlWs('sistema') + "UsuarioHistoricoCursoOferta/",
                async: true,
                successCallback: function (data) {
                    if (metodo == 'POST') {
                        el.data("idusuariohistoricocursooferta", data.id)
                    }
                },
                errorCallback: function (erro) {
                    console.error(erro);
                }
            });
        },

        buscarDocumentosPendentes: function () {

            var userStorage = App.StorageWrap.getItem('user');

            if (userStorage == null || userStorage.RU == null || userStorage.RU == "") {
                return;
            }

            UNINTER.Helpers.ajaxRequest({
                type: 'GET',
                url: UNINTER.AppConfig.UrlWs('integracao') + "UsuarioIntegracaoSistemaAcademico/" + userStorage.RU + "/GetDocsPendenteAluno",
                async: true,
                successCallback: function (data) {

                    if (data == null || data.docsPendenteAluno == null || data.docsPendenteAluno.length == 0) {
                        return;
                    }

                    if (data.expressaoIdioma == null) {
                        App.flashMessage({ body: "Não foi possível buscar expressão idioma.", type: "danger" });
                        console.error("Data ou dataExpressaoIdioma nulos.");
                        return;
                    }

                    var documentos = [];

                    jQuery(data.docsPendenteAluno).each(function (i, item) {
                        if (item.documentos == null || item.documentos.length == 0) {
                            return;
                        }

                        documentos = documentos.concat(item.documentos);
                    });

                    var indispensavel = _.some(documentos, function (s) { return s.idTipoDocumento == 1; });

                    var template = data.expressaoIdioma;
                    template = _.template(template, { documentos: documentos, indispensavel: indispensavel });

                    UNINTER.Helpers.showModalAdicionarFila({
                        size: 'modal-lg',
                        title: 'COMUNICADO: PENDÊNCIA DE DOCUMENTOS PARA REGISTROS ACADÊMICOS',
                        body: template,
                        header: true,
                        footer: false,
                        footerContent: '',
                        modal: {
                            backdrop: 'static'
                        },
                        buttons: []
                    });
                },
                errorCallback: function (erro) {
                    App.flashMessage({ body: "Não foi possível buscar os documentos pendentes", type: "danger" });
                    console.error(erro);
                }
            });
        }
    });
});