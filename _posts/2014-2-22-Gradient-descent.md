---
layout: post
title: "基于梯度下降法的姿态航向参考系统"
author: Insulator
star: 4
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

　　使用地球为绝对坐标系，使用E表示，以“天”为$Z$轴，“东”为$X$轴，“北”为$Y$轴。

　　传感器坐标系如图4-1所示，使用$S$表示。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig1.png" style="width:300px" alt="图1">
</div>
<br>

<center>图4-1</center>
<br>

　　三轴陀螺仪获取的三个轴向的数据分别用$W\_x$，$W\_y$，$W\_z$，分别代表$X$轴，$Y$轴，$Z$轴的角速度，单位使用弧度/秒。

　　三轴加速度计获取的三个轴向的数据分别用$a\_x$，$a\_y$，$a\_z$，分别代表$X$轴，$Y$轴，$Z$轴的加速度。

　　三轴磁力计获取的三个轴向的数据分别用$m\_x$，$m\_y$，$m\_z$，分别代表$X$轴，$Y$轴，$Z$轴的磁场。

　　为便于描述，没特殊说明的话，下文均把$\{}_{E}^{S}q\$，默认简写成$Q$,表示传感器坐标系相对于地球坐标系的姿态对应的四元数。
<br>

##由三轴陀螺仪获取姿态
<br>

　　我们首先考虑最简单的情况，只用三轴陀螺仪来获取姿态。

　　我们定义一个S中的四元数向量$\{}^{S}W\$，用于表示角速度，如公式 $\ref{4-1}$ 所示。根据文献<sup>[11]</sup>，四元数$\hat{Q}\$的导数\$\dot{Q}\$可由公式 $\ref{4-2}$ 计算得到，它表示姿态变化的速率。

\begin{equation} \label{4-1} ^S W=\begin{bmatrix} 0 & W_x & W_y & W_z \end{bmatrix} \end{equation}

\begin{equation} \label{4-2} \dot{Q}=\frac{1}{2}\hat{Q}\ \otimes \,{}^{S}W \end{equation}

　　我们用$Q\_{W,t}$来表示在t时刻，传感器坐标系相对于与地球坐标系的姿态。如果初始状态已知的话，则$Q\_{W,t}$可由四元数的导数$\dot{Q}\_{W,t}$积分得到，如公式 $\ref{4-3}$ 和公式 $\ref{4-4}$ 所示。其中$\hat{Q}\_{est,t-1}$表示$t-1$时刻的姿态估计值，$\{}^{S}W\_{t}$为$t$时刻的陀螺仪测量值，$\Delta t$为采样时间间隔，下标w表示这个四元数是由角速度得到的。

\begin{equation} \label{4-3} \dot{Q}\_{W,t}=\frac{1}{2}\hat{Q}\_{est,t-1}\ \otimes {}^{S}W\_{t} \end{equation}

\begin{equation} \label{4-4} Q\_{W,t}=\hat{Q}\_{est,t-1}+{\dot{Q}}\_{W,t}\Delta t \end{equation}

　　于是，我们可根据公式 $\ref{4-4}$ 得到由陀螺仪获取的姿态。

##由“场”获取姿态
<br>

　　一个三轴加速度计可以测量重力场的大小和方向，同时会因为传感器运动时产生的线性加速度而受到影响。相似的，三轴磁力计也可测量磁场的方向和大小，但也会被近场磁场干扰。在本文建立的模型中，为了理想建模，忽略这些干扰，即假定加速度计只测量重力，磁力计只测量地磁场。

　　如果场的方向在地球坐标系中已知，根据传感器坐标系中测量到的场的方向，则可以计算出传感器坐标系相对于地球坐标系的姿态。然而，对于任意的测量值，这个姿态解并不是唯一的，因为真实的姿态绕着场的方向旋转得到的姿态的测量值都是一样的。而四元数要求的姿态必须是一个完整的姿态，而通过场得到的姿态是不完全的。这就需要我们去找到一个最优的姿态解，使其与真实的姿态解误差最小。

　　这就可以当成一个最优化问题来求解，我们定义最优解的误差函数，如公式 $\ref{4-6}$ 所示，当满足公式 $\ref{4-5}$ 时，理论上$\hat{Q}\$可找到一个最优解，使得姿态的误差最小。其中，$\{}^{E}\hat{d}\$表示场在地球坐标系中的方向向量，$\{}^{S}\hat{s}\$表示传感器坐标系中的场方向的测量值。

\begin{equation} \label{4-5} \underset{\hat{Q}\in {R}^{4}}{\mathop{\min }}\,f(\hat{Q},{}^{E}\hat{d},{}^{S}\hat{s}) \end{equation}

\begin{equation} \label{4-6} f(\hat{Q},{}^{E}\hat{d},{}^{S}\hat{s})\ =\,{\hat{Q}^{*}}\ \otimes \,{}^{E}\hat{d}\,\otimes \,\hat{Q}\,\,-\,{}^{S}\hat{s} \end{equation}

\begin{equation} \label{4-7} \hat{Q}=\left[ {q}\_{1}\ {q}\_{2}\ {q}\_{3}\ {q}\_{4} \right] \end{equation}

\begin{equation} \label{4-8} {}^{E}\hat{d}=\left[ 0\ {d}\_{x}\ {d}\_{y}\ {d}\_{z} \right] \end{equation}

\begin{equation} \label{4-9} {}^{S}\hat{s}=\left[ 0\ {s}\_{x}\ {s}\_{y}\ {s}\_{z} \right] \end{equation}

　　最优化算法有很多种，其中梯度下降法是一种简单高效的算法，公式4-10描述了梯度下降法如何用第k次迭代的结果来估计第k+1次的值<sup>[7]</sup>。其中，u为迭代的步长，初始状态![初始状态]({{site.img_path}}/2014-2-22 fig21.png)已知。![解曲面的梯度]({{site.img_path}}/2014-2-22 fig22.png)为公式 $\ref{4-5}$ 定义的误差函数的解曲面的梯度，它可由误差函数和误差函数的Jacobian 矩阵计算得到，如公式4-11所示<sup>[16]</sup>。根据公式 $\ref{4-6}$ ，可得公式4-12，为了方便计算，转换成3维向量。误差函数的Jacobian 矩阵可由公式4-13计算得到。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig23.png" style="width:450px" alt="图23">
<span style="float:right;"><br>(公式4-10)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig24.png" style="width:400px" alt="图24">
<span style="float:right;"><br>(公式4-11)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig25.png" style="width:450px" alt="图25">
<span style="float:right;"><br><br><br><br><br>(公式4-12)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig26.png" style="width:480px" alt="图26">
<span style="float:right;"><br><br><br>(公式4-13)</span>
</div>
<br>

　　接着，我们可以把上述公式套入重力场中，如公式4-14，4-15，4-16，4-17所示。一般来说，我们可以假定重力场方向为地球坐标系的z轴方向。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig27.png" style="width:200px" alt="图27">
<span style="float:right;"><br>(公式4-14)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig28.png" style="width:230px" alt="图28">
<span style="float:right;"><br>(公式4-15)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig29.png" style="width:400px" alt="图29">
<span style="float:right;"><br><br><br>(公式4-16)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig30.png" style="width:350px" alt="图30">
<span style="float:right;"><br><br><br>(公式4-17)</span>
</div>
<br>

　　相似的，我们可以把这些公式代入地磁场。如公式4-18，4-19，4-20，4-21所示。需要注意的是，磁场的方向并不像重力场那么确定，会随着地理位置而改变，如北京和伦敦的地磁场是不一样的<sup>[17]</sup>。所以我们将磁场方向分解为水平方向和垂直方向，如公式4-19所示。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig31.png" style="width:200px" alt="图31">
<span style="float:right;"><br>(公式4-18)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig32.png" style="width:220px" alt="图32">
<span style="float:right;"><br>(公式4-19)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig33.png" style="width:400px" alt="图33">
<span style="float:right;"><br><br><br>(公式4-20)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig34.png" style="width:430px" alt="图34">
<span style="float:right;"><br><br><br>(公式4-21)</span>
</div>
<br>

　　如上文提到的，单独使用重力场或者地磁场来获取姿态的话，姿态解不是唯一的。所以，我们可以将重力场和地磁场的解组合到一起，如公式4-22和公式4-23所示。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig35.png" style="width:300px" alt="图35">
<span style="float:right;"><br><br>(公式4-22)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig36.png" style="width:250px" alt="图36">
<span style="float:right;"><br><br>(公式4-23)</span>
</div>
<br>

　　根据公式4-10，我们可以得到姿态的梯度下降法递推公式，如公式4-24所示。其中![姿态估计值]({{site.img_path}}/2014-2-22 fig9.png)为t-1时刻的姿态估计值。u<sub>t</sub>为梯度下降的步长。至此，我们可以得到使用梯度下降法求解由重力场和地磁场获得姿态的算法。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig37.png" style="width:230px" alt="图37">
<span style="float:right;"><br>(公式4-24)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig38.png" style="width:350px" alt="图38">
<span style="float:right;">(公式4-25)</span>
</div>
<br>

##传感器数据融合
<br>

　　上文中，已由公式4-4得到由陀螺仪求解姿态的算法，4-24得到由加速度计，磁力计求解姿态的算法。现在我们将这两个姿态解融合，如公式4-26所示，其中![公式4-14定义]({{site.img_path}}/2014-2-22 fig39.png)由公式4-14定义，![姿态]({{site.img_path}}/2014-2-22 fig7.png)由公式4-4定义，![r]({{site.img_path}}/2014-2-22 fig40.png)和![1-r]({{site.img_path}}/2014-2-22 fig41.png)分别为他们对应的权重。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig42.png" style="width:350px" alt="图42">
<span style="float:right;">(公式4-26)</span>
</div>
<br>

　　接下来问题的关键就是确定![r]({{site.img_path}}/2014-2-22 fig40.png)。由于公式4-4，可知![姿态]({{site.img_path}}/2014-2-22 fig7.png)的计算是一个不断积分的过程，所以![姿态]({{site.img_path}}/2014-2-22 fig7.png)是发散的。由公式4-24，可知![公式4-14定义]({{site.img_path}}/2014-2-22 fig39.png)在不断的逼近极值，所以![公式4-14定义]({{site.img_path}}/2014-2-22 fig39.png)是收敛的。为了得到一个稳定的姿态，我们应该让![公式4-14定义]({{site.img_path}}/2014-2-22 fig39.png)收敛权重的和![姿态]({{site.img_path}}/2014-2-22 fig7.png)的发散权重相等<sup>[7]</sup>。![公式4-14定义]({{site.img_path}}/2014-2-22 fig39.png)的收敛率可由![udt]({{site.img_path}}/2014-2-22 fig43.png)来表示，用![beita]({{site.img_path}}/2014-2-22 fig44.png)来表示![姿态]({{site.img_path}}/2014-2-22 fig7.png)的发散率，也就是陀螺仪的测量误差。这样我们可以写出公式4-27，从而计算出出关于![r]({{site.img_path}}/2014-2-22 fig40.png)的公式4-28。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig45.png" style="width:200px" alt="图45">
<span style="float:right;"><br>(公式4-27)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig46.png" style="width:170px" alt="图46">
<span style="float:right;"><br><br>(公式4-28)</span>
</div>
<br>

　　公式4-26可展开为：

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig47.png" style="width:500px" alt="图47">
<span style="float:right;"><br><br><br>(公式4-29)</span>
</div>
<br>

　　化简可得：

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig45.png" style="width:200px" alt="图48">
<span style="float:right;"><br>(公式4-30)</span>
</div>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig46.png" style="width:170px" alt="图49">
<span style="float:right;"><br><br>(公式4-31)</span>
</div>
<br>

　　至此我们得到姿态航向参考系统的模型，如公式4-30所示，我们只需确定两个参数，步长u<sub>t</sub>和陀螺仪测量误差![beita]({{site.img_path}}/2014-2-22 fig44.png)，即可实现这个模型。

##模型参数确定
<br>

　　在上文中，我们已经将姿态航向参考系统进行建模，还差两个待确定参数。在这里将确定这两个参数的具体数值，并对模型的性能进一步优化。

　　为了方便计算，我们可做如下假设，假设采样时间足够短，且陀螺仪误差较小，则由公式4-31可认为![m=1]({{site.img_path}}/2014-2-22 fig50.png)。如此，便可消去步长u<sub>t</sub>这个参数。

　　即可得到

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig51.png" style="width:400px" alt="图51">
<span style="float:right;"><br>(公式5-1)</span>
</div>
<br>

　　现在公式已大幅简化，唯一不确定的就是![beita]({{site.img_path}}/2014-2-22 fig44.png)参数。

　　 ![beita]({{site.img_path}}/2014-2-22 fig44.png)指的是陀螺仪的测量误差，可以根据数据手册<sup>[18]</sup>来获取，但本文打算使用实际测量的误差。根据公式4-2，可推导出公式5-2，其中，d为陀螺仪的静态飘移量，q为任意的单位四元数。因此，我们可以通过陀螺仪的数据手册来或直接对陀螺仪的数据采样分析计算得到![beita]({{site.img_path}}/2014-2-22 fig44.png)。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig52.png" style="width:350px" alt="图52">
<span style="float:right;"><br>(公式5-2)</span>
</div>
<br>

　　至此，我们可以最终确定我们所需要的姿态航向参考系统模型了。

##磁场干扰补偿
<br>

　　在建立好模型后，还有一个比较重要的问题要考虑，就是磁场干扰的问题。

　　地磁场很容易被近场磁场干扰，如电机，金属家具，金属。造成的磁场干扰，没有外部的方向参考的话，无法被校正。竖直方向的磁场，可由重力场校正，水平方向的磁场，则可利用GPS<sup>[19]</sup>等进行校正。

　　在本文中，没有使用GPS等全球定位技术，因此，对于航向角，无法提供可以校正的外部参考。所以，本文提出的姿态航向参考系统，以上电时的状态作为初始航向角，之后的航向角都以初始姿态的角度作为基准，如公式5-3，5-4所示。

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig53.png" style="width:400px" alt="图53">
<span style="float:right;"><br>(公式5-3)</span>
</div>
<br>

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig54.png" style="width:230px" alt="图54">
<span style="float:right;">(公式5-4)</span>
</div>
<br>

　　这样，当外界的磁场干扰较为稳定时，获得的偏航角也较为稳定。

##性能优化
<br>

　　鉴于使用的处理器为嵌入式芯片，计算性能远没有桌面计算机强大，除了姿态航向参考系统，还有很多其他的任务要处理，所以系统应该要尽可能地降低计算负担。

　　相比欧拉角等其他姿态表示方法，四元数的计算负担很小，不需要使用任何三角函数，但依然存在可以优化的地方。本文主要从两个地方来进行优化。

　　1、四元数的规范化。

　　四元数的规范化，即让四元数的模长为1，上文的所有公式中，参与计算的四元数都是规范的四元数，所以在每一次迭代计算完成时，都应对四元数进行规范化，四元数的规范化公式如下：

<div style="text-align:center"><img src="{{site.img_path}}/2014-2-22 fig55.png" style="width:300px" alt="图55">
<span style="float:right;"><br>(公式5-5)</span>
</div>
<br>

　　四元数的规范化需要计算平方根的倒数，这是一笔不小的计算开销。根据文献[20]提供的一种快速计算平方根的倒数的方法，也就是业界中传奇的“0x5f3759df”算法，始于一个3D游戏《雷神之锤3》。代码如下：

{% highlight C %}
float invSqrt(float x)
{
    float halfx = 0.5f * x;
    float y = x;
    long i = *(long *)&y;
    i = 0x5f3759df - (i >> 1);
    y = *(float *)&i;
    y = y * (1.5f - (halfx * y * y));
    return y;
}
{% endhighlight %}

　　2、合并重复计算。

　　在公式4-16，4-17，4-20，4-21中，有大量的重复计算，可采取以空间换时间的方法。
