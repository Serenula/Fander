// include.js

async function includeHTML() {
  const elements = document.querySelectorAll("[data-include-html]");
  for (const element of elements) {
    const file = element.getAttribute("data-include-html");
    console.log(`Fetching file: ${file}`);
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.text();
      const base = new URL(file, window.location.origin).pathname.replace(
        /\/[^/]*$/,
        ""
      ); // Removing trailing segment
      const adjustedData = data.replace(
        /(href|src)=["'](?!http)([^"']+)["']/g,
        (match, attr, path) => {
          return `${attr}="${base}/${path}"`; // Ensure only one slash
        }
      );
      element.innerHTML = adjustedData;
      element.removeAttribute("data-include-html");
      // Re-run includeHTML to handle nested includes
      includeHTML();
    } catch (error) {
      console.error(`Error including HTML from ${file}:`, error);
      element.innerHTML = "Content could not be loaded.";
    }
  }
}

// Call the function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", includeHTML);
