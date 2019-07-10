import { getTs } from '../utils'
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

    function check (pattern: RegExp): () => boolean {
      return function() {
        return (pattern).test(ua)
      }
    }

    const UA = {
      isAndroid: check(/android|linux|adr/i),
      isIOS: check(/\(i[^;]+;( U;)? CPU.+Mac OS X/i),
      isWindows: check(/window/i),
      isMac: check(/mac os x/i),
  
      isChrome: check(/webkit\W.*(chrome|chromium)\W/i),
      isFirefox: check(/mozilla.*\Wfirefox\W/i),
      isGecko: check(/mozilla(?!.*webkit).*\Wgecko\W/i),
      is360se: check(/360/i),
      isIE: function() {
        if (navigator.appName === 'Microsoft Internet Explorer') {
          return true;
        } else if (check(/\bTrident\b/)()) {
          return true;
        } else {
          return false;
        }
      },
      isEdge: check(/\bEdge\b/i),
      isOpera: check(/opera.*\Wpresto\W|OPR/i),
      isSafari: check(/webkit\W(?!.*chrome).*safari\W/i),
      isUCBrowser: check(/ucbrowser/i),
      isBaiduBrowser: check(/bidubrowser/i),
      isSougouBrowser: check(/metasr/i),
      isLiebaoBrowser: check(/lbbrowser/i),

      isMobile: check(/AppleWebKit.*Mobile.*|Mobile/i),
      isWebKit: check(/webkit\W/i),
  
      isWeixin: check(/micromessenger/i),
      isSinaWeibo: check(/weibo/i),
      isQQ: check(/qq/i),
      isQQWeibo: check(/tencentmicroblog/i),

      isFacebook: check(/fban/i),
      isTwitter: check(/twitter/i),
      isInstagram: check(/instagram/i),
    }
  
    if (UA.isMobile()) {
      if (UA.isAndroid()) {
        info.os = 'android'
      } else if (UA.isIOS()) {
        info.os = 'ios'
      }
    } else {
      if (UA.isWindows()) {
        info.os = 'windows'
      } else if (UA.isMac()) {
        info.os = 'mac'
      }
    }

    if (UA.isWeixin()) {
      info.browser = 'weixin'
    } else if (UA.isSinaWeibo()) {
      info.browser = 'weibo_sina'
    } else if (UA.isQQWeibo()) {
      info.browser = 'weibo_qq'
    } else if (UA.isFacebook()) {
      info.browser = 'facebook'
    } else if (UA.isTwitter()) {
      info.browser = 'twitter'
    } else if (UA.isInstagram()) {
      info.browser = 'instagram'
    } else if (UA.isChrome()) {
      info.browser = 'chrome'
    } else if (UA.isFirefox() || UA.isGecko()) {
      info.browser = 'firefox'
    } else if (UA.isIE()) {
      info.browser = 'ie'
    } else if (UA.isEdge()) {
      info.browser = 'edge'
    } else if (UA.isOpera()) {
      info.browser = 'opera'
    } else if (UA.isSafari()) {
      info.browser = 'safari'
    } else if (UA.is360se()) {
      info.browser = '360'
    } else if (UA.isQQ()) {
      info.browser = 'qq'
    } else if (UA.isUCBrowser()) {
      info.browser = 'uc'
    } else if (UA.isBaiduBrowser()) {
      info.browser = 'baidu'
    } else if (UA.isSougouBrowser()) {
      info.browser = 'sougou'
    } else if (UA.isLiebaoBrowser()) {
      info.browser = 'liebao'
    } else if (UA.isWebKit()) {
      info.browser = 'webkit'
    }
  
    return info
  }
})()

export default getEnvInfo