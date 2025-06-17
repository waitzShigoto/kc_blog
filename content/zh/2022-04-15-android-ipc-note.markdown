---
layout: post
title: 連接 Android app 應用：讓你的程式在不同進程中輕鬆溝通的IPC方案教學！
date: '2022-04-15 15:36:28 +0800'
image: cover/android-ipc-method-share-1.png
tags:
  - Android
  - Debug
categories: AndroidDev
excerpt: 探索Android app應用程式之間的跨進程通訊技術（IPC），讓你的應用程式在不同進程之間輕鬆溝通，達到更好的協作效果。
---

## 前言

* 今天我要分享的是「跨應用程式溝通」的相關方案。

  在我之前的工作經驗中，曾經有客戶問過我這方面的問題，

  所以我整理了相關資訊，並在這裡分享給大家。

  這份分享涵蓋了多種IPC相關的方案，

  讓有這方面需求的朋友可以一次獲取多種方案，

  以便更快地實現應用程式之間的溝通和協作。

## 比較常見的Android app層 IPC方案
  * `IPC科普：Inter-Process Communication`，譯為進程間通信或者跨進程通信
    - `ContentProvider` : 原生的組件，提供對外接口 (實作該lib的增、刪、改、查)，讓不同APP間能跨process存取共同資料。
      - 使用場景 : 較適合不同App需要共同資料，如存取SQL數據庫、共同文件...等，另外聯絡人、電話簿也是採用此法，讓其他應用取得
      - 若要知道資料更新狀態需額外註冊Observer

    - `AIDL`：一種對外接口的語言，定義.aidl檔案，並實作其接口後，透過binder實現跨進程的存取，可以自定義input、output型別，可多線程處理多個請求

       - [官方 - AIDL 實作參考](https://developer.android.com/guide/components/aidl)
     ```
     Binder : Linux Kernal 下的一種 driver
     ```
     

    - `Messenger`：官方提供的一種方案，相較AIDL較輕量的方案，使用Handler、Ｍessage實作，同樣透過binder來運作，不過一次僅能處理一個請求

        - [官方- Messenger實作參考](https://developer.android.com/guide/components/bound-services#Messenger)

        

    - AIDL vs Messenger
       <table class="rwd-table">
         <thead>
           <tr>
             <th class="tg-vrid"></th>
             <th class="tg-vrid">特性</th>
             <th class="tg-vrid">開發上的差異</th>
             <th class="tg-vrid">使用時機</th>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td class="tg-3b1y">AIDL</td>
             <td class="tg-3b1y">1.實時通信
2.同時接收多個請求並同時處理</td>
             <td class="tg-3b1y">1.  <span style="color:#DD496E;background-color:#181B1C">.aidl</span> 能定義接口的input、output
開發上更直覺，呼叫時只需直接呼叫接口
             
2.支援多個數據型別(Int、String...等)</td>
             <td class="tg-3b1y">接口量多時
需時常處理請求</td>
           </tr>
           <tr>
             <td class="tg-3rup">Messenger</td>
             <td class="tg-3rup">1.實時通信
2.同時接收多個請求但是需排隊處理</td>
             <td class="tg-3rup">1. 需在服務端與客戶端各自建立Messenger
來處理Message收與發<span style="font-weight:400;font-style:normal"></span>
2.通過Message類傳遞資料</td>
             <td class="tg-3rup">接口量不多
只需偶爾處理請求時</td>
           </tr>
         </tbody>
       </table>

       

    - `Socket` : 雙方約定好IP，在本地端進行連線，形成一個C/S架構，以處理請求，部署範圍較大(區網內)

      <table class="rwd-table">
      <thead>
        <tr>
          <th class="tg-vrid"></th>
          <th class="tg-vrid">性能</th>
          <th class="tg-vrid">安全性</th>
          <th class="tg-vrid">開發上的差異</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tg-3b1y">Binder</td>
          <td class="tg-3b1y">傳遞請求僅拷貝一次</td>
          <td class="tg-3b1y">傳遞請求限制在Binder層內</td>
          <td class="tg-3b1y">接口量多時
需時常處理請求</td>
        </tr>
        <tr>
          <td class="tg-3rup">Soecket</td>
          <td class="tg-3rup">傳遞請求需拷貝二次
</td>
          <td class="tg-3rup">傳遞請求暴露在整個區網內
</td>
          <td class="tg-3rup">接口量不多
只需偶爾處理請求時</td>
        </tr>
      </tbody>
      </table>

        - [拷貝次數差異詳解點此](https://tw511.com/a/01/9215.html)

      

    - `BroadCast` : 一種在Android系統內 讓App間接收、發送廣播的方式，來達成進程間交換資訊的作法

        - 接收廣播 ： 註冊廣播器後即可接收到廣播，而又分為兩種註冊方式

           1. 靜態註冊 : AndroidMestfest.xml 內註冊後 ,當該app未啟動時，若收到相關廣播，則會開啟該App來接收廣播
           (限Android 8.0下，8開始後，移除靜態註冊)
           2. 動態註冊 : 透過Context註冊, 此種方式只要context還存在，就會收到廣播

        - 發送廣播 ：

           1. `sendOrderedBroadcast`: 依照優先級順序，一次只會有一個接收器收到廣播，並支援中途停止發送廣播
               - 當多個app的接收器優先順序一樣時，會照最先安裝的app發送
           2. `sendBroadcast` : 隨機順序向所有接收器發送，效率更高，只是會一次性發送資料給所有註冊的接收器
           3. `LocalBroadcastManager.sendBroadcast` : 只在同個 app 中發送廣播

        - 特性 ：

           1. 有註冊相同廣播的接收器都能收到廣播，若要阻止全域收到廣播，
           可加上自定義權限，限制指定app才能接收，
           另外Android 4.0以上也有提供`setPackage(String)`，設置指定app接收
           2. 在註冊BroadcastReceiver接收廣播器時，onReceive()方法在主線程上執行，
           因怕耗時操作會影響到主線程，故官方建議操作維持要在10s內

        - 安全考量 ：

           1. 有可能第三方人士取得該自定義權限字串或設置的packageName，加到自己的app中，去收你的廣播資料
           2. 廣播的命名是全域性的，如有人惡意註冊相同名稱，可以進行偽裝發送請求

        - [官方 - 廣播相關](https://developer.android.com/guide/components/broadcasts)

##  Android app層 IPC方案 可能遭遇的安全性問題

* 接口被未授權用戶盜用：
     - `BoardCast` :
       - 發送廣播時，誰都能攔截廣播內容
         - 對策：
            1. Android 4 上使用setPackage(String)指定包名接收
            2. 增加權限字段，讓同樣有宣告該字段的App接收
       - 加上權限或指定包名後，若有人取得該字段或偽裝包名，則可以進行攔截、發送廣播
         - 對策：
            1. 混淆相關代碼，增加破解時間
     - `Socket`：
       - 公開接口，需暴露在整個區網下，知道IP的人都能用
         - 對策：
            1. 驗證用戶身份(自定義Token : 加密sha256、md5、aes、des...等)、權限
            2. 使用Binder相關IPC方案，降低暴露範圍
     - `AIDL`：
       - 擁有.aidl檔的人，可以自行開發新的客戶端連進來
         - 對策：
           1. 驗證正在存取接口的UID (android.os.Process.myUid())
           2. 驗證App permission `signature` ，讓擁有簽名的app才能存取: [權限指南](https://developer.android.com/guide/topics/manifest/permission-element?hl=zh-cn#plevel)
     - `Messenger`：
       - bindService時，使用 `Intent().component = ComponentName("包名", "包名:Service名")`，讓得知包名、service名的人也能連
         - 對策：
              1. 類似上方AIDL解法，驗證UID、驗證簽名
     - `ContentProvider`：
       - contentProvider透過URI來定位資料表位置，當URI洩漏時，則可輕鬆讀取資料
         - URI洩漏後其他衍生：
              1. 透過drozer指令，即可讀取你的contentProvider敏感資訊
              2. SQL注入 : ContentProvider使用資料表儲存共享資料，當自定義SQL語法，沒設計好時，有可能因非參數化設置，導致被SQL注入攻擊
         - 對策：
              1. 驗證權限、簽名
              2. 混淆代碼
              3. 若使用到SQL語法去寫，可以改用官方提供函數，避免人工定義時的錯誤機率。

~~~
  * 以上有用到 Manifest.xml 宣告的元件，如：BroadCast、ContentProvider 可設置：
     當 android:exported="true" 時，如果不做任何處理，可以接受來自其他 App 的訪問
     當 android:exported="false" 時，限制為只接受來自同一個 App 或一個具有相同 `user ID` 的 App 的訪問
    -> 用來限制只能在當前用戶組使用 （Android 4.2後支援多用戶）

  * `user ID`：就是有多少個實際用戶，即手機主帳號、訪客等多用戶
    `uid`：與app process相關，每個用戶的每的應用的uid不同。
    `appid`：包名相同的appid都一樣，即使是不同用戶。
~~~

## IPC方案 支持的數據類型 (根據library內目前看到支援的類型)
  * `BoardCast` : 透過Intent傳遞資料，其可帶bundle，而bundle支援：byte、char、short、float、string、parcelable、serializable等等
  * `Socket` ： 透過 BufferedWriter寫出資料、BufferedReader接收資料，根據source code，目前支援 ：string、int、char[]
  * `AIDL` ： int、long、char、boolean、string、charSequence、list、map、parcelable
  * `Messenger` ：透過Message傳遞資料，其可帶bundle，支援類型類似上方BoardCast
  * `ContentProvider` ：透過ContentValues把資料存進對應URI的資料表，再由其他需用此資料拿URI取得，ContentValues支援的類型：String、Byte、Short、Integer、Long、Float、Double、Boolean、byte[]..等
