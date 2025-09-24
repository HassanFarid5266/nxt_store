// Message utility functions
import { hasProperty } from './api.js'

export function $msg(opts) {
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

export function showMessage(message, type = 'info') {
  const iconMap = {
    success: 'bx-check-circle',
    error: 'bx-x-circle',
    warning: 'bx-error-circle',
    info: 'bx-info-circle'
  };

  $msg({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    desc: message,
    type: type,
    icon: iconMap[type] || iconMap.info,
    close: true,
    duration: 4000
  });
}

export function timeAgo(timestamp, tag = true) {
  const inputTime = new Date(timestamp);
  const now = new Date();
  const diff = now - inputTime;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  let text = "";

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
    text = inputTime.toISOString().split("T")[0];
  }

  if (tag) {
    return `<time class="datetime" title="${timestamp}" data-time-now="${timestamp}">${text}<time>`;
  } else {
    return text;
  }
}
