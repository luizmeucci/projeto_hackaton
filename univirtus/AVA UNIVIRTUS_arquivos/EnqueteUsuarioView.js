define(function (require) {
    'use strict';
    var App = require('app'),

        $ = require('jquery'),

        _ = require('underscore'),

        template = require("text!templates/ava/views/enqueteUsuario/enqueteUsuario.html"),
        
        VideoPlayer = require('libraries/videoplayer'),
        
        clsQuestoes = require("libraries/questoes"),

        ViewGenerica = require("views/common/ViewGenerica"),

        Backbone = require('backbone'),

        Marionette = require('marionette')

    return Marionette.ItemView.extend({
        initialize: function initialize(params) {
            if (params != void(0))
            {
                this.opts = params;
                this.ExibirEnquete();
                this.RegistrarEvento();
            }

        },

        opts: {},

        urlBuscarEnquetes: App.config.UrlWs('BQS') + 'Enquete/0/Usuario',

        AtualizarEnqueteSesssion: function (objEnquete) {
            var enquetes = App.StorageWrap.getItem('enquetes');
            var achou = false;
            $.each(enquetes, function (i, item) {
                if(item.id == objEnquete.id && item.idSalaVirtualOferta == objEnquete.idSalaVirtualOferta)
                {
                    achou = true;
                    enquetes[i] = objEnquete;
                    return;
                }
            });

            if(achou == false)
            {
                enquetes.push(objEnquete);
            }

            App.StorageWrap.setItem('enquetes', enquetes);
        },

        RemoverEnqueteSession: function (objEnquete) {
            var enquetes = App.StorageWrap.getItem('enquetes');
            var index = null;

            $.each(enquetes, function (i, item) {
                if (item.id == objEnquete.id && item.idSalaVirtualOferta == objEnquete.idSalaVirtualOferta) {
                    index = i;
                }
            });

            if (index > -1)
            {
                enquetes.splice(index, 1);
                App.StorageWrap.setItem('enquetes', enquetes);
            }

        },

        BuscarEnquetes: function (callback) {

            var self = this;

            //Se já buscou as enquetes, elas estão na session:
            var enquetes = App.StorageWrap.getItem('enquetes');
            if(enquetes != null)
            {
                callback(enquetes, self);
                return;
            }

            //Se não tem enquete na session, buscamos com ajax:
            var opcoes = {
                url: self.urlBuscarEnquetes,
                async: true,
                successCallback: function (data) {
                    if(typeof callback == "function")
                    {
                        if (data.enquetes != void (0)) {
                            App.StorageWrap.setItem('enquetes', data.enquetes);
                            callback(data.enquetes, self);
                        } else {
                            callback(undefined, self);
                        }
                        
                    }
                }, errorCallback: function (error) {

                    if(error.status == 404)
                    {
                        App.StorageWrap.setItem('enquetes', []);
                    }
                    callback([], self);
                }
            };
            App.Helpers.ajaxRequest(opcoes);

        },        

        ExibirEnquete: function () {
            //params: { rotina: "minha rotina" acao: "minhaAcao" }

            //Se não tem rotina, pára!
            if (this.opts.rotina == void (0) || this.opts.rotina == null) {
                console.warn('parametro rotina não definido na exceução da enquete'); return;
            };


            //Vamos ver se há enquete para essa rotina:
            this.BuscarEnquetes(this.ValidarExibicaoEnquete);

        },

        ValidarExibicaoEnquete: function (enquetes, self) {
            
            if(enquetes == null || enquetes == void(0))
            {
                return;
            }

            var objEnquete = null;

            var tipoGatilhoAtual = self.GetTipoGatilhoAtual();

            if (tipoGatilhoAtual == 0)
            {
                return;
            }

            $.each(enquetes, function (i, item) {
                if (item.ativo == true && item.idTipoGatilho == tipoGatilhoAtual && item.jaExibiu !== true) {

                    if ((item.idSalaVirtualOferta > 0 && self.opts.idSalaVirtualOferta == item.idSalaVirtualOferta) || item.idSalaVirtualOferta == void(0) || item.idSalaVirtualOferta == 0)
                    {
                        item.jaExibiu = self.opts.exibirBtnResponder === true ? false :  true;
                        objEnquete = item;
                        self.AtualizarEnqueteSesssion(objEnquete);
                        return;
                    }

                }
            });

            if(objEnquete != null)
            {

                //Se for avaliação, precisamos ver o tipo da avaliação...
                if ((tipoGatilhoAtual == 3
                    || tipoGatilhoAtual == 4
                    || tipoGatilhoAtual == 5
                    ) && objEnquete != null) {

                    

                    if (objEnquete.enqueteTipoGatilhos != null && objEnquete.enqueteTipoGatilhos != void(0))
                    {
                        var tipoAvaliacaoConfere = false;

                        $.each(objEnquete.enqueteTipoGatilhos, function (i, item) {
                            if (item.idAvaliacaoTipo == self.opts.idAvaliacaoTipo)
                            {
                                tipoAvaliacaoConfere = true;
                            }
                        });

                        if(tipoAvaliacaoConfere == false)
                        {
                            return;
                        }
                    }
                }

                //Buscamos a enquete para esse usuário:
                if (objEnquete.enqueteUsuario == void (0)) {

                    var url = App.config.UrlWs('BQS') + "EnqueteUsuario/" + objEnquete.id + "/Enquete";

                    if(objEnquete.idEnqueteUsuario > 0)
                    {
                        url = App.config.UrlWs('BQS') + "EnqueteUsuario/" + objEnquete.idEnqueteUsuario + "/Get";
                    }

                    var opcoes = {
                        url: url,
                        async: true,
                        successCallback: function (data) {
                            if(data != null && data.enqueteUsuario != void(0))
                            {
                                objEnquete.enqueteUsuario = data.enqueteUsuario;
                                objEnquete.enqueteUsuarioHistorico = data.enqueteUsuarioHistorico;

                                //Atualizamos o obj de session:
                                self.AtualizarEnqueteSesssion(objEnquete);

                                if (self.opts.exibirBtnResponder == true)
                                {
                                    $("#btnResponderPesquisaAvaliacao").show();
                                    UNINTER.viewGenerica.setPlaceholderHeight();
                                    setTimeout(UNINTER.viewGenerica.setPlaceholderHeight, 150);
                                    return;
                                }
                                self.RenderEnquete(objEnquete);
                            }

                        }, errorCallback: function (error) {
                            return;
                        }
                    };
                    App.Helpers.ajaxRequest(opcoes);

                } else {
                    if (self.opts.exibirBtnResponder == true) {
                        if (objEnquete.id != 49)
                        {
                            $("#imgCpa").show();
                        }
                        
                        $("#btnResponderPesquisaAvaliacao").show();
                        UNINTER.viewGenerica.setPlaceholderHeight();
                        setTimeout(UNINTER.viewGenerica.setPlaceholderHeight, 150);
                        return;
                    }
                    self.RenderEnquete(objEnquete);
                }                
            }

        },

        GetTipoGatilhoAtual: function () {
            
            var self = this;
            
            var tipoGatilho = 0;

            switch(this.opts.rotina.toLowerCase())
            {
                case "home":
                    tipoGatilho = 1;
                    break;
                case "roteiro-de-estudo":
                    tipoGatilho = 2;
                    break;
                case "avaliacaousuariohistorico":
                    
                    //Se está no avaliação usuario historico então precisamos testar os nomes:
                    switch (self.opts.avalicaostatus)
                    {
                        case "inicio":
                            tipoGatilho = 3;
                            break;
                        case "finalizar":
                            tipoGatilho = 4
                            break;
                        case "gabarito":
                            tipoGatilho = 5
                            break;
                    }

                    break;
            }

            return tipoGatilho;
        },

        FecharEnquete: function () {
            $("#btnResponderPesquisaAvaliacao").hide();
            $('#main-content').show(600);
            $('#main-enquete').hide(600, function () {
                $('#main-enquete').remove();
                UNINTER.viewGenerica.setPlaceholderHeight();
            });
        },

        RenderEnquete: function (objEnquete) {

            var self = this;

            if (UNINTER.viewGenerica == void(0))
            {
                try{
                    UNINTER.viewGenerica = new ViewGenerica();
                } catch (e) {
                    console.log(e.stack);
                    debugger;
                }
            }

            if (self.opts.exibirNomeDisciplina == true) {
                try {
                    objEnquete.nomeDisciplina = UNINTER.StorageWrap.getItem('leftSidebarItemView').nomeSalaVirtual;
                } catch (e) {
                    objEnquete.nomeDisciplina = undefined;
                }
            } else {
                objEnquete.nomeDisciplina = undefined;
            }




            

            objEnquete.saudacao = objEnquete.saudacao.replace("#nomeAluno#", '<span class="primeira-letra-maiuscula">' + UNINTER.StorageWrap.getItem('user').nome.split(' ')[0].toLowerCase() + '</span>');
             var bodyHtml = _.template(template, objEnquete);

            //var botoes = [];
            //var botaoFechar = false;

            //if (objEnquete.podeRecusarResponder) {
            //    botoes.push({
            //        'type': "button",
            //        'klass': "btn btn-default",
            //        'text': "Não exibir essa pesquisa novamente.",
            //        'dismiss': 'modal',
            //        'id': 'modal-cancel',
            //        'onClick': function (e) {
            //            self.RecusarEnquete(objEnquete);
            //        }
            //    });
            //}

            //if (objEnquete.podeResponderDepois)
            //{
            //    botaoFechar = true;
            //    botoes.push({
            //        'type': "button",
            //        'klass': "btn btn-default",
            //        'text': "Responder depois",
            //        'dismiss': 'modal',
            //        'id': 'modal-cancel'
            //    });
            //}

            //var title = $("<div>").append($("<i>", { class:"icon-stats-bars enquete-icon" })).append(objEnquete.nome);

            var self = this;
            //App.Helpers.showModalAdicionarFila({
            //    size: "modal-full",
            //    body: bodyHtml,
            //    title: title,
            //    modal: {
            //        backdrop: 'static',
            //        keyboard: false
            //    },
            //    botaoFechar: botaoFechar,
            //    buttons: botoes,
            //    callback: function () {
            //        var q = new questoes();
            //        q.separarPorTema = true;
            //        q.exibirTemasEmAbas = true;
            //        q.botaoFinalizarTexto = "Finalizar enquete"
            //        q.atributoJSONLista = "enqueteUsuarioHistorico";
            //        q.atributoJSONQuestao = "enunciado";
            //        q.setListaJSON(objEnquete.enqueteUsuarioHistorico);
            //        q.contadorExibir = false;
            //        q.exibirPaginacao = false;
            //        q.idObjDOM = "corpoEnquete";
            //        q.idObjDOMMensagem = "msgEnquete";
            //        q.setTotalQuestoes(objEnquete.enqueteUsuarioHistorico.length);
            //        q.botaoAvancar = false;
            //        q.botaoVoltar = false;
            //        q.exibirConfirmacaoEntrega = false;
            //        q.ajaxUrlSalvar = App.config.UrlWs('BQS') + "EnqueteUsuarioHistorico";
            //        q.ajaxUrlFinalizar = App.config.UrlWs('BQS') + "EnqueteUsuario/" + objEnquete.enqueteUsuario.id + "/Finalizar";
            //        q.exibirTitulo = false;
            //        q.ehEnquete = true;
            //        q.formatoLetraAlternativa = null;
            //        //q.atributoJSONidHistorico = 'idEnqueteUsuarioHistorico';
            //        q.fnAposFinalizar = function () {
            //            self.RemoverEnqueteSession(objEnquete);
            //            $(".modal-header .close").trigger("click");
            //        };
            //        q.fnAntesFinalizar = function () {
                        
            //            var questoes = q.getListaJSON();
            //            var semResposta = 0;
            //            var $ul = $('<ul>');
            //            var $container = $('<div>');
            //            var $msg = $('<p>').html('<strong>As questões abaixo são de preenchimento obrigatório:</strong>');
            //            $.each(questoes, function (i, item) {
            //                if (!item.idQuestaoAlternativa > 0 && item.idQuestaoTipo == 1) {
            //                    semResposta++;
            //                    $ul.append('<li>' + item.enunciado + '</<li>');
            //                }
            //            });

            //            $msg.append($ul).append('<p><strong>Indique sua resposta para prosseguir.</strong></p>');
            //            $container.append($msg);
            //            if (semResposta > 0) {

            //                var opcoesMsg = {
            //                    body: $container.html(),
            //                    strong: null,
            //                    type: "danger"
            //                }
            //                q.setMensagem(opcoesMsg);
            //                //UNINTER.Helpers.animatedScrollTop();
            //                $('#dialogModal').animate({ scrollTop: 0 }, 250);
            //                return false;
            //            } else {
            //                return true;
            //            }
            //        };
            //        q.fnAposSalvar = function (objQuestao) {
            //            objEnquete.enqueteUsuarioHistorico = q.getListaJSON();
            //            self.AtualizarEnqueteSesssion(objEnquete);
            //        };
            //        q.render();                    
            //    }
            //});

            //$('#main-content').after(bodyHtml)

            var podeExibirVideoSianee = function () {
                var retorno = false;

                var user = UNINTER.StorageWrap.getItem('user');

                if (user == void (0) || user.usuarioSianee == void (0)) {
                    retorno = false;
                } else {
                    var usuarioSianeeImpressao = _.findWhere(user.usuarioSianee, { idSianeeAtendimento: 16 });
                    if (usuarioSianeeImpressao != void (0)) {
                        retorno = true;
                    }
                }

                return retorno;

            };

            $('#main-enquete').html('');
            $(bodyHtml).insertAfter('#main-content').promise().done(function () {

                var q = new questoes();
                q.separarPorTema = true;
                q.exibirTemasEmAbas = objEnquete.exibicaoLinear == true ? false : true;
                q.botaoFinalizarTexto = "Finalizar enquete"
                q.atributoJSONLista = "enqueteUsuarioHistorico";
                q.atributoJSONQuestao = "enunciado";
                q.setListaJSON(objEnquete.enqueteUsuarioHistorico);
                q.contadorExibir = false;
                q.exibirPaginacao = false;
                q.idObjDOM = "corpoEnquete";
                q.idObjDOMMensagem = "msgEnquete";
                q.setTotalQuestoes(objEnquete.enqueteUsuarioHistorico.length);
                q.botaoAvancar = false;
                q.botaoVoltar = false;
                q.atributoJSONOrdem = 'ordem';
                q.exibirConfirmacaoEntrega = false;
                q.ajaxUrlSalvar = App.config.UrlWs('BQS') + "EnqueteUsuarioHistorico";
                q.ajaxUrlFinalizar = App.config.UrlWs('BQS') + "EnqueteUsuario/" + objEnquete.enqueteUsuario.id + "/Finalizar";
                q.exibirTitulo = false;
                q.ehEnquete = true;
                q.formatoLetraAlternativa = null;
                q.atributoJSONAgrupadorQuestaoMultiplaEscolha = ['idQuestao', 'idEnqueteConfiguracao', 'idEnqueteBloco'];
                q.botaoFinalizar = false;
                q.videoSianee = podeExibirVideoSianee();
                //q.atributoJSONidHistorico = 'idEnqueteUsuarioHistorico';
                q.fnAposFinalizar = function () {
                    self.RemoverEnqueteSession(objEnquete);
                    $(".modal-header .close").trigger("click");
                };
                q.fnAntesFinalizar = function () {

                    var questoes = q.getListaJSON();
                    var semResposta = 0;
                    var $ul = $('<ul>');
                    var $container = $('<div>');
                    var $msg = $('<p>').html('<strong>As questões abaixo são de preenchimento obrigatório:</strong>');
                    $.each(questoes, function (i, item) {
                        if (!item.idQuestaoAlternativa > 0 && item.idQuestaoTipo == 1) {
                            semResposta++;
                            $ul.append('<li>' + item.enunciado + '</<li>');
                        }
                    });

                    $msg.append($ul).append('<p><strong>Indique sua resposta para prosseguir.</strong></p>');
                    $container.append($msg);
                    if (semResposta > 0) {

                        var opcoesMsg = {
                            body: $container.html(),
                            strong: null,
                            type: "danger"
                        }
                        q.setMensagem(opcoesMsg);
                        //UNINTER.Helpers.animatedScrollTop();
                        $('#dialogModal').animate({ scrollTop: 0 }, 250);
                        return false;
                    } else {
                        return true;
                    }
                };
                q.fnAposSalvar = function (objQuestao) {
                    objEnquete.enqueteUsuarioHistorico = q.getListaJSON();
                    self.AtualizarEnqueteSesssion(objEnquete);
                };
                q.render();

                $('#podeRecusarResponder').off('click').on('click', function () {
                    self.RecusarEnquete(objEnquete);
                });

                $('#podeResponderDepois').off('click').on('click', function () {
                    self.FecharEnquete();
                });

                $('#finalizarEnquete').off('click').on('click', function () {
                    self.FinalizarEnquete(objEnquete, q);
                });

            });

            $('#main-content').hide(600);

            this.BuscarCurso(objEnquete);
           
                            var video = new VideoPlayer();
                            video.videoHolder = video.videoId = 'video';
                            video.width = '100%';
                            video.sourceMP4 = objEnquete.urlVod;
                            $('#divViewObjeto').html( video.tagVideo() );
                            video.inicializar();

        },

        BuscarCurso: function (objEnquete) {
            if (objEnquete == void (0) || objEnquete.enqueteUsuario == void (0) || objEnquete.enqueteUsuario.idCurso == void (0) || objEnquete.enqueteUsuario.idCurso == 0)
            {
                return;
            }

            App.Helpers.ajaxRequest({
                url: App.config.UrlWs('sistema') + "Curso/" + objEnquete.enqueteUsuario.idCurso + "/Get",
                async: true,
                successCallback: function (data) {

                    if(data.curso != void(0) && data.curso.nome != void(0))
                    {
                        $('#enqueteNomeCursoContainer' + data.curso.id).html('<strong class="enquete-description">Curso: ' + data.curso.nome + '</strong>').show();
                    }

                }, errorCallback: function (error) { }
            });
        },

        FinalizarEnquete: function (objEnquete, q) {
        
            $("#btnResponderPesquisaAvaliacao").hide();

            var listaQuestao = q.getListaJSON();
            var semResposta = 0;
            var $ul = $('<ul>');
            var $container = $('<div>');
            var $msg = $('<p>').html('<strong>As questões abaixo são de preenchimento obrigatório:</strong>');
            $.each(listaQuestao, function (i, item) {
                if (
                    /*Objetiva*/
                    (!item.idQuestaoAlternativa > 0 && (item.idQuestaoTipo == 1 || item.idQuestaoTipo == 6))
                    ||
                    /*Discursiva*/
                    (!(parseInt(item.resposta) > -2) && (item.idQuestaoTipo == 8 || item.idQuestaoTipo == 9)) //-1 pode ser quando marca não tenho condições de responder.
                )
                {
                    semResposta++;
                    $ul.append('<li>' + item.enunciado + '</<li>');
                } else if (item.idQuestaoTipo == 7){
                    /*Multipla escolha*/

                    var totalMarcado = item.idQuestaoAlternativa > 0 ? 1 : 0;

                    //Tem pelo menos uma marcada?
                    if (item.alternativasSelecionadas != void(0) || item.alternativasSelecionadas.length > 0) {
                        $.each(item.alternativasSelecionadas, function (i, selecionada) {
                            if(selecionada.idQuestaoAlternativa > 0)
                            {
                                totalMarcado++;
                            }
                        });
                    }

                    if (totalMarcado == 0) {
                        semResposta++;
                        $ul.append('<li>' + item.enunciado + '</<li>');
                    }
                }
            });

            $msg.append($ul).append('<p><strong>Indique sua resposta para prosseguir.</strong></p>');
            $container.append($msg);
            if (semResposta > 0) {

                var opcoesMsg = {
                    body: $container.html(),
                    strong: null,
                    type: "danger"
                }
                q.setMensagem(opcoesMsg);
                UNINTER.Helpers.animatedScrollTop();
                //$('#dialogModal').animate({ scrollTop: 0 }, 250);
            } else {
                var self = this;

                var opcoes = {
                    url: App.config.UrlWs('BQS') + "EnqueteUsuario/" + objEnquete.enqueteUsuario.id + "/Finalizar",
                    async: true,
                    successCallback: function (data) {
                        self.RemoverEnqueteSession(objEnquete);
                        self.FecharEnquete();

                        if (data.numeroSorteado > 0) {
                            UNINTER.Helpers.showModal({
                                size: "",
                                body: "Seu número para o sorteio é '" + data.numeroSorteado + "'. Guarde este número para futuras consultas. Boa sorte!",
                                title: null,
                                callback: null,
                                buttons: [{
                                    'type': "button",
                                    'klass': "btn btn-primary",
                                    'text': "OK",
                                    'dismiss': null,
                                    'id': 'modal-ok',
                                    'onClick': function (event, jQModalElement) {
                                        jQModalElement.modal('hide');
                                    }
                                }]
                            });
                        }

                    }, errorCallback: function (error) { }
                };
                App.Helpers.ajaxRequest(opcoes);
            }

        },

        RecusarEnquete: function (objEnquete) {
            var self = this;

            $("#btnResponderPesquisaAvaliacao").hide();

            var opcoes = {
                url: App.config.UrlWs("BQS") + "EnqueteUsuario/"+ objEnquete.enqueteUsuario.id + "/Recusar",
                async: true,
                successCallback: function (data) {
                    self.RemoverEnqueteSession(objEnquete);
                    self.FecharEnquete();
                }, errorCallback: function (error) { }
            };
            App.Helpers.ajaxRequest(opcoes);
        },

        RegistrarEvento: function () {
            var self = this;

            $("#midContentHolder").undelegate();

            $("#midContentHolder").delegate('a', 'enqueteavaliacaoinicio', function (e) {
                var el = e.currentTarget;
                var idAvaliacaoTipo = $(el).data('idavaliacaotipo');
                self.opts.avalicaostatus = 'inicio';
                self.opts.idAvaliacaoTipo = idAvaliacaoTipo;
                self.opts.exibirBtnResponder = false;
                self.ExibirEnquete();
            });

            $("#midContentHolder").delegate('a', 'enqueteavaliacaogabarito', function (e) {
                var el = e.currentTarget;
                var idAvaliacaoTipo = $(el).data('idavaliacaotipo');
                self.opts.avalicaostatus = 'gabarito';
                self.opts.idAvaliacaoTipo = idAvaliacaoTipo;
                self.opts.exibirBtnResponder = false;
                self.opts.exibirNomeDisciplina = false;
                self.ExibirEnquete();
            });

            $("#midContentHolder").delegate('a', 'enqueteavaliacaofinalizar', function (e) {
                var el = e.currentTarget;
                var idAvaliacaoTipo = $(el).data('idavaliacaotipo');
                var idSalaVirtualOferta = $(el).data('idsalavirtualoferta');
                self.opts.avalicaostatus = 'finalizar';
                self.opts.idAvaliacaoTipo = idAvaliacaoTipo;
                self.opts.idSalaVirtualOferta = idSalaVirtualOferta;
                self.opts.rotina = "avaliacaousuariohistorico";
                self.opts.exibirBtnResponder = false;
                self.opts.exibirNomeDisciplina = true;
                self.ExibirEnquete();
            });

            $("#midContentHolder").delegate('a', 'avaliacaotemenquete', function (e) {
                var el = e.currentTarget;
                var idAvaliacaoTipo = $(el).data('idavaliacaotipo');
                var idSalaVirtualOferta = $(el).data('idsalavirtualoferta');
                self.opts.avalicaostatus = 'finalizar';
                self.opts.idAvaliacaoTipo = idAvaliacaoTipo;
                self.opts.idSalaVirtualOferta = idSalaVirtualOferta;
                self.opts.rotina = "avaliacaousuariohistorico";
                self.opts.exibirBtnResponder = true;
                self.opts.exibirNomeDisciplina = false;
                self.ExibirEnquete();
            });

        },
    });
});