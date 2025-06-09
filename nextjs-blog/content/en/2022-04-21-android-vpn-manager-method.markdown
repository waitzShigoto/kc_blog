---
layout: post
title: "[Android Development Insights] Build Your VPN App: Insights on Developing with Android VpnManager"
date: 2022-04-21 18:09:28 +0800
image: cover/android-vpn-app-develop-1.png
tags: [Android,Debug]
categories: Android教學
excerpt: "Here is a problem I encountered while developing for Android: how to implement a VPN solution within an application. In this article, I will share my research notes and related solutions."

---

## Introduction

<p>
  In this article,

  we will share insights on developing your own researched Android VPN application,

  whether you are a beginner or an experienced developer,

  these notes will provide practical guidance,

  and we hope they will be helpful to you.

</p>

## Preliminary Considerations
<div class="c-border-content-title-4">Thinking about how to implement it, so I first researched the native VPN encryption connection methods</div>

  * Here are the VPN connection encryption methods available in the native Android AOSP source code:
    - PPTP  
    - L2TP/IPSec PSK
    - IPSec Xauth Psk
    - IPSec IKEv2 PSK
    - L2TP/IPSec RSA
    - IPSec Xauth RSA
    - IPSec Hybrid RSA
    - IPSec IKEv2 RSA

  <div class="c-border-content-title-4">If there is a requirement to implement VPN connection encryption mode functionality, then:</div>
  - The official native methods provided are: <a herf="https://developer.android.com/reference/android/net/VpnManager">VpnManager,</a>
  <a herf="https://developer.android.com/reference/android/net/VpnService">VpnService</a>
    After my research, I found:
      - If using `VpnManager`, it only provides some VPN connection modes and is available only in higher versions (API 30 and above)
      - If using `VpnService`, it only provides basic settings and does not open the connection mode interface for upper-layer use

  - `VpnManager` requires API 30 to use and only opens some protocols
      - Additionally, I saw on the Google issue tracker website,

   other developers have similar issues and `asked the official if they could open the lower-layer connection modes` for upper-layer use,

   the official personnel replied that it might be opened in the future: [Click here to view](https://issuetracker.google.com/issues/203461112)

   indicating that others have similar needs, but currently, the official has no development plans

 *  Previously mentioned that the official only supports some encryption methods, others have to be implemented by yourself or integrated with third-party libraries!

    This picture lists the three encryption methods supported by the official: IPSec IKEv2 PSK, IPSec IKEv2 RSA, IPSec User Pass.

    ![vpn_limit.png](/images/others/vpn_limit.png)

## Reference for VPN Implementation Ideas

* If using the `officially provided` methods to implement, you can:
     - `'Connection Type'`: Set the `PlatformVpnProfile` through the [VpnManager](https://developer.android.com/reference/android/net/VpnManager) (API level 30 and above) method [provisionVpnProfile](https://developer.android.com/reference/android/net/VpnManager#provisionVpnProfile(android.net.PlatformVpnProfile))
         - The official defines a new class [PlatformVpnProfile](https://developer.android.com/reference/android/net/PlatformVpnProfile)
           - If you look at it with AOSP, the official provides this class for you to `set some connection protocols`
             Finally, when it reaches the lower-layer Service, it will help you convert it into the VpnProfile class used in the Service
           - That is, VpnManager's `line 335`: [provisionVpnProfile(@NonNull PlatformVpnProfile profile)](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/net/VpnManager.java;l=339;drc=03ba62861cd60978ba51c144071512b4aac291b7)
        Finally, it uses toVpnProfile() to help you convert `PlatformVpnProfile` to `VpnProfile`

- Among them, [Ikev2VpnProfile.Builder](https://developer.android.com/reference/android/net/Ikev2VpnProfile.Builder#setRequiresInternetValidation(boolean)) can set Ikev2 related connection settings. This class actually implements `PlatformVpnProfile` allowing you to set the open protocol mode.

- `'VPN related settings'`: Through [VpnService](https://developer.android.com/reference/android/net/VpnService), add `VpnService.Builder()` when creating a local tunnel.
  - Official [VpnService architecture diagram](https://developer.android.com/guide/topics/connectivity/vpn#service)
    - This method sets the tunnel during connection, and the official only provides the method as shown in the example below for developers to use.
    - Although AOSP provides related protocol connections, it is `not yet open` for upper-layer use. Therefore, if you need to connect using related protocols, you need to develop it yourself.
    - Example:
    ```kotlin
    /***  Android level 14 up ***/
    val builder = VpnService.Builder()
    val localTunnel = builder
                      .setSession('VPN name')  
                      .addAddress('server', 'prefix length')
                      .addRoute('forwarding route', 'prefix length')
                      .addDnsServer('DNS server')
                      .addSearchDomain('DNS search domain')
                      .establish()
    ```

## Implementing a VPN app through other or third-party solutions
<div class="c-border-content-title-4">If the methods provided by the official cannot meet the needs, you can consider:</div>

- AnyConnect: A third-party VPN provider. Currently, third-party vendors' VPN services are seen.
  - [AnyConnect official documentation](https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect410/release/notes/release-notes-android-anyconnect-4-10-.html) mentions that it provides protocols such as TLS, DTLS, IPsec IKEv2, etc.
  - Another [AnyConnect document](https://www.cisco.com/c/en/us/products/collateral/security/anyconnect-secure-mobility-client/data_sheet_c78-527494.html) mentions that to use IPsec IKEv2 connection, you need [Cisco Adaptive Security Appliance](https://www.cisco.com/c/en/us/products/security/adaptive-security-appliance-asa-software/index.html#~features) 8.4 or above.
  - If you choose this option, you need to [contact the vendor](https://www.cisco.com/c/en/us/products/security/anyconnect-secure-mobility-client/index.html#~deployment) to know how to develop and the details.
  - [This table](https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect40/feature/guide/AnyConnect_Mobile_Platforms_and_Features_Guide.html) at the bottom explains the tunneling supported by each platform.
  - [AnyConnect 4.10 release note](https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect410/release/notes/release-notes-android-anyconnect-4-10-.html) mentions some compatibility issues on Android versions:
    - For example, Android 5.0, 6.0 power-saving mode conflicts with the service.
    - Split DNS cannot operate on Android 4.4 or Samsung 5.x Android devices.
- `(For reference)` There is a solution seen online to set VpnProfile by directly using methods within the framework through reflection: [Create VPN profile on Android](https://stackoverflow.com/questions/9718289/create-vpn-profile-on-android)
  - However, this method has been fixed in Android 9.0 and above, so it is speculated that some earlier phones may use this method (if the target device is before this, it can still be considered).
  - [Fix announcement](https://developer.android.com/distribute/best-practices/develop/restrictions-non-sdk-interfaces)
- `(For reference)` Third-party [openVpn](https://github.com/schwabe/ics-openvpn) provides Android open source.
  - [Documentation](https://community.openvpn.net/openvpn/wiki/Openvpn23ManPage) mentions support for `SSL/TLS` protocol `(only supports this protocol)`.
  - Method to add openVpn to Android project: [Click here](https://www.youtube.com/watch?v=gBMhaCujwrM)
  - [ics-openvpn FAQ](https://ics-openvpn.blinkt.de/FAQ.html) also mentions issues with Samsung 5.0 phones.

## Other Knowledge Points

- When opening a custom VpnService through an app, in Android 8.0 and above, service operation adds [background execution limits](https://developer.android.com/about/versions/oreo/background?hl=zh-cn#services)
   

- Tracking [android-10.0.0_r1 VpnService.java in aosp](https://cs.android.com/android/platform/superproject/+/android-10.0.0_r1:frameworks/base/core/java/android/net/VpnService.java;bpv=1;bpt=1) its `line:176~179` uses
   [IConnectivityManager.aidl](https://cs.android.com/android/platform/superproject/+/android-10.0.0_r10:frameworks/base/core/java/android/net/IConnectivityManager.aidl;bpv=0;bpt=0), but currently, there is no trace of the implementation of aidl at the framework level,
   so it is speculated that it might be placed in something like a binder. To understand how it is implemented, further research into the underlying code is needed.
   

- Tracking [VpnService.Java in Android 12 aosp](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/net/VpnService.java;bpv=1;bpt=1;l=178), its `line:178~181` uses aidl changed to [IVpnManager.aidl](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/net/IVpnManager.aidl),
   there is another file in the source code called [VpnManagerService.Java](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/services/core/java/com/android/server/VpnManagerService.java;l=33;bpv=0;bpt=1)

   In `line:293` the `provisionVpnProfile(VpnProfile profile,...)`
   this method requires providing a variable [VpnProfile](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/com/android/internal/net/VpnProfile.java;l=61;bpv=0;bpt=0?q=VpnProfile&ss=android%2Fplatform%2Fsuperproject)

   Looking into VpnProfile's `line:97` reveals its default connection scheme is: `public int type = TYPE_PPTP`  

   And the connection modes that can be set in VpnProfile are:

   ![vpn_aosp_type.png](/images/others/vpn_aosp_type.png)

   However, these connection modes are currently only supported within aosp

   And because they are not open, they cannot be directly used in the app

   In summary

   Firstly, non-developers can only modify it from the phone settings

   Secondly, developers can only implement it by working from aosp
