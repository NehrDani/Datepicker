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
    return;
  }

  function setMonth (month) {
    month = parseInt(month);
    if (month < 0)  {
      state.month = 11;
      setYear(state.year - 1);
    } else if (month > 11) {
      state.month = 0;
      setYear(state.year + 1);
    } else {
      state.month = month;
    }
    renderDatePicker();
    renderMonthPicker();
    return;
  }

  function setYear (year) {
    state.year = parseInt(year);
    renderDatePicker();
    renderMonthPicker();
    return;
  }

  function renderMonthPicker () {
    var table = createElement("table");
    table.appendChild(createElement("thead"));
    table.appendChild(createElement("tbody"));

    var row, col, btn;
    var count = 0;

    for (var r = 0; r < 4; r++) {
      row = createElement("tr");
      for (var c = 0; c < 3; c++) {
        col = createElement("td");
        btn = createElement("button");
        btn.classList.add("pick-btn");
        btn.classList.add("pick-month");
        btn.innerHTML = MONTHS[count];
        btn.setAttribute("month", count);
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          setMonth(this.getAttribute("month"));
          renderDatePicker();
        });
        col.appendChild(btn);
        row.appendChild(col);
        count++;
      }
      table.children[1].appendChild(row);
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
    prev.innerHTML = "&lt;";
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
      break;
    }

    head.appendChild(change);
    // </button>

    // <button type="button" class="pick-btn pick-next">
    next = createElement("button");
    next.classList.add("pick-btn");
    next.classList.add("pick-next");
    // text
    next.innerHTML = "&gt;";
    head.appendChild(next);
    // </button>

    // </div>

    // bind events
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
        break;
      }
    });

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
        break;
      }
    });

    return head;
  }

  function renderDatePicker () {
    // var date = new Date();
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

      if (state.day === day &&
      state.year === y &&
      state.month === m) {
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

  document.querySelector("main").appendChild(datepick);
  document.querySelector("main").appendChild(monthpick);
})(window, document);