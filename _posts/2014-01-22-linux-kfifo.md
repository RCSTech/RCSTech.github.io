---
layout: post
title: "Linux内核中的循环队列"
author: 科长
category: "基础入门"
mail: kezhang@rcstech.org
tags: [linux, C, 编程技巧]
---
{% include JB/setup %}

　　本文介绍linux内核中一个实现十分巧妙的数据结构：无锁循环队列kfifo。

<!--more-->

　　kfifo是linux内核中提供的一个循环队列，采用无锁编程技术，在只有一个reader和writer时，可以不用任何锁，提供高并发的访问能力。kfifo的结构定义很简单：

{% highlight C %}
struct __kfifo {
        unsigned int        in;
        unsigned int        out;
        unsigned int        mask;
        unsigned int        esize;
        void                *data;
};
{% endhighlight %}

　　其中data是数据存储区的起始地址，esize（element-size）是队列中每个元素所占用的字节数，in和out分别是写和读位置的“逻辑偏移量”（下文会介绍）。mask的含义和作用稍后介绍，先来看看kfifo的构造方式：

{% highlight C %}
int __kfifo_alloc(struct __kfifo *fifo, unsigned int size,
                size_t esize, gfp_t gfp_mask)
{
    /*
     * round down to the next power of 2, since our 'let the indices
     * wrap' technique works only in this case.
     */
    size = roundup_pow_of_two(size);

    fifo->in = 0;
    fifo->out = 0;
    fifo->esize = esize;

    if (size < 2) {
            fifo->data = NULL;
            fifo->mask = 0;
            return -EINVAL;
    }

    fifo->data = kmalloc(size * esize, gfp_mask);

    if (!fifo->data) {
            fifo->mask = 0;
            return -ENOMEM;
    }
    fifo->mask = size - 1;

    return 0;
}
EXPORT_SYMBOL(__kfifo_alloc);
{% endhighlight %}

　　函数入口的第一个操作就是把传入的size向上扩展为2的整数次幂，这是linux内核的一个常见做法。size是队列中元素数量，所以申请的空间大小为(size * esize)。然后，定义mask为(size - 1)，这样就可以把对size的取模运算转换为对mask的按位与运算，对性能有所提升。

　　在介绍入队出队操作前，先看一个函数的实现，用来计算队列中的可用空间：

{% highlight C %}
/*
 * internal helper to calculate the unused elements in a fifo
 */
static inline unsigned int kfifo_unused(struct __kfifo *fifo)
{
    return (fifo->mask + 1) - (fifo->in - fifo->out);
}
{% endhighlight %}

　　上文提到，in和out是“逻辑偏移量”。怎么理解“逻辑偏移量”的概念呢？假设有一个size为8的kfifo，创建之后，入队4个元素，随后出队2个元素，于是in和out如下图所示：

![第一次操作]({{site.img_path}}/2012-01-22 linux_kfifo1.png)

　　接下来，再入队5个元素，那么in不会回到out前一个位置，而是直接加5，如下图：

![第二次操作]({{site.img_path}}/2012-01-22 linux_kfifo2.png)

　　图中示意队列可以无限重复追加，而实际上队列在内存中只占用8个元素的空间。通过in和out访问元素之前，要先将in和out对mask做按位与操作，这样就能得到在内存中的实际偏移量，这么做可以简化计算，提升性能。

　　然后来看最关键的入队出队操作，以入队为例：

{% highlight C %}
static void kfifo_copy_in(struct __kfifo *fifo, const void *src, unsigned int len, unsigned int off)
{
    unsigned int size = fifo->mask + 1;
    unsigned int esize = fifo->esize;
    unsigned int l;

    off &= fifo->mask;
    if (esize != 1) {
            off *= esize;
            size *= esize;
            len *= esize;
    }
    l = min(len, size - off);

    memcpy(fifo->data + off, src, l);
    memcpy(fifo->data, src + l, len - l);
    /*
     * make sure that the data in the fifo is up to date before
     * incrementing the fifo->in index counter
     */
    smp_wmb();
}

unsigned int __kfifo_in(struct __kfifo *fifo,
                const void *buf, unsigned int len)
{
    unsigned int l;

    l = kfifo_unused(fifo);
    if (len > l)
            len = l;

    kfifo_copy_in(fifo, buf, len, fifo->in);
    fifo->in += len;
    return len;
}
EXPORT_SYMBOL(__kfifo_in);
{% endhighlight %}

　　由于存储空间是一段连续的空间，所以在入队拷贝的时候可能需要分两段：尾部和头部。在计算拷贝长度时，直接利用in和out的差值，即使in或out在无符号整型数的范围溢出，计算出来的长度也是正确的。实现无锁的关键在于：先入队，然后再对in进行加的操作；类似地，先出队，然后对out进行加的操作。只要out小于in，就没有任何问题。

　　出队的实现也是类似的：

{% highlight C %}
static void kfifo_copy_out(struct __kfifo *fifo, void *dst,
                unsigned int len, unsigned int off)
{
    unsigned int size = fifo->mask + 1;
    unsigned int esize = fifo->esize;
    unsigned int l;

    off &= fifo->mask;
    if (esize != 1) {
        off *= esize;
        size *= esize;
        len *= esize;
    }
    l = min(len, size - off);

    memcpy(dst, fifo->data + off, l);
    memcpy(dst + l, fifo->data, len - l);
    /*
     * make sure that the data is copied before
     * incrementing the fifo->out index counter
     */
    smp_wmb();
}

unsigned int __kfifo_out_peek(struct __kfifo *fifo,
                void *buf, unsigned int len)
{
    unsigned int l;

    l = fifo->in - fifo->out;
    if (len > l)
        len = l;

    kfifo_copy_out(fifo, buf, len, fifo->out);
    return len;
}
EXPORT_SYMBOL(__kfifo_out_peek);

unsigned int __kfifo_out(struct __kfifo *fifo,
                void *buf, unsigned int len)
{
    len = __kfifo_out_peek(fifo, buf, len);
    fifo->out += len;
    return len;
}
EXPORT_SYMBOL(__kfifo_out);
{% endhighlight %}

　　无锁循环队列的应用范围很广泛，例如：在低频单片机中，串口接收数据（中断模式）可以将ISR分为top half和bottom half，top half负责接收数据并将数据存放到循环队列中，而bottom half负责从队列中取出数据并处理数据。用类似以上的实现，可以减少一个锁，从而实现更高的并发度和资源利用率。

###References
[Why computers represent signed integers using two's complement](http://igoro.com/archive/why-computers-represent-signed-integers-using-twos-complement/)  
[透过Linux内核看无锁编程](http://www.ibm.com/developerworks/cn/linux/l-cn-lockfree/index.html?ca=dat-cn-0121)  
[Linux内核数据结构之kfifo](http://www.cnblogs.com/Anker/p/3481373.html)  
[巧夺天工的kfifo](http://blog.csdn.net/linyt/article/details/5764312)
