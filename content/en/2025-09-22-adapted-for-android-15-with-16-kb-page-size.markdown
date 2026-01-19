---
layout: post
title: 'Adapted for Android 15 with 16 KB PAGE SIZE'
date: '2025-09-22 10:12:25 +0800'
image: cover/generated/2025-09-22-adapted-for-android-15-with-16-kb-page-size-cover.svg
tags:
  - Android
  - Kotlin
permalink: /adapted-for-android-15-with-16-kb-page-size
categories: Android
excerpt: >-
  Starting November 1, 2025, apps targeting Android 15+ devices uploaded to Google Play must support 16KB page size...
---

## Starting November 1, 2025, apps targeting Android 15+ devices uploaded to Google Play must support 16KB page size
<img src="/images/android15/014.png" alt="mcp">
<a href="https://android-developers.googleblog.com/2025/05/prepare-play-apps-for-devices-with-16kb-page-size.html">Original Article</a>

## How to verify if your app meets the 16KB page size requirements
<div style="font-size: 1.5rem; font-weight: bold;">Method 1: Google Play Console Check</div>

After uploading the `.aar` to the `Google Play Console backend`, you can see the check results at the bottom of the page<br>
(Currently not mandatory for publishing, estimated to be for early checking)

<img src="/images/android15/015.png" alt="mcp">

You can see that if it doesn't meet the requirements, there will be a prompt `This app version only targets 32 bit devices and does not need to support 16 KB`
<img src="/images/android15/016.png" alt="mcp">

<div style="font-size: 1.5rem; font-weight: bold;">Method 2: zipalign</div>

The officially recommended method uses the cmd `zipalign` to verify .so alignment<br>
Use command:
`zipalign -c -P 16 -v 4 APK_NAME.apk`<br>
If it passes, it will show verification success
<img src="/images/android15/017.png" alt="mcp">
    
----
<div style="font-size: 1.5rem; font-weight: bold;">Method 3: Analyzer in Android Studio</div>

Drag your `apk` into the Android Studio window<br>
It will help you analyze your `apk`<br>
For example, in the image below, `x86_64` shows as unaligned:<br>

<div style="font-size: 1.5rem; font-weight: bold;">Unaligned Example 1</div>

<img src="/images/android15/018.png" alt="mcp">
<img src="/images/android15/019.png" alt="mcp">

----
<div style="font-size: 1.5rem; font-weight: bold;">
    Method 4: Write a script to check if .so files are aligned to 16KB
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

Use the `script` to check .so files under the build cache folder for performance under various [ABIs](https://developer.android.com/ndk/guides/abis?hl=zh-tw)

Use this script in this folder (or other custom .so folders):<br>
```java
..//Your Project Name/Your Project modele/build/intermediates/stripped_native_libs/channelDebug/stripChannelDebugDebugSymbols/out/lib
```

<div style="font-size: 1.5rem; font-weight: bold;">Examples:</div>

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
<div style="font-size: 1.5rem; font-weight: bold;">Method 5: Emulator verification for 16KB PAGE SIZE crashes</div>

This is like adding an extra layer of insurance<br>
Or when you want to do simple testing initially<br>
You can directly install the app on a 16KB page size emulator<br>
You should be able to find it in AVD in Android Studio<br>
(However, the emulator executes sequentially - only after solving one issue will the next appear)<br>

For example: Running app on 16 KB page size devices encountering a certain `.so` crash issue:
<img src="/images/android15/025.png" alt="mcp">


----
<div style="font-size: 1.5rem; font-weight: bold;">Situations you might encounter through the above methods</div>
During the experimental process<br>
You'll find that even using the officially recommended methods<br>
Or manually throwing the apk into AS for verification<br>
There's still a chance of encountering situations where the screen shows success<br>
But using another method shows different results<br>
I'll record this here<br>
Everyone can refer to it:<br>

1. Using `zipalign` command with -P set to 16<br>
   Verification all shows success, but actual testing with other methods might not succeed<br>
   <img src="/images/android15/026.png" alt="mcp">
   <img src="/images/android15/042.png" alt="mcp">

2. AS built-in `analyzer`<br>
   Under different ABIs, there are different alignment levels<br>
   However, after actually modifying mmkv to adjust to a version supporting 16KB<br>
   Throwing it into the analyzer again `still shows mmkv as unaligned`<br>
   But actually running on 16KB emulator `no longer crashes`<br>
   Or using `script` to run also shows as aligned<br>

3. Using `script` to check if ELF is aligned to 2^14 || 2^16<br>
   Under different ABI architectures, there might be different alignment levels<br>
   But this depends on what the official final requirements are for alignment<br>
   Because currently the mainstream should be `x86_64` and `arm64-v8a`<br>
   GPC backend verification currently seems to only verify these two ABIs<br>
   (You can also optimize for each ABI if the official requires it in the future, otherwise just optimize what needs to be optimized for publishing)<br>
   


## Postscript: Recording examples of unaligned .so files in third-party libraries I've encountered
#### mmkv

* Crash log
```
Process: com.xxx.xxxxxxxxx, PID: 5910
java.lang.UnsatisfiedLinkError: dlopen failed: empty/missing DT_HASH/DT_GNU_HASH in "/data/app/~~GDguKzQkEWWU7nKgxukJ3g==/com.xxx.xxxxxxxx-LLLvOX6N3NINoK5qFkhyxQ==/base.apk!/lib/arm64-v8a/libmmkv.so" (new hash type from the future?)
```
* Solution:
  `Method 1`. Go to the official GitHub, modify related settings and build a 16KB version .aar yourself
  Then change the original implement location to your own built content
  <br>`Method 2`. Upgrade to version `1.3.14`, tested to work normally
  <br>`Method 3`. Official `Oct 22, 2024` updated `2.0.0` to support 16KB
  Update related references to 2.0.0 or above
  <br><a href = "https://github.com/Tencent/MMKV/releases/tag/v2.0.0">Reference official release note</a>

* <a href = "https://github.com/Tencent/MMKV/issues/1353">Reference discussion thread</a>
  

#### sqlcipher
* Crash log
```json
pid: 8796, tid: 8891, name: pool 1  >>> com.xxx.xxxxxxxxxx <<<
2025-05-21 14:29:47.380  8901-8901  DEBUG                   pid-8901                             A        #02 pc 0000000000006700  /data/app/~~p4bSI2XwdSmTfm3vZluhdw==/com.sand.airdroidkidp-9wKFuA4x7Jclg5hVTLRBSA==/base.apk!libtnet-3.1.14.so (offset 0x5504000) (BuildId: 2510ff56a9673370b9d664c21a3dcb04a541d939)
2025-05-21 14:29:47.380  8901-8901  DEBUG                   pid-8901                             A        #03 pc 00000000000060c4  /data/app/~~p4bSI2XwdSmTfm3vZluhdw==/com.sand.airdroidkidp-9wKFuA4x7Jclg5hVTLRBSA==/base.apk!libtnet-3.1.14.so (offset 0x5504000) (JNI_OnLoad+76) (BuildId: 2510ff56a9673370b9d664c21a3dcb04a541d939)
```

* `Solution`: Migrate to new version<br>
  Official GitHub repo: [sqlcipher-android](https://github.com/sqlcipher/android-database-sqlcipher)<br>
  Migration documentation: [Click here](https://www.zetetic.net/sqlcipher/sqlcipher-for-android-migration/)<br>


#### xCrash

* Log encountered with this issue
    ```json
    2025-06-03 11:14:11.095  6505-6505  xcrash com.xxx.xxxxxx E  NativeHandler System.loadLibrary failed (Ask Gemini)
    java.lang.UnsatisfiedLinkError: dlopen failed: empty/missing DT_HASH/DT_GNU_HASH in "/data/app/~~NKxgZmiW0fnAnkqxbM6pmg==/com.xxxxxx.xxxxx-TBH_eXBREJRiwzaa0oJFsQ==/base.apk!/lib/arm64-v8a/libxcrash.so" (new hash type from the future?)
    ```

* Tested `solution`, build aar yourself
    - Clone project: [Github repo](https://github.com/iqiyi/xCrash)
    - Add 2^14 || 2^16 MaxSize related fields to `CMakeList.txt` in the project, such as:
       <img src="/images/android15/027.png" alt="mcp">
       <img src="/images/android15/028.png" alt="mcp">

    - Install NDK related environment, the original project uses `21.3.6528147`, I got build failed after local installation, so try a similar version
       <img src="/images/android15/029.png" alt="mcp">

* NDK installation method
    - List installed NDKs
    ```groovy
    ls -la ~/Library/Android/sdk/ndk/
    ```
    - Check if installed NDK target version can build normally
    ```groovy
    ~/Library/Android/sdk/ndk/[your_version]/ndk-build --version
    ```
    - View downloadable versions
    ```groovy
    ~/Library/Android/sdk/tools/bin/sdkmanager --list | grep ndk
    ```
    - Install specified NDK
    ```groovy
    ~/Library/Android/sdk/tools/bin/sdkmanager --install "ndk;25.2.9519653"
    ``` 
    It's possible that the JDK version is too new to download, `switch JDK back to 8 to download`

    - Start building xCrash .aar, the following command mainly executes clean > build > checkstyle, you can combine them yourself, mainly executing build
    But during the tuning process, if you encounter build failed, you can use this to check
    ```
    ./gradlew clean :xcrash_lib:build -x checkstyle --rerun-tasks
    ```
* Possible issues encountered
    - When using `./gradlew :xcrash_lib:build`, encountered: even without typing `checkstyle`, it still ran checkstyle, which detected that `AnrHandler.java` was missing a space in java if, but the original clone was like this, later adding the space solved it
    ```
    > Task :xcrash_lib:checkstyle FAILED
    [ant:checkstyle] [ERROR] ../xcrash/AnrHandler.java:144:9: 'if' is not followed by whitespace. [WhitespaceAfter]
    ```

* Replace the original xCrash with the .aar, `after replacement` although using the written ./agliment.sh check `shows already aligned`
   <img src="/images/android15/030.png" alt="mcp">
   But `actually still reports errors on 16KB devices`

* Workaround method
    - Because you want to test if it can run on 16 KB pages size devices, but it won't be uploaded to Google Play Console, so you can switch the build config to intl for testing
      <img src="/images/android15/031.png" alt="mcp">

#### Umeng
* Encountered libtnet.so crash issue
* But it also won't be uploaded to GPC, so you can also use Workaround for testing, switch to intl to build
  <img src="/images/android15/032.png" alt="mcp">
#### AMap aka Gaode Maps

* Using `implementation` method to import `amap`<br>
Then do 16KB check `../str/c/stripChannelDebugDebugSymbols/out/lib`
 
  <img src="/images/android15/033.png" alt="mcp">
  Will find unaligned
  <img src="/images/android15/034.png" alt="mcp">

* Try using the latest SDK [downloaded](https://lbs.amap.com/api/android-sdk/download) from the `official website`
  Which means changing to use `.jar`
  <img src="/images/android15/035.png" alt="mcp">
  <img src="/images/android15/036.png" alt="mcp">
  <img src="/images/android15/037.png" alt="mcp">
  Successfully can build and run on 16 KB page size devices
    - Re-check `../str/c/stripChannelDebugDebugSymbols/out/lib` for `.so` files and found they disappeared
      <img src="/images/android15/038.png" alt="mcp">
      But directly checking the official `.so` is still unaligned
      (This is after downloading and unzipping the .zip)
      <img src="/images/android15/039.png" alt="mcp">
      Or directly using the official .aar to extract the packaged .so is also unaligned
      <img src="/images/android15/040.png" alt="mcp">
* Currently checking the latest amap version on mvn, there's no latest version from the official website yet
* Also haven't found open source code
* On 16 KB page size will encounter
  <img src="/images/android15/041.png" alt="mcp">

* Later found this cannot be solved by myself, because the official doesn't open source code, cannot create workaround through self-building
So can only wait for official updates