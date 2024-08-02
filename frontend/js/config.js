const BASE_URL = "http://127.0.0.1:5001/api";

function setHTMXAttributes() {
  document
    .querySelectorAll("[hx-get], [hx-post], [hx-put], [hx-delete]")
    .forEach((el) => {
      if (el.hasAttribute("hx-get")) {
        const originalValue = el.getAttribute("hx-get");
        el.setAttribute("hx-get", `${BASE_URL}${originalValue}`);
        console.log(
          `Updated hx-get from: ${originalValue} to: ${el.getAttribute(
            "hx-get"
          )}`
        );
      }
      if (el.hasAttribute("hx-post")) {
        const originalValue = el.getAttribute("hx-post");
        el.setAttribute("hx-post", `${BASE_URL}${originalValue}`);
        console.log(
          `Updated hx-post from: ${originalValue} to: ${el.getAttribute(
            "hx-post"
          )}`
        );
      }
      if (el.hasAttribute("hx-put")) {
        const originalValue = el.getAttribute("hx-put");
        el.setAttribute("hx-put", `${BASE_URL}${originalValue}`);
        console.log(
          `Updated hx-put from: ${originalValue} to: ${el.getAttribute(
            "hx-put"
          )}`
        );
      }
      if (el.hasAttribute("hx-delete")) {
        const originalValue = el.getAttribute("hx-delete");
        el.setAttribute("hx-delete", `${BASE_URL}${originalValue}`);
        console.log(
          `Updated hx-delete from: ${originalValue} to: ${el.getAttribute(
            "hx-delete"
          )}`
        );
      }
    });
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("Config.js DOMContentLoaded event fired");
  setHTMXAttributes();
});
