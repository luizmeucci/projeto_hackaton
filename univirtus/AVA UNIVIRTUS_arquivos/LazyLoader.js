define(function (require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var LazyLoader = function(type) {
		this.type = type;
	};

	_.extend(LazyLoader.prototype, {
	    get: function () {
	        var fileNames = Array.prototype.slice.call(arguments);

	        var dfd = $.Deferred();
	        var path = this.type + "/";

	        fileNames = _.map(fileNames, function(fileName){
	            return path + fileName;
	        });

	        try{
	            require(fileNames, function() {
	                dfd.resolve.apply(dfd, arguments);
	            });

	            return dfd.promise();
	        } catch (ex) {
	            console.warn("LazyLoader error =>");
	            console.log(fileNames);
	            console.error(ex);
	        }
		}
	});

	return LazyLoader;
});