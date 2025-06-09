---
layout: post
title: "Android Audio 適応問題の共有：Android デバイスのオーディオ問題を解決する方法を探る"
date: 2022-03-07 14:31:22 +0800
image: cover/android-audio-share-1.png
tags: [Android,Debug]
categories: Debug探討
excerpt: "Android デバイスのオーディオ問題を解決する方法を探ります。Android 開発者やオーディオ技術に興味がある方は、この共有を見逃せません！"
---

## 前書き

今日の共有では、二つのクライアントデバイスが接続される際に、

携帯電話で録音してもう一方に再生する際に、

一方の音声に問題が発生する場合について探ります。

例えば、ノイズ、音量の不安定さ、突然の変化などです。

これらの問題の可能性のある原因を分析し、

解決策を提供します。

同様の問題を抱えている方、

または興味がある方は、

この共有を参考にしてください。

## 分析プロセスの共有
<div class="c-border-content-title-4">第一歩：問題の再現</div>
   * `Samsnug SM-G900I Android 6.0.2` でテストし、再現した結果

      - 状況: 背景で音楽が再生されている時

     Clinet A と Client B が接続に成功し、通話を行う（録音をもう一方に送信）際に、

     Clinet A の携帯電話の音楽にノイズが入り、音量が不安定になり、突然大きくなるなどの問題が発生

      - 期待される結果: 背景で音楽が再生されている時、音楽の再生に影響がないこと

<div class="c-border-content-title-4">第二歩：問題の方向性を探る</div>
   * 初期の方向性として以下の方法で問題解決を試みる
     - アプリのソースコードを読み、特定のコードをミュートしてどの部分が実際に影響を与えるかをテスト

       例えば：`AudioRecord、AudioTrack`をミュートするなどして、問題の範囲を絞る

     - `関連する可能性を考える`、例えば `オーディオフォーカス` を研究する：
       その特性を発見

       携帯電話は一度に一つのアプリしかオーディオフォーカスを取得できない

       各アプリはフォーカス喪失のリスナーを設定できる

       したがって、このリスナーを検出すると、

       各アプリが自動的に音量を下げる可能性がある（これは制御不能）

       ただし、現在のコードにオーディオフォーカスを取得する動作があるかどうかを再度調査する

     - インターネットをサーフィンして、他の人が同じ問題を経験したかどうかを調べる

       例えば：ネット記事を参考にする
        1. [Androidオーディオと他のアプリの重音の問題](https://www.itread01.com/content/1541940035.html)
        2. [Android Developer オーディオ出力の変化を処理する](https://developer.android.com/guide/topics/media-apps/volume-and-earphones)
        3. [Android オーディオシステム](https://www.twblogs.net/a/5d160b34bd9eee1e5c828cb5)
        4. [Android Developer オーディオフォーカスを管理する](https://developer.android.com/guide/topics/media-apps/audio-focus)

<div class="c-border-content-title-4">第三歩：問題の解決策を探る</div>
  * 問題解決の時間を短縮し、効率を高めて期待される結果を達成するために、

    まず上記の第二歩を経て、可能な方向性と解決策を考える

    最初から一つの方向に集中して研究し、

    最後に間違った方向を見つけることを避けるため

    間接的に効率が低下することを避けるため

    可能性を考える習慣を持つ

  * 上記の分析を通じて、いくつかの方法を発見
      - `ハードウェア抽象層（HAL）`を調整することで、

        ただし、私たちはAndroidアプリケーション層を開発しているため、

        `HAL`を変更する可能性は非常に低い

        ハードウェア開発者でない限り、このルールを根本的に変更することはできない

        ここでは他の人が共有した変更方法：

        [デバッグノート --- リアルタイム録音にノイズが発生する問題](https://blog.csdn.net/kris_fei/article/details/71223117)

      - もう一つの方法は、AudioSourceの入力元を変更することです。
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
        元のソースコードでは `AudioSource.VOICE_COMMUNICATION` を使用しています。

        実際に `AudioSource.MIC` または `AudioSource.VOICE_RECOGNITION` を使用して録音すると、

        この状況では雑音や音量の変動が発生しません。

        `試行後の行動記録`：

        （これは私の例です。同じ問題に直面した場合、参考にしてください。ただし、自分でテストすることをお勧めします。）

          - `AudioSource.VOICE_COMMUNICATION` は音量の変動、音割れ、雑音を引き起こし、音は拾えますが、親側で受け取る音声に遅延があるように聞こえます。

          - `AudioSource.VOICE_PERFORMANCE` は音量の変動はありませんが、親側で音が受信されません。

          - `AudioSource.REMOTE_SUBMIX` は音量の変動はありませんが、システムのキー音しか拾いません。

## その他の知識点記録

* 後にAudio HALにバージョン差異があることが判明しました。
各AndroidバージョンのAudio HAL使用差異の簡単な説明：
  <table class="rwd-table">
    <thead>
      <tr>
        <th class="tg-2wgr">Androidバージョン</th>
        <th class="tg-2wgr">Audio HALバージョン</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="tg-72zf">Android 8未満</td>
        <td class="tg-72zf">旧HAL</td>
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
   × 内容は公式発表に基づいており、サプライヤーがAudio HALを独自に変更していない場合のバージョンは上記の通りです。

   * 旧版Audio HALの情報は[公式ドキュメント](https://source.android.com/devices/architecture/hal)を参照してください。

   * [旧版Audio HALのソースコード](https://android.googlesource.com/platform/hardware/libhardware/+/master/include/hardware/audio.h)を確認できます。

   * [旧版Audio.h](hardware/libhardware/include/hardware/audio.h)

   * 新版Audio HALについては[こちら](https://cs.android.com/android/platform/superproject/+/master:hardware/interfaces/audio/README.md)を参照してください。
     各バージョンのHAL間には若干の差異がある可能性があるため、問題に応じて研究し、アプリケーション層で最適な形に調整することができます。

   * コマンド `adb shell lshal` を使用すると、現在のHIDLのバージョンを確認できます（Android 8.0以降にHIDLが追加されました）。
`HIDL = HALのAIDLのようなものと考えてください。`

## 終場総括
 * 最後のこの問題
  私はその時に小さな変更を加えました
  それは録音の
  `AudioSource.VOICE_COMMUNICATION`を`AudioSource.MIC`に変更することです
  これで期待通りの効果が得られました

 * 時には問題を解決するために、

  経験や問題が一目でわからないことがあります。

  このようなハードウェアの調整の問題では、

  一つ一つ理解し分析する必要があります。

  最後には一行のコード変更だけで済むかもしれませんが、

  問題解決の過程で

  開発しているものの実際のノウハウを

  より深く理解することができます。

  これが将来他の問題に直面した時や関連する問題に役立ちます。

  これらは将来の経験となります。

 * もちろん、問題によって

  解決にどれだけの時間をかけるかを決める必要があります。

  それがあなたの発展に役立つかどうかも

  自分で考える必要があります。

 * しかし、私は多く研究する習慣があります。

  問題を解決した時に質問されても

  自分がどう解決したかを知らないことがないようにするためです。

  これは一種の保険行動とも言えます。

