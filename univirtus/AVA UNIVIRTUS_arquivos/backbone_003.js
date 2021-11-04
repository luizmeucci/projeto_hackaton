/**
 * Backbone Upload Manager v1.0.0
 *
 * Copyright (c) 2013 Samuel ROZE
 *
 * License and more information at:
 * http://github.com/sroze/backbone-upload-manager
 */
(function(Backbone, $, _){
    'use strict';
    var File, FileCollection, FileView;

    Backbone.UploadManager = Backbone.DeferedView.extend({
        /**
         * Default options, that will be merged with the passed.
         *
         */
        defaults: {
            templates: {
                main: '/templates/upload-manager.main.default',
                file: '/templates/upload-manager.file.default'
            },
            uploadUrl: '',
            baseUploadUrl: '',
            url: '',
            autoUpload: false,
            dataType: 'json'
        },

        /**
         * An integer used to track the files by a unique
         * identifier.
         *
         */
        file_id: 0,

        /**
         * View container class.
         *
         */
        className: 'upload-manager',

        /**
         * Initialize upload manager options
         *
         */
        initialize: function (options)
        {
            if ( options.baseUploadUrl !== '' ) {
                options.url = options.baseUploadUrl + options.uploadUrl;
            } else {
                options.url = options.uploadUrl;
            }

            // Merge options
            this.options = $.extend(this.defaults, options);

            // Update template name
            this.templateName = this.options.templates.main;

            // Create the file list
            this.files = new FileCollection();

            // Create the file-upload wrapper
            // this.uploadProcess = $('<input id="fileupload" type="file" name="files[]" multiple="multiple">').fileupload({
            //     dataType: this.options.dataType,
            //     url: this.options.url,
            //     formData: this.options.formData,
            //     autoUpload: this.options.autoUpload,
            //     singleFileUploads: true
            // });
            // 
            this.uploadProcess = $('<input id="fileupload" type="file" name="files[]" multiple="multiple">').fileupload(this.options);

            // Add upload process events handlers
            this.bindProcessEvents();

            // Add local events handlers
            this.bindLocal();
        },

        /**
         * Bind local events.
         *
         */
        bindLocal: function ()
        {
            var self = this;
            this.on('fileadd', function (file) {
                // Add it to current list
                self.files.add(file);

                // Create the view
                self.renderFile(file);
            }).on('fileprogress', function (file, progress) {
                file.progress(progress);
            }).on('filefail', function (file, error) {
                file.fail(error);
            }).on('filedone', function (file, data) {
                file.done(data.result);
            });

            // When collection changes
            this.files.on('all', this.update, this);
        },

        /**
         * Render a file.
         *
         */
        renderFile: function (file)
        {
            var file_view = new FileView($.extend(this.options, {model: file})),
                self = this;
            $('#upload-manager-file-list', self.el).append(file_view.deferedRender().el);
        },

        /**
         * Update the view without full rendering.
         *
         */
        update: function ()
        {
            var with_files_elements = $('button#cancel-uploads-button, button#start-uploads-button', this.el);
            var without_files_elements = $('#upload-manager-file-list .no-data', this.el);
            if (this.files.length > 0) {
                with_files_elements.removeClass('hidden');
                without_files_elements.addClass('hidden');
            } else {
                with_files_elements.addClass('hidden');
                without_files_elements.removeClass('hidden');
            }
        },

        /**
         * Bind events on the upload processor.
         *
         */
        bindProcessEvents: function ()
        {
            var self = this, fdp = {size: ''};
            this.uploadProcess.on('fileuploadadd', function (e, data) {
                // Create an array in which the file objects
                // will be stored.
                data.uploadManagerFiles = [];

                // A file is added, process for each file.
                // Note: every times, the data.files array length is 1 because
                //       of "singleFileUploads" option.
                $.each(data.files, function (index, file_data) {
                    // Create the file object
                    file_data.id = self.file_id++;

                    $.extend(file_data, fdp);

                    var file = new File({
                        data: file_data,
                        processor: data
                    });

                    // Add file in data
                    data.uploadManagerFiles.push(file);

                    // Trigger event
                    self.trigger('fileadd', file);
                });
            }).on('fileuploadprogress', function (e, data) {
                $.each(data.uploadManagerFiles, function (index, file) {
                    self.trigger('fileprogress', file, data);
                });
            }).on('fileuploadfail', function (e, data) {
                $.each(data.uploadManagerFiles, function (index, file) {
                    var error = "Unknown error";
                    if (typeof data.errorThrown === "string") {
                        error = data.errorThrown;
                    } else if (typeof data.errorThrown === "object") {
                        error = data.errorThrown.message;
                    } else if (data.result) {
                        if (data.result.error) {
                            error = data.result.error;
                        } else if (data.result.files && data.result.files[index] && data.result.files[index].error) {
                            error = data.result.files[index].error;
                        } else {
                            error = "Unknown remote error";
                        }
                    }

                    self.trigger('filefail', file, error);
                });
            }).on('fileuploaddone', function (e, data) {
                $.each(data.uploadManagerFiles, function (index, file) {
                    self.trigger('filedone', file, data);
                });
            })
            // @changed at 30/05/2014 --
            .on('fileuploadstop', function (e) {
                self.trigger('stop');
            });
            // -- @changed at 30/05/2014
        },

        /**
         * Render the main part of upload manager.
         *
         */
        render: function ()
        {
            $(this.el).html(this.template());

            // Update view
            this.update();

            // Add add files handler
            var input = $('input#fileupload', this.el), 
                self = this;

            input.on('change', function (){
                
                self.uploadProcess.fileupload('add', {
                    fileInput: $(this)
                });

                // Reset input Value
                input.val(''); // @changed at 07/02/2014

            });

            // Add cancel all handler
            $('button#cancel-uploads-button', this.el).click(function(){
                // @changed at 07/02/2014 --
                while (self.files.length) {
                    self.files.at(0).cancel();
                }
                // -- @changed at 07/02/2014
            });

            // Add start uploads handler
            $('button#start-uploads-button', this.el).click(function(){
                self.files.each(function(file){
                    file.start();
                });
            });

            // Render current files
            $.each(this.files, function (i, file) {
                self.renderFile(file);
            });
        }
    });


    File = Backbone.Model.extend({
        state: "pending",

        /**
         * Start upload.
         *
         */
        start: function ()
        {
            if (this.isPending()) {
                this.get('processor').submit();
                this.state = "running";

                // Dispatch event
                this.trigger('filestarted', this);
            }
        },

        /**
         * Cancel a file upload.
         *
         */
        cancel: function ()
        {
            this.get('processor').abort();
            this.destroy();

            // Dispatch event
            this.state = "canceled";
            this.trigger('filecanceled', this);
        },

        /**
         * Notify file that progress updated.
         *
         */
        progress: function (data)
        {
            var processor = this.get('processor');
            // Dispatch event
            this.trigger('fileprogress', processor.progress());
        },

        /**
         * Notify file that upload failed.
         *
         */
        fail: function (error)
        {
            // Dispatch event
            this.state = "error";
            this.trigger('filefailed', error);
        },

        /**
         * Notify file that upload is done.
         *
         */
        done: function (result)
        {
            // Dispatch event
            this.state = "error";
            this.trigger('filedone', result);
        },

        /**
         * Is this file pending to be uploaded ?
         *
         */
        isPending: function ()
        {
            return this.getState() === "pending";
        },

        /**
         * Is this file currently uploading ?
         *
         */
        isRunning: function ()
        {
            return this.getState() === "running";
        },

        /**
         * Is this file uploaded ?
         *
         */
        isDone: function ()
        {
            return this.getState() === "done";
        },

        /**
         * Is this upload in error ?
         *
         */
        isError: function ()
        {
            return this.getState() === "error" || this.getState === "canceled";
        },

        /**
         * Get the file state.
         *
         */
        getState: function ()
        {
            return this.state;
        }
    }),

    /**
     * This is a file collection, used to manage the selected
     * and processing files.
     *
     */
    FileCollection = Backbone.Collection.extend({
        model: File
    }),

    /**
     * A file view, which is the view that manage a single file
     * process in the upload manager.
     *
     */
    FileView = Backbone.DeferedView.extend({
        className: 'upload-manager-file',
        tagName: 'tr',

        initialize: function (options) {
            this.templateName = options.templates.file;

            // Bind model events
            this.model.on('destroy', this.close, this);
            this.model.on('fileprogress', function (progress) {
                this.updateProgress(progress);
            }, this);
            this.model.on('filefailed', this.hasFailed, this);
            this.model.on('filedone', this.hasDone, this);
            this.on('filefailed', this.hasFailed, this);
            this.on('folderUrlSet', this.hasFailed, this);

            // In each case, update view
            this.model.on('all', function () {
                this.update();
            }, this);
        },

        /**
         * Render the file item view.
         *
         */
        render: function ()
        {
            var computeData = this.computeData();
            var temp = this.template(computeData);
            $(this.el).html(temp);
            this.$el.prop("id", this.model.cid);

            // Bind events
            this.bindEvents();

            // Update elements
            this.update();
        },

        // @changed at 07/02/2014 --
        events: {
            "click input[type=checkbox]" : function (e) {
                var self = $(e.currentTarget);
                self.parents('tr').toggleClass('active');
            }
        },
        //-- @changed at 07/02/2014

        /**
         * Update upload progress.
         *
         */
        updateProgress: function (progress)
        {
            var percent = parseInt(progress.loaded / progress.total * 100, 10);
            if ( $('div.progress', this.el).hasClass('hidden') ) {
                $('div.progress', this.el).removeClass('hidden');
            }
            $('div.progress', this.el).find('.progress-bar')
                .css('width', percent+'%')
                .parent()
                .find('.progress-label')
                .html(this.getHelpers().displaySize(progress.loaded)+' de '+this.getHelpers().displaySize(progress.total));
        },

        /**
         * File upload has failed.
         *
         */
        folderUrlSet: function (url)
        {
            var filename = this.$el.find('span.name').text();
            var btnTpl = "<form action='"+url+filename+"'><button class='btn btn-default btn-sm btn-download'><i class='icon-download'></i></button></form>";
            this.$el.find(".btn-download").append(btnTpl);
        },

        /**
         * File upload has failed.
         *
         */
        hasFailed: function (error)
        {
            $('span.message', this.el).html('<i class="icon-exclamation-circle"></i> ' + error).hide().fadeIn('slow');
        },

        /**
         * File upload is done.
         *
         */
        hasDone: function (result)
        {
            var url = result.repositorio;
            // Tratar resposta
            this.$el.data('folder', url);
            this.trigger("folderUrlSet", url);

            $('span.message', this.el).html('<i class="icon-check-circle"></i>').hide().fadeIn('slow');
        },

        /**
         * Update view without complete rendering.
         *
         */
        update: function ()
        {
            var when_pending = $('span.size, button#btn-cancel', this.el),
                when_running = $('div.progress, button#btn-cancel', this.el),
                when_done = $('span.message, button#btn-clear', this.el);

            if (this.model.isPending()) {
                //when_running.add(when_done).addClass('hidden');
                when_pending.removeClass('hidden');
            } else if (this.model.isRunning()) {
                when_pending.add(when_done).addClass('hidden');
                when_running.removeClass('hidden');
            } else if (this.model.isDone() || this.model.isError()) {
                when_pending.add(when_running).addClass('hidden');
                when_done.removeClass('hidden');
            }
        },

        /**
         * Bind local elements events.
         *
         */
        bindEvents: function ()
        {
            var self = this;

            // DOM events
            $('button#btn-cancel', this.el).click(function(){
                self.model.cancel();
            });
            $('button#btn-clear', this.el).click(function(){
                self.model.destroy();
            });
        },

        /**
         * Compute data to be passed to the view.
         *
         */
        computeData: function ()
        {
            return $.extend(this.getHelpers(), this.model.get('data'));
        },

        onPreClose: function () {
            this.$el.fadeOut('slow');
        }
    });

})(Backbone, $, _);