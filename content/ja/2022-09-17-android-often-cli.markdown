---
layout: post
title: 分享我在 2022 年開發Android App中最常用的指令
date: '2022-09-17 17:21:13 +0800'
image: cover/android-cmd-terminal-1.png
tags:
  - ADB
  - Android
  - Brew
  - CLI
  - Development
categories: AndroidDev
excerpt: 一位開發者分享了他在2022年開發過程中使用最頻繁的指令，讓你更加熟悉這些指令並加強你的開發技能
---

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Preview</h1>

 * when I am developing that I always used `brew` to install some cli tool.
   -  install brew

   `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Android</h1>

 * How to install test `aab` file
   -  install bundletool

      `brew install bundletool`

   -  switch to your aab file folder and convert it to apk file

      `bundletool build-apks --bundle=./app.aab --output=./app.apks`

   -  install apk

      `bundletool install-apks --apks=app.apks`

 

 * `Adb` tool that I often used
   - Clear app data

   `adb shell pm clear your.package.name`

   - Delete app 

   `adb uninstall  your.package.name`

   - Search app package

   `adb shell pm list packages | grep 'keyword'`

   - Disable app 

   `adb shell pm disable-user 'your.package.name'`

   - Open app

   `adb shell am start -n  your.package.name`

   - Open app and goto assign page

   `adb shell am start -n your.package.name/your.assign.activity.path`

   - Forec-stop apps

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

   `adb shell "pm grant  your.package.name android.permission.YourPermission && am force-stop elegant.access.aidltest"`

   - Pull files

    `adb pull /your/path`

   - Switch tcpip port

     `adb tcpip <port>`

   - Catch android log

      <div align="start">
      See
        <a href="{{site.baseurl}}/posts/android-log-catch-method">[Android][2022][Debug][Problem Solved Series]Android log 抓取方式彙整-讓非開發人員更快抓log</a>
      </div>

<h1 style="background-color:powderblue;">&nbsp;&nbsp;bootloader</h1>

 * The step of recovery Android phone use the office OTA
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

* This [office website](https://developers.google.com/android/ota) can find the office OTA .

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Git</h1>
<h4 style = "background-color:tomato; color:white;">&nbsp;&nbsp;I like to use git command line to control my repo instead of git GUI tool.</h4>

   - Let your git graph not merge together and not commit after you sent the cli.

   `git merge --no-ff --no-commit hash`

   - Edit your commit 

    `git commit --amend`

   - Rebase and sync your local repo with remote 

    `git pull origin --rebase`

   - Story/Recovery/Show your not finish work  

   `git stash --include-untracked 、 git stash pop、 git list`

   - See your local git info 

    `git config -l`

   - Base git concept 

    `git add , git commit , git push , git checkout, git pull , git cherry-pick, git branch , git remote...etc.`

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Others</h1>

 * See Java environment

 `/usr/libexec/java_home -V`
