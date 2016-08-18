(function (window, document, undefined) {
  /* constants */
  var YEARS_RANGE = 25;
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
  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  window.Datepicker = Datepicker;

  function Datepicker (element, config) {
    this._date = new Date();

    this._state = {
      year: this._date.getFullYear(),
      month: this._date.getMonth(),
      day: this._date.getDate()
    };

    this._config = extend({
      firstDay: 0
    }, config);


    this._container = createElement("div", {class: "datepicker"});
    element.appendChild(this._container);
    this._render("date");

    // this.callback = function () {
    //
    // };
  }

  Datepicker.prototype = {
    _render: render,
    _setMonth: setMonth,
    _setYear: setYear,
    _renderHead: renderHead,
    _renderDatePicker: renderDatePicker,
    _renderMonthPicker: renderMonthPicker,
    _renderYearPicker: renderYearPicker,
    setDate: setDate
  };

  var datepicker = new Datepicker(document.querySelector("main"), {
    firstDay: 1
  });

  function setDate (d) {
    d = d.split("-");
    this._date = new Date(parseInt(d[0]), parseInt(d[1]), parseInt(d[2]));
    this._state.day = this._date.getDate();
    this._state.month = this._date.getMonth();
    this._state.year = this._date.getFullYear();

    // this.callback();
    return;
  }

  function setMonth (month) {
    month = parseInt(month);
    if (month < 0)  {
      this._state.month = 11;
      return this._setYear(this.state.year - 1);
    } else if (month > 11) {
      this.state.month = 0;
      return this._setYear(this.state.year + 1);
    } else {
      this._state.month = month;
    }
    return;
  }

  function setYear (year) {
    this._state.year = parseInt(year) > 0 ? parseInt(year) : 0;
    return;
  }

  function render (view) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(this._renderHead(view));

    switch (view) {
    case "date":
      fragment.appendChild(this._renderDatePicker());
      break;
    case "month":
      fragment.appendChild(this._renderMonthPicker());
      break;
    case "year":
      fragment.appendChild(this._renderYearPicker());
      break;
    }

    this._container.innerHTML = "";
    this._container.appendChild(fragment);
  }

  function renderHead (view) {
    // bindings
    var state = this._state;
    var render = this._render.bind(this);
    var setMonth = this._setMonth.bind(this);
    var setYear = this._setYear.bind(this);

    var prev, change, next;

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
      switch (view) {
      case "date":
        setMonth(state.month - 1);
        render("date");
        break;
      case "month":
        setYear(state.year - 1);
        render("month");
        break;
      case "year":
        setYear(state.year - YEARS_RANGE);
        render("year");
        break;
      }
    });
    head.appendChild(prev);
    // </button>

    // <button type="button" class="pick-btn pick-change">
    change = createElement("button", {
      type: "button",
      class: "pick-btn pick-change"
    });
    // text
    switch (view) {
    case "date":
      change.innerHTML = MONTHS[state.month] + " " + state.year;
      change.value = "month";
      break;
    case "month":
      change.innerHTML = state.year;
      change.value = "year";
      break;
    case "year":
      var start = getStartYear(state.year, YEARS_RANGE);
      var end = start + 24;
      change.innerHTML = start + " - " + end;
      change.className += " disabled";
      break;
    }
    // add event
    change.addEventListener("click", function (e) {
      e.preventDefault();
      render(this.value);
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
      switch (view) {
      case "date":
        setMonth(state.month + 1);
        render("date");
        break;
      case "month":
        setYear(state.year + 1);
        render("month");
        break;
      case "year":
        setYear(state.year + YEARS_RANGE);
        render("year");
        break;
      }
    });
    head.appendChild(next);
    // </button>
    // </div>

    return head;
  }

  function renderYearPicker () {
    // bindings
    var state = this._state;
    var date = this._date;
    var setYear = this._setYear.bind(this);
    var render = this._render.bind(this);

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
      if (date.getFullYear() === year) {
        btn.className += " active";
      }

      // add event
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setYear(this.value);
        render("month");
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

  function renderMonthPicker () {
    // bindings
    var state = this._state;
    var date = this._date;
    var setMonth = this._setMonth.bind(this);
    var render = this._render.bind(this);

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
      if (date.getMonth() === month &&
      date.getFullYear() === state.year) {
        btn.classList.add("active");
      }

      // bind event
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setMonth(this.value);
        render("date");
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

  function renderDatePicker () {
    // bindings
    var state = this._state;
    var firstDay = this._config.firstDay;
    var date = this._date;
    var setDate = this.setDate.bind(this);
    var render = this._render.bind(this);

    var row, col, btn;
    var day = 0, month = 0, year = 0;
    var start = 0;
    var weekday;
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
    datepicker.appendChild(createElement("thead"));
    // <tr>
    var head = createElement("tr");

    // <th>
    for (var w = 0; w < 7; w++) {
      weekday = createElement("th");
      weekday.innerHTML = getWeekday(w, firstDay);
      head.appendChild(weekday);
    }
    // </th>
    datepicker.firstChild.appendChild(head);
    // </tr>

    // <tr>
    row = createElement("tr");

    // <td>
    for (var i = start, c = 0; i < (42 + start); i++) {
      col = createElement("td");

      day = 1 + (i - before);
      month = state.month;
      year = state.year;

      // <button class="pick-btn pick-day">
      btn = createElement("button", {
        type: "button",
        class: "pick-btn pick-day"
      });

      /*
      if day is is before selected month
      set button to out
      */
      if (i < before) {
        if (state.month === 0) {
          month = 11;
          year = state.year - 1;
        } else {
          month = state.month - 1;
        }
        day = getDaysInMonth(year, month) + day;
        btn.classList.add("out");

      /*
      if day is after selected month
      set button to out
      */
      } else if (i >= (daysInMonth + before)) {
        if (state.month === 11) {
          month = 0;
          year = state.year + 1;
        } else {
          month = state.month + 1;
        }
        day = day - daysInMonth;
        btn.classList.add("out");
      }

      // set active if selected day
      if (date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year) {
        btn.classList.add("active");
      }

      // text
      btn.innerHTML = day;
      // value
      btn.value = year + "-" + month + "-" + day;

      // add event
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setDate(this.value);
        render("date");
      });

      col.appendChild(btn);
      // </button>

      row.appendChild(col);
      // </td>

      if (++c === 7) {
        datepicker.firstChild.appendChild(row);
        row = createElement("tr");
        c = 0;
      }
      // </tr>
    }
    // <thead>
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
})(window, document);