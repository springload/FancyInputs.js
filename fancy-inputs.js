var Fancy = (function(document,window){

    var emptyFormElem = function($elem) {

        // Selects (set to top item)
        if ($elem.prop("tagName") === "SELECT") {
            $elem.children("option").attr("selected", false);
            $elem.children("option:first-child").attr("selected", true);
            $elem.trigger("change");
        }

        // Textareas
        else if ($elem.prop("tagName") === "TEXTAREA") {
            $elem.html("");
            $elem.trigger("change");
        }

        // Everything else
        else if ($elem.prop("tagName") === "INPUT") {
            // Everything else
            if ($elem.attr("type") !== "checkbox" && $elem.attr("type") !== "radio") {
                $elem.val("");
            } else {
                $elem.attr("checked", false);
            }
            $elem.trigger("change");
        }

        // Make it recursive
        var $children = $elem.children();
        if ($children.size() > 0) {
            $children.each(function(index, elem){
                emptyFormElem($(elem));
            });
        }

        return;
    };


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


    var FancyConditionals = (function(FancyInput){
        var showHide = new FancyInput({
            element: "[data-additional-trigger]",
            input: "select, input",
            debug: "bar",
            onInitialize: function() {
                var self = this;
                var $links = $(self.element).not("[data-additional-value]");

                $links.on("click change", function(e) {

                    var target = e.currentTarget;
                    var $target = $(target);
                    if ($target.data("hide-self")) {
                        $target.hide();
                    }

                    self.onInputChange.call(self, null, $target);
                });
            },
            onInputChange: function($inputEl, $domEl){
                var self = this;
                var validationCondition = $domEl.data("additional-value");
                var additionalTrigger = $domEl.data("additional-trigger");
                var hasInput = $inputEl ? true : false;
                if (hasInput) {

                    var show = false;
                    // different operators

                    // less than
                    if (validationCondition.toString().substring(0,1) == "<") {
                        if ($.isNumeric($inputEl.val()) && parseInt($inputEl.val()) < parseInt(validationCondition.substring(1))) {
                            show = true;
                        }
                        // greater than
                    } else if ($.isNumeric($inputEl.val()) && validationCondition.toString().substring(0,1) == ">") {
                        if ($inputEl.val() > validationCondition.substring(1)) {
                            show = true;
                        }
                        // equal to
                    } else if ($inputEl.val() == validationCondition) {
                        show = true;
                    }
                } else {
                    show = true;
                }

                if (show) {
                    self.showAdditional(additionalTrigger);
                } else {
                    self.hideAdditional(additionalTrigger);
                }
                // Fire an event in case we need to do other stuff
                $(document).trigger("inputChange" + additionalTrigger);
            },
            showAdditional: function(formElementName) {
                $("[data-additional='" + formElementName + "']").removeAttr("data-additional-hide");
            },
            hideAdditional: function(formElementName) {
                var $elem = $("[data-additional='" + formElementName + "']");
                $elem.attr("data-additional-hide", "true");
                this.emptyValues($elem);
            },
            emptyValues: function($elem) {
                emptyFormElem($elem);
            }
        });
        return showHide;
    })(FancyInput);

    $(document).ready(function() {
        FancySelects.init();
        FancyCheckboxes.init();
        FancyConditionals.init();
    });

})(document,window);