---
layout: post
title: 打造更安全的Android應用程式！ 學習導入Samsung Knox SDK的簡單方法
date: '2022-09-16 14:41:08 +0800'
image: cover/samsung-android-knox-1.png
tags:
  - Android
  - Debug
  - Samsung
  - knox
categories: AndroidDev
---

## Samsung Knox SDK 是一個安全解決方案

<div class="c-border-content-title-4">
  提供多種安全性控制和管理選項，讓企業輕鬆地保護其敏感數據和應用程序。
  可以讓開發者在應用程式中實現以下功能：
</div>
<p class = "table_container">
  <b>安全容器</b>：可用於分隔和保護企業數據和應用程式，以防止非授權的訪問。

  <b>VPN</b>：可用於建立安全的VPN連接，以保護網絡流量和數據。

  <b>加密</b>：可用於將數據加密，以保護其在傳輸過程中的安全性。

  <b>策略管理</b>：可用於管理設備設置和策略，例如密碼規則、設備鎖定、數據清除等。

  <b>身份驗證</b>：可用於實現強大的身份驗證功能，包括生物識別驗證和智能卡驗證。

  <b>安全更新</b>：可用於安全地更新應用程式和操作系統，以提高整體安全性。

  這篇文章主要會解說

  Samsung knox sdk 導入時的一些基本觀念

  以及<b>遇到的坑</b>跟你們分享

</p>

## 前導

* 目前支持與對應的samsung 手機與版本:[參考](https://www.samsungknox.com/en/knox-platform/supported-devices)
  - 不支援knox的時候，官方提供的建議與方法：[參考](https://docs.samsungknox.com/admin/fundamentals/faqs/kba-349-about-android-others-android-go-devices.htm)
  - 各knox服務[參考](https://docs.samsungknox.com/admin/knox-admin-portal/welcome.htm)
* 下載、安裝Knox SDK
  - 根據官網[Install the SDK](https://docs.samsungknox.com/dev/knox-sdk/install-sdk.htm) 將相關SDK導入專案
  - 導入時會遇到要用哪一版可參考[mapping表](https://docs.samsungknox.com/dev/common/knox-version-mapping.htm)
  - 需取得[license key](https://docs.samsungknox.com/dev/common/tutorial-get-a-license.htm)
     - 若開發的是 Knox 2.7前的版本，生成的license key 可以「選擇」向後兼容的key
     - license key 分為 `Development Key`、與 `Commercial Key` 可根據`測試`或`發布` 配置
     - 關聯apk：只有關聯的apk才能使用生成的license key
     `(在後台有個optional的選項，可以打勾關聯或不選)`
     - 實測後，`Development Key` 同一帳號下只能有一把
     -> [license key規則與限制](https://docs.samsungknox.com/dev/common/knox-licenses.htm)
  - 開發時激活license key 不同Knox版本有不同方式 : [參考這](https://docs.samsungknox.com/dev/knox-sdk/tutorial-activate-license.htm)
  - Knox開發相關範例官方有提供：[參考](https://docs.samsungknox.com/dev/knox-sdk/tutorial-overview.htm)

  * Knox license
    - [license可用權限列表](https://docs.samsungknox.com/dev/common/license-permissions.htm)
    - [license三種比較好讀版](https://docs.google.com/spreadsheets/d/1Os01grTu-vDTVm5SL8VVn1QZ4NH_3gbHDT9ILAGhiEM/edit?usp=sharing)
    - 後台實測後看到SDK license key 更細分為：
        - `KPE Development` : 測試環境用, key 存活時間`0.5年`
        - `KPE Standard`: 允許存取 Standard permissions, 10,000,000 seats, key 存活時間`2年`
        - `KPE Premium`:  允許存取 Standard, Premium, and Custom permissions, 10,000,000 seats ,key 存活時間`2年`
        - `KPE DualDAR`:  允許存取 Standard, Premium, Custom and DualDAR permissions, 與代理商洽談按年數或永久訂閱
    - 開發權限聲明：
        - `Knox 3.0` 提供宣告部分權限，可在AndroidManifest.xml宣告Knox權限，如果未宣告，則預設全部Knox權限開啟，如果宣告，則只允許使用宣告的權限，[參考](https://docs.samsungknox.com/dev/common/tutorial-knox-permissions.htm)

  * 目前與原生專案使用的 DevicePolicyManager初步對比 (僅先比對相似API，`可討論想用哪些，再測試實際行為`)
    - 所有權限可[看這](https://docs.google.com/spreadsheets/d/1Os01grTu-vDTVm5SL8VVn1QZ4NH_3gbHDT9ILAGhiEM/edit?usp=sharing)
    - 實際比對`常用DevicePolicyManager`與 Knox提供的功能參考
    <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ09cQTkBr3L2di8b886ZcjEA9FMlv0trg90SgQFMg4okJx3YERuAXBNDtdSzmVRdxmSXxWMdchBaXL/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false" height="700"
       width="80%"></iframe>

  * 連結參考
    - [Samsung Knox開發者官網](https://developer.samsungknox.com/#)
    - [開發者文件官網](https://docs.samsungknox.com/dev/index.htm)
    - [Knox SDK介紹](https://docs.samsungknox.com/dev/knox-sdk/index.htm)
    - [Knox API文件](https://docs.samsungknox.com/devref/knox-sdk/reference/packages.html)

## Knox架構開發者文件

  - Samsung Knox提供 web-base 與 device-base兩種方式來做使用，其目前的架構：  
   <img src="https://docs.samsungknox.com/dev/common/images/knox-ecosystem.png" width="60%"/>

## Activite license note
   * android 6.0.1 samsung s6 ,測試`Knox 3.8`
     - 下載samsung開發者後台的Knox 3.8版 ，使用方法[knox3.7.1 higher](https://docs.samsungknox.com/dev/knox-sdk/tutorial-activate-license.htm)，解析URI時，報exception
     - 改用[knox2.7 lower](https://docs.samsungknox.com/dev/knox-sdk/tutorial-activate-license.htm)報出`java.lang.RuntimeException: Stub!`

       -> 解決方法：加入`supportlib.jar`並加入gradle dependencies

       `用IDE的Add as library功能的需注意以下`：
       這裡需將原本knox sdk與supportlib 兩個jar檔案改成以下，runtime才不會再報錯
       <script src="https://gist.github.com/waitzShigoto/fefe8c4005184dbaecf0d20645709ba8.js"></script>

     - 上述成功後激活license key時，需啟動admin權限，不然會回傳`internal error`

       <script src="https://gist.github.com/waitzShigoto/a3880c775ce2a8617ffc8dde47bfb865.js"></script>

     - 這裡有個坑 啟動license時需使用Boardcast接收返回結果
         - 但目前官方文件顯示 knox 啟用license 的廣播action 是使用
           <script src="https://gist.github.com/waitzShigoto/878e1a32ea9ab7b614afd68969ed5b30.js"></script>
          但是舊版 Knox API level 19 (Knox 2.6) 上實測Knox不會發上面Action，而是如下
           <script src="https://gist.github.com/waitzShigoto/9cdd580d99d2d89d2e2f57430b1c9a4d.js"></script>
         - 這邊看到官方說 [2.x升級3.x時nameSpace有改](https://docs.samsungknox.com/dev/knox-sdk/new-intent-names.htm) (Knox api 30這版開始改了)

         - 所以他這邊提供一個方法：[參考](https://docs.samsungknox.com/dev/knox-sdk/support-older-devices.htm)
            - 就是加入`supportlib.jar` 並把上方連結內的相關receiver加入`Manifest.xml`

* android 12 samsung A52s ,測試`Knox 3.8`

  - 使用`knox3.7.1 higher` 與 `knox2.7 lower` 方法皆可以啟用license key

* 其他行為
  - 開發者後台目前能下載的有 Knox SDK 3.3 ~ 3.8 ，

    上述test case都使用Knox3.8 能過編譯，

    但可能部分行為僅支持其對應的版本，

    後來有在Android 12上測試 Knox 3.3，

    這時用`knox3.7.1 higher`active就會崩潰，

    在Android 6.0.1 Knox 3.8 使用`knox3.7.1 higher`active同樣會崩潰

## 開發遇到的事及研究

 * Vpn 開發
   - 根據開發文件 有提供兩種Vpn方案
       1. 跟之前研究的原生 Android Vpn Service 方案類似
       Knox在此基礎上擴展相關功能：[參考](https://docs.samsungknox.com/dev/knox-sdk/vpn-integrate-apps.htm)

       2. 另一個則是[GenericVpnPolicy API](https://docs.samsungknox.com/devref/knox-sdk/reference/com/samsung/android/knox/net/vpn/GenericVpnPolicy.html)

       `createVpnProfile`，其提到提供對應的JSON格式來設定其vpn profile

       不同json format對應不同模式

       可參考：[vpn JSON格式](https://docs.samsungknox.com/dev/knox-sdk/VPN-json.htm)
       -> 目前Knox文件與之前需求類似的有 : 

       ipsec Hybrid RSA 、PSK、xauth RSA、IKE2 PSK、IKE2 RSA...等等

       另外文件中寫到`Knox api level 35 Deprecated` -> 對應至`Android 12`

 * LockScreen Password
   - 生物解鎖，設置指紋解鎖或臉部解鎖：[點此](https://docs.samsungknox.com/dev/knox-sdk/biometrics.htm)

## 分享實際開發啟動license與knox permission的思路
  其實如何啟動Knox只需要看官方文件上的方式去想就可

  這邊我提供我規劃的思維給大家，如下：
 - 目前將它包成dagger2 module
  - 結構如圖 ：

  ![knox_module.png](/images/others/knox_module.png)
      - `ExampleKnoxActivity` 用來demo 裡面會放一些其他類實作的呼叫範例
      - 之後只需要inject `KnoxManager`跟init`KnoxModule`就能使用

      ![knox_inject_01.png](/images/others/knox_inject_01.png)

      ![knox_inject_02.png](/images/others/knox_inject_02.png)

      - `KnoxLicense`內存放一些常數與key值可再自行變更，未來如要不上傳key也可再調整
      - 實際使用只需了解`KnoxManager`
      - 主要新增了註冊/解綁knox廣播、起/停用license等功能
        後續主要會從`KnoxManager`新增相關func
      - 其中 `KnoxLicenseReceiver` 因為官方Knox3.7含以下的只有提供Boardcast的方式來接收激活成功與否

      這邊利用Kotlin特性包好

      實際使用knoxManager內的方法註冊並返回結果

      ![knox_inject_03.png](/images/others/knox_inject_03.png)

  `理論上用Koin當DI也可，而且個人也比較喜歡Koin，之後有空再寫一篇koin寫的DI`

* 加入knox permission
  - 加入權限宣告至manifest
  ![knox_permission.png](/images/others/knox_permission.png)
  - Knox API 30是新舊包名的分水嶺，

  這次實測Knox API 19 無法使用新的permission request 如：

  `com.samsung.android.knox.permission.KNOX_APP_MGMT` 

  使用`com.example.supportlibclient.SUPPORT_PERMISSION`才成功

  - runtime permission
    ![knox_run_time_permission_01.png](/images/others/knox_run_time_permission.png)

* 其他相關

  部分API操控需解析對應URI 這邊拉出共用的

  ![knox_constant.png](/images/others/knox_constant.png)
