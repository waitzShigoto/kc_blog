---
layout: post
title: Android 14 開発中のバージョン差異にどう対応するか？Android 14迅速適応ガイド！
date: '2024-05-15 10:33:18 +0800'
image: cover/android-version-adaptation-14.png
tags:
  - Android
categories: DebugAndOptimize
excerpt: この記事では、Android 14バージョンのアップグレードによる開発上の課題とその解決策について紹介します。
---
<div class="c-border-content-title-4">Android 14 プラットフォームのいくつかの重要な変更点の概要、すべてのアプリケーションの動作がこのプラットフォームで変更されます</div>
<div class="c-border-content-title-1">コア機能</div>

* システムはもはや正確なアラームの権限をデフォルトで付与しなくなり、アプリケーションが自ら申請する必要があります。
   - Android 14 は target SDK >= 33 のアプリに対して権限 `SCHEDULE_EXACT_ALARM` をデフォルトで同意しなくなりました

   （デフォルトでは `拒否` に設定されています）
   - これは以前の Android 12（以前の<a href="{{site.baseurl}}/posts/android-12-version-impact">ノート</a>）で追加された権限です

   当時は AndroidManifest.xml に宣言するだけで済みましたが
   今は `権限をリクエスト` する必要があります
   - `権限をリクエスト` する手順：
     1. `AlarmManager.canScheduleExactAlarms()` を使用して権限があるかどうかを確認します
     2. `onResume()` 内で `ACTION_REQUEST_SCHEDULE_EXACT_ALARM` を含むインテントを呼び出します
     3. 例：
     ```Kotlin
     override fun onResume() {
           …  
           if (alarmManager.canScheduleExactAlarms()) {
               // Set exact alarms.
               alarmManager.setExact(...)
           }
           else {
               // Permission not yet approved. Display user notice and revert to a fallback  
               // approach.
               alarmManager.setWindow(...)
           }
        }
     ```
   - 公式も、正確なアラームを使用する必要がない場合は削除することを推奨しています：[こちらをクリック](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms?authuser=7&hl=zh-cn#use-cases)

  * アプリが `キャッシュ状態（cached state）` に入ると、コンテキストで登録されたブロードキャストはキューに追加されます。
    - この時に受信したブロードキャストはキューに入り、次にアプリが `前景` に戻るか `キャッシュ状態` を離れると、順次アプリに返されます。
    - キャッシュ状態（cached state）：簡単に言うと、バックグラウンドにあるアプリで、現在前景にないプロセスです。そのため、システムの他の部分がメモリを必要とする場合、システムは必要に応じてこれらのプロセスを自由に終了できます。
    - コンテキストで登録されたものだけが対象で、`静的に登録されたものは対象外` です。例：AndroidManifest.xml にブロードキャストを追加する場合。

<div class="c-border-content-title-1">アプリ管理</div>

   * アプリは自分自身のバックグラウンドプロセスのみを終了でき、他のアプリには影響を与えられません。
     - target SDK 34 以降、`killBackgroundProcesses` を使用して他のアプリを閉じることはできなくなります
     - もしアプリ内でこの方法を使用して他のアプリのバックグラウンドプロセスを閉じている場合、将来的には無効になる可能性があります
   * 最初に MTU をリクエストする GATT クライアントの MTU 設定は `517` バイトに設定され、その ACL 接続に対するすべての後続の MTU リクエストは `無視` されます。
       - 簡単に言うと、アプリ内の GATT クライアントが作成され接続された後（BluetoothGatt#connect）、

       最初に API `BluetoothGatt#requestMtu(int)` を使用して MTU を設定すると、システムは 517 バイトに設定します

       - 関連知識：
       `MTU（Maximum Transmission Unit）`：単一のパケットで送信できる最大データ量

       `Bluetooth Core Specification 5.2`：この変更はこの規格を厳格に遵守するために行われました。[規格を見る](https://www.bluetooth.com/wp-content/uploads/2020/01/Bluetooth_5.2_Feature_Overview.pdf)
       - 将来的に GATT 接続を実装して `Bluetooth デバイス` に接続し、MTU を設定する場合は：[このチュートリアル](https://blog.csdn.net/qq_38436214/article/details/132334688) を参照してください
       - `もし製品が実際に Bluetooth デバイスとデータを転送する場合`、

       MTU の制限により多くの状況に適応する必要があるかもしれません。

       例：GATT で MTU を設定するが、ターゲットの Bluetooth デバイスがサポートしていない場合、対応策が必要になるかもしれません

       または、Android 14 の調整により Bluetooth デバイスのファームウェアも調整が必要になるなど...

<div class="c-border-content-title-1">ユーザーエクスペリエンス</div>

* 新しい権限により、ユーザーはどの`写真`や`ビデオ`がアクセスされるかを選択できます。
    - Android 14では、新しい`写真選択`権限`READ_MEDIA_VISUAL_USER_SELECTED`が追加されました。
    - `READ_MEDIA_VISUAL_USER_SELECTED`を使用すると、ユーザーはアクセスされる`写真`や`ビデオ`を`選択`できます。

    または、すべてのアクセスを許可することもできます。以下の図のように、ユーザーには2つのオプションが表示されます。

    <img src="/images/android14/001.png" width="35%">

    - `Android 13`では、すでに一度権限が細分化されており、

    `READ_MEDIA_VIDEO`、`READ_MEDIA_IMAGES`を使用して`すべて`の画像やビデオにアクセスできます：<a href="{{site.baseurl}}/posts/android-13-version-impact">以前のAndroid 13のメモ</a>
      ```kotlin
         <!-- Devices running Android 12L (API level 32) or lower  -->
         <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
         android:maxSdkVersion="32" />

         <!-- Devices running Android 13 (API level 33) or higher -->
         <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
         <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />

         <!-- To handle the reselection within the app on Android 14 (API level 34) -->
         <uses-permission android:name="android.permission.READ_MEDIA_VISUAL_USER_SELECTED" />
      ```
    - 上記の方法はニーズに応じて調整できますが、
    Android 14で`READ_MEDIA_VISUAL_USER_SELECTED`を使用しない場合は、[互換モード](https://developer.android.com/about/versions/14/changes/partial-photo-video-access?authuser=7&hl=zh-cn#compatibility-mode)が適用されます。

    - 互換モード：毎回、どの写真やビデオがアプリで使用されるかをユーザーに選択させる。
    - 公式の説明では、これは`ユーザープライバシー`を向上させる方法の一つです。

    - 実際の例：
      ```kotlin
       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
           requestPermissions.launch(arrayOf(READ_MEDIA_IMAGES, READ_MEDIA_VIDEO, READ_MEDIA_VISUAL_USER_SELECTED))
       } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
           requestPermissions.launch(arrayOf(READ_MEDIA_IMAGES, READ_MEDIA_VIDEO))
       } else {
           requestPermissions.launch(arrayOf(READ_EXTERNAL_STORAGE))
       }
      ```
      または公式の権限取得例を参照：[こちら](https://developer.android.com/about/versions/14/changes/partial-photo-video-access?authuser=7&hl=zh-cn#permissions)
  * 新しい動作：`閉じられない`通知がユーザーによって`閉じられる`ようになりました。[公式ドキュメント](https://developer.android.com/about/versions/14/behavior-changes-all?hl=zh-tw&authuser=7#non-dismissable-notifications)
    - Android 14では、この動作が変更され、ユーザーがこの種の通知を閉じることができるようになりました。
    - 簡単に言うと、現在`Notification.Builder#setOngoing(true)`、`NotificationCompat.Builder#setOngoing(true)`を使用してNotification.FLAG_ONGOING_EVENTを設定し、ユーザーが前景通知を閉じるのを防ぐことが`無効`になります。
    - 実際の効果はこのようになります（左：Android 14、右：Android 11）：

      <img src="/images/android14/002.gif" width="35%">
    - ただし、以下の2つの状況ではまだ禁止されていません：
      1. デバイスがロックされている場合
      2. ユーザーが`すべての通知をクリア`を選択した場合
    - また、以下のタイプには現在影響しません：
      1. CallStyle通知：簡単に言うと`電話関連`の通知
      例：
      ```Kotlin
         val builder = NotificationCompat.Builder(context, CHANNEL_ID)
             .setSmallIcon(R.drawable.notification_icon)
             .setContentTitle("Incoming call")
             .setContentText("Caller Name")
             .setPriority(NotificationCompat.PRIORITY_HIGH)
             .setCategory(NotificationCompat.CATEGORY_CALL)
             .setFullScreenIntent(fullScreenPendingIntent, true)
             .setOngoing(true)
             .addAction(R.drawable.ic_accept, "Accept", acceptPendingIntent)
             .addAction(R.drawable.ic_decline, "Decline", declinePendingIntent)
             .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
      ```

      2. 企業デバイスポリシーコントローラー (DPC) とサポートソフトウェアパッケージ

<div class="c-border-content-title-1">アクセシビリティ機能</div>

* 非線形フォントの拡大が200%まで可能に。
   - Androidシステムが`テキストフォント`を最大200%まで拡大できるように調整されました。

     適応されていない場合、フォントが拡大されるとレイアウトが予期しない形になる可能性があります。
   - 以下の方法で適応できます：
     1. a. 常に`sp`を使用してテキストフォントサイズを設定する
     2. b. コードで設定することも可能です
     `TypedValue.applyDimension()`を使用：spをピクセルに変換
     `TypedValue.deriveDimension()`を使用：ピクセルをspに変換
     3. c. (オプション) `lineHeight`にsp単位を使用：dpまたはpx単位を使用する場合

     この場合、テキストが拡大されないか、文字が狭く見える可能性があります。

     textSizeとlineHeightの両方にspを設定することで、

     システムが設定に応じて行の高さとフォントサイズを調整します。
     (`主に自社製品で行の高さを設定する必要があるかどうか`)
     4. d. [公式ドキュメント](https://developer.android.com/about/versions/14/features?authuser=7&hl=zh-cn#sp-units)
   - テスト方法：
     `設定`>`アクセシビリティ` > `表示サイズとテキスト`
     フォントサイズオプションで、プラス（+）アイコンをクリックし、最大倍率に調整します。
   - `コンパイル`にはほとんど影響はありませんが、追加の適応が必要な場合があります。
   古い方法ではフォント設定にdpを使用している場合や、`dpをピクセルに変換する`コードが見られます。
   そのため、見つけた場合は公式の推奨方法に変更する習慣をつけると良いでしょう。

<div class="c-border-content-title-1">安全性</div>
* `targetSdkVersion` API レベルの最低インストール要件が `23` に引き上げられました。
  - 主に`Android 14`以降では targetSdkVersion `>= 23` のアプリのみインストール可能です。

  - ただし、開発時に単純にテストする場合は以下のadbコマンドを使用できます：

  `adb install --bypass-low-target-sdk-block ファイル名.apk`

  - 公式の主な目的は、`悪意のあるソフトウェア`が古いバージョンを利用して新しいバージョンのセキュリティ制約を回避するのを防ぐことです。

  例えば：targetSDK 22を利用して、`Android 6.0 Marshmallow (API 23)`の権限リクエスト制限を回避することなど。

 * Google Play上で表示されるデータセキュリティ情報が調整されました：提供された情報に基づいて表示されますが、

アプリ自体にはコンパイル上の影響はありません。主に公開後のページ上で表示される情報です。

この点については、各自のアプリや製品が受け入れるかどうか、または調整が必要かどうかを確認してください。参考URL：[こちら](https://support.google.com/googleplay/android-developer/answer/10787469?authuser=7&hl=zh-Hans#zippy=%2C%E5%A6%82%E6%9E%9C%E6%82%A8%E7%9A%84%E5%BA%94%E7%94%A8%E4%BC%9A%E5%88%86%E4%BA%AB%E7%94%A8%E6%88%B7%E6%95%B0%E6%8D%AE%E7%94%A8%E6%88%B7%E4%BC%9A%E7%9C%8B%E5%88%B0%E4%BB%80%E4%B9%88%E4%BF%A1%E6%81%AF)

* システム通知：現在、アプリが位置情報を第三者のライブラリに共有している場合、ユーザーに通知されます。30日以内にどのアプリが位置情報を第三者に共有したかが通知されます。

  <img src="/images/android14/003.png" width="60%">
* メディアストレージのクエリで特定のメディアファイルを保存しているアプリケーションの OWNER_PACKAGE_NAME フィールドを使用できます。

Android 14 バージョン以降、以下の条件のいずれかを満たさない限り、システムはこの値を隠します：
  - メディアファイルを保存するアプリケーションが他のアプリケーションから常に閲覧可能なパッケージ名を持っている。
  - メディアストレージをクエリするアプリケーションが QUERY_ALL_PACKAGES 権限を要求している。

<div class="c-border-content-title-4">Android 14 をターゲットとするアプリの動作変更</div>

* Android 14（API レベル 34）またはそれ以上をターゲットとするアプリに対して

Android 14 は BluetoothAdapter#getProfileConnectionState() メソッドを呼び出す際に `BLUETOOTH_CONNECT` 権限を強制します。

  - 使用する場合は `AndroidManifest.xml` にその権限を追加する必要があります。
  - 使用前に権限が付与されているか確認してください。

* JobScheduler が `setRequiredNetworkType` または `setRequiredNetwork` を使用する場合、

  現在は `ACCESS_NETWORK_STATE` 権限を宣言する必要があります。

  そうしないと、Android 14 以降では SecurityException が発生します。

* `インプリシット` インテントと保留中のインテントの制限：Android 14 ではインプリシットインテントの使用に制限が追加されました。
  - インプリシットインテントは現在、エクスポートされたコンポーネントでのみ使用できます。`exported = true` を設定するか、`エクスプリシットインテント` を使用してください。

  例：`エクスプリシットインテント` を使用するか、`exported = true` を設定する

  ```xml
  <activity android:name=".MyActivity" android:exported="true">
     <intent-filter>
         <action android:name="com.example.action.APP_ACTION" />
         <category android:name="android.intent.category.DEFAULT" />
     </intent-filter>
  </activity>
  ```

  ```kotlin
   // This makes the intent explicit.
   val explicitIntent =
           Intent("com.example.action.APP_ACTION")
   explicitIntent.apply {
       package = context.packageName
   }
   context.startActivity(explicitIntent)
  ```

  - `mutable` 保留中のインテントを使用する際にパッケージ名を指定しない場合、例外が発生する可能性があります。

  例外の例として、`FLAG_MUTABLE` の保留中のインテントを使用する場合：

  ```
  Intent intent = new Intent(Intent.ACTION_VIEW);
  PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_MUTABLE);
  ```
  例外を避けるためにパッケージ名を追加する：

  ```
   Intent intent = new Intent(Intent.ACTION_VIEW);
   intent.setPackage("com.example.myapp");
   PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_MUTABLE);
  ```
* 現在、コンテキストに登録されたBroadcast receiverにフラグを追加する必要があります。

  `RECEIVER_EXPORTED` または `RECEIVER_NOT_EXPORTED` を使用して、アプリケーションをセキュリティ脆弱性から保護します。

```
 val receiverFlags = if (listenToBroadcastsFromOtherApps) {
      ContextCompat.RECEIVER_EXPORTED
   } else {
      ContextCompat.RECEIVER_NOT_EXPORTED
   }
   ContextCompat.registerReceiver(context, br, filter, receiverFlags)
```

* 現在使用動的コードを読み込むファイルは`read only`に設定する必要があります

そうしないと例外が発生します

これは公式がその[安全性](https://developer.android.com/privacy-and-security/security-tips?authuser=7&hl=zh-cn#DynamicCode)を考慮しているためです
  - 既存の読み込みファイルに対する公式の[提案](https://developer.android.com/about/versions/14/behavior-changes-14?authuser=7&hl=zh-cn#handle-existing-files)
  - 動的にコードを読み込む必要がある場合は、以下の方法を使用してください

  動的ファイル（例えば DEX、JAR または APK ファイル）を開いて内容を書き込む前にすぐにそれをread onlyに設定します：

  ```Kotlin
   val jar = File("DYNAMICALLY_LOADED_FILE.jar")
   val os = FileOutputStream(jar)
   os.use {
       // レースコンディションを防ぐために最初にファイルを読み取り専用に設定
       jar.setReadOnly()
       // その後、実際のファイル内容を書き込む
   }
   val cl = PathClassLoader(jar, parentClassLoader)
   ```

* zipトラバーサルの脆弱性を防ぐため

現在、ZipInputStream.getNextEntry()を使用する際、パスに`..`、`/`が含まれていると`ZipException`がスローされます

  - この検証ステップをスキップしたい場合は、`dalvik.system.ZipPathValidator.clearCallback()`を直接呼び出すことができます。

* `USE_FULL_SCREEN_INTENT`：Android 11以上では全画面通知を表示するために使用されます

  しかし、Android 14では、`通話`および`アラーム`タイプのアプリでのみ使用できます

  2024/05/31以降、Google Playはこの権限を使用する他のアプリを撤回します。

  - 現在、API `NotificationManager#canUseFullScreenIntent()`を使用して全画面通知を使用できるかどうかを確認できます。
  - 権限がない場合は、`ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT`権限を要求できます。

* 現在、foregroundServiceを使用する場合は必ず`android:foregroundServiceType`属性を宣言する必要があります
  - この属性はAndroid 10で導入されましたが、現在はAndroid 14で必ず宣言する必要があります。そうしないとエラーが発生します。
  - 公式は開発者が宣言するための`13`種類のタイプを提供しています。詳細は[ドキュメント](https://developer.android.com/about/versions/14/changes/fgs-types-required?hl=zh-tw&authuser=7)を参照してください。
  - 公式の提案として、`上記のタイプに関連しない場合`は、ロジックを`WorkManager`または`ユーザーが起動するデータ転送操作`に移行することができます。
  - 上記のタイプを宣言する場合、各タイプに必要な権限は異なります。例えば、私たちのプロジェクトでよく使用される`mediaProjection`の場合、以下の手順を完了する必要があります：

    a. AndroidManifest.xmlで`android:foregroundServiceType mediaProjection`を宣言する

    b. 元のForegroundService権限に加えて、`FOREGROUND_SERVICE_MEDIA_PROJECTION`権限も宣言する必要があります

    c. startForegroundを実行する前に、`createScreenCaptureIntent()`メソッドを使用してユーザーの権限を確認し、foreground serviceを起動できるようにする必要があります。

    d. startForegroundを呼び出す際に、`FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION`を追加する必要があります

    ```kotlin
     startForeground(
         AIRSOS_ID,
         notification,
         ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION)
    ```

  - 他のタイプも同様の概念ですが、宣言する権限や追加するServiceInfoはタイプによって異なるため、上記のドキュメントを参照してください。
  - 上記以外にも、現在`AirDroid Remote Support`を使用してこの問題を調整するためのいくつかの方向性があります
    a. この問題を回避するために`dataSync`タイプを使用する。

       `dataSync`は`実行時`に追加の権限を取得する必要がないため、元のフローにあまり影響を与えません。

       -> `リスク`：すべてを`dataSync`に宣言すると、短期的には変更量が少なく、フローにあまり影響を与えませんが、公式ドキュメントのタイプとは関連しません。

       （公式は各タイプの下で、異なるタイプに適した職務を説明しています）

       `dataSync`は公式が将来的に`廃止`する予定であることが記載されています。以下の図を参照してください

       <img src="/images/android14/004.png" width="70%">

    b. `実行時`に追加の権限を取得する必要がある場合、元のフローでstartForegroundを実行する前にユーザーから権限を取得する

       例えば、`mediaProjection`はstartForegroundの前にcreateScreenCaptureIntent()を呼び出してmediaProjectionの権限を取得する必要があります。

       ここでデモを行いました

       build sdk versionを更新してください

       <script src="https://gist.github.com/waitzShigoto/7c4a8ef7b18660749a8acec308992d2b.js"></script>
       以下の権限を追加してください

       <script src="https://gist.github.com/waitzShigoto/1f396d04ca999787104f31dd735a4ae0.js"></script>
       必要に応じてforeground service typeを追加してください

       <script src="https://gist.github.com/waitzShigoto/333cca6030d4e727740f89ca74e529de.js"></script>

       -> `実際に遭遇する可能性のある問題の共有`：以前に書いた`Service`コードには、

       すでに`foregroundServiceType`を追加していました（以前は必須ではありませんでした）。

       この`service`には、クラス内のアクションを操作するメソッドがあります。

       例えば、startForegroundService

       したがって、公式ドキュメントによると、android14以上では、

       `createScreenCaptureIntent()`を呼び出して権限を取得する必要があります。

       上記のサンプルを追加することでクラッシュを回避できますが、

       元々の予期されたフローとは異なるため、

       ロジックを分割し、全体のコードをテスト・修正するための時間が必要です。

       毎回フォアグラウンドサービスのために上記の権限を取得する必要があるため、

       以前に作成した製品やソリューションでフォアグラウンドサービスを使用している場合、調整が必要です。

       - 備考：【実行時】、ここでは`startForeground`を実行する時を指します。

       実際のテストでは、`ドキュメントに従わず`に`実行前`に対応する権限を取得しないと、`例外`が発生し`クラッシュ`します。
       - クラッシュの例は以下の通りです。

       <img src="/images/android14/005.png" width="60%">

   c. その後、いくつかの状況でクロステストを行いました。

       -  `Manifest`で `|` を使用して複数のforegroundServiceTypeを宣言

       <img src="/images/android14/006.png" width="60%">

       そして、ソースコード内で`異なるバージョンの判定`に基づいて`異なるタイプ`の`foregroundServiceType`を指定

       <img src="/images/android14/007.png" width="60%">

       - ソースコード内で`foregroundServiceType`を追加しない場合、

       `FOREGROUND_SERVICE_MICROPHONE`権限がないと表示されて`クラッシュ`します

       （複数のタイプを宣言した場合）

       <img class="zoomable" onclick="zoomImage(this)" src="/images/android14/008.png" width="60%">

         そのため、他のServiceをテストしました。

         Manifestに単純に`dataSync`を追加した場合、

         ソースコード内で`foregroundServiceType`を入力しなくてもクラッシュしません。

         しかし、`microphone`を混用し、空の`foregroundServiceType`を使用すると`クラッシュ`します。

         （左側は`クラッシュ`し、右側は正常に動作します。クリックして拡大できます）

           <div style="display: flex;">
               <img src="/images/android14/009.png" width= "45%" style="margin-right: 10px;">
               <img src="/images/android14/010.png" width= "45%" >
           </div>
