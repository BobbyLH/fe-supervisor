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

    const info = {
      ts: +Date.now(),
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
      isAndroid: check(/android/i),
      isIOS: check(/(ipad|iphone|ipod)/i),
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
  
      isMobile: check(/(iphone|ipod|((?:android)?.*?mobile)|blackberry|nokia)/i),
      isWebKit: check(/webkit\W/i),
  
      isWeixin: check(/micromessenger/i),
      isSinaWeibo: check(/weibo/i),
      isQQ: check(/qq/i),
      isQQWeibo: check(/tencentmicroblog/i)
    }
  
    if (UA.isMobile()) {
      if (UA.isAndroid()) {
        info.os = 'android'
      }
  
      if (UA.isIOS()) {
        info.os = 'ios'
      }
  
      if (UA.isWeixin()) {
        info.browser = 'weixin'
      }
  
      if (UA.isSinaWeibo()) {
        info.browser = 'sinaBlog'
      }
  
      if (UA.isQQ()) {
        info.browser = 'qq'
      }
  
      if (UA.isQQWeibo()) {
        info.browser = 'qqBlog'
      }
  
    } else {
      if (UA.isWindows()) {
        info.os = 'windows'
      }
  
      if (UA.isMac()) {
        info.os = 'mac'
      }
  
      if (UA.isChrome()) {
        info.browser = 'chrome'
      }
  
      if (UA.isFirefox()) {
        info.browser = 'firefox'
      }
  
      if (UA.isIE()) {
        info.browser = 'ie'
      }
  
      if (UA.isOpera()) {
        info.browser = 'opera'
      }
  
      if (UA.isSafari()) {
        info.browser = 'safari'
      }
  
      if (UA.is360se()) {
        info.browser = '360'
      }
    }

    return info
  }
})()
