---
layout: post
title: Flutterとは？
date: '2025-03-13 09:29:10 +0800'
image: cover/flutter-cover.svg
tags:
  - flutter
permalink: /flutter-newer
categories: CrossPlatform
excerpt: Flutterとは？
---

## Flutterとは？
* Flutter は Google が開発した **クロスプラットフォーム UI フレームワーク**で、**Android、iOS、Web、Windows、macOS、Linux** アプリケーションを構築するために使用されます。

## 🛠 環境のインストール
#### 0. (macOSのみ) homebrewを使ってインストールできます。まだない場合は、以下のコマンドでhomebrewをインストールします：
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
そしてhomebrewを使って`fvm`をインストールします
```sh
brew tap leoafarias/fvm
brew install fvm
```

他のプラットフォームでもfvmをインストールできます
興味がある方は直接[ドキュメント](https://fvm.app/documentation/getting-started/installation)を確認してください

#### 1. [公式サイトからFlutter SDKをダウンロード](https://flutter-ko.dev/get-started/install/macos)するか、前のステップで紹介した`fvm`を使ってインストールします
a. (mac/windows)上のリンクから、公式提供のバージョンをダウンロード

<img src="/images/flutter/001.png" alt="flutter">

b. または`fvm`を使ってダウンロード

```sh
fvm install stable  # 最新の安定版をインストール
```

そして`デフォルトのFlutterバージョン`をglobalに設定します

```sh
fvm global stable
```

#### 2. 環境変数にFlutterを設定する
(`windows`)環境変数に以下のパスを設定します（手動ダウンロードの場合は、対応するbinパスに置き換えます）
```
$HOME/fvm/default/bin
```

(`macos`)はターミナル設定で設定します、
例えば一般的な`.zshrc`の場合：

```sh
open ~/.zshrc
```

そして.zshrcに以下を追加します
```
export PATH=$PATH:"$HOME/fvm/default/bin"
```

#### 3. `flutter doctor`を使って現在の環境に何が不足しているかを確認し、必要なものをインストールします
* `android、macos、ios`をビルドする場合は、Android StudioとXcodeをダウンロードする必要があります
* すべてインストールしていても、Android ToolやiOS CocoapPdsのインストールが不完全でエラーが発生する可能性があります

  <img src="/images/flutter/002.png" alt="flutter">

* 私の場合、3つの問題に遭遇しました
  - `cmdline-tools`が見つからない

    <img src="/images/flutter/003.png" alt="flutter">

    - `Android tool`の`sdkManager`を使ってインストールします。sdkManagerのパスがわかっているか環境変数に設定されている場合は、直接コマンドで`cmdline-tools`をインストールします
       ```cmd
       $ANDROID_SDK_ROOT/tools/bin/sdkmanager --install "cmdline-tools;latest"
       ```
    - ここでJavaバージョンの互換性問題が発生する可能性があります。発生した場合はローカルのJavaバージョンを切り替えます。私の場合はJavaを8に戻すと正常になりました

      <img src="/images/flutter/004.png" alt="flutter">

  - `CocoaPods`の互換性がない：

    <img src="/images/flutter/005.png" alt="flutter">

    - `sudo gem install cocoapods`コマンドを使って最新版をインストールできます
  - Androidライセンスに`同意していない`：

    <img src="/images/flutter/006.png" alt="flutter">

    以下のコマンドで`同意`できます
      ```
       flutter doctor --android-licenses
      ```

* `再度flutter doctorを実行して`成功したかどうかを確認します。成功すればFlutterの開発またはコンパイルが可能になります

  <img src="/images/flutter/007.png" alt="flutter">

## ターゲットデバイスで直接実行する
* Flutterプロジェクトの`ルートディレクトリ`に移動します

  <img src="/images/flutter/008.png" alt="flutter">

* 直接実行すると、不足しているリソースやツールがダウンロードされ、その後実行したい`ターゲットプラットフォームを選択`するよう求められます
    ```
    flutter run
    ```
  

  <img src="/images/flutter/009.png" alt="flutter">

## macOS用のdmgファイルをビルドする

* Flutterプロジェクトの`ルートディレクトリ`に移動します

  <img src="/images/flutter/008.png" alt="flutter">

* macOS向けのコンパイルが有効になっていることを確認します
    ```
    flutter config --enable-macos-desktop
    ```
* 特定のプラットフォーム向けにビルドします。以下の例はmacOS向けです
    ```
    flutter build macos
    ```
  - ビルド完了後、`xxx.app`が生成されます
    
<img src="/images/flutter/010.png" alt="flutter">

* 上記で生成されたxxx.appはまだアプリケーションにすぎません。`.dmg`が必要な場合は、さらにパッケージ化する必要があります

  - プラグイン`create-dmg`を使用する必要があるので、`npm`でインストールします
    ```
    npm install -g create-dmg
    ```
  - 先ほどビルドしたxxx.appをパッケージ化します：
    - `--dmg-title`：ディスク上のインストールパッケージの名前を設定できます
      
<img src="/images/flutter/011.png" alt="flutter">

    ```
    create-dmg build/macos/Build/Products/Release/xxx.app --dmg-title="アプリケーション名" --overwrite
    ```

## IDEを使用してプロジェクトを実行する (Cursor/vscode)

* 別の記事に書きました、<a href="{{site.baseurl}}/flutter-use-cursor">参考にしてください</a> 
