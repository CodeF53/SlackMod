from electron_inject import inject
from wget import download as wgetDownload
from os import rename, getcwd, makedirs, walk, getenv
from os import system as sysrun
from time import sleep
from os.path import exists
from platform import system
from pkg_resources import parse_version

# general error to print when slack cant be found
ERR_SLACK_NOT_FOUND =  "Could not find Slack install! Please:\n\t- install Slack\n\t- open a Github issue so I can support your install location\nPress Enter to exit."
# initialize slack location var
slack_location = ""
# find slack location based on system user is running
match system():
    case "Linux":
        # check if slack is in the location 
        slack_location = "/usr/lib/slack/slack"
        if (not exists(slack_location)):
            input(ERR_SLACK_NOT_FOUND)
            exit()
    case "Windows":
        # Check if the %appdata% location of slack exists
        slack_location = getenv('LOCALAPPDATA') + "\\slack"
        if (exists(slack_location)):
            # Slack keeps old versions for some reason, we want to inject into the latest one
            # get an array of all the subdirectories that have app-
            # ['app-4.9.0', 'app-4.26.13', 'app-4.26.3', 'app-4.28.171']
            subDirs = list(filter(lambda dir: "app-" in dir, next(walk(slack_location))[1]))
            # array of comparable "LegacyVersion" objects in the same order as subDirs
            versions = list(map(parse_version, subDirs))
            # The full path to the latest version of Slack's slack.exe
            slack_location = slack_location + "\\" + subDirs[versions.index(max(versions))] + "\\slack.exe"
        else:
            # If Slack is not found in windows appdata
            print(ERR_SLACK_NOT_FOUND)
            exit()
    case "Darwin": # Mac
        # check if slack is in the location 
        slack_location = "/Applications/Slack.app/Contents/MacOS/Slack"
        if (not exists(slack_location)):
            input(ERR_SLACK_NOT_FOUND)
            exit()
    case _:
        input("Your install isn't linux, windows, or mac, you're not supported\n\tpress any key to exit")
        exit()

# macOS is stupid and doesn't like wget's download
def download(url):
    if (system()=="Darwin"):
        fileName = url.split("/")[-1]
        sysrun(f"curl -o { fileName } \"{url}\"")
        sleep(0.1)
    else:
        wgetDownload(url)

# scripts we will inject are added to this array
scripts = []
# get the directory this python code is in
# or the Current Working Directory
cwd = getcwd()
# make the libs folder if it doesn't exist
libsFolder = f"{cwd}/libs"
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
    scripts.append(f"{libsFolder}/{fileName}")
# add our own code as the last entry in scripts
# so all the scripts are loaded once our code runs
scripts.append(f"{cwd}/inject.js")

print(f"\ncalling electron injector with args:")
print(f"\tslack location:{slack_location}")
print(f"\tscripts:")
for script in scripts: print(f"\t\t{script}")

inject(slack_location, devtools=False, timeout=60000, scripts=scripts) 