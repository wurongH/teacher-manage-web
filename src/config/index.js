const env = process.env.NODE_ENV;

const common = {
  appCode: 'T_PC',
  imgHost: '' //阿里云图片服务器
};

//开发环境：npm run dev
const development = {
  host: '',
  ...common
};

//测试环境打包：npm run build test
const test = {
  host: 'http://10.0.0.26:9051',
  ...common
};

//正式环境打包( 准生产 )：npm run build ready
const ready = {
  host: '',
  ...common
};

//正式环境打包：npm run build
const production = {
  host: 'http://47.107.249.116:9051',
  ...common
};

const config = {
  development,
  test,
  production
};

export default config[env];
