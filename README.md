NOTE: add env file

`PUBLIC_URL=$npm_package_homepage/$npm_package_name/$npm_package_version`

/_ when PUBLIC_URL exist, npm build inject oss url to assets _/

REACT_APP_ROOT configuration file is /src/app/constants.js, deafult: /v2


#### 说明
专注文字和svg图形展示，代码中不用图片、音频、视频资源。

```javascript
//图标用阿里iconfont, 快速将图标加入购物车
1.控制台粘贴回车
var j=document.createElement('script');
    j.setAttribute("src", 'https://ajax.microsoft.com/ajax/jquery/jquery-1.4.min.js');
    document.getElementsByTagName("head")[0].appendChild(j);

2.控制台粘贴回车
    $("span[title='添加入库']").each(function(){
        $(this).delay(500).click();
        console.log($(this).parent().prev().children().eq(0).html());
    });
```