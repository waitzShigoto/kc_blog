---
layout: post
title: "Accelerate Your Understanding of WebRtc and Mqtt: Glossary Notes Sharing"
date: 2022-02-14 13:50:12 +0800
image: cover/mqtt-noun-1.png
tags: [Coding]
categories: Others
excerpt: "This article organizes glossary notes for WebRtc and Mqtt, allowing you to gain a deeper understanding of the application and principles of these two technologies. If you are interested in WebRtc and Mqtt, this article is a must-read!"
---

## Introduction
  - Due to `Android work requirements`,

I needed to integrate Mqtt and WebRtc,

so I roughly understood some terms,

but this part was mainly completed by the backend,

as an Android engineer, I just need to understand a bit,

and record it for quick recall in the future.

## MQTT Notes
  - <a>QoS (Quality of Service)</a>: The quality of message delivery service, with three modes
    * <a>At most once</a>: At most once, prone to packet loss, suitable for environments where it doesn't matter if data is received, as the next publish will be pushed quickly

    * <a>At least once</a>: At least once, ensures the packet will be delivered, but may receive duplicate packets

    * <a>Exactly once</a>: Exactly once, ensures the packet will be delivered only once, but if duplicate packets are received or packets are lost, error handling is required, consuming more resources

    * <a>MQTT Header</a>: Fixed 2 bytes, consumes less

    * <a>MQTT Session</a>: When an MQTT Client connects to the server, the 'Clean Session' flag can control its state

      a. <a>'Clean Session' is 0</a>: Persistent session, the session remains until timeout when the client disconnects

      b. <a>'Clean Session' is 1</a>: Transient session, the session is destroyed when the client disconnects

    * <a>MQTT CONNECT Keep Alive</a>: When MQTT connects, it carries a Keep Alive byte to represent the keep alive time. When there is no transmission response, PINGREQ can be sent to maintain the state, and the server responds with PINGRESP.

     When Keep alive times out, the connection is closed (usually keep alive timeout * 1.5 is the timeout time, mainly depending on server settings).
    * <a>LWT (last will and testament)</a>: A concept of a will, when the MQTT client disconnects abnormally, such as disconnecting without calling disconnect, the server will publish the will message.
    * <a>MQTT retained message</a>: Can be set through the RETAIN flag, the retained message will exist in the broker and will be sent to those who subscribe to this topic, and only one retained message can exist per topic.

## WebRtc Related
  - Understand the following terms:
      * <a>Signaling</a>: Used to exchange metadata or transmit information between devices, commonly used like SDP. According to network data, WebRTC 1.0 retains the flexibility of Signaling without specifically enforcing its definition ([refer to this article](https://ithelp.ithome.com.tw/articles/10267612))

      * <a>SDP (Session Description Protocol)</a>: A data specification carried by the Signaling server during communication, specifying certain letters to represent certain information, such as v for protocol version, s for session name, p for phone number, etc.

      * <a>STUN (Session Traversal Utilities for NAT)</a>: A network protocol that supports NAT, through which available data can be obtained ([refer to this article](https://www.netadmin.com.tw/netadmin/zh-tw/technology/D790BCA2F14F46B4A02EAAF008577963))

例如：取得公有IP(實際上真實IP，非NAT下私有IP)、port
* <a> TURN (Traversal Using Relay NAT) </a> : A network protocol that supports NAT, characterized by:

   a. Data transmission is through the server, consuming server resources

   b. Ensures all calls can operate in the entire environment

   c. Provides fallback if an error occurs during communication

* <a> ICE (Interactive Connectivity Establishment) </a> : A standard for STUN & TURN communication
   Features: Attempts to find the optimal distance for communication between servers
