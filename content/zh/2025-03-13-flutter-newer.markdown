---
layout: post
title: "什麼是 Flutter？"
date: 2025-03-13 09:29:10 +0800
image: cover/flutter-cover.svg
tags: [flutter]
permalink: /flutter-newer
categories: flutter
excerpt: "什麼是 Flutter？"
---

## 什麼是 Flutter？
* Flutter 是 Google 開發的 **跨平台 UI 框架**，用來構建 **Android、iOS、Web、Windows、macOS、Linux** 應用程式。

## 🛠 環境安裝
#### 0. (限macOS) 可以透過homebrew來完成安裝，沒有的話，透過下列指令安裝homebrew：
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
並透過homebrew安裝`fvm`
```sh
brew tap leoafarias/fvm
brew install fvm
```

其他平台也可以安裝fvm
有興趣可以直接去看[文件](https://fvm.app/documentation/getting-started/installation)

#### 1. 到[官網下載flutter sdk](https://flutter-ko.dev/get-started/install/macos) 或是用上一步驟的`fvm`安裝
a. (mac/windows)透過上面連接，找到官方提供的版本下載

<img src="/images/flutter/001.png" alt="flutter">

b. 或是透過`fvm`下載

```sh
fvm install stable  # 安裝最新的穩定版本
```

並設定global`預設flutter版本`

```sh
fvm global stable
```

#### 2. 把flutter設定到環境變數中
(`windows`)在環境變數中設定下列路徑 (如果是用手動下載的，就是換成對應的bin路徑)
```
$HOME/fvm/default/bin
```

(`macos`)則是設定在termianl配置中，
例如常用的`.zshrc`

```sh
open ~/.zshrc
```

接著在.zshrc加入
```
export PATH=$PATH:"$HOME/fvm/default/bin"
```

#### 3. 用`flutter doctor`查看目前環境還缺少什麼，來決定要安裝哪些
* 若要build `android、macos、ios`則需要下載android studio 跟xcode
* 即時都安裝了，還是有可能有些問題，例如：android tool 跟ios CocoaPods 安裝不完整，導致有error

  <img src="/images/flutter/002.png" alt="flutter">

* 以我這邊來說，遇到三個問題
  - `cmdline-tools`找不到

    <img src="/images/flutter/003.png" alt="flutter">

    - 透過`Android tool`中的 `sdkManager`去安裝，若你知道sdkManager路徑，或者有設定在環境變數中，則直接用指令安裝`cmdline-tools`
       ```cmd
       $ANDROID_SDK_ROOT/tools/bin/sdkmanager --install "cmdline-tools;latest"
       ```
    - 這邊可能遇到java版本相容性問題，若遇到可以切換local java version，我這邊是把java 切換回8，則正常

      <img src="/images/flutter/004.png" alt="flutter">

  - `CocoaPods`不相容：

    <img src="/images/flutter/005.png" alt="flutter">

    - 可用`sudo gem install cocoapods`指令，去安裝最新版
  - `沒有`同意Android license：

    <img src="/images/flutter/006.png" alt="flutter">

    可以用下列指令`同意`
      ```
       flutter doctor --android-licenses
      ```

* `再次用flutter doctor` 確定是否成功，成功即可開發或編譯flutter

  <img src="/images/flutter/007.png" alt="flutter">

## Run on Target devices directly
* cd到你的flutter專案`根目錄`底下

  <img src="/images/flutter/008.png" alt="flutter">

* 直接run，他會下載缺少的資源、tool，之後會`讓你選`你想要run的目標平台，就會run出來
    ```
    flutter run
    ```
  

  <img src="/images/flutter/009.png" alt="flutter">

## Build macOS dmg檔

* cd到你的flutter專案`根目錄`底下

  <img src="/images/flutter/008.png" alt="flutter">

* 確認針對macOS的編譯有打開
    ```
    flutter config --enable-macos-desktop
    ```
* 針對指定平台Build，下面例子是針對macos
    ```
    flutter build macos
    ```
  - Build完後會出現`xxx.app`
    
<img src="/images/flutter/010.png" alt="flutter">

* 上面出現的xxx.app 還僅僅是app而已，若需要`.dmg`，則需要繼續對其進行打包

  - 需要使用插件`create-dmg`，所以用`npm`安裝
    ```
    npm install -g create-dmg
    ```
  - 把前面build好的xxx.app 進行打包：
    - `--dmg-title`：可以設定安裝包在磁碟機上的名稱
      
<img src="/images/flutter/011.png" alt="flutter">

    ```
    create-dmg build/macos/Build/Products/Release/xxx.app --dmg-title="你的應用名稱" --overwrite
    ```

## 透過IDE Run專案 (Cursor/vscode)

* 另外寫了一篇，<a href="{{site.baseurl}}/flutter-use-cursor">請參考</a>
