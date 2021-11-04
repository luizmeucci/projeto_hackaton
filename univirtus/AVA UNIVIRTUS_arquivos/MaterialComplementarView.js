/* ==========================================================================
 Material Complementar ItemView
 @author: Thyago Weber (thyago.weber@gmail.com)
 @date: 18/06/2014
 ========================================================================== */
define(function (require) {
    'use strict';
    var App = require('app'),
        $ = require('jquery'),
        _ = require('underscore'),

        Backbone = require('backbone'),
        Marionette = require('marionette'),
        Collection = Backbone.Collection.extend({
            model: Backbone.Model.extend({})
        }),

        libraryLoader = new App.LazyLoader('libraries'),

        atividadesViewLoader = new App.LazyLoader('views/ava/Atividades'),
        CadastrarAtividadeItemView = null,
        popover = null,
        idSalaVirtualEstrutura = null,
        _idSalaVirtualEstruturaRotulo = 18,
        executouEvento = false,

        template = '<h3 class="mc-box-title">' +
            '<%= mcBoxTitle %> <span class="caret"></span>' +
            '<% if (cadastrar) { %>' +
                '<span class="mc-box-adm-actions">' +
                    '<a data-toggle="popover" class="mc-box-adm-actions-add" href="javascript: void(0)"><i class="icon-plus-circle"></i><%= cadastrarTitle %></a>' +
                '</span>' +
            '<% } %>' +
            '</h3>' +
            '<div class="mc-box-content-holder"><ul class="mc-box-list"></ul></div>',

        
        itemTemplate = '<div class="mc-box-list-item-cell mc-box-icon-holder"> <div class="mc-box-icon">' +
                            '<% if ( exibirIconeExclusiva ) { %>' +
                                '<span  title="atividade da oferta mestre" class="badge-master badge bg-danger">M</span>' +
                            '<% } %>' +
                            '<i class="<%= icon %>"></i></div> <div class="mc-box-icon-legend"><%= nomeTipoAtividade %></div>' +                    
                        '</div>' +
                        '<div class="mc-box-list-item-cell mc-box-content"></div>' +                
                        '<div class="mc-box-list-item-cell mc-box-list-item-actions">' +
                            '<% if (cadastrar) { %>' +                
                                '<a href="#/ava/SalaVirtualAtividade/<%= idSalaVirtualAtividade %>/editar"><i class="icon-edit"></i></a>' +                
                            '<% } %>' +                    
                        '</div>',
        
        
        MCItem = Backbone.View.extend({
            initialize: function (options) {                
                this.areaPerms = options.areaPerms;                
                this.idSalaVirtualOferta = options.idSalaVirtualOferta;
            },
            tagName: 'li',
            template: _.template(itemTemplate),
            className: 'mc-box-list-item',
            render: function (model) {
                
                var self = this;
                $.when(atividadesViewLoader.get('ItemAprendizagemView')).done(function (ItemAprendizagemView) {                    
                               
                    var mcItem = new ItemAprendizagemView({ 'areaPerms': self.areaPerms});
                    var mcItemEl = mcItem.render(model.itens).$el;
                    
                    var editarAtividade = App.auth.viewCheckPerms('cadastrar', self.areaPerms),
                        exibirIconeExclusiva = false;
                    
                    var totalFilhas = 0;
                    try{
                        totalFilhas = App.StorageWrap.getItem("leftSidebarItemView").totalFilhas
                    }catch(e){}

                    if (editarAtividade && (model.atividadeOfertaMaster || (totalFilhas > 0 && !model.exclusiva)))
                        exibirIconeExclusiva = true;

                    if (model.atividadeOfertaMaster)
                        editarAtividade = null;
                    
                    
                    

                    var type = mcItem.type,
                    
                    compiledTemplate = self.template({
                        icon: model.icone,
                        content: mcItemEl,
                        nomeTipoAtividade: model.nomeTipoAtividade,
                        idSalaVirtualAtividade: model.idSalaVirtualAtividade,
                        idSalaVirtualEstrutura: model.idSalaVirtualEstrutura,
                        exclusiva: model.exclusiva,
                        cadastrar: editarAtividade,
                        idAtividadeTipo: model.idAtividadeTipo,
                        exibirIconeExclusiva: exibirIconeExclusiva
                    });
                    
                    self.$el
                        .addClass('mc-box-list-item-' + type )
                        .append(compiledTemplate)
                        .find('.mc-box-content')
                        .html(mcItemEl);

                    if (model.atividadeOfertaMaster) {
                        self.$el.addClass('atividadeOfertaMaster');
                    }
                });
                

                return this;
            }
        })
        /*,MC =  Backbone.View.extend({
            initialize: function (options) {
                this.areaPerms = options.areaPerms;
                
                this.idSalaVirtualOferta = options.idSalaVirtualOferta;
            },
            tagName: 'ul',
            className: 'mc-box-list',
            addOne: function (model) {
                var m = model.toJSON(),
                    
                mcItem = new MCItem({ 'areaPerms': this.areaPerms, idSalaVirtualOferta: this.idSalaVirtualOferta }),
                mcItemEl = mcItem.render(m).$el;  \              
                
                
                this.$el.append(mcItemEl);
            },
            render: function () {                
                //this.collection.each(this.addOne, this);
                return this;
            }
        });*/

    return Backbone.View.extend({
        initialize: function (options) {
            this.perms = options.areaPerms;
            this.idSalaVirtualOfertaPai = null;
            this.idSalaVirtualOfertaAproveitamento = null;
            try {
                this.idSalaVirtualOfertaPai = (App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaPai) ? App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaPai : null;
            } catch (e) {};
            try{
                this.idSalaVirtualOfertaAproveitamento = (App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaAproveitamento) ? App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaAproveitamento : null;
            } catch (e) {};
        },
        className: 'mc-box mc-box-atividades mc-box-open',
        template: _.template(template),
        events: {
            /*'click .mc-box-list-item-video .mc-box-content a': 'videoHandler',
            'click .mc-box-list-item-link .mc-box-content a': 'linkHandler',*/
            'click .mc-box-title': 'boxTitleHandler',
            'click .mc-box-adm-actions-add': 'addClickHandler',
            'click .mc-box-adm-actions': 'stopClickPropagation',
            'click .mc-box-title.mc-box-title-add': 'addMC'
        },
        addMC: function (e) {
            var self = this;
            App.Helpers.ajaxRequest({
                async: true,
                type: 'POST',
                url: App.config.UrlWs('ava') + 'SalaVirtualEstrutura',
                data: {
                    'cIdSalaVirtual': this.idSalaVirtual,
                    'idSalaVirtualEstruturaRotulo': _idSalaVirtualEstruturaRotulo
                },
                successCallback: function (r) {
                    self.trigger('mccreated');
                }
            });
        },
        // Limita a propagação para evitar a abertura do material complementar.
        // Evita também que o evento de click se propague até a tag html, fechando assim o popover.
        stopClickPropagation: function (e) {
            e.stopPropagation();
        },
        addClickHandler: function (e) {
            var $el = $(e.currentTarget);
//            this.$el.data('active-item', $el.closest('.mc-box').attr('id'));
            $('#slidingBlocksHolder').data('active-item', $el.closest('.mc-box').attr('id'));
        },
        // Abre e fecha o material complementar
        boxTitleHandler: function (e) {
            var $el = $(e.currentTarget);
            $el.closest('.mc-box').toggleClass('mc-box-open');
        },
        /*
        videoHandler: function (e) {
            var $el = $(e.currentTarget),
                videoUrl = $el.data('url');
            this.trigger('showvideo', videoUrl);
        },
        linkHandler: function (e) {
            e.preventDefault();
            var $el = $(e.currentTarget),
                url = $el.attr('href');

            this.trigger('openlink', url);
        },*/
        fetchDataEstrutura: function () {
            var self = this;

            if (!self.idSalaVirtual) { throw new Error('idSalaVirtual nulo ou indefinido'); }


            var url = null;

            if (!isNaN(self.idSalaVirtual)) {
                url = App.config.UrlWs('ava') + 'SalaVirtualEstrutura/' + self.idSalaVirtual + '/TipoOferta/2/?idSalaVirtualOferta=' + self.idSalaVirtualOferta + "&idSalaVirtualOfertaPai=" + self.idSalaVirtualOfertaPai + "&idSalaVirtualOfertaAproveitamento=" + self.idSalaVirtualOfertaAproveitamento;
            }
            else {
                url = App.config.UrlWs('ava') + 'SalaVirtualEstrutura/0/TipoOfertaCriptografado/2/?id=' + encodeURIComponent(self.idSalaVirtual) + '&idSalaVirtualOferta=' + self.idSalaVirtualOferta + "&idSalaVirtualOfertaPai=" + self.idSalaVirtualOfertaPai + "&idSalaVirtualOfertaAproveitamento=" + self.idSalaVirtualOfertaAproveitamento;
            }


            // Faz a requisição de material complementar
            App.Helpers.ajaxRequest({
                url: url,
                async: true,
                successCallback: function (response) {
                    idSalaVirtualEstrutura = response.salaVirtualEstruturas[0].id;
                    self.$el.attr('id', idSalaVirtualEstrutura);
                    self.$el
                        .find('.mc-box-wrapper')
                        .append(self.template({ mcBoxTitle: 'Material Complementar', cadastrarTitle: 'Material', 'cadastrar': App.auth.viewCheckPerms('cadastrar', self.perms) }));
                    
                    var linkCadastrar = self.$el.find('.mc-box-adm-actions');

                    var cadastrarAtividadeItemView;
                    // Instância da view de cadastro de novo item
                    if (App.auth.viewCheckPerms('cadastrar', self.perms)) {
                        cadastrarAtividadeItemView = new CadastrarAtividadeItemView({
                            'idSalaVirtualEstruturaRotuloTipo': 2,
                            'idSalaVirtualEstrutura': idSalaVirtualEstrutura,
                            'idSalaVirtual': self.idSalaVirtual,
                            'idSalaVirtualOferta': self.idSalaVirtualOferta
                        });

                        cadastrarAtividadeItemView.render();
                    }

                    if (linkCadastrar.length) {
                        // Executar popover somente após os dados tiverem sido processados
                        cadastrarAtividadeItemView.on('rendered', function () {
                            
                            var el = cadastrarAtividadeItemView.$el;
                            popover({ 'target': linkCadastrar, 'content': el });
                        });
                    }

                    self.fetchDataAtividade(response.salaVirtualEstruturas);
                },
                errorCallback: function (response) {
                    if (response.status === 404) {
                        self.$el.addClass('mc-box-empty');
                        var linkCadastrar = '<div class="mc-box-title mc-box-title-add"><i class="icon-plus-circle"></i> Material Complementar</div>';
                        self.$el.find('.mc-box-wrapper').html(linkCadastrar);

                        self.trigger('rendered', self.$el);
                    }
                }

            });
        },
        fetchDataAtividade: function (salaVirtualEstruturas) {
            var self = this;
            var permiteEditarAtividade = App.auth.viewCheckPerms('editar', self.perms);

            var paramEditar = (permiteEditarAtividade) ? '&editar=true' : '';
            var contator = 0;
            try{
                var paramItemAprendizagem = (self.idSalaVirtualOfertaAproveitamento > 0 || self.idSalaVirtualOfertaPai > 0 || App.StorageWrap.getItem("leftSidebarItemView").totalFilhas > 0) ? '&buscarItemAprendizagem=true' : '';
            }
            catch (e) { var paramItemAprendizagem = ''; }
            
            _.each(salaVirtualEstruturas, function (salaVirtualEstrutura, key) {
                idSalaVirtualEstrutura = salaVirtualEstrutura.id;
                
                // Faz a requisição da estrutura
                App.Helpers.ajaxRequest({
                    url: App.config.UrlWs('ava') + 'SalaVirtualAtividade/' + idSalaVirtualEstrutura + '/EstruturaOferta/' + self.idSalaVirtualOferta + "?idSalaVirtualOfertaPai=" + self.idSalaVirtualOfertaPai + "&idSalaVirtualOfertaAproveitamento=" + self.idSalaVirtualOfertaAproveitamento + paramEditar + paramItemAprendizagem + "&ocultarAtividadeSemItem=true",
                    async: true,
                    successCallback: function (resp) {
                        // Há materiais complementares. Mostrar opção para cadastro de novo item.
                        //var mcView = new MC({ 'areaPerms': self.perms, idSalaVirtualOferta: self.idSalaVirtualOferta }),
                        //mcEl = mcView.render().$el;

                        
                        //.find('.mc-box-content-holder')
                        //.html(mcEl);

                        contator += 1;

                        self.fetchDataItem(resp.salaVirtualAtividades);

                        if (!executouEvento) {
                            self.trigger('rendered', self.$el);

                            executouEvento = true;
                        }

                        if (salaVirtualEstruturas.length == contator)
                            executouEvento = false;

                    },
                    errorCallback: function (response) {
                        if (response.status === 404) {
                            // Não há materiais a listar. Mostrar botão de cadastro.

                            contator += 1;

                            if (!executouEvento) {
                                self.trigger('rendered', self.$el);

                                executouEvento = true;
                            }

                            if (salaVirtualEstruturas.length == contator)
                                executouEvento = false;
                            
                        }
                    }
                });
            });

               
            
            //self.trigger('datafetched', data);
        }, 

        fetchDataItem: function (salaVirtualAtividades) {
            var self = this;
            _.each(salaVirtualAtividades, function (salaVirtualAtividade) {
                
                if (salaVirtualAtividade.atividadeItemAprendizagens) {
                    var materialComplementarItem = {};                
                    materialComplementarItem.icone = salaVirtualAtividade.icone;
                    materialComplementarItem.nomeTipoAtividade = salaVirtualAtividade.nomeTipoAtividade;
                    materialComplementarItem.idSalaVirtualAtividade = salaVirtualAtividade.id;
                    materialComplementarItem.idSalaVirtualEstrutura = salaVirtualAtividade.idSalaVirtualEstrutura;
                    materialComplementarItem.idAtividadeTipo = salaVirtualAtividade.idAtividadeTipo;
                    materialComplementarItem.idSalaVirtualOferta = salaVirtualAtividade.idSalaVirtualOferta;
                    materialComplementarItem.exclusiva = salaVirtualAtividade.exclusiva;
                    materialComplementarItem.atividadeOfertaMaster = salaVirtualAtividade.atividadeOfertaMaster;
                    materialComplementarItem.itens = [];
                    materialComplementarItem.itens = salaVirtualAtividade.atividadeItemAprendizagens;
                    materialComplementarItem.complementar = true;

                    self.trigger('datafetched', materialComplementarItem);
                }
                else if (salaVirtualAtividade.idAtividade > 0) {
                    // Faz a requisição do item de aprendizagem
                    App.Helpers.ajaxRequest({
                        url: App.config.UrlWs('atv') + 'AtividadeItemAprendizagem/' + salaVirtualAtividade.idAtividade + '/atividade?complementar=true',
                        async: true,
                        successCallback: function (r) {
                            var materialComplementarItem = {};                
                            materialComplementarItem.icone = salaVirtualAtividade.icone;
                            materialComplementarItem.nomeTipoAtividade = salaVirtualAtividade.nomeTipoAtividade;
                            materialComplementarItem.idSalaVirtualAtividade = salaVirtualAtividade.id;
                            materialComplementarItem.idSalaVirtualEstrutura = salaVirtualAtividade.idSalaVirtualEstrutura;
                            materialComplementarItem.idAtividadeTipo = salaVirtualAtividade.idAtividadeTipo;
                            materialComplementarItem.idSalaVirtualOferta = salaVirtualAtividade.idSalaVirtualOferta;
                            materialComplementarItem.exclusiva = salaVirtualAtividade.exclusiva;
                            materialComplementarItem.atividadeOfertaMaster = salaVirtualAtividade.atividadeOfertaMaster;
                            
                            materialComplementarItem.itens = r.atividadeItemAprendizagens;

                            materialComplementarItem.itens.complementar = true;
                            
                            self.trigger('datafetched', materialComplementarItem);
                        }
                    });
                }
                
                materialComplementarItem = {};
            });
        },
        render: function (options) {
            var self = this, linkCadastrar, mcBoxWrapper = $('<div>', {'class': 'mc-box-wrapper'});

            self.idSalaVirtualOferta = options.idSalaVirtualOferta;
            self.idSalaVirtual = options.idSalaVirtual;
            this.$el.html(mcBoxWrapper);

            $.when(
                libraryLoader.get('popover'),
                atividadesViewLoader.get('CadastrarAtividadeItemView')
            ).done(function (_popover, _CadastrarAtividadeItemView) {
                CadastrarAtividadeItemView = _CadastrarAtividadeItemView;
                popover = _popover;
                self.on('datafetched', function dataFetchedHandler(data) {
                    
                    if(idSalaVirtualEstrutura)
                        self.$el.attr('id', idSalaVirtualEstrutura);
                    
                    if (data) {                        
                        var collection = new Collection(data),
                        mcItem = new MCItem({ 'areaPerms': self.perms, idSalaVirtualOferta: self.idSalaVirtualOferta }),
                        mcItemEl = mcItem.render(data).$el;               
                        
                        self.$el                            
                            .find('.mc-box-list')
                            .append(mcItemEl);
                    }
                });
                self.fetchDataEstrutura();

                return this;
            });
        }
    });
});