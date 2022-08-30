if (document != undefined) {

// make a new style element for our custom CSS
let styleSheet = document.createElement("style")
if (window.localStorage.getItem("slackMod-CSS") == null) {
    // use default CSS
    styleSheet.innerText = "/*Write Custom CSS here!*/"
    window.localStorage.setItem("slackMod-CSS", "/*Write Custom CSS here!*/")
} else {
    // get saved CSS
    styleSheet.innerText = window.localStorage.getItem("slackMod-CSS")
}
// give it an id to make it easier to query
// the document for this stylesheet later
styleSheet.id = "SlackMod-Custom-CSS"
// add to head
document.head.appendChild(styleSheet)

// method to quickly change css
const updateCustomCSS = newCSS => { 
    // update in storage
    window.localStorage.setItem("slackMod-CSS", newCSS);
    // update currently applied CSS
    document.querySelector("#SlackMod-Custom-CSS").innerHTML = "" 
    document.querySelector("#SlackMod-Custom-CSS").appendChild(document.createTextNode(newCSS)); 
}
// method to quickly get inner css
const getCustomCSS = () => { 
    // not sure which is better
    // return document.querySelector("#SlackMod-Custom-CSS").innerHTML
    return window.localStorage.getItem("slackMod-CSS")
}

// has bug
// select custom css, select any other tab => error thrown
function addSettingsTab() {
    const settingsTabList = document.querySelector(".p-prefs_dialog__menu")

    // Make the button
    customTab = document.createElement("button")
    // Proper Label and Icon
    customTab.innerHTML = 
        `<div class="c-tabs__tab_icon--left" data-qa="tabs_item_render_icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>
        <span>Custom CSS</span>`
    customTab.classList = "c-button-unstyled c-tabs__tab js-tab c-tabs__tab--full_width"

    customTab.addEventListener("click", ()=>{
        // increase width of window for more code room
        document.querySelector(`div[aria-label="Preferences"]`).style["max-width"] = "none";
        document.querySelector(`div[aria-label="Preferences"]`).style["width"] = "100%";

        const activeClass = "c-tabs__tab--active"
        // visually deselect old tab by removing class
        let activeTab = settingsTabList.querySelector("."+activeClass)
        activeTab.classList = activeTab.classList.toString().replace(activeClass+" ", "")
        // visually select new tab by adding class
        customTab.classList = customTab.classList.toString() + " " + activeClass

        /* Based on GooseMod CustomCSS, which is under the MIT License
        https://github.com/GooseMod-Modules/CustomCSS/blob/64969856598a2cc2980988046e0ff266d64fa943/index.js#L35-L65 */
        // add div for ace to be in
        const cssEditor = document.createElement('div');
        // give it an id so ace can see it
        cssEditor.id = 'slackMod-editor';
        // size it to user's window
        cssEditor.style.width = "100%";
        cssEditor.style.height = "calc(100% - 0.5rem)";
        // set its default value
        cssEditor.innerHTML = getCustomCSS();

        // add editor to settings content pane
        document.querySelector(".p-prefs_dialog__panel").replaceChildren(cssEditor)

        // point ace to the id we gave our div
        const editor = ace.edit('slackMod-editor');
        const session = editor.getSession();
        // configure syntax highlighting, theme
        session.setMode('ace/mode/css'); // Set lang to CSS
        editor.setTheme('ace/theme/dracula'); // Set theme to Dracula
        // when we change the content of it, update css
        session.on('change', () => {
            updateCustomCSS(session.getValue());
        });
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
        }, 50);
    }
})
}