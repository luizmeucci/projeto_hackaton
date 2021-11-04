/* ==========================================================================
   Actions ItemView
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 06/05/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var App = require('app');
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var AnimatedIcons = require('libraries/animatedIcons');

	var Bootstrap = require('bootstrap');

	var SVListTPL = 
        '<% if(exibirNota) { %>' +
        '<li><a href="javascript:void(0)" id="diarioClasseNotaAluno" ><span><i class="icon-checklist-alt"></i></span><span class="action-bar-text" title="Nota">Nota</span></a></li>' +
        '<% }%>' +
        '<% if(exibirFrequencia) { %>' +
            '<li><a href="javascript:void(0)" id="diarioClasseFrequenciaAluno"><span><i class="icon-check-square-o"></i></span><span class="action-bar-text" title="Frequência">Frequência</span></a></li>' +
        '<% }%>' +
	    '<% if(exibirDesempenho) { %>' +
            '<li><a href="javascript:void(0)" id="indicadorDesempenhoAluno"><span><i class="icon-dashboard"></i></span><span class="action-bar-text" title="Indicador de desempenho">Desempenho</span></a></li>' +
        '<% }%>' +
        '<li><a href="javascript: void(0)" id="roteiroCentralMidia"><span><i class="icon-film"></i></span><span class="action-bar-text"> Central de mídia</span></a></li>' +
        '<% if (cadastrar) { %>' +
            '<li><a data-idsalavirtual="<%= salaVirtualId %>" id="addSalaVirtualEstrutura"> <span><i class="icon-plus-circle"></i></span><span class="action-bar-icon-text"></span> </a></li>' +
        '<% } %>';
	var buscaExportacaoNotaCurso = function (idCurso) {
	    
	    var url = UNINTER.AppConfig.UrlWs("sistema") + "ExportacaoNotaCurso/" + idCurso + "/GetByCurso/N";
	    var opcoes = { url: url, type: 'GET', data: null, async: false };

	    var retorno = UNINTER.Helpers.ajaxRequestError(opcoes);
	    if (retorno.status == 200) {
	        
	        return true;
	    }
	    return false;
	}
	return Marionette.ItemView.extend({
		initialize: function (options) {
			this.areaPerms = options.areaPerms;
			this.areaName = options.areaName;
			this.salaVirtualId = /*isNaN(options.salaVirtualId) ? encodeURIComponent(options.salaVirtualId) :*/ options.salaVirtualId;
			this.idCursoModalidade = (options.idCursoModalidade) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idCursoModalidade : null);
			this.idCurso = (options.idCurso) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idCurso : null);
			
		},
		tagName: "ul",
		className: 'actions list-inline list-action-roteiro',
		template: _.template(SVListTPL),
		events: {
		    'click #addSalaVirtualEstrutura': function (e) {
				var el = $(e.currentTarget),
				self = this;

				var idSalaVirtualOferta = App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOferta;
				var idSalaVirtualOfertaPai = App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaPai;
              
				App.Helpers.ajaxRequest({
					async: true,
					type: 'POST',
					url: App.config.UrlWs('ava')+'SalaVirtualEstrutura',
					data: { 'cIdSalaVirtual':  this.salaVirtualId, 'idSalaVirtualOferta': idSalaVirtualOferta, 'idSalaVirtualOfertaPai': idSalaVirtualOfertaPai },
					successCallback: function (r) {
						self.trigger('modulecreated');
					}
				});
			},
		    'click #indicadorDesempenhoAluno': function (e) {
		        var idSalaVirtualOferta = encodeURIComponent(App.StorageWrap.getItem("leftSidebarItemView").cIdSalaVirtualOferta);
		        window.location = "#/ava/IndicadorDesempenhoAluno/" + idSalaVirtualOferta + "/Exibir";
		    },
		    'click #diarioClasseFrequenciaAluno': function (e) {		        
		        window.location = "#/ava/diarioClasseAluno/";
		    },
		    'click #diarioClasseNotaAluno': function (e) {		        
		        window.location = "#/ava/diarioClasseNotaAluno/";
		    },
		    'click #roteiroCentralMidia': function (e) {
		        window.location = "#/ava/salaVirtualAtividade/";
		    }
		},
		serializeData: function () {
		    var exibirDesempenho = true;		    
		    var exibirFrequencia = false;
		    var exibirNota = false;
            
		    
		    try {

		        //exibe para alunos... somente do presencial e semi
		        if (_.findWhere(App.StorageWrap.getItem("user").perfis, { idPerfil: 10 }) && (this.idCursoModalidade == 2 || this.idCursoModalidade == 3)) {
		            exibirFrequencia = true;
		            exibirNota = buscaExportacaoNotaCurso(this.idCurso);		            
		        }
		    } catch (e) {
		        console.warn(e);

		    }

		    var objUsuario = App.StorageWrap.getItem("user");

		    //if (objUsuario != void (0) && objUsuario.idUsuario != objUsuario.idUsuarioSimulador)
		    //{
		    //    App.Helpers.ajaxRequest({
		    //        async: false,
		    //        type: 'GET',
		    //        url: App.config.UrlWs('autenticacao') + 'UsuarioBeta/'+ objUsuario.idUsuarioSimulador + "/Usuario",
		    //        data: null,
		    //        successCallback: function (r) {
		    //            var dados = r.usuarioBetas;
		    //            if (dados.length > 0)
		    //            {
		    //                exibirDesempenho = true;
		    //            }
		    //        }
		    //    });
		    //}

		    if (objUsuario.idUsuario == 123990 || objUsuario.idUsuario == 301111) {
		        exibirDesempenho = true;
		    }
			return {
				cadastrar: App.auth.viewCheckPerms('cadastrar', this.areaPerms),
				areaName: this.areaName, 
				salaVirtualId: this.salaVirtualId,
				'exibirDesempenho': exibirDesempenho,
				'exibirFrequencia': exibirFrequencia,
				'exibirNota': exibirNota

			}
		},
		
		onShow: function () {
		    
			// this.delegateEvents();
		}
	});
});