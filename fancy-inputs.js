var FancyInput = (function(){

    var hasJS = function() {
        var root = document.documentElement;
        root.className = root.className.replace(/\bno-js\b/,'') + ' js';
    };

    var Fancy = function(options){
        var self = this;
        this.element = "";
        this.input = "";
        this.triggerElement = "";
        if (arguments.length) {
            $.extend(self, options);
        }
        return self;
    };

    Fancy.prototype = {
        init: function(){
            var self = this,
                $inputs = $(self.element);

            $inputs.each(function(i) {
                var $domEl = $(this);
                var $inputEl = $domEl;
                if (self.input) {
                    $inputEl = $(this).find(self.input);
                }
                $inputEl.on("change keyup", function(e){

                    var target = e.target,
                        $target = $(target);
                    self.updateState($target, $domEl);
                });

                if (self.triggerElement) {
                    $(self.triggerElement, $domEl).on("click", function(e) {
                        $inputEl.trigger("click");
                    });
                }

                if (self.onInputInitialize) {
                    self.onInputInitialize.call(self, $domEl, $inputEl);
                }

                if (!$domEl.data("ignore-onload")) {
                    self.updateState($inputEl, $domEl);
                }

            });

            if (self.onInitialize) {
                self.onInitialize.call(self);
            }
        },
        updateState: function($el, $domEl) {
            var self = this;
            if(self.onInputChange) {
                self.onInputChange.call(self, $el, $domEl);
            }
        }
    };
    hasJS();
    return Fancy;
})();

/**
 * SelectBoxes
 * Update an arbitrary label element based on the selectedIndex.
 */
var FancySelects = (function(FancyInput) {
    var Selects = new FancyInput({
        element: "[data-select]",
        input: "select",
        activeClass: "select--loaded",
        debug: "foo",
        onInputInitialize: function($domEl, $inputEl) {
            $domEl.parent().addClass(self.activeClass);
            $domEl.find("[data-select-label]").on("click", function(){
                $inputEl.focus();
            });
        },
        onInputChange: function($inputEl, $domEl) {
            var self = this,
                $self = $inputEl,
                domEl = $self.get(0),
                index = $self.prop("selectedIndex"),
                labelText = "",
                newLabelText = "&nbsp;";

            var labelEl = $inputEl.siblings("[data-select-label]").get(0);

            if(domEl.options.length) {
                var optionText = domEl.options[index].text;
                if (optionText !== "") {
                    newLabelText = optionText;
                }
            }

            labelText = newLabelText;
            labelEl.innerHTML = labelText;
        }
    });
    return Selects;
})(FancyInput);

/**
 * Pretty checkboxes
 */
var FancyCheckboxes = (function(FancyInput){
    var Checkboxes = new FancyInput({
        element: "[data-checkbox]",
        input: "input",
        triggerElement: ".field_checkbox__fancy",
        activeClass: "field_checkbox--checked",
        onInputChange: function($el) {
            var self = this,
                el = $el.get(0),
                $parent = $el.parent();
            if (el.checked) {
                $parent.addClass(self.activeClass);
            } else {
                $parent.removeClass(self.activeClass);
            }
        }
    });
    return Checkboxes;
})(FancyInput);


$(document).ready(function() {
    FancySelects.init();
    FancyCheckboxes.init();
});