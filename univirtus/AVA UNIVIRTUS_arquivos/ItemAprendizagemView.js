define(function (require) {
    'use strict';
    var App = require('app'),
        $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
    config = require('config/AppConfig'),
    itemTemplate = '<div class="item-box-list-item-cell item-box-icon-holder"> <div class="item-box-icon"><i class="<%= icon %>"></i></div> <div class="item-box-icon-legend"><%= nomeTipoAtividade %></div> </div>' +
                '<div class="item-box-list-item-cell item-box-content"></div>' +
                '<% if (cadastrar) { %>' +
                '<div class="item-box-list-item-cell item-box-list-item-actions">' +
                    '<a href="#/ava/SalaVirtualAtividade/<%= idSalaVirtualAtividade %>/editar"><i class="icon-edit"></i></a>' +
                '</div>' +
                '<% } %>',
    Anexos = require('views/common/AnexosView'),
    extensoesOffice = new Array('ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'),
    linkDetalhes = jQuery("<a>").attr('href', 'javascript: void(0)').addClass('link-details-item').html("<i class='icon-info-circle'></i><span>Detalhes</span>"),
    iconeStatusPendencia = jQuery("<span>").attr('title', 'Pendente').addClass('uninter-atv-icon-status pending').html("<span class='sr-only'>Status do item: pendente</span><i class='icon-clock-o'></i>"),
    iconeStatusConcluido = jQuery("<span>").attr('title', 'Concluído').addClass('uninter-atv-icon-status complete').html("<span class='sr-only'>Status do item: completa</span><i class='icon-check'></i>"),
    iconeStatusConcluidoOculto = jQuery("<span>").attr('title', 'Concluído').addClass('uninter-atv-icon-status hidden complete').html("<span class='sr-only'>Status do item: completa</span><i class='icon-check'></i>"),
    /* *
        *** Tipos (atividadeItemAprendizagens.idItemAprendizagemTipo):
        *    - 1: Videoaula
        *    - 2: Leitura
        *    - 3: Discussão
        *    - 4: Exercício
        *    - 5: Rota de aprendizagem
        *    - 6: Documentos Adicionais
        *    - 7: Radio Web
        *    - 8: TV SIANE
        *    - 9: Aula Interativa
        *    - 11: Hyperibook
        *    - 13: Calendário
        *    - 14: Sugestão Filme        
        *
        ***  Comportamentos:
        *    Video: 1, 4, 8, 9
        *    Audio: 7
        *    Link: 3, 4, 5, 10
        *    Anexo: 2, 6
        *
        * */
    idTipoRotuloTranslate = function (id) {
        var type;
        switch (id) {
            case 1:
                type = 'titulo';
                break;            
            case 3:
                type = 'anexo';
                break;
            case 4:
                type = 'video';
                break;            
            case 6:
                type = 'rota';
                break;
            case 7:            
                type = 'link';
                break;
            case 9:
                type = 'hyperibook';
                break;
            case 13: 
                type = 'avaliacao';
                break;
            case 15: 
                type = 'forum';
                break;
            case 32:
                type = 'audio';
                break;
            default:
                type = 'nomearquivo';
                break;
        }

        return type;
    }
      
    return Backbone.View.extend({
        initialize: function (options) {
            
            this.areaPerms = options.areaPerms;
            this.exibirDownload = (options.exibirDownload) ? options.exibirDownload : false;
            this.permiteEditarAtividade = App.auth.viewCheckPerms('editar', this.areaPerms);
            this.popupNovaJanela = UNINTER.StorageWrap.getItem('user').popupNovaJanela;
            this.pendencia = false;
            this.exibirItemInicial = false;
        },
        tagName: 'div',
       
        template: _.template(itemTemplate),
        className: 'item-box-resource item-box-list-item',
        
        render: function (model) {
            
            var self = this;
            
            var itemEtiqueta = {},
                item = [],
                tipo,
                complementar;

            complementar = model.complementar;
            
            _.each(model, function (atividadeItemAprendizagem) {
                tipo = atividadeItemAprendizagem.classificacaoTipo;
                
                var labels;
                _.each(atividadeItemAprendizagem.itemAprendizagemEtiquetas, function (itemEtiqueta) {
                    var obj = {};

                    itemEtiqueta.idTipoRotulo = itemEtiqueta.idTipoRotulo;
                    if (itemEtiqueta.idTipoRotulo === 3) {
                        labels = itemEtiqueta.sistemaRepositorio;
                        
                    } else {                        
                        labels = _.pick(itemEtiqueta, 'nomeTipoRotulo', 'texto', 'idTipoRotulo');                        
                    }
                                                    
                    if (itemEtiqueta.idTipoRotulo === 8) { itemEtiqueta.nomearquivo = itemEtiqueta.nomearquivo; }
                   
                    obj[idTipoRotuloTranslate(itemEtiqueta.idTipoRotulo)] = labels;
                    obj.idItemAprendizagem = itemEtiqueta.idItemAprendizagem
                    obj.cIdItemAprendizagem = encodeURIComponent(itemEtiqueta.cIdItemAprendizagem); //itemEtiqueta.idItemAprendizagem;
                    obj.nomeAcao = atividadeItemAprendizagem.nomeAcao;
                    obj.acessoROA = atividadeItemAprendizagem.acessoROA;
                    obj.pendencia = model.complementar ? true : atividadeItemAprendizagem.pendencia;
                    obj.complementar = model.complementar;
                    obj.conteudoFlash = atividadeItemAprendizagem.itemAprendizagem.conteudoFlash;
                    item.push(obj);
                });
                                
                if (!itemEtiqueta[tipo]) {
                    itemEtiqueta[tipo] = [];
                }
                if (item.length > 0)
                    itemEtiqueta[tipo].push(item);
                
                item = [];
            });
            
            
            self.type = tipo;

            
            var $div = $("<div>");
            var exibirLabelMaterial = false;
            _.each(itemEtiqueta, function (item, tipo) {
                
                switch(tipo){
                    case "arquivo":
                        $div.append(self.renderAnexo(item));
                        break;                    
                    case "rota":
                        var data = [];
                        data.push(item[0]);
                        $div.append(self.renderLink(data));
                        break;
                    case "linkInterno":
                        
                        $div.append(self.renderLinkInterno(item));
                        break;
                    case "linkExterno":
                        $div.append(self.renderLinkExterno(item));
                        break;
                    case "link":
                    default:
                        $div.append(self.renderLink(item));
                        break;
                }
                
                if (tipo == "video" || tipo == "link" || tipo == "arquivo")
                    exibirLabelMaterial = true;
            });
 
            self.exibirLabelMaterial = exibirLabelMaterial;
            self.$el.html($div.html());

            self.setInitialActiveItem()

            return self;
        },
        renderLink : function (data) {

            var linksHolder, links, self = this;

            // Determina se o link tem o protocolo. Se não tiver, concatena-o.
            function linkChecker(link) {
                var lnk = link;
                var hasProtocol = (lnk.search(/http/i) !== -1) ? true : false;
                if (!hasProtocol) {
                    lnk = 'http://' + lnk;
                }
                return lnk;
            }

            if (!data.length) { return '(vazio)'; }

            linksHolder = $('<div>');
            _.each(data, function (item) {
                var divLink = $('<div>').addClass('item-box-resource');
                var link = $('<a>', { 'class': 'uninter-item-action-btn', 'target': '_blank', 'href': 'javascript: void(0);' });

                

                var titulo = null,
                    nomeAcao,
                    idTipoRotulo,
                    exibirDownload = false,
                    acessoROA,
                    pendencia,
                    conteudoFlash;
            
                _.each(item, function (it) {
                    
                    nomeAcao = it.nomeAcao;
                    pendencia = it.pendencia;
                    conteudoFlash = it.conteudoFlash;
                    if (it.link) {
                        link.attr('data-url', linkChecker(it.link.texto));
                        link.html(it.link.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.link.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                    }
                    else if (it.video) {
                        link.attr('data-url', linkChecker(it.video.texto));
                        //link.html(it.video.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.video.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                    }
                    else if (it.hyperibook) {
                        link.attr('data-url', linkChecker(it.hyperibook.texto));
                        //link.html(it.hyperibook.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.hyperibook.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                    }
                    else if (it.audio) {
                        link.attr('data-url', linkChecker(it.audio.texto));
                        link.html(it.audio.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.audio.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                    }
                    else if (it.rota) {                    
                        link.attr('data-url', it.rota.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.rota.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                        exibirDownload = true;
                    }
                    else if (it.titulo) {
                        titulo = it.titulo.texto;
                    }

                    if (!link.prop('id')) {                        
                        link.prop('id', 'itemAprendizagem_' + it.idItemAprendizagem);
                        link.attr('data-ciditemaprendizagem', it.cIdItemAprendizagem);
                        link.data('acessoroa', it.acessoROA);
                    }
                });
                if (titulo) {
                    link.html(titulo);
                }
                if (idTipoRotulo) {
                    link.addClass(idTipoRotulo);
                }
              
                var cidItem = link.data('ciditemaprendizagem');
                var idItem = link.prop('id').replace('itemAprendizagem_', '');
                var url = null;
                
                if (self.permiteEditarAtividade == false) {
                    url = UNINTER.Helpers.montarUrlRoa(idItem, link.data('acessoroa'), self.permiteEditarAtividade);
                }
                else {
                    url = App.Helpers.montarUrlRoa(cidItem, link.data('acessoroa'), self.permiteEditarAtividade);
                }
               

                //link.attr("href", 'javascript: window.open(' + url + ', "ava_material_' + UNINTER.StorageWrap.getItem("user").token + '").focus();');
                link.attr({
                    'data-urlroa': url,
                    'data-abrirpopup': self.popupNovaJanela,
                    "href": (self.popupNovaJanela) ? "javascript: void(0)" : url,
                    "target": "ava_material"
                });

                var tempPath = '';
                if (link.attr('data-url')) {
                    tempPath = link.attr('data-url').split("/");
                    if (tempPath.indexOf("vod.grupouninter.com.br") > -1) {
                        exibirDownload = true;
                    }
                
                    link.append('<button class="btn btn-primary btn-sm">' + nomeAcao + '</button>');
                    var linkD = linkDetalhes.clone();
                    linkD.prop('id', 'detalhes' + link.prop('id'));

                    divLink.html(link).append(linkD);
                    
                    if (conteudoFlash && self.permiteEditarAtividade) {
                        divLink.append('<span class="label label-danger" style="margin-left:5px;">flash</span>');
                    }

                    if (UNINTER.StorageWrap.getItem("leftSidebarItemView") && UNINTER.StorageWrap.getItem("leftSidebarItemView").usuarioInscrito) {
                        if (pendencia == false) {
                            var linkS = iconeStatusConcluido.clone();
                            linkS.prop('id', 'status' + link.prop('id'));
                            divLink.append(linkS);
                            // linkS.append('<span class="">Última atividade acessada</span>');
                        } else {
                            var linkS = iconeStatusConcluidoOculto.clone();
                            linkS.prop('id', 'status' + link.prop('id'));
                            divLink.append(linkS);
                        }
                    } 
                    
                    
                    if (exibirDownload) {
                        divLink.append('<span class="pull-right lnk-download"><span><i class="icon-download"></i> </span> <a href="javascript:void(0)" data-toggle="popover" class="" data-tipo="video"><span>vídeos</span></a> | <a href="javascript:void(0)" data-toggle="popover" class="" data-tipo="videolibras"><span>vídeos (libras)</span></a>| <a href="javascript:void(0)" data-toggle="popover" class="" data-tipo="audio"><span>áudios</span></a></span>');
                    }
                    linksHolder.append(divLink);
                    link = null;
               } 
           
            });

            return linksHolder.html();
        },
        renderLinkExterno : function (data) {

            var linksHolder, links, self = this;

            // Determina se o link tem o protocolo. Se não tiver, concatena-o.
            function linkChecker(link) {
                var lnk = link;
                if (lnk) {
                    var hasProtocol = (lnk.search(/http/i) !== -1) ? true : false;
                    if (!hasProtocol) {
                        lnk = 'http://' + lnk;
                    }
                }
                return lnk;
            }

            if (!data.length) { return '(vazio)'; }

            linksHolder = $('<div>');
            _.each(data, function (item) {
                var divLink = $('<div>').addClass('item-box-resource');
                var link = $('<a>', { 'class': 'uninter-item-action-btn', 'target': '_blank', 'href': 'javascript: void(0);' });

                var titulo = null,
                    nomeAcao,
                    idTipoRotulo,
                    exibirDownload = false,
                    acessoROA;
            
                _.each(item, function (it) {
                    
                    nomeAcao = it.nomeAcao;
                    if (it.link) {
                        link.attr('data-url', linkChecker(it.link.texto));
                        link.html(it.link.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.link.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                    }
                    else if (it.video) {
                        link.attr('data-url', linkChecker(it.video.texto));
                        link.html(it.video.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.video.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                    }
                    else if (it.hyperibook) {
                        link.attr('data-url', linkChecker(it.hyperibook.texto));
                        link.html(it.hyperibook.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.hyperibook.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                    }
                    else if (it.audio) {
                        link.attr('data-url', linkChecker(it.audio.texto));
                        link.html(it.audio.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.audio.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                    }
                    else if (it.rota) {                    
                        link.attr('data-url', it.rota.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.rota.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                        exibirDownload = true;
                    }
                    else if (it.titulo) {
                        titulo = it.titulo.texto;
                    }

                    if (!link.prop('id')) {
                        link.prop('id', 'itemAprendizagem_' + it.idItemAprendizagem);                        
                    }
                });
                console.log(link.attr('data-url'));
                if (titulo) {
                    link.html(titulo);
                }
                if (idTipoRotulo) {
                    link.addClass(idTipoRotulo);
                }

                var url = link.attr('data-url');
                
                link.attr({
                    'data-urlroa': url,
                    'data-abrirpopup': self.popupNovaJanela,
                    "href": (self.popupNovaJanela) ? "javascript: void(0)" : url,
                    "target": "ava_material"
                });

                var tempPath = '';
                if (link.attr('data-url')) {
                    tempPath = link.attr('data-url').split("/");
                    if (tempPath.indexOf("vod.grupouninter.com.br") > -1) {
                        exibirDownload = true;
                    }
                
                    link.append('<button class="btn btn-primary btn-sm"><i class="icon-arrow-circle-o-right"></i>' + nomeAcao + '</button>');
                    var linkD = linkDetalhes.clone();
                    linkD.prop('id', 'detalhes' + link.prop('id'));
                    divLink.html(link).append(linkD);
                    if (exibirDownload) {
                        divLink.append('<span class="pull-right lnk-download"><span><i class="icon-download"></i> </span><a href="javascript:void(0)" data-toggle="popover" class="" data-tipo="video"><span>vídeos</span></a>| <a href="javascript:void(0)" data-toggle="popover" class="" data-tipo="audio"><span>áudios</span></a></span>');
                    }
                    linksHolder.append(divLink);
                    link = null;
                } 
           
            });

            return linksHolder.html();
        },
        
        renderLinkInterno : function (data) {
            var linksHolder, links, nomeAcao, idTipoRotulo;

            // Determina se o link tem o protocolo. Se não tiver, concatena-o.
            
            if (!data.length) { return '(vazio)'; }

            linksHolder = $('<div>');
            _.each(data, function (item) {
                var divLink = $('<div>').addClass('item-box-resource');
                var link = $('<a>', { 'class': 'uninter-item-action-btn-interno', 'target': '_blank', 'href': 'javascript: void(0);' });
               
           
                _.each(item, function (it) {
                    nomeAcao = it.nomeAcao;
                    
                    if (it.link) {
                        link.attr('data-url', it.link.texto);
                        link.html(it.link.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.link.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                    }                    
                    else if (it.forum) {
                        link.attr('data-url', it.forum.texto);
                        link.html(it.forum.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.forum.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                    }
                    else if (it.avaliacao) {
                        link.attr('data-url', it.avaliacao.texto);
                        link.html(it.avaliacao.texto);
                        idTipoRotulo = idTipoRotuloTranslate(it.avaliacao.idTipoRotulo);
                        link.attr('data-type', idTipoRotulo);
                    }
                    
                    if (!link.prop('id')) {
                        link.prop('id', 'itemAprendizagem_' + it.idItemAprendizagem);

                    }
                });
                
                if (idTipoRotulo) {
                    link.addClass(idTipoRotulo);
                }
                link.html('<button class="btn btn-primary btn-sm">' + nomeAcao + '</button>');

                var linkD = linkDetalhes.clone();
                linkD.prop('id', 'detalhes' + link.prop('id'));
                divLink.html(link).append(linkD);
                linksHolder.append(divLink);
                link = null;
            });

            return linksHolder.html();
        } ,
        renderAnexo : function (data) {
            
            var docs, rendered, arr = [], collection, Collection = Backbone.Collection.extend({ model: Backbone.Model.extend({}) });
            var self = this;
       
            _.each(data, function (item) {
                
                var obj = {};
                var titulo,
                    descricao,
                    acessoROA;
                
                _.each(item, function (it) {
                    
                    // Arquivos do tipo link                        
                    if (it.nomearquivo) { obj.nome = it.nomearquivo.texto; }
                    else if (it.link) { obj.url = it.link.texto; }
                        // Arquivos de repositório
                    else if (it.anexo) {                        
                        obj = it.anexo;
                        obj.isRepo = !it.anexo.externo;
                   
                        if (!titulo)
                            titulo = it.anexo.nome;
                    }
                    else if (it.titulo) {
                        titulo = it.titulo.texto;
                    }
                    else if (it.descricao) {
                        descricao = it.descricao.texto;
                    }
                    obj.cId = it.cIdItemAprendizagem;
                    obj.id =  it.idItemAprendizagem;
                    obj.acessoROA = it.acessoROA;
                    obj.pendencia = it.pendencia;
                    obj.complementar = it.complementar == true ? true : false;
                });
                obj.titulo = titulo;
                obj.descricao = descricao;           
                obj.data = { "type": "anexo" , "acessoroa": obj.acessoROA ,"cid":obj.cId };
                obj.id = "itemAprendizagem_" + obj.id;
                
                //obj.nomeAcao = 'baixar';
                arr.push(obj);

            });
            
            collection = new Collection(arr);       
            docs = new Anexos({ 'collection': collection, 'totalAnexos': collection.models.length, 'lista': true,  verificarAbrir: true});
            rendered = docs.render().$el;
            
       
       
            rendered.find('.anexos-item').each(function () {
                
                var linkD = linkDetalhes.clone();
                var elementoExibir = $(this).find('.anexos-item-holder');
                var idItem = elementoExibir.prop('id').replace('itemAprendizagem_', '');
                var cIdItem = elementoExibir.data('cid');
                var acessoROA = elementoExibir.data('acessoroa');
                
           
                linkD.prop('id', 'detalhesitemAprendizagem_' + idItem);
                $(this).append(linkD);

                var elemento = $(this);

                if (UNINTER.StorageWrap.getItem("leftSidebarItemView") && UNINTER.StorageWrap.getItem("leftSidebarItemView").usuarioInscrito) {
                    
                    _.each(arr, function (item, key) {

                        if (!item.complementar) {
                            var idItemEach = item.id.replace('itemAprendizagem_', '');

                            if (idItemEach == idItem) {
                                if (item.pendencia == false) {
                                    var linkS = iconeStatusConcluido.clone();
                                    linkS.prop('id', 'status' + elementoExibir.prop('id'));
                                    
                                    elemento.append(linkS);
                                } else {
                                    var linkS = iconeStatusConcluidoOculto.clone();
                                    linkS.prop('id', 'status' + elementoExibir.prop('id'));
                                    
                                    elemento.append(linkS);
                                }
                                
                            } 
                        }
                        
                    });

                    
                }

           
             
                var url; 

                if (self.permiteEditarAtividade == false) {
                    url = App.Helpers.montarUrlRoa(idItem, acessoROA, self.permiteEditarAtividade);
                }
                else {
                    url = App.Helpers.montarUrlRoa(cIdItem, acessoROA, self.permiteEditarAtividade);
                }

                

                elementoExibir.attr({
                    'data-urlroa': url,
                    'data-url': elementoExibir.attr('href'),
                    'data-abrirpopup': self.popupNovaJanela,
                    "href": (self.popupNovaJanela) ? "javascript: void(0)" : url,
                    "target": "ava_material" 
                }).addClass("uninter-item-action-btn");
                           
                
            });
            
            return rendered;
        },
        setInitialActiveItem: function () {

            //$('.un-accordion.child .un-accordion-item .uninter-atv-header:first-child').trigger('click');

        }
    });
    
});