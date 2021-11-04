/* ==========================================================================
   Helpers
   ========================================================================== */

define([
'jquery',
'underscore',
'backbone'
], function ($, _, Backbone) {
    'use strict';

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

	var Helpers = {
		/*
		 *  Recebe um elemento e o coloca dentro de outro, para
		 *  permitir a utilização da função .html() do jQuery e pegar o seu conteúdo.
		 *
		 *  @return html elements
		 * */
		getElementContents : function (viewElement) {
            return $('<div>').append(viewElement).html();
		},

		/*
		 *  Retorna uma string com a primeira letra maiúscula.
		 *
		 *  @return string
		 * */
		toTitleCase : function (str) {
			return str.replace(/\w\S*/g, function(txt){ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
		},

		hourToMsec : function (hour) {
			// Milisegundos em 1 hora.
			var m = 3600000;

			if ( hour !== parseInt(hour) ) {
					var type = typeof(hour);
					throw new Error( type.toUpperCase() + ' passado como argumento. INT esperado.');
			}

			return hour * m;
		},

		getObjectAt : function (position, obj) {
			var position = position || 0;
			var arr = [];
			for ( var i in obj ) {
				arr.push(i);
			}
			return arr[position];
		},

		// Serializa os campos de um formulário.
		serializeObject : function (form) {
			var o = {};
			var a = $(form).serializeArray();
			$.each(a, function () {
					if (o[this.name] !== undefined) {
							if (!o[this.name].push) {
									o[this.name] = [o[this.name]];
							}
							o[this.name].push(this.value || '');
					} else {
							o[this.name] = this.value || '';
					}
			});
			return o;
		},

		// Cookies: Set / Get e delete.
		cookie : {
			set : function (name, value, hours) {

				var expires = "", date, day, hours;

				if (hours) {
						date = new Date();
						date.setTime(date.getTime()+(hours*60*60*1000));
						// date.setHours(date.getHours() + hours);
						expires = "; expires="+( date.toUTCString() );
				}

				document.cookie = name+"="+value+expires+"; path=/";
			},

			get: function (name) {
				var nameEQ = name + "=",
						ca = document.cookie.split(';');

				for(var i=0; i < ca.length; i++) {
						var c = ca[i];
						while (c.charAt(0)==' ') c = c.substring(1,c.length);
						if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
				}
				return null;
			},

			'delete': function (name) {
				this.set(name,"",-1);
			}
		},

		// Recebe uma string contendo data no formato dd/mm/yyyy
		// e converte para yyyy-mm-dd, que é o formato aceito no input do tipo date.
		toInputDateFormat : function (str) {
            str = str.split('/');
            var d = str[0],
                m = str[1],
                y = str[2];

            return y + "-" + m + "-" + d;
		},

		toBRFormat : function (str) {
			if (str.indexOf('/') > 0) { return str; }
			str = str.split('-');
            var d = str[2],
                m = str[1],
                y = str[0];

			return d + "/" + m + "/" + y;
		},

		// Formatação de data
		date : function (datetime, withTime, timeOnly, withTag) {
            timeOnly = timeOnly || false;
			var dt = datetime + "Z"; // Faz o FF e IE interpretar a UTC date igual ao Chrome
			var d = new Date(dt),
				showTime = showTime || false,
				str = [],
				day, month, year, hours, minutes, seconds, time;

			var addZero = function (n) { return (n < 10) ? '0' + n : n; };

			function dateFromISOIE(s) {
				s = s.split(/\D/);
                return new Date(Date.UTC(s[0], --s[1]||'', s[2]||'', s[3]||'', s[4]||'', s[5]||'', s[6]||''));
            }

			// IE < 9
			// 2014-04-04T16:19:51Z
			if ( isNaN(d) ) {
				d = dateFromISOIE(dt);
			}

			day = addZero(d.getUTCDate());
			month = addZero(d.getMonth() + 1);
			year = d.getFullYear().toString().replace(20, '');
			hours = addZero(d.getUTCHours());
			minutes = addZero(d.getUTCMinutes());
			seconds = addZero(d.getUTCSeconds());

			var temp = datetime.split('T');
			var tempD = temp[0].split('-');
			var tempH = temp.length > 1 ? temp[1].split(':') : ['00','00', '00'];

            //Data
			day = tempD[2];
			month = tempD[1];
			year = tempD[0];
            //Hora
			hours = tempH[0];
			minutes = tempH[1];
			seconds = tempH[2];

			time = ['<time>', hours, ':', minutes, '</time>'].join('');

            if (withTag === false) {
                year = d.getFullYear().toString();
                time = [hours, ':', minutes].join('');
            }

			if (timeOnly) { return time; }
			str = [ day , month, year].join('/');

			if ( withTime ) {
				return [str, time].join(" ");
			}

			return str;
		},

        // Formatação de data (novo)
        dateTimeFormatter: function (options) {
            var defaults = {
                    dateTime: null,
                    withTag: null,
                    withSeconds: false,                    
                    yearFull: true //ano completo

                },
                opts = _.defaults(options, defaults),
                temp, date, time, day, month, year, hours, minutes, seconds;

            function prepare() {
                temp = opts.dateTime.split('T');

                time = temp[1].split(':');

                // Data
                date = temp[0].split('-');
                day = date[2];
                month = date[1];
                year = date[0];
                if (!opts.yearFull) {                    
                    year = year.slice(2, 4);
                }
                
                // Hora
                hours = time[0];
                minutes =  time[1];
                seconds = time[2];

                
            }

            function getDate() {
                //year = date[0].slice(2,4);
                return day + '/' + month + '/' + year;
            }

            function getHours() {
                var t;
                if (options.withSeconds) {
                    t = hours + ':' + minutes + ':' + seconds;
                }
                else {
                    if ( opts.withTimeH) {
                    if (minutes == "00") minutes = "";
                    minutes += "h";
                }
                    t = hours + ':' + minutes;
                }
                
                
                if (options.withTag) {
                    t = '<time>' + t + '</time>';
                }

                
                return t;
            }

            function getHoursString() {
                var t;
                    
                if (minutes == "00")
                    t = hours + "h";
                else 
                    t = hours + ':' + minutes + "h";
                
                if (options.withTag) {
                    t = '<time>' + t + '</time>';
                }
                return t;
            }

            // Construção das variáveis
            prepare();

            // API pública
            return {
                date: function date() {
                    return getDate();
                },
                time: function time() {
                    return getHours();
                },
                timeString: function timeString() {
                    return getHoursString();
                },
                dateTime: function () {
                    return getDate() + ' '+getHours();
                }
                
            };
        },

        /**
        * Verifica se a hora inicial é menor que a final.
        */
		isHoraInicialMenorHoraFinal: function (horaInicial, horaFinal) {
            var horaIni = horaInicial.split(':'),

                horaFim = horaFinal.split(':'),

                // Verifica as horas. Se forem diferentes, é só ver se a inicial
                // é menor que a final.
                hIni = parseInt(horaIni[0], 10),

                hFim = parseInt(horaFim[0], 10);

            if (hIni < hFim) {
                return true;
            }
            else {
                if (hIni === hFim) {
                    // Se as horas são iguais, verifica os minutos então.
                    var mIni = parseInt(horaIni[1], 10),

                        mFim = parseInt(horaFim[1], 10);
                    if (mIni < mFim) {
                        return true;
                    }
                    else {
                        if (mIni === mFim) {
                            // Se os minutos são iguais, verifica os segundos então.
                            var sIni = parseInt(horaIni[2], 10),

                                sFim = parseInt(horaFim[2], 10);

                            if (sIni < sFim) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            return false;
                        }
                    }
                }
                else {
                    return false;
                }
            }
		},

        
		isDataInicialMenorDataFinal: function (obj) {

            // Qualquer grupo abaixo é aceito
            /*
		    var obj = {

		        dataInicialT: '2017-01-01T00:00',
		        dataFinalT: '2017-01-01T23:59',

		        dataHoraInicial: '01/01/2017 00:00',
                dataHoraFinal: '01/01/2017 23:59',

		        dataInicial: '01/01/2017',
		        dataFinal: '01/01/2017',
		        horaInicial: '00:00',
		        horaFinal: '23:59'
		    };
            */

		    var split = "/";
		    var dataInicial, dataFinal, horaInicial, horaFinal;
		    var dataIni, dataFim, aIni, aFim, mIni, mFim, dIni, dFim;

		    var attrs = {
		        'dataInicialT': {
		            splitData: '-',
		            splitHora: 'T',
		            reverse: true,
		            dataFinal: 'dataFinalT'
		        },
		        'dataHoraInicial': {
		            splitData: '/',
		            splitHora: ' ',
		            reverse: false,
                    dataFinal: 'dataHoraFinal'
		        },
		        'dataInicial': {
		            splitData: '/',
		            splitHora: void(0),
		            reverse: false,
                    dataFinal: 'dataFinal'
		        }
		    };

		    $.each(attrs, function (attr, item) {

		        if (obj[attr] != void (0))
		        {
		            split = attrs[attr].splitData;

		            if(attrs[attr].reverse == true)
		            {
		                dataInicial = obj[attr].split(attrs[attr].splitHora)[0].split(attrs[attr].splitData).reverse().join(attrs[attr].splitData);
		                dataFinal = obj[attrs[attr].dataFinal].split(attrs[attr].splitHora)[0].split(attrs[attr].splitData).reverse().join(attrs[attr].splitData);
		            }
		            else
		            {
		                dataInicial = obj[attr].split(attrs[attr].splitHora)[0];
		                dataFinal = obj[attrs[attr].dataFinal].split(attrs[attr].splitHora)[0];
		            }

		            horaInicial = (attrs[attr].splitHora != void (0)) ? obj[attr].split(attrs[attr].splitHora)[1] : obj.horaInicial
		            horaFinal = (attrs[attr].splitHora != void (0)) ? obj[ attrs[attr].dataFinal ].split(attrs[attr].splitHora)[1] : obj.horaFinal;
		        }

		    });


		    dataIni = dataInicial.split(split);
		    dataFim = dataFinal.split(split);

		    // Verifica os anos. Se forem diferentes, é só ver se o inicial
		    // é menor que o final.
		    aIni = parseInt(dataIni[2], 10);
		    aFim = parseInt(dataFim[2], 10);

		    mIni = parseInt(dataIni[1], 10);
		    mFim = parseInt(dataFim[1], 10);

		    dIni = parseInt(dataIni[0], 10);
		    dFim = parseInt(dataFim[0], 10);

		    //Se o ano é maior, passa direto:
		    if(aFim > aIni)
		    {
		        return true;
		    }

		    //Se o mes é maior, passa direto
		    if(mFim > mIni && aIni == aFim)
		    {
		        return true;
		    }

		    //Se o dia é maior, passa direto
		    if (dFim > dIni && mIni == mFim && aIni == aFim)
		    {
		        return true;
		    }

		    //Se a hora é maior, passa direto.
		    if (UNINTER.Helpers.isHoraInicialMenorHoraFinal(horaInicial, horaFinal) && dFim == dIni && mIni == mFim && aIni == aFim) {
		        return true;
		    } else {
		        return false;
		    }    
		},

		// Formata o nome do usuário para mostrar somente o 
		// Nome e Sobrenome
		username : function (name) {
			name = name || null;
			if (!name) { throw new Error('Atributo "name" não fornecido!'); }
			var n = name.trim().split(' ');
			var n1 = n[0];
			var n2 = n.reverse()[0];
			return n1 + " " + n2;
		},

		/**
		*	Wrapper para a contrução da Modal do Twitter Bootstrap.
		*	Recebe Objeto de configuração.
		*	@param size String O tamanho da modal - modal-lg, modal-md, modal-sm
		*	@param body String O texto no corpo. Aceita html.
		*	@param title String O título do cabeçalho
		*	@param buttons Array Os botões de ação.
		*	@param modal Object Parâmetros do plugin do boostrap
		*	@param callback Function Função para tratar as ações da modal
        *
        *   Ex:
            App.Helpers.showModal({
                size: "modal-sm",
                body: 'Lorem Ipsum dolor',
                title: 'Some Title',
                buttons: [{
                    'type': "button",
                    'klass': "btn btn-primary",
                    'text': "Ok",
                    'dismiss': null,
                    'id': 'modal-ok',
                    'onClick': function (event, jQModalElement) {
                        window.open(url, '_blank');
                        jQModalElement.modal('hide');
                    }
                }, {
                    'type': "button",
                    'klass': "btn btn-default",
                    'text': "Cancelar",
                    'dismiss': 'modal',
                    'id': 'modal-cancel'
                }]
            });
        *
		**/
		showModalAdicionarFila: function (options) {
		    //usado a variavel UNINTER.objetoSelecionado pois ao atualizar a pilha de modal sera destruida e recarregada conforme chamadas
		    
            UNINTER.objetoSelecionado = UNINTER.objetoSelecionado || {}
            UNINTER.objetoSelecionado.filaModal = UNINTER.objetoSelecionado.filaModal || [];

            UNINTER.objetoSelecionado.filaModal.push(options);

		    //if (!$("#dialogModal").is(":visible")) {
            if (UNINTER.objetoSelecionado.filaModal.length == 1) {
                UNINTER.Helpers.showModal(UNINTER.objetoSelecionado.filaModal[0]);
            }
		    

		},
		showModal: function (options) {
		    
			options = options || {};
			var defaults = {
				size: "",
				body: null,
				title: null,
				buttons: [{
					'type': "button",
					'klass': "btn-primary",
					'text': "Ok",
					'dismiss': null,
					'id': null,
					'onClick': null,
					'onClose': null
				}],
				modal: null,
				callback: null,
				reset: null,
				onClose: null,
				botaoFechar: true,
				header: true,
				footer: true,
                footerContent: void(0),
				keyboard: false,
				backdrop: true //specify static for a backdrop which doesn't close the modal on click.
			},

            dialog = $('#dialogModal'),
            opts = _.defaults(options, defaults),
            title = opts.title ? $("<h4>", { 'class': "modal-title", "tabindex": "0" }).html(opts.title) : $("<h4>", { 'class': "modal-title", "tabindex": "0" }).html(""),
            modalClasses = "modal-dialog",
            reset = function reset() {
                if (opts.reset != null) {
                    opts.reset();
                }
                dialog
                    .find('.modal-dialog')
                    .removeClass('modal-lg modal-sm modal-md-sm modal-full modal-popup')
                    .removeAttr('style')
                    .find('.modal-body')
                    .removeAttr('style');

                dialog
                    .find('.modal-footer')
                    .removeAttr('style');
                $('.modal-backdrop').remove();
            };


			// Esvaziando o footer
			dialog.find('.modal-footer').empty();

			_.each(opts.buttons, function (v, k) {
				var button = $('<button>', {
					'type': v.type,
					'class': v.klass
				}).text(v.text);

				if (v.dismiss && v.dismiss === "modal") { 
					button.on("click", function () {
						dialog.modal("hide");
					});
				}
				if (v.id && v.id !== false) { button.prop('id', v.id); }
				if (v.title && v.title !== false) { button.prop('title', v.title); }

				if ( v.onClick && typeof v.onClick === 'function' ) {
					button.on('click', function (e) {
						v.onClick(e, dialog);
					});
				}

				dialog.find('.modal-footer').append( button );
			});

			if (!opts.botaoFechar) {
			    dialog.find('.modal-header').find('.close').hide();
			} else {
			    dialog.find('.modal-header').find('.close').show();
			}

			if (!opts.header) {
			    dialog.find('.modal-header').hide();
			} else {
			    dialog.find('.modal-header').show();
			}

			if (!opts.footer) {
			    dialog.find('.modal-footer').hide();
			} else {

			    if (opts.footerContent)
			    {
			        dialog.find('.modal-footer').append(opts.footerContent);
			    }

			    dialog.find('.modal-footer').show();
			}

			dialog.contents("div").addClass(opts.size + " " + modalClasses);
			dialog.find('.modal-header').find('h4').remove();
			dialog.find('.modal-header').append( title );
			dialog.find('.modal-body').html(opts.body);
			dialog.data('bs.modal', null);
			dialog.modal(opts.modal);

			dialog.find('.modal-header h4').focus();

			if (typeof opts.callback === 'function') { opts.callback(dialog); }

			dialog.off('shown.bs.modal').on('shown.bs.modal', function (e) {

			    dialog.find('.modal-header h4').focus();

			    if(dialog.find('#fecharModalPopup').length > 0){
			        dialog.find('#fecharModalPopup').focus();
			    }

			});

			dialog.off('hidden.bs.modal');
            dialog.on('hidden.bs.modal', function modalCloseCallback () {
                if ( typeof opts.onClose === 'function' ) {
                    opts.onClose(dialog);
                }

                reset();

                UNINTER.objetoSelecionado.filaModal = UNINTER.objetoSelecionado.filaModal || [];

                UNINTER.objetoSelecionado.filaModal.shift();
                
                if (UNINTER.objetoSelecionado.filaModal.length > 0) {
                    UNINTER.Helpers.showModal(UNINTER.objetoSelecionado.filaModal[0]);
                }
                
            });

		},

        getUrlParameter: function getUrlParameter(sParam, url) {
            var sPageURL = window.location.search.substring(1);
            if(url != void(0))
            {
                var tmp = url.split('?');
                sPageURL = tmp[tmp.length-1];
            }
            
            var sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
        },

		// Checagem de dispositivo
		isMobile : function () {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return ((/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(userAgent));
		},
		
		// Checagem de navegador
		isNavegador: function () {
			
			var userAgent = navigator.userAgent || navigator.vendor || window.opera;
			var navegador = null;

			if (userAgent.indexOf('Google/') > -1) {
				navegador = 'Chrome';
			} else if (userAgent.indexOf('Edge/') > -1) {
				navegador = 'Edge';
			} else if (userAgent.indexOf('Firefox/') > -1) {
				navegador = 'Firefox';
			} else if (userAgent.indexOf('OPR/') > -1) {
				navegador = 'Opera';
			} else if (userAgent.indexOf('.NET') > -1 || userAgent.indexOf('Trident') > -1) {
				navegador = 'IE';
			} else if (navigator.vendor.indexOf('Google') > -1) {
				navegador = 'Chrome';
			} else if ((navigator.vendor.indexOf('MAC') > -1 || navigator.vendor.indexOf('Apple')) && navigator.vendor.indexOf('Version') > -1 && navigator.vendor.indexOf('Safari') > -1) {
				navegador = 'Safari';
			} else if ((navigator.vendor.indexOf('MAC') > -1 || userAgent.indexOf('Apple')) && userAgent.indexOf('Version/') > -1 && userAgent.indexOf('Safari/') > -1) {
			    navegador = 'Safari';
			}
			
			return navegador;
		},

        // Faz uma requisição AJAX do tipo deferred, utilizando o $.Deferred()
        deferredResponse: function (options) {
            var defer = $.Deferred();
            var defaults = {
                type: 'GET',
                data: null,
                async: true,
                crossDomain: false
            };
            var opts = _.defaults(options, defaults);
            if ( !opts.url ) { throw new Error("O argumento URL está vazio."); }

            var ajaxOptions = {
                type: opts.type,
                url: opts.url,
                async: opts.async,
                success: function (r) {
                    defer.resolve(r);
                },
                error: function (r) {
                    defer.reject(r);
                }
            };

            if ( opts.data ) { ajaxOptions.data = opts.data; };

            $.ajax(ajaxOptions);

            return defer.promise();
        },

        // Faz fetch do tipo deferred, utilizando o $.Deferred()
        fetchCollectionDeferred: function (collectionInstance, url) {

            var defer = $.Deferred();
            var collection = collectionInstance;

            collection.fetch({
                "url": url,
                cache: false,
                success: function (response) {
                    defer.resolve(response);
                },
                error: function (response) {
                    defer.reject(response);
                }
            });
            return defer.promise();
        },

        /**
         *	Efetua uma requisição AJAX.
         *	@param {string} [type] [Tipo de requisição. Ex: POST, GET]
         *	@param {string} [data] [Informação a enviar]
         *	@param {boolean} [async] [Requisição assíncrona ou síncrona]
         */
        ajaxRequest: function(options) {
            var response;
            var defaults = {
                type: 'GET',
                data: null,
                async: false,
                successCallback: null,
                errorCallback: null
            };
            var opts = _.defaults(options, defaults);
            if ( !opts.url ) {
                throw new Error("O argumento URL está vazio.");
            }
            if ( (opts.successCallback && typeof opts.successCallback !== 'function') || (opts.errorCallback && typeof opts.errorCallback !== 'function') ) {
                throw new TypeError("Parâmetro 'errorCallback' ou 'successCallback' deve ser uma função");
            }

            var ajaxOptions = {
                type: opts.type,
                url: opts.url,
                async: opts.async,
                success: function (r) {
                    response = r;
                    if ( opts.successCallback )	{ opts.successCallback(r); }
                },
                error: function (r) {
                    response = r;
                    if ( opts.errorCallback )	{ opts.errorCallback(r); }
                }
            };

            if ( opts.beforeSend ) {
                ajaxOptions.beforeSend = opts.beforeSend;
            }

            if ( opts.data ) {
                ajaxOptions.data = opts.data;
            }

            $.ajax(ajaxOptions);

            return response;
        },

	    ajaxRequestError: function (options) {
	        var response = {
	            status: null,
                resposta: null
	        };
	        var defaults = {
	            type: 'GET',
	            data: null,
	            async: false
	        };
	        var opts = _.defaults(options, defaults);
	        if (!opts.url) {
	            throw new Error("O argumento URL está vazio.");
	        }

	        var ajaxOptions = {
	            type: opts.type,
	            url: opts.url,
	            async: opts.async,
	            success: function (r) {
                    response.status = 200
	                response.resposta = r;
	            },
	            error: function (r, e, t) {
	                response.status = r.status;
	                response.resposta = r.responseText;
	            }
	        };

	        if (opts.data) {
	            ajaxOptions.data = opts.data;
	        }

	        $.ajax(ajaxOptions);
	        return response;
	    },

	    // Recebe um objeto jQuery e retorna uma string
	    jQueryObjToString : function (obj) {
	    	var jQueryObject = obj instanceof jQuery;
	    	if ( !jQueryObject ) { 
	    		throw new TypeError('Instância do parâmetro não é um objeto jQuery'); 
	    	}
	    	var str = $('<div>').append(obj.clone()).html();
	    	return str;
	    },

	    // Anima o documento até o topo ou ao elemento passado como parâmetro
	   	animatedScrollTop: function (elementtoScrollToID, duration) {
	   		var $el = (elementtoScrollToID) ? $(elementtoScrollToID) : $('#headerItemView');
	   		var dur = duration || 500;
	   		$('html, body').animate({
		        scrollTop: $el.offset().top
		    }, dur);
	   	},

	    //Valida se um valor é valido, ou seja, != null, != vazio, != undefined ...
	   	stringValida: function (string) {
	   	    if (_.isNull(string) || _.isUndefined(string) || _.isNaN(string) || !_.isString || string == "") {
	   	        return false;
	   	    } else {
	   	        return true;
	   	    }
	   	},

	   	// Gera um número aleatório entre min e max
		getRandomInt: function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

        // Coloca tags <br> onde há quebras de linha "\r\n" ou "\n"
		newLineToBr: function newLineToBr(str) {

		    if (/<[a-z][\s\S]*>/i.test(str))
		    {
		        return str;
		    }

		//console.info(str + " " + str.indexOf('\r'));
            var hasR = (str.indexOf('\r')) !== -1, arr;
            if ( hasR ) { arr = str.split('\r\n');  }
            else { arr = str.split('\n'); }
            str = arr.join('<br>');
            return str;
        },


		// Busca IDS duplicados na página
		checkForDuplicatedIds: function checkForDuplicatedIds () {
			var ids = {}, found = false;
			$('[id]').each(function() {
				if (this.id && ids[this.id]) {
					found = true;
					console.warn('ID em duplicidade encontrado: #'+this.id);
				}
				ids[this.id] = 1;
			});
			if (!found) console.info('Nenhum id duplicado foi encontrado.');
		},

		enterTriggerClick: function (e) {
		    var code = e.keyCode || e.which;

		    if (code == 13) {
		        var elemento = e.currentTarget;
		        $(elemento).trigger("click");
		    }
		},

        montarUrlComPalavrasChave : function (url) {
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
                        case "{idUsuario}": {
                            var idUsuario = UNINTER.StorageWrap.getItem("user").idUsuario;
                            var urlAlterada = urlAlterada.replace(matches[i], idUsuario);
							break;
                        }
						case "{valorIdObjComboPai}": {
                            break;
                        }
                        default: {
                            //Deixa passar para ser tratado no nível acima
                            break;
                        }
                    }
                }
                return urlAlterada;
            }

            return url;
        },
        montarUrlRoa: function (idItemAprendizagem, acessoROA, edicao, metodo, redirecionar, idSalaVirtualOferta) {
            
            var url = "web/roa/?item=" + acessoROA + "&id=" + idItemAprendizagem;

            if (metodo == void (0)) metodo = "editar";
            if (redirecionar == void (0)) redirecionar = 1;
            if (edicao === true) {
                url = "web/#/ava/acessoroa/" + idItemAprendizagem + "/" + UNINTER.StorageWrap.getItem('user').idUsuario + "/" + UNINTER.StorageWrap.getItem('user').token;                
                url += "/" + metodo; 
                url += "/" + redirecionar;

                var idSalaVirtualOferta = void(0);
                if(UNINTER.StorageWrap.getItem('leftSidebarItemView') != void(0))
                {
                    idSalaVirtualOferta = UNINTER.StorageWrap.getItem('leftSidebarItemView').idSalaVirtualOferta;
                }

                if(parseInt(idSalaVirtualOferta) > 0){
                    url += "/" + idSalaVirtualOferta;
                }

            }

            url = UNINTER.AppConfig.baseUrlROA() + url;
            
            
            return url;
        },
        removerAcento: function(palavra) {
            var palavraSemAcento = '';
            var caracterComAcento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ´`*';
            var caracterSemAcento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC   '; //Atenção: o replace é por posição, então os acentos sozinhos faz o replace por espaço.

            for (var i = 0; i < palavra.length; i++)
            {
                var char = palavra.substr(i, 1);
                var indexAcento = caracterComAcento.indexOf(char);
                if (indexAcento != -1) {
                    palavraSemAcento += caracterSemAcento.substr(indexAcento, 1);
                } else {
                    palavraSemAcento += char;
                }
            }

            return palavraSemAcento;
		},
		checkForVideo: function(successCallback, errorCallback, options) {

			if (options == void(0)) {
				options = {
					video: true,
					audio: true
				}
			}

			navigator.mediaDevices.getUserMedia(options)
				.then(successCallback, errorCallback);

        },
        atendimentoOnline: function () {

            $.get('templates/ava/atendimento-online-template.html', function (data) {
                
                var templateAtendimentoOnline = data;

                var user = UNINTER.StorageWrap.getItem('user');

                //Não pode acessar essa função simulando aluno.
                if (user.idUsuarioSimulador > 0 && user.idUsuario != user.idUsuarioSimulador) {

                    UNINTER.Helpers.showModal({
                        body: 'Função não disponível simulando aluno.',
                        title: "Atendimento Online",
                        buttons: [{
                            'type': "button",
                            'klass': "btn btn-default",
                            'text': "Fechar",
                            'dismiss': 'modal',
                            'id': 'modal-cancel'
                        }]
                    });

                    return;
                }

                var toggleElement = function ($el, min) {
                    var minimumHeight = min;
                    var currentHeight = $el.height();
                    var autoHeight = $el.css('height', 'auto').height();

                    var orginal = $el.data('originalh');

                    if (currentHeight != orginal) {
                        autoHeight = $el.data('originalh');
                    }

                    $el.css('height', currentHeight).animate({
                        height: autoHeight
                    });
                };

                //Elemento existe já? Se sim, apenas exibe:
                if ($("#atendimento-container").length > 0) {
                    toggleElement($("#atendimento-container"), 32);
                    toggleElement($("#atendimento-andamento"), 0);
                    return;
                }

                var windowH = $(window).height();
                var windowW = $(window).width();

                var maxH = windowH > (600 + 60) ? 600 : (windowH - 60);
                var maxW = (windowW > 768 && UNINTER.Helpers.isMobile() == false) ? parseInt(windowW / 3) : (windowW - 5);

                var ehPolo = ($(user.perfis).filter(function (i, item) { return item.idPerfil == 3 || item.idPerfil == 6 || item.idPerfil == 7 || item.idPerfil == 30 || item.idPerfil == 122 }).length > 0);

                UNINTER.Helpers.ajaxRequest({
                    url: UNINTER.AppConfig.UrlWs("autenticacao") + 'Usuario/' + ehPolo + '/AtendimentoOnline',
                    async: true,
                    successCallback: function (data) {

                        var el = $('<iframe>', { 'class': 'un-iframe-content', 'src': data.url, 'allowfullscreen': true });

                        $("body").append(_.template(templateAtendimentoOnline, {
                            url: data.url,
                            containerWidth: (maxW + 5),
                            containerHeigth: (maxH + 35),
                            iframeWidth: (maxW + 5),
                            iframeHeigth: maxH
                        }));

                        toggleElement($("#atendimento-container"), 32);
                        toggleElement($("#atendimento-andamento"), 0);

                        $("#atendimentoFechar").off("click").on('click', function (e) {
                            $("#atendimento-andamento").slideDown(1000, function () {
                                $("#atendimento-container").remove();
                            });

                        });

                        $("#atendimentoMinimizar").off('click').on('click', function (e) {

                            toggleElement($("#atendimento-container"), 32);
                            toggleElement($("#atendimento-andamento"), 0);
                        });

                        $("#atendimento-container h2").off('click').on('click', function (e) {

                            toggleElement($("#atendimento-container"), 32);
                            toggleElement($("#atendimento-andamento"), 0);

                        });

                    },
                    errorCallback: function () { }
                });

            });

        },
        abrirBiblioteca: function (isbn, biblioteca) {

            var bibliotecas = {
                pearson: function (isbn) {
                    UNINTER.Helpers.showModal({
                        body: '<div id="modalNovaJanela"><p> Por favor aguarde, estamos autenticando seu acesso.</p></div>',
                        title: 'Acesso Externo',
                        buttons: []
                    });

                    UNINTER.Helpers.ajaxRequest({
                        url: UNINTER.AppConfig.UrlWs('Sistema') + "AplicativoEducacionalAcesso/" + UNINTER.StorageWrap.getItem('user').login + "/BibliotecaVirtual",
                        async: true,
                        successCallback: function (data) {
                            if (data.token != void (0)) {

                                var template = "<form action='<%= href %>' method='post' target='_blank'><input type='hidden' name='login' id='login' value='<%= login %>'>"
                                    + "<input type='hidden' name='token' id='token' value='<%= token %>'>"
                                    + "<p>Este item será aberto em uma nova aba. Deseja continuar?</p><p><a href='javascript: void(0)' class='btn btn-primary' id='fecharModal'>Sim</a>  <a href='javascript:void(0)' data-dismiss='modal' class='btn btn-default'>Não</a></p></form>";


                                $("#dialogModal .modal-body").html(_.template(template, { href: data.url + '?isbn=' + isbn, login: UNINTER.StorageWrap.getItem('user').login, token: data.token }));
                                $("#fecharModal").on("click", function (e) {
                                    $("#dialogModal form").submit();
                                    $('[data-dismiss="modal"]').trigger('click');
                                });
                            }
                        },
                        errorCallback: function (e) {
                            $(".modal-body").html("<div class='alert alert-danger'>Erro: " + e.status + '</div>');
                        }
                    });
                },
                liberi: function (isbn) {

                    var NovaGuia = function (isbn, liberi) {
                        var url = 'https://www.liberidigital.com.br/login?isbn=' + isbn + '&hash=' + liberi;
                        $('#modalNovaJanela').html('<p> A biblioteca será aberta em uma nova janela.</p><p><a class="btn btn-primary" target="_blank" href="' + url +'" > Acessar</a></p>');
                    };

                    var liberi = UNINTER.session.get('liberi');

                    UNINTER.Helpers.showModal({
                        body: '<div id="modalNovaJanela"><p> Por favor aguarde, estamos autenticando seu acesso.</p></div>',
                        title: 'Acesso Externo',
                        buttons: []
                    });

                    if (liberi == void (0)) {
                        UNINTER.Helpers.ajaxRequest({
                            url: UNINTER.AppConfig.UrlWs('integracao') + "MoipObra/0/Auth",
                            type: 'PUT',
                            async: true,
                            successCallback: function (data) {
                                liberi = data.token;
                                UNINTER.session.set('liberi', liberi);
                                NovaGuia(isbn, liberi);
                            },
                            errorCallback: function (error) {
                                $('#modalNovaJanela').html('Falha na autenticação com o Liberi.')
                            }
                        });
                    } else {
                        NovaGuia(isbn, liberi);
                    }
                }
            };

            if (bibliotecas[biblioteca] != void (0)) {
                bibliotecas[biblioteca](isbn);
            }

        },
	};
    
	return Helpers;

});
