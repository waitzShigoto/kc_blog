---
layout: post
title: '[Android Enterprise] 深入浅出的説明、Android Enterprise 完全研究ノートの共有'
date: '2022-05-25 16:05:01 +0800'
image: cover/android-enterprise-1.png
tags:
  - Android
  - Enterprise
categories: AndroidDev
excerpt: >-
  Android Enterpriseの技術を習得したいですか？この完全な研究ノートを共有します！Android
  Enterpriseの関連概念と実装方法を分かりやすく説明し、企業向けのAndroidデバイスを迅速に管理する方法を学べます。
---

## 0. 前書き

* Android Management API の準備作業
    - このAPIは主にhttp接続を通じてリクエストをEMMコンソールに送り、EMMデバイス上のアプリに作用します
    - Android 6.0+ デバイス
    - バインドにGmailアカウントを使用 (企業バインドの問題がある場合は:[参考](https://support.google.com/work/android/thread/84928851/managed-google-play-android-enrollment%E2%80%8B-intune-you-have-already-signed-up-with-this-enterprise?hl=en)）
    - [Cloud Platform Project](https://console.cloud.google.com/project)を作成
    - Android Management APIを有効化
        - 他のGoogle APIサービスと同様に、[Google cloud platform](https://console.cloud.google.com/cloud-resource-manager)のプロジェクトで`Android Management API`を有効化
    - [設定ガイド参考](https://colab.research.google.com/github/google/android-management-api-samples/blob/master/notebooks/quickstart.ipynb)
* Android Management APIでEnterpriseを削除する方法
    - デバイス構成を解除
        1. http GETでenterpriseデバイスリストを取得
           `curl -X GET https://androidmanagement.googleapis.com/v1/{parent=enterprises/*}/devices`
           上記 `{parent=enterprises/*}` は形式 `enterprises/{enterprise-id}` を使用
           Response :
      <script src="https://gist.github.com/waitzShigoto/ecdf9831492804818412a9d190889fe1.js"></script>

        2. http DELETEでenterpriseデバイスを削除  
           `curl -X DELETE https://androidmanagement.googleapis.com/v1/{name=enterprises/*/devices/*}`
           ここでnameは前のresponseから取得したnameを使用

    - アカウント内のEnterpriseを削除
        1. [play.google.com/work](play.google.com/work)へ移動
        2. Admin Settingsを見つける
        3. 三つの点のアイコンをクリック
        4. Delete Organizationをクリックし、以前作成したenterpriseを削除

* AMAPI SDKの準備作業

    - [インポート参考](https://developers.google.com/android/management/extensibility-sdk-integration#adding_queries_element)
    - APIレベル21+でこのSDKが使用可能
    - APIレベル30+ではManifest.xmlにqueryセクションを追加する必要あり
    - このSDKは主にいくつかの機能を提供し、Android Device Policyアプリにコマンドを直接送信することが可能
      例：指定されたパッケージのデータをクリアする、コマンドの変化を監視する、[参考](https://developers.google.com/android/management/extensibility-sdk-integration#adding_queries_element)

* [Pub/Sub API](https://developers.google.com/android/management/notifications) の準備作業
  - 新規デバイス登録、デバイスレポート、新しいコマンド通知を受信するためのAPI

     1. Android Management APIを有効にする
     2. トピックを作成する（コンソール内で作成するか、[projects.topics.create](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/create)を使用）
     3. サブスクリプションを作成する（コンソール内で作成するか、[projects.subscriptions.create](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/create)を使用）
     4. Android Device Policyに[権限](https://developers.google.com/android/management/notifications#4_grant_android_device_policy_the_right_to_publish_to_your_topic)を付与する（アプリ）
     5. 通知をサポートするためにエンタープライズを更新する[enterprises.patch](https://developers.google.com/android/management/notifications#5_update_enterprise_to_support_notifications)  
     6. 通知を受信するために使用を開始する

  - このAPIの[サンプルコード](https://cloud.google.com/pubsub/lite/docs/samples)

## 1. 開発

* Android Management API にはエンタープライズを作成するための2つの方法があります: [Customer-managed enterprises](https://developers.google.com/android/management/create-enterprise#customer-managed_enterprises)、[EMM-managed enterprises](https://developers.google.com/android/management/create-enterprise#emm-managed_enterprises)

* Android Management API デバイスのパスワードを解除する
  - HTTP Patch [enterprises.policies](https://developers.google.com/android/management/reference/rest/v1/enterprises.policies/patch)を通じて更新します
例 ： `curl -X PATCH https://androidmanagement.googleapis.com/v1/{name=enterprises/*/policies/*}  -d '{json=ResourcePolicy}'` 

  前のPatch URL `{name=enterprises/*/policies/*}`に対応するpolicyIDを入力します

  フォーマットは`enterprises/{enterpriseId}/policies/{policyId}`です

  後のリクエストボディの`{json=ResourcePolicy}`に対応する[Resource Policy format](https://developers.google.com/android/management/reference/rest/v1/enterprises.policies#Policy)を入力します

       - リクエストボディにはkey passwordRequirementsがあり、ここに対応する[PasswordRequirements json format](https://developers.google.com/android/management/reference/rest/v1/PasswordRequirements)を設定します
       <script src="https://gist.github.com/waitzShigoto/a73f43b9b538e0ea0ecb2e40c337e420.js"></script>

* Android Management API ボトムバーのボタンをロックする
  - 同様にHTTP Patch [enterprises.policies](https://developers.google.com/android/management/reference/rest/v1/enterprises.policies/patch)を通じて、リクエストボディ内の`SystemNavigation`を設定してボトムバーの表示を制御します
  - キオスクモードである必要があります
  - ドキュメントには、キオスクモードを有効にするにはkioskCustomLauncherEnabledの値を設定する必要があると記載されています
  - 現在、ホームボタンのみを表示するか、ホーム+概要ボタンを表示しないオプションが提供されています

* AMAPI SDK [指定されたパッケージのデータをクリア](https://developers.google.com/android/management/extensibility-sdk-integration#send_requests_to_android_device_policy)
  - `LocalCommandClientFactory.create(getContext()).issueCommand(createClearAppRequest(packageNames)`を使用して

  指定されたパッケージのデータを削除します

