---
layout: post
title: '適配Android 15 的 16 KB PAGE SIZE'
date: '2025-09-22 10:12:25 +0800'
image: cover/generated/2025-09-22-adapted-for-android-15-with-16-kb-page-size-cover.svg
tags:
  - Android
  - Kotlin
permalink: /adapted-for-android-15-with-16-kb-page-size
categories: Android
excerpt: >-
  2025/11/1起，上架gp針對的Android 15+裝置的app需支援16kb page size...
---

## 2025/11/1起，上架gp針對的Android 15+裝置的app需支援16kb page size
<img src="/images/android15/014.png" alt="mcp">
<a href="https://android-developers.googleblog.com/2025/05/prepare-play-apps-for-devices-with-16kb-page-size.html">原文</a>

## 如何驗證app是否符合16kb page size的要求
<div style="font-size: 1.5rem; font-weight: bold;">方法1: gpc檢查方法 </div>

把 `.aar` 上傳到 `gpc後台`後，可以看到網頁下面會幫你檢查<br>
(目前上架還沒有強制要求，估計是讓你提早檢查)

<img src="/images/android15/015.png" alt="mcp">

可以看到若是沒有達成會有`This app version only targets 32 bit devices and does not need to support 16 KB`提示
<img src="/images/android15/016.png" alt="mcp">

<div style="font-size: 1.5rem; font-weight: bold;">方法2: zipalign</div>

官方推薦方法用cmd `zipalign`驗證.so對齊與否<br>
使用指令：
`zipalign -c -P 16 -v 4 APK_NAME.apk`<br>
若通過會顯示驗證成功
<img src="/images/android15/017.png" alt="mcp">
    
----
<div style="font-size: 1.5rem; font-weight: bold;">方法3: AS中的分析器</div>

將你的`apk` 拖移到Android Studio的視窗中<br>
他幫會幫你解析你的`apk`<br>
例如下圖，在`x86_64`會顯示未對齊：<br>

<div style="font-size: 1.5rem; font-weight: bold;">未對齊範例1</div>

<img src="/images/android15/018.png" alt="mcp">
<img src="/images/android15/019.png" alt="mcp">

----
<div style="font-size: 1.5rem; font-weight: bold;">
    方法4: 寫腳本檢查so是否對齊16kb
</div>

```agsl
#!/bin/bash

# usage: alignment.sh path to search for *.so files

dir="$1"

RED="\e[31m"
GREEN="\e[32m"
ENDCOLOR="\e[0m"

matches="$(find $dir -name "*.so" -type f)"
IFS=$'\n'
for match in $matches; do
  res="$(objdump -p ${match} | grep LOAD | awk '{ print $NF }' | head -1)"
  if [[ $res =~ "2**14" ]] || [[ $res =~ "2**16" ]]; then
    echo -e "${match}: ${GREEN}ALIGNED${ENDCOLOR} ($res)"
  else
    echo -e "${match}: ${RED}UNALIGNED${ENDCOLOR} ($res)"
  fi
done
```

用`腳本`去檢查build cache資料夾下的.so 在各[ABI](https://developer.android.com/ndk/guides/abis?hl=zh-tw)下的表現

在這個資料夾下用這個腳本，(或者你有其他自定義.so的資料夾下)：<br>
```java
..//Your Project Name/Your Project modele/build/intermediates/stripped_native_libs/channelDebug/stripChannelDebugDebugSymbols/out/lib
```

<div style="font-size: 1.5rem; font-weight: bold;">範例：</div>

armeabi
<img src="/images/android15/020.png" alt="mcp">
armeabi-v7a
<img src="/images/android15/021.png" alt="mcp">
x86
<img src="/images/android15/022.png" alt="mcp">

arm64-v8a
<img src="/images/android15/023.png" alt="mcp">

x86_64
<img src="/images/android15/024.png" alt="mcp">


----
<div style="font-size: 1.5rem; font-weight: bold;">方法5: 模擬器驗證16KB PAGE SIZE是否會Crash</div>

這個算是多給自己上一層保險<br>
或者一開始想簡單測試的時候<br>
可以直接把app安裝到 16 kb page size的模擬器<br>
在Android Studio中AVD裡面應該可以找到<br>
(不過模擬器是依序執行 解決完一項才會出現下一樣)<br>

例如：把app run on 16 KB page size devices 遇到某個`.so` crash問題：
<img src="/images/android15/025.png" alt="mcp">


----
<div style="font-size: 1.5rem; font-weight: bold;">透過上面的方法可能會遇到的情況</div>
因為在實驗過程中<br>
會發現就算用了官方推薦的方法<br>
或是手動把apk丟進AS中去驗證<br>
還是有機會遇到畫面上顯示成功<br>
但用另一個方法卻顯示不同結果的可能<br>
這邊我記錄下來<br>
大家可以參考：<br>

1. 用`zipalign`指令，-P 設定16<br>
   驗證都顯示是成功，但實際在其他方法測試可能不成功<br>
   <img src="/images/android15/026.png" alt="mcp">
   <img src="/images/android15/042.png" alt="mcp">

2. AS內建`分析器`<br>
   在不同ABI下，有不同的對齊程度<br>
   不過實測修改mmkv調整成支援16KB的版本後<br>
   再次丟入分析器`還是顯示出mmkv 未對齊`<br>
   但實際run在16KB模擬器上`已經不會crash`<br>
   或者用`腳本`去跑也顯示已對齊<br>

3. 使用`腳本`去看ELF有沒有對齊2^14 || 2^16<br>
   不同ABI架構下 可能會有不同對齊的程度<br>
   但這個就要看官方最終要求的是哪些要對齊就好<br>
   因為目前比較主流應該就是`x86_64`跟`arm64-v8a`<br>
   GPC後台的驗證目前試起來也只有針對這兩個ABI去驗證<br>
   (也可以未來官方有要求的話，在針對每個ABI優化，否則為了上架就先優化該優化的就可以)<br>
   



## 後記：記錄我有遇到過的第三方lib內的.so未對齊的例子
#### mmkv

* Crash log
```
Process: com.xxx.xxxxxxxxx, PID: 5910
java.lang.UnsatisfiedLinkError: dlopen failed: empty/missing DT_HASH/DT_GNU_HASH in "/data/app/~~GDguKzQkEWWU7nKgxukJ3g==/com.xxx.xxxxxxxx-LLLvOX6N3NINoK5qFkhyxQ==/base.apk!/lib/arm64-v8a/libmmkv.so" (new hash type from the future?)
```
* 解決方法：
  `方法1`. 去官方github 修改相關設定後自行Build一個16kb版本的.aar
  之後把原本的implment的地方改成自己build的內容
  <br>`方法2`. 升級到`1.3.14`版本，實測後可以正常運行
  <br>`方法3`. 官方 `Oct 22, 2024` 更新了`2.0.0`支援16KB
  將相關引用更新到2.0.0以上
  <br><a href = "https://github.com/Tencent/MMKV/releases/tag/v2.0.0">參考官方release note</a>

* <a href = "https://github.com/Tencent/MMKV/issues/1353">參考討論串</a>
  

#### sqlcipher
* Crash log
```json
pid: 8796, tid: 8891, name: pool 1  >>> com.xxx.xxxxxxxxxx <<<
2025-05-21 14:29:47.380  8901-8901  DEBUG                   pid-8901                             A        #02 pc 0000000000006700  /data/app/~~p4bSI2XwdSmTfm3vZluhdw==/com.sand.airdroidkidp-9wKFuA4x7Jclg5hVTLRBSA==/base.apk!libtnet-3.1.14.so (offset 0x5504000) (BuildId: 2510ff56a9673370b9d664c21a3dcb04a541d939)
2025-05-21 14:29:47.380  8901-8901  DEBUG                   pid-8901                             A        #03 pc 00000000000060c4  /data/app/~~p4bSI2XwdSmTfm3vZluhdw==/com.sand.airdroidkidp-9wKFuA4x7Jclg5hVTLRBSA==/base.apk!libtnet-3.1.14.so (offset 0x5504000) (JNI_OnLoad+76) (BuildId: 2510ff56a9673370b9d664c21a3dcb04a541d939)
```

* `解決方法`：遷移到新版本<br>
  官方github repo： [sqlcipher-android](https://github.com/sqlcipher/android-database-sqlcipher)<br>
  遷移文件：[點此](https://www.zetetic.net/sqlcipher/sqlcipher-for-android-migration/)<br>


#### xCrash

* 遇到此問題的log 
    ```json
    2025-06-03 11:14:11.095  6505-6505  xcrash com.xxx.xxxxxx E  NativeHandler System.loadLibrary failed (Ask Gemini)
    java.lang.UnsatisfiedLinkError: dlopen failed: empty/missing DT_HASH/DT_GNU_HASH in "/data/app/~~NKxgZmiW0fnAnkqxbM6pmg==/com.xxxxxx.xxxxx-TBH_eXBREJRiwzaa0oJFsQ==/base.apk!/lib/arm64-v8a/libxcrash.so" (new hash type from the future?)
    ```

* 實測`解決方法`，自行build aar出來
    - clone專案 ：[Github repo](https://github.com/iqiyi/xCrash)
    - 把專案內的`CMakeList.txt` 中 加入 2^14 || 2^16 MaxSize的相關字段，如：
       <img src="/images/android15/027.png" alt="mcp">
       <img src="/images/android15/028.png" alt="mcp">

    - 安裝ndk相關環境，原專案是用`21.3.6528147` ，我本地安裝後出現build failed, 所以嘗試一個接近的版本
       <img src="/images/android15/029.png" alt="mcp">

* NDK安裝方式
    - 列出已安裝NDK
    ```groovy
    ls -la ~/Library/Android/sdk/ndk/
    ```
    - 檢查已安裝NDK目標版本是否能正常build
    ```groovy
    ~/Library/Android/sdk/ndk/[your_version]/ndk-build --version
    ```
    - 查看可下載版本
    ```groovy
    ~/Library/Android/sdk/tools/bin/sdkmanager --list | grep ndk
    ```
    - 安裝指定ndk
    ```groovy
    ~/Library/Android/sdk/tools/bin/sdkmanager --install "ndk;25.2.9519653"
    ``` 
    其中有可能因為jdk版本太新無法下載，把環境中jdk`切回8即可下載`

    - 開始build xCrash 的.aar, 下方指令主要執行 clean > build > checkstyle 可自行搭配 主要是執行build
    但調配過程中，遇到build failed 可以拿來檢查看看
    ```
    ./gradlew clean :xcrash_lib:build -x checkstyle --rerun-tasks
    ```
* 可能遇到的問題
    - 用`./gradlew :xcrash_lib:build`時遇到：,就算沒打`checkstyle`，他還是run了checkstyle，其檢查到`AnrHandler.java` 中的java if 少了個空格，不過原始clone下來就是這樣，後來把空格加入即可
    ```
    > Task :xcrash_lib:checkstyle FAILED
    [ant:checkstyle] [ERROR] ../xcrash/AnrHandler.java:144:9: 'if' is not followed by whitespace. [WhitespaceAfter]
    ```

* 把.aar 替換掉原本的xCrash即可，`替換後` 雖然用寫好的./agliment.sh 檢查`顯示已經對齊`
   <img src="/images/android15/030.png" alt="mcp">
   但`實際上在16kb裝置上還是有報錯`

* Workaround方法
    - 因為要實測能不能在16 kb pages size裝置上run，但其不會上在google play concole，所以可以把build config切換到 intl 測試即可
      <img src="/images/android15/031.png" alt="mcp">

#### Umeng
* 遇到 libtnet.so crash問題
* 不過他也不會上到gpc，所以這邊也可以用 Workaround來測試，切換到intl來build
  <img src="/images/android15/032.png" alt="mcp">
#### AMap aka 高德地圖

* 用`implementation`方式的把`amap`導入<br>
接著做16KB檢查`../str/c/stripChannelDebugDebugSymbols/out/lib`
 
  <img src="/images/android15/033.png" alt="mcp">
  會發現 未對齊
  <img src="/images/android15/034.png" alt="mcp">

* 改用 `官網` [下載](https://lbs.amap.com/api/android-sdk/download)的最新版sdk嘗試
  等於是改成用`.jar`
  <img src="/images/android15/035.png" alt="mcp">
  <img src="/images/android15/036.png" alt="mcp">
  <img src="/images/android15/037.png" alt="mcp">
  成功可以build且run到16 kb page size裝置上
    - 重新檢查 `../str/c/stripChannelDebugDebugSymbols/out/lib`下的`.so` 發現消失了
      <img src="/images/android15/038.png" alt="mcp">
      但直接檢查官網給的`.so` 還是未對齊
      (這個是下載下來的.zip解壓縮後)
      <img src="/images/android15/039.png" alt="mcp">
      或者直接用官網的.aar 解出裡面包的.so 也未對齊
      <img src="/images/android15/040.png" alt="mcp">
* 目前查看mvn最新的amap版本，尚未有官網上的最新版本
* 也沒發現有開源source code
* 在16 kb page size上會遇到
  <img src="/images/android15/041.png" alt="mcp">

* 後續發現這個自己無法自己解決，因為官方沒有開源source code，無法透過自己build來製作workaround
所以只能等待官方更新了