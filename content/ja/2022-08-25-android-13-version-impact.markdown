---
layout: post
title: Android 13 開発におけるバージョン差異への対応方法：重要なテクニックを公開！
date: '2022-08-25 11:11:58 +0800'
image: cover/android-version-adaptation-13-1.png
tags:
  - Android
  - Debug
  - aosp
  - ota
categories: DebugAndOptimize
excerpt: >-
  この記事では、Android 13
  バージョンアップによる開発の課題とその解決策について紹介します。いくつかの重要なテクニックを共有することで、開発者がバージョン差異に対応する際に役立つ情報を提供し、スムーズに開発タスクを完了できるよう支援します。
---

この記事では、私の開発経験を共有し、

Android バージョンアップによる課題とその解決策について探ります。

私が直面した問題を分析することで、

開発過程で同様の問題に直面した際に役立つ洞察を提供できればと思います。

<div class="c-border-content-title-4">
   Android 13以上 バッテリー使用量の新しい制限:<a href="https://developer.android.com/about/versions/13/changes/battery#restricted-background-battery-usage" target="_blank">参考ドキュメント</a>
</div>
  - Android 13 をターゲットプラットフォームとする場合、他の理由でアプリが起動しない限り、システムは以下のブロードキャストを送信しません：
      - BOOT_COMPLETED
      - LOCKED_BOOT_COMPLETED

<div class="c-border-content-title-4">
   BUILD_SDKバージョンを33に上げると、ByteArrayOutputStreamにwriteBytes(byte data[])メソッドが追加されました
</div>

 - 以前の開発で、誰かが独自に`writeBytes`メソッドを作成していたため、名前が重複してコンパイルエラーが発生しました
 - BUILD SDKを上げることを検討している場合、プロジェクトオーナーは削除、名前変更、または前にpublicを追加することを検討できます
   ![android13_lib_error.png](/images/others/android13_lib_error.png)

<div class="c-border-content-title-4">
   Device Admin権限行為調整
</div>
  - Device Admin権限がある場合、アプリが使用されていないときに権限を削除すると、常に無効になります。
  （自分でテストしたところ、Device Admin権限を無効にしても、この権限はグレーアウトされて変更できません）
<div class="c-border-content-title-4">
     Android 13 アクセス権限の細分化
</div>
  - 古い権限のみを要求するとクラッシュしますが、`すべてのファイルアクセス権`で代替できます。
  ![android13_access_permission.png](/images/others/android13_access_permission.png)
  - AirDroidは`すべてのファイルアクセス権`を要求しているため、現在のところ変更は不要です。以下はそのページに遷移するIntentです。 

    `new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);`
  - 変更が必要な場合は、デモを参考にしてください：
  <script src="https://gist.github.com/waitzShigoto/d75998c921b176e659c911a938da4930.js"></script>

  <div class="c-border-content-title-4">
       Android 13 通知権限の変化
  </div>
  - Android 13では通知機能がデフォルトで無効になっています：[通知権限変更の公式ドキュメント](https://developer.android.com/guide/topics/ui/notifiers/notification-permission?hl=zh-tw)
  - そのため、NotificationManagerを実行すると
    システムが通知を有効にするよう要求します。

  - 変更された動作については、[ネット上のユーザー適応記事](https://zhuanlan.zhihu.com/p/572147515)を参考にしてください。

  - 権限を自分で処理する場合は、target SDKを33に上げる必要があります。
    そうすれば、Manifest.permission.POST_NOTIFICATIONS権限を処理できます。

    または、target SDK 32の場合、NotificationManagerの初期化を後に移動します。
    ただし、Manifest.permission.POST_NOTIFICATIONSに対するユーザーの拒否時の処理はできません。

  - ターゲットSDK 33デモパッチ: [デモ](http://192.168.201.72:8080/c/airsos/+/21558)
