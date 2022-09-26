if (document != undefined) {

const clickNodeBySelector = (selector) => document.querySelector(selector).dispatchEvent(new Event("click", {bubbles:true}))

function tryTillTrue(expression, callback, timeout = 1) {
    setTimeout(()=>{
        if (expression()) { callback() }
        else { tryTillTrue(expression,callback)}
    }, timeout)
}

// make a new style element for our custom CSS
let styleSheet = document.createElement("style")
if (window.localStorage.getItem("slackMod-CSS") == null) { // use default CSS
    window.localStorage.setItem("slackMod-CSS", "/*Write Custom CSS here!*/\n")
} else { // get saved CSS
    styleSheet.innerText = window.localStorage.getItem("slackMod-CSS")
}
styleSheet.id = "SlackMod-Custom-CSS"
document.head.appendChild(styleSheet)

// method to quickly change css
const updateCustomCSS = newCSS => {
    window.localStorage.setItem("slackMod-CSS", newCSS); // update in storage
    // update currently applied CSS
    document.querySelector("#SlackMod-Custom-CSS").innerHTML = ""
    document.querySelector("#SlackMod-Custom-CSS").appendChild(document.createTextNode(newCSS));
}
// method to quickly get inner css
const getCustomCSS = () => { return window.localStorage.getItem("slackMod-CSS") }

// has bug
// select custom css, select any other tab => error thrown
function addSettingsTab() {
    tryTillTrue(()=>document.querySelector(".p-prefs_dialog__menu") !== null, ()=>{
        // Make the button
        customTab = document.createElement("button")
        // Proper Label and Icon
        customTab.innerHTML =
            `<div class="c-tabs__tab_icon--left" data-qa="tabs_item_render_icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <span>Custom CSS</span>`
        customTab.classList = "c-button-unstyled c-tabs__tab js-tab c-tabs__tab--full_width"
        customTab.id = "custom_css"

        // get settings tab container
        let settingsTabList = document.querySelector(".p-prefs_dialog__menu")
        // add our tab
        settingsTabList.appendChild(customTab)

        // make clicking our custom tab "open" it
        customTab.addEventListener("click", (event)=>{
            const activeClass = "c-tabs__tab--active"
            // visually deselect old tab by removing class
            let activeTab = settingsTabList.querySelector("."+activeClass)
            activeTab.classList = activeTab.classList.toString().replace(activeClass+" ", "")
            // visually select new tab by adding class
            customTab.classList = customTab.classList.toString() + " " + activeClass;

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
            session.on('change', () => { updateCustomCSS(session.getValue()); });

            // hardcoded styling for CSS Tab:
            // increase width and height of preferences modal for more code room
            ["max-width","width","max-height","height"].forEach(
                style => document.querySelector(`div[aria-label="Preferences"]`).style[style] = "100%")
            // smoothly expand preferences modal
            document.querySelector(`div[aria-label="Preferences"]`).style["transition"] = "500ms ease all"
            // make editor resize editor every 5ms for 500ms
            // smoothly expanding it with the preferences modal
            for (let i = 5; i<=500; i+=5) {
                setTimeout(()=>{editor.resize()}, i);
            }

            // replace tab click events with our own click event for switching tabs
            ([...settingsTabList.children]).map((tab)=>{
                // remove old click event listeners
                tab.parentElement.replaceChild(tab.cloneNode(true), tab)
                // add our own click event
                const tabID = tab.id
                document.getElementById(tabID).addEventListener("click", (event)=>{
                    if (event.isTrusted) {
                        // close the preferences screen
                        clickNodeBySelector(`[aria-label="Close"]`)
                        // re-open the preferences window
                        clickNodeBySelector(".p-ia__nav__user__button")
                        clickNodeBySelector("div.ReactModalPortal div:nth-child(7) div")
                        // go to the tab that was clicked
                        tryTillTrue(()=>document.querySelector("#"+tabID) !== null,
                            ()=>clickNodeBySelector("#"+tabID), 0.025)
                        // add back the custom css tab
                        addSettingsTab()

                        // make it smoothly shrink back to normal window size
                        setTimeout(()=>{
                            ["max-width","width","max-height","height"].forEach(
                                style => document.querySelector(`div[aria-label="Preferences"]`).style[style] = "100%")

                            setTimeout(()=>{
                                document.querySelector(`div[aria-label="Preferences"]`).style["transition"] = "500ms ease all"
                                document.querySelector(`div[aria-label="Preferences"]`).style["height"]="700px"
                                document.querySelector(`div[aria-label="Preferences"]`).style["width"]="800px"
                            },0.025)
                        },0.025)
                    }
                })
            })
        })
    })
}

document.addEventListener("click", (event) => {
    let element = event.target
    if (element.classList[0]=="c-menu_item__label" && element.innerHTML == "Preferences" && event.isTrusted) {
        addSettingsTab()
    }
})

document.addEventListener("keyup", ({ code, ctrlKey, shiftKey, metaKey, altKey }) => {
    if (code === "F12" || (ctrlKey && shiftKey && code === "KeyI") || (metaKey && altKey && code === "KeyI")) {
        // save contents of chat editor
        let oldText = document.querySelector(".ql-editor").innerText
        // type and send slackdevtools command
        document.querySelector(".ql-editor").innerText = "/slackdevtools"
        setTimeout(()=>{clickNodeBySelector(`[aria-label="Send now"]`)}, 1)
        // restore old contents of chat editor
        setTimeout(()=>{document.querySelector(".ql-editor").innerText = oldText}, 100)
    }
});
}