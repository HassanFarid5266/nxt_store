AOS.init();

document.querySelectorAll(".menu-btn").forEach(function (item) {
  item.addEventListener("click", function () {
    const sidebar = document.getElementById("sidebar");
    const body = document.querySelector("body");
    const html = document.querySelector("html");
    if (sidebar.classList.contains("active")) {
      sidebar.classList.remove("active");
      body.style.overflowY = "auto";
      html.style.overflowY = "auto";
    } else {
      sidebar.classList.add("active");
      body.style.overflowY = "hidden";
      html.style.overflowY = "hidden";
    }
  });
});

document.addEventListener("click", function (e) {
  const target = e.target;
  const body = document.querySelector("body");
  const html = document.querySelector("html");

  if (target.matches('[data-nxt-toggle="tab"]')) {
    const tabs = target.closest(".tabs");
    const panes = tabs.querySelectorAll(".tab-pane");
    const items = tabs.querySelectorAll(".tab-item");
    const active = target.getAttribute("data-nxt-target");
    items.forEach((i) => i.classList.remove("active"));
    target.classList.add("active");
    panes.forEach((i) => i.classList.remove("active"));
    document.querySelector(active).classList.add("active");
  } else if (target.matches('[data-nxt-toggle="collapse"]')) {
    let collapseItem = target.parentElement;
    let collapsible = collapseItem.parentElement;
    let items = collapsible.querySelectorAll(".collapse-item");
    items.forEach((el) => el.classList.remove("active"));
    collapseItem.classList.toggle("active");
  } else if (target.matches("[data-nxt-toggle='modal']")) {
    const attr = target.getAttribute("data-nxt-target");
    const selector = document.querySelector(attr);
    selector.classList.toggle("active");
    !target.classList.contains("active")
      ? (body.style.overflow = "hidden")
      : null;
  } else if (target.matches(".modal-dialog")) {
    const modal = target.closest(".active");
    modal.classList.remove("active");
    body.style.overflow = "auto";
  } else if (target.matches('[data-nxt-toggle="notice"]')) {
    target.parentElement.remove();
  } else if (target.matches('[data-nxt-dismiss="alert"')) {
    target.closest(".card-alert").remove();
  } else if (target.closest("[data-nxt-toggle='dropdown']")) {
    const dropdownT = target.closest(".dropdown");

    document
      .querySelectorAll("[data-nxt-toggle='dropdown']")
      .forEach((item) => {
        const dropdownA = item.closest(".dropdown");

        if (dropdownT != dropdownA) {
          dropdownA.classList.remove("active");
        } else {
          dropdownT.classList.toggle("active");
        }
      });
  } else if (target.closest(".dropdown-menu")) {
    const menu = target.closest(".dropdown-menu");
    const btn = menu.previousElementSibling;
    const close = btn.getAttribute("data-dropdown-close");
    if (close == "outside") {
      menu.classList.add("show");
    } else if (close == "inside") {
      menu.classList.remove("show");
    } else if (close == null) {
      menu.classList.remove("show");
    }
  } else if (target.closest(".item-no-close")) {
  } else {
    document
      .querySelectorAll(".dropdown")
      .forEach((item) => item.classList.remove("active"));
  }
});

function url(name, params = null) {
  let query = "";

  if (params) {
    query = Object.keys(params)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
      )
      .join("&");

    query = "?" + decodeURIComponent(query);
  } else {
    query = "";
  }
  return `${window.location.origin}/api/method/nextash_store.${name}` + query;
}

function csrf_token() {
  return document?.querySelector("#csrf_token").value;
}

function ApiUrl(name) {
  return `${window.location.origin}/api/method/${name}`;
}

function searchParams(params) {
  let query = Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    )
    .join("&");
  query = decodeURIComponent(query);
  return query;
}

function on(evt, selector, callback) {
  document.addEventListener(evt, (e) => {
    if (e.target.matches(selector)) {
      callback(e);
    }
  });
}

function get_param(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function hasProperty(obj, property, other) {
  return obj.hasOwnProperty(property) ? obj[property] : other;
}

function $msg(opts) {
  const is_exists = document.querySelector(".msgs");
  const msgs = document.createElement("section");
  const msg = document.createElement("div");
  const icon = document.createElement("span");
  const body = document.createElement("div");
  const title = document.createElement("h3");
  const desc = document.createElement("p");
  const close = document.createElement("button");
  close.type = "button";
  close.innerHTML = "&#x2715;";
  const iconName = hasProperty(opts, "icon", "");

  title.classList.add("msg-title");
  desc.classList.add("msg-desc");
  icon.classList.add("msg-icon", "bx", iconName);
  body.classList.add("msg-body");
  msg.classList.add("msg");
  msgs.classList.add("msgs");
  close.classList.add("msg-close");

  msg.appendChild(icon);
  body.appendChild(title);
  body.appendChild(desc);
  msg.appendChild(body);
  msg.appendChild(close);
  msgs.appendChild(msg);

  if (hasProperty(opts, "title", false)) {
    title.innerHTML = opts.title;
  } else {
    title.innerHTML = "None";
  }

  hasProperty(opts, "type", "") ? msg.classList.add("msg-" + opts.type) : "";
  hasProperty(opts, "icon", "")
    ? icon.classList.add(opts.icon)
    : icon.classList.add("bx-info-circle");

  if (hasProperty(opts, "desc", false)) {
    desc.innerHTML = opts.desc;
  }

  if (is_exists) {
    if (hasProperty(opts, "append", false)) {
      is_exists.appendChild(msg);
    } else {
      is_exists.innerHTML = "";
      is_exists.appendChild(msg);
    }
  } else {
    msgs.appendChild(msg);
    document.body.appendChild(msgs);
  }
  if (hasProperty(opts, "close", false)) {
    const time = hasProperty(opts, "duration", 5000);
    msg.style.animationDuration = time + "ms";
    setTimeout(() => msg.remove(), time);
  }
  close.addEventListener("click", function (e) {
    const target = e.target;
    const msg = target.closest(".msg");
    msg.remove();
  });
}

function timeAgo(timestamp, tag = true) {
  // Parse the input datetime string
  const inputTime = new Date(timestamp);
  // Get the current time
  const now = new Date();
  // Calculate the time difference in milliseconds
  const diff = now - inputTime;

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  let text = "";

  // Determine the appropriate time difference string
  if (diff < minute) {
    text = "just now";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    text = minutes > 1 ? `${minutes} mins ago` : "1 min ago";
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    text = hours > 1 ? `${hours} hrs ago` : "1 hr ago";
  } else if (diff < day * 2) {
    text = "yesterday";
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    text = days > 1 ? `${days} days ago` : "1 day ago";
  } else if (diff < week * 4) {
    const weeks = Math.floor(diff / week);
    text = weeks > 1 ? `${weeks} weeks ago` : "1 week ago";
  } else {
    // For more than 4 weeks ago, return the exact date
    text = inputTime.toISOString().split("T")[0];
  }

  if (tag) {
    return `<time class="datetime" title="${timestamp}" data-time-now="${timestamp}">${text}<time>`;
  } else {
    return text;
  }
}

function updateTimeAgo() {
  document.querySelectorAll("[data-time-now]").forEach((item) => {
    let time = item.getAttribute("data-time-now");
    item.innerText = timeAgo(time, false);
  });
}
setInterval(updateTimeAgo, 1000);
