/*!
 * Datepicker
 *
 * Copyright (c) 2016 Daniel Nehring | MIT license | https://github.com/NehrDani/Datepicker
 */

(function (window, document, undefined) {

  /* constants */
  var YEARS_RANGE = 25;
  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // i18n
  var lang = window.lang;
  if (lang !== undefined) {
    MONTHS = lang.months || MONTHS;
    WEEKDAYS = lang.weekdays || WEEKDAYS;
  }

  // making global
  window.Datepicker = Datepicker;

  /* the Datepicker constructor */
  function Datepicker () {
    var date = new Date();

    var defaults = {
      container: null,
      firstDay: 0,
      minDate: null,
      maxDate: null,
      customClass: null,
      disableDate: null,
      onSelect: null,
      startMode: "day"
    };

    this.date = null;

    this._state = {
      mode: null,
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    };

    this._config = extend(defaults, arguments[0] || {});
    this._state.mode = this._config.startMode;

    this.element = createElement("div", {class: "datepicker"});

    // append to container if assigned
    if (this._config.container)
      this._config.container.appendChild(this.element);

    // initial rendering
    this._render();
  }

  Datepicker.prototype = {
    _render: render,
    _setState: setState,
    setDate: setDate,
    clearDate: clearDate,
    destroy: destroy
  };

  /* public and protected methods */

  /**
   * setState
   *
   * updates the state based on the passed state object and its properties and
   * if the save flag is set it calls the setDate method to update the date
   * calls the render method to update the view and represent the new state
   *
   * @param {object} state - object with the new state properties
   * @param {bool} save - flag for updating the date
   */
  function setState (state, save) {
    var option, value;

    for (option in state) {
      switch (option) {
      case "year":
        this._state.year = parseInt(state[option]);
        break;
      case "month":
        value = parseInt(state[option]);
        if (value < 0) {
          value = 11;
          this._state.year--;
        } else if (value > 11) {
          value = 0;
          this._state.year++;
        }
        this._state.month = value;
        break;
      case "day":
        this._state.day = parseInt(state[option]);
        break;
      case "mode":
        if (state[option])
          this._state.mode = state[option];
        break;
      }
    }

    if (save === true) {
      this.setDate(
        new Date(this._state.year, this._state.month, this._state.day)
      );
      if (typeof this._config.onSelect === "function")
        this._config.onSelect(this.date);
      return;
    }

    this._render();
    return;
  }

  /**
   * setDate
   *
   * updates the date and sets the new state then renders the new state
   *
   * @param {Date} date - a Date object or parsable string
   * @return {Date} - returns a Date object or null
   */
  function setDate (date) {
    if (date) {
      this.date = new Date(date);
      this._state.day = this.date.getDate();
      this._state.month = this.date.getMonth();
      this._state.year = this.date.getFullYear();
    } else {
      this.date = null;
    }

    this._render();
    return this.date;
  }

  /**
   * clearDate
   *
   * clears the date and calls the render method
   */
  function clearDate () {
    this.date = null;
    this._render();
    return;
  }

  /**
   * render
   *
   * renders the state by calling seperate rendering methods and creating the
   * DOM element
   *
   * @return - returns a DOM element
   */
  function render () {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(renderHead.call(this));

    switch (this._state.mode) {
    case "day":
      fragment.appendChild(renderDatePicker.call(this));
      break;
    case "month":
      fragment.appendChild(renderMonthPicker.call(this));
      break;
    case "year":
      fragment.appendChild(renderYearPicker.call(this));
      break;
    }

    this.element.innerHTML = null;
    this.element.appendChild(fragment);
    fragment = null;
    return this.element;
  }

  /**
   * destroy
   *
   * removes the Datepicker element from the DOM if appended to it
   * clears the innerHTML and the element property
   *
   * @return {null} - returns null
   */
  function destroy () {
    if (this.element.parentNode)
      this.element.parentNode.removeChild(this.element);

    this.element.innerHTML = null;
    this.element = null;
    return null;
  }

  /* private methods */

  function renderHead () {
    var setState = this._setState.bind(this);
    var state = this._state;
    var prev, change, next, newState;

    // <div class="datepicker-head">
    var head = createElement("div", {class: "datepicker-head"});

    // <button type="button" class="datepicker-btn datepicker-prev">
    prev = createElement("button", {
      type: "button",
      class: "datepicker-btn datepicker-prev"
    });

    // bind event
    prev.addEventListener("click", function (e) {
      e.preventDefault();
      newState = {};
      newState[this.name] = this.value;
      setState(newState);
    });
    head.appendChild(prev);
    // </button>

    // <button type="button" class="datepicker-btn datepicker-change">
    change = createElement("button", {
      type: "button",
      class: "datepicker-btn datepicker-change"
    });

    // add event
    change.addEventListener("click", function (e) {
      e.preventDefault();
      setState({mode: this.value});
    });
    head.appendChild(change);
    // </button>

    // <button type="button" class="datepicker-btn datepicker-next">
    next = createElement("button", {
      type: "button",
      class: "datepicker-btn datepicker-next"
    });

    // bind event
    next.addEventListener("click", function (e) {
      e.preventDefault();
      newState = {};
      newState[this.name] = this.value;
      setState(newState);
    });
    head.appendChild(next);
    // </button>
    // </div>

    // text / value for buttons
    switch (state.mode) {
    case "day":
      prev.name = "month";
      prev.value = state.month - 1;

      next.name = "month";
      next.value = state.month + 1;

      change.innerHTML = MONTHS[state.month] + " " + state.year;
      change.value = "month";
      break;
    case "month":
      prev.name = "year";
      prev.value = state.year - 1;

      next.name = "year";
      next.value = state.year + 1;

      change.innerHTML = state.year;
      change.value = "year";
      break;
    case "year":
      prev.name = "year";
      prev.value = state.year - YEARS_RANGE;

      next.name = "year";
      next.value = state.year + YEARS_RANGE;

      var start = getStartYear(state.year, YEARS_RANGE);
      var end = start + 24;
      change.innerHTML = start + " - " + end;
      change.className += " disabled";
      break;
    }

    return head;
  }

  function renderYearPicker () {
    // bindings
    var config = this._config;
    var state = this._state;
    var active = (this.date instanceof Date) ? {
      year: this.date.getFullYear()
    } : null;
    var setState = this._setState.bind(this);

    // variables
    var row, col, btn;
    var year = getStartYear(state.year, YEARS_RANGE), date;

    // <table>
    var yearpicker = createElement("table");
    // <tbody>
    yearpicker.appendChild(createElement("tbody"));

    // <tr>
    row = createElement("tr");

    for (var r = 0, c = 0; r < YEARS_RANGE; r++) {
      date = new Date(year, 11);

      // </td>
      col = createElement("td");
      // <button type="button" class="datepicker-btn datepicker-year" value={year}>
      btn = createElement("button", {
        type: "button",
        class: "datepicker-btn datepicker-year",
        value: year
      });
      // text
      btn.innerHTML = year;

      // disable year depending on min and max dates
      if ((config.minDate && date < config.minDate) ||
      (config.maxDate && date > config.maxDate)) {
        btn = setDisabled(btn, true);
      }

      // active if selected year
      if (active !== null) {
        if (active.year === year) {
          btn.className += " active";
        }
      }

      // add customize options based on function return
      if (typeof config.customClass === "function") {
        btn = setCustom(btn, config.customClass({date: date, mode: "year"}));
      }
      // disabled dates based on function return
      if (typeof config.disableDate === "function") {
        btn = setDisabled(btn, config.disableDate({date: date, mode: "year"}));
      }

      // add event
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setState({
          mode: "month",
          year: this.value
        });
      });

      col.appendChild(btn);
      // </button>
      row.appendChild(col);
      // </td>

      year++;
      // </tr>

      // add row after 5 cols
      if (++c === 5) {
        yearpicker.firstChild.appendChild(row);
        row = createElement("tr");
        c = 0;
      }
    }
    // </tbody>
    // </table>

    return yearpicker;
  }

  function renderMonthPicker () {
    // bindings
    var setState = this._setState.bind(this);
    var state = this._state;
    var config = this._config;
    var active = (this.date instanceof Date) ? {
      year: this.date.getFullYear(),
      month: this.date.getMonth()
    } : null;

    // variables
    var row, col, btn;
    var year = state.year, month = 0, date;

    // <table>
    var monthpicker = createElement("table");
    // <tbody>
    monthpicker.appendChild(createElement("tbody"));

    // <tr>
    row = createElement("tr");

    for (var r = 0, c = 0; r < 12; r++) {
      date = new Date(state.year, month, getDaysInMonth(state.year, month));

      // <td>
      col = createElement("td");
      // <button type="button" class="datepicker-btn datepicker-month" value={month}>
      btn = createElement("button", {
        type: "button",
        class: "datepicker-btn datepicker-month",
        value: month
      });
      // text
      btn.innerHTML = MONTHS[month];

      // disable month depending on min and max dates
      if ((config.minDate && date < config.minDate) ||
      (config.maxDate && date > config.maxDate)) {
        btn = setDisabled(btn, true);
      }

      // set month to active if selected
      if (active !== null) {
        if (active.month === month &&
        active.year === year) {
          btn.className += " active";
        }
      }

      // add customize options based on function return
      if (typeof config.customClass === "function") {
        btn = setCustom(btn, config.customClass({date: date, mode: "month"}));
      }
      // disabled dates based on function return
      if (typeof config.disableDate === "function") {
        btn = setDisabled(btn, config.disableDate({date: date, mode: "month"}));
      }

      // bind event
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setState({
          mode: "day",
          month: this.value
        });
      });

      col.appendChild(btn);
      // </button>

      row.appendChild(col);
      // </td>

      month++;

      // add row after 3 cols
      if (++c === 3) {
        monthpicker.firstChild.appendChild(row);
        row = createElement("tr");
        c = 0;
      }
      // </tr>
    }
    // <tbody>
    // </table>

    return monthpicker;
  }

  function renderDatePicker () {
    // bindings
    var setState = this._setState.bind(this);
    var state = this._state;
    var config = this._config;
    var active = (this.date instanceof Date) ? {
      "day": this.date.getDate(),
      "month": this.date.getMonth(),
      "year": this.date.getFullYear()
    } : null;

    // variables
    var row, col, btn, weekday, week;
    var day = 0, month = 0, year = 0, date;
    var daysInMonth = getDaysInMonth(state.year, state.month);
    var before = new Date(state.year, state.month, 1).getDay();
    before -= config.firstDay;
    var start = 0;

    /*
    If week doesnt start on day 0
    check for starting weekday of selected month
    and push all days to fit the selected start day

    If month starts on start day add a additional week
    to preserve the 6 weeks calendar
    */
    if (before < 0) {
      before += 7;
    } else if (before === 0) {
      start -= 7;
    }

    /* weekdays */
    // <table>
    var datepicker = createElement("table");
    // <thead>
    var head = createElement("thead");
    // <tr>
    head.appendChild(createElement("tr"));

    // <th>
    head.firstChild.appendChild(createElement("th"));
    for (var w = 0; w < 7; w++) {

      // adds an empty field for the weeknumbers coloumn
      weekday = createElement("th");

      weekday.innerHTML = getWeekday(w, config.firstDay);
      head.firstChild.appendChild(weekday);
    }
    // </th>
    /* !weekdays */

    datepicker.appendChild(head);
    // </tr>
    // </thead>

    // <tbody>
    var body = createElement("tbody");

    // <tr>
    row = createElement("tr");

    // <td> / <th>
    for (var i = start, c = 0; i < (42 + start); i++) {
      date = new Date(state.year, state.month, 1 + (i - before));
      day = date.getDate();
      month = date.getMonth();
      year = date.getFullYear();

      /* week numbers */
      if (c === 0) {
        //<th>
        col = createElement("th");
        week = getWeekNumber(date);
        col.innerHTML = week;
        row.appendChild(col);
        // </th>
      }
      /* !week numbers */

      // <td>
      col = createElement("td");

      // <button class="datepicker-btn datepicker-day">
      btn = createElement("button", {
        type: "button",
        class: "datepicker-btn datepicker-day"
      });

      // mark dates outside current month
      if (i < before || i >= (daysInMonth + before)) {
        btn.className += " out";
      }

      // disable dates depending on min and max dates
      if ((config.minDate && date < config.minDate) ||
      (config.maxDate && date > config.maxDate)) {
        btn = setDisabled(btn, true);
      }

      // set date to active if selected day
      if (active !== null) {
        if (active.day === day &&
        active.month === month &&
        active.year === year) {
          btn.className += " active";
        }
      }

      // text
      btn.innerHTML = day;
      // value
      btn.value = year + "-" + month + "-" + day;

      // add customize options based on function return
      if (typeof config.customClass === "function") {
        btn = setCustom(btn, config.customClass({date: date, mode: "date"}));
      }
      // disabled dates based on function return
      if (typeof config.disableDate === "function") {
        btn = setDisabled(btn, config.disableDate({date: date, mode: "date"}));
      }

      // add event
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var value = this.value.split("-");
        setState({
          year: value[0],
          month: value[1],
          day: value[2]
        }, true);
      });

      col.appendChild(btn);
      // </button>

      row.appendChild(col);
      // </td>

      // add row after 7 cols
      if (++c === 7) {
        body.appendChild(row);
        row = createElement("tr");
        c = 0;
      }
      // </tr>
    }
    datepicker.appendChild(body);
    // </tbody>
    // </table>

    return datepicker;
  }

  /* helper functions */

  function createElement (element, options) {
    var node = document.createElement(element);

    if (options !== undefined) {
      for (var option in options) {
        switch (option) {
        case "class":
          node.className = options[option];
          break;
        case "value":
          if (node.value !== undefined) node.value = options[option];
          break;
        default:
          node.setAttribute(option, options[option]);
          break;
        }
      }
    }

    return node;
  }

  function extend (properties) {
    properties = properties || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          properties[key] = arguments[i][key];
      }
    }

    return properties;
  }

  function getDaysInMonth (year, month) {
    return month === 1 && year % 4 === 0 &&
      (year % 100 !== 0 || year % 400 === 0) ? 29 : DAYS_IN_MONTH[month];
  }

  function getWeekday (i, first) {
    i += first;
    while (i >= 7) {
      i -= 7;
    }
    return WEEKDAYS[i];
  }

  function getStartYear (year, range) {
    return parseInt((year - 1) / range) * range + 1;
  }

  function getWeekNumber (date) {
    var checkDate = new Date(date);
    // set to Thursday
    // every new week has the next thursday in it
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    var time = checkDate.getTime();
    // set to Jan 1
    checkDate.setMonth(0);
    checkDate.setDate(1);
    // calculates the milliseconds since the Jan 1
    // divides it by the milliseconds per day (86400000)
    // to get the current day of the year
    // divides it by days a week (7) to get the current week of the year
    return Math.floor(Math.round((time - checkDate) / 864e5) / 7) + 1;
  }

  function setCustom (btn, className) {
    if (className)
      btn.className += " " + className;
    return btn;
  }

  function setDisabled (btn, status) {
    if (status === true) {
      btn.className += " disabled";
      btn.setAttribute("disabled", true);
    }
    return btn;
  }
})(window, document);
