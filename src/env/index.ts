import { getTs, getUA } from 'peeler-js'
import { IenvInfo } from '../index.d'

export const getEnvInfo = (function () {
  if (typeof window === 'undefined') return function (): false {
    console.warn('Please call in browser environment')
    return false
  }

  return function (): IenvInfo {
    const ua = navigator.userAgent
    const scr = window.screen
    const page_url = location.href
    const referer = document.referrer

    const info: IenvInfo = {
      ts: getTs(),
      os: '',
      browser: '',
      screen_size: (scr.width || 0) + 'x' + (scr.height || 0),
      page_url,
      referer,
      device: ('ontouchstart' in window ? 'mobile': 'pc'),
      ua
    }

    const {
      isMobile,
      isAndroid,
      isIOS,
      isWindows,
      isMac,
      isWeixin,
      isSinaWeibo,
      isQQWeibo,
      isFacebook,
      isTwitter,
      isInstagram,
      isChrome,
      isFirefox,
      isGecko,
      isIE,
      isEdge,
      isOpera,
      isSafari,
      is360se,
      isQQ,
      isUCBrowser,
      isBaiduBrowser,
      isSougouBrowser,
      isLiebaoBrowser,
      isWebKit
    } = getUA(ua)

    if (isMobile) {
      if (isAndroid) {
        info.os = 'android'
      } else if (isIOS) {
        info.os = 'ios'
      }
    } else {
      if (isWindows) {
        info.os = 'windows'
      } else if (isMac) {
        info.os = 'mac'
      }
    }

    if (isWeixin) {
      info.browser = 'weixin'
    } else if (isSinaWeibo) {
      info.browser = 'weibo_sina'
    } else if (isQQWeibo) {
      info.browser = 'weibo_qq'
    } else if (isFacebook) {
      info.browser = 'facebook'
    } else if (isTwitter) {
      info.browser = 'twitter'
    } else if (isInstagram) {
      info.browser = 'instagram'
    } else if (isChrome) {
      info.browser = 'chrome'
    } else if (isFirefox || isGecko) {
      info.browser = 'firefox'
    } else if (isIE) {
      info.browser = 'ie'
    } else if (isEdge) {
      info.browser = 'edge'
    } else if (isOpera) {
      info.browser = 'opera'
    } else if (isSafari) {
      info.browser = 'safari'
    } else if (is360se) {
      info.browser = '360'
    } else if (isQQ) {
      info.browser = 'qq'
    } else if (isUCBrowser) {
      info.browser = 'uc'
    } else if (isBaiduBrowser) {
      info.browser = 'baidu'
    } else if (isSougouBrowser) {
      info.browser = 'sougou'
    } else if (isLiebaoBrowser) {
      info.browser = 'liebao'
    } else if (isWebKit) {
      info.browser = 'webkit'
    }
  
    return info
  }
})()

export default getEnvInfo