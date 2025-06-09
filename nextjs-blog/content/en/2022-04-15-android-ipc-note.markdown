---
layout: post
title: "Connecting Android Apps: A Guide to IPC Solutions for Seamless Communication Across Processes!"
date: 2022-04-15 15:36:28 +0800
image: cover/android-ipc-method-share-1.png
tags: [Android,Debug]
categories: Android教學
excerpt: "Explore inter-process communication (IPC) techniques between Android applications, enabling your apps to communicate seamlessly across different processes for better collaboration."
---

## Introduction

* Today, I want to share solutions related to "inter-application communication".

  In my previous work experience, clients have asked me about this topic,

  so I have compiled relevant information and am sharing it here.

  This share covers various IPC-related solutions,

  allowing those in need to obtain multiple solutions at once,

  to achieve communication and collaboration between applications more quickly.

## Common Android App Layer IPC Solutions
  * `IPC Science: Inter-Process Communication`, translated as inter-process communication or cross-process communication
    - `ContentProvider`: A native component that provides external interfaces (implementing the library's add, delete, update, query), allowing different apps to access shared data across processes.
      - Use case: More suitable for different apps needing shared data, such as accessing SQL databases, shared files, etc. Additionally, contacts and phone books also use this method to allow other applications to obtain data.
      - To know the data update status, you need to register an Observer separately.

    - `AIDL`: A language for external interfaces, defining .aidl files and implementing their interfaces, achieving cross-process access through binder. You can customize input and output types and handle multiple requests in multiple threads.

       - [Official - AIDL Implementation Reference](https://developer.android.com/guide/components/aidl)
     ```
     Binder: A type of driver under the Linux Kernel
     ```
     

    - `Messenger`: An official solution, lighter compared to AIDL, implemented using Handler and Message, also operating through binder, but can only handle one request at a time.

        - [Official - Messenger Implementation Reference](https://developer.android.com/guide/components/bound-services#Messenger)

        

    - AIDL vs Messenger
       <table class="rwd-table">
         <thead>
           <tr>
             <th class="tg-vrid"></th>
             <th class="tg-vrid">Feature</th>
             <th class="tg-vrid">Development Differences</th>
             <th class="tg-vrid">Usage Scenarios</th>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td class="tg-3b1y">AIDL</td>
             <td class="tg-3b1y">1. Real-time communication
2. Simultaneously receive and process multiple requests</td>
             <td class="tg-3b1y">1. <span style="color:#DD496E;background-color:#181B1C">.aidl</span> can define input and output interfaces
More intuitive in development, just call the interface directly when calling
             
2. Supports multiple data types (Int, String, etc.)</td>
             <td class="tg-3b1y">When there are many interfaces
Frequent request handling is needed</td>
           </tr>
           <tr>
             <td class="tg-3rup">Messenger</td>
             <td class="tg-3rup">1. Real-time communication
2. Simultaneously receive multiple requests but need to queue for processing</td>
             <td class="tg-3rup">1. Need to establish Messenger on both server and client sides
to handle Message sending and receiving<span style="font-weight:400;font-style:normal"></span>
2. Transmit data through the Message class</td>
             <td class="tg-3rup">When there are not many interfaces
Only occasional request handling is needed</td>
           </tr>
         </tbody>
       </table>

- `Socket`: Both parties agree on an IP, connect locally, forming a C/S architecture to handle requests, with a larger deployment range (within a local network).

  <table class="rwd-table">
  <thead>
    <tr>
      <th class="tg-vrid"></th>
      <th class="tg-vrid">Performance</th>
      <th class="tg-vrid">Security</th>
      <th class="tg-vrid">Development Differences</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-3b1y">Binder</td>
      <td class="tg-3b1y">Request is copied only once</td>
      <td class="tg-3b1y">Request is restricted within the Binder layer</td>
      <td class="tg-3b1y">Frequent handling of requests when there are many interfaces</td>
    </tr>
    <tr>
      <td class="tg-3rup">Socket</td>
      <td class="tg-3rup">Request needs to be copied twice</td>
      <td class="tg-3rup">Request is exposed within the entire local network</td>
      <td class="tg-3rup">Occasional handling of requests when there are not many interfaces</td>
    </tr>
  </tbody>
  </table>

  - [Detailed explanation of copy times](https://tw511.com/a/01/9215.html)

- `BroadCast`: A method in the Android system that allows apps to send and receive broadcasts to exchange information between processes.

  - Receiving broadcasts: After registering a receiver, broadcasts can be received, and there are two registration methods:

    1. Static registration: Registered in AndroidManifest.xml. If the app is not running and a related broadcast is received, the app will be started to receive the broadcast (limited to Android 8.0 and below; removed from 8 onwards).
    2. Dynamic registration: Registered through Context. As long as the context exists, broadcasts will be received.

  - Sending broadcasts:

    1. `sendOrderedBroadcast`: Broadcasts are received by one receiver at a time in order of priority, with support for stopping the broadcast midway.
       - If multiple apps have receivers with the same priority, the broadcast is sent to the app installed first.
    2. `sendBroadcast`: Broadcasts are sent to all receivers in random order, with higher efficiency, but data is sent to all registered receivers at once.
    3. `LocalBroadcastManager.sendBroadcast`: Broadcasts are sent only within the same app.

  - Features:

    1. All receivers registered for the same broadcast can receive it. To prevent global reception, custom permissions can be added to restrict specific apps. Additionally, Android 4.0 and above provide `setPackage(String)` to specify the receiving app.
    2. When registering a BroadcastReceiver, the onReceive() method runs on the main thread. To avoid affecting the main thread with time-consuming operations, it is recommended to keep operations within 10 seconds.

  - Security considerations:

    1. Third parties might obtain the custom permission string or package name and add it to their app to receive your broadcast data.
    2. Broadcast names are global. If someone maliciously registers the same name, they can spoof and send requests.

  - [Official - Broadcasts](https://developer.android.com/guide/components/broadcasts)

##  Android app layer IPC solutions and potential security issues

* Interface misuse by unauthorized users:
  - `BroadCast`:
    - Anyone can intercept broadcast content when sending broadcasts.
      - Countermeasures:
        1. Use setPackage(String) on Android 4 to specify the receiving package name.
        2. Add permission fields to allow only apps with the declared field to receive.
    - If someone obtains the field or spoofs the package name after adding permissions or specifying the package name, they can intercept and send broadcasts.
      - Countermeasures:
        1. Obfuscate related code to increase cracking time.
  - `Socket`:
    - Public interfaces need to be exposed within the entire local network, and anyone who knows the IP can use them.
      - Countermeasures:
        1. Verify user identity (custom Token: encrypted with sha256, md5, aes, des, etc.) and permissions.
        2. Use Binder-related IPC solutions to reduce exposure.
  - `AIDL`:
    - Anyone with the .aidl file can develop a new client to connect.
      - Countermeasures:
        1. Verify the UID of the accessing interface (android.os.Process.myUid()).
        2. Verify app permission `signature` to allow access only to apps with the signature: [Permission Guide](https://developer.android.com/guide/topics/manifest/permission-element?hl=zh-cn#plevel).
  - `Messenger`:
    - When binding a service, use `Intent().component = ComponentName("package name", "package name:Service name")`, allowing anyone who knows the package name and service name to connect.
      - Countermeasures:
        1. Similar to the AIDL solution above, verify UID and signature.
  - `ContentProvider`:
    - ContentProvider locates data tables through URIs. If the URI is leaked, data can be easily read.
      - Further issues after URI leakage:
        1. Sensitive information in your ContentProvider can be read using drozer commands.
        2. SQL injection: ContentProvider uses tables to store shared data. If custom SQL syntax is not well-designed, it may lead to SQL injection attacks due to non-parameterized settings.
      - Countermeasures:
        1. Verify permissions and signatures.
        2. Obfuscate code.
        3. If using SQL syntax, switch to official functions to avoid errors in manual definitions.

~~~
  * The components declared in Manifest.xml, such as BroadCast and ContentProvider, can be set as follows:
     When android:exported="true", if no further action is taken, it can accept access from other apps.
     When android:exported="false", it is restricted to accept access only from the same app or an app with the same `user ID`.
    -> Used to restrict usage to the current user group (supported after Android 4.2).

  * `user ID`: The number of actual users, such as the main account on the phone, guests, etc.
    `uid`: Related to the app process, each app's uid is different for each user.
    `appid`: The appid is the same for the same package name, even for different users.
~~~

## IPC Solutions Supported Data Types (Based on the types currently supported in the library)
  * `BoardCast`: Data is transmitted via Intent, which can carry a bundle. The bundle supports: byte, char, short, float, string, parcelable, serializable, etc.
  * `Socket`: Data is written out via BufferedWriter and received via BufferedReader. According to the source code, it currently supports: string, int, char[].
  * `AIDL`: int, long, char, boolean, string, charSequence, list, map, parcelable.
  * `Messenger`: Data is transmitted via Message, which can carry a bundle. Supported types are similar to the above BoardCast.
  * `ContentProvider`: Data is stored in the corresponding URI's data table via ContentValues, and other components needing this data retrieve it via the URI. ContentValues supports types: String, Byte, Short, Integer, Long, Float, Double, Boolean, byte[], etc.
~~~

