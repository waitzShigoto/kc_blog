---
layout: post
title: '[App Development] Use AIDL for Inter-process Communication in Android Apps!'
date: '2020-08-21 09:41:01 +0800'
image: cover/android-aidl-1.png
permalink: /android_aidl
tags:
  - Android
categories: AndroidDev
excerpt: >-
  As an app engineer, you will always be required to implement various features.
  When you encounter the need for inter-process communication between apps, what
  should you do?
---

<h1 class="article-main-title">Introduction to AIDL</h1>

### What is AIDL?

Sometimes you want to communicate from process A to process B.

In this case, you can use AIDL to communicate between different processes.

### For example:

1. It can be used for communication between two apps.
2. It can be used for communication between an app and the native kernel layer (but you must build AOSP and put the written application into the underlying layer).
3. Or communication between an app and a service... etc.

Additionally, AIDL is a commonly used IPC solution.

I have also written another article summarizing common IPC solutions.

If needed, you can refer to it:

<div class="article-card">
    <h4>IPC Inter-process Communication Solutions</h4>
    <hr />
    <a href="/2022/04/15/android-ipc-note/">
        <img src="/images/cover/android-ipc-method-share-1.png" alt="Cover" width="30%" />
        <br /><br />
        [Problem Solved Series] Android IPC Inter-process Communication Solutions
    </a>
</div>

<h1 class="article-main-title">AIDL Implementation</h1>

<div class="article-section-title">Step 1: Define the AIDL Interface</div>

* In this step, you can write freely in a notebook.
* Or you can use an IDE to write (here I am using Android Studio).
* As long as it is a place where you can type, you can write.

Next, define what interfaces your AIDL will expose:

* For example, if you want a function to get all update lists, you can create an interface similar to getUpdateList.
* If you want to get the status, write a getStatus interface.
* And so on...

![1.png](/images/aidl/1.png)

* Finally, you need to save the file with the extension .aidl.

![11.png](/images/aidl/11.png)

<div class="article-section-title">Step 2: Implement the Service</div>

* After completing the above AIDL interface, you need to build it.
* You can use the CLI `./gradle build` to build it, or use the `Build > Rebuild Project` option in Android Studio to build it.

![12.png](/images/aidl/12.png)

* After building, a .java file with the same name will be generated.

![13.png](/images/aidl/13.png)

* Usually, in an Android app, you will use a Service to call the AIDL interface. So first, extend the Service and override the necessary lifecycle methods.

An example is as follows:

<script src="https://gist.github.com/waitzShigoto/7f7cbef82fc784a8d44544bf5cbaf55b.js"></script>

* Next, add the AIDL instance generated after the build to the same service:

<script src="https://gist.github.com/waitzShigoto/d7bdc13de183beebcda4add00ecf8458.js"></script>

<div class="article-subsection-title">💡 Tip: The AIDL interface and Service package path must be the same, otherwise it will not compile successfully</div>

The three images below are illustrative:

![3.png](/images/aidl/3.png)

![4.png](/images/aidl/4.png)

![5.png](/images/aidl/5.png)

<div class="article-section-title">Step 3: Add Service to Manifest.xml</div>

Add the Service from `Step 2` to AndroidManifest.xml and add an action

<script src="https://gist.github.com/waitzShigoto/873470afaa8317265c25ac02fc8832b3.js"></script>

The action here corresponds to the action that will be used in `Step 5` to bind the ServiceConnection

`action android:name="elegant.access.service.IRSSmartService"`

<div class="article-section-title">Step 4: Implement Intent bind service</div>

* Here you can start to add your AIDL interface + implement the service that instantiates AIDL for other cross-process apps or different layers to use

In Android, you can directly start it with an Intent wherever you need

Refer to `Steps 5~7` for details

<div class="article-section-title">(Optional) Step 5: Other Use Cases</div>
* If you want to use your AIDL Service at the application layer, you can refer to the code below

`Just use Intent to bind the AIDL service`

<script src="https://gist.github.com/waitzShigoto/ab90b84bcdc96f98ec498045b68c57e5.js"></script>
Then you can directly operate the methods already implemented inside

For example:

```kotlin
eleAcesAPI.getUpdateList();
```

* If you want to use it in the `non-application layer`

Here is a `shared experience`: previously encountered a project that required defining the AIDL interface at the application layer

but the actual use was to be placed in the framework kernel layer (coincidentally, the project was doing OTA)

So if you are also

just need to open the AIDL interface

This way, you can complete it by just doing `Step 3`

Then see if the layer you want to implement supports AIDL

For example: in my encountered project, we were doing OTA ourselves

able to define a custom binder

So I wrote a service that connected to the AIDL interface using C#

Then just bind it at the app layer

Here, we used reflection to bind the service written in the kernel

Binding example:

<script src="https://gist.github.com/waitzShigoto/364a1289647d7676a7b51e35d21c4899.js"></script>

<div class="article-subsection-title">⚠️ Note: Use this only if you have the need to develop at the lower layer. If it's for app implementation of AIDL, just use the previous one</div>

<div class="article-subsection-title">⚠️ Note 2: Android officially updated the reflection policy after Android 9, not sure if this can still be used, because at that time the target version for the OTA model was 5~8, you can test it yourself</div>

<div class="article-section-title">(Optional) Step 6: Other Use Cases - Limited AIDL Support Types</div>

* Here, because the project had some specific return value requirements

such as Calendar

but AIDL originally did not support this type

so I defined another abstract layer

When I implement it, I just need to remember to add logic in the middle

![9.png](/images/aidl/9.png)

<div class="article-section-title">(Optional) Step 7: Other Use Cases - Package AIDL into a Jar File</div>

* At that time, the requirement was to directly build a jar file using groovy syntax so that other processes could use it directly

You can do it like this:

![10.png](/images/aidl/10.png)
