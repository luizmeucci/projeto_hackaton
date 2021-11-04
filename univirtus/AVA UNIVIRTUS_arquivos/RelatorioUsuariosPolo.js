/* ==========================================================================
   RelatorioUsuariosPolo ItemView
   @author: Ericson Baggio
   @date: 10/02/2014
   ========================================================================== */

define(function (require) {

    'use strict';
    var App = require('app');
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var Grid = require('views/common/ListView');
    var template = '<div id="lista"><div id="form"></div><div id="cabecalho"></div><div id="resultTable"></div></div></div><div id="detalhe" class="block"><i class="icon-arrow-circle-left goBack"></i><div id="resultadoDetalhe"></div></div>';
    var Select2 = require('jquery-select2');
    var Combobox = require('libraries/Combobox');

    var RelatorioUsuariosCollection = require('collections/pap/RelatorioUsuariosCollection');
    var GrupoEstruturaCollection = require('collections/pap/GrupoEstruturaCollection');

    //Parametros para construção cabeçalho.
    var params = { total: 0, vermelho: 0, verde: 0, amarelo: 0 };

    //Array com os tipos possiveis de cores para indicar se o aluno esta bem ou não:
    var conteudo = [];
    conteudo.push('<i class="icon-sign-blank" style="color: #00FF00 "></i>');
    conteudo.push('<i class="icon-sign-blank" style="color: #FFFF00"></i>');
    conteudo.push('<i class="icon-sign-blank" style="color: #FF0000"></i>');

    var classe = [];
    classe.push('');
    classe.push('');
    classe.push('');

    return Marionette.Layout.extend({
	    id: 'blockContainer',
	    className: 'block-container',
	    events: {
	        'click button': 'criarTabela'
	    },
	    regions: {
	        lista: '#lista',
	        detalhe: '#detalhe'
	    },
        setPlaceholderHeight: function () {
	        var itemHeight = [],
            tallest = null,
            rowHeight = null;

	        // Acha os dois crudItems e os armazena
	        $('#blockContainer .block-item').each(function () {
	            itemHeight.push($(this).height());
	        });
	        // Determina qual dos dois itens é o mais alto
	        tallest = Math.max.apply(null, itemHeight);
	        // Pega o tamanho de uma única coluna
	        rowHeight = 150;
	        // Aplica o tamanho ao placeholder principal acrescido do tamanho de uma coluna
	        this.$el.css({ "min-height": tallest + rowHeight + "px" });
	    },
	    template: _.template(template),
	    criarCombo: function () {
	        $('#cabecalho').html('');
	        var FormMaker = require('libraries/formMaker2');

	        //As opções do formularios. Todos os inputs e grupos.
	        var options = {
	            nome: "combo_polos",
	            id: "form-combo-polos",
	            classe: "form-horizontal",
	            buttonsContainerClass: "col-sm-10",
	            grupo: [{
	                exibirComoPanel: false,
	                titulo: "Usuários",
	                itens: [{
	                    label: "Pólo",
	                    labelSize: "col-sm-1",
	                    tipo: "select",
	                    classe: "form-control",
	                    inputName: "polo",
	                    value: "",  ///Quando o tipo de objeto for select ou radio e precisem ser populados por aqui, enviar uma lista de objetos defaultItem.
	                    size: "col-md-4",
	                    placeholder: "Selecione",
	                    validacao: [{
	                        regra: "required",
	                        valor: "true",
	                        msg: "Escolha um pólo"
	                    }]
	                }]
	            }],
	            botoes: [{
	                text: "Carregar relatório",
	                tipo: "button",
	                classe: "btn btn-primary"
	            }]
	        }

	        //Instancia do Form com as opções:
	        var form = new FormMaker(options);

	        //Objeto do Backbone renderizado.
	        var formRenderizado = form.render().$el;
	        return formRenderizado;

	    },
	    criarTabela: function () {
	        var self = this;

            ///Ericson:::: Thyago arrumar depois, tirar a gambiarra
	        var imagem = $('<img>');
	        imagem.attr('src','./img/loader.gif');
	        $('#resultTable').html(imagem).attr('align','center');

	        var idGrupoEstrutura = $('#polo').val();
	        var listCollection = new RelatorioUsuariosCollection();
	        var url = App.config.baseUrl() + "autenticacao/Usuario/"+idGrupoEstrutura+"/PerfilGrupoEstrutura/";

	        var gridOptions = {
	            list: {
	                // actions: ['cadastrar'],
	                types: [],
	                columns: [{
	                    title: 'RU',
	                    property: 'RU',
	                    header: true,
	                    sortable: true,
	                    comparator: 'RU'
	                },{
	                    title: 'Nome',
	                    property: 'nome',
	                    header: true,
	                    sortable: true,
	                    comparator: 'nome'
	                },{
	                    title: 'E-mail',
	                    property: 'email',
	                    header: true,
	                    sortable: true,
	                    comparator: 'email'
	                }
	                ],
	                properties: ['RU','nome', 'email'],
	                propertiesTypes: ['status','string', 'string']
	            },
	            collection: null
	        };
	        
	        $.when(
				App.Helpers.fetchCollectionDeferred(listCollection, url)
			).done(function (response) {
			    gridOptions.collection = response;

			    params.total = gridOptions.collection.length;
			    params.verde = 0;
			    params.vermelho = 0;
			    params.amarelo = 0;

			    var listView = new Grid(gridOptions);
			    var element = listView.render().$el;
			    self.$el.find('#resultTable').html(element);

			    $.each($('tr.main-row'), function (i, item) {

			        //A quarta posição do array contém o IG:
			        var tds = $(this).find('td');

			        //Colocamos os datas para usar posteriomente:
			        $(this).attr("data-turma", $(tds[1]).html());
			        $(this).attr("data-ru", $(tds[3]).html() );

			        var status = (parseInt(($(tds[0]).html()))-1);

			        if (status == 1) {
			            params.vermelho++;
			        } else if (status == 2) {
			            params.amarelo++;
			        } else {
			            params.verde++;
			        }

			        //$(this).find('td:first').html(conteudo[status].html());
			    });
/*			    self.$el.find('tr.main-row').bind('click', function (e) {
			        return self.verHistorico(e);
			    });
*/

			});
	    },
	    onRender: function () {
	    	// Mostra o Loading
			App.loadingView.reveal();

	        var form = this.criarCombo();
	        this.$el.find('#form').append(form);
	        this.$el.find('#detalhe').hide();
	    },
	    onShow: function () {
	    	App.loadingView.reveal();

	        var url = App.config.baseUrl() + "Sistema/GrupoEstrutura/7/Polos";
	        var objPolo = new Combobox();
	        objPolo.idObjCombo = "polo";
	        objPolo.url = url;
	        objPolo.msgNaoEncontrado = "Não encontrou resultados";
	        objPolo.valorOption = "id";
	        objPolo.textoOption = "nome";
	        objPolo.nomeObjRetorno = "grupoEstruturas";
	        objPolo.textoInicial = "Selecione";
	        objPolo.popularAoIniciar = true;
	        objPolo.autoComplete = true;
	        objPolo.successCallback = App.loadingView.hide();
	        objPolo.render();
	        $('.select2-hidden-accessible').hide();
	    }

	});
});
