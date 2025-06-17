---
layout: post
title: >-
  [Android Enterprise] In-depth Explanation and Comprehensive Study Notes on
  Android Enterprise
date: '2022-05-25 16:05:01 +0800'
image: cover/android-enterprise-1.png
tags:
  - Android
  - Enterprise
categories: AndroidDev
excerpt: >-
  Want to master Android Enterprise skills? This comprehensive study note is for
  you! It provides an in-depth explanation of Android Enterprise concepts and
  implementation methods, helping you quickly learn how to manage
  enterprise-level Android devices.
---

## 0. Introduction

* Android Management API Preparation
  - This API mainly sends requests via HTTP to the EMM console and interacts with apps under EMM devices.
  - Android 6.0+ devices
  - Gmail account for binding (If you encounter enterprise binding issues: [reference](https://support.google.com/work/android/thread/84928851/managed-google-play-android-enrollment%E2%80%8B-intune-you-have-already-signed-up-with-this-enterprise?hl=en))
  - Create a [Cloud Platform Project](https://console.cloud.google.com/project)
  - Enable Android Management API
     - Similar to other Google API services, enable `Android Management API` under the project in [Google Cloud Platform](https://console.cloud.google.com/cloud-resource-manager)
  - [Setup Guide Reference](https://colab.research.google.com/github/google/android-management-api-samples/blob/master/notebooks/quickstart.ipynb)
* Android Management API Method to Remove Enterprise
    - Cancel device configuration
      1. Obtain the enterprise device list via HTTP GET
      `curl -X GET https://androidmanagement.googleapis.com/v1/{parent=enterprises/*}/devices`
      Replace `{parent=enterprises/*}` with the format `enterprises/{enterprise-id}`
      Response:
      <script src="https://gist.github.com/waitzShigoto/ecdf9831492804818412a9d190889fe1.js"></script>

      2. Delete the enterprise device via HTTP DELETE  
      `curl -X DELETE https://androidmanagement.googleapis.com/v1/{name=enterprises/*/devices/*}`
      Replace `name` with the name obtained from the previous response

    - Delete the Enterprise from the account
      1. Go to [play.google.com/work](play.google.com/work)
      2. Find Admin Settings
      3. Click the icon with three dots
      4. Press Delete Organization to remove the previously created enterprise

* AMAPI SDK Preparation

    - [Import Reference](https://developers.google.com/android/management/extensibility-sdk-integration#adding_queries_element)
    - API level 21+ can use this SDK
    - API level 30+ requires additional query fragment settings in Manifest.xml
    - This SDK mainly provides some functions to directly send commands to the Android Device Policy app
     For example: clear specified package data, monitor command changes, [reference](https://developers.google.com/android/management/extensibility-sdk-integration#adding_queries_element)

* [Pub/Sub API](https://developers.google.com/android/management/notifications) Preparation
  - A method to receive notifications for new registered devices, device reports, and new issued commands

     1. Enable the Android Management API
     2. Create a topic (create within the console or use [projects.topics.create](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/create))
     3. Create a subscription (create within the console or use [projects.subscriptions.create](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/create))
     4. Grant Android Device Policy [right](https://developers.google.com/android/management/notifications#4_grant_android_device_policy_the_right_to_publish_to_your_topic) (app)
     5. Update the enterprise to support notifications [enterprises.patch](https://developers.google.com/android/management/notifications#5_update_enterprise_to_support_notifications)  
     6. Start using to receive notifications

  - [Sample code](https://cloud.google.com/pubsub/lite/docs/samples) for the API

## 1. Development

* Android Management API There are two ways to create an enterprise: [Customer-managed enterprises](https://developers.google.com/android/management/create-enterprise#customer-managed_enterprises), [EMM-managed enterprises](https://developers.google.com/android/management/create-enterprise#emm-managed_enterprises)

* Android Management API Unlock Device Password
  - Update via HTTP Patch [enterprises.policies](https://developers.google.com/android/management/reference/rest/v1/enterprises.policies/patch)
For example: `curl -X PATCH https://androidmanagement.googleapis.com/v1/{name=enterprises/*/policies/*}  -d '{json=ResourcePolicy}'` 

  The Patch URL `{name=enterprises/*/policies/*}` should include the corresponding policyID

  The format is `enterprises/{enterpriseId}/policies/{policyId}`

  The request body `{json=ResourcePolicy}` should include the corresponding [Resource Policy format](https://developers.google.com/android/management/reference/rest/v1/enterprises.policies#Policy)

       - In the request body, there is a key passwordRequirements where you can include the corresponding [PasswordRequirements json format](https://developers.google.com/android/management/reference/rest/v1/PasswordRequirements) to set it
       <script src="https://gist.github.com/waitzShigoto/a73f43b9b538e0ea0ecb2e40c337e420.js"></script>

* Android Management API Lock Bottom Bar Buttons
  - Similarly, update via HTTP Patch [enterprises.policies](https://developers.google.com/android/management/reference/rest/v1/enterprises.policies/patch), and in the request body, the `SystemNavigation` can be set to display the bottom bar
  - Must be in kiosk mode
  - The documentation mentions that to enable kiosk mode, set the value of kioskCustomLauncherEnabled
  - Currently, it is seen that it provides options to display only the Home button or to hide both the Home and Overview buttons

* AMAPI SDK [Clear data for a specified package](https://developers.google.com/android/management/extensibility-sdk-integration#send_requests_to_android_device_policy)
  - Use `LocalCommandClientFactory.create(getContext()).issueCommand(createClearAppRequest(packageNames)`

  to remove data for the specified package

