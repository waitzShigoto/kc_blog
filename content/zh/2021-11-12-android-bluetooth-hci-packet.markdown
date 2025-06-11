---
layout: post
title: "[Android][Kotlin]如何抓取Android手機中 Bluetooth 藍芽封包日誌"
date: 2021-11-12 16:16:32 +0800
image: cover/ea-android_bluetooth_hci_packet.png
tags: [Android,Bluetooth]
categories: Android教學
---

今天這篇文章要來紀錄下之前研究過 

透過logcat或寫code抓取外的方式

來抓取藍芽傳輸間的封包

這些方法其實網路上都有很多人介紹過

但因為看到很多幾乎都是複製貼上或比較舊的資料

所以自己有研究實際上怎麼做到的

會在今天這篇解說

如果你是想要看看怎麼串接gatt server的可以看看這裡

<a href="{{site.baseurl}}/2021/11/12/android-kotlin-bluetooth-gatt-client/">
<img src="/images/cover/android-kotlin-bluetooth-gatt-client.png" alt="Cover" width="25%" >
[Android][Kotlin][2021]Android低功耗藍芽Gatt連線實作教學！</a>

正文開始：

# 方法1
### Step 1 - 打開開發者模式
首先需要開啟開發者模式

<img src="/images/bluetooth/open_developer.png" alt="Cover" width="30%" >

通常是在軟體資訊內點數次版本號 進入開發者模式

但是每一家公司出品的手機不一定會一樣

有一些廠家進入的方式是在電話撥打欄位輸入特定指令

或有其他隱藏鍵按法

所以如果不行可以上網查查你手上的手機如何進開發者模式

成功後就會看到設定裡面多了開發者選項

<img src="/images/bluetooth/developer.png" alt="Cover" width="30%" >

### Step 2 - 打開藍芽HCI記錄檔
之後進入開發者選項

打開藍芽HCI記錄檔 選項

<img src="/images/bluetooth/open_hci.png" alt="Cover" width="30%" >

那打開這個選項後

就會讓系統幫你記錄 藍芽的 HCI snoop log 

我爬文到這邊遇到個問題

比較舊版Android的手機會把HCI log 存在 /sdcard 或/stroage

後來的版本有可能存進不同的路徑

而且是存進沒有權限可以read的目錄裡

導致就算我有這個檔案也沒辦法看

除非你有辦法得到這台手機的root權限或adb shell su權限

不然通常很難用簡單方法來閱讀

所以如果你的手機跟我一樣沒有存在有權限read的目錄

可能可以參考下面步驟去dump出來

### Step 3 - 安裝CLI工具 ADB

ADB是Android開發時常用到的Debug工具

如果你有安裝Android Studio 的話

他會內建在安裝目錄下的platform tool內

如果你想要全域使用的話

可以在環境變數中設定

沒有開發Android習慣

純粹想測試藍芽log的可以透過下列網址下載

<a href="https://developer.android.com/studio/releases/platform-tools" class="btn btn-primary" role="button">查看Android Platform Tool</a>

### Step 4 - 連接手機並確認USB調用模式
確認有開啟開發者模式中的USB調用模式

並確認有連接上pc端

可以用下面指令確認

```
adb devices
```

如果有看到

類似下方訊息

```
List of devices attached
LXXXXXGYPXXCXXXXXX7	device
```

就是有連到了 

### Step 5 - Dump bluetooth HCI log file

因為遇到檔案存在沒權限讀的地方

所以需要使用指令來dump出來

首先你要執行上方的步驟

包含開啟藍芽HCI擷取

並且啟動藍芽相關操作

讓系統產生log

這邊是一小段shell script

<script src="https://gist.github.com/waitzShigoto/8d55a3492f8cafbfd86196ce8f6d610d.js"></script>

可以直接複製去跑shell

亦可以一行一行複製到terminal去執行
其中主要是使用了

```
adb bugreport <FileName>
```
因為原本不能read存有log的目錄
所以使用
指令bugreport

可以幫你dump出

當前Android手機內的系統log

並壓縮成zip檔案到當前目錄
所以我的script我就先pushd到/tmp目錄

不過這邊都是看個人使用習慣

可以自行修改

之後只要解壓縮
```
unzip fetchBugReport.zip
```
你bugreport出來的資料

就會看到你手機內的log data了

之後你就可以cat相關log檔案 

或是拿特定軟體去讀一些難閱讀的檔案

那這邊通常解壓縮出來是串資料夾結構
如
FS/data/log/.../btsnoop_hci.log

我們要找的檔案是藍芽的log檔 

但我試過不同手機

可能出來的目錄結構可能不同

如果想要把shell script 純粹寫成一鍵執行

可能要注意這裡把他拉成變數

就能輕鬆抓取log

如：
<script src="https://gist.github.com/waitzShigoto/d862a1007ddb5bbef96b28a8a5c3e723.js"></script>
這邊就依照個人需求可改寫

最後分享個

在研究過程中

發現不是每台手機都會產生藍芽的log

所以這些不確定性

讓原本想要輕鬆抓封包的想法

變得比較沒那麼靠譜

不過就當知道這個方法

之後如果用到也不虧

# 方法2 - nRF Sniffer + Wireshark 抓取藍芽封包

### Step 1 - 安裝python 與 pyserial
輸入

```
python --version
```
如果有顯示版本

表示全域環境內已有

<img src="/images/bluetooth/python_version.png" alt="Cover" width="100%" >

沒有的話可以透過

法1:
<a href = "https://www.python.org/downloads/">python官網</a>
安裝

法2:透過brew安裝

<img src="/images/bluetooth/python_install.png" alt="Cover" width="30%" >

在terminal內輸入以下指令

安裝pyserial

```
pip install pyserial
```
如出現 Successfully 字樣則表示安裝成功

### Step 2 - 安裝 WireShark   

前往
<a href = "https://www.wireshark.org/download.html">WireShark 官網</a>
下載安裝檔

<img src="/images/bluetooth/wireshark_web.png" alt="Cover" width="50%" >

選擇屬於你os的版本

並且像是平常一樣安裝你的套裝軟體

<img src="/images/bluetooth/wireshark_dmg_phtot.png" alt="Cover" width="30%" >

### Step 3 - 安裝 nRF-Sniffer-for-Bluetooth-LE 插件  

透過連結下載
<a href = "https://www.nordicsemi.com/Products/Development-tools/nRF-Sniffer-for-Bluetooth-LE/Download#infotabs">nRF-Sniffer-for-Bluetooth-LE</a>

選擇想要的版本

版本的Changelog可以在下拉欄看

<img src="/images/bluetooth/nRF_changelog.png" alt="Cover" width="50%" >

我是下載4.1.0

這邊根據自己所需選擇

解壓縮下載的zip後找到extcap資料夾

<img src="/images/bluetooth/excap.png" alt="Cover" width="50%" >

並打開WireShark 的About WireShark

mac版的是在應用程式名稱內

<img src="/images/bluetooth/wireshark_about.png" alt="Cover" width="30%" >

找到 Golbal Extcap Path 

<img src="/images/bluetooth/wireshark_folder.png" alt="Cover" width="60%" >

extcap是 wireshark放 插件的資料夾

把上面下載好的nRF-Sniffer-for-Bluetooth-LE extcap資料夾

內的檔案全部複製到這個資料夾裡

### Step 4 - 使用 官方提供的硬體開始抓封包   

官網提到 需要以下硬體才能進行抓包

<img src="/images/bluetooth/nRF_dongle.png" alt="Cover" width="60%" >

上網購買

或本身就有 插入電腦後直開wireshark

找到連接的 來源選

nRF Sniffer for Bluetooth LE COMXX

就能開始抓了

結論

這個方法 抓藍芽封包 存在個小成本-需要額外設備

所以如果手邊剛好有設備

可用這個方法試試看

