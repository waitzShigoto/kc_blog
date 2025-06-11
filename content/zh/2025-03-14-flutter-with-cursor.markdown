---
layout: post
title: "Cursor (vscode) build flutter"
date: 2025-03-14 09:29:10 +0800
image: cover/cursor-flutter-cover.svg
tags: [flutter,cursor]
permalink: /flutter-use-cursor
categories: flutter
excerpt: "Cursor (vscode) build flutter"
---

## 前言
* 在[flutter這篇](https://growi.airdroid.com/67beb564ddf687cea7ba5021)，我們安裝好了環境，我們都是用`手動下command 去 build`
* 現在我們嘗試透過用`Cursor (vscode)`來幫我們build

## 🛠 在IDE中設定flutter run環境
## 前言
0. 安裝flutter 所需環境，不過[上一篇](https://growi.airdroid.com/67beb564ddf687cea7ba5021)寫過了，所以這邊就直接跳過。
1. 在`MARKPLACE / EXTENSION` 中 下載flutter插件

<img src="/images/flutter/012.png" alt="flutter">

2. 安裝好`重啟IDE`，按下`win/command + shift + p` 會跳出內建command tool
   同時輸入`flutter doctor`，並點中執行

   
<img src="/images/flutter/013.png" alt="flutter">

   會開始幫你跑檢查 (`主要就是確認你ide有就緒的flutter env可用`)

   
<img src="/images/flutter/014.png" alt="flutter">

3. 接著在專案下建立`../.vscode/launch.json`
   
<img src="/images/flutter/015.png" alt="flutter">

  - 用以下的json format 去建立flutter的build 配置
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

  - 也可以透過IDE產生，比較新的IDE有`一鍵產生launch.json配置`的功能
    找到Build& Debug，並且點擊`create a launch.json file`
    
<img src="/images/flutter/016.png" alt="flutter">

    IDE會讓你選你要配置什麼專案，例如fluter就是選`Dart & Flutter`
    
<img src="/images/flutter/017.png" alt="flutter">

4. 接著左上角按下播放鈕，或者在IDE中按下`F5`，即可開始透過IDE build flutter

## 在IDE中設定一鍵`build macos .dmg`
1. 上一個環節已經有建立好`../.vscode/launch.json`
   現在我們只要把build macos .dmg的`指令`配置好，同時可以另外建立`inputs`用來動態輸入dmg title

    ```json
        {

            "version": "0.2.0",
            "configurations": [
                //省略...
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

  - `簡單解說`：設了一個`configurations`，其中有個叫`Build macOS DMG`的Build task，
    需要執行 `打開macos build setting`、`flutter build macos`、`create-dmg`...等動作
    其中`--dmg-title`的值會透過inputs的merber `dmgTitle`去拿

2. 透過IDE選擇`Build macOS DMG` 腳本
   
<img src="/images/flutter/018.png" alt="flutter">

3. 因為我們有設定`dmgTitle`，所以IDE會跳出一欄 讓你輸入想要的名稱
   
<img src="/images/flutter/019.png" alt="flutter">

4. 接著就會打開terminal auto build
   
<img src="/images/flutter/020.gif" alt="flutter">
