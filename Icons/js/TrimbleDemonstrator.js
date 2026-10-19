/*******************************************************/
/**                                                   **/
/**                   Constants                       **/
/**                                                   **/
/*******************************************************/

// server path
//const host = "http://127.0.0.1:5500/demonstratorContent/";
const host =
  "https://raw.githubusercontent.com/Ricke9000/WoodCircles/refs/heads/main/demonstratorContent/";

const exampleModel =
  "https://3dwarehouse.sketchup.com/ar-view/0919b683-6140-466e-8ff7-29c510a68d80";

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

// Cookie that remembers the page should redirect instead of showing passports.
const redirectCookieName = "needRedirection";

// Cookie that remembers the current stage.
const stageCookieName = "stage";

// URL parameter key for redirection.
const redirectParamKey = "redirect";

// URL parameter key for stage.
const stageParamKey = "stage";

// Get URL parameters.
const urlParams = new URLSearchParams(window.location.search);

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
async function loadPassport(elementID, stage) {
  // fetch the element JSON file based on the element ID. TODO add a check to see if the element JSON is loaded before trying to access it
  console.log("loading element file for " + elementID);
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
async function loadDemonstrator(configData, stage) {
  const modelUrl = configData?.stages[stage]?.model || exampleModel;
  addModelviewertoSection(modelUrl, sectionclass);
}

/*******************************************************/
/**                                                   **/
/**                    Redirects                      **/
/**                                                   **/
/*******************************************************/

// Step 1 helper: store the redirect flag in a cookie so later visits keep redirecting.
function setNeedRedirectionCookie(path = "/") {
  document.cookie = `${redirectCookieName}=true; path=${path}`;
}

// Step 2 helper: read the redirect flag from the cookies. Returns the stored value or null.
function getNeedRedirectionCookie() {
  const cookiePrefix = `${redirectCookieName}=`;
  const cookieMatch = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(cookiePrefix));

  if (!cookieMatch) return null;
  return cookieMatch.substring(cookiePrefix.length);
}

// Step 1 helper: remove the redirect flag cookie so the page continues normally.
function removeNeedRedirectionCookie(path = "/") {
  document.cookie = `${redirectCookieName}=; Max-Age=0; path=${path}`;
}

// Step 4 helper: fetch the redirects section of the element JSON and return the URL for the stage.
async function getRedirectUrl(elementID, stage) {
  const elementUrl = host + elementID + ".json";
  const elementData = await fetchJson(elementUrl, elementID);
  const redirect = elementData?.["redirects"]?.[stage];
  return redirect?.url || null;
}

// Decide between redirecting and showing the passport for a given element ID.
async function setRedirectCookies(redirectParam) {
  console.log("redirect parameter is " + redirectParam);
  if (redirectParam === "true") {
    setNeedRedirectionCookie();
    console.log("setNeedRedirectionCookie called");
  } else if (redirectParam === "false") {
    removeNeedRedirectionCookie();
    console.log("removeNeedRedirectionCookie called");
  }
}

async function redirect(elementID, stage) {
  const redirectUrl = await getRedirectUrl(elementID, stage);

  if (redirectUrl) {
    window.location.href = redirectUrl;
    return;
  }
}

/*******************************************************/
/**                                                   **/
/**            stage cookie management                **/
/**                                                   **/
/*******************************************************/

// Step 1 helper: store the redirect flag in a cookie so later visits keep redirecting.
function setStageCookie(cookievalue) {
  console.log("setting stage cookie to " + cookievalue);
  //document.cookie = `${stageCookieName}=${cookievalue}; path="/";`;
  const path = "/";
  document.cookie = `${stageCookieName}=${cookievalue}; path=/;`;
}

// Step 2 helper: read the redirect flag from the cookies. Returns the stored value or null.
function getStageCookie() {
  const cookiePrefix = `${stageCookieName}=`;
  const cookieMatch = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(cookiePrefix));

  if (!cookieMatch) return null;
  return cookieMatch.substring(cookiePrefix.length);
}

// Step 1 helper: remove the redirect flag cookie so the page continues normally.
function removeStageCookie(path = "/") {
  document.cookie = `${stageCookieName}=; Max-Age=0; path=${path}`;
}

/*******************************************************/
/**                                                   **/
/**       Document manipulator (entry point)          **/
/**                                                   **/
/*******************************************************/

// Visualization of the digital passport based on the element JSONs.
document.addEventListener("DOMContentLoaded", async () => {
  // Get configuration file to determine the stage and other settings.
  console.log("Loading Trimble Demonstrator configuration file...");
  let configData = await fetchJson(host + "config.json", "config");
  if (!configData) {
    console.error(
      "Config data could not be loaded. Using example file instead.",
    );
  }

  //Check if the user manually set the need to redirect URL parameter.
  const redirectParam = urlParams.get(redirectParamKey);
  if (redirectParam !== null) {
    await setRedirectCookies(redirectParam);
  }

  //Check if the user manually set the stage URL parameter.
  const stageParam = urlParams.get(stageParamKey);
  if (stageParam !== null) {
    if (stageParam === "false") {
      removeStageCookie();
    } else {
      setStageCookie(stageParam);
    }
  }

  //Read the stage from the cookie or configuration if not set manually.
  const cookieStage = parseInt(getStageCookie(), 10);
  const stage = !isNaN(cookieStage)
    ? cookieStage
    : configData.stage != null
      ? configData.stage
      : 0;

  //Check of an element ID is provided in the URL parameters. If not, we will display the current building 3d model.
  const elementID = urlParams.get("id");

  // Decide what to load based on the presence of an element ID and redirection needs.
  if (!elementID) {
    console.log("Loading main demonstrator for stage " + stage);
    await loadDemonstrator(configData, stage);
  } else if (getNeedRedirectionCookie() === "true" || configData?.phase === 1) {
    console.log("Redirecting page for element " + elementID);
    await redirect(elementID, stage);
  } else {
    console.log("load passport for element " + elementID);
    await loadPassport(elementID, stage);
  }
});
