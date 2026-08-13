/*******************************************************/
/**                                                   **/
/**                   Constants                       **/
/**                                                   **/
/*******************************************************/

// server path
//const host = "http://127.0.0.1:5500/demonstratorContent/";
const host =
  "https://raw.githubusercontent.com/Ricke9000/WoodCircles/refs/heads/main/demonstratorContent/";

// example Config JSON
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

// example Passport JSON
const examplePassport = {
  id: "C07",
  image:
    "https://3dwarehouse.sketchup.com/ar-view/e850ce97-e89b-4160-ba08-9add198214fc",
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
                    "https://woodcircles.eu/demonstrator/?id=C07",
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

// Class name of the section is "demostrator" in the HTML file, Not "demonstrator".
// TODO: update the HTML file to correct the typo in the class name to "demonstrator" for consistency.
const sectionclass = "demostrator";

/*******************************************************/
/**                                                   **/
/**               General functions                   **/
/**                                                   **/
/*******************************************************/

// Fetch JSON data from a given URL and handle errors.
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

/*******************************************************/
/**                                                   **/
/**               Element Manipulation                **/
/**                                                   **/
/*******************************************************/

//
function addModelviewertoSection(modelURL, sectionClass) {
  const section = document.querySelector(`.${sectionClass}`);
  if (!section) return;

  const iframe = document.createElement("iframe");
  iframe.src = modelURL;
  iframe.height = "100%";
  iframe.width = "100%";
  iframe.style.display = "block";
  iframe.style.border = "0";
  iframe.title = "Trimble Demonstrator";

  const afterParagraph = section.querySelector("p:last-of-type");
  if (afterParagraph) {
    section.insertBefore(iframe, afterParagraph);
    return;
  }

  section.appendChild(iframe);
}

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

// first element to add to make the passport workspace
function addTrimbleWorkSpaceToSection(elementID, warehouseURL) {
  const trimbleWorkspaceStyleHtml =
    `<style>` +
    `  .trimble-workspace { height: 100%; display: flex; justify-content: center; }` +
    `  .trimble-workspace .panel-wrapper { width: 19rem; max-width: 100%; background: #fff; border-radius: 0.12rem; box-shadow: 0 0 0.06rem rgba(54, 53, 69, 0.2), 0.12rem 0.12rem 0.5rem rgba(54, 53, 69, 0.3); display: flex; flex-direction: column; height: 100%; overflow: hidden; position: relative; }` +
    `  .trimble-workspace .trimble-workspace-details-content { bottom: 0; display: flex; flex-direction: column; height: 100%; left: 0; overflow-y: auto; position: absolute; right: 0; top: 0; }` +
    `  .trimble-warehouse-iframe { width: 100%; height: 100%; display: block; border: 0; }` +
    `</style>` +
    `<link href="./css/trimblepassport.css" rel="stylesheet" />`;

  const warehouseIframeHtml =
    `<iframe` +
    `  class="trimble-warehouse-iframe"` +
    `  src="${warehouseURL}"` +
    `  title="Trimble Demonstrator">` +
    ` </iframe>`;

  const trimbleWorkspaceHtml =
    ` ${trimbleWorkspaceStyleHtml} ` +
    `<div class="trimble-workspace">` +
    `  <div class="panel-wrapper">` +
    `    <div class="trimble-workspace-details-content" data-cy="property-panel">` +
    `      <!-- TOOLBAR -->` +
    `      <div class="pset-toolbar-area">` +
    `        <div class="title-row">` +
    `          <div class="title">` +
    `            <span id="passport-id" class="h3">${elementID}</span>` +
    `          </div>` +
    `        </div>` +
    `      </div>` +
    `         <!-- PANEL MIDDLE -->` +
    `         <div class="pset-panel-middle" data-cy="pset-panel-middle">` +
    ` ${warehouseIframeHtml} ` +
    `           <!-- Collapse-all toolbar row -->` +
    `           <section class="pset-collapse-all-group pset-skip_next_separator">` +
    `             <div class="pset-separator"></div>` +
    `             <section class="pset-favorite-or-not-text">` +
    `               <span class="h6 text-muted">Properties</span>` +
    `             </section>` +
    `           </section>` +
    `           <div class="pset-separator"></div>` +
    `         </div>` +
    `         <!-- end pset-panel-middle -->` +
    `       </div>` +
    `       <!-- end trimble-workspace-details-content -->` +
    `     </div>` +
    `     <!-- end panel-wrapper -->` +
    `   </div>` +
    `   <!-- end trimble-workspace -->`;

  const section = document.querySelector(`.demostrator`);
  section.innerHTML = trimbleWorkspaceHtml;
  console.log("Trimble workspace added to section");
}

// Load the digital passport for a given element ID.
async function loadPassport(elementID) {
  // check in which stage we are in, based on the URL parameter or the config data.
  const securlParams = new URLSearchParams(window.location.search);
  let stage = securlParams.get("stage") || null;

  if (!stage) {
    // get the stage from the config data. TODO add a check to see if the config data is loaded before trying to access it
    console.log("Loading config data to get stage");
    let configData = await fetchJson(host + "config.json", "config");
    if (!configData) {
      configData = exampleConfig; // Fallback to example config if fetch fails
      stage = 0;
      console.error("Config data could not be loaded.");
    } else {
      const backupStage = configData?.stage ?? 0;
      stage = stage ?? backupStage;
    }
  }
  console.log("stage is " + stage);

  // fetch the element JSON file based on the element ID. TODO add a check to see if the element JSON is loaded before trying to access it
  console.log("loading element file");
  const elementUrl = host + elementID + ".json";
  const elementData =
    (await fetchJson(elementUrl, elementID)) ?? examplePassport;

  // get element data for the current stage and set it in the properties panel.
  const warehouseURL = elementData?.["image"] || examplePassport?.["image"];
  console.log("3d warehouse URL: " + warehouseURL);

  // add the trimble workspace to the section for the passport viewer
  addTrimbleWorkSpaceToSection(elementID, warehouseURL);

  // get element data for the current stage and set it in the properties panel.
  const elementPassport = elementData?.["lifecycle-data"]?.[stage] || "";

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
}

/*******************************************************/
/**                                                   **/
/**   Sketchup Iframe in woodcircles demonstrator     **/
/**                                                   **/
/*******************************************************/

// Visualization of the building models based on the configuration JSON.
async function loadDemonstrator() {
  const configData = await fetchJson(host + "config.json", "config");
  if (!configData) {
    configData = exampleConfig; // Fallback to example config if fetch fails
    console.error("Config data could not be loaded.");
  }

  const stage = configData?.stage ?? 0;
  const modelUrl = configData?.stages[stage]?.model || "";
  addModelviewertoSection(modelUrl, sectionclass);
}

/*******************************************************/
/**                                                   **/
/**       Document manipulator (entry point)          **/
/**                                                   **/
/*******************************************************/

// Visualization of the digital passport based on the element JSONs.
document.addEventListener("DOMContentLoaded", async () => {
  //First we check of an element ID is provided in the URL parameters. If not, we will display the current building 3d model.
  const urlParams = new URLSearchParams(window.location.search);
  const elementID = urlParams.get("id");
  if (!elementID) {
    await loadDemonstrator();
  } else {
    console.log("id is " + elementID);
    await loadPassport(elementID);
  }
});
