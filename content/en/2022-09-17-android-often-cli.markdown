---
layout: post
title: "Sharing the Most Frequently Used Commands in Android App Development in 2022"
date: 2022-09-17 17:21:13 +0800
image: cover/android-cmd-terminal-1.png
tags: [Android,CLI,adb,brew,develop]
categories: Android教學
excerpt: "A developer shares the most frequently used commands during the development process in 2022, helping you become more familiar with these commands and enhance your development skills."
---

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Preview</h1>

 * When I am developing, I always use `brew` to install some CLI tools.
   -  Install brew

   `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Android</h1>

 * How to install a test `aab` file
   -  Install bundletool

      `brew install bundletool`

   -  Switch to your aab file folder and convert it to an apk file

      `bundletool build-apks --bundle=./app.aab --output=./app.apks`

   -  Install apk

      `bundletool install-apks --apks=app.apks`

 

 * `Adb` tool that I often use
   - Clear app data

   `adb shell pm clear your.package.name`

   - Delete app 

   `adb uninstall your.package.name`

   - Search app package

   `adb shell pm list packages | grep 'keyword'`

   - Disable app 

   `adb shell pm disable-user 'your.package.name'`

   - Open app

   `adb shell am start -n your.package.name`

   - Open app and go to a specific page

   `adb shell am start -n your.package.name/your.assign.activity.path`

   - Force-stop apps

   `adb shell am force-stop your.package.name`

   - Open Accessibility page

   `adb shell am start -a android.settings.ACCESSIBILITY_SETTINGS`

   - Open Device admin page

   `adb shell am start -n android.app.extra.DEVICE_ADMIN`

   - Set device owner 

   `adb -d shell dpm set-device-owner your.package.name/.your.admin.receivers.path`

   - Remove device owner 

   `adb shell dpm remove-active-admin your.package.name/.your.admin.receivers.path`

   - Dumpsys device owner info

   `adb shell dumpsys device_policy`

   - Grant app permissions

   `adb shell "pm grant your.package.name android.permission.YourPermission && am force-stop elegant.access.aidltest"`

   - Pull files

    `adb pull /your/path`

   - Switch tcpip port

     `adb tcpip <port>`

   - Catch android log

      <div align="start">
      See
        <a href="{{site.baseurl}}/2022/04/18/android-log-catch-method/">[Android][2022][Debug][Problem Solved Series]Android log capture methods - Helping non-developers quickly capture logs</a>
      </div>

<h1 style="background-color:powderblue;">&nbsp;&nbsp;bootloader</h1>

 * The steps to recover an Android phone using the official OTA
  1. Update bootloader

    `fastboot flash bootloader bootloader-bullhead-xxxVersion.img`
  2. Reboot bootloader

    `fastboot reboot-bootloader`
  3. Update radio

    `fastboot flash radio radio-bullhead-xxxx-x.x.xx.x.xx.img`
  4. Reboot bootloader

    `fastboot reboot-bootloader`
  5. Flash system

    `fastboot flash system system.img`
  6. Flash vendor

    `fastboot flash vendor vendor.img`
  7. Flash user data (This step will clear your internal storage.)

    `fastboot flash userdata userdata.img`
  8. Flash boot

    `fastboot flash boot boot.img`
  9. Flash recovery

    `fastboot flash recovery recovery.img`
  10. Clear cache

    `fastboot erase cache`
  11. Flash cache

    `fastboot flash cache cache.img`
  12. Reboot android OS

    `fastboot reboot`

* This [official website](https://developers.google.com/android/ota) can find the official OTA.

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Git</h1>
<h4 style = "background-color:tomato; color:white;">&nbsp;&nbsp;I prefer to use the git command line to control my repo instead of a git GUI tool.</h4>

   - Prevent your git graph from merging together and avoid committing after you send the CLI.

   `git merge --no-ff --no-commit hash`

   - Edit your commit 

    `git commit --amend`

   - Rebase and sync your local repo with remote 

    `git pull origin --rebase`

   - Store/Recover/Show your unfinished work  

   `git stash --include-untracked 、 git stash pop、 git list`

   - See your local git info 

    `git config -l`

   - Basic git concepts 

    `git add , git commit , git push , git checkout, git pull , git cherry-pick, git branch , git remote...etc.`

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Others</h1>

 * See Java environment

 `/usr/libexec/java_home -V`
