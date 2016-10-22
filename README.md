### 小型的编译器


***v1期望完成***
```
const a = item => console.log('123');
```
转化为:
```
var a = function(item) {
    console.log('123');
}
```

***v1 done***
- 整个流程串起来了
- 这只是个开始
