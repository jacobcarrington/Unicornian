/*!
 * Unicornian: Manage Tab and Accodian active states
 * Original author: @JacobCarrington
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    var pluginName = 'unicornian',
        defaults = {
            panelSelector: '.panel', // jQuery selector for the tab/accordian panels
            panelClass: 'collapse', // Class applied to tab/accordian panels
            panelAnimatingClass: 'collapsing', // Class applied to tab/accordian panels to help with css animation
            panelActiveClass: 'in', // Class applied to tab/accordian panels that are currently active and need to be displayed
            panelHiddenClass: 'collapsed', // Class applied to tab/accordian panels that are currently inactive and need to be hidden
            linkActiveClass: 'active', // Class applied to tab/accordian Links that's href target is currently active
            animationTime: 0, // Delay in ms before panelHiddenClass is applied. This helps with css animation
        };

    function Plugin( element, options ) {
        this.element = element;
        this._defaults = defaults;
        this._name = pluginName;

        var app = {
            $tabScope: $(element), // All elements referenced should be contained within this element
            eventFilters: [], // A collection of selectors to filter event click events by
            tabs:  {}, // A collection of tab/accordian panels wrapped in jQuery.
            links: {}, // A collection of buttons that toggle the tab/accordian states. wrapped in jQuery.
            options: $.extend( {}, defaults, options),
            gatherCollections: function(){
                $.each(app.$tabScope.find(app.options.panelSelector), function(index, panel) {

                    /** Build up event filters */
                    var toggleLinksSelector = 'a[href="#' + panel.id + '"]';
                    app.eventFilters.push();

                    /** Cache tabs */
                    app.tabs['$' + panel.id] = $(panel);

                    /** Cache links pointing to tab/accordian panels */
                    if(typeof app.links[panel.id] === 'undefined') app.links[panel.id] = [];
                    $.each(app.$tabScope.find(toggleLinksSelector), function(innerIndex, link) {
                        app.links[panel.id].push($(link));
                    });
                });
            },
            removeActiveStates: function(){
                app.$tabScope.find('.' + app.options.linkActiveClass).removeClass(app.options.linkActiveClass);
            },
            applyActiveStates: function(id){
                $.each(app.links[id], function(index, $link){
                    $link.addClass(app.options.linkActiveClass);
                });
            },
            togglePanels: function(id){
                /** Get and compare current and new tabs. Do nothing is they are the same. */
                var $newPanel = app.tabs['$' + id],
                    $currenPanel = app.$tabScope.find('.' + app.options.panelClass + '.' + app.options.panelActiveClass);

                if(!$newPanel.not($currenPanel)){
                    app.removeActiveStates();
                    $currenPanel.addClass(app.options.panelAnimatingClass);
                    /** A Delay can be added to help with animation. AnimationEnd event might be a better alternative here*/
                    setTimeout(function(){
                        $currenPanel.removeClass(app.options.panelActiveClass).removeClass(app.options.panelAnimatingClass);
                        $newPanel.addClass(app.options.panelActiveClass);
                    }, app.animationTime);
                    app.applyActiveStates(id);
                }
            },
            attachEventListeners: function(){
                app.$tabScope.on('click', app.eventFilters.join(','), function(event){
                    event.preventDefault();
                    app.togglePanels(this.hash.substr(1));
                });
            },
        };
        this.app = app;
        this.init();
    }

    Plugin.prototype.init = function () {
        /* Init classes function might be handy */
        this.app.gatherCollections();
        this.app.attachEventListeners();

    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    }
})( jQuery, window, document );
