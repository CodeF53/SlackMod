from ensurepip import version
from electron_inject import inject
from wget import download
from os import rename, getcwd, makedirs
from os import name as osname
from os.path import expanduser
from os.path import exists
import os

# by default have correct install path for linux
slack_location = "/usr/lib/slack/slack"
# if system is windows
if (osname == "nt"):
    # %appdata% location of slack
    slack_location = os.getenv('LOCALAPPDATA') + "\\" + "slack"
    # check if slack is installed
    if (exists(slack_location)):
        # get latest slack version
        # by iterating through all subdirectorys
        # and getting the one with the newest slack.exe
        latestCreatedTime = 0
        biggestVersionName = ""
        for subdir in next(os.walk(slack_location))[1]:
            # filter out non "app-version" dirs
            if ("app-" in subdir):
                createdTime = os.stat(slack_location+"\\slack.exe").st_ctime
                if (createdTime>latestCreatedTime):
                    latestCreatedTime = createdTime
                    biggestVersionName = subdir
        slack_location = slack_location + "\\" + biggestVersionName + "\\slack.exe"
    else:
        # yell at user
        print("Could not find your slack installation")
print(slack_location)

# scripts we will inject are added to this array
scripts = []
# get the directory this python code is in
# or the Current Working Directory
cwd = getcwd()
# make the libs folder if it doesn't exist
libsFolder = f"{cwd}\\libs"
if not exists(libsFolder):
    makedirs(libsFolder)
# array of libraries to install
libURLs = [
    "https://ajaxorg.github.io/ace-builds/src-min-noconflict/ace.js",
    "https://ajaxorg.github.io/ace-builds/src-min-noconflict/theme-dracula.js",
    "https://ajaxorg.github.io/ace-builds/src-min-noconflict/mode-css.js"]
for libURL in libURLs:
    # gets the last substring that follows a /
    fileName = libURL.split("/")[-1]
    print(f"\nGetting library file: {fileName}")

    # check if we have already downloaded it
    if exists(f"libs\\{fileName}"):
        print(f"\tfound {fileName} in libs")
    else:
        print(f"\t{fileName} not in libs, downloading")
        # download it
        download(libURL)
        # move it into libs
        rename(f"{cwd}/{fileName}", f"{libsFolder}/{fileName}")
    # add path to file to list of scripts to inject
    # we use realpath() here to get the fill directory to the file
    # because sometimes electron inject gets screwy with relative files
    scripts.append(f"{libsFolder}\\{fileName}")
# add our own code as the last entry in scripts
# so all the scripts are loaded once our code runs
scripts.append(f"{cwd}\\inject.js")

print(f"\ncalling electron injector with args:")
print(f"\tslack location:{slack_location}")
print(f"\tscripts:")
for script in scripts: print(f"\t\t{script}")

inject(slack_location, devtools=False, timeout=60000, scripts=scripts) 