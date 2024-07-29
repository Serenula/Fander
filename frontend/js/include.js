function includeHTML() {
  let elements = document.querySelectorAll("[data-include-html]");
  elements.forEach(async (element) => {
    let file = element.getAttribute("data-include-html");
    try {
      let response = await fetch(file);
      if (!response.ok) throw new Error("Network response was not ok");
      let data = await response.text();
      element.innerHTML = data;
      element.removeAttribute("data-include-html");

      // If there are nested includes
      includeHTML();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      element.innerHTML = "Content could not be loaded.";
    }
  });
}
