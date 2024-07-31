async function includeHTML() {
  let elements = document.querySelectorAll("[data-include-html]");
  for (const element of elements) {
    let file = element.getAttribute("data-include-html");
    console.log("Fetching file:", file); // Debugging statement
    try {
      let response = await fetch(file);
      if (!response.ok) throw new Error("Network response was not ok");
      let data = await response.text();
      console.log("Fetched content:", data); // Debugging statement
      element.innerHTML = data;
      element.removeAttribute("data-include-html");

      // Recursively include nested HTML
      await includeHTML();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      element.innerHTML = "Content could not be loaded.";
    }
  }
}
