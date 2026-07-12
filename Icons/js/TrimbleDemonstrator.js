/*******************************************************/
/**                                                   **/
/**               General functions                   **/
/**                                                   **/
/*******************************************************/

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

// server path
const host = "http://127.0.0.1:5500/demonstratorContent/";

// example json
const exampleConfig = {
  phase: 0,
  stage: 0,
  stages: [
    {
      id: 0,
      name: "Tartu",
      "building-id": "Tartu001",
      startdate: "2026-07-01T00:00:00Z",
      model:
        "https://3dwarehouse.sketchup.com/ar-view/0919b683-6140-466e-8ff7-29c510a68d80",
    },
  ],
};

const examplePassport = {
  id: "05WA_P21",
  "lifecycle-data": [
    {
      id: 0,
      date: "2026-07-01T00:00:00Z",
      data: [
        {
          psets: [
            {
              id: 0,
              psetname: "Object",
              data: [
                { "building-id": "Tartu001" },
                {
                  "dpp.permalink":
                    "https://woodcircles.eu/demonstrator/?id=05WA_P21",
                },
              ],
            },
            { id: 1, psetname: "DFAD", data: [{ hazardscore: 0 }] },
            {
              id: 2,
              psetname: "LCC",
              data: [
                { co2e: 500 },
                { "allocation-method": "Distributed" },
                { "allocation-units": "years" },
              ],
            },
            {
              id: 3,
              psetname: "STORAENSO",
              data: [
                { "clt-material": "CLT 100 IBI L5S WW C24 SAN" },
                { "clt-length": 2295 },
                { "clt-width": 100 },
                { "clt-thickness": 600 },
                { "clt-weight": 53 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/*******************************************************/
/**                                                   **/
/**   Sketchup Iframe in woodcircles demonstrator     **/
/**                                                   **/
/*******************************************************/

// Visualization of the building models based on the configuration JSON.
document.addEventListener("DOMContentLoaded", async () => {
  // Check if the demonstrator section exists before proceeding
  const demonstratorSection = document.querySelector(
    ".demonstrator, .demostrator",
  );

  if (!demonstratorSection) {
    return;
  }

  //
  const configData = await fetchJson(host + "config.json", "config");
  if (!configData) {
    configData = exampleConfig; // Fallback to example config if fetch fails
    console.error("Config data could not be loaded.");
  }

  //
  const stage = configData?.stage ?? 0;
  const modelUrl = configData?.stages[stage]?.model || "";

  //
  const iframe = document.createElement("iframe");
  iframe.src = modelUrl;
  iframe.height = "100%";
  iframe.width = "100%";
  iframe.style.display = "block";
  iframe.style.border = "0";
  iframe.title = "W3Schools Free Online Web Tutorials";

  //
  const afterParagraph = demonstratorSection.querySelector("p:last-of-type");
  if (afterParagraph) {
    demonstratorSection.insertBefore(iframe, afterParagraph);
    return;
  }

  //
  demonstratorSection.appendChild(iframe);
});

/*******************************************************/
/**                                                   **/
/**         Digital element passport example          **/
/**                                                   **/
/*******************************************************/

//
function getProperty(key, value) {
  const elementHtml =
    `                <div class="pset-rowandicon-group">` +
    `                  <div data-cy="properties-panel__pset-row-guid" class="pset-row">` +
    `                    <div class="pset-row-name text-meta row-distribute" data-cy="pset-row-name">` +
    `                      <small>${key}</small>` +
    `                    </div>` +
    `                    <div data-cy="properties-panel__pset-row__value-link-5196516516" class="pset-row-value">` +
    `                      ${value}` +
    `                    </div>` +
    `                  </div>` +
    `                </div>`;
  return elementHtml;
}

//
function getAllPropertiesHtml(list) {
  const propertiesHtml = list
    .map((item) => {
      const [key, value] = Object.entries(item)[0];
      return getProperty(key, value);
    })
    .join("");
  return propertiesHtml;
}

//
function getPropertySetHTML(pSetKey, list) {
  const propertiesHtml = getAllPropertiesHtml(list);

  const psetIndexSectionElement =
    `<div class="pset-separator"></div>` +
    `<section class="pset-propsection-group">` +
    `                <div class="sibling-collapser expanded"></div>` +
    propertiesHtml +
    `              </section>`;

  const psetInnerhtml =
    `              <div class="pset-name-group sibling-collapser expanded" data-cy="properties-panel__pset-group-name-group">` +
    `                <span data-cy="properties-panel__pset-group-name" class="h5" style="cursor: pointer">${pSetKey}</span>` +
    `                <div class="tooltip-wrapper">` +
    `                  <div class="tooltip-wrapper__children">` +
    `                    <div class="tooltip-wrapper">` +
    `                      <div class="tooltip-wrapper__children">` +
    `                        <button data-cy="properties-panel__edit-button" class="enable-pointer-events button icon-circle icon-medium tertiary"></button>` +
    `                      </div>` +
    `                    </div>` +
    `                  </div>` +
    `                </div>` +
    `                <button data-cy="properties-panel__pset-group-collapser-button" data-id="collapser-button" class="button icon-circle icon-medium tertiary">` +
    `                  <span class="trimble-icon icon-font tc-icon-chevron-up"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>` +
    `                </button>` +
    `              </div>` +
    psetIndexSectionElement;

  const psetIndexSection = document.createElement("section");
  psetIndexSection.className = "pset-group";
  psetIndexSection.setAttribute("data-cy", "pset-group");
  psetIndexSection.innerHTML = psetInnerhtml;
  return psetIndexSection;
}

// Visualization of the digital passport based on the element JSONs.
document.addEventListener("DOMContentLoaded", async () => {
  //set element identifier.
  const urlParams = new URLSearchParams(window.location.search);
  const elementID = urlParams.get("id") || "05WA_P21";
  console.log("id is " + elementID);

  //
  let stage = urlParams.get("stage") || null;

  // get the stage from the config data. TODO add a check to see if the config data is loaded before trying to access it
  const configData = await fetchJson(host + "config.json", "config");
  if (!configData) {
    configData = exampleConfig; // Fallback to example config if fetch fails
    stage = 0;
    console.error("Config data could not be loaded.");
  } else {
    const backupStage = configData?.stage ?? 0;
    stage = stage ?? backupStage;
  }

  // fetch the element JSON file based on the element ID. TODO add a check to see if the element JSON is loaded before trying to access it
  console.log("loading element file");
  const elementUrl = host + elementID + ".json";
  const elementData =
    (await fetchJson(elementUrl, elementID)) ?? examplePassport;
  console.log(elementData);

  // Start setting properties
  document.getElementById("passport-id").innerHTML = elementID;

  // get element data for the current stage and set it in the properties panel.
  const elementPassport = elementData?.["lifecycle-data"]?.[stage] || "";
  console.log(elementPassport);

  // first part for index section, which is the element ID and timestamp
  const psetIndexSectionElement =
    `              <section class="pset-propsection-group">` +
    `                <div class="sibling-collapser expanded"></div>` +
    getProperty("index", elementPassport.id) +
    getProperty("timestamp", elementPassport.date) +
    `              </section>`;

  const psetIndexSection = document.createElement("section");
  psetIndexSection.className = "pset-group";
  psetIndexSection.setAttribute("data-cy", "pset-group");
  psetIndexSection.innerHTML = psetIndexSectionElement;

  //
  const psetPanelMiddleSection = document.querySelector(
    ".pset-panel-middle, .pset-panel-middle",
  );

  if (!psetPanelMiddleSection) {
    return;
  }

  psetPanelMiddleSection.appendChild(psetIndexSection);

  // after the other pset are added.
  let propertysetList = elementPassport?.data?.[0]?.psets ?? null;
  console.log("propertysetList: " + JSON.stringify(propertysetList));

  // Normalize propertysetList to an array so it's safe to iterate
  if (!propertysetList) {
    console.warn("No propertysetList found for stage:", stage);
    propertysetList = [];
  } else if (!Array.isArray(propertysetList)) {
    // If it's a single object, wrap it; otherwise fall back to empty array
    if (typeof propertysetList === "object") {
      propertysetList = [propertysetList];
    } else {
      console.warn("propertysetList is not an array or object, coercing to []");
      propertysetList = [];
    }
  }

  for (const pset of propertysetList) {
    console.log("pset: " + JSON.stringify(pset));
    psetPanelMiddleSection.appendChild(
      getPropertySetHTML(pset?.psetname, pset?.data),
    );
  }
});
