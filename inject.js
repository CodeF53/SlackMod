if (document != undefined) {

// make a new style element for our custom CSS
let styleSheet = document.createElement("style")
// set default contents of Custom CSS
styleSheet.innerText = `/*Write Custom CSS here!*//* Improve Legibility of Custom CSS Area */.p-prefs_dialog__panel textarea {    font-family: Monaco, Menlo, Consolas, CourierNew, monospace!important;    font-size: 12px;    /* Make editor fill Preferences panel */    width: 100%;     height: calc(100% - 0.5rem);    /* disable text wrapping */    white-space: nowrap;    /* make background of editor darker */    background-color: #1c1c1c;}/* Increase width of Preferences to allow for more code width */body > div.c-sk-modal_portal > div > div {    max-width: 100%!important;}`
// give it an id to make it easier to query
// the document for this stylesheet later
styleSheet.id = "SlackMod-Custom-CSS"
// add to head
document.head.appendChild(styleSheet)

// method to quickly change css
const updateCustomCSS = newCSS => { document.querySelector("#SlackMod-Custom-CSS").innerText = newCSS; }
// method to quickly get inner css
const getCustomCSS = () => { return document.querySelector("#SlackMod-Custom-CSS").innerText}

// has bug
// select custom css, select any other tab => error thrown
function addSettingsTab() {
    const settingsTabList = document.querySelector(".p-prefs_dialog__menu")

    // Make the button
    customTab = document.createElement("button")
    customTab.innerHTML = `<span>Custom CSS</span>`
    customTab.classList = "c-button-unstyled c-tabs__tab js-tab c-tabs__tab--full_width"

    customTab.addEventListener("click", ()=>{
        const activeClass = "c-tabs__tab--active"
        // visually deselect old tab by removing class
        let activeTab = settingsTabList.querySelector("."+activeClass)
        activeTab.classList = activeTab.classList.toString().replace(activeClass+" ", "")
        // visually select new tab by adding class
        customTab.classList = customTab.classList.toString() + " " + activeClass

        // a big proper editor
        let cssEditor = document.createElement("textarea")
        cssEditor.setAttribute("rows", "33")
        cssEditor.setAttribute("cols", "60")
        // set content from current CSS
        cssEditor.value = getCustomCSS()
        // on new chars added
        cssEditor.addEventListener("input", ()=>{
            // update current CSS
            updateCustomCSS(cssEditor.value)
        })
        
        // make pressing tab add indent
        cssEditor.addEventListener("keydown", (event) => {
            if (event.code == "Tab") {
                event.preventDefault();

            }
        })

        // add editor to settings content pane
        document.querySelector(".p-prefs_dialog__panel").replaceChildren(cssEditor)
    })

    settingsTabList.appendChild(customTab)
}

document.addEventListener("click", (event) => {
    let element = event.target 
    if (element.classList[0]=="c-menu_item__label" && element.innerHTML == "Preferences") {
        setTimeout(function () {
            if (document.querySelector(".p-prefs_dialog__menu") != null) {
                addSettingsTab()
            }
        }, 500);
    }
})
}