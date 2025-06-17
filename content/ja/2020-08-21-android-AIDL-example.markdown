---
layout: post
title: '「[アプリ開発] AIDLを使ってAndroidアプリのクロスプロセス開発を始めましょう！」'
date: '2020-08-21 09:41:01 +0800'
image: cover/android-aidl-1.png
permalink: /android_aidl
tags:
  - Android
categories: AndroidDev
excerpt: >-
  作为一名アプリエンジニア、さまざまな要求に応える必要がありますが、アプリ間でプロセスをまたいでコミュニケーションを取る必要がある場合、どうすればよいでしょうか？
---

<h1 class="c-border-main-title">AIDL紹介</h1>
<div class="c-border-content-title-4">AIDLとは何ですか？
</div>

時々、AプロセスからBプロセスに通信したいことがあります。

その際、AIDLを使用して異なるプロセス間で通信することができます。

<div class="c-border-content-title-4">例えば:
</div>

1. 二つのアプリ間の通信に使用できます。

2. アプリとネイティブカーネル層との通信に使用できます (ただし、自分でAOSPをビルドし、作成したアプリケーションを低層に組み込む必要があります)。

3. またはアプリとサービスの通信などに使用できます。

さらに、AIDLは一般的なIPCソリューションです。

別の記事で一般的なIPCソリューションについて整理していますので、参考にしてください。

<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0">IPC 跨プロセスソリューションの共有</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">

          <a href="{{site.baseurl}}/2022/04/15/android-ipc-note/">

            <img src="/images/cover/android-ipc-method-share-1.png" alt="Cover" width="30%" >

            [問題解決シリーズ]Android IPC 跨プロセスソリューションの共有
          </a>
        </div>
    </div>
</div>

<h1 class="c-border-main-title">AIDL実装</h1>

<div class="c-border-content-title-1">ステップ1 : まずAIDLインターフェースを定義する 
</div>

* このステップでは、ノートブックに自由に書くことができます。

  またはIDEを使って書くこともできます（ここではAndroid Studioを使用しています）。

  文字が入力できる場所ならどこでも書くことができます。

  次に、AIDLで公開するインターフェースを定義します。

  例えば、全ての更新リストを取得する機能が欲しい場合、

  `getUpdateList`のようなインターフェースを作成します。

  ステータスを取得したい場合は`getStatus`のインターフェースを作成します。

  このようにして次々と定義します。

  ![1.png](/images/aidl/1.png)

* 最後に、拡張子を`.aidl`として保存します。

 ![11.png](/images/aidl/11.png)

<div class="c-border-content-title-1">ステップ2 : サービスを実装する
</div>

* 上記のAIDLインターフェースを完成させた後、

  一度ビルドする必要があります。

  CLIを使用することもできます。

  `./gradle build`でビルドするか、

  またはAndroid Studioの`Build > Rebuild Project`を使ってビルドします。

  ![12.png](/images/aidl/12.png)

* ビルドが完了すると、同じファイル名の.javaファイルが生成されます。

  ![13.png](/images/aidl/13.png)

* 通常、AndroidアプリでAIDLインターフェースを呼び出す際は、Serviceを使用します。

  そのため、まずServiceを継承し、必要なライフサイクルメソッドをオーバーライドします。

  例は以下の通りです：

  <script src="https://gist.github.com/waitzShigoto/7f7cbef82fc784a8d44544bf5cbaf55b.js"></script>

* 同じサービスに、先ほどビルドしたAIDLインスタンスを追加します：

<script src="https://gist.github.com/waitzShigoto/d7bdc13de183beebcda4add00ecf8458.js"></script>

<div class="c-border-content-title-4">Tips: AIDL インターフェース と Service パッケージパスは同じでなければコンパイルできません</div>

以下は3つの図です：

![3.png](/images/aidl/3.png)

![4.png](/images/aidl/4.png)

![5.png](/images/aidl/5.png)

<div class="c-border-content-title-1">ステップ3 : Manifest.xml に Service を追加
</div>
`ステップ2` で作成した Service を AndroidManifest.xml に追加し、action を追加します

<script src="https://gist.github.com/waitzShigoto/873470afaa8317265c25ac02fc8832b3.js"></script>

ここでの action は後で `ステップ5` で ServiceConnection でバインドするための action に対応しています

`action android:name="elegant.access.service.IRSSmartService"`

<div class="c-border-content-title-1">ステップ4 : Intent bind service を実装
</div>
* ここからは AIDL インターフェース + 実装を持つ AIDL インスタンス化されたサービスを他のプロセスのアプリケーションや他の層に提供できます

Android 内であれば、必要な場所で Intent を使用して起動できます

詳細は `ステップ5~7` を参照してください

<div class="c-border-content-title-1">(オプション) ステップ5-その他のユースケース
</div>
* アプリケーション層で AIDL Service を使用する場合は、以下のコードを参照してください

`Intent を使用してバインドする AIDL サービス`

<script src="https://gist.github.com/waitzShigoto/ab90b84bcdc96f98ec498045b68c57e5.js"></script>
その後、すでに実装されているメソッドを直接操作できます

例：

```
eleAcesAPI.getUpdateList();
```
* もし `アプリケーション層以外` で使用する場合

ここで `経験を共有` します：以前、プロジェクトでアプリケーション層で AIDL インターフェースを定義する必要がありましたが、実際の使用はフレームワークカーネル層に配置する必要がありました（たまたまそのプロジェクトは自分で OTA を行っていました）

したがって、もし同様の状況であれば、AIDL インターフェースを開くだけで十分です

これにより、`ステップ3` まで完了します

その後、実装する層が AIDL をサポートしているかどうかを確認してください

例えば：私が遭遇したプロジェクトは自分で OTA を行っていました

カスタムバインダーを定義できるため、C# を使用して AIDL インターフェースを持つサービスを作成しました

その後、アプリケーション層でバインドするだけです

ここではリフレクションを使用して

カーネルに作成されたサービスをバインドします

バインドの例：

<script src="https://gist.github.com/waitzShigoto/364a1289647d7676a7b51e35d21c4899.js"></script>

<div class="c-border-content-title-4">注意：これは下層を開発する必要がある場合にのみ使用してください。アプリで AIDL を実装する場合は前述のものを使用してください</div>
<div class="c-border-content-title-4">注意2：Android 公式は Android 9 以降で新しいリフレクションポリシーを更新しています。その時点での機種 OTA の対象バージョンが 5~8 だったため、これがまだ使用可能かどうかは不明です。自分でテストしてください</div>

<div class="c-border-content-title-1">(オプション) ステップ6-その他のユースケース：AIDL サポートされる型が限られています</div>

* プロジェクトに特定の戻り値が必要な場合があるため、例えばカレンダーなど

しかし、AIDL は元々このタイプをサポートしていないため、抽象層を追加して実装するだけで済みます

![9.png](/images/aidl/9.png)

<div class="c-border-content-title-1">(オプション) ステップ7-その他のユースケース：AIDL を Jar ファイルにパッケージ化
</div>
* 当時、groovy 構文を使用して直接 jar ファイルをビルドし、他のプロセスで使用できるようにしました

次のように行うことができます：

![10.png](/images/aidl/10.png)
