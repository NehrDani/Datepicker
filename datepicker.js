(function (window, document, undefined) {
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

  /* constants */

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
  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  window.Datepicker = Datepicker;

  function Datepicker () {
    this.date = new Date();
    this.state = {
      year: 0,
      month: 0,
      day: 0
    };
  }

  var firstDay = 1;

  var state = {
    date: new Date(),
    year: 0,
    month: 0,
    day: 0
  };
  state.year = state.date.getFullYear();
  state.month = state.date.getMonth();
  state.day = state.date.getDate();

  var container = createElement("div", {class: "datepicker"});
  document.querySelector("main").appendChild(container);
  render("date");

  function render (state) {
    var head = renderHead(state);
    var picker;

    switch (state) {
    case "date":
      picker = renderDatePicker();
      break;
    case "month":
      picker = renderMonthPicker();
      break;
    case "year":
      picker = renderYearPicker();
      break;
    }

    container.innerHTML = "";
    container.appendChild(head);
    container.appendChild(picker);
  }

  function setState (state) {
    render(state);
  }

  function getDaysInMonth (year, month) {
    return month === 1 && year % 4 === 0 &&
      (year % 100 !== 0 || year % 400 === 0) ? 29 : DAYS_IN_MONTH[month];
  }

  function getWeekday (i) {
    i += firstDay;
    while (i >= 7) {
      i -= 7;
    }
    return WEEKDAYS[i];
  }

  function setDate (date) {
    date = date.split("-");
    state.date = new Date(date[0], date[1], date[2]);
    state.day = state.date.getDate();
    state.month = state.date.getMonth();
    state.year = state.date.getFullYear();

    setState("date");
    return;
  }

  function setMonth (month) {
    month = parseInt(month);
    if (month < 0)  {
      state.month = 11;
      return setYear(state.year - 1);
    } else if (month > 11) {
      state.month = 0;
      return setYear(state.year + 1);
    } else {
      state.month = month;
    }

    setState("date");
    return;
  }

  function setYear (year) {
    state.year = parseInt(year) > 0 ? parseInt(year) : 0;

    setState("month");
    return;
  }

  function getStartYear (year, range) {
    return parseInt((year - 1) / range) * range + 1;
  }

  function renderHead (view) {
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
        break;
      case "month":
        setYear(state.year - 1);
        break;
      case "year":
        setYear(state.year - 25);
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
      var start = getStartYear(state.year, 25);
      var end = start + 24;
      change.innerHTML = start + " - " + end;
      change.className += " disabled";
      break;
    }
    // add event
    change.addEventListener("click", function (e) {
      e.preventDefault();
      setState(this.value);
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
        break;
      case "month":
        setYear(state.year + 1);
        break;
      case "year":
        setYear(state.year + 25);
        break;
      }
    });
    head.appendChild(next);
    // </button>
    // </div>

    return head;
  }

  function renderYearPicker () {
    var row, col, btn;
    var year = getStartYear(state.year, 25);

    // <table>
    var yearpicker = createElement("table");
    // <tbody>
    yearpicker.appendChild(createElement("tbody"));

    // <tr>
    row = createElement("tr");

    for (var r = 0, c = 0; r < 25; r++) {
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
      if (state.date.getFullYear() === year) {
        btn.className += " active";
      }

      // add event
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setYear(this.value);
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

    // yearpick.innerHTML = "";
    // yearpick.appendChild(renderHead("year"));
    // yearpick.appendChild(table);
    // </table>

    return yearpicker;
  }

  function renderMonthPicker () {
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
      if (state.date.getMonth() === month &&
      state.date.getFullYear() === state.year) {
        btn.classList.add("active");
      }

      // bind event
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setMonth(this.value);
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

    // monthpick.innerHTML = "";
    // monthpick.appendChild(renderHead("month"));
    // monthpick.appendChild(table);
    // </table>

    return monthpicker;
  }

  function renderDatePicker () {
    var row, col, btn;
    var day = 0, month = 0, year = 0;
    var start = 0;
    var weekday;
    var daysInMonth = getDaysInMonth(state.year, state.month);
    var before = new Date(state.year, state.month, 1).getDay() - firstDay;

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
      weekday.innerHTML = getWeekday(w);
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
      if (state.date.getDate() === day &&
      state.date.getMonth() === month &&
      state.date.getFullYear() === year) {
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

    // datepick.innerHTML = "";
    // datepick.appendChild(renderHead("day"));
    // datepick.appendChild(table);
    // </table>

    return datepicker;
  }
})(window, document);