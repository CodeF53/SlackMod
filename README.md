# SlackMod
Adds a custom CSS menu to slack

## About:
A very work in progress client mod for slack.

Currently adds a Custom CSS menu:
![Slack Preferences Screen with CSS tab selected with a fair bit of code written in the editor](https://i.imgur.com/UUxtgQj.png)

For more detail see these blog posts of mine: 
- [initial creation of this project](https://dev.to/f53/adding-a-custom-css-menu-to-slack-1090)
- [improving the editor]

## Why?
Discord has a lot of mods to help customize and improve it. 

Slack is basically Discord but worse and targeted at professionals instead of gamers.

If Slack is worse, why isn't there any mods for it?

## Usage
0. Make sure you have the project's dependencies: Python 3, [Electron Inject](https://github.com/tintinweb/electron-inject)
1. Edit `slack-launch.py` to point to your respective slack executable and `inject.js`
    - Windows users should note that a slack executable stored in something like this: `/slack/slack.exe` is wrong, it should be something like  `slack/app-4.27.154/slack.exe`
2. Make sure slack is fully closed
3. Run `slack-launch.py`