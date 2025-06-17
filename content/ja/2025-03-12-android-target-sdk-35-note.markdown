---
layout: post
title: "旧プロジェクトをTargetSDK 35に更新する際の問題記録"
date: 2025-03-12 09:29:10 +0800
image: cover/android-sdk-35-cover.svg
tags: [Android, SDK]
permalink: /android-target-sdk-35
categories: DebugAndOptimize
excerpt: "Android15 対応ノート"
---

## プロジェクトのTargetSDK 35への更新問題記録
* プレビュー段階 (2024)

## target sdk 35に更新時のgradle互換性の問題
* この問題を解決するにはgradleを8.0+にアップグレードする必要がありますが、様々な問題が発生します...

## Inconsistent JVM-target compatibility

<img src="/images/sdk35/001.png" alt="target sdk 35">

* 解決策1:
gradle.propertiesに以下を追加
```java
kotlin.jvm.target.validation.mode = IGNORE
```

* 解決策2:
Kidプロジェクトを参考に、gradle.propertiesに以下を追加
```java
COMPILE_JAVA_VERSION=17
```
そして対応するbuild.gradleでJavaバージョンを指定

<img src="/images/sdk35/002.png" alt="target sdk 35">

## Product Flavor 'global' contains custom BuildConfig fields, but the feature is disabled

<img src="/images/sdk35/003.png" alt="target sdk 35">

* 解決策:
gradle.propertiesに以下を追加
```java
android.defaults.buildfeatures.buildconfig=true
```

## AIDL error

<img src="/images/sdk35/004.png" alt="target sdk 35">

* 解決策:
gradle.propertiesに以下を追加
```java
android.defaults.buildfeatures.aidl=true
```

## Manifest merger failed : Attribute property#android.adservices.AD_SERVICES_CONFIG

<img src="/images/sdk35/005.png" alt="target sdk 35">

* 解決策:
1. `AirDroid/build.gradle`で***com.google.firebase:firebase-ads***を22.3.0にダウングレード
2. `AdmobModule/build.gradle`で***com.google.android.gms:play-services-ads***を22.3.0にダウングレード

* 参考:
https://issuetracker.google.com/issues/327696048
https://stackoverflow.com/questions/78085458/manifest-merger-failed-with-agp-8-3-0
https://stackoverflow.com/questions/78350965/manifest-merger-failed-attribute-propertyandroid-adservices-ad-services-confi

## AndroidAnnotation error

<img src="/images/sdk35/006.png" alt="target sdk 35">

* gradle.propertiesに以下を追加
```java
android.nonFinalResIds=false
```

* エラーが変わりました:

<img src="/images/sdk35/007.png" alt="target sdk 35">

* AA(AndroidAnnotation)が作成すべきファイルが正常に作成されていません。AAの[デバッグ方法](https://growi.airdroid.com/5f23bd91c1319c0047d6ba61#androidannotations)に従って、buildフォルダ内のandroidannotations.logを確認:
``` java
10:13:18.48 [WorkerExecutor Queue Thread 2] ERROR o.a.i.h.AndroidManifestFinder:152 - Could not find the AndroidManifest.xml file, using  generation folder [/Users/sion/gerrit/airmirror/airdroid/AirDroid/build/generated/source/kapt/channelDebug])
```
  - AndroidManifest.xmlファイルが見つからないことがわかりました。

* 他のプロジェクトを参考に、AirDroid/Build.gradleに以下を追加:
```java
javaCompileOptions {
    annotationProcessorOptions {
        arguments["androidManifestFile"] = "$projectDir/src/main/AndroidManifest.xml"
    }
}
```
  - AAが作成すべきファイルはまだ正常に作成されていません。
  - 再度androidannotations.logを確認:
```java
10:25:09.812 [WorkerExecutor Queue] ERROR o.a.i.r.ProjectRClassFinder:49 - The generated .R class cannot be found
```
.Rファイルが見つからない問題に変わりました。

* AirDroid/Build.gradleのjavaCompileOptionsを以下のように変更:
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
コンパイルに成功しました！ しかし、アプリを開くと[クラッシュ](#default-firebaseapp-is-not-initialized)します

## Default FirebaseApp is not initialized

<img src="/images/sdk35/008.png" alt="target sdk 35">

* FirebaseはFirebaseInitProviderというContentProviderを通じて自動初期化を行うため、別途FirebaseApp.initializeApp(Context)を追加する必要はありません。

* 関連ログを確認:
```java
2025-02-13 15:12:46.078  4449-4449  FirebaseApp             com.sand.airmirror                   W  Default FirebaseApp failed to initialize because no default options were found. This usually means that com.google.gms:google-services was not applied to your gradle project.
2025-02-13 15:12:46.078  4449-4449  FirebaseInitProvider    com.sand.airmirror                   I  FirebaseApp initialization unsuccessful
```
初期化に失敗していることがわかりました。

* 解決策:
ルートディレクトリのbuild.gradleで、google-servicesを4.4.2にアップグレード
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
A problem was found with the configuration of task ':AirDroid:uploadCrashlyticsMappingFileIntlRelease' (type 'UploadMappingFileTask').
  - In plugin 'com.google.firebase.crashlytics' type 'com.google.firebase.crashlytics.buildtools.gradle.tasks.UploadMappingFileTask' property 'googleServicesFile' specifies file '/media/build/workspace/airmirror-release/AirDroid/build/generated/res/google-services/intl/release/values/values.xml' which doesn't exist.
    
    Reason: An input file was expected to be present but it doesn't exist.
```
* 解決策:
ルートディレクトリのbuild.gradleで、firebase-crashlyticsを3.0.3にアップグレード
```java
buildscript {
    dependencies {
        classpath 'com.google.firebase:firebase-crashlytics-gradle:3.0.3'
    }
}
```

## Missing classes detected while running R8

* channelRelease buildが失敗した情報:
```java
> Task :AdmobModule:minifyChinaReleaseWithR8 FAILED
ERROR: Missing classes detected while running R8. Please add the missing classes or apply additional keep rules that are generated in /media/build/workspace/airmirror-release/AdmobModule/build/outputs/mapping/chinaRelease/missing_rules.txt.
ERROR: R8: Missing class java.lang.invoke.StringConcatFactory (referenced from: java.lang.String com.sand.admobmodule.SandAdRewardManager$AdSource.toString() and 41 other contexts)

```

* 確認:
`/AdmobModule/build/outputs/mapping/chinaRelease/missing_rules.txt`
```java
# Please add these rules to your existing keep rules in order to suppress warnings.
# This is generated automatically by the Android Gradle plugin.
-dontwarn java.lang.invoke.StringConcatFactory
```

* 解決策:
AdmobModuleのproguard-rules.proに以下を追加:
```java
-dontwarn java.lang.invoke.StringConcatFactory
```

## AGPを8.0+にアップグレード時のGreenDao互換性問題
* `GreenDao`は更新が停止しており、GitHub上のリリースは最大でも3.3.0までですが、
  mvnrepositoryやGitHubのコミットメッセージを確認すると、`greendaoPlugin`は2023年に密かに更新された記録があります。
  実際に`green dao plugin`を`3.3.1`にアップグレードすると`sync project`が通るようになります。
  - https://mvnrepository.com/artifact/org.greenrobot/greendao-gradle-plugin
  - https://github.com/greenrobot/greenDAO/commit/1c45c2c581a5cd1dc2da025b3628d60dcf65bbed

* 後でさらに別のエラーが発生します

  <img src="/images/sdk35/009.png" alt="target sdk 35">
  - この場合、gradleのgreendao設定のtargetGenDirを
    `targetGenDir = file("$buildDir/generated/source/greendao")`に変更します

    <img src="/images/sdk35/010.png" alt="target sdk 35">
  - 同時にkaptに対応するargumentsを追加します
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