---
layout: post
title: >-
  Android Audio Troubleshooting: Exploring Solutions for Audio Issues on Android
  Devices
date: '2022-03-07 14:31:22 +0800'
image: cover/android-audio-share-1.png
tags:
  - Android
  - Debug
categories: DebugAndOptimize
excerpt: >-
  We will explore how to solve audio issues on Android devices. If you are an
  Android developer or interested in audio technology, this share is a
  must-read!
---

## Introduction

In today's share, we will explore the issues that arise when two client devices are connected, 

and audio is recorded on one phone and played on the other. 

Problems such as noise, unstable volume, and sudden changes in volume may occur. 

We will analyze the possible causes of these issues 

and provide solutions. 

If you have similar problems 

or are interested in this topic, 

feel free to refer to this share.

## Analysis Process Share
<div class="c-border-content-title-4">Step 1: Reproduce the Issue</div>
   * Tested on `Samsung SM-G900I Android 6.0.2` and reproduced the results

      - Situation: When background music is playing

     When Client A and Client B successfully connect and start a call (audio is transmitted to the other end) 

     Client A's phone music will have noise, fluctuating volume, and sudden increases in volume

      - Expectation: Background music should not be affected when playing music

<div class="c-border-content-title-4">Step 2: Identify the Problem Direction</div>
   * Initially, try to solve the problem using the following methods
     - Read the app source code and try muting certain code segments to test which part actually affects the issue

       For example: `Mute AudioRecord, AudioTrack`, etc., to narrow down the problem scope

     - `Brainstorm related possibilities`, such as studying `audio focus`:
       It was discovered that

       only one app can hold the audio focus at a time on a phone

       Each app can also set its own focus loss listener

       So if this listener is detected

       each app might lower the volume on its own (this is uncontrollable)

       However, further research will be conducted to see if the current code has any behavior that takes audio focus

     - Surf the internet and find if others have encountered the same problem.

       For example: Refer to online articles
        1. [Issues with Android Audio and Other Apps Overlapping](https://www.itread01.com/content/1541940035.html)
        2. [Android Developer Handling Changes in Audio Output](https://developer.android.com/guide/topics/media-apps/volume-and-earphones)
        3. [Android Audio System](https://www.twblogs.net/a/5d160b34bd9eee1e5c828cb5)
        4. [Android Developer Managing Audio Focus](https://developer.android.com/guide/topics/media-apps/audio-focus)

<div class="c-border-content-title-4">Step 3: Find the Solution</div>
  * To reduce the time to solve the problem and improve efficiency to achieve the expected results,

    we will first go through step two above, think about possible directions and solutions,

    to avoid diving into research from the start,

    only to find out later that the wrong direction was taken,

    indirectly making you less efficient,

    so I usually think about the possibilities first

  * Through the above analysis, we later fortunately discovered several methods
      - By adjusting the `Hardware Abstraction Layer (HAL)`,

        but since we are developing Android applications,

        the possibility of changing `HAL` is very low,

        unless you are a hardware developer wanting to fundamentally change this rule

        Here is a method shared by others online:

        [Debugging Notes --- Real-time Recording Noise Issue](https://blog.csdn.net/kris_fei/article/details/71223117)

- Another way is to modify the AudioSource recording source
  ```Java
   AudioSource.DEFAULT:默認音頻來源
         AudioSource.MIC:麥克風（一般主mic的音源）
         AudioSource.VOICE_UPLINK:電話上行
         AudioSource.VOICE_DOWNLINK:電話下行
         AudioSource.VOICE_CALL:電話、含上下行
         AudioSource.CAMCORDER:相機旁的麥克風音源
         AudioSource.VOICE_RECOGNITION:語音識別 (語音辨識的音源)
         AudioSource.VOICE_COMMUNICATION:網路語音通話  (用於網路通話的音源 如VoIP)
         AudioSource.VOICE_PERFORMANCE 實時處理錄音並播放的音源（通常用於卡拉ok app）
         AudioSource.REMOTE_SUBMIX 音頻子混音的音源
  ```
  Our original source code uses `AudioSource.VOICE_COMMUNICATION`

  After testing, using `AudioSource.MIC` or `AudioSource.VOICE_RECOGNITION` for recording

  In this scenario, there will be no noise or fluctuations in volume

  `Behavior after testing`:

  (This is for my example. If you encounter the same issue, you can refer to this, but it is still recommended to test it yourself)

    - `AudioSource.VOICE_COMMUNICATION` causes volume fluctuations, distortion, and noise. The sound can be received, but the audio received by the Parent sounds delayed

    - `AudioSource.VOICE_PERFORMANCE` does not cause volume fluctuations, but the Parent end cannot receive the sound

    - `AudioSource.REMOTE_SUBMIX` does not cause volume fluctuations, but only system key sounds can be recorded

## Other Knowledge Points

* Later, it was discovered that there are version differences in Audio HAL
Quick overview of the differences in Audio HAL usage across various Android versions:
  <table class="rwd-table">
    <thead>
      <tr>
        <th class="tg-2wgr">Android Version</th>
        <th class="tg-2wgr">Audio HAL Version</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="tg-72zf">Less than Android 8</td>
        <td class="tg-72zf">Old HAL</td>
      </tr>
      <tr>
        <td class="tg-tvi2">Android 8</td>
        <td class="tg-tvi2">2.0</td>
      </tr>
      <tr>
        <td class="tg-72zf">Android 9</td>
        <td class="tg-72zf">4.0</td>
      </tr>
      <tr>
        <td class="tg-tvi2">Android 10</td>
        <td class="tg-tvi2">5.0</td>
      </tr>
      <tr>
        <td class="tg-72zf">Android 11</td>
        <td class="tg-72zf">6.0</td>
      </tr>
      <tr>
        <td class="tg-tvi2">Android 12</td>
        <td class="tg-tvi2">7.0</td>
      </tr>
    </tbody>
  </table>
   × Content is based on official announcements, assuming the vendor has not independently modified the Audio HAL version as listed above

   * Information on the old Audio HAL can be referenced from: [Official Documentation](https://source.android.com/devices/architecture/hal)

   * You can view the [Old Audio HAL Source Code](https://android.googlesource.com/platform/hardware/libhardware/+/master/include/hardware/audio.h)
   

   * [Old Audio.h](hardware/libhardware/include/hardware/audio.h)
   

   * For the new Audio HAL, you can [refer here](https://cs.android.com/android/platform/superproject/+/master:hardware/interfaces/audio/README.md)
     Therefore, there may be slight differences between HAL versions, and you can study the issues and adjust at the application layer to best meet your needs
   

   * Use the command `adb shell lshal` to check the current HIDL version (HIDL was introduced after Android 8.0)
`HIDL = You can think of it as the AIDL of HAL`

## Final Summary
 * For this last issue,
  I made a small change at that time,
  which was changing the audio source
  from `AudioSource.VOICE_COMMUNICATION` to `AudioSource.MIC`
  to achieve the desired effect.

 * Sometimes solving a problem,

  due to experience or the nature of the problem, it may not be immediately apparent,

  like this kind of hardware tuning issue,

  you might need to understand and analyze it step by step,

  in the end, although you only made a one-line code change,

  you can gain a better understanding of the practical know-how

  of what you are developing through the problem-solving process,

  which will help you in the future when encountering other issues or related problems.

  These experiences can become valuable for you in the future.

 * Of course, it still depends on the specific problem

  to decide how much time to spend on solving it,

  and whether it contributes to your development.

  These are things you need to think about yourself.

 * However, I tend to research a bit more

  to avoid being asked how I solved a problem

  and not knowing the answer.

  So, it's an additional form of insurance.

