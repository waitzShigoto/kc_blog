---
layout: post
title: "Android 16 適応ノート"
date: 2025-02-12 09:29:10 +0800
image: cover/android-version-adaptation-16.png
tags: [Android, SDK]
permalink: /android-16-note
categories: DebugAndOptimize
excerpt: "Android 16 適応ノート"
---

## Android 16 開発タイムライン (2024-2025)
* プレビューフェーズ (2024)
    - 11月: Dev Preview 1 - ベースラインバージョン
    - 12月: Dev Preview 2 - 機能アップデート

* ベータフェーズ (2025)
  - 1月: Beta 1
  - 2月: Beta 2
  - 3月: Beta 3
  - 4-5月: 最終バージョンテスト
  - 最終リリース

* 最終バージョンは2025年第2四半期に予定。本日（2025年2月11日）時点で、GoogleはBeta 1までリリースしています
  - [詳細](https://developer.android.com/about/versions/16/overview?hl=ja)

## 動作変更

### すべてのアプリケーション：`targetSdkVersion`に関係なく、以下の動作変更がすべてのアプリケーションに適用されます
#### JobSchedulerクォータの最適化
* システムはJobSchedulerに対してさらに実行時間制限を設けるようになりました。これは、バックグラウンドタスクの頻度とリソース消費をさらに制限し、システム全体のパフォーマンスとバッテリー寿命を向上させることを目的としています。開発者はこれに対して一定の予測をしておく必要があります。（Google は正確な実行時間については言及せず、「クォータ」という言葉を使用しているため、以下の状況に備える必要があります）
* 影響を受ける領域：
  - JobSchedulerの実行時間クォータは、アプリのスタンバイバケット（app standby bucket）によって決定されます。開発者は異なるスタンバイバケットにいる場合に、異なるクォータが割り当てられることを予測する必要があります。以下のコードで処理できます：
    ```kotlin
    val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    val bucket = usageStatsManager.appStandbyBucket

    when (bucket) {
        UsageStatsManager.STANDBY_BUCKET_ACTIVE -> {
            // アクティブ：より寛大な実行時間クォータ
        }
        UsageStatsManager.STANDBY_BUCKET_RARE -> {
            // ほとんど使用されていない：より厳しい実行時間クォータ
        }

        ... 詳細な状態についてはAPIを参照してください
    }
    ```
  - アプリが表示されている時にJobが開始された場合でも、アプリがバックグラウンドに移行すると、Jobは実行時間の制限を受けます
    ```kotlin
    // アプリが表示されている時にJobが開始された場合でも
    val jobInfo = JobInfo.Builder(...)
        .build()

    jobScheduler.schedule(jobInfo)
    // アプリがバックグラウンドに移行すると
    // Jobは実行時間クォータの制限を受けます
    ```
  - 同時に以下の状況がある場合：
    1. 実行中のForegroundService
    2. JobSchedulerを通じてスケジュールされたタスク
       両方が同時に実行されている場合、JobSchedulerのタスクは実行時間クォータの制限を受けます。

* 上記の「影響を受ける領域」は、`WorkManager`、`JobScheduler`、`DownloadManager`を使用してスケジュールされたタスクを制限します
  - Jobが停止した理由をデバッグするには、Googleは `WorkInfo.getStopReason()`（JobSchedulerの場合は`JobParameters.getStopReason()`）を呼び出して停止理由を確認することを推奨しています。
  - または、`JobScheduler#getPendingJobReasonsHistory`を使用して停止理由を確認することもできます。

* 開発テスト中に、adbコマンドを使用して異なるJobクォータ制限シナリオをテストする方法は？
    ```kotlin
    # アプリのパッケージ名がcom.example.appだと仮定

    # 1. フォアグラウンドで起動されたJobがクォータ制限を受けないようにする
    adb shell am compat enable OVERRIDE_QUOTA_ENFORCEMENT_TO_TOP_STARTED_JOBS com.example.app

    # 2. Foreground Serviceと同時に実行されるJobがクォータ制限を受けないようにする
    adb shell am compat enable OVERRIDE_QUOTA_ENFORCEMENT_TO_FGS_JOBS com.example.app

    # 3. アプリのスタンバイバケットを手動で設定する
    adb shell am set-standby-bucket com.example.app active

    # オプションのバケット：
    # - active
    # - working_set
    # - frequent
    # - rare
    # - restricted
    # アプリの現在のスタンバイバケットを照会する
    adb shell am get-standby-bucket com.example.app
    ```

#### JobInfo#setImportantWhileForegroundとJobInfo#isImportantWhileForeground()の完全な廃止
* `setImportantWhileForeground`の機能は：このJobがアプリがフォアグラウンドにある間重要であることをシステムに伝え、アプリがフォアグラウンドにある時やアプリが一時的にバックグラウンド制限を受けていない時にこのJobを優先的に実行することを期待するものです
    ```kotlin
    # Android 12で非推奨としてマークされました
    # Android 16で完全に廃止され、使用しても無視されます

    val jobInfo = JobInfo.Builder(jobId, componentName)
        .setImportantWhileForeground(true)
        .build()
    ```

#### `Ordered broadcast`の優先度スコープはもはやグローバルではない
* ブロードキャストの順序設定はもはや効果がなくなる可能性があります
* 以前の動作：
  - Androidはブロードキャストレシーバー（Broadcast Receivers）に優先順位を設定することを許可していました
    これは2つの方法で設定できました：
    1. マニフェストファイル（Manifest）でandroid:priority属性を使用する
    2. コードIntentFilter#setPriority()を使用して設定する
  - システムは優先順位に従って`高から低へ`順番にブロードキャストを送信していました
* `Android 16`での変更：
  - プロセス間の優先順位はもはや保証されません：
    1. 異なるプロセス間のブロードキャスト受信順序は、優先順位に従って実行されることが保証されなくなります
    2. 優先順位は`同じアプリケーションプロセス内`でのみ有効です
  - 優先順位範囲の制限：
    1. 優先順位値は自動的に`(SYSTEM_LOW_PRIORITY + 1, SYSTEM_HIGH_PRIORITY - 1)`の範囲に制限されます
    2. `システムコンポーネント`のみが最高および最低システム優先順位を使用できます

* `影響を受ける可能性のある状況`：
  - アプリケーションが`異なるプロセス`で同じ`broadcast intent`を登録し、特定の順序で受信することを期待している場合
  - アプリケーションが`他のプロセス`と対話する必要があり、ブロードキャスト受信の順序に依存している場合

#### ART内部変更（Android Runtime）

* 背景情報：https://source.android.com/docs/core/ota/modular-system?hl=ja
  - Android 10はMainline（モジュラーシステムコンポーネント）を導入しました：Mainlineは特定の`Androidシステムコンポーネント`をモジュール化し、Androidの通常のリリースサイクル外でこれらのコンポーネントを更新します
  - そのため、Google Playは現在Mainlineを通じてシステムコンポーネントを更新できます

* Android 16には最新のART更新が含まれています
  - 実行パフォーマンスの向上
  - より多くのJava機能のサポート
  - これらの改善は`Google Playシステム更新`を通じて`Android 12`以上を実行しているデバイス（10億台以上）に提供されます
  - [GoogleからのART公式ブログ](https://android-developers.googleblog.com/2023/11/the-secret-to-androids-improved-memory-latest-android-runtime-update.html)

* `潜在的な互換性の問題`
  - ARTライブラリに依存するアプリケーションはAndroid 16で正常に機能しない可能性があります
  - この問題は、ARTモジュールがGoogle Playシステム更新を通じて更新される`古いAndroidバージョン`にも影響します

* 開発者への影響：
  - ART更新の影響を受けるかどうかをテストする必要があります
  - 関連する互換性の問題については、公式バージョン情報を確認してください：[ここをクリック](https://developer.android.com/about/versions/16/release-notes?hl=ja#art-impacted-libraries)

#### ユーザーエクスペリエンスとシステムUIの調整
* [妨害的なアクセシビリティツールの廃止に関するお知らせ](https://developer.android.com/about/versions/16/behavior-changes-all?hl=ja#disruptive-a11y)
  - Android 16では、announceForAccessibilityを使用するか、TYPE_ANNOUNCEMENTをディスパッチする`アクセシビリティアナウンス`が廃止されました
  - `開発者への影響`：主にAPIの調整なので、[ドキュメント](https://developer.android.com/reference/android/view/View#announceForAccessibility(java.lang.CharSequence))を直接参照できます

* 3ボタンナビゲーションのサポート
  - `3ボタンナビゲーション`：主に`予測バック（predictive back）`機能の追加を指します。予測バックは、ユーザーがナビゲーションバーのバックボタンを`長押し`すると、ジェスチャーに基づいて希望のナビゲーション位置に移動できるようにするものです。
    詳細については、このリンクのビデオをご覧ください：https://developer.android.com/about/versions/16/behavior-changes-all?hl=ja#three-button-predictive-back
  - ただし、`サポート`と記載されているため、`現段階`では開発者がサポートしている必要があり、すべてのメーカーのOTAがサポートしているかどうかは確かではありません。使用している場合は確認する必要があります。
    （またはAndroid 16 SDKをターゲットにすることでデフォルトで有効になります）
  - 実際のシステム進化：
    1. Android 13（API 33）：
       開発者オプションで「予測バックアニメーション」を有効にする必要があります
       アプリが関連機能を実装していても、アニメーション効果を見るには開発者オプションが必要です
    2. Android 14（API 34）：
       アプリケーションまたはアクティビティのManifestで有効/無効を選択できます
        ```xml
        <manifest ...>
            <application . . .

                android:enableOnBackInvokedCallback="false">

                <activity
                    android:name=".MainActivity"
                    android:enableOnBackInvokedCallback="true"
                    ...
                </activity>
                <activity
                    android:name=".SecondActivity"
                    android:enableOnBackInvokedCallback="false"
                    ...
                </activity>
            </application>
        </manifest>
        ```
    アニメーション効果をテストするには`開発者オプション`が必要です
    3. Android 15（API 35）以上：
       開発者オプションが不要になります
       アプリが実装して有効にしている場合、アニメーション効果が直接表示されます

  - 開発者への影響：
    1. 上記の機能を実装するには`AppCompat 1.6.0-alpha05（AndroidX）`以上のAPIを使用する必要があります
    2. 実際のコードは[公式ドキュメント](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture?hl=ja#migrate-app)を参照できます
    3. Android 16以上をターゲットとするアプリは、関連イベントを処理するか無効にする必要があります。

### すべてのアプリケーション：Android 16以上をターゲットとするアプリのみが影響を受けます
#### ユーザーエクスペリエンスとシステムUIの調整
* `開発者`は予測バック機能を移行するか、オプトアウトする必要があります
  - 前のセクションで述べたように、targetSDKに関係なく、Android 16の動作は予測バック機能を`サポート開始`します
  - 開発者は予測バックイベントを処理するか、直接無効にすることを選択する必要があります。`システムはデフォルトで有効`にしています。
    （上記のセクションのコードまたは記事を参照できます）
    1. 関連コードを実装して処理する
    2. `android:enableOnBackInvokedCallback="false"`を設定して無効にする

#### scheduleAtFixedRateの最適化
* 旧バージョン：アプリが有効なライフサイクルに戻ると、すべての見逃された実行ジョブがすぐに実行されます
* 新バージョン：最大で1つの見逃された実行ジョブのみがすぐに実行されます
* APIドキュメント：https://developer.android.com/reference/java/util/concurrent/ScheduledExecutorService?hl=ja#scheduleAtFixedRate(java.lang.Runnable,%20long,%20long,%20java.util.concurrent.TimeUnit)

#### 大画面とフォームファクター仕様の調整
* 大画面の定義：`最小幅`が600 dp以上の画面
* Googleは、今日のマルチデバイス世界では方向と再サイズの制限が厳しすぎるため、アプリは`適応型レイアウト`で作成すべきだと述べています。
  （将来的には関連するパラメータを徐々に削除する可能性がありますが、現在は主に大画面を対象としています）
  ![Screenshot 2025-02-11 at 4.54.44 PM.png](/attachment/67ab1059ddf687cea7b2c219)

* targetSDK Android 16では、最小幅≥600dpの画面で、システムは以下を無視します：
  `画面方向制限`、`サイズ変更制限`、`表示比率制限`
* 以下の設定は大画面デバイスでは無視されます
    ```kotlin
    screenOrientation
    resizableActivity
    minAspectRatio
    maxAspectRatio
    setRequestedOrientation()
    getRequestedOrientation()
    ```
* 大画面では、システムはscreenOrientation、setRequestedOrientation()、getRequestedOrientation()の以下の値を無視します：
    ```
    portrait
    reversePortrait
    sensorPortrait
    userPortrait
    landscape
    reverseLandscape
    sensorLandscape
    userLandscape
    ```

* ただし、現段階では、Googleはこの動作からオプトアウトするためのパラメータも提供しており、移行期間（API 37まで）を与えています
  ![Screenshot 2025-02-11 at 5.01.54 PM.png](/attachment/67ab1205ddf687cea7b2c371)

    ```xml
    ## この動作からオプトアウトするページを指定する（API 37まで）
    <activity>
      <property 
        android:name="android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY" 
        android:value="true" />
    </activity>

    ## この動作からグローバルにオプトアウトする（API 37まで）
    <application ...>
      <property android:name="android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY" android:value="true" />
    </application>
    ``` 