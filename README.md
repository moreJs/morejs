### 小型的编译器


***v1期望完成***
```
const a = item => console.log('123');
```
转化为:
```
function a(item) {
    console.log('123');
}
```
