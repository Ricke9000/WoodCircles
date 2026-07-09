document.addEventListener("DOMContentLoaded", async () => {
  const publicHostUrl =
    "https://raw.githubusercontent.com/Ricke9000/WoodCircles/refs/heads/main/demonstratorContent/";
  //const localHostUrl = "http://127.0.0.1:5500/demonstratorContent/";
  const configUrl = publicHostUrl + "config.json";

  async function loadConfigData() {
    const configData = await fetchJson(configUrl, "config");
    return configData;
  }

  async function fetchJson(url, errorLabel) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error(`There was a problem fetching ${errorLabel} JSON:`, error);
      return null;
    }
  }

  const demonstratorSection = document.querySelector(
    ".demonstrator, .demostrator",
  );

  if (!demonstratorSection) {
    return;
  }

  console.log("starting demonstrator script");
  const configData = await loadConfigData();
  console.log(configData);
  const modelUrl = configData?.stages[0]?.model || "";
  console.log(modelUrl);

  const iframe = document.createElement("iframe");
  iframe.src = modelUrl;
  iframe.height = "100%";
  iframe.width = "100%";
  iframe.title = "W3Schools Free Online Web Tutorials";

  const afterParagraph = demonstratorSection.querySelector("p:last-of-type");
  if (afterParagraph) {
    demonstratorSection.insertBefore(iframe, afterParagraph);
    return;
  }

  demonstratorSection.appendChild(iframe);
});
