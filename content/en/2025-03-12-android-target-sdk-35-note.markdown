---
layout: post
title: "Issues when Updating Old Projects to TargetSDK 35"
date: 2025-03-12 09:29:10 +0800
image: cover/android-sdk-35-cover.svg
tags: [Android, SDK]
permalink: /android-target-sdk-35
categories: DebugAndOptimize
excerpt: "Android15 Compatibility Notes"
---

## Project Update to TargetSDK 35 Issues Log
* Preview stage (2024)

## Gradle Compatibility Issues when Updating to target sdk 35
* To resolve this issue, you need to upgrade gradle to 8.0+, but various problems arise...

## Inconsistent JVM-target compatibility

<img src="/images/sdk35/001.png" alt="target sdk 35">

* Solution 1:
Add the following to gradle.properties
```java
kotlin.jvm.target.validation.mode = IGNORE
```

* Solution 2:
Referring to the Kid project, add the following to gradle.properties
```java
COMPILE_JAVA_VERSION=17
```
And specify the Java version in the corresponding build.gradle

<img src="/images/sdk35/002.png" alt="target sdk 35">

## Product Flavor 'global' contains custom BuildConfig fields, but the feature is disabled

<img src="/images/sdk35/003.png" alt="target sdk 35">

* Solution:
Add the following to gradle.properties
```java
android.defaults.buildfeatures.buildconfig=true
```

## AIDL error

<img src="/images/sdk35/004.png" alt="target sdk 35">

* Solution:
Add the following to gradle.properties
```java
android.defaults.buildfeatures.aidl=true
```

## Manifest merger failed : Attribute property#android.adservices.AD_SERVICES_CONFIG

<img src="/images/sdk35/005.png" alt="target sdk 35">

* Solution:
1. Downgrade ***com.google.firebase:firebase-ads*** to 22.3.0 in `AirDroid/build.gradle`
2. Downgrade ***com.google.android.gms:play-services-ads*** to 22.3.0 in `AdmobModule/build.gradle`

* References:
https://issuetracker.google.com/issues/327696048
https://stackoverflow.com/questions/78085458/manifest-merger-failed-with-agp-8-3-0
https://stackoverflow.com/questions/78350965/manifest-merger-failed-attribute-propertyandroid-adservices-ad-services-confi

## AndroidAnnotation error

<img src="/images/sdk35/006.png" alt="target sdk 35">

* Add the following to gradle.properties
```java
android.nonFinalResIds=false
```

* Error changed to:

<img src="/images/sdk35/007.png" alt="target sdk 35">

* The files that AA (AndroidAnnotation) should create are not being created properly. Following AA's [debugging method](https://growi.airdroid.com/5f23bd91c1319c0047d6ba61#androidannotations), check androidannotations.log in the build folder:
``` java
10:13:18.48 [WorkerExecutor Queue Thread 2] ERROR o.a.i.h.AndroidManifestFinder:152 - Could not find the AndroidManifest.xml file, using  generation folder [/Users/sion/gerrit/airmirror/airdroid/AirDroid/build/generated/source/kapt/channelDebug])
```
  - Found that the AndroidManifest.xml file could not be found.

* Referencing other projects, add the following to AirDroid/Build.gradle:
```java
javaCompileOptions {
    annotationProcessorOptions {
        arguments["androidManifestFile"] = "$projectDir/src/main/AndroidManifest.xml"
    }
}
```
  - The files that AA should create are still not being created properly.
  - Check androidannotations.log again:
```java
10:25:09.812 [WorkerExecutor Queue] ERROR o.a.i.r.ProjectRClassFinder:49 - The generated .R class cannot be found
```
The problem has changed to not finding the .R file.

* Change javaCompileOptions in AirDroid/Build.gradle as follows:
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
Compilation succeeded! However, the app [crashes](#default-firebaseapp-is-not-initialized) when opened

## Default FirebaseApp is not initialized

<img src="/images/sdk35/008.png" alt="target sdk 35">

* Firebase performs auto-initialization through a ContentProvider called FirebaseInitProvider, so there's no need to separately add FirebaseApp.initializeApp(Context).

* Check related logs:
```java
2025-02-13 15:12:46.078  4449-4449  FirebaseApp             com.sand.airmirror                   W  Default FirebaseApp failed to initialize because no default options were found. This usually means that com.google.gms:google-services was not applied to your gradle project.
2025-02-13 15:12:46.078  4449-4449  FirebaseInitProvider    com.sand.airmirror                   I  FirebaseApp initialization unsuccessful
```
Found that initialization failed.

* Solution:
Upgrade google-services to 4.4.2 in the root directory's build.gradle
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
* Solution:
Upgrade firebase-crashlytics to 3.0.3 in the root directory's build.gradle
```java
buildscript {
    dependencies {
        classpath 'com.google.firebase:firebase-crashlytics-gradle:3.0.3'
    }
}
```

## Missing classes detected while running R8

* channelRelease build failure information:
```java
> Task :AdmobModule:minifyChinaReleaseWithR8 FAILED
ERROR: Missing classes detected while running R8. Please add the missing classes or apply additional keep rules that are generated in /media/build/workspace/airmirror-release/AdmobModule/build/outputs/mapping/chinaRelease/missing_rules.txt.
ERROR: R8: Missing class java.lang.invoke.StringConcatFactory (referenced from: java.lang.String com.sand.admobmodule.SandAdRewardManager$AdSource.toString() and 41 other contexts)

```

* Check:
`/AdmobModule/build/outputs/mapping/chinaRelease/missing_rules.txt`
```java
# Please add these rules to your existing keep rules in order to suppress warnings.
# This is generated automatically by the Android Gradle plugin.
-dontwarn java.lang.invoke.StringConcatFactory
```

* Solution:
Add the following to AdmobModule's proguard-rules.pro:
```java
-dontwarn java.lang.invoke.StringConcatFactory
```

## GreenDao Compatibility Issues when Upgrading AGP to 8.0+
* `GreenDao` has stopped updating, and the releases on GitHub are at most 3.3.0, but
  checking mvnrepository and GitHub commit messages shows that `greendaoPlugin` was quietly updated in 2023.
  Actually upgrading `green dao plugin` to `3.3.1` makes `sync project` work.
  - https://mvnrepository.com/artifact/org.greenrobot/greendao-gradle-plugin
  - https://github.com/greenrobot/greenDAO/commit/1c45c2c581a5cd1dc2da025b3628d60dcf65bbed

* Later, another error occurs

  <img src="/images/sdk35/009.png" alt="target sdk 35">
  - In this case, change the targetGenDir in gradle's greendao settings to
    `targetGenDir = file("$buildDir/generated/source/greendao")`

    <img src="/images/sdk35/010.png" alt="target sdk 35">
  - Also add corresponding arguments to kapt
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