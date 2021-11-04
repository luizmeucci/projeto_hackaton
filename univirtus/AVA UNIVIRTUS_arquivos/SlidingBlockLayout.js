/* ==========================================================================
   Atividades Layout
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 01/04/2014
   ========================================================================== */

define(function (require) {
    'use strict';
    var App = require('app'),

        $ = require('jquery'),

        _ = require('underscore'),

        template = require('text!templates/ava/views/atividades-item-template.html'),

        SlidingBlockBaseLayout = require('views/common/SlidingBlockBaseLayout'),

        carregarRota = require('libraries/carregarRota'),

        overlayDialog = require('libraries/overlayDialog'),

        popover = require('libraries/popover'),

        slider = App.slidingView(),

        VideoPlayer = require('libraries/videoplayer'),

        viewLoader = new App.LazyLoader('views'),

        atividadesViewLoader = new App.LazyLoader('views/ava/Atividades'),
        CadastrarAtividadeItemView,
        ViewGenerica,
        renderDetalhes = function (id) {

            App.Helpers.ajaxRequest({
                url: App.config.UrlWs('roa') + "itemAprendizagem/" + id + "/GetEtiquetasIdentificantes",
                type: 'GET',
                async: true,
                successCallback: function (response) {
                    var body = $("<dl>"),
                        titulo = 'Detalhes';

                    if (response.itemAprendizagem) {
                        $("#dialogModal .modal-title").html("Detalhes - " + response.itemAprendizagem.nomeItemAprendizagemTipo);

                        _.each(response.itemAprendizagem.itemAprendizagemEtiquetas, function (itemAprendizagemEtiqueta) {
                            var fieldset = $("<dl>");
                            /*if (itemAprendizagemEtiqueta.nomeRotulo)
                                fieldset.html("<legend>" + itemAprendizagemEtiqueta.nomeRotulo + "<legend>");*/


                            if (itemAprendizagemEtiqueta.texto) {
                                switch (itemAprendizagemEtiqueta.idTipoRotulo) {
                                    case 3: //arquivo
                                        var repositorio = itemAprendizagemEtiqueta.sistemaRepositorio;

                                        if (repositorio.nome) {
                                            fieldset.append("<dt style='text-transform: uppercase;'>Nome do arquivo</dt>");
                                            fieldset.append("<dd style='word-wrap: break-word;'>" + repositorio.nome + "</dd>");
                                        }
                                        if (repositorio.nome) {
                                            fieldset.append("<dt style='text-transform: uppercase;'>Extensão do arquivo</dt>");
                                            fieldset.append("<dd style='word-wrap: break-word;'>" + repositorio.extensao + "</dd>");
                                        }
                                        break;

                                    case 1:
                                    case 2:
                                    case 35:
                                        fieldset.append("<dt style='text-transform: uppercase;'>" + itemAprendizagemEtiqueta.nomeRotulo + "</dt>");
                                        fieldset.append("<dd style='word-wrap: break-word;'>" + itemAprendizagemEtiqueta.texto + "</dd>");
                                        break;
                                }
                            }

                            body.append(fieldset.html());
                        });
                        if (body.is(":empty")) {
                            body.append("Não há detalhes");
                        }
                        //response.itemAprendizagem.dataCriacao = UNINTER.Helpers.dateTimeFormatter({ dateTime: response.itemAprendizagem.dataCriacao, yearFull: false }).dateTime();
                        //body.append("<dt style='text-transform: uppercase;'>Data de criação</dt><dd style='word-wrap: break-word;'>" + response.itemAprendizagem.dataCriacao + "</dd>");
                    }

                    $("#dialogModal .modal-body").html(body);
                },
                errorCallback: function () {
                    $("#dialogModal .modal-body").html("Não há registros");
                }
            });
        };        
        
    return SlidingBlockBaseLayout.extend({
        initialize: function(options) {

            
            SlidingBlockBaseLayout.prototype.initialize.call(this, options);
            this.svId = options.svId;
            this.temaId = options.idTema;
            this.atividadeId = options.idAtividade;
            this.idSalaVirtualOferta = options.idSalaVirtualOferta;
            this.nomeCadastrarItem = options.nomeCadastrarItem;
            this.idSalaVirtualEstruturaRotuloTipo = options.idSalaVirtualEstruturaRotuloTipo;
            this.urlBuscarEstrutura = options.urlBuscarEstrutura;
            this.contractEstrutura = options.contractEstrutura;
            this.contractAtividade = options.contractAtividade;
            this.rotinaCadastroAtividade = options.rotinaCadastroAtividade;
            this.rotinaAtividade = options.rotinaAtividade;
            this.idModulo = options.idModulo;
            this.urlEditarAtividade = options.urlEditarAtividade;
            this.urlExcluirAtividade = options.urlExcluirAtividade;
            this.ocultarStatusAtividade = options.ocultarStatusAtividade;
            this.areaPermsAtividade = options.areaPermsAtividade;
            this.urlEditarEstrutura = options.urlEditarEstrutura;
            this.rotinaEstrutura = options.rotinaEstrutura;
            this.urlAposCadastroAtividade = options.urlAposCadastroAtividade;
            this.ocultarMaterialDidatico = (options.ocultarMaterialDidatico) ? options.ocultarMaterialDidatico : false;
            this.exibirDetalhesAtividade = options.exibirDetalhesAtividade;
            this.renderizarBtnVoltar = (options.renderizarBtnVoltar) ? options.renderizarBtnVoltar : false;
            this.exibirItemInicial = (options.exibirItemInicial) ? options.exibirItemInicial : false;
            this.urlBuscarAtividade = (options.urlBuscarAtividade) ? options.urlBuscarAtividade : false;
            this.redirecionarCentralMidia = (options.redirecionarCentralMidia) ? options.redirecionarCentralMidia : false;
            var self = this;
            $.when(
            atividadesViewLoader.get('CadastrarAtividadeItemView'), 
            viewLoader.get('common/ViewGenerica')).done(function (ca, vg) {
                CadastrarAtividadeItemView = ca;
                window.UNINTER.viewGenerica = ViewGenerica = new vg({ View: vg });                                
            });


            if(options.redirecionarCentralMidia){
                document.location = "#/ava/salaVirtualAtividade/";
                return;
            }
        },

        events: {
            'click #unAccordion.parent > .un-accordion-item': 'accordionParentItemClick',
            'click #unAccordion .child > .un-accordion-item': 'accordionChildItemClick',
            'click #unAccordion .un-accordion-item-content': 'accordionItemContentClick',
            'click #unAccordion .uninter-atv-adm-actions-add': 'admActions',
            'click #unAccordion .anexos-holder .anexos-item': 'anexoClick',
            'click #slidingBlocksContainer #acaoVoltar': 'goBackClick',
            'click #unAccordion .item-box-resource .lnk-download a': 'downloadArquivosRota',
            'click #materialComplementarContainer .item-box-resource .lnk-download a': 'downloadArquivosRota',
            'click .item-box-resource .uninter-item-action-btn': 'actionButtonClick',
            'click .item-box-resource .uninter-item-action-btn-interno': 'actionButtonInternoClick',
            'click .uninter-atv-description #tagEditImageAtividade': 'uplodImageAtividade',
            'click .uninter-atv-description #removerImagemAtividade': 'removeImageAtividade',
            
            'click #unAccordion .link-details-item': 'openDetalhes',            
            'click #materialComplementarContainer .link-details-item': 'openDetalhes'
        },
        actionIcone: function (id) {

            if (UNINTER.StorageWrap.getItem("user").idUsuarioSimulador > 0) {
                return;
            }
            
            var $el = $("#statusitemAprendizagem_" + id);
            var elemento = $el.prop('id');

            var acessado = $("#" + elemento + ".hidden").length;

            $("#" + elemento).removeClass("hidden");

            if (acessado > 0) {

                //var objSessao = UNINTER.StorageWrap.getItem("desempenhoItemAprendizagem");
                
                var idAtividade = $("#" + elemento).parents("li.uninter-atv-item.un-accordion-item.active").attr('id');

                var totalAcessado = $("[data-idestrutura=" + idAtividade + "]").data('totalacessado');
                var totalItem = $("[data-idestrutura=" + idAtividade + "]").data('totalitem');

                totalAcessado = totalAcessado + 1;

                var porcentagem = (totalAcessado * 100) / totalItem;

                if (porcentagem > 100) {
                    return;
                }

                $("[data-idestrutura=" + idAtividade + "]").data('totalacessado', totalAcessado);

                $("[data-idestrutura=" + idAtividade + "]").data('porcentagemacessado', porcentagem);

                $("[data-idestrutura=" + idAtividade + "] li.progress div.progress-bar").css('width', porcentagem + '%').attr('aria-valuenow', porcentagem);

                $("[data-idestrutura=" + idAtividade + "] #textProgressBar span").html(porcentagem + '%');

            }

        },

        openDetalhes: function (e) {
            e.stopImmediatePropagation();
            var $el = $(e.currentTarget);
            var id = $el.prop('id').replace('detalhesitemAprendizagem_', '');
            
            App.Helpers.showModal({
                size: "",
                title: 'Detalhes',
                body: "",
                callback: renderDetalhes(id),
                buttons: [{
                    'type': "button",
                    'klass': "btn btn-default",
                    'text': "Fechar",
                    'dismiss': 'modal',
                    'id': 'modal-cancel'
                }]
            });
        },
        
        downloadArquivosRota: function (e) {
            
            var icones = {
                audio: "icon-volume-up",
                video: "icon-video",
                videolibras: "icon-video"
            };

            var podeDownload = false;
            var elemento = e.currentTarget;
            var tipo = $(elemento).data('tipo');
            

            //Remove  popover se existir
            popover({ 'target': elemento }).destroy();

            var urlDownload = $(elemento).closest('.item-box-resource').find("a[data-url]").data("url");

            var tempPath = urlDownload.split("/");

            var fnTrim = function (x) {
                return x.replace(/^\s+|\s+$/gm, '');
            }

            var temVideoLibras = null;

            var eventosNavegacao = function (elemento, initPopover) {

                $(elemento).off('shown.bs.popover').off('keypress').on('shown.bs.popover', function (e) {
                    $('.popover-content .list-group li:first a').focus();

                    $(document).on('keydown.popover', function (e) {

                        //Se não esta na lista, remove o evento e o popover;
                        if (!$(e.target).parent().hasClass('list-group-item')) {
                            initPopover.hide();
                            popover({ 'target': elemento }).destroy();
                            $(document).off('keydown.popover');
                            $(elemento).focus();
                            return;
                        }

                        //tab:
                        if (e.keyCode == 9)
                        {
                            var $el = $(e.target);
                            var $ul = $el.parent().parent();

                            if (e.shiftKey == true) {
                                var $first = $ul.find('li:first a');
                                if ($first[0] == $el[0]) {
                                    initPopover.hide();
                                    popover({ 'target': elemento }).destroy();
                                    $(document).off('keydown.popover');
                                    $(elemento).focus();
                                }
                            }
                            else
                            {
                                var $last = $ul.find('li:last a');
                                if ($last[0] == $el[0]) {
                                    initPopover.hide();
                                    popover({ 'target': elemento }).destroy();
                                    $(document).off('keydown.popover');
                                    $(elemento).focus();
                                }
                            }
                        }
                    });
                });

                $(elemento).off('hidden.bs.popover').on('hidden.bs.popover', function (e) {
                    $(document).off('keydown.popover');
                })


            };

            var renderItem = function (item, ehURL) {

                if (ehURL === true) {
                    href = item;
                } else {
                    var href = $(item).attr("src");
                    if (href == void (0)) {
                        href = $(item).find("source").attr("src");
                    }
                }

                //Pegamos alguns casos que possuem espaço antes do http:// causando erro no PHP ao buscar o diretorio.
                href = fnTrim(href);

                var temp = href.split("/");

                if (temp.indexOf("vod.grupouninter.com.br") > -1) {
                    var nome = temp[temp.length - 1];

                    //Se for tipo audio, troca a URL:
                    if (tipo == 'audio') {
                        href = href.replace('vod.grupouninter', 'aud.grupouninter').replace('.mp4', '.mp3');
                        nome = nome.replace('.mp4', '.mp3');
                    } else if(tipo == 'videolibras') {

                        var tmp = href.split('/');
                        tmp[tmp.length - 1] = 'L' + tmp[tmp.length - 1];
                        var hrefTMP = tmp.join('/');

                        if (temVideoLibras == true) //se já testou uma vez, não precisa testar mais
                        {
                            href = hrefTMP;
                        } else if (temVideoLibras == false) {
                            return; //se não tem libras, não faz nada
                        } else {
                            App.Helpers.ajaxRequest({
                                url: App.config.UrlWs('repositorio') + 'SistemaRepositorioRemoto/0/CheckUrl',
                                type: 'GET',
                                data: { url: encodeURIComponent(hrefTMP) },
                                async: false,
                                successCallback: function (data) {
                                    temVideoLibras = true;
                                    href = hrefTMP;
                                },
                                errorCallback: function (error) {
                                    temVideoLibras = false;
                                    href = 'javascript:void(0)';
                                    nome = 'Vídeo de libras não disponível<br>Utilize a opção vídeos.';
                                }
                            });
                        }
                    }

                    
//                    href = "http://vod.grupouninter.com.br/download.php?url=" + href;
                    var icone = $("<i>").addClass(icones[tipo]);
                    var span = $("<span>").html(nome);
                    var a = $("<a>").append(icone).append(span).attr("href", href).attr("target", "_blank");

                    if(href != 'javascript:void(0)')
                    {
                        a.attr('download', true);
                    }
                    
                    return $("<li>").addClass("list-group-item").append(a);
                } else {
                    return "";
                }
            };

            //Eh VOD?
            if(tempPath.indexOf("vod.grupouninter.com.br") > -1)
            {
                podeDownload = true;
                var divContainer = $("<div>");
                var ul = $("<ul>").addClass("cadastrar-atividade-tipos list-group");

                var item = $("<video>").attr("src", urlDownload);

                ul.append(renderItem(item))

                divContainer.append(ul);

                var initPopover = popover({
                    'target': elemento,
                    'content': divContainer,
                    'trigger': 'manual'
                });
                initPopover.show();
                eventosNavegacao(elemento, initPopover);
            }

            //Eh Rota
            if ((tempPath.indexOf("ava.grupouninter.com.br") > -1) ||(tempPath.indexOf("grupouninter.com.br") > -1) || (tempPath.indexOf("conteudosdigitais.uninter.com") > -1))
            {
                
                var url = UNINTER.AppConfig.UrlWs("repositorio") + "SistemaRepositorioRemoto/";

                //O CCDD fez um método para retornar os videos utilizados na rota. Tentamos consumir dele, senão vamos para o nosso server para capturar os arquivos VOD.
                var tempUrlHash = urlDownload.split('#');
                
                var urlDownloadServer = urlDownload;

                if (tempUrlHash[0].indexOf('.php') > -1 || tempUrlHash[0].indexOf('.html') < 0) {

                    var tempURLPHP = tempUrlHash[0];

                    if (tempUrlHash[0].indexOf('?') > -1) {
                        tempURLPHP = tempUrlHash[0] + '&action=getvideos&value=all';
                    } else {
                        tempURLPHP = tempUrlHash[0] + '?action=getvideos&value=all';
                    }

                    urlDownloadServer = tempURLPHP;
                };

                if (tempUrlHash[0].indexOf('newrota') > -1) {
                    urlDownloadServer = 'https://conteudosdigitais.uninter.com/materiais/aulas/' + UNINTER.Helpers.getUrlParameter('c', urlDownloadServer) + '/index.json';
                }

                var data = {
                    url: url,
                    type: 'post',
                    data: { url: fnTrim(urlDownloadServer) },
                    async: false,
                    successCallback: function (e) {

                        var divContainer = $("<div>");
                        var ul = $("<ul>").addClass("cadastrar-atividade-tipos list-group");

                        podeDownload = true;
                        
                        var obj = null;
                        try{ 
                            obj = JSON.parse(e);
                        }catch(e){ 
                            obj = null; 
                        }
                        if(obj != void(0) && obj.aula != void(0))
                        {
                            $.each(obj.aula.midia, function (i, item) {
                                if (i > 0) {
                                    ul.append(renderItem(item.url, true));
                                }
                            });

                            divContainer.append(ul);

                            var initPopover = popover({
                                'target': elemento,
                                'content': divContainer,
                                'trigger': 'manual'
                            });
                            initPopover.show();
                            eventosNavegacao(elemento, initPopover);

                        }
                        else if (e.indexOf('resultvideos') >= 0) 
                        {
                            //O resultado foi um html uma lista de videos?
                            var arrayVOD = e.split('\n');


                            if (arrayVOD.length > 1) {
                                $.each(arrayVOD, function (i, item) {
                                    if (i > 0) {
                                        ul.append(renderItem(item, true));
                                    }
                                });

                                divContainer.append(ul);

                                var initPopover = popover({
                                    'target': elemento,
                                    'content': divContainer,
                                    'trigger': 'manual'
                                });
                                initPopover.show();
                                eventosNavegacao(elemento, initPopover);
                            } else {
                                var divPai = $(elemento).parent();
                                divPai.html('');
                                $("<span>", { tabindex: 0 }).html("Nenhum vídeo/áudio disponível para download.").appendTo(divPai).focus();
                            }

                        } else {

                            var videos = $(e).find("video");

                            if (videos.length > 0) {
                                //var divContainer = $("<div>");
                                //var ul = $("<ul>").addClass("cadastrar-atividade-tipos list-group");

                                $.each(videos, function (i, item) {
                                    ul.append(renderItem(item))
                                });

                                divContainer.append(ul);

                                var initPopover = popover({
                                    'target': elemento,
                                    'content': divContainer,
                                    'trigger': 'manual'
                                });
                                initPopover.show();
                                eventosNavegacao(elemento, initPopover);
                            } else {
                                //var doc = $('<html>').html(e);
                                //var meta = doc.find("meta[http-equiv='refresh']");
                                //if (meta.length > 0)
                                //{
                                //    try{
                                //        var urlMeta = meta.attr('content').split('url=')[1];

                                //        if (urlMeta.length > 0) {
                                //            podeDownload = true;
                                //            this.data = { url: urlMeta }
                                //            App.Helpers.ajaxRequest(this);
                                //        } else {
                                //            podeDownload = false;
                                //        }

                                //    } catch (e) {
                                //        podeDownload = false;
                                //    }
                                    
                                //} else {
                                var divPai = $(elemento).parent();
                                divPai.html('');
                                $("<span>", { tabindex: 0 }).html("Nenhum vídeo/áudio disponível para download.").appendTo(divPai).focus();
                                //}

                                
                            }
                        }
                    },
                    errorCallback: function (e) {
                        App.Helpers.ajaxRequest({
                            url: url,
                            type: 'post',
                            data: { url: fnTrim(urlDownload) },
                            async: false,
                            successCallback: function (e) {
                                var videos = $(e).find("video");

                                if (videos.length > 0) {
                                    var divContainer = $("<div>");
                                    var ul = $("<ul>").addClass("cadastrar-atividade-tipos list-group");

                                    $.each(videos, function (i, item) {
                                        ul.append(renderItem(item))
                                    });

                                    divContainer.append(ul);

                                    var initPopover = popover({
                                        'target': elemento,
                                        'content': divContainer,
                                        'trigger': 'manual'
                                    });
                                    initPopover.show();
                                    eventosNavegacao(elemento, initPopover);
                                } else {
                                    $(elemento).parent().html("<span tabindex='0'>Nenhum vídeo/áudio disponível para download.</span>");
                                    $(elemento).parent().find('span').focus();
                                }

                            },
                            errorCallback: function (e) {
                                $(elemento).parent().html("<span tabindex='0'>Nenhum vídeo/áudio disponível para download.</span>");
                                $(elemento).parent().find('span').focus();
                            }
                        });

                        podeDownload = true;
                    }
                };

                App.Helpers.ajaxRequest(data); 
            }

            if (podeDownload == false) {
                var divPai = $(elemento).parent();
                divPai.html('');
                $("<span>", { tabindex: 0 }).html("Nenhum vídeo/áudio disponível para download.").appendTo(divPai).focus();
            }
        },

        actionButtonClick: function (e) {                        
            
            var $el = $(e.currentTarget);
            if ($el.data("abrirpopup") === 0) return true;
            
            e.preventDefault();

            var self = this,                
                acessoROA = $el.data('urlroa');

            $el.closest('li.uninter-atv-item').addClass('complete');
            
            var html = "";

            if (UNINTER.StorageWrap.getItem('user').popupNovaJanela) {
                html = '.<br> <div class="checkbox"><label><input type="checkbox" value="true" name="naoExibirPopUp" id="naoExibirPopUp"> Não exibir novamente esta mensagem</label></div>';

                App.Helpers.showModal({
                    size: "modal-sm",
                    body: 'Este item será aberto em uma nova aba' + html,
                    title: null,
                    buttons: [{
                        'type': "button",
                        'klass': "btn btn-primary",
                        'text': "Ok",
                        'dismiss': null,
                        'id': 'modal-ok',
                        'onClick': function (event, jQModalElement) {
                            var abrirPopup = !$("#naoExibirPopUp").is(":checked");

                            jQModalElement.modal('hide');
                            window.open(acessoROA, "ava_material").focus();

                            if (UNINTER.StorageWrap.getItem('user').popupNovaJanela && abrirPopup != UNINTER.StorageWrap.getItem('user').popupNovaJanela)
                                self.salvarConfiguracaoPopoupUsuario(abrirPopup);

                            self.actionIcone($el.prop('id').replace('itemAprendizagem_', ''));

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
                window.open(acessoROA, "ava_material").focus();

                self.actionIcone($el.prop('id').replace('itemAprendizagem_', ''));
            }

        },

        uplodImageAtividade: function (e) {
            var $el = $(e.currentTarget);
            $("#unAccordion li.active li.active #tagImgAtv #uploadArquivoViewGenerica input[type='file']").click();
        },

        removeImageAtividade: function (e) {

            //e.stopImmediatePropagation();
            //var $el = $(e.currentTarget);
            var id = $("#unAccordion li.active li.active #tagImgAtv a").attr('data-id')

            UNINTER.Helpers.ajaxRequest({
                url: App.config.UrlWs('atv') + 'AtividadeEtiqueta/' + id + '/Delete',
                type: 'DELETE',
                async: true,
                successCallback: function (data) {
                    
                    $("#tagImgAtv a#tagEditImageAtividade[data-id='" + id + "']").children().prop('src', 'img/imagemApoioRoteiroEstudo.png');
                    $("#tagEditImageAtividade[data-id='" + id + "']").attr('data-id', 0);

                    $("#tagImgAtv[data-id='" + id + "'] div:first a:first").html('inserir');
                    $("#tagImgAtv[data-id='" + id + "'] div:first a:first").attr('data-id', 0);
                    $("#tagImgAtv[data-id='" + id + "'] div:first a:eq(1)").attr('data-id', 0);
                    $("#tagImgAtv[data-id='" + id + "'] div:first a:eq(1)").addClass('hidden');

                    $("#tagImgAtv").attr('data-id', 0);


                },
                errorCallback: function (r) {

                    if (r.status == 500) {
                        App.flashMessage({
                            'body': 'Ocorreu um erro ao executar a operação, tente novamente, caso o erro persista contate o suporte.',
                            'appendTo': '#flashMessageInner'
                        });
                    }

                }
            });

        },
        
        actionButtonInternoClick: function (e) {
            e.preventDefault();
            
            var $el = $(e.currentTarget),
                atvUrl = $el.data('url');

            document.location = atvUrl;
        },        
        accordionParentItemClick: function (e) {
            e.stopImmediatePropagation();
            var $el = $(e.currentTarget);
            if ( !$el.hasClass('active') ) { $('#unAccordion.parent > .un-accordion-item').removeClass('active'); }
            $el.toggleClass('active');
        },

        accordionChildItemClick: function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);            
            if (!$el.hasClass('active')) { $('#unAccordion .child > .un-accordion-item').removeClass('active'); }
            $el.toggleClass('active');
        },

        accordionItemContentClick: function (e) {
            e.stopImmediatePropagation();
        },

        admActions: function (e) {
            e.stopImmediatePropagation();
            var $el = $(e.currentTarget);
            $el.parents('.uninter-atv-theme-item').trigger('click');
        },

        anexoClick: function (e) {

            var $el = $(e.currentTarget),
                idSalaVirtual = this.svId,
                idAtividade = $el.closest('.uninter-atv-item').prop('id'),
                idAnexo = $el.data('idAnexo'),
                currentUrl = document.location.href;

            // Envia ao servidor um log com o histórico de navegação
            /*App.logNavigationHistory({
                'data': {
                    'parametros': {
                        'idSala': idSalaVirtual,
                        'idAtividade': idAtividade,
                        'idItemAprendizagem': idAnexo
                    },
                    'url': currentUrl
                }
            });*/
        },

        goBackClick: function () {
            
            if(App.auth.viewCheckPerms('editar', this.areaPerms))
                jQuery("#actionbar .actions").removeClass("hidden");
            

            this.$el.find('.block-2 #details').empty();
            App.pageLayout('two-columns').set();

            var activeItem = this.slider.getActiveItem();
            this.slider.setActiveItem(activeItem - 1);

            if (this.videoplayer) {
                $('#' + this.videoHolder).remove();
                delete this.videoplayer;
                $("#iframeyoutube").remove();
            }
        },

        template: _.template(template),

        renderAtividades: function () {
            var self = this;
            $.when(atividadesViewLoader.get('AtividadesAccordionView')).done(function (AtividadesView) {
                
                var accordionView = new AtividadesView({
                        'areaPerms': self.areaPerms,
                        'svId': self.svId,
                        'temaId': self.temaId,
                        'atividadeId': self.atividadeId,
                        'idSalaVirtualOferta': self.idSalaVirtualOferta,
                        'idSalaVirtualEstruturaRotuloTipo': self.idSalaVirtualEstruturaRotuloTipo,
                        'urlBuscarEstrutura': self.urlBuscarEstrutura,
                        'contractEstrutura': self.contractEstrutura,
                        'contractAtividade': self.contractAtividade,
                        'nomeCadastrarItem': self.nomeCadastrarItem,
                        'rotinaCadastroAtividade': self.rotinaCadastroAtividade,
                        'rotinaAtividade': self.rotinaAtividade,
                        'idModulo': self.idModulo,
                        'urlEditarAtividade': self.urlEditarAtividade,
                        'urlExcluirAtividade': self.urlExcluirAtividade,
                        'ocultarStatusAtividade': self.ocultarStatusAtividade,
                        'areaPermsAtividade': self.areaPermsAtividade,
                        'urlEditarEstrutura': self.urlEditarEstrutura,
                        'rotinaEstrutura': self.rotinaEstrutura,
                        'urlAposCadastroAtividade': self.urlAposCadastroAtividade,
                        'exibirDetalhesAtividade': self.exibirDetalhesAtividade,
                        'exibirItemInicial': self.exibirItemInicial,
                        'urlBuscarAtividade': self.urlBuscarAtividade
                        
                        
                    }),
                    activitiesBox;

                self.listenTo(accordionView, 'rendered', function () {
                    this.trigger('accordionviewrendered');
                });

                
                activitiesBox = $('<div>', {'class': 'activities-box'}).append(accordionView.$el);
                self.$el.find('#accordionContainer').append(activitiesBox);
            });
        },

        renderMaterialComplementar: function () {
            var self = this, mCView;
            $.when(atividadesViewLoader.get('MaterialComplementarView')).done(function (MaterialComplementarView) {
                App.loadingView.reveal();
                
                mCView = new MaterialComplementarView({ 'areaPerms': self.areaPerms});

                self.listenTo(mCView, 'mccreated', function () {
                    self.renderMaterialComplementar();
                });

                // View Renderizada
                self.listenTo(mCView, 'rendered', function (el) {
                    self.$el.find('#materialComplementarContainer').html(el);
                    App.loadingView.hide();
                });

                
                mCView.render({idSalaVirtual: self.svId, idSalaVirtualOferta: self.idSalaVirtualOferta});
            });
        },       
        renderContainers: function () {
            var progressoContainer = $('<div>', { 'id': 'progressoContainer' }),
                accordionContainer = $('<div>', { 'id': 'accordionContainer' }),
                materialComplementarContainer = $('<div>', {'id': 'materialComplementarContainer'});
            
            if (this.renderizarBtnVoltar) {                
                //this.$el.find('#slidingBlocksContainer .block-1').addClass("inner-holder").append('</div>');
                accordionContainer.html('<a href="#/ava"><i class="icon-arrow-circle-left goBack"></i></a>').addClass('block');
            }
            
            this.$el.find('#slidingBlocksContainer .block-1').append(progressoContainer).append(accordionContainer).append(materialComplementarContainer);
            
        },
        salvarConfiguracaoPopoupUsuario: function(popupNovaJanela){
            App.Helpers.ajaxRequest({
                url: App.config.UrlWs('autenticacao') + "Usuario/0/AtualizarPopup",
                type: 'PUT',
                async: true,
                data:{
                    popupNovaJanela: popupNovaJanela,
                    id: UNINTER.StorageWrap.getItem('user').idUsuario
                },
                successCallback: function (response) {
                    var sessionUser = UNINTER.StorageWrap.getItem('user');
                    sessionUser.popupNovaJanela = popupNovaJanela;
                    UNINTER.StorageWrap.setItem('user', sessionUser);


                },
                errorCallback: function (error) {
                    console.error(error);
                }
            });
        },

        onShow: function () {
            if(this.redirecionarCentralMidia){
                return;
            }
            this.slider = slider;            
            slider.init();
            slider.setActiveItem(1);
            this.renderContainers();
            this.renderAtividades();
            
            if (!this.ocultarMaterialDidatico) {
                this.on('accordionviewrendered', function () {
                    this.renderMaterialComplementar();
                });
            }
        }
    });
});
