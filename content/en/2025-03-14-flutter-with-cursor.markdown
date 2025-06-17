---
layout: post
title: Cursor (vscode) build flutter
date: '2025-03-14 09:29:10 +0800'
image: cover/cursor-flutter-cover.svg
tags:
  - cursor
  - flutter
permalink: /flutter-use-cursor
categories: AI
excerpt: Cursor (vscode) build flutter
---

## Introduction
* In the [Flutter article](https://growi.airdroid.com/67beb564ddf687cea7ba5021), we set up the environment. At that time, we were `manually executing commands to build`
* This time, we'll try building using `Cursor (vscode)`

## 🛠 Setting up the flutter run environment in IDE
## Getting Started
0. Install the environment required for flutter. However, since this was already explained in [the previous article](https://growi.airdroid.com/67beb564ddf687cea7ba5021), we'll skip it here.
1. Download the flutter plugin from `MARKPLACE / EXTENSION`

<img src="/images/flutter/012.png" alt="flutter">

2. After installation, `restart the IDE` and press `win/command + shift + p` to display the built-in command tool
   At the same time, enter `flutter doctor` and click run

   
<img src="/images/flutter/013.png" alt="flutter">

   The check will start (`mainly checking if the flutter environment is ready for use in the IDE`)

   
<img src="/images/flutter/014.png" alt="flutter">

3. Next, create `../.vscode/launch.json` in your project
   
<img src="/images/flutter/015.png" alt="flutter">

  - Use the following json format to create flutter build settings
    ```json
    {
        // Use IntelliSense to learn about possible attributes.
        // Hover to view descriptions of existing attributes.
        // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
        "version": "0.2.0",
        "configurations": [

            {
                "name": "MultiAIChatFlutter",
                "request": "launch",
                "type": "dart"
            },
            {
                "name": "MultiAIChatFlutter (profile mode)",
                "request": "launch",
                "type": "dart",
                "flutterMode": "profile"
            },
            {
                "name": "MultiAIChatFlutter (release mode)",
                "request": "launch",
                "type": "dart",
                "flutterMode": "release"
            }
        ]
    }
    ```

  - You can also generate it through the IDE. New IDEs have features to `generate launch.json settings with one click`
    Find Build & Debug and click `create a launch.json file`
    
<img src="/images/flutter/016.png" alt="flutter">

    The IDE will ask you which project to configure. For flutter, choose `Dart & Flutter`
    
<img src="/images/flutter/017.png" alt="flutter">

4. Afterwards, click the play button in the upper left or press the `F5` key in the IDE to start building flutter through the IDE

## Setting up one-click `macOS .dmg build` in the IDE
1. We've already created `../.vscode/launch.json` in the previous step
   Now we'll set up a `command` to build macOS .dmg, and at the same time create `inputs` to dynamically input the dmg title

    ```json
        {

            "version": "0.2.0",
            "configurations": [
                //omitted...
                , 
                {
                    "name": "Build macOS DMG",
                    "request": "launch",
                    "type": "node-terminal",
                    "command": "flutter config --enable-macos-desktop && flutter build macos && create-dmg build/macos/Build/Products/Release/${workspaceFolderBasename}.app --dmg-title=\"${input:dmgTitle}\" --overwrite",
                    "preLaunchTask": "checkDependencies"
                }
            ],
            "inputs": [
                {
                    "id": "dmgTitle",
                    "type": "promptString",
                    "description": "DMG Title",
                    "default": "${workspaceFolderBasename}"
                }
            ]
        }
    ```

  - `Brief explanation`: We've set up a build task called `Build macOS DMG` in `configurations`.
    This task performs actions such as `enabling macOS build settings`, `running flutter build macos`, `running create-dmg`, etc.
    In this, the value of `--dmg-title` is obtained from the `dmgTitle` member of inputs

2. Select the `Build macOS DMG` script in the IDE
   
<img src="/images/flutter/018.png" alt="flutter">

3. Since we've set up `dmgTitle`, the IDE will display an input field where you can enter any name you like
   
<img src="/images/flutter/019.png" alt="flutter">

4. After that, the terminal will automatically open and the build will begin
   
<img src="/images/flutter/020.gif" alt="flutter">
 
