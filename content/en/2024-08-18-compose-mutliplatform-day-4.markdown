---
layout: post
title: "Compose Multiplatform in Action: Running CMP Projects on Android and iOS Simulators"
date: 2024-08-18 17:15:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-4
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in Action: Developing Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform Android and iOS app development, and discuss findings and insights in the final days."
---

## Introduction

`Compose Multiplatform (CMP)`

Yesterday we just set up our CMP project

If you've successfully imported the project into your IDE

you should see a folder structure similar to this

<img src="/images/compose/032.png" alt="Cover" width="50%" /><br />

Now we can try compiling to see if it works

If compilation is `successful`

you'll see something like the screen below

with your app running in the simulator

and a success message in the bottom right corner

<img src="/images/compose/033.png" alt="Cover" width="65%" /><br />

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Setting Up an Android Emulator
If you created your project using yesterday's method: [Creating a CMP Project with Wizard]({{site.baseurl}}/compose-multiplatform-day-3)

then all the `basic project configurations have been set up for you`

You just need to make sure your system environment from Day 2 <a href="{{site.baseurl}}/compose-multiplatform-day-2">Setting Up the CMP Environment</a>

is properly installed

including JDK, Kotlin, etc.

<img src="/images/compose/034.png" alt="Cover" width="50%" /><br />

Next, to simulate on your computer

you'll need to create an Android emulator

Click on `Tools > Device Manager` in the top system bar

<img src="/images/compose/035.png" alt="Cover" width="35%" /><br />

The `Device Manager` window will appear on the right

<img src="/images/compose/036.png" alt="Cover" width="50%" /><br />

Click the `+` at the top and select `Create Virtual Device`

<img src="/images/compose/037.png" alt="Cover" width="50%" /><br />

A window will appear allowing you to choose the type of `Android emulator` you want to create

including Phone, Tablet, TV, Watch, Automotive, etc.

Since Android Studio is primarily maintained by `Google`

it provides Android Phone `AVDs (Android Virtual Devices)` with Google Pixel OS for you to download

Of course, you can also download the `Pixel AVD images` from the Android Developer website

but Google has conveniently integrated them into the IDE

<img src="/images/compose/038.png" alt="Cover" width="65%" /><br />

Select your desired Phone and click `Next` in the bottom right

You'll then reach the Android SDK selection screen

Choose the SDK version you want to test with

If you haven't downloaded a particular SDK before

it will appear grayed out with a download icon on the right

Once downloaded, you can select it

After clicking `Next`, you can configure the emulator settings

such as: orientation, network, startup settings, RAM size, SDK size, etc.

Once you're done, click `Finish` in the bottom right

<img src="/images/compose/039.png" alt="Cover" width="65%"/><br/>

<div class="c-border-content-title-1">Building Android Apps through the IDE</div>
Select the emulator you just created in the dropdown menu at the top

and click the `Run project` button (looks like a green play button) to let the IDE build and install the app on the emulator

<img src="/images/compose/040.png" alt="Cover" width="50%"/><br/>

## Manually Building Android Apps
<div class="c-border-content-title-1">Execute the following command in the terminal to build an APK</div>

>  run `./gradlew :yourComposeAppProjectName:assembleDebug`

`yourComposeAppProjectName` is your project name
`assembleDebug` indicates building a debug version

You can find the `.apk` file in `yourComposeAppProjectName/build/outputs/apk/debug/yourComposeAppProjectName-debug.apk`

<div class="c-border-content-title-1">Manual Installation</div>
There are two methods

1. Drag and drop the APK into the emulator

2. Use a command to install (if using adb on a `real device`, you need to enable developer mode)

```
adb install ../xxx/yourComposeAppProjectName-debug.apk 
```

## Setting Up an iOS Simulator

Make sure you installed Xcode from Day 2 <a href="{{site.baseurl}}/compose-multiplatform-day-2">Setting Up the CMP Environment</a>

At the top of the Android Studio screen, there's a dropdown with an `Android robot` icon

Click to open the dropdown menu

This section contains the `Configurations` set up in your project

which could be `Build Android app`, `Build iOS app` or various `gradle tasks`, etc.

<img src="/images/compose/041.png" alt="Cover" width="50%"/><br/>

If this is your first time running an `iOS app` in `Android Studio`

there might not be a default Build iOS Configuration

So click `Edit Configuration` to set it up

`Click the + in the top left` > `iOS Application`

<img src="/images/compose/042.png" alt="Cover" width="50%"/><br/>

Then, based on your needs

a. Set a name for the task

b. For Xcode project file, click the folder icon on the far right

c. In the file selector that appears, select the path to the `.xcodeproj` file

(Click on the blue highlighted `.xcodeproj` and then click open)

<img src="/images/compose/043.png" alt="Cover" width="50%"/><br/>

d. After selecting the .xcodeproj path

the IDE will automatically read the `scheme` and `configuration` inside

Now you just need to select the target `iOS emulator` version and model

<img src="/images/compose/044.png" alt="Cover" width="50%"/><br/>

e. Change the Build Configuration to the one you just created

and click the `Run button`

<div class="c-border-content-title-1">Building iOS Apps through Xcode</div>
Since CMP creates the iOS project directly in the root folder

you can simply open the `iOSApp` folder in your CMP project using Xcode

and build the iOS app directly through Xcode

## Conclusion
At this point, you should be able to fully build your CMP project and run it on both Android and iOS simulators

<img src="/images/compose/015.png" alt="Cover" width="50%"/><br/>
Tomorrow, I'd like to introduce

the CMP project structure and some potential issues you might encounter
 