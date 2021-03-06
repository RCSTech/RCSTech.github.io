---
layout: post
title: "光电检测传感器简单优化尝试"
author: hrz
mail: rz.hao@rcstech.org
star: 4
layout: post
description: "光电检测传感器简单优化尝试"
category: 核心技术
tags: 
  - 电路
  - 激光
  - 对管
---

　这次参赛的自动车上，转盘位置需要用到光电检测器，目的是使转盘偏转定位达到足够精度。

<!--more-->
<br>
　最初用的是买来的现成红外对射管，用热缩管将发射头和接收头包起来，再用尖刀或尖镊子各戳开一个极小的孔，以达到小角度发散、小角度范围接收目的，从而使红外信号尽可能沿一条细直线传输，提高检测精度。<见图1>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-27 common Infrared tube.png" style="width:600px" alt="图1  被包住的红外对射式光电开关">
</div>
<br>
　但是红外发射对管有一些不足，红外有一定的发散角，从而对信号接收产生一定的角度范围，传到接收头的信号强度也因此减弱，接收头感应精度不够、转盘无法精确定位。
　我是被分配来解决这个问题的，干干学长帮我提出了两个方向——网上选购小发散角红外，或者自己设计电路，比如用光敏电阻作为感应器件替代接收头。所以我也是沿着两路来的。网上查阅资料发现红外发散角最小基本是在20度（我用的点激光照射，所以不存在此问题）。我们是需要更小角度的。另外，由于对射式红外传感相对安装使用更加灵活，我也就没有多考虑像黑盒子一类的反射式红外传感。<见图2>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-27 infrared.png" style="width:600px" alt="图2  实验室的黑盒子红外">
</div>
<br>
　用光敏电阻作简要测试时，考虑到1. 其响应速度不及红外对管；2. 对实验室的光敏电阻，用白炽灯光或自然光即可做控制光源，误动作问题是可能出现的； 3. 因光照强度引起的阻值变化再到电压电流的变化是连续的，不能像红外接收管给出的0，1信号那样理想；4. 温度系数、功率消耗问题也要考虑。（其实就是懒，没有深想如何处理这些问题— —）
一次百度，我看到一款三脚红外接收头的简介里写道，“可接收激光照射”，然后有了个想法，既然红外发射信号强度不是很足，那就用激光作为信号传给接收头。碰巧实验室刚买了一款看上去略显高端的红外接收管（IS486）（据说还要五元）<见图3>，

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-27 IS486.png" style="width:600px" alt="图3  IS486  从左到右——GND, OUT, VCC">
</div>
<br>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-27 Relative radiant intensity vs angular displacement.png" style="width:600px" alt="图4.1  一般红外接收头的相对辐射强度-角位移图">
</div>
<br>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-27 sensitivity diagram.png" style="width:600px" alt="图4.2  IS486的相对辐射强度-角位移图">
</div>
<br>
　我就用面包板搭了一个简易接收电路，用激光头去照射它，发现可以用。未照射时OUT端为0电位，激光照射后OUT端电平为5V。<见图5>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-27 test circuit.png" style="width:600px" alt="图5  面包板测试激光--红外接收头电路">
</div>
<br>
　激光相对红外发射管发出的信号强度要高，而且可以集中照射一点，所以我把IS486的接收电路板刷了出来，激光头+红外接收管电路，像是“激光--红外接收管”传感器。<见图6>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-27 receive circuit.png" style="width:600px" alt="图6  IS486接收电路图">
</div>
<br>
　为了得到更集中、更小的光点，我把激光头也包了起来（像处理红外对管一样）。测试发现，这样的对射传感器反应很敏锐，指示灯可以跟随激光头照射与否（手动在接受头前晃动）快速亮灭。而且检测距离也比红外对管远得多（用面包板测试时，五米之外接受管OUT端仍输出5V。这其实是跟激光头信号强度有关，所以足够的光强和小锥角解决了对射不精确问题）。激光头的功率消耗也很低。另外也许可以让激光头发出方波信号给接收头，得到一些好玩的东西。<见图7，图8>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-27 test circuit_2.png" style="width:600px" alt="图7  555定时器+ 激光传感">
</div>
<br>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-27 IS485's output wave.png" style="width:600px" alt="图8  对应图7的IS486的OUT端信号">
</div>
<br>
　实际装车测试，给程序员的体验还是不错的，提高了转盘定位精度，分析见上。<实际装车见图9，图10>所以在底盘滑轨定位处也换成了这样的激光传感。因为很小，以装车也很方便。

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-27 the circuit‘s application _1.png" style="width:600px" alt="图9  用于转盘处">
</div>
<br>

<div style="text-align:center"><img src="{{site.img_path}}/2015-03-27 the circuit‘s application _2.png" style="width:600px" alt="图10  用于底盘处">
</div>
<br>