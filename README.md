FancyInputs.js
==============

Pretty select boxes for work and pleasure.

### Select
```html
 <div class='field_select' data-select>
    <select class="field_select__input" id="mySelect" name='mySelect' tabindex=''>
        <option value=''>Option 1</option>
        <option value='' selected>Option 2</option>
        <option value='' selected>Option 3</option>
        <option value='' selected>Option 4</option>
    </select>
    <div data-select-label='mySelect' class='field_select__value field field_text'></div>
    <div class='field_select__affordance'>
        <i class='i icon_disclosure'></i>
    </div>
</div>
```

### Checkbox
```html
<div class='icon_text'>
    <div class='i field_checkbox' data-checkbox data-id='myCheckbox'>
        <i class='field_checkbox__fancy'></i>
        <input type='checkbox' id='myCheckbox' name='myCheckbox' value='1' tabindex=''>
        <label class='icon_text__label field_checkbox__label' for='myCheckbox'>My awesome checkbox</label>
    </div>
</div>
```

### Radio buttons
```html
<div class='icon_text'>
    <div class='i field_radio' data-radio data-id='myRadio_1'>
        <i class='field_radio__fancy'></i>
        <input type='radio' id='myRadio_1' name='myRadio' value='1' tabindex=''>
        <label class='icon_text__label field_radio__label' for='myRadio_1'>My radio button</label>
    </div>
</div>
<div class='icon_text'>
    <div class='i field_radio' data-radio data-id='myRadio_2'>
        <i class='field_radio__fancy'></i>
        <input type='radio' id='myRadio_2' name='myRadio' value='2' tabindex=''>
        <label class='icon_text__label field_radio__label' for='myRadio_2'>Hey, another radio button</label>
    </div>
</div>
```

### Conditionals

```html
<input type='text' placeholder='Your weight in kilogrammes' data-additional-trigger='motivation' data-additional-value='>100'>

<div data-additional='motivation'>
    Maybe time to lay off the pies, buddy!
</div>

```
