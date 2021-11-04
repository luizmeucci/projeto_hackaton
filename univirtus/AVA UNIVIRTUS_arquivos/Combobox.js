/*
 * Busca dados por ajax para popular elemento select
 * e monta autocomplete do jQuery UI caso autoComplete = true
 * 
 * Parametros obrigatórios: idObjCombo e url
 * Retorno do ajax em json => id, texto, valor, classe e titulo
 */
define([
    'jquery',
], function($){

    var Combobox =  function() {

        this.idObjCombo = null;
        this.idObjComboPai = null;
        this.seletorObjContainerCombo = null; //elemento que contem o idObjCombo (para evitar conflito de elementos com mesmo ID) Exemplo: #elemento, .elemento

        this.autoComplete = true;
        this.valorSelecionado = '';
        this.textoInicial = ''; //texto mostrado quando nao tem item selecionado
        this.msgNaoEncontrado = "didn't match any item"; //mensagem para autocomplete qdo nao encontra valor
        this.popularAoIniciar = false;  //se combo sera populada ao iniciar ou somente no click do elemento 
        this.idOption = ""; //o atributo do objeto de retorno de onde pegara o ID para preencher o option 
        this.valorOption = ""; //o atributo do objeto de retorno de onde pegara o valor para preencher o option
        this.textoOption = ""; //o atributo do objeto de retorno de onde pegara o texto para preencher o option
        this.tituloOption = ""; //o atributo do objeto de retorno de onde pegara o titulo para preencher o option
        this.dataOption = new Array(); // array EX: new Array('ordem', 'codigoOferta'). Esses valores serão inseridos no atributo data-ordem data-codigoOferta

        this.nomeObjRetorno = ""; //nome do objeto q sera retornado
        this.exibirPrimeiraOpcao = false;

        //Ericson: Quando devemos iniciar a combo com um unico valor (edicao), e nao lista, mas fazer com que no click ele traga a lista.
        this.inicializar     = false;
        this.initUrl         = null;
        this.initValorOption = null;
        this.initTextoOption = null;
        this.initNomeObjRetorno = null;
        

        //dados para ajax
        this.url = '';
        this.tipoEnvio = 'get';
        this.tipoRetorno = 'json';
        //this.dadosPost = {};
        this.retornoJson;
        this.objSelecionado;


        //funcao chamada qdo nao existe elemento pai selecionado
        this.erroObjPai = function () {
            alert('selecione o objeto pai');
        };

        //adiciona funcao no evento change
        this.change = null;
        //adiciona funcao no evento click
        this.click = null;

        //eventos do select2
        this.onChange = null; //executa ao alterar select2
        this.onOpening = null; //executa antes de chamar ajax
        this.onOpen = null; //executa apos oppening
        this.onRemoving = null; //evento antes de remover item
        this.onRemoved = null; //evento de remover 
        this.onSelecting = null; //ao selecionar
        this.onComplete = null; //ao selecionar
        //formata dadosajax (original do plugin)
        this.formatResult = null; //function(){};
        this.formatarTextoOption = null; //function(){} /* Formata os dados no append do option, sem usar o ajax do plugin e sim o nosso ajax */

        // tratamento de erros no retorno do AJAX, quando ha erro na requisicao
        this.errorCallback = null;

        var combobox = this;
        var objDOMCombo = null; //elemento principal
        var arrayCombosPai = null;
        var objRetorno = [];
        var controlePaiSelecionado = 0; //controla para so chamar ajax qdo valor alterar, necessario para autocomplete
        var controleCarregarFilho = false;  //controla se filho deve ser carregado ao iniciar
        var erroPaiNaoSelecionado = false;
        
        var populado = false;
        var urlOriginal; //Quando usamos replace no id do pai.
        this.exception = ""; //controle ajax bem sucedido
                
        this.manterComboFechada = false;//controla para nao refazer busca no onOpen
        this.showInfo = false;
        //monta e popula combobox
        this.render = function () {
            if(combobox.showInfo) console.info('render');
            urlOriginal = combobox.url;
            
            //se tiver seletorObjContainerCombo busca dentro do elemento informado (evita conflito de elementos com mesmo id...)
            if (combobox.seletorObjContainerCombo == null) objDOMCombo = jQuery("#" + combobox.idObjCombo);
            else objDOMCombo = jQuery(combobox.seletorObjContainerCombo + " #" + combobox.idObjCombo);
            objDOMCombo.unbind('click');
            objDOMCombo.unbind('change.combobox');
            
            if (combobox.idObjComboPai) {
                var arrayIdsPai = combobox.idObjComboPai.split('|');
                arrayCombosPai = [];

                for (var i = 0; i < arrayIdsPai.length; i++) {
                    arrayCombosPai.push(jQuery("#" + arrayIdsPai[i]));
                }
            }
            combobox.iniciarCombo();

            //inicializa autocomplete
            combobox.iniciarAutoComplete();

            if (combobox.popularAoIniciar && combobox.popularAoIniciar !== "false") {
                combobox.ajaxCarregando();
            } else {
                //combobox.alterarValorSelecionado(combobox.valorSelecionado);
            }

            if (combobox.popularAoIniciar && combobox.popularAoIniciar !== "false" && !combobox.inicializar)
                combobox.buscarDados();

            if (combobox.inicializar && combobox.inicializar !== "false") {                
                combobox.buscarDadosInicializacao();
            }
            
            return objRetorno;
        };

        //retorna json do ajax
        this.getObjRetorno = function () {
        	/*var objRetorno = [];
        	jQuery("#" + combobox.idObjCombo + " option").each(function (i, item) {        		
            	 objRetorno[jQuery(this).val()] = jQuery(this).text(); 
            });*/
            return objRetorno;
        };

        this.getValorSelecionado = function () {
            return combobox.valorSelecionado;
        };

        this.getObjSelecionado = function () {            
            var result;
            var objTemp = combobox.retornoJson;
          
            if (populado == false && this.inicializar == true && combobox.initValorOption != null) {
                if (objTemp[combobox.initValorOption] == combobox.valorSelecionado) {
                    result = objTemp;
                } else {
                    var stringJson = '{"' + combobox.initValorOption + '":' + combobox.valorSelecionado + '}';
                    result = _.findWhere(combobox.retornoJson, JSON.parse(stringJson));
                }
            } else {
                if (objTemp[combobox.valorOption] == combobox.valorSelecionado) {
                    result = objTemp;
                } else {

                    var stringJson = '{"' + combobox.valorOption + '":' + combobox.valorSelecionado + '}';

                    var temp = parseInt(combobox.valorSelecionado);

                    if (isNaN(temp)) {
                        stringJson = '{"' + combobox.valorOption + '":"' + combobox.valorSelecionado + '"}';
                    }

                    
                    result = _.findWhere(combobox.retornoJson, JSON.parse(stringJson));
                }
            }
            return result;
        };

        this.getTextoSelecionado = function () {
            return objDOMCombo.find("option:selected").text();
        };

		this.getTituloSelecionado = function () {
            return objDOMCombo.find("option:selected").prop('title');
        };
		
		
        //adiciona valor ao combo e no objRetorno
		this.adicionarValor = function (itemJSON) {
		    
            //adiciona option no combo
		    
            var jsonAux = {};

            var option = $("<option>").text(itemJSON[combobox.textoOption]);

            if (combobox.formatarTextoOption != void (0) && typeof combobox.formatarTextoOption == 'function')
            {
                try {
                    option = option.text(combobox.formatarTextoOption(itemJSON));
                } catch (e) {
                    option = option.text(itemJSON[combobox.textoOption]);
                }
            }

            if (combobox.idOption) {
                option.attr('prop', itemJSON[combobox.idOption]);                
                jsonAux[combobox.idOption] = itemJSON[combobox.idOption];
            }
            if (combobox.valorOption) {
                option.val(itemJSON[combobox.valorOption]);                
                jsonAux[combobox.valorOption] = itemJSON[combobox.valorOption];
            }
            if (combobox.tituloOption) {
                option.attr('title', itemJSON[combobox.tituloOption]);                
                jsonAux[combobox.tituloOption] = itemJSON[combobox.tituloOption];
            }
            if (combobox.classe) {
                option.attr("class", itemJSON[combobox.classe]);
                jsonAux[combobox.classe] = itemJSON[combobox.classe];
            }
            if (combobox.dataOption.length > 0) {
                $(combobox.dataOption).each(function (k, item) {                    
                    option.data(item, itemJSON[item]);
                    jsonAux['data-' + item] = itemJSON[combobox.item];
                });
                
            }
            
            
            
            objDOMCombo.append(option);
            jsonAux[combobox.textoOption] = itemJSON[combobox.textoOption];

            //adiciona item no JSON de retorno
            objRetorno.push(jsonAux);
        };


        //remove valor do combo
        this.removerValor = function (valorDelete) {

            //atualiza objRetorno removendo item no JSON
            objRetorno = jQuery.grep(objRetorno, function (item) {
                return item.valor !== valorDelete;
            });

            //remove option do combo
            objDOMCombo.find("option[value=" + valorDelete + "]").remove();
        };

        //altera valor do combo e input autocomplete
        this.alterarValorSelecionado = function (valorSelecionado) {
            combobox.valorSelecionado = valorSelecionado;

            objDOMCombo.val(valorSelecionado);
            if (combobox.autoComplete) {
                objDOMCombo.select2("val", valorSelecionado);
            }
        };

        
        //altera valor do combo e input autocomplete... mesma coisa q alterarValorSelecionado, criado para padronizar gets e sets
        this.setValorSelecionado = function (valorSelecionado) {
            combobox.valorSelecionado = valorSelecionado;

            objDOMCombo.val(valorSelecionado);
            if (combobox.autoComplete) {
                objDOMCombo.select2("val", valorSelecionado);
            }
        };

        //vincula funcoes de click e change no elemento
        this.iniciarCombo = function () {
            objDOMCombo.html("<option></option>");
            if (combobox.exibirPrimeiraOpcao == true) {
                objDOMCombo.append("<option value='0'>" + combobox.textoInicial + "</option>");
                valorSelecionado = combobox.valorSelecionado || "0";
            }
            
            //atualiza valorSelecionado no change
            objDOMCombo.on('change.combobox', function () {
                if (combobox.valorSelecionado != jQuery(this).val()) {
                    combobox.valorSelecionado = jQuery(this).val();
                    
                    //verifica se tem evento change vinculado
                    if (combobox.change !== 'undefined' && combobox.change != null) {
                        if(typeof(combobox.change) == "function"){
                            combobox.change( combobox.valorSelecionado );
                        } else {
                            //Se chegou como texto, tentamos executar, caso contrario, log informando:
                            try {
                                var fn = new Function(combobox.change);
                                fn(combobox.valorSelecionado);                                
                            } catch (e) {
                                console.warn("Evento change da combobox nao foi disparado corretamente: =>Exception:");
                                console.warn(e);
                            }
                        }   
                    }
                }
            });
            
            if (combobox.click instanceof Function || combobox.idObjComboPai != null || !combobox.popularAoIniciar || combobox.popularAoIniciar == "false") {

                //vincular evento click se tem click OU se tem combo pai OU se popularAoIniciar = false	
                objDOMCombo.on('click', function () {
                    if (combobox.showInfo) console.info("objDOMCombo on click");
                   // onClickObjDOMCombo();
                });
            }

            //se tem pai, atualiza dados do filho 
            if (combobox.idObjComboPai != null) {
                for (var i = 0; i < arrayCombosPai.length; i++) {

                    var objDOMComboPai = arrayCombosPai[i];
                    controlePaiSelecionado = objDOMComboPai.val();
                    //combobox.dadosPost = { idPai: objDOMComboPai.val() };

                    //se tem pai, vincula change ao elemento para quando pai alterar, limpar dados do filho
                    objDOMComboPai.on('change.combobox', function () {
                        objDOMCombo.html("<option></option>");
                        //verifica se alterou valor, 
                        if (controlePaiSelecionado != jQuery(this).val()) {

                            if (combobox.exibirPrimeiraOpcao == true) {
                                objDOMCombo.append("<option value='0'>" + combobox.textoInicial + "</option>");
                                combobox.valorSelecionado = "0";
                            }

                            combobox.valorSelecionado = '';
                            combobox.alterarValorSelecionado(combobox.valorSelecionado);
                            combobox.manterComboFechada = false;
                            controleCarregarFilho = false;
                            erroPaiNaoSelecionado = false;
                        }
                        controlePaiSelecionado = jQuery(this).val();
                    });
                }
            }
        };

        var onClickObjDOMCombo = function () {
            
            if (combobox.showInfo) console.info('onClickObjDOMCombo');
            //se tem pai, vincula click ao elemento para carregar combo  
            if (combobox.idObjComboPai != null && !objDOMCombo.val()) {
                //se objPai nao selecionado, dispara evento configurado
                var paisValidados = true;

                for (var i = 0; i < arrayCombosPai.length; i++) {
                    var objDOMComboPai = arrayCombosPai[i];
                    if (!objDOMComboPai.val()) {
                        if (combobox.erroObjPai instanceof Function) {
                            combobox.erroObjPai();
                            erroPaiNaoSelecionado = true;
                        } else {
                            try {
                                erroPaiNaoSelecionado = true;
                                eval(combobox.erroObjPai);
                            } catch (e) {
                                console.warn("Nao foi executado a funcao de validacao do pai");
                            }
                        }
                        paisValidados = false;
                    }
                }
                //se tem valor pai selecionado e ainda nao buscou, carrega dados por ajax
                if (!controleCarregarFilho && paisValidados) {
                    populado = true; //Para evitar loop infinito
                    //combobox.ajaxCarregando();
                    //combobox.dadosPost = { idPai: objDOMComboPai.val() };
                    controleCarregarFilho = true;
                    combobox.buscarDados();
                }
            }

            if ((combobox.popularAoIniciar == false || combobox.popularAoIniciar == "false") && populado == false && erroPaiNaoSelecionado == false) {
                populado = true; //Para evitar loop infinito
                combobox.ajaxCarregando();
                combobox.buscarDados();
            }
            //verifica se tem evento click vinculado
            if (combobox.click instanceof Function)
                combobox.click();

        }
        //adiciona valor ao combo e no objRetorno
        this.adicionarValorInit = function (itemJSON) {
            //adiciona option no combo
            var htmlResult = '<option';
            var jsonAux = {};

            if (combobox.idOption) {
                htmlResult += ' id="' + itemJSON[combobox.idOption] + '"';
                jsonAux[combobox.idOption] = itemJSON[combobox.idOption];
            }
            if (combobox.initValorOption) {
                htmlResult += ' value="' + itemJSON[combobox.initValorOption] + '"';
                jsonAux[combobox.initValorOption] = itemJSON[combobox.initValorOption];
            }
            if (combobox.tituloOption) {
                htmlResult += ' title="' + itemJSON[combobox.tituloOption] + '"';
                jsonAux[combobox.tituloOption] = itemJSON[combobox.tituloOption];
            }

            //Caso seja um objFilho:
            var texto = combobox.initTextoOption.split(".");
            if (texto.length > 1) {
                htmlResult += '>' + itemJSON[texto[0]][texto[1]] + '</option>';
            } else {
                htmlResult += '>' + itemJSON[combobox.initTextoOption] + '</option>';
            }
            
            objDOMCombo.append(htmlResult);

            jsonAux[combobox.initTextoOption] = itemJSON[combobox.initTextoOption];

            //adiciona item no JSON de retorno
            objRetorno.push(jsonAux);

        };

        this.buscarDadosInicializacao = function () {
            
            if (combobox.initUrl == "" || combobox.initUrl == null) {                
                console.warn("initUrl não informado");
                return;
            }

            $.ajax({
                async: false,
                url: combobox.initUrl,
                dataType: combobox.tipoRetorno,
                type: combobox.tipoEnvio,
                success: function (data) { 
                    
                    combobox.retornoJson = data[combobox.initNomeObjRetorno];
                    // trata combo com multipla escolha
                    if(data[combobox.initNomeObjRetorno].length > 0 && jQuery('#' + combobox.idObjCombo).attr('multiple') == "multiple") {                        
                        var arrValorSelecionado = new Array(); 
                        $.each(data[combobox.initNomeObjRetorno], function(k, item){   
                            combobox.adicionarValorInit(item);
                            arrValorSelecionado.push(item[combobox.initValorOption]); 
                        });

                        combobox.valorSelecionado = arrValorSelecionado.join(", "); 
                        combobox.alterarValorSelecionado(arrValorSelecionado); 
                    }
                    else{
                        combobox.adicionarValorInit(data[combobox.initNomeObjRetorno]);
                        combobox.valorSelecionado = data[combobox.initNomeObjRetorno][combobox.initValorOption]; //Seta o valor na combo.
                        combobox.alterarValorSelecionado(combobox.valorSelecionado);                    
                    }
                    if (combobox.successCallback && typeof combobox.successCallback === 'function') {
                        combobox.successCallback(data, combobox.idObjCombo);
                    }
                },
                error: function (data, b, e) {
                    exception = {
                        "responseJSON": data.responseJSON,
                        "responseText": data.responseText,
                        "status": data.status
                    };

                    if (combobox.errorCallback && typeof combobox.errorCallback === 'function') {
                        combobox.errorCallback(exception, combobox.idObjCombo);
                    }
                }
            });
        }
        //busca dados ajax
        this.buscarDados = function () {            
            combobox.inicializar = false;
            
            if (combobox.idObjComboPai !== void (0) && combobox.idObjComboPai !== null) {
                if (arrayCombosPai == null || arrayCombosPai[0] == null) {
                    console.error('Erro ao buscar o primeiro objeto pai.');
                    return;
                }

                var valor = arrayCombosPai[0].val();

                var tempUrl = urlOriginal.replace("{valor}", valor);
                tempUrl = tempUrl.replace("{valorIdObjComboPai}", valor);

                for (var i = 0; i < arrayCombosPai.length; i++) {
                    var objDOMPai = arrayCombosPai[i];

                    var idObjPai = objDOMPai.attr('id');
                    var valorPai = objDOMPai.val();

                    tempUrl = tempUrl.replace("{" + idObjPai + "}", valorPai);
                }

                combobox.url = tempUrl;
            }
            var self = this;
            if (combobox.validar()) {
                
                //var htmlResult = '<option value=""></option>';
                $.ajax({
                    async: true,
                    url: combobox.url,
                    dataType: combobox.tipoRetorno,
                    type: combobox.tipoEnvio,
                    success: function (data) {
                        combobox.retornoJson = data[combobox.nomeObjRetorno];
                        objDOMCombo.find("option").remove();
                        if (combobox.exibirPrimeiraOpcao == true) {
                            objDOMCombo.append("<option value='0'>" + combobox.textoInicial + "</option>");
                            combobox.valorSelecionado = combobox.valorSelecionado || "0";
                        } else if (jQuery('#' + combobox.idObjCombo).attr('multiple') == undefined) {
                            objDOMCombo.append("<option></option>");
                        }

                        //objRetorno = data[combobox.nomeObjRetorno];                	
                        $.each(data[combobox.nomeObjRetorno], function (key, item) {
                            combobox.adicionarValor(item);
                        });

                        if (combobox.valorSelecionado != "" && combobox.valorSelecionado != void(0))
                            combobox.alterarValorSelecionado(combobox.valorSelecionado); //#ellen 16-05

                        if (combobox.successCallback) {
                            if (typeof combobox.successCallback === 'function') {
                                combobox.successCallback(data, combobox.idObjCombo);
                            } else {
                                try { eval(combobox.successCallback + "(data, combobox.idObjCombo)") } catch (e) { };
                            }
                        }
                        self.ajaxCompleto();
                    },
                    error: function (data, b, e) {
                        self.ajaxCompleto();
                        exception = {
                            "responseJSON": data.responseJSON,
                            "responseText": data.responseText,
                            "status": data.status
                        };

                        if ( combobox.errorCallback && typeof combobox.errorCallback === 'function' ) {
                            combobox.errorCallback(exception, combobox.idObjCombo);
                        }
                    }
                });

                
                //insere options e seleciona valor
                //objDOMCombo.html(htmlResult);
            }
            else {
                //combobox.ajaxCompleto();
                self.ajaxCompleto();
            }
            
        };

        
        //valida dados para fazer ajax
        this.validar = function () {
            if (combobox.showInfo) console.info('validar');
            var erro = 0;
            var descricaoErro = 'Parâmetros necessários não informados';
            //verifica se elemento existe
            if (!objDOMCombo.length)
                erro++;

            //verifica se url informada
            if (combobox.url == "") {
                erro++;
                descricaoErro += "\nURL não informada";
            }

            //verifica se existe pai e tem valor setado
            if (combobox.idObjComboPai != null) {
                if (arrayCombosPai.length == 0) {
                    descricaoErro += "\nObj pai não encontrado";
                    erro++;
                }

                for (var i = 0; i < arrayCombosPai.length; i++) {
                    var objDOMComboPai = arrayCombosPai[i];

                    if (objDOMComboPai.length == 0 || !objDOMComboPai.val()) {

                        descricaoErro += "\nObj pai não encontrado";
                        erro++;
                    }
                }
            }


            if (erro == 0)
                return true;
            else {
                console.warn(descricaoErro);
                
                return false;
            }
        };


        this.ajaxCarregando = function () {
            if (combobox.showInfo) console.info('ajaxCarregando');
            if (combobox.autoComplete) {
                
                objDOMCombo.select2({
                    placeholder: "Carregando..."                    
                });
                objDOMCombo.select2('disable');
            }
        };

        this.Readonly = function () {
            objDOMCombo.prop("readonly", true);
            if (combobox.autoComplete) {
                objDOMCombo.select2();
            }
        };

        this.RemoveReadonly = function () {
            objDOMCombo.prop("readonly", false);
            if (combobox.autoComplete) {
                objDOMCombo.select2();
            }
        };

        this.ajaxCompleto = function () {
            
            if (combobox.showInfo) console.info('ajaxCompleto');

            var formatResult = function (state) {                
                return state.text;
            };
            
            //funcao para formatar o texto apos carregamento. Exemplo: adicionar imagen... css
            if (combobox.formatResult !== 'undefined' && combobox.formatResult != null) {
                if (typeof (combobox.formatResult) == "function") {
                    formatResult = combobox.formatResult;
                } else {
                    //Se chegou como texto, tentamos executar, caso contrario, log informando:
                    try {                        
                        var formatResult = function (state) { return eval(combobox.formatResult) };// function(state){ new Function(state,funcao)};
                        objDOMCombo.select2({
                            formatResult: formatResult
                        });

                        
                    } catch (e) {
                        console.warn("Evento formatResult da combobox não foi disparado corretamente: =>Exception:");
                        console.warn(e);
                    }
                }                
            }       

            if (combobox.autoComplete) {
                objDOMCombo.select2({
                    placeholder: combobox.textoInicial,                    
                    formatNoMatches: function (term) {
                        return combobox.msgNaoEncontrado;
                    },
                    formatResult: formatResult
                });
                objDOMCombo.select2('enable');
                //var opened = objDOMCombo.data('select2').opened();                
                if ((!combobox.popularAoIniciar || combobox.popularAoIniciar == "false") && !combobox.manterComboFechada) {
                    combobox.manterComboFechada = true;
                    objDOMCombo.select2('open');
                }
            }

            if(typeof combobox.onComplete == 'function')
            {
                try { combobox.onComplete() } catch (e) { };
            }

        };

        //atualiza valor de populado
        this.setPopulado = function (_populado) {
            if (typeof (_populado) != "boolean") {
                console.error("Tipo Invalido");
                return;
            }
            else populado = _populado;
        }
        this.getPopulado = function () {
            return populado;
        }

        //fecha combo
        this.fecharCombo = function () {
            if (combobox.showInfo) console.info("fecharCombo");
            objDOMCombo.select2("close");
        }
        this.resetarCombo = function () {
            
            objDOMCombo.html("<option></option>");
            if (combobox.exibirPrimeiraOpcao == true) {
                objDOMCombo.append("<option value='0'>" + combobox.textoInicial + "</option>");
                combobox.valorSelecionado = "0";
            }
            objDOMCombo.select2({
                placeholder: combobox.textoInicial,
                formatNoMatches: function (term) {
                    return combobox.msgNaoEncontrado;
                }
            });
        }
        this.habilitarCombo = function () {
            console.info("habilitarCombo");
            objDOMCombo.select2('enable');
        }
        this.desabilitarCombo = function () {
            console.info("desabilitarCombo");
            objDOMCombo.select2('disable');
        }
        this.setUrl = function(_url){
            combobox.url = _url;
            urlOriginal = combobox.url;
        }
        //inicia autoComplete
        this.iniciarAutoComplete = function () {
            if (combobox.autoComplete) {                
                objDOMCombo.select2("destroy").off("select2-opening").off("select2-open");

                objDOMCombo.select2({
                    placeholder: combobox.textoInicial,
                    formatNoMatches: function (term) {
                        return combobox.msgNaoEncontrado;
                    }

                })
                .on("select2-opening", function (e) {                    
                    if (combobox.showInfo) console.info('opening');
                    
                    //verifica se tem evento click vinculado
                    try {
                        if (combobox.onOpening instanceof Function)
                            combobox.onOpening(e);
                    }
                    catch (e){ 
                        console.warn("Não foi possível executar função onOpening" + e);
                    }

                    
                    onClickObjDOMCombo();
                    
                })
                .on("select2-open", function (e) {
                    if (combobox.showInfo) console.info('open');
                    //se tem pai, mostra erro e fecha campo de pesquisa
                    if (erroPaiNaoSelecionado) {
                        objDOMCombo.select2("focus");
                    }

                    try {
                        if (combobox.onOpen instanceof Function)
                            combobox.onOpen(e);
                    }
                    catch (e) {
                        console.warn("Não foi possível executar função onOpen" + e);
                    }
                })
                .on("select2-selecting", function (e) {
                    if (combobox.showInfo) console.info('selecting');
                    try {
                        if (combobox.onSelecting instanceof Function)
                            combobox.onSelecting(e);
                    }
                    catch (e) {
                        console.warn("Não foi possível executar função onSelecting " + e);
                    }
                })
                .on("select2-removing", function (e) {
                    if (combobox.showInfo) console.info('removing');

                    try {
                        if (combobox.onRemoving instanceof Function)
                            combobox.onRemoving(e);
                    }
                    catch (e) {
                        console.warn("Não foi possível executar função onRemoving " + e);
                    }
                }).on("select2-removed", function (e) {
                    if (combobox.showInfo) console.info('removed');

                    try {
                        if (combobox.onRemoved instanceof Function)
                            combobox.onRemoved(e);
                    }
                    catch (e) {
                        console.warn("Não foi possível executar função onRemoved " + e);
                    }
                }).on("change", function (e) {
                    if (combobox.showInfo) console.info('change');

                    try {
                        if (combobox.onChange instanceof Function)
                            combobox.onChange(e);
                    }
                    catch (e) {
                        console.warn("Não foi possível executar função onChange " + e);
                    }

                    
                });
               
            }
        };
    }
    return Combobox;
});
