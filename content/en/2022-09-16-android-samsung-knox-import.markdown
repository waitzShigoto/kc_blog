---
layout: post
title: "Create More Secure Android Applications! Learn the Simple Way to Integrate Samsung Knox SDK"
date: 2022-09-16 14:41:08 +0800
image: cover/samsung-android-knox-1.png
tags: [Android,Debug,Samsung,knox]
categories: Android教學
---

## Samsung Knox SDK is a Security Solution

<div class="c-border-content-title-4">
  It provides various security control and management options, allowing enterprises to easily protect their sensitive data and applications.
  Developers can implement the following features in their applications:
</div>
<p class = "table_container">
  <b>Secure Container</b>: Used to separate and protect enterprise data and applications from unauthorized access.

  <b>VPN</b>: Used to establish a secure VPN connection to protect network traffic and data.

  <b>Encryption</b>: Used to encrypt data to ensure its security during transmission.

  <b>Policy Management</b>: Used to manage device settings and policies, such as password rules, device locking, data wiping, etc.

  <b>Authentication</b>: Used to implement strong authentication features, including biometric and smart card authentication.

  <b>Security Updates</b>: Used to securely update applications and operating systems to enhance overall security.

  This article mainly explains

  some basic concepts when integrating the Samsung Knox SDK

  and shares <b>the pitfalls encountered</b> with you

</p>

## Introduction

* Currently supported Samsung phones and versions: [Reference](https://www.samsungknox.com/en/knox-platform/supported-devices)
  - When Knox is not supported, the official suggestions and methods: [Reference](https://docs.samsungknox.com/admin/fundamentals/faqs/kba-349-about-android-others-android-go-devices.htm)
  - Various Knox services: [Reference](https://docs.samsungknox.com/admin/knox-admin-portal/welcome.htm)
* Download and install Knox SDK
  - According to the official website [Install the SDK](https://docs.samsungknox.com/dev/knox-sdk/install-sdk.htm), import the relevant SDK into the project
  - When importing, you may encounter which version to use, refer to the [mapping table](https://docs.samsungknox.com/dev/common/knox-version-mapping.htm)
  - Obtain a [license key](https://docs.samsungknox.com/dev/common/tutorial-get-a-license.htm)
     - If developing a version before Knox 2.7, the generated license key can be "optionally" backward compatible
     - License keys are divided into `Development Key` and `Commercial Key`, which can be configured according to `testing` or `release`
     - Associated APK: Only the associated APK can use the generated license key
     `(There is an optional option in the backend that can be checked or unchecked)`
     - After testing, `Development Key` can only have one under the same account
     -> [License key rules and restrictions](https://docs.samsungknox.com/dev/common/knox-licenses.htm)
  - Activating the license key during development varies with different Knox versions: [Refer here](https://docs.samsungknox.com/dev/knox-sdk/tutorial-activate-license.htm)
  - Official examples related to Knox development are provided: [Reference](https://docs.samsungknox.com/dev/knox-sdk/tutorial-overview.htm)

  * Knox license
    - [List of available license permissions](https://docs.samsungknox.com/dev/common/license-permissions.htm)
    - [Three more readable versions of the license](https://docs.google.com/spreadsheets/d/1Os01grTu-vDTVm5SL8VVn1QZ4NH_3gbHDT9ILAGhiEM/edit?usp=sharing)
    - After backend testing, the SDK license key is further divided into:
        - `KPE Development`: For testing environments, key lifespan `0.5 years`
        - `KPE Standard`: Allows access to Standard permissions, 10,000,000 seats, key lifespan `2 years`
        - `KPE Premium`: Allows access to Standard, Premium, and Custom permissions, 10,000,000 seats, key lifespan `2 years`
        - `KPE DualDAR`: Allows access to Standard, Premium, Custom, and DualDAR permissions, negotiated with agents for annual or permanent subscription
    - Development permission declaration:
        - `Knox 3.0` provides the declaration of partial permissions, which can be declared in AndroidManifest.xml. If not declared, all Knox permissions are enabled by default. If declared, only the declared permissions are allowed. [Reference](https://docs.samsungknox.com/dev/common/tutorial-knox-permissions.htm)

  * Current preliminary comparison with native `AirDroid Biz` using DevicePolicyManager (only comparing similar APIs for now, `can discuss which ones to use, then test actual behavior`)
    - All permissions can be [viewed here](https://docs.google.com/spreadsheets/d/1Os01grTu-vDTVm5SL8VVn1QZ4NH_3gbHDT9ILAGhiEM/edit?usp=sharing)
    - Actual comparison of `commonly used DevicePolicyManager` and Knox provided functionalities for reference
    <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ09cQTkBr3L2di8b886ZcjEA9FMlv0trg90SgQFMg4okJx3YERuAXBNDtdSzmVRdxmSXxWMdchBaXL/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false" height="700"
       width="80%"></iframe>

  * Reference Links
    - [Samsung Knox Developer Official Website](https://developer.samsungknox.com/#)
    - [Developer Documentation Official Website](https://docs.samsungknox.com/dev/index.htm)
    - [Knox SDK Introduction](https://docs.samsungknox.com/dev/knox-sdk/index.htm)
    - [Knox API Documentation](https://docs.samsungknox.com/devref/knox-sdk/reference/packages.html)

## Knox Architecture Developer Documentation

  - Samsung Knox provides both web-based and device-based methods for use. Its current architecture:  
   <img src="https://docs.samsungknox.com/dev/common/images/knox-ecosystem.png" width="60%"/>

## Activate License Note
   * Android 6.0.1 Samsung S6, testing `Knox 3.8`
     - Downloaded Knox 3.8 version from Samsung developer backend, usage method [knox3.7.1 higher](https://docs.samsungknox.com/dev/knox-sdk/tutorial-activate-license.htm), encountered exception when parsing URI
     - Switched to [knox2.7 lower](https://docs.samsungknox.com/dev/knox-sdk/tutorial-activate-license.htm) and encountered `java.lang.RuntimeException: Stub!`

       -> Solution: Add `supportlib.jar` and include in gradle dependencies

       `When using the Add as library feature in IDE, note the following`:
       Here, the original knox sdk and supportlib jar files need to be changed as follows, otherwise runtime errors will occur
       <script src="https://gist.github.com/waitzShigoto/fefe8c4005184dbaecf0d20645709ba8.js"></script>

     - After the above steps, when activating the license key, admin permissions need to be enabled, otherwise `internal error` will be returned

       <script src="https://gist.github.com/waitzShigoto/a3880c775ce2a8617ffc8dde47bfb865.js"></script>

     - There is a pitfall here: when activating the license, a Broadcast receiver needs to be used to receive the return result
         - However, the current official documentation shows that the broadcast action for activating the Knox license is
           <script src="https://gist.github.com/waitzShigoto/878e1a32ea9ab7b614afd68969ed5b30.js"></script>
          But in the old Knox API level 19 (Knox 2.6), Knox does not send the above Action, instead it sends the following
           <script src="https://gist.github.com/waitzShigoto/9cdd580d99d2d89d2e2f57430b1c9a4d.js"></script>
         - It is noted here that the official documentation states [namespace changes when upgrading from 2.x to 3.x](https://docs.samsungknox.com/dev/knox-sdk/new-intent-names.htm) (starting from Knox API 30)

- So here is a method provided: [Reference](https://docs.samsungknox.com/dev/knox-sdk/support-older-devices.htm)
  - Just add `supportlib.jar` and include the relevant receivers from the link above into `Manifest.xml`

* Android 12 Samsung A52s, tested `Knox 3.8`

  - Using both `knox3.7.1 higher` and `knox2.7 lower` methods can activate the license key

* Other behaviors
  - Currently, the developer backend allows downloading Knox SDK 3.3 ~ 3.8,

    The above test cases all use Knox 3.8 and can compile,

    but some behaviors may only support their corresponding versions.

    Later, Knox 3.3 was tested on Android 12,

    and using `knox3.7.1 higher` to activate it will crash,

    Similarly, using `knox3.7.1 higher` to activate on Android 6.0.1 Knox 3.8 will also crash.

## Development Issues and Research

* Vpn Development
  - According to the development documents, two Vpn solutions are provided:
    1. Similar to the previously researched native [Android Vpn Service](https://growi.airdroid.com/RD/Android%20Vpn%20%E7%9B%B8%E9%97%9C%E6%96%B9%E6%A1%88)
       Knox extends related functions on this basis: [Reference](https://docs.samsungknox.com/dev/knox-sdk/vpn-integrate-apps.htm)

    2. The other is [GenericVpnPolicy API](https://docs.samsungknox.com/devref/knox-sdk/reference/com/samsung/android/knox/net/vpn/GenericVpnPolicy.html)

       `createVpnProfile`, which mentions providing the corresponding JSON format to set its vpn profile.

       Different JSON formats correspond to different modes.

       Refer to: [vpn JSON format](https://docs.samsungknox.com/dev/knox-sdk/VPN-json.htm)
       -> Currently, the Knox documents have similar requirements as before:

       ipsec Hybrid RSA, PSK, xauth RSA, IKE2 PSK, IKE2 RSA... etc.

       Additionally, the document states `Knox api level 35 Deprecated` -> Corresponding to `Android 12`

* LockScreen Password
  - Biometric unlock, set up fingerprint unlock or face unlock: [Click here](https://docs.samsungknox.com/dev/knox-sdk/biometrics.htm)

## Sharing Practical Development Ideas for Activating License and Knox Permission
  Actually, to activate Knox, you just need to follow the method in the official documents.

  Here I provide my planned thought process for everyone, as follows:
- Currently, it is packaged as a dagger2 module.
  - The structure is as shown in the picture:

  ![knox_module.png](/images/others/knox_module.png)
      - `ExampleKnoxActivity` is used for demo purposes and will contain some examples of other class implementations.
      - Later, you only need to inject `KnoxManager` and initialize `KnoxModule` to use it.

      ![knox_inject_01.png](/images/others/knox_inject_01.png)

      ![knox_inject_02.png](/images/others/knox_inject_02.png)

      - `KnoxLicense` stores some constants and key values that can be changed. In the future, if you don't want to upload the key, it can be adjusted.
      - To use it, you only need to understand `KnoxManager`.
      - Mainly added functions for registering/unbinding Knox broadcasts, activating/deactivating licenses, etc.
        Subsequent related functions will mainly be added from `KnoxManager`.
      - Among them, `KnoxLicenseReceiver` is because the official Knox 3.7 and below only provide a Broadcast method to receive activation success or failure.

      Here, it is well packaged using Kotlin features.

      The actual method in knoxManager is used to register and return the result.

      ![knox_inject_03.png](/images/others/knox_inject_03.png)

`Theoretically, you can also use Koin for DI, and personally, I prefer Koin. I'll write an article about DI with Koin when I have time.`

* Add Knox permission
  - Add permission declaration to the manifest
  ![knox_permission.png](/images/others/knox_permission.png)
  - Knox API 30 is the watershed between old and new package names.

  In this test, Knox API 19 could not use the new permission request such as:

  `com.samsung.android.knox.permission.KNOX_APP_MGMT` 

  Using `com.example.supportlibclient.SUPPORT_PERMISSION` was successful.

  - Runtime permission
    ![knox_run_time_permission_01.png](/images/others/knox_run_time_permission.png)

* Other related

  Some API manipulations require parsing the corresponding URI. Here is a shared example.

  ![knox_constant.png](/images/others/knox_constant.png)
