---
layout: post
title: "[Android][Kotlin] How to Capture Bluetooth HCI Packet Logs on Android Phones"
date: 2021-11-12 16:16:32 +0800
image: cover/ea-android_bluetooth_hci_packet.png
tags: [Android,Bluetooth]
categories: Android教學
---

Today's article will document the research done previously on 

capturing Bluetooth transmission packets 

through methods other than logcat or writing code.

These methods have been introduced by many people online,

but since many of them are almost copy-paste or outdated,

I researched how to actually do it myself.

I will explain it in today's article.

If you want to see how to connect to a GATT server, you can check here

<a href="{{site.baseurl}}/2021/11/12/android-kotlin-bluetooth-gatt-client/">
<img src="/images/cover/android-kotlin-bluetooth-gatt-client.png" alt="Cover" width="25%" >
[Android][Kotlin][2021] Android BLE GATT Connection Implementation Tutorial!</a>

Let's get started:

# Method 1
### Step 1 - Enable Developer Mode
First, you need to enable Developer Mode

<img src="/images/bluetooth/open_developer.png" alt="Cover" width="30%" >

Usually, you enter Developer Mode by tapping the build number several times in the software information section.

However, the method may vary depending on the phone manufacturer.

Some manufacturers require entering specific commands in the dialer,

or using other hidden key combinations.

If it doesn't work, you can search online for how to enter Developer Mode on your phone.

Once successful, you will see Developer Options in the settings.

<img src="/images/bluetooth/developer.png" alt="Cover" width="30%" >

### Step 2 - Enable Bluetooth HCI Snoop Log
Next, go to Developer Options

and enable the Bluetooth HCI Snoop Log option.

<img src="/images/bluetooth/open_hci.png" alt="Cover" width="30%" >

Enabling this option

will allow the system to record Bluetooth HCI snoop logs.

I encountered a problem while researching this.

Older versions of Android store HCI logs in /sdcard or /storage,

but newer versions may store them in different paths,

and in directories without read permissions.

As a result, even if I have the file, I can't view it.

Unless you have root access or adb shell su permissions on the phone,

it's usually difficult to read it easily.

So if your phone stores the file in a directory without read permissions like mine,

you might want to follow the steps below to dump it.

### Step 3 - Install CLI Tool ADB

ADB is a commonly used debugging tool in Android development.

If you have installed Android Studio,

it will be included in the platform tools directory of the installation.

If you want to use it globally,

you can set it in the environment variables.

If you don't usually develop for Android

and just want to test Bluetooth logs, you can download it from the link below.

<a href="https://developer.android.com/studio/releases/platform-tools" class="btn btn-primary" role="button">View Android Platform Tool</a>

### Step 4 - Connect Phone and Confirm USB Debugging Mode
Make sure USB Debugging Mode is enabled in Developer Options

and that the phone is connected to the PC.

You can confirm with the following command:

```
adb devices
```

If you see

a message similar to the one below:

```
List of devices attached
LXXXXXGYPXXCXXXXXX7	device
```

then it is connected.

### Step 5 - Dump Bluetooth HCI Log File

Since the file is stored in a location without read permissions,

you need to use commands to dump it.

First, follow the steps above,

including enabling Bluetooth HCI capture,

and performing Bluetooth-related operations

to generate logs.

Here is a small shell script

<script src="https://gist.github.com/waitzShigoto/8d55a3492f8cafbfd86196ce8f6d610d.js"></script>

You can directly copy it to run in the shell

Or you can copy it line by line to the terminal to execute
The main command used is

```
adb bugreport <FileName>
```
Because the original directory containing the logs cannot be read,
the `bugreport` command is used

It helps you dump

the current system log of the Android phone

and compress it into a zip file in the current directory
So in my script, I first pushd to the /tmp directory

But this is based on personal usage habits

You can modify it yourself

After that, just unzip
```
unzip fetchBugReport.zip
```
The data from your bugreport

will show the log data inside your phone

Then you can `cat` the relevant log files 

or use specific software to read some difficult-to-read files

Usually, the unzipped data is in a folder structure
like
FS/data/log/.../btsnoop_hci.log

The file we are looking for is the Bluetooth log file 

But I have tried different phones

and the directory structure might be different

If you want to write the shell script to execute with one click

you might need to pull this into a variable

to easily fetch the log

For example:
<script src="https://gist.github.com/waitzShigoto/d862a1007ddb5bbef96b28a8a5c3e723.js"></script>
This can be rewritten according to personal needs

Finally, sharing a note

During the research process

I found that not every phone generates Bluetooth logs

So these uncertainties

make the idea of easily capturing packets

less reliable

But knowing this method

won't hurt if you need it in the future

# Method 2 - nRF Sniffer + Wireshark to Capture Bluetooth Packets

### Step 1 - Install Python and pyserial
Enter

```
python --version
```
If a version is displayed

it means Python is already installed globally

<img src="/images/bluetooth/python_version.png" alt="Cover" width="100%" >

If not, you can install it via

Method 1:
<a href="https://www.python.org/downloads/">Python official website</a>

Method 2: Install via brew

<img src="/images/bluetooth/python_install.png" alt="Cover" width="30%" >

Enter the following command in the terminal

to install pyserial

```
pip install pyserial
```
If "Successfully" appears, it means the installation was successful

### Step 2 - Install WireShark   

Go to
<a href="https://www.wireshark.org/download.html">WireShark official website</a>
to download the installer

<img src="/images/bluetooth/wireshark_web.png" alt="Cover" width="50%" >

Choose the version for your OS

and install it like you would any other software

<img src="/images/bluetooth/wireshark_dmg_phtot.png" alt="Cover" width="30%" >

### Step 3 - Install nRF-Sniffer-for-Bluetooth-LE Plugin  

Download via the link
<a href="https://www.nordicsemi.com/Products/Development-tools/nRF-Sniffer-for-Bluetooth-LE/Download#infotabs">nRF-Sniffer-for-Bluetooth-LE</a>

Choose the desired version

The Changelog for the version can be viewed in the dropdown

<img src="/images/bluetooth/nRF_changelog.png" alt="Cover" width="50%" >

I downloaded version 4.1.0

Choose according to your needs

After unzipping the downloaded zip, find the extcap folder

<img src="/images/bluetooth/excap.png" alt="Cover" width="50%" >

And open WireShark's About WireShark

For the mac version, it's within the application name

<img src="/images/bluetooth/wireshark_about.png" alt="Cover" width="30%" >

Find the Global Extcap Path 

<img src="/images/bluetooth/wireshark_folder.png" alt="Cover" width="60%" >

extcap is the folder where Wireshark places plugins

Copy all the files from the nRF-Sniffer-for-Bluetooth-LE extcap folder you downloaded earlier

into this folder

### Step 4 - Use the official hardware to start capturing packets   

The official website mentions that the following hardware is required to capture packets

<img src="/images/bluetooth/nRF_dongle.png" alt="Cover" width="60%" >

Purchase online

or if you already have it, plug it into your computer and open Wireshark

Find the connected source selection

nRF Sniffer for Bluetooth LE COMXX

and you can start capturing

Conclusion

This method of capturing Bluetooth packets has a small cost - it requires additional equipment

So if you happen to have the equipment on hand

you can try this method

