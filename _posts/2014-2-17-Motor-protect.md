---
layout: post
title: "一种简单的电机过热保护方法及改进版的初步设计"
author: Shinei
mail: xq.min@rcstech.org
star: 5
layout: post
description: "一种简单的电机过热保护方法及改进版的初步设计"
category: 核心技术
tags: 
  - 电路
  - 程序
---

　　本文介绍一种通过温度开关设计的简单的电机过热报警装置。

<!--more-->
<br>

　　电机是机器人中造价最高的设备之一，由于绝缘技术的不断发展，在电机的设计上既要求增加出力，又要求减小体积，使新型电机的热容量越来越小，过负荷能力越来越弱；再由于机器人运行过程中，有时候要求电机经常运行在频繁的起动、制动、正反转以及变负荷等多种方式，对电机本身要求十分苛刻，造成了电机比较容易堵转、短路而损坏。这些故障，通常通过电机表面发烫而表现出来，通常可以通过手初步测量。

<table class="table table-bordered table-striped table-condensed table-hover">
 <tr>
  <td>
  没什么感觉
  </td>
  <td>
  30度
  </td>
 </tr>
 <tr>
  <td>
  有暖意
  </td>
  <td>
  40度以下
  </td>
 </tr>
 <tr>
  <td>
  明显知道发热
  </td>
  <td>
  45度以下
  </td>
 </tr>
 <tr>
  <td>
  能长久触摸并无困难
  </td>
  <td>
  50度
  </td>
 </tr>
 <tr>
  <td>
  能长久触摸极限或只能触摸10秒
  </td>
  <td>
  55度
  </td>
 </tr>
 <tr>
  <td>
  触摸3秒
  </td>
  <td>
  60度
  </td>
 </tr>
 <tr>
  <td>
  触摸至感觉热后必须马上缩手
  </td>
  <td>
  70度
  </td>
 </tr>
 <tr>
  <td>
  不敢再次触摸
  </td>
  <td>
  70度以上
  </td>
 </tr>
</table>

<br>

　　一般电机的最高温度都不能高于75度到80度，但判断电机是否正常运转主要通过温升，即电机与室温的温度差，当温升超过35度到40度时，说明电机不正常运行。

　　下面介绍一种通过温度开关设计的简单的电机过热报警装置。

##初级版1.0

　　设计思路就是，当温度超过一定值，温度开关动作，触发蜂鸣器报警。

　　选用贴片型温度开关，触点温度70℃，常开型。

![图1]({{site.img_path}}/2014-2-17 fig_1.png)
<br>

　　原理图及说明如下

![图2]({{site.img_path}}/2014-2-17 fig_2.png)
<br>

　　1、采用5V供电，电源开关接通时，电源指示灯亮

　　2、选用NPN型三极管8050作为蜂鸣器的开关，三极管导通时，蜂鸣器响。蜂鸣器电阻R<sub>f</sub>=150Ω。

　　3、温度开关贴在电机表面，XH2.54处接温度开关，当电机温度超过70℃时，温度开关导通。三极管导通，基极电流条件为I<sub>B</sub>>I<sub>B</sub>(饱和)

![图3]({{site.img_path}}/2014-2-17 fig_3.png)
<br>

　　I<sub>B</sub>(饱和)=5/(150*150) =0.2mA 而此时，忽略开关和二极管导通压降，I<sub>B</sub>=5/1100=4.5mA

　　负荷导通条件，也在发光二极管正常工作电流范围。

　　4、有三个接口，可以同时监测三台电机。拨码开关可任意选择某一电机温度监测工作与否。当其中一台电机过热时，相应LED也会亮起，用于分辨哪一台电机出问题。

　　采用装有热水的玻璃杯进行实测可行。

　　1、开关由正常状态贴在装有70~80摄氏度热水杯杯壁，经过约1min闭合，蜂鸣器响（考虑到不像实际电机有升温过程，所以时间花费较多）。

　　2、温度开关由闭合到正常温度状态下回复断开状态花费时间月30s。

##升级版2.0

　　考虑到单纯用温度开关，功能较单一也比较简单，构思一种通过温度传感器实时返回电机表面温度，通过液晶显示。即一个电子测温计。也可以用于其他需要测量温度的地方。

　　整体思路是通过温度传感器将温度变化转化为电量变化，通过AD转换得到数字量，传输至单片机控制模块进行处理，最后处理后的温度数据通过显示模块显示。

　　温度传感器采用铂电阻pt100来测量温度。铂电阻是利用其电阻与温度成一定函数关系而制成的。由于铂电阻特性曲线是非线性的，所以电阻与温度关系由分度表形式给出

<div style="text-align:center">表1 Pt100热电阻分度表
</div>

<table class="table table-bordered table-striped table-condensed table-hover">
 <tr>
  <td>
  <div align=center>
  <table class="table table-bordered table-striped table-condensed table-hover">
   <tr>
    <td>
    <div align=center>
    <table class="table table-bordered table-striped table-condensed table-hover">
     <tr>
      <td>
      温度/℃
      </td>
      <td>
      0
      </td>
      <td>
      1
      </td>
      <td>
      2
      </td>
      <td>
      3
      </td>
      <td>
      4
      </td>
      <td>
      5
      </td>
      <td>
      6
      </td>
      <td>
      7
      </td>
      <td>
      8
      </td>
      <td>
      9
      </td>
     </tr>
     <tr>
      <td>
      电阻值/Ω
      </td>
     </tr>
     <tr>
      <td>
      0<br>
      10<br>
      20<br>
      30<br>
      40
      </td>
      <td>
      100.00<br>
      103.90<br>
      107.79<br>
      111.67<br>
      115.54
      </td>
      <td>
      100.39<br>
      104.29<br>
      108.18<br>
      112.06<br>
      115.93
      </td>
      <td>
      100.78<br>
      104.68<br>
      108.57<br>
      112.45<br>
      116.31
      </td>
      <td>
      101.17<br>
      105.07<br>
      108.96<br>
      112.83<br>
      116.70
      </td>
      <td>
      101.56<br>
      105.46<br>
      109.35<br>
      113.22<br>
      117.08
      </td>
      <td>
      101.95<br>
      105.85<br>
      109.73<br>
      113.61<br>
      117.47
      </td>
      <td>
      102.34<br>
      106.24<br>
      110.12<br>
      11+4.00<br>
      117.86
      </td>
      <td>
      102.73<br>
      106.63<br>
      110.51<br>
      114.38<br>
      118.24
      </td>
      <td>
      103.12<br>
      107.02<br>
      110.90<br>
      114.77<br>
      118.63
      </td>
      <td>
      103.51<br>
      107.40<br>
      111.29<br>
      115.15<br>
      119.01
      </td>
     </tr>
     <tr>
      <td>
      50<br>
      60<br>
      70<br>
      80<br>
      90
      </td>
      <td>
      119.40<br>
      123.24<br>
      127.08<br>
      130.90<br>
      134.71
      </td>
      <td>
      119.78<br>
      123.63<br>
      127.46<br>
      131.28<br>
      135.09
      </td>
      <td>
      120.17<br>
      124.01<br>
      127.84<br>
      131.66<br>
      135.47
      </td>
      <td>
      120.55<br>
      124.39<br>
      128.22<br>
      132.04<br>
      135.85
      </td>
      <td>
      120.94<br>
      124.78<br>
      128.61<br>
      132.42<br>
      136.23
      </td>
      <td>
      121.32<br>
      125.16<br>
      128.99<br>
      132.80<br>
      136.61
      </td>
      <td>
      121.71<br>
      125.54<br>
      129.37<br>
      133.18<br>
      136.99
      </td>
      <td>
      122.09<br>
      125.93<br>
      129.75<br>
      133.57<br>
      137.37
      </td>
      <td>
      122.47<br>
      126.31<br>
      130.13<br>
      133.95<br>
      137.75
      </td>
      <td>
      122.86<br>
      126.69<br>
      130.52<br>
      134.33<br>
      138.13
      </td>
     </tr>
    </table>
    </div>
    
    </td>
   </tr>
  </table>
  </div>
  
  </td>
 </tr>
</table>


　　在以上温度范围内，电阻和温度的关系近似满足：

　　R=100+0.4T

　　带入电路图求得温度传感器两端电压与温度之间的关系方程式（也可以通过运放放大传感器两端电压值，将放大后的电压值作为ADC转换的输入，该方法可增加测量精度。），由pt100热敏电阻和AD转换芯片ADC0809组成信号采集电路，将变化的电压信号通过ADC转换成数字信号。将ADC采集到的电压值输入单片机STM8,单片机根据上面求得的电压-温度的对应关系进行转换处理，计算出相应的温度值。最后将温度值通过LED数码管显示出来。

　　该方案的硬件流程图如下

![图4]({{site.img_path}}/2014-2-17 fig_4.png)
<br>

　　由于条件和时间关系，该方案未能付诸实践。希望在日后的工作中可以做出实物。该方案不仅可以用于电机温度检测，在许多温控场合都可以应用。