/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  plugins: [],
  theme: {
    boxShadow: {
      left: '0 10px 30px rgba(0, 0, 0, .2)'
    },
    colors: {
      blank: '#FFFFFF',
      blue: {
        1: '#F5F9FF',
        2: '#EBF4FF',
        3: '#D6E7FE',
        4: '#C2DCFF',
        5: '#99C4FE',
        6: '#66A6FE',
        7: '#3389FD',
        8: '#006BFD', // 主题色
        9: '#005DDD', // 主题色 active、hover
        10: '#0052C2'
      },
      primary: '#006BFD', // 主题色/政采蓝08
      hover: '#005DDD',
      text: '#20242C',
      'button-disable': '#C2DCFF',
      // 布局调试色 不伤眼
      test1: 'pink',
      test2: 'skyblue',
      gray: {
        1: '#F7F8FA', // 卡片中模块色
        2: '#F2F4F7', // 背景色
        3: '#ECEEF2', // 表格、输入框默认边框色
        4: '#E3E6EB', // 灰色描边按钮默认边框色
        5: '#D8DCE2', // 边框
        6: '#C2C7D1', // 失效/禁用
        7: '#A7AEBB', // 暗文/提示
        8: '#838B99', // 二级辅助灰文字
        9: '#505663', // 一级辅助灰文字
        10: '#20242C' // 标题，正文文字
      },
      error: '#F53F3F', // 出错
      warning: '#FF7900', // 提醒
      success: '#26BD71', // 成功
      info: '#006BFD', // 提示/进行/链接
      mask: 'rgba(0, 0, 0, 0.7)', // 遮罩
      price: '#F74A15' // 价格
    },
    extend: {
      backgroundSize: {
        'strict-full': '100% 100%'
      }
    }
  }
}
