## Javascript Datepicker
**- lightweight, customizable CSS, no dependencies, extendable -**

[Examples](https://nehrdani.github.io/Datepicker/)

### Getting Started

This is the minimum markup and it renders the Datepicker as a static element on the page. If you want it dynamically hidden or shown on an event you have to to this on yourself.
I'm sure you can do it :wink:.

#### HTML

```html
<input id="input" type="text" name="date">
<div id="container">
<!-- the Datepicker will be rendered here -->
</div>
```

#### Javascript

```js
// best wait for DOM ready
document.addEventListener("DOMContentLoaded", function () {

  // constructor
  var datepicker = new Datepicker({
    onSelect: onSelect // callback
  });

  var input = document.querySelector("#input");
  var container = document.querySelector("#container");

  // manually bind the datepicker element to the container
  container.appendChild(datepicker.element);

  // get a Date object as parameter to work with
  function onSelect (date) {
    input.value = date.toDateString();
  }
}
```

### Properties

* date [Date, null] - The current Date of the Datepicker.
* element [DOM Element] - The Datepicker element.

### Methods

* setDate (date) - Sets the value of the Datepicker, it must be a Date object or parsable through 'new Date()', returns the new date as Date object.
* destroy - destroys the datepicker. Returns null.

### Options

* onSelect (date) - Callback that returns the selected Date.
* firstDay *(Default: 0)* - Starting day of the week from 0-6 (0 = Sunday, 6 = Saturday).
* minDate *(Default: null)* - Defines the minimum available Date.
* maxDate *(Default: null)* - Defines the maximum available Date.
* customClass ({date: date, mode: mode}) - Optional function to add classes to dates based on passing an object with date and current mode properties.
* disableDate ({date: date, mode: mode}) - Optional function to disabled Dates based on passing an object with date and current mode properties.

### About
*There are many other Datepicker plugins out there. But I wanted to build one on my own.*
**Feel free to try, fork and share. I appreciate every feedback.**
