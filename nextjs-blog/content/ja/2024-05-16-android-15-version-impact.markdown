---
layout: post
title: "Android 15 Betaバージョンリリース！開発者は新しいバージョン制限にどう対応するか？"
date: 2024-05-16 13:59:07 +0800
image: cover/android-version-adaptation-15.png
tags: [Android]
categories: SDK升級
excerpt: "この記事では、Android 15バージョンのアップグレードによる開発の課題と解決策を紹介します。"
---

<div class="c-border-content-title-4">前書き</div>

Android 15が最近Beta版としてリリースされました

新バージョンは `VanillaIceCream バニラアイスクリーム` と呼ばれています

<img src="/images/android15/002.png" width="80%">

以下はロードマップです:

<img src="/images/android15/001.png" width="80%">

詳細なスケジュールは：<a href="https://developer.android.com/about/versions/15/overview?hl=zh-cn">公式サイト</a> を参照してください

<div class="c-border-content-title-4">Android 15上のすべてのアプリに影響</div>

<div class="c-border-content-title-1">ソフトウェアパッケージの動作変更</div>
* クラス `ApplicationInfo` において

過去には `FLAG_STOPPED` というタグが存在しました

その動作は現在アプリが `停止状態` であるかどうかを示していました

過去の `停止状態` の判定は、ユーザーがアプリを強制停止したときに設定され、アプリはこの状態を保持しました。

* 一方、システムがアプリを `停止状態` から外すには

過去には `ユーザーがアプリをクリックして開く`、または一部のインタラクティブウィンドウを開くことで状態を変更できました

  &#x21AA; ここに公式の `原文` があります：

  `directly launching the app or indirectly interacting with the app.`

  `(through the sharesheet or a widget, selecting the app as live wallpaper, etc.)`

  Android 14では `ユーザーがアプリをクリックして開く` と `一部のインタラクティブウィンドウを間接的に開く` ことが可能でした

  例として `sharesheet`、`ウィジェット`、`ライブ壁紙として選択` などが挙げられています

* 最新の `Android 15` システムにおける `FLAG_STOPPED` には以下の変更と拡張があります。

  1. 現在、システムが `FLAG_STOPPED` と判定した場合、すべての `pending intents` の操作が停止されます

  2. システムが `FLAG_STOPPED` から `離れる` と判断した場合、`ACTION_BOOT_COMPLETED` ブロードキャストが送信されます

     公式には、このブロードキャストを通じて開発者が pending intent を復元できると述べています。

  &#x21AA; ここに公式の `原文` 説明があります。15における `FLAG_STOPPED` 判定の調整について：

`Apps should only be removed from the stopped state through direct or indirect user action.`

  つまり、直接的または間接的なユーザーアクションのみがシステムによって `停止状態` と判定されることを変更します

* 上記から、この状態の判定がより厳格になったことが理解できます

  &#x21AA; ただし、上記の原文には `indirect user action` が具体的に何を指すのか明確に記載されていません。

  今後の参考にしてください

* さらに、 `Application StartInfo.wasForceStopped()` メソッドを使用して上記の状態を判定できます。

<div class="c-border-content-title-1">16 KBページサイズのサポート</div>

* 公式はRAMの利用戦略を最適化しました

過去にはAndroidは `4 KBメモリページサイズ` のみをサポートしていました

現在は `16 KBページサイズ` に引き上げられました

来年にはGoogle Playに導入される予定です（15には既にありますが、その時点で16KBコンパイルのアプリが強制されるかは不明です &#x2728;)
	
ページサイズの引き上げは主に `RAM集約型の作業` を最適化し、より効率的に使用できるようにするためです

これはソフトウェアの最適化に関するものです

主に将来 `メーカーがより大きく、より高性能なRAMを開発する` 際にアプリがスムーズに動作し、互換性を持つようにするためです

 ✅  `ページサイズ` はメモリ内の操作単位を表すもので、通常は2の累乗です。例：2KB、4KB、8KBなど。

* `アプリ開発者`への影響：

  &#x21AA; Ndkを使用してコンパイルする場合、またはSDKを直接または間接的に使用してコンパイルする場合、`16 KBページサイズ`のアプリを再設定する必要があるかもしれません

<img src="/images/android15/004.png" width="80%">

  &#x21AA; `短期`的にはプロジェクトに大きな影響はないでしょう

  &#x21AA; `将来`Google Playに正式にリリースされると、`16 KBページサイズ`に関連する問題が発生する可能性があります

<img src="/images/android15/006.png" width="80%">

 ✅   `互換性の問題`が発生した場合は、<a href="https://developer.android.com/guide/practices/page-sizes#build">公式サイト</a>を参考にしてコンパイル方法を調整してください

* `Android Studio`内の`APK Analyzer`を使用して、ネイティブコードが使用されているかどうかを判断できます（または`逆コンパイル`して確認）

  &#x21AA; apkをAndroid Studioにドラッグします

  &#x21AA; libフォルダに任意の`.so`ファイル（共有オブジェクト）が表示されるか確認します

表示される場合、アプリはネイティブコードでコンパイルされています

`libや.so`が表示されない場合は、ネイティブコードが使用されていない可能性があります

<img src="/images/android15/005.png" width="80%">

✅ 公式によると、`ネイティブコードを使用している場合`は、`16KBデバイス`にアプリを再構築する必要があります。

以下は初期判断の参考です：

↪ 任意のC/C++（ネイティブ）コードを使用している場合、通常はNDK関連やJNIなどを含む。

↪ 任意のサードパーティライブラリがネイティブライブラリを使用している場合。

↪ 任意のサードパーティのビルダーがネイティブライブラリを使用している場合。

* 下図は`16 KBページサイズ`の機能が最適化された後の

システムパフォーマンスの向上を示しています

<img src="/images/android15/007.png" width="80%">

<div class="c-border-content-title-1">新しいプライベートスペース機能の追加</div>
この機能は、アプリを隠すスペースやアプリロックに似た機能を追加します

アプリを開くにはパスワードが必要です

ただし、`公式には現在バグがあるとされています`

<img src="/images/android15/008.png" width="80%">

エミュレーターでもこの機能は見つかりませんでした

しかし、公式はこの機能がアプリの可視性を制限することを述べています

`プライベートスペース内のアプリは可視性が制限されているため、`

後でこの機能が使用可能になったときに、自分のアプリを入れて問題がないか確認できます

例：QueryAllPackagesPermission`の機能が予期通りに動作するかどうか不明です

その時に試してみてください

<div class="c-border-content-title-1">最小ターゲットSDKが24に変更</div>
* Android 14と同様に、古いAPIを使用して脆弱性を悪用するのを防ぐためです

`Android 15`では、ターゲットが24以上でないとインストールできません

インストールできない場合は`INSTALL_FAILED_DEPRECATED_SDK_VERSION`と表示されます

以下のコマンドを使用して、規定に合わないapkをインストールできます

  ```
  adb install --bypass-low-target-sdk-block FILENAME.apk
  ```

#### UI/UX調整
<div class="c-border-content-title-1">UI/UX調整</div>
* 開発者オプションから`予測バックアニメーション`を削除

開発者がアプリ内で設定できるようにしました

  ```
  <application
      ...
      android:enableOnBackInvokedCallback="true"
      ... >
  ...
  </application>
  ```
  ✅ `予測バックアニメーション`とは何かを確認する ：<a href="https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture">参考</a>

<div class="c-border-content-title-1">廃止</div>
日常的に廃止される一部のAPI：
<a href="https://developer.android.com/about/versions/15/deprecations">API廃止の参考</a>

<div class="c-border-content-title-4">Android 15をターゲットとするアプリへの影響</div>
<div class="c-border-content-title-1">フォアグラウンドサービスに関する調整</div>
* BOOT_COMPLETEDブロードキャスト時に以下のフォアグラウンドサービスを起動することを禁止
   - dataSync
   - camera
   - mediaPlayback
   - phoneCall
   - mediaProjection
   - microphone
 
&#x21AA; 強制的に起動すると`ForegroundServiceStartNotAllowedException`がスローされます

* `dataSync`に対する最終審判

   &#x21AA; dataSyncのサービスは現在、24時間内に6時間しか実行できません。時間が来るとシステムは`Service.onTimeout(int, int)`を呼び出します

   この時、タイムアウトを受け取ってから数秒以内に`Service.stopSelf()`を呼び出す必要があります

   &#x21AA; 時間が来ても`stopSelf`を呼び出さない場合、次のエラーが発生します

  `A foreground service of ##fgs_type did not stop within its timeout: ##component_name.`

   &#x21AA; システムが`Service.onTimeout(int, int)`を呼び出すと、そのサービスはもはやフォアグラウンドサービスとは見なされません

   &#x21AA; 現在のbeta2バージョンではスローされるエラーは`ANR`と見なされますが、後のバージョンでは`exception`に変更されます。

   &#x21AA; 上記の制限はすべてのdataSyncサービスに適用されます。例えば、24時間内にすでに4時間dataSyncを実行している場合、他のdataSyncは残り2時間しか実行できません
   &#x21AA; または公式が推奨する他の方法に移行することを検討してください：<a href="https://developer.android.com/about/versions/15/changes/datasync-migration">代替案</a>

* 新しいフォアグラウンドサービスタイプの追加：<a href="https://developer.android.com/about/versions/15/behavior-changes-15#mediaprocessing-fgs-type">mediaProcessing</a>

  &#x21AA; このタイプは上記のdataSyncと同じルールが適用されます

  &#x21AA; `mediaProcessing`のサービスは現在、24時間内に6時間しか実行できません。時間が来るとシステムは`Service.onTimeout(int, int)`を呼び出します

  この時、タイムアウトを受け取ってから数秒以内に`Service.stopSelf()`を呼び出す必要があります

  &#x21AA; システムが`Service.onTimeout(int, int)`を呼び出すと、そのサービスはもはやフォアグラウンドサービスとは見なされません

  &#x21AA; 公式が提供する代替案は上記のdataSyncとは異なります：<a href="https://developer.android.com/develop/background-work/services/foreground-services#purpose-built-apis">代替案</a>

* 上記のタイプのタイマーをリセットするには、ドキュメントに記載されているように

ユーザーがアプリを前景に移動する必要があります
   
<img src="/images/android15/004.png" width="80%">

* 特殊なケースを使用することもできます

   - <a href="https://developer.android.com/about/versions/14/changes/fgs-types-required?authuser=7&hl=zh-tw#special-use">こちらをクリック</a>
   - ただし、公式には説明を提供し、審査を通過する必要があります
<div class="c-border-content-title-1">SYSTEM_ALERT_WINDOWを保持してフォアグラウンドサービスを起動する制限</div>
* 以前は、SYSTEM_ALERT_WINDOWを使用してフォアグラウンドサービスを起動することができ、アプリがバックグラウンドにあっても動作しました

  現在は新しいステップが必要です：`TYPE_APPLICATION_OVERLAY`を使用してオーバーレイウィンドウを起動し、それが可視である必要があります

↪ 上記の新しい要件を満たさない場合、`ForegroundServiceStartNotAllowedException`がスローされます。

<div class="c-border-content-title-1">「おやすみモード」動作の変更</div>

* ターゲットSDKがAndroid 15以上のアプリは、`おやすみモードDo Not Disturb (DND)`の`グローバルステート`や`ポリシー`の設定をサポートしなくなります。

↪ 以前`setInterruptionFilter(INTERRUPTION_FILTER_ALL)`を使用して設定していたアプリに影響します。

<div class="c-border-content-title-1">OpenJDK 17に関する変更</div>

* Android 15では、この変更に伴いAPIの使用方法が調整されました。使用する場合は注意が必要です。

以下の関数で文字列をフォーマットする際に例外が追加されました。

  - String.format(String, Object[])
  - String.format(Locale, String, Object[])
  - Formatter.format(String, Object[])
  - Formatter.format(Locale, String, Object[])

↪ `$0`を誤用した場合、`IllegalFormatArgumentIndexException`: Illegal format argument index = 0 がスローされます。

  ```kotlin
  //work
  val formattedString = String.format("Name: %1$s, Age: %2$d", name, age);
  //exception
  val formattedString = String.format("Name: %0$s, Age: %1$d", name, age);
  ```

* この<a herf="https://bugs.openjdk.org/browse/JDK-8301574">issue</a>に対応して、`Random`クラスが調整されました。
現在、`Random.ints()`は`Random.nextInt()`と同じ値を返さなくなりました。
したがって、現在では両者が`==`であることを期待すべきではありません。
  - Random.ints(long)
  - Random.ints(long, int, int)
  - Random.ints(int, int)
  - Random.ints()

<div class="c-border-content-title-1">より安全なバックグラウンドでのActivity起動</div>
* Android 10以降、バックグラウンドでのアクティビティ起動は制限されていますが、`Android 15`ではさらに制御が追加され、`悪意のあるバックグラウンドアプリケーション`が他のアプリケーションを前面に持ってくることを防止します。
* 現在、新しいフラグが追加され、バックグラウンドのアクティビティが他のアプリのアクティビティを開くことができなくなります。

  ```
  <application android:allowCrossUidActivitySwitchFromBelow="false" >
  ```

  実際の変更としては、開こうとしているアクティビティとスタックの最上層のアプリの`UIDが一致しない`場合、開くことができません。
  ↪ これはアプリが他の異なるアプリを開くのを防ぐためです。

* その他のバックグラウンドでのアクティビティ起動に関する制限
   - 現在、`PendingIntent`はデフォルトで`バックグラウンドアクティビティの起動をブロック`します。

<div class="c-border-content-title-1">ユーザーエクスペリエンスUIの改善</div>
* この調整はユーザーエクスペリエンスの改善を目的としています。以下に概要を示します。
  - `Edge-to-edge enforcement`：エッジからエッジまでの強制実行。Android 15では画面の端に強制的に内縮されます。
  ただし、`material 3`を使用している場合は影響を受けません。実際に`material 3を使用しているアプリ`は元のUIと一致します。

  <img src="/images/android15/011.png" width="80%">

  他のUIが影響を受ける可能性がある場合は注意が必要です。

  <img src="/images/android15/010.png" width="80%">

  &#x21AA; 上記の3番目の画像は、windowInsets.getInsetsなどを使用して調整した後のものです。

  またはmaterial 3を使用することもできます。

  
  - `elegantTextHeight attribute defaults to true`：デフォルトでelegantTextHeight属性が`true`になります。

  <img src="/images/android15/012.png" width="80%">

  - `Stable configuration`：configurationに関連する動作の調整。画面の向きやシステムバーのサイズの判断に影響する可能性があります。

	<a href="https://developer.android.com/about/versions/15/behavior-changes-15#stable-configuration">こちらをクリックして詳細を確認</a>
  - `Locale-aware default line height for EditText`：異なる言語に応じてEditTextの高さが異なる可能性があります。

  	<img src="/images/android15/013.png" width="80%">

  	✅ 変更後の状態が受け入れ可能かどうか確認してください。

  取り消すには、`useLocalePreferredLineHeightForMinimum`属性をfalseに設定します。
  - `TextView width changes for complex letter shapes`：複雑な文字のためにデフォルトの文字幅の割り当てルールが調整されました。

  複雑な文字により多くのスペースを提供します。

  ✅ `無効化/有効化`したい場合は、`setShiftDrawingOffsetForStartOverhang`属性を設定します。

* その他のUI/UXの詳細については、こちらのより完全なリファレンスを参照してください:<a href="https://developer.android.com/about/versions/15/behavior-changes-15#ux">こちらをクリック</a>

<div class="c-border-content-title-1">カメラとメディアの新しい制限</div>
* `オーディオフォーカス (audio focus)`をリクエストするには、現在`トップアプリ`または`オーディオ関連のフォアグラウンドサービス`である必要があります。そうでない場合、AUDIOFOCUS_REQUEST_FAILEDが返されます。
* 現在`オーディオ関連のフォアグラウンドサービス`と見なされるものは以下の通りです：
   -  mediaPlayback
   -  camera
   -  microphone
   -  phoneCall
   

   ✅ オーディオフォーカス (audio focus) を学ぶ <a href="https://developer.android.com/media/optimize/audio-focus">こちらをクリック</a>

<div class="c-border-content-title-1">非SDK制限の更新</div>
* 日常的なバージョン更新には以下が含まれます：<a href="https://developer.android.com/guide/app-compatibility/restrictions-non-sdk-interfaces#list-names">こちらをクリック</a>

 	✅  `非SDK`：Javaのメソッドが含まれます。これらのインターフェースはSDKの内部実装の詳細であり、予告なしに変更される可能性があります。
