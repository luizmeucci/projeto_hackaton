/* ==========================================================================
   Anexos View
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 29/04/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var $ = require('jquery'),
		_ = require('underscore'),		
        Backbone = require('backbone'),
        config = require('config/AppConfig'),
		App = require('app');
		
	function fileExt( filename, ext ) {
        var xt,
            extension;

        if ( !filename && !ext ) {
            App.logger.warn('Arquivo sem nome e extensão');
        }

        if ( filename || ext ) {
            xt = ext || filename.split('.').reverse()[0];
        }

		switch (xt) {
			// Texto
			case 'txt':
				extension = 'txt';
				break;
			// Imagem
			case 'png':
			case 'jpg':
			case 'jpeg':
			case 'gif':
				extension = 'image';
				break;

			// Video
			case 'avi':
			case 'mp4':
			case 'mpeg':
			case 'rmvb':
			case 'webm':
				extension = 'video';
				break;

			// Word
			case 'doc':
			case 'docx':
				extension = 'doc';
				break;

			// Excel
			case 'xls':
			case 'xlsx':
				extension = 'xls';
				break;

			// PowerPoint
			case 'ppt':
			case 'pptx':
				extension = 'ppt';
				break;

			// PDF
			case 'pdf':
				extension = 'pdf';
				break;

			// Writer (equivalente ao Word)
			case 'odt':
			case 'fodt':
			case 'ott':
				extension = 'odt';
				break;

			// Calc (equivalente ao Excel)
			case 'ods':
			case 'fods':
			case 'ots':
				extension = 'ods';
				break;

			// Impress (equivalente ao PowerPoint)
			case 'odp':
			case 'fodp':
				extension = 'odp';
				break;

			// Audio
			case 'mp3':
			case 'wma':
			case 'wav':
				extension = 'audio';
				break;

			// Comprimidos
			case 'rar':
			case 'zip':
				extension = 'zip';
				break;

			default:
			    extension = 'generic';
			    break;
        }
		
		return extension;
	}
    
	var fileIcons = {
		doc: 'icon-doc',
		xls: 'icon-xls',
		odt: 'icon-writer',
		ods: 'icon-calc',
		odp: 'icon-impress',
		pdf: 'icon-pdf',
		ppt: 'icon-ppt',
		zip: 'icon-zip',
		image: 'icon-img',
		video: 'icon-video',
		audio: 'icon-audio',
		txt: 'icon-txt',
		generic: 'icon-file-o'
	};

	var anexoTemplate = [
		'<header class="anexos-filename"><%= filename %></header>',
		'<section class="anexos-icon"><i class="<%= icon %>"></i></section>',
		'<footer class="anexos-options"><%= option %></footer>'
	].join('');
	var anexoTemplateLista = [
        '<section class="anexos-icon"><i class="<%= icon %>"></i></section>',
        '<span class="anexos-filename"><%= filename %></span>'
        
    ].join('');
	

	var totalAnexosTemplate = [
		'<div class="anexos-total"><%= total %></div>'
	].join('');

	var filename = null;
	var title = null;
	var AnexoView = Backbone.View.extend({
		className: 'anexos-item',
		tagName: 'li',
				
        initialize: function (options) {		
			this.template = options.lista ? _.template(anexoTemplateLista) : _.template(anexoTemplate);
			
			this.novaJanela = (options.novaJanela) ? options.novaJanela : false;
			this.tipoNovaJanela = (options.tipoNovaJanela) ? options.tipoNovaJanela : [];
		    
		},
		
		
        render: function (model) {
		    var self = this;
		    filename = model.nome;
		    
		    var title = filename;
		    var exibirWeb = model.exibirWeb || false;
		    
		    if (model.titulo != null) {
		        title = model.titulo;
		        filename = model.titulo;
		    }
		    
		    var xt = fileExt(filename, model.extensao),
				nomeAcao = model.nomeAcao || 'Download',
				extension = xt || 'generic',
				data = {
				    'filename': filename,
				    'icon': fileIcons[xt],
                    'option': extension == 'audio' ? '' : '<i class="icon-download"></i> ' + model.nomeAcao

				},
				compiled = this.template(data),
				anexosHolder = $('<a>', {
				    'class': 'anexos-item-holder',
				    'target': '_blank'
				}),
                isRepo = model.isRepo;
			    
            if (extension == 'audio') {
                anexosHolder = $('<audio>', { class: 'audio-player item-box-audio-player anexos-item-holder', preload: 'none' }).prop('controls', true);
            }
			if (model.id) {
			    anexosHolder.attr('id', model.id);
            }

            exibirWeb = false;
			if (exibirWeb) {
			    anexosHolder.attr('data-exibir-web', exibirWeb);
			}
			
			var url = model.url;
			
			if (isRepo) {
			    url = config.UrlWs('repositorio') + 'SistemaRepositorioPublico?id=' + url;				
			}

			var urlDownload = (model.urlDownload) ? model.urlDownload : url;


            anexosHolder.attr((extension == 'audio') ? 'src' : 'href', url);
            anexosHolder.attr('data-extensao', extension);


           

            if (extension !== 'audio') {
                anexosHolder.append(compiled);
            }




			if(!model.nomeAcao) model.nomeAcao = "";

			var novaJanela = false;
			
			if(self.novaJanela && model.id && self.tipoNovaJanela){
				try{

					if(self.tipoNovaJanela.indexOf(extension) > -1)
						novaJanela = true;
				}catch(e){}	
			}
			if(novaJanela){
				// pega model.id que deve ser o id do sistemaRepositorio e abre em nova janela usando o SistemaRepositorioPublicoLista.js
				anexosHolder.attr('href', "javascript:void(0)");
				anexosHolder.off("click").on("click", function(){
					UNINTER.viewGenerica.novaJanela("ava/SistemaRepositorioPublico/"+ model.id +"/lista/" + extension , null); 
				});		
			}
            	
			var aDownload = $('<a>', {
			    'class': 'link-download-item',
			    'target': '_blank'}).html('<span class="anexos-options link-item-action"><i class="icon-download"></i> ' + model.nomeAcao + '</span>').attr('href', urlDownload);

			
			if (model.data) {			
			    $.each(model.data, function (k, item) {
			        
			        anexosHolder.attr('data-'+ k, item);
			    });
			}
			
            if (extension !== 'audio') {
                self.$el
                    .addClass(extension)
                    .attr('title', title)
                    .append(anexosHolder)
                    .append(aDownload);
            } else {
                self.$el
                    .addClass(extension)
                    .attr('title', title)
                    .append(anexosHolder);
            }


			return this;
		}
		
	});

	var AnexosThumbnails = Backbone.View.extend({ 
	    tagName: 'ul',
	    
		initialize: function (options) {		    
		    this.lista = options.lista;
		    this.className = options.lista ? 'anexos-list' : 'anexos-thumbnails';
			
			this.novaJanela = (options.novaJanela) ? options.novaJanela : false;
			this.tipoNovaJanela = (options.tipoNovaJanela) ? options.tipoNovaJanela : [];
		},
		
		addOne: function (model) {		    
		    var view = new AnexoView({ lista: this.lista, 'novaJanela': this.novaJanela, 'tipoNovaJanela': this.tipoNovaJanela});
		    this.$el.addClass(this.className);
		    this.$el.append(view.render(model).$el);
		    
		},
		totalAnexos: function () {
			var anexosTotal = $('<div>', {'class': this.countAnexos});
		},
		render: function () {
		    this.collection.each(function (m) {
		        
				this.addOne(m.toJSON());
		    }, this);

			return this;
		}
	});


	return Backbone.View.extend({	    
		initialize: function (options) {
		    this.countAnexos = options.totalAnexos;		    
			this.lista = options.lista ? true : false;
			
			this.novaJanela = (options.novaJanela) ? options.novaJanela : false;
			this.tipoNovaJanela = (options.tipoNovaJanela) ? options.tipoNovaJanela : [];

		},

		className: 'anexos-holder',

		totalAnexos: function () {
			var anexosTotal = _.template(totalAnexosTemplate);
			return anexosTotal({'total': '<i class="icon-paperclip"></i> '+this.countAnexos+' anexo(s)'});
		},

		baixarComoZip: function () {
			var bz = '<div class="anexos-download-all"><a target="_blank" ><i class="icon-download"></i> Baixar todos os anexos como ZIP</div></a>';
			return bz;
		},

		render: function () {
		    
			var totalAnexos = this.totalAnexos();
			var anexosThumbnails = new AnexosThumbnails({ 'collection': this.collection, 'lista': this.lista, 'novaJanela': this.novaJanela, 'tipoNovaJanela': this.tipoNovaJanela});
			this.$el
				.append(totalAnexos)
				.append(anexosThumbnails.render().$el);
		        //.append(this.baixarComoZip);

			
			return this;
		}
	});
});