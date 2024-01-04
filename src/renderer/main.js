import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
// import store from './store'
window.process = {
  env: {
    NODE_ENV: 'development'
  }
}
//引用 element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
ElementUI.Dialog.props.closeOnClickModal.default = false





if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false


// 整理请求
axios.defaults.timeout = 10000;
axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '/api' : 'https://hudiepm.com'; //填写域名

//http request 拦截器
/**
 * application/json; charset=utf-8
 * application/x-www-form-urlencoded
 * */
axios.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'version': require('vue/package.json').version,
      'authorization': localStorage.getItem('token') == null ? "" : localStorage.getItem('token')
    }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);



//响应拦截器即异常处理
//不使用拦截
axios.interceptors.response.use(response => {
  return response
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        console.log('错误请求')
        break;
      case 401:
        console.log('未授权，请重新登录')
        break;
      case 403:
        console.log('拒绝访问')
        break;
      case 404:
        console.log('请求错误,未找到该资源')
        break;
      case 405:
        console.log('请求方法未允许')
        break;
      case 408:
        console.log('请求超时')
        break;
      case 500:
        console.log('服务器端出错')
        break;
      case 501:
        console.log('网络未实现')
        break;
      case 502:
        console.log('网络错误')
        break;
      case 503:
        console.log('服务不可用')
        break;
      case 504:
        console.log('网络超时')
        break;
      case 505:
        console.log('http版本不支持该请求')
        break;
      default:
        console.log(`连接错误${err.response.status}`)
    }
  } else {
    console.log('连接到服务器失败')
    console.log(err);
  }
  return Promise.resolve(err.response)
})

/**
* 封装post请求
* @param url
* @param data
* @returns {Promise}
*/

Vue.prototype.$post = function (url, data = {}) {
  console.log(url);
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        if (response.status == 200) {
          let requestResult = response.data;
          if (requestResult.code == 0) {
            if (requestResult.token != undefined && requestResult.token != "") {
              localStorage.setItem('token', requestResult.token);
              console.log(requestResult.token == localStorage.getItem('token'))
            }
            resolve(response);
          } else {
            let v = new Vue();
            let responseCode = requestResult.code;
            if (requestResult.code == 5) { //对token失效进行验证
              router.push('/').catch(err => { err })
              return;
            } else if (requestResult.code == -1) {
              //3.在新的实例上使用组件
              resolve(response);
              var msgContent = "<p> 异常编码:" + requestResult.codeText + "</p>"
              msgContent = msgContent + "<p align='center'>请复制编码后联系管理员</p>";
              this.$message({
                dangerouslyUseHTMLString: true,
                message: msgContent,
                showClose: true,
                duration: 0,
                type: 'warning',

              });
            } else {
              //3.在新的实例上使用组件
              resolve(response);
              v.$notify({
                title: '提示',
                message: requestResult.codeText,
                type: 'warning'
              });
            }
          }
        } else {
          console.log("method inside", url);
        }

      }, err => {
        console.log(url);
        reject(err)
      })
  })
}


/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  // store,
  template: '<App/>'
}).$mount('#app')
