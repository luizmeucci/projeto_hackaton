/* ==========================================================================
   Solicitacoes ItemView
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

    var RelatorioPericulosidadeCollection = require('collections/pap/RelatorioPericulosidadeCollection');
    var IdiomaCollection = require('collections/sistema/IdiomasCollection');
    var GrupoEstruturaCollection = require('collections/sistema/GrupoEstruturaCollection');
    var bootstrap = require('bootstrap');

    var Templates;
    var HistoryBlockItemView;

    var nomeArquivo = "";

    //Parametros para construção cabeçalho.
    var params = { total: 0, vermelho: 0, verde: 0, amarelo: 0 };

    //Array com os tipos possiveis de cores para indicar se o aluno esta bem ou não:
    var conteudo = [];
    conteudo.push('<i class="icon-stop" style="color: #00FF00 "></i>'); //Verde
    conteudo.push('<i class="icon-stop" style="color: #FFFF00"></i>'); //Amarelo
    conteudo.push('<i class="icon-stop" style="color: #FF0000"></i>'); //Vermelho

    var classe = [];
    classe.push('');
    classe.push('');
    classe.push('');

    return Marionette.Layout.extend({
	    id: 'blockContainer',
	    className: 'block-container',
	    events: {
	        //'submit': 'criarTabela',
	        'click #enviarEmail': 'formEnviarEmail',
	        'click #cancelarFormEmail': 'removerFormEmail',
	        'click #enviarTel': 'formEnviarTel',
	        'click #cancelarFormTel': 'removerFormTel'
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
	    criarCabecalho: function () {
	        $('#cabecalho').html('');
            //Funcao para retornar o percentual.
	        var calcularPercentual = function (total, x) {
	            var i = 100 / parseInt(total);
	            if (total == 0 || x == 0) {
	                return 0;
	            } else {
	                return Number((i * x).toFixed(1));;
	            }
	        }

            //Percentual de cada cor:
	        var percentual =
                {
                    verde: calcularPercentual(params.total, params.verde),
                    vermelho: calcularPercentual(params.total, params.vermelho),
                    amarelo: calcularPercentual(params.total, params.amarelo)
	            }

            //Total de alunos
	        var linha = $('<div>', {'class': 'mini-block'});
	        var cabecalho = $('<div>', {'class': 'table-header relatorios'});
	        cabecalho.append(linha.html('Total de alunos: ' + params.total));

	        
	        //Cada cor com seu percentual:
	        linha = $('<div></div>');
	        linha.addClass('mini-block relatorio-legenda');

	        linha.append($('<span>', {'class': 'total'}).html(conteudo[2] + ' ' + params.vermelho + ' <span>(' + percentual.vermelho + '%)</span>  '));
	        linha.append($('<span>', {'class': 'total'}).html(conteudo[1] + ' ' + params.amarelo + ' <span>(' + percentual.amarelo + '%)</span>  '));
	        linha.append($('<span>', {'class': 'total'}).html(conteudo[0] + ' ' + params.verde + ' <span>(' + percentual.verde + '%)</span>  '));

            //Adicionamos as cores ao cabeçalho.
	        cabecalho.append(linha);
	        $('#cabecalho').html(cabecalho);
	    },
	    criarCombo: function () {
	        var self = this;
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
	                titulo: "Situação Acadêmica",
	                itens: [{
	                    label: "Sistema",
	                    labelSize: "col-sm-1",
	                    tipo: "select",
	                    classe: "form-control",
	                    inputName: "codigoSistema",
	                    value: "",  ///Quando o tipo de objeto for select ou radio e precisem ser populados por aqui, enviar uma lista de objetos defaultItem.
	                    size: "col-md-4",
	                    placeholder: "Selecione",
	                    validacao: [{
	                        regra: "required",
	                        valor: "true",
	                        msg: "Escolha um sistema"
	                    }]
	                }, {
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
	                }, {
	                    label: "Curso",
	                    labelSize: "col-sm-1",
	                    tipo: "select",
	                    classe: "form-control",
	                    inputName: "codigoCurso",
	                    value: "",  ///Quando o tipo de objeto for select ou radio e precisem ser populados por aqui, enviar uma lista de objetos defaultItem.
	                    size: "col-md-4",
	                    placeholder: "Todos",
	                    validacao: []
	                }, {
	                    label: "Módulo",
	                    labelSize: "col-sm-1",
	                    tipo: "select",
	                    classe: "form-control",
	                    inputName: "codigoModulo",
	                    value: "",  ///Quando o tipo de objeto for select ou radio e precisem ser populados por aqui, enviar uma lista de objetos defaultItem.
	                    size: "col-md-4",
	                    placeholder: "Todos",
	                    validacao: []
	                }, {
	                    label: "Turma",
	                    labelSize: "col-sm-1",
	                    tipo: "select",
	                    classe: "form-control",
	                    inputName: "codigoTurma",
	                    value: "",  ///Quando o tipo de objeto for select ou radio e precisem ser populados por aqui, enviar uma lista de objetos defaultItem.
	                    size: "col-md-4",
	                    placeholder: "Todos",
	                    validacao: []
	                }, {
	                    label: "Situação",
	                    labelSize: "col-sm-1",
	                    tipo: "select",
	                    classe: "form-control",
	                    inputName: "situacao",
	                    value: "",  ///Quando o tipo de objeto for select ou radio e precisem ser populados por aqui, enviar uma lista de objetos defaultItem.
	                    size: "col-md-4",
	                    placeholder: "Todos",
	                    validacao: []
	                }, {
	                    label: "RU",
	                    labelSize: "col-sm-1",
	                    tipo: "text",
	                    classe: "form-control input-sm",
	                    inputName: "ruAluno",
	                    value: "",  ///Quando o tipo de objeto for select ou radio e precisem ser populados por aqui, enviar uma lista de objetos defaultItem.
	                    size: "col-md-4",
	                    placeholder: "RU",
	                    validacao: []
	                }],
	            }],
	            botoes: [{
	                text: "Carregar relatório",
	                tipo: "submit",
	                classe: "btn btn-primary"
	            }]
	        }

	        //Instancia do Form com as opções:
	        var form = new FormMaker(options);

	        form.on('formview:submit', function (data) {
	            self.criarTabela();
	        });

	        //Objeto do Backbone renderizado.
	        var formRenderizado = form.render().$el;
	        return formRenderizado;

	    },
	    criarTabela: function () {
	        var self = this;

	        var codigoSistema = $('#codigoSistema').val();
	        var codigoPolo = $('#polo').val();
	        var codigoTurma = $('#codigoTurma').val();
	        var codigoCurso = $('#codigoCurso').val();
	        var ru = $('#ruAluno').val();
	        var situacao = $('#situacao').val();
	        var codigoModulo = $('#codigoModulo').val();

	        if (codigoPolo == "") {
	            var opcoes = {
	                body: "Por favor, escolha um pólo.",
	                strong: "",
	                type: "warning",
	                appendTo: "#resultTable"
	            }
	            $("#resultTable").empty();
	            App.flashMessage(opcoes);
	            return;
	        }
	        if (codigoSistema == "") {
	            var opcoes = {
	                body: "Por favor, escolha um sistema.",
	                strong: "",
	                type: "warning",
	                appendTo: "#resultTable"
	            }
	            $("#resultTable").empty();
	            App.flashMessage(opcoes);
	            return;
	        }
	        if (codigoCurso == 'undefined' || codigoCurso == null) {
	            codigoCurso = "";
	        }
	        if (codigoTurma == 'undefined' || codigoTurma == null) {
	            codigoTurma = "";
	        }
	        if (ru == 'undefined' || ru == null) {
	            ru = "";
	        }
	        if (situacao == 'undefined' || situacao == null) {
	            situacao = "";
	        }
	        if (codigoModulo == 'undefined' || codigoModulo == null) {
	            codigoModulo = "";
	        }


	        $('#cabecalho').html('');
            ///Ericson:::: Thyago arrumar depois, tirar a gambiarra
	        var imagem = $('<img>');
	        imagem.attr('src','./img/loader.gif');
	        $('#resultTable').html(imagem).css('text-align','center');

	        var listCollection = new RelatorioPericulosidadeCollection();


	        //var url = App.config.baseUrl() + "PAP2/RelatorioPericulosidade?id=" + codigoPolo + "&codigoCurso=" + codigoCurso + "&codigoTurma=" + codigoTurma + "&situacao=" + situacao + "&ru=" + ru + "&codigoModulo=" + codigoModulo + "&codigoSistema=" + codigoSistema;
	        var url = App.config.baseUrl() + "PAP/RelatorioPericulosidade?id=" + codigoPolo + "&codigoCurso=" + codigoCurso + "&codigoTurma=" + codigoTurma + "&situacao=" + situacao + "&ru=" + ru + "&codigoModulo=" + codigoModulo + "&codigoSistema=" + codigoSistema;
	        //var url = App.config.baseUrl() + "pap/RelatorioPericulosidade?id=" + codigoPolo + "&codigoCurso=" + codigoCurso + "&codigoTurma=" + codigoTurma;
	        //var url = "http://localhost:35357/RelatorioPericulosidade?id=" + codigoPolo +"&codigoCurso="+ codigoCurso+"&codigoTurma="+codigoTurma;

	        var gridOptions = {
	            list: {
	                // actions: ['cadastrar'],
	                clickable: true,
	                types: [],
	                columns: [{
	                    title: 'Status',
	                    property: 'status',
	                    header: true,
	                    sortable: true,
	                    comparator: 'status'
	                }, {
	                    title: 'Turma',
	                    property: 'nome_turma',
	                    header: true,
	                    sortable: true,
	                    comparator: 'nome_turma'
	                }, {
	                    title: 'Aluno',
	                    property: 'aluno',
	                    header: true,
	                    sortable: true,
	                    comparator: 'aluno'
	                }, /*{
	                    title: 'RU',
	                    property: 'RU',
	                    header: true,
	                    sortable: true,
	                    comparator: 'RU'
	                }, */{
	                    title: 'Atividades',
	                    property: 'ATVRealizadas',
	                    header: true,
	                    sortable: true,
	                    comparator: 'ATVRealizadas'
	                }, {
	                    title: 'Índice Geral',
	                    property: 'IG',
	                    header: true,
	                    sortable: true,
	                    comparator: 'IG'
	                },
                    {
                        title: 'Último Acesso',
                        property: 'ultimoAcesso',
                        header: true,
                        sortable: true,
                        comparator: 'ultimoAcesso'
                    },
                    {
                        title: 'Situação',
                        property: 'situacaoAluno',
                        header: true,
                        sortable: true,
                        comparator: 'situacaoAluno'
                    },
                    {
                        title: 'Valor devido',
                        property: 'valorDevido',
                        header: true,
                        sortable: true,
                        comparator: 'valorDevido'
                    },
                    {
                        title: 'Data limite',
                        property: 'Última Atividade',
                        header: true,
                        sortable: true,
                        comparator: 'Última Atividade'
                    }, {
                        title: 'Enviado e-mail em',
                        property: 'dataEnvio',
                        header: true,
                        sortable: true,
                        comparator: 'dataEnvio'
                    }
	                ],
	                properties: ['status', 'nome_turma', 'aluno', 'ATVRealizadas', 'IG', 'ultimoAcesso', 'situacaoAluno', 'valorDevido', 'dataUltimaAtividade', 'dataEnvio'],
	                propertiesTypes: ['string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string', 'string']
	            },
	            collection: null
	        };

	        $.when(
				App.Helpers.fetchCollectionDeferred(listCollection, url)
			).done(function (response) {

			    var m = Backbone.Model.extend();
			    var c = Backbone.Collection.extend({ model:m });

			    var collection = new c(response.models[0].get("relatorio"));
			    
			    //gridOptions.collection = response.models[0].get("relatorio");

			    if (collection.length == 0)
			        collection = new c(response.models[0].get("relatorioClaroline"));

                self.collection = collection;

			    gridOptions.collection = collection;
			    nomeArquivo = response.models[0].get("nomeArquivo");
			    //nomeArquivo = collection;

			    params.total = gridOptions.collection.length;
			    params.verde = 0;
			    params.vermelho = 0;
			    params.amarelo = 0;

			    var listView = new Grid(gridOptions);
			    var element = listView.render().$el;
			    self.$el.find('#resultTable').html(element);

			    $('#resultTable').css('text-align', 'left');
			    $.each($('tr.main-row'), function (i, item) {

			        //A quarta posição do array contém o IG:
			        //var tds = $(this).find('td');

			        //Colocamos os datas para usar posteriomente:
			        //$(this).attr("data-turma", $(tds[1]).html());
			        //$(this).attr("data-ru", $(tds[3]).html());
			        //$(this).attr("data-aluno", $(tds[2]).html());
			        //$(this).attr("data-ultimo-acesso", $(tds[6]).html());
			        //$(this).attr("data-ultimo-acesso", $(tds[6]).html());

			        var modelClicado = self.collection.get($(this).parent().attr("id"));

			        var IG = (parseFloat(modelClicado.get("status")));
			        var valorDevido = (parseFloat(modelClicado.get("valorDevido")));

			        var status = 0;

			        if (IG <= 3.2) {
			            status = 2
			            params.vermelho++;
			        } else if (IG >= 5.6) {
			            status = 0;
			            params.verde++;
			        } else {
			            status = 1;
			            params.amarelo++;
			        }


			        var classeValorDevido = "";
			        if (valorDevido > 0 && valorDevido < 300.01) {
			            classeValorDevido = "warning";
			        } else if (valorDevido > 300.00) {
			            classeValorDevido = "danger";
			        }
			        //$(this).addClass(classeValorDevido);
			        //$(this).find('td:first').html(conteudo[status].html());
			        // $(this).find('td:first').addClass(classe[status]).html(conteudo[status]).css('text-align', 'center');

			        ///@TODO corrigir.... Como a tabela não é gerada aqui, não achei uma forma melhor....
			        $(this).find('td').each(function (i, item) {
			            if (i == 0) {
			                $(this).addClass(classe[status]).html(conteudo[status]).css('text-align', 'center');
			            }
			            if (i == 4) {
			                $(this).css('color', '#FF0000');
			            }
			            if (i == 7) {
			                $(this).addClass(classeValorDevido);
			            }
			        });

			    });
			    self.$el.find('tr.main-row').bind('click', function (e) {
			        return self.verHistorico(e);
			    });
			    self.criarCabecalho();
			    var urlXls = App.config.baseUrl() + "PAP/RelatorioPericulosidade/xls/Exportar?nomeArquivo=" + nomeArquivo;
			    var urlDoc = App.config.baseUrl() + "PAP/RelatorioPericulosidade/doc/Exportar?nomeArquivo=" + nomeArquivo;
			    var urlPdf = App.config.baseUrl() + "PAP/RelatorioPericulosidade/pdf/Exportar?nomeArquivo=" + nomeArquivo;
			    //var urlXls = App.config.baseUrl() + "PAP2/RelatorioPericulosidade/xls/Exportar?nomeArquivo=" + nomeArquivo;
			    //var urlDoc = App.config.baseUrl() + "PAP2/RelatorioPericulosidade/doc/Exportar?nomeArquivo=" + nomeArquivo;
			    //var urlPdf = App.config.baseUrl() + "PAP2/RelatorioPericulosidade/pdf/Exportar?nomeArquivo=" + nomeArquivo;

			    // var templateActions = $('<span class="relatorios-actions\"> <span class="relatorios-exportar"><span class="titulo">Exportar:</span> <span class="icons"><a id="xls" href="' + urlXls + '"><img title="xls" src="img/icons/icon-xls-32.png"></a> <a id="pdf" href="' + urlPdf + '" ><img title="pdf" src="img/icons/icon-pdf-32.png"></a> <a id="doc" href="' + urlDoc + '" ><img title="doc" src="img/icons/icon-doc-32.png"></a></span></span></span>');
			    var templateActions = $('<span class="relatorios-actions\"> <span class="help" id="helpBlock"> <span class="icon-stack"> <i class="icon-stop icon-stack-base"></i> <i class="icon-question"></i> </span> </span> <span class="relatorios-exportar"><span class="titulo">Exportar:</span> <span class="icons"><a id="xls" href="' + urlXls + '"><img title="xls" src="img/icons/icon-xls-32.png"></a> <a id="pdf" href="' + urlPdf + '" ><img title="pdf" src="img/icons/icon-pdf-32.png"></a> <a id="doc" href="' + urlDoc + '" ><img title="doc" src="img/icons/icon-doc-32.png"></a></span></span></span>');
			    $('#cabecalho > div .mini-block').eq(1).append(templateActions);

			    var helpData = {
			    	ig: "Indice Geral: É a forma de representar quantitativamente o nível de participação e desempenho do aluno no Ambiente Virtual de Aprendizagem (AVA). A variação do IG está entre 0 e 10; quanto mais próximo de 10 maior é sua participação / desempenho",	
			    	igVermelho: "IG abaixo de 3.2",
			    	igAmarelo: "IG entre 3.2 e 5.6",
			    	igVerde: "IG acima de 5.6"
			    };
			    
			    var popoverHtml = _.template([
			    	'<table class="popover-table"><tr>',
			    			'<td>IG</td>',
			    			'<td><%= ig %></td>',
			    		'</tr><tr>',
				    		'<td><i class="icon-stop" style="color: #FF0000"></i></td>',
				    		'<td><%= igVermelho %></td>',
				    	'</tr><tr>',
				    		'<td><i class="icon-stop" style="color: #FFFF00"></i></td>',
				    		'<td><%= igAmarelo %></td>',
				    	'</tr><tr>',
				    		'<td><i class="icon-stop" style="color: #00FF00"></i></td>',
				    		'<td><%= igVerde %></td>',
			    	'</tr></table>',
			    ].join(''));

			    // Popover
			    $('#helpBlock').popover({
			    	title: 'Legenda:',
			    	content: popoverHtml(helpData),
			    	placement: 'bottom',
			    	container: '#main-content',
			    	html: true,
			    	trigger: 'click'
			    }) 
			    // Classe .active na ajuda
			    .on('click', function(e) {
			    	e.stopImmediatePropagation();
			    	$(this).toggleClass('active');
			    });
			    
				// Some com a popover ao clicar fora dela
				$('html').on('click', function(e) {
					if ( typeof $(e.target).data('original-title') == 'undefined' && !$(e.target).parents().is('.popover.in') ) {
						$('#helpBlock').removeClass('active');
			  			$('[data-original-title]').popover('hide');
			 		}
			});

			});
	    },
	    verHistorico: function (e) {
	        ///@TODO Ericson:::: Thyago arrumar depois, tirar a gambiarra

	        var self = this;
	        var elem = $(e.currentTarget).parent();

	        $('#lista').hide();
	        var modelClicado = self.collection.get($(elem).attr("id"));
	        self.modelClicado = modelClicado;

	        var imagem = $('<img>');
	        var imgHolder = $('<div>').css('text-align', 'center');
	        imagem.attr('src', './img/loader.gif');
	        imgHolder.append(imagem);
	        $('#resultadoDetalhe').html(imgHolder);

	        var listCollection = new RelatorioPericulosidadeCollection();

            //Agrupador do cabeçalho
	        var templateCabecalho = $('<div id="cabecalhoDetalhe"></div><div></div>');

	        //Linhas do cabecalho
	        var tituloPrimario = $('<legend>Detalhes</legend>');
	        var listGroup = $('<ul>', {'class': 'list-group dados-aluno'});
	        
	        var dadosAlunoTemplate = [
	        	'<ul class="list-group dados-aluno">',
	        		'<li class="list-group-item active">',
	        			'<h4 class="list-group-item-heading"><%= aluno %></h4>',
		        		'<div class="mini-block inline">',
		        			'<span class="title">RU:</span>',
		        			'<span class="description"><%= ru %></span>',
		        		'</div>',
		        		'<div class="mini-block inline">',
		        			'<span class="title">Último Acesso:</span>',
		        			'<span class="description"><%= ultimoAcesso %></span>',
		        		'</div>',
		        	'</li>',
	        		'<li class="list-group-item">',
	        			'<div class="mini-block inline">',
	        				'<span class="title">Curso:</span>',
	        				'<span class="description"><%= curso %></span>',
	        			'</div',
	        		'</li>',
	        		'<li class="list-group-item">',
	        			'<div class="mini-block inline">',
	        				'<span class="title">Turma:</span>',
	        				'<span class="description"><%= turma %></span>',
	        			'</div>',
	        		'</li>',
	        		'<li class="list-group-item">',
	        			'<div class="mini-block inline">',
	        				'<span class="title"><i class="icon-phone-square"></i></span>',
	        				'<span class="description"><%= fones %></span>',
                            '<button id ="enviarTel" class="btn btn-primary btn-xs">compor histórico telefônico</button>',
	        			'</div>',
	        		'</li>',
	        		'<li class="list-group-item">',
	        			'<div class="mini-block inline">',
	        				'<span class="title"> <i class="icon-envelope2"></i> </span>',
	        				'<span class="description"><%= emailAluno %></span>',
	        				'<button id ="enviarEmail" class="btn btn-primary btn-xs">compor e-mail</button>',
	        			'</div>',
	        		'</li>',    		
        		'</ul>',
        		'<div id="areaMessageHolder"></div>',
        		'<div id="divFormEmail">',
                    '<ul class="list-group dados-aluno">',
	        		    '<li class="list-group-item active">',
	        			    '<h4 class="list-group-item-heading">Enviar E-mail</h4>',
		        	    '</li>',
                        '<li class="list-group-item" id="form-compor">',
		        	    '</li>',
                    '</ul>',
                '<div id="divFormHistorico">',
	                '<ul class="list-group dados-aluno">',
                        '<li class="list-group-item active">',
                            '<h4 class="list-group-item-heading" style="display:inline;">Histórico  </h4>',
                        '</li>',
                        '<li class="list-group-item">',
                            '<div class="divPai" style="display:inline;"></div>',
                        '</li>',
                    '</ul>',
                '</div>',
                '</div>',
                '<div id="areaMessageHolderHistorico"></div>',
                '<div id="divFormHistTelefonico">',
                    '<ul class="list-group dados-aluno">',
	        		    '<li class="list-group-item active">',
	        			    '<h4 class="list-group-item-heading">Histórico telefônico</h4>',
		        	    '</li>',
                        '<li class="list-group-item" id="form-historico">',
		        	    '</li>',
                    '</ul>',
                '</div>'
	        ];

	        var tituloSecundario = $('<legend>Situação acadêmica</legend>');

	        //link para enviar e-mail ao aluno:
	        var linkEmail = $('<a href="javascript:void(0)" id="enviarEmail">(compor e-mail)</button>');
	        var linkFone = $('<a href="javascript:void(0)" id="enviarTel">(compor histórico telefônico)</button>');

	        //Unificamos:
	        templateCabecalho.append(tituloPrimario).append(listGroup).append(tituloSecundario);
	        //var url = App.config.baseUrl() + "pap/RelatorioDesempenhoAluno/" + modelClicado.get("RU") + "/turma?turma=" + modelClicado.get("nome_turma");
	        //var url = App.config.baseUrl() + "PAP2/RelatorioDesempenhoAluno/" + modelClicado.get("RU") + "/turma?turma=" + modelClicado.get("cd_turma") + "&codigoSistema=" + $('#codigoSistema').val();
	        var url = App.config.baseUrl() + "PAP/RelatorioDesempenhoAluno/" + modelClicado.get("RU") + "/turma?turma=" + modelClicado.get("cd_turma") + "&codigoSistema=" + $('#codigoSistema').val();
	        var gridOptions = {
	            list: {
	                types: [],
	                columns: [{
	                    title: 'Disciplina',
	                    property: 'disciplina',
	                    header: true,
	                    sortable: true,
	                    comparator: 'disciplina'
	                }, {
	                    title: 'Atividade',
	                    property: 'atividade',
	                    header: true,
	                    sortable: true,
	                    comparator: 'atividade'
	                }, {
	                    title: 'nota',
	                    property: 'nota',
	                    header: true,
	                    sortable: true,
	                    comparator: 'nota'
	                }, {
	                    title: 'Data',
	                    property: 'dataRealizouAtividade',
	                    header: true,
	                    sortable: true,
	                    comparator: 'dataRealizouAtividade'
	                }, {
	                    title: 'Data Final Exercício',
	                    property: 'dataFinalExercicio',
	                    header: true,
	                    sortable: true,
	                    comparator: 'dataFinalExercicio'
	                }
	                ],
	                properties: ['disciplina', 'atividade', 'nota', 'dataRealizouAtividade', 'dataFinalExercicio'],
	                propertiesTypes: ['string', 'string', 'string', 'string', 'string']
	            },
	            collection: null
	        };

	        $.when(
				App.Helpers.fetchCollectionDeferred(listCollection, url)
			).done(function (response) {

                //Pegamos os dados do retorno e criamos uma coleção dinamicamente.
			    var m = Backbone.Model.extend();
			    var c = Backbone.Collection.extend({ model: m });
			    var collection = new c(response.models[0].get("relatorio"));
			    self.collectionHistorico = collection;
			    var telefones;
			    var foneFormat = function (numbers) {
			    	var data = {}, ip = '+55', foneNumbers, theNumbers = [],
			    		link = _.template("<a class='phone' href='tel:<%= prefixed %>'><%= unprefixed %></a>");

			    	if (foneNumbers != null) {
			    	    foneNumbers = numbers.split(' ');
			    	    if (foneNumbers.length) {
			    	        _.each(foneNumbers, function (fn) {

			    	            if (fn === '') { return; }

			    	            var lp = fn.match(/\(([0-9]+)\)/)[1];
			    	            var n = fn.split(')');
			    	            var rawFn = lp + n[1];


			    	            data.prefixed = ip + rawFn;
			    	            data.unprefixed = '(' + lp + ')' + ' ' + n[1];

			    	            theNumbers.push(link(data));

			    	        }, this);
			    	    }

			    	    return theNumbers.join(' ');
			    	}
			    	telefones = foneFormat(collection.models[0].get('fones'));
			    }

			    //var telefones = foneFormat( collection.models[0].get('fones') );

			    // var telefones = collection.models[0].get('fones').split(' ');
			    // var telefoneInternationalPrefix = telefones[0].match( /\(([0-9]+)\)/ );

			    var tpl = _.template(dadosAlunoTemplate.join(''));
			    var data = {
					aluno: modelClicado.get("aluno"),
					turma: modelClicado.get("nome_turma"),
					ru: modelClicado.get("RU"),
					ultimoAcesso: modelClicado.get("ultimoAcesso"),
					emailAluno: collection.models[0].get('email'),
					curso: collection.models[0].get('curso'),
					fones: telefones
				};

				var compiledTemplate = tpl(data);
                //Populamos o cabeçalho
			    templateCabecalho.find('#divAluno').append(modelClicado.get("aluno"));
			    templateCabecalho.find('#divRU').append(modelClicado.get("RU"));
			    templateCabecalho.find('#divUltimoAcesso').append(modelClicado.get("ultimoAcesso"));
			    templateCabecalho.find('#divTurma').append(modelClicado.get("nome_turma"));
			    templateCabecalho.find('#divCurso').append(collection.models[0].get('curso'));
			    //templateCabecalho.find('#divEmail').append(emailAluno);
			    templateCabecalho.find('#divEmail').append(collection.models[0].get('email')).append(linkEmail);
			    templateCabecalho.find('#divFones').append(collection.models[0].get('fones')).append(linkFone);



                //Criamos a grid:
			    gridOptions.collection = collection;
			    var listView = new Grid(gridOptions);
			    var element = listView.render().$el;

                //Adicionamos a GRID e o Cabeçalho a tela
			    // self.$el.find('#resultadoDetalhe').html(templateCabecalho.html()).css('text-align', 'left');
			    self.$el.find('#resultadoDetalhe')
			    	.html(compiledTemplate)
			    	.append(element);
			    self.removerFormEmail();
			    self.removerFormTel();
			});

            //Mostramos a div com os dados gerados acima.
	        $('#detalhe').show();

            //Subimos até o topo, caso haja scroll
            $('body').scrollTop(300);

            //Criamos um evento para voltar a lista:
            $('.goBack').unbind();
	        $('.goBack').bind('click', function (e) {
	            $('#resultadoDetalhe').html('');
	            $('#lista').show();
	        });
	    },


	    formEnviarTel: function () {

	        App.loadingView.reveal();

	        var self = this;

	        App.StorageWrap.setAdaptor(sessionStorage);
	        var user = App.StorageWrap.getItem('user');

	        var FormMaker = require('libraries/formMaker2');
            
	        //As opções do formularios. Todos os inputs e grupos.
	        var options = {
	            nome: "form-email",
	            id: "form-email-aluno",
	            classe: "form-horizontal",
	            buttonsContainerClass: "col-sm-10",
	            grupo: [{
	                exibirComoPanel: false,
	                titulo: null,
	                itens: [{
	                    label: "Assunto",
	                    labelSize: "col-sm-1",
	                    id: "turma",
	                    tipo: "text",
	                    classe: "form-control  input-sm",
	                    inputName: "assunto",
	                    value: "",
	                    rows:"6",
	                    size: "col-md-6",
	                    placeholder: "Assunto",
	                    validacao: [{
	                        regra: "required",
	                        valor: "true",
	                        msg: "Digite um assunto para o histórico."
	                    }, {
	                        regra: "maxlength",
	                        valor: "200",
	                        msg: "O texto é muito grande."
	                    }]
	                },{
	                    label: "Mensagem",
	                    labelSize: "col-sm-1",
	                    tipo: "textarea",
	                    classe: "form-control  input-sm",
	                    inputName: "mensagem",
	                    value: "", //expressaoIdioma.nome,
	                    rows: "6",
	                    size: "col-md-6",
	                    placeholder: "Mensagem",
	                    validacao: [{
	                        regra: "required",
	                        valor: "true",
	                        msg: "Digite a conversa via telefone com o aluno."
	                    }, {
	                        regra: "maxlength",
	                        valor: "7900",
	                        msg: "O texto é muito grande."
	                    }]
	                },
	                {
	                    tipo: "hidden",
	                    id: "idSalaVirtualOferta",
	                    classe: "form-control  input-sm",
	                    inputName: "idSalaVirtualOferta",
	                    value: self.modelClicado.get("idSalaVirtualOferta")
	                },
	                {
	                    tipo: "hidden",
	                    id: "idUsuarioEnviado",
	                    classe: "form-control  input-sm",
	                    inputName: "idUsuarioEnviado",
	                    value: self.modelClicado.get("id")
	                },
	                {
	                    tipo: "hidden",
	                    id: "tipo",
	                    classe: "form-control  input-sm",
	                    inputName: "tipo",
	                    value: 1
	                }]
	            }],
	            botoes: [{
	                text: "Enviar",
	                tipo: "submit",
	                classe: "btn btn-primary",
	                id: "enviar"
	            }, {
	                text: "Cancelar",
	                tipo: "button",
	                classe: "btn btn-default",
	                id: "cancelarFormTel"
	            }]
	        }

	        //Instancia do Form com as opções:
	        var form = new FormMaker(options);

	        //Objeto do Backbone renderizado.
	        var formRenderizado = form.render().$el;

	        form.on('formview:submit', function (data) {
	            var m = Backbone.Model.extend();
	            var c = Backbone.Collection.extend({ model: m });
	            var collection = new c();

	            collection.url = App.config.baseUrl() + "PAP/NotificacaoDesempenhoAluno";
	            var create = collection.create(data, {
	                wait: true,
	                success: function (response) {
	                    var addZero = function (n) { return (n < 10) ? '0' + n : n; };

	                    var hoje = new Date();

	                    var day = addZero(hoje.getDate());
	                    var month = addZero(hoje.getMonth() + 1);
	                    var year = hoje.getFullYear().toString();
	                    var hours = addZero(hoje.getHours());
	                    var minutes = addZero(hoje.getMinutes());
	                    var seconds = addZero(hoje.getSeconds());

	                    var dataEnvio = day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;

	                    var idTR = self.modelClicado.cid
	                    $("#" + idTR + " tr td:last").html(dataEnvio);

	                    var opcoes = {
	                        body: "Histórico enviado.",
	                        strong: "",
	                        type: "success",
	                        appendTo: "#areaMessageHolderHistorico"
	                    }
	                    $("#divFormHistTelefonico").empty();
	                    App.flashMessage(opcoes);
	                },
	                error: function (error) {
	                    var opcoes = {
	                        body: "Falha ao enviar histórico telefônico.",
	                        strong: "",
	                        type: "warning",
	                        appendTo: "#divFormHistTelefonico"
	                    }
	                    $("#divFormHistTelefonico").empty();
	                    App.flashMessage(opcoes);
	                    console.log(error);
	                }
	            });
	            $.when(create).done(function () {
	                App.Helpers.animatedScrollTop();
	            });
	        });



	        self.$el.find('#form-historico').html(formRenderizado);

	        // Esconde o spinner
	        App.loadingView.hide();

	        $("#divFormHistTelefonico").show();
	        $("#divFormHistTelefonico").find("legend").remove(); /// @TODO arrumar depois
	        var elem = $('#form-hist-tel');

	        // Escondendo os form-groups com inputs hidden
	        elem.find(".form-group").each(function () {
	            if ($(this).find("input[type=hidden]").length) $(this).addClass("hide");
	        });

	        self.removerFormEmail();
	    },

	    removerFormTel : function(){
	        //	        $('#divFormEmail').empty();
	        $("#divFormHistTelefonico").hide();
	    },

	    formEnviarEmail: function () {

	    	App.loadingView.reveal();

	        var self = this;
	        var idioma = new IdiomaCollection();
	        var grupoestrutura = new GrupoEstruturaCollection();
	        var historico = new RelatorioPericulosidadeCollection();

	        var urlIdioma = App.config.baseUrl() + "Sistema/ExpressaoIdioma/94/Exibir";
	        var urlGrupoEstrutura = App.config.baseUrl() + "Sistema/GrupoEstrutura/" + $('#polo').val() + "/Id5E";

	        var urlhistoricoEmail = App.config.baseUrl() + "PAP/NotificacaoDesempenhoAluno/" + self.modelClicado.get("idSalaVirtualOferta") + "/HistoricoEmail/?idUsuarioEnviado=" + self.modelClicado.get("id");

	        App.StorageWrap.setAdaptor(sessionStorage);
	        var user = App.StorageWrap.getItem('user');

	        //Solicitamos ao C# o idioma que corresponde a mensagem:
	        $.when(
				App.Helpers.fetchCollectionDeferred(idioma, urlIdioma),
                App.Helpers.fetchCollectionDeferred(grupoestrutura, urlGrupoEstrutura),
                App.Helpers.fetchCollectionDeferred(historico, urlhistoricoEmail)
			).done(function (responseIdioma, responseGrupoEstrutura, responseHistorico) {

			    var expressaoIdioma = responseIdioma.models[0].get("expressaoIdioma");
			    expressaoIdioma.nome = expressaoIdioma.nome.replace("#aluno#", App.Helpers.toTitleCase(self.collectionHistorico.models[0].get("aluno")));
			    expressaoIdioma.nome = expressaoIdioma.nome.replace("#usuarioLogado#", App.Helpers.toTitleCase(user.nome));
                
			    var grupoEstrutura = responseGrupoEstrutura.models[0].get("grupoEstrutura");
			    var FormMaker = require('libraries/formMaker2');

			    var historico = responseHistorico.models[0].get("itens");

			    
			    var tipo;

			    var mensagemHistorico = '';

			    var icone;			    

			    var divPai = $('.divPai');
                
			    function carregar() {

			        for (var i = 0; historico.length > i ; i++) {

			            if (historico[i]["tipo"] == tipo || tipo == 0) {

			                icone = historico[i]["tipo"] != 1 ? "icon-envelope2" : "icon-phone-square";

			                mensagemHistorico += 
                           '</br><div class="history-child" style="display: block;"><div class="history-details">' +
                           '<a class= "' + icone + '">' + ' - ' + '</a>' +
                            '<h4 class="post-box-username" style="display:inline;">' + historico[i]["nome"] + ' - ' + historico[i]["dataEnvio"] + '</h4>' +
                            '<h4 class="post-box-username">Assunto = ' + historico[i]["assunto"] + '</h4>' + '</br>' +
                            '<div class="history-description" style="width:800px;"><p class="ellipsis-text">' + historico[i]["mensagem"] + '</p></div>',
                            '</div></div>' + '</br></br>';
			            }
			        }

			        if ($("#maisinfo").length) {
			            $("#maisinfo").remove();
			        }

			        divPai.append('<div id="maisinfo">'+mensagemHistorico+'</div>');

			        $("#maisinfo").hide();
			    }

			    if ($("#histTel").length == 0) {

			        $(".divPai").before('<i class="icon-phone-square" style="color: #3b638f;display:inline;></i>'+
                        '<span class="description"><a href="#" id="histTel" style="color: #3b638f; font-size:18px;">Exibir histórico telefônico</a></span>');
			        $(".divPai").before('<i class="icon-envelope2" style="color: #3b638f;display:inline;margin:16px;></i>' +
                        '<span class="description"><a href="#" id="histEm" style="color: #3b638f; font-size:18px;">Exibir histórico de e-mail</a></span>');
			        $(".divPai").before('<i class="icon-stop" style="color: #3b638f;display:inline;></i>' +
                        '<span class="description"><a href="#" id="histCompleto" style="color: #3b638f; font-size:18px;">Exibir histórico completo</a></span>');
			    }
			    

			    $("#histTel").bind("click", function () {
			        tipo = 1;
			        if (!mensagemHistorico == '') {
			            mensagemHistorico = '';
			            $("#maisinfo").slideToggle("slow");
			        }
			        else {
			            mensagemHistorico = '';
			            $("#histTel").on("click", carregar());
			            $("#maisinfo").slideToggle("slow");
			        }
			        return false;
			    });

			    $("#histEm").bind("click", function () {
			        tipo = 2;
			        if (!mensagemHistorico == '') {
			            $("#maisinfo").slideToggle("slow");
			            mensagemHistorico = '';
			        }
			        else {
			            mensagemHistorico = '';
			            $("#histEm").on("click", carregar());
			            $("#maisinfo").slideToggle("slow");
			        }
			        return false;
			    });

			    $("#histCompleto").bind("click", function () {
			        tipo = 0;
			        if (!mensagemHistorico == '') {
			            $("#maisinfo").slideToggle("slow");
			            mensagemHistorico = '';
			        }
			        else {
			            mensagemHistorico = '';
			            $("#histCompleto").on("click", carregar());
			            $("#maisinfo").slideToggle("slow");
			        }
			        return false;
			    });

			    

	            //As opções do formularios. Todos os inputs e grupos.
	            var options = {
	                nome: "form-email",
	                id: "form-email-aluno",
	                classe: "form-horizontal",
	                buttonsContainerClass: "col-sm-10",
	                grupo: [{
	                    exibirComoPanel: false,
	                    titulo: null,
	                    itens: [{
	                        label: "Responder para",
	                        labelSize: "col-sm-1",
	                        tipo: "text",
	                        classe: "form-control input-sm",
	                        inputName: "remetente",
	                        //value: user.email,
	                        value: grupoEstrutura.email,
	                        size: "col-md-4",
	                        placeholder: "Responder para",
	                        validacao: [{
	                            regra: "required",
	                            valor: "true",
	                            msg: "Necessário informar um e-mail caso o aluno queira responder a mensagem."
	                        }, {
	                            regra: "email",
	                            valor: "true",
	                            msg: "Informe um e-mail válido."
	                        }]
	                    }, {
	                        label: "E-mail aluno",
	                        labelSize: "col-sm-1",
	                        tipo: "text",
	                        classe: "form-control  input-sm",
	                        inputName: "destinatario",
	                        value: self.collectionHistorico.models[0].get("email"),
	                        size: "col-md-4",
	                        placeholder: "E-mail aluno",
	                        validacao: [{
	                            regra: "required",
	                            valor: "true",
	                            msg: "Informe o e-mail do aluno."
	                        }, {
	                            regra: "email",
	                            valor: "true",
	                            msg: "Informe um e-mail válido."
	                        }]
	                    },{
	                        label: "Assunto",
	                        labelSize: "col-sm-1",
                            id: "turma",
	                        tipo: "text",
	                        classe: "form-control  input-sm",
	                        inputName: "assunto",
	                        value: self.modelClicado.get("nome_turma"),
	                        rows:"6",
	                        size: "col-md-6",
	                        placeholder: "Mensagem",
	                        validacao: [{
	                            regra: "required",
	                            valor: "true",
	                            msg: "Digite um assunto para mensagem."
	                        }, {
	                            regra: "maxlength",
	                            valor: "200",
	                            msg: "O texto é muito grande."
	                        }]
	                    }, {
	                        label: "Mensagem",
	                        labelSize: "col-sm-1",
	                        tipo: "textarea",
	                        classe: "form-control  input-sm",
	                        inputName: "mensagem",
	                        value: "", //expressaoIdioma.nome,
                            rows:"6",
	                        size: "col-md-6",
	                        placeholder: "Mensagem",
	                        validacao: [{
	                            regra: "required",
	                            valor: "true",
	                            msg: "Digite a mensagem que deseja enviar para o aluno."
	                        }, {
	                            regra: "maxlength",
	                            valor: "7900",
	                            msg: "O texto é muito grande."
	                        }]
	                    }, {
	                        tipo: "hidden",
                            id: "cd_turma",
	                        classe: "form-control  input-sm",
	                        inputName: "cd_turma",
	                        value: self.modelClicado.get("cd_turma")
	                    }, {
	                        tipo: "hidden",
	                        id: "RU",
	                        classe: "form-control  input-sm",
	                        inputName: "RU",
	                        value: self.modelClicado.get("RU")
	                    }, {
	                        tipo: "hidden",
	                        id: "idSalaVirtualOferta",
	                        classe: "form-control  input-sm",
	                        inputName: "idSalaVirtualOferta",
	                        value: self.modelClicado.get("idSalaVirtualOferta")
	                    }, {
	                        tipo: "hidden",
	                        id: "idUsuarioEnviado",
	                        classe: "form-control  input-sm",
	                        inputName: "idUsuarioEnviado",
	                        value: self.modelClicado.get("id")
	                    },
	                    {
	                        tipo: "hidden",
	                        id: "tipo",
	                        classe: "form-control  input-sm",
	                        inputName: "tipo",
	                        value: 2
	                    }]
	                }],
	                botoes: [{
	                    text: "Enviar",
	                    tipo: "submit",
	                    classe: "btn btn-primary",
                        id: "enviar"
	                }, {
	                    text: "Cancelar",
	                    tipo: "button",
	                    classe: "btn btn-default",
	                    id: "cancelarFormEmail"
	                }]
	            }

	            //Instancia do Form com as opções:
	            var form = new FormMaker(options);

	            //Objeto do Backbone renderizado.
	            var formRenderizado = form.render().$el;

			    // Form Events
	            form.on('formview:submit', function (data) {
	                var m = Backbone.Model.extend();
	                var c = Backbone.Collection.extend({ model: m });
	                var collection = new c();
	                //collection.url = App.config.baseUrl() + "PAP2/RelatorioDesempenhoAluno";
	                collection.url = App.config.baseUrl() + "PAP/RelatorioDesempenhoAluno";
	                var create = collection.create(data, {
	                    wait: true,
	                    success: function (response) {
	                        var addZero = function (n) { return (n < 10) ? '0' + n : n; };

	                        var hoje = new Date();

	                        var day = addZero(hoje.getDate());
	                        var month = addZero(hoje.getMonth() + 1);
	                        var year = hoje.getFullYear().toString();
	                        var hours = addZero(hoje.getHours());
	                        var minutes = addZero(hoje.getMinutes());
	                        var seconds = addZero(hoje.getSeconds());

	                        var dataEnvio = day + "/" + month + "/" + year + " " + hours + ":" + minutes+ ":" + seconds;

	                        var idTR = self.modelClicado.cid
	                        $("#"+idTR + " tr td:last").html(dataEnvio);

	                        var opcoes = {
	                            body: "E-mail enviado.",
	                            strong: "",
	                            type: "success",
	                            appendTo: "#areaMessageHolder"
	                        }
	                        $("#divFormEmail").empty();
	                        App.flashMessage( opcoes );
	                    }, 
	                    error: function (error) {
	                        var opcoes = {
	                            body: "Falha ao enviar e-mail.",
	                            strong: "",
	                            type: "warning",
	                            appendTo: "#divFormEmail"
	                        }
	                        $("#divFormEmail").empty();
	                        App.flashMessage(opcoes);
	                        console.log(error);
	                    }
	                });
	                $.when(create).done(function () {
	                    App.Helpers.animatedScrollTop();
	                });
	            });

	            self.$el.find('#form-compor').html(formRenderizado);

	            // Esconde o spinner
	            App.loadingView.hide();
	            
	            $("#divFormEmail").show();
	            $("#divFormEmail").find("legend").remove(); /// @TODO arrumar depois
	            var elem = $('#form-email-aluno');
	            self.removerFormTel();

			    // Escondendo os form-groups com inputs hidden
	            elem.find(".form-group").each(function () {
	                if ($(this).find("input[type=hidden]").length) $(this).addClass("hide");
	            });
			});
	    },
	    removerFormEmail : function(){
	        //	        $('#divFormEmail').empty();
	        $("#divFormEmail").hide();
	    },
	    onRender: function () {
	    	// Mostra o Loading
			App.loadingView.reveal();

	        var form = this.criarCombo();
	        this.$el.find('#form').append(form);
	        //var divTable = $('<div>');
	        //divTable.attr('id', 'resultTable');
	        //this.$el.find('#lista').append(divTable);
	        this.$el.find('#detalhe').hide();
	    },
	    onShow: function () {
	    	App.loadingView.reveal();

	    	var objPolo, objTurma, objCurso, objSistema, objModulo;
	    	var construirComboCurso = function () {
	    	    //var urlCurso = App.config.baseUrl() + "PAP2/RelatorioCursosPolo/{valor}/Cursos?idSistema=" + $("#codigoSistema").val();
	    	    var urlCurso = App.config.baseUrl() + "PAP/RelatorioCursosPolo/{valor}/Cursos?idSistema=" + $("#codigoSistema").val();
	    	    objCurso = new Combobox();
	    	    objCurso.url = urlCurso;
	    	    objCurso.idObjCombo = "codigoCurso";
	    	    objCurso.msgNaoEncontrado = "Nenhum curso encontrado.";
	    	    objCurso.valorOption = "cd_curso";
	    	    objCurso.textoOption = "curso";
	    	    objCurso.nomeObjRetorno = "cursos";
	    	    objCurso.textoInicial = "Todos";
	    	    objCurso.popularAoIniciar = false;
	    	    objCurso.autoComplete = true;
	    	    objCurso.change = construirComboTurma;
	    	    objCurso.exibirPrimeiraOpcao = false;
	    	    objCurso.idObjComboPai = "polo";
	    	    objCurso.render();

                $("#codigoCurso").parent().parent().show();
                $('.select2-hidden-accessible').hide();
	        };

	    	var construirComboTurma = function () {
	    	    //App.config.baseUrl() + "pap

	    	    if ($("#codigoSistema").val() == 1) {

	    	        //var urlModulo = App.config.baseUrl() + "PAP2/RelatorioCursosPolo/{valor}/Modulo?idPolo=" + $("#polo").val();
	    	        var urlModulo = App.config.baseUrl() + "PAP/RelatorioCursosPolo/{valor}/Modulo?idPolo=" + $("#polo").val();
	    	        objModulo = new Combobox();
	    	        objModulo.url = urlModulo;
	    	        objModulo.idObjCombo = "codigoModulo";
	    	        objModulo.msgNaoEncontrado = "Nenhum módulo encontrado.";
	    	        objModulo.valorOption = "cd_modulo";
	    	        objModulo.textoOption = "nome_modulo";
	    	        objModulo.nomeObjRetorno = "modulo";
	    	        objModulo.textoInicial = "Todos";
	    	        objModulo.popularAoIniciar = false;
	    	        objModulo.autoComplete = true;
	    	        objModulo.change = comboTurma;
	    	        objModulo.exibirPrimeiraOpcao = false;
	    	        objModulo.idObjComboPai = "codigoCurso";
	    	        objModulo.render();

	    	        $("#codigoModulo").parent().parent().show();
	    	        $('.select2-hidden-accessible').hide();
	    	    }
	    	    else
	    	    {
	    	        //var urlTurma = App.config.baseUrl() + "PAP2/RelatorioCursosPolo/{valor}/Turmas?idPolo=" + $("#polo").val() + "&idSistema=" + $("#codigoSistema").val();
	    	        var urlTurma = App.config.baseUrl() + "PAP/RelatorioCursosPolo/{valor}/Turmas?idPolo=" + $("#polo").val() + "&idSistema=" + $("#codigoSistema").val();
	    	        objTurma = new Combobox();
	    	        objTurma.url = urlTurma;
	    	        objTurma.idObjCombo = "codigoTurma";
	    	        objTurma.msgNaoEncontrado = "Nenhuma turma encontrada.";
	    	        objTurma.valorOption = "cd_turma";
	    	        objTurma.textoOption = "nome_turma";
	    	        objTurma.nomeObjRetorno = "turmas";
	    	        objTurma.textoInicial = "Todas";
	    	        objTurma.popularAoIniciar = false;
	    	        objTurma.autoComplete = true;
	    	        objTurma.exibirPrimeiraOpcao = false;
	    	        objTurma.idObjComboPai = "codigoCurso";
	    	        objTurma.render();

	    	        $("#codigoTurma").parent().parent().show();
	    	        $('.select2-hidden-accessible').hide();

	    	    };
	    	};

	    	var comboTurma = function () {

	    	    //var urlTurma = App.config.baseUrl() + "PAP2/RelatorioCursosPolo/{valor}/TurmasModulo?idPolo=" + $("#polo").val() + "&idSistema=" + $("#codigoSistema").val();
	    	    var urlTurma = App.config.baseUrl() + "PAP/RelatorioCursosPolo/{valor}/TurmasModulo?idPolo=" + $("#polo").val();// + "&idSistema=" + $("#codigoSistema").val();
	    	    objTurma = new Combobox();
	    	    objTurma.url = urlTurma;
	    	    objTurma.idObjCombo = "codigoTurma";
	    	    objTurma.msgNaoEncontrado = "Nenhuma turma encontrada.";
	    	    objTurma.valorOption = "cd_turma";
	    	    objTurma.textoOption = "nome_turma";
	    	    objTurma.nomeObjRetorno = "turmas";
	    	    objTurma.textoInicial = "Todas";
	    	    objTurma.popularAoIniciar = false;
	    	    objTurma.autoComplete = true;
	    	    objTurma.exibirPrimeiraOpcao = false;
	    	    objTurma.idObjComboPai = "codigoCurso";
	    	    objTurma.render();

	    	    $("#codigoTurma").parent().parent().show();
	    	    $('.select2-hidden-accessible').hide();

	    	};

	    	var verificaCombos = function () {

	    	    if ($("#codigoTurma").is(':visible') || $("#codigoCurso").is(':visible')) {
	    	        //$("#codigoCurso").parent().parent().hide();
	    	        construirComboCurso();
	    	        $("#codigoTurma").parent().parent().hide();
	    	        $("#codigoModulo").parent().parent().hide();
	    	        $('.select2-hidden-accessible').hide();
	    	    };
	    	};

            //App.config.baseUrl()
	    	//var urlSistema = App.config.baseUrl() + "Sistema/Sistema/0/Sistemas";
	        objSistema = new Combobox();
	        objSistema.idObjCombo = "codigoSistema";
	        //objSistema.url = urlSistema;
	        objSistema.msgNaoEncontrado = "Nenhum sistema encontrado.";
	        objSistema.valorOption = "idSistema";
	        objSistema.textoOption = "nome";
	        objSistema.nomeObjRetorno = "sistemas";
	        //objSistema.textoInicial = "Selecione";
	        objSistema.popularAoIniciar = true;
	        objSistema.autoComplete = false;
	        //objSistema.exibirPrimeiraOpcao = false;
	        objSistema.change = verificaCombos;
	        //objSistema.valorSelecionado = 1;
	        
	        objSistema.render();
	        objSistema.adicionarValor({ idSistema: 1, nome: "AVA Univirtus" });
	        objSistema.adicionarValor({ idSistema: 5, nome: "AVA Claroline" });
	        
	        objSistema.alterarValorSelecionado(1);
	        
	        objSistema.ajaxCompleto();


	        var urlPolo = App.config.baseUrl() + "Sistema/GrupoEstrutura/0/Polos";
	        objPolo = new Combobox();
	        objPolo.idObjCombo = "polo";
	        objPolo.url = urlPolo;
	        objPolo.msgNaoEncontrado = "Nenhum pólo encontrado.";
	        objPolo.valorOption = "id5E";
	        objPolo.textoOption = "nome";
	        objPolo.nomeObjRetorno = "grupoEstruturas";
	        objPolo.textoInicial = "Selecione";
	        objPolo.popularAoIniciar = true;
	        objPolo.autoComplete = true;	        
	        objPolo.change = construirComboCurso;
	        objPolo.successCallback = App.loadingView.hide();
	        objPolo.render();

	        var objSituacao = new Combobox();
	        objSituacao.idObjCombo = "situacao";
	        objSituacao.msgNaoEncontrado = "Nenhuma situação encontrada.";
	        //objSituacao.textoInicial = "Todos";
	        objSituacao.valorOption = "id";
	        objSituacao.textoOption = "valor";
	        objSituacao.nomeObjRetorno = "situacao";
	        objSituacao.popularAoIniciar = true;
	        objSituacao.autoComplete = false;
	        //objSituacao.exibirPrimeiraOpcao = false;
	        objSituacao.render();
	        objSituacao.adicionarValor({ id: 0, valor: "Todos" });
	        objSituacao.adicionarValor({ id: 1, valor: "Ativos" });
	        objSituacao.adicionarValor({ id: 2, valor: "Inativos" });
	        //objSituacao.valorSelecionado = "0";
	        objSituacao.alterarValorSelecionado(0);
	        objSituacao.ajaxCompleto();

	        $("#codigoModulo").parent().parent().hide();
	        $("#codigoCurso").parent().parent().hide();
	        $("#codigoTurma").parent().parent().hide();
	        $('.select2-hidden-accessible').hide();

	    }
	});
});
