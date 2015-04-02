---
layout: post
title: "红外知识总结"
author: zyy
mail: yy.zhang@rcstech.org
star: 4
layout: post
description: "红外知识总结"
category: 经验总结
tags: 
  - 电路
  - 红外
  - 对管
---

本文主要总结和分析了红外的一些基本原理和应用。

<!--more-->

##目录：
<br>
[一、器件概述](#一、器件概述)

　　[1.1、红外发射管](#1.1)

　　[1.2、接收头](#1.2)

　　[1.3、接收管](#1.3)

[二、应用](#二、应用)

[三、光传感器](#三、光传感器)

　　[3.1、光检测器](#3.1)

　　[3.2、激光对管](#3.2)

　　[3.3、红外对管](#3.3)

　　[3.4、黑盒子红外](#3.4)

<span id="一、器件概述"></span>

　　[3.5、反射式红外传感器](#3.5)

[四、知识补充](#四、知识补充)
<br>
<br>

<span id="1.1"></span>

##一、器件概述
<br>

###1.1、红外发射管
<br>

　属于二极管类，实验室用的是5mm的小功率发射管，正向电压1.1-1.5v左右，电流20mA左右。红外线发射管的发射强度因发射方向而异。当方向角度为零度时，其放射强度定义为100％，当方向角度越大时，其放射强度相对的减少，红外线发射管的辐射强度，依光轴上的距离而变，亦随受光元件的不同而变。一般红外发射管的发射角至少在15度至30度，在外面用热缩管包着可以适当减小发散角。其控制的距离与发射功率成正比。为了增加红外线的控制距离，红外发射管工作于脉冲状态，因为脉动光（调制光）的有效传送距离与脉冲的峰值电流成正比，只需尽量提高峰值Ip，就能增加红外光的发射距离。提高Ip 的方法，是减小脉冲占空比，即压缩脉冲的宽度T。一般其使用频在300KHz以下。

<div style="text-align:center;"><span><a target="_blank" href="XXXX"><img src="{{site.img_path}}/2015-03-30-IR-Emitter-Led_1.png"></a></span><span><a target="_blank" href="XXXX"><img src="{{site.img_path}}/2015-03-30-IR-Emitter-Led-attention.png"></a></span></div>

<span id="1.2"></span>

　红外接收分为接收头和接受管2种，一个是3引脚，一个是LED型2引脚，注意，接收头和接收管是2种不同的器件。

###1.2、接收头
<br>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-IRM_1.png" style="width:600px">
</div>
<br>

　红外接收头是集接收，放大，解调于一体的器件，它内部IC就已经完成了解调，输出的就是数字信号，但要注意，一般接收头载波频率是38KHZ，当然也有56KHZ的等等，不同型号、厂家的会有一点不一样。之所以要加载波频率，是为了减小光干扰，防止其他强光源照射干扰而导致误触发，所以38KHZ是它们之间的一个通信协议。接收头接受的是调制信号，输出是解调好的信号。一开始我不知道使用时需要用到载波频率，而且当时也没有查到接收头的DATASHEET，当时就直接用红外发射管照射接收管，接收管没有任何的电平变化，反复试了几次，浪费了很多时间，所以说搞清楚器件使用方式是很重要的。
　我们实验室用的是标准38KHZ的，型号为IRM2638，峰值波长940nm，所以相应的红外发射管就应该选择波长为940nm、5mm大小的。实际测试输出：无检测到时，输出5V高电平，有检测到时，输出的是一定占空比的方波（这是自己设定的）。 
　载波原理：

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-signal-carrier.png" style="width:600px">
</div>
<br>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-instruction.png" style="width:600px">
</div>
<br>

　内部原理图：里面自带放大电路，还有一个振荡器，三极管上拉输出（这个很重要，有的是开集输出，输出高电平时要接上拉电阻）。

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-IRM-internal.png" style="width:600px">
</div>
<br>

　典型电路：

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-IRM-application-circuit.png" style="width:600px">
</div>
<br>

　这种器件的datasheet是后来无意间找到的，搜索关键词是INFRARED RECEIVER MODULE。以及提供一个很全的datasheet 搜索网站：[http://www.alldatasheetcn.com/](http://www.alldatasheetcn.com/)
　一些相关红外接收模块的DATASHEET：

<span id="1.3"></span>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-IRM_2.png" style="width:600px">
</div>
<br>

　上面几种型号大同小异，对比后发现主要是载波频率不同。

###1.3、接收管
<br>

　红外线接收管是将红外线光信号变成电信号的半导体器件，它的核心部件是一个特殊材料的PN结，和普通二极管相比，在结构上采取了大的改变，红外线接收管为了更多更大面积的接收入，电流则随之增大，红外接收管分两种，一种是二极管，一种是三极管。输出的是模拟信号。如果我们想得到随检测距离改变的电压值，或者因返回光强不同的电压值，就可以考虑用接收管，输出随着接收信号增强而电流增大，其负载电阻的电压就随之增大。不过，它的输出在边缘处有点非线性。
　下图是红外测距原理图，因为用红外来测距不怎么好，就不再考虑这个了。

<div>
<ul style="list-style:none;margin:0px; ">
<li style="float:left;"><a><img src="{{site.img_path}}/2015-03-30-reception-diode.png" /></a></li>
<li style="float:left;"><a><img src="{{site.img_path}}/2015-03-30-IR-distance_1.png" /></a></li>
</ul>
</div>
<br>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-IR-distance_2.png" style="width:600px">
</div>
<br>

<span id="二、应用"></span>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-IR-distance_3.png" style="width:600px">
</div>
<br>

##二、应用
<br>

1、这是上届的版本，单片机STM8S003输出固定频率波形给发射管，发射管两端一个输入一定频率的电压，一个加38KHZ载波。使用滑动变阻器调节电流大小从而改变检测距离，但在使用时发现隔一段时间阻值变了，而且变阻器很难调节到需要的大小。

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-IR-sensor_1.png" style="width:600px">
</div>
<br>

2、这是改进的第一代，为了解决变阻器的问题，把硬件调节改为软件调节，用按键通过程序来改变单片机输出占空比，输出会更稳定些。指示灯的亮度可以反映发射管的亮度（因为红外不可见）。

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-IR-sensor_2.png" style="width:600px">
</div>
<br>

3、第二代，加了三极管驱动和防反接，三极管的开启频率是大于100HZ的，所以没问题，按键改变的是100HZ信号的占空比，其单片机程序原理和上一代也做了改变。PCB画成长条形，用最大的那种热缩管包着PCB板隔离外界。

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-IR-sensor_3.png" style="width:600px">
</div>
<br>

<span id="三、光传感器"></span>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-hw-PCB.png" style="width:600px">
</div>
<br>

<span id="3.1"></span>

##三、光传感器
<br>

###3.1、光检测器
<br>

　原理和红外接收器基本一样，区别在于没有信号调制，检测的条件是照射光强的大小，任何的光，只要有一定的光照强度，达到其阈值，就可以检测到，透明塑料外壳，3脚。不同型号的区别在于它的光照裕度。
　现在用的是IS486/485（IS48X系列都可）——￥5，内带施密特触发电路，整形波形。使用时直接接地和电源。PIC0103SD（PIC-X部分）——￥6，内带施密特触发电路；三极管开集输出，使用时要接上拉电阻。

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-IS485.png" style="width:600px">
</div>
<br>

<span id="3.2"></span>

　这些系列的种类很多，对比了它们的datasheet，发现那些系列中各自器件的区别是光照裕度不同（如IS481和IS486），或者只是逻辑相反（如IS486和IS485），我们只用作检测有无，故在选型的时候倒是不需要考虑太多。

###3.2、激光对管
<br>

　详见郝润姿的博文[http://www.rcstech.org/Photoelectric-detection-sensor/](http://www.rcstech.org/Photoelectric-detection-sensor/)

<span id="3.3"></span>

　一种改进的精度更高的定位传感器，使用激光发射，光电检测器IS486接收。现已代替红外对管，用了都说好。另外可以考虑在裸露的板子外面加上外壳，使安装更方便。

###3.3、红外对管
<br>

<div style="text-align:center;"><span><a target="_blank" href="XXXX"><img src="{{site.img_path}}/2015-03-30-Infrared-on-the-tube_1.png"></a></span><span><a target="_blank" href="XXXX"><img src="{{site.img_path}}/2015-03-30-Infrared-on-the-tube‘s-datasheet.png"></a></span></div>

　其内部结构十分简单，发射部分是电阻串联一个发射管，接受端也是光电二极管串联电阻。最值钱的就是外壳了，机械固定很方便。

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-Infrared-on-the-tube_2.png" style="width:600px">
</div>
<br>

　激光对管VS红外对管

<table class="table table-bordered table-striped table-condensed table-hover">
<tr>
    <th>对管</th>
    <th>精确度</th>
    <th>安装</th>
    <th>价格</th>
    <th>实用性</th>
</tr>
<tr>
    <td>激光对管</td>
    <td>激光发射，直线度高，外包热缩管限制通孔范围，基本发散角为0</td>
    <td>器件更小</td>
    <td>大于5+2</td>
    <td>稳定，精准</td>
</tr>

<span id="3.4"></span>

<tr>
    <td>红外对管</td>
    <td>发散角小于10度，但是对于要求较高的工字台和转盘定位，误差太大。</td>
    <td>安装</td>
    <td>大于4.3</td>
    <td>略差，经常会检测不到</td>
</tr>
</table>

###3.4、黑盒子红外
<br>

　神秘的黑盒子红外内部结构图：

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-balckbox-circuit.png" style="width:600px">
</div>
<br>

　可惜关键器件目前还没能找到是什么型号，其内部或许集成了斯密特震荡器，不需要光控即可震荡，其固有频率在200KHZ左右，实测有194KHZ。特点是输出端接5V时（像上面那样接），可以在地端输出波形，所以就不需要单片机输出，节约了成本。对比测试了PIC0103SD，这两种器件的输出级应该是不同的方式。

<span id="3.5"></span>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-unknown-type.png" style="width:600px">
</div>
<br>

<span id="二、应用"></span>

###3.5、反射式红外传感器
<br>

　原理图见[应用](#二、应用)
　针对这个原理我测试了它的检测距离等参数（详见有道里上传的数据）

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-30-IR-test-result.png" style="width:600px">
</div>
<br>

<span id="四、知识补充"></span>

　由图可知，在中间的时候发射距离最远，所以把程序的占空比调整一下即可，没有必要从1%-100%了，大约55%时就是峰值了。

##四、知识补充
<br>

　为防止电磁干扰：

<div style="text-align:center;"><span><a target="_blank" href="XXXX"><img src="{{site.img_path}}/2015-03-30-design-of-SOR-output-circuit.png"></a></span><span><a target="_blank" href="XXXX"><img src="{{site.img_path}}/2015-03-30-design-of-transistor-output-circuit.png"></a></span></div>

参考：[http://wiki.dzsc.com/info/61.html#top](http://wiki.dzsc.com/info/61.html#top)

　总结：
　光电传感器由三部分构成，它们分为：发送器，接收器和检测电路。发送器对准目标发射光束，发射的光束一般来源于半导体光源，发光二极管（LED）和激光二极管。光束不间断地发射，或者改变脉冲宽度。接收器有光电二极管或光电三极管组成。在接收器的前面，可装有光学元件如透镜和光圈等。在其后面是检测电路，它能滤出有效信号和应用该信号。
