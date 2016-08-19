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
  var _lang = window.lang;
  if (_lang !== undefined) {
    MONTHS = _lang.months || MONTHS;
    WEEKDAYS = _lang.weekdays || WEEKDAYS;
  }

  window.Datepicker = Datepicker;

  function Datepicker (container) {
    var options = {};

    if (typeof arguments[1] === "object") {
      options = arguments[1];
      if (typeof arguments[2] === "function")
        this._onChange = arguments[2];
    } else if (typeof arguments[1] === "function")
      this._onChange = arguments[1];

    this.date = new Date();

    this._state = {
      view: "date",
      year: this.date.getFullYear(),
      month: this.date.getMonth(),
      day: this.date.getDate()
    };

    this._config = extend({
      firstDay: 0
    }, options);

    // create datepicker node and append it to the container
    this.element = createElement("div", {class: "datepicker"});
    container.appendChild(this.element);

    // initial rendering
    this._render();
  }

  Datepicker.prototype = {
    _render: render,
    _setState: setState,
    setDate: setDate,
    destroy: destroy
  };

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
      case "view":
        if (state[option])
          this._state.view = state[option];
        break;
      }
    }

    if (save === true) {
      this.setDate(
        new Date(this._state.year, this._state.month, this._state.day)
      );
      if (typeof this._onChange === "function")
        this._onChange(this.date);
      return;
    }

    this._render();
    return;
  }

  function setDate (date) {
    this.date = new Date(date);
    this._state.day = this.date.getDate();
    this._state.month = this.date.getMonth();
    this._state.year = this.date.getFullYear();

    this._render();
    return this.date;
  }

  function render () {
    var setState = this._setState.bind(this);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(renderHead(this._state, setState));

    switch (this._state.view) {
    case "date":
      fragment.appendChild(renderDatePicker({
        state: this._state,
        active: this.date,
        firstDay: this._config.firstDay
      }, setState));
      break;
    case "month":
      fragment.appendChild(renderMonthPicker({
        state: this._state,
        active: this.date
      }, setState));
      break;
    case "year":
      fragment.appendChild(renderYearPicker({
        state: this._state,
        active: this.date
      }, setState));
      break;
    }

    this.element.innerHTML = "";
    this.element.appendChild(fragment);
    return true;
  }

  function renderHead (state, setState) {
    var prev, change, next, newState;

    // <div class="pick-head">
    var head = createElement("div", {class: "pick-head"});

    // <button type="button" class="pick-btn pick-prev">
    prev = createElement("button", {
      type: "button",
      class: "pick-btn pick-prev"
    });
    // text
    prev.innerHTML = "&#9666";

    // bind event
    prev.addEventListener("click", function (e) {
      e.preventDefault();
      newState = {};
      newState[this.name] = this.value;
      setState(newState);
    });
    head.appendChild(prev);
    // </button>

    // <button type="button" class="pick-btn pick-change">
    change = createElement("button", {
      type: "button",
      class: "pick-btn pick-change"
    });

    // add event
    change.addEventListener("click", function (e) {
      e.preventDefault();
      setState({view: this.value});
    });
    head.appendChild(change);
    // </button>

    // <button type="button" class="pick-btn pick-next">
    next = createElement("button", {
      type: "button",
      class: "pick-btn pick-next"
    });
    // text
    next.innerHTML = "&#9656";

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
    switch (state.view) {
    case "date":
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

  function renderYearPicker (options, setState) {
    // bindings
    var state = options.state;
    var active = options.active;

    var row, col, btn;
    var year = getStartYear(state.year, YEARS_RANGE);

    // <table>
    var yearpicker = createElement("table");
    // <tbody>
    yearpicker.appendChild(createElement("tbody"));

    // <tr>
    row = createElement("tr");

    for (var r = 0, c = 0; r < YEARS_RANGE; r++) {
      // </td>
      col = createElement("td");
      // <button type="button" class="pick-btn pick-year" value={year}>
      btn = createElement("button", {
        type: "button",
        class: "pick-btn pick-year",
        value: year
      });
      // text
      btn.innerHTML = year;

      // active if selected year
      if (active.getFullYear() === year) {
        btn.className += " active";
      }

      // add event
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setState({
          view: "month",
          year: this.value
        });
      });

      col.appendChild(btn);
      // </button>
      row.appendChild(col);
      // </td>

      year++;
      // </tr>

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

  function renderMonthPicker (options, setState) {
    // bindings
    var state = options.state;
    var active = options.active;

    var row, col, btn;
    var month = 0;

    // <table>
    var monthpicker = createElement("table");
    // <tbody>
    monthpicker.appendChild(createElement("tbody"));

    // <tr>
    row = createElement("tr");

    for (var r = 0, c = 0; r < 12; r++) {
      // <td>
      col = createElement("td");
      // <button type="button" class="pick-btn pick-month" value={month}>
      btn = createElement("button", {
        type: "button",
        class: "pick-btn pick-month",
        value: month
      });
      // text
      btn.innerHTML = MONTHS[month];

      // set active if selected month
      if (active.getMonth() === month &&
      active.getFullYear() === state.year) {
        btn.classList.add("active");
      }

      // bind event
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setState({
          view: "date",
          month: this.value
        });
      });

      col.appendChild(btn);
      // </button>

      row.appendChild(col);
      // </td>

      month++;

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

  function renderDatePicker (options, setState) {
    // bindings
    var state = options.state;
    var firstDay = options.firstDay;
    var active = options.active;

    var row, col, btn;
    var day = 0, month = 0, year = 0;
    var start = 0;
    var weekday, week;
    var daysInMonth = getDaysInMonth(state.year, state.month);
    var before = new Date(state.year, state.month, 1).getDay();
    before -= firstDay;

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

    /* weekdays row */

    // <table>
    var datepicker = createElement("table");
    // <thead>
    var head = createElement("thead");
    // <tr>
    head.appendChild(createElement("tr"));

    // <th>
    head.firstChild.appendChild(createElement("th"));
    for (var w = 0; w < 7; w++) {
      weekday = createElement("th");
      weekday.innerHTML = getWeekday(w, firstDay);
      head.firstChild.appendChild(weekday);
    }
    // </th>
    datepicker.appendChild(head);
    // </tr>
    // </thead>

    // <tbody>
    var body = createElement("tbody");

    // <tr>
    row = createElement("tr");

    // <td> / <th>
    for (var i = start, c = 0; i < (42 + start); i++) {
      var date = new Date(state.year, state.month, 1 + (i - before));
      day = date.getDate();
      month = date.getMonth();
      year = date.getFullYear();

      // show week number
      if (c === 0) {
        //<th>
        col = createElement("th");
        week = getWeekNumber(date);
        col.innerHTML = week;
        row.appendChild(col);
        // </th>
      }

      // <td>
      col = createElement("td");

      // <button class="pick-btn pick-day">
      btn = createElement("button", {
        type: "button",
        class: "pick-btn pick-day"
      });

      /*
      if day is is outside selected month
      set button to out
      */
      if (i < before || i >= (daysInMonth + before)) {
        btn.classList.add("out");
      }

      // set active if selected day
      if (active.getDate() === day &&
      active.getMonth() === month &&
      active.getFullYear() === year) {
        btn.classList.add("active");
      }

      // text
      btn.innerHTML = day;
      // value
      btn.value = year + "-" + month + "-" + day;

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

  function extend (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          out[key] = arguments[i][key];
      }
    }

    return out;
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

  function getWeekNumber(date) {
    var checkDate = new Date(date);
    // set to Thursday
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    var time = checkDate.getTime();
    // compare with Jan 1
    checkDate.setMonth(0);
    checkDate.setDate(1);
    return Math.floor(Math.round((time - checkDate) / 864e5) / 7) + 1;
  }

  function destroy () {
    this.container.innerHTML = "";
    this.container.parentNode.removeChild(this.container);
    return;
  }
})(window, document);