var grid = (function () {

    var clsGrid = function () {

        var objGridContainer;
        var objGrid;
        var objCabecalho;
        var objCorpo;
        var objTRodape;
        var objLinhaCabecalho;
        var objColunaCabecalho = new Object();
        var objLinhas = new Object();
        var totalColunas = 0;
        var objTRSelecionado = null;
        var objColunaSelecionada = null;
        var funcaoUsuarioLinhaClick = null;
        var funcaoUsuarioColunaClick = null;
        var funcaoUsuarioFiltroBotaoOk = null; //funcao de ok do filtro e de ordenacao dos campos
        var funcaoUsuarioExportar = null;
        var objDivPesquisa = null;
        var objDivPesquisaGrupo = null;
        var objFiltroContainerBotaoPesquisa = null;
        var objMenuItem = new Object();
        var objDivJanelaCriterioPesquisaDialogoCorpo = null;
        var objGridContainerFiltrados = null;
        var objDivContainerFiltroCamposSelecionados = null;
        var objFiltroCamposFiltrados = new Object();
        var objGridContainerPaginacaoRodape = null;
        var objGridContainerPaginacaoTopo = null;
        var paginaAtual = 1;
        var quantidadePaginas = 1;
        var objSpanQuantidadePaginaTopo = null;
        var objSpanQuantidadePaginaRodape = null;
        var objPaginacaoInputPaginaAtualTopo = null;
        var objPaginacaoInputPaginaAtualRodape = null;
        var objColunasOrdenacao = new Object();
        var objDivJanelaCriterioPesquisa = null;
        var objGridContainerPesquisaEFiltrados = null;
        var strCamposOrdenar = "";
        var ocultarCabecalho = false; //nao exibe cabecalho na grid
        var arrColunasCabecalho = new Array();
        var ativarPonteiroMao = false;
        var objDivTopo_Left = null;
        var objTotalRegistros = null;
        
        var idInterfaceSistemaExportar;
        var totalRegistros = 0;
        var nomeGrid = "";
        var objFiltroGrid = new Object();
        var objDivJanelaCriterioPesquisaDialogoBotaoConfirmar = null;
        var filtroFixo = null; //filtro fixo nos parametros do json
        var idValidarSelect = null;
        var self = this;

        
        this.filtroMenuModal = true; // monta filtro no formato menu
        this.container = void (0); //container onde a grid foi desenhada.
        this.clickFuncaoExportar = null; //sobrescreve funcao de click da exportacao, Por padrao utiliza sistema/PaginacaoExportar

        var exibirBtnLimpar = false; //exibe btn para limpar dados do campo

        this.getCamposFiltrados = function () {
            return objFiltroCamposFiltrados;
        }
        this.getFiltroGrid = function () {
            return objFiltroGrid;
        }
        
        this.criarGrid = function (nome, _filtroTipoModal) {

            if (typeof (objGrid) == 'undefined') {

                if (nome !== undefined) {
                    nomeGrid = "_" + nome;
                }
                //_filtroTipoModal: se filtro é com modal ou direto no HTML
                if (_filtroTipoModal !== undefined) 
                    self.filtroMenuModal = _filtroTipoModal;                

                if (!self.filtroMenuModal)
                    exibirBtnLimpar = true;

                //objetos usados na grid
                objGridContainer = document.createElement("div");
                objGridContainerPesquisa = document.createElement("div");
                objGridContainerFiltrados = document.createElement("div");
                objGridContainerPesquisaEFiltrados = document.createElement("div");
                objGridContainerPaginacaoTopo = document.createElement("div");
                objGridContainerPaginacaoRodape = document.createElement("div");

                objDivPesquisaOpcoes = document.createElement("div");

                objSpanQuantidadePaginaTopo = document.createElement("span");
                objSpanQuantidadePaginaRodape = document.createElement("span");
                //objGridContainer.setAttribute("class", "two-columns");

                objDivPesquisa = document.createElement("div");
                objDivPesquisaGrupo = document.createElement("div");
                objFiltroContainerBotaoPesquisa = document.createElement("div");

                objDivJanelaCriterioPesquisa = document.createElement("div");

                objGrid = document.createElement("table");
                objCabecalho = document.createElement("thead");
                objCorpo = document.createElement("tbody");
                objTRodape = document.createElement("tfoot");
                objLinhaCabecalho = document.createElement("tr");
                objDivTopo_Left = document.createElement("div");

                objGrid.setAttribute("class", "table table-hover table-striped uninter-grid");

                objGridContainerPesquisa.setAttribute("class", "col-sm-8");
                objGridContainerFiltrados.setAttribute("class", "col-sm-4");
                objGridContainerPesquisaEFiltrados.setAttribute("class", "row");

                objGridContainerPaginacaoTopo.setAttribute("class", "grid-pagination pull-right");
                objGridContainerPaginacaoTopo.style.display = 'none';
                objGridContainerPaginacaoRodape.setAttribute("class", "grid-pagination pull-right");
                objGridContainerPaginacaoRodape.style.display = 'none';

                var objDivTopo_Right = document.createElement("div");
                objDivTopo_Right.setAttribute("class", "col-md-5");
                objDivTopo_Right.appendChild(objGridContainerPaginacaoTopo);

                //var objDivTopo_Center = document.createElement("div");
                //objDivTopo_Center.setAttribute("class", "col-md-1");
                //objDivTopo_Center.setAttribute("style", "display: inline-block;margin: 14px 0;");

                
                
                objTotalRegistros = document.createElement("ol");
                objTotalRegistros.setAttribute("class", "grid-breadcrumb");

                var objDivTotal = document.createElement("div");
                objDivTotal.setAttribute("style", "margin: 20px 30px 0 0;display: inline-block");
                objDivTotal.appendChild(objTotalRegistros);

                objDivTopo_Left.setAttribute("class", "col-md-7");                
                objDivTopo_Left.appendChild(objDivTotal);

                objGridContainerPesquisaEFiltrados.appendChild(objGridContainerPesquisa);
                objGridContainerPesquisaEFiltrados.appendChild(objGridContainerFiltrados);

                //Caso seja usada a função novaJanela(), quando clicar na ferramenta de pesquisa, será chamada a pesquisa da pagina sobreposta.
                //Foi colocado o nomeGrid (passado como parametro) como complemento do identificador para o objeto.
                objDivPesquisa.id = "grid-search" + nomeGrid;
                objDivPesquisa.setAttribute("class", "search-tools");
                objDivPesquisa.setAttribute("class", "search-tools");

                objDivPesquisaOpcoes.setAttribute("class", "search-options");

                objDivPesquisaGrupo.id = "divPesquisaGrupo";
                objDivPesquisaGrupo.setAttribute("class", "dropdown-group");

                objFiltroContainerBotaoPesquisa.setAttribute("class", "btn-group");

                objDivJanelaCriterioPesquisa.setAttribute("class", "modal fade filter-modal");
                objDivJanelaCriterioPesquisa.id = "janelaCriterioPesquisa" + nomeGrid;

                //Insere na tabela
                objGrid.appendChild(objCabecalho);
                objGrid.appendChild(objCorpo);
                objGrid.appendChild(objTRodape);

                objDivPesquisa.appendChild(objFiltroContainerBotaoPesquisa);

                objDivPesquisaOpcoes.appendChild(objDivPesquisaGrupo);
                objDivPesquisa.appendChild(objDivPesquisaOpcoes);
                objGridContainerPesquisa.appendChild(objDivPesquisa);

                objGridContainer.appendChild(objGridContainerPesquisaEFiltrados);


                objGridContainer.appendChild(objDivJanelaCriterioPesquisa);

                criarJanelaCriterioPesquisa();

                var divTopo = document.createElement("div");
                divTopo.setAttribute("class", "row");
                divTopo.setAttribute("class", "cabecalhoGRID");
                divTopo.id = "cabecalhoGRID" + nomeGrid;
                divTopo.appendChild(objDivTopo_Left);
                //divTopo.appendChild(objDivTopo_Center);
                divTopo.appendChild(objDivTopo_Right);
                objGridContainer.appendChild(divTopo);
                objGridContainer.appendChild(objGrid);
                objGridContainer.appendChild(objGridContainerPaginacaoRodape);
                //filtroCriarBotaoPesquisa();
                criarPaginacao();


                //if (!self.filtroMenuModal)
                    //filtroAdiconarGrupoMenuLinha();

            }

            return objGridContainer;
        }

        this.setFuncaoLinhaClick = function (objFunction) {
            if (typeof (objFunction) == "function") {
                funcaoUsuarioLinhaClick = objFunction;
            } else {
                console.warn(objFunction + " não é uma função");
            }
        }

        this.setFuncaoColunaClick = function (objFunction) {
            if (typeof (objFunction) == "function") {
                funcaoUsuarioColunaClick = objFunction;
            } else {
                console.warn(objFunction + " não é uma função");
            }
        }

        this.setFuncaoUsuarioFiltroBotaoOk = function (objFunction) {
            if (typeof (objFunction) == "function") {
                funcaoUsuarioFiltroBotaoOk = objFunction;
            } else {
                console.warn(objFunction + " não é uma função");
            }
        }

        this.setFuncaoUsuarioExportar = function (objFunction) {
            if (typeof (objFunction) == "function") {
                funcaoUsuarioExportar = objFunction;

            } else {
                console.warn(objFunction + " não é uma função");
            }
        }

        this.setInterfaceSistema = function (_idInterfaceSistema) {
            idInterfaceSistemaExportar = _idInterfaceSistema;
        }

        /**
        * Cria um objeto coluna para grid
        *
        */
        this.coluna = function (_id, _nome, _ordena, _tipoInput, _classe) {
            objColuna = new Object();
            objColuna.id = _id;
            objColuna.nome = _nome;
            objColuna.ordena = _ordena; //identificador da coluna de ordenacao
            objColuna.tipoInput = _tipoInput == null ? "text" : _tipoInput;
            objColuna.classe = _classe == null ? '' : _classe;
            return objColuna;
        }

        this.adicionarColuna = function (objColuna) {
            var objTh = document.createElement("th");
            var objText = document.createTextNode(objColuna.nome);

            objTh.appendChild(objText);
            objTh.id = objColuna.id;
            var classe = objColuna.classe;
            objTh.setAttribute("class", classe);

            //so adiciona na interface se nao estiver configurado para ocultar cabecalho           
            if (ocultarCabecalho === false) {

                objLinhaCabecalho.appendChild(objTh);
                objCabecalho.appendChild(objLinhaCabecalho);
            }
            if (objColuna.ordena != null) {
                var objThi = document.createElement("i");
                objThi.setAttribute("class", "icon-unsorted");
                objTh.appendChild(objThi);
            }


            var colunaClick = function (objTh) { return function () { _colunaClick(objColuna) } };
            objTh.onclick = colunaClick(objTh);
            objColunaCabecalho[objColuna.id] = { id: objColuna.id, valor: "", ordem: objColuna.nome, ordena: objColuna.ordena, tipoInput: objColuna.tipoInput, classe: objColuna.classe };

            arrColunasCabecalho[totalColunas] = { id: objColuna.id, valor: "", ordem: objColuna.nome, ordena: objColuna.ordena, tipoInput: objColuna.tipoInput, classe: objColuna.classe };
            totalColunas += 1;

        }

        this.filtroAdicionarColunaOrdenacao = function (nome, id) {
            objColunasOrdenacao[nome] = { id: id, ordenada: 0, elementoI: null, ordem: id };
        }

        var setOrdenacao = function () {
            var strSeparador = "";
            var strOrdenacao = "";
            for (var coluna in objColunasOrdenacao) {
                if (objColunasOrdenacao[coluna].ordenada > 0) {
                    var tipo = objColunasOrdenacao[coluna].ordenada == 1 ? "|1" : "|2";
                    strOrdenacao += strSeparador + objColunasOrdenacao[coluna].ordem + tipo;
                    strSeparador = ',';
                }
            }
            strCamposOrdenar = strOrdenacao;
        }

        /**
        *   Exibe coluna especificada
        *   indiceColuna = indice da coluna que será exibida
        *   exibir = true(padrao)/false 
        **/
        this.setColunaVisivel = function (idColuna, exibir) {
            var totalLinhas = objCorpo.rows.length;
            var objTh = getColunaCabecalhoId(idColuna);
            if (objTh) {
                var indiceColuna = objTh.cellIndex;
                var exibeColuna = ((exibir == true) ? "" : "none");
                //aplica ao cabecalho
                objTh.style.display = exibeColuna;
                //aplica todas as celulas da coluna
                for (var x = 0 ; x < totalLinhas ; x++) {
                    var objTd = objCorpo.rows[x].cells[indiceColuna];
                    objTd.style.display = exibeColuna;
                }
            }
        }

        /**
        *  Retorna objeto th da coluna especificada
        *  indiceColuna = indice da coluna que será returnada (inicia em zero)
        **/
        var getColunaCabecalhoIndice = function (indiceColuna) {
            var objTh = objCabecalho.rows[0].cells[indiceColuna];
            return objTh;
        }

        var getColunaCabecalhoId = function (idColuna) {
            var objTh = document.getElementById(idColuna);
            return objTh;
        }

        var setColunaOrdenacao = function (objeto) {
            if (objColunasOrdenacao[objeto.ordena]) {
                var ordenada = objColunasOrdenacao[objeto.ordena].ordenada;
                if (ordenada != null) {
                    var objTh = document.getElementById(objeto.id);

                    var elementoI = objTh.getElementsByTagName("i");
                    if (ordenada == 0 || ordenada == 1) {
                        elementoI[0].setAttribute("class", "icon-sort-down");
                        objColunasOrdenacao[objeto.ordena].ordenada = 2;
                        setOrdenacao();
                    } else if (ordenada == 2) {
                        elementoI[0].setAttribute("class", "icon-sort-up");
                        objColunasOrdenacao[objeto.ordena].ordenada = 1;
                        setOrdenacao();
                    }
                }
            }
        }

        /**
        * Retorna linha selecionada.
        *
        * @public
        */
        this.linha = function () {
            return objColunaCabecalho;
        }

        this.excluirLinhas = function () {
            try {
                objCorpo.innerHTML = "";
            } catch (e) {
                console.error(e);
            }
        }

        this.setLinhaPonteiroMao = function (ativo) {
            ativarPonteiroMao = ativo;
        }

        this.adicionarLinha = function (objetoLinha) {

            objGridContainerPaginacaoTopo.style.display = "";
            objGridContainerPaginacaoRodape.style.display = "";

            var numeroLinhaInserir = objCorpo.rows.length;
            var objTr = objCorpo.insertRow(numeroLinhaInserir);
            var _linha = new Object();

            if (ativarPonteiroMao == true) {
                objTr.setAttribute("style", "cursor:pointer;");
            }

            var numeroCelula = 0;
            objTr.id = gerarRamdomico();

            for (celula in objetoLinha) {

                var valor = objetoLinha[celula];
                _linha[celula] = valor;
                
                var tipoInput = arrColunasCabecalho[numeroCelula].tipoInput;
                var objTd = objTr.insertCell(numeroCelula);
                if ((tipoInput == "select" || tipoInput == "input") && valor != void (0) && valor != null) {
                    objTd.appendChild(valor);
                } else {
                    objTd.innerHTML = valor;
                }


                //herda classe do TH                
                var classe = "gridColuna" + celula + " " + arrColunasCabecalho[numeroCelula].classe;
                if (classe != "") {
                    objTd.setAttribute("class", classe);
                }

                numeroCelula += 1;
            }
            _linha['idObjeto'] = objTr.id;
            objLinhas[objTr.id] = _linha;
            criarFunctionOnClick(objTr);
        }

        this.getObjetoLinhaSelecionada = function () {
            return objLinhas[objTRSelecionado.id];
        }

        this.getObjetoColunaSelecionada = function () {
            return objColunaSelecionada;
        }

        var criarFunctionOnClick = function (objTR) {
            var funcaoOnClick = function (objTR) { return function () { _linhaClick(objTR); } };
            objTR.onclick = funcaoOnClick(objTR);
        }

        var _linhaClick = function (objTR) {
            objTRSelecionado = objTR;
            if (typeof (funcaoUsuarioLinhaClick) == "function") {
                funcaoUsuarioLinhaClick(objLinhas[objTRSelecionado.id]);
            }
        }

        var _colunaClick = function (coluna) {
            objColunaSelecionada = coluna;

            if (typeof (funcaoUsuarioColunaClick) == "function") {
                funcaoUsuarioColunaClick(objColunaSelecionada);
            }
            setColunaOrdenacao(objColunaSelecionada);
            filtroAplicar();
        }

        var gerarRamdomico = function () {
            var ramdomicoGerado = "";
            var valorRandomico = "";
            for (var x = 0 ; x < 5 ; x++) {
                var valorRandomico = Math.floor((Math.random() * (122 - 97) + 97));
                ramdomicoGerado += String.fromCharCode(valorRandomico);
            }
            return ramdomicoGerado;
        }

        this.filtroCriarBotaoPesquisa = function (textoBotao) {
            
            if (self.filtroMenuModal) {
                if (textoBotao == "" || textoBotao == null) {
                    textoBotao = "Ferramentas Pesquisa";
                }

                var objFiltroBotaoPesquisa = document.createElement("button");
                var objFiltroBotaoPesquisaIcone = document.createElement("i");
                var objTexto = document.createTextNode(textoBotao);

                var objFnBotaoPesquisar = function () { return function (objFiltroBotaoPesquisa) { exibeOcultaOpcoesPesquisa(objFiltroBotaoPesquisa); } };
                objFiltroBotaoPesquisa.onclick = objFnBotaoPesquisar();

                objFiltroBotaoPesquisa.type = "button";
                objFiltroBotaoPesquisa.id = "search-filter-options" + nomeGrid;
                objFiltroBotaoPesquisa.setAttribute("class", "btn btn-primary has-icon left");
                objFiltroBotaoPesquisaIcone.setAttribute("class", "icon-filter");
                objFiltroBotaoPesquisa.appendChild(objFiltroBotaoPesquisaIcone);
                objFiltroBotaoPesquisa.appendChild(objTexto);
                objFiltroContainerBotaoPesquisa.appendChild(objFiltroBotaoPesquisa);
            }
            else {                
                objDivPesquisaGrupo.innerHTML = "";
                objDivPesquisaGrupo.setAttribute("class", "");

                objDivJanelaCriterioPesquisa.innerHTML = "";
                objDivJanelaCriterioPesquisa.setAttribute("class", "");
                //objDivJanelaCriterioPesquisa.style.display = "none";

                var idAccordionPesquisa = "accordionPeqsuisaGrid" + nomeGrid;
                var objBtnConfirmar = $("<button>").addClass("btn btn-primary").html("Localizar").off("click").on("click", function () {
                    filtroFuncaoBotaoOkLinha();
                    $(objGridContainerPesquisaEFiltrados).find("#" + idAccordionPesquisa + " li").removeClass("active");
                });
                var objBtnLimpar = $("<button>").addClass("btn btn-default").html("Limpar").off("click").on("click", function () {					
                    $("#" + objDivJanelaCriterioPesquisa.id + " input.form-control").val("");
                    $("#" + objDivJanelaCriterioPesquisa.id + " select.form-control").select2("val", "");
                    $("#" + objDivJanelaCriterioPesquisa.id + " :checkbox").prop("checked", false);
                    filtroFuncaoBotaoOkLinha();
                    $(objGridContainerPesquisaEFiltrados).find("#" +idAccordionPesquisa + " li").removeClass("active");
                });

                var objLi = $("<li>").addClass("un-accordion-item sv-item").html('<header class="un-accordion-header sv-header btn-default">'
                                    + '<div class="sv-item-title"><h2><i class="icon-search"></i> Pesquisar</h2></div>'
                                    + '<div class="sv-status"><span class="un-accordion-status">'
                                    + '<i class="un-accordion-status-close icon-chevron-up"></i><i class="un-accordion-status-open icon-chevron-down"></i>'
                                    + '</span></div></header>');
                var midContainer = $("<div>").addClass("mid-container").html("<div id='divInputsPesquisa'></div>").append(objBtnConfirmar).append(objBtnLimpar);                
                var svHolder = $("<div>").addClass("sv-holder").html($("<div>").addClass("un-accordion-content").html(midContainer));
                objLi.append(svHolder);

                var objUl = $("<ul>").addClass("un-accordion salas-virtuais parent accordionPeqsuisaGrid").attr("id", idAccordionPesquisa).html(objLi);
                
                
                $(objGridContainerPesquisaEFiltrados).html($(objDivJanelaCriterioPesquisa).html(objUl));
                
                UNINTER.viewGenerica.iniciarAccordion({
                    'element': "#" + idAccordionPesquisa,
                    'closeInactive': false,
                    'speed': 1000,
                    'onToggle': function (e) {
                        
                        var target = $(e.currentTarget);
                        if (target.parent().hasClass('clicked')) {
                            UNINTER.viewGenerica.setPlaceholderHeight();
                            return;
                        }
                        target.parent().addClass('clicked');
                        
                        setTimeout(function () {                            
                            UNINTER.viewGenerica.setPlaceholderHeight();
                        }, 500);
                        
                    }
                });
                
            }
        }

        /*
        *  Exibe o botão de pesquisa
        *  
        */
        this.filtroExbirBotaoPesquisa = function (exibir) {
            if (exibir) {
                objDivPesquisa.style.display = "";
            } else {
                objDivPesquisa.style.display = "none";
            }            
        }



        /*
        *  Exibe o botão de pesquisa
        *  
        */


        this.exportarAdicionarBotao = function (tipo, titulo) {
            
            //busca string de filtro
            if (titulo == null || titulo == void (0))
                titulo = '';

            var objElemento = $("<img>").attr("title", 'Baixar Relatório');
            switch(tipo){
                case 'xls':
                case 'csv':
                default:
                    objElemento.attr("src", "img/icons/icon-xls-32.png");                
                    break;
                case 'doc':
                    objElemento.attr("src", "img/icons/icon-doc-32.png");
                    break;
                case 'pdf':
                    objElemento.attr("src", "img/icons/icon-pdf-32.png");
                    break;
            }
            
            var fnClick = function (tipo) {
                return function () {
                    
                }
            };
            
            var objLink = $("<a>").attr("href", "javascript: void(0)").off("click").on("click", function () {
                
                var strFiltro = "";
                var strSeparador = "";
                for (objFiltro in objFiltroCamposFiltrados) {
                    strFiltro += strSeparador + objFiltroCamposFiltrados[objFiltro];
                    strSeparador = "|";
                }                

                if (typeof (self.clickFuncaoExportar) == "function") {
                    self.clickFuncaoExportar(strFiltro, paginaAtual, strCamposOrdenar, totalRegistros);

                } else {
                    var url = funcaoUsuarioExportar(strFiltro, paginaAtual, strCamposOrdenar, totalRegistros);

                    if (url == null || url == void (0)) {
                        console.error("URL não informada");
                    }
                    else {
                        var caminhoHTTPSistema = UNINTER.AppConfig.UrlWs("sistema");
                        var urlFiltro = caminhoHTTPSistema + "PaginacaoExportar/" + UNINTER.StorageWrap.getItem('user').token + "/Exportar/" + idInterfaceSistemaExportar + "/?formato=" + tipo + "&titulo=" + titulo + "&url=" + encodeURIComponent(url);
                        window.open(urlFiltro);
                    }
                }
                
            }).html(objElemento);
            
            $(objDivTopo_Left).prepend($("<div>").attr("style", "margin: 14px 3px;cursor: pointer;display: inline-block;").html(objLink));
            
            $(objDivTopo_Left).find(".grid-breadcrumb").attr("style", "margin-left: 10px");
        }

        this.filtroAdiconarGrupoMenu = function (id, texto) {
            if (self.filtroMenuModal) {
                var objDivFiltroCriaGrupoMenu = filtroCriaGrupoMenu(id, texto);
                objDivPesquisaGrupo.appendChild(objDivFiltroCriaGrupoMenu);
                return objDivFiltroCriaGrupoMenu;
            }
        }

        this.filtroAdicionarGrupoMenuItem = function (objDivFiltroCriaGrupoMenu, id, texto, lista) {
            if (self.filtroMenuModal) {
                var objFiltroCriaGrupoMenuItemUl = filtroCriaGrupoMenuItemUl(objDivFiltroCriaGrupoMenu);
                var objFiltroCriaGrupoMenuItemLi = filtroCriaGrupoMenuItemLi(id, texto, lista);
                objFiltroCriaGrupoMenuItemUl.appendChild(objFiltroCriaGrupoMenuItemLi);
                objDivFiltroCriaGrupoMenu.appendChild(objFiltroCriaGrupoMenuItemUl);
            }
            else {
                filtroAdiconarGrupoMenuLinhaItem(id, texto, lista);
            }
        }
        

        var filtroAdiconarGrupoMenuLinhaItem = function (id, texto, lista) {
            idValidarSelect = null;
            var objItemForm = criarComponenteFiltro(id, texto, lista);
            
            $(objGridContainerPesquisaEFiltrados).find("#divInputsPesquisa").append(objItemForm);

            if (idValidarSelect) {                
                UNINTER.viewGenerica.validarSelectId(idValidarSelect);
            }
            $(objDivJanelaCriterioPesquisa).find("label.grid-label").addClass("text-info");
        }
        this.AplicarFiltroSession = function (filtro, id, nome) {

            objFiltroCamposFiltrados[id] = filtro;
            
            filtroInserirCampoFiltrado(nome, id);
            paginaAtual = 1;
            objPaginacaoInputPaginaAtualTopo.value = paginaAtual;
            objPaginacaoInputPaginaAtualRodape.value = paginaAtual;
            filtroAplicar();
        }

        //aplica array de filtros {filtro, id, nome, operador}
        this.AplicarFiltroSessionLista = function (arrFiltro, _paginaAtual) {            
            for (var i  in arrFiltro) {                
                objFiltroCamposFiltrados[arrFiltro[i].id] = arrFiltro[i].filtro;
                objFiltroGrid[arrFiltro[i].id] = {
                    id: arrFiltro[i].id,
                    operador: arrFiltro[i].operador,
                    nome: arrFiltro[i].nome,
                    valor: arrFiltro[i].valor,
                    filtro: arrFiltro[i].filtro
                };

                filtroInserirCampoFiltrado(arrFiltro[i].nome, arrFiltro[i].id);
            }            
            paginaAtual = _paginaAtual;
            objPaginacaoInputPaginaAtualTopo.value = paginaAtual;
            objPaginacaoInputPaginaAtualRodape.value = paginaAtual;
            
            filtroAplicar();
        }

        this.setFiltroFuncaoBotaoOk = function (objInput, id, operador, nome) {
            
            filtroFuncaoBotaoOk(objInput, id, operador, nome);
        }

        this.setQuantidadePagina = function (_quantidadePaginas) {
            quantidadePaginas = _quantidadePaginas;
            objSpanQuantidadePaginaTopo.innerHTML = " de " + quantidadePaginas;
            objSpanQuantidadePaginaRodape.innerHTML = " de " + quantidadePaginas;

        }

        this.setTotalRegistros = function (_totalRegistros) {
            
            if (_totalRegistros != null) {
                var obj = $(objTotalRegistros);
				var totalFormat = _totalRegistros.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,").replace(/,/g, '.');


                var htmlTotal = "<span class='text-info'>" + totalFormat + "</span> registros localizados";
                if (obj.find("#grid-breadcrumb-total").length == 0) {

                    var objFiltroRemover = obj.find("#grid-breadcrumb-filtro");
                    if (objFiltroRemover.length == 0)
                        obj.html($("<li>").attr("id", "grid-breadcrumb-total").html(htmlTotal));
                    else
                        objFiltroRemover.before($("<li>").attr("id", "grid-breadcrumb-total").html(htmlTotal));
                }
                else obj.find("#grid-breadcrumb-total").html(htmlTotal);
            }
            
            totalRegistros = _totalRegistros;

        }

        this.setPaginaAtual = function (_paginaAtual) {
            paginaAtual = _paginaAtual;
            objPaginacaoInputPaginaAtualTopo.value = paginaAtual;
            objPaginacaoInputPaginaAtualRodape.value = paginaAtual;
        }

        this.getPaginaAtual = function () {
            return paginaAtual;
        }
        //adiciona linha personalizada que não precisa ter o mesmo nr de colunas do cabecalho. Uzado qdo precisa de colspan
        this.adicionarLinhaPersonalizada = function (objetoLinha) {
            var numeroLinhaInserir = objCorpo.rows.length;
            var numeroColunaPersonalizada = objetoLinha.length;


            var objTr = objCorpo.insertRow(numeroLinhaInserir);
            var _linha = new Object();

            var numeroCelula = 0;
            objTr.id = gerarRamdomico();

            for (celula in objetoLinha) {
                var valor = objetoLinha[celula];
                _linha[celula] = valor;
                var objTd = objTr.insertCell(numeroCelula);
                objTd.innerHTML = valor;
                numeroCelula += 1;
            }

            if (totalColunas > numeroColunaPersonalizada) {
                var colspan = totalColunas - numeroColunaPersonalizada + 1;
                objTd.setAttribute("colspan", colspan);
            }
            _linha['idObjeto'] = objTr.id;
            objLinhas[objTr.id] = _linha;
            criarFunctionOnClick(objTr);
        }

        //oculta cabecalho da grid 
        this.setOcultarCabecalho = function (_ocultarCabecalho) {
            ocultarCabecalho = _ocultarCabecalho;
        }

        this.adicionarLinhaCabecalho = function (objColuna) {


            var numeroLinhaInserir = objCorpo.rows.length;
            var numeroColunaPersonalizada = objColuna.length;


            var objTr = objCorpo.insertRow(numeroLinhaInserir);
            //var _linha = new Object();

            var numeroCelula = 0;
            //objTr.id = gerarRamdomico();

            for (celula in objColuna) {
                //var objTd = document.createElement("th");
                var valor = objColuna[celula];
                var objTd = objTr.insertCell(numeroCelula);
                objTd.innerHTML = valor;
                numeroCelula += 1;
                objTr.appendChild(objTd);
            }

            //_linha['idObjeto'] = objTr.id;
            //objLinhas[objTr.id] = _linha;
            //criarFunctionOnClick(objTr);
        }

        var exibeOcultaOpcoesPesquisa = function (objeto) {
            
            if (self.filtroMenuModal) {
                $(objeto).toggleClass('active');
                $('#grid-search' + nomeGrid).toggleClass('open');
            }
            else {
                $(objGridContainerPesquisaEFiltrados).find(".accordionPeqsuisaGrid li").removeClass("active");
                $(objGridContainerPesquisaEFiltrados).find(".accordionPeqsuisaGrid li:first").addClass("active");
                UNINTER.viewGenerica.setPlaceholderHeight();
            }
        };

        var filtroCriaGrupoMenu = function (id, textoBotao) {
            var objDivFiltroCriaGrupoMenu = document.createElement("div");
            var objDivFiltroCriaGrupoMenuBotao = document.createElement("button");
            var objDivFiltroCriaGrupoMenuBotaoTexto = document.createTextNode(textoBotao);
            var objDivFiltroCriaGrupoMenuBotaoTextoSpan = document.createElement("span");

            objDivFiltroCriaGrupoMenu.setAttribute("class", "dropdown");
            objDivFiltroCriaGrupoMenu.id = "divFiltroCriaGrupoMenu" + id;

            objDivFiltroCriaGrupoMenuBotao.type = "button";
            objDivFiltroCriaGrupoMenuBotao.id = id;
            objDivFiltroCriaGrupoMenuBotao.setAttribute("class", "btn btn-xs btn-link dropdown-toggle");
            objDivFiltroCriaGrupoMenuBotao.setAttribute("data-toggle", "dropdown");

            objDivFiltroCriaGrupoMenuBotaoTextoSpan.setAttribute("class", "caret");

            objDivFiltroCriaGrupoMenuBotao.appendChild(objDivFiltroCriaGrupoMenuBotaoTexto);
            objDivFiltroCriaGrupoMenuBotao.appendChild(objDivFiltroCriaGrupoMenuBotaoTextoSpan);
            objDivFiltroCriaGrupoMenu.appendChild(objDivFiltroCriaGrupoMenuBotao);

            return objDivFiltroCriaGrupoMenu;

        }

        var filtroCriaGrupoMenuItemUl = function (objDivFiltroCriaGrupoMenu) {
            var id = "ul" + objDivFiltroCriaGrupoMenu.id;

            if (typeof (objMenuItem[id]) == "undefined") {
                objFiltroCriaGrupoMenuItemUl = document.createElement("ul");
                objFiltroCriaGrupoMenuItemUl.setAttribute("class", "dropdown-menu");
                objFiltroCriaGrupoMenuItemUl.setAttribute("role", "menu");
                objFiltroCriaGrupoMenuItemUl.id = "uldivFiltroCriaGrupoMenu1";
                objMenuItem[id] = objFiltroCriaGrupoMenuItemUl;
                objDivFiltroCriaGrupoMenu.appendChild(objFiltroCriaGrupoMenuItemUl);
            }
            return objMenuItem[id];
        };

        var filtroCriaGrupoMenuItemLi = function (id, nome, parametros) {

            var objFiltroCriaGrupoMenuItemLi = document.createElement("li");
            var objFiltroCriaGrupoMenuItemA = document.createElement("a");
            var objFiltroCriaGrupoMenuItemTexto = document.createTextNode(nome);

            objFiltroCriaGrupoMenuItemLi.setAttribute("role", "presentation");

            objFiltroCriaGrupoMenuItemLi.id = id;
            objFiltroCriaGrupoMenuItemA.setAttribute("data-toggle", "modal");
            objFiltroCriaGrupoMenuItemA.setAttribute("data-target", ".filter-modal");
            objFiltroCriaGrupoMenuItemA.setAttribute("role", "menuitem");
            objFiltroCriaGrupoMenuItemA.setAttribute("tabindex", "-1");
            objFiltroCriaGrupoMenuItemA.setAttribute("href", "#");

            var objFnValorPesquisar = function () {
                return function (objFiltroCriaGrupoMenuItemLi) {
                    objDivJanelaCriterioPesquisaDialogoCorpo.innerHTML = "";
                    var objItemForm = criarComponenteFiltro(id, nome, parametros);
                    objDivJanelaCriterioPesquisaDialogoCorpo.appendChild(objItemForm);
                    if (idValidarSelect) {                        
                        UNINTER.viewGenerica.validarSelectId(idValidarSelect);
                    }
                    
                }
            };
            objFiltroCriaGrupoMenuItemLi.onclick = objFnValorPesquisar(nome);

            objFiltroCriaGrupoMenuItemA.appendChild(objFiltroCriaGrupoMenuItemTexto);
            objFiltroCriaGrupoMenuItemLi.appendChild(objFiltroCriaGrupoMenuItemA);

            return objFiltroCriaGrupoMenuItemLi;
        };

        var filtroFuncaoBotaoOk = function (objInput, id, operador, nome) {
            var elemFiltro = $(objInput);
            
            
            var id =  (elemFiltro.attr('data-id')) ? elemFiltro.attr('data-id') : id,
                        operador = (elemFiltro.attr('data-operador')) ? elemFiltro.attr('data-operador') : operador,
                        nome = (elemFiltro.attr('data-nome')) ? elemFiltro.attr('data-nome') : nome,
                        filtroFixo = (elemFiltro.attr('data-filtrofixo')) ? elemFiltro.attr('data-filtrofixo') : null,
                        valor = elemFiltro.val().trim();

            

            if (typeof (valor) == "object") {
                if (valor.length > 1)
                    valor = valor.join(";");
            }

            
            var filtro = "";
            
            filtro = id + "," + operador + "," + valor;
            if (filtroFixo)
                filtro += "|" + filtroFixo;
            
            objFiltroCamposFiltrados[id] = filtro;
            objFiltroGrid[id] = {
                id: id,
                operador: operador,
                nome: nome,
                valor: valor,
                filtro: filtro,
                filtroFixo: filtroFixo
            };
            filtroInserirCampoFiltrado(nome, id);
            paginaAtual = 1;
            objPaginacaoInputPaginaAtualTopo.value = paginaAtual;
            objPaginacaoInputPaginaAtualRodape.value = paginaAtual;
            filtroAplicar();
        };

        var filtroFuncaoBotaoOkLinha = function (pagina) {

            objFiltroCamposFiltrados = new Object();

            
            $("#" + objDivJanelaCriterioPesquisa.id + " .inputFiltroGrid").each(function () {
                var item = $(this);                
                if (item.hasClass("inputFiltroCheckbox")) {
                    
                    var _idElementoHidden = item.prop("id");
                    if ($(".inputCheckboxList" + _idElementoHidden + ":checked").length != $(".inputCheckboxList" + _idElementoHidden).length  || $(".inputCheckboxList" + _idElementoHidden).length == 1) {
                        var selecionados = $(".inputCheckboxList" + _idElementoHidden + ":checked").map(function () {
                            return $(this).val();
                        }).get().join(";");
                        if (selecionados != "" && selecionados != null)
                            item.val(selecionados);
                        else item.val("");
                    } else item.val("");
                }

                if (item.val() != "" && item.val() != null ) {
                    
                    var id = item.attr('data-id'),
                        operador = item.attr('data-operador'),
                        nome = item.attr('data-nome'),
                        filtroFixo = item.attr('data-filtrofixo'),
                        valor = item.val();
                    
                    if (typeof (valor) == "object") {
                        if (valor.length > 1)
                            valor = valor.join(";");
                    }


                    var filtro = id + "," + operador + "," + valor;
                    if (filtroFixo)
                        filtro += "|" + filtroFixo;

                    objFiltroCamposFiltrados[id] = filtro;
                    objFiltroGrid[id] = {
                        id: id,
                        operador: operador,
                        nome: nome,
                        valor: valor,
                        filtro: filtro,
                        filtroFixo: filtroFixo
                    };
                    //filtroInserirCampoFiltrado(nome, id);
                }
            });
            
            if (pagina == undefined) {
                paginaAtual = 1;
            } else {
                self.setPaginaAtual(pagina);
            }
            objPaginacaoInputPaginaAtualTopo.value = paginaAtual;
            objPaginacaoInputPaginaAtualRodape.value = paginaAtual;
            filtroAplicar();
        };

        var filtroAplicar = function () {
            
            var strFiltro = "";
            var strSeparador = "";
            
            for (objFiltro in objFiltroCamposFiltrados) {
                strFiltro += strSeparador + objFiltroCamposFiltrados[objFiltro];
                strSeparador = "|";
            }
            
            
            var obj = $(objTotalRegistros);
            
            obj.find("#grid-breadcrumb-total").remove();

            if (strFiltro) {
                if (obj.find("#grid-breadcrumb-filtro").length == 0) {
                    var a = $("<a>").attr("href", "javascript: void(0)").off("click").on("click", function () {
                        $("#" + objDivJanelaCriterioPesquisa.id + " input.form-control").val("");
                        $("#" + objDivJanelaCriterioPesquisa.id + " select.form-control").select2("val", "");
                        $("#" + objDivJanelaCriterioPesquisa.id + " :checkbox").prop("checked", false);
                        filtroFuncaoBotaoOkLinha();
                    }).html("Remover filtro");
                    obj.append($("<li>").attr("id", "grid-breadcrumb-filtro").html(a));
                }                
            }
            else {
                if (obj.find("#grid-breadcrumb-filtro").length > 0) 
                    obj.find("#grid-breadcrumb-filtro").remove();
            }
            /*
            if (filtroFixo != null && filtroFixo != "") {
                if (strFiltro == "") {
                    strFiltro = filtroFixo;
                }
                else strFiltro += "|" + filtroFixo;
            }*/
            
            funcaoUsuarioFiltroBotaoOk(strFiltro, paginaAtual, strCamposOrdenar);
            $(".modal-backdrop").remove();
        };

        /**
         * Médoto para filtrar
         */

        this.BuscarFiltrado = function (pagina) {
            
            filtroFuncaoBotaoOkLinha(pagina);
        };

        this.ExibirOcultarOpcoesPesquisa = function () {
            exibeOcultaOpcoesPesquisa(document.getElementById("search-filter-options" + nomeGrid));
        };

        var criarJanelaCriterioPesquisa = function () {            
            objDivJanelaCriterioPesquisaDialogo = document.createElement("div");
            objDivJanelaCriterioPesquisaDialogoConteudo = document.createElement("div");
            objDivJanelaCriterioPesquisaDialogoCabecalho = document.createElement("div");
            objDivJanelaCriterioPesquisaDialogoCorpo = document.createElement("div");

            objDivJanelaCriterioPesquisaDialogoRodape = document.createElement("div");

            objDivJanelaCriterioPesquisaDialogoIconeFechar = document.createElement("button");
            objDivJanelaCriterioPesquisaDialogoTituloH4 = document.createElement("h4");

            objDivJanelaCriterioPesquisaDialogoBotaoFechar = document.createElement("button");
            objDivJanelaCriterioPesquisaDialogoBotaoConfirmar = document.createElement("button");

            objDivJanelaCriterioPesquisaDialogo.setAttribute("class", "modal-dialog");

            objDivJanelaCriterioPesquisaDialogoConteudo.setAttribute("class", "modal-content");

            objDivJanelaCriterioPesquisaDialogoCabecalho.setAttribute("class", "modal-header");

            objDivJanelaCriterioPesquisaDialogoIconeFechar.setAttribute("class", "close");
            objDivJanelaCriterioPesquisaDialogoIconeFechar.setAttribute("data-dismiss", "modal");
            objDivJanelaCriterioPesquisaDialogoIconeFechar.setAttribute("aria-hidden", "true");
            objDivJanelaCriterioPesquisaDialogoIconeFechar.innerHTML = "&times;";

            objDivJanelaCriterioPesquisaDialogoTituloH4.setAttribute("class", "modal-title");
            objDivJanelaCriterioPesquisaDialogoTituloH4.innerHTML = "Pesquisar"

            objDivJanelaCriterioPesquisaDialogoCorpo.setAttribute("class", "modal-body");

            objDivJanelaCriterioPesquisaDialogoRodape.setAttribute("class", "modal-footer");

            objDivJanelaCriterioPesquisaDialogoBotaoFechar.setAttribute("class", "btn btn-default");
            objDivJanelaCriterioPesquisaDialogoBotaoFechar.setAttribute("data-dismiss", "modal");
            objDivJanelaCriterioPesquisaDialogoBotaoFechar.innerHTML = "Fechar";

            objDivJanelaCriterioPesquisaDialogoBotaoConfirmar.setAttribute("class", "btn btn-primary");
            objDivJanelaCriterioPesquisaDialogoBotaoConfirmar.setAttribute("data-dismiss", "modal");
            objDivJanelaCriterioPesquisaDialogoBotaoConfirmar.innerHTML = "Confirmar";


            objDivJanelaCriterioPesquisaDialogoCabecalho.appendChild(objDivJanelaCriterioPesquisaDialogoIconeFechar);
            objDivJanelaCriterioPesquisaDialogoCabecalho.appendChild(objDivJanelaCriterioPesquisaDialogoTituloH4);


            objDivJanelaCriterioPesquisaDialogoRodape.appendChild(objDivJanelaCriterioPesquisaDialogoBotaoConfirmar);
            objDivJanelaCriterioPesquisaDialogoRodape.appendChild(objDivJanelaCriterioPesquisaDialogoBotaoFechar);

            objDivJanelaCriterioPesquisaDialogoConteudo.appendChild(objDivJanelaCriterioPesquisaDialogoCabecalho);
            objDivJanelaCriterioPesquisaDialogoConteudo.appendChild(objDivJanelaCriterioPesquisaDialogoCorpo);
            objDivJanelaCriterioPesquisaDialogoConteudo.appendChild(objDivJanelaCriterioPesquisaDialogoRodape);

            objDivJanelaCriterioPesquisaDialogo.appendChild(objDivJanelaCriterioPesquisaDialogoConteudo);
                
            objDivJanelaCriterioPesquisa.appendChild(objDivJanelaCriterioPesquisaDialogo);
            
            
        };

        var criarInputTexto = function (id, nome, parametros) {
            var objDivGrupo = document.createElement("div");
            var objLabel = document.createElement("label");
            objLabel.setAttribute("class", "grid-label");
            var objTextoLabel = document.createTextNode(nome);
            var objDivJanelaCriterioPesquisaDialogoDiv = document.createElement("div");
            var objDivJanelaCriterioPesquisaDialogoCorpoInput = document.createElement("input");
            var idElemento = gerarRamdomico();
            objDivGrupo.setAttribute("class", "form-group");
            
            objLabel.appendChild(objTextoLabel);

            objDivJanelaCriterioPesquisaDialogoCorpoInput.type = "text";
            
            objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("class", "form-control inputFiltroGrid");
            objDivJanelaCriterioPesquisaDialogoCorpoInput.id = idElemento;
            objDivJanelaCriterioPesquisaDialogoCorpoInput.nome = idElemento;

            objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-id", id);            
            objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-operador", parametros.operador);
            objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-nome", nome);
            if (parametros.filtroFixo != null && parametros.filtroFixo != "") {
                objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-filtrofixo", parametros.filtroFixo);                
            }
            
           
            var objFnValorPesquisar = function (objDivJanelaCriterioPesquisaDialogoCorpoInput, id) { return function () { filtroFuncaoBotaoOk(objDivJanelaCriterioPesquisaDialogoCorpoInput, id, parametros.operador, nome); } };
            objDivJanelaCriterioPesquisaDialogoBotaoConfirmar.onclick = objFnValorPesquisar(objDivJanelaCriterioPesquisaDialogoCorpoInput, id);

            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objDivJanelaCriterioPesquisaDialogoCorpoInput);
            objDivGrupo.appendChild(objLabel);

            if (exibirBtnLimpar) {

                objDivJanelaCriterioPesquisaDialogoDiv.setAttribute("class", "input-group");
                var a = document.createElement("a");
                a.href = "javascript: void(0);";
                a.innerHTML = '<i class="icon-times" title="limpar dados"></i>';
                a.setAttribute('class', "pull-right");

                a.onclick = limparItemFiltro(objDivJanelaCriterioPesquisaDialogoCorpoInput, false);
                var span = document.createElement("span");
                span.setAttribute("class", "input-group-btn");
                span.style.padding = "5px";
                span.style.verticalAlign = "bottom";
                span.appendChild(a);
                objDivJanelaCriterioPesquisaDialogoDiv.appendChild(span);
            }

            objDivGrupo.appendChild(objDivJanelaCriterioPesquisaDialogoDiv);

            return objDivGrupo;


        };

        var criarSelectPlugin = function (id, nome, parametros) {

            var idNomeSelect = parametros.idObjCombo;

            var objDivGrupo = document.createElement("div");
            var objLabel = document.createElement("label");
            objLabel.setAttribute("class", "grid-label");
            var objTextoLabel = document.createTextNode(nome);
            var objDivJanelaCriterioPesquisaDialogoDiv = document.createElement("div");

            objDivContainerFormFieldSetLegendGroupSelect = document.createElement("select");
            //objDivContainerFormFieldSetLegendGroupSelect.setAttribute("class", "form-control");

            objDivGrupo.setAttribute("class", "form-group");
            objLabel.appendChild(objTextoLabel);

            var url = parametros.url;
            try{
                //verifica se nao tem dependente
                //if (parametros.idObjComboPai == void(0) && parametros.idTabelaColunaPai != null && parametros.idTabelaColunaPai != void (0)) {
                if (parametros.idTabelaColunaPai != null && parametros.idTabelaColunaPai != void (0)) {
                    
                    if (objFiltroGrid.hasOwnProperty(parametros.idTabelaColunaPai)) {
                        
                        url = url.replace("{valor}", objFiltroGrid[parametros.idTabelaColunaPai].valor);
                    }
                    else {
                        return '<p class="text-danger">' + parametros.msgPaiNaoSelecionado + '</p>';                        
                    }
                }
            }
            catch (e) { console.warn(e); }


            objDivContainerFormFieldSetLegendGroupSelect.id = idNomeSelect;
            objDivContainerFormFieldSetLegendGroupSelect.name = idNomeSelect;
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-url", montarUrl(url));
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-msgnaoencontrado", parametros.msgNaoEncontrado);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-valoroption", parametros.valorOption);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-textooption", parametros.textoOption);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-classe", parametros.classe);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-contract", parametros.nomeObjRetorno);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-textoinicial", parametros.textoInicial);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-popularaoiniciar", parametros.popularAoIniciar);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-autocomplete", "true");
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-change", "");
            
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-successcallback", parametros.successCallback);
            
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-erroobjpai", "");
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-ws", parametros.ws);
            if (parametros.idObjComboPai) {
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-idobjcombopai", parametros.idObjComboPai);
            }

            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-id", id);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-operador", parametros.operador);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-nome", nome);
            if (parametros.filtroFixo != null && parametros.filtroFixo != "") {
                objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-filtrofixo", parametros.filtroFixo);
            }
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("class", "form-control inputFiltroGrid");
            
            if (parametros.multiple == "multiple")
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("multiple", "multiple");


            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objDivContainerFormFieldSetLegendGroupSelect);
            objDivGrupo.appendChild(objLabel);
            
            if (exibirBtnLimpar) {
                
                objDivJanelaCriterioPesquisaDialogoDiv.setAttribute("class", "input-group");
                var a = document.createElement("a");
                a.href = "javascript: void(0);";
                a.innerHTML = '<i class="icon-times" title="limpar dados"></i>';
                a.setAttribute('class', "pull-right");

                a.onclick = limparItemFiltro(objDivContainerFormFieldSetLegendGroupSelect, true);
                var span = document.createElement("span");
                span.setAttribute("class", "input-group-btn");
                span.style.padding = "5px";
                span.style.verticalAlign = "bottom";
                span.appendChild(a);
                objDivJanelaCriterioPesquisaDialogoDiv.appendChild(span);
            }

            objDivGrupo.appendChild(objDivJanelaCriterioPesquisaDialogoDiv);
            
            idValidarSelect = idNomeSelect;
            
            var objFnValorPesquisar = function (objDivContainerFormFieldSetLegendGroupSelect, id) { return function () { filtroFuncaoBotaoOk(objDivContainerFormFieldSetLegendGroupSelect, id, parametros.operador, nome); } };
            objDivJanelaCriterioPesquisaDialogoBotaoConfirmar.onclick = objFnValorPesquisar(objDivContainerFormFieldSetLegendGroupSelect, id);

            return objDivGrupo;
        };
        var criarSelectFixo = function (id, nome, parametros) {

            var idNomeSelect = (parametros.idObjCombo) ? parametros.idObjCombo : gerarRamdomico();

            var objDivGrupo = document.createElement("div");
            var objLabel = document.createElement("label");
            objLabel.setAttribute("class", "grid-label");
            var objTextoLabel = document.createTextNode(nome);
            var objDivJanelaCriterioPesquisaDialogoDiv = document.createElement("div");

            objDivContainerFormFieldSetLegendGroupSelect = document.createElement("select");
            //objDivContainerFormFieldSetLegendGroupSelect.setAttribute("class", "form-control");

            objDivGrupo.setAttribute("class", "form-group");
            objLabel.appendChild(objTextoLabel);

            var url = parametros.url;
            try {
                //verifica se nao tem dependente
                if (parametros.idTabelaColunaPai != null && parametros.idTabelaColunaPai != void (0)) {

                    if (objFiltroGrid.hasOwnProperty(parametros.idTabelaColunaPai)) {

                        url = url.replace("{valor}", objFiltroGrid[parametros.idTabelaColunaPai].valor);
                    }
                    else {
                        return '<p class="text-danger">' + parametros.msgPaiNaoSelecionado + '</p>';

                    }
                }
            }
            catch (e) { console.warn(e); }


            objDivContainerFormFieldSetLegendGroupSelect.id = idNomeSelect;
            objDivContainerFormFieldSetLegendGroupSelect.name = idNomeSelect;
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("class", "form-control inputFiltroGrid");
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("placeholder", "Selecione");

            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-id", id);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-operador", parametros.operador);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-nome", nome);
            if (parametros.filtroFixo != null && parametros.filtroFixo != "") {
                objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-filtrofixo", parametros.filtroFixo);
            }
            for (i = 0; i < parametros.data.length; i++) {
                var option = document.createElement("option");
                option.setAttribute("value", parametros.data[i].value);
                option.innerHTML = parametros.data[i].label;

                objDivContainerFormFieldSetLegendGroupSelect.appendChild(option);

            }

            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objDivContainerFormFieldSetLegendGroupSelect);
            objDivGrupo.appendChild(objLabel);

            if (exibirBtnLimpar) {

                objDivJanelaCriterioPesquisaDialogoDiv.setAttribute("class", "input-group");
                var a = document.createElement("a");
                a.href = "javascript: void(0);";
                a.innerHTML = '<i class="icon-times" title="limpar dados"></i>';
                a.setAttribute('class', "pull-right");

                a.onclick = limparItemFiltro(objDivContainerFormFieldSetLegendGroupSelect, true);
                var span = document.createElement("span");
                span.setAttribute("class", "input-group-btn");
                span.style.padding = "5px";
                span.style.verticalAlign = "bottom";
                span.appendChild(a);
                objDivJanelaCriterioPesquisaDialogoDiv.appendChild(span);
            }

            objDivGrupo.appendChild(objDivJanelaCriterioPesquisaDialogoDiv);

            idValidarSelect = idNomeSelect;

            var objFnValorPesquisar = function (objDivContainerFormFieldSetLegendGroupSelect, id) {
                return function () {
                    filtroFuncaoBotaoOk(objDivContainerFormFieldSetLegendGroupSelect, id, parametros.operador, nome);
                }
            };
            objDivJanelaCriterioPesquisaDialogoBotaoConfirmar.onclick = objFnValorPesquisar(objDivContainerFormFieldSetLegendGroupSelect, id);

            return objDivGrupo;
        };

        var criarInputDataHora = function (id, nome, parametros) {
            var fnSetaDataInicialFinal = function (dataInicial, dataFinal) {
                
                
                if (dataInicial.value != "" && dataFinal.value != "") {
                    objInputDataInicialFinal.value = dataConverteDDMMAAAAParaAAAAMMDDHHMMSS(dataInicial.value, 1) + ";" + dataConverteDDMMAAAAParaAAAAMMDDHHMMSS(dataFinal.value, 2);
                }
            }

            var objDivJanelaCriterioPesquisaDialogoDiv = document.createElement("div");
            var objDivGrupo = document.createElement("div");
            var objLabelDataInicial = document.createElement("label");
            objLabelDataInicial.setAttribute("class", "grid-label");
            var objLabelDataFinal = document.createElement("label");
            objLabelDataFinal.setAttribute("class", "grid-label");
            var objTextoLabelDataInicial = document.createTextNode("Inicio");
            var objTextoLabelFinal = document.createTextNode("Fim");
            var objDataInicialFinal = document.createTextNode("input");
            var iconCalendarInicio = document.createElement("span");
            iconCalendarInicio.setAttribute("class", "input-group-addon");
            iconCalendarInicio.innerHTML = '<i class="icon-calendar"></i>'
            var objGroupDataInicio = document.createElement("div");
            objGroupDataInicio.setAttribute("class", "input-group");
            var iconCalendarFim = document.createElement("span");
            iconCalendarFim.setAttribute("class", "input-group-addon");
            iconCalendarFim.innerHTML = '<i class="icon-calendar"></i>'
            var objGroupDataFim = document.createElement("div");
            objGroupDataFim.setAttribute("class", "input-group");

            objDivGrupo.setAttribute("class", "form-group");

            objLabelDataInicial.appendChild(objTextoLabelDataInicial);
            objLabelDataFinal.appendChild(objTextoLabelFinal);

            var objInputDataInicialFinal = document.createElement("input");
            objInputDataInicialFinal.type = "hidden";
            objInputDataInicialFinal.setAttribute("class", "form-control inputFiltroGrid");
            objInputDataInicialFinal.id = "hidDataInicialFinalValue" + id;
            objInputDataInicialFinal.name = "hidDataInicialFinalValue" + id;

            objInputDataInicialFinal.setAttribute("data-id",  id);
            objInputDataInicialFinal.setAttribute("data-operador", parametros.operador);
            objInputDataInicialFinal.setAttribute("data-nome", nome);
            if (parametros.filtroFixo != null && parametros.filtroFixo != "") {
                objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-filtrofixo", parametros.filtroFixo);
            }
            var objInputDataInicial = document.createElement("input");
            objInputDataInicial.setAttribute("class", "col-sm-2");
            objInputDataInicial.setAttribute("class", "form-control datepicker");
            objInputDataInicial.setAttribute("maxlength", "18");
            objInputDataInicial.setAttribute("data-date-format", "DD/MM/YYYY");
            objInputDataInicial.setAttribute("data-date-picktime", "false");
                        
            jQuery(objInputDataInicial).datetimepicker();
            jQuery(objInputDataInicial).mask("00/00/0000");
            var idElemento = gerarRamdomico();
            objInputDataInicial.type = "text";
            objInputDataInicial.id = idElemento;
            objInputDataInicial.name = idElemento;

            var objInputDatalFinal = document.createElement("input");
            objInputDatalFinal.setAttribute("class", "col-sm-2");
            objInputDatalFinal.setAttribute("class", "form-control datepicker");
            objInputDatalFinal.setAttribute("maxlength", "18");
            objInputDatalFinal.setAttribute("data-date-format", "DD/MM/YYYY");
            objInputDatalFinal.setAttribute("data-date-picktime", "false");

            jQuery(objInputDatalFinal).datetimepicker();
            jQuery(objInputDatalFinal).mask("00/00/0000");
            var idElemento = gerarRamdomico();
            objInputDatalFinal.type = "text";
            objInputDatalFinal.id = idElemento;
            objInputDatalFinal.name = idElemento;

            var objFnValorPesquisar = function (objInputDataInicial, objInputDatalFinal) { return function () { fnSetaDataInicialFinal(objInputDataInicial, objInputDatalFinal) } };
            objInputDataInicial.onblur = objFnValorPesquisar(objInputDataInicial, objInputDatalFinal);
            objInputDatalFinal.onblur = objFnValorPesquisar(objInputDataInicial, objInputDatalFinal);

            var objFnValorPesquisar = function (objInputDataInicialFinal, id) { return function () { filtroFuncaoBotaoOk(objInputDataInicialFinal, id, parametros.operador, nome); } };
            objDivJanelaCriterioPesquisaDialogoBotaoConfirmar.onclick = objFnValorPesquisar(objInputDataInicialFinal, id);

            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objInputDataInicialFinal);            
            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objLabelDataInicial);
            objGroupDataInicio.appendChild(objInputDataInicial);
            objGroupDataInicio.appendChild(iconCalendarInicio);
            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objGroupDataInicio);
            
            if (exibirBtnLimpar) {

                objDivJanelaCriterioPesquisaDialogoDiv.setAttribute("class", "input-group");
                var a = document.createElement("a");
                a.href = "javascript: void(0);";
                a.innerHTML = '<i class="icon-times" title="limpar dados"></i>';
                a.setAttribute('class', "pull-right");

                a.onclick = limparItemFiltro(objInputDataInicial, true);
                var span = document.createElement("span");
                span.setAttribute("class", "input-group-btn");
                span.style.padding = "5px";
                span.style.verticalAlign = "bottom";
                
                objDivJanelaCriterioPesquisaDialogoDiv.appendChild(span);
            }

            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objLabelDataFinal);
            objGroupDataFim.appendChild(objInputDatalFinal);
            objGroupDataFim.appendChild(iconCalendarFim);
            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objGroupDataFim);
            if (exibirBtnLimpar) {

                objDivJanelaCriterioPesquisaDialogoDiv.setAttribute("class", "input-group");
                var a = document.createElement("a");
                a.href = "javascript: void(0);";
                a.innerHTML = '<i class="icon-times" title="limpar dados"></i>';
                a.setAttribute('class', "pull-right");

                a.onclick = limparItemFiltro(objInputDatalFinal, true);
                var span = document.createElement("span");
                span.setAttribute("class", "input-group-btn");
                span.style.padding = "5px";
                span.style.verticalAlign = "bottom";
                span.appendChild(a);
                objDivJanelaCriterioPesquisaDialogoDiv.appendChild(span);
            }

            objDivGrupo.appendChild(objDivJanelaCriterioPesquisaDialogoDiv);
            return objDivGrupo;

        };

        var criarListaCheckbox = function (id, nome, parametros, inputs) {
            var objDivGrupo = document.createElement("div");
            
            var objDivJanelaCriterioPesquisaDialogoDiv = document.createElement("div");            
            
            objDivGrupo.setAttribute("class", "form-group");
            var objDivRow = document.createElement("div");
                                    
            var idElementoHidden = gerarRamdomico();
            var valueHidden = "";
            var selecionados = new Array();
            
            $.each(inputs, function (k, item) {
                var objDivJanelaCriterioPesquisaDialogoCorpoInput = document.createElement("input");
                var idElemento = gerarRamdomico();
                var objDivCheck = document.createElement("label");

                var objTextoLabel = document.createTextNode(item[parametros.texto]);

                //objDivCheck.setAttribute("class", "col-md-1");
                objDivJanelaCriterioPesquisaDialogoCorpoInput.type = "checkbox";                
                objDivJanelaCriterioPesquisaDialogoCorpoInput.id = idElemento;
                objDivJanelaCriterioPesquisaDialogoCorpoInput.nome = idElemento;
                objDivJanelaCriterioPesquisaDialogoCorpoInput.value = item[parametros.valor];                
                objDivJanelaCriterioPesquisaDialogoCorpoInput.style.marginRight = "2px";
                objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("class", "inputCheckboxList" + idElementoHidden);
								
                if (item.checked == "true" || parametros.checked == "true") {
                    objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-checked", true);
					objDivJanelaCriterioPesquisaDialogoCorpoInput.checked = true;
                        selecionados.push(item[parametros.valor]);						
                }
				
                
                valueHidden = selecionados.join(";");

                var objFnValorPesquisar = function (_idElementoHidden) {
                    return function () {
                        
                        var selecionados = $(".inputCheckboxList" + _idElementoHidden + ":checked").map(function () {
                            return $(this).val();
                        }).get().join(";");
                        if (selecionados != "" && selecionados != null)
                            $("#" + _idElementoHidden).val(selecionados);
                        else $("#" + _idElementoHidden).val("");
                    }
                };
                objDivJanelaCriterioPesquisaDialogoCorpoInput.onclick = objFnValorPesquisar(idElementoHidden);
                
				if(item.icone){
					var objImg = document.createElement("i");
					objImg.setAttribute("class", item.icone);
					objImg.style.display = "block";
					objImg.style.fontSize = "24px";
					//objImg.style.textAlign = "center";
					objImg.style.paddingBottom = "10px";
					objDivCheck.appendChild(objImg);					
				} 
				
                objDivCheck.style.paddingRight = "15px";
				objDivCheck.style.paddingLeft = "15px";
				objDivCheck.style.textAlign = "center";
                objDivCheck.appendChild(objDivJanelaCriterioPesquisaDialogoCorpoInput);
                objDivCheck.appendChild(objTextoLabel);
                objDivRow.appendChild(objDivCheck);
            });
            
            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objDivRow);

            var objDivJanelaCriterioPesquisaDialogoCorpoInput = document.createElement("input");
            
            objDivJanelaCriterioPesquisaDialogoCorpoInput.type = "hidden";
            objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("class", "form-control inputFiltroGrid inputFiltroCheckbox");
            objDivJanelaCriterioPesquisaDialogoCorpoInput.id = idElementoHidden;
            objDivJanelaCriterioPesquisaDialogoCorpoInput.nome = idElementoHidden;
            objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-id", id);
            objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-operador", parametros.operador);
            objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-nome", nome);
            objDivJanelaCriterioPesquisaDialogoCorpoInput.value = valueHidden;
            if (parametros.filtroFixo != null && parametros.filtroFixo != "") {
                objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-filtrofixo", parametros.filtroFixo);
            }
            var objFnValorPesquisar = function (objDivJanelaCriterioPesquisaDialogoCorpoInput, id) { return function () { filtroFuncaoBotaoOk(objDivJanelaCriterioPesquisaDialogoCorpoInput, id, parametros.operador, nome); } };
            objDivJanelaCriterioPesquisaDialogoBotaoConfirmar.onclick = objFnValorPesquisar(objDivJanelaCriterioPesquisaDialogoCorpoInput, id);

            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objDivJanelaCriterioPesquisaDialogoCorpoInput);

            
            //objDivGrupo.appendChild(objLabel);
            
            if (exibirBtnLimpar) {
                
                objDivJanelaCriterioPesquisaDialogoDiv.setAttribute("class", "input-group");
                var a = document.createElement("a");
                a.href = "javascript: void(0);";
                a.innerHTML = '<i class="icon-times" title="limpar dados"></i>';
                a.setAttribute('class', "pull-right");
                a.onclick = limparItemFiltro(objDivJanelaCriterioPesquisaDialogoCorpoInput, false);
                
                var span = document.createElement("span");
                span.setAttribute("class", "input-group-btn");
                span.style.padding = "5px";
                span.style.verticalAlign = "bottom";
                span.appendChild(a);
                objDivJanelaCriterioPesquisaDialogoDiv.appendChild(span);
                
            }

            objDivGrupo.appendChild(objDivJanelaCriterioPesquisaDialogoDiv);
            
            return objDivGrupo;
        }

        var buscarListaCheckbox = function (id, nome, parametros) {
            
            var url = UNINTER.AppConfig.UrlWs(parametros.ws) + parametros.url;

            var opcoes = {
                url: url,
                type: 'GET',
                data: null,
                async: false
            }
            var resultado = UNINTER.Helpers.ajaxRequestError(opcoes);

            //se sucesso: popula form da sala
            if (resultado.status == 200) {
                //resultado.resposta[parametros.nomeObjRetorno]
                return criarListaCheckbox(id, nome, parametros, resultado.resposta[parametros.nomeObjRetorno]);
            } else {
                self.setMensagem({ body: "Não foi possível localizar etiquetas" });
            }
            return null;

            var opcoes = {
                url: UNINTER.AppConfig.UrlWs(parametros.ws) + parametros.url,
                type: 'GET',
                async: false,
                successCallback: function (data) {
                    
                    if (data[parametros.nomeObjRetorno] == void (0) || [parametros.nomeObjRetorno].length == 0) {
                        console.error("não foi possível consultar filtro " + nome);
                        
                    }
                    else {
                        return criarListaCheckbox(id, nome, parametros);
                    }
                },
                errorCallback: function (error) {
                    console.error("não foi possível consultar filtro " + nome);
                }
            }

            UNINTER.Helpers.ajaxRequest(opcoes);
        };

        var criarComponenteFiltro = function (id, nome, parametros) {
            var objItemForm;
            switch (parametros.idTipoRecurso) {
                
                case 2: //input texto
                    objItemForm = criarInputTexto(id, nome, parametros);
                    break;
                case 5: //input data
                    objItemForm = criarInputData(id, nome, parametros);
                    break;
                case 6: //Select
                    objItemForm = criarSelectPlugin(id, nome, parametros);
                    break;
                case 7: //input dataHora
                    objItemForm = criarInputDataHora(id, nome, parametros);
                    break;
                case 23:// lista de checkbox
                    objItemForm = buscarListaCheckbox(id, nome, parametros);                    
                    break;
                case 24://select com valores fixos
                    objItemForm = criarSelectFixo(id, nome, parametros);
                    break;
                case 29: //lista de checkbox fixo
                    objItemForm = criarListaCheckbox(id, nome, parametros, parametros.data)
                    break;
                case 42: //input ano
                    objItemForm = criarInputTexto(id, nome, parametros);
                    break;
                /*case 1:
                    return criarInputCheckBox(id, nome, parametros);
                    break;
                case 3: //input pesquisa
                    criarInputPesquisa(id, nome, parametros);
                    break;
                case 5: //input data

                    return criarInputDataHora(id, nome, parametros);

                    //criarInputData(id, nome, parametros);
                    break;
                case 8: //input palavrapasse
                    return criarListaPalavras(id, nome, parametros);
                    break;*/
            }
            /*
            if (parametros.filtroFixo != null && parametros.filtroFixo != "") {
                
                filtroFixo = parametros.filtroFixo;
            }*/
            
            return objItemForm;
        }

        var dataConverteDDMMAAAAParaAAAAMMDDHHMMSS = function (data, tipo) {

            /*
                data: data no formato dd/mm/aaaa
                tipo: default 1 data inicial, acresenta 00:00:00  - 2 data final acrescenta 23:59:59 
            */

            var padraoData = /\b([0]{1}[1-9]{1}|[1]{1}[0-9]{1}|[2]{1}[0-9]{1}|[3]{1}[0-1]{1})+([\/]{1})+([0]{1}[1-9]{1}|[1]{1}[0-2]{1})+([\/]{1})+([0-9]{4})\b/;
            var arrData = padraoData.exec(data);
            var dataAAAAMMDDHHMMSS = null;
            var hora = " 00:00:00";

            if (tipo == 2) {
                hora = " 23:59:59"
            }

            if (arrData != null) {
                var dataMMDDAAAA = arrData[3] + arrData[2] + arrData[1] + arrData[4] + arrData[5];
                var objData = new Date(dataMMDDAAAA);
                if (!isNaN(objData.getMonth())) {
                    dataAAAAMMDDHHMMSS = arrData[5] + arrData[2] + arrData[3] + arrData[4] + arrData[1] + hora;
                }
            }
            return dataAAAAMMDDHHMMSS;
        };

        var filtroContainerCamposFiltrados = function () {
            var objDivContainerFiltro = document.createElement("div");
            var objDivContainerFiltroSpan = document.createElement("span");
            objDivContainerFiltroCamposSelecionados = document.createElement("div");

            objDivContainerFiltro.setAttribute("class", "filter");
            objDivContainerFiltroSpan.setAttribute("class", "filter-label");
            objDivContainerFiltroCamposSelecionados.setAttribute("class", "filter-list")
            objDivContainerFiltroSpan.innerHTML = "Filtrados";

            objDivContainerFiltro.appendChild(objDivContainerFiltroSpan);
            objDivContainerFiltro.appendChild(objDivContainerFiltroCamposSelecionados);
            objGridContainerFiltrados.appendChild(objDivContainerFiltro);

        };

        var filtroRemoverCampoFiltrado = function (objeto) {
            var id = objeto.getAttribute("data-selecionado");

            objDivContainerFiltroCamposSelecionados.removeChild(objeto);
            delete objFiltroCamposFiltrados[id];
            if (objDivContainerFiltroCamposSelecionados.childNodes.length == 0) {
                objGridContainerFiltrados.style.display = "none";
            }
            filtroAplicar();
        };

        var filtroInserirCampoFiltrado = function (nome, id) {

            objGridContainerFiltrados.style.display = "";

            if (objDivContainerFiltroCamposSelecionados == null) {
                filtroContainerCamposFiltrados();
            }

            var objDivContainerFiltroCamposSelecionadosSpanDiv = document.createElement("div");
            var objDivContainerFiltroCamposSelecionadosSpan = document.createElement("span");
            var objDivContainerFiltroCamposSelecionadosSpanLink = document.createElement("a");

            objDivContainerFiltroCamposSelecionadosSpan.setAttribute("class", "filter-item");
            objDivContainerFiltroCamposSelecionadosSpan.setAttribute("data-selecionado", id);

            objDivContainerFiltroCamposSelecionadosSpanLink.setAttribute("class", "filter-item-close");
            objDivContainerFiltroCamposSelecionadosSpanLink.setAttribute("href", "javascript: void(0)");

            var objFnItemFiltradoClik = function () { return function (objDivContainerFiltroCamposSelecionadosSpanLink) { filtroRemoverCampoFiltrado(objDivContainerFiltroCamposSelecionadosSpan); } };
            objDivContainerFiltroCamposSelecionadosSpanLink.onclick = objFnItemFiltradoClik(filtroRemoverCampoFiltrado);

            objDivContainerFiltroCamposSelecionadosSpanLink.innerHTML = "&times;";
            objDivContainerFiltroCamposSelecionadosSpanDiv.innerHTML = nome;

            objDivContainerFiltroCamposSelecionadosSpan.appendChild(objDivContainerFiltroCamposSelecionadosSpanDiv);
            objDivContainerFiltroCamposSelecionadosSpan.appendChild(objDivContainerFiltroCamposSelecionadosSpanLink);

            objDivContainerFiltroCamposSelecionados.appendChild(objDivContainerFiltroCamposSelecionadosSpan);
        };

        var primeira = function () {
            paginaAtual = 1;
            filtroAplicar();
            objPaginacaoInputPaginaAtualTopo.value = paginaAtual;
            objPaginacaoInputPaginaAtualRodape.value = paginaAtual;

        };

        var proxima = function () {
            if (paginaAtual < quantidadePaginas) {
                paginaAtual += 1;
                filtroAplicar();
                objPaginacaoInputPaginaAtualTopo.value = paginaAtual;
                objPaginacaoInputPaginaAtualRodape.value = paginaAtual;
            }
        };

        var anterior = function () {
            if (paginaAtual > 1) {
                paginaAtual -= 1;
                filtroAplicar();
                objPaginacaoInputPaginaAtualTopo.value = paginaAtual;
                objPaginacaoInputPaginaAtualRodape.value = paginaAtual;
            }
        };

        var ultima = function () {
            paginaAtual = quantidadePaginas;
            filtroAplicar();
            objPaginacaoInputPaginaAtualTopo.value = paginaAtual;
            objPaginacaoInputPaginaAtualRodape.value = paginaAtual;
        };

        var irParaPagina = function (tecla) {

            if (tecla.keyCode == 13) {
                var pagina = objPaginacaoInputPaginaAtualRodape.value;
                if (tecla.currentTarget.id === 'pagination-input-topo') {
                    pagina = objPaginacaoInputPaginaAtualTopo.value;
                }

                if (pagina != paginaAtual && (pagina >= 1 && pagina <= quantidadePaginas)) {
                    paginaAtual = parseInt(pagina);
                    objPaginacaoInputPaginaAtualTopo.value = pagina;
                    objPaginacaoInputPaginaAtualRodape.value = pagina;
                    filtroAplicar();
                }
            }
        };

        var criarPaginacao = function () {
            //montaTopo
            var objLi = document.createElement("li");
            var objSpanDe = document.createElement("span");
            var objLink = document.createElement("a");

            objPaginacaoInputPaginaAtualTopo = document.createElement("input");
            objPaginacaoInputPaginaAtualTopo.id = "pagination-input-topo";

            objSpanDe.innerHTML = " página ";

            objSpanQuantidadePaginaTopo.setAttribute("class", "pagination-total");
            objSpanQuantidadePaginaTopo.innerHTML = " de 100";

            objPaginacaoInputPaginaAtualTopo.setAttribute("class", "pagination-input");
            objPaginacaoInputPaginaAtualTopo.setAttribute("placeholder", "1");
            objPaginacaoInputPaginaAtualTopo.type = "text";
            objPaginacaoInputPaginaAtualTopo.value = 1;
            //objPaginacaoInputPaginaAtualTopo.setAttribute("onkeydown", "irParaPagina(event, 'cabecalho')")
            objPaginacaoInputPaginaAtualTopo.onkeydown = irParaPagina;

            objLink.appendChild(objSpanDe);
            objLink.appendChild(objPaginacaoInputPaginaAtualTopo);
            objLink.appendChild(objSpanQuantidadePaginaTopo);
            objLi.appendChild(objLink);
            var objPaginaItemUl = montarPaginacaoBotoes();
            objPaginaItemUl.appendChild(objLi);
            objGridContainerPaginacaoTopo.appendChild(objPaginaItemUl);

            //monta rodape
            var objLi = document.createElement("li");
            var objSpanDe = document.createElement("span");
            var objLink = document.createElement("a");

            objPaginacaoInputPaginaAtualRodape = document.createElement("input");
            objPaginacaoInputPaginaAtualRodape.id = "pagination-input-rodape";

            objSpanDe.innerHTML = " página ";

            objSpanQuantidadePaginaRodape.setAttribute("class", "pagination-total");
            objSpanQuantidadePaginaRodape.innerHTML = " de 100";

            objPaginacaoInputPaginaAtualRodape.setAttribute("class", "pagination-input");
            objPaginacaoInputPaginaAtualRodape.setAttribute("placeholder", "1");
            objPaginacaoInputPaginaAtualRodape.type = "text";
            objPaginacaoInputPaginaAtualRodape.value = 1;
            //objPaginacaoInputPaginaAtualRodape.setAttribute("onkeydown", "irParaPagina(event, 'rodape')")
            objPaginacaoInputPaginaAtualRodape.onkeydown = irParaPagina;

            objLink.appendChild(objSpanDe);
            objLink.appendChild(objPaginacaoInputPaginaAtualRodape);
            objLink.appendChild(objSpanQuantidadePaginaRodape);
            objLi.appendChild(objLink);
            var objPaginaItemUl = montarPaginacaoBotoes();
            objPaginaItemUl.appendChild(objLi);

            objGridContainerPaginacaoRodape.appendChild(objPaginaItemUl);

        };

        var montarPaginacaoBotoes = function () {
            var objPaginaItemUl = document.createElement("ul");
            var arrBotoes = new Array("icon-angle-double-left", "icon-angle-left", "icon-angle-right", "icon-angle-double-right");
            //var arrBotoesFuncoes = new Array("primeira()", "anterior()", "proxima()", "ultima()");
            var arrBotoesFuncoes = new Array("primeira", "anterior", "proxima", "ultima");

            objPaginaItemUl.setAttribute("class", "pagination");

            for (var x = 0 ; x < arrBotoes.length ; x++) {
                var objPaginaItemUlLi = document.createElement("li");
                var objPaginaItemUlLiLink = document.createElement("a");
                objPaginaItemUlLiLink.setAttribute("class", arrBotoes[x]);
                objPaginaItemUlLiLink.setAttribute("href", "javascript: void(0)");
                //objPaginaItemUlLiLink.setAttribute("onClick", arrBotoesFuncoes[x]);
                switch (arrBotoesFuncoes[x]) {
                    case 'primeira':
                        objPaginaItemUlLiLink.setAttribute("title", 'primeira');
                        objPaginaItemUlLiLink.onclick = primeira;
                        break;
                    case 'anterior':
                        objPaginaItemUlLiLink.setAttribute("title", 'anterior');
                        objPaginaItemUlLiLink.onclick = anterior;
                        break;
                    case 'proxima':
                        objPaginaItemUlLiLink.setAttribute("title", 'proxima');
                        objPaginaItemUlLiLink.onclick = proxima;
                        break;
                    case 'ultima':
                        objPaginaItemUlLiLink.setAttribute("title", 'ultima');
                        objPaginaItemUlLiLink.onclick = ultima;
                        break;
                }
                objPaginaItemUlLi.appendChild(objPaginaItemUlLiLink);
                objPaginaItemUl.appendChild(objPaginaItemUlLi);
            }
            return objPaginaItemUl;
        }
        var montarUrl = function (url) {
            var keyWordRegex = /\{\w+\}/g;

            if (keyWordRegex.test(url)) {
                var matches = url.match(keyWordRegex);
                var urlAlterada = url;

                for (var i = 0; i < matches.length; i++) {
                    switch (matches[i]) {
                        case "{idSalaVirtual}": {
                            var idSalaVirtual = UNINTER.StorageWrap.getItem("leftSidebarItemView").idSalaVirtual;
                            var urlAlterada = urlAlterada.replace(matches[i], idSalaVirtual);
                            break;
                        }
                        case "{idSalaVirtualOferta}": {
                            var idSalaVirtualOferta = UNINTER.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOferta;
                            var urlAlterada = urlAlterada.replace(matches[i], idSalaVirtualOferta);
                            break;
                        }
                        case "{idUrl}": {
                            var idUrl = UNINTER.viewGenerica.parametros.idUrl;
                            var urlAlterada = urlAlterada.replace(matches[i], idUrl);
                            break;
                        }
                        case "{idAcao}": {
                            var idAcao = UNINTER.viewGenerica.parametros.idAcao;
                            var urlAlterada = urlAlterada.replace(matches[i], idAcao);
                            break;
                        }
                        case "{valor}": 
                        case "{cboCursoModalidade}":
                        case "{cboCursoNivel}":
                        {
                            break;
                        }
                        default: {
                            var urlAlterada = urlAlterada.replace(matches[i], "0");
                            break;
                        }
                    }
                }
                return urlAlterada;
            }

            return url;
        }
        var limparItemFiltro = function (elemento, select) {
            return function () {
                var elem = $(elemento);                
                elem.val("");

                if (select === true)
                    elem.select2("val", "");

                //
                if (elem.attr("type") == "hidden") {
                    var id = elem.attr("id");
                    $(".inputCheckboxList" + id).prop("checked", false);
                }
            }
        };

        var criarInputData = function (id, nome, parametros) {
            var fnSetaDataInicialFinal = function (dataInicial, dataFinal) {
                if (dataInicial.value != "" && dataFinal.value != "") {
                    objInputDataInicialFinal.value = dataConverteDDMMAAAAParaAAAAMMDDHHMMSS(dataInicial.value, 1) + ";" + dataConverteDDMMAAAAParaAAAAMMDDHHMMSS(dataFinal.value, 2);
                }
            }

            var objDivJanelaCriterioPesquisaDialogoDiv = document.createElement("div");
            var objDivGrupo = document.createElement("div");
            var objLabelDataInicial = document.createElement("label");
            objLabelDataInicial.setAttribute("class", "grid-label");
            var objLabelDataFinal = document.createElement("label");
            objLabelDataFinal.setAttribute("class", "grid-label");
            var objTextoLabelDataInicial = document.createTextNode(nome + ": Inicio");
            var objTextoLabelFinal = document.createTextNode("Fim");
            var objDataInicialFinal = document.createTextNode("input");
            var iconCalendarInicio = document.createElement("span");
            iconCalendarInicio.setAttribute("class", "input-group-addon");
            iconCalendarInicio.innerHTML = '<i class="icon-calendar"></i>'
            var objGroupDataInicio = document.createElement("div");
            objGroupDataInicio.setAttribute("class", "input-group");
            var iconCalendarFim = document.createElement("span");
            iconCalendarFim.setAttribute("class", "input-group-addon");
            iconCalendarFim.innerHTML = '<i class="icon-calendar"></i>'
            var objGroupDataFim = document.createElement("div");
            objGroupDataFim.setAttribute("class", "input-group");
            var totalDias = parametros.totalDias;


            objDivGrupo.setAttribute("class", "form-group");

            objLabelDataInicial.appendChild(objTextoLabelDataInicial);
            objLabelDataFinal.appendChild(objTextoLabelFinal);

            var objInputDataInicialFinal = document.createElement("input");
            objInputDataInicialFinal.type = "hidden";
            objInputDataInicialFinal.setAttribute("class", "form-control inputFiltroGrid");
            objInputDataInicialFinal.id = "hidDataInicialFinalValue" + id;
            objInputDataInicialFinal.name = "hidDataInicialFinalValue" + id;

            objInputDataInicialFinal.setAttribute("data-id", id);
            objInputDataInicialFinal.setAttribute("data-operador", parametros.operador);
            objInputDataInicialFinal.setAttribute("data-nome", nome);
            if (parametros.filtroFixo != null && parametros.filtroFixo != "") {
                objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-filtrofixo", parametros.filtroFixo);
            }
            var objInputDataInicial = document.createElement("input");
            objInputDataInicial.setAttribute("class", "col-sm-2");
            objInputDataInicial.setAttribute("class", "form-control datepicker");
            objInputDataInicial.setAttribute("maxlength", "18");
            objInputDataInicial.setAttribute("data-date-format", "DD/MM/YYYY");
            objInputDataInicial.setAttribute("data-date-picktime", "false");

            jQuery(objInputDataInicial).datetimepicker();
            jQuery(objInputDataInicial).mask("00/00/0000");
            var idElemento = gerarRamdomico();
            objInputDataInicial.type = "text";
            objInputDataInicial.id = idElemento;
            objInputDataInicial.name = idElemento;

            var objInputDataFinal = document.createElement("input");
            objInputDataFinal.setAttribute("class", "col-sm-2");
            objInputDataFinal.setAttribute("class", "form-control datepicker");
            objInputDataFinal.setAttribute("maxlength", "18");
            objInputDataFinal.setAttribute("data-date-format", "DD/MM/YYYY");
            objInputDataFinal.setAttribute("data-date-picktime", "false");
            objInputDataFinal.setAttribute("data-DateTimePicker", "false");

            jQuery(objInputDataFinal).datetimepicker();
            jQuery(objInputDataFinal).mask("00/00/0000");
            var idElemento = gerarRamdomico();
            objInputDataFinal.type = "text";
            objInputDataFinal.id = idElemento;
            objInputDataFinal.name = idElemento;

            var objFnValorPesquisar = function (objInputDataInicial, objInputDataFinal) { return function () { fnSetaDataInicialFinal(objInputDataInicial, objInputDataFinal) } };
            objInputDataInicial.onblur = objFnValorPesquisar(objInputDataInicial, objInputDataFinal);
            objInputDataFinal.onblur = objFnValorPesquisar(objInputDataInicial, objInputDataFinal);

            var objFnValorPesquisar = function (objInputDataInicialFinal, id) { return function () { filtroFuncaoBotaoOk(objInputDataInicialFinal, id, parametros.operador, nome); } };
            objDivJanelaCriterioPesquisaDialogoBotaoConfirmar.onclick = objFnValorPesquisar(objInputDataInicialFinal, id);

            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objInputDataInicialFinal);
            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objLabelDataInicial);
            objGroupDataInicio.appendChild(objInputDataInicial);
            objGroupDataInicio.appendChild(iconCalendarInicio);
            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objGroupDataInicio);

            if (exibirBtnLimpar) {

                objDivJanelaCriterioPesquisaDialogoDiv.setAttribute("class", "input-group");
                var a = document.createElement("a");
                a.href = "javascript: void(0);";
                a.innerHTML = '<i class="icon-times" title="limpar dados"></i>';
                a.setAttribute('class', "pull-right");

                a.onclick = limparItemFiltro(objInputDataInicial, true);
                var span = document.createElement("span");
                span.setAttribute("class", "input-group-btn");
                span.style.padding = "5px";
                span.style.verticalAlign = "bottom";

                objDivJanelaCriterioPesquisaDialogoDiv.appendChild(span);
            }

            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objLabelDataFinal);
            objGroupDataFim.appendChild(objInputDataFinal);
            objGroupDataFim.appendChild(iconCalendarFim);
            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objGroupDataFim);
            if (exibirBtnLimpar) {

                objDivJanelaCriterioPesquisaDialogoDiv.setAttribute("class", "input-group");
                var a = document.createElement("a");
                a.href = "javascript: void(0);";
                a.innerHTML = '<i class="icon-times" title="limpar dados"></i>';
                a.setAttribute('class', "pull-right");

                a.onclick = limparItemFiltro(objInputDataFinal, true);
                var span = document.createElement("span");
                span.setAttribute("class", "input-group-btn");
                span.style.padding = "5px";
                span.style.verticalAlign = "bottom";
                span.appendChild(a);
                objDivJanelaCriterioPesquisaDialogoDiv.appendChild(span);
            }

            objDivGrupo.appendChild(objDivJanelaCriterioPesquisaDialogoDiv);

            jQuery(objInputDataInicial).off("dp.change").on("dp.change", function (e) {

                var dataMin = moment(e.date);
                var dataMax = moment(e.date);

                jQuery(objInputDataFinal).data("DateTimePicker").minDate(dataMin);

                if (totalDias > 0) {
                    jQuery(objInputDataFinal).data("DateTimePicker").maxDate(dataMax.add("days", totalDias));
                }



                /*if (objInputDataInicial.valueOf() != "") {
                    if (elementoHoraInicio.valueOf() != "") {
                        jQuery(elementoHoraInicio).data("DateTimePicker").date(e.date.hour(0));
                    }
                }*/
            });

            /*jQuery(objInputDataFinal).off("dp.change").on("dp.change", function (e) {
                if (objInputDataFinal.valueOf() != "") {
                    if (objInputDataFinal.valueOf() != "") {
                        jQuery(elementoHoraFim).data("DateTimePicker").date(e.date.hour(23).minute(59).second(59));
                    }
                }
            });*/


            return objDivGrupo;


            
        };
        
    }
    return clsGrid;

})();



