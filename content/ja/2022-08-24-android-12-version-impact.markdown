---
layout: post
title: "Android 12 開発におけるバージョン差異への対応方法：重要なコツを公開！"
date: 2022-08-24 14:39:48 +0800
image: cover/android-version-adaptation-12-1.png
tags: [Android,Debug,ota,aosp]
categories: SDK升級
excerpt: "この記事では、Android 12 バージョンアップによる開発の課題とその解決策について紹介します。いくつかの重要なコツを共有することで、開発者がバージョン差異に対処する際に役立つ情報を提供し、スムーズに開発タスクを完了できるよう支援します。"
---

<p class="table_container">
  この記事では、私の開発経験を共有し、

  Android バージョンアップによる課題とその解決策について探ります。

  私が直面した問題を分析することで、

  開発プロセスで同様の問題に直面した際に役立つ洞察を提供できればと思います。

  公式の変更点を確認したい場合は、

  直接
  <a href="https://developer.android.com/about/versions/13/changes/battery#restricted-background-battery-usage" target="_blank">
    Android Developer をご覧ください</a>
</p>

## Android 12 に影響を受ける機能
<div class="c-border-content-title-4">
   Android 12以上 新しいOSカメラとマイクの権限スイッチ
</div>
  - ユーザーはスタートバー内のクイックボタンや設定内の`カメラまたはマイクのアクセス権`のスイッチを使用してオン/オフを切り替えることができます
  - カメラの使用体験に影響を与える可能性があります。

  カメラの権限をオンにしても、

  ユーザーがカメラのアクセス権をオフにすると、

  カメラは黒い画面を表示します。

  マイクも同様です:[参考](https://developer.android.com/training/permissions/explaining-access#toggles)

  - 現在、システムがサポートしているかどうかを検出するためのコードがあり、ユーザーに通知することができますが、オンになっているかどうかを判断するAPIはまだ見つかっていません。
  <script src="https://gist.github.com/waitzShigoto/c7469603bb0f6b6b533447c7d7c9e0cf.js"></script>

  <div class="c-border-content-title-4">
     Android 12以上 ACTION_CLOSE_SYSTEM_DIALOGS が廃止されました:  
     <a href="https://developer.android.com/about/versions/12/behavior-changes-all#close-system-dialogs" target="_blank">参考</a>
  </div>
   - しかし、Android 13では`アクセシビリティ権限`をオンにすると、ACTION_CLOSE_SYSTEM_DIALOGS を送信できますが、オフにするとこのブロードキャストは受信されません。

   <div class="c-border-content-title-4">
      Android 12以上 スプラッシュ画面にデフォルトの起動画面が追加されました
      <a href="https://developer.android.com/guide/topics/ui/splash-screen/migrate" target="_blank">このページのチュートリアルで新しいスプラッシュ画面に移行できます</a>
   </div>

   - 以下のようにデフォルトのアイコンの起動画面が追加されました

     ![android12_splash_icon.gif](/images/others/android12_splash_icon.gif)
   - 実際にテストしたところ、このデフォルトのスプラッシュ画面を削除する方法は提供されていません。

     以前のカスタムActivityを削除しても画面は表示されませんが、以前のサイクルは実行されます。

     公式も新しいスプラッシュ画面に関するいくつかの仕様を提供しています:<a href="https://developer.android.com/guide/topics/ui/splash-screen#elements" target="_blank">参考</a>

   - 調整方法：

     - `implementation 'androidx.core:core-splashscreen:1.0.0'`をbuild.gradleに追加します

     ここで注意すべきは、min sdkの要件が21以上であることです

     ![android12_splash_min_sdk.png](/images/others/android12_splash_min_sdk.png)
     - 新しいスプラッシュ画面のテーマを設定します
     <script src="https://gist.github.com/waitzShigoto/dd55d7b2cb70cedf158763083390d426.js"></script>
      `windowSplashScreenBackground`は背景色で、実際に設定できるのは@colorのみです

      `windowSplashScreenAnimatedIcon`は中央の円形ビューのアイコンで、画像を設定できますが、サイズは公式が発表したものに従う必要があります

      `windowSplashScreenBrandingImage`はアイコンの下にある小さな背景画像です

      `windowSplashScreenAnimationDuration`はアニメーションの時間です

      <a href="https://developer.android.com/guide/topics/ui/splash-screen#set-theme" target="_blank">その他の属性</a>
      

     - 新しいSplashThemeを`AndrodManifest.xml`に追加

     - 初期コードを追加
     <script src="https://gist.github.com/waitzShigoto/7799d22f3d2839965678d9f75435bda5.js"></script>

     `SplashScreen.installSplashScreen(this)`は`super.onCreate`の前に必要

     `splashScreen.setKeepOnScreenCondition(() -> true );`

     この行は、元の古いアクティビティ画面を表示しないが、アクティビティのライフサイクルは実行されるようにします

     ただし、この方法は新しい公式のスプラッシュを使用するため、元のカスタマイズされた画面は表示されません。ここは各`プロダクトオーナー`が自行考量してください

  <div class="c-border-content-title-4">
    Android target sdk 12以上では、intent-filterにandroid:exportedの値が宣言されていないとインストールできない可能性があります
  </div>

  - 図のように、コンパイル後にインストールしようとすると、次のような`INSTALL_PARSE_FAILED_MANIFEST_MALFORMED`エラーが表示されます
   ![android12_exported_crash.png](/images/others/android12_exported_crash.png)

  - また、PendingIntentを使用する場合も対応するフラグを追加しないとエラーが発生します：
    <script src="https://gist.github.com/waitzShigoto/7ba7f042607cde3cb472af503088bce9.js"></script>
  - 解決方法＆デモ：

    - 各PendingIntent作成箇所に`FLAG_IMMUTABLE`または`FLAG_MUTABLE`タグを追加する必要があります

    - 最新のwork-runtimeを追加：`implementation 'androidx.work:work-runtime:2.7.1'`

    ![android12_workmanager.png](/images/others/android12_workmanager.png)

    - 備考

      - ここではAirdroidを例にしていますが、現在Airdroid & httphelperリポジトリは分かれているため、他の箇所も修正が必要です
      - 隠れたPendingIntentも修正が必要で、implementされたライブラリ内でもPendingIntentが使用されています
      現在の`Airdroid`プロジェクト内で使用されているGoogle Analytics 17.0.0バージョンでもエラーメッセージが表示されます
      (このような場合、実際にそのコードを実行してみないとPendingIntentのエラーがあるかどうかわかりません)
      ![android_12_error_01.png](/images/others/android_12_error_01.png)
      この場合、バージョンを上げるだけで解決します
      `implementation 'com.google.android.gms:play-services-analytics:18.0.1'`

  <div class="c-border-content-title-4">
    Target sdkを32に上げると、setAppCacheEnabled(flag Boolean)とsetAppCachePath(path String)が削除されました   
  </div>

   Chromiumがこの機能を削除したため、sdkはもはやサポートされていません:<a href="https://web.dev/appcache-removal/" target="_blank">参考</a>
  ![android12_appcache.png](/images/others/android12_appcache.png)

  <div class="c-border-content-title-4">
    Target sdkを32に上げると、バックグラウンドで前景サービスを開始することが
      <a href="https://developer.android.com/guide/components/foreground-services#background-start" target="_blank">制限</a>されます
  </div>

  現在、SDK 32で実際にテストしたところ、バックグラウンドで前景サービスを実行することがまだ可能です

  バックグラウンドサービスでStartForegroundServiceを実行してみましたが、正常に実行できました。ここは引き続き追跡します

  公式には、WorkManagerを使用することを推奨しています：
  <a href="https://developer.android.com/about/versions/12/foreground-services?hl=zh-cn#recommended-alternative" target="_blank">参考</a>

  <div class="c-border-content-title-4">
    システムリソースの節約を奨励するために
  </div>

 アラームマネージャAPIはAndroid 12で`SCHEDULE_EXACT_ALARM`権限を宣言する必要があります

 <div class="c-border-content-title-4">
   Android 12以上でモーションセンサーのサンプリングレートに制限が設けられました
   <a href="https://developer.android.com/guide/topics/sensors/sensors_overview#sensors-rate-limiting" target="_blank">参考（英語の公式サイトのみ、中文にはこの段落がありません）</a>
 </div>

 registerListener()を使用してセンサーイベントをモニターするためにセンサーリスナーを登録する場合、最大サンプリングレートは200Hzに制限されます

 より高いHZを使用するには、`HIGH_SAMPLING_RATE_SENSORS`権限を追加する必要があります

 <div class="c-border-content-title-4">
    Android 12の大まかな位置/正確な位置の動作変更
 </div>

 このバージョンでは、大まかな位置/正確な位置の権限を要求する際に、

 `ACCESS_FINE_LOCATION`と`ACCESS_COARSE_LOCATION`の両方を同時に要求する必要があります。

 そうすることで、新しい位置権限要求ボックスが表示されます。

 詳細はこちら: <a href="https://developer.android.com/training/location/permissions#approximate-request" target="_blank">参考</a>

 <div class="c-border-content-title-4">
    Android 12でのBluetooth権限の分離
 </div>
  以前はBluetooth関連のAPIを使用する際に、

  `Manifest.permission.BLUETOOTH_ADMIN`と`Manifest.permission.ACCESS_FINE_LOCATION`を宣言して

  近くのBluetoothデバイスを検索していました。

  startDiscoveryなどのAPIを使用して近くのデバイスを検索する場合、

  古い権限を使用すると、Target 32で`APIが失敗するか、一部のAPIが直接クラッシュします`

  ![android12_ble.png](/images/others/android12_ble_crash.png)

  以下のように修正できます：

  1. 古い権限に`android:maxSdkVersion="30"`を追加
  2. 必要に応じて新しい権限`BLUETOOTH_CONNECT`、`BLUETOOTH_SCAN`、または`BLUETOOTH_ADVERTISE`を宣言
  ![android12_ble.png](/images/others/android12_ble.png)
  3. 以前はランタイム権限要求で`ACCESS_FINE_LOCATION`権限のみを要求していましたが、現在は分離されており、ランタイム時に上記の`Bluetooth権限要求`を追加する必要があります

  参考
  <a href="https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#startDiscovery()" target="_blank">APIドキュメント</a>
    および<a href="https://developer.android.com/guide/topics/connectivity/bluetooth/permissions#declare-android12-or-higher" target="_blank">Bluetooth権限分離の説明</a>

  ここでは、どのように変更するかの簡単なデモです

  <script src="https://gist.github.com/waitzShigoto/cd5950dcc9247ea889e835a4085694f8.js"></script>
