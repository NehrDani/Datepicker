(function() {
  function createElement (element) {
    return document.createElement(element);
  }

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

  var firstDay = 1;

  var state = {
    today: new Date(),
    date: new Date(),
    year: 0,
    month: 0,
    day: 0
  };
  state.year = state.today.getFullYear();
  state.month = state.today.getMonth();
  state.day = state.today.getDate();

  var datepick = createElement("div");
  datepick.classList.add("datepicker");
  var monthpick = createElement("div");
  monthpick.classList.add("datepicker");
  var yearpick = createElement("div");
  yearpick.classList.add("datepicker");

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

    renderDatePicker();
    renderMonthPicker();
    renderYearPicker();
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
    renderDatePicker();
    renderMonthPicker();
    renderYearPicker();
    return;
  }

  function setYear (year) {
    state.year = parseInt(year) > 0 ? parseInt(year) : 0;
    renderDatePicker();
    renderMonthPicker();
    renderYearPicker();
    return;
  }

  function getStartYear (year, range) {
    return parseInt((state.year - 1) / range) * range + 1;
  }

  function renderYearPicker () {
    var row, col, btn;
    var year = getStartYear(state.year, 25);

    // <table>
    var table = createElement("table");
    // <tbody>
    table.appendChild(createElement("tbody"));

    for (var r = 0; r < 5; r++) {
      // <tr>
      row = createElement("tr");
      for (var c = 0; c < 5; c++) {
        // </td>
        col = createElement("td");
        // <button class="pick-btn pick-year">
        btn = createElement("button");
        btn.classList.add("pick-btn");
        btn.classList.add("pick-year");
        if (state.date.getFullYear() === year) {
          btn.classList.add("active");
        }
        btn.innerHTML = year;
        btn.value = year;

        // add event
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          setYear(this.value);
        });
        // </button>
        col.appendChild(btn);
        row.appendChild(col);
        // </td>
        year++;
      }
      table.firstChild.appendChild(row);
      // </tr>
    }

    yearpick.innerHTML = "";
    yearpick.appendChild(renderHead("year"));
    yearpick.appendChild(table);
  }

  function renderMonthPicker () {
    var row, col, btn;
    var count = 0;

    // <table>
    var table = createElement("table");
    // <tbody>
    table.appendChild(createElement("tbody"));

    for (var r = 0; r < 4; r++) {
      row = createElement("tr");
      for (var c = 0; c < 3; c++) {
        col = createElement("td");
        btn = createElement("button");
        btn.classList.add("pick-btn");
        btn.classList.add("pick-month");
        if (state.date.getMonth() === count &&
        state.date.getFullYear() === state.year) {
          btn.classList.add("active");
        }
        btn.innerHTML = MONTHS[count];
        btn.value = count;
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          setMonth(this.value);
        });
        col.appendChild(btn);
        row.appendChild(col);
        count++;
      }
      table.firstChild.appendChild(row);
    }
    monthpick.innerHTML = "";
    monthpick.appendChild(renderHead("month"));
    monthpick.appendChild(table);
  }

  function renderHead (view) {
    var prev, change, next;

    // <div class="pick-head">
    var head = createElement("div");
    head.classList.add("pick-head");

    // <button type="button" class="pick-btn pick-prev">
    prev = createElement("button");
    prev.setAttribute("type", "button");
    prev.classList.add("pick-btn");
    prev.classList.add("pick-prev");
    // text
    prev.innerHTML = "&#9666";

    // bind event
    prev.addEventListener("click", function (e) {
      e.preventDefault();
      switch (view) {
      case "day":
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
    change = createElement("button");
    change.classList.add("pick-btn");
    change.classList.add("pick-change");
    // text
    switch (view) {
    case "day":
      change.innerHTML = MONTHS[state.month] + " " + state.year;
      break;
    case "month":
      change.innerHTML = state.year;
      break;
    case "year":
      var start = getStartYear(state.year, 25);
      var end = start + 24;
      change.innerHTML = start + " - " + end;
      change.classList.add("disabled");
      break;
    }

    head.appendChild(change);
    // </button>

    // <button type="button" class="pick-btn pick-next">
    next = createElement("button");
    next.classList.add("pick-btn");
    next.classList.add("pick-next");
    // text
    next.innerHTML = "&#9656";

    // bind event
    next.addEventListener("click", function (e) {
      e.preventDefault();
      switch (view) {
      case "day":
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

  function renderDatePicker () {
    var start = 0;
    var days = getDaysInMonth(state.year, state.month);
    var before = new Date(state.year, state.month, 1).getDay();
    before -= firstDay;
    if (before < 0) {
      before += 7;
    } else if (before === 0) {
      start -= 7;
    }

    var table = createElement("table");
    table.appendChild(createElement("tbody"));
    var head = createElement("tr");
    var weekday;
    for (var w = 0; w < 7; w++) {
      weekday = createElement("th");
      weekday.innerHTML = getWeekday(w);
      head.appendChild(weekday);
    }
    table.firstChild.appendChild(head);

    var row, col, btn;
    var day = 0;
    var m = state.month, y = state.year;

    row = createElement("tr");
    for (var i = start, r = 0; i < (42 + start); i++) {

      day = 1 + (i - before);
      col = createElement("td");

      btn = createElement("button");
      btn.classList.add("pick-btn");
      btn.classList.add("pick-day");
      if (i < before) {
        if (state.month === 0) {
          m = 11;
          y = state.year - 1;
        } else {
          m = state.month - 1;
        }
        day = getDaysInMonth(y, m) + day;
        btn.classList.add("out");
      } else if (i >= (days + before)) {
        if (state.month === 11) {
          m = 0;
          y = state.year + 1;
        } else {
          m = state.month + 1;
        }
        day = day - days;
        btn.classList.add("out");
      } else {
        m = state.month;
        y = state.year;
      }

      if (state.date.getDate() === day &&
      state.date.getFullYear() === y &&
      state.date.getMonth() === m) {
        btn.classList.add("active");
      }

      btn.innerHTML = day;
      btn.value = y+"-"+m+"-"+day;

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setDate(this.value);
      });

      col.appendChild(btn);
      row.appendChild(col);
      if (++r === 7) {
        table.firstChild.appendChild(row);
        row = createElement("tr");
        r = 0;
      }
    }

    datepick.innerHTML = "";
    datepick.appendChild(renderHead("day"));
    datepick.appendChild(table);
  }

  renderDatePicker();
  renderMonthPicker();
  renderYearPicker();

  document.querySelector("main").appendChild(datepick);
  document.querySelector("main").appendChild(monthpick);
  document.querySelector("main").appendChild(yearpick);
})(window, document);