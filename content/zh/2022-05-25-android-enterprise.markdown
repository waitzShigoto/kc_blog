---
layout: post
title: "[Android Enterprise]深入淺出的說明，Android Enterprise 完整研究筆記分享"
date: 2022-05-25 16:05:01 +0800
image: cover/android-enterprise-1.png
tags: [Android,Enterprise]
categories: Android教學
excerpt: "想要掌握 Android Enterprise 的技巧嗎？這份完整的研究筆記分享給你！深入淺出的說明 Android Enterprise 相關概念和實作方法，讓你快速學會如何管理企業級的 Android 裝置。"
---

## 0. 前導

* Android Management API 準備工作
  -  這個API主要透過http連線發request 給EMM console 再與EMM裝置下的app作用
  -  Android 6.0+ 裝置
  -  Gmail 帳號用來綁定 (若遇到企業綁定問題:[參考](https://support.google.com/work/android/thread/84928851/managed-google-play-android-enrollment%E2%80%8B-intune-you-have-already-signed-up-with-this-enterprise?hl=en)）
  -  建立 [Cloud Platform Project](https://console.cloud.google.com/project)
  -  啟用 Android Management API
     - 類似其他Google API服務，至[Google cloud platform](https://console.cloud.google.com/cloud-resource-manager)的專案下啟用`Android Management API`
  -  [設定指南參考](https://colab.research.google.com/github/google/android-management-api-samples/blob/master/notebooks/quickstart.ipynb)
* Android Management API 移除 Enterprise 方式
    - 取消裝置配置
      1. 透過http GET 取得enterprise 裝置列表
      `curl -X GET https://androidmanagement.googleapis.com/v1/{parent=enterprises/*}/devices`
      上方 `{parent=enterprises/*}` 帶入格式 `enterprises/{enterprise-id}`
      Response :
      <script src="https://gist.github.com/waitzShigoto/ecdf9831492804818412a9d190889fe1.js"></script>

      2. 透過http DELETE刪除enterprise裝置  
      `curl -X DELETE https://androidmanagement.googleapis.com/v1/{name=enterprises/*/devices/*}`
      其中name帶入之前response拿到的name

    - 刪除帳號內的Enterprise
      1. 至[play.google.com/work](play.google.com/work)
      2. 找到Admin Settings
      3. 點三個點的那個圖示
      4. 按下Delete Organization 移除之前創建的enterprise

* AMAPI SDK 準備工作

    - [導入參考](https://developers.google.com/android/management/extensibility-sdk-integration#adding_queries_element)
    - API level 21+ 可用該sdk
    - API level 30+ 需額外在Manifest.xml設定query片段
    - 該SDK主要提供一些功能，讓你直接發送command給Android Device Policy 的app
     如：clear指定package資料、監聽command變化，[可參考](https://developers.google.com/android/management/extensibility-sdk-integration#adding_queries_element)

* [Pub/Sub API](https://developers.google.com/android/management/notifications) 準備工作
  - 一種用來接收 新註冊設備、設備報告、新發出指令的通知

     1. 開啟Android Management API
     2. 創建topic (console內創建或使用[projects.topics.create](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/create))
     3. 創建subscription (console內創建或使用[projects.subscriptions.create](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/create))
     4. 取得Android Device Policy [right](https://developers.google.com/android/management/notifications#4_grant_android_device_policy_the_right_to_publish_to_your_topic)(app)
     5. 更新enterprise來支援通知[enterprises.patch](https://developers.google.com/android/management/notifications#5_update_enterprise_to_support_notifications)  
     6. 開始使用來接收通知

  - 該API的[Sample code](https://cloud.google.com/pubsub/lite/docs/samples)

## 1. 開發

* Android Management API 這裡有兩種方式來創建enterprise : [Customer-managed enterprises](https://developers.google.com/android/management/create-enterprise#customer-managed_enterprises)、[EMM-managed enterprises](https://developers.google.com/android/management/create-enterprise#emm-managed_enterprises)

* Android Management API 解鎖設備密碼
  - 透過 http Patch [enterprises.policies](https://developers.google.com/android/management/reference/rest/v1/enterprises.policies/patch)來更新
例如 ： `curl -X PATCH https://androidmanagement.googleapis.com/v1/{name=enterprises/*/policies/*}  -d '{json=ResourcePolicy}'` 

  前面Patch url `{name=enterprises/*/policies/*}`帶入對應policyID

  格式為`enterprises/{enterpriseId}/policies/{policyId}`

  後面request body 的`{json=ResourcePolicy}`帶入對應的[Resource Policy format](https://developers.google.com/android/management/reference/rest/v1/enterprises.policies#Policy)

       - request body 中有個key passwordRequirements這邊帶入對應的[PasswordRequirements json format](https://developers.google.com/android/management/reference/rest/v1/PasswordRequirements)來設定
       <script src="https://gist.github.com/waitzShigoto/a73f43b9b538e0ea0ecb2e40c337e420.js"></script>

* Android Management API 鎖定底部欄按鈕
  - 一樣透過 http Patch [enterprises.policies](https://developers.google.com/android/management/reference/rest/v1/enterprises.policies/patch)，發送時，request body 內的`SystemNavigation`可以設定底部欄位顯示
  - 需在kiosk mode下
  - 文件中提到 要開啟kiosk mode則設定kioskCustomLauncherEnabled的值
  - 目前看到，提供只顯示Home鍵或是不顯示Home + Overview鍵

* AMAPI SDK [清除指定package的data](https://developers.google.com/android/management/extensibility-sdk-integration#send_requests_to_android_device_policy)
  - 用`LocalCommandClientFactory.create(getContext()).issueCommand(createClearAppRequest(packageNames)`

  來移除指定package data

