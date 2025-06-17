---
layout: post
title: '[Android教學]Android Device Owner権限をマスターし、企業レベルの管理を簡単に！'
date: '2022-04-25 18:19:28 +0800'
image: cover/android-device-owner-1.png
tags:
  - Android
  - Debug
categories: AndroidDev
excerpt: >-
  企業レベルのAndroidデバイスを簡単に管理したいですか？この記事では、Android Device
  Owner権限のリクエストと実際の使用方法について詳しく説明します。
---

## 前言：Device owner権限を探る

## なぜDevice Ownerになるのか
通常の権限では満たせないニーズに遭遇したことはありますか？

例えば、

特定の画面を強制設定したり、

ユーザーが特定のアプリをアンインストールできないようにしたい場合、Device Owner権限が必要です。

要するに、

Device Owner権限は、通常の権限では対応できないニーズを満たすことができ、

使用するかどうかは具体的なアプリケーションのシナリオによります。

この権限を使用すると、Android公式が提供するDevicePolicyManagerのAPIを利用できます。

利用可能なAPIについては、Android公式のDevicePolicyManagerドキュメントを参照してください。

<a href="https://developer.android.com/reference/android/app/admin/DevicePolicyManager" target="_blank">DevicePolicyManagerドキュメント</a>

## Device Ownerになる方法

<div class="c-border-content-title-4">AndroidアプリをDevice Ownerにする方法はいくつかあります。以下はそのうちの二つです：</div>

<p style="margin-top: 15px;" class="table_container">
	1. Factory Reset後、ウェルカム画面で「Welcome」を7回タップし、カメラを使ってQRコードをスキャンします。

	2. Factory Reset後、8回タップし、GMSでQRコードをスキャンします（GMSが必要）。
</p>

注意：メーカーによって方法が異なる場合があります。

しかし、ほとんどの場合、これらの方法が使えます。特別なOTAを使用している場合のみ、使用できない可能性があります。

次に、これらの手順を実行するためのQRコードを作成します。

<p style="margin-top: 15px;" class="table_container">
1. 以下のコマンドを使用し、apk_download_linkにAPKのダウンロードURLを入力します。

<b>curl -s [apk_download_link] | openssl dgst -binary -sha256 | openssl base64 | tr '+/' '-_' | tr -d '='</b>

2. 以下のJson形式を使用し、値を入力します。

   <b>android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME</b>：パッケージ名/AdminReceiverのパスを入力 

   <b>android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM</b>：手順1で生成されたハッシュコードを入力

   <b>android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION</b>：ダウンロードURLを入力

</p>
<script src="https://gist.github.com/waitzShigoto/8a9376c9f99b70090c2c45a58defdf09.js"></script>

<p style="margin-top: 15px;" class="table_container">
	3. 手順2のjson形式を使ってQrCodeを生成します。

	その後、Factory Reset後に前述の2つの方法でQRコードカメラを開き、

	ユーザーに生成したQrCodeをスキャンさせます。

	システムが設定されると、

	そのアプリは自動的にインストールされ、Device Ownerになります。

	この方法は通常、開発者以外の人が使用するためのものです。

	例えば、各端末の開発者が先にapkをアップロードし、

	その後apkのダウンロードURLを取得したら、

	上記の手順でハッシュコードを生成し、json形式のデータを作成してQrCodeを生成します。

	これにより、開発者以外の人でもUI操作を通じてDevice Ownerアプリを生成できます。

</p>

<div class="c-border-content-title-4">別の方法：adbコマンドを使用して指定アプリをdevice ownerにする</div>
  ここでは、指定アプリのAdmin Receiverのパスを以下のコマンドに入力するだけで、

  そのアプリをdevice ownerにすることができます。

  `adb shell dpm set-device-owner com.your.package/com.your.package.receivers.AdminReceiver`
   - ただし、このコマンドにはいくつかの制限があります。

   1. 現在のOSにはGMSアカウントが一切存在しないこと。

   通常、Googleサービスを使用するためにはGoogleアカウントにログインする必要がありますが、設定でこれを削除できます。

   2. システム内にはユーザー設定のDevice ownerが1つしか存在できません。既に存在する場合は削除してから必要なアプリを再設定します。

   `adb shell dumpsys device_policy`

   このコマンドで現在のOSに存在するdevice ownerの状況を確認できます。

## Device Ownerの削除方法
<div class="c-border-content-title-4">コマンドを使用して削除</div>

`adb shell dpm remove-active-admin com.your.package/.receivers.AdminReceiver`
 - このコマンドを使用するには： 

 `AndroidManifest.xmlの<application>`内に 

 `android:testOnly="true"`を追加する必要があります。

 これによりDevice Ownerを削除できます。
 - Device owner権限を持つアプリは通常、削除やadb installでのインストールができません。

 `-r -f`オプションを追加して強制的に上書きするか、強制的に削除してから再インストールします。

 `adb install -r -f ../xxx.apk`

 * 公式APIを使用して削除 

 Device ownerアプリ内で 

 `DevicePolicyManager`の`clearDeviceOwnerApp`を使用して権限を削除します。

 * 直接Factory Resetを行う 

 上記の他の方法がすべて使用できない場合、最終手段としてFactory Resetを行います。XD

 ## Device Admin Receiverの作成

* これはAdmin権限と補完関係にあります。

Device Ownerにするアプリ内に

Admin Receiverを作成する必要があります。

これにより、Adbを使用して権限を取得する際に

後続のReceiverが起動できるようになります。

つまり、

`adb shell dpm remove-active-admin com.your.package/.receivers.AdminReceiver`

* Admin権限とは： 

アプリ内にAdmin権限が必要なReceiverを追加することです。

これにより、ユーザーは設定内で`装置管理者`権限を見つけて有効にすることができます。

ただし、これはDevice Ownerとは実際には`異なる`権限です。

`ここで混同しないようにしてください`

* 追加方法は公式サイトを参照：[ドキュメント](https://developer.android.com/guide/topics/admin/device-admin)

ドキュメントには実際の使用例も記載されていますので、参考にしてください。

手順は非常に簡単で、

`DeviceAdminReceiver`のサブクラスを生成し、

それをManifest.xmlに追加するだけです。

* 手順を簡単に説明します。
1. `DeviceAdminReceiver`を継承する

```Kotlin
class AdminReceiver : DeviceAdminReceiver() {
    override fun onEnabled(context: Context, intent: Intent) { 
    }

    override fun onDisabled(context: Context, intent: Intent) {
    } 
}
```

2.
`res/xml`のパスにdevice_admin.xmlの権限宣言を実装します

```xml
<device-admin xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-policies>    
        <limit-password />
        <watch-login />
        <reset-password />
    </uses-policies>
</device-admin>
```

3. 前の2つの項目をマニフェストに追加します

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

4. コードを通じてリクエストを行います

```kotlin
fun startAskActiveAdmin() {
    if (!isAdminActive) {
        val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
        intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, deviceAdmin)
        this.activity.startActivityForResult(intent, KnoxManager.DEVICE_ADMIN_ADD_RESULT_ENABLE)
    }
}
```

5. 戻り結果を処理します

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

## Device Owner 実装共有

ここでは以前に行った例をいくつか共有します

ただし、主に概念と実装の一部のコードについて簡単に説明します

個人的にはそれほど難しくないと思います

なので詳細には説明しません

* まず、DevicePolicyManagerとAdminReceiverのインスタンスを取得する必要があります

	<script src="https://gist.github.com/waitzShigoto/c12af22551a91a32a6f85cd3da7e3313.js"></script>

* 取得した後は、必要に応じて呼び出すことができます。実装方法はほぼ同じなので、ここではいくつかの例を挙げるだけにします

	- `アプリを隠す`
	 <script src="https://gist.github.com/waitzShigoto/520157aaceb75c79cda052e10f576a26.js"></script>
	- `ユーザー制限`を追加する
	 <script src="https://gist.github.com/waitzShigoto/15286f247a2120b4320b4cf5f678560e.js"></script>

* その他の例については、Googleの[github](https://github.com/googlesamples/android-testdpc)にあるDevice Ownerを使用したサンプルアプリを参照してください

---
補足：

Device Owner以外にも

以下のコマンドを使用してadbを通じて指定されたアプリの設定を変更することができます

`adb shell pm grant com.your.package android.permission.CHANGE_CONFIGURATION`

または直接`AndroidManifest.xml`に追加することもできます
ただし、システム上のprotectLevelが`signature|privileged`として宣言されているため
（現在のドキュメントでは`signature|privileged`が`signatureOrSystem`に変更されており、効果は以前と同じです）
この権限を使用してアプリの設定を変更するには、システム署名を取得するか、device owner権限を持つ必要があります

公式の<a href="https://developer.android.com/guide/topics/manifest/permission-element?hl=zh-cn
" target="_blank">権限ドキュメント</a>を参照して、`signature|privileged`について理解してください
