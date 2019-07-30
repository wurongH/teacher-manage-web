const JSON = require('circular-json');
export default {
  getLocalStorage(key){
    var value = localStorage.getItem(key);
    return value ? JSON.parse(value) : false;
  },
  setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeLocalStorage(key){ localStorage.removeItem(key) },
  setSessionStorage(key, value){
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  getSessionStorage(key){
    var value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : false;
  },
  removeSessionStorage(key){ sessionStorage.removeItem(key); },
  getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
      return unescape(arr[2]);
    else
    return false;
  }
}
