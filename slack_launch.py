from electron_inject import inject

# for windows this will be something like "C:/ProgramData/F53/slack/app-4.27.154/slack.exe"
slack_location = "/usr/lib/slack/slack"
inject_location = "/home/f53/Projects/SlackMod/inject.js"

inject(slack_location, devtools=True, timeout=600, scripts=[inject_location])