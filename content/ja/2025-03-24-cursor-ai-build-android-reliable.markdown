---
layout: post
title: Cursor IDEでのAndroid開発の実現可能性
date: '2025-03-24 09:29:10 +0800'
image: cover/cursor-android-cover.svg
tags:
  - cursor
permalink: /cursor-ai-with-android
categories: AI
excerpt: Cursor IDEでのAndroid開発の実現可能性
---

## 実際の効果
* 以前共有した<a href="{{site.baseurl}}/cursor-ai-note">Cursor IDEを使用したコード開発の支援</a>に基づいています
* `Cursor (vscode)`でAndroid Studioを置き換える実現可能性をテスト
* [直接結論へジャンプ](#custom-tag)

## Cursor (vscode)でスマートフォンエミュレータを起動する

#### 手動で開く方法

0. Android ツール `emulator`のインストール
    - 通常、`Android Studio`をインストールすると、エミュレータも一緒にインストールされます
    - 環境で使用するためには、対応するパスを見つけて環境変数に追加する必要があります
    - Windowsの場合、`環境変数`に追加
      ```java
         C:\Users\ユーザー名\AppData\Local\Android\Sdk\emulator
      ```
    - MacOSの場合、`.zshrc`の末尾に追加
      ```java
         export ANDROID_HOME=$HOME/Library/Android/sdk
         export PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH
      ```

1. 以下のコマンドを使用して環境内の`利用可能なAVDエミュレータ`をリストアップ
    ```java
    emulator -list-avds
    ```

2. emulatorを使用してエミュレータを起動
    ```java
    emulator -avd Pixel_7_API_33
    ```

#### プラグインを使用してエミュレータを開く
1. マーケットプレイスからエミュレータプラグインをダウンロード
   
<img src="/images/cursor/044.png" alt="flutter">

2. 上の図のようなプラグインの場合、`win/command + shift + p`を押してIDEのコマンドバーを開き、`emulator`と入力
   
<img src="/images/cursor/045.png" alt="flutter">

3. その後、Enterを押して手順に従い、使用するエミュレータを選択
   
<img src="/images/cursor/046.png" alt="flutter">

## CursorでワンクリックでAndroid APKをビルドできますか？

#### launch.jsonを使用したワンクリックビルド

* いつも通り、ルートディレクトリに`.vscode/launch.json`を作成

  IDEまたはAIに直接生成してもらいましょう

  launch スクリプトの内容を追加

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

- ただし、現在テストしたところ、`ネイティブAndroid`のサポートは完全ではありません

  例：`Android launch`という名前のスクリプトを使用すると

  アプリを開く際にwaitting for debuggerに入りますが

  `Cursor IDE`にはAndroid Studioのようなデバッグツールがなく、次のステップに進めません

  `Cursor (vscode)`のデバッグアクションは効果がないようです

#### task.jsonを使用したビルド

カスタムタスクを通じて

以前Androidの開発でよく使用していたツールをコマンドとして

ワークフロー全体を構築するのが効果的です

例：adb, gradle, logcat ...など

1. ルートディレクトリに`.vscode/task.json`を作成し、AIに関連内容を直接生成してもらいましょう

以下は一般的に使用されるもの（`各jsonオブジェクトは1つのタスク`）です。必要に応じて参考にしてください。

（一部のパラメータは置き換えることができます。またはAIに非ハードコードのものを生成してもらいましょう。例えば以下の`Pixel_7_API_33`、`package name`...など）

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Android エミュレータを起動",
      "type": "shell",
      "command": "emulator -avd Pixel_7_API_33",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "接続されているデバイスをリスト",
      "type": "shell",
      "command": "adb devices",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Debug APKをビルド",
      "type": "shell",
      "command": "./gradlew assembleDebug",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": []
    },
    {
      "label": "Debug APKをインストール (デフォルトデバイス)",
      "type": "shell",
      "command": "./gradlew installDebug",
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "Debug APKをインストール (指定デバイス)",
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
      "label": "ビルド & Debug APKをインストール (デフォルトデバイス)",
      "dependsOn": [
        "Debug APKをビルド",
        "Debug APKをインストール (デフォルトデバイス)"
      ],
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "ビルド & Debug APKをインストール (指定デバイス)",
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
      "label": "プロジェクトをクリーン",
      "type": "shell",
      "command": "./gradlew clean",
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "Logcatを表示 (すべてのログ)",
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
      "label": "Logcatを表示 (アプリログ)",
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
      "label": "Logcatを表示 (指定デバイス)",
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
      "label": "完全クリーンとビルド",
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
      "label": "アプリを実行 (デフォルトデバイス)",
      "type": "shell",
      "command": "adb shell am start -n com.sand.democursor/com.sand.democursor.MainActivity",
      "dependsOn": [
        "ビルド & Debug APKをインストール (デフォルトデバイス)"
      ],
      "group": "build",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "アプリを実行 (指定デバイス)",
      "type": "shell",
      "command": "adb -s ${input:deviceSerial} shell am start -n com.sand.democursor/com.sand.democursor.MainActivity",
      "dependsOn": [
        "ビルド & Debug APKをインストール (指定デバイス)"
      ],
      "group": "build",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "開発環境の完全セットアップ (エミュレータ)",
      "dependsOn": [
        "Android エミュレータを起動",
        "ビルド & Debug APKをインストール (デフォルトデバイス)",
        "アプリを実行 (デフォルトデバイス)"
      ],
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "開発環境の完全セットアップ (指定デバイス)",
      "dependsOn": [
        "ビルド & Debug APKをインストール (指定デバイス)",
        "アプリを実行 (指定デバイス)"
      ],
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "ワンクリックでビルド・インストール・起動 (デバイス選択)",
      "type": "shell",
      "command": "bash -c 'deviceList=$(adb devices | grep -v \"List of devices\" | grep -v \"^$\" | grep -v \"offline\" | grep -v \"unauthorized\"); if [ -z \"$deviceList\" ]; then echo \"接続されているデバイスが見つかりません\"; exit 1; fi; PS3=\"デバイス番号を選択: \"; devices=(); while read -r line; do if [ ! -z \"$line\" ]; then device=$(echo $line | awk \"{print \\$1}\"); devices+=(\"$device\"); fi; done <<< \"$deviceList\"; select device in \"${devices[@]}\"; do if [ ! -z \"$device\" ]; then echo \"選択されたデバイス: $device\"; echo \"APKをビルド中...\"; ./gradlew assembleDebug; echo \"APKをデバイス $device にインストール中...\"; adb -s $device install -r ./app/build/outputs/apk/debug/app-debug.apk; echo \"アプリケーションを起動中...\"; adb -s $device shell am start -n com.sand.democursor/com.sand.democursor.MainActivity; break; fi; done'",
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
      "label": "APK Bundleを生成",
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
      "label": "Release APKをビルド",
      "type": "shell",
      "command": "./gradlew assembleRelease",
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "Release APKをインストール (指定デバイス)",
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
      "label": "テストを実行",
      "type": "shell",
      "command": "./gradlew test",
      "group": "test",
      "problemMatcher": []
    },
    {
      "label": "ADBサーバーを終了",
      "type": "shell",
      "command": "adb kill-server",
      "group": "none",
      "problemMatcher": []
    },
    {
      "label": "ADBサーバーを開始",
      "type": "shell",
      "command": "adb start-server",
      "group": "none",
      "problemMatcher": []
    },
    {
      "label": "ADBサーバーを再起動",
      "dependsOn": [
        "ADBサーバーを終了",
        "ADBサーバーを開始"
      ],
      "group": "none",
      "problemMatcher": []
    },
    {
      "label": "デバッグ待機なしでアプリを実行",
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
      "description": "ターゲットデバイスのシリアル番号を入力してください ('adb devices'コマンドで確認できます)"
    }
  ]
}
```

2. 次にショートカットキー`win/command` + `shift` + `p`を使って入力ボックスを開き、`Run Task`と入力し、`Enter`を押します
   
<img src="/images/cursor/047.png" alt="flutter">

3. 最終的には自分のニーズに合わせてビルドフローをカスタマイズできます
   
<img src="/images/cursor/048.gif" alt="flutter">

## Android Studioでよく使うショートカットキーはCursorで使えますか？

#### 行全体の上下移動
* 開発中によく、コードの位置を調整したり、他の行に移動して効果をテストしたりする必要があります
    - `AS`では `win/command` + `shift` +`↑/↓`を使用
      
<img src="/images/cursor/049.gif" alt="flutter">

    - Cursor(vscode)では`alt/option` + `↑/↓`を使用
      
<img src="/images/cursor/050.gif" alt="flutter">

#### 行全体のコピー
* 類似したコードがある場合、行全体を素早くコピーしたいことがあります
    - `AS`では `win/command` + `D`を使用
      
<img src="/images/cursor/051.gif" alt="flutter">

    - Cursor(vscode)では `win/command` + `shift` +`D`を使用
      
<img src="/images/cursor/052.gif" alt="flutter">

#### クイック補完/提案
* 以前Android Studioでよく使っていたクイック補完
    - `AS`では `Alt/option`+`Enter`を使用
    - Cursor(vscode)では `win/command` + `.`を使用
      
<img src="/images/cursor/053.png" alt="flutter">

<a id="custom-tag"></a>

## CursorでのAndroid開発の長所と短所
#### 長所
* Cursor内蔵AIツールを使用して、プロンプトを通じてコードを作成
* 軽量
    - Android Studioほどリソースを消費せず、低スペックのデバイスに適しています
    - 起動速度が速い
* より高いカスタマイズ性
    - `tasks.json`や`launch.json`を手動で設定でき、ニーズに合わせて完全にカスタマイズできます
    - プラグインを通じて一部の機能（KotlinやADB操作など）を拡張できます
* 純粋なコード作成に集中
    - `コマンド操作に慣れた`開発者に適しています

#### 短所
* 開発ワークフローを手動で構築する必要がある
    - Android Studioがネイティブにサポートするビルド、実行、デバッグなどの流程は、Cursorではtasks.jsonやlaunch.jsonを自分で設定する必要があります
* 一部の機能がサポートされておらず、これらの内容に慣れた開発者に適しています
    - 例えばViewBinding、DataBinding、Layout Inspectorなどのよく使われる機能
* UI設計ツールの欠如
    - Android Studioのように直接ドラッグ＆ドロップでUIをデザインできず、XMLやJetpack Composeを全て手書きする必要があります（これらに慣れていれば問題ありません）
* Gradle SyncとBuildが面倒になる可能性
    - Gradle Syncを手動で実行するか、テスト用のスクリプトを書く必要があります
* エミュレータとデバイス管理が弱い
    - 手動で起動するか、スクリプトを書いて実行する必要があります
* デバッグ体験が劣る
    - Android Studioは完全なLogcat監視やBreakpointデバッグを提供していますが、Cursorのデバッガーは実際のテストではAndroid nativeで使用できないようです
    - wait-for-debuggerの問題
      
<img src="/images/cursor/054.png" alt="flutter">

### そのため、現在でもCursorとASを交互に使用することをお勧めします。すべてに精通している場合は、純粋なエディタとしてAIと一緒に使用するだけでもよいでしょう
## その他 
mac / winキーボードの対応

<img src="/images/cursor/055.png" alt="flutter">
 
