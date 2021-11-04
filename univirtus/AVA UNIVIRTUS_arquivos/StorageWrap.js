/**
 * Simple wrapper for local/sessionStorage
 * Allows easy get/set of objects
 * https://github.com/simonsmith/storage-wrap/
 * v1.0.2
 * @blinkdesign
 *
 * Adaptação: @thyago.weber@gmail.com
 * para compatilidade do IE7
 * @date: 31/01/2014 
 */

!function(name, context, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        context[name] = factory();
    }
}('storageWrap', this, function() {
    'use strict';

    // IEs prior to version 8
    if (!'Storage' in window) {
        // return console && console.error('This browser does not support Storage!');
        return {
            getItem: function(key) {
                return this.items[key];
            },
            setItem: function(key, value) {
                this.items[key] = value;
            },
            removeItem: function(key) {
                delete this.items[key];
            }
        };
    }

    return {
        setAdaptor: function(adaptor) {
            this._adaptor = adaptor;
        },

        getItem: function(key) {
            var item = this._adaptor.getItem(key);

            try {
                item = JSON.parse(item);
            } catch (e) {}

            return item;
        },

        setItem: function(key, value) {
            var type = this._toType(value);

            if (/object|array/.test(type)) {
                value = JSON.stringify(value);
            }

            return this._adaptor.setItem(key, value);
        },

        removeItem: function(key) {
            this._adaptor.removeItem(key);
        },

        _adaptor: localStorage,

        _toType: function(obj) {
            return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
        }
    }
});
