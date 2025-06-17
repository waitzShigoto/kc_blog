---
layout: post
title: >-
  Implementation Guide: How to Successfully Integrate Huawei HMS Core 4.0 SDK in
  an Android App
date: '2020-09-15 10:06:32 +0800'
image: cover/android-hms-sdk-1.png
permalink: /android/huawei_map
tags:
  - Android
categories: AndroidDev
---

<h1 class="c-border-main-title">Introduction</h1>
* In past projects, there have been

requests from clients to integrate the Huawei SDK.

I happened to have made some notes before,

so I organized them now

to share with everyone!

Overall development

is actually quite similar to Google GMS XDD 

<h1 class="c-border-main-title">Integrating HMS</h1>

<div class="c-border-content-title-1">Step 1: Register an Account</div>
* First, you need to go to the [Huawei Developer Console](https://developer.huawei.com/consumer/cn) to register and join as a verified member.

  For detailed instructions, refer to [Account Registration and Verification](https://developer.huawei.com/consumer/cn/devservice/doc/20300).

<div class="c-border-content-title-1">Step 2: Create an Application in the Console</div>
 * This step is quite similar to other platforms.

 You can create it through the user interface.

 ![1.png](/images/huawei/1.png)

 Next, you need to enable the API permissions you want to use.

 This is also done in the console.

 ![2.png](/images/huawei/2.png)

<div class="c-border-content-title-1">Step 3: Generate a Signature</div>
 * This step is quite similar to Google.

 You can use the tool within AS to generate it directly.

 ![3.png](/images/huawei/3.png)

 After generating, use the command

 `keytool -list -v -keystore <keystore-file>`

 keystore-file: Here you need to input the certificate path.

 Then paste the generated Sha256 hash into the configuration of the app you just created in the Huawei console.

<div class="c-border-content-title-1">Step 4: Configure the Signature</div>
  * After generating the signature,

  you can download `agconnect-services.json` from the Huawei console.

  Then start adding it to your project.

  * This image shows the configuration of the project at that time.

  Because the product requirement was

  to be able to build different vendor configurations when building the project,

  and also to support Google services if someone has installed GMS on their Huawei phone,

  the configuration is as shown below.

  ![4.png](/images/huawei/4.png)

  Of course, during actual project development,

  it is better to communicate with your team members.

  * Because many function names in `HMS` are the `same names` as in `GMS` XD,

  it is better to `distinguish` them clearly during development.

  Whether starting from `configuration` or `code separation`,

  otherwise, it will be very troublesome to maintain later.

  If the coupling is too high and difficult to separate, then...

<div class="c-border-content-title-1">Step 5: Add Project Configuration</div>
  * Next, add it to the Android project.

    Configure `maven {url 'https://developer.huawei.com/repo/'}` in the build gradle.
    <script src="https://gist.github.com/waitzShigoto/1ca47854f0a1eb3c94565c3512725050.js"></script>
    

  * Then import the required HMS kit into the project.

    Here, taking HMS map as an example.

    <script src="https://gist.github.com/waitzShigoto/631f00b79f69c96bd2a226c58eff5199.js"></script>
    `Now you can officially start development!`

<div class="c-border-content-title-4">Sharing Small Differences Encountered While Developing for Huawei</div>

 * Small differences between Hms and Gms maps

   As mentioned earlier, the function names of HMS and GMS are extremely similar

   So if you've used GMS before, you should be able to get the hang of it quickly (？

   However, I happened to be `luckier`

   During development, I encountered

   some slight differences

   <div align="center">
     <img src="/images/huawei/6.png" alt="Cover" width="30%" >
     <img src="/images/huawei/7.png" alt="Cover" width="30%" >
   </div>
   When setting the polyline, the thickness set by the same constant was different

   For example, `googlePolylineOption.width(5)` vs `huaweiPolylineOption.width(5)`
   The actual effect was different

   ### So not all logic can be directly applied XDD It's best to check!!

   Finally, it had to be changed like this to be the same

   ![5.png](/images/huawei/5.png)

 * Small differences in `push notifications`

   Mainly the `subclass inheritance` is different

   Other than that, the usage is the same

   But I'm sharing this because

   when developing other Huawei features before

   the method and class names were almost identical XD

   ![8.png](/images/huawei/8.png)

<h1 class="c-border-main-title">To Summarize</h1>

 * Apart from the package names being slightly different

 and a few functions being slightly different

 overall, the usage of the SDKs from both companies is not very different

