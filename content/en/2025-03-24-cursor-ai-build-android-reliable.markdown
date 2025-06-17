---
layout: post
title: Feasibility of Android Development with Cursor IDE
date: '2025-03-24 09:29:10 +0800'
image: cover/cursor-android-cover.svg
tags:
  - cursor
permalink: /cursor-ai-with-android
categories: AI
excerpt: Feasibility of Android Development with Cursor IDE
---

## Actual Effects
* Based on previously shared <a href="{{site.baseurl}}/cursor-ai-note">Using Cursor IDE to Assist Code Development</a>
* Testing the feasibility of replacing Android Studio with `Cursor (vscode)`
* [Jump directly to the conclusion](#custom-tag)

## Launching a Smartphone Emulator with Cursor (vscode)

#### Manual Launch Method

0. Installing Android tool `emulator`
    - Normally, when you install `Android Studio`, the emulator is installed together
    - To use it in your environment, you need to find the corresponding path and add it to your environment variables
    - For Windows, add to `Environment Variables`
      ```java
         C:\Users\username\AppData\Local\Android\Sdk\emulator
      ```
    - For MacOS, add to the end of `.zshrc`
      ```java
         export ANDROID_HOME=$HOME/Library/Android/sdk
         export PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH
      ```

1. List the `available AVD emulators` in your environment using this command
    ```java
    emulator -list-avds
    ```

2. Launch the emulator using emulator command
    ```java
    emulator -avd Pixel_7_API_33
    ```

#### Using a Plugin to Open the Emulator
1. Download the emulator plugin from the marketplace
   
<img src="/images/cursor/044.png" alt="flutter">

2. For plugins like the one above, press `win/command + shift + p` to open the IDE command bar and enter `emulator`
   
<img src="/images/cursor/045.png" alt="flutter">

3. Then press Enter and follow the instructions to select the emulator you want to use
   
<img src="/images/cursor/046.png" alt="flutter">

## Can you build Android APK with a single click in Cursor?

#### One-click build using launch.json

* As usual, create `.vscode/launch.json` in the root directory

  Let the IDE or AI generate it directly

  Add launch script content

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "android",
            "request": "launch",
            "name": "Android launch",
            "appSrcRoot": "${workspaceRoot}/app/src/main",
            "apkFile": "${workspaceRoot}/app/build/outputs/apk/debug/app-debug.apk",
            "adbPort": 5037
        },
        {
            "type": "android",
            "request": "attach",
            "name": "Android attach",
            "appSrcRoot": "${workspaceRoot}/app/src/main",
            "adbPort": 5037,
            "processId": "${command:PickAndroidProcess}"
        }
    ]
}
```

- However, from current testing, `native Android` support is not complete

  For example, when using a script named `Android launch`

  When opening the app, it enters waiting for debugger but

  `Cursor IDE` doesn't have debug tools like Android Studio, so you can't proceed to the next step

  Debug actions in `Cursor (vscode)` don't seem to work

#### Building with task.json

Through custom tasks

Tools frequently used in Android development as commands

Building the entire workflow effectively

Example: adb, gradle, logcat ... etc.

1. Create `.vscode/task.json` in the root directory, and let AI generate the related content directly

The following are commonly used (each `JSON object is a task`). Use as needed.

(Some parameters can be replaced. Or let AI generate non-hardcoded ones. For example, `Pixel_7_API_33`, `package name` ... etc. below)

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Launch Android Emulator",
      "type": "shell",
      "command": "emulator -avd Pixel_7_API_33",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "List Connected Devices",
      "type": "shell",
      "command": "adb devices",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Build Debug APK",
      "type": "shell",
      "command": "./gradlew assembleDebug",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": []
    },
    {
      "label": "Install Debug APK (Default Device)",
      "type": "shell",
      "command": "./gradlew installDebug",
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "Install Debug APK (Specific Device)",
      "type": "shell",
      "command": "adb -s ${input:deviceSerial} install -r ./app/build/outputs/apk/debug/app-debug.apk",
      "group": "build",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Build & Install Debug APK (Default Device)",
      "dependsOn": [
        "Build Debug APK",
        "Install Debug APK (Default Device)"
      ],
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "Build & Install Debug APK (Specific Device)",
      "type": "shell",
      "command": "./gradlew assembleDebug && adb -s ${input:deviceSerial} install -r ./app/build/outputs/apk/debug/app-debug.apk",
      "group": "build",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Clean Project",
      "type": "shell",
      "command": "./gradlew clean",
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "Show Logcat (All Logs)",
      "type": "shell",
      "command": "adb logcat",
      "group": "none",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "dedicated"
      },
      "isBackground": true
    },
    {
      "label": "Show Logcat (App Logs)",
      "type": "shell",
      "command": "adb logcat | grep \"com.sand.democursor\"",
      "group": "none",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "dedicated"
      },
      "isBackground": true
    },
    {
      "label": "Show Logcat (Specific Device)",
      "type": "shell",
      "command": "adb -s ${input:deviceSerial} logcat | grep \"com.sand.democursor\"",
      "group": "none",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "dedicated"
      },
      "isBackground": true
    },
    {
      "label": "Complete Clean and Build",
      "type": "shell",
      "command": "./gradlew clean assembleDebug --stacktrace",
      "group": "build",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Run App (Default Device)",
      "type": "shell",
      "command": "adb shell am start -n com.sand.democursor/com.sand.democursor.MainActivity",
      "dependsOn": [
        "Build & Install Debug APK (Default Device)"
      ],
      "group": "build",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Run App (Specific Device)",
      "type": "shell",
      "command": "adb -s ${input:deviceSerial} shell am start -n com.sand.democursor/com.sand.democursor.MainActivity",
      "dependsOn": [
        "Build & Install Debug APK (Specific Device)"
      ],
      "group": "build",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Complete Development Setup (Emulator)",
      "dependsOn": [
        "Launch Android Emulator",
        "Build & Install Debug APK (Default Device)",
        "Run App (Default Device)"
      ],
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "Complete Development Setup (Specific Device)",
      "dependsOn": [
        "Build & Install Debug APK (Specific Device)",
        "Run App (Specific Device)"
      ],
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "One-click Build, Install, Launch (Select Device)",
      "type": "shell",
      "command": "bash -c 'deviceList=$(adb devices | grep -v \"List of devices\" | grep -v \"^$\" | grep -v \"offline\" | grep -v \"unauthorized\"); if [ -z \"$deviceList\" ]; then echo \"No connected devices found\"; exit 1; fi; PS3=\"Select device number: \"; devices=(); while read -r line; do if [ ! -z \"$line\" ]; then device=$(echo $line | awk \"{print \\$1}\"); devices+=(\"$device\"); fi; done <<< \"$deviceList\"; select device in \"${devices[@]}\"; do if [ ! -z \"$device\" ]; then echo \"Selected device: $device\"; echo \"Building APK...\"; ./gradlew assembleDebug; echo \"Installing APK to device $device...\"; adb -s $device install -r ./app/build/outputs/apk/debug/app-debug.apk; echo \"Launching application...\"; adb -s $device shell am start -n com.sand.democursor/com.sand.democursor.MainActivity; break; fi; done'",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new",
        "focus": true
      }
    },
    {
      "label": "Generate APK Bundle",
      "type": "shell",
      "command": "./gradlew bundleRelease",
      "group": "build",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Build Release APK",
      "type": "shell",
      "command": "./gradlew assembleRelease",
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "Install Release APK (Specific Device)",
      "type": "shell",
      "command": "adb -s ${input:deviceSerial} install -r ./app/build/outputs/apk/release/app-release.apk",
      "group": "build",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "./gradlew test",
      "group": "test",
      "problemMatcher": []
    },
    {
      "label": "Kill ADB Server",
      "type": "shell",
      "command": "adb kill-server",
      "group": "none",
      "problemMatcher": []
    },
    {
      "label": "Start ADB Server",
      "type": "shell",
      "command": "adb start-server",
      "group": "none",
      "problemMatcher": []
    },
    {
      "label": "Restart ADB Server",
      "dependsOn": [
        "Kill ADB Server",
        "Start ADB Server"
      ],
      "group": "none",
      "problemMatcher": []
    },
    {
      "label": "Run App Without Debug Wait",
      "type": "shell",
      "command": "adb shell am start -n com.sand.democursor/com.sand.democursor.MainActivity --ei 'wait_for_debugger' 0",
      "group": "build",
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "deviceSerial",
      "type": "promptString",
      "description": "Enter the target device serial number (you can check with the 'adb devices' command)"
    }
  ]
}
```

2. Then use the shortcut key `win/command` + `shift` + `p` to open the input box, type `Run Task`, and press `Enter`
   
<img src="/images/cursor/047.png" alt="flutter">

3. You can ultimately customize the build flow according to your needs
   
<img src="/images/cursor/048.gif" alt="flutter">

## Can Cursor use the common shortcut keys in Android Studio?

#### Move Entire Line Up/Down
* During development, you often need to adjust the position of code or move to another line to test the effect
    - In `AS`, use `win/command` + `shift` + `↑/↓`
      
<img src="/images/cursor/049.gif" alt="flutter">

    - In Cursor(vscode), use `alt/option` + `↑/↓`
      
<img src="/images/cursor/050.gif" alt="flutter">

#### Duplicate Entire Line
* When there is similar code, you might want to quickly duplicate a whole line
    - In `AS`, use `win/command` + `D`
      
<img src="/images/cursor/051.gif" alt="flutter">

    - In Cursor(vscode), use `win/command` + `shift` + `D`
      
<img src="/images/cursor/052.gif" alt="flutter">

#### Quick Completion/Suggestions
* Quick completion that was frequently used in Android Studio
    - In `AS`, use `Alt/option` + `Enter`
    - In Cursor(vscode), use `win/command` + `.`
      
<img src="/images/cursor/053.png" alt="flutter">

<a id="custom-tag"></a>

## Pros and Cons of Android Development with Cursor
#### Pros
* Create code through prompts using Cursor's built-in AI tools
* Lightweight
    - Doesn't consume as many resources as Android Studio, suitable for lower-spec devices
    - Faster startup speed
* Higher customizability
    - Can manually set up `tasks.json` and `launch.json` and fully customize to your needs
    - Can extend some features (such as Kotlin and ADB operations) through plugins
* Focus on pure code creation
    - Suitable for developers who are `accustomed to command operations`

#### Cons
* Need to build the development workflow manually
    - Workflows that Android Studio natively supports like build, run, debug, etc., require setting up tasks.json or launch.json yourself in Cursor
* Some features are not supported, suitable for developers familiar with these aspects
    - For example, commonly used features like ViewBinding, DataBinding, Layout Inspector
* Lack of UI design tools
    - Unable to design UI by direct drag and drop like in Android Studio, need to write all XML or Jetpack Compose by hand (not a problem if you're familiar with these)
* Gradle Sync and Build can become cumbersome
    - Need to run Gradle Sync manually or write test scripts
* Weak emulator and device management
    - Need to start manually or write scripts to run
* Inferior debugging experience
    - Android Studio provides complete Logcat monitoring and Breakpoint debugging, but Cursor's debugger doesn't seem to work with Android native in actual testing
    - wait-for-debugger issues
      
<img src="/images/cursor/054.png" alt="flutter">

### Therefore, it is still recommended to use Cursor and AS alternately. If you are familiar with everything, you can use it just as a pure editor along with AI
## Other 
mac / win keyboard correspondence

<img src="/images/cursor/055.png" alt="flutter">
 
