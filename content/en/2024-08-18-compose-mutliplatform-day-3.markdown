---
layout: post
title: >-
  Compose Multiplatform in Action: Continuing the Battle, Creating a CMP Project
  with Wizard
date: '2024-08-18 17:13:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-3
categories: CrossPlatform
excerpt: >-
  This series focuses on Compose Multiplatform in Action: Developing
  Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform
  Android and iOS app development, and discuss findings and insights in the
  final days.
---

## Introduction

`Compose Multiplatform (CMP)`

Yesterday we just finished setting up the CMP environment

From a programming perspective

you could actually start from scratch

creating every file or structure yourself

creating each file manually

even using commands to write them

for example

`touch xxx.kt`

then edit each file with `vim`

But that's too cumbersome

so when creating projects

we typically use pre-configured project structures

For `CMP`

we can use the official `Wizard` tool

So today we'll learn

how to create CMP projects using the `Wizard`

and address some common issues

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Creating a CMP Project
<div class="c-border-content-title-1">Project Creation</div>
It's actually quite simple

using JetBrains' official webpage
 
[Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/#newProject)

Once on this page

you'll see a screen like this

<img src="/images/compose/027.png" alt="Cover" width="50%" /><br />

Modify the project name, package name, etc. according to your needs

> Let's quickly go through the settings as shown above

`Project Name`: This is the name of your project

It mainly affects the `name of your built app`

and your project's `root folder name`

`Project ID`: This is the Package Name of your built app

It also affects the package path in your project

Below you'll see several checkboxes

`Android`, `iOS`, `Desktop`, `Web`, `Server`

You can select which platforms you want the wizard to configure for your project

This is straightforward

For example, if my goal is to target `Android` and `iOS`, I'd select these two platforms

Under iOS, you'll see two options

allowing you to choose your UI configuration

> Share UI (with Compose Multiplatform UI framework)
Do not share UI (use only SwiftUI)

If you want iOS to use Compose, select

`Share UI (with Compose Multiplatform UI framework)`

Otherwise, use native SwiftUI

Note that these are just `default` settings based on your choices

you can still `manually change them later`

After completing the form, click Download

to get a pre-configured project

<img src="/images/compose/028.png" alt="Cover" width="70%" /><br/>

<div class="c-border-content-title-1">Importing into IDE</div>

Unzip the compressed file from the previous step

then you can use `Android Studio`'s `import project` feature

to import it into the IDE

so you can edit it there

Navigate to `File > New > Import Project`

<img src="/images/compose/029.png" alt="Cover" width="50%" /><br/>

In the file selection dialog that appears

select the `folder` you just unzipped

<img src="/images/compose/030.png" alt="Cover" width="70%" /><br/>

<div class="c-border-content-title-1">Bonus: Compose Multiplatform Wizard</div>
As mentioned in previous days, the CMP community is quite active

and the main company behind it, `JetBrains`

continues to maintain and update the tools

This is a newer feature also developed by `JetBrains employees`

[Compose Multiplatform Wizard](https://www.jetbrains.com/lp/compose-multiplatform/)
though it's not included in the official documentation

I came across it while browsing GitHub

It's similar to the `Kotlin Multiplatform Wizard` mentioned above

`Compose Multiplatform Wizard` also generates projects with `Compose` as the UI through a web interface

but adds options to import commonly used CMP libraries

<img src="/images/compose/031.png" alt="Cover" width="50%" /><br />

Just like before

enter your desired Project Name and Project ID

select the libraries you want

download, unzip, and import into your IDE

This is the GitHub repo of the developer `terrakok` if you're interested

It appears to be hosted on GitHub Pages

[Compose-Multiplatform-Wizard GitHub](https://github.com/terrakok/Compose-Multiplatform-Wizard-App) 
