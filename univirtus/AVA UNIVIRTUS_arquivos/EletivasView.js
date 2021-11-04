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
        processCollection = require('libraries/processCollection'),
        templateLoader = new App.LazyLoader('text!templates/ava/views'),
        templateCurso = require("text!templates/ava/views/eletivas.html"),
        collectionLoader = new App.LazyLoader('collections/ava'),
        AnexoView = require('views/common/AnexosView');

    return Backbone.View.extend({
        initialize: function (options) {
            
            this.templateCurso = "";            
            this.homeView = options.homeNavbarView;
            this.self = this;
        },
       

        getEletivas: function (callback) {
            var defaults = {
                url: App.config.UrlWs('ava') + 'Eletiva/' + 0 + '/EscolherEletivaCursoUsuario',
                type: 'GET',
                async: true,
                successCallback: function (data) {
                    callback(data.eletivas);
                },
                errorCallback: function () {
                    callback(void(0));
                }
            };

            App.Helpers.ajaxRequest(defaults);
        },
        
        showModalEletiva: function (html) {
            var self = this;
            App.Helpers.showModalAdicionarFila({
                size: "modal-lg",
                body: html,
                title: 'Disciplinas Eletivas',
                buttons: [{
                    'type': "button",
                    'klass': "btn btn-primary",
                    'text': "Confirmar",
                    'dismiss': null,
                    'id': 'modal-ok',
                    'onClick': function (event, jQModalElement) {
                        var valor = null;
                        var name = $("#dialogModal div[data-idcurso] input:first").attr("name");
                        valor = parseInt($("input[name=" + name + "]:checked").val());
                        if (valor > 0) {
                            self.realizarInscricao(valor);
                            //jQModalElement.modal('hide');
                            //inscreve
                        } else {
                            //erro. Obrigatorio escolher disciplina
                            $("#erro-eletiva").html("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Eletiva não escolhida. </strong> Necessário escolher uma disciplina para confirmar.<br><strong>Atenção. </strong> Depois de confirmado não será possível alterar a disciplina escolhida.</div>");
                        }
                    }
                }, {
                    'type': "button",
                    'klass': "btn btn-default",
                    'text': "Escolher depois",
                    'dismiss': 'modal',
                    'id': 'modal-cancel'
                }]
            });
        },

        realizarInscricao: function (idEletiva) {

            $(".modal-body table").hide();
            $(".modal-footer button.btn-primary").hide();
            $(".modal-footer button.btn-default").hide();
            $("#erro-eletiva").html("<div class='alert alert-warning alert-dismissible' role='alert'>Realizando inscrição na disciplina escolhida, por favor aguarde.</div>");
            App.session.set('jaEscolheuEletiva', true);
            var self = this;
            var defaults = {
                type: 'POST',
                data: { idEletiva: idEletiva },
                async: true,
                successCallback: self.sucessoInscricao,
                context: this,
                errorCallback: self.erroInscricao,
                url: App.config.UrlWs('ava') + 'Eletiva/'
            };
            
            App.Helpers.ajaxRequest(defaults);
        },

        sucessoInscricao: function (a) {
            var self = this.context;
            $("#erro-eletiva").html("<div class='alert alert-success alert-dismissible' role='alert'>Inscrição realizada com sucesso.</div>");
            $(".modal-footer button.btn-default").html("FECHAR").show();
            try{
                self.homeView.trigger('recarregar');
            }catch(e)
            {
                setTimeout(window.location.reload, 600);
            }
        },

        erroInscricao: function (a, b, c) {
            $("#erro-eletiva").html("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Erro ao realizar inscrição. </strong></div>");
            $(".modal-body table").show();
            $(".modal-footer button.btn-primary").show();
            $(".modal-footer button.btn-default").show();
        },

        atualizarEventos: function () {

            $("#dialogModal div[data-idcurso] input").on("click", function (e) {
                var elemento = e.currentTarget;
                $("#dialogModal div[data-idcurso] tr").removeClass("warning");
                $(elemento).parent().parent().addClass("warning");
            });
        },

        getAtividadesCurso: function (idCurso) {


            var defaults = {
                url: App.config.UrlWs('atv') + 'AtividadeItemAprendizagem/' + idCurso + '/CursoEletiva',
                type: 'GET',
                async: true,
                successCallback: function (data) {

                    var retorno = {
                        descricao: void (0),
                        containerAnexos: void (0),
                        containerLink: void (0),
                        containerVideo: void (0)
                    };

                    var anexos = [];
                    var links = [];
                    var videos = [];

                    var htmlContainer = '';

                    var atividadeItemAprendizagens = data.atividadeItemAprendizagens;

                    $(atividadeItemAprendizagens).each(function (i, item) {

                        if (item.nomeAtividade != void (0)) {
                            retorno.descricao = item.nomeAtividade;
                        }

                        var etiquetas = item.itemAprendizagemEtiquetas;
                        var etiquetaTitulo = _.findWhere(etiquetas, { idTipoRotulo: 1 });

                        switch (item.idItemAprendizagemTipo) {
                            case 2: //Link
                                var etiquetaLink = _.findWhere(etiquetas, { idTipoRotulo: 7 });

                                if (etiquetaLink != void (0)) {

                                    links.push({
                                        titulo: (etiquetaTitulo) ? etiquetaTitulo.valorEtiqueta : etiquetaLink.valorEtiqueta,
                                        valor: etiquetaLink.valorEtiqueta
                                    });
                                }

                                break;
                            case 3://Anexos

                                var etiquetaAnexo = _.findWhere(etiquetas, { idTipoRotulo: 3 });

                                if (etiquetaAnexo != void (0)) {
                                    etiquetaAnexo.sistemaRepositorio.url = UNINTER.AppConfig.UrlWs("repositorio") + 'SistemaRepositorioPublico?id=' + etiquetaAnexo.sistemaRepositorio.url;
                                    anexos.push(etiquetaAnexo.sistemaRepositorio);
                                }

                                break;
                            case 4: //Video
                                var etiquetaVideo = _.findWhere(etiquetas, { idTipoRotulo: 4 });

                                if (etiquetaVideo != void (0)) {
                                    videos.push({
                                        titulo: (etiquetaTitulo) ? etiquetaTitulo.valorEtiqueta : etiquetaVideo.valorEtiqueta,
                                        valor: etiquetaVideo.valorEtiqueta
                                    });
                                }
                                break;
                        }

                    });


                    if (videos.length > 0) {
                        retorno.containerVideo = '<br><p class="text-primary">VÍDEOS</p>';
                        $(videos).each(function (i, item) {
                            retorno.containerVideo += '<p><a target="_blank" href="' + item.valor + '">' + item.titulo + '</a></p>';
                        });
                    }

                    if (links.length > 0) {
                        retorno.containerLink = '<br><p class="text-primary">LINKS</p>';
                        $(links).each(function (i, item) {
                            retorno.containerLink += '<p><a target="_blank" href="' + item.valor + '">' + item.titulo + '</a></p>';
                        });
                    }

                    if (anexos.length > 0) {
                        var Collection = Backbone.Collection.extend({ model: Backbone.Model.extend({}) });

                        var anexos = new AnexoView({ collection: new Collection(anexos), totalAnexos: anexos.length, lista: true }).render();
                        retorno.containerAnexos = $('<div>').html(anexos.$el).html();
                    }


                    var body = "";

                    if (retorno.descricao) {
                        body += retorno.descricao;
                    }

                    if (retorno.containerLink) {
                        body += retorno.containerLink;
                    }

                    if (retorno.containerVideo) {
                        body += retorno.containerVideo;
                    }

                    if (retorno.containerAnexos) {
                        body += retorno.containerAnexos;
                    }

                    $('.modal-body [data-idcurso="' + idCurso + '"] .containerInfoEletiva').html(body);
                },
                errorCallback: function () {
                    $('.modal-body [data-idcurso="' + idCurso + '"] .containerInfoEletiva').html("");
                }
            };

            App.Helpers.ajaxRequest(defaults);
        },

        render: function () {

            var jaEscolheuEletiva = App.session.get('jaEscolheuEletiva');

            if (jaEscolheuEletiva == true)
            {
                return;
            }

            var self = this;
            var htmlModal = "";
            $.when(
                collectionLoader.get('Cursos')
            ).done(function (CursosEntity) {
                

                self.getEletivas(function (eletivas) {

                    var objGroupBy = _.groupBy(eletivas, function (item) {
                        return item.nomeCurso;
                    });

                    if (eletivas) {
                        $.each(objGroupBy, function (k, eletiva) {

                            var modulos = _.groupBy(eletiva, function (item) {
                                return item.idModuloEletiva
                            });

                            var curso = new Object();
                            curso.dataInicioInscricao = UNINTER.Helpers.dateTimeFormatter({ dateTime: eletiva[0].dataInicioInscricao, withTag: true }).date();
                            curso.dataFimInscricao = UNINTER.Helpers.dateTimeFormatter({ dateTime: eletiva[0].dataFimInscricao, withTag: true }).date();
                            curso.nome = eletiva[0].nomeCurso;
                            curso.id = eletiva[0].idCurso;

                            //curso.infoEletiva = self.getAtividadesCurso(curso.id);

                            htmlModal += _.template(templateCurso, {
                                curso: curso,
                                eletivas: eletiva,
                                modulos: modulos
                            });

                        });

                        self.showModalEletiva(htmlModal);

                        //Async para popular os dados do curso pelo item de aprendizagem
                        $.each(objGroupBy, function (k, eletiva) {
                            self.getAtividadesCurso(eletiva[0].idCurso);
                        });
                    }

                    self.atualizarEventos();

                });

                self.atualizarEventos();

            });
            
            return this;
            
        }
    });

});