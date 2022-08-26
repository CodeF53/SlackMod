from electron_inject import inject
from wget import download
from os import rename, getcwd, makedirs
from os.path import exists

#TODO: make script try to automatically determine this
# windows: "C:/ProgramData/F53/slack/app-4.27.154/slack.exe"
# linux "/usr/lib/slack/slack"
slack_location = "/usr/lib/slack/slack"

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
    if exists(f"libs/{fileName}"):
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

inject(slack_location, devtools=False, timeout=600, scripts=scripts) 