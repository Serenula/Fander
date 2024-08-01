const BASE_URL = "http://127.0.0.1:5001/api";

function setHTMXAttributes() {
  document
    .querySelectorAll("[hx-get], [hx-post], [hx-put], [hx-delete]")
    .forEach((el) => {
      if (el.hasAttribute("hx-get")) {
        el.setAttribute("hx-get", `${BASE_URL}${el.getAttribute("hx-get")}`);
      }
      if (el.hasAttribute("hx-post")) {
        el.setAttribute("hx-post", `${BASE_URL}${el.getAttribute("hx-post")}`);
      }
      if (el.hasAttribute("hx-put")) {
        el.setAttribute("hx-put", `${BASE_URL}${el.getAttribute("hx-put")}`);
      }
      if (el.hasAttribute("hx-delete")) {
        el.setAttribute(
          "hx-delete",
          `${BASE_URL}${el.getAttribute("hx-delete")}`
        );
      }
    });
}

document.addEventListener("DOMContentLoaded", setHTMXAttributes);
