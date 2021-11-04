var uninterTinymce = (function () {
    
    var classUninterTinymce = function ()
    {

       /************************************************
        * ATRIBUTOS DE ENTRADA
        ************************************************/
        this.seletor = "textarea";
        this.plugins = [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste noneditable"
        ];
        this.valid_elements = "em/i,strong/b,ol,ul,li,br,table[style|border|cellpadding|cellspacing],tr[style],td[style],th,img[src|alt|width|height],sub,sup,p[style],span[class|style],u";
        this.toolbar = "bold italic underline subscript superscript | alignleft aligncenter alignright alignjustify | imagem | visualblocks";
        this.menu = [];
        this.removerStatusBar = true;
        this.maximoCaracter = null;
        this.validarNrCaracteres = false;
        this.language = "pt_BR";
        this.skin = 'lightgray';        
        this.objetoEtiqueta = null;
        this.funcaoOnBlur = null;
        this.objetoParametrosOnBlur = null; //usado para pasar parametro de blur nas etiquetas...
        this.funcaoOnKeyDown = null;
        this.funcaoOnKeyUp = null;
        this.entity_encoding = "raw";
        this.paste_auto_cleanup_on_paste = true;
        this.statusbar = true;
        this.forced_root_block = false;
        this.contextmenu = "";
        this.permiteColar = true;
        this.desabilitarTexto = false;
        this.readonly = false;
        this.paste_data_images = false;
        this.advlist_bullet_styles = 'disc';
        this.height = 100;
        this.onresize = void (0);
        this.browser_spellcheck = true;
        var _this = this;
        
        //var tinymce = UNINTER.viewGenerica.getEditorTextoAvancado();

        //inicia editor
        _this.render = function () {

            try {
                if (!UNINTER.Helpers.stringValida(_this.funcaoOnBlur)) {
                    _this.funcaoOnBlur = null;
                }

                if (_this.desabilitarTexto === true)
                {
                    _this.permiteColar = false;
                }
                
                tinymce.init({	
					force_p_newlines : false,
					force_br_newlines : false, 
					convert_newlines_to_brs: false,
					// Not to add br elements.
					remove_linebreaks : true, 				
                    entity_encoding: _this.entity_encoding,                    
                    paste_auto_cleanup_on_paste: _this.paste_auto_cleanup_on_paste,
                    selector: _this.seletor,
                    menu: _this.menu,
                    language: _this.language,                    
                    skin: _this.skin,                    
                    plugins: _this.plugins,                    
                    valid_elements: _this.valid_elements,                    
                    statusbar: _this.statusbar,
                    forced_root_block: _this.forced_root_block,
                    toolbar: _this.toolbar, // preview code         
                    readonly: _this.readonly,
                    contextmenu: _this.contextmenu,
                    paste_data_images: _this.paste_data_images,
                    height: _this.height,
                    advlist_bullet_styles: _this.advlist_bullet_styles,
                    browser_spellcheck:_this.browser_spellcheck,
                    images_upload_handler: function (blobInfo, success, failure) {
                        // no upload, just return the blobInfo.blob() as base64 data
                        //console.info('images_upload_handler');
                        //console.log(blobInfo);
                        
                        var xhr, formData;

                        xhr = new XMLHttpRequest();
                        xhr.withCredentials = false;
                        xhr.open('POST', UNINTER.AppConfig.UrlWs("repositorio") + "sistemaRepositorioPublico/" + UNINTER.StorageWrap.getItem('user').token + "/upload");

                        xhr.onload = function () {
                            var json;
                            
                            if (xhr.status != 200) {
                                failure("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
                                console.error("HTTP Error: " + xhr.status);
                                return;
                            }

                            json = JSON.parse(xhr.responseText);                            
                            if (!json || typeof json.repositorio != "string") {
                                failure("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
                                console.error("Invalid JSON: " + xhr.responseText);
                                return;
                            }

                            success(UNINTER.AppConfig.UrlWs('repositorio') + 'SistemaRepositorioPublico/' + json.repositorio + "?arquivo=" + blobInfo.filename());
                        };

                        formData = new FormData();
                        formData.append('file', blobInfo.blob(), blobInfo.filename());

                        xhr.send(formData);

                    },
                    formats: {
                        //underline: { inline: 'p', classes: 'underline' },
                        //underline: { block: 'p', styles: { 'text-decoration': 'underline' } },
                        alignleft: { block: 'p', styles: { 'text-align': 'left' } },
                        aligncenter: { block: 'p', styles: { 'text-align': 'center' } },
                        alignright: { block: 'p', styles: { 'text-align': 'right' } },
                        alignjustify: { block: 'p', styles: { 'text-align': 'justify' } }
                    },


                    setup: function (ed) {                       
                        //console.info('setup');
                        ed.addButton('imagem', {
                            type: 'menubutton',       
                            //type: 'splitbutton',
                            icon: 'image',
                            title: 'Inserir Imagem',
                            //text: 'Imagem',
                            onclick: function () {
                                //console.info('onclick');
                                var id = ed.id;

                                var fnCall = function () {
                                    return function () {
                                        //verifica se tem imagem pra adicionar no corpo do texto
                                        if (UNINTER.objetoSelecionado.sistemarepositoriopublico.length > 0) {
                                            //seleciona editor
                                            var editor = tinymce.get(id);                // get editor instance
                                            var range = editor.selection.getRng();                  // get range

                                            //insere imagens no editor                                        
                                            var caminhoHTTP = UNINTER.AppConfig.UrlWs("repositorio") + "publico/";
                                            $.each(UNINTER.objetoSelecionado.sistemarepositoriopublico, function (k, link) {
                                                //var linkRepo = caminhoHTTP + link.repositorio + "/" + link.name;
                                                var linkRepo = UNINTER.AppConfig.UrlWs('repositorio') + 'SistemaRepositorioPublico/' + link.repositorio + "?arquivo=" + link.name;
                                                var newNode = editor.getDoc().createElement("img");  // create img node                                                                                        
                                                newNode.src = linkRepo;

                                                var span = editor.getDoc().createElement("span");
                                                span.appendChild(newNode);
                                                range.insertNode(span);

                                            });
                                            editor.save();
                                            
                                            
                                            if (_this.funcaoOnBlur != null) { //funcao de blur necessario para salvar no blur
                                                var textArea = document.getElementById(_this.objetoParametrosOnBlur.idObjeto);

                                                _this.funcaoOnBlur(textArea, _this.objetoParametrosOnBlur);

                                                editor.execCommand('renderMath');
                                            }
                                            //editor.focus();
                                        }
                                    }
                                };

                                var url = 'ava/SistemaRepositorioPublico/1/Exibir';
                                try {
                                    UNINTER.objetoSelecionado.sistemarepositoriopublico = new Object();
                                    UNINTER.objetoSelecionado.sistemarepositoriopublico['extensao'] = "gif, jpg, jpeg, png";
                                    UNINTER.objetoSelecionado.sistemarepositoriopublico['maxFileSize'] = "1048576";
                                } catch (E) { }
                                UNINTER.viewGenerica.novaJanela(url, fnCall(id));
                            }
                        });
                        ed.on('blur', function (e) {
                            
                            ed.save();
                            

                            if (_this.funcaoOnBlur != null && _this.funcaoOnBlur != void (0)) { //funcao de blur necessario para salvar no blur
                                if (_this.objetoParametrosOnBlur != void (0) && _this.objetoParametrosOnBlur != null) {
                                    var idObjeto = $(_this.seletor).attr('id');
                                    var textArea = document.getElementById(idObjeto);

                                    _this.funcaoOnBlur(textArea, _this.objetoParametrosOnBlur);
                                }
                                else {
                                    _this.funcaoOnBlur();
                                }
                            }
                            UNINTER.viewGenerica.setPlaceholderHeight();
                        });
                        ed.on('init', function () {
                            $(ed.getWin()).bind('resize', function (e) {
                                if (_this.onresize != void(0) && typeof _this.onresize == 'function')
                                _this.onresize();
                            })
                        });

                        if (_this.permiteColar !== true) {
                            //personaliza evento de colar
                            ed.on('paste', function (e) {
                                return tinymce.dom.Event.cancel(e);
                            });
                        }

                        ed.on('keydown', function (e) {                            
                            
                            if (_this.desabilitarTexto === true) {
                                if (e.code.toLowerCase() !== 'delete' && e.code.toLowerCase() !== "backspace")
                                {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                    return;
                                }
                            }

                            /*
                            
                            if (_this.funcaoOnKeyDown != null) {
                                _this.funcaoOnKeyDown();
                            }
                            */
                        });

                        
                        ed.on('keyup', function (e) {
                           

                            if (_this.desabilitarTexto === true) {
                                if (e.code.toLowerCase() !== 'delete' && e.code.toLowerCase() !== "backspace") {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                    return;
                                }
                            }

                            if (_this.validarNrCaracteres === true && _this.maximoCaracter > 0) {

                                //console.info('keyup');
                                var div = $(_this.seletor).closest('div');
                                
                                //verifica se nao ultrapassou nr de caracteres permitidos                                
                                var body = tinymce.get(ed.id).getBody(), text = tinymce.trim(body.innerText || body.textContent);
                                var contador = _this.maximoCaracter - text.length;
                                if (contador < 0) {
                                    contador = 0;
                                }
                                
                                //atualiza maximo de caracteres disponiveis na interface
                                $(ed.getContainer()).find("#" + ed.id + "_count").html("Máximo de caracteres: " + contador);

                                //se ultrapassou o limite, corta texto e exibe mensagem avisando
                                if (text.length > _this.maximoCaracter) {
                                    ed.setContent(text.slice(0, _this.maximoCaracter));
                                    ed.save();

                                    if (div.find('span.help-block').length == 0) {
                                        div.addClass('has-error').append('<span class="help-block"><label for="assunto" class="error" style="display: inline-block;">Ultrapassou o máximo de caracteres permitidos. O texto será cortado.</label></span>');
                                    }                                    
                                } else {
                                    div.removeClass('has-error');
                                    div.find('span.help-block').remove();
                                }                                
                            }
                            
                            $("#" + ed.id).keyup();
                            if (_this.funcaoOnKeyUp != null) {
                                _this.funcaoOnKeyUp();
                            }
                            
                        });
                    },
                    init_instance_callback: function (editor) {
                        //console.info('init_instance_callback');

                        $(editor.getContainer()).find(".mce-path").remove();

                        if (_this.validarNrCaracteres === true && _this.maximoCaracter > 0) {
                            var body = tinymce.get(editor.id).getBody(), text = tinymce.trim(body.innerText || body.textContent);
                            var contador = _this.maximoCaracter - text.length;
                            if (contador < 0)
                                contador = 0;

                            //adiciona div com contador de caracteres
                            var divContador = $("<div>").attr("id", editor.id + "_count").addClass("mce-path mce-last mce-flow-layout-item").html("Máximo de caracteres: " + contador);
                            $(editor.getContainer()).find(".mce-statusbar").find(".mce-container-body").prepend(divContador);
                        }

                        //aumenta o espaço para exibicao dos novos campos            
                        setTimeout(function () {
                            //seta delay pra terminar de carregar o plugin antes de modificar                    
                            UNINTER.viewGenerica.setPlaceholderHeight();
                        }, 500);
                    }
                });
            }
            catch (e) {
                console.error("erro inicializar" + e);
            }
        };

        //destroy todos os editores 
        this.destroyAll = function () {
            
            try {
                //debugger;
                if (tinymce.editors) {
                    //console.info("Total de editores: " + tinymce.editors.length);

                    if (tinymce.editors.length > 0) {
                        //se tem editores, destroy todos

                        //$.each(tinymce.editors, function (i, tiny) {
                        var tiny;
                        for (tiny in tinymce.editors) {
                            if (tiny != void (0) && tiny != null) {                                
                                //verifica se elemento existe antes de destrui-lo... se nao pode dar erro
                                if ($(document).find(tinymce.editors[tiny].id).length > 0)
                                    tinymce.editors[tiny].destroy();
                            }
                        }
                        //});
                        
                        //remove qualquer vestigio
                        tinymce.remove();

                        
                    }
                }
            }
            catch (e) {
                //tinymce.remove();

                console.error("erro destroy all")
                console.error(e);

            }
        };

        this.AdicionarTexto = function (textoAdicionar) {

            tinymce.activeEditor.execCommand('mceInsertContent', false, textoAdicionar);
        };

        exibeModal = function (memsagem) {
            UNINTER.Helpers.showModalAdicionarFila({
                size: "",
                body: memsagem,
                title: 'Limite de caracteres',
                buttons: [{
                    'type': "button",
                    'klass': "btn btn-primary",
                    'text': "OK",
                    'dismiss': 'modal',
                    'id': 'modal-cancel'
                }]
            });
        };
    };
    return classUninterTinymce;
})();