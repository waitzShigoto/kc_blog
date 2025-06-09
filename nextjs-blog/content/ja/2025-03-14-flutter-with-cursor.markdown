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

## はじめに
* [flutterの記事](https://growi.airdroid.com/67beb564ddf687cea7ba5021)では、環境をセットアップしました。その時は`手動でコマンドを実行してビルド`していました
* 今回は`Cursor (vscode)`を使ってビルドする方法を試してみます

## 🛠 IDEでflutter run環境を設定する
## はじめに
0. flutterに必要な環境をインストールします。ただし[前回の記事](https://growi.airdroid.com/67beb564ddf687cea7ba5021)で既に説明したので、ここではスキップします。
1. `MARKPLACE / EXTENSION`からflutterプラグインをダウンロードします

<img src="/images/flutter/012.png" alt="flutter">

2. インストール後、`IDEを再起動`し、`win/command + shift + p`を押すと内蔵コマンドツールが表示されます
   同時に`flutter doctor`と入力し、実行をクリックします

   
<img src="/images/flutter/013.png" alt="flutter">

   チェックが開始されます（`主にIDEで使用可能なflutter環境が整っているかを確認します`）

   
<img src="/images/flutter/014.png" alt="flutter">

3. 次にプロジェクト内に`../.vscode/launch.json`を作成します
   
<img src="/images/flutter/015.png" alt="flutter">

  - 以下のjson形式を使用してflutterのビルド設定を作成します
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

  - IDEを通じて生成することもできます。新しいIDEには`ワンクリックでlaunch.json設定を生成する`機能があります
    Build＆Debugを見つけて、`create a launch.json file`をクリックします
    
<img src="/images/flutter/016.png" alt="flutter">

    IDEがどのプロジェクトを設定するか選択させます。flutterの場合は`Dart & Flutter`を選びます
    
<img src="/images/flutter/017.png" alt="flutter">

4. その後、左上の再生ボタンをクリックするか、IDEで`F5`キーを押すと、IDEを通じてflutterのビルドが開始されます

## IDEでワンクリックで`macOS .dmg をビルド`する設定
1. 前のステップで既に`../.vscode/launch.json`を作成しています
   今度はmacOS .dmgをビルドするための`コマンド`を設定し、同時に`inputs`を作成してdmgのタイトルを動的に入力できるようにします

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

  - `簡単な説明`：`configurations`の中に`Build macOS DMG`というビルドタスクを設定しました。
    このタスクは`macOS build設定を有効にする`、`flutter build macosを実行する`、`create-dmgを実行する`などのアクションを実行します
    この中で`--dmg-title`の値はinputsのメンバー`dmgTitle`から取得します

2. IDEで`Build macOS DMG`スクリプトを選択します
   
<img src="/images/flutter/018.png" alt="flutter">

3. `dmgTitle`を設定しているため、IDEは入力欄を表示して好きな名前を入力できます
   
<img src="/images/flutter/019.png" alt="flutter">

4. その後、ターミナルが自動的に開いてビルドが始まります
   
<img src="/images/flutter/020.gif" alt="flutter">
 