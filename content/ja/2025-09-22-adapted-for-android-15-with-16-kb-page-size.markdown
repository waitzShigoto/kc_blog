---
layout: post
title: 'Android 15の16 KB PAGE SIZEに対応'
date: '2025-09-22 10:12:25 +0800'
image: cover/default-cover.jpg
tags:
  - Android
  - Kotlin
permalink: /adapted-for-android-15-with-16-kb-page-size
categories: Android
excerpt: >-
  2025年11月1日より、Google PlayにアップロードするAndroid 15+デバイス向けアプリは16KB page sizeをサポートする必要があります...
---

## 2025年11月1日より、Google PlayにアップロードするAndroid 15+デバイス向けアプリは16KB page sizeをサポートする必要があります
<img src="/images/android15/014.png" alt="mcp">
<a href="https://android-developers.googleblog.com/2025/05/prepare-play-apps-for-devices-with-16kb-page-size.html">原文</a>

## アプリが16KB page sizeの要件を満たしているかを確認する方法
<div style="font-size: 1.5rem; font-weight: bold;">方法1: Google Play Consoleチェック方法</div>

`.aar`を`Google Play Consoleバックエンド`にアップロードした後、ページ下部でチェック結果を確認できます<br>
（現在はアップロードに必須ではなく、早期チェック用と推定されます）

<img src="/images/android15/015.png" alt="mcp">

要件を満たしていない場合、`This app version only targets 32 bit devices and does not need to support 16 KB`というプロンプトが表示されます
<img src="/images/android15/016.png" alt="mcp">

<div style="font-size: 1.5rem; font-weight: bold;">方法2: zipalign</div>

公式推奨方法はcmd `zipalign`を使用して.soのアライメントを確認します<br>
コマンドを使用：
`zipalign -c -P 16 -v 4 APK_NAME.apk`<br>
通過すると検証成功が表示されます
<img src="/images/android15/017.png" alt="mcp">
    
----
<div style="font-size: 1.5rem; font-weight: bold;">方法3: Android Studioのアナライザー</div>

`apk`をAndroid Studioのウィンドウにドラッグ&ドロップします<br>
`apk`を解析してくれます<br>
例えば下図では、`x86_64`でアライメントされていないことが表示されます：<br>

<div style="font-size: 1.5rem; font-weight: bold;">アライメントされていない例1</div>

<img src="/images/android15/018.png" alt="mcp">
<img src="/images/android15/019.png" alt="mcp">

----
<div style="font-size: 1.5rem; font-weight: bold;">
    方法4: .soファイルが16KBにアライメントされているかチェックするスクリプトを書く
</div>

```agsl
#!/bin/bash

# usage: alignment.sh path to search for *.so files

dir="$1"

RED="\e[31m"
GREEN="\e[32m"
ENDCOLOR="\e[0m"

matches="$(find $dir -name "*.so" -type f)"
IFS=$'\n'
for match in $matches; do
  res="$(objdump -p ${match} | grep LOAD | awk '{ print $NF }' | head -1)"
  if [[ $res =~ "2**14" ]] || [[ $res =~ "2**16" ]]; then
    echo -e "${match}: ${GREEN}ALIGNED${ENDCOLOR} ($res)"
  else
    echo -e "${match}: ${RED}UNALIGNED${ENDCOLOR} ($res)"
  fi
done
```

`スクリプト`を使用してビルドキャッシュフォルダ下の.soファイルを各[ABI](https://developer.android.com/ndk/guides/abis?hl=zh-tw)でのパフォーマンスをチェックします

このフォルダ（または他のカスタム.soフォルダ）でこのスクリプトを使用します：<br>
```java
..//Your Project Name/Your Project modele/build/intermediates/stripped_native_libs/channelDebug/stripChannelDebugDebugSymbols/out/lib
```

<div style="font-size: 1.5rem; font-weight: bold;">例：</div>

armeabi
<img src="/images/android15/020.png" alt="mcp">
armeabi-v7a
<img src="/images/android15/021.png" alt="mcp">
x86
<img src="/images/android15/022.png" alt="mcp">

arm64-v8a
<img src="/images/android15/023.png" alt="mcp">

x86_64
<img src="/images/android15/024.png" alt="mcp">


----
<div style="font-size: 1.5rem; font-weight: bold;">方法5: エミュレーターで16KB PAGE SIZEクラッシュを検証</div>

これは追加の保険のようなものです<br>
または最初に簡単なテストをしたい場合<br>
アプリを16KB page sizeエミュレーターに直接インストールできます<br>
Android StudioのAVDで見つけることができるはずです<br>
（ただし、エミュレーターは順次実行されます - 一つの問題を解決してから次が表示されます）<br>

例：16 KB page sizeデバイスでアプリを実行して特定の`.so`クラッシュ問題に遭遇：
<img src="/images/android15/025.png" alt="mcp">


----
<div style="font-size: 1.5rem; font-weight: bold;">上記の方法で遭遇する可能性のある状況</div>
実験過程で<br>
公式推奨の方法を使用しても<br>
またはapkを手動でASに投げて検証しても<br>
画面では成功と表示されるが<br>
別の方法では異なる結果が表示される可能性があることがわかります<br>
ここに記録しておきます<br>
皆さんの参考になれば：<br>

1. `zipalign`コマンドを使用し、-Pを16に設定<br>
   検証はすべて成功と表示されますが、実際に他の方法でテストすると成功しない可能性があります<br>
   <img src="/images/android15/026.png" alt="mcp">
   <img src="/images/android15/042.png" alt="mcp">

2. AS内蔵`アナライザー`<br>
   異なるABIで異なるアライメントレベルがあります<br>
   ただし、実際にmmkvを16KBサポート版に調整した後<br>
   再度アナライザーに投げても`まだmmkvがアライメントされていないと表示`<br>
   しかし実際に16KBエミュレーターで実行すると`もうクラッシュしません`<br>
   または`スクリプト`で実行してもアライメント済みと表示されます<br>

3. `スクリプト`を使用してELFが2^14 || 2^16にアライメントされているかチェック<br>
   異なるABIアーキテクチャで異なるアライメントレベルがある可能性があります<br>
   しかし、これは公式の最終要件がどのアライメントかによります<br>
   現在主流は`x86_64`と`arm64-v8a`のはずです<br>
   GCPバックエンドの検証は現在この2つのABIのみを検証しているようです<br>
   （将来公式が要求すれば各ABIを最適化することもできますが、そうでなければアップロードのために最適化すべきものを最適化すれば良いです）<br>
   


## 後記：遭遇したサードパーティライブラリ内の.soファイルがアライメントされていない例の記録
#### mmkv

* クラッシュログ
```
Process: com.xxx.xxxxxxxxx, PID: 5910
java.lang.UnsatisfiedLinkError: dlopen failed: empty/missing DT_HASH/DT_GNU_HASH in "/data/app/~~GDguKzQkEWWU7nKgxukJ3g==/com.xxx.xxxxxxxx-LLLvOX6N3NINoK5qFkhyxQ==/base.apk!/lib/arm64-v8a/libmmkv.so" (new hash type from the future?)
```
* 解決方法：
  `方法1`. 公式GitHubで関連設定を変更し、自分で16KB版の.aarをビルド
  その後、元のimplementの場所を自分でビルドした内容に変更
  <br>`方法2`. `1.3.14`バージョンにアップグレード、テスト後正常動作
  <br>`方法3`. 公式が`Oct 22, 2024`に`2.0.0`を更新して16KBをサポート
  関連参照を2.0.0以上に更新
  <br><a href = "https://github.com/Tencent/MMKV/releases/tag/v2.0.0">公式リリースノート参照</a>

* <a href = "https://github.com/Tencent/MMKV/issues/1353">ディスカッションスレッド参照</a>
  

#### sqlcipher
* クラッシュログ
```json
pid: 8796, tid: 8891, name: pool 1  >>> com.xxx.xxxxxxxxxx <<<
2025-05-21 14:29:47.380  8901-8901  DEBUG                   pid-8901                             A        #02 pc 0000000000006700  /data/app/~~p4bSI2XwdSmTfm3vZluhdw==/com.sand.airdroidkidp-9wKFuA4x7Jclg5hVTLRBSA==/base.apk!libtnet-3.1.14.so (offset 0x5504000) (BuildId: 2510ff56a9673370b9d664c21a3dcb04a541d939)
2025-05-21 14:29:47.380  8901-8901  DEBUG                   pid-8901                             A        #03 pc 00000000000060c4  /data/app/~~p4bSI2XwdSmTfm3vZluhdw==/com.sand.airdroidkidp-9wKFuA4x7Jclg5hVTLRBSA==/base.apk!libtnet-3.1.14.so (offset 0x5504000) (JNI_OnLoad+76) (BuildId: 2510ff56a9673370b9d664c21a3dcb04a541d939)
```

* `解決方法`：新バージョンに移行<br>
  公式GitHubリポジトリ：[sqlcipher-android](https://github.com/sqlcipher/android-database-sqlcipher)<br>
  移行ドキュメント：[こちらをクリック](https://www.zetetic.net/sqlcipher/sqlcipher-for-android-migration/)<br>


#### xCrash

* この問題で遭遇したログ
    ```json
    2025-06-03 11:14:11.095  6505-6505  xcrash com.xxx.xxxxxx E  NativeHandler System.loadLibrary failed (Ask Gemini)
    java.lang.UnsatisfiedLinkError: dlopen failed: empty/missing DT_HASH/DT_GNU_HASH in "/data/app/~~NKxgZmiW0fnAnkqxbM6pmg==/com.xxxxxx.xxxxx-TBH_eXBREJRiwzaa0oJFsQ==/base.apk!/lib/arm64-v8a/libxcrash.so" (new hash type from the future?)
    ```

* 実テスト`解決方法`、自分でaarをビルド
    - プロジェクトをクローン：[Githubリポジトリ](https://github.com/iqiyi/xCrash)
    - プロジェクト内の`CMakeList.txt`に2^14 || 2^16 MaxSizeの関連フィールドを追加、例：
       <img src="/images/android15/027.png" alt="mcp">
       <img src="/images/android15/028.png" alt="mcp">

    - NDK関連環境をインストール、元のプロジェクトは`21.3.6528147`を使用、ローカルインストール後にbuild failedが発生したので、近いバージョンを試す
       <img src="/images/android15/029.png" alt="mcp">

* NDKインストール方法
    - インストール済みNDKをリスト表示
    ```groovy
    ls -la ~/Library/Android/sdk/ndk/
    ```
    - インストール済みNDKターゲットバージョンが正常にビルドできるかチェック
    ```groovy
    ~/Library/Android/sdk/ndk/[your_version]/ndk-build --version
    ```
    - ダウンロード可能バージョンを表示
    ```groovy
    ~/Library/Android/sdk/tools/bin/sdkmanager --list | grep ndk
    ```
    - 指定NDKをインストール
    ```groovy
    ~/Library/Android/sdk/tools/bin/sdkmanager --install "ndk;25.2.9519653"
    ``` 
    JDKバージョンが新しすぎてダウンロードできない可能性があります、環境のJDKを`8に戻してダウンロード`

    - xCrashの.aarビルドを開始、以下のコマンドは主にclean > build > checkstyleを実行、自分で組み合わせ可能、主にbuildを実行
    ただし調整過程でbuild failedに遭遇した場合、これを使ってチェックできます
    ```
    ./gradlew clean :xcrash_lib:build -x checkstyle --rerun-tasks
    ```
* 遭遇する可能性のある問題
    - `./gradlew :xcrash_lib:build`使用時に遭遇：`checkstyle`を入力しなくてもcheckstyleが実行され、`AnrHandler.java`のjava ifにスペースが不足していることが検出されましたが、元のクローンがそうだったので、後でスペースを追加すれば解決
    ```
    > Task :xcrash_lib:checkstyle FAILED
    [ant:checkstyle] [ERROR] ../xcrash/AnrHandler.java:144:9: 'if' is not followed by whitespace. [WhitespaceAfter]
    ```

* .aarで元のxCrashを置き換え、`置き換え後`書いた./agliment.shでチェックすると`アライメント済みと表示`
   <img src="/images/android15/030.png" alt="mcp">
   しかし`実際に16KBデバイスではまだエラーが報告`

* 回避方法
    - 16 KB pages sizeデバイスで実行できるかテストしたいが、Google Play Consoleにはアップロードしないので、build configをintlに切り替えてテスト可能
      <img src="/images/android15/031.png" alt="mcp">

#### Umeng
* libtnet.soクラッシュ問題に遭遇
* ただしGPCにもアップロードしないので、回避方法でテスト可能、intlに切り替えてビルド
  <img src="/images/android15/032.png" alt="mcp">
#### AMap（高德地図）

* `implementation`方式で`amap`をインポート<br>
その後16KBチェック`../str/c/stripChannelDebugDebugSymbols/out/lib`を実行
 
  <img src="/images/android15/033.png" alt="mcp">
  アライメントされていないことがわかります
  <img src="/images/android15/034.png" alt="mcp">

* `公式サイト`から[ダウンロード](https://lbs.amap.com/api/android-sdk/download)した最新版SDKを試用
  つまり`.jar`を使用するように変更
  <img src="/images/android15/035.png" alt="mcp">
  <img src="/images/android15/036.png" alt="mcp">
  <img src="/images/android15/037.png" alt="mcp">
  正常にビルドでき、16 KB page sizeデバイスで実行可能
    - `../str/c/stripChannelDebugDebugSymbols/out/lib`下の`.so`を再チェックすると消失
      <img src="/images/android15/038.png" alt="mcp">
      しかし公式の`.so`を直接チェックするとまだアライメントされていません
      （これはダウンロードした.zipを解凍後）
      <img src="/images/android15/039.png" alt="mcp">
      または公式の.aarを直接使用して中の.soを抽出してもアライメントされていません
      <img src="/images/android15/040.png" alt="mcp">
* 現在mvnの最新amapバージョンをチェックしても、公式サイトの最新バージョンはまだありません
* オープンソースのソースコードも見つかりません
* 16 KB page sizeで遭遇
  <img src="/images/android15/041.png" alt="mcp">

* 後に、これは自分では解決できないことがわかりました。公式がソースコードをオープンソース化していないため、自分でビルドして回避策を作ることができません
そのため公式のアップデートを待つしかありません