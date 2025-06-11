---
layout: post
title: "Issues Encountered When Migrating Android Projects to Version Catalogs Using .toml"
date: 2024-05-24 18:24:24 +0800
image: cover/android-upgrade-to-toml-tutorial.png
tags: [Kotlin]
permalink: /android-upgrade-to-toml-tutorial
categories: Kotlin
excerpt: ""
---

<div class="c-border-content-title-4">Introduction</div>
* Since the previous project switched to `.kts` for building the project

the official documentation also released an article aimed at migrating projects to version catalogs

After adding it, you can see it displayed at the bottom when viewing the project directory in Android Studio

<img src="/images/toml/001.png" width="40%">

This saves a step (no need to double Shift to search XD) 

You can see the content by clicking 

* Previously, creating a `Dependence.kt` might require double Shift to search

or looking under `../Dependence.kt`

<div class="c-border-content-title-1">Applicable AGP Versions</div>

* Because newer versions of Android Studio

can directly configure new projects through the IDE

But if you encounter older projects

you might wonder if you need to update the `AGP version` during manual migration

And usually, older projects might be quite old

requiring time to update or lacking the budget to optimize in a short time

so maintaining the original version might be considered

* So I did some research

and randomly took an AGP configured with toml created by AS

which was directly version 8.4.0

<img src="/images/toml/002.png" width="50%">

<img src="/images/toml/003.png" width="50%">

<img src="/images/toml/004.png" width="50%">

* According to the Gradle official documentation, in the `7.0` documentation
it mentions that `version catalogs were supported as an experimental feature in the 7.0 release`
<img src="/images/toml/005.png" width="50%">

<a href="https://docs.gradle.org/7.0/release-notes.html">Refer to Gradle 7.0 release</a>
So toml can be used in 7.x

<div class="c-border-content-title-1">Issues You Might Encounter During Migration</div>
* Some projects use this method to introduce libraries

```
implement("com.orhanobut:dialogplus:1.11@aar")
```
There is an @aar at the end

But toml does not support adding @aar at the end in versions

causing the build to fail

<img src="/images/toml/009.png" width="50%">

You can change it to the following

<script src="https://gist.github.com/waitzShigoto/c019662550b3ae9c8ab2a685ee3644a7.js"></script>

* In the past, kotlin objects were used to configure version parameters, as shown below

<script src="https://gist.github.com/waitzShigoto/e529bd12f84310a4c1f05c237850f1ba.js"></script>
If you want to switch everything to .toml
Testing shows that accessing versions configured in .toml externally

cannot be done directly like `libs.xx.xx.xxx to get the version`

You can only use `get()` to get the value of Versions in .toml

For example: `libs.versions.minSdk.get().toInt()`

<script src="https://gist.github.com/waitzShigoto/950ea155ac70ee87ce9b2060667027fa.js"></script>

However, if you set it this way

you cannot see where it is used in .toml

<img src="/images/toml/013.png" width="50%">

Use `aapt dump badging appName.apk` to verify that the build output matches the `libs.versions.minSdk.get()` setting

<img src="/images/toml/010.png" width="100%">

* Configurations below AGP 8.1.0 need to add `@Suppress("DSL_SCOPE_VIOLATION")` above `plugin{}`
<img src="/images/toml/012.png" width="100%">

The reason is due to an issue with the IDE
<a href="https://github.com/gradle/gradle/issues/22797">Version catalog accessors for plugin aliases shown as errors in IDE kotlin script editor #22797</a>

* Next is the version.ref under `[plugins]`

It cannot be set to null or empty 

Because some projects use plugin + classpath to set up
<script src="https://gist.github.com/waitzShigoto/d353a385e8942ba88259c2bbb4e03171.js"></script>
<script src="https://gist.github.com/waitzShigoto/29686a0a02bd225c08ca968011f87503.js"></script>
This causes conflicts when directly using plugins settings

<img src="/images/toml/011.png" width="50%">

<div class="c-border-content-title-1">Why some libraries can build without setting version.ref</div>
* The first time you use `.toml`, you might wonder why some libraries can build normally without setting version.ref

<img src="/images/toml/014.png" width="80%">

This is because when you introduce `composeBom`

and then import other related libraries without setting versions

it will automatically map the related library versions based on the composeBom version you set

So, by just setting composeBom, it can automatically set compatible versions for the supported libraries

Very convenient!

 - <a href="https://developer.android.com/develop/ui/compose/bom/bom-mapping">Refer to Bom mapping to understand the corresponding versions</a>

<div class="c-border-content-title-4">Migration method for version catalogs</div>
<div class = "table_container">
   <p>Migration explanation</p>
  Create <b>lib.version.toml</b> under the <b>../gradle</b> directory

  <img src="/images/toml/006.png" width="35%">

  Add <b>[versions]</b>, <b>[libraries]</b>, and <b>[plugins]</b> according to your needs

  The official recommended naming convention is kebab case

  It helps with better code completion

  <img src="/images/toml/008.png" width="100%">
  For example, the code below:
</div>
<script src="https://gist.github.com/waitzShigoto/ca2178bad03c6ee04618a575a7751334.js"></script>

<div class = "table_container">
   <p>Actual usage</p>
  After adding the toml file, click sync now to synchronize

  Then you can directly use it in build.gradle.kts

  For example, the code below:

</div>
<script src="https://gist.github.com/waitzShigoto/5be8ba888fa9e64287f8a33636fa533b.js"></script>
<div class="c-border-content-title-1">References</div>
- <a href="https://developer.android.com/build/migrate-to-catalogs?hl=zh-cn#kts">Android developer official documentation</a>

- <a href="https://docs.gradle.org/7.5/userguide/version_catalog_problems.html#unsupported_format_version">Gradle version catalogs troubleshooting</a>

- <a href="https://github.com/gradle/gradle/issues/22797">Version catalog accessors for plugin aliases shown as errors in IDE kotlin script editor #22797</a>

