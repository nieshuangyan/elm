let padZero=function(str){
  return ('00' + str).substr(str.length);
}

let method={
  // 格式化时间
  formateDate(date,fmt){
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'D+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let key in o) {
        if (new RegExp(`(${key})`).test(fmt)) {
            let str = o[key] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padZero(str));
        }
    }
    return fmt;
  },
  // 从URL中获取请求参数
  urlParse(name){
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null){
      return  unescape(r[2]);
    }
    return null;
  },
  // 设置localStorage缓存数据
  saveToLocal(id,key,value){
    // 指明是浏览器下的localStorage，node下没有localStorage
    let seller=window.localStorage._seller_;
    if(!seller){
      seller={};
      seller[id]={};
    }else{
      seller=JSON.parse(seller);
      if(!seller[id]){
        seller[id]={};
      }
    }
    seller[id][key]=value;
    window.localStorage._seller_=JSON.stringify(seller);
  },
  // 读取localStorage缓存数据
  loadFormLocal(id,key,def){
    let seller=window.localStorage._seller_;
    if(!seller) {
      console.log("没有这个seller")
      return def;
    }
    seller=JSON.parse(seller);
    if(!seller[id]){
      console.log("没有这个id")
      return def;
    }
    seller=seller[id];
    if(!seller[key]){
      console.log("没有这个key")
      return def;
    }
    let ids=seller[key];
    return ids || def;
  },
}


export {method};
