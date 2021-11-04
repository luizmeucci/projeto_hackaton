UNINTER.inicializar.avaliacaousuariolista = function (_urlListaAvaliacao, _urlRealizacaoProva) {

    $("#viewavaliacaousuariolista #divAvaliacoesListar").empty();
    $("#viewavaliacaousuariolista #mensagem").empty();

    $("#avaliacaoUsuarioVoltar").off();
    $("#avaliacaoUsuarioVoltar").on("click", function (e) {
        e.preventDefault();
        Backbone.history.history.back();
    });


    //$("#viewavaliacaousuariolista #avaliacaoUsuarioListaVoltar").off("click");

    var gridAvaliacaoUsuario = (function () {
        var classeGridAvaliacao = function () {

            var self = this;

            //Atributos publicos
            this.nomeInstanciaGlobal = "gridAvaliacaoUsuario";
            this.textoBotaoPesquisa = "Ferramentas de Pesquisa";
            this.urlBQS = UNINTER.AppConfig.UrlWs("BQS") + "AvaliacaoUsuario/";
            this.idDivGrid = "#divAvaliacoesListar";
            this.textoBtnNovaTentativa = "Nova tentativa";
            this.exibirAgendamento = false;
            this.salaMaster = (UNINTER.StorageWrap.getItem("leftSidebarItemView").totalFilhas > 0);
            //this.ajustarDatasMatriculaCurso = false;
            this.ajustarDatasMatriculaCurso = (UNINTER.StorageWrap.getItem('leftSidebarItemView').idCursoNivel == 11 || UNINTER.StorageWrap.getItem('leftSidebarItemView').idCursoNivel == 5);

            //Atributos privados:
            var retorno = null; 
            var idLaboratorio = null;
            var objRetorno = null;
            var totalPaginas = 0;
            var totalRegistros = 0;
            var totalRegistrosPagina = 25;
            var paginaAtual = 1;
            var filtro = "";
            var ordenacao = "";
            var cIdAvaliacao = (UNINTER.viewGenerica.parametros.idUrl && UNINTER.viewGenerica.parametros.idUrl.toLowerCase() != 'vestibular') ? UNINTER.viewGenerica.parametros.idUrl : null;
            var exibirBotaoNovaTentativa = false;
            var urlListaAvaliacao = "AvaliacaoUsuario/{pagina}/paginacao/" + self.salaMaster + "?numRegistros={numRegistros}&filtro={filtro}&ordenacao={ordenacao}&idSalaVirtual={idSalaVirtual}&idSalaVirtualOferta={idSalaVirtualOferta}&ajustarDatasMatriculaCurso=" + this.ajustarDatasMatriculaCurso + "&cache=" + new Date().getTime();
            var urlRealizacaoProva = "#/ava/AvaliacaoUsuarioHistorico/{idAvaliacao}/novo/{tentativa}/{idAvaliacaoVinculada}";
            var exibirListaSalas = false;
            var temSituacaoAprovacao = false;
            var isApp = false;
            var certificadoTipo = null;
            var idCertificadoModelo = null;

            var templateCabecalhoListaAvaliacaoUsuario = _.template('<div class="row cabecalhoListaAvaliacaoUsuario">'
                        + ' <div class="col-md-5" ><span tabindex=0><strong><%=nome%></span></strong></div>'                        
                        + ' </div>');
            var templateLinhaListaAvaliacaoUsuario = _.template($('#templateAvaliacaoUsuarioLinha').html());

            var templateExpiracao = '<br><span class="label label-radius <%= classeLabel %>"><%= expiracao %></span>';
            
           

            //Instancia
            var G = this;

            //Metodso publicos
            this.clickLinha = function () {
                console.log("clicou");
            };

            this.clickColuna = function () {
                console.log("clicou");
            };

            /*
            this.getInstance = function () {
                var instancia = UNINTER[G.nomeInstanciaGlobal];
                if (typeof instancia == 'object') {
                    return instancia;
                } else {
                    UNINTER[G.nomeInstanciaGlobal] = new grid();
                    return UNINTER[G.nomeInstanciaGlobal];
                }
            };
            */

            this.render = function () {
                
                if (_urlListaAvaliacao != null && _urlListaAvaliacao != void (0)) {
                    urlListaAvaliacao = _urlListaAvaliacao;
                    exibirListaSalas = true;
                }

                if (_urlRealizacaoProva != null && _urlRealizacaoProva != void (0))
                    urlRealizacaoProva = _urlRealizacaoProva;


                //volta para lista de avaliacao
                if (cIdAvaliacao != null && cIdAvaliacao != 'vestibular') {
                    $("#viewavaliacaousuariolista #avaliacaoUsuarioListaVoltar").removeClass("hidden");
                    $("#viewavaliacaousuariolista").addClass('block');

                    $("#avaliacaoUsuarioListaVoltar").off("click");
                    $("#avaliacaoUsuarioListaVoltar").on("click", function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        Backbone.history.history.back();
                    });

                    /*$("#viewavaliacaousuariolista #avaliacaoUsuarioListaVoltar").on("click", function (e) {
                        UNINTER.redirecter({ 'url': '#/ava/AvaliacaoUsuario/' });
                    });*/
                } else {
                    $("#viewavaliacaousuariolista #avaliacaoUsuarioListaVoltar").addClass("hidden");
                    $("#viewavaliacaousuariolista").removeClass('block');
                }

                var idSalaVirtual = 0;

                try{
                    idSalaVirtual = parseInt(UNINTER.StorageWrap.getItem('leftSidebarItemView').idSalaVirtual);
                }catch(e){}


                //é a sala de vestibular, então não busca as avalições e exibe mensagem:
                if (idSalaVirtual == 4548) {
                    $("#divAvaliacoesListar").hide();
                    setMensagem({
                        type: 'warning',
                        body: 'A impressão das provas para o vestibular devem ser realizadas através do menu Administração na tela inicial.<br><a href="#/ava/avaliacaousuarioimpressao">Clique aqui para ser redirecionado.</a>'
                    });
                    return;
                } else {
                    $("#divAvaliacoesListar").show();
                }

                init();
                //renderCabecalho();
                buscarCertificadoTipo();
                //buscarFiltro("", 1, "");
                
                //renderBotaoPesquisa();
                //removerColunasInterface();
                //exibirBotaoNovaTentativa();

                $('[data-toggle="popover"]').popover({ html: true });
            };


            //Metodos privados
            var init = function () {
                //validarExibirAgendamento();
                renderBotaoAgendamento();
                delete UNINTER[G.nomeInstanciaGlobal];
                //$("#divAvaliacoesListar").append(G.getInstance().criarGrid());
                //G.getInstance().setFuncaoUsuarioFiltroBotaoOk(G.buscarFiltro);
            };

            var validarExibirAgendamento = function () {
                var idGrupoEstrutura = null;
                var idUsuario = null;
                try{
                    idGrupoEstrutura = UNINTER.StorageWrap.getItem('user').idGrupoEstrutura;
                    idUsuario = UNINTER.StorageWrap.getItem('user').idUsuario;
                }catch(e){
                    idGrupoEstrutura = null;
                    idUsuario = null;
                }

                var data = new Date();
                var dataAtividade = (data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + (data.getDate()));

                var caminhoHTTP = UNINTER.AppConfig.UrlWs("pap");
                var url = caminhoHTTP + "AgendamentoComputadorUsuario/" + idGrupoEstrutura + "/BuscarLaboratorioAgendado?data=" + dataAtividade;
                
                var opcoes = {
                    url: url,
                    type: 'GET',
                    data: null,
                    async: false
                }

                var json = UNINTER.Helpers.ajaxRequestError(opcoes);
                
                if (json.status == 200) {
                    if (json.resposta.agendamentoComputadorUsuarios.length == 0) {
                        G.exibirAgendamento = false;
                    }
                    else
                        G.exibirAgendamento = true;
                }
                else G.exibirAgendamento = false;
            };

            var renderBotaoAgendamento = function () {

                if (sessionStorage.getItem('appId') != void (0))
                    return;


                var $icone = $("<i>").addClass("icon-calendar");
                var $span = $("<span>").append($icone);
                var $spanTexto = $("<span>").addClass("action-bar-icon-text").html("Agendar avaliação");
                var $a = null;
                var $objDiv = $("<div>").addClass("actions");

                var opcoes = {
                    url: UNINTER.AppConfig.UrlWs('pap') + "Agendamento/0/VerificarDisponibilidade?idCurso=" + UNINTER.StorageWrap.getItem("leftSidebarItemView").idCurso + "&idSalaVirtualOferta=" + UNINTER.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOferta,
                    type: 'GET',
                    async: false
                }
                var _retorno = UNINTER.Helpers.ajaxRequestError(opcoes);

                if (_retorno.status == 200) {
                    G.exibirAgendamento = true;
                    $a = $("<a>").attr("href", "#/ava/AgendamentoUsuario/0/Novo").append($span).append($("<span>").addClass("action-bar-icon-text").html("&nbsp;Agendar &nbsp;"));
                    //$a1 = $("<a>").attr("href", "#/ava/AgendamentoUsuario/").append($("<span>").addClass("action-bar-icon-text").html("Consultar"));
                    $($objDiv).append($a);
                }
                //} else {
                //    validarExibirAgendamento();
                //    $a = $("<a>").attr("href", "#/ava/AgendamentoComputadorUsuario/").append($span).append($spanTexto);
                //    $objDiv = $("<div>").addClass("actions").append($a);
                //}

                //if (G.exibirAgendamento == false) {
                //    return;
                //}

                $a = $("<a>").attr("href", "#/ava/AgendamentoUsuario/").append($("<span>").addClass("action-bar-icon-text").html("Consultar"));
                $($objDiv).append($a);

                //var $icone = $("<i>").addClass("icon-calendar");
                //var $span = $("<span>").append($icone);
                //var $spanTexto = $("<span>").addClass("action-bar-icon-text").html("Agendar avaliação");
                //var $a = $("<a>").attr("href", "#/ava/AgendamentoUsuario/").append($span).append($spanTexto);
                //var $objDiv = $("<div>").addClass("actions").append($a);

                $("#actions").html($objDiv);
            };

            /*
            var renderCabecalho = function () {
                G.getInstance().adicionarColuna(G.getInstance().coluna("idAvaliacaoUsuario", "Código Avaliacao Usuário", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("idAvaliacao", "Código Avaliacao", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("nomeAvaliacaoTipo", "Tipo", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("nome", "Avaliação", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("tema", "Roteiro de estudos", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("tentativa", "Tentativa", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("tentativasRestantes", "Tentativas Restantes", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("status", "Status", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("dataInicial", "Data Inicial", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("dataFinal", "Data Final", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("nota", "Nota", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("dataEntrega", "Data de Entrega", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("revisao", "Detalhes", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("link", "", null));
                G.getInstance().adicionarColuna(G.getInstance().coluna("icone", "", null));

                $("#divAvaliacoesListar table").addClass("table-middle");
                $("#divAvaliacoesListar table #nomeAvaliacaoTipo").addClass("text-center");
            };*/

            /*
            var renderBotaoPesquisa = function () {
                //G.getInstance().filtroCriarBotaoPesquisa(G.textoBotaoPesquisa);
            };
            */

            /*
            var registrarEventos = function () {
                G.getInstance().setFuncaoLinhaClick(clickLinha);
                G.getInstance().setFuncaoColunaClick(clickColuna);
            };
            */

            var buscarRegistros = function () {
                var opcoes = {
                    url: G.urlBQS,
                    type: 'GET',
                    data: null,
                    async: false
                }
                retorno = UNINTER.Helpers.ajaxRequestError(opcoes);
                totalRegistros = retorno.resposta.totalRegistros;
                objRetorno = retorno.resposta.avaliacaoUsuarios;
                totalPaginas = Math.ceil((totalRegistros / totalRegistrosPagina));
                renderBotaoCalculadoraNotas();
            };

            var buscarFiltro = function (strFiltro, pagina, strCamposOrdenar) {

                paginaAtual = pagina;
                filtro = strFiltro;
                ordenacao = strCamposOrdenar;

                //Monta a URL:
                G.urlBQS = getUrlConsumo();

                //Busca os dados:
                buscarRegistros();

                //Seta os valores na instancia da grid:
                //G.getInstance().setQuantidadePagina(totalPaginas);
                //G.getInstance().excluirLinhas();

                //Se não chegou nada, mensagem de aviso, caso contrario popula a grid
                if (typeof objRetorno == 'undefined') {
                    var objErro = { body: "Nenhuma avaliação disponível." };
                    setMensagem(objErro);
                    $(G.idDivGrid).hide();
                } else {
                    
                    if (cIdAvaliacao != null) {
                        popularGridDetalhes();
                    }
                    else {
                        popularGrid();
                    }
                }

            };

            var getExpiracao = function (item) {

                var retorno = {
                    expiracao: 'expira em ',
                    classeLabel: 'label-danger',
                    classeLista: 'list-danger',
                    html: '',
                };

                //Se já fez, então não tem expiração
                if(item.idAvaliacaoUsuarioStatus == 3 || item.idAvaliacaoUsuarioStatus == 2)
                {
                    retorno.expiracao = '';
                    return retorno;
                }

                if (
                    (item.diasExpiracao == 0 && item.horasExpiracao == 0 && item.minutosExpiracao == 0) || //Tudo zero já está expirado.
                    (item.diasExpiracao < 0 || item.horasExpiracao < 0 || item.minutosExpiracao < 0) // Negativo também está expirado.
                ) {
                    retorno.expiracao = '';
                }

                if (item.diasExpiracao > 0) {

                    

                    if (item.diasExpiracao == 1) {
                        retorno.expiracao += item.diasExpiracao + ' dia';
                    } else {
                        retorno.expiracao += item.diasExpiracao + ' dias';
                    }

                    if (item.diasExpiracao > 7) {
                        retorno.classeLabel = 'label-warning';
                        retorno.classeLista = 'list-warning';
                    }

                    if (item.diasExpiracao > 30) {
                        retorno.expiracao = 'expira em ' + UNINTER.Helpers.dateTimeFormatter({ dateTime: item.dataFim, yearFull: false }).date();
                        retorno.classeLista = 'list-oil';
                        retorno.classeLabel = 'label-oil';
                    }


                }
                else if (item.horasExpiracao > 0) {
                    if (item.horasExpiracao == 1) {
                        retorno.expiracao += item.horasExpiracao + ' hora';
                    } else {
                        retorno.expiracao += item.horasExpiracao + ' horas';
                    }
                }
                else if (item.minutosExpiracao > 0) {
                    if (item.minutosExpiracao == 1) {
                        retorno.expiracao += item.minutosExpiracao + ' minuto';
                    } else {
                        retorno.expiracao += item.minutosExpiracao + ' minutos';
                    }
                }

                if(retorno.expiracao != ''){
                    retorno.html = _.template(templateExpiracao, retorno);
                }

                return retorno;
            };

            var popularGrid = function () {

                var classificacao = new Object();
                var exibirStatusAprovacao = false;
                UNINTER.objToken = null;
                //agrupa por classificacao
                var objGroupBy = _.groupBy(objRetorno, function (item) {

                    var nome = item.avaliacao.nomeAvaliacaoTipoCategoria;

                    if (item.avaliacao.idPeriodo > 0) {
                        item.avaliacao.groupByItem = 'per_' + item.avaliacao.idPeriodo;
                        nome = item.avaliacao.periodo;
                    } else {
                        item.avaliacao.groupByItem = 'cat_' + item.avaliacao.idAvaliacaoTipoCategoria;
                    }

                    classificacao[item.avaliacao.groupByItem] = {
                        id: item.avaliacao.groupByItem,
                        nome: nome,
                        ordem: (item.avaliacao.ordemAvaliacaoTipoCategoria) ? item.avaliacao.ordemAvaliacaoTipoCategoria : item.idPeriodo
                    };
                    return item.avaliacao.groupByItem;
                });

                //ordena classificacao
                classificacao = _.sortBy(classificacao, function (item) { return item.ordem })
                if (sessionStorage.getItem('appId') != void (0)) {
                    isApp = true;
                }
                $("#viewavaliacaousuariolista #divAvaliacoesListar").empty("");

                var avaliacaoIniciada = false;

                $.each(classificacao, function (k, categoria) {

                    var htmlAvaliacao = templateCabecalhoListaAvaliacaoUsuario(categoria);

                    var corpo = '';

                    $.each(objGroupBy[categoria.id], function (k, avaliacaoUsuario) {

                        if (avaliacaoUsuario.avaliacao.idAvaliacaoNotaVinculada > 0)
                        {
                            return;
                        }

                        avaliacaoUsuario.tempID = [avaliacaoUsuario.id, avaliacaoUsuario.idAvaliacao, avaliacaoUsuario.idUsuario, avaliacaoUsuario.idAvaliacaoVinculada].join('');

                        if (avaliacaoUsuario.idAvaliacaoUsuarioStatus == 2 || avaliacaoUsuario.idAvaliacaoUsuarioStatus == 3) {
                            avaliacaoUsuario.pendente = false;
                        } else {
                            avaliacaoUsuario.pendente = true;
                        }

                        //corpo += montarLinhaListaAvaliacao(avaliacaoUsuario);
                        
                        temSituacaoAprovacao = avaliacaoUsuario.avaliacao.temStatusAprovacao;
                    
                        if (temSituacaoAprovacao && !isApp) {
                            exibirStatusAprovacao = true;
                            //templateLinhaListaAvaliacaoUsuario = _.template('<div class="row corpoListaAvaliacaoUsuario">'
                            //        + '<div class="col-md-3"><p tabindex=0><i class="<%=iconeStatusAvaliacao%>"></i> <%=nomeAvaliacaoTipo%>: <%=nome%></p><p tabindex=0 class="text-muted"><%=tentativasRestantes%></p><%=listaSalas%></div>'
                            //        + '<div class="col-md-3"><p tabindex=0><%=statusDataAvaliacao%></p><p tabindex=0 class="text-muted"><%=datasAvaliacao%></p> <% if (protocolo) { %> <p tabindex=0><span  class="text-danger" style="margin-right: 3px">requer solicitação prévia</span> <a class="text-primary" href="javascript:void(0)" data-toggle="popover"  data-content="Requer solicitação e pagamento de taxa. Acesse o <a href=\'http://unico.grupouninter.com.br/\' target=\'_blank\'>portal único</a>, clique em Aluno, opção &rdquo;Taxas e Serviços&rdquo;" data-trigger="focus" data-placement="top" ><i class="icon-question-circle"></i></a> </p><% } %> </div>'
                            //        + '<div class="col-md-2 text-center"><p tabindex=0 class="<%=classeNota%>"><%=nota%></p><p ><%=detalhes%></p></div>'
                            //        + '<div class="col-md-2 text-center statusAprovacao"><p tabindex=0 ><strong><%=statusAprovacao%></strong></p><%=certificado%></div>'
                            //        + '<div class="col-md-2 text-center"> <a class="<%=classBtnAcao%>" title="<%=titleBtnAcao%>"  <%=desabilitadoBtnAcao%> href="<%=clickBtnAcao%>" ><%=valorBtnAcao%></a> </div>'
                            //    + '</div>');
                        }
                        
                        var iconeStatusAvaliacao = statusDataAvaliacao = datasAvaliacao = detalhes = msgTentativas = listaSalas = titleBtnAcao = "";
                        var desabilitadoBtnAcao = "disabled='disabled'", clickBtnAcao = 'javascript:void(0)', classBtnAcao = "btn btn-default hide", valorBtnAcao = "INICIAR";
                        var tentativasRestantes = getTentativasRestantes(avaliacaoUsuario);
                        
                        //datas
                        var dataInicio = avaliacaoUsuario.dataInicio == null ? "-" : UNINTER.Helpers.dateTimeFormatter({ dateTime: avaliacaoUsuario.dataInicio, yearFull: false }).date() + " (" + UNINTER.Helpers.dateTimeFormatter({ dateTime: avaliacaoUsuario.dataInicio }).timeString() + ")";
                        var dataFim = avaliacaoUsuario.dataFim == null ? "-" : UNINTER.Helpers.dateTimeFormatter({ dateTime: avaliacaoUsuario.dataFim, yearFull: false }).date() + " (" + (avaliacaoUsuario.avaliacao.exigirSenhaTutor == true && UNINTER.Helpers.dateTimeFormatter({ dateTime: avaliacaoUsuario.dataFim }).timeString() == '23:59h' ? '22h' : UNINTER.Helpers.dateTimeFormatter({ dateTime: avaliacaoUsuario.dataFim }).timeString()) + ")";
                        var datasAvaliacao = 'De ' + dataInicio;
                        if (avaliacaoUsuario.dataFim != null) datasAvaliacao += " até " + dataFim;

                        //mensagem de tentativas
                        if (tentativasRestantes == 0) msgTentativas = "Não há mais tentativas";
                        else if (tentativasRestantes == 1) msgTentativas = "Você tem " + tentativasRestantes + " tentativa";
                        else msgTentativas = "Você tem " + tentativasRestantes + " tentativas";
                        

                        var autoincremento = getAutoincrementoTentativaRecursoAcademico(avaliacaoUsuario);
                        var situacoesContinuarAvaliacao = [4,5];

                        //verifica se avaliacao já foi entregue
                        if (avaliacaoUsuario.horarioTermino != null && avaliacaoUsuario.idAvaliacaoUsuarioStatus != 6) {

                            statusDataAvaliacao = "<strong>ENTREGUE</strong> em " + UNINTER.Helpers.dateTimeFormatter({ dateTime: avaliacaoUsuario.horarioTermino, yearFull: false }).date() + " (" + UNINTER.Helpers.dateTimeFormatter({ dateTime: avaliacaoUsuario.horarioTermino }).timeString() + ")";
                            iconeStatusAvaliacao = "text-success icon-check-circle";

                            //se aluno já entregou alguma vez e avaliacao vigente
                            if ((tentativasRestantes > 0 || autoincremento) && avaliacaoUsuario.statusDataAvaliacao == 0) {
                                classBtnAcao = "btn btn-success start-exam-class";
                                valorBtnAcao = "REFAZER";
                                desabilitadoBtnAcao = " "; //se esta em andamento e tem tentativa, habilita botao
                                clickBtnAcao = getLinkAvaliacao(avaliacaoUsuario);
                            }
                           
                        }
                        else if( avaliacaoUsuario.statusDataAvaliacao == 0) {//período vigente
                            statusDataAvaliacao = "<span class='text-primary'><strong>ABERTA</strong></span> até <span class='text-primary'>" + dataFim + "</span>";
                            //verifica se ainda tem tentativas
                            if (tentativasRestantes > 0 || autoincremento) {
                                avaliacaoUsuario.avaliacao.nomeAvaliacaoTipo = "<span class='text-primary'>" + avaliacaoUsuario.avaliacao.nomeAvaliacaoTipo + "</span>";
                                avaliacaoUsuario.avaliacao.nome = "<span>" + avaliacaoUsuario.avaliacao.nome + "</span>";
                                iconeStatusAvaliacao = "icon-pencil text-warning";
                                classBtnAcao = "btn btn-warning start-exam-class";
                                desabilitadoBtnAcao = " "; //se esta em andamento e tem tentativa, habilita botao
                                clickBtnAcao = getLinkAvaliacao(avaliacaoUsuario);

                                //if (situacoesContinuarAvaliacao.includes(avaliacaoUsuario.idAvaliacaoUsuarioStatus) && avaliacaoUsuario.questoesGeradas == true &&
                                //        avaliacaoUsuario.avaliacao != null && avaliacaoUsuario.avaliacao.exigirSenhaTutor == true) {
                                //    classBtnAcao = classBtnAcao.replace('start-exam-class', '');
                                //    valorBtnAcao = 'CONTINUAR';
                                //    avaliacaoIniciada = true;
                                //}
                            }
                            else {
                                iconeStatusAvaliacao = "icon-ban";
                            }
                        }
                        else if( avaliacaoUsuario.statusDataAvaliacao == 1) {//período expirou                                 
                            statusDataAvaliacao = "<strong>EXPIROU</strong> em " + dataFim;
                            iconeStatusAvaliacao = "icon-ban";
                                                               
                        }
                        else if( avaliacaoUsuario.statusDataAvaliacao == -1) {//período nao iniciou
                            statusDataAvaliacao = '<span class="avaliacaoFutura"><strong>INICIA:</strong> ' + dataInicio + "</span>";
                            if (dataFim != null)
                                statusDataAvaliacao += '<span class="avaliacaoFutura"><strong>FINALIZA:</strong> ' + dataFim + '</span>';
                            datasAvaliacao = "";
                            iconeStatusAvaliacao = "icon-clock-o";
                            msgTentativas = "Aguarde, ainda não iniciou...";
                        }

                        if (avaliacaoUsuario.horarioTermino != null || avaliacaoUsuario.tentativa > 1) {
                            detalhes = getLinkTentativas(avaliacaoUsuario);
                        }

                        if (tentativasRestantes == 0 || avaliacaoUsuario.statusDataAvaliacao == 1) {
                            if (!autoincremento) {
                                titleBtnAcao = "Não é possível realizar a avaliação. Verifique as datas da avaliação e o número de tentativas restantes.";
                            }
                            msgTentativas = "";
                        }


                        //trata lista de salas
                        if (exibirListaSalas) {
                            listaSalas = "<p class='text-muted'>Disciplina(s):</p>"
                                    + "<ul>";
                            if(avaliacaoUsuario.salas.length > 0) {
                                $.each(avaliacaoUsuario.salas, function (ks, sala) {
                                    listaSalas += "<li>" + sala.nomeSalaVirtual;
                                    if (sala.codigoOferta > 0)
                                    listaSalas += " (" + sala.codigoOferta + ")";
                                });
                            }
                            listaSalas += "</ul>";
                                    
                        }

                        var statusAprovacao = '';
                        if (avaliacaoUsuario.idStatusAprovacao == 2) {   
                            statusAprovacao = 'Aprovado';
                        }
                        else if (avaliacaoUsuario.idStatusAprovacao == 1) {   
                            statusAprovacao = 'Reprovado';
                        }
                        else {
                            statusAprovacao = 'Não Realizada';
                        }

                        var certificado = '';
                        var certificadoGeral = '';
                        if (certificadoTipo != null && avaliacaoUsuario.idStatusAprovacao == 2) {
                            certificado = '<h6 class="sidebar-item"><span class="sidebar-link-box"><a href="javascript:void(0)" target="_blank" id="certificado'
                                + avaliacaoUsuario.id + '"><span class="sidebar-link-box-icon"><i class="icon-certificate3" title="Imprimir certificado"></i></span></a></span></h6>';
                            debugger
                            if (certificadoTipo == 3 || idCertificadoModelo == 1) {
                                certificadoGeral = '<h6 class="sidebar-item"><span class="sidebar-link-box"><a href="javascript:void(0)" target="_blank" id="certificadoGeral'
                                + avaliacaoUsuario.id + '"><span class="sidebar-link-box-icon"><i class="icon-certificate3" title="Imprimir certificado"></i></span></a></span></h6>';
                            }
                        }
                        else {
                            statusAprovacao = '';
                        }

                        if (avaliacaoUsuario.statusDataAvaliacao == 0) {
                            
                            if (
                                    situacoesContinuarAvaliacao.indexOf(avaliacaoUsuario.idAvaliacaoUsuarioStatus) > -1 &&
                                    avaliacaoUsuario.questoesGeradas == true &&
                                    avaliacaoUsuario.avaliacao != null &&
                                    avaliacaoUsuario.avaliacao.exigirSenhaTutor == true &&
                                    avaliacaoUsuario.avaliacao.avaliacaoImpressa == false
                            ){
                                classBtnAcao = classBtnAcao.replace('start-exam-class', '');
                                valorBtnAcao = 'CONTINUAR';
                                avaliacaoIniciada = true;
                            }
                        }

                        avaliacaoUsuario.url = clickBtnAcao;

                        var objLinha = {
                            nomeAvaliacaoTipo: avaliacaoUsuario.avaliacao.nomeAvaliacaoTipo,
                            nome: avaliacaoUsuario.avaliacao.nome,
                            iconeStatusAvaliacao: iconeStatusAvaliacao,
                            tentativasRestantes: msgTentativas,
                            statusDataAvaliacao: statusDataAvaliacao,
                            datasAvaliacao: datasAvaliacao + getExpiracao(avaliacaoUsuario).html,
                            nota: avaliacaoUsuario.nota == null ? "--" : "Nota: " + avaliacaoUsuario.nota,
                            classeNota: avaliacaoUsuario.nota == null ? "semNota" : "nota",
                            detalhes: detalhes,
                            classBtnAcao: classBtnAcao,                            
                            valorBtnAcao: valorBtnAcao,
                            desabilitadoBtnAcao: desabilitadoBtnAcao,
                            exigirSenhaTutor: avaliacaoUsuario.avaliacao.exigirSenhaTutor,
                            autorizadoSemSupervisao : avaliacaoUsuario.autorizadoSemSupervisao,
                            clickBtnAcao:  clickBtnAcao,
                            titleBtnAcao: titleBtnAcao,
                            listaSalas: listaSalas,
                            protocolo: (avaliacaoUsuario.avaliacao.possuiProtocolo > 0) ? true : false,
                            statusAprovacao: statusAprovacao,
                            exibirStatusAprovacao: exibirStatusAprovacao,
                            certificado: certificado,
                            certificadoGeral: certificadoGeral,
                            certificadoTipo: certificadoTipo,
                            idCertificadoModelo: idCertificadoModelo,
                            tempID: avaliacaoUsuario.tempID,
                            pesoMedia: parseInt(avaliacaoUsuario.avaliacao.pesoMedia) > 0 ? parseInt(avaliacaoUsuario.avaliacao.pesoMedia) : null,
                            pendente: avaliacaoUsuario.pendente,
                            avaliacaoImpressa: avaliacaoUsuario.avaliacao.avaliacaoImpressa
                            
                        };
                        corpo += templateLinhaListaAvaliacaoUsuario(objLinha);
                        if (temSituacaoAprovacao && !isApp) {
                            buscarUrlCertificado(avaliacaoUsuario.id, avaliacaoUsuario.idAvaliacao, avaliacaoUsuario.idUsuario, true, false);
                        }

                    });

                    $("#viewavaliacaousuariolista #divAvaliacoesListar").append(htmlAvaliacao).append(corpo);

                    if (avaliacaoIniciada) {
                        setMensagem({
                            type: 'danger',
                            body: 'Você já iniciou uma avaliação, será necessário entregá-la antes de iniciar outra.'
                        });
                        jQuery('.start-exam-class')
                            .removeClass('btn-warning')
                            .removeClass('btn-success')
                            .addClass('btn-default')
                            .attr('disabled', 'disabled')
                            .parent().attr('title', 'Você já iniciou uma avaliação, será necessário entregá-la antes de iniciar outra.');
                    }

                    UNINTER.viewGenerica.setPlaceholderHeight();
                });
                
                UNINTER.viewGenerica.setPlaceholderHeight();
                Eventos();
            };


            var popularGridDetalhes = function () {
                /*
                var classificacao = new Object();

                //agrupa por classificacao
                var objGroupBy = _.groupBy(objRetorno, function (item) {
                    classificacao[item.avaliacao.idAvaliacaoTipoCategoria] = { id: item.avaliacao.idAvaliacaoTipoCategoria, nome: item.avaliacao.nomeAvaliacaoTipoCategoria, ordem: item.avaliacao.ordemAvaliacaoTipoCategoria };
                    return item.avaliacao.idAvaliacaoTipoCategoria;
                });

                //ordena classificacao
                classificacao = _.sortBy(classificacao, function (item) { return item.ordem })

                $("#viewavaliacaousuariolista #divAvaliacoesListar").empty("");
                $.each(classificacao, function (k, categoria) {
                    */
                if (sessionStorage.getItem('appId') != void (0)) {
                    isApp = true;
                }

                UNINTER.objToken = null;
                
                var htmlAvaliacao = templateCabecalhoListaAvaliacaoUsuario({nome: "Tentativa(s)"});

                var corpo = '';
                var exibirStatusAprovacao = false;

                $.each(objRetorno, function (k, avaliacaoUsuario) {

                    avaliacaoUsuario.tempID = [avaliacaoUsuario.id, avaliacaoUsuario.idAvaliacao, avaliacaoUsuario.idUsuario, avaliacaoUsuario.idAvaliacaoVinculada].join('');

                    if (avaliacaoUsuario.idAvaliacaoUsuarioStatus == 2 || avaliacaoUsuario.idAvaliacaoUsuarioStatus == 3) {
                        avaliacaoUsuario.pendente = false;
                    } else {
                        avaliacaoUsuario.pendente = true;
                    }

                    var statusDataAvaliacao = datasAvaliacao = detalhes = msgTentativas = "";
                    var desabilitadoBtnAcao = "disabled='disabled'", clickBtnAcao = 'javascript:void(0)', classBtnAcao = "btnDetalhes btn btn-primary", valorBtnAcao = "", exibirBtnAcao = false;

                    var msgTentativas = avaliacaoUsuario.tentativa + "º Tentativa";


                    if (avaliacaoUsuario.horarioTermino != null) {
                        statusDataAvaliacao = "ENTREGUE em " + UNINTER.Helpers.dateTimeFormatter({ dateTime: avaliacaoUsuario.horarioTermino, yearFull: false }).date() + " (" + UNINTER.Helpers.dateTimeFormatter({ dateTime: avaliacaoUsuario.horarioTermino }).timeString() + ")";
                        iconeStatusAvaliacao = "text-success icon-check-circle";
                    }
                    else {
                        classBtnAcao = "btnDetalhes btn btn-warning";
                        statusDataAvaliacao = avaliacaoUsuario.status;
                        iconeStatusAvaliacao = "icon-pencil text-warning"
                    }

                    temSituacaoAprovacao = avaliacaoUsuario.avaliacao.temStatusAprovacao;
                    if (temSituacaoAprovacao && !isApp) {
                        exibirStatusAprovacao = true;
                        templateLinhaListaAvaliacaoUsuario = _.template('<div class="row corpoListaAvaliacaoUsuario">'
                            + '<div class="col-md-3"><p tabindex=0><i class="status-avaliacao <%=iconeStatusAvaliacao%>"></i> <%=nomeAvaliacaoTipo%>: <%=nome%></p><p tabindex=0 class="text-muted"><%=tentativasRestantes%></p><%=listaSalas%></div>'
                            + '<div class="col-md-3"><p tabindex=0><%=statusDataAvaliacao%></p><p tabindex=0 class="text-muted"><%=datasAvaliacao%></p> <% if (protocolo) { %> <p tabindex=0><span  class="text-danger" style="margin-right: 3px">requer solicitação prévia</span> <a class="text-primary" href="javascript:void(0)" data-toggle="popover"  data-content="Requer solicitação e pagamento de taxa. Acesse o <a href=\'http://unico.grupouninter.com.br/\' target=\'_blank\'>portal único</a>, clique em Aluno, opção &rdquo;Taxas e Serviços&rdquo;" data-trigger="focus" data-placement="top" ><i class="icon-question-circle"></i></a> </p><% } %> </div>'
                            + '<div class="col-md-2 text-center"><p tabindex=0 class="<%=classeNota%>"><%=nota%></p><p ><%=detalhes%></p></div>'
                            + '<div class="col-md-2 text-center statusAprovacao"><p tabindex=0 ><strong><%=statusAprovacao%></strong></p><%=certificado%></div>'
                            + '<div class="col-md-2 text-center"> <a class="<%=classBtnAcao%>" title="<%=titleBtnAcao%>" data-id="<%=tempID%>" data-pendente="<%=pendente%>" <%=desabilitadoBtnAcao%> href="<%=clickBtnAcao%>" ><%=valorBtnAcao%></a> </div>'
                            + '</div>');
                    }

                    var btn = getLink(avaliacaoUsuario);
                    console.log(btn);

                    if (btn != null && btn != void (0)) {
                        desabilitadoBtnAcao = ' ';
                        valorBtnAcao = btn.texto;
                        clickBtnAcao = btn.url;
                    }
                    else classBtnAcao = "hidden";

                    var statusAprovacao = '';
                    if (avaliacaoUsuario.idStatusAprovacao == 2) {
                        statusAprovacao = 'Aprovado';
                    }
                    else if (avaliacaoUsuario.idStatusAprovacao == 1) {
                        statusAprovacao = 'Reprovado';
                    }
                    else {
                        statusAprovacao = 'Não Realizada';
                    }

                    var certificado = '';
                    var certificadoGeral = '';
                    if (certificadoTipo != null && avaliacaoUsuario.idStatusAprovacao == 2) {
                        certificado = '<h6 class="sidebar-item"><span class="sidebar-link-box"><a href="javascript:void(0)" target="_blank" id="certificado'
                            + avaliacaoUsuario.id + '"><span class="sidebar-link-box-icon"><i class="icon-certificate3" title="Imprimir certificado"></i></span></a></span></h6>';
                        debugger
                        if (certificadoTipo == 3 || idCertificadoModelo == 1) {
                            certificadoGeral = '<h6 class="sidebar-item"><span class="sidebar-link-box"><a href="javascript:void(0)" target="_blank" id="certificadoGeral'
                            + avaliacaoUsuario.id + '"><span class="sidebar-link-box-icon"><i class="icon-certificate3" title="Imprimir certificado"></i></span></a></span></h6>';
                        }
                    }
                    else {
                        statusAprovacao = '';
                    }


                    var objLinha = {
                        nomeAvaliacaoTipo: avaliacaoUsuario.avaliacao.nomeAvaliacaoTipo,
                        nome: avaliacaoUsuario.avaliacao.nome,
                        iconeStatusAvaliacao: iconeStatusAvaliacao,
                        tentativasRestantes: msgTentativas,
                        statusDataAvaliacao: statusDataAvaliacao,
                        datasAvaliacao: datasAvaliacao,
                        nota: avaliacaoUsuario.nota == null ? "--" : "Nota: " + avaliacaoUsuario.nota,
                        classeNota: avaliacaoUsuario.nota == null ? "semNota" : "nota",
                        detalhes: detalhes,
                        classBtnAcao: classBtnAcao,
                        valorBtnAcao: valorBtnAcao,
                        desabilitadoBtnAcao: desabilitadoBtnAcao,
                        clickBtnAcao: clickBtnAcao,
                        exibirBtnAcao: exibirBtnAcao,
                        titleBtnAcao: '',
                        listaSalas: '',
                        protocolo: false,
                        exibirStatusAprovacao: exibirStatusAprovacao,
                        statusAprovacao: statusAprovacao,
                        certificado: certificado,
                        certificadoGeral: certificadoGeral,
                        certificadoTipo: certificadoTipo,
                        idCertificadoModelo: idCertificadoModelo,
                        pesoMedia: parseInt(avaliacaoUsuario.avaliacao.pesoMedia) > 0 ? parseInt(avaliacaoUsuario.avaliacao.pesoMedia) : null,
                        exigirSenhaTutor: avaliacaoUsuario.avaliacao.exigirSenhaTutor,
                        autorizadoSemSupervisao: avaliacaoUsuario.autorizadoSemSupervisao,
                        tempID: avaliacaoUsuario.tempID,
                        pendente: avaliacaoUsuario.pendente,
                        avaliacaoImpressa: avaliacaoUsuario.avaliacao.avaliacaoImpressa
                        
                    };
                    corpo += templateLinhaListaAvaliacaoUsuario(objLinha);
                    if (temSituacaoAprovacao && !isApp) {

                        buscarUrlCertificado(avaliacaoUsuario.id, avaliacaoUsuario.idAvaliacao, avaliacaoUsuario.idUsuario, true, false);
                    }
                });

                $("#viewavaliacaousuariolista #divAvaliacoesListar").append(htmlAvaliacao).append(corpo);
                
                UNINTER.viewGenerica.setPlaceholderHeight();

                Eventos();
                
            };

            var getTentativasRestantes = function (item) {
                var tentativas = 0;
                if (item.idAvaliacaoUsuarioStatus == 2 || item.idAvaliacaoUsuarioStatus == 3) {
                    tentativas = (item.tentativaTotal - item.tentativa);
                } else {
                    tentativas = (item.tentativaTotal - (item.tentativa-1));
                }
                return tentativas;
            };

            var renderIconeTipo = function (item) {

                var icone = $("<i>").addClass(item.avaliacao.icone);
                var spanIcone = $("<span>").addClass("un-icon-box-holder").append(icone);
                var spanTexto = ""; // $("<span>").addClass("un-icon-box-legend").append(item.avaliacao.nomeAvaliacaoTipo);
                var container = $("<div>").addClass("un-icon-box un-icon-box-block").append(spanIcone).append(spanTexto);

                return UNINTER.Helpers.jQueryObjToString(container);
            }

            var getLinkTentativas = function (item) {

                //var $a = $("<a>").attr("href", "#/ava/AvaliacaoUsuario/" + item.idAvaliacao).html("Detalhes").addClass("detalhesAvaliacaoUsuario");
                var $a = $("<a>").attr("href", "#/ava/AvaliacaoUsuario/" + encodeURIComponent(item.cIdAvaliacao)).html("Detalhes").addClass("detalhesAvaliacaoUsuario");
                
                var $container = $("<div>").html($a);

                return $container.html();
            };
            
            var getLink = function (item) {
                
                if (item.acao == null) {
                    return null;
                }
                var retorno = new Object();
                var icone = "";//"<i class='icon-arrow-circle-o-right'></i>";

                if (cIdAvaliacao != null) {
                    retorno.url = urlRealizacaoProva.replace("{idAvaliacao}", encodeURIComponent(item.cIdAvaliacao));
                    retorno.url = retorno.url.replace("{tentativa}", item.tentativa);
                    retorno.url = retorno.url.replace("{idAvaliacaoVinculada}", (item.cIdAvaliacaoVinculada != null) ? encodeURIComponent(item.cIdAvaliacaoVinculada) : '');
                    retorno.texto = item.acao;
                } 
                else {
                    retorno.url = "#/ava/AvaliacaoUsuario/" + item.idAvaliacao;
                    retorno.texto = "Acessar";
                }

                retorno.texto  += " " + icone;

                return retorno;
            };

            var getNomeLink = function (item) {

                var tentativaIniciar = item.tentativa;
                if (cIdAvaliacao != null) {
                    tentativaIniciar = item.tentativa;
                } else {
                    if (item.idAvaliacaoUsuarioStatus == 2 || item.idAvaliacaoUsuarioStatus == 3) {
                        if (tentativaIniciar < item.tentativaTotal || (item.tentativaTotal == tentativaIniciar && item.avaliacao.autoincrementoTentativaRecursoAcademico === true) ) {
                            tentativaIniciar = tentativaIniciar + 1;
                        }
                    }
                }

                var link = $("<a>").html(item.avaliacao.nome);
                var url = urlRealizacaoProva.replace("{idAvaliacao}", encodeURIComponent(item.cIdAvaliacao));
                url = url.replace("{tentativa}", tentativaIniciar);

                link.attr("href", url);
                var container = $("<div>").append(link);
                return container.html();
            };

            var getLinkAvaliacao = function (item) {

                var tentativaIniciar = item.tentativa;
                if (cIdAvaliacao != null) {
                    tentativaIniciar = item.tentativa;
                } else {
                    if (item.idAvaliacaoUsuarioStatus == 2 || item.idAvaliacaoUsuarioStatus == 3) {
                        if (tentativaIniciar < item.tentativaTotal || (item.tentativaTotal == tentativaIniciar && item.avaliacao.autoincrementoTentativaRecursoAcademico === true)) {
                            tentativaIniciar = tentativaIniciar + 1;
                        }
                    }
                }
                var url = urlRealizacaoProva.replace("{idAvaliacao}", encodeURIComponent(item.cIdAvaliacao));
                url = url.replace("{tentativa}", tentativaIniciar);

                if (item.cIdAvaliacaoVinculada != null) {
                    url = url.replace("{idAvaliacaoVinculada}", encodeURIComponent(item.cIdAvaliacaoVinculada));
                } else {
                    url = url.replace("{idAvaliacaoVinculada}", "");
                }

                return url;
            };

            var getAutoincrementoTentativaRecursoAcademico = function (item) {
                var tentativaIniciar = item.tentativa;
                
                if (item.idAvaliacaoUsuarioStatus == 2 || item.idAvaliacaoUsuarioStatus == 3) {
                    if (tentativaIniciar < item.tentativaTotal || (item.tentativaTotal == tentativaIniciar && item.avaliacao.autoincrementoTentativaRecursoAcademico === true)) {
                        return true;
                    }
                }
                return false;
            };

            var getIcone = function (item) {
                var classeStatus = "atv-icon-status pending";
                var classIcone = "icon-clock-o icon-color icon-color-warning";

                if (item.idAvaliacaoUsuarioStatus == 2 || item.idAvaliacaoUsuarioStatus == 3)
                {
                    classeStatus = "atv-icon-status";
                    classIcone = "icon-check icon-color icon-color-success";
                }

                var $icone = $("<i>").addClass(classIcone);
                var $span = $("<span>").addClass(classeStatus).append($icone);
                var $container = $("<div>").append($span);
                return $container.html();
            };

            var getUrlConsumo = function () {                
                var url = UNINTER.AppConfig.UrlWs("BQS");

                var idSalaVirtual = 0, idSalaVirtualOferta = 0;
                try {
                    var objSessao = UNINTER.StorageWrap.getItem("leftSidebarItemView");
                    idSalaVirtual = objSessao.idSalaVirtual;
                    idSalaVirtualOferta = objSessao.idSalaVirtualOferta;

                }
                catch (e) { console.warn("Erro ao buscar idSalaVirtualOferta/idSalaVirtual") };

                //Se for sala mestre precisa trocar o idSalaVirtualOferta:
                if (self.salaMaster === true && UNINTER.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaAproveitamento > 0)
                {
                    idSalaVirtualOferta = UNINTER.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaAproveitamento;
                }


                if (cIdAvaliacao != null) {
                    url = url + "AvaliacaoUsuario/0/UsuariocId" + ((self.salaMaster === true) ? ('/' + idSalaVirtualOferta) : '') + '?cIdAvaliacao=' + encodeURIComponent(cIdAvaliacao);
                } else {

                    url = url + urlListaAvaliacao.replace("{pagina}", paginaAtual);
                    url = url.replace("{numRegistros}", totalRegistrosPagina);
                    url = url.replace("{filtro}", filtro);
                    url = url.replace("{ordenacao}", ordenacao);
                    url = url.replace("{idSalaVirtual}", idSalaVirtual);
                    url = url.replace("{idSalaVirtualOferta}", idSalaVirtualOferta);

                }
                return url;
            };

            var setMensagem = function (params) {

                if (params.type == void (0) || params.type == null) { params.type = 'danger'; }
                if (params.strong == void (0) || params.strong == null) { params.strong = ''; }
                if (params.appendTo == void (0) || params.appendTo == null) { params.appendTo = '#mensagem'; }

                var opcoes = {
                    body: params.body,
                    strong: params.strong,
                    type: params.type,
                    appendTo: params.appendTo
                }
                $(params.appendTo).empty();
                UNINTER.flashMessage(opcoes);
            };


            var renderPopupToken = function (e) {

                e.preventDefault();
                e.stopImmediatePropagation();

                var tempID = $(e.currentTarget).data('id');
                var link = $(e.currentTarget).attr('href');

                var template = $("#templateToken").html()

                var botoes = [];
                //Liberar:
                botoes.push({
                    'type': "button",
                    'klass': "btn btn-primary",
                    'text': "Liberar",
                    'dismiss': null,
                    'id': 'modal-ok',
                    'onClick': function (event, jQModalElement) {

                        var token = $(".form-horizontal #token").val();

                        if (token == undefined || token == "") {
                            $(".form-horizontal #token").parent().append("<span></span>");
                            $(".form-horizontal #token").parent().addClass('has-error').find('span').addClass('text-danger').html('Token inválido.');
                            $(".form-horizontal #token").parent().parent().find('label').addClass('text-danger')
                            return;
                        } else {
                            $(".form-horizontal #token").parent().removeClass('has-error').find('span').removeClass('text-danger').html('');
                            $(".form-horizontal #token").parent().parent().find('label').removeClass('text-danger');
                        }

                        var objAvaliacao = _.findWhere(objRetorno, { tempID: tempID.toString() });

                        var idv = objAvaliacao.idAvaliacaoVinculada == undefined ? '' : objAvaliacao.idAvaliacaoVinculada;
                        
                        var tentativaIniciar = objAvaliacao.tentativa;
                        var idAvaliacaoUsuario = objAvaliacao.id;

                        if (objAvaliacao.idAvaliacaoUsuarioStatus == 2 || objAvaliacao.idAvaliacaoUsuarioStatus == 3) {
                            if (tentativaIniciar < objAvaliacao.tentativaTotal || (objAvaliacao.tentativaTotal == tentativaIniciar && objAvaliacao.avaliacao.autoincrementoTentativaRecursoAcademico === true)) {
                                tentativaIniciar = tentativaIniciar + 1;
                                idAvaliacaoUsuario = null;
                            }
                        }

                        var urlConsumoToken = UNINTER.AppConfig.UrlWs("BQS") + "AvaliacaoUsuarioHistorico/" + objAvaliacao.idAvaliacao + "/ValidarToken/" + tentativaIniciar + "?idAU=" + idAvaliacaoUsuario + "&token=" + token + "&idVinculada=" + idv;
                        //var urlConsumoToken = "http://localhost:49178/AvaliacaoUsuarioHistorico/" + objAvaliacao.idAvaliacao + "/ValidarToken/" + objAvaliacao.tentativa + "?idAU=" + objAvaliacao.id + "&token=" + token + "&idVinculada=" + idv;

                        var opcoes = {
                            url: urlConsumoToken, type: 'GET', async: true,
                            successCallback: function (data) {
                                
                                UNINTER.objToken = data;
                                UNINTER.objToken.token = token;
                                
                                jQModalElement.modal('hide');

                                window.location = link;
                            },
                            errorCallback: function (erro) {
                                if (erro.status == 405) {
                                    var mensagem = "";
                                    _.each(erro.responseJSON.mensagens, function (item) {
                                        mensagem = mensagem + item + '<br>'
                                    });
                                    setMensagem({ body: mensagem, type: 'danger', appendTo: '#mensagemModal' });
                                } else {
                                    $(".form-horizontal #token").parent().append("<span></span>");
                                    $(".form-horizontal #token").parent().addClass('has-error').find('span').addClass('text-danger').html('Token inválido.');
                                    $(".form-horizontal #token").parent().parent().find('label').addClass('text-danger');
                                }
                            }
                        };

                        UNINTER.Helpers.ajaxRequest(opcoes);

                    }
                });

                //Cancelar:
                botoes.push({
                    'type': "button",
                    'klass': "btn btn-default",
                    'text': "Cancelar",
                    'dismiss': 'modal',
                    'id': 'modal-cancel'
                });

                UNINTER.Helpers.showModal({
                    size: "",
                    body: _.template(template, { objAvaliacaoUsuario: _.findWhere(objRetorno, { tempID: tempID.toString() }) }),
                    title: 'Necessário autorização do polo',
                    modal: { backdrop: 'static', keyboard: false },
                    buttons: botoes
                });

            };

            var Eventos = function () {
                $('a[data-supervisionada="true"][data-pendente="true"][data-impressa="false"]').off('click').on('click', function (e) {
                    if (!isApp && UNINTER.StorageWrap.getItem('user').internacional == false) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        renderPopupToken(e);
                    }
                });
            };

            /*
            var removerColunasInterface = function () {
                if (parseInt(idAvaliacao) > 0) {

                    G.getInstance().setColunaVisivel("idAvaliacaoUsuario", false);
                    G.getInstance().setColunaVisivel("idAvaliacao", false);
                    G.getInstance().setColunaVisivel("nomeAvaliacaoTipo", true);
                    G.getInstance().setColunaVisivel("nome", true);
                    G.getInstance().setColunaVisivel("tema", false);
                    G.getInstance().setColunaVisivel("tentativa", true);
                    G.getInstance().setColunaVisivel("tentativasRestantes", false);
                    G.getInstance().setColunaVisivel("status", true);
                    G.getInstance().setColunaVisivel("dataInicial", false);
                    G.getInstance().setColunaVisivel("dataFinal", false);
                    G.getInstance().setColunaVisivel("nota", true);
                    G.getInstance().setColunaVisivel("dataEntrega", true);
                    G.getInstance().setColunaVisivel("link", true);
                    G.getInstance().setColunaVisivel("icone", false);
                    G.getInstance().setColunaVisivel("revisao", false);

                } else {

                    G.getInstance().setColunaVisivel("idAvaliacaoUsuario", false);
                    G.getInstance().setColunaVisivel("idAvaliacao", false);
                    G.getInstance().setColunaVisivel("nomeAvaliacaoTipo", true);
                    G.getInstance().setColunaVisivel("nome", true);
                    G.getInstance().setColunaVisivel("tema", false);
                    G.getInstance().setColunaVisivel("tentativa", false);
                    G.getInstance().setColunaVisivel("tentativasRestantes", true);
                    G.getInstance().setColunaVisivel("status", false);
                    G.getInstance().setColunaVisivel("dataInicial", true);
                    G.getInstance().setColunaVisivel("dataFinal", true);
                    G.getInstance().setColunaVisivel("nota", true);
                    G.getInstance().setColunaVisivel("dataEntrega", true);
                    G.getInstance().setColunaVisivel("link", false);
                    G.getInstance().setColunaVisivel("icone", false);
                    G.getInstance().setColunaVisivel("revisao", true);
                }
            };
            
            var exibirBotaoNovaTentativa = function () {
                //if (parseInt(idAvaliacao) > 0) {

                //    var avaliacao = null;
                //    var tentativa = 0;

                //    //Tentamos recuperar uma avaliação:
                //    try { avaliacao = objRetorno[0].avaliacao; } catch (e) { avaliacao = null; }

                //    //Pegamos a ultima tentativa:
                //    $.each(objRetorno, function (i, item) {
                //        if (item.tentativa > tentativa) {
                //            tentativa = item.tentativa;
                //        }
                //    });

                //    if (tentativa < avaliacao.totalTentativas) {
                //        renderBotaoNovaTentativa(avaliacao, (tentativa + 1));
                //    } else {
                //        removerBotaoNovaTentativa();
                //    }
                //} else {
                //    removerBotaoNovaTentativa();
                //}
            }
            */
            var renderBotaoNovaTentativa = function (idAvaliacao, tentativa) {

                var icone = $("<i>").addClass("icon-plus-circle");
                var spanIcone = $("<span>").append(icone);
                var spanTexto = $("<span>").addClass("action-bar-icon-text").html(G.textoBtnNovaTentativa);
                var link = $("<a>").attr("id", "addNovaTentativa").append(spanIcone).append(spanTexto);
                var divContainer = $("<div>").addClass("actions").append(link);

                //Evento
                $("#actions").html(divContainer);
                $("#addNovaTentativa").on("click.avaliacaoUsuario", function (e) {
                    e.preventDefault();
                });
            };

            var removerBotaoNovaTentativa = function () {
                $("#actions").html("");
                $("#addNovaTentativa").off("click.avaliacaoUsuario");
            };

            var renderBotaoCalculadoraNotas = function () {

                if (sessionStorage.getItem('appId') != void (0))
                    return;

                var mostrarIcone = false;

                $("#btnAvaliacaoUsuario").remove();

                var itens = $(objRetorno).filter(function () {
                    return (this.avaliacao.idComposicaoMedia == 1);
                });

                if (itens != void (0) && itens.length > 0) {
                    mostrarIcone = true;
                }

                if (UNINTER.StorageWrap.getItem('leftSidebarItemView').utilizaPesoMedia == true && (objRetorno == void (0) || objRetorno.length == 0)) {
                    mostrarIcone = true
                }


                if (mostrarIcone) {
                    var icone = '<a id="btnAvaliacaoUsuario" href="#/ava/AvaliacaoUsuarioSimulacaoNota"><span style="margin-left: 10px;"><i class="icon-dashboard"></i></span><span class="action-bar-icon-text">&nbsp;Simular Notas &nbsp;</span></a>';
                    var icones = $('.actions').html();
                    icone = icone + icones;
                    $('.actions').html(icone);
                }

            };

            var buscarCertificadoTipo = function () {
                if (sessionStorage.getItem('appId') != void (0)) {
                    buscarFiltro("", 1, "");
                }
                else {

                    var urlConsumoTempo = UNINTER.AppConfig.UrlWs('sistema') + 'CertificadoTipo/' + UNINTER.StorageWrap.getItem("leftSidebarItemView").idCurso + '/GetCertificadoTipoByCurso/';
                    var opcoes = {
                        url: urlConsumoTempo, type: 'GET', async: true,
                        successCallback: function (data) {
                           
                            certificadoTipo = data.certificadoTipo.idCertificadoTipo;
                            idCertificadoModelo = data.certificadoTipo.vCertificadoModelo.idCertificadoModelo;
                            buscarFiltro("", 1, "");
                        },
                        errorCallback: function (erro) {
                            if (erro.status != 404) {
                                setMensagem({
                                    type: 'danger',
                                    body: 'Erro na impressão do certificado!'
                                });
                            }
                            else {
                                buscarFiltro("", 1, "");
                            }
                        }
                    };
                    UNINTER.Helpers.ajaxRequest(opcoes);
                }
            }


            var buscarUrlCertificado = function (idAvaliacaoUsuario,idAvaliacao,idUsuario, isMax, geral) {
   
                var idCertificado;

                var urlConsumoTempo;
                var url;
                // Certificado de extensão - gerado pelo serviço externo 
                if (certificadoTipo == 1) {
                    // url do certificado
                    url = UNINTER.AppConfig.UrlWs('integracao') + 'CertificadoExtensao/0/Get?url=';
                    // url da requisição
                    urlConsumoTempo = UNINTER.AppConfig.UrlWs('integracao') + 'CertificadoExtensao/' + idAvaliacaoUsuario + '/GetUrlCriptografada/' + isMax;
                }
                // Certificado gerado pelo AVA com o ABCpdf (Escola de Polos)     
                else {
                    if (idCertificadoModelo == 0) {
                        // url do certificado
                        url = UNINTER.AppConfig.UrlWs('pdf') + 'Sistema/GrupoEstruturaCertificado/0/Certificado?geral=' + geral + '&url=';
                        // url da requisição
                        urlConsumoTempo = UNINTER.AppConfig.UrlWs('sistema') + 'GrupoEstruturaCertificado/' + idAvaliacao + '/GetUrlCriptografada/' + UNINTER.StorageWrap.getItem("leftSidebarItemView").idCurso;
                    }
                    else {
                        // url do certificado
                        url = UNINTER.AppConfig.UrlWs('pdf') + 'Sistema/Certificado/0/Certificado?geral=' + geral + '&url=';
                        // url da requisição
                        urlConsumoTempo = UNINTER.AppConfig.UrlWs('sistema') + 'Certificado/' + idAvaliacao + '/GetUrlCriptografada/' + UNINTER.StorageWrap.getItem("leftSidebarItemView").idCurso;
                    }
                }

                var opcoes = {
                    url: urlConsumoTempo, type: 'GET', async: true,
                    successCallback: function (data) {

                        url = url + data.certificado.url;
                        if (geral == false) {
                            $('#certificado' + idAvaliacaoUsuario).attr("href", url);
                            if (certificadoTipo == 3 || idCertificadoModelo == 1) {
                                buscarUrlCertificado(idAvaliacaoUsuario, idAvaliacao, idUsuario, isMax, true)
                            }
                        }
                        else {
                            $('#certificadoGeral' + idAvaliacaoUsuario).attr("href", url);
                        }

                    },
                    errorCallback: function (erro) {
                        setMensagem({
                            type: 'danger',
                            body: 'Erro na impressão do certificado!'
                        });
                    }
                };
                UNINTER.Helpers.ajaxRequest(opcoes);
            };
        };
        return classeGridAvaliacao;
    })();

    var GRID = new gridAvaliacaoUsuario;
    GRID.render();
};