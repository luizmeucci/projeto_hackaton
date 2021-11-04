//Sera executado logo apos construir o form. (GLOBAL);
UNINTER.inicializar.avaliacaousuariohistorico = function (options) {
    
    var appUnivirtus = (options != void (0) && options.appUnivirtus != void (0)) ? options.appUnivirtus : false;
    var idAvaliacao = UNINTER.viewGenerica.parametros.idUrl;
    var idAvaliacaoVinculada = null;
    var metodo = UNINTER.viewGenerica.parametros.metodo.toLowerCase();

    var historico = (function(){
        var classHistorico = function(){
        
            this.simluando = false;
            this.appUnivirtus = false;
            this.metodo = UNINTER.viewGenerica.parametros.metodo;

            this.carregarAvaliacao = function () {
                $("#containerNotaVinculada").empty();
                $("#versaoImpressao").html("");
                if (metodo.toLowerCase() == "simular") {
                    simulacao();
                } else {
                    executando();
                }
                init();
            };

            this.setMensagem = function (params) {

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
                UNINTER.viewGenerica.setPlaceholderHeight();
                if (appUnivirtus === true)
                {
                    $("#mensagem #flashMessage").css('display', 'block')
                }
            };

            var H = this;

            var gravarAudioVideo = false;

            var strAutorizacao = "/Avaliacao?autorizacao=";

            var msgPrintGabarito = "<div><p class='text-danger'>Caro aluno,</p><p class='text-danger'>Você capturou a tela de uma avaliação ou gabarito.</p><p class='text-danger'>Lembramos que o compartilhamento dessa informação é proibido e estará sujeito a penalidades.<p></div>";

            var msgCopiaGabarito = "<div id='msgCopiaGabarito'><p class='text-danger'><strong>Atenção.</strong> Este gabarito é para uso exclusivo do aluno e não deve ser publicado ou compartilhado em redes sociais ou grupo de mensagens.</p><p class='text-danger'>O seu compartilhamento infringe as políticas do Centro Universitário UNINTER e poderá implicar sanções disciplinares, com possibilidade de desligamento do quadro de alunos do Centro Universitário, bem como responder ações judiciais no âmbito cível e  criminal. <p></div>";

            var objAvaliacaoUsuario = null;
            
            var podeUtilizarSenha = false;

            var init = function () {
                ajustarEventoVoltar();
                ajustarDatas();
                ajustarDadosUsuario();
                eventos();
            };

            var Mensagem = function (params) {

                if (params.type == void (0) || params.type == null) { params.type = 'danger'; }
                if (params.strong == void (0) || params.strong == null) { params.strong = ''; }
                if (params.appendTo == void (0) || params.appendTo == null) { params.appendTo = '#viewavaliacaousuariohistorico #mensagem'; }

                var opcoes = {
                    body: params.body,
                    strong: params.strong,
                    type: params.type,
                    appendTo: params.appendTo
                }
                $(params.appendTo).empty();
                UNINTER.flashMessage(opcoes);
                UNINTER.viewGenerica.setPlaceholderHeight();

            };

            var eventos = function () {

                EventosPrevenirCopiaDesativar(); //Evitar que fiquem eventos registrados em duplicidade.

                //Na apol permite copia de conteudo.
                if (objAvaliacaoUsuario.avaliacao.idAvaliacaoTipo != 1 && objAvaliacaoUsuario.avaliacao.idAvaliacaoTipo != 99) {
                    EventosPrevenirCopia(); //Restringe cópia.    
                }

                $('#copiarProtocolo').on('click', function () {
                    var $temp = $("<input>", { id: 'tempProtocolo' });
                    $("body").append($temp);
                    $temp.val($('#protocolo').text()).select();
                    document.execCommand("copy");
                    $temp.remove();
                });

            };

            var EventosPrevenirCopiaDesativar = function () {
                $("#conteudoAvaliacao").removeAttr("oncopy").removeAttr("oncut").removeAttr("onpaste");
                $("#conteudoAvaliacao").off('copy').off('contextmenu');
                $(document).off('mousemove.avaliacao');

                $("body").removeAttr("oncopy").removeAttr("oncut").removeAttr("onpaste");
                $("body").off('copy').off('contextmenu');

                $(window).off('hashchange.avaliacao').on('hashchange.avaliacao', function (e) {
                    if (window.location.hash.toLowerCase().indexOf('#/ava/avaliacaousuariohistorico/') == -1) {
                        $("body").removeAttr("oncopy").removeAttr("oncut").removeAttr("onpaste");
                        $("body").off('copy').off('contextmenu');
                        $(window).off('hashchange.avaliacao');
                        $(document).off('mousemove.avaliacao');
                    }
                });
            };

            var EventosPrevenirCopia = function () {
                //Previnir copia de conteudo:
                $("#conteudoAvaliacao").attr("oncopy", "return false").attr("oncut", "return false").attr("onpaste", "return false");
                $("#page").attr("oncopy", "return false").attr("oncut", "return false").attr("onpaste", "return false");

                $("#conteudoAvaliacao").on('copy', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                }).on('contextmenu', function (e) {
                    debugger;
                    return false
                });

                $("body").on('copy', function (e) {
                    if ($(e.target).attr('id') != 'tempProtocolo')
                    {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    }
                    
                }).on('contextmenu', function (e) {
                    return false
                });

                $(document).off('keyup').on('keyup', function (e) {
                    if (window.location.hash.toLowerCase().indexOf('#/ava/avaliacaousuariohistorico/') == -1) {
                        $(document).off('keyup');
                    } else if (e.keyCode == 44) {

                        UNINTER.Helpers.showModal({
                            size: "",
                            body: msgPrintGabarito,
                            title: 'ATENÇÃO',
                            buttons: [{
                                'type': "button",
                                'klass': "btn btn-default",
                                'text': "Cancelar",
                                'dismiss': 'modal',
                                'id': 'modal-cancel'
                            }]
                        });
                        return false;
                    }
                });

                $(document).on('mousemove.avaliacao', function (event) {
                    event.preventDefault();
                    event.stopImmediatePropagation()
                });
            };

            var exibirAlertaGabarito = function () {
                $(msgCopiaGabarito).insertAfter("#containerCabecalho");
            };

            var ajustarEventoVoltar = function () {
                $("#avaliacaoUsuarioHistoricoVoltar").unbind("click.voltar");
                $("#avaliacaoUsuarioHistoricoVoltar").bind("click.voltar", function (e) {
                    e.preventDefault();
                    Backbone.history.history.back();
                });
            };

            var ajustarDatas = function () {

                var agoraUTC = new Date();
                agoraUTC = agoraUTC - (1000 * 60 * 60 * 3) //Horario do brasil-3
                var agora = new Date(agoraUTC);
                var data = UNINTER.Helpers.dateTimeFormatter({ dateTime: agora.toISOString() });

                $("#data").html(data.date());
                $("#hora").html(data.time());

            };

            var renderBlocoDisciplina = function (texto) {
                //var objSpan = $("<span>").html(texto);
                //var objInterno = $("<div>").addClass("mini-block inline").html(objSpan);
                //var objTitulo = $("<div>").addClass("col-md-8").html(objInterno);
                var p = $("<p>").html(texto);
                return p;
            };

            var renderFormularioProva = function () {
                var objSpan = "";
                if (objAvaliacaoUsuario.avaliacao.urlSistemaRepositorio != null && objAvaliacaoUsuario.avaliacao.urlSistemaRepositorio != void (0) && objAvaliacaoUsuario.avaliacao.urlSistemaRepositorio != "") {
                    var $btn = $("<button>").addClass("btn btn-primary").html("FÓRMULAS");
                    var $a = $("<a>").attr("href", objAvaliacaoUsuario.avaliacao.urlSistemaRepositorio).attr("target", "_blank").html($btn);
                    var objSpan = $("<span>").html($a);
                    //var objInterno = $("<div>").html(objSpan);
                    //var objTitulo = $("<div>").addClass("col-md-4").html(objInterno);
                }
                return objSpan;
            };

            var ajustarDadosUsuario = function () {
                //Ajustamos os dados do usuario com as info de session:
                var session = UNINTER.StorageWrap.getItem("user");
                $("#usuarioNome").html(session.nome);
                $("#usuarioRU").html(session.login);
                $("#formularioAnexo").append(renderFormularioProva());

                if (objAvaliacaoUsuario.salas != null)
                {
                    $.each(objAvaliacaoUsuario.salas, function (i, item) {
                        $("#blocoDisciplinas").append(renderBlocoDisciplina(item.nomeSalaVirtual));
                    });
                }

                if (objAvaliacaoUsuario.nota !== void (0) && objAvaliacaoUsuario.nota != null && (objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 3 || objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 7)) {
                    $("#nota").html(objAvaliacaoUsuario.nota);
                    $("#divNota").removeClass("hide");
                }
                var urlConsumoTempo = UNINTER.AppConfig.UrlWs("bqs") + "AvaliacaoUsuarioTempoDecorrido/" + objAvaliacaoUsuario.tempoTotalAvaliacao + "/Get?dataCriacao=" + objAvaliacaoUsuario.horarioInicio;
                var opcoes = {
                    url: urlConsumoTempo, type: "GET", async: true, successCallback: function (e) {
                        
                        if (e.dataFinal != null && e.dataFinal != void (0)) {
                            var dataFinal = UNINTER.Helpers.dateTimeFormatter({ dateTime: e.dataFinal });
                            $("#dataFinalPrevista").html(dataFinal.date());
                            $("#horaFinalPrevista").html(dataFinal.time());
                        } else {
                            $("#dataFinalPrevista").html("-");
                            $("#horaFinalPrevista").html("");
                        }
                    }
                };
                var retornoConsumo = UNINTER.Helpers.ajaxRequest(opcoes);

                $("#datasAvaliacao tr td").css("padding", "2px");

                if (objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 1 || objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 4 || objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 5 || objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 6) {
                    $("#trDataEntrega").hide();
                } else {
                    $("#trDataEntrega").show();
                }

                UNINTER.viewGenerica.setPlaceholderHeight();
            };

            var simulacao = function(){

                //Renderiza questões
                var q = new questoes();
                q.idObjDOM = "conteudoAvaliacao";
                q.ajaxUrlConsumo = UNINTER.AppConfig.UrlWs("bqs") + "AvaliacaoUsuarioHistorico/" + idAvaliacao + "/Simular"
                q.botaoCancelar = false;
                q.botaoSalvar = false;
                q.botaoFinalizar = false;
                q.contadorExibir = true;
                q.exibirTodasQuestoes = false;
                q.salvarNoClick = false;
                q.render();
            };

            var executando = function () {
                $("#msgCopiaGabarito").remove();
                var cIdAvaliacao = UNINTER.viewGenerica.parametros.idUrl;
                var tentativaUrl = parseInt(UNINTER.viewGenerica.parametros.idAcao);
                var cIdAvaliacaoVinculada = UNINTER.viewGenerica.parametros.idAux;
                var tentativa = 0
                if (tentativaUrl > 0) {
                    tentativa = tentativaUrl;
                } else {
                    tentativa = buscarMaxTentativa();
                }
                
                var AvaliacaoVinculadaStr = '';
                if (cIdAvaliacaoVinculada != null)
                {
                    AvaliacaoVinculadaStr = '&idAvaliacaoVinculada=' + cIdAvaliacaoVinculada;
                }

                //Usuario pode executar essa ação:
                var urlConsumo = UNINTER.AppConfig.UrlWs("bqs") + "AvaliacaoUsuario/0/tentativa/" + tentativa + "?ap=" + appUnivirtus + AvaliacaoVinculadaStr + '&cIdAvaliacao=' + encodeURIComponent(cIdAvaliacao) + '&cache=' + new Date().getTime();
                var opcoes = {
                    url: urlConsumo,
                    type: "GET",
                    async: false
                };

                var retornoConsumo = UNINTER.Helpers.ajaxRequestError(opcoes);
                if (retornoConsumo.status != 200) {
                    var objErro = { body: "Você não possui permissão para visualizar essa avaliação." }
                    H.setMensagem(objErro);
                } else {

                    //Pode não ter chego com status de erro mas lançou mensagens:
                    if (retornoConsumo.resposta != null && retornoConsumo.resposta.mensagens != void (0) && retornoConsumo.resposta.mensagens.length > 0) {
                        var msg = '';
                        $.each(retornoConsumo.resposta.mensagens, function (i, item) {
                            msg = msg + item + '<br>'
                        });
                        var objErro = { body: msg, type: 'warning' }
                        H.setMensagem(objErro);
                    } else {
                        podeUtilizarSenha = retornoConsumo.resposta.podeUtilizarSenha;
                        objAvaliacaoUsuario = retornoConsumo.resposta.avaliacaoUsuario;
                        renderOrientação();
                    }
                }
                return retornoConsumo;
            };

            var buscarMaxTentativa = function(){
                var maxTentativa = 1;

                //Vamos buscara ultima tentativa do aluno:
                var urlConsumo = UNINTER.AppConfig.UrlWs("bqs") + "/AvaliacaoUsuario/"+idAvaliacao+"/UltimaTentativa";

                var opcoes = {
                    url: urlConsumo,
                    type: "GET",
                    async: false
                };
                var retornoConsumo = UNINTER.Helpers.ajaxRequestError(opcoes);
                if (retornoConsumo.status != 200) {
                    var objErro = { body: "Você não possui permissão para visualizar essa avaliação." }
                    H.setMensagem(objErro);
                } else {
                    var objAvaliacaoUsuarioTemp = retornoConsumo.resposta.avaliacaoUsuarios;
                    if (objAvaliacaoUsuarioTemp.length > 0) {
                        if (objAvaliacaoUsuarioTemp[0].tentativaTotal >= objAvaliacaoUsuarioTemp[0].tentativa && (objAvaliacaoUsuarioTemp[0].idAvaliacaoUsuarioStatus == 2 || objAvaliacaoUsuarioTemp[0].idAvaliacaoUsuarioStatus == 3)) {
                            maxTentativa = (objAvaliacaoUsuarioTemp[0].tentativa + 1);
                        } else {
                            maxTentativa = objAvaliacaoUsuarioTemp[0].tentativa;
                        }
                        
                    }
                }

                return maxTentativa;

            };

            var renderOrientação = function () {

                $("#containerCabecalho").hide();

                var objProtocolo = $("<strong>").html(objAvaliacaoUsuario.protocolo);
                $("#viewavaliacaousuariohistorico #protocolo").html(objProtocolo);

                if (objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 3 || objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 2 || objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 7) {
                    $("#triggerEnqueteUsuario").data("idavaliacaotipo", objAvaliacaoUsuario.avaliacao.idAvaliacaoTipo).trigger("enqueteavaliacaogabarito");
                    renderAvaliacao();
                } else {

                    var tempoTotalAluno = (objAvaliacaoUsuario.tempoTotalAvaliacao > objAvaliacaoUsuario.avaliacao.tempoTotal) ? objAvaliacaoUsuario.tempoTotalAvaliacao : objAvaliacaoUsuario.avaliacao.tempoTotal;

                    if (tempoTotalAluno == 0) {
                        $("#viewavaliacaousuariohistorico #orientacao #tempoTotal").html("ilimitado (enquanto a avaliação estiver vigente)");
                    } else {
                        $("#viewavaliacaousuariohistorico #orientacao #tempoTotal").html(tempoTotalAluno).append(' minutos (após o início).');
                    }

                    //$("#viewavaliacaousuariohistorico #orientacao #tempoTotal").html(tempoTotalAluno);
                    $("#viewavaliacaousuariohistorico #orientacao #tentativas").html(objAvaliacaoUsuario.tentativaTotal);
                    $("#viewavaliacaousuariohistorico #orientacao #tentativaAtual").html(objAvaliacaoUsuario.tentativa);
                    $("#viewavaliacaousuariohistorico #orientacao #orientacaoAvaliacao").html(objAvaliacaoUsuario.avaliacao.orientacao);

                    $("#viewavaliacaousuariohistorico #orientacao #nomeAvaliacao").html(objAvaliacaoUsuario.avaliacao.nomeAvaliacaoTipo + " - " + objAvaliacaoUsuario.avaliacao.nome + ":");

                    $("#blocoDisciplinasOrientacao").empty();
                    if (objAvaliacaoUsuario.salas != null) {
                        $.each(objAvaliacaoUsuario.salas, function (i, item) {
                            $("#blocoDisciplinasOrientacao").append(renderBlocoDisciplina("&nbsp;- " + item.nomeSalaVirtual));
                        });
                    }

                    var texto = $("#viewavaliacaousuariohistorico #orientacao").html();
                    $("#viewavaliacaousuariohistorico #conteudoAvaliacao").html(texto);
                    $("#viewavaliacaousuariohistorico #conteudoAvaliacao #aceito").off("click")
                    $("#viewavaliacaousuariohistorico #conteudoAvaliacao #aceito").on("click", function () {
                        autorizacao();
                    });
                    
                    $("#triggerEnqueteUsuario").data("idavaliacaotipo", objAvaliacaoUsuario.avaliacao.idAvaliacaoTipo).trigger("enqueteavaliacaoinicio");

                    if (objAvaliacaoUsuario.avaliacao.exigirSenhaTutor == true) {

                        if (objAvaliacaoUsuario.avaliacao.supervisaoVirtual == true) {
                            $('#msgExigirSenhaTutor').html("Esta avaliação requer supervisão. Caso não seja autorizada automaticamente será necessário utilizar o aplicativo de provas.");
                        } else {
                            $('#msgExigirSenhaTutor').html("Esta avaliação só pode ser realizada em um polo de apoio presencial");
                            $("#horarioPolo").show();
                        }

                        //$('#msgExigirSenhaTutor').html("Esta avaliação só pode ser realizada em um polo de apoio presencial");
                        $("#tempoAvaliacao").show();
                        //$("#horarioPolo").show();

                        //var opcoes = {
                        //    body: 'Esta avaliação será liberada apenas para realização no polo de apoio presencial',
                        //    type: 'info',
                        //    appendTo: "#msgExigirSenhaTutor"
                        //}

                        //UNINTER.flashMessage(opcoes);

                        //$("#msgExigirSenhaTutor").html('Esta avaliação será liberada apenas para realização no polo de apoio presencial');

                        if (objAvaliacaoUsuario.avaliacao.supervisaoVirtual == true) {
                            $('#msgSupervisaoVirtual').removeClass('hide');

                            if (objAvaliacaoUsuario.salas != void (0) && objAvaliacaoUsuario.tentativaTotal > 1) {
                                var pos = _.filter(objAvaliacaoUsuario.salas, function (item) {
                                    return item.idCursoNivel == 4 || item.idCursoNivel == 12 || item.idCursoNivel == 13
                                });

                                if (pos != void (0) && pos.length > 0) {
                                    $('#posTotalTentativas').html(objAvaliacaoUsuario.tentativaTotal);
                                    $('#msgPosExportacaoSupervisaoVirtual').removeClass('hide');
                                }
                            }

                        }

                    }

                }
                UNINTER.viewGenerica.setPlaceholderHeight();
            };
            //renderAvaliacao();

            var autorizacao = function () {

                //Está no app?
                var appid = null;
                try{
                    appid = sessionStorage.getItem('appId');
                }catch(e){}


                if(appid != void(0) && appid.length > 10)
                {
                    appUnivirtus = true;

                    //Se o computador está para exigir codigo, exibe a popup antes:
                    var idGrupoEstruturaCodigoProvas = 0;
                    try {
                        idGrupoEstruturaCodigoProvas = UNINTER.StorageWrap.getItem('computador').idGrupoEstruturaCodigoProvas;
                    } catch (e) {
                        idGrupoEstruturaCodigoProvas = 0;
                    }

                    if (idGrupoEstruturaCodigoProvas > 0) {
                        renderPopupCodigoComputador();
                    } else {
                        strAutorizacao = "/Avaliacao?autorizacao=" + UNINTER.StorageWrap.getItem("user").autorizacaoProva;
                        renderAvaliacao();
                    }

                    return;
                }

                if (objAvaliacaoUsuario.avaliacao.exigirSenhaTutor == true && H.appUnivirtus == false && objAvaliacaoUsuario.autorizadoSemSupervisao == false) {
                    //renderPopupToken();
                    autorizacaoProvaToken();
                } else {
                    renderAvaliacao();
                }
            };

            var autorizacaoProvaToken = function () {

                if (UNINTER.objToken != void (0)) {

                    if (UNINTER.objToken.autorizado) {

                        strAutorizacao = "/Token/" + UNINTER.objToken.token;
                        renderAvaliacao();

                    } else {
                        renderPopupToken();
                    }

                } else {
                    renderPopupToken();
                }                              

            }

            var renderPopupToken = function (forcarToken, msg)
            {
                //Se for internacional pode usar supervisaõ virtual na sala
                if (forcarToken !== true && UNINTER.StorageWrap.getItem('user').internacional == true && objAvaliacaoUsuario.avaliacao.supervisaoVirtual == true)
                {
                    renderPopupReconhecimentoFacial();
                    return;
                }

                //Brasil somente usa supervisao virtual pelo menu provas
                if (forcarToken !== true && window.location.hash.toLowerCase().split('/')[2] == 'provas' && UNINTER.StorageWrap.getItem('user').internacional == false && objAvaliacaoUsuario.avaliacao.supervisaoVirtual == true) {
                    renderPopupReconhecimentoFacial();
                    return;
                }

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
                        $("#mensagemToken").empty();

                        strAutorizacao = "/Token/" + $(".form-horizontal #token").val();
                        renderAvaliacao();
                        if ($("#mensagemToken").children().length == 0) {
                            
                            jQModalElement.modal('hide');
                        }
                    }
                });

                //Utilizar RU e senha:
                if (podeUtilizarSenha == true) {
                    botoes.push({
                        'type': "button",
                        'klass': "btn btn-default",
                        'text': "Utilizar RU e Senha",
                        'dismiss': 'modal',
                        'id': 'modal-cancel',
                        'onClick': function (event, jQModalElement) {
                            jQModalElement.modal('hide');
                            setTimeout(renderPopupSenha, 500);
                        }
                    });
                }

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
                    body: _.template(template, { objAvaliacaoUsuario: objAvaliacaoUsuario, mensagem: msg }),
                    title: 'Necessário autorização do polo',
                    modal: { backdrop: 'static', keyboard: false },
                    callback: function () {
                        if (msg != void (0) && msg.length > 0) {
                            $('#mensagemToken').html($('<div>', { class: "alert alert-warning" }).html(msg));
                        }
                    },
                    buttons: botoes
                });

            };

            var renderPopupReconhecimentoFacial = function () {

                var acessoAoAudioEVideoAutorizado = function () {
                    var template = $("#templateReconhecimento").html();

                    UNINTER.Helpers.showModal({
                        size: "",
                        body: _.template(template, {
                            objAvaliacaoUsuario: objAvaliacaoUsuario,
                            imagem: $('.user-img img').attr('src')
                        }),
                        title: 'Avaliação supervisionada',
                        modal: { backdrop: 'static', keyboard: false },
                        buttons: [{
                            'type': "button",
                            'klass': "btn btn-primary hide",
                            'text': "Liberar por token",
                            'dismiss': null,
                            'id': 'modal-ok-libtoken',
                            'onClick': function (event, jQModalElement) {
                                jQModalElement.modal('hide');
                                setTimeout(function () { renderPopupToken(true); }, 1000);
                            }
                        }, {
                            'type': "button",
                            'klass': "btn btn-default",
                            'text': "Cancelar",
                            'dismiss': 'modal',
                            'id': 'modal-cancel'
                        }]
                    });

                    var fnCaptura = function () {

                        UNINTER.Helpers.checkForVideo(function (stream) {

                            $('.modal-body .form-horizontal').remove();
                            $('#containerCaptura').removeClass('hide');

                            var player = document.getElementById('RF-player');
                            var captureButton = document.getElementById('RF-capture');

                            player.srcObject = stream;

                            captureButton.addEventListener('click', function () {
                                var snapshotCanvas = document.getElementById('RF-snapshot');
                                var context = snapshotCanvas.getContext('2d').drawImage(player, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
                                var base64 = snapshotCanvas.toDataURL("image/jpeg");
                                fnReconhecimento(base64);
                            });

                            //navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {

                            //});

                        }, function (error) {
                            if (error.name == "NotReadableError") {
                                $('.modal-body .form-horizontal').remove();
                                $('#containerCaptura').html("Necessário possuir webcam e permitir acesso ao Univirtus.").removeClass('hide');
                            }
                        }, { video: true })



                    };

                    var fnReconhecimento = function (base64) {

                        $('.modal-body').html('<p>Autorização automática em andamento...</p><div class="text-center"><i style="font-size: 90px;" class="icon-profile text-primary pulse"></i></div>');

                        UNINTER.Helpers.ajaxRequest({
                            async: true,
                            type: 'POST',
                            data: {
                                id: objAvaliacaoUsuario.id,
                                rkg: base64
                            },
                            url: UNINTER.AppConfig.UrlWs('BQS') + 'AvaliacaoUsuarioReconhecimento/',
                            successCallback: function (data) {

                                if (data != void (0) && data.avaliacaoUsuarioToken != void (0) && data.avaliacaoUsuarioToken.token != void (0)) {
                                    $('#modal-cancel').trigger('click');
                                    strAutorizacao = "/Token/" + data.avaliacaoUsuarioToken.token;
                                    gravarAudioVideo = true;
                                    renderAvaliacao();
                                } else {
                                    var template = _.template($('#templateRFAutorizacaoFalhou').html(), { imagem: base64 })
                                    $(".modal-body").html(template);
                                }

                            },
                            errorCallback: function (error) {
                                var template = _.template($('#templateRFAutorizacaoFalhou').html(), { imagem: base64 })
                                $(".modal-body").html(template);
                            }
                        })

                    };

                    UNINTER.Helpers.ajaxRequest({
                        async: true,
                        url: UNINTER.AppConfig.UrlWs('BQS') + 'AvaliacaoUsuarioReconhecimento/' + objAvaliacaoUsuario.id,
                        successCallback: function (data) {
                            //Autorizado a utilizar reconhecimento:
                            fnCaptura();
                        },
                        errorCallback: function (error) {
                            $(".modal-body").html("<p>Não foi possível autorizar esta avaliação automaticamente.</p><p>Para realizar esta avaliação é necessário utilizar o aplicativo de provas</p><p> Caos esteja no polo agora, poderá utilizar a liberação por token.</p>");
                            $('#modal-ok-libtoken').removeClass('hide');
                        }
                    })
                };

                // IE e EDGE não permite gravação
                var navegador = UNINTER.Helpers.isNavegador();

                if (navegador == "IE" || navegador == "Edge")
                {
                    var msg = 'Para autorizar essa avaliação automaticamente é necessário utilizar um navegador que possua suporte ao uso de WebCam/Câmera, por exemplo: Google Chrome, Mozilla Firefox ou Opera.<br>Para continuar neste navegador, libere a avaliação por token.';
                    Mensagem({
                        body: msg,
                        strong: '',
                        type: 'warning',
                    });
                    renderPopupToken(true, msg);
                    return;
                }

                try
                {
                    UNINTER.Helpers.checkForVideo(acessoAoAudioEVideoAutorizado, function () {
                        var msg = 'Para autorizar essa avaliação automaticamente é necessário habilitar o uso de uma WebCam/Câmera e microfone.<br> Caso não autorize acesso a câmera, será necessário ir até o polo para realizar avaliação no aplicativo de provas ou liberação por token.';
                        Mensagem({
                            body: msg,
                            strong: '',
                            type: 'warning',
                        });
                        renderPopupToken(true, msg);
                    }, { video: true, audio: true });
                }
                catch (e)
                {
                    var msg = 'Este dispositivo não suporta a captura de mídia, por isso não é possível autorizar a avaliação automaticamente. Utilize token para liberar a avaliação.';
                    Mensagem({
                        body: msg,
                        strong: '',
                        type: 'danger',
                    });
                    renderPopupToken(true, msg);
                }
            };

            var renderPopupCodigoComputador = function () {

                var template = $("#templateCodigoComputador").html()

                var botoes = [];

                //Liberar:
                botoes.push({
                    'type': "button",
                    'klass': "btn btn-primary",
                    'text': "Liberar",
                    'dismiss': null,
                    'id': 'modal-ok',
                    'onClick': function (event, jQModalElement) {
                        strAutorizacao = "/Avaliacao/" + $("#codigo").val() + "?autorizacao=" + UNINTER.StorageWrap.getItem("user").autorizacaoProva;
                        renderAvaliacao();
                        jQModalElement.modal('hide');
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
                    body: _.template(template, { objAvaliacaoUsuario: objAvaliacaoUsuario }),
                    title: 'Necessário autorização do polo',
                    buttons: botoes
                });

            };

            var renderPopupSenha = function () {
                var objConteudo = $("#popupAutorizacao").html();
                var $objConteudo = $(objConteudo);

                $objConteudo.find('h2').html(objAvaliacaoUsuario.avaliacao.nome);
                $objConteudo.find('small').html(objAvaliacaoUsuario.avaliacao.nomeAvaliacaoTipo);                

                $objConteudo.find("#ruTutor").attr("id", "ruTutorModal");
                $objConteudo.find("#senhaTutor").attr("id", "senhaTutorModal");

                UNINTER.Helpers.showModal({
                    size: "",
                    body: $objConteudo.html(),
                    title: 'Necessário autorização do polo',
                    buttons: [{
                        'type': "button",
                        'klass': "btn btn-primary",
                        'text': "liberar",
                        'dismiss': null,
                        'id': 'modal-ok',
                        'onClick': function (event, jQModalElement) {
                            solicitarAutorizacao();
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
            };

            var solicitarAutorizacao = function () {
                var urlAutorizacao = UNINTER.AppConfig.UrlWs("Autenticacao") + "AutenticarExterno";

                var objEnvio = { 
                    id:objAvaliacaoUsuario.id,
                    login: $("#ruTutorModal").val(),
                    senha: $("#senhaTutorModal").val()
                };

                var opcoes = {
                    url: urlAutorizacao,
                    type: "POST",
                    async: false,
                    data: objEnvio
                };
                var retornoConsumo = UNINTER.Helpers.ajaxRequestError(opcoes);
                try {
                    strAutorizacao = "/Avaliacao?autorizacao=" + retornoConsumo.resposta.autorizacao;
                } catch (e) {
                    strAutorizacao = "/Avaliacao?autorizacao="
                };
                renderAvaliacao();
            };

            var renderNota = function (data) {
                if (isNaN(parseInt(data.nota)))
                {
                    return;
                }

                $("#conteudoAvaliacao").html(_.template($("#templateNota").html(), data));

                $("#btnSimResponderPesquisa").off('click').on('click', function (e) {
                    $("#btnResponderPesquisaAvaliacao").hide();
                    $("#triggerEnqueteUsuario").data('idsalavirtualoferta', data.idSalaVirtualOferta ).data("idavaliacaotipo", data.idAvaliacaoTipo).trigger("enqueteavaliacaofinalizar");
                });

                $("#btnNaoResponderPesquisa").off('click').on('click', function (e) {
                    $("#btnResponderPesquisaAvaliacao").hide();
                });

                //$("#voltarAvaliacaoFinalizada").off('click').on('click', function (e) {
                //    if (window.location.href.indexOf("mobile") > -1) {
                //        window.location = 'avaliacaoUsuario.html?date=' + new Date().getTime();
                //    } else {
                //        window.location = '#/ava/avaliacaoUsuario';
                //    }
                //});

                try{
                    UNINTER.viewGenerica.circliful($("#notaAnimada"), {
                        trailWidth: 1.8,
                        animation: 1,
                        animationStep: 10,
                        foregroundBorderWidth: 15,
                        backgroundBorderWidth: 15,
                        percent: data.nota,
                        textSize: 34,
                        textStyle: 'font-size: 2.5em;',
                        textColor: '#4270a1',
                        fontColor: '#4270a1',
                        foregroundColor: '#4270a1',
                        multiPercentage: 2,
                        percentageTextSize: 30,
                        noPercentageSign: true,
                        percentages: [10, 20, 30],
                        callback: function () {
                            UNINTER.viewGenerica.setPlaceholderHeight();
                        }
                    });
                } catch (e) {
                    $("#notaAnimada").hide();
                    $("#notaSimples").show();
                    UNINTER.viewGenerica.setPlaceholderHeight();
                }

                $("#triggerPossuiEnquete").data('idsalavirtualoferta', data.idSalaVirtualOferta).data("idavaliacaotipo", data.idAvaliacaoTipo).trigger("avaliacaotemenquete");
            };

            var podeExibirVideoSianee = function () {
                var retorno = false;

                var user = UNINTER.StorageWrap.getItem('user');

                if (user == void (0) || user.usuarioSianee == void (0)) {
                    retorno = false;
                } else {
                    var usuarioSianeeImpressao = _.findWhere(user.usuarioSianee, { idSianeeAtendimento: 16 });
                    if(usuarioSianeeImpressao != void(0))
                    {
                        retorno = true;
                    }
                }

                return retorno;

            };

            var renderAvaliacao = function () {

                $("#containerCabecalho").show();

                $("#viewavaliacaousuariohistorico #mensagem").empty();

                //Se a avaliação esta concluida e pode ver o gabarito, exibimos:
                //                var teste = objAvaliacaoUsuario;

                var q = new questoes();
                q.idObjDOM = "conteudoAvaliacao";
                q.idTipoLayout = objAvaliacaoUsuario.avaliacao.idQuestaoAdicionalTipoLayout;
                q.possuiQuestoesAdicionais = objAvaliacaoUsuario.avaliacao.quantidadeQuestoesAdicionais > 0 ? true : false;
                q.objAvaliacaoUsuario = objAvaliacaoUsuario;

                if (objAvaliacaoUsuario.idAvaliacaoUsuarioNotaVinculada > 0) {
                    q.ajaxUrlConsumo = UNINTER.AppConfig.UrlWs("bqs") + "AvaliacaoUsuarioHistorico/" + objAvaliacaoUsuario.idAvaliacaoUsuarioNotaVinculada + strAutorizacao;
                } else {
                    q.ajaxUrlConsumo = UNINTER.AppConfig.UrlWs("bqs") + "AvaliacaoUsuarioHistorico/" + objAvaliacaoUsuario.id + strAutorizacao;
                }
            

                q.ajaxUrlSalvar = UNINTER.AppConfig.UrlWs("bqs") + "AvaliacaoUsuarioHistorico/";
                q.ajaxUrlFinalizar = UNINTER.AppConfig.UrlWs("bqs") + "AvaliacaoUsuario/" + objAvaliacaoUsuario.id + "/Finalizar/{idAvaliacaoUsuarioEntrega}";
                q.exibirTodasQuestoes = false;
                q.exibirSucessoAvaliacaoEntrega = false;
                q.gravarAudioVideo = gravarAudioVideo;

                //q.videoSianee = UNINTER.StorageWrap.getItem('user').necessidadeEspecial;
                q.videoSianee = podeExibirVideoSianee();
                q.fnAposFinalizar = function () {

                    var idSalaVirtualOferta = (objAvaliacaoUsuario.salas.length > 0) ? objAvaliacaoUsuario.salas[0].idSalaVirtualOferta : 0;

                    //setTimeout(function () {
                    //    $("#triggerEnqueteUsuario").data('idsalavirtualoferta', idSalaVirtualOferta).data("idavaliacaotipo", objAvaliacaoUsuario.avaliacao.idAvaliacaoTipo).trigger("enqueteavaliacaofinalizar");
                    //}, 450);

                    renderNota({ nota: q.nota, idSalaVirtualOferta: idSalaVirtualOferta, idAvaliacaoTipo: objAvaliacaoUsuario.avaliacao.idAvaliacaoTipo });
                    
                };
                q.fnErroConsumo = function (resposta) {
                    try {
                        var jsonResposta = JSON.parse(resposta);
                        var elemento = "#mensagem";
                        if (jsonResposta != null && jsonResposta != void(0) && jsonResposta.mensagens != void(0) && jsonResposta.mensagens.length > 0)
                        {
                            UNINTER.objToken = null;
                            
                            var msg = "";
                            $.each(jsonResposta.mensagens, function (i, item) { msg += item + '<br>' });

                            if ($("#dialogModal").css("display") == "none" && objAvaliacaoUsuario.avaliacao.exigirSenhaTutor == true) {
                                renderPopupToken();
                                elemento = "#mensagemToken";
                            }

                            H.setMensagem({
                                body: msg,
                                strong: '',
                                type: 'danger',
                                appendTo: elemento
                            });
                            
                            UNINTER.viewGenerica.setPlaceholderHeight();
                        }

                    }catch(e)
                    {
                        return;
                    }
                };

                if (objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 4 || objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 1 || objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 5 || objAvaliacaoUsuario.idAvaliacaoUsuarioStatus == 6) {
                    q.mensagemErroBuscarQuestao = "Acesso negado!";
                    if (objAvaliacaoUsuario.tempoTotalAvaliacao > 0) {
                        q.contadorTempoMaximoSegundos = (objAvaliacaoUsuario.tempoTotalAvaliacao * 60);
                    } else {
                        if (objAvaliacaoUsuario.avaliacao.tempoTotal > 0) {
                            q.contadorTempoMaximoSegundos = (objAvaliacaoUsuario.avaliacao.tempoTotal * 60);
                        }
                    }
                    
                    if (objAvaliacaoUsuario.tempoTotal > 0)
                    {
                        q.contadorTempoAtualSegundos = (objAvaliacaoUsuario.tempoTotal*60);
                    }
                    q.salvarNoClick = true;
                    q.exbirNomeDisciplinaQuestao = true;
                    q.render();


                    var dadosTemp = q.getListaJSON();
                    if (dadosTemp != void (0) && dadosTemp.length > 0) {
                        var data = dadosTemp[0].dataCriacao;
                        var dataInicio = UNINTER.Helpers.dateTimeFormatter({ dateTime: data });
                        $("#dataInicial").html(dataInicio.date());
                        $("#horaInicial").html(dataInicio.time());


                        var urlConsumoTempo = UNINTER.AppConfig.UrlWs("bqs") + "AvaliacaoUsuarioTempoDecorrido/" + objAvaliacaoUsuario.tempoTotalAvaliacao + "/Get?dataCriacao=" + data;
                        var opcoes = {
                            url: urlConsumoTempo, type: "GET", async: true, successCallback: function (e) {
                                var dataFinal = UNINTER.Helpers.dateTimeFormatter({ dateTime: e.dataFinal });
                                $("#dataFinalPrevista").html(dataFinal.date());
                                $("#horaFinalPrevista").html(dataFinal.time());
                                if (e.tempoEsgotado == true)
                                {
                                    q.tempoEsgotado();
                                }
                                q.atualizarContadorSincroniaServer(e.milisegundosDecorrido);
                            }
                        };
                        var retornoConsumo = UNINTER.Helpers.ajaxRequest(opcoes);
                    }

                } else {
                    $("#labelDataFinal").html("Data de entrega: ");

                    var dataInicio = UNINTER.Helpers.dateTimeFormatter({ dateTime: objAvaliacaoUsuario.horarioInicio });
                    $("#dataInicial").html(dataInicio.date());
                    $("#horaInicial").html(dataInicio.time());

                    var dataFinal = UNINTER.Helpers.dateTimeFormatter({ dateTime: objAvaliacaoUsuario.horarioTermino });
                    $("#dataFinal").html(dataFinal.date());
                    $("#horaFinal").html(dataFinal.time());

                    if (objAvaliacaoUsuario.permiteVisualizarGabarito == true) {
                        q.exibirTodasQuestoes = true;

                        q.fnAposRenderizar = function () {

                            var questoesRespondidas = q.getListaJSON();
                            H.avaliacaoUsuarioHistorico = q.getRetornoAjax().resposta.avaliacaoUsuarioHistoricos;

                            if ((questoesRespondidas == void (0) || questoesRespondidas.length == 0) && H.avaliacaoUsuarioHistorico != void (0) && H.avaliacaoUsuarioHistorico.length > 0) {
                                var objErro = { body: "Nenhuma questão disponível ou escolhida pelo aluno para resolução.", type: "warning", appendTo: '#mensagem' };
                                H.setMensagem(objErro);
                            }
                        };

                        q.gabarito();
                        renderAcaoVisualizacaoImpressao();
                        exibirAlertaGabarito();
                        renderNotaVinculada();
                    } else {
                        var objErro = { body: objAvaliacaoUsuario.mensagemGabarito, type: "warning" };
                        H.setMensagem(objErro);
                    }
                }
            };

            var renderNotaVinculada = function () {

                $("#containerNotaVinculada").empty();

                if (objAvaliacaoUsuario.avaliacaoNotaVinculada != void(0))
                {
                    $("#containerNotaVinculada").html(_.template($('#templateNotaVinculada').html(), objAvaliacaoUsuario));
                }
                else
                {
                    $("#containerNotaVinculada").empty();
                }
            };

            var renderAcaoVisualizacaoImpressao = function ()
            {
                return;
                //<span class="un-icon-text un-printable"><a href="javascript:void(0)"><i class="icon-print"></i><span>versão para impressão</span></a></span>

                //<span class="un-icon-text un-printable" id=>
                //    <a href="javascript:void(0)">
                //        <i class="icon-print"></i><span>versão para impressão</span>
                //    </a>
                //</span>

                if (UNINTER.viewGenerica.parametros.metodo == 'novo')
                {
                    return;
                }

                var $icone = $("<i>").addClass("icon-print");
                var $spanTexto = $("<span>").html("versão para impressão");
                var $a = $("<a>").append($icone).append($spanTexto).on("click", function (e) {
                    e.preventDefault();
                    generatePrintVersion();
                });

                var $span = $("<span>").addClass("un-icon-text un-printable").append($a);

                $("#versaoImpressao").append($span);
            }

            var getNomeAvaliacao = function () {
                var nome = null;
                if (objAvaliacaoUsuario != null) {
                    nome = objAvaliacaoUsuario.avaliacao.nome;
                }
                return nome;
            };

            var generatePrintVersion = function generatePrintVersion() {
                var $div = $("<div>");
                var $containerCabecalho = $("<div>").addClass("row").append( $("#containerCabecalho").html() );

                $div.append($containerCabecalho).append($('#conteudoAvaliacao').html());
                $div.find("*").removeAttr('id').removeAttr('name').removeAttr("data-idquestao").removeAttr("data-idalternativa");

                var storage = window.UNINTER.StorageWrap,
                    data = {},
                    printLinkHandler = function printLinkHandler(data) {
                        var printContent = $div.html(),
                            idSalaVirtual = storage.getItem('leftSidebarItemView').idSalaVirtual;

                        if (!data.nomeSalaVirtual) {
                            //data.nomeSalaVirtual = window.UNINTER.Helpers.getNomeSalaVirtual(idSalaVirtual);
                            data.nomeSalaVirtual = getNomeAvaliacao();
                        }

                        // Overlay da versão de impressão
                        window.UNINTER.printable({
                            'content': printContent,
                            'i18n': {
                                'title': data.nomeSalaVirtual
                            }
                        });
                    };

                storage.setAdaptor(sessionStorage);

                //$('#lista').off('click.printable');
                //$('#lista').on('click.printable', '.un-printable', function printLinkClick() {
                    return printLinkHandler(data);
                //});
            };

        };
        return classHistorico;
    })();

    var historicoUsuario = new historico();
    historicoUsuario.appUnivirtus = appUnivirtus;
    historicoUsuario.carregarAvaliacao();

}