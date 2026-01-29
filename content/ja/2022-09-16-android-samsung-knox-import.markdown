---
layout: post
title: より安全なAndroidアプリを作成する！ Samsung Knox SDKの簡単な導入方法を学ぶ
date: '2022-09-16 14:41:08 +0800'
image: cover/samsung-android-knox-1.png
tags:
  - Android
  - Debug
  - Samsung
  - knox
categories: AndroidDev
---

## Samsung Knox SDK はセキュリティソリューションです

<div class="c-border-content-title-4">
  さまざまなセキュリティ制御および管理オプションを提供し、企業が機密データやアプリケーションを簡単に保護できるようにします。
  開発者はアプリケーションに以下の機能を実装できます：
</div>
<p class = "table_container">
  <b>セキュアコンテナ</b>：企業データやアプリケーションを分離して保護し、不正アクセスを防止します。

  <b>VPN</b>：安全なVPN接続を確立し、ネットワークトラフィックやデータを保護します。

  <b>暗号化</b>：データを暗号化し、転送中のセキュリティを確保します。

  <b>ポリシー管理</b>：パスワードルール、デバイスロック、データ消去などのデバイス設定やポリシーを管理します。

  <b>認証</b>：生体認証やスマートカード認証などの強力な認証機能を実現します。

  <b>セキュリティアップデート</b>：アプリケーションやオペレーティングシステムを安全に更新し、全体的なセキュリティを向上させます。

  この記事では主に

  Samsung Knox SDK 導入時の基本的な概念

  および<b>遭遇した問題</b>を共有します

</p>

## 前導

* 現在サポートされているSamsungの携帯電話とバージョン：[参考](https://www.samsungknox.com/en/knox-platform/supported-devices)
  - Knoxをサポートしていない場合、公式が提供する推奨方法：[参考](https://docs.samsungknox.com/admin/fundamentals/faqs/kba-349-about-android-others-android-go-devices.htm)
  - 各Knoxサービス：[参考](https://docs.samsungknox.com/admin/knox-admin-portal/welcome.htm)
* Knox SDKのダウンロードとインストール
  - 公式サイトに従って[SDKをインストール](https://docs.samsungknox.com/dev/knox-sdk/install-sdk.htm)し、関連するSDKをプロジェクトに導入します
  - 導入時にどのバージョンを使用するかは[mapping表](https://docs.samsungknox.com/dev/common/knox-version-mapping.htm)を参照してください
  - [ライセンスキー](https://docs.samsungknox.com/dev/common/tutorial-get-a-license.htm)を取得する必要があります
     - Knox 2.7以前のバージョンを開発している場合、生成されたライセンスキーは後方互換のキーを「選択」できます
     - ライセンスキーは `Development Key` と `Commercial Key` に分かれており、`テスト`または`リリース`に応じて設定できます
     - 関連するapk：関連するapkのみが生成されたライセンスキーを使用できます
     `(バックエンドにはオプションの選択肢があり、関連付けるかどうかを選択できます)`
     - 実際のテストでは、`Development Key` は同じアカウントで1つしか持てません
     -> [ライセンスキーのルールと制限](https://docs.samsungknox.com/dev/common/knox-licenses.htm)
  - 開発時にライセンスキーをアクティブ化する方法はKnoxのバージョンによって異なります : [こちらを参照](https://docs.samsungknox.com/dev/knox-sdk/tutorial-activate-license.htm)
  - Knox開発に関する公式のサンプル：[参考](https://docs.samsungknox.com/dev/knox-sdk/tutorial-overview.htm)

  * Knoxライセンス
    - [ライセンスの利用可能な権限リスト](https://docs.samsungknox.com/dev/common/license-permissions.htm)
    - [ライセンスの3つの比較表](https://docs.google.com/spreadsheets/d/1Os01grTu-vDTVm5SL8VVn1QZ4NH_3gbHDT9ILAGhiEM/edit?usp=sharing)
    - バックエンドの実際のテストでは、SDKライセンスキーはさらに細分化されています：
        - `KPE Development` : テスト環境用、キーの有効期間は`0.5年`
        - `KPE Standard`: Standard permissionsへのアクセスを許可、10,000,000シート、キーの有効期間は`2年`
        - `KPE Premium`:  Standard, Premium, and Custom permissionsへのアクセスを許可、10,000,000シート、キーの有効期間は`2年`
        - `KPE DualDAR`:  Standard, Premium, Custom and DualDAR permissionsへのアクセスを許可、代理店と交渉して年数または永久サブスクリプションを決定
    - 開発権限の宣言：
        - `Knox 3.0` は一部の権限を宣言することを提供し、AndroidManifest.xmlでKnox権限を宣言できます。宣言しない場合、デフォルトですべてのKnox権限が有効になります。宣言した場合、宣言された権限のみが使用可能です。[参考](https://docs.samsungknox.com/dev/common/tutorial-knox-permissions.htm)

  * 現在のネイティブプロジェクトで使用されているDevicePolicyManagerとの初期比較 (類似APIのみを先に比較し、`使用したいものを議論し、実際の動作をテストする`)
    - すべての権限は[こちら](https://docs.google.com/spreadsheets/d/1Os01grTu-vDTVm5SL8VVn1QZ4NH_3gbHDT9ILAGhiEM/edit?usp=sharing)で確認できます
    - 実際の比較`一般的なDevicePolicyManager`とKnoxが提供する機能の参考
    <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ09cQTkBr3L2di8b886ZcjEA9FMlv0trg90SgQFMg4okJx3YERuAXBNDtdSzmVRdxmSXxWMdchBaXL/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false" height="700"
       width="80%"></iframe>

  * 参考リンク
    - [Samsung Knox開発者公式サイト](https://developer.samsungknox.com/#)
    - [開発者ドキュメント公式サイト](https://docs.samsungknox.com/dev/index.htm)
    - [Knox SDK紹介](https://docs.samsungknox.com/dev/knox-sdk/index.htm)
    - [Knox APIドキュメント](https://docs.samsungknox.com/devref/knox-sdk/reference/packages.html)

## Knoxアーキテクチャ開発者ドキュメント

  - Samsung Knoxはwebベースとデバイスベースの2つの方法で使用でき、現在のアーキテクチャは以下の通りです：  
   <img src="https://docs.samsungknox.com/dev/common/images/knox-ecosystem.png" width="60%"/>

## ライセンスアクティベーションノート
   * Android 6.0.1 Samsung S6、テスト`Knox 3.8`
     - Samsung開発者バックエンドからKnox 3.8版をダウンロードし、使用方法は[knox3.7.1以上](https://docs.samsungknox.com/dev/knox-sdk/tutorial-activate-license.htm)を参照、URI解析時に例外が発生
     - [knox2.7以下](https://docs.samsungknox.com/dev/knox-sdk/tutorial-activate-license.htm)を使用すると`java.lang.RuntimeException: Stub!`が発生

       -> 解決方法：`supportlib.jar`を追加し、gradle dependenciesに追加

       `IDEのAdd as library機能を使用する場合、以下に注意`：
       Knox SDKとsupportlibの2つのjarファイルを以下のように変更する必要があり、ランタイムエラーが発生しなくなります
       <script src="https://gist.github.com/waitzShigoto/fefe8c4005184dbaecf0d20645709ba8.js"></script>

     - 上記が成功した後、ライセンスキーをアクティベートする際に、admin権限を有効にしないと`internal error`が返されます

       <script src="https://gist.github.com/waitzShigoto/a3880c775ce2a8617ffc8dde47bfb865.js"></script>

     - ここに罠があります。ライセンスをアクティベートする際には、Boardcastを使用して結果を受け取る必要があります
         - しかし、現在の公式ドキュメントでは、Knoxのライセンスアクティベーションのブロードキャストアクションは以下のように表示されています
           <script src="https://gist.github.com/waitzShigoto/878e1a32ea9ab7b614afd68969ed5b30.js"></script>
          しかし、旧版のKnox APIレベル19 (Knox 2.6)では、実際にはKnoxは上記のアクションを発行せず、以下のようになります
           <script src="https://gist.github.com/waitzShigoto/9cdd580d99d2d89d2e2f57430b1c9a4d.js"></script>
         - ここで公式が言っているのは[2.xから3.xへのアップグレード時にnameSpaceが変更された](https://docs.samsungknox.com/dev/knox-sdk/new-intent-names.htm)ということです (Knox API 30から変更されました)

         - そこで彼は方法を提供しています：[参考](https://docs.samsungknox.com/dev/knox-sdk/support-older-devices.htm)
            - `supportlib.jar`を追加し、上記リンク内の関連レシーバーを`Manifest.xml`に追加します。

* Android 12 Samsung A52s、テスト`Knox 3.8`

  - `knox3.7.1 higher`と`knox2.7 lower`の方法を使用してライセンスキーを有効にすることができます。

* その他の動作
  - 開発者バックエンドで現在ダウンロード可能なKnox SDKは3.3〜3.8です。

    上記のテストケースはすべてKnox 3.8でコンパイル可能ですが、

    一部の動作は対応するバージョンのみをサポートしている可能性があります。

    後にAndroid 12でKnox 3.3をテストしましたが、

    この時に`knox3.7.1 higher`をアクティブにするとクラッシュします。

    Android 6.0.1でKnox 3.8を使用して`knox3.7.1 higher`をアクティブにしても同様にクラッシュします。

## 開発中に遭遇した事例と研究

 * Vpn開発
   - 開発ドキュメントによると、2つのVpnソリューションが提供されています。
       1. 以前研究したネイティブの Android Vpn Service に似ています。
       Knoxはこれを基に関連機能を拡張しています：[参考](https://docs.samsungknox.com/dev/knox-sdk/vpn-integrate-apps.htm)

       2. もう一つは[GenericVpnPolicy API](https://docs.samsungknox.com/devref/knox-sdk/reference/com/samsung/android/knox/net/vpn/GenericVpnPolicy.html)です。

       `createVpnProfile`では、対応するJSON形式を提供してvpnプロファイルを設定します。

       異なるJSON形式が異なるモードに対応します。

       参考：[vpn JSON形式](https://docs.samsungknox.com/dev/knox-sdk/VPN-json.htm)
       -> 現在のKnoxドキュメントと以前の要件に類似しているものには、

       ipsec Hybrid RSA、PSK、xauth RSA、IKE2 PSK、IKE2 RSAなどがあります。

       また、ドキュメントには`Knox api level 35 Deprecated`と記載されています -> `Android 12`に対応。

 * ロック画面のパスワード
   - 生体認証の設定、指紋認証や顔認証：[こちらをクリック](https://docs.samsungknox.com/dev/knox-sdk/biometrics.htm)

## 実際の開発でライセンスとKnox権限を有効にする方法の共有
  実際にKnoxを有効にする方法は、公式ドキュメントの方法を参照するだけで十分です。

  ここでは、私が計画した思考を皆さんに提供します。以下の通りです：
 - 現在、これをdagger2モジュールとしてパッケージ化しています。
  - 構造は以下の図の通りです：

  ![knox_module.png](/images/others/knox_module.png)
      - `ExampleKnoxActivity`はデモ用で、他のクラスの実装例を含みます。
      - その後、`KnoxManager`をインジェクトし、`KnoxModule`を初期化するだけで使用できます。

      ![knox_inject_01.png](/images/others/knox_inject_01.png)

      ![knox_inject_02.png](/images/others/knox_inject_02.png)

      - `KnoxLicense`にはいくつかの定数とキー値が含まれており、後で変更可能です。将来的にキーをアップロードしない場合も調整可能です。
      - 実際の使用では`KnoxManager`を理解するだけで十分です。
      - 主にKnoxのブロードキャストの登録/解除、ライセンスの有効化/無効化などの機能を追加しました。
        今後は主に`KnoxManager`から関連する機能を追加します。
      - `KnoxLicenseReceiver`は、公式のKnox 3.7以下ではボードキャスト方式のみでアクティベーションの成否を受信します。

      ここではKotlinの特性を利用してパッケージ化しています。

      実際の使用では、knoxManager内のメソッドを使用して登録し、結果を返します。

      ![knox_inject_03.png](/images/others/knox_inject_03.png)

`理論的にはKoinをDIとして使用することも可能で、個人的にもKoinが好きです。後ほど、KoinでのDIについての記事を書く予定です。`

* Knoxのパーミッションを追加
  - パーミッション宣言をmanifestに追加
    ![knox_permission.png](/images/others/knox_permission.png)
  - Knox API 30は新旧パッケージ名の境界線です。

    今回の実験では、Knox API 19では新しいパーミッションリクエストは使用できませんでした。例えば：

    `com.samsung.android.knox.permission.KNOX_APP_MGMT` 

    `com.example.supportlibclient.SUPPORT_PERMISSION`を使用して成功しました。

  - ランタイムパーミッション
    ![knox_run_time_permission_01.png](/images/others/knox_run_time_permission.png)

* その他の関連事項

  一部のAPI操作には対応するURIの解析が必要です。ここでは共通のものを取り上げます。

  ![knox_constant.png](/images/others/knox_constant.png)
