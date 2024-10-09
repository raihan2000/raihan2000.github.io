+++ 
draft = false
date = 2024-09-20T19:30:43+05:30
title = "Booting Kupfer(Arch Linux ARM) with UEFI bootloader on SDM845"
description = ""
slug = ""
authors = []
tags = ["kupfer","Linux Mainline","UEFI","U-Boot","EDK2"]
categories = []
externalLink = ""
series = []
+++

### Assuming You have already installed [kupfer(Arch Linux Arm)](https://kupfer.gitlab.io/)

So, to get started, we need
- To Partition disk
- A Kernel build with UEFI compatible
-  A UEFI compatible bootloader

##### Partitioning
To booting with UEFI bootloader We need
- boot partition (Fat32)
- root partition (Ext4/anything else)
1. Download [parted](https://renegade-project.tech/tools/parted.7z)
2. You can use TWRP or it can be done from kupfer
I will use TWRP for partitioning. Boot into TWRP
extract the downloaded parted on your pc
```
$ adb push parted /sbin
$ adb shell
$ chmod +x /sbin/parted
$ umount /data && umount/sdcard
$ parted /dev/block/sda
```
Type `p` to print partitions on parted and resize userdata partition
```
$ resizepart 17 # input 61GB or as your preferred size
$ mkpart esp fat32 61GB 62GB
$ mkpart arch ext4 62GB 125GB
$ set 18 esp on
```
Type `q` to exit parted
Now reboot to recovery mode again and format some partition
Use adb shell if it's not available then use twrp terminal
```
$ mke2fs -t ext4 /dev/block/by-name/userdata
$ mke2fs -t ext4 /dev/block/by-name/arch
$ mkfs.fat -s1 -F32 /dev/block/by-name/esp
```
##### Install Systemd-boot on Existing Kupfer
After finishing Partitioning, you can use existing kupfer to boot from UEFI or you can build and flash
So, boot into existing kupfer
install the newly build [kernel](https://gitlab.com/kupfer/packages/pkgbuilds/-/merge_requests/138) which has not merge yet
- Change the boot partition to the esp
```
# umount /boot
# mount /dev/disk/by-partlabel/esp /boot
```
- Copy kupfer_boot to mounted fat32 boot partition
```
# mount /dev/disk/by-name/kupfer_boot /mnt
# cp -r /mnt/* /boot
# umount /mnt
```
Now install systemd-boot by running `bootctl install` This will install systemd-boot into esp partition
Now add `arch.conf` on `/boot/loader/entries/arch.conf`
add the loader.conf from [arch wiki](https://wiki.archlinux.org/title/Systemd-boot) 4.2 section
```
title   Arch Linux
linux   /Image
initrd  /initramfs-linux.img
options earlycon console=tty0 console=ttyMSM0, 115200 root=UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx rw
```
put root UUID from `blkid /dev/disk/by-name/kupfer_root`
add `earlycon console=tty0 console=ttyMSM0, 115200` cmd line otherwise you will get black screen
- Change `/etc/fstab`

Edit `/etc/fstab` by using any text editor and change partition type `ext2` to `vfat`
add label on fat32 partition using `fatlabel /dev/disk/by-partlabel/esp "kupfer_boot"`

- Finally Done the changes to boot using UEFI bootloader

Type `reboot-mode bootloader` to boot into bootloader
##### Booting UEFI
To boot UEFI OS we need [uboot](https://git.codelinaro.org/linaro/qcomlt/u-boot/-/releases) or [edk2](https://github.com/edk2-porting/edk2-msm/releases) download it from provided links for your device.
###### For U-Boot
```
$ fastboot flash boot_b u-boot-fajita-boot.img
$ fastboot reboot
```
NOTE: To Boot the Mainline Kernel you need to erase `dtbo` partition for U-Boot if you installed it on new System
###### For EDK2
```
$ fastboot flash boot_b boot-fajita.img
$ fastboot reboot
```
NOTE: If you installed it on new System then no need to erase `dtbo` partition, but if you earlier erase `dtbo`  partition then it will not boot so you need to reflash the vendor `dtbo` partiton again
