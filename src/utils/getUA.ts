interface Iua {
  [propsName: string]: boolean;
}

/**
 * generation ua object accroding to navigator.userAgent
 * @param {string} u navigator.userAgent
 * @return {false | Iua} ua object
 */
export function getUA (u: string): false | Iua {
  if (!u) return false

  const ua: Iua = {
    edge: u.indexOf('Edge') > -1, // Edge core
    trident: u.indexOf('Trident') > -1, // IE core
    presto: u.indexOf('Presto') > -1, // Opera core
    webKit: u.indexOf('AppleWebKit') > -1, // Chrome or Safari core
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // Firefox core
    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/Mobile/g), // mobile
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios terminal
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android terminal or UC browser
    iPhone: u.indexOf('iPhone') > -1, // iPhone
    iPad: u.indexOf('iPad') > -1, // iPad
    weixin: u.indexOf('MicroMessenger') > -1, // weichat
    weibo: u.indexOf('Weibo') > -1, // weibo
    facebook: u.indexOf('FBAN') > -1, // facebook
    twitter: u.indexOf('Twitter') > -1, // twitter
    instagram: u.indexOf('Instagram') > -1, // instagram
    qq: !!u.match(/\sQQ/i) // QQ
  }
  return ua
}

export default getUA
