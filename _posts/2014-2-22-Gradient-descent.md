---
layout: post
title: "基于梯度下降法的姿态航向参考系统"
author: Insulator
star: 5
category: "核心技术"
mail: admin@yumumu.me
tags: 
  - 传感器
  - 数学模型
---
{% include JB/setup %}

　　本文介绍了基于梯度下降法的姿态航向参考系统。

<!--more-->

##符号，术语和约定
<br>

　　先对姿态航向参考系统进行建模。为了建模方便，在建模前，我们先进行如下的约定。

　　所有坐标系均使用右手坐标系<sup>[15]</sup>。

　　使用地球为绝对坐标系，使用E表示，以“天”为z轴，“东”为x轴，“北”为y轴。

　　传感器坐标系如图4-1所示，使用S表示。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig1.png" style="width:400px" alt="图1">
</div>
<br>

<center>图4-1</center>
<br>

　　三轴陀螺仪获取的三个轴向的数据分别用W<sub>x</sub>，W<sub>y</sub>，W<sub>z</sub>，分别代表x轴，y轴，z轴的角速度，单位使用弧度/秒。

　　三轴陀螺仪获取的三个轴向的数据分别用a<sub>x</sub>，a<sub>y</sub>，a<sub>z</sub>，分别代表x轴，y轴，z轴的加速度。

　　三轴陀螺仪获取的三个轴向的数据分别用m<sub>x</sub>，m<sub>y</sub>，m<sub>z</sub>，分别代表x轴，y轴，z轴的磁场。

　　为便于描述，没特殊说明的话，下文均把![四元数]({{site.img_path}}/2014-2-22 fig2.png)，默认简写成Q,表示传感器坐标系相对于地球坐标系的姿态对应的四元数。
<br>

##由三轴陀螺仪获取姿态
<br>

　　我们首先考虑最简单的情况，只用三轴陀螺仪来获取姿态。

　　我们定义一个S中的四元数向量<sup>S</sup><sub>W</sub>，用于表示角速度，如公式4-1所示。根据文献<sup>[11]</sup>，四元数![四元数]({{site.img_path}}/2014-2-22 fig3.png)的导数![四元数导数]({{site.img_path}}/2014-2-22 fig4.png)可由公式4-2计算得到，它表示姿态变化的速率。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig5.png" style="width:250px" alt="图5">
<span style="float:right;"><br>(公式4-1)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig6.png" style="width:250px" alt="图6">
<span style="float:right;"><br>(公式4-2)</span>
</div>
<br>

　　我们用![姿态]({{site.img_path}}/2014-2-22 fig7.png)来表示在t时刻，传感器坐标系相对于与地球坐标系的姿态。如果初始状态已知的话，则![姿态]({{site.img_path}}/2014-2-22 fig7.png)可由四元数的导数![姿态导数]({{site.img_path}}/2014-2-22 fig8.png)积分得到，如公式4-3和公式4-4所示。其中![姿态估计值]({{site.img_path}}/2014-2-22 fig9.png)表示t-1时刻的姿态估计值，![陀螺仪测量值]({{site.img_path}}/2014-2-22 fig10.png)为t时刻的陀螺仪测量值，![采样时间间隔]({{site.img_path}}/2014-2-22 fig11.png)为采样时间间隔，下标w表示这个四元数是由角速度得到的。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig12.png" style="width:300px" alt="图12">
<span style="float:right;"><br>(公式4-3)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig13.png" style="width:300px" alt="图13">
<span style="float:right;"><br>(公式4-4)</span>
</div>
<br>

　　于是，我们可根据公式4-4得到由陀螺仪获取的姿态。
