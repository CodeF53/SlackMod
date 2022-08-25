# SlackMod
Adds a custom CSS menu to slack

## About:
A very work in progress client mod for slack.

Currently adds one thing, a very barebones Custom CSS tab to the preferences menu.
![](https://i.imgur.com/fxn3Pg9.png)
It isn't recommended to use this because it doesn't persist saves through restarts.

For more detail see [my blog post on making this](https://dev.to/f53/adding-a-custom-css-menu-to-slack-1090)

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