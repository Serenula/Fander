function includeHTML() {
  let elements = document.querySelectorAll("[data-include-html]");
  elements.forEach((element) => {
    let file = element.getAttribute("data-include-html");
    fetch(file)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text();
      })
      .then((data) => {
        element.innerHTML = data;
        element.removeAttribute("data-include-html");
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  });
}
