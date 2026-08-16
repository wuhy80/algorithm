# 二分查找（Binary Search）

二分查找是在有序数组中定位目标值的经典算法。它每次检查当前区间的中点：若中点值等于目标则结束；若目标更大，只保留右半区；若目标更小，只保留左半区。候选范围因此每一步都会缩小约一半。

## 解决什么问题

二分查找适合在已排序、可随机访问的数据中快速定位元素，例如字典索引、数据库有序键、版本边界和数值答案范围。它依赖“有序”这一前提；未排序数据必须先排序，频繁变化的数据则可能更适合搜索树或哈希表。

## 算法过程

```text
low = 0, high = n - 1
while low <= high:
    mid = floor((low + high) / 2)
    if array[mid] == target: return mid
    if array[mid] < target:  low = mid + 1
    else:                    high = mid - 1
return -1
```

演示会对输入值去重并升序排列，逐步标出 `low`、`mid`、`high` 和被排除的区间。

## 复杂度

- 最好时间复杂度：`O(1)`；
- 平均与最坏时间复杂度：`O(log n)`；
- 迭代实现的额外空间复杂度：`O(1)`。

## 交互功能

- 输入自定义数字数组和目标值；
- 随机生成有序数据与可能存在或不存在的目标；
- 播放、暂停、单步执行和调节速度；
- 实时显示比较次数、候选数量、结果索引和查找轨迹。

## 文件结构与运行

```text
binary-search/
├── index.html
├── styles.css
├── app.js
└── README.md
```

零依赖，可直接打开 `index.html`，或从仓库根目录启动 `python -m http.server 8000` 后访问 `http://localhost:8000/binary-search/`。
