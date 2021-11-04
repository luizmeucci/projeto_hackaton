if(typeof define == 'function')
{
    define(function (require) {
        require("js/vendor/bootstrap-slider.min.js");
        //require('js/vendor/bootstrap-slider-master/src/js/bootstrap-slider.js');
    });
}


var questoes = (function () {

    var classQuestoes = function () {

        /************************************************
         * ATRIBUTOS DE ENTRADA
         ************************************************/

        //Parametros para exibicao
        this.exibirTodasQuestoes = true;
        this.exibirGrauDificuldade = false;
        this.exibirOrdemBancoQuestao = false;
		this.exibirNotaQuestao = true;
        this.exibirImagens = false;
        this.formatoLetraAlternativa = "X";
        this.contadorExibir = true;
        this.contadorTempoMaximoSegundos = 0;
        this.contadorTempoAtualSegundos = 0;
        this.contadorSeparadorHora = ":";
        this.contadorSeparadorMinuto = ":";
        this.contadorSeparadorSegundo = " ";
        this.contadorLegenda = "";
        this.totalCaracteres = 4000;
        this.alturaTextArea = 5;
        this.larguraTextArea = null;
        this.exibirNrLinhaTextArea = false;
        this.capturarParagrafoTextarea = false;
        this.desativarVerificacaoOrtografica = false;
        this.gravarAudioVideo = false;
        this.intervaloFotoAuditoria = 60;

        //Parametros de consumo e envio
        this.ajaxUrlConsumo = null;
        this.ajaxUrlSalvar = null;
        this.ajaxUrlFinalizar = null;
        this.urlCancelar = null;
        this.ajaxMetodoHttpSalvar = 'PUT';
        this.ajaxMetodoHttpFinalizar = 'GET';
        this.mensagemErroBuscarQuestao = "Nenhuma questão encontrada";
        this.idTipoLayout = 1;
        this.possuiQuestoesAdicionais = false;

        //Parametros de renderizacao
        this.idObjDOM = null;
        this.idObjDOMMensagem = "mensagem";
        this.visualizacaoAmigavel = false;
        this.exibirTitulo = true;
        this.exibirPeso = false;
        this.salvarNoClick = true;
        this.exibindoGabarito = false;
        this.exibirPaginacao = true;
        this.intervaloAtualizacaoContador = 600000;
        this.exibirRevisaoQuestao = false;
        this.exibirBotaoEnviarAnexo = true;
        this.exibirConfirmacaoEntrega = true;
        this.exibirSucessoAvaliacaoEntrega = true;
        this.exbirNomeDisciplinaQuestao = false;
        this.extensoesPermitidas = ['gif', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'pdf', 'odt', 'html', 'txt', 'ipt', 'idw'];
        this.ehEnquete = false;
        this.separarPorTema = false;
        this.exibirTemasEmAbas = false;
        this.objAvaliacaoUsuario = null;
        this.videoSianee = false;

        //Botoes
        this.botaoCancelar = false;
        this.botaoSalvar = false;
        this.botaoFinalizar = true;
        this.botaoAvancar = true;
        this.botaoVoltar = true;
        this.botaoSalvarTexto = "Salvar";
        this.botaoFinalizarTexto = "Entregar Avaliacao";
        this.botaoCancelarTexto = "Cancelar";
        this.linkExibirVideoSianee = "Exibir vídeo sianee";
        this.linkOcultarVideoSianee = "Ocultar vídeo";

        //Ações (As fnAntes são funções que devem retornar TRUE para executar a ação)
        this.fnAntesCancelar = null;
        this.fnAntesSalvar = null;
        this.fnAposSalvar = null;
        this.fnAntesFinalizar = null;
        this.fnAposFinalizar = null;
        this.fnSucessoConsumo = null;
        this.fnErroConsumo = null;
        this.fnAposRenderizar = null;
        this.fnBlurAlternativa = null;

        //Parametros para interpretar o JSON
        this.atributoJSONidHistorico = 'id';
        this.atributoJSONTituloQuestao = 'Questão';
        this.atributoJSONOrdem = 'ordem'
        this.atributoJSONidQuestao = 'idQuestao';
        this.atributoJSONLista = 'avaliacaoUsuarioHistoricos'
        this.atributoJSONQuestao = 'questao';
        this.atributoJSONVideoSianee = 'videoSianee';
        this.atributoJSONComando = 'comando';
        this.atributoJSONResposta = 'resposta';
        this.atributoJSONIdAlternativa = 'id';
        this.atributoJSONAlternativaMarcada = 'idQuestaoAlternativa';
        this.atributoJSONAlternativas = 'alternativas';
        this.atributoJSONidTema = 'idEnqueteBloco';
        this.atributoJSONTema = 'enqueteBloco';
        this.atributoJSONAgrupar = 'agrupar';
        this.atributoJSONIdAgrupadorQuestoes = 'idEnqueteConfiguracao';
        this.atributoJSONAgrupadoresQuestoes = ['idQuestao', 'idEnqueteBloco'];
        this.atributoJSONTituloAgrupadorQuestoes = 'nomeSalaVirtual';
        this.atributoJSONAgrupadorQuestaoMultiplaEscolha = ['idQuestao'];
        this.atributoJSONAlternativaAtributos = 'questaoAlternativaAtributos';
        this.atributoJSONAlternativaAtributoTexto = 'idAtributo';
        this.atributoJSONAlternativaAtributoTextoQuestao = 1;
        this.atributoJSONAlternativaAtributoTextoValor = 'valor';
        this.atributoJSONAlternativaAtributoComentario = 4;
        this.atributoJSONAlternativaAtributoCorreta = 5;
        this.atributoJSONAlternativaAtributoGabaritoTabela = 12;
        this.atributoJSONAlternativaAtributoPermiteComentario = 15;
        this.atributoJSONAlternativaAtributoTipoEscala = 17;
		this.atributoJSONAlternativaAtributoTipoEscalaTrabalho = 20;
        this.atributoJSONAlternativaAtributoTipoExibicaoEscala = 18;
        this.atributoJSONAlternativaAtributoTipoLayoutEscala = 19;
        this.atributoJSONAlternativaQuestaoTabelaRespostaAluno = 'alternativaAluno';
        this.atributoJSONAlternativaAtributoCorretaValor = 'true';
        this.atributoJSONAlternativaAtributoPesoAlternativa = 2;
        this.atributoJSONAlternativaAtributoPorcentagemAlternativa = 22;
        this.atributoJSONAlternativaAtributoValorMaximoAlternativa = 21;

        this.atributoJSONTipoQuestao = 'idQuestaoTipo';
        this.atributoJSONTipoQuestaoObjetiva = 1;
        this.atributoJSONTipoQuestaoDiscursiva = 2;        
        this.atributoJSONTipoQuestaoTabela = 5;
        this.atributoJSONTipoQuestaoObjetivaDescricao = 6;
        this.atributoJSONTipoQuestaoMultiplaEscolha = 7;
        this.atributoJSONTipoQuestaoEscala = 9;
        this.atributoJSONTipoQuestaoCorrecaoTrabalho = 3;
        this.atributoJSONTipoQuestaoCorrecaoTrabalhoHoras = 4;
        this.atributoJSONTipoQuestaoEscalaTrabalho = 11;
        this.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasPorcentagem = 13;
        this.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasValorMaximo = 12;
        this.atributoJSONQuestaoEtiquetasAgrupador = "questaoEtiquetas";
        this.atributoJSONQuestaoEtiquetasFilha = "questaoEtiquetas";
        this.atributoJSONQuestaoEtiquetasValor = "valorEtiqueta";
        this.atributoJSONQuestaoEtiquetasIdQuestaoTipoRotuloOrientacao = 6;
        this.atributoJSONPercentualAcerto = "percentualAcerto";
        this.atributoJSONComentarioCorrecao = "comentarioCorrecao";
        this.atributoJSONPercentualAcerto = "percentualAcerto";
        this.atributoJSONGrauDificuldade = "nomeQuestaoGrauDificuldade";
        this.atributoJSONOrdemBancoQuestao = 'ordemBancoQuestao';
        // ==============================================



        /************************************************
        * VARIAVEIS INTERNAS
        ************************************************/
        try{
            clearInterval(UNINTER.intervaloAutomaticoAvaliacao);
            clearInterval(UNINTER.intervaloContadorAvaliacao);
            clearTimeout(UNINTER.intervaloTimeoutAvaliacao);
            console.info("Clear Interval OK");
        }catch(e){
            console.error("Clear Interval ERROR");
        }

        UNINTER.intervaloContadorAvaliacao = null;
        UNINTER.intervaloTimeoutAvaliacao = null;
        UNINTER.intervaloAutomaticoAvaliacao = null;

        var questoes = this;
        var tempoAtual = 0;
        var auditoria = 0;
        var tempoMaximo = 0;
        var ordemAtual = null;
        var posicaoAtualX = null;
        var posicaoAtualY = null;
        var retornoConsumo = null;
        var listaJSON = null;
        var listaJSONExtras = null;
        var listaJSONtmp = null;
        var listaEscalaLegenda = {};
        var listaEscala = {};
        var temas = null;
        var totalQuestoes = 0;
        var inicializarSlider = false;
        var inicializarSelect2 = false;
        var _idMensagem = null;
        var $idMensagem = null;
        var $idObjDOM = null;
        var $seletorEventosSlider = null;
        var $seletorEventosRadio = null;
        var $seletorEventosRadioComentario = null;
        var $seletorEventosInput = null;
        var $seletorEventosSelect = null;
        var $seletorEventoNavegacao = null;
        var $seletorEventoNavegacaoTema = null;
        var $seletorEventoNavegacaoTemaAvancar = null;;
        var $seletorEventoNavegacaoTemaVoltar = null;
        var $seletorEventoVoltar = null;
        var $seletorEventoAvancar = null;
        var dataUltimaAtualizacaoServer = null;
        var letrasAlternativas = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        var extensaoImagens = ["jpg", "jpeg", "png", "bmp", "gif"];
        var recordMonitoria = null;
        // ==============================================




        /************************************************
         * METODOS PÚBLICOS
         ************************************************/
        this.getRetornoAjax = function () {
            return retornoConsumo;
        };

        this.getListaJSON = function () {
            return listaJSON;
        };

        this.setListaJSON = function (lista) {
            listaJSON = lista;
        };

        this.setMensagem = function (params) {

            if (params.type == void (0) || params.type == null) { params.type = 'danger'; }
            if (params.strong == void (0) || params.strong == null) { params.strong = ''; }

            var opcoes = {
                body: params.body,
                strong: params.strong,
                type: params.type,
                appendTo: "#" + questoes.idObjDOMMensagem
            }
            $("#" + questoes.idObjDOMMensagem).empty();
            UNINTER.flashMessage(opcoes);
            UNINTER.Helpers.animatedScrollTop();
        };

        this.getTotalQuestoes = function () {
            return totalQuestoes;
        };

        this.setTotalQuestoes = function (total) {
            if (total == void (0)) {
                totalQuestoes = listaJSON.length;
            } else {
                totalQuestoes = total;
            }

        };

        this.getAlternativaCorreta = function (objJSONAlternativas) {
            var idAlternativa = null;
            $.each(objJSONAlternativas, function (i, item) {
                strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoCorreta + ', "valor": "true"}';
                var objAtributoCorretaAlternativa = _.findWhere(item.questaoAlternativaAtributos, JSON.parse(strTemp));
                if (objAtributoCorretaAlternativa != void (0)) {
                    idAlternativa = item.id;
                }
            });
            return idAlternativa;
        };

        this.render = function () {
            
            switch(questoes.idTipoLayout)
            {
                case 2:
                    if (questoes.objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 5) {
                        questoes.renderLayoutEscolha();
                    } else {
                        questoes.renderLayoutPadrao();
                    }
                    
                    break;
                case 1:
                case 3:
                default:
                    questoes.renderLayoutPadrao();
                    break;

            }

            if (questoes.gravarAudioVideo) {
                $("#datasAvaliacao").append('<div id="carregaAquiId" style="display: none;"></div>');

                try {
                    //Se tem dados da gravação em sessão é porque atualizou a página ou algo assim, então grava antes de começar uma nova.
                    var gravacaoVideoIdAvaliacaoUsuario = UNINTER.sessionStorage.get("gravacaoVideoIdAvaliacaoUsuario");
                    var gravacaoVideoMetodoGravacao = UNINTER.sessionStorage.get("gravacaoVideoMetodoGravacao");
                    var gravacaoVideoPicotesFolder = UNINTER.sessionStorage.get("gravacaoVideoPicotesFolder");

                    if (gravacaoVideoIdAvaliacaoUsuario != null &&
                        gravacaoVideoMetodoGravacao != null &&
                        gravacaoVideoPicotesFolder != null) {

                        persistirGravacao(gravacaoVideoPicotesFolder, gravacaoVideoIdAvaliacaoUsuario, gravacaoVideoMetodoGravacao);
                    }

                    GravarAudioVideo();
                } catch (e) {
                    console.error('Erro ao iniciar gravação de audio e vídeo');
                    console.error(e);
                }
            }
        };

        this.renderLayoutPadrao = function () {
            
            this.construtor();
            if (listaJSON == null || listaJSON == void (0)) {
                buscarQuestoes();
            }

            ajustarListaJSONQuestoesTabela();
            ajustarListaJSONQuestoesMultiplaEscolha();
            ajustarListaJSONQuestoesEscolhidas();

            if (totalQuestoes <= 0) {
                
                if (questoes.fnErroConsumo == null || (retornoConsumo != void (0) && retornoConsumo.status == 200)) {
                    var params = {
                        body: questoes.mensagemErroBuscarQuestao,
                        strong: "Não foi possível gerar a avaliação."
                    }
                    questoes.setMensagem(params);

                    var $objRenderizar = $("<div>").addClass("question");
                    questoes.botaoAvancar = false;
                    questoes.botaoVoltar = false;
                    $objRenderizar.append(renderBotoes());
                    $($idObjDOM).html($objRenderizar);

                    var params = {
                        body: "Não foi possível gerar a avaliação. Contate a tutoria do curso.",
                        strong: ""
                    }
                    questoes.setMensagem(params);

                    eventos();
                }

                return;
            }

            if (questoes.visualizacaoAmigavel == true) {
                carregarDefaultVisualizacaoAmigavel();
            }

            var $objRenderizar = $("<div>").addClass("question");
            var $objPaginacao = renderPaginacao();

            $objRenderizar.append(renderContador());

            if (questoes.separarPorTema == false) {
                $.each(listaJSON, function (i, item) {
                    var $objContainerQuestao = questoes.renderContainerQuestao(item);
                    $objContainerQuestao.append(renderTitulo(item.ordem == void (0) ? (i + 1) : item.ordem, item));
                    
                    $objContainerQuestao.append(questoes.renderQuestao(item));
                    $objContainerQuestao.append(questoes.renderComando(item));
                    $objContainerQuestao.append(questoes.renderAlternativas(item));
                    $objContainerQuestao.append(questoes.renderBlocoAnexosInseridos(item, true));
                    $objContainerQuestao.append(questoes.renderBotaoAnexo(item));
                    $objContainerQuestao.append(questoes.renderSeparador());
                    $objRenderizar.append($objContainerQuestao);
                    $objPaginacao.append(renderItemPaginacao(item[questoes.atributoJSONOrdem], item[questoes.atributoJSONidQuestao]));
                });
            }
            else {

                //Neste formato não pode ter paginação:
                questoes.exibirPaginacao = false;

                //Localizamos os temas:
                temas = _.uniq(listaJSON, false, function (item, key) {
                    return item[questoes.atributoJSONidTema];
                });

                //Separar por Abas também?
                if (questoes.exibirTemasEmAbas == true) {
                    $objRenderizar.append(questoes.renderTemaAba(temas));
                    $objRenderizar.append(renderContainer());
                }

                $.each(temas, function (i, itemTema) {

                    //Busca as questoes:
                    var questoesTema = $(listaJSON).filter(function () {
                        return this[questoes.atributoJSONidTema] == itemTema[questoes.atributoJSONidTema];
                    });

                    //Renderiza o tema:
                    var tema = questoes.renderTema(itemTema);
                    tema.css('width', '100%').css('margin-bottom', '15px').css('overflow-y', 'hidden');
                    tema.find('#' + questoes.atributoJSONidTema + itemTema[questoes.atributoJSONidTema]).append($('<h4>', { class: 'sessaoAba', tabindex: "0"}).html('Sessão: ').append(itemTema[questoes.atributoJSONTema])).append($('<hr>'));

                    if (questoesTema[0][questoes.atributoJSONAgrupar] == true) {

                        //Renderiza as questões em formato tabular:
                        tema.find('#' + questoes.atributoJSONidTema + itemTema[questoes.atributoJSONidTema]).append(renderQuestoesAgrupadas(questoesTema));

                    } else {

                        //Renderiza as questões de forma linear dentro da aba.
                        $.each(questoesTema, function (i, item) {
                            var $objContainerQuestao = questoes.renderContainerQuestao(item);
                            $objContainerQuestao.append(renderTitulo(item.ordem == void (0) ? (i + 1) : item.ordem, item));
                            $objContainerQuestao.append(questoes.renderQuestao(item));
                            $objContainerQuestao.append(questoes.renderComando(item));
                            $objContainerQuestao.append(questoes.renderAlternativas(item));
                            $objContainerQuestao.append(questoes.renderBlocoAnexosInseridos(item, true));
                            $objContainerQuestao.append(questoes.renderBotaoAnexo(item));
                            $objContainerQuestao.append(questoes.renderSeparador());

                            //tema.find('.panel-body').append($objContainerQuestao);

                            tema.find('#' + questoes.atributoJSONidTema + itemTema[questoes.atributoJSONidTema]).append($objContainerQuestao);
                        });
                    }

                    $objRenderizar.append(tema);

                });

            }


            if (questoes.exibirPaginacao == true) {
                $objRenderizar.append($objPaginacao);
            }

            if (questoes.ehEnquete == true && questoes.separarPorTema == true)
            {
                $objRenderizar.append(renderNavegacaoAbas());
            }

            $objRenderizar.append(renderBotoes());
            $($idObjDOM).html($objRenderizar);
            final();
        };

        this.renderLayoutEscolha = function () {
            $("#containerCabecalho").hide();
            var exibirTodasQuestoesOriginal = questoes.exibirTodasQuestoes;

            questoes.exibirTodasQuestoes = true;

            this.construtor();
            if (listaJSON == null || listaJSON == void (0)) {
                buscarQuestoes();
            }
            if (((listaJSON == void (0) || listaJSON.length == 0) || (totalQuestoes <= 0 && questoes.fnErroConsumo == null)) && retornoConsumo!= void(0) && retornoConsumo.status == 200)
            {

                var $objRenderizar = $("<div>").addClass("question");
                questoes.botaoAvancar = false;
                questoes.botaoVoltar = false;
                $objRenderizar.append(renderBotoes());
                $($idObjDOM).html($objRenderizar);

                var params = {
                    body: "Não foi possível gerar a avaliação. Contate a tutoria do curso.",
                    strong: ""
                }
                questoes.setMensagem(params);

                eventos();
                return;

            }

            //if (totalQuestoes <= 0 && questoes.fnErroConsumo == null) {
            //    var params = {
            //        body: questoes.mensagemErroBuscarQuestao,
            //        strong: "Não foi possível gerar a avaliação."
            //    }
            //    questoes.setMensagem(params);
            //    return;
            //}

            //verificamos se há questões para serem escolhidas, senão, troca a exibiçõa para exibição padrão:
            //var itensSemEscolha = _.where(listaJSON, { idAvaliacaoUsuarioHistoricoTipoSorteio: 3 });

            var salas = [];

            //Renderiza a tela de escolha de questões:
            $(questoes.objAvaliacaoUsuario.salas).each(function (i, item) {
                item.questoes = _.where(listaJSON, { idBancoQuestao: item.idBancoQuestaoSalaVirtual });
                if(item.questoes != void(0) && item.questoes.length > 0 )
                {
                    salas.push(item);
                }
            });

            questoes.objAvaliacaoUsuario.salas = salas;

            var template = $("#templateEscolhaQuestao").html();

            var $objRenderizar = $("<div>").addClass("question");
            $objRenderizar.append(renderContador());

            $objRenderizar.append(_.template(template, { salas: questoes.objAvaliacaoUsuario.salas, nome: UNINTER.Helpers.toTitleCase(UNINTER.StorageWrap.getItem("user").nome.split(' ')[0]) }));

            $($idObjDOM).html($objRenderizar);

            ajustarQuantidadeQuestoesEscolha();

            //Eventos esclusivos deste layput:
            $(".btn-escolha-questao .btn-success").off('click').on('click', function (e) {
                alterarTipoSorteio(e, 4);
            });

            $(".btn-escolha-questao .btn-danger").off('click').on('click', function (e) {
                alterarTipoSorteio(e, 5);
            });

            $('.btn-ok').off('click').on('click', function (e) {
                var el = e.currentTarget;
                var objMsgSala = $(el).closest('[data-msg]');
                var idSala = objMsgSala.data('msg');

                UNINTER.Helpers.animatedScrollTop();

                objMsgSala.fadeOut(500, function () {

                    $('.panel[data-sala="' + idSala + '"]').fadeIn(500, function () {
                        UNINTER.viewGenerica.setPlaceholderHeight();
                    });

                });

            });

            $('.btn-next').off('click').on('click', function (e) {
                
                var el = e.currentTarget;
                var objPanel = $(el).closest('.panel[data-sala]');
                var idSalaAtual = objPanel.data('sala');
                //var idSalaAtualProximo = objPanel.parent().find('.panel:not([data-sala="' + idSalaAtual + '"])').data('sala');
                var ix = objPanel.parent().find('.panel').index(objPanel);
                var idSalaAtualProximo = objPanel.parent().find('.panel').eq(ix + 1).data('sala');


                var sala = _.findWhere(questoes.objAvaliacaoUsuario.salas, { id: idSalaAtual });
                if(sala.restante > 0)
                {
                    questoes.setMensagem({ type: 'danger', body: 'Há questões para serem escolhidas ainda.' });
                    return;
                }
                else if (sala.restante < 0)
                {
                    questoes.setMensagem({ type: 'danger', body: 'Muitas questões selecionadas, por favor confira as quantidades necessárias por disciplina.' });
                    return;
                }

                //var idSalaAtualProximo = objPanel.next().data('sala');

                UNINTER.Helpers.animatedScrollTop();
                objPanel.fadeOut(500, function () {

                    $('[data-msg="' + idSalaAtualProximo + '"]').fadeIn(500, function () {
                        UNINTER.viewGenerica.setPlaceholderHeight();
                    });

                });


            });

            $("#responderQuestoes").off('click').on('click', function (e) {

                var restante = 0;

                //Tudo ok?
                ajustarQuantidadeQuestoesEscolha();
                $.each(questoes.objAvaliacaoUsuario.salas, function (i, item) {
                    restante += item.restante;
                });

                //Se não retornou a quantidade (não tinha sala para validar) ou retornou 0 (tudo selecionado) faz 
                if (restante > 0) {
                    questoes.setMensagem({ type: 'danger', body: 'Há questões para serem escolhidas ainda.' });
                    return;
                } else if(restante < 0) {
                    questoes.setMensagem({ type: 'danger', body: 'Muitas questões selecionadas, por favor confira as quantidades necessárias por disciplina.' });
                    return;
                }

                UNINTER.Helpers.ajaxRequest({
                    url: UNINTER.AppConfig.UrlWs('BQS') + 'AvaliacaoUsuario/' + questoes.objAvaliacaoUsuario.id + '/ValidarTipoSorteio',
                    async: true,
                    successCallback: function (data) {

                        //Erro ao salvar?
                        if (data != void (0) && data.mensagem != null && data.mensagem.tipo !== 1) {
                            questoes.setMensagem({
                                type: 'danger',
                                strong: 'Não foi possível validar as questões escolhidas. ',
                                body: data.mensagem.mensagem
                            });
                        } else {
                            ajustarListaJSONQuestoesEscolhidas();
                            questoes.exibirTodasQuestoes = exibirTodasQuestoesOriginal;
                            questoes.objAvaliacaoUsuario.idAvaliacaoUsuarioStatus = 4;
                            $("#containerCabecalho").show();
                            questoes.render();
                        }
                    },
                    errorCallback: function (data) {
                        questoes.setMensagem({ type: 'danger', body: 'Não foi possível validar a quantidade de questões para iniciar a prova.' });
                    }
                });

            });

            $('[data-msg]:first').fadeIn(500, function () {
                UNINTER.viewGenerica.setPlaceholderHeight()
            });

            

            setTimeout(function () {
                UNINTER.viewGenerica.setPlaceholderHeight();
            },500);
            
            final();
        };

        this.setAlternativaEscolhida = function (idQuestao, idAlternativa, idHistorico) {
            var $selectorAlternativas = 'input[type=radio][data-idquestao="' + idQuestao + '"]';
            var $selectorAlternativa = 'input[type=radio][data-idalternativa="' + idAlternativa + '"]';

            if(idHistorico > 0 && questoes.ehEnquete == true)
            {
                $selectorAlternativa += '[data-idhistorico="' + idHistorico + '"]';
                $selectorAlternativas += '[data-idhistorico="' + idHistorico + '"]';
            }

            $($selectorAlternativas).parent().parent().removeClass("question-choice-active");

            
            var $objManipular = $("span[data-idquestao=" + idQuestao + "]");
            var letra = $($selectorAlternativa).data("letra");

            $objManipular.html(letra);

            $($selectorAlternativa).parent().parent().addClass("question-choice-active");
            $($selectorAlternativa).prop("checked", true);
        };

        this.setQuestaoResposta = function (idQuestao) {
            var $objManipular = $("span[data-idquestao=" + idQuestao + "]");
            var $objIcone = $("<icon>").addClass("icon-ellipsis-h");

            $objManipular.html($objIcone);
            //$objManipular.parent().find('button').removeClass("btn-default").addClass('btn-primary');
        };

        this.unsetAlternativaEscolhida = function (idQuestao, idAlternativa) {

            var $selectorAlternativa = 'input[type=radio][data-idalternativa="' + idAlternativa + '"]';
            var $objManipular = $("#alternativaEscolhida" + idQuestao);

            $($selectorAlternativa).parent().removeClass("text-primary");
            $($selectorAlternativa).parent().css("font-weight", "normal");

            $objManipular.html("(?)");
            $objManipular.parent().find('button').removeClass("btn-primary").addClass('btn-default');

            var questao = getObjQuestao(idQuestao);
            questao[questoes.atributoJSONAlternativaMarcada] = null;

        };

        this.unsetQuestaoResposta = function (idQuestao) {
            var $objManipular = $("span[data-idquestao=" + idQuestao + "]");
            $objManipular.html("(?)");
            $objManipular.parent().find('button').removeClass("btn-primary").addClass('btn-default');
            var questao = getObjQuestao(idQuestao);
            questao[questoes.atributoJSONResposta] = null;
        };

        this.setLayout = function (ordem) {

            $("#" + questoes.idObjDOM).find('video').remove();
            $("#" + questoes.idObjDOM).find('[data-href]').html(questoes.linkExibirVideoSianee);

            //$("#viewavaliacaousuariohistorico #mensagem").empty();
            $("#" + questoes.idObjDOMMensagem).empty();
            if (ordem == void (0) || ordem == null) {
                ordem = 1;
            }

            if (ordemAtual !== void (0) && ordemAtual !== null) {
                var objQuestao = getObjQuestaoAtual();
                if (objQuestao.salvo == false && (objQuestao[questoes.atributoJSONAlternativaMarcada] > 0 || $("#anexo" + objQuestao.idQuestao + " .uploadArquivo").length > 0 || (objQuestao[questoes.atributoJSONResposta] != null && objQuestao[questoes.atributoJSONResposta].length > 0)))
                {
                    var status = putQuestao(objQuestao);
                    if (status == false) {
                        UNINTER.Helpers.animatedScrollTop();
                        return;
                    }
                }
            }

            ordemAtual = ordem;

            
            $("#btnQuestaoAnterior").hide();
            $("#btnQuestaoProxima").hide();

            if (questoes.exibirPaginacao == true) {
            if (ordemAtual <= totalQuestoes && ordemAtual > 1 && totalQuestoes > 1) {
                $("#btnQuestaoAnterior").show();
            }

            if (ordemAtual < totalQuestoes && totalQuestoes > 1) {
                $("#btnQuestaoProxima").show();
            }
            }

            if (questoes.exibirTodasQuestoes == true) {
                $("div[data-ordem]").removeClass("hide").addClass("show");
                $("hr").removeClass("hide").addClass("show");
            }
            else {
                $("div[data-ordem]").removeClass("show").addClass("hide");
                $("hr").removeClass("show").addClass("hide");

                $("div[data-ordem=" + ordem + "]").removeClass("hide").addClass("show");

                //$("button[data-ordem]").addClass("btn-default").removeClass("btn-primary").css("background-color", "#eee").css("color", "#333");
                //$("button[data-ordem=" + ordem + "] ").addClass("btn-primary").removeClass("btn-default").css("background-color", "#A0A0A0").css("color", "#FFF");

                $("button[data-ordem]").css("background-color", "#eee").css("color", "#333");
                $("button[data-ordem=" + ordem + "] ").css("background-color", "#A0A0A0").css("color", "#FFF");

                //Altera o foco para os leitores de tela:
                $($idObjDOM + ' div[data-ordem].show:first span.title:first').focus();


            }
            inicializarEditorTextoAvancado(".show textarea", null, true);
            UNINTER.viewGenerica.setPlaceholderHeight();
            UNINTER.Helpers.animatedScrollTop();
        };

        this.gabarito = function () {

            forcarParadaContador();
            questoes.botaoAvancar = false;
            questoes.botaoVoltar = false;
            questoes.exibindoGabarito = true;

            

            if (questoes.objAvaliacaoUsuario != null && questoes.objAvaliacaoUsuario.salas != void (0) && questoes.objAvaliacaoUsuario.salas.length > 0)
            {
                questoes.exbirNomeDisciplinaQuestao = true;
            }

            questoes.construtor();
            if (listaJSON == null || listaJSON == void (0)) {
                buscarQuestoes();
            }


            ajustarListaJSONQuestoesTabela();
            ajustarListaJSONQuestoesEscolhidas();

            var $objGabarito = renderContainer();
            $objGabarito.addClass("question");

    

            $.each(listaJSON, function (i, item) {
                
                $objGabarito.append(questoes.gabaritoQuestao(item, i));
                $objGabarito.append(questoes.renderBlocoAnexosInseridos(item, false));
                $objGabarito.append(questoes.renderSeparador());
            });

            $($idObjDOM).html($objGabarito);
            forcarParadaContador();
            UNINTER.viewGenerica.setPlaceholderHeight();
            final();
        };

        // ==============================================




        /************************************************
         * METODOS PRIVADOS
         ************************************************/
        this.construtor = function () {
            forcarParadaContador();
            removerEventos();
            UNINTER.viewGenerica.getEditorTextoAvancado();
            $idObjDOM = "#" + questoes.idObjDOM;
            _idMensagem = questoes.idObjDOM + "Mensagem";
            $idMensagem = "#" + _idMensagem;
            
            if (!questoes.exibindoGabarito && !questoes.visualizacaoAmigavel) {
                //$seletorEventosRadio = $idObjDOM + ' tr.question-choice';
                $seletorEventosRadio = $idObjDOM + ' tr td.question-choice-input';
                $seletorEventosEscala = $idObjDOM + ' input[data-escala]';
                $seletorEventosRadioComentario = $idObjDOM + ' tr td .question-choice-body input[type="text"]';
                $seletorEventosTextArea = $idObjDOM + ' textarea';
                $seletorEventosInputNumber = $idObjDOM + ' input[type=number]';
                $seletorEventosInput = $idObjDOM + ' input[type=text]';
                $seletorEventoNavegacao = $idObjDOM + " td button";
                $seletorEventoVoltar = $idObjDOM + " i.icon-arrow-left";
                $seletorEventoAvancar = $idObjDOM + " i.icon-arrow-right";
                $seletorEventosSlider = $idObjDOM + " input[type='text'].init-slider";
                $seletorEventosSelect = $idObjDOM + " select[data-idquestao]";
                $seletorEventoNavegacaoTema = $idObjDOM + ' .nav.navbar-nav li';
                $seletorEventoNavegacaoTemaAvancar = $idObjDOM + ' .next';
                $seletorEventoNavegacaoTemaVoltar = $idObjDOM + ' .previous';
            }


            if (questoes.contadorTempoAtualSegundos != void (0) && questoes.contadorTempoAtualSegundos != null) {
                tempoAtual = questoes.contadorTempoAtualSegundos * 1000;
            }

            if (questoes.visualizacaoAmigavel == true) {				
                carregarDefaultVisualizacaoAmigavel();
            }
        };

        var carregarDefaultVisualizacaoAmigavel = function () {
            //questoes.contadorExibir = false;
            questoes.botaoCancelar = false;
            questoes.botaoSalvar = false;
            questoes.botaoFinalizar = false;
            questoes.botaoVoltar = false;
            questoes.botaoAvancar = false;
            questoes.exibirPeso = true;
            questoes.exibirPaginacao = false;
            //questoes.exibirTitulo = false;
        };

        var final = function () {
            setQuestoesRespondidas();
            questoes.setAlternativasMarcadas();
            setRespostasComAnexo();
            questoes.setLayout();

            tempoMaximo = (questoes.contadorTempoMaximoSegundos * 1000);
            //if (questoes.contadorTempoMaximoSegundos != void (0) && questoes.contadorTempoMaximoSegundos > 0) {
            //    UNINTER.intervaloTimeoutAvaliacao = setTimeout(tempoEsgotado.bind(this), ((questoes.contadorTempoMaximoSegundos - questoes.contadorTempoAtualSegundos) * 1000));
            //}

            UNINTER.intervaloContadorAvaliacao = setInterval(atualizarContador.bind(this), 1000);
            UNINTER.intervaloAutomaticoAvaliacao = setInterval(putQuestaoPrevinir.bind(this), questoes.intervaloAtualizacaoContador);

            executarMetodoPersonalizado(questoes.fnAposRenderizar);

            if (($("table.btn-group-alt").width() > 800)) {
                $("table.btn-group-alt").addClass("btn-group-alt-wide");
            }
            inicializarEditorTextoAvancado("textarea", null, true);

            if (questoes.exibirRevisaoQuestao) {
                eveRevisao();
            }

            eveHistoricoRevisao();

            if (questoes.visualizacaoAmigavel != true && questoes.exibindoGabarito != true) {
                eventos();
            }
            ajustarTamanhoDiv();

            UNINTER.viewGenerica.getMathJax();

            //Altera o foco para os leitores de tela:
            $($idObjDOM + ' div[data-ordem].show:first span.title:first').focus();


            //Inicializa a escla:
            if (inicializarSlider === true)
            {
                try {
                    $($seletorEventosSlider).slider('destroy');
                } catch (e) {
                    debugger;
                };

                try {
                    //Usa settimeout para ter certeza que o elemento já estará na tela. Caso contrário dá zica nos labels.
                    setTimeout(function () {
                        $($seletorEventosSlider).slider({ formatter: formatterSlider })
                        eventosSlider();
                    }, 20);
                    //Acessibilidade;
                    setTimeout(function () {
                        $('.slider').attr('tabindex', 0).attr('title', 'Tabela deslizável: utilize setas para direita ou esquerda para alterar o valor');
                    }, 500);
                } catch (e) {
                    debugger;
                };
            }

            if(questoes.ehEnquete == true && questoes.separarPorTema == true)
            {
                exibirOcultarAvancarVoltarTab();
            }

            if(inicializarSelect2 === true)
            {
                try { $('select[data-idquestao]').select2(); } catch (e) { };
            }

            if (questoes.separarPorTema == true && questoes.exibirTemasEmAbas == true)
            {
                $($seletorEventoNavegacaoTema + ':first').trigger('click');
            }
            dataUltimaAtualizacaoServer = 0;
            putQuestaoPrevinir();

            //Para cada imagem desenhada, coloca escuta para quando terminar o render recalcular o tamanho da tela.
            try {
                $($idObjDOM + " img").one("load", function () {
                    setTimeout(UNINTER.viewGenerica.setPlaceholderHeight, 800);
                }).each(function () {
                    if (this.complete) $(this).load();
                });

                setTimeout(function () {
                    UNINTER.viewGenerica.setPlaceholderHeight();
                }, 5000);

            } catch (e) { };

        };

        var ajustarListaJSONQuestoesTabela = function () {

            listaJSONtmp = listaJSON;

            //S for questão do tipo tabela, precisa ajustar, pois chegará mais de um registro para a mesma questão:
            var listaJSONajustar = [];
            $.each(listaJSON, function (i, item) {

                if (item[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoTabela) {

                    var questaoTMP = $(listaJSONajustar).filter(function (i, el) {
                        return el.idQuestao == item.idQuestao;
                    });

                    if (questaoTMP == null || questaoTMP == void (0) || questaoTMP.length == 0) {
                        item[questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno] = []
                        item[questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno].push(item);
                        listaJSONajustar.push(item);
                    } else {
                        questaoTMP[0][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno].push(item);
                        questaoTMP[0][questoes.atributoJSONAlternativas].push(item[questoes.atributoJSONAlternativas][0]);
                    }
                } else {
                    listaJSONajustar.push(item);
                }
            });

            listaJSON = listaJSONajustar;
            totalQuestoes = listaJSON.length;

        };

        var ajustarListaJSONQuestoesMultiplaEscolha = function () {

            listaJSONtmp = listaJSON;

            //S for questão do tipo multipla escola, precisa ajustar, pois chegará mais de um registro para a mesma questão:
            var listaJSONajustar = [];

            $.each(listaJSON, function (i, item) {

                if (item[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoMultiplaEscolha && item.alternativasSelecionadas == void(0)) {

                    var objTeste = {};

                    $.each(questoes.atributoJSONAgrupadorQuestaoMultiplaEscolha, function (i, col) {
                        objTeste[col] = item[col];
                    });

                    var questao = _.findWhere(listaJSONajustar, objTeste);
                    
                    if (questao == void (0)) {

                        item[questoes.atributoJSONidHistorico + 'Pai'] = item.id;

                        var qst = _.clone(item);
                        //var qst = item;
                        //qst.push(item);
                        qst.alternativasSelecionadas = [];
                        qst.alternativasSelecionadas.push(item);
                        qst[questoes.atributoJSONAlternativaMarcada] = null;
                        listaJSONajustar.push(qst);
                    }
                    else {
                        item[questoes.atributoJSONidHistorico + 'Pai'] = questao.id;
                        questao.alternativasSelecionadas.push(item);
                    }


                } else {
                    listaJSONajustar.push(item);
                }
            });

            listaJSON = listaJSONajustar;
            totalQuestoes = listaJSON.length;

        };

        var ajustarListaJSONQuestoesEscolhidas = function () {
            
            var nr = 1;
            var nrExtra = 1;
            //var nrQuestoesEscolhidas = 0;
            var listaJSONtmp = [];
            listaJSONExtras = [];

            $.each(listaJSON, function (i, item) {
                
                switch (item.idAvaliacaoUsuarioHistoricoTipoSorteio)
                {
                    case 1:
                    case 2:
                        item.ordem = nr;
                        nr++;
                        listaJSONtmp.push(item);
                        break;
                    case 4:
                        item.ordem = nr;
                        nr++;
                        listaJSONtmp.push(item);
                        //nrQuestoesEscolhidas++;
                        break;
                    case 6:

                        if (questoes.exibindoGabarito == true) {
                            item.ordem = nr;
                            nr++;
                            listaJSONtmp.push(item);
                        } else {
                            item.ordem = nrExtra;
                            nrExtra++;
                            listaJSONExtras.push(item);
                        }
                        break;
                    case 3:
                    case 5:
                        if (questoes.objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 5)
                        {
                            listaJSONtmp.push(item);
                        }
                        break;
                    default:
                        listaJSONtmp.push(item);
                        break;
                }
            });
            
            //if(nrQuestoesEscolhidas > 0)
            //{
            //    listaJSON = listaJSONtmp;
            //}

            if (questoes.objAvaliacaoUsuario != void(0) && questoes.objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 6 && questoes.exibindoGabarito == false) {
                listaJSON = listaJSONExtras;
            } else {
                listaJSON = listaJSONtmp;
            }
            
            totalQuestoes = listaJSON.length;
        };

        var ajustarTamanhoDiv = function () {
            var imgs = $($idObjDOM + " img").not(function () { return this.complete; });
            var count = imgs.length;

            if (count) {
                imgs.on('load', function () {
                    count--;
                    if (!count) {
                        UNINTER.viewGenerica.setPlaceholderHeight();
                    }
                });
                imgs.on("error", function () {
                    count--;
                    UNINTER.viewGenerica.setPlaceholderHeight();
                });
            } else {
                UNINTER.viewGenerica.setPlaceholderHeight();
            }

            setTimeout(function () {
                UNINTER.viewGenerica.setPlaceholderHeight();
            }, 2000)

        };

        var ajustarQuantidadeQuestoesEscolha = function (idSala) {


            $.each(questoes.objAvaliacaoUsuario.salas, function (i, item) {

                // Quantas questões faltam para escolha?
                var escolhidos = _.filter(item.questoes, function (data) {
                    return data.idAvaliacaoUsuarioHistoricoTipoSorteio == 2 || data.idAvaliacaoUsuarioHistoricoTipoSorteio == 4
                });

                if (item.quantidadeQuestoes > questoes.objAvaliacaoUsuario.avaliacao.totalQuestoes) {
                    item.quantidadeQuestoes = questoes.objAvaliacaoUsuario.avaliacao.totalQuestoes;
                }

                item.restante = item.quantidadeQuestoes - escolhidos.length;

                $('.panel[data-sala="' + item.id + '"] span[data-restante]').html(item.restante);

                //Habilita a opção de remover as questões escolhidas.
                $(escolhidos).each(function (i, qst) {
                    if (qst.idAvaliacaoUsuarioHistoricoTipoSorteio == 4) {
                        $('.btn-danger[data-id="' + qst.id + '"]').removeAttr('disabled');
                    }
                });

                if (item.restante < 1) {
                    //Desabilita todas as questões porque não tem limite mais.
                    $('.panel[data-sala="' + item.id + '"] button.btn-success').attr('disabled', true);
                } else {
                    var questoesDisponiveis = _.filter(item.questoes, function (data) {
                        return data.idAvaliacaoUsuarioHistoricoTipoSorteio == 3 || data.idAvaliacaoUsuarioHistoricoTipoSorteio == 5
                    })

                    $(questoesDisponiveis).each(function (i, qst) {
                        $('.btn-success[data-id="' + qst.id + '"]').removeAttr('disabled');
                    });

                }

            });

        };

        var pararContador = function () {
            var url = window.location.href;
            var params = url.split("#/");
            var contexto = params[1].split("/");
            var continuar = true;
            var rotinasPermitidas = ['avaliacaousuariohistorico', 'avaliacaovestibular', 'provas']
            if (contexto == void (0) || contexto[1] == void (0) || (rotinasPermitidas.indexOf(contexto[1].toLowerCase()) == -1)) {
                forcarParadaContador();
                continuar = false;
            }
            return continuar;
        };

        var forcarParadaContador = function () {
            clearInterval(UNINTER.intervaloAutomaticoAvaliacao);
            clearInterval(UNINTER.intervaloContadorAvaliacao);
            clearTimeout(UNINTER.intervaloTimeoutAvaliacao);
        };

        var renderMensagem = function () {

            var $objMensagem = $("<div>");
            $objMensagem.addClass("col-md-12");

            var $objInterno = $("<div>");
            $objInterno.attr("id", _idMensagem);

            $objMensagem.append($objInterno);

            return $objMensagem;
        };

        var renderQuestaoRevisao = function (item) {
            //Verificamos se podemos renderizar a opção de enviar a questão para revisão.
            if (questoes.exibirRevisaoQuestao) {
                var $objDiv = $("<div>").addClass("pull-right revisar");
                $objDiv.attr("data-id", item.id).attr("data-nota", item.percentualAcerto).attr("data-idquestaotipo", item.idQuestaoTipo);
                var $objA = $("<a>");
                $objA.attr("title", "Revisar Questão").attr("href", "javascript: void(0)");
                var $objIcon = $("<i>").addClass("icon-external-link");
                $objA.append($objIcon).append("Revisar");
                $objDiv.append($objA);
                return $objDiv;
            }
        }

        var renderRevisaoHistorico = function (item) {
            if (item.correcaoManual) {
                var $objP = $("<p>").addClass("historicoLog");
                var $objA = $("<a>").attr("id", item.id).attr("title", "Questão Revisada").attr("href", "javascript: void(0)");
                var $objSpan = $("<span>").addClass("label label-warning historicoLog").css("font-weight", "normal").text("Questão Revisada");
                $objA.append($objSpan);
                $objP.append($objA);
                return $objP;
            }
        }

        var renderTitulo = function (ordem, objJSONQuestao) {

            if (questoes.exibirTitulo == false) {
                return null;
            }

            var strTitulo = questoes.atributoJSONTituloQuestao + " " + ordem + "/" + totalQuestoes;

            if (objJSONQuestao != void (0) )
            {
                if (questoes.exbirNomeDisciplinaQuestao == true && objJSONQuestao.idBancoQuestao > 0)
                {
                    var sala = _.findWhere(questoes.objAvaliacaoUsuario.salas, { idBancoQuestaoSalaVirtual: objJSONQuestao.idBancoQuestao });
                    if (sala != void (0) && sala.nomeSalaVirtual != void (0)) {
                        strTitulo += " - " + sala.nomeSalaVirtual;
                    }
                }

                if (objJSONQuestao.idAvaliacaoUsuarioHistoricoTipoSorteio == 6)
                {
                    strTitulo += " (questão opcional)";
                }

            }

            var $objTitulo = $("<div>");
            var $objH3 = $("<span>", {"tabindex":"0"}).addClass("title").html(strTitulo);

            if (ordem > 1) {
                $objTitulo.append(renderVoltar());
            }

            $objTitulo.append($objH3);

            if (questoes.exibirOrdemBancoQuestao) {
                
                var item = listaJSON[ordem - 1];
                var objSpanOrdembancoQuestao = $("<span>").addClass("pull-right title").html("Cód. " + item[questoes.atributoJSONOrdemBancoQuestao]);
                $objTitulo.append(objSpanOrdembancoQuestao);
            }

            if (ordem < totalQuestoes) {
                $objTitulo.append(renderAvancar());
            }
            return $objTitulo;
        };

        var renderVoltar = function () {
            if (questoes.botaoVoltar == false) {
                return null;
            }

            var $voltar = $("<i>");
            $voltar.addClass("icon-arrow-left");
            $voltar.css("font-size", "1.2em").css("cursor", "pointer").css("margin-right", "10px");
            return $voltar;
        };

        var renderAvancar = function () {

            if (questoes.botaoAvancar == false) {
                return null;
            }

            var $avancar = $("<i>");
            $avancar.addClass("icon-arrow-right");
            $avancar.css("font-size", "1.2em").css("cursor", "pointer").css("margin-left", "10px");
            return $avancar;
        };

        var renderNavegacaoAbas = function () {
            var $container = $("<div>").html('<nav><ul class="pager"><li class="previous"><a href="javascript:void(0)"><span aria-hidden="true">&larr;</span> Voltar</a></li><li class="next"><a href="javascript:void(0)">Avançar <span aria-hidden="true">&rarr;</span></a></li></ul></nav>');
            return $container;
        };

        var renderContainer = function (id) {
            var $objContainer = $("<div>");
            $objContainer.addClass("col-md-12");
            $objContainer.css("margin-top", "20px");
            if (id !== void (0) && id !== null) {
                $objContainer.attr("id", id);
            }
            return $objContainer;
        };

        this.renderContainerQuestao = function (objJSONquestao) {
            var $objContainerQuestao = $("<div>");
            $objContainerQuestao.attr("data-ordem", objJSONquestao[questoes.atributoJSONOrdem]);
            return $objContainerQuestao;
        };

        this.renderTema = function (tema) {
            if (questoes.exibirTemasEmAbas === true) {
                return $('<div>').html($('<div>', { class: "itemNav", id: questoes.atributoJSONidTema + tema[questoes.atributoJSONidTema] }).css('display', 'none'));
            } else {
                return $('<div>', { class: "panel panel-default" }).append($('<div>', { class: "panel-heading" }).append(tema[questoes.atributoJSONTema])).append($('<div>', { class: "panel-body", id: questoes.atributoJSONidTema + tema[questoes.atributoJSONidTema] }));
            }
            
        };

        this.renderTemaAba = function (temas) {

            var $ul = $('<ul>', { class: "nav navbar-nav" });

            $.each(temas, function (i, tema) {
                $a = $('<a>', { href: 'javascript:void(0)' }).html(tema[questoes.atributoJSONTema]);
                $li = $('<li>', { "data-target": questoes.atributoJSONidTema + tema[questoes.atributoJSONidTema] }).html($a);
                $ul.append($li);
            });

            var $aTituloNav = $('<a>', { id: questoes.idObjDOM + "NavQuestaoTitulo", href: 'javascript:void(0)', class: "navbar-brand visible-xs" });

            var $navCollapse = $('<div>', { id: questoes.idObjDOM + "NavQuestao", class: "collapse navbar-collapse" }).append($ul);
            var $navHeader = $('<div>', { class: "navbar-header" })
                .html('<button aria-expanded="false" data-target="#' + questoes.idObjDOM + 'NavQuestao" data-toggle="collapse" class="navbar-toggle collapsed" type="button"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>')
                .append($aTituloNav);

            var $containerFluid = $('<div>', { class: "container-fluid" }).append($navHeader).append($navCollapse);

            var $containerNav = $('<nav>', {class: 'navbar navbar-default'}).append($containerFluid);
            return $containerNav;
           
        };

        var renderQuestoesAgrupadas = function (questoesTema) {

            /*
        this.atributoJSONAgrupar = 'agrupar';
        this.atributoJSONIdAgrupadorQuestoes = 'idEnqueteConfiguracao';
        this.atributoJSONAgrupadoresQuestoes = ['idQuestao', 'idEnqueteBloco'];
        this.atributoJSONTituloAgrupadorQuestoes = 'nomeSalaVirtual';
            */

            var objQuestoes = {};
            var linhas = [];
            var colunas = [];

            //Localiza as linhas e as colunas para criar tabela:
            $(questoesTema).each(function (i, item) {

                var objLinha = {};
                $(questoes.atributoJSONAgrupadoresQuestoes).each(function (i, lin) {
                    objLinha[lin] = item[lin];
                });

                var objColuna = {};
                objColuna[questoes.atributoJSONIdAgrupadorQuestoes] = item[questoes.atributoJSONIdAgrupadorQuestoes];
                objColuna[questoes.atributoJSONTituloAgrupadorQuestoes] = item[questoes.atributoJSONTituloAgrupadorQuestoes];

                var linha = _.findWhere(linhas, objLinha);
                var coluna = _.findWhere(colunas, objColuna);

                if(coluna == void(0))
                {
                    colunas.push(objColuna);
                }

                if (linha != void (0)) {
                    linha.questoes.push(item);
                } else {
                    objLinha.questoes = [];
                    objLinha.questoes.push(item);
                    linhas.push(objLinha);
                }
            });

            var $table = $('<table>', { class: "table table-bordered table-striped"});
            var $tbody = $('<tbody>');
            var $thead = $('<thead>');
            var $trHead = $('<tr>');

            $trHead.append($('<th>', { class: "col-md-4" }));

            $(colunas).each(function (i, item) {
                $trHead.append($('<th>').html(item[questoes.atributoJSONTituloAgrupadorQuestoes]));
            });

            $(linhas).each(function (i, item) {
                var $tr = $('<tr>');
                $(item.questoes).each(function (i, objJSOQuestao) {
                    if(i == 0)
                    {
                        $tr.append($('<td>').html(questoes.renderQuestao(objJSOQuestao)));
                    }
                    $tr.append($('<td>').html(questoes.renderAlternativas(objJSOQuestao)));
                })
                $tbody.append($tr);
            });

            $thead.append($trHead);
            $table.append($thead).append($tbody);
            return $table;

        };

        this.renderQuestao = function (objJSONquestao) {

            var $objQuestao = $("<article>", { "tabindex": "0" }).addClass("question-text");

            if(questoes.ehEnquete == true)
            {
                $objQuestao.addClass("question-text-enquete");
            }

            $objQuestao.html(objJSONquestao[questoes.atributoJSONQuestao])
                .append(questoes.renderVideoSianee(objJSONquestao));

            return $objQuestao;
        };

        this.renderVideoSianee = function (objJSONquestao) {

            var $container = $("<div>");

            
            if ( questoes.videoSianee == true && objJSONquestao[questoes.atributoJSONVideoSianee] != void (0) && objJSONquestao[questoes.atributoJSONVideoSianee].length > 0) {

                var $containerVideo = $("<div>", {
                    "data-videocontainer": objJSONquestao[questoes.atributoJSONidQuestao],
                    "class": "col-lg-6 col-md-8 col-sm-12 container-video-sianee"
                });

                var $aVideo = $('<a>', {
                    href: "javascript:void(0)",
                    class: "link-underline",
                    "data-href": objJSONquestao[questoes.atributoJSONVideoSianee],
                }).html(questoes.linkExibirVideoSianee).on('click', function (e) {

                    var $el = $(e.currentTarget);

                    if ($el.parent().find('video').length == 0) {

                        var $source = $("<source>", { src: $el.data('href') });

                        var $video = $("<video>", {
                            "autoplay": 'true',
                            "controls": "true"
                        })
                            .css("display", "none") //para animação
                            .html($source);

                        $el.parent().append($video);

                        $video.slideDown(150, function () {
                            UNINTER.viewGenerica.setPlaceholderHeight();
                        })

                        $el.html(questoes.linkOcultarVideoSianee);


                    } else {

                        $el.parent().find('video').slideUp(150, function () {
                            $(this).remove();
                        })
                        $el.html("Exibir vídeo libras<br>");
                    }

                });

                $containerVideo.html($aVideo);
                $container.append($containerVideo);

            }

            return $container;

        };

        this.renderComando = function (objJSONquestao) {
            var $objComando = $("<article>").addClass("question-text");
            if (questoes.ehEnquete == true) {
                $objComando.addClass("question-text-enquete");
            }
            $objComando.html(objJSONquestao[questoes.atributoJSONComando]);
            return $objComando;
        };

        this.renderBotaoAnexo = function (objJSONquestao) {
            var obj = "";
            if (objJSONquestao.permiteAnexo === true && questoes.exibirBotaoEnviarAnexo === true)
            {
                obj = $("<div>", { class: "row" }).html(renderContainer("anexo" + objJSONquestao.idQuestao).html($("<input>", { class: "btn btn-success", value: "ENVIAR ANEXO", 'data-idquestao': objJSONquestao.idQuestao, 'data-anexo': true  })));
            }
            return obj;
        };

        this.renderBlocoAnexosInseridos = function (objJSONquestao, renderAnexos) {
            var obj = "";
            if (objJSONquestao.permiteAnexo === true) {
                obj = $("<div>", { class: "row" }).html(questoes.renderAnexos(objJSONquestao, renderAnexos));
            }
            return obj;
        };

        this.renderAnexos = function (objJSONquestao, podeExcluir) {

            //Container do retorno
            var container = renderContainer("anexosInseridos" + objJSONquestao.idQuestao);

            //Se não tem anexo não precisa fazer nada.
            if (objJSONquestao == null || objJSONquestao.anexos == null || !objJSONquestao.anexos.length > 0) {
                return container;
            }


            //Verificamos se precisa exibir as imagens no html ou se tudo é download.
            var anexos = [];
            var imagens = [];

            if (questoes.exibirImagens == true) {

                $(objJSONquestao.anexos).each(function (i, item) {
                    if (extensaoImagens.indexOf(item.extensao.toLowerCase()) > -1) {
                        imagens.push(item);
                    } else {
                        anexos.push(item);
                    }
                });

            } else {
                anexos = objJSONquestao.anexos
            }

            //Contrução do retorno dos anexos...
            var objTable = $("<table>", { class: "table table-striped table-bordered post-box-article" });
            objTbody = $('<tbody>');

            $.each(anexos, function (i, item) {

                var excluir = '';

                if (podeExcluir == true) {
                    excluir = "<td style='text-align: center;'><a data-id='" + item.id + "' data-excluiranexo='true' href='javascript:void(0)'><span class='btn-delete'><span class='icon-stack'><i class='icon-circle icon-stack-base'></i><i class='icon-trash-o icon-light'></i></span></span></a></td>"
                }

                var tr = "<tr><td><a target='_blank' href='" + item.url + "'>" + item.nome + "</a></td>" + excluir + "</tr>";
                objTbody.append(tr);
            });

            objTable.append(objTbody);
            container.append(objTable);
            
            //Retorno das imagens...
            if(imagens.length > 0)
            {
                var zoomMais = $("<a>", { id:'zoomMais', title:'Zoom mais', 'data-toggle':'tooltip',  href: "javascript:void(0)" }).html('<i class="icon-search-plus"></i>').on('click', function (e) {
                    var zoom = $(".img-container img").data('zoom');
                    if (zoom == void (0)) {
                        zoom = 1.1;
                    } else {
                        zoom = (zoom + 0.1)
                    }

                    $(".img-container img").data('zoom', zoom);

                    $(".img-container img").css('zoom',zoom).css('width', 'auto').css('max-width', 'none');
                });

                var zoomMenos = $("<a>", { id: 'zoomMenos', title: 'Zoom menos', 'data-toggle': 'tooltip', href: "javascript:void(0)" }).html('<i class="icon-search-minus"></i>').on('click', function (e) {
                    var zoom = $(".img-container img").data('zoom');
                    if (zoom == void (0)) {
                        zoom = 0.9;
                    } else {
                        zoom = (zoom - 0.1)
                    }

                    $(".img-container img").data('zoom', zoom);

                    $(".img-container img").css('zoom', zoom).css('width', 'auto').css('max-width', 'none');
                });

                var resetZoon = $("<a>", { id: 'zoomReset', title: 'Restaurar', 'data-toggle': 'tooltip', href: "javascript:void(0)" }).html('<i class="icon-compress"></i>').on('click', function (e) {
                    
                    $(".img-container img").data('zoom', 1);

                    $(".img-container img").css('zoom', '').css('width', '').css('max-width', '');
                });

                var zoom = $("<div>", { class: "zoom-controllers" }).append(resetZoon).append(zoomMais).append(zoomMenos);

                var objImg = $("<div>", { class: "img-container" });

                $.each(imagens, function (i, item) {
                    var img = $("<img>", {
                        class: "img-responsive",
                        src: item.url,
                        title: item.nome,
                        alt: item.nome
                    });

                    objImg.append(img);
                });

                container.append(zoom).append(objImg);

            }

            return container;
        };

        this.renderAlternativas = function (objJSONQuestao) {
            var $objAlternativas;
            var $table = $("<table>");
            var $tbody = $("<tbody>");

/*
            this.atributoJSONTipoQuestaoObjetiva = 1;
            this.atributoJSONTipoQuestaoDiscursiva = 2;
            this.atributoJSONTipoQuestaoCorrecaoTrabalho = 3;
            this.atributoJSONTipoQuestaoCorrecaoTrabalhoHoras = 4;
            this.atributoJSONTipoQuestaoTabela = 5;
            this.atributoJSONTipoQuestaoObjetivaDescricao = 6;
            this.atributoJSONTipoQuestaoMultiplaEscolha = 7;
            this.atributoJSONTipoQuestaoEscala = 9;
*/

            switch (objJSONQuestao[questoes.atributoJSONTipoQuestao])
            {
                default:
                case questoes.atributoJSONTipoQuestaoObjetiva:
                case questoes.atributoJSONTipoQuestaoObjetivaDescricao:

                    var type = 'radio';

                    $.each(objJSONQuestao[questoes.atributoJSONAlternativas], function (i, item) {

                        item.idHistoricoQuestao = objJSONQuestao[questoes.atributoJSONidHistorico];

                        if (item[questoes.atributoJSONIdAlternativa] == objJSONQuestao[questoes.atributoJSONAlternativaMarcada]) {
                            $tbody.append(renderAlternativa(objJSONQuestao, item, i, true, type));
                        }
                        else
                        {
                            $tbody.append(renderAlternativa(objJSONQuestao, item, i, false, type));
                        }
                    });
                    break;
                case questoes.atributoJSONTipoQuestaoMultiplaEscolha:
                    var type = 'checkbox';

                    $.each(objJSONQuestao[questoes.atributoJSONAlternativas], function (i, item) {

                        item.idHistoricoQuestao = objJSONQuestao[questoes.atributoJSONidHistorico + 'Pai'];

                        //Esta alternativa foi marcada pelo usuario?
                        var objPesqAlternativa = {};
                        objPesqAlternativa[questoes.atributoJSONAlternativaMarcada] = item[questoes.atributoJSONIdAlternativa];
                        
                        var questaoMarcada = _.findWhere(objJSONQuestao.alternativasSelecionadas, objPesqAlternativa);

                        if (questaoMarcada != void (0))
                        {
                            $tbody.append(renderAlternativa(questaoMarcada, item, i, true, type));
                        } else {

                            $tbody.append(renderAlternativa(objJSONQuestao, item, i, false, type));
                        }
                        
                    });
                    break;
                case questoes.atributoJSONTipoQuestaoDiscursiva:
                    $tbody.append(renderDiscursiva(objJSONQuestao));
                    $tbody.append(renderDiscursivaContador(objJSONQuestao));
                    break;
                case questoes.atributoJSONTipoQuestaoCorrecaoTrabalho:
                case questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHoras:
                case questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasPorcentagem:
                    case questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasValorMaximo:
                    $tbody.append(renderCorrecaoTrabalho(objJSONQuestao));
                    break;
                case questoes.atributoJSONTipoQuestaoTabela:
                    $tbody.append(QuestaoTabelaCarregarTabela(objJSONQuestao, false));
                    break;
                case questoes.atributoJSONTipoQuestaoEscala:
                    $tbody.append(renderEscala(objJSONQuestao));
                    break;
				case questoes.atributoJSONTipoQuestaoEscalaTrabalho:
					questoes.atributoJSONAlternativaAtributoTipoEscala = questoes.atributoJSONAlternativaAtributoTipoEscalaTrabalho;
                    $tbody.append(renderEscala(objJSONQuestao));
                    break;
            }

            //if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoDiscursiva) {
            //    $tbody.append(renderDiscursiva(objJSONQuestao));
            //    $tbody.append(renderDiscursivaContador(objJSONQuestao));
            //}
            //else if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalho || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHoras) {
            //    $tbody.append(renderCorrecaoTrabalho(objJSONQuestao));
            //}else if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoTabela) {
            //    $tbody.append(QuestaoTabelaCarregarTabela(objJSONQuestao, false));
            //}else{
            //    $.each(objJSONQuestao[questoes.atributoJSONAlternativas], function (i, item) {
            //        if (item[questoes.atributoJSONIdAlternativa] == objJSONQuestao[questoes.atributoJSONAlternativaMarcada]) {
            //            $tbody.append(renderAlternativa(item, i, true));
            //        }
            //        else {
            //            $tbody.append(renderAlternativa(item, i, false));
            //        }

            //    });
            //}
            $table.append($tbody);
            return $table;
        };

        var renderAlternativa = function (objJSONQuestao, objJSONAlternativa, posicaoPrefixo, checked, type) {

            var strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoTextoQuestao + '}';
            var objAtributoTextoAlternativa = _.findWhere(objJSONAlternativa[questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));

            strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoPermiteComentario + '}';
            var objAtributoComentarioAlternativa = _.findWhere(objJSONAlternativa[questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));
            
            var prefixo = questoes.formatoLetraAlternativa != null ? questoes.formatoLetraAlternativa.replace("X", letrasAlternativas[posicaoPrefixo]) : '';
            var strInputName = "questao" + objJSONAlternativa.idQuestao;
            var strInputId = "alternativa" + objJSONAlternativa.id;

            if(questoes.ehEnquete == true)
            {
                strInputName = "questao" + objJSONAlternativa.idQuestao + "_" + objJSONAlternativa.idHistoricoQuestao;
                strInputId = "alternativa" + objJSONAlternativa.id + "_" + objJSONAlternativa.idHistoricoQuestao;
            }

            if (objAtributoTextoAlternativa == void (0)) {
                return;
            }
            /*
                "data-idhistorico": objJSONQuestao[questoes.atributoJSONidHistorico],
                "data-idquestao": objJSONQuestao[questoes.atributoJSONidQuestao],
            */
            var $objInput = $("<input>", {
                type: type,
                name: strInputName,
                id: strInputId,
                value: objJSONAlternativa.id,
                "data-idquestao": objJSONAlternativa[questoes.atributoJSONidQuestao],
                "data-idalternativa": objJSONAlternativa[questoes.atributoJSONIdAlternativa],
                "data-letra": letrasAlternativas[posicaoPrefixo],
                "data-idhistorico": objJSONAlternativa.idHistoricoQuestao
            });

            //var $objInput = $("<input>");
            //$objInput.attr("type", type);
            //$objInput.attr("name", strInputName);
            //$objInput.attr("id", strInputId);
            //$objInput.attr("value", objJSONAlternativa.id);
            //$objInput.attr("data-idquestao", objJSONAlternativa[questoes.atributoJSONidQuestao]);
            //$objInput.attr("data-idalternativa", objJSONAlternativa[questoes.atributoJSONIdAlternativa]);
            //$objInput.attr("data-letra", letrasAlternativas[posicaoPrefixo]);

            if (checked) {
                $objInput.prop("checked", "true");
            }

            var article = $("<article>").addClass("question-choice-body").html(objAtributoTextoAlternativa[questoes.atributoJSONAlternativaAtributoTextoValor]);

            if (objAtributoComentarioAlternativa != void (0) && objAtributoComentarioAlternativa.valor == 'true')
            {
                article.append(renderAlternativaComentarioOpcional(objJSONQuestao, objJSONAlternativa, checked));
            }

            var $tdAlternativa = $("<td>").html(article);
            var $tdLetra = questoes.formatoLetraAlternativa != null ? $("<td>").addClass("question-choice-label").html(prefixo) : '';
            var $tdInput = $("<td>").addClass("question-choice-input").html($objInput);

            if (questoes.visualizacaoAmigavel == true) {
                $tdInput.addClass("hide");
            }

            var $tr = $("<tr>").addClass("question-choice").append($tdInput).append($tdLetra).append($tdAlternativa);

            return $tr;

        };

        var renderAlternativaComentarioOpcional = function (objJSONQuestao, objJSONAlternativa, checked) {

            var $div = $('<div>', { class: "un-input-md" }).css('margin-bottom', '10px');
            var strInputId = "alternativa" + objJSONAlternativa.id + '_resposta';

            if (questoes.ehEnquete === true)
            {
                strInputId = "alternativa" + objJSONAlternativa.id + "_" + objJSONAlternativa.idHistoricoQuestao + '_resposta';
            }

            var $input = $('<input>', {
                name: strInputId,
                id: strInputId,
                type: 'text',
                class: "form-control",
            });

            if (checked == true) {
                $input.val(objJSONQuestao[questoes.atributoJSONResposta]);
            } else {
                $input.attr('disabled', 'disabled').addClass('hide');
            }

                
            return $div.html($input);
        };

        var renderEscala = function (objJSONQuestao) {
			
            //idAtributo = 18 (tipoExibiçãoEscala)
            //1:Somente valor - 2:Somente legenda - 3:Valor e legenda

            //idAtributo = 19 (tipoLayoutEscala)
            //1:Lado a lado (horizontal) - 2:Um por linha (vertical) - 3:Slider - 4:Combo

            var strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoTipoLayoutEscala + '}';
            var objTipoLayoutEscala = _.findWhere(objJSONQuestao[questoes.atributoJSONAlternativas][0][questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));
            
            strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoTipoExibicaoEscala + '}';
            var objTipoExibicaoEscala = _.findWhere(objJSONQuestao[questoes.atributoJSONAlternativas][0][questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));

            strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoTipoEscala + '}';
            var objTipoEscala = _.findWhere(objJSONQuestao[questoes.atributoJSONAlternativas][0][questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));

            if(objTipoEscala == void(0))
            {
                return '';
            }
            var idEscala = parseInt(objTipoEscala.valor);
            var idTipoLayout = objTipoLayoutEscala != void (0) ? parseInt(objTipoLayoutEscala.valor) : 1;
            var idTipoLabel = objTipoExibicaoEscala != void(0) ? parseInt(objTipoExibicaoEscala.valor) : 1;

            if (isNaN(idEscala) || isNaN(idTipoLayout) || isNaN(idTipoLabel)) {
                return '';
            }

            var $div = $("<div>", { class: "form-horizontal", "data-containerescala": objJSONQuestao[questoes.atributoJSONidHistorico] });

            //Já buscamos essa escala?
            if(listaEscalaLegenda[idEscala] == void(0))
            {
                var opcoes = {
                    url: UNINTER.AppConfig.UrlWs("BQS") + "EscalaLegenda/" + idEscala + "/Escala",
                    type: 'GET',
                    async: false,
                    successCallback: function (data) {
                        listaEscalaLegenda[idEscala] = data.escalaLegendas;
                        listaEscala[idEscala] = data.escala;
                    },
                    errorCallback: function (err) {
                        listaEscalaLegenda = [];
                        // Algo de errado aqui...
                        console.log(err);
                    }
                }
                UNINTER.Helpers.ajaxRequest(opcoes);
            }


            // 1- Lado a lado (Horizontal)
            // 2 - Um por linha (vertical)
            // 3 - Slider
            // 4 - Combo
			
            switch (idTipoLayout) {
                case 2:
                    $div.html(criarLegendasEscalaVertical(objJSONQuestao, listaEscalaLegenda[idEscala], idTipoLabel, idEscala));
                    break;
                case 3:
                    inicializarSlider = true;
                    $div.html(criarLegendasEscalaSlider(objJSONQuestao, listaEscalaLegenda[idEscala], idTipoLabel, idEscala));
                    break;
                case 4:
                    $div.html(criarLegendasEscalaCombo(objJSONQuestao, listaEscalaLegenda[idEscala], idTipoLabel, idEscala));
                    inicializarSelect2 = true;
                    break;
                default:
                    $div.html(criarLegendasEscalaHorizontal(objJSONQuestao, listaEscalaLegenda[idEscala], idTipoLabel, idEscala));
                    break;
            }

            $div.append(criarLabelEscalaNaoAplicavel(objJSONQuestao, idEscala));
            
            return $div;
        };

        var criarLabelEscala = function (objJSONQuestao, legenda, idTipoLabel, idEscala) {
            //1 - Somente valor
            //2 - Somente legenda
            //3 - Valor e legenda

            switch (idTipoLabel) {
                case 2:
                    return legenda.legenda;
                    break;
                case 3:
                    return legenda.valor + " - " + legenda.legenda;
                    break;
                default:
                    return legenda.valor;
                    break;
            }

        };

        var criarLegendasEscalaVertical = function (objJSONQuestao, legendas, idTipoLabel, idEscala) {
            var strInputName = "questao" + objJSONQuestao.idQuestao + '_' + objJSONQuestao.id;
            $table = $("<table>");
            $tbody = $("<body>");

            $.each(legendas, function (i, item) {
                var $tr = $("<tr>", { class: "question-choice" });

                var $input = $("<input>", {
                    type: "radio",
                    name: strInputName,
                    'data-escala': 'true',
                    "data-idhistorico": objJSONQuestao[questoes.atributoJSONidHistorico],
                    "data-idquestao": objJSONQuestao[questoes.atributoJSONidQuestao],
                    "data-idquestaoTipo": objJSONQuestao[questoes.atributoJSONidQuestaoTipo],
                    value: item.valor
                });

                if(objJSONQuestao[questoes.atributoJSONResposta] == item.valor)
                {
                    $input.attr('checked', 'checked');
                }

                var $tdInput = $("<td>", { class: "question-choice-input" }).append($input);
                
                var $tdArticle = $("<td>").html($("<article>", { class: "question-choice-body" }).html(criarLabelEscala(objJSONQuestao, item, idTipoLabel)));

                $tbody.append($tr.append($tdInput).append($tdArticle));

            });

            $table.append($tbody);
            return $table;
        };

        var criarLegendasEscalaHorizontal = function (objJSONQuestao, legendas, idTipoLabel, idEscala) {
            
            var strInputName = "questao" + objJSONQuestao.idQuestao + '_' + objJSONQuestao.id;
            var $container = $("<div>", { class: "row" });
            $.each(legendas, function (i, item) {
                $cel = $("<div>", { class: "col-xs-12 col-sm-12 col-md-12" });

                $input = $("<input>", {
                    type: "radio",
                    name: strInputName,
                    'data-escala': 'true',
                    "data-idhistorico": objJSONQuestao[questoes.atributoJSONidHistorico],
                    "data-idquestao": objJSONQuestao[questoes.atributoJSONidQuestao],
                    "data-idquestaoTipo": objJSONQuestao[questoes.atributoJSONidQuestaoTipo],
                    value: item.valor
                });
                
                if (objJSONQuestao[questoes.atributoJSONResposta] == item.valor) {
                    $input.attr('checked', 'checked');
                }

                $cel.html($input).append(criarLabelEscala(objJSONQuestao, item, idTipoLabel));

                $container.append($cel);
            });
            return $container;
        };

        var criarLegendasEscalaCombo = function (objJSONQuestao, legendas, idTipoLabel, idEscala) {

            var $select = $("<select>", {
                class: "form-control",
                "data-idhistorico": objJSONQuestao[questoes.atributoJSONidHistorico],
                "data-idquestao": objJSONQuestao[questoes.atributoJSONidQuestao],
                "data-idquestaoTipo": objJSONQuestao[questoes.atributoJSONidQuestaoTipo]
            });

            $select.append($("<option>").html(''));
            $.each(legendas, function (i, item) {
                var $option = $("<option>", {value: item.valor}).html(criarLabelEscala(objJSONQuestao, item, idTipoLabel));

                $select.append($option);

                if (objJSONQuestao[questoes.atributoJSONResposta] != void(0))
                {
                    $select.val(objJSONQuestao[questoes.atributoJSONResposta]);
                }
            });

            //Se for agrupado, o tamanho é 100%:
            var classTamanho = 'un-input-xs';
            if (objJSONQuestao[questoes.atributoJSONAgrupar] == true)
            {
                classTamanho = 'un-input-lg';
            } else if (idTipoLabel == 1) {
                classTamanho = "un-input-xxs";
            }

            var $container = $("<div>", { class: "form-group" }).html($("<div>", { class: classTamanho }).html($select));
            return $container;

        };

        var criarLegendasEscalaSlider = function (objJSONQuestao, legendas, idTipoLabel, idEscala) {

            var labels = [];
            var labelsText = [];
            var ticks = [];
            var snapBounds = idTipoLabel == 1 ? 30 : 90;

            var value = parseInt(objJSONQuestao[questoes.atributoJSONResposta]) > 0 ? parseInt(objJSONQuestao[questoes.atributoJSONResposta]) : 0;
            var labelAtual = '---';

            $.each(legendas, function (i, item) {
                labels.push('"' + criarLabelEscala(objJSONQuestao, item, idTipoLabel) + '"');
                ticks.push(item.valor);
                if(item.valor == value)
                {
                    labelAtual = item.legenda;
                }
            });
            
            var $container = $("<div>", { class: "row" });
            var $tamanho = $("<div>", { class: "col-lg-6 col-md-8 col-sm-12" }).css("maring-left", "20px");
            var $selecionado = $("<div>", { class: "col-sm-12" }).html('Selecionado: ').append(
                $('<span>', {
                    class:"escala-valor-selecionado",
                    "data-idhistorico": objJSONQuestao[questoes.atributoJSONidHistorico],
                    "data-idescala": idEscala,
                }).html(labelAtual)
            );

            var orientacao =  (objJSONQuestao[questoes.atributoJSONAgrupar] == true) ? 'vertical' : 'horizontal';

            var $input = $("<input>", {
                "type": "text",
                "class":"init-slider hide",
                "data-slider-ticks": "[" + ticks.toString() + "]",
                "data-slider-ticks-snap-bounds": "30",
                "data-slider-ticks-labels": '[' + labels.join(",") + ']',
                "data-idhistorico": objJSONQuestao[questoes.atributoJSONidHistorico],
                "data-idquestao": objJSONQuestao[questoes.atributoJSONidQuestao],
                "data-idquestaoTipo": objJSONQuestao[questoes.atributoJSONidQuestaoTipo],
                "data-slider-value": value,
                "data-slider-orientation": orientacao,
                "data-idescala" : idEscala,
                "data-slider-id": idEscala,
                "value": value
            });

            $container.append($selecionado).append($tamanho.append($input));

            return $container;
        };

        var criarLabelEscalaNaoAplicavel = function (objJSONQuestao, idEscala) {
            var $div = '';

            if (listaEscala[idEscala].permitirRespostaNaoAplicavel)
            {
                $input = $("<input>", {
                    type: 'checkbox',
                    class: 'nao-aplicavel',
                    "data-idhistorico": objJSONQuestao[questoes.atributoJSONidHistorico],
                });

                if (parseInt(objJSONQuestao[questoes.atributoJSONResposta]) == -1)
                {
                    $input.prop('checked', true);
                }

                $div = $("<div>", { class: 'col-md-12' }).html($input).append('&nbsp; Não tenho condições de opinar');
            }

            return $div;
        };

        var renderDiscursivaContador = function (objJSONQuestao) {
            if (objJSONQuestao.inputNumber == true)
            {
                return '';
            }
            var contador = 0;
            if (objJSONQuestao[questoes.atributoJSONResposta] != void (0) && objJSONQuestao[questoes.atributoJSONResposta] != null) {
                var $div = $("<div>").html(objJSONQuestao[questoes.atributoJSONResposta]);
                contador = $div.text().length;
            }
            contador = questoes.totalCaracteres - contador;
            var $spanContagem = $("<span>").html(contador);
            var $tdContagem = $("<td>").append($spanContagem).append(" caracteres restantes.");
            var $trContagem = $("<tr>").addClass("question-choice").html($tdContagem).css("background-color", "#f6f6f6");
            return $trContagem;
        };

        var renderDiscursiva = function (objJSONQuestao) {
            
            var strName = "resposta" + objJSONQuestao[questoes.atributoJSONidQuestao];

            var atributoApenasNumero = void (0);

            var tipoElemento = '<textarea>';
            var tamanhoElemento = 'un-input-lg';
            var elementoAtributos = {
                "data-idquestao": objJSONQuestao[questoes.atributoJSONidQuestao],
            };

            //Permite apenas número na resposta?
            if (objJSONQuestao.alternativas[0] != void (0))
            {
                atributoApenasNumero = $(objJSONQuestao.alternativas[0].questaoAlternativaAtributos).filter(function (i, item) {
                    return item.idAtributoQuestaoTipo == 31 && item.valor == 'true';
                });
            }

            if (atributoApenasNumero != void (0) && atributoApenasNumero.length > 0) {
                //Número
                objJSONQuestao.inputNumber = true;
                tamanhoElemento = 'un-input-sm';
                tipoElemento = '<input>';
                elementoAtributos = {
                    "data-idquestao": objJSONQuestao[questoes.atributoJSONidQuestao],
                    "data-idhistorico": objJSONQuestao[questoes.atributoJSONidHistorico],
                    "type": "number",
                    "class": "form-control",
                    "name" : strName
                };
            } else {
                //Textarea
                elementoAtributos = {
                    "data-idquestao": objJSONQuestao[questoes.atributoJSONidQuestao],
                    "data-idhistorico": objJSONQuestao[questoes.atributoJSONidHistorico],
                    "class": "form-control",
                    "name": strName,
                    'rows': questoes.alturaTextArea,
                };

                if(questoes.desativarVerificacaoOrtografica == true)
                {
                    elementoAtributos.spellcheck = false;
                }

                if(questoes.larguraTextArea != void(0))
                {
                    elementoAtributos.style = "resize: none;width:"+ questoes.larguraTextArea;
                }

                if(questoes.exibirNrLinhaTextArea == true)
                {
                    elementoAtributos.class += " float-left";
                }

            }

            var $objDiscursiva = $(tipoElemento, elementoAtributos);

            //Tem resposta salva?
            if (objJSONQuestao[questoes.atributoJSONResposta] != void (0) && objJSONQuestao[questoes.atributoJSONResposta] != null) {

                if (objJSONQuestao.inputNumber == true) {
                    $objDiscursiva.val(objJSONQuestao[questoes.atributoJSONResposta]);
                } else {
                    var $div = $("<div>").text(objJSONQuestao[questoes.atributoJSONResposta]);
                    $objDiscursiva.html($div.text());
                }
            }

            var $divInput = $("<div>").addClass(tamanhoElemento).html($objDiscursiva);

            if(questoes.exibirNrLinhaTextArea == true)
            {
                $divInput.html(getContainerNumeroLinhas()).append($objDiscursiva);
            }

            var $divForm = $("<div>").addClass("form-group").html($divInput).css("margin-bottom", "0px");
            var divFormHorizontal = $("<div>").addClass("form-horizontal ").html($divForm);
            var $td = $("<td>").html(divFormHorizontal).css("padding", "0px");
            var $tr = $("<tr>").addClass("question-choice").html($td);

            return $tr;
        };

        var getContainerNumeroLinhas = function(){
            $div = $('<div>', {class: 'float-left mini-block inline', style:'margin: 7px 7px 0 10px;vertical-align: top;line-height: 1.42857143;'});
            
            var totalLinhas = parseInt(questoes.alturaTextArea);
            if(totalLinhas > 0 && totalLinhas < 50)
            {
                var i = 1;
                while(i<= totalLinhas)
                {
                    $div.append($('<p>', {style:'font-size: 14px; margin: 0px;'}).html(i));
                    i++;
                }
            }

            return $div;
        };

        var renderCorrecaoTrabalho = function (objJSONQuestao) {
            
            var notaMax = 100;
            var infoRange = "Valor de 0 a " + notaMax;

            //se for horas, altera nota maxima
            if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHoras
                || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasPorcentagem
                || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasValorMaximo
            ) {
                notaMax = 4000;
                infoRange = "Informe a carga horária";
            }
            var strName = "resposta" + objJSONQuestao[questoes.atributoJSONidQuestao];
            var $objInput = $("<input>").addClass("form-control text-right respostaCorrecaoTrabalho").attr({

                name: strName,
                id: strName,
                type: 'text',
                'data-idquestao': objJSONQuestao[questoes.atributoJSONidQuestao],
                'data-idquestaoTipo': objJSONQuestao[questoes.atributoJSONidQuestaoTipo],
                "data-idhistorico": objJSONQuestao[questoes.atributoJSONidHistorico],
                'data-msg-required': "Essa informação é obrigatória.",
                'data-msg-range': "Valor inválido.",
                'data-info-range': infoRange,
                'data-msg-number': "Somente números são aceitos.",
                'data-rule-required': "true",
                'data-rule-number': "true",
                'data-rule-range': "[0," + notaMax + "]",
				'style': 'min-width: 80px'
            }).data({
                objJSONQuestao: objJSONQuestao
            });
            

            //Tem resposta salva?
            if (objJSONQuestao[questoes.atributoJSONResposta] != void (0) && objJSONQuestao[questoes.atributoJSONResposta] != null) {                
                $objInput.val(objJSONQuestao[questoes.atributoJSONResposta]);
            }

            var $divInput = $("<div>").addClass("un-input-xxs").html($objInput);
            var $divForm = $("<div>").addClass("form-group").html($divInput).css("margin-bottom", "0px");
            var divFormHorizontal = $("<div>").addClass("form-horizontal ").html($divForm);
            var $td = $("<td>").html(divFormHorizontal).css("padding", "0px");

            //exibe peso na correcao

            var objAtributoTextoAlternativaCorreta = null;
            
            var $objPeso = renderPesoAlternativa(objJSONQuestao.alternativas[0]);
            $td.append($objPeso);

            var $objPeso = renderPorcentagemValorMaximoAlternativa(objJSONQuestao.alternativas[0]);
            $td.append($objPeso);

            
            var $tr = $("<tr>").addClass("").html($td);//question-choice
            
            return $tr;
        };

        this.renderSeparador = function () {
            var $objHR = $("<hr>");
            return $objHR
        };

        var renderPaginacao = function (ordem) {
            var $objPaginacao = $("<table>");
            $objPaginacao.addClass("btn-group-alt").css("margin-top", "25px");
            return $objPaginacao;
        };

        var renderItemPaginacao = function (ordem, idQuestao) {

            var $objSpan = $("<span>");
            $objSpan.addClass("btn-group-alt-legend");
            $objSpan.attr("data-idquestao", idQuestao);
            $objSpan.html("(?)");

            var $objButton = $("<button>");
            $objButton.addClass("btn btn-default");
            $objButton.attr("data-ordem", ordem);
            $objButton.html(ordem);

            var $objItemPaginacao = $("<td>");
            $objItemPaginacao.append($objButton);
            $objItemPaginacao.append($objSpan);
            $objItemPaginacao.addClass("btn-group-alt-group");
            return $objItemPaginacao;
        };

        var renderBotoes = function () {
            var $objBotoes = renderContainer();
            $objBotoes.css("text-align", "center").attr("id", "botoesAvaliacao");

            //var $botaoSalvar = $("<button>");
            //$botaoSalvar.addClass("btn btn-primary");
            //$botaoSalvar.attr("id", "salvar");
            //$botaoSalvar.html(questoes.botaoSalvarTexto);

            if (questoes.botaoVoltar) {
                var $botaoVoltar = $("<button>");
                $botaoVoltar.addClass("btn btn-default");
                $botaoVoltar.attr("id", "btnQuestaoAnterior");
                $botaoVoltar.html("Questão anterior");
                $botaoVoltar.css("margin-left", "10px");
                $botaoVoltar.css("margin-right", "10px");
                $objBotoes.append($botaoVoltar);
            }

            if (questoes.botaoAvancar) {
                var $botaoAvancar = $("<button>");
                $botaoAvancar.addClass("btn btn-default");
                $botaoAvancar.attr("id", "btnQuestaoProxima");
                $botaoAvancar.html("Próxima questão");
                $botaoAvancar.css("margin-left", "10px");
                $botaoAvancar.css("margin-right", "10px");
                $objBotoes.append($botaoAvancar);
            }

            if (questoes.botaoCancelar) {
                var $botaoCancelar = $("<button>");
                $botaoCancelar.addClass("btn btn-default");
                $botaoCancelar.attr("id", "cancelar");
                $botaoCancelar.html(questoes.botaoCancelarTexto);
                $objBotoes.append($botaoCancelar);
            }

            if (questoes.botaoFinalizar) {
                var $botaoFinalizar = $("<button>");
                $botaoFinalizar.addClass("btn btn-primary");
                $botaoFinalizar.attr("id", "finalizar");
                $botaoFinalizar.html(questoes.botaoFinalizarTexto);
                $objBotoes.append($botaoFinalizar);
            }

            //$objBotoes.append($botaoSalvar);

            return $objBotoes;
        };

        var renderContador = function () {
            var $objContador = renderContainer();
            if (questoes.contadorExibir) {
                $objContador.attr("id", "contador");
                $objContador.css("text-align", "center");
                $objContador.css("border-bottom", "1px #000 solid");
                $objContador.html(formatarData(new Date(0)));
            }
            return $objContador;
        };

        var alterarTipoSorteio = function (e, idAvaliacaoUsuarioHistoricoTipoSorteio) {
            var el = e.currentTarget;

            var ordem = parseInt($(el).data('ordem'));

            var sala = _.findWhere(questoes.objAvaliacaoUsuario.salas,
                {
                    id: parseInt($(el).data('idsalavirtualoferta'))
                });

            var questao = _.findWhere(sala.questoes,
                {
                    id: parseInt($(el).data('id'))
                });

            var dataGet = {
                id: questao.id,
                idAvaliacao: questoes.objAvaliacaoUsuario.idAvaliacao,
                idBancoQuestao: sala.idBancoQuestaoSalaVirtual,
                idAvaliacaoUsuario: questao.idAvaliacaoUsuario,
                idAvaliacaoUsuarioHistoricoTipoSorteio: idAvaliacaoUsuarioHistoricoTipoSorteio
            };

            UNINTER.Helpers.ajaxRequest({
                url: UNINTER.AppConfig.UrlWs('BQS') + 'AvaliacaoUsuarioHistorico/0/TipoSorteio',
                data: dataGet,
                async: true,
                successCallback: function (data) {

                    //Erro ao salvar?
                    if (data != void (0) && data.mensagem != null && data.mensagem.tipo !== 1) {
                        questoes.setMensagem({
                            type: 'danger',
                            strong: 'Não foi possível selecionar a questão ' + ordem + ' da disciplina ' + sala.nomeSalaVirtual,
                            body: data.mensagem.mensagem
                        });
                    } else {
                        var objQuestao = _.findWhere(listaJSON, { id: dataGet.id });
                        objQuestao.idAvaliacaoUsuarioHistoricoTipoSorteio = idAvaliacaoUsuarioHistoricoTipoSorteio;
                        questao.idAvaliacaoUsuarioHistoricoTipoSorteio = idAvaliacaoUsuarioHistoricoTipoSorteio;
                        $(el).attr('disabled', true);

                        ajustarQuantidadeQuestoesEscolha();

                    }
                },
                errorCallback: function (data) {
                    questoes.setMensagem({ type: 'danger', body: 'Não foi possível selecionar a questão ' + ordem + ' da disciplina ' + sala.nomeSalaVirtual });
                }
            });
        };

        var inicializarEditorTextoAvancado = function (selector, fnBlur, interfaceSimples) {
            /*var uninterTiny = new uninterTinymce();
            uninterTiny.destroyAll();

            //exibe modal com mensagem de limite de caracteres
            var fnModal = function (memsagem) {
                UNINTER.Helpers.showModal({
                    size: "",
                    body: memsagem,
                    title: 'Limite de caracteres',
                    buttons: [{
                        'type': "button",
                        'klass': "btn btn-primary",
                        'text': "OK",
                        'dismiss': 'modal',
                        'id': 'modal-cancel'
                    }]
                });
            };
            var max_char = 1000;
            try {
                var menu = {};
                if (!interfaceSimples) {
                    menu = {
                        file: { title: 'Visualizar', items: 'visualaid visualblocks preview | code ' }
                    };
                }

                //var uninterTiny = new uninterTinymce();
                uninterTiny.seletor = selector;

                uninterTiny.plugins = [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table contextmenu paste"
                ];
                uninterTiny.menu = menu;
                uninterTiny.valid_elements = "em/i,strong/b,ol,ul,li,br,table,tr,td,th,,p";
                uninterTiny.toolbar = "bold italic underline | visualblocks"; //| charmap
                uninterTiny.validarNrCaracteres = true;
                uninterTiny.maximoCaracter = 1000;
                uninterTiny.funcaoOnBlur = fnBlur;
                uninterTiny.statusbar = true;
                uninterTiny.permiteColar = false;
                //uninterTiny.objetoParametrosOnBlur = obj;

                uninterTiny.render();

            }
            catch (e) {
                console.log("erro inicializar" + e);
            }
            */
        };

        this.tempoEsgotado = function () {
            $($idObjDOM).html("");
            finalizar(2);
            var opcoesMsg = {
                body: "Tempo esgotado. Avaliação Finalizada",
                strong: null,
                type: "danger"
            }
            questoes.setMensagem(opcoesMsg);

        };

        var atualizarContador = function () {
            var continuar = pararContador();
            if (continuar) {
                var data = new Date(tempoAtual);
                //$("#contador").html(formatarData(data));
                tempoAtual = tempoAtual + 1000;
                auditoria = auditoria + 1;
                $("#contador").html(formatarData(tempoAtual));
            }

            if (tempoAtual >= tempoMaximo && tempoMaximo > 0) {
                questoes.tempoEsgotado();
            }

            if (questoes.gravarAudioVideo == true) {
                AuditoriaFoto();
            }
        };

        var AuditoriaFoto = function () {
            var template = '<div id="containerCapturaFotoAvaliacao" class="hide"><video id="RF-playerAvaliacao" autoplay class="img-responsive"></video><br><div class=""><canvas id="RF-snapshotAvaliacao" width=320 height=240></canvas></div><img src="" id="tmpImagem" class="img-responsive" /></div>';

            var Capture = function () {

                var snapshotCanvas = document.getElementById('RF-snapshotAvaliacao');
                var context = snapshotCanvas.getContext('2d').drawImage(document.getElementById('RF-playerAvaliacao'), 0, 0, snapshotCanvas.width, snapshotCanvas.height);
                var base64 = snapshotCanvas.toDataURL("image/jpg");
                var idAvaliacaoUsuario = listaJSON[0].idAvaliacaoUsuario;
                $('#tmpImagem').attr('src', base64);
                var s3 = new S3();
                s3.SendFile(
                    base64,
                    "AvaliacaoUsuario/Usuario_" + UNINTER.StorageWrap.getItem('user').idUsuario + "/" + idAvaliacaoUsuario + "/foto/" + idAvaliacaoUsuario + "-" + new Date().getTime()+".jpg",
                    function Success(data) {

                    },
                    function Error(data) {

                    }
                );

                //var url = UNINTER.AppConfig.UrlWs("bqs") + 'AvaliacaoUsuarioAuditoria/0/PostArray';
                //var data = {
                //    idAvaliacaoUsuario: listaJSON[0].idAvaliacaoUsuario,
                //    idAvaliacaoUsuarioAuditoriaTipo: 3,
                //    base64: base64
                //};

                //UNINTER.Helpers.ajaxRequest({
                //    url: url,
                //    async: true,
                //    data: data,
                //    type: 'POST',
                //    successCallback: function (data) {},
                //    errorCallback: function (error) {}
                //});
            };

            if (auditoria == questoes.intervaloFotoAuditoria) {
                auditoria = 0;

                if ($('#containerCapturaFotoAvaliacao').length == 0) {
                    $($idObjDOM+' div:first').before(template);
                    UNINTER.Helpers.checkForVideo(function (stream) {
                        player = document.getElementById('RF-playerAvaliacao');
                        player.srcObject = stream;
                        setTimeout(Capture, 200);
                    }, function (error) {

                    }, { video: true });
                } else {
                    Capture();
                }


            }

        };

        this.atualizarContadorSincroniaServer = function (tempoAtualServidor) {
            if (tempoAtual < tempoAtualServidor)
            {
                tempoAtual = tempoAtualServidor;
            }
            var continuar = pararContador();
            if (continuar) {
                var data = new Date(tempoAtual);
                $("#contador").html(formatarData(tempoAtual));
            }

            if (tempoAtual >= tempoMaximo && tempoMaximo > 0) {
                questoes.tempoEsgotado();
            }
        };

        //var formatarData = function (data) {
        //    var stringData = data.getUTCHours() + questoes.contadorSeparadorHora + ("0" + (data.getMinutes() + 0)).slice(-2) + questoes.contadorSeparadorMinuto + ("0" + (data.getSeconds() + 0)).slice(-2) + questoes.contadorSeparadorSegundo + questoes.contadorLegenda;
        //    return stringData;
        //};

        var formatarData = function (tempoAtual) {

            var hora = parseInt(tempoAtual / 3600000);
            var sobraHora = tempoAtual % 3600000;
            var minuto = parseInt(sobraHora / 60000);
            var sobraMiuto = sobraHora % 60000;
            var segundo = parseInt(sobraMiuto / 1000);
            
            //var stringData = data.getUTCHours() + questoes.contadorSeparadorHora + ("0" + (data.getMinutes() + 0)).slice(-2) + questoes.contadorSeparadorMinuto + ("0" + (data.getSeconds() + 0)).slice(-2) + questoes.contadorSeparadorSegundo + questoes.contadorLegenda;
            var stringData = hora + questoes.contadorSeparadorHora + ("0" + (minuto + 0)).slice(-2) + questoes.contadorSeparadorMinuto + ("0" + (segundo + 0)).slice(-2) + questoes.contadorSeparadorSegundo + questoes.contadorLegenda;
            return stringData;
        };

        var buscarQuestoes = function () {
            var opcoes = { url: questoes.ajaxUrlConsumo };
            retornoConsumo = UNINTER.Helpers.ajaxRequestError(opcoes);
            if (retornoConsumo.status == 200) {
                listaJSON = retornoConsumo.resposta[questoes.atributoJSONLista];
                executarMetodoPersonalizado(questoes.fnSucessoConsumo);
                totalQuestoes = listaJSON.length;
            }
            else {
                executarMetodoPersonalizado(questoes.fnErroConsumo, retornoConsumo.resposta);
            }
        };

        var executarMetodoPersonalizado = function (metodo, parametro, retornoConsumo) {

            if (metodo == void (0) || metodo == null) {
                return;
            }
            try {
                if (typeof metodo == 'function') {
                    if (parametro != void (0)) {
                        return metodo(parametro);
                    } else {
                        return metodo();
                    }
                }
                else {
                    if (parametro != void (0)) {
                        return eval(metodo + "(" + parametro + ")");
                    } else {
                        return eval(metodo + "()");
                    }

                }
            } catch (e) {
                console.error("Erro ao executar metodo personalizado. Exception =>")
                console.error(e);
            }
        };

        var putQuestao = function (objJSONQuestao) {
            
            var retorno = false;
            if (questoes.salvarNoClick != true || questoes.visualizacaoAmigavel == true || questoes.exibindoGabarito == true || objJSONQuestao == void(0)) {
                return;
            }

            objJSONQuestao.arquivosTemporarios = objJSONQuestao.arquivosTemporarios || [];

            if (objJSONQuestao.permiteAnexo === true)
            {
                var arrayArquivos = [];
                $( "#anexo" + objJSONQuestao.idQuestao + " input[name='arquivosTemporarios']").each(function (i, item) { arrayArquivos.push($(item).val()) });
                objJSONQuestao.arquivosTemporarios = arrayArquivos;
            }            

            var dataPost = {
                id: objJSONQuestao.id,
                idQuestaoAlternativa: objJSONQuestao.idQuestaoAlternativa,
                resposta: objJSONQuestao.resposta,
                idAvaliacaoUsuario: objJSONQuestao.idAvaliacaoUsuario,
                arquivosTemporarios: objJSONQuestao.arquivosTemporarios,
            };

            if (objJSONQuestao[questoes.atributoJSONidHistorico + 'Pai'] != void(0))
            {
                dataPost[questoes.atributoJSONidHistorico + 'Pai'] = objJSONQuestao[questoes.atributoJSONidHistorico + 'Pai']
            }

            //Envia só o necessario para deixar o tamanho do envio pequeno.
            var opcoes = {
                url: questoes.ajaxUrlSalvar,
                data: dataPost,
                type: questoes.ajaxMetodoHttpSalvar,
                async: false
            };

            retornoConsumo = UNINTER.Helpers.ajaxRequestError(opcoes);
            
            switch(retornoConsumo.status) {
                case 200:
                    $("#" + questoes.idObjDOMMensagem).empty();
                    objJSONQuestao.salvo = true;
                    dataUltimaAtualizacaoServer = new Date;
                    retorno = true;
                    questoes.atualizarContadorSincroniaServer(retornoConsumo.resposta.milisegundosDecorrido);
                    objJSONQuestao.anexos = retornoConsumo.resposta.avaliacaoUsuarioHistoricoSistemaRepositorios;

                    $("#anexo" + objJSONQuestao.idQuestao + " .uploadArquivo").remove();
                    $("#anexo" + objJSONQuestao.idQuestao + " input.btn[data-anexo]").show();
                    $("#anexosInseridos" + objJSONQuestao.idQuestao).html(questoes.renderAnexos(objJSONQuestao, true));
                    
                    //Precisa registrar o evento de exclusão.
                    $(".question a[data-excluiranexo='true']").off("click");
                    $(".question a[data-excluiranexo='true']").on("click", function (e) {
                        eveExcluirAnexo(e);
                    });

                    setRespostasComAnexo(objJSONQuestao.idQuestao);

                    if(questoes.fnAposSalvar != null)
                    {
                        try {
                            questoes.fnAposSalvar(objJSONQuestao);
                        } catch (e) {

                        }
                    }
                    return retornoConsumo.resposta.id > 0 ? retornoConsumo.resposta.id : true;
                    break;
                case 500:
                    //Erro de server:
                    objJSONQuestao.salvo = false;

                    if (retornoConsumo.resposta != null && retornoConsumo.resposta !== void (0) && retornoConsumo.resposta.length < 100) {
                        setMensagemErroSalvar(retornoConsumo.resposta);
                    } else {
                        setMensagemErroSalvar("");
                    }
                    
                    //questoes.setMensagem({ body: retornoConsumo.resposta });
                    break;
                case 403:

                    if (retornoConsumo.resposta == "[403]PROVA_NAO_DISPONIVEL") {
                        //Não autorizado.
                        objJSONQuestao.salvo = false;
                        finalizar(3);
                        questoes.setMensagem({ body: "Esta avaliação não está mais autorizada. Por favor, verifique o prazo de entrega." });
                        $($idObjDOM).html("");
                        break;
                    } else {
                        objJSONQuestao.salvo = false;
                        setMensagemErroSalvar(" Por favor, verifique sua conexão com a internet.");
                    }
                case 407:
                case 405:
                    //Proxy
                    objJSONQuestao.salvo = false;
                    setMensagemErroSalvar(" Por favor, verifique sua conexão com a internet.");
                    //questoes.setMensagem({ body: "A questão não foi salva. Por favor, verifique sua conexão com a internet." });
                    break;
                case 502:
                    //Proxy
                    objJSONQuestao.salvo = false;
                    setMensagemErroSalvar(" Por favor, verifique sua conexão com a internet.");
                    //questoes.setMensagem({ body: "A questão não foi salva. Por favor, verifique sua conexão com a internet." });
                    break;
                case 0:
                    //Proxy
                    objJSONQuestao.salvo = false;
                    setMensagemErroSalvar(" Por favor, verifique sua conexão com a internet.");
                    //questoes.setMensagem({ body: "A questão não foi salva. Por favor, verifique sua conexão com a internet." });
                    break;
                default:
                    //Proxy
                    objJSONQuestao.salvo = false;
                    setMensagemErroSalvar(" Por favor, verifique sua conexão com a internet.");
                    //questoes.setMensagem({ body: "A questão não foi salva. Por favor, verifique sua conexão com a internet." });
                    break;
            }
            //console.log(retornoConsumo);
            return retorno;
        };

        var setMensagemErroSalvar = function (strMensagem) {

            var $objMensagem = $("<div>").append( strMensagem ).append("<br>");
            questoes.setMensagem({ body: $objMensagem.html(), strong: "Não foi possível salvar a resposta!" });

            var $btnTentarNovamente = $("<button>").addClass("btn btn-danger").css("margin-top","5px").html("Tentar salvar novamente").on("click", function () {
                $("#" + questoes.idObjDOMMensagem).empty();
                putQuestao(getObjQuestaoAtual(true));
                var objQuestao = getObjQuestaoAtual(true);
                if(objQuestao.salvo == true){
                    questoes.setMensagem({ body: "Resposta salva com sucesso!", type: "success" });
                }
            });

            $("#viewavaliacaousuariohistorico #mensagem .alert ").append($btnTentarNovamente);

            UNINTER.viewGenerica.setPlaceholderHeight();
        };

        var putQuestaoPrevinir = function ()
        {

            //putQuestao(getObjQuestaoAtual());
            var continuar = pararContador();
            var agora = new Date;
            if ((agora - dataUltimaAtualizacaoServer > questoes.intervaloAtualizacaoContador) && continuar && listaJSON != void(0) && listaJSON.length > 0)
            {
                var objQuestao = getObjQuestaoAtual();
                var urlConsumoTempo = UNINTER.AppConfig.UrlWs("bqs") + "AvaliacaoUsuarioTempoDecorrido/999/Get?dataCriacao=" + objQuestao.dataCriacao;
                var opcoes = {
                    url: urlConsumoTempo, type: "GET", async: true, successCallback: function (e) {
                        questoes.atualizarContadorSincroniaServer(e.milisegundosDecorrido);
                    }
                };
                var retornoConsumo = UNINTER.Helpers.ajaxRequest(opcoes);
            }

        };

        var finalizar = function (idAvaliacaoUsuarioEntrega) {

            if (questoes.fnAntesFinalizar != null && typeof questoes.fnAntesFinalizar == "function") {
                var valido = questoes.fnAntesFinalizar();
                if (valido != true) {
                    return;
                }
            } 

            var url = questoes.ajaxUrlFinalizar;
            url = url.replace("{idAvaliacaoUsuarioEntrega}", idAvaliacaoUsuarioEntrega);
            
            var opcoes = {
                url: url,
                type: questoes.ajaxMetodoHttpFinalizar,
                async: false
            };
            var retornoConsumo = UNINTER.Helpers.ajaxRequestError(opcoes);
            forcarParadaContador();
            var opcoesMsg = {
                body: "<p>Avaliação finalizada com sucesso. Anote o número do seu protocolo.</p>",
                strong: null,
                type: "success"
            }
            if (retornoConsumo.status != 200 && retornoConsumo.status != null) {
                opcoesMsg.body = "Erro ao finalizar a avaliação. Por favor, tente novamente.";
                opcoesMsg.type = "danger";
            } else {

                $('.main-sidebar [data-notification]:first').trigger('change'); //Atualizar contador de pendencias

                var objAvaliacaoUsuario = buscarAvaliacaoUsuario();
                if (objAvaliacaoUsuario != null) {
                    if (objAvaliacaoUsuario.idAvaliacaoUsuarioStatus = 3 && objAvaliacaoUsuario.nota != null) {
                        questoes.nota = objAvaliacaoUsuario.nota;
                    }
                }

                if (questoes.exibirSucessoAvaliacaoEntrega == true && questoes.nota != void(0))
                {
                    opcoesMsg.body += "<p>Sua nota nesta tentativa foi: <strong> " + objAvaliacaoUsuario.nota + "</strong></p>";
                }


                $($idObjDOM).html("");
                UNINTER.Helpers.animatedScrollTop();

                //Se há questões adicionais e tempo suficiente, pergunta para o usuário:
                if (questoes.objAvaliacaoUsuario != null && questoes.objAvaliacaoUsuario.idAvaliacaoUsuarioStatus != 6 && listaJSONExtras != null && listaJSONExtras.length > 0 && (tempoAtual < tempoMaximo || tempoMaximo == 0) && parseInt(objAvaliacaoUsuario.nota) < 100) {
                    
                    questoes.possuiQuestoesAdicionais = true;

                    //Modal com a nota e as opções:
                    setTimeout(function () {
                        UNINTER.Helpers.showModal({
                            size: "",
                            body: "<p tabindex='0'>Sua nota nesta tentativa foi <strong class='form-title'>" + objAvaliacaoUsuario.nota + "</strong>.</p><br><p tabindex='0'><strong><span class='form-title'>Atenção!</span></strong></p><p tabindex='0'>Esta avaliação permite que você responda <span class='form-title'>questões adicionais</span> para melhorar seu desempenho.</p><p tabindex='0'> Não haverá tempo extra, você poderá respondê-las até o limite de tempo desta avaliação.</p>",
                            title: '<span class="form-title">Avaliação enviada com sucesso.</span>',
                            botaoFechar: false,
                            callback: function () {
                                $('.modal-content p:first').focus();
                            },
                            modal: {
                                keyboard: false,
                                backdrop: 'static',
                            },
                            buttons: [{
                                'type': "button",
                                'klass': "btn btn-primary",
                                'text': "Sim, quero responder.",
                                'dismiss': null,
                                'id': 'modal-ok',
                                'title': 'Sim, quero responder as questões extras.',
                                'onClick': function (event, jQModalElement) {
                                    //Evitar os alunos que ficam clicando desesperadamente no botão:
                                    jQModalElement.find('.btn').attr('disabled', true);
                                    eveQuestoesExtras(jQModalElement);
                                    //jQModalElement.modal('hide');
                                }
                            }, {
                                'type': "button",
                                'klass': "btn btn-default",
                                'text': "Não, quero finalizar agora.",
                                'title': 'Não, quero finalizar agora',
                                'dismiss': 'modal',
                                'id': 'modal-cancel',
                                'onClick': function (event, jQModalElement) {
                                    jQModalElement.modal('hide');
                                    if (questoes.fnAposFinalizar != null && typeof questoes.fnAposFinalizar == "function") {
                                        questoes.fnAposFinalizar();
                                    }
                                }
                            }]
                        });
                    }, 1000);
                    

                } else {
                    UNINTER.Helpers.animatedScrollTop();
                    questoes.setMensagem(opcoesMsg);
                }

            }
            //else {
            //    UNINTER.Helpers.animatedScrollTop();
            //    questoes.setMensagem(opcoesMsg);
            //}


            if (questoes.fnAposFinalizar != null && typeof questoes.fnAposFinalizar == "function" && questoes.possuiQuestoesAdicionais == false) {
                questoes.fnAposFinalizar();
            }

            return retornoConsumo;
        };

        var getObjQuestao = function (idQuestao, idHistorico) {
            idQuestao = idQuestao || '""';
            var lista = questoes.getListaJSON();
            var strTemp = '{"' + questoes.atributoJSONidQuestao + '": ' + idQuestao + '}';

            var objQuestao = _.findWhere(lista, JSON.parse(strTemp));

            if(objQuestao != void(0) && objQuestao.alternativaAluno != void(0)){

                if (idHistorico != void (0) && parseInt(idHistorico) > 0) {
                    strTemp = '{"' + questoes.atributoJSONidHistorico + '": ' + idHistorico + '}';
                }

                objQuestao = _.findWhere(objQuestao.alternativaAluno, JSON.parse(strTemp));

            }else{

                if (idHistorico != void (0) && parseInt(idHistorico) > 0) {
                    strTemp = '{"' + questoes.atributoJSONidHistorico + '": ' + idHistorico + '}';
                }

                objQuestao = _.findWhere(lista, JSON.parse(strTemp));

            }

            return objQuestao;
        };

        var getObjQuestaoOrdem = function (ordem) {
            var lista = questoes.getListaJSON();
            var strTemp = '{"' + questoes.atributoJSONOrdem + '": ' + ordem + '}';
            var objQuestao = _.findWhere(lista, JSON.parse(strTemp));
            return objQuestao;
        };

        var getObjQuestaoAtual = function (buscarAlternativa) {
            var objQuestao = getObjQuestaoOrdem(ordemAtual);
            if (objQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoTabela && buscarAlternativa === true) {
                return objQuestao.mx[posicaoAtualX][posicaoAtualY][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno];
            } else {
                return objQuestao;
            }
            return getObjQuestaoOrdem(ordemAtual);
        };

        this.setAlternativasMarcadas = function () {
            if (!questoes.exibindoGabarito) {

                $('#' + questoes.idObjDOM + ' input[type=radio]:checked').each(function () {
                    var input = this;
                    var idQuestao = $(input).data("idquestao");
                    var idAlternativa = $(input).data("idalternativa");
                    var objQuestao = getObjQuestao(idQuestao);
                    if (objQuestao != void (0) && objQuestao != null) {
                        objQuestao.salvo = true;
                    }
                    questoes.setAlternativaEscolhida(idQuestao, idAlternativa);
                });
            }
        };

        var setQuestoesRespondidas = function () {
            $('textarea').each(function () {
                var textarea = this;

                if ($(textarea).val().length > 0) {
                    var idQuestao = $(textarea).data("idquestao");
                    questoes.setQuestaoResposta(idQuestao);
                }
            });
        };

        var setRespostasComAnexo = function (idQuestao) {
            $.each(questoes.getListaJSON(), function (i, item) {
                if (item.anexos != null) {
                    setRespostaComAnexo(item.idQuestao);
                }
            });
        };

        var setRespostaComAnexo = function (idQuestao) {
           
            var $objManipular = $("span[data-idquestao=" + idQuestao + "]");
            var $objIcone = $("<icon>").addClass("icon-paperclip");
            $objManipular.html($objIcone);
               
        };

        this.gabaritoQuestao = function (objJSONQuestao, i) {

            var $objContainerQuestao = questoes.renderContainerQuestao(objJSONQuestao);
            $objContainerQuestao.append(renderQuestaoRevisao(objJSONQuestao));
            $objContainerQuestao.append(renderRevisaoHistorico(objJSONQuestao));
            $objContainerQuestao.append(renderTitulo(objJSONQuestao.ordem == void (0) ? (i + 1) : objJSONQuestao.ordem, objJSONQuestao));
            $objContainerQuestao.append(questoes.renderQuestao(objJSONQuestao));
            $objContainerQuestao.append(questoes.renderComando(objJSONQuestao));

            var infoAdicional = false;
            //var $p = $("<p>").css("font-size", "1.3em");
            var $p = $("<p>");
            
            if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalho
                || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHoras
                || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoEscalaTrabalho
                || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasPorcentagem
                || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasValorMaximo
            ) questoes.exibirNotaQuestao = false;
            // para trabalho nao exibe nota pois sera tratado na renderizacao do tipo de questao
          


            if (questoes.exibirTodasQuestoes && questoes.exibirNotaQuestao) {				
                infoAdicional = true;
                $p.append(renderNota(objJSONQuestao));
            }

            if (objJSONQuestao.anulada) {
                infoAdicional = true;
                $p.append(renderInfoAnulacao());
            }
            
            if(questoes.exibirGrauDificuldade)
            {
                infoAdicional = true;
                $p.append(renderInfoGrauDificuldade(objJSONQuestao));
            }
            
            if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoTabela && questoes.exibirPeso === true)
            {				
                //Margem de erro e peso caso haja:
                if (objJSONQuestao[questoes.atributoJSONQuestaoEtiquetasAgrupador].length > 0)
                {
                    infoAdicional = true;
                    $(objJSONQuestao[questoes.atributoJSONQuestaoEtiquetasAgrupador][0][questoes.atributoJSONQuestaoEtiquetasFilha]).each(function () {
                        $p.append($("<span>").addClass("label").addClass("label-default").html(this.nomeRotulo + ': ' + this.texto).css("font-weight", "normal").css('margin-left','10px'));
                    });
                }
            }
			else if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalho && questoes.exibirPeso === true){				
				//exibe peso para trabalho...
				var $objPeso = renderPesoAlternativa(objJSONQuestao.alternativas[0]);
                $p.append($objPeso);
                infoAdicional = true;
            }
            else if ((objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasPorcentagem || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasValorMaximo) && questoes.exibirPeso === true) {				
                //exibe peso para trabalho...
                
                var $objPeso = renderPorcentagemValorMaximoAlternativa(objJSONQuestao.alternativas[0]);
                $p.append($objPeso);
                infoAdicional = true;
			}
			
            if(infoAdicional)
            {
                $objContainerQuestao.append($p);
            }



            $objContainerQuestao.append(questoes.gabaritoAlternativas(objJSONQuestao));
            return $objContainerQuestao
        };

        var renderNota = function (objJSONQuestao)
        {
            var retorno = "";
            
            if (!isNaN(parseFloat(objJSONQuestao.notaQuestao))) {
                retorno = $("<span>").addClass("label").addClass("label-default").html("Nota: " + parseFloat(objJSONQuestao.notaQuestao).toFixed(1)).css("margin-right", "5px").css("font-weight", "normal");
            } else
                if (objJSONQuestao[questoes.atributoJSONPercentualAcerto] !== void (0) && objJSONQuestao[questoes.atributoJSONPercentualAcerto] != null && objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoDiscursiva) {
                    var nota = (((100 / totalQuestoes) / 100) * objJSONQuestao[questoes.atributoJSONPercentualAcerto]).toFixed(1);
                    retorno = $("<span>").addClass("label").addClass("label-default").html("Nota: " + nota).css("margin-right", "5px").css("font-weight", "normal");
            }


            return retorno;
        };

        var gabaritoAcerto = function (percentualAcerto) {
            var percentual = parseInt(percentualAcerto);
            var $objStrong = $("<strong>");

            if (percentual == 100) {
                $objStrong.addClass("text-success");
                $objStrong.html(" (Correto)");
            }
            if (percentual == 0) {
                $objStrong.addClass("text-danger");
                $objStrong.html(" (Incorreto)");
            }
            if (percentual < 100 && percentual > 0) {
                $objStrong.addClass("text-warning");
                $objStrong.html(" (Incompleto)");
            }

            return $objStrong;
        };

        this.gabaritoAlternativas = function (objJSONQuestao) {			
            //var $objAlternativas = renderContainer();

            ////Se for discursiva, renderiza o campo textArea.
            //if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoDiscursiva) {
            //    $objAlternativas.append(gabaritoDiscursiva(objJSONQuestao));
            //}
            //else {
            //    $.each(objJSONQuestao[questoes.atributoJSONAlternativas], function (i, item) {
            //        if (item[questoes.atributoJSONIdAlternativa] == objJSONQuestao[questoes.atributoJSONAlternativaMarcada]) {
            //            $objAlternativas.append(gabaritoAlternativa(item, i, true));
            //        }
            //        else {
            //            $objAlternativas.append(gabaritoAlternativa(item, i, false));
            //        }
            //    });
            //}
            //return $objAlternativas;

            var $objAlternativas;
            var $table = $("<table>");
            var $tbody = $("<tbody>");

            if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoDiscursiva) {
                $tbody.append(gabaritoDiscursiva(objJSONQuestao));
            }
            else if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalho 
                || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHoras
                || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasPorcentagem
                || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasValorMaximo
			) {
                $tbody.append(gabaritoCorrecaoTrabalho(objJSONQuestao));
            }
            else if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoTabela) {
                $tbody.append(gabaritoTabela(objJSONQuestao));
            }
            else if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoEscala) {
                $tbody.append(gabaritoEscala(objJSONQuestao));
			}
			else if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoEscalaTrabalho) {
				questoes.atributoJSONAlternativaAtributoTipoEscala = questoes.atributoJSONAlternativaAtributoTipoEscalaTrabalho;
                $tbody.append(gabaritoEscala(objJSONQuestao));
            }
			
			else{
                $.each(objJSONQuestao[questoes.atributoJSONAlternativas], function (i, item) {
                    if (item[questoes.atributoJSONIdAlternativa] == objJSONQuestao[questoes.atributoJSONAlternativaMarcada]) {
                        $tbody.append(gabaritoAlternativa(item, i, true));
                    }
                    else {
                        $tbody.append(gabaritoAlternativa(item, i, false));
                    }

                });
            }
            $table.append($tbody);

            $divResponsive = $('<div>', { class: "table-question-responsive" });
            $divResponsive.html($table);
            return $divResponsive;

        };

        var gabaritoDiscursiva = function (objJSONQuestao) {

            var $labelRespostaAluno = $("<strong>").html("Resposta: ");
            var classAdicionalArticle = '';
            if(questoes.exibirNrLinhaTextArea == true)
            {
                $labelRespostaAluno = $('<p>').html($("<strong>").html("Resposta: "));
                classAdicionalArticle = 'pull-left';
            }

            var $labelComentarioCorretor = $("<strong>").html("Comentário do revisor: ");
            var strName = "resposta" + objJSONQuestao[questoes.atributoJSONidQuestao];
            var $objDiscursiva = $("<article>").addClass("question-text");

            if (questoes.ehEnquete == true) {
                $objDiscursiva.addClass("question-text-enquete");
            }

            $objDiscursiva.attr("name", strName).addClass(classAdicionalArticle);

            if(questoes.exibirNrLinhaTextArea == true)
            {
                $objDiscursiva.css('width', '748px');
            }

            //Tem resposta salva?
            if (objJSONQuestao[questoes.atributoJSONResposta] != void (0) && objJSONQuestao[questoes.atributoJSONResposta] != null) {
                //var resposta = objJSONQuestao[questoes.atributoJSONResposta].split("<").join("&lt;");
                //resposta = resposta.split(">").join("&gt;");
                //resposta = resposta.split("\r").join("<br>");
                //resposta = resposta.split("\n").join("<br>");

                var resposta = objJSONQuestao[questoes.atributoJSONResposta];
                $objDiscursiva.text(resposta);

            }

            var divFormHorizontalResposta = $("<div>").addClass("form-horizontal ").html($objDiscursiva);
            var divFormHorizontalLabel = $("<div>").addClass("form-horizontal ").html($labelRespostaAluno);

            var $comentarioCorretor = $("<article>").addClass("question-text").html(objJSONQuestao[questoes.atributoJSONComentarioCorrecao]);

            var $td = $("<td>").html(renderComentarioDiscursiva(objJSONQuestao)).append($labelRespostaAluno).append(gabaritoDiscurivaContadorLinhas($objDiscursiva)).append($objDiscursiva);

            if ($comentarioCorretor.text().length > 0 && questoes.exibirTodasQuestoes) {
                $td.append($labelComentarioCorretor).append($comentarioCorretor);
            }

            var $tr = $("<tr>").addClass("question-choice").html($td);

            return $tr;
        };

        var gabaritoDiscurivaContadorLinhas = function($objDiscursiva){
            var $container = null;
            if(questoes.exibirNrLinhaTextArea == true)
            {
                $container = $('<div>', { class: 'pull-left mini-block inline', style: 'border-right: solid #c3c3c3 1px;padding: 0 5px;'});
            }

            return $container
        };

        var gabaritoCorrecaoTrabalho = function (objJSONQuestao) {
            
			
			var labelRespostaAluno = "Nota";
            if (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHoras
                || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasPorcentagem
                || objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoCorrecaoTrabalhoHorasValorMaximo )
				labelRespostaAluno = "Horas";


			var retorno = "";				
			if (!isNaN(parseFloat(objJSONQuestao.notaQuestao))) {
				retorno = $("<span>").addClass("label").addClass("label-default").html(labelRespostaAluno + ": " + parseFloat(objJSONQuestao.notaQuestao).toFixed(1)).css("margin-right", "5px").css("font-weight", "normal");
			} else
				if (objJSONQuestao[questoes.atributoJSONPercentualAcerto] !== void (0) && objJSONQuestao[questoes.atributoJSONPercentualAcerto] != null ) {
					
					retorno = $("<span>").addClass("label").addClass("label-default").html(labelRespostaAluno + ": " + objJSONQuestao[questoes.atributoJSONPercentualAcerto]).css("margin-right", "5px").css("font-weight", "normal");
			}

				

			return retorno;
			
            
        };

        var gabaritoAlternativa = function (objJSONAlternativa, posicaoPrefixo, checked) {

            ////var $objDiv = $("<div>").addClass("radio");
            ////var $objLabel = $("<label>");
            ////var $objInput = $("<input>").attr("type", "radio").append(objJSONAlternativa[questoes.atributoJSON]);

            //var $objStrong = null;

            //var strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoTextoQuestao + '}';
            //var objAtributoTextoAlternativa = _.findWhere(objJSONAlternativa[questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));
            //var prefixo = questoes.formatoLetraAlternativa.replace("X", letrasAlternativas[posicaoPrefixo]);

            //if (objAtributoTextoAlternativa == void (0)) {
            //    return;
            //}

            //var strTempCorreta = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoCorreta + '}';
            //var objAtributoTextoAlternativaCorreta = null;

            //try {
            //    objAtributoTextoAlternativaCorreta = _.findWhere(objJSONAlternativa[questoes.atributoJSONAlternativaAtributos], JSON.parse(strTempCorreta));
            //} catch (e) {
            //    //Erro ao tentar buscar objeto.
            //}

            //if (objAtributoTextoAlternativaCorreta != null && objAtributoTextoAlternativaCorreta !== void (0) && objAtributoTextoAlternativaCorreta[questoes.atributoJSONAlternativaAtributoTextoValor] == questoes.atributoJSONAlternativaAtributoCorretaValor) {
            //    $objStrong = $("<strong>").addClass("pull-left").html("(Alternativa correta)&nbsp;");
            //}

            //var strInputName = "questao" + objJSONAlternativa.idQuestao;
            //var strInputId = "alternativa" + objJSONAlternativa.id;

            //var $objSpanPrefixo = $("<span>").addClass("pull-left");
            //$objSpanPrefixo.html(prefixo);

            //var $objSpan = $("<span>");
            //$objSpan.append($objStrong).append(objAtributoTextoAlternativa[questoes.atributoJSONAlternativaAtributoTextoValor]);

            //var $objInput = $("<input>");
            //$objInput.attr("type", "radio");
            //$objInput.attr("name", strInputName);
            //$objInput.attr("id", strInputId);
            //$objInput.attr("value", objJSONAlternativa.id);
            //$objInput.attr("data-idquestao", objJSONAlternativa[questoes.atributoJSONidQuestao]);
            //$objInput.attr("data-idalternativa", objJSONAlternativa[questoes.atributoJSONIdAlternativa]);
            //$objInput.attr("data-letra", letrasAlternativas[posicaoPrefixo]);
            //$objInput.attr("disabled", "true");

            //if (checked) {

            //    $objInput.attr("checked", "true");
            //    var strTempComentario = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoComentario + '}';
            //    var objAtributoTextoAlternativaComentario = null;

            //    try {
            //        objAtributoTextoAlternativaComentario = _.findWhere(objJSONAlternativa[questoes.atributoJSONAlternativaAtributos], JSON.parse(strTempComentario));
            //    } catch (e) {
            //        //Erro ao tentar buscar objeto.
            //    }

            //    if (objAtributoTextoAlternativaComentario != null && objAtributoTextoAlternativaComentario != void (0) && objAtributoTextoAlternativaComentario[questoes.atributoJSONAlternativaAtributoTextoValor] != "") {
            //        var $objSpanComentario = $("<span>").addClass("badge").css("font-weight", "normal").css("padding","4px 10px 4px 10px").html(objAtributoTextoAlternativaComentario[questoes.atributoJSONAlternativaAtributoTextoValor]);
            //        $objSpan.append($objSpanComentario);
            //    }

            //}

            //var $objLabel = $("<label>");
            //$objLabel.append($objInput);
            //$objLabel.append($objSpanPrefixo);
            //$objLabel.append($objSpan);
            ////$objLabel.css("font-size", "1.2em");

            //var $objAlternativa = $("<div>");
            //$objAlternativa.addClass("radio");
            //$objAlternativa.append($objLabel);

            //return $objAlternativa;



            var strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoTextoQuestao + '}';
            var objAtributoTextoAlternativa = _.findWhere(objJSONAlternativa[questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));
            var prefixo = questoes.formatoLetraAlternativa.replace("X", letrasAlternativas[posicaoPrefixo]);
            var strInputName = "questao" + objJSONAlternativa.idQuestao;
            var strInputId = "alternativa" + objJSONAlternativa.id;
            var objPeso = "";

            if (objAtributoTextoAlternativa == void (0)) {
                return;
            }

            var $objInput = $("<input>");
            $objInput.attr("type", "radio");
            $objInput.attr("name", strInputName);
            $objInput.attr("id", strInputId);
            $objInput.attr("value", objJSONAlternativa.id);
            $objInput.attr("data-idquestao", objJSONAlternativa[questoes.atributoJSONidQuestao]);
            $objInput.attr("data-idalternativa", objJSONAlternativa[questoes.atributoJSONIdAlternativa]);
            $objInput.attr("data-letra", letrasAlternativas[posicaoPrefixo]);
            $objInput.attr("disabled", "disabled");


            if (checked) {
                $objInput.attr("checked", "true");
            }


            //--Alternativa correta:
            var classeTdCorreta = "";
            var alternativaCorreta = false;
            var objAtributoTextoAlternativaCorreta = null;
            var strTempCorreta = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoCorreta + '}';
            try {
                objAtributoTextoAlternativaCorreta = _.findWhere(objJSONAlternativa[questoes.atributoJSONAlternativaAtributos], JSON.parse(strTempCorreta));
            } catch (e) {
                //Erro ao tentar buscar objeto.
            }

            if (objAtributoTextoAlternativaCorreta != null && objAtributoTextoAlternativaCorreta !== void (0) && objAtributoTextoAlternativaCorreta[questoes.atributoJSONAlternativaAtributoTextoValor] == questoes.atributoJSONAlternativaAtributoCorretaValor) {
                classeTdCorreta = " question-choice-active";
                alternativaCorreta = true;
                objPeso = renderPesoAlternativa(objJSONAlternativa);
            }
            //--Alternativa correta


            var article = $("<article>").addClass("question-choice-body").html(objAtributoTextoAlternativa[questoes.atributoJSONAlternativaAtributoTextoValor]);
            var $tdAlternativa = $("<td>").html(article).append(objPeso).append(renderComentario(objJSONAlternativa, alternativaCorreta, checked));
            var $tdLetra = $("<td>").addClass("question-choice-label").html(prefixo);
            var $tdInput = $("<td>").addClass("question-choice-input").html($objInput);

            if (questoes.visualizacaoAmigavel == true) {
                $tdInput.addClass("hide");
            }

            var $tr = $("<tr>").addClass("question-choice" + classeTdCorreta).append($tdInput).append($tdLetra).append($tdAlternativa);

            return $tr;

        };

        var gabaritoTabela = function (objJSONQuestao) {
            return QuestaoTabelaCarregarTabela(objJSONQuestao, true);
        };

        var gabaritoEscala = function (objJSONQuestao) {
            //idAtributo = 18 (tipoExibiçãoEscala)
            //1:Somente valor - 2:Somente legenda - 3:Valor e legenda

            //idAtributo = 19 (tipoLayoutEscala)
            //1:Lado a lado (horizontal) - 2:Um por linha (vertical) - 3:Slider - 4:Combo

            var strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoTipoLayoutEscala + '}';
            var objTipoLayoutEscala = _.findWhere(objJSONQuestao[questoes.atributoJSONAlternativas][0][questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));

            strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoTipoExibicaoEscala + '}';
            var objTipoExibicaoEscala = _.findWhere(objJSONQuestao[questoes.atributoJSONAlternativas][0][questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));

            strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoTipoEscala + '}';
            var objTipoEscala = _.findWhere(objJSONQuestao[questoes.atributoJSONAlternativas][0][questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));

            if (objTipoEscala == void (0)) {
                return '';
            }
            var idEscala = parseInt(objTipoEscala.valor);
            var idTipoLayout = objTipoLayoutEscala != void (0) ? parseInt(objTipoLayoutEscala.valor) : 1;
            var idTipoLabel = objTipoExibicaoEscala != void (0) ? parseInt(objTipoExibicaoEscala.valor) : 1;

            if (isNaN(idEscala) || isNaN(idTipoLayout) || isNaN(idTipoLabel)) {
                return '';
            }

            var $div = $("<div>", { class: "form-horizontal" });

            //Já buscamos essa escala?
            if (listaEscalaLegenda[idEscala] == void (0)) {
                var opcoes = {
                    url: UNINTER.AppConfig.UrlWs("BQS") + "EscalaLegenda/" + idEscala + "/Escala",
                    type: 'GET',
                    async: false,
                    successCallback: function (data) {
                        listaEscalaLegenda[idEscala] = data.escalaLegendas;
                    },
                    errorCallback: function (err) {
                        listaEscalaLegenda = [];
                        // Algo de errado aqui...
                        console.log(err);
                    }
                }
                UNINTER.Helpers.ajaxRequest(opcoes);
            }

            
            //só exibe escalas selecionadas
            $.each(listaEscalaLegenda[idEscala], function (i, item) {
               
                if (objJSONQuestao[questoes.atributoJSONResposta] == item.valor 
				|| objJSONQuestao[questoes.atributoJSONComentarioCorrecao] == item.valor
				|| (objJSONQuestao[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoEscalaTrabalho && objJSONQuestao[questoes.atributoJSONPercentualAcerto] == item.valor)
				) {
                    var $objQuestao = $("<article>").addClass("question-text");

                    var resposta = criarLabelEscala(objJSONQuestao, item, idTipoLabel);
                    $objQuestao.text(resposta);

                    var $td = $("<td>").html($objQuestao);
                    var $tr = $("<tr>").addClass("question-choice").html($td);
                    $div.append($tr);
                }
            });
                        
            return $div.html();
        };

		
        var QuestaoTabelaCriarObjetoMatriz = function (objJSONQuestao) {

            objJSONQuestao.mx = {};

            $.each(objJSONQuestao[questoes.atributoJSONAlternativas], function (i, item) {

                var x = $(item[questoes.atributoJSONAlternativaAtributos]).filter(function () { return this.idAtributoQuestaoTipo == 14 });
                var y = $(item[questoes.atributoJSONAlternativaAtributos]).filter(function () { return this.idAtributoQuestaoTipo == 15 });

                if (x.length > 0 && y.length > 0 && parseInt(x[0].valor) > 0 && parseInt(y[0].valor) > 0) {

                    item.x = parseInt(x[0].valor);
                    item.y = parseInt(y[0].valor);

                    //Existe o atributo?
                    if (objJSONQuestao.mx[parseInt(x[0].valor)] != void (0)) {
                        objJSONQuestao.mx[parseInt(x[0].valor)][parseInt(y[0].valor)] = item;
                    } else {
                        objJSONQuestao.mx[parseInt(x[0].valor)] = {};
                        objJSONQuestao.mx[parseInt(x[0].valor)][parseInt(y[0].valor)] = item;
                    }

                    //Tem resposta salva este item?
                    var alternativaAluno = $(objJSONQuestao[questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno]).filter(function (i, el) {
                        return el.idQuestaoAlternativa == item.id;
                    });

                    if (alternativaAluno != null && alternativaAluno != void (0) && alternativaAluno.length > 0) {
                        objJSONQuestao.mx[parseInt(x[0].valor)][parseInt(y[0].valor)][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno] = alternativaAluno[0];
                    } else {
                        objJSONQuestao.mx[parseInt(x[0].valor)][parseInt(y[0].valor)][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno] = null;
                    }

                }

            });

            return objJSONQuestao;

            ////Se não criou a matriz, é porque está criando. Iniciamos com uma posição
            //if (mx["1"] == void (0)) {
            //    mx["1"] = {};
            //    mx["1"]["1"] = _this.modelo;
            //}
        };

        var QuestaoTabelaGetIndicesMatriz = function (objJSONQuestao) {

            var indices = {
                x0: null,
                x1: null,
                y0: null,
                y1: null
            };

            var linhas = Object.keys(objJSONQuestao.mx).map(Number).filter(function (a) {
                return isFinite(a) && objJSONQuestao.mx[a];
            });

            indices.x0 = Math.min.apply(Math, linhas);
            indices.x1 = Math.max.apply(Math, linhas);

            var colunas = Object.keys(objJSONQuestao.mx[indices.x0]).map(Number).filter(function (a) {
                return isFinite(a) && objJSONQuestao.mx[indices.x0][a];
            });

            indices.y0 = Math.min.apply(Math, colunas);
            indices.y1 = Math.max.apply(Math, colunas);

            return indices;

        };

        var QuestaoTabelaCarregarTabela = function (objJSONQuestao, gabarito) {

            //10	tabelaLinhaTitulo
            //11	tabelaColunaTitulo
            //12	tabelaLinhaColunaValorEsperado
            //13	tabelaLinhaColunaPercentual
            //14	Posição X
            //15	Posição Y

            if (objJSONQuestao.mx == void(0) || Object.keys(objJSONQuestao.mx).length === 0) {
                QuestaoTabelaCriarObjetoMatriz(objJSONQuestao);
            }

            var classe = 'table-question table-question-criacao';
            if(gabarito == true)
            {
                classe = 'table-question table-question-gabarito';
            }

            var table = $('<table>', { class: classe, id: "tabela" + objJSONQuestao.idQuestao }).css('width', 'auto');
            var thead = $('<thead>');
            var tbody = $('<tbody>');
            var trThead = $('<tr>')
                .append($('<th>').html(" "));

            var indices = QuestaoTabelaGetIndicesMatriz(objJSONQuestao);

            for (i = indices.x0; i <= indices.x1; i++) {

                if (objJSONQuestao.mx[i] != void (0)) {

                    var tr = $("<tr>", { "data-x": i });

                    for (j = indices.y0; j <= indices.y1; j++) {

                        if (objJSONQuestao.mx[i][j] != void (0)) {

                            //Se é a primeira posição do J - é a primeira linha.
                            if (j == indices.y0) {
                                //tr.append($('<td>').html(_this.criarInputTabelaColuna(i, j)));
                                tr.append($('<th>', { "data-y": 0, "data-x": i }).html(QuestaoTabelaCriarLabel(i, j, { type: "text", attrId: "idLinha", idAtributoQuestaoTipo: 10, placeholder: 'Titulo linha', disabled: true }, objJSONQuestao)));
                            }

                            //Se é a primeira posição do I - adiciona coluna.
                            if (i == indices.x0) {
                                //trThead.append($("<th>").html(_this.criarInputTabelaLinha(i, j)));
                                trThead.append($("<th>", { "data-x": 0, "data-y": j }).html(QuestaoTabelaCriarLabel(i, j, { type: "text", attrId: "idColuna", idAtributoQuestaoTipo: 11, placeholder: 'Titulo coluna', disabled: true }, objJSONQuestao)));
                            }

                            //Linha da grid - valor esperado.
                            if (gabarito == true) {
                                tr.append($('<td>', { "data-x": i, "data-y": j }).html(GabaritoQuestaoTabelaInput(i, j, { type: "number", attrId: "id", idAtributoQuestaoTipo: 12, placeholder: i + '|' + j }, objJSONQuestao)));
                            } else {
                                tr.append($('<td>', { "data-x": i, "data-y": j }).html(QuestaoTabelaCriarInput(i, j, { type: "number", attrId: "id", idAtributoQuestaoTipo: 12, placeholder: i + '|' + j }, objJSONQuestao)));
                            }
                        }
                    }

                    tbody.append(tr);
                }
            }

            thead.append(trThead);
            table.append(thead).append(tbody);

            var divResponsive = $('<div>');
            divResponsive.html(table);

            if(gabarito == true)
            {
                divResponsive.append(GabaritoQuestaoTabelaLegenda());
            }

            return divResponsive;
        };

        var QuestaoTabelaCriarLabel = function (x, y, options, objJSONQuestao) {

            objJSONQuestao.mx[x][y][options.attrId] = objJSONQuestao.idQuestao + '-' + x + '-' + y;

            var atributoValor = $(objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaAtributos]).filter(function (e) { return this.idAtributoQuestaoTipo == options.idAtributoQuestaoTipo; });
            var $span = $('<span>').html(atributoValor[0].valor);
            return $span;
        };

        var QuestaoTabelaCriarInput = function (x, y, options, objJSONQuestao) {

            objJSONQuestao.mx[x][y][options.attrId] = objJSONQuestao.idQuestao + '-' + x + '-' + y;

            var $input = $('<input>', {
                type: options.type,
                id: objJSONQuestao.mx[x][y][options.attrId],
                //placeholder: options.placeholder,
                value: objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno][questoes.atributoJSONResposta],
                "data-idhistorico":objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno].id,
                "data-idquestao":objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno].idQuestao
            })
            .on('blur', function (e) {

                var respostaSalva = objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno][questoes.atributoJSONResposta];
                var respostaAtual = $("#" + objJSONQuestao.mx[x][y][options.attrId]).val();

                if (respostaSalva == null) { respostaSalva = '' }
                if (respostaAtual == null) { respostaAtual = '' }

                if( respostaSalva != respostaAtual )
                {
                    objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno][questoes.atributoJSONResposta] = respostaAtual;
                    var objQuestaoSalvar = objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno];

                    //Registra onde parou para salvar novamente no caso de erro:
                    posicaoAtualX = x;
                    posicaoAtualY = y;

                    putQuestao(objQuestaoSalvar);
                }
            });
            return $input;
        };

        var GabaritoQuestaoTabelaInput = function (x, y, options, objJSONQuestao) {

            //<div class="form-group has-feedback" style="position: relative;">
            //    <input type="number" id="undefined-1-2" placeholder="1|2" class="" value="-8">  
            //    <i class="icon icon-check form-control-feedback" aria-hidden="true"></i>
            //</div>

            /*
            <td data-x="1" data-y="2">
                <input type="number" id="undefined-1-2" placeholder="1|2" class="" value="-8">
                <div class="form-group has-error has-feedback pull-right">
                    <span class="input-group-addon" id="basic-addon3">-9</span>
                    <i class="icon icon-check form-control-feedback" aria-hidden="true"></i>
                </div>
            </td>
            */

            //objJSONQuestao.mx[x][y][options.attrId] = objJSONQuestao.idQuestao + '-' + x + '-' + y;

            var atributoValor = $(objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaAtributos]).filter(function (e) { return this.idAtributoQuestaoTipo == questoes.atributoJSONAlternativaAtributoGabaritoTabela; });

            var classIcone = 'icon icon-times form-control-feedback';
            var classContainer = 'form-group has-error has-feedback';

            if (objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno] != void (0) && parseInt(objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno].percentualAcerto) == 100)
            {
                classIcone = 'icon icon-check form-control-feedback';
                classContainer = 'form-group has-success has-feedback';
            }

            var resposta = ''
            if(objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno] != null){
                resposta = objJSONQuestao.mx[x][y][questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno].resposta;
            }

            var $container = $('<div>', { class: "bloco-resposta" });
            var $containerGabarito = $('<div>', { class: classContainer })
                .append($('<span>', { class: "input-group-addon" }).html(resposta))
                .append($('<i>', { class: classIcone }));

            //var $span = $('<span>', { class: "input-group-addon" }).html(atributoValor[0].valor);
            //var $i = $('<i>', { class: "icon icon-check form-control-feedback" });

            var $input = $('<span>', { class: "resposta-esperada" }).html(atributoValor[0].valor);


            $container.append($input).append($containerGabarito);

            return $container;
            
        };

        var GabaritoQuestaoTabelaLegenda = function () {

            var respostaEsperada = '<div class="bloco-resposta legenda"><span class="resposta-esperada legenda">&nbsp;</span><span class="legenda-descricao">Resposta esperada</span></div>';
            var respostaCorreta = '<div class="bloco-resposta legenda"><div class="form-group has-success has-feedback"><span class="input-group-addon"></span><i class="icon icon-check form-control-feedback"></i></div><span class="legenda-descricao">Resposta dada (correta)</span></div>'
            var respostaErrada = '<div class="bloco-resposta legenda"><div class="form-group has-error has-feedback"><span class="input-group-addon"></span><i class="icon icon-times form-control-feedback"></i></div><span class="legenda-descricao">Resposta dada (incorreta)</span></div>';

            //var $containerRespEsperada = $('<div>', { class: "col-sm-4" }).html(respostaEsperada);
            //var $containerRespCorreta = $('<div>', { class: "col-sm-4" }).html(respostaCorreta);
            //var $containerRespErrada = $('<div>', { class: "col-sm-4" }).html(respostaErrada);

            //return $('<div>', { class: "table-question table-question-gabarito" }).append('<p>Legenda: </p>').append($containerRespEsperada).append($containerRespCorreta).append($containerRespErrada);
            return $('<div>', { class: "table-question table-question-gabarito" }).append('<p>Legenda: </p>').append(respostaEsperada).append(respostaCorreta).append(respostaErrada);

        };

        var renderComentario = function (objJSONAlternativa, alternativaCorreta, checked) {
            var $objIcone = $("<i>").addClass("icon-comment");
            var objComentario = comentario = "";
            var renderizar = false;
            var objAlternativaCorreta = "";
            var strTempComentario = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoComentario + '}';
            var objAtributoTextoAlternativaComentario = null;
            try {
                objAtributoTextoAlternativaComentario = _.findWhere(objJSONAlternativa[questoes.atributoJSONAlternativaAtributos], JSON.parse(strTempComentario));
            } catch (e) {
                //Erro ao tentar buscar objeto.
            }

            if (alternativaCorreta && checked) {
                renderizar = true;
                objAlternativaCorreta = $("<p>").html($("<strong>").html("Você acertou!"));
            }

            if (objAtributoTextoAlternativaComentario != null && objAtributoTextoAlternativaComentario != void (0)) {
                var $div = $("<div>").html(objAtributoTextoAlternativaComentario[questoes.atributoJSONAlternativaAtributoTextoValor]);

                //Em alguns casos possui apenas a imagem, sem texto. Então, precisamos testar assim´tbm
                var $imagem = $div.find('img');

                if ($div.text().length > 0 || $imagem.length > 0) {
                    renderizar = true;
                    comentario = objAtributoTextoAlternativaComentario[questoes.atributoJSONAlternativaAtributoTextoValor];
                }
            }

            if (renderizar) {
                objComentario = $("<div>").addClass("question-choice-comment").append($objIcone).append(objAlternativaCorreta).append(comentario);
            }

            return objComentario;
        };

        var renderComentarioDiscursiva = function (objJSONQuestao) {

            //O comentário da discurviva vem em uma alternativa:
            
            var $objIcone = $("<i>").addClass("icon-comment");
            var objComentario = comentario = "";
            var renderizar = false;
            var objAlternativaCorreta = "";
            var strTempComentario = '{"idAtributoQuestaoTipo":' + questoes.atributoJSONQuestaoEtiquetasIdQuestaoTipoRotuloOrientacao + '}';
            var objAtributoTextoAlternativaComentario = null;
            try {
                //var objEtiqueta = objJSONQuestao[questoes.atributoJSONQuestaoEtiquetasAgrupador][0];
                //objAtributoTextoAlternativaComentario = _.findWhere(objEtiqueta[questoes.atributoJSONQuestaoEtiquetasFilha], JSON.parse(strTempComentario));

                var listaAtributosAlternativa = objJSONQuestao[questoes.atributoJSONAlternativas][0][questoes.atributoJSONAlternativaAtributos];
                objAtributoTextoAlternativaComentario = _.findWhere(listaAtributosAlternativa, JSON.parse(strTempComentario));

            } catch (e) {
                //Erro ao tentar buscar objeto.
            }

            if (objAtributoTextoAlternativaComentario != null && objAtributoTextoAlternativaComentario != void (0) && objAtributoTextoAlternativaComentario[questoes.atributoJSONAlternativaAtributoTextoValor] != "") {
                renderizar = true;
                comentario = objAtributoTextoAlternativaComentario[questoes.atributoJSONAlternativaAtributoTextoValor];
            }

            if (renderizar) {
                objComentario = $("<div>").addClass("question-choice-comment").append($objIcone).append(objAlternativaCorreta).append(comentario);
            }

            return objComentario;
        };

        var renderInfoAnulacao = function () {
            return $("<span>").addClass("label").addClass("label-default").html("Questão anulada!").css("font-weight", "normal");
        };

        var renderInfoGrauDificuldade = function (item) {
            return $("<span>").addClass("label").addClass("label-default").html(item[questoes.atributoJSONGrauDificuldade]).css("font-weight", "normal");
        };

        var renderPesoAlternativa = function (objJSONAlternativa) {

            var $div = $("<div>");

            if (questoes.exibirPeso != true) {
                return $div.html();
            }

            var strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoPesoAlternativa + '}';

            var objAtributoTextoAlternativa = null;
            try {
                objAtributoTextoAlternativa = _.findWhere(objJSONAlternativa[questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));
            } catch (e) {
                objAtributoTextoAlternativa = null;
            }

            if (objAtributoTextoAlternativa != null && objAtributoTextoAlternativa != void (0)) {
                var $divContainer = $("<div>");
                var $span = $("<span>").addClass("label label-default").css("font-weight","normal").html("Peso: ").append(objAtributoTextoAlternativa[questoes.atributoJSONAlternativaAtributoTextoValor]);
                $div.append($divContainer.append($span));
            }
            return $div.html();
        };
        var renderPorcentagemValorMaximoAlternativa = function (objJSONAlternativa) {
            //usada para questoes do tipo horas... 
            var $div = $("<div>");

            if (questoes.exibirPeso != true) {
                return $div.html();
            }

            var strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoPorcentagemAlternativa + '}';

            var objAtributoTextoAlternativa = null;
            try {
                objAtributoTextoAlternativa = _.findWhere(objJSONAlternativa[questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));
            } catch (e) {
                objAtributoTextoAlternativa = null;
            }

            if (objAtributoTextoAlternativa != null && objAtributoTextoAlternativa != void (0)) {
                var $divContainer = $("<div>");
                var $span = $("<span>").addClass("label label-default").css("font-weight","normal").html("Porcentagem: ").append(objAtributoTextoAlternativa[questoes.atributoJSONAlternativaAtributoTextoValor]);
                $div.append($divContainer.append($span));
            }

            var strTemp = '{"' + questoes.atributoJSONAlternativaAtributoTexto + '":' + questoes.atributoJSONAlternativaAtributoValorMaximoAlternativa + '}';

            var objAtributoTextoAlternativa = null;
            try {
                objAtributoTextoAlternativa = _.findWhere(objJSONAlternativa[questoes.atributoJSONAlternativaAtributos], JSON.parse(strTemp));
            } catch (e) {
                objAtributoTextoAlternativa = null;
            }

            if (objAtributoTextoAlternativa != null && objAtributoTextoAlternativa != void (0)) {
                
                var $divContainer = $("<div>");
                var $span = $("<span>").addClass("label label-default").css("font-weight","normal").html("Valor máximo: ").append(objAtributoTextoAlternativa[questoes.atributoJSONAlternativaAtributoTextoValor]);
                $div.append($divContainer.append($span));
            }
            return $div.html();
        };
        var renderpopupEntrega = function () {
            var lista = questoes.getListaJSON();
            var questaoNaoRespondida = 0;
            var questaoNaoSalva = 0;
            var texto = "";

            $.each(lista, function (i, item) {
                if (item[questoes.atributoJSONTipoQuestao] == questoes.atributoJSONTipoQuestaoTabela) {

                    $.each(item[questoes.atributoJSONAlternativaQuestaoTabelaRespostaAluno], function (j, alternativa) {

                        if(alternativa.resposta == "" || alternativa.resposta == null || alternativa.resposta.replace(' ', '').length == 0)
                        {
                            $('[data-idhistorico="' + alternativa.id + '"]').trigger('change');

                            if (alternativa.resposta == "" || alternativa.resposta == null || alternativa.resposta.replace(' ', '').length == 0) {
                                questaoNaoRespondida++;
                            }
                        }

                        if(alternativa.salvo == false)
                        {
                            putQuestao(alternativa);
                            if (alternativa.salvo == false)
                            {
                                questaoNaoSalva++;
                            }
                        }

                    });

                } else {

                    if (item.idQuestaoAlternativa == null && (item.resposta == null || item.resposta == "") && item.anexos == null) {
                        questaoNaoRespondida++;
                    }

                    if (item.salvo == false) {
                        putQuestao(item);
                        if (item.salvo == false) {
                            //setMensagemErroSalvar(" A questão " + item.ordem + " ainda não foi salva. Tente salvá-la novamente antes de finalizar.");
                            questaoNaoSalva++;
                            questoes.setLayout(item.ordem);
                            return;
                        }
                    }

                }

            });
            
            if (questaoNaoSalva > 0) {
                return;
            }

            if (questaoNaoRespondida > 0) {
                if (questaoNaoRespondida == 1) {
                    texto = "<p class='text-danger'><strong>Ainda há 1 questão não respondida.</strong></p>";
                } else {
                    texto = "<p class='text-danger'><strong>Ainda há " + questaoNaoRespondida + " questões não respondidas.</strong></p>";
                }

                texto += "<p>Se finalizar agora, a avaliação será entregue e não poderá ser alterada.</p>";
                texto += "<p>As questões não respondidas serão consideradas como erradas.</p><p><strong>Deseja finalizar a avaliação?</strong></p>";
            } else {
                texto = "<p>A avaliação será finalizada e não poderá ser alterada.</p><p>Deseja finalizar a avaliação?</p>";
            }


            if (questoes.exibirConfirmacaoEntrega == false)
            {
                eveFinalizar();
                return;
            }

            UNINTER.Helpers.showModal({
                size: "",
                body: texto,
                title: 'Finalizar a avaliação',
                buttons: [{
                    'type': "button",
                    'klass': "btn btn-primary",
                    'text': "Sim",
                    'dismiss': null,
                    'id': 'modal-ok',
                    'title': 'Sim, quero entregar minha avaliação.',
                    'onClick': function (event, jQModalElement) {
                        //Evitar os alunos que ficam clicando desesperadamente no botão:
                        jQModalElement.find('.btn').attr('disabled', true);
                        jQModalElement.modal('hide');
                        eveFinalizar();
                    }
                }, {
                    'type': "button",
                    'klass': "btn btn-default",
                    'text': "Não",
                    'title':'Não quero entregar minha avaliação ainda.',
                    'dismiss': 'modal',
                    'id': 'modal-cancel'
                }]
            });
        };

        // ==============================================


        /************************************************
         * EVENTOS
         ************************************************/

        var removerEventos = function () {
            $($seletorEventosRadio).off("click");
            $($seletorEventosInput).off("blur");
            
        };

        var eventos = function () {

            $($seletorEventoNavegacaoTemaAvancar).off('click').on('click', function (e) {
                $($idObjDOM + " li.active").next().trigger('click');
                exibirOcultarAvancarVoltarTab();

                try { UNINTER.Helpers.animatedScrollTop() } catch (e) { };
            });

            $($seletorEventoNavegacaoTemaVoltar).off('click').on('click', function (e) {
                $($idObjDOM + " li.active").prev().trigger('click');
                exibirOcultarAvancarVoltarTab();

                try { UNINTER.Helpers.animatedScrollTop() } catch (e) { };
            });


            $($seletorEventoNavegacaoTema).off('click').on('click', function (event) {

                $($seletorEventoNavegacaoTema).removeClass('active');
                $(event.currentTarget).addClass('active');
                $( $idObjDOM + ' .itemNav').hide();
                $('#' + $(event.currentTarget).data('target')).show();

                if ($('#' + $(event.currentTarget).data('target')).find('h4.sessaoAba').length > 0) {
                    $('#' + $(event.currentTarget).data('target')).find('h4.sessaoAba:first').focus();
                } else {
                    $('#' + $(event.currentTarget).data('target')).find('article:first').focus();
                }

                $('#' + questoes.idObjDOM + "NavQuestaoTitulo").html($(event.currentTarget).find('a').html());

                try {
                    $($seletorEventosSlider).slider('destroy');
                } catch (e) {

                }

                setTimeout(function () {
                    try {
                        $($seletorEventosSlider).slider({ formatter: formatterSlider });
                        eventosSlider();
                    } catch (e) {

                    }
                }, 20);

                exibirOcultarAvancarVoltarTab();

            });

            $($seletorEventosRadio).off('click').on('click', function (event) {
                
                var $el = $(event.currentTarget);
                var $input = $el.find('input');

                var seletor = '[data-idhistorico="' + $input.attr('data-idhistorico') + '"]';

                $(seletor).each(function (i, item) {
                    if ($(item).val() != $input.val()) {
                        $('#' + $(item).attr('id') + '_resposta').attr('disabled', 'disabled').val('').addClass('hide');
                        $(item).parent().parent().removeClass('question-choice-active');
                    } else {
                        $(item).parent().parent().addClass('question-choice-active');
                    }
                });

                if ($input.is(":checked")) {
                    $('#' + $input.attr('id') + '_resposta').removeAttr('disabled').removeClass('hide');
                }

                eveAlternativaEscolhida(event, true);
            });

            $($seletorEventosEscala).off('click').on('click', function (event) {
                eveQuestaoEscalaRespondida(event);
            });

            $($seletorEventosRadioComentario).off('blur').on('blur', function (event) {
                var id = '#' + $(event.currentTarget).attr('id').replace('_resposta', '');
                $(id).parent().trigger('click');
            });

            /*
            $($seletorEventosInput).blur(function (event) {
                eveQuestaoCorrecaoRespondida(event);
            });*/

            $($seletorEventosSelect).off('change').on('change', function (event) {
                eveComboEscolhida(event, true);
            });


            $($idObjDOM).off('keydown.avaliacao');

            $($idObjDOM).on('keydown.avaliacao', 'textarea', function (event) {
                if (questoes.capturarParagrafoTextarea == true) {
                    var keyCode = event.keyCode || event.which;

                    if (keyCode == 9) {
                        event.preventDefault();
                        var start = this.selectionStart;
                        var end = this.selectionEnd;

                        // set textarea value to: text before caret + tab + text after caret
                        $(this).val($(this).val().substring(0, start)
                                    + "\t"
                                    + $(this).val().substring(end));

                        // put caret at right position again
                        this.selectionStart =
                        this.selectionEnd = start + 1;
                        return;
                    }
                }
                eveQuestaoRespondida(event, false);
            });

            $($seletorEventosInputNumber).off("blur").on("blur", function (event) {
                eveQuestaoRespondida(event, false);
            });

            //$($seletorEventosSlider).off("slide").on("slide", function (event) {
            //    debugger;
            //    eveQuestaoRespondida(event, true);
            //});

            $('.nao-aplicavel').off('change').on('change', function (e) {
                eveNaoOpinar(e);
            })

            eventosSlider();

            $($seletorEventosInputNumber).off("change");
            $($seletorEventosInputNumber).change(function (event) {
                eveQuestaoRespondida(event, true);
            });

            //Não permitimos copiar e colar.
            $($seletorEventosTextArea).on("paste copy cut drag drop", function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
            });

            $($seletorEventosTextArea).bind('mouseup mouseup', function (e) {
                UNINTER.viewGenerica.setPlaceholderHeight();
            });

            $($seletorEventosTextArea).focusout(function (event) {
                eveQuestaoRespondida(event, true);
            });

            $($seletorEventoNavegacao).click(function (event) {
                eveNavegacao(event);
            });

            $($seletorEventoVoltar).click(function (event) {
                eveVoltar();
            });

            $($seletorEventoAvancar).click(function (event) {
                eveAvancar();
            });

            $("#btnQuestaoAnterior").click(function (event) {
                event.preventDefault();
                eveVoltar();
            });

            $("#btnQuestaoProxima").click(function (event) {
                event.preventDefault();
                eveAvancar();
            });

            $("#finalizar").click(function () {
                renderpopupEntrega();
                //eveFinalizar();
            });

            $("#cancelar").click(function () {
                eveCancelar();
            });

            $(".question input.btn[data-anexo='true']").off("click");
            $(".question input.btn[data-anexo='true']").on("click", function (e) {
                eveFormUploadAnexo(e);
            });

            $(".question a[data-excluiranexo='true']").off("click");
            $(".question a[data-excluiranexo='true']").on("click", function (e) {
                eveExcluirAnexo(e);
            });

            $(".question-choice-input input[type='checkbox']").off("click.choice").on("click.choice", function (e) {
                var $el = $(e.currentTarget);

                if ($el.is(":checked")) {
                    $('#' + $el.attr('id') + '_resposta').removeAttr('disabled').removeClass('hide');
                } else {
                    $('#' + $el.attr('id') + '_resposta').attr('disabled', 'disabled').val('').addClass('hide');
                }
            });

            
            eveNavegarTabela();
        };

        var exibirOcultarAvancarVoltarTab = function () {

            var proxima = $($idObjDOM + " li.active").next().length;
            var anterior = $($idObjDOM + " li.active").prev().length;

            if (proxima > 0) {
                $($seletorEventoNavegacaoTemaAvancar).show();
            } else {
                $($seletorEventoNavegacaoTemaAvancar).hide();
            }

            if (anterior > 0) {
                $($seletorEventoNavegacaoTemaVoltar).show();
            } else {
                $($seletorEventoNavegacaoTemaVoltar).hide();
            }
        };

        var eventosSlider = function () {
            $($seletorEventosSlider).off("slideChange", "slideChange").off('slide').off('click').on({
                click: function (event) {
                    eveQuestaoSliderRespondida(event, true);
                },
                change: function (event) {
                    eveQuestaoSliderRespondida(event, true);
                },
                slideChange: function (event) {
                    eveQuestaoSliderRespondida(event, true);
                },
                slide: function (event) {
                    //eveQuestaoRespondida(event, true);
                }
            });

            //O primeiro registro não dispara o change porque foi iniciado com ele. Então forçamos:
            $($idObjDOM).off('click', '.min-slider-handle').on('click', '.min-slider-handle', function (eve) {
                var $el = $(eve.currentTarget).parent().parent().parent().find('input');
                if ($el.val() == '1') {
                    $el.trigger('change');
                }
            })

        };

        var eveHistoricoRevisao = function () {
            $(".historicoLog").click(function (e) {
                e.stopImmediatePropagation();
                var id = $(this).parent("a").attr("id");
                UNINTER.viewGenerica.parametros.idUrl = id;
                UNINTER.viewGenerica.novaJanela("ava/AvaliacaoUsuarioHistoricoLog/" + id + "/Exibir", null);
            });
        }

        var eveAlternativaEscolhida = function (evento) {

            var tr = evento.currentTarget;
            var objClicado = $(tr).find("input");
            var idAlternativa = $(objClicado).data("idalternativa");
            var idHistorico = $(objClicado).data("idhistorico");
            var idQuestao = $(objClicado).data("idquestao");
            var resposta = null;

            //Existe texto de comentario?
            if ($('#' + objClicado.attr('id') + '_resposta').length > 0) {
                resposta = $('#' + objClicado.attr('id') + '_resposta').val();
            }
            
            if (parseInt(idAlternativa) > 0 && parseInt(idQuestao) > 0) {

                //executarMetodoPersonalizado(questoes.fnClickAlternativa, objClicado);

                questoes.setAlternativaEscolhida(idQuestao, idAlternativa, idHistorico);
                
                var objQuestao = getObjQuestao(idQuestao, idHistorico);

                //Questao multipla escolha tem tratamento diferente
                if (questoes.atributoJSONTipoQuestaoMultiplaEscolha == objQuestao[questoes.atributoJSONTipoQuestao]) {


                    //Está marcando ou desmarcando?
                    var checked = objClicado.is(':checked');

                    if (checked == true) {
                        //1: Está marcando...
                        //1.1: cria um objeto novo (com id = 0 e idPai correto) e faz o put esperando o id
                        //1.2: pega o id e o elemento novo clicado e insere na lista de alternativas marcadas.

                        var objPesquisa = {};
                        objPesquisa[questoes.atributoJSONAlternativaMarcada] = null;
                        var objQuestaoNull = _.findWhere(objQuestao.alternativasSelecionadas, objPesquisa);

                        if (objQuestaoNull != void (0)) {
                            objQuestaoNull[questoes.atributoJSONAlternativaMarcada] = idAlternativa;
                            objQuestaoNull[questoes.atributoJSONResposta] = resposta;
                            putQuestao(objQuestaoNull);

                        } else {
                            var objQuestaoEnvio = _.clone(objQuestao);
                            delete objQuestaoEnvio.alternativasSelecionadas;
                            objQuestaoEnvio.id = 0;
                            objQuestaoEnvio[questoes.atributoJSONAlternativaMarcada] = idAlternativa;
                            objQuestaoEnvio[questoes.atributoJSONResposta] = resposta;

                            objQuestaoEnvio.id = putQuestao(objQuestaoEnvio);

                            objQuestao.alternativasSelecionadas.push(objQuestaoEnvio);
                        }


                    } else {
                        //2: Está desamarcando
                        //2.1: envia no put resposta e idQuestaoAlternativa nulos com o id correto
                        //2.2: remove da lista de alternativas marcadas
                        var objPesquisa = {};
                        objPesquisa[questoes.atributoJSONAlternativaMarcada] = idAlternativa;
                        var objQuestaoDelete = _.findWhere(objQuestao.alternativasSelecionadas, objPesquisa);

                        var index = -1;

                        _.each(objQuestao.alternativasSelecionadas, function (data, idx) {
                            if (_.isEqual(data, objQuestaoDelete)) {
                                index = idx;
                                return;
                            }
                        });

                        objQuestaoDelete[questoes.atributoJSONAlternativaMarcada] = null;
                        objQuestaoDelete[questoes.atributoJSONResposta] = null;

                        putQuestao(objQuestaoDelete);
                        objQuestao.alternativasSelecionadas.splice(index, 1);

                    }


                } else {
                    if (objQuestao[questoes.atributoJSONAlternativaMarcada] != idAlternativa || resposta != objQuestao[questoes.atributoJSONResposta])
                    {
                        objQuestao.salvo = false;
                        objQuestao[questoes.atributoJSONResposta] = resposta;
                        objQuestao[questoes.atributoJSONAlternativaMarcada] = idAlternativa;
                        putQuestao(objQuestao);
                    }
                }
            }
        };

        var eveComboEscolhida = function (evento) {

            var objClicado = evento.currentTarget;
            var idHistorico = $(objClicado).data("idhistorico");
            var idQuestao = $(objClicado).data("idquestao");
            var resposta = $(objClicado).val();

            if (isNaN(parseInt(resposta)) == false) {

                //questoes.setAlternativaEscolhida(idQuestao, idAlternativa);

                var objQuestao = getObjQuestao(idQuestao, idHistorico);

                if (resposta != objQuestao[questoes.atributoJSONResposta]) {
                    objQuestao.salvo = false;
                    objQuestao[questoes.atributoJSONResposta] = resposta;
                    putQuestao(objQuestao);
                }
            }
        };

        var eveNaoOpinar = function (evento) {
            var $el = $(evento.currentTarget);

            var id = $el.data('idhistorico');

            var disabled = false;

            var objQuestao = getObjQuestao(void (0), id);
            var value = null;

            if ($el.is(':checked')) {
                disabled = true;
                value = -1;
            }

            if($('div[data-containerescala="' + id + '"]').find('select').length > 0 && value == -1)
            {
                manipularQuestaoEscalaRespondida(evento.currentTarget, true);
            }

            $('div[data-containerescala="' + id + '"]').find('input, select').not('[type="checkbox"]').val(value).prop('disabled', disabled).trigger('change').trigger('slideChange');

            objQuestao[questoes.atributoJSONResposta] = value;

            
        };

        var eveQuestoesExtras = function (jQModalElement) {
            questoes.possuiQuestoesAdicionais = false;
            
            UNINTER.Helpers.ajaxRequest({
                url: UNINTER.AppConfig.UrlWs('BQS') + '/AvaliacaoUsuario/' + questoes.objAvaliacaoUsuario.id + '/ResponderQuestoesExtras/',
                async: true,
                successCallback: function (data) {

                    if (data.mensagem != void (0) && data.mensagem.tipo == 1) {
                        jQModalElement.modal('hide');
                        ordemAtual = void (0);
                        listaJSON = listaJSONExtras;
                        questoes.objAvaliacaoUsuario.idAvaliacaoUsuarioStatus = 6;
                        questoes.render();

                        setTimeout(function () {
                            $('[data-ordem="1"] .title').focus();
                        }, 500);

                        //setTimeout(function () {
                        //    putQuestaoPrevinir();
                        //}, 500);
                        
                        
                    } else {
                        jQModalElement.modal('hide');
                        UNINTER.Helpers.animatedScrollTop();
                        questoes.setMensagem({ body: 'Não foi possível gerar as questões extras.', type: 'danger' });
                    }

                },
                errorCallback: function (a, b, c) {
                    jQModalElement.modal('hide');
                    UNINTER.Helpers.animatedScrollTop();
                    questoes.setMensagem({body: 'Não foi possível gerar as questões extras.', type: 'danger'});
                }
            });


        };

        /*
        var eveQuestaoCorrecaoRespondida = function (evento) {

            var objClicado = evento.currentTarget;
            var resposta = $(objClicado).val();
            var idQuestao = $(objClicado).data("idquestao");
            var id = $(objClicado).attr("id");
            if (parseInt(idQuestao) > 0) {

                //executarMetodoPersonalizado(questoes.fnClickAlternativa, objClicado);

                var objQuestao = getObjQuestao(idQuestao);
                console.log(objQuestao);

                //debugger;
                if (objQuestao[questoes.atributoJSONResposta] != resposta) {
                    if ($(objClicado).closest('div.form-group').hasClass('has-error') === false) {
                        objQuestao.salvo = false;
                        objQuestao[questoes.atributoJSONResposta] = resposta;
                        objQuestao[questoes.atributoJSONPercentualAcerto] = resposta;

                        putQuestao(objQuestao);
                    }
                }

            }
        };*/

        var eveFormUploadAnexo = function (e) {

            //Elementos
            var el = e.currentTarget;
            var elementoUpload = "#" + $(el).parent().attr('id') + " .uploadArquivo";

            //Esconde o botão
            $(el).hide();

            //Renderiza o form de envio de arquivos:

            //Se já carregou o form, não faz mais nada.
            if ($(el).parent().find('.uploadArquivo').length > 0) {
                return;
            }

            //Busca a questão da lista:
            var lista = questoes.getListaJSON();
            var strTemp = '{"' + questoes.atributoJSONidQuestao + '": ' + $(el).data('idquestao') + '}';
            var objQuestao = _.findWhere(lista, JSON.parse(strTemp));

            //Quais extensões essa questão permite?
            var extensoes = [];

            if (objQuestao && objQuestao.extensoes != null && objQuestao.extensoes.length > 0){
                $.each(objQuestao.extensoes, function (i, item) { extensoes.push(item.extensao) })
            } else {
                extensoes = questoes.extensoesPermitidas;
            }

            //Criamos o elemento que vai renderizar o formulário:
            $(el).parent().append($("<div>", { class: 'uploadArquivo' }));

            //Parametrso de rendrização do form de upload.
            var fnUpload = function (uploadManager) {
                uploadManager({
                    element: elementoUpload,
                    onFileDone: function (e) {
                        objQuestao.salvo = false; UNINTER.viewGenerica.setPlaceholderHeight();
                    },
                    onStop: function (e) {
                        objQuestao.salvo = false;
                    },
                    acceptFileTypes: extensoes.toString()
                });
                UNINTER.viewGenerica.setPlaceholderHeight();
            }

            //Por fiz, renderiza....
            var getUploadArquivo = UNINTER.viewGenerica.getUploadArquivo(fnUpload);
            setTimeout(UNINTER.viewGenerica.setPlaceholderHeight, 600);
            //UNINTER.viewGenerica.setPlaceholderHeight();
        };

        var eveQuestaoSliderRespondida = function (evento, salvarImediatamente) {

            evento.stopImmediatePropagation();

            var objClicado = evento.currentTarget;

            var value = $(objClicado).val();
            var idEscala = $(objClicado).attr('data-idescala');
            var idHistorico = $(objClicado).attr('data-idhistorico');

            if ($('.nao-aplicavel[data-idhistorico="' + idHistorico + '"]').is(':checked') && value == '1') {
                return;
            };

            try {
                var ticks = $(objClicado).data('slider-ticks');

                if (value == '-1' || ticks.indexOf(parseInt(value)) > -1) {
                    manipularQuestaoEscalaRespondida(objClicado, salvarImediatamente);
                }
            } catch (e) {
                manipularQuestaoEscalaRespondida(objClicado, salvarImediatamente);
            }


            var legenda = _.findWhere(listaEscalaLegenda[idEscala], JSON.parse('{ "valor": ' + value + ' }'));

            $(objClicado).parent().parent().find('.escala-valor-selecionado').html(legenda != void (0) ? legenda.legenda : '');

            try{
                if ($(objClicado).prop('disabled')) {
                    $(objClicado).slider('disable');
                } else {
                    $(objClicado).slider('enable');
                }

                if (value == '-1')
                {
                    $(objClicado).slider('setValue', void(0));
                }
                
            }catch(e){}

        };

        var eveQuestaoRespondida = function (evento, salvarImediatamente) {
            var objClicado = evento.currentTarget;
            manipularQuestaoRespondida(objClicado, salvarImediatamente);
        };

        var eveQuestaoEscalaRespondida = function (evento, salvarImediatamente) {

            var objClicado = evento.currentTarget;
            manipularQuestaoEscalaRespondida(objClicado, salvarImediatamente);

        };

        var eveExcluirAnexo = function (e) {
            var elemento = e.currentTarget;
            var id = $(elemento).data('id');

            var opcoes = {
                url: UNINTER.AppConfig.UrlWs('BQS') + "AvaliacaoUsuarioHistoricoSistemaRepositorio/"+id,
                type: 'DELETE',
                async: true,
                successCallback: function (data) {
                    $(elemento).parent().parent().remove();
                },
                errorCallback: function (data) {
                    $(elemento).parent().parent().find('td:first').append("<p><span class='label label-danger'>(" + data.status + ") Erro ao excluir anexo. </span></p>");
                }
            };
            UNINTER.Helpers.ajaxRequest(opcoes);
        };

        var eveQuestaoRespondidaIdQuestao = function (idObjDomQuestao, salvarImediatamente) {
            var objClicado = $("#" + idObjDomQuestao);
            manipularQuestaoRespondida(objClicado, salvarImediatamente);

        };

        var manipularQuestaoRespondida = function (objClicado, salvarImediatamente) {
            var idQuestao = $(objClicado).data("idquestao");
            var idHistorico = $(objClicado).data("idhistorico");
            var objQuestao = getObjQuestao(idQuestao, idHistorico);
            objQuestao.salvo = false;

            var totalCaracteres = $(objClicado).val().length;

            var seletor = "div[data-ordem=" + objQuestao[questoes.atributoJSONOrdem] + "]";
            var seletorSpan = seletor + " tr span";
            var seletorTextarea = seletor + " tr textarea";

            if(objQuestao == void(0) || objQuestao.idQuestaoTipo != 5)
            {
                $(seletorSpan).html(questoes.totalCaracteres - totalCaracteres);
            }

            //Se for tipo tabela e está com length == 0 é porque o valor digitado é invalido ou está em branco.
            if (objQuestao !== void (0) && objQuestao.idQuestaoTipo == 5) {
                if (totalCaracteres == 0) {
                    $(objClicado).closest("td").addClass('bg-danger');
                } else {
                    $(objClicado).closest("td").removeClass('bg-danger');
                }
            }

            $(seletorSpan).removeClass("text-danger");

            if (questoes.totalCaracteres <= totalCaracteres) {
                $(seletorSpan).addClass("text-danger");
                $(seletorTextarea).val($(objClicado).val().slice(0, questoes.totalCaracteres));
                $(seletorSpan).html(questoes.totalCaracteres - totalCaracteres);

                UNINTER.Helpers.showModalAdicionarFila({
                    size: "",
                    body: "Você já atingiu o limte de caracteres permitido.",
                    title: 'Limite de caracteres',
                    buttons: [{
                        'type': "button",
                        'klass': "btn btn-primary",
                        'text': "OK",
                        'dismiss': 'modal',
                        'id': 'modal-cancel'
                    }]
                });

                return;
            }

            
            if (totalCaracteres > 0) {
                objQuestao[questoes.atributoJSONResposta] = $(objClicado).val();
                questoes.setQuestaoResposta(idQuestao);
            }
            else {
                questoes.unsetQuestaoResposta(idQuestao);
            }

            //Salvamos a cada 60 segudos.
            var agora = new Date();
            if (objQuestao.ultimoPUT == void (0)) {
                objQuestao.ultimoPUT = new Date - 70000;
            }

            if ((agora - objQuestao.ultimoPUT) > 60000 || salvarImediatamente == true) {
                objQuestao.ultimoPUT = new Date;
                putQuestao(objQuestao);
            }
        };

        var manipularQuestaoEscalaRespondida = function (objClicado, salvarImediatamente) {

            var idQuestao = $(objClicado).data("idquestao");
            var idHistorico = $(objClicado).data("idhistorico");
            var objQuestao = getObjQuestao(idQuestao, idHistorico);
            objQuestao.salvo = false;

            objQuestao[questoes.atributoJSONResposta] = $(objClicado).val();

            if($(objClicado).hasClass('nao-aplicavel') == true)
            {
                objQuestao[questoes.atributoJSONResposta] = $(objClicado).is(':checked') == true ? -1 : null;
            }

            $(objClicado).attr("data-slider-value", objQuestao[questoes.atributoJSONResposta]);

            putQuestao(objQuestao);
        };

        var eveRevisao = function () {
            $(".revisar").on("click", function (e) {
                var elemento = e.currentTarget;
                abrirModalRevisar($(elemento).data('id'), $(elemento).data('nota'), $(elemento).data('idquestaotipo'));
            })
        }

        var abrirModalRevisar = function (id, nota, idQuestaoTipo) {
            var r = new revisao();
            var lista = questoes.getListaJSON();
            var objHistorico = _.findWhere(lista, { id: id });
            r.init(id, idQuestaoTipo, nota, objHistorico);
        }

        this.revisarQuestao = function () {
            alert("salvo");
        }

        var eveNavegacao = function (evento) {
            evento.preventDefault();
            var objClicado = evento.currentTarget;
            var ordem = parseInt($(objClicado).html());
            questoes.setLayout(ordem);
        };

        var eveVoltar = function () {
            questoes.setLayout(ordemAtual - 1);
        };

        var eveAvancar = function () {
            questoes.setLayout(ordemAtual + 1);
        };

        var eveSalvar = function () { };

        var eveCancelar = function () {
            UNINTER.viewGenerica.cancelar();
            //executarMetodoPersonalizado(questoes.fnAntesCancelar);
        };

        var eveFinalizar = function () {

            finalizar(1);

            //Volta o bit para que o usuário consiga clicar no finalizar de novo, caso haja erro na requisição.
            preventClickFinalizar = false;

            if (recordMonitoria != null) {
                recordMonitoria.stopRecord();
            }

            //var retorno = finalizar();
            //debugger;
            //var opcoesMsg = {
            //    body: "<p>Avaliação finalizada com sucesso. Anote o número do seu protocolo.</p>",
            //    strong: null,
            //    type: "success"
            //}
            //if (retorno.status != 200 && retorno.status != null) {
            //    opcoesMsg.body = "Erro ao finalizar a avaliação. Por favor, tente novamente.";
            //    opcoesMsg.type = "danger";
            //} else {
            //    var objAvaliacaoUsuario = buscarAvaliacaoUsuario();
            //    if (objAvaliacaoUsuario != null)
            //    {
            //        if (objAvaliacaoUsuario.idAvaliacaoUsuarioStatus = 3 && objAvaliacaoUsuario.nota != null) {
            //            opcoesMsg.body += "<p>Sua nota nesta tentativa foi: <strong> " + objAvaliacaoUsuario.nota + "</strong></p>";
            //        }
            //    }
            //    $($idObjDOM).html("");
            //}
            //UNINTER.Helpers.animatedScrollTop();
            //questoes.setMensagem(opcoesMsg);
        };

        var eveNavegarTabela = function () {
            $('.table-question input[type="text"] , .table-question input[type="number"]').off('keydown').on("keydown", function (event) {

                var id = $(this).closest('table').attr('id');

                if (event.which > 36 && event.which < 41) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    var el = $(event.currentTarget);

                    var x = parseInt(el.parent().data('x'));
                    var y = parseInt(el.parent().data('y'));

                    var ultimoX = $('#' + id + ' td:last').data('x');
                    var ultimoY = $('#' + id + ' td:last').data('y');

                    var primeiroX = $('#' + id + ' td:first').data('x');
                    var primeiroY = $('#' + id + ' td:first').data('y');

                    var ElementoExiste = function () {
                        if ($('#' + id + ' th[data-x="' + x + '"][data-y="' + y + '"] , #' + id + ' td[data-x="' + x + '"][data-y="' + y + '"]').length == 1) {
                            return true;
                        } else {
                            return false;
                        }
                    };

                    var AjustarPosicaoXY = function () {
                        switch (event.which) {
                            case 37:
                                //Left
                                y = y - 1;
                                break;
                            case 38:
                                //Up
                                x = x - 1;
                                break;
                            case 39:
                                //Rigth
                                y = y + 1;
                                break;
                            case 40:
                                //Down
                                x = x + 1;
                                break;
                        }
                    };

                    var PodeNevegar = function () {
                        var podeNavegar = false;
                        switch (event.which) {
                            case 37:
                                //Left
                                if (y - 1 >= primeiroY) {
                                    podeNavegar = true;
                                }
                                break;
                            case 38:
                                //Up
                                if (x - 1 >= primeiroX) {
                                    podeNavegar = true;
                                }
                                break;
                            case 39:
                                //Rigth
                                if (y + 1 <= ultimoY) {
                                    podeNavegar = true;
                                }
                                break;
                            case 40:
                                //Down
                                if (x + 1 <= ultimoX) {
                                    podeNavegar = true;
                                }
                                break;
                        }
                        return podeNavegar;
                    };

                    AjustarPosicaoXY();

                    while (ElementoExiste() !== true && PodeNevegar() === true) {
                        AjustarPosicaoXY();
                    }

                    //existe algum elemento renderizado para mover o foco?
                    if ($('#' + id + ' th[data-x="' + x + '"][data-y="' + y + '"] , #' + id + ' td[data-x="' + x + '"][data-y="' + y + '"]').length == 1) {
                        //el.trigger('blur');
                        $('#' + id + ' th[data-x="' + x + '"][data-y="' + y + '"] input , #' + id + ' td[data-x="' + x + '"][data-y="' + y + '"] input').not('[type="checkbox"]').focus();
                    }

                }
            });
        };

        var buscarAvaliacaoUsuario = function () {

            var objRetorno = null;
            try {
                var lista = questoes.getListaJSON();
                var url = UNINTER.AppConfig.UrlWs("bqs") + "/AvaliacaoUsuario/" + lista[0].idAvaliacaoUsuario + "/Get";
                var opcoes = { url: url };
                var retornoConsumo = UNINTER.Helpers.ajaxRequestError(opcoes);
                if (retornoConsumo.status == 200) {
                    objRetorno = retornoConsumo.resposta.avaliacaoUsuario;
                }
            } catch (e) {
                //console.log("Erro ao buscar avaliação concluida.");
            }
            return objRetorno;
        };

        var formatterSlider = function (value) {
            var self = this;

            var idEscala = self.id;
            var legendas = listaEscalaLegenda[idEscala];
            
            var strTemp = '{"valor":' + value + '}';
            var objLegenda = _.findWhere(legendas, JSON.parse(strTemp));

            return objLegenda.legenda;
            
        };

        var GravarAudioVideo = function () {

            //Se já está em execução, não roda novamente.
            if (recordMonitoria != null) {
                return;
            }


            var s3 = new S3();
            var idAvaliacaoUsuario = listaJSON[0].idAvaliacaoUsuario;
            var picotesFolder = null;
            var picotesCounter = 1;
            var metodoGravacao = 2; // [1 - Audio] [2 - Video] [3 - Fotos]

            //Controle de upload async
            var arquivos = {
                finalizado: false,
                blobs: {}
            };

            //Metodo disparado quando a gravação é encerrada.
            var GravacaoFinalizada = function (s) {

                //var blob = s.blobComplete;
                var blobHeader = s.blobHeader;

                if (blobHeader != null) {
                    picotesInterno(blobHeader, true);
                } else {
                    CheckFinalizar();
                }
            };

            //Verifica se já fez todos os uploads para gerar o MP4.
            var CheckFinalizar = function () {
                if (arquivos.finalizado || metodoGravacao == 3) {

                    var uploadEmAndamento = false;

                    $.each(arquivos.blobs, function (key, item) {
                        if (item.concluido == false) {
                            uploadEmAndamento = true;
                        }
                    });

                    if (uploadEmAndamento == false) {
                        persistirGravacao(picotesFolder, idAvaliacaoUsuario, metodoGravacao);
                    }
                }
            };

            //Metodo executado assim que começar a gravar.
            var picotes = function (blob) {

                picotesFolder = picotesFolder || ("AvaliacaoUsuario/Usuario_" + UNINTER.StorageWrap.getItem('user').idUsuario + "/" + idAvaliacaoUsuario + "/" + new Date().getTime() + "/");

                picotesInterno(blob, false);
            };

            //Metodo executado a cada intervalo de segundos para gravar os videos parciais
            var picotesInterno = function (blob, finalizar)
            {
                var nome = (finalizar) ? picotesFolder + "blob_header" : picotesFolder + "blob_part_" + ("000" + picotesCounter).slice(-3);

                arquivos.finalizado = finalizar == true ? finalizar : arquivos.finalizado;
                arquivos.blobs[nome] = { file: blob, concluido: false, tentativa: 1 };

                var Success = function(){

                    arquivos.blobs[nome].file = null; //Evitar alocação de memoria indevida
                    arquivos.blobs[nome].concluido = true;

                    CheckFinalizar();

                };

                var Error = function () {
                    if (arquivos.blobs[nome].tentativa < 3) {
                        arquivos.blobs[nome].tentativa++;
                        s3.SendFile(blob, nome, Success, Error);
                    } else {
                        Success(); //Se tentou 3 vezes e não, considera sucesso para seguir com a geraçaõ do Mp4
                    }
                }

                s3.SendFile(blob, nome,Success,Error);

                picotesCounter++;
            };


            //Carrega o script de gravação (não sei poque com $.get, mas está funcionado)
            $.getScript(UNINTER.AppConfig.UrlWs("PDF") + 'web/js/libraries/Monitoria_2.0.min.js?', function () {

                recordMonitoria = new Monitoria();


                // Verifica se é possível capturar mídia, se não for verificado e iniciado não funcionará
                if (recordMonitoria.isSupported()) {

                    recordMonitoria.iniciar({
                        metodoGravacao: metodoGravacao,
                        liberarEscolhaMetodoGravacao: false,
                        download: false,
                        videoBitsPerSecond: 512000,
                        timeSliceRecord: 20000,
                        timeRecord: 120,
                        video: { resolution: { width: 640, height: 480 } },
                        cameraFrontal: UNINTER.Helpers.isMobile()
                    }).then(function(e){
                        //console.log('Iniciado plugin de gravação');
                    } ).catch( function(e) {
                        console.error('Erro na inicialização do plugin de gravação');
                        console.error(e);
                    });

                } else {
                    console.error('Navegador não suporta a gravação!');
                }

                //Começamos a gravar....
                setTimeout(
                    function () {
                        recordMonitoria
                            .startRecord(picotes)
                            .then(GravacaoFinalizada)
                            .catch(function (e) {
                                console.error('Erro na gravação');
                                console.error(e);
                            });
                    }, 5000);


                // :: EVENTOS EXTERNOS ::

                //trocou de página
                jQuery("#carregaAquiId").on("remove", function () {
                    recordMonitoria.stopRecord();
                });

                //Reload
                jQuery(window).on('beforeunload', function () {
                    recordMonitoria.stopRecord();
                });

                //close
                jQuery(window).on('onunload', function () {
                    recordMonitoria.stopRecord();
                });
            });
        };

        var persistirGravacao = function (picotesFolder, idAvaliacaoUsuario, metodoGravacao) {

            if (metodoGravacao != 3) {
                var s3 = new S3();
                s3.SendFile("concluido", picotesFolder+"blob.txt", function Success(data) {}, function Error(data) {});
                return;
            }

            console.log('Finalizando gravação...');

            //var url = 'http://localhost:38500/' + 'sistemaRepositorio/0/PostAuditoriaAudioVideo'; // Post de gravação de audio ou video
            var url = UNINTER.AppConfig.UrlWs("repositorio") + 'sistemaRepositorio/0/PostAuditoriaAudioVideo'; // Post de gravação de audio ou video
            var data = { picotesRepositorios: [{ repositorio: picotesFolder }], aplicacao: 'BQS', metodoGravacao: metodoGravacao };

            if (metodoGravacao == 3) {
                url = UNINTER.AppConfig.UrlWs("repositorio") + 'sistemaRepositorio/0/PostAuditoriaFoto'; // Post de gravação de fotos
                data = { picotesRepositorios: [{ repositorio: picotesFolder }], aplicacao: 'BQS', metodoGravacao: metodoGravacao };
            }

            UNINTER.Helpers.ajaxRequest({
                url: url,
                async: true,
                data: data,
                type: 'POST',
                successCallback: function (data) {

                    console.log('Finalizada gravação com sucesso:');
                    console.log(data);

                    VincularVideosComAvaliacao(data.idSistemaRepositorios, idAvaliacaoUsuario, metodoGravacao);
                },
                errorCallback: function (error) {

                    console.error('Erro ao fazer o post: ');
                    console.error(error);
                }
            });

            UNINTER.sessionStorage.unset("gravacaoVideoIdAvaliacaoUsuario");
            UNINTER.sessionStorage.unset("gravacaoVideoMetodoGravacao");
            UNINTER.sessionStorage.unset("gravacaoVideoPicotesFolder");
        };

        var VincularVideosComAvaliacao = function (idsSistemaRepositorio, idAvaliacaoUsuario, idAvaliacaoUsuarioAuditoriaTipo) {

            console.log('Vinculando gravação com a avaliação...')
            //var url = 'http://localhost:49178/' + 'AvaliacaoUsuarioAuditoria/0/PostArray';
            var url = UNINTER.AppConfig.UrlWs("bqs") + 'AvaliacaoUsuarioAuditoria/0/PostArray';
            var data = {
                idsSistemaRepositorio: idsSistemaRepositorio,
                idAvaliacaoUsuario: idAvaliacaoUsuario,
                idAvaliacaoUsuarioAuditoriaTipo: idAvaliacaoUsuarioAuditoriaTipo
            };

            UNINTER.Helpers.ajaxRequest({
                url: url,
                async: true,
                data: data,
                type: 'POST',
                successCallback: function (data) {

                    console.log('Feita vinculação com a avaliação com sucesso: ');
                    console.log(data);
                },
                errorCallback: function (error) {

                    console.error('Erro ao fazer o post: ');
                    console.error(error);
                }
            });
        };

        // ==============================================

    };
    return classQuestoes;
})();