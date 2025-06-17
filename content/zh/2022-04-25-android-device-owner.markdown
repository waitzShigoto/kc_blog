---
layout: post
title: '[Android教學]掌握 Android Device Owner 權限，企業級管理輕鬆上手！'
date: '2022-04-25 18:19:28 +0800'
image: cover/android-device-owner-1.png
tags:
  - Android
  - Debug
categories: AndroidDev
excerpt: 想要輕鬆管理企業級 Android 裝置？這份文章提供了完整的 Android Device Owner 權限請求與實際作用統整。
---

## 前言：探索Device owner權限

<p style="margin-top: 15px;" class="table_container">
	在本系列文章中，我將分享我在Android開發中所遇到的問題，

	以及我如何解決這些問題的筆記。

	本文將探討Android內提供的Device owner權限，包括如何獲取和使用這些權限。
</p>

## 為何要成為Device Owner
你是否曾經遇到一些普通權限無法滿足的需求，該怎麼辦呢？

舉例來說，

如果你需要在設備上強制設置一個特定的畫面，

或者阻止用戶卸載特定應用，這時候就需要Device Owner權限。

總之，

Device Owner權限可以幫助開發者實現一些普通權限無法滿足的需求，

但是否需要使用則取決於具體的應用場景

這個權限可以讓你使用Android官方提供的 DevicePolicyManager內的API

可以參考Android官方提供的DevicePolicyManager文件，了解有哪些API可以使用。

<a href="https://developer.android.com/reference/android/app/admin/DevicePolicyManager" target="_blank">DevicePolicyManager文件</a>

## 如何成為Device Owner

<div class="c-border-content-title-4">有幾種方式可以讓你的Android app成為device owner，其中包括以下兩種方法：</div>

<p style="margin-top: 15px;" class="table_container">
	1.在 Factory Reset 後進入 welcome 頁面，點擊 Welcome 字樣七次，並使用開啟的相機掃描 QR Code。

	2.在 Factory Reset 後點擊八次，並使用 GMS 掃描 QR Code（需要 GMS）。
</p>

請注意，不同廠商可能採用不同的方式。

不過目前實測下來幾乎都可以用，除非是那種特製OTA才有機會不能用

接下來，你需要製作一個QR code 掃描來實現這兩個步驟。

<p style="margin-top: 15px;" class="table_container">
1. 使用下方指令 apk_download_link帶入你apk的下載url

<b>curl -s [apk_download_link] | openssl dgst -binary -sha256 | openssl base64 | tr '+/' '-_' | tr -d '='</b>

2. 利用下方Json格式，填好你的value

<b>android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME</b>：填入你的packageName/AdminReceiver的路徑 

<b>android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM</b>：填入步驟1產生的hash code

<b>android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION</b>：填入你的download url

</p>
<script src="https://gist.github.com/waitzShigoto/8a9376c9f99b70090c2c45a58defdf09.js"></script>

<p style="margin-top: 15px;" class="table_container">
	3. 拿著步驟2的json格式 去產生QrCode

	之後只要在Factory Reset後照著前面兩種方式把QR code相機打開

	讓用戶去掃描你產生的QrCode

	待系統設定好後

	那隻App就會自動安裝加上變成Device Owner

	這種方式通常是讓非開發人員去用的

	例如：各端開發人員先上傳好apk

	之後有apk download url後

	用上方步驟產生hash code 以及製作json格式的資料並製成QrCode

	方便讓非開發人員 透過UI操作就能產生Device Owner app

</p>

<div class="c-border-content-title-4">另一種方式，透過adb 指令讓指定app成為device owner</div>
  這邊只要把你指定app的Admin Receiver的路徑打在下方指令之後

  就能讓該app變成device owner

  `adb shell dpm set-device-owner com.your.package/com.your.package.receivers.AdminReceiver`
   - 不過這個指令有些限制

   1.目前OS內不能有任何gms Account

   就是一般要使用google 服務都會要你登入google帳號，可以到setting裡面把它移除

   2.系統內只能存在一組用戶設定的Device owner，如果有的話可以先刪除，再重設需要的app

   `adb shell dumpsys device_policy`

   這個指令可以去看你目前OS內有的device owner情況

## 如何移除 Device Owner
<div class="c-border-content-title-4">透過指令移除</div>

`adb shell dpm remove-active-admin com.your.package/.receivers.AdminReceiver`
 - 這個指令需透過： 

 在`AndroidManifest.xml的<application>`內 

 加入 android:testOnly="true"

 方能移除 Device Owner
 - 加入device owner 權限的app 

 通常不能被被移除或adb install安裝

 可加入-r -f 來強制覆蓋 : adb install -r -f ../xxx.apk
 或強制移除後再安裝

 * 透過官方API移除 

 在device owner app內 

 使用DevicePolicyManager內的 clearDeviceOwnerApp來移除權限

 * 直接Factory Reset手機

 以上其他方法都無法使用時，只能使出終極殺招XD

 ## Device Admin Receiver建立

* 這個跟Admin權限相輔相成

需在要當成Device Owner的app內

建立一個 Admin Receiver 

這樣你在使用Adb 取得權限時

才有後面那段Receiver可以去啟動

也就是

adb shell dpm remove-active-admin com.your.package/`.receivers.AdminReceiver`

* Admin權限就是： 

在app內加入Admin權限所需的Receiver

所以使用者

也可以在設定內找到`裝置管理員`權限去打開

但是這跟Device Owner實際上是`不同`的權限 

`這邊不要搞混了`

* 加入方法可參考官網：[文件](https://developer.android.com/guide/topics/admin/device-admin)

文件內也有提到一些實際應用例子 可參考

作法很簡單只需要產生

`DeviceAdminReceiver`的子類

再將其加入Manifest.xml內即可

* 快速講一下步驟
1. 繼承一個`DeviceAdminReceiver`

```Kotlin
class AdminReceiver : DeviceAdminReceiver() {
    override fun onEnabled(context: Context, intent: Intent) { 
    }

    override fun onDisabled(context: Context, intent: Intent) {
    } 
}
```

2.
實作權限宣告的device_admin.xml 在路徑`res/xml`下

```xml
<device-admin xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-policies>    
        <limit-password />
        <watch-login />
        <reset-password />
    </uses-policies>
</device-admin>
```

3. 前兩項做的加入到manifest

```xml
<receiver
    android:name=".MyAdminReceiver"
    android:permission="android.permission.BIND_DEVICE_ADMIN">
    <meta-data
        android:name="android.app.device_admin"
        android:resource="@xml/device_admin" />

    <intent-filter>
        <action android:name="android.app.action.DEVICE_ADMIN_ENABLED" />
    </intent-filter>
</receiver>
``` 

4. 透過程式碼去請求

```kotlin
fun startAskActiveAdmin() {
    if (!isAdminActive) {
        val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
        intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, deviceAdmin)
        this.activity.startActivityForResult(intent, KnoxManager.DEVICE_ADMIN_ADD_RESULT_ENABLE)
    }
}
```

5. 處理返回結果

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    if (requestCode == KnoxManager.DEVICE_ADMIN_ADD_RESULT_ENABLE) {
        when (resultCode) {
            RESULT_CANCELED -> {
                logger.debug("RESULT_CANCELED")
            }
            RESULT_OK -> {
                logger.debug("RESULT_OK ")
      
            }
        }
    }
}
```

## Device Owner 實作分享

這邊分享一些之前做過遇到的例子

不過主要是大概講一下觀念跟實作的部分code

個人認為不會太難離解

所以就不會講太細

* 首先就是得拿到DevicePolicyManger與AdminReceiver的實例

	<script src="https://gist.github.com/waitzShigoto/c12af22551a91a32a6f85cd3da7e3313.js"></script>

* 拿到後，就可以依照自己需要的去呼叫，實作方法大同小異，所以這邊只大概舉幾個例子

	- `隱藏App`
	 <script src="https://gist.github.com/waitzShigoto/520157aaceb75c79cda052e10f576a26.js"></script>
	- 加入`User Restriction`
	 <script src="https://gist.github.com/waitzShigoto/15286f247a2120b4320b4cf5f678560e.js"></script>

* 其他更多例子可以參考google [github](https://github.com/googlesamples/android-testdpc) 內有使用Device Owner的 範例app

---
補充：

除了Device Owner外

下面這個指令 也能透過adb 修改指定app配置

`adb shell pm grant com.your.package android.permission.CHANGE_CONFIGURATION`

或直接加入`AndroidManifest.xml`也可以
不過因為他在系統上的protectLevel被宣告為`signature|privileged`
(現在看文件`signature|privileged`已被改為`signatureOrSystem`，效果跟之前一樣)
這時候你要使用這個權限來改app配置就需要取得系統簽名或是有device owner權限之類的

可以看看官方<a href="https://developer.android.com/guide/topics/manifest/permission-element?hl=zh-cn
" target="_blank">權限文件</a>，來了解`signature|privileged`

