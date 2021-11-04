/* ==========================================================================
   Flash Message
   @author Thyago Weber (thyago.weber@gmail.com)
   @date 30-02-2014
   ========================================================================== */

define([
'jquery',
'underscore'
], function ($, _) {
    'use strict';
    // Mensagens do sistema
    // @param options Object
    // @param body String O corpo da mensagem
    // @param strong String  Texto que aparecerá em negrito, anterior ao corpo
    // @param type String O tipo da mensagem: "success", "info", "warning", "danger"
    // @param appendTo String Id ou Classe do item que receberá a mensagem
    // @param timeoutAndHide Boolean Define se o alert deve sumir após alguns segundos
    return function flashMessage(options) {
        options = options || {};
        // Valores Padrão
        var defaults = {
                body: void(0),
                strong: "",
                type: "info",
                appendTo: void(0),
                timeoutAndHide: void(0)
            },
            messageTypes = ["success", "info", "warning", "danger"],
            opts = _.defaults(options, defaults);

        if ( opts.body === void(0) ) { throw new Error("Forneça um corpo para a mensagem"); }

        if ( !_.contains(messageTypes, opts.type) ) { throw new Error("Tipo de mensagem incorreto. Permitidos: " + messageTypes.join(', ')); }

        var messageContainer = opts.appendTo || '#flashMessage';
        messageContainer = $(messageContainer);
        messageContainer.show();

        var strong = opts.strong !== "" ? "<strong>" + opts.strong + "</strong>" : "";
        var tpl = [];
        tpl.push("<div class='alert alert-"+opts.type+" alert-dismissable' tabindex='0'>");
        tpl.push("<button type='button' title='fechar diálogo' class='close' data-dismiss='alert'>×</button>");
        tpl.push(strong + " ");
        tpl.push(opts.body);
        tpl.push("</div>");

        if ( opts.appendTo !== void(0) && opts.appendTo !== "#flashMessage") {
            var element = $("<div>", { 'id': "flashMessage" });
            element.html( tpl.join("") );
            $("#flashMessage").remove();
            var appendEl = $(opts.appendTo);
            appendEl.append( element );

            // O seletor é um objeto JS
            if ( opts.appendTo instanceof $ ) { opts.appendTo.find('#flashMessage').fadeIn('slow'); }
            // O seletor se refere a um elemento existente na página
            else { $("#flashMessage").fadeIn('slow'); }
        }

        else {
            $('#flashMessage').html( tpl.join("") ).fadeIn('slow');
        }

        if ( opts.timeoutAndHide ) {
            setTimeout(function() {
                messageContainer.slideUp();
            }, 5000);
        }
        // Localiza o placeholder e aplica o template da mensagem.
        // Faz aparecer com o efeito "fadeIn" do jQuery.
        // @TODO: substituir o fadeIn do jQuery por css transition
    };
});