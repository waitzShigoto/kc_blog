---
layout: post
title: 【Compose Multiplatform】Implementing SqlDelight Database
date: '2024-07-10 15:38:40 +0800'
image: cover/compose_multiplatform_sqldelight.png
tags:
  - CMP
  - Kotlin
  - SqlDelight
permalink: /compose-multiplatform-sqldelight
categories: CrossPlatform
excerpt: >-
  This article provides a detailed guide on how to use SqlDelight in Compose
  Multiplatform projects to implement cross-platform database operations,
  including library imports, table implementation, platform-specific
  implementations, and practical usage methods.
---

## Introduction

In Compose Multiplatform projects

how can we implement cross-platform database operations?

SqlDelight provides a powerful solution

This article will introduce how to

use SqlDelight for database operations in a cross-platform environment

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## Implementation Steps
<div class="c-border-content-title-1">1. Import SqlDelight</div>
First, import SqlDelight into your project:

Add to your .toml file:

<script src="https://gist.github.com/waitzShigoto/212a3f263b6f8bd8d89dd7a41278cf15.js"></script>

Add plugins and dependencies to build.gradle.kts:

 - First add the plugin

<script src="https://gist.github.com/waitzShigoto/d1f759b755844594d9b0a566c070274e.js"></script>
 - Then add the corresponding libraries for each environment

<script src="https://gist.github.com/waitzShigoto/961acd32138dd067fb890b238b9574ea.js"></script>
 - Finally, add the SqlDelight configuration under kotlin

 This can be understood as creating an operable class called `AppDatabase` in the `test.your.package.db` package

<script src="https://gist.github.com/waitzShigoto/34c9aeaa5ed7a5899b1ed281b0ddafca.js"></script>

<div class="c-border-content-title-1">2. Implement Database Tables</div>
 - Create .sq files in the commonMain/`sqldelight`/database directory:

 In the current version, I've verified that you need to add the sqldelight folder in the above path
 for the build process to successfully generate the operable class in the next step
![截圖 2024-07-09 下午3.11.59.png](/images/compose/007.png)
<script src="https://gist.github.com/waitzShigoto/1ba4ff8058e91955208ff66625cdae30.js"></script>

 - (Optional) You can download the `SqlDelight` plugin of the same name, so it can generate .sq files via right-click (available for download from the Marketplace)

  [Reference sqldelight](https://plugins.jetbrains.com/plugin/8191-sqldelight)

  ![截圖 2024-07-09 下午3.11.59.png](/images/compose/008.png)
 - As mentioned above, after configuration and building

   the corresponding class will be generated in the path `/build/generated/sqldelight/code/..`

 - Or you can use cmd to Build

   `./gradlew generateCommonMainAppDatabaseInterface`

 - If you encounter iOS build failures, you can change isStatic to false in build.gradle.kts

    <script src="https://gist.github.com/waitzShigoto/d212905eb22f1a29896d8d3699baefe3.js"></script>

<div class="c-border-content-title-1">3. Create Platform-specific Implementations</div>
Create DatabaseDriverFactory for different platforms:

<script src="https://gist.github.com/waitzShigoto/04d780bfc000ef0a802557555ea721d3.js"></script>

<div class="c-border-content-title-1">4. Practical Usage</div>
Implement business logic using the generated DB class:

<script src="https://gist.github.com/waitzShigoto/e35ce1a2ca45daf6070ecbedb093ca93.js"></script>

<div class="c-border-content-title-1">5. Koin Injection (Optional)</div>
If you use Koin for dependency injection

you can do it like this

<script src="https://gist.github.com/waitzShigoto/6894df15e9d1e293fda291a23faf0d6f.js"></script>

## Considerations
1. It is recommended to use SqlDelight version 2.0.1, to avoid known issues with iOS build failures in version 2.0.0

For details, see this discussion thread: [Click here](https://github.com/cashapp/sqldelight/issues/4357)

2. If you encounter iOS build failures, you can try setting isStatic to false

I can't find why this change is necessary

It might be an official workaround

The official documentation directly mentions this method

## Conclusion
- SqlDelight provides a powerful cross-platform database solution
- Through proper encapsulation, you can use database APIs uniformly across different platforms
- Combined with dependency injection frameworks like Koin, database instances can be better managed
- Pay attention to version selection and platform-specific implementations to ensure cross-platform compatibility 
