/*global define, console */
/**
 *
 * @author Javier Alejandro Alvarez <neiker@gmail.com>
 * @requires jQuery
 *
 */
 (function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define('barrita', ['jQuery'], factory);
    }
    if(window.jQuery) {
        factory(window.jQuery);
    }
 }(function ($) {
    'use strict';

    var defaultOptions = {
        resize: 'auto',
        hoverTimeout: 500
    };

    var ieVersion = (function () {
        try {
            return parseInt(navigator.userAgent.match(/MSIE (\d+)\.(\d+)/)[1], 10);
        } catch(e) { return null; }
    }());

    function Barrita ($el, options) {
        if($.type(options)!=='object') {
            throw new Error('Options should be an object');
        }

        var properties = {};
        this.set = function (key, value) {
            return (properties[key] = value);
        };
        this.get = function (key) {
            return properties[key] || undefined;
        };

        this.$el = $el;
        this.set('options', options);

        this.init();
    }

    Barrita.prototype = {
        init: function() {
            if(this.get('initialized')) {
                return;
            }

            this.initDom();
            this.setEvents();
            this.setBarHeight();

            this.set('initialized',true);

            this.$el.trigger('barrita:init', this);
        },
        destroy: function() {
            if(!this.get('initialized')) {
                return;
            }

            this.removeEvents();
            this.restoreDom();

            this.set('initialized', false);
            this.$el.trigger('barrita:destroy');
        },
        initDom: function () {
            this.$el = this.$el.addClass('barrita');
            this.$viewPort = $('<div/>').addClass('barritaViewport');
            this.$content = $('<div />').addClass('barritaContent');
            this.$scrollRail = $('<div />').addClass('barritaRail');
            this.$scrollBar = $('<div />').addClass('barritaHandler');

            this.$content.append(this.$el.children().detach());
            this.$viewPort.append(this.$content);

            this.$scrollRail.append(this.$scrollBar);
            this.$el.empty().append(this.$viewPort).append(this.$scrollRail);

            if(!$.isNumeric( this.get('options').hoverTimeout )) {
                this.$scrollRail.addClass('barritaHover');
            }
        },
        restoreDom: function () {
            this.$el.removeClass('barrita');

            var $content = this.$content.children().detach();

            this.$viewPort.remove();
            this.$scrollRail.remove();

            this.$el.empty().append( $content );
        },
        active: function (setter){
            if(setter!==undefined) {
                if(this.get('active') === setter) {
                    return;
                }
                this.set('active', setter);

                this.$scrollRail.toggleClass('barritaActive', this.get('active'));

                $('body').toggleClass('barritaActive', this.get('active'));
            }
            return this.get('active');
        },
        hover: function (setter){
            if(setter!==undefined) {
                var toggle = function () {
                    if(this.get('hover')!==setter) {
                        this.set('hover', setter);
                        this.$scrollRail.toggleClass('barritaHover', this.get('hover'));
                    }
                }.bind(this);

                clearTimeout(this.get('hoverTimeout'));

                var hoverMs = this.get('options').hoverTimeout;
                if(!this.get('hover') || hoverMs===0) {
                    toggle();
                } else if($.isNumeric(hoverMs)) {
                    this.set('hoverTimeout', setTimeout(toggle, hoverMs));
                }

            }
            return this.get('hover');
        },
        setBarHeight: function () {
            var scrollBarHeight = (100 / this.$content.height() * this.$el.height());

            if(!scrollBarHeight && this.$el.is(':visible')) {
                this.destroy();
            } else if(scrollBarHeight>=100) {
                this.$scrollRail.addClass('hide');
            } else if( this.get('scrollBarHeight')!==scrollBarHeight ) {
                this.set('scrollBarHeight', scrollBarHeight);

                this.$scrollRail.removeClass('hide');
                this.$scrollBar.css({ height : '' + scrollBarHeight + '%' });
                this.setBarPosition();
            }

            return;
        },
        setBarPosition: function (top) {
            var positionTop;
            if(top===undefined) {
                positionTop = 100 / this.$content.height() * this.$viewPort.scrollTop();
            } else {
                if(top + this.$scrollBar.height() > this.$scrollRail.height()) {
                    top = this.$scrollRail.height() - this.$scrollBar.height();
                }

                positionTop = 100 / this.$scrollRail.height() * top;
            }

            this.$scrollBar.css({top: String(positionTop + '%') });

            this.$el.trigger('barrita:positionChange', {
                scrollTop: this.$viewPort.scrollTop(),
                onTop: !Math.floor(positionTop),
                onBottom: Math.ceil(positionTop+this.get('scrollBarHeight'))===100
            });

            return;
        },
        setContentPosition: function (scrollTop) {
            if(scrollTop===undefined) {
                scrollTop = (100 / this.$scrollRail.height() * this.$scrollBar.position().top);
                scrollTop = this.$content.height() / 100 * scrollTop;
            }
            this.$viewPort.get(0).scrollTop = scrollTop;

            return;
        },
        draggableStart: function () {
            this.active(true);

            var ss = this.set('draggable', {});
            ss.scrollHeight = this.$scrollRail.height();
            ss.bottomLimit = this.$scrollRail.get(0).offsetHeight - this.$scrollBar.height();

            /* IE Fix */
            if(ieVersion) {
                $(document).on('selectstart', false);
            }

            $(ieVersion ? document : window)
                .on('mousemove', (this.drag = this.draggableDrag.bind(this)))
                .on('mouseup', (this.stopDrag = this.draggableStop.bind(this)));

            return false;
        },
        draggableDrag: function (e) {
            var ss = this.get('draggable');
            var position = e.pageY;

            ss.toTop = parseInt(this.$scrollBar.css('top'), 10);

            if(ss.lastPosition) {
                ss.toTop += position - ss.lastPosition;
            }

            if (ss.toTop < 0 || ss.toTop > ss.bottomLimit) {
                return;
            }

            ss.lastPosition = position;

            this.setBarPosition(ss.toTop);
            this.setContentPosition();

            return false;
        },
        draggableStop: function () {
            this.active(false);

            this.set('draggable', {});
            if(ieVersion) {
                $(document).on('selectstart', true);
            }

            $(ieVersion ? document : window)
                .off('mousemove', this.drag)
                .off('mouseup', this.stopDrag);

            return false;
        },
        setEvents: function () {
            /* Hover event */
            this.$el
                .on('mouseenter', this.hover.bind(this, true))
                .on('mouseleave', this.hover.bind(this, false));

            /* ScrollBar drag&drop  */
            this.$scrollBar.on('mousedown', this.draggableStart.bind(this));

            /* Scroll event */
            this.$viewPort.on('scroll', function () {
                if(!this.active()) {
                    this.setBarPosition();
                }

                return;
            }.bind(this));

            /* Auto resize */
            if(this.get('options').resize==='auto') {
                this.set('resizeInterval', setInterval(this.setBarHeight.bind(this), 100));
            }

            return true;
        },
        removeEvents: function () {
            clearInterval(this.get('resizeInterval'));
            $(ieVersion ? document : window)
                .off('mousemove', this.drag)
                .off('mouseup', this.stopDrag);
        }
    };

    var api = {
        resize: function () {
            this.setBarHeight();
        },
        destroy: function () {
            this.destroy();
        },
        setPosition: function (v1,v2) {
            this.setContentPosition(v1);
            this.setBarPosition();

            if(v2) {
                this.hover(true);
                this.hover(false);
            }
        },
        setContent: function (v1) {
            this.$content.html(v1);
        },
        addContent: function (v1) {
            this.$content.append(v1);
        }
    };


    function applyBarrita () {
        var args = Array.prototype.slice.call(arguments);
        var $el = args.shift();

        if(!($el instanceof $)) {
            throw new Error('Invalid Element');
        }

        var action, options;

        if(args[0]===undefined || $.type(args[0]) === 'object') {
            options = $.extend({}, defaultOptions, args.shift());
        } else {
            action = args.shift();
        }

        return $el.each(function() {
            var $el = $(this);
            var scrollBar = $el.data('barrita');

            if(scrollBar) {
                if($.type(action)==='string' && api[action]) {
                    api[action].apply(scrollBar, args);
                } else {
                    throw new Error('Invalid action');
                }
            } else {
                $el.data('barrita', ( new Barrita($el, options) ));
                $el.one('barrita:destroy', function () {
                    $el.removeData('barrita');
                });
            }

            return scrollBar;
        });
    }

    $.fn.extend({
        barrita: function() {
            return applyBarrita.apply(null, [$(this)].concat(Array.prototype.slice.call(arguments)));
        }
    });

    return applyBarrita;
}));