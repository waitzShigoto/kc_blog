---
layout: post
title: Compose Multiplatform 実践：AndroidとiOSシミュレータでCMPプロジェクトを実行
date: '2024-08-18 17:15:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-4
categories: CrossPlatform
excerpt: >-
  このシリーズのテーマはCompose Multiplatform
  実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。
---

## はじめに

`Compose Multiplatform (略称CMP)`

昨日、CMPプロジェクトの構築が完了したばかりです

プロジェクトをIDEに正常にインポートできた場合

以下のようなフォルダ構造が表示されます

<img src="/images/compose/032.png" alt="Cover" width="50%" /><br />

この時点で、コンパイルが可能かどうか確認できます

`正常に`コンパイルされた場合

以下のような画面が表示されます

シミュレータで実装されたアプリ画面が開き

右下にコンパイルの成功・失敗メッセージが表示されます

<img src="/images/compose/033.png" alt="Cover" width="65%" /><br />

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Androidシミュレータのインストール
昨日の記事：[Wizardを使ってCMPプロジェクトを作成](https://ithelp.ithome.com.tw/articles/10343416)の方法で作成した場合

基本的な`プロジェクト設定はすでに構成済み`です

基本的に、2日目の<a href="{{site.baseurl}}/posts/compose-multiplatform-day-2">CMP環境のインストール</a>で

システム環境が正しくインストールされていることを確認するだけです

例えば、JDK、Kotlinなど

<img src="/images/compose/034.png" alt="Cover" width="50%" /><br />

次に、コンピュータ上でシミュレーションする場合

Androidシミュレータを作成する必要があります

上部システムバーの`Tools > Device Manager`をクリックします

<img src="/images/compose/035.png" alt="Cover" width="35%" /><br />

右側に`Device Manager`ウィンドウが表示されます

<img src="/images/compose/036.png" alt="Cover" width="50%" /><br />

上部の`+`をクリックし、`Create Virtual Device`を選択します

<img src="/images/compose/037.png" alt="Cover" width="50%" /><br />

作成したい`Androidシミュレータ`を選択するウィンドウが表示されます

Phone、Tablet、TV、Watch、Automotiveなどがあります

Android Studioは後期に主に`Google`によって維持されているため

Google Pixel OSを搭載したAndroid Phoneの`AVD(Android Virtual Device)`をダウンロードできます

もちろん、`Pixel AVDのイメージファイル`はAndroid Developer公式サイトからもダウンロードできますが

Googleはそれを親切にIDEに統合してくれています

<img src="/images/compose/038.png" alt="Cover" width="65%" /><br />

希望のPhoneを選択し、右下の`Next`をクリックします

Android SDKの選択画面に進みます

テストしたいSDKに応じて選択します

以前にダウンロードしていないSDKは

グレー表示され、右側にダウンロードアイコンがあります

ダウンロード完了後に選択できるようになります

`Next`をクリックすると、シミュレータの設定ができます

方向、ネットワーク、起動設定、RAMサイズ、SDKサイズなどを設定できます

選択後、右下の`Finish`をクリックします

<img src="/images/compose/039.png" alt="Cover" width="65%"/><br/>

<div class="c-border-content-title-1">IDEを使用してAndroid Appをビルド</div>
上部で先ほど作成したシミュレータを選択し

上部の`プロジェクト実行`ボタン（緑色の再生ボタンのようなもの）をクリックして、IDEにビルドしてもらいシミュレータにインストールします

<img src="/images/compose/040.png" alt="Cover" width="50%"/><br/>

## 手動でAndroid Appをビルド
<div class="c-border-content-title-1">ターミナルで以下のコマンドを実行してAPKをビルド</div>

>  run `./gradlew :yourComposeAppProjectName:assembleDebug`

`yourComposeAppProjectName`はあなたが作成したプロジェクトの名前です
`assembleDebug`はデバッグバージョンをビルドすることを意味します

`.apk`ファイルは`yourComposeAppProjectName/build/outputs/apk/debug/yourComposeAppProjectName-debug.apk`にあります

<div class="c-border-content-title-1">手動インストール</div>
2つの方法があります

1.APKをシミュレータにドラッグ＆ドロップ

2.コマンドを使用してインストール（`実機`でadbを使用する場合は、開発者モードを有効にする必要があります）

```
adb install ../xxx/yourComposeAppProjectName-debug.apk 
```

## iOSシミュレータのインストール

2日目の<a href="{{site.baseurl}}/posts/compose-multiplatform-day-2">CMP環境のインストール</a>時に

Xcodeがインストールされていることを確認します

Android Studioの画面上部にある`Androidの小さな緑色の人形`アイコンの場所をクリックします

ドロップダウンメニューが表示されます

このセクションはプロジェクトで設定された`Configuration`が統合されています

`Build Android app`、`Build iOS app`、または一部の`gradle task`などがあります

<img src="/images/compose/041.png" alt="Cover" width="50%"/><br/>

初めて`Android Studio`で`iOS app`を実行する場合

デフォルトのBuild iOS Configurationがない可能性があります

そのため、`Edit Configuration`をクリックして設定します

`左上の+をクリック` > `iOS Application`

<img src="/images/compose/042.png" alt="Cover" width="50%"/><br/>

その後、必要に応じて設定できます

a. タスクの名前を設定

b. Xcode project fileの右端のフォルダアイコンをクリック

c. 表示されるファイル選択ダイアログで`.xcodeproj`のパスを選択

（`.xcodeproj`を選択してopenをクリック）

<img src="/images/compose/043.png" alt="Cover" width="50%"/><br/>

d. .xcodeprojパスを選択すると

IDEは自動的に内部の`scheme`と`configuration`を読み取ります

そのため、あとは目的の`iOS emulator`バージョンとモデルを選択するだけです

<img src="/images/compose/044.png" alt="Cover" width="50%"/><br/>

e. Build Configurationを先ほど作成した設定に変更し

`実行ボタン`をクリックします

<div class="c-border-content-title-1">Xcodeを使用してiOS Appをビルド</div>
CMPはrootフォルダ直下にiOSプロジェクトを作成するため

XcodeでCMPプロジェクト配下の`iOSApp`フォルダを直接開くだけで

Xcodeを使ってiOSAppを直接ビルドできます

## まとめ
これでCMPプロジェクトを完全にビルドし、AndroidとiOSシミュレータで実行できるようになりました

<img src="/images/compose/015.png" alt="Cover" width="50%"/><br/>
明日は

CMPのプロジェクト構造といくつかの一般的な問題について紹介したいと思います
 
