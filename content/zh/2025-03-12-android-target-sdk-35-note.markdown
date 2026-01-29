---
layout: post
title: 舊專案升級TargetSDK 35問題紀錄
date: '2025-03-12 09:29:10 +0800'
image: cover/android-sdk-35-cover.svg
tags:
  - Android
permalink: /android-target-sdk-35
categories: DebugAndOptimize
excerpt: Android15 適配筆記
---

## 專案升級TargetSDK 35問題紀錄
* 預覽階段 (2024)

## 升級到target sdk 35 遇到gradle不相容
* 這時候需要把gradle升級到8.0+ 才能解決，不過會遇到諸多問題...

## Inconsistent JVM-target compatibility

<img src="/images/sdk35/001.png" alt="target sdk 35">

* 解法1:
在gradle.properties加上
```java
kotlin.jvm.target.validation.mode = IGNORE
```

* 解法2:
參考Kid專案，在gradle.properties加上
```java
COMPILE_JAVA_VERSION=17
```
並在對應的build.gradle指定java版本

<img src="/images/sdk35/002.png" alt="target sdk 35">

## Product Flavor 'global' contains custom BuildConfig fields, but the feature is disabled

<img src="/images/sdk35/003.png" alt="target sdk 35">

* 解法:
在gradle.properties加上
```java
android.defaults.buildfeatures.buildconfig=true
```

## AIDL error

<img src="/images/sdk35/004.png" alt="target sdk 35">

* 解法:
在gradle.properties加上
```java
android.defaults.buildfeatures.aidl=true
```

## Manifest merger failed : Attribute property#android.adservices.AD_SERVICES_CONFIG

<img src="/images/sdk35/005.png" alt="target sdk 35">

* 解法:
1. In `app/build.gradle`, downgrade ***com.google.firebase:firebase-ads*** to 22.3.0
2. In `AdmobModule/build.gradle`, downgrade ***com.google.android.gms:play-services-ads*** to 22.3.0

* 參考:
https://issuetracker.google.com/issues/327696048
https://stackoverflow.com/questions/78085458/manifest-merger-failed-with-agp-8-3-0
https://stackoverflow.com/questions/78350965/manifest-merger-failed-attribute-propertyandroid-adservices-ad-services-confi

## AndroidAnnotation error

<img src="/images/sdk35/006.png" alt="target sdk 35">

* 在gradle.properties加上
```java
android.nonFinalResIds=false
```

* 錯誤變成:

<img src="/images/sdk35/007.png" alt="target sdk 35">

* AA(AndroidAnnotation)該建立的file都沒有建立成功。根據AA的 debug 方法，在build資料夾裡查看androidannotations.log:
``` java
10:13:18.48 [WorkerExecutor Queue Thread 2] ERROR o.a.i.h.AndroidManifestFinder:152 - Could not find the AndroidManifest.xml file, using  generation folder [/Users/user/project/app/build/generated/source/kapt/channelDebug])
```
  - 發現是找不到AndroidManifest.xml file.

* 參考其它專案，在 app/Build.gradle 裡加上:
```java
javaCompileOptions {
    annotationProcessorOptions {
        arguments["androidManifestFile"] = "$projectDir/src/main/AndroidManifest.xml"
    }
}
```
  - AA該建立的file還是沒有建立成功。
  - 再次查看androidannotations.log:
```java
10:25:09.812 [WorkerExecutor Queue] ERROR o.a.i.r.ProjectRClassFinder:49 - The generated .R class cannot be found
```
變成找不到.R檔。

* 將 app/Build.gradle javaCompileOptions改成:
```java
javaCompileOptions {
    annotationProcessorOptions {
        arguments = [
                'androidManifestFile': "$projectDir/src/main/AndroidManifest.xml",
                'resourcePackageName': getPackageName("sandstudio")
        ]
    }
}
```
成功通過compile! 但是開啟app會[crash](#default-firebaseapp-is-not-initialized)

## Default FirebaseApp is not initialized

<img src="/images/sdk35/008.png" alt="target sdk 35">

* Firebase會透過FirebaseInitProvider這個ContentProvider做自動初始化，不需要再額外自行加上FirebaseApp.initializeApp(Context)。

* 觀察相關log:
```java
2025-02-13 15:12:46.078  4449-4449  FirebaseApp             com.sand.airmirror                   W  Default FirebaseApp failed to initialize because no default options were found. This usually means that com.google.gms:google-services was not applied to your gradle project.
2025-02-13 15:12:46.078  4449-4449  FirebaseInitProvider    com.sand.airmirror                   I  FirebaseApp initialization unsuccessful
```
發現初始化失敗。

* 解法:
根目錄底下build.gradle，升級google-services至4.4.2
```java
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.2'
    }
}

```

## Release build error while uploadCrashlyticsMappingFileIntlRelease

```java
* What went wrong:
A problem was found with the configuration of task ':app:uploadCrashlyticsMappingFileIntlRelease' (type 'UploadMappingFileTask').
  - In plugin 'com.google.firebase.crashlytics' type 'com.google.firebase.crashlytics.buildtools.gradle.tasks.UploadMappingFileTask' property 'googleServicesFile' specifies file '/media/build/workspace/project-release/app/build/generated/res/google-services/intl/release/values/values.xml' which doesn't exist.
    
    Reason: An input file was expected to be present but it doesn't exist.
```
* 解法:
根目錄底下build.gradle，升級firebase-crashlytics至3.0.3
```java
buildscript {
    dependencies {
        classpath 'com.google.firebase:firebase-crashlytics-gradle:3.0.3'
    }
}
```

## Missing classes detected while running R8

* channelRelease build failed 資訊:
```java
> Task :AdmobModule:minifyChinaReleaseWithR8 FAILED
ERROR: Missing classes detected while running R8. Please add the missing classes or apply additional keep rules that are generated in /media/build/workspace/airmirror-release/AdmobModule/build/outputs/mapping/chinaRelease/missing_rules.txt.
ERROR: R8: Missing class java.lang.invoke.StringConcatFactory (referenced from: java.lang.String com.sand.admobmodule.SandAdRewardManager$AdSource.toString() and 41 other contexts)

```

* 查看:
`/AdmobModule/build/outputs/mapping/chinaRelease/missing_rules.txt`
```java
# Please add these rules to your existing keep rules in order to suppress warnings.
# This is generated automatically by the Android Gradle plugin.
-dontwarn java.lang.invoke.StringConcatFactory
```

* 解法:
在AdmobModule的proguard-rules.pro裡加上:
```java
-dontwarn java.lang.invoke.StringConcatFactory
```

## AGP升級到8.0+ 時遇到GreenDao相容性問題
* 雖然`GreenDao`停止更新了，github release最多也到3.3.0
  但上去mvnrepository、跟github commit meesage查，`greendaoPlugin`在2023還有偷更新的紀錄。
  實測把`green dao plugin`升級`3.3.1`之後就能通過`sync project`
  - https://mvnrepository.com/artifact/org.greenrobot/greendao-gradle-plugin
  - https://github.com/greenrobot/greenDAO/commit/1c45c2c581a5cd1dc2da025b3628d60dcf65bbed

* 後面會再遇到另一個error

  <img src="/images/sdk35/009.png" alt="target sdk 35">
  - 這時候把gradle中設定greendao的targetGenDir
    改成`targetGenDir = file("$buildDir/generated/source/greendao")`

    <img src="/images/sdk35/010.png" alt="target sdk 35">
  - 同時在kapt中加入對應的arguments
      ```kotlin
      kapt {
          correctErrorTypes = true

          arguments {
              arg("greendao.targetGenDir", file("$buildDir/generated/source/greendao").absolutePath)
              arg("greendao.schema", "$projectDir/src/main/java")
              arg("greendao.daoPackage", "com.sand.airsos.database")
              arg("greendao.targetGenDir", "$projectDir/src/main/java")
          }

      }
      ```
