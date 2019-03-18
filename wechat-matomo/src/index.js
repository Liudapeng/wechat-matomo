 /** **********************************************************
  * Private data
  ************************************************************/

 let expireDateTime

 const sysInfo = wx.getSystemInfoSync()
 const navigatorAlias = {
   userAgent: sysInfo.model + ' ' + sysInfo.language + ' ' + sysInfo.screenWidth + 'x' + sysInfo.screenHeight + ' ' + sysInfo.platform + ' ' + sysInfo.system + ' ' + sysInfo.version,
   platform: sysInfo.platform
 }

 /*
  * Is property defined?
  */
 const isDefined = (property) => {
   // workaround https://github.com/douglascrockford/JSLint/commit/24f63ada2f9d7ad65afc90e6d949f631935c2480
   var propertyType = typeof property

   return propertyType !== 'undefined'
 }

 /*
  * Is property a function?
  */
 const isFunction = (property) => {
   return typeof property === 'function'
 }

 /*
  * Is property a string?
  */
 const isString = (property) => {
   return typeof property === 'string' || property instanceof String
 }

 /*
  * Is property an object?
  *
  * @return bool Returns true if property is null, an Object, or subclass of Object (i.e., an instanceof String, Date, etc.)
  */
 const isObject = (property) => {
   return typeof property === 'object'
 }

 const isObjectEmpty = (property) => {
   if (!property) {
     return true
   }

   var i
   var isEmpty = true
   for (i in property) {
     if (Object.prototype.hasOwnProperty.call(property, i)) {
       isEmpty = false
     }
   }

   return isEmpty
 }

 /**
  * Logs an error in the console.
  *  Note: it does not generate a JavaScript error, so make sure to also generate an error if needed.
  * @param message
  */
 const logConsoleError = (message) => {
   // needed to write it this way for jslint
   var consoleType = typeof console
   if (consoleType !== 'undefined' && console && console.error) {
     console.error(message)
   }
 }

 /*
  * Extract scheme/protocol from URL
  */
 const getProtocolScheme = (url) => {
   var e = new RegExp('^([a-z]+):')
   var matches = e.exec(url)

   return matches ? matches[1] : null
 }

 /*
  * Extract hostname from URL
  */
 const getHostName = (url) => {
   // scheme : // [username [: password] @] hostame [: port] [/ [path] [? query] [# fragment]]
   var e = new RegExp('^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)')
   var matches = e.exec(url)

   return matches ? matches[1] : url
 }

 const removeUrlParameter = (url, name) => {
   url = String(url)

   if (url.indexOf('?' + name + '=') === -1 && url.indexOf('&' + name + '=') === -1) {
     // nothing to remove, url does not contain this parameter
     return url
   }

   var searchPos = url.indexOf('?')
   if (searchPos === -1) {
     // nothing to remove, no query parameters
     return url
   }

   var queryString = url.substr(searchPos + 1)
   var baseUrl = url.substr(0, searchPos)

   if (queryString) {
     var urlHash = ''
     var hashPos = queryString.indexOf('#')
     if (hashPos !== -1) {
       urlHash = queryString.substr(hashPos + 1)
       queryString = queryString.substr(0, hashPos)
     }

     var param
     var paramsArr = queryString.split('&')
     var i = paramsArr.length - 1

     for (i; i >= 0; i--) {
       param = paramsArr[i].split('=')[0]
       if (param === name) {
         paramsArr.splice(i, 1)
       }
     }

     var newQueryString = paramsArr.join('&')

     if (newQueryString) {
       baseUrl = baseUrl + '?' + newQueryString
     }

     if (urlHash) {
       baseUrl += '#' + urlHash
     }
   }

   return baseUrl
 }

 /*
  * Extract parameter from URL
  */
 const getUrlParameter = (url, name) => {
   var regexSearch = '[\\?&#]' + name + '=([^&#]*)'
   var regex = new RegExp(regexSearch)
   var results = regex.exec(url)
   return results ? decodeURIComponent(results[1]) : ''
 }

 const trim = (text) => {
   if (text && String(text) === text) {
     return text.replace(/^\s+|\s+$/g, '')
   }

   return text
 }

 /*
  * UTF-8 encoding
  */
 const utf8_encode = (argString) => {
   return unescape(encodeURIComponent(argString))
 }

 /**
  * object to queryString
  */
 const serialiseObject = (obj) => {
   try {
     const pairs = []
     const ignoreKeys = ['imageurl', 'clockinsum', 'status', 'mark', 'stratumid', 'useranswerid', 'sharemark', 'ald_share_src', 'pklogid', 'weixinadinfo', 'gdt_vid', 'weixinadkey', 'integraladd', 'assignmentid', 'totalnum', 'offsetleft', 'offsettop']
     const ignoreValTypes = ['function', 'undefined', 'object']
     for (const prop in obj) {
       if (!obj.hasOwnProperty(prop)) {
         continue
       }
       if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
         pairs.push(serialiseObject(obj[prop]))
         continue
       }
       if (ignoreKeys.indexOf(prop.toLowerCase()) !== -1) {
         continue
       }
       if (ignoreValTypes.indexOf(typeof obj[prop]) !== -1) {
         continue
       }
       pairs.push(prop + '=' + obj[prop])
     }
     return pairs.filter(item => item !== '').sort().join('&')
   } catch (error) {
     console.error(error)
     return ''
   }
 }

 /*
  * Fix-up domain
  */
 const domainFixup = (domain) => {
   var dl = domain.length

   // remove trailing '.'
   if (domain.charAt(--dl) === '.') {
     domain = domain.slice(0, dl)
   }

   // remove leading '*'
   if (domain.slice(0, 2) === '*.') {
     domain = domain.slice(1)
   }

   if (domain.indexOf('/') !== -1) {
     domain = domain.substr(0, domain.indexOf('/'))
   }

   return domain
 }

 /**
  * page.route path
  */
 const getCurrentPageUrl = () => {
   if (typeof getCurrentPages !== 'function') {
     return ''
   }

   var pages = getCurrentPages() // 获取加载的页面
   var currentPage = pages[pages.length - 1] // 获取当前页面的对象

   if (typeof currentPage.route === 'function') {
     return currentPage.__route__ || ''
   }

   return currentPage.route || ''
 }

 /** **********************************************************
  * sha1
  * - based on sha1 from http://phpjs.org/functions/sha1:512 (MIT / GPL v2)
  ************************************************************/

 const sha1 = (str) => {
   // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
   // + namespaced by: Michael White (http://getsprink.com)
   // +      input by: Brett Zamir (http://brett-zamir.me)
   // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   // +   jslinted by: Anthon Pang (http://piwik.org)

   const rotate_left = (n, s) => {
     return (n << s) | (n >>> (32 - s))
   }

   const cvt_hex = (val) => {
     let strout = ''
     let i
     let v

     for (i = 7; i >= 0; i--) {
       v = (val >>> (i * 4)) & 0x0f
       strout += v.toString(16)
     }

     return strout
   }

   let blockstart
   let i
   let j
   const W = []
   let H0 = 0x67452301
   let H1 = 0xEFCDAB89
   let H2 = 0x98BADCFE
   let H3 = 0x10325476
   let H4 = 0xC3D2E1F0
   let A
   let B
   let C
   let D
   let E
   let temp

   const word_array = []

   str = utf8_encode(str)
   const str_len = str.length

   for (i = 0; i < str_len - 3; i += 4) {
     j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 |
       str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3)
     word_array.push(j)
   }

   switch (str_len & 3) {
     case 0:
       i = 0x080000000
       break
     case 1:
       i = str.charCodeAt(str_len - 1) << 24 | 0x0800000
       break
     case 2:
       i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000
       break
     case 3:
       i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80
       break
   }

   word_array.push(i)

   while ((word_array.length & 15) !== 14) {
     word_array.push(0)
   }

   word_array.push(str_len >>> 29)
   word_array.push((str_len << 3) & 0x0ffffffff)

   for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
     for (i = 0; i < 16; i++) {
       W[i] = word_array[blockstart + i]
     }

     for (i = 16; i <= 79; i++) {
       W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
     }

     A = H0
     B = H1
     C = H2
     D = H3
     E = H4

     for (i = 0; i <= 19; i++) {
       temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff
       E = D
       D = C
       C = rotate_left(B, 30)
       B = A
       A = temp
     }

     for (i = 20; i <= 39; i++) {
       temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff
       E = D
       D = C
       C = rotate_left(B, 30)
       B = A
       A = temp
     }

     for (i = 40; i <= 59; i++) {
       temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff
       E = D
       D = C
       C = rotate_left(B, 30)
       B = A
       A = temp
     }

     for (i = 60; i <= 79; i++) {
       temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff
       E = D
       D = C
       C = rotate_left(B, 30)
       B = A
       A = temp
     }

     H0 = (H0 + A) & 0x0ffffffff
     H1 = (H1 + B) & 0x0ffffffff
     H2 = (H2 + C) & 0x0ffffffff
     H3 = (H3 + D) & 0x0ffffffff
     H4 = (H4 + E) & 0x0ffffffff
   }

   temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4)

   return temp.toLowerCase()
 }

 /** **********************************************************
  * end sha1
  ************************************************************/

 /** **********************************************************
  * Element Visiblility
  * removed
  ************************************************************/

 /** **********************************************************
  * Query
  ************************************************************/

 /** **********************************************************
  * Content Tracking
  * removed
  ************************************************************/

 /** **********************************************************
  * Page Overlay
  * removed
  ************************************************************/

 /** **********************************************************
  * End Page Overlay
  ************************************************************/

 /*
  * Piwik Tracker class
  *
  * trackerUrl and trackerSiteId are optional arguments to the constructor
  *
  * See: Tracker.setTrackerUrl() and Tracker.setSiteId()
  */
 class Tracker {
   /** **********************************************************
    * Private members
    ************************************************************/

   constructor(trackerUrl, siteId) {
     this.configTrackerUrl = trackerUrl
     this.configTrackerSiteId = siteId

     /* <DEBUG>*/
     /*
      * registered test hooks
      */
     this.registeredHooks = {}
     /* </DEBUG>*/

     this.trackerInstance = this

     // constants
     this.CONSENT_COOKIE_NAME = 'mtm_consent'
     this.CONSENT_REMOVED_COOKIE_NAME = 'mtm_consent_removed'

     // Current URL and Referrer URL
     this.locationArray = ''
     this.domainAlias = ''
     this.locationHrefAlias = ''
     this.configReferrerUrl = ''

     this.enableJSErrorTracking = false

     this.defaultRequestMethod = 'POST'

     this.pageScheme = 'mp://'

     // Request method (GET or POST)
     this.configRequestMethod = this.defaultRequestMethod

     this.defaultRequestContentType = 'application/x-www-form-urlencoded; charset=UTF-8'

     // Request Content-Type header value; applicable when POST request method is used for submitting tracking events
     this.configRequestContentType = this.defaultRequestContentType

     // API URL (only set if it differs from the Tracker URL)
     this.configApiUrl = ''

     // This string is appended to the Tracker URL Request (eg. to send data that is not handled by the existing setters/getters)
     this.configAppendToTrackingUrl = ''

     // Visitor UUID
     this.visitorUUID = ''

     // Document URL
     this.configCustomUrl = ''

     // Document title
     this.configTitle = ''

     // Extensions to be treated as download links
     this.configDownloadExtensions = ['7z', 'aac', 'apk', 'arc', 'arj', 'asf', 'asx', 'avi', 'azw3', 'bin', 'csv', 'deb', 'dmg', 'doc', 'docx', 'epub', 'exe', 'flv', 'gif', 'gz', 'gzip', 'hqx', 'ibooks', 'jar', 'jpg', 'jpeg', 'js', 'mobi', 'mp2', 'mp3', 'mp4', 'mpg', 'mpeg', 'mov', 'movie', 'msi', 'msp', 'odb', 'odf', 'odg', 'ods', 'odt', 'ogg', 'ogv', 'pdf', 'phps', 'png', 'ppt', 'pptx', 'qt', 'qtm', 'ra', 'ram', 'rar', 'rpm', 'sea', 'sit', 'tar', 'tbz', 'tbz2', 'bz', 'bz2', 'tgz', 'torrent', 'txt', 'wav', 'wma', 'wmv', 'wpd', 'xls', 'xlsx', 'xml', 'z', 'zip']

     // Hosts or alias(es) to not treat as outlinks
     this.configHostsAlias = [this.domainAlias]

     // HTML anchor element classes to not track
     this.configIgnoreClasses = []

     // HTML anchor element classes to treat as downloads
     this.configDownloadClasses = []

     // HTML anchor element classes to treat at outlinks
     this.configLinkClasses = []

     // Maximum delay to wait for web bug image to be fetched (in milliseconds)
     this.configTrackerPause = 500

     // Minimum visit time after initial page view (in milliseconds)
     this.configMinimumVisitTime = null

     // Disallow hash tags in URL
     this.configDiscardHashTag = null

     // Custom data
     this.configCustomData = null

     // Campaign names
     this.configCampaignNameParameters = ['pk_campaign', 'piwik_campaign', 'utm_campaign', 'utm_source', 'utm_medium']

     // Campaign keywords
     this.configCampaignKeywordParameters = ['pk_kwd', 'piwik_kwd', 'utm_term']

     // First-party cookie name prefix
     this.configCookieNamePrefix = '_pk_'

     // the URL parameter that will store the visitorId if cross domain linking is enabled
     // pk_vid = visitor ID
     // first part of this URL parameter will be 16 char visitor Id.
     // The second part is the 10 char current timestamp and the third and last part will be a 6 characters deviceId
     // timestamp is needed to prevent reusing the visitorId when the URL is shared. The visitorId will be
     // only reused if the timestamp is less than 45 seconds old.
     // deviceId parameter is needed to prevent reusing the visitorId when the URL is shared. The visitorId
     // will be only reused if the device is still the same when opening the link.
     // VDI = visitor device identifier
     this.configVisitorIdUrlParameter = 'pk_vid'

     // Cross domain linking, the visitor ID is transmitted only in the 180 seconds following the click.
     this.configVisitorIdUrlParameterTimeoutInSeconds = 180

     // First-party cookie domain
     // User agent defaults to origin hostname
     this.configCookieDomain = null

     // First-party cookie path
     // Default is user agent defined.
     this.configCookiePath = null

     // Whether to use "Secure" cookies that only work over SSL
     this.configCookieIsSecure = false

     // First-party cookies are disabled
     this.configCookiesDisabled = false

     // Do Not Track
     this.configDoNotTrack = null

     // Count sites which are pre-rendered
     this.configCountPreRendered = null

     // Do we attribute the conversion to the first referrer or the most recent referrer?
     this.configConversionAttributionFirstReferrer = null

     // Life of the visitor cookie (in milliseconds)
     this.configVisitorCookieTimeout = 33955200000 // 13 months (365 days + 28days)

     // Life of the session cookie (in milliseconds)
     this.configSessionCookieTimeout = 1800000 // 30 minutes

     // Life of the referral cookie (in milliseconds)
     this.configReferralCookieTimeout = 15768000000 // 6 months

     // Is performance tracking enabled
     this.configPerformanceTrackingEnabled = true

     // Generation time set from the server
     this.configPerformanceGenerationTime = 0

     // Whether Custom Variables scope "visit" should be stored in a cookie during the time of the visit
     this.configStoreCustomVariablesInCookie = false

     // Custom Variables read from cookie, scope "visit"
     this.customVariables = false

     this.configCustomRequestContentProcessing = null

     // Custom Variables, scope "page"
     this.customVariablesPage = {}

     // Custom Variables, scope "event"
     this.customVariablesEvent = {}

     // Custom Dimensions (can be any scope)
     this.customDimensions = {}

     // Custom Variables names and values are each truncated before being sent in the request or recorded in the cookie
     this.customVariableMaximumLength = 200

     // Ecommerce items
     this.ecommerceItems = {}

     // Browser features via client-side data collection
     this.browserFeatures = {}

     // Keeps track of previously tracked content impressions
     this.trackedContentImpressions = []
     this.isTrackOnlyVisibleContentEnabled = false

     // Guard to prevent empty visits see #6415. If there is a new visitor and the first 2 (or 3 or 4)
     // tracking requests are at nearly same time (eg trackPageView and trackContentImpression) 2 or more
     // visits will be created
     this.timeNextTrackingRequestCanBeExecutedImmediately = false

     // Guard against installing the link tracker more than once per Tracker instance
     this.linkTrackingInstalled = false
     this.linkTrackingEnabled = false
     this.crossDomainTrackingEnabled = false

     // Timestamp of last tracker request sent to Piwik
     this.lastTrackerRequestTime = null

     // Internal state of the pseudo click handler
     this.lastButton = null
     this.lastTarget = null

     // Hash function
     this.hash = sha1

     // Domain hash value
     this.domainHash = null

     this.configIdPageView = null

     // we measure how many pageviews have been tracked so plugins can use it to eg detect if a
     // pageview was already tracked or not
     this.numTrackedPageviews = 0

     this.configCookiesToDelete = ['id', 'ses', 'cvar', 'ref']

     // whether requireConsent() was called or not
     this.configConsentRequired = false

     // we always have the concept of consent. by default consent is assumed unless the end user removes it,
     // or unless a matomo user explicitly requires consent (via requireConsent())
     this.configHasConsent = null // initialized below

     // holds all pending tracking requests that have not been tracked because we need consent
     this.consentRequestsQueue = []

     this.configHasConsent = !this.getCookie(this.CONSENT_REMOVED_COOKIE_NAME)

     this.detectBrowserFeatures()
     this.updateDomainHash()
     //  this.setVisitorIdCookie()

     // User ID
     this.configUserId = this.getCookie(this.getCookieName('user_id'))
   }

   /*
    * Set cookie value
    */
   setCookie = (cookieName, value, msToExpire, path, domain, isSecure) => {
     if (this.configCookiesDisabled) {
       return
     }

     let expiryDate

     // relative time to expire in milliseconds
     if (msToExpire) {
       expiryDate = new Date()
       expiryDate.setTime(expiryDate.getTime() + msToExpire)
     }

     wx.setStorageSync(
       'piwik_' + cookieName,
       encodeURIComponent(value) +
       (msToExpire ? ';' + expiryDate.getTime() : '')
     )
   }

   /*
    * Get cookie value
    */
   getCookie = (cookieName) => {
     if (this.configCookiesDisabled) {
       return 0
     }

     let cookieValue = 0

     try {
       const res = wx.getStorageSync('piwik_' + cookieName)
       if (res) {
         if (res.split(';')[1] < new Date().getTime()) {
           wx.removeStorage({
             key: 'piwik_' + cookieName
           })
         } else {
           cookieValue = decodeURIComponent(res.split(';')[0])
         }
       }
     } catch (e) {}

     return cookieValue
   }

   /*
    * Removes hash tag from the URL
    *
    * URLs are purified before being recorded in the cookie,
    * or before being sent as GET parameters
    */
   purify = (url) => {
     var targetPattern

     // we need to remove this parameter here, they wouldn't be removed in Piwik tracker otherwise eg
     // for outlinks or referrers
     url = removeUrlParameter(url, this.configVisitorIdUrlParameter)

     if (this.configDiscardHashTag) {
       targetPattern = new RegExp('#.*')

       return url.replace(targetPattern, '')
     }

     return url
   }

   /*
    * Resolve relative reference
    *
    * Note: not as described in rfc3986 section 5.2
    */
   resolveRelativeReference = (baseUrl, url) => {
     const protocol = getProtocolScheme(url)
     let i

     if (protocol) {
       return url
     }

     if (url.slice(0, 1) === '/') {
       return getProtocolScheme(baseUrl) + '://' + getHostName(baseUrl) + url
     }

     baseUrl = this.purify(baseUrl)

     i = baseUrl.indexOf('?')
     if (i >= 0) {
       baseUrl = baseUrl.slice(0, i)
     }

     i = baseUrl.lastIndexOf('/')
     if (i !== baseUrl.length - 1) {
       baseUrl = baseUrl.slice(0, i + 1)
     }

     return baseUrl + url
   }

   /*
    * Is the host local? (i.e., not an outlink)
    */
   isSiteHostName(hostName) {
     var i,
       alias,
       offset

     for (i = 0; i < this.configHostsAlias.length; i++) {
       alias = domainFixup(this.configHostsAlias[i].toLowerCase())

       if (hostName === alias) {
         return true
       }

       if (alias.slice(0, 1) === '.') {
         if (hostName === alias.slice(1)) {
           return true
         }

         offset = hostName.length - alias.length

         if ((offset > 0) && (hostName.slice(offset) === alias)) {
           return true
         }
       }
     }

     return false
   }

   /*
    * Send image request to Piwik server using GET.
    * The infamous web bug (or beacon) is a transparent, single pixel (1x1) image
    */
   getImage = (request, callback) => {
     // make sure to actually load an image so callback gets invoked
     request = request.replace('send_image=0', 'send_image=1')

     var image = new Image(1, 1)
     image.onload = () => {
       if (typeof callback === 'function') {
         callback()
       }
     }
     image.src = this.configTrackerUrl + (this.configTrackerUrl.indexOf('?') < 0 ? '?' : '&') + request
   }

   /*
    * POST request to Piwik server using XMLHttpRequest.
    */
   sendXmlHttpRequest = (request, callback, fallbackToGet) => {
     if (!isDefined(fallbackToGet) || fallbackToGet === null) {
       fallbackToGet = true
     }

     setTimeout(() => {
       wx.request({
         url: this.configTrackerUrl + (this.configRequestMethod.toLowerCase() === 'GET' ? '?' + request : ''),
         data: request,
         method: this.configRequestMethod,
         header: {
           'content-type': this.configRequestContentType // 默认值
         },
         success(res) {
           callback && callback()
         },
         fail(res) {
           console.log('request fail', wx.request)
         }
       })
     }, 50)
   }

   setExpireDateTime = (delay) => {
     var now = new Date()
     var time = now.getTime() + delay

     if (!expireDateTime || time > expireDateTime) {
       expireDateTime = time
     }
   }

   makeSureThereIsAGapAfterFirstTrackingRequestToPreventMultipleVisitorCreation(callback) {
     var now = new Date()
     var timeNow = now.getTime()

     this.lastTrackerRequestTime = timeNow

     if (this.timeNextTrackingRequestCanBeExecutedImmediately && timeNow < this.timeNextTrackingRequestCanBeExecutedImmediately) {
       // we are in the time frame shortly after the first request. we have to delay this request a bit to make sure
       // a visitor has been created meanwhile.

       var timeToWait = this.timeNextTrackingRequestCanBeExecutedImmediately - timeNow

       setTimeout(callback, timeToWait)
       this.setExpireDateTime(timeToWait + 50) // set timeout is not necessarily executed at timeToWait so delay a bit more
       this.timeNextTrackingRequestCanBeExecutedImmediately += 50 // delay next tracking request by further 50ms to next execute them at same time

       return
     }

     if (this.timeNextTrackingRequestCanBeExecutedImmediately === false) {
       // it is the first request, we want to execute this one directly and delay all the next one(s) within a delay.
       // All requests after this delay can be executed as usual again
       var delayInMs = 800
       this.timeNextTrackingRequestCanBeExecutedImmediately = timeNow + delayInMs
     }

     callback()
   }

   /*
    * Send request
    */
   sendRequest = (request, delay, callback) => {
     if (!this.configHasConsent) {
       this.consentRequestsQueue.push(request)
       return
     }
     if (!this.configDoNotTrack && request) {
       if (this.configConsentRequired && this.configHasConsent) { // send a consent=1 when explicit consent is given for the apache logs
         request += '&consent=1'
       }

       this.makeSureThereIsAGapAfterFirstTrackingRequestToPreventMultipleVisitorCreation(() => {
         this.sendXmlHttpRequest(request, callback)
         this.setExpireDateTime(delay)
       })
     }
   }

   canSendBulkRequest = (requests) => {
     if (this.configDoNotTrack) {
       return false
     }

     return (requests && requests.length)
   }

   /*
    * Send requests using bulk
    */
   sendBulkRequest = (requests, delay) => {
     if (!this.canSendBulkRequest(requests)) {
       return
     }

     if (!this.configHasConsent) {
       this.consentRequestsQueue.push(requests)
       return
     }

     var bulk = '{"requests":["?' + requests.join('","?') + '"]}'

     this.makeSureThereIsAGapAfterFirstTrackingRequestToPreventMultipleVisitorCreation(() => {
       this.sendXmlHttpRequest(bulk, null, false)
       this.setExpireDateTime(delay)
     })
   }

   /*
    * Get cookie name with prefix and domain hash
    */
   getCookieName = (baseName) => {
     // NOTE: If the cookie name is changed, we must also update the PiwikTracker.php which
     // will attempt to discover first party cookies. eg. See the PHP Client method getVisitorId()
     return this.configCookieNamePrefix + baseName + '.' + this.configTrackerSiteId + '.' + this.domainHash
   }

   /*
    * Update domain hash
    */
   updateDomainHash = () => {
     this.domainHash = this.hash((this.configCookieDomain || this.domainAlias) + (this.configCookiePath || '/')).slice(0, 4) // 4 hexits = 16 bits
   }

   /*
    * Inits the custom variables object
    */
   getCustomVariablesFromCookie = () => {
     const cookieName = this.getCookieName('cvar')
     let cookie = this.getCookie(cookieName)

     if (cookie.length) {
       cookie = JSON.parse(cookie)

       if (isObject(cookie)) {
         return cookie
       }
     }

     return {}
   }

   /*
    * Lazy loads the custom variables from the cookie, only once during this page view
    */
   loadCustomVariables = () => {
     if (this.customVariables === false) {
       this.customVariables = this.getCustomVariablesFromCookie()
     }
   }

   /*
    * Generate a pseudo-unique ID to fingerprint this user
    * 16 hexits = 64 bits
    * note: this isn't a RFC4122-compliant UUID
    */
   generateRandomUuid = () => {
     return this.hash(
       (navigatorAlias.userAgent || '') +
       (navigatorAlias.platform || '') +
       JSON.stringify(this.browserFeatures) +
       (new Date()).getTime() +
       Math.random()
     ).slice(0, 16)
   }

   generateBrowserSpecificId = () => {
     return this.hash(
       (navigatorAlias.userAgent || '') +
       (navigatorAlias.platform || '') +
       JSON.stringify(this.browserFeatures)).slice(0, 6)
   }

   getCurrentTimestampInSeconds = () => {
     return Math.floor((new Date()).getTime() / 1000)
   }

   makeCrossDomainDeviceId = () => {
     var timestamp = this.getCurrentTimestampInSeconds()
     var browserId = this.generateBrowserSpecificId()
     var deviceId = String(timestamp) + browserId

     return deviceId
   }

   isSameCrossDomainDevice(deviceIdFromUrl) {
     deviceIdFromUrl = String(deviceIdFromUrl)

     var thisBrowserId = this.generateBrowserSpecificId()
     var lengthBrowserId = thisBrowserId.length

     var browserIdInUrl = deviceIdFromUrl.substr(-1 * lengthBrowserId, lengthBrowserId)
     var timestampInUrl = parseInt(deviceIdFromUrl.substr(0, deviceIdFromUrl.length - lengthBrowserId), 10)

     if (timestampInUrl && browserIdInUrl && browserIdInUrl === thisBrowserId) {
       // we only reuse visitorId when used on same device / browser

       var currentTimestampInSeconds = this.getCurrentTimestampInSeconds()

       if (this.configVisitorIdUrlParameterTimeoutInSeconds <= 0) {
         return true
       }
       if (currentTimestampInSeconds >= timestampInUrl &&
         currentTimestampInSeconds <= (timestampInUrl + this.configVisitorIdUrlParameterTimeoutInSeconds)) {
         // we only use visitorId if it was generated max 180 seconds ago
         return true
       }
     }

     return false
   }

   getVisitorIdFromUrl(url) {
     if (!this.crossDomainTrackingEnabled) {
       return ''
     }

     // problem different timezone or when the time on the computer is not set correctly it may re-use
     // the same visitorId again. therefore we also have a factor like hashed user agent to reduce possible
     // activation of a visitorId on other device
     var visitorIdParam = getUrlParameter(url, this.configVisitorIdUrlParameter)

     if (!visitorIdParam) {
       return ''
     }

     visitorIdParam = String(visitorIdParam)

     var pattern = new RegExp('^[a-zA-Z0-9]+$')

     if (visitorIdParam.length === 32 && pattern.test(visitorIdParam)) {
       var visitorDevice = visitorIdParam.substr(16, 32)

       if (this.isSameCrossDomainDevice(visitorDevice)) {
         var visitorId = visitorIdParam.substr(0, 16)
         return visitorId
       }
     }

     return ''
   }

   /*
    * Load visitor ID cookie
    */
   loadVisitorIdCookie = () => {
     if (!this.visitorUUID) {
       // we are using locationHrefAlias and not currentUrl on purpose to for sure get the passed URL parameters
       // from original URL
       this.visitorUUID = this.getVisitorIdFromUrl(this.locationHrefAlias)
     }

     const now = new Date()
     const nowTs = Math.round(now.getTime() / 1000)
     const visitorIdCookieName = this.getCookieName('id')
     const id = this.getCookie(visitorIdCookieName)
     let cookieValue
     let uuid

     // Visitor ID cookie found
     if (id) {
       cookieValue = id.split('.')

       // returning visitor flag
       cookieValue.unshift('0')

       if (this.visitorUUID.length) {
         cookieValue[1] = this.visitorUUID
       }
       return cookieValue
     }

     if (this.visitorUUID.length) {
       uuid = this.visitorUUID
     } else {
       uuid = this.generateRandomUuid()
     }

     // No visitor ID cookie, let's create a new one
     cookieValue = [
       // new visitor
       '1',

       // uuid
       uuid,

       // creation timestamp - seconds since Unix epoch
       nowTs,

       // visitCount - 0 = no previous visit
       0,

       // current visit timestamp
       nowTs,

       // last visit timestamp - blank = no previous visit
       '',

       // last ecommerce order timestamp
       ''
     ]

     return cookieValue
   }

   /**
    * Loads the Visitor ID cookie and returns a named array of values
    */
   getValuesFromVisitorIdCookie = () => {
     const cookieVisitorIdValue = this.loadVisitorIdCookie()
     const newVisitor = cookieVisitorIdValue[0]
     const uuid = cookieVisitorIdValue[1]
     const createTs = cookieVisitorIdValue[2]
     const visitCount = cookieVisitorIdValue[3]
     const currentVisitTs = cookieVisitorIdValue[4]
     const lastVisitTs = cookieVisitorIdValue[5]

     // case migrating from pre-1.5 cookies
     if (!isDefined(cookieVisitorIdValue[6])) {
       cookieVisitorIdValue[6] = ''
     }

     var lastEcommerceOrderTs = cookieVisitorIdValue[6]

     return {
       newVisitor: newVisitor,
       uuid: uuid,
       createTs: createTs,
       visitCount: visitCount,
       currentVisitTs: currentVisitTs,
       lastVisitTs: lastVisitTs,
       lastEcommerceOrderTs: lastEcommerceOrderTs
     }
   }

   getRemainingVisitorCookieTimeout = () => {
     const now = new Date()
     const nowTs = now.getTime()
     const cookieCreatedTs = this.getValuesFromVisitorIdCookie().createTs

     const createTs = parseInt(cookieCreatedTs, 10)
     const originalTimeout = (createTs * 1000) + this.configVisitorCookieTimeout - nowTs
     return originalTimeout
   }

   /*
    * Sets the Visitor ID cookie
    */
   setVisitorIdCookie(visitorIdCookieValues) {
     if (!this.configTrackerSiteId) {
       // when called before Site ID was set
       return
     }

     const now = new Date()
     const nowTs = Math.round(now.getTime() / 1000)

     if (!isDefined(visitorIdCookieValues)) {
       visitorIdCookieValues = this.getValuesFromVisitorIdCookie()
     }

     var cookieValue = visitorIdCookieValues.uuid + '.' +
       visitorIdCookieValues.createTs + '.' +
       visitorIdCookieValues.visitCount + '.' +
       nowTs + '.' +
       visitorIdCookieValues.lastVisitTs + '.' +
       visitorIdCookieValues.lastEcommerceOrderTs

     this.setCookie(this.getCookieName('id'), cookieValue, this.getRemainingVisitorCookieTimeout(), this.configCookiePath, this.configCookieDomain, this.configCookieIsSecure)
   }

   /*
    * Loads the referrer attribution information
    *
    * @returns array
    *  0: campaign name
    *  1: campaign keyword
    *  2: timestamp
    *  3: raw URL
    */
   loadReferrerAttributionCookie = () => {
     // NOTE: if the format of the cookie changes,
     // we must also update JS tests, PHP tracker, System tests,
     // and notify other tracking clients (eg. Java) of the changes
     var cookie = this.getCookie(this.getCookieName('ref'))

     if (cookie.length) {
       try {
         cookie = JSON.parse(cookie)
         if (isObject(cookie)) {
           return cookie
         }
       } catch (ignore) {
         // Pre 1.3, this cookie was not JSON encoded
       }
     }

     return [
       '',
       '',
       0,
       ''
     ]
   }

   deleteCookie(cookieName, path, domain) {
     this.setCookie(cookieName, '', -86400, path, domain)
   }

   isPossibleToSetCookieOnDomain(domainToTest) {
     var valueToSet = 'testvalue'
     this.setCookie('test', valueToSet, 10000, null, domainToTest)

     if (this.getCookie('test') === valueToSet) {
       this.deleteCookie('test', null, domainToTest)

       return true
     }

     return false
   }

   deleteCookies = () => {
     var savedConfigCookiesDisabled = this.configCookiesDisabled

     // Temporarily allow cookies just to delete the existing ones
     this.configCookiesDisabled = false

     var index, cookieName

     for (index = 0; index < this.configCookiesToDelete.length; index++) {
       cookieName = this.getCookieName(this.configCookiesToDelete[index])
       if (cookieName !== this.CONSENT_REMOVED_COOKIE_NAME && cookieName !== this.CONSENT_COOKIE_NAME && this.getCookie(cookieName) !== 0) {
         this.deleteCookie(cookieName, this.configCookiePath, this.configCookieDomain)
       }
     }

     this.configCookiesDisabled = savedConfigCookiesDisabled
   }

   setSiteId(siteId) {
     this.configTrackerSiteId = siteId
     this.setVisitorIdCookie()
   }

   sortObjectByKeys(value) {
     if (!value || !isObject(value)) {
       return
     }

     // Object.keys(value) is not supported by all browsers, we get the keys manually
     var keys = []
     var key

     for (key in value) {
       if (Object.prototype.hasOwnProperty.call(value, key)) {
         keys.push(key)
       }
     }

     var normalized = {}
     keys.sort()
     var len = keys.length
     var i

     for (i = 0; i < len; i++) {
       normalized[keys[i]] = value[keys[i]]
     }

     return normalized
   }

   generateUniqueId = () => {
     var id = ''
     var chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
     var charLen = chars.length
     var i

     for (i = 0; i < 6; i++) {
       id += chars.charAt(Math.floor(Math.random() * charLen))
     }

     return id
   }

   /**
    * Returns the URL to call piwik.php,
    * with the standard parameters (plugins, resolution, url, referrer, etc.).
    * Sends the pageview and browser settings with every request in case of race conditions.
    */
   getRequest = (request, customData, pluginMethod, currentEcommerceOrderTs) => {
     let i
     const now = new Date()
     const nowTs = Math.round(now.getTime() / 1000)
     let referralTs
     let referralUrl
     const referralUrlMaxLength = 1024
     let currentReferrerHostName
     let originalReferrerHostName
     const customVariablesCopy = this.customVariables
     const cookieSessionName = this.getCookieName('ses')
     const cookieReferrerName = this.getCookieName('ref')
     const cookieCustomVariablesName = this.getCookieName('cvar')
     const cookieSessionValue = this.getCookie(cookieSessionName)
     let attributionCookie = this.loadReferrerAttributionCookie()
     const currentUrl = this.configCustomUrl || this.locationHrefAlias
     let campaignNameDetected
     let campaignKeywordDetected

     if (this.configCookiesDisabled) {
       this.deleteCookies()
     }

     if (this.configDoNotTrack) {
       return ''
     }

     var cookieVisitorIdValues = this.getValuesFromVisitorIdCookie()
     if (!isDefined(currentEcommerceOrderTs)) {
       currentEcommerceOrderTs = ''
     }

     // send charset if document charset is not utf-8. sometimes encoding
     // of urls will be the same as this and not utf-8, which will cause problems
     // do not send charset if it is utf8 since it's assumed by default in Piwik
     var charSet = null

     campaignNameDetected = attributionCookie[0]
     campaignKeywordDetected = attributionCookie[1]
     referralTs = attributionCookie[2]
     referralUrl = attributionCookie[3]

     if (!cookieSessionValue) {
       // cookie 'ses' was not found: we consider this the start of a 'session'

       // here we make sure that if 'ses' cookie is deleted few times within the visit
       // and so this code path is triggered many times for one visit,
       // we only increase visitCount once per Visit window (default 30min)
       var visitDuration = this.configSessionCookieTimeout / 1000
       if (!cookieVisitorIdValues.lastVisitTs || (nowTs - cookieVisitorIdValues.lastVisitTs) > visitDuration) {
         cookieVisitorIdValues.visitCount++
         cookieVisitorIdValues.lastVisitTs = cookieVisitorIdValues.currentVisitTs
       }

       // Detect the campaign information from the current URL
       // Only if campaign wasn't previously set
       // Or if it was set but we must attribute to the most recent one
       // Note: we are working on the currentUrl before purify() since we can parse the campaign parameters in the hash tag
       if (!this.configConversionAttributionFirstReferrer ||
         !campaignNameDetected.length) {
         for (i in this.configCampaignNameParameters) {
           if (Object.prototype.hasOwnProperty.call(this.configCampaignNameParameters, i)) {
             campaignNameDetected = getUrlParameter(currentUrl, this.configCampaignNameParameters[i])
             if (campaignNameDetected.length) {
               break
             }
           }
         }

         for (i in this.configCampaignKeywordParameters) {
           if (Object.prototype.hasOwnProperty.call(this.configCampaignKeywordParameters, i)) {
             campaignKeywordDetected = getUrlParameter(currentUrl, this.configCampaignKeywordParameters[i])
             if (campaignKeywordDetected.length) {
               break
             }
           }
         }
       }

       // Store the referrer URL and time in the cookie;
       // referral URL depends on the first or last referrer attribution
       currentReferrerHostName = getHostName(this.configReferrerUrl)
       originalReferrerHostName = referralUrl.length ? getHostName(referralUrl) : ''

       if (currentReferrerHostName.length && // there is a referrer
         !this.isSiteHostName(currentReferrerHostName) && // domain is not the current domain
         (!this.configConversionAttributionFirstReferrer || // attribute to last known referrer
           !originalReferrerHostName.length || // previously empty
           this.isSiteHostName(originalReferrerHostName))) { // previously set but in current domain
         referralUrl = this.configReferrerUrl
       }

       // Set the referral cookie if we have either a Referrer URL, or detected a Campaign (or both)
       if (referralUrl.length ||
         campaignNameDetected.length) {
         referralTs = nowTs
         attributionCookie = [
           campaignNameDetected,
           campaignKeywordDetected,
           referralTs,
           this.purify(referralUrl.slice(0, referralUrlMaxLength))
         ]

         this.setCookie(cookieReferrerName, JSON.stringify(attributionCookie), this.configReferralCookieTimeout, this.configCookiePath, this.configCookieDomain)
       }
     }

     // build out the rest of the request
     request += '&idsite=' + this.configTrackerSiteId +
       '&rec=1' +
       '&r=' + String(Math.random()).slice(2, 8) + // keep the string to a minimum
       '&h=' + now.getHours() + '&m=' + now.getMinutes() + '&s=' + now.getSeconds() +
       '&url=' + encodeURIComponent(this.purify(currentUrl)) +
       (this.configReferrerUrl.length ? '&urlref=' + encodeURIComponent(this.purify(this.configReferrerUrl)) : '') +
       ((this.configUserId && this.configUserId.length) ? '&uid=' + encodeURIComponent(this.configUserId) : '') +
       '&_id=' + cookieVisitorIdValues.uuid + '&_idts=' + cookieVisitorIdValues.createTs + '&_idvc=' + cookieVisitorIdValues.visitCount +
       '&_idn=' + cookieVisitorIdValues.newVisitor + // currently unused
       '&new_visit=' + cookieVisitorIdValues.newVisitor +
       (campaignNameDetected.length ? '&_rcn=' + encodeURIComponent(campaignNameDetected) : '') +
       (campaignKeywordDetected.length ? '&_rck=' + encodeURIComponent(campaignKeywordDetected) : '') +
       '&_refts=' + referralTs +
       '&_viewts=' + cookieVisitorIdValues.lastVisitTs +
       (String(cookieVisitorIdValues.lastEcommerceOrderTs).length ? '&_ects=' + cookieVisitorIdValues.lastEcommerceOrderTs : '') +
       (String(referralUrl).length ? '&_ref=' + encodeURIComponent(this.purify(referralUrl.slice(0, referralUrlMaxLength))) : '') +
       (charSet ? '&cs=' + encodeURIComponent(charSet) : '') +
       '&send_image=0'

     // browser features
     for (i in this.browserFeatures) {
       if (Object.prototype.hasOwnProperty.call(this.browserFeatures, i)) {
         request += '&' + i + '=' + this.browserFeatures[i]
       }
     }

     var customDimensionIdsAlreadyHandled = []
     if (customData) {
       for (i in customData) {
         if (Object.prototype.hasOwnProperty.call(customData, i) && /^dimension\d+$/.test(i)) {
           var index = i.replace('dimension', '')
           customDimensionIdsAlreadyHandled.push(parseInt(index, 10))
           customDimensionIdsAlreadyHandled.push(String(index))
           request += '&' + i + '=' + customData[i]
           delete customData[i]
         }
       }
     }

     if (customData && isObjectEmpty(customData)) {
       customData = null
       // we deleted all keys from custom data
     }

     // custom dimensions
     for (i in this.customDimensions) {
       if (Object.prototype.hasOwnProperty.call(this.customDimensions, i)) {
         var isNotSetYet = (customDimensionIdsAlreadyHandled.indexOf(i) === -1)
         if (isNotSetYet) {
           request += '&dimension' + i + '=' + this.customDimensions[i]
         }
       }
     }

     // custom data
     if (customData) {
       request += '&data=' + encodeURIComponent(JSON.stringify(customData))
     } else if (this.configCustomData) {
       request += '&data=' + encodeURIComponent(JSON.stringify(this.configCustomData))
     }

     // Custom Variables, scope "page"
     const appendCustomVariablesToRequest = (customVariables, parameterName) => {
       var customVariablesStringified = JSON.stringify(customVariables)
       if (customVariablesStringified.length > 2) {
         return '&' + parameterName + '=' + encodeURIComponent(customVariablesStringified)
       }
       return ''
     }

     var sortedCustomVarPage = this.sortObjectByKeys(this.customVariablesPage)
     var sortedCustomVarEvent = this.sortObjectByKeys(this.customVariablesEvent)

     request += appendCustomVariablesToRequest(sortedCustomVarPage, 'cvar')
     request += appendCustomVariablesToRequest(sortedCustomVarEvent, 'e_cvar')

     // Custom Variables, scope "visit"
     if (this.customVariables) {
       request += appendCustomVariablesToRequest(this.customVariables, '_cvar')

       // Don't save deleted custom variables in the cookie
       for (i in customVariablesCopy) {
         if (Object.prototype.hasOwnProperty.call(customVariablesCopy, i)) {
           if (this.customVariables[i][0] === '' || this.customVariables[i][1] === '') {
             delete this.customVariables[i]
           }
         }
       }

       if (this.configStoreCustomVariablesInCookie) {
         this.setCookie(cookieCustomVariablesName, JSON.stringify(this.customVariables), this.configSessionCookieTimeout, this.configCookiePath, this.configCookieDomain)
       }
     }

     // performance tracking
     if (this.configPerformanceTrackingEnabled) {
       if (this.configPerformanceGenerationTime) {
         request += '&gt_ms=' + this.configPerformanceGenerationTime
       }

       //    else if (performance && performance.timing &&
       //      performance.timing.requestStart && performance.timing.responseEnd) {
       //      request += '&gt_ms=' + (performance.timing.responseEnd - performance.timing.requestStart)
       //    }
     }

     if (this.configIdPageView) {
       request += '&pv_id=' + this.configIdPageView
     }

     // update cookies
     cookieVisitorIdValues.lastEcommerceOrderTs = isDefined(currentEcommerceOrderTs) && String(currentEcommerceOrderTs).length ? currentEcommerceOrderTs : cookieVisitorIdValues.lastEcommerceOrderTs
     this.setVisitorIdCookie(cookieVisitorIdValues)
     this.setCookie(this.getCookieName('ses'), '*', this.configSessionCookieTimeout, this.configCookiePath, this.configCookieDomain, this.configCookieIsSecure)

     if (this.configAppendToTrackingUrl.length) {
       request += '&' + this.configAppendToTrackingUrl
     }

     if (isFunction(this.configCustomRequestContentProcessing)) {
       request = this.configCustomRequestContentProcessing(request)
     }

     return request
   }

   logEcommerce(orderId, grandTotal, subTotal, tax, shipping, discount) {
     let request = 'idgoal=0'
     let lastEcommerceOrderTs
     const now = new Date()
     const items = []
     let sku
     const isEcommerceOrder = String(orderId).length

     if (isEcommerceOrder) {
       request += '&ec_id=' + encodeURIComponent(orderId)
       // Record date of order in the visitor cookie
       lastEcommerceOrderTs = Math.round(now.getTime() / 1000)
     }

     request += '&revenue=' + grandTotal

     if (String(subTotal).length) {
       request += '&ec_st=' + subTotal
     }

     if (String(tax).length) {
       request += '&ec_tx=' + tax
     }

     if (String(shipping).length) {
       request += '&ec_sh=' + shipping
     }

     if (String(discount).length) {
       request += '&ec_dt=' + discount
     }

     if (this.ecommerceItems) {
       // Removing the SKU index in the array before JSON encoding
       for (sku in this.ecommerceItems) {
         if (Object.prototype.hasOwnProperty.call(this.ecommerceItems, sku)) {
           // Ensure name and category default to healthy value
           if (!isDefined(this.ecommerceItems[sku][1])) {
             this.ecommerceItems[sku][1] = ''
           }

           if (!isDefined(this.ecommerceItems[sku][2])) {
             this.ecommerceItems[sku][2] = ''
           }

           // Set price to zero
           if (!isDefined(this.ecommerceItems[sku][3]) ||
             String(this.ecommerceItems[sku][3]).length === 0) {
             this.ecommerceItems[sku][3] = 0
           }

           // Set quantity to 1
           if (!isDefined(this.ecommerceItems[sku][4]) ||
             String(this.ecommerceItems[sku][4]).length === 0) {
             this.ecommerceItems[sku][4] = 1
           }

           items.push(this.ecommerceItems[sku])
         }
       }
       request += '&ec_items=' + encodeURIComponent(JSON.stringify(items))
     }
     request = this.getRequest(request, this.configCustomData, 'ecommerce', lastEcommerceOrderTs)
     this.sendRequest(request, this.configTrackerPause)

     if (isEcommerceOrder) {
       this.ecommerceItems = {}
     }
   }

   logEcommerceOrder(orderId, grandTotal, subTotal, tax, shipping, discount) {
     if (String(orderId).length &&
       isDefined(grandTotal)) {
       this.logEcommerce(orderId, grandTotal, subTotal, tax, shipping, discount)
     }
   }

   logEcommerceCartUpdate(grandTotal) {
     if (isDefined(grandTotal)) {
       this.logEcommerce('', grandTotal, '', '', '', '')
     }
   }

   /*
    * Log the page view / visit
    */
   logPageView = (customTitle, customData, callback) => {
     this.configIdPageView = this.generateUniqueId()

     var request = this.getRequest('action_name=' + encodeURIComponent(customTitle || this.configTitle), customData, 'log')

     this.sendRequest(request, this.configTrackerPause, callback)
   }

   startsUrlWithTrackerUrl(url) {
     return (this.configTrackerUrl && url && String(url).indexOf(this.configTrackerUrl) === 0)
   }

   buildEventRequest = (category, action, name, value) => {
     return 'e_c=' + encodeURIComponent(category) +
       '&e_a=' + encodeURIComponent(action) +
       (isDefined(name) ? '&e_n=' + encodeURIComponent(name) : '') +
       (isDefined(value) ? '&e_v=' + encodeURIComponent(value) : '')
   }

   /*
    * Log the event
    */
   logEvent = (category, action, name, value, customData, callback) => {
     // Category and Action are required parameters
     if (trim(String(category)).length === 0 || trim(String(action)).length === 0) {
       logConsoleError('Error while logging event: Parameters `category` and `action` must not be empty or filled with whitespaces')
       return false
     }
     var request = this.getRequest(
       this.buildEventRequest(category, action, name, value),
       customData,
       'event'
     )

     this.sendRequest(request, this.configTrackerPause, callback)
   }

   /*
    * Log the site search request
    */
   logSiteSearch(keyword, category, resultsCount, customData) {
     var request = this.getRequest('search=' + encodeURIComponent(keyword) +
       (category ? '&search_cat=' + encodeURIComponent(category) : '') +
       (isDefined(resultsCount) ? '&search_count=' + resultsCount : ''), customData, 'sitesearch')

     this.sendRequest(request, this.configTrackerPause)
   }

   /*
    * Log the goal with the server
    */
   logGoal(idGoal, customRevenue, customData) {
     var request = this.getRequest('idgoal=' + idGoal + (customRevenue ? '&revenue=' + customRevenue : ''), customData, 'goal')

     this.sendRequest(request, this.configTrackerPause)
   }

   /*
    * Log the link or click with the server
    */
   logLink(url, linkType, customData, callback, sourceElement) {
     var linkParams = linkType + '=' + encodeURIComponent(this.purify(url))

     var interaction = this.getContentInteractionToRequestIfPossible(sourceElement, 'click', url)

     if (interaction) {
       linkParams += '&' + interaction
     }

     var request = this.getRequest(linkParams, customData, 'link')

     this.sendRequest(request, this.configTrackerPause, callback)
   }

   /*
    * Browser prefix
    */
   prefixPropertyName(prefix, propertyName) {
     if (prefix !== '') {
       return prefix + propertyName.charAt(0).toUpperCase() + propertyName.slice(1)
     }

     return propertyName
   }

   /*
    * Check for pre-rendered web pages, and log the page view/link/goal
    * according to the configuration and/or visibility
    *
    * @see http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/PageVisibility/Overview.html
    */
   trackCallback(callback) {
     callback()
   }

   getCrossDomainVisitorId = () => {
     var visitorId = this.getValuesFromVisitorIdCookie().uuid
     var deviceId = this.makeCrossDomainDeviceId()
     return visitorId + deviceId
   }

   /*
    * Browser features (plugins, resolution, cookies)
    */
   detectBrowserFeatures = () => {
     this.browserFeatures.java = '0'
     this.browserFeatures.gears = '0'
     // other browser features
     this.browserFeatures.cookie = '0'
     var width = parseInt(sysInfo.screenWidth, 10)
     var height = parseInt(sysInfo.screenHeight, 10)
     this.browserFeatures.res = parseInt(width, 10) + 'x' + parseInt(height, 10)
   }

   /** **********************************************************
    * Constructor
    ************************************************************/

   /*
    * initialize tracker
    */

   /** **********************************************************
    * Public data and methods
    ************************************************************/

   /**
    * Get visitor ID (from first party cookie)
    *
    * @return string Visitor ID in hexits (or empty string, if not yet known)
    */
   getVisitorId = () => {
     return this.getValuesFromVisitorIdCookie().uuid
   }

   /**
    * Get the visitor information (from first party cookie)
    *
    * @return array
    */
   getVisitorInfo = () => {
     // Note: in a new method, we could return also return getValuesFromVisitorIdCookie()
     //       which returns named parameters rather than returning integer indexed array
     return this.loadVisitorIdCookie()
   }

   /**
    * Get the Attribution information, which is an array that contains
    * the Referrer used to reach the site as well as the campaign name and keyword
    * It is useful only when used in conjunction with Tracker API function setAttributionInfo()
    * To access specific data point, you should use the other functions getAttributionReferrer* and getAttributionCampaign*
    *
    * @return array Attribution array, Example use:
    *   1) Call JSON.stringify(piwikTracker.getAttributionInfo())
    *   2) Pass this json encoded string to the Tracking API (php or java client): setAttributionInfo()
    */
   getAttributionInfo = () => {
     return this.loadReferrerAttributionCookie()
   }

   /**
    * Get the Campaign name that was parsed from the landing page URL when the visitor
    * landed on the site originally
    *
    * @return string
    */
   getAttributionCampaignName = () => {
     return this.loadReferrerAttributionCookie()[0]
   }

   /**
    * Get the Campaign keyword that was parsed from the landing page URL when the visitor
    * landed on the site originally
    *
    * @return string
    */
   getAttributionCampaignKeyword = () => {
     return this.loadReferrerAttributionCookie()[1]
   }

   /**
    * Get the time at which the referrer (used for Goal Attribution) was detected
    *
    * @return int Timestamp or 0 if no referrer currently set
    */
   getAttributionReferrerTimestamp = () => {
     return this.loadReferrerAttributionCookie()[2]
   }

   /**
    * Get the full referrer URL that will be used for Goal Attribution
    *
    * @return string Raw URL, or empty string '' if no referrer currently set
    */
   getAttributionReferrerUrl = () => {
     return this.loadReferrerAttributionCookie()[3]
   }

   /**
    * Specify the Piwik tracking URL
    *
    * @param string trackerUrl
    */
   setTrackerUrl = function(trackerUrl) {
     this.configTrackerUrl = trackerUrl
   }

   /**
    * Returns the Piwik tracking URL
    * @returns string
    */
   getTrackerUrl = () => {
     return this.configTrackerUrl
   }

   /**
    * Returns the Piwik server URL.
    *
    * @returns string
    */
   getPiwikUrl = () => {
     return this.getTrackerUrl()
   }

   /**
    * Returns the site ID
    *
    * @returns int
    */
   getSiteId = () => {
     return this.configTrackerSiteId
   }

   /**
    * Clears the User ID and generates a new visitor id.
    */
   resetUserId = () => {
     this.configUserId = ''
     this.deleteCookie(this.getCookieName('user_id'), '', '')
   }

   /**
    * Sets a User ID to this user (such as an email address or a username)
    *
    * @param string User ID
    */
   setUserId = (userId) => {
     if (!isDefined(userId) || userId == null || !userId.toString().length) {
       return
     }
     this.configUserId = userId.toString()
     var oldUserId = this.getCookie(this.getCookieName('user_id'))
     if (this.configUserId != oldUserId) {
       this.trackEvent('sys', 'bind-user-id') // 自动上报一次，防止无后续动作无法绑定用户
     }
     this.setCookie(this.getCookieName('user_id'), this.configUserId, this.getRemainingVisitorCookieTimeout())
   }

   /**
    * Gets the User ID if set.
    *
    * @returns string User ID
    */
   getUserId = () => {
     return this.configUserId
   }

   /**
    * Pass custom data to the server
    *
    * Examples:
    *   tracker.setCustomData(object);
    *   tracker.setCustomData(key, value);
    *
    * @param mixed key_or_obj
    * @param mixed opt_value
    */
   setCustomData = (key_or_obj, opt_value) => {
     if (isObject(key_or_obj)) {
       this.configCustomData = key_or_obj
     } else {
       if (!this.configCustomData) {
         this.configCustomData = {}
       }
       this.configCustomData[key_or_obj] = opt_value
     }
   }

   /**
    * Get custom data
    *
    * @return mixed
    */
   getCustomData = () => {
     return this.configCustomData
   }

   /**
    * Configure function with custom request content processing logic.
    * It gets called after request content in form of query parameters string has been prepared and before request content gets sent.
    *
    * Examples:
    *   tracker.setCustomRequestProcessing(function(request){
    *     var pairs = request.split('&');
    *     var result = {};
    *     pairs.forEach(function(pair) {
    *       pair = pair.split('=');
    *       result[pair[0]] = decodeURIComponent(pair[1] || '');
    *     });
    *     return JSON.stringify(result);
    *   });
    *
    * @param function customRequestContentProcessingLogic
    */
   setCustomRequestProcessing = (customRequestContentProcessingLogic) => {
     this.configCustomRequestContentProcessing = customRequestContentProcessingLogic
   }

   /**
    * Appends the specified query string to the piwik.php?... Tracking API URL
    *
    * @param string queryString eg. 'lat=140&long=100'
    */
   appendToTrackingUrl = (queryString) => {
     this.configAppendToTrackingUrl = queryString
   }

   /**
    * Set Custom Dimensions. Set Custom Dimensions will not be cleared after a tracked pageview and will
    * be sent along all following tracking requests. It is possible to remove/clear a value via `deleteCustomDimension`.
    *
    * @param int index A Custom Dimension index
    * @param string value
    */
   setCustomDimension = (customDimensionId, value) => {
     customDimensionId = parseInt(customDimensionId, 10)
     if (customDimensionId > 0) {
       if (!isDefined(value)) {
         value = ''
       }
       if (!isString(value)) {
         value = String(value)
       }
       this.customDimensions[customDimensionId] = value
     }
   }

   /**
    * Get a stored value for a specific Custom Dimension index.
    *
    * @param int index A Custom Dimension index
    */
   getCustomDimension = (customDimensionId) => {
     customDimensionId = parseInt(customDimensionId, 10)
     if (customDimensionId > 0 && Object.prototype.hasOwnProperty.call(this.customDimensions, customDimensionId)) {
       return this.customDimensions[customDimensionId]
     }
   }

   /**
    * Delete a custom dimension.
    *
    * @param int index Custom dimension Id
    */
   deleteCustomDimension = (customDimensionId) => {
     customDimensionId = parseInt(customDimensionId, 10)
     if (customDimensionId > 0) {
       delete this.customDimensions[customDimensionId]
     }
   }

   /**
    * Set custom variable within this visit
    *
    * @param int index Custom variable slot ID from 1-5
    * @param string name
    * @param string value
    * @param string scope Scope of Custom Variable:
    *                     - "visit" will store the name/value in the visit and will persist it in the cookie for the duration of the visit,
    *                     - "page" will store the name/value in the next page view tracked.
    *                     - "event" will store the name/value in the next event tracked.
    */
   setCustomVariable = (index, name, value, scope) => {
     var toRecord

     if (!isDefined(scope)) {
       scope = 'visit'
     }
     if (!isDefined(name)) {
       return
     }
     if (!isDefined(value)) {
       value = ''
     }
     if (index > 0) {
       name = !isString(name) ? String(name) : name
       value = !isString(value) ? String(value) : value
       toRecord = [name.slice(0, this.customVariableMaximumLength), value.slice(0, this.customVariableMaximumLength)]
       // numeric scope is there for GA compatibility
       if (scope === 'visit' || scope === 2) {
         this.loadCustomVariables()
         this.customVariables[index] = toRecord
       } else if (scope === 'page' || scope === 3) {
         this.customVariablesPage[index] = toRecord
       } else if (scope === 'event') {
         /* GA does not have 'event' scope but we do */
         this.customVariablesEvent[index] = toRecord
       }
     }
   }

   /**
    * Get custom variable
    *
    * @param int index Custom variable slot ID from 1-5
    * @param string scope Scope of Custom Variable: "visit" or "page" or "event"
    */
   getCustomVariable = (index, scope) => {
     var cvar

     if (!isDefined(scope)) {
       scope = 'visit'
     }

     if (scope === 'page' || scope === 3) {
       cvar = this.customVariablesPage[index]
     } else if (scope === 'event') {
       cvar = this.customVariablesEvent[index]
     } else if (scope === 'visit' || scope === 2) {
       this.loadCustomVariables()
       cvar = this.customVariables[index]
     }

     if (!isDefined(cvar) ||
       (cvar && cvar[0] === '')) {
       return false
     }

     return cvar
   }

   /**
    * Delete custom variable
    *
    * @param int index Custom variable slot ID from 1-5
    * @param string scope
    */
   deleteCustomVariable = (index, scope) => {
     // Only delete if it was there already
     if (this.getCustomVariable(index, scope)) {
       this.setCustomVariable(index, '', '', scope)
     }
   }

   /**
    * Deletes all custom variables for a certain scope.
    *
    * @param string scope
    */
   deleteCustomVariables = (scope) => {
     if (scope === 'page' || scope === 3) {
       this.loadCustomVariablescustomVariablesPage = {}
     } else if (scope === 'event') {
       this.customVariablesEvent = {}
     } else if (scope === 'visit' || scope === 2) {
       this.customVariables = {}
     }
   }

   /**
    * When called then the Custom Variables of scope "visit" will be stored (persisted) in a first party cookie
    * for the duration of the visit. This is useful if you want to call getCustomVariable later in the visit.
    *
    * By default, Custom Variables of scope "visit" are not stored on the visitor's computer.
    */
   storeCustomVariablesInCookie = () => {
     this.configStoreCustomVariablesInCookie = true
   }

   /**
    * Set delay for link tracking (in milliseconds)
    *
    * @param int delay
    */
   setLinkTrackingTimer = (delay) => {
     this.configTrackerPause = delay
   }

   /**
    * Get delay for link tracking (in milliseconds)
    *
    * @param int delay
    */
   getLinkTrackingTimer = () => {
     return this.configTrackerPause
   }

   /**
    * Set list of file extensions to be recognized as downloads
    *
    * @param string|array extensions
    */
   setDownloadExtensions = (extensions) => {
     if (isString(extensions)) {
       extensions = extensions.split('|')
     }
     this.configDownloadExtensions = extensions
   }

   /**
    * Specify additional file extensions to be recognized as downloads
    *
    * @param string|array extensions  for example 'custom' or ['custom1','custom2','custom3']
    */
   addDownloadExtensions = (extensions) => {
     var i
     if (isString(extensions)) {
       extensions = extensions.split('|')
     }
     for (i = 0; i < extensions.length; i++) {
       this.configDownloadExtensions.push(extensions[i])
     }
   }

   /**
    * Removes specified file extensions from the list of recognized downloads
    *
    * @param string|array extensions  for example 'custom' or ['custom1','custom2','custom3']
    */
   removeDownloadExtensions = (extensions) => {
     let i
     const newExtensions = []
     if (isString(extensions)) {
       extensions = extensions.split('|')
     }
     for (i = 0; i < this.configDownloadExtensions.length; i++) {
       if (extensions.indexOf(this.configDownloadExtensions[i]) === -1) {
         newExtensions.push(this.configDownloadExtensions[i])
       }
     }
     this.configDownloadExtensions = newExtensions
   }

   /**
    * Set request method
    *
    * @param string method GET or POST; default is GET
    */
   setRequestMethod = (method) => {
     this.configRequestMethod = method || this.defaultRequestMethod
   }

   /**
    * Set request Content-Type header value, applicable when POST request method is used for submitting tracking events.
    * See XMLHttpRequest Level 2 spec, section 4.7.2 for invalid headers
    * @link http://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html
    *
    * @param string requestContentType; default is 'application/x-www-form-urlencoded; charset=UTF-8'
    */
   setRequestContentType = (requestContentType) => {
     this.configRequestContentType = requestContentType || this.defaultRequestContentType
   }

   /**
    * Override referrer
    *
    * @param string url
    */
   setReferrerUrl = (url) => {
     this.configReferrerUrl = url
   }

   /**
    * Override url
    *
    * @param string url
    */
   setCustomUrl = (url) => {
     this.configCustomUrl = this.resolveRelativeReference(this.locationHrefAlias, url)
   }

   /**
    * Returns the current url of the page that is currently being visited. If a custom URL was set, the
    * previously defined custom URL will be returned.
    */
   getCurrentUrl = () => {
     return this.configCustomUrl || this.locationHrefAlias
   }

   /**
    * Override document.title
    *
    * @param string title
    */
   setDocumentTitle = (title) => {
     this.configTitle = title
   }

   /**
    * Set the URL of the Piwik API. It is used for Page Overlay.
    * This method should only be called when the API URL differs from the tracker URL.
    *
    * @param string apiUrl
    */
   setAPIUrl = (apiUrl) => {
     this.configApiUrl = apiUrl
   }

   /**
    * Set array of campaign name parameters
    *
    * @see http://piwik.org/faq/how-to/#faq_120
    * @param string|array campaignNames
    */
   setCampaignNameKey = (campaignNames) => {
     this.configCampaignNameParameters = isString(campaignNames) ? [campaignNames] : campaignNames
   }

   /**
    * Set array of campaign keyword parameters
    *
    * @see http://piwik.org/faq/how-to/#faq_120
    * @param string|array campaignKeywords
    */
   setCampaignKeywordKey = (campaignKeywords) => {
     this.configCampaignKeywordParameters = isString(campaignKeywords) ? [campaignKeywords] : campaignKeywords
   }

   /**
    * Strip hash tag (or anchor) from URL
    * Note: this can be done in the Piwik>Settings>Websites on a per-website basis
    *
    * @deprecated
    * @param bool enableFilter
    */
   discardHashTag = (enableFilter) => {
     this.configDiscardHashTag = enableFilter
   }

   /**
    * Set first-party cookie name prefix
    *
    * @param string cookieNamePrefix
    */
   setCookieNamePrefix = (cookieNamePrefix) => {
     this.configCookieNamePrefix = cookieNamePrefix
     // Re-init the Custom Variables cookie
     this.customVariables = this.getCustomVariablesFromCookie()
   }

   /**
    * Set first-party cookie domain
    *
    * @param string domain
    */
   setCookieDomain = (domain) => {
     const domainFixed = domainFixup(domain)

     if (this.isPossibleToSetCookieOnDomain(domainFixed)) {
       this.configCookieDomain = domainFixed
       this.updateDomainHash()
     }
   }

   /**
    * Get first-party cookie domain
    */
   getCookieDomain = () => {
     return this.configCookieDomain
   }

   /**
    * Set a first-party cookie for the duration of the session.
    *
    * @param string cookieName
    * @param string cookieValue
    * @param int msToExpire Defaults to session cookie timeout
    */
   setSessionCookie = (cookieName, cookieValue, msToExpire) => {
     if (!cookieName) {
       throw new Error('Missing cookie name')
     }

     if (!isDefined(msToExpire)) {
       msToExpire = this.configSessionCookieTimeout
     }

     this.configCookiesToDelete.push(cookieName)

     this.setCookie(this.getCookieName(cookieName), cookieValue, msToExpire, this.configCookiePath, this.configCookieDomain)
   }

   /**
    * Set first-party cookie path.
    *
    * @param string domain
    */
   setCookiePath = (path) => {
     this.configCookiePath = path
     this.updateDomainHash()
   }

   /**
    * Get first-party cookie path.
    *
    * @param string domain
    */
   getCookiePath = (path) => {
     return this.configCookiePath
   }

   /**
    * Set visitor cookie timeout (in seconds)
    * Defaults to 13 months (timeout=33955200)
    *
    * @param int timeout
    */
   setVisitorCookieTimeout = (timeout) => {
     this.configVisitorCookieTimeout = timeout * 1000
   }

   /**
    * Set session cookie timeout (in seconds).
    * Defaults to 30 minutes (timeout=1800)
    *
    * @param int timeout
    */
   setSessionCookieTimeout = (timeout) => {
     this.configSessionCookieTimeout = timeout * 1000
   }

   /**
    * Get session cookie timeout (in seconds).
    */
   getSessionCookieTimeout = () => {
     return this.configSessionCookieTimeout
   }

   /**
    * Set referral cookie timeout (in seconds).
    * Defaults to 6 months (15768000000)
    *
    * @param int timeout
    */
   setReferralCookieTimeout = (timeout) => {
     this.configReferralCookieTimeout = timeout * 1000
   }

   /**
    * Set conversion attribution to first referrer and campaign
    *
    * @param bool if true, use first referrer (and first campaign)
    *             if false, use the last referrer (or campaign)
    */
   setConversionAttributionFirstReferrer = (enable) => {
     this.configConversionAttributionFirstReferrer = enable
   }

   /**
    * Disables all cookies from being set
    *
    * Existing cookies will be deleted on the next call to track
    */
   disableCookies = () => {
     this.configCookiesDisabled = true
     this.browserFeatures.cookie = '0'

     if (this.configTrackerSiteId) {
       this.deleteCookies()
     }
   }

   /**
    * One off cookies clearing. Useful to call this when you know for sure a new visitor is using the same browser,
    * it maybe helps to "reset" tracking cookies to prevent data reuse for different users.
    */
   deleteCookies = () => {
     this.deleteCookies()
   }

   /**
    * Disable automatic performance tracking
    */
   disablePerformanceTracking = () => {
     this.configPerformanceTrackingEnabled = false
   }

   /**
    * Set the server generation time.
    * If set, the browser's performance.timing API in not used anymore to determine the time.
    *
    * @param int generationTime
    */
   setGenerationTimeMs = (generationTime) => {
     this.configPerformanceGenerationTime = parseInt(generationTime, 10)
   }

   /**
    * Trigger a goal
    *
    * @param int|string idGoal
    * @param int|float customRevenue
    * @param mixed customData
    */
   trackGoal = (idGoal, customRevenue, customData) => {
     this.trackCallback(() => {
       this.logGoal(idGoal, customRevenue, customData)
     })
   }

   /**
    * Manually log a click from your own code
    *
    * @param string sourceUrl
    * @param string linkType
    * @param mixed customData
    * @param function callback
    */
   trackLink = (sourceUrl, linkType, customData, callback) => {
     this.trackCallback(() => {
       this.logLink(sourceUrl, linkType, customData, callback)
     })
   }

   /**
    * Get the number of page views that have been tracked so far within the currently loaded page.
    */
   getNumTrackedPageViews = () => {
     return this.numTrackedPageviews
   }

   /**
    * Log visit to this page
    *
    * @param string customTitle
    * @param string pageUrl
    * @param mixed customData
    * @param function callback
    */
   trackPageView = (customTitle, pageUrl, customData, callback) => {
     this.trackedContentImpressions = []
     this.consentRequestsQueue = []
     if (customTitle === '' || typeof customTitle === 'undefined') {
       return
     }

     if (pageUrl === '' || typeof pageUrl === 'undefined') {
       return
     }

     if (pageUrl.indexOf(this.pageScheme) !== 0) {
       pageUrl = this.pageScheme + pageUrl
     }

     if (pageUrl.indexOf(this.sc)) {
       this.setCustomUrl(pageUrl)
     }

     this.trackCallback(() => {
       this.numTrackedPageviews++
       this.logPageView(customTitle, customData, callback)
     })
   }

   /**
    * Records an event
    *
    * @param string category The Event Category (Videos, Music, Games...)
    * @param string action The Event's Action (Play, Pause, Duration, Add Playlist, Downloaded, Clicked...)
    * @param string name (optional) The Event's object Name (a particular Movie name, or Song name, or File name...)
    * @param float value (optional) The Event's value
    * @param function callback
    * @param mixed customData
    */
   trackEvent = (category, action, name, value, customData, callback) => {
     // 统一行为与 trackPageView title 一致
     if (typeof name === 'undefined') {
       name = action
     }
     this.trackCallback(() => {
       this.logEvent(category, action, name, value, customData, callback)
     })
   }

   /**
    * Log special pageview: Internal search
    *
    * @param string keyword
    * @param string category
    * @param int resultsCount
    * @param mixed customData
    */
   trackSiteSearch = (keyword, category, resultsCount, customData) => {
     this.trackCallback(() => {
       this.logSiteSearch(keyword, category, resultsCount, customData)
     })
   }

   /**
    * Used to record that the current page view is an item (product) page view, or a Ecommerce Category page view.
    * This must be called before trackPageView() on the product/category page.
    * It will set 3 custom variables of scope "page" with the SKU, Name and Category for this page view.
    * Note: Custom Variables of scope "page" slots 3, 4 and 5 will be used.
    *
    * On a category page, you can set the parameter category, and set the other parameters to empty string or false
    *
    * Tracking Product/Category page views will allow Piwik to report on Product & Categories
    * conversion rates (Conversion rate = Ecommerce orders containing this product or category / Visits to the product or category)
    *
    * @param string sku Item's SKU code being viewed
    * @param string name Item's Name being viewed
    * @param string category Category page being viewed. On an Item's page, this is the item's category
    * @param float price Item's display price, not use in standard Piwik reports, but output in API product reports.
    */
   setEcommerceView = (sku, name, category, price) => {
     if (!isDefined(category) || !category.length) {
       category = ''
     } else if (category instanceof Array) {
       category = JSON.stringify(category)
     }

     this.customVariablesPage[5] = ['_pkc', category]

     if (isDefined(price) && String(price).length) {
       this.customVariablesPage[2] = ['_pkp', price]
     }

     // On a category page, do not track Product name not defined
     if ((!isDefined(sku) || !sku.length) &&
       (!isDefined(name) || !name.length)) {
       return
     }

     if (isDefined(sku) && sku.length) {
       this.customVariablesPage[3] = ['_pks', sku]
     }

     if (!isDefined(name) || !name.length) {
       name = ''
     }

     this.customVariablesPage[4] = ['_pkn', name]
   }

   /**
    * Adds an item (product) that is in the current Cart or in the Ecommerce order.
    * This function is called for every item (product) in the Cart or the Order.
    * The only required parameter is sku.
    * The items are deleted from this JavaScript object when the Ecommerce order is tracked via the method trackEcommerceOrder.
    *
    * If there is already a saved item for the given sku, it will be updated with the
    * new information.
    *
    * @param string sku (required) Item's SKU Code. This is the unique identifier for the product.
    * @param string name (optional) Item's name
    * @param string name (optional) Item's category, or array of up to 5 categories
    * @param float price (optional) Item's price. If not specified, will default to 0
    * @param float quantity (optional) Item's quantity. If not specified, will default to 1
    */
   addEcommerceItem = (sku, name, category, price, quantity) => {
     if (sku.length) {
       this.ecommerceItems[sku] = [sku, name, category, price, quantity]
     }
   }

   /**
    * Removes a single ecommerce item by SKU from the current cart.
    *
    * @param string sku (required) Item's SKU Code. This is the unique identifier for the product.
    */
   removeEcommerceItem = (sku) => {
     if (sku.length) {
       delete this.ecommerceItems[sku]
     }
   }

   /**
    * Clears the current cart, removing all saved ecommerce items. Call this method to manually clear
    * the cart before sending an ecommerce order.
    */
   clearEcommerceCart = () => {
     this.ecommerceItems = {}
   }

   /**
    * Tracks an Ecommerce order.
    * If the Ecommerce order contains items (products), you must call first the addEcommerceItem() for each item in the order.
    * All revenues (grandTotal, subTotal, tax, shipping, discount) will be individually summed and reported in Piwik reports.
    * Parameters orderId and grandTotal are required. For others, you can set to false if you don't need to specify them.
    * After calling this method, items added to the cart will be removed from this JavaScript object.
    *
    * @param string|int orderId (required) Unique Order ID.
    *                   This will be used to count this order only once in the event the order page is reloaded several times.
    *                   orderId must be unique for each transaction, even on different days, or the transaction will not be recorded by Piwik.
    * @param float grandTotal (required) Grand Total revenue of the transaction (including tax, shipping, etc.)
    * @param float subTotal (optional) Sub total amount, typically the sum of items prices for all items in this order (before Tax and Shipping costs are applied)
    * @param float tax (optional) Tax amount for this order
    * @param float shipping (optional) Shipping amount for this order
    * @param float discount (optional) Discounted amount in this order
    */
   trackEcommerceOrder = (orderId, grandTotal, subTotal, tax, shipping, discount) => {
     this.logEcommerceOrder(orderId, grandTotal, subTotal, tax, shipping, discount)
   }

   /**
    * Tracks a Cart Update (add item, remove item, update item).
    * On every Cart update, you must call addEcommerceItem() for each item (product) in the cart, including the items that haven't been updated since the last cart update.
    * Then you can call this function with the Cart grandTotal (typically the sum of all items' prices)
    * Calling this method does not remove from this JavaScript object the items that were added to the cart via addEcommerceItem
    *
    * @param float grandTotal (required) Items (products) amount in the Cart
    */
   trackEcommerceCartUpdate = (grandTotal) => {
     this.logEcommerceCartUpdate(grandTotal)
   }

   /**
    * Sends a tracking request with custom request parameters.
    * Piwik will prepend the hostname and path to Piwik, as well as all other needed tracking request
    * parameters prior to sending the request. Useful eg if you track custom dimensions via a plugin.
    *
    * @param request eg. "param=value&param2=value2"
    * @param customData
    * @param callback
    * @param pluginMethod
    */
   trackRequest = (request, customData, callback, pluginMethod) => {
     this.trackCallback(() => {
       const fullRequest = this.getRequest(request, customData, pluginMethod)
       this.sendRequest(fullRequest, this.configTrackerPause, callback)
     })
   }

   /**
    * If the user has given consent previously and this consent was remembered, it will return the number
    * in milliseconds since 1970/01/01 which is the date when the user has given consent. Please note that
    * the returned time depends on the users local time which may not always be correct.
    *
    * @returns number|string
    */
   getRememberedConsent = () => {
     var value = this.getCookie(this.CONSENT_COOKIE_NAME)
     if (this.getCookie(this.CONSENT_REMOVED_COOKIE_NAME)) {
       // if for some reason the consent_removed cookie is also set with the consent cookie, the
       // consent_removed cookie overrides the consent one, and we make sure to delete the consent
       // cookie.
       if (value) {
         this.deleteCookie(this.CONSENT_COOKIE_NAME, this.configCookiePath, this.configCookieDomain)
       }
       return null
     }

     if (!value || value === 0) {
       return null
     }
     return value
   }

   /**
    * Detects whether the user has given consent previously.
    *
    * @returns bool
    */
   hasRememberedConsent = () => {
     return !!this.getRememberedConsent()
   }

   /**
    * When called, no tracking request will be sent to the Matomo server until you have called `setConsentGiven()`
    * unless consent was given previously AND you called {@link rememberConsentGiven()} when the user gave her
    * or his consent.
    *
    * This may be useful when you want to implement for example a popup to ask for consent before tracking the user.
    * Once the user has given consent, you should call {@link setConsentGiven()} or {@link rememberConsentGiven()}.
    *
    * Please note that when consent is required, we will temporarily set cookies but not track any data. Those
    * cookies will only exist during this page view and deleted as soon as the user navigates to a different page
    * or closes the browser.
    *
    * If you require consent for tracking personal data for example, you should first call
    * `_paq.push(['requireConsent'])`.
    *
    * If the user has already given consent in the past, you can either decide to not call `requireConsent` at all
    * or call `_paq.push(['setConsentGiven'])` on each page view at any time after calling `requireConsent`.
    *
    * When the user gives you the consent to track data, you can also call `_paq.push(['rememberConsentGiven', optionalTimeoutInHours])`
    * and for the duration while the consent is remembered, any call to `requireConsent` will be automatically ignored until you call `forgetConsentGiven`.
    * `forgetConsentGiven` needs to be called when the user removes consent for tracking. This means if you call `rememberConsentGiven` at the
    * time the user gives you consent, you do not need to ever call `_paq.push(['setConsentGiven'])`.
    */
   requireConsent = () => {
     this.configConsentRequired = true
     this.configHasConsent = this.hasRememberedConsent()
   }

   /**
    * Call this method once the user has given consent. This will cause all tracking requests from this
    * page view to be sent. Please note that the given consent won't be remembered across page views. If you
    * want to remember consent across page views, call {@link rememberConsentGiven()} instead.
    */
   setConsentGiven = () => {
     this.configHasConsent = true
     this.deleteCookie(this.CONSENT_REMOVED_COOKIE_NAME, this.configCookiePath, this.configCookieDomain)
     var i, requestType
     for (i = 0; i < this.consentRequestsQueue.length; i++) {
       requestType = typeof this.consentRequestsQueue[i]
       if (requestType === 'string') {
         this.sendRequest(this.consentRequestsQueue[i], this.configTrackerPause)
       } else if (requestType === 'object') {
         this.sendBulkRequest(this.consentRequestsQueue[i], this.configTrackerPause)
       }
     }
     this.consentRequestsQueue = []
   }

   /**
    * Calling this method will remember that the user has given consent across multiple requests by setting
    * a cookie. You can optionally define the lifetime of that cookie in milliseconds using a parameter.
    *
    * When you call this method, we imply that the user has given consent for this page view, and will also
    * imply consent for all future page views unless the cookie expires (if timeout defined) or the user
    * deletes all her or his cookies. This means even if you call {@link requireConsent()}, then all requests
    * will still be tracked.
    *
    * Please note that this feature requires you to set the `cookieDomain` and `cookiePath` correctly and requires
    * that you do not disable cookies. Please also note that when you call this method, consent will be implied
    * for all sites that match the configured cookieDomain and cookiePath. Depending on your website structure,
    * you may need to restrict or widen the scope of the cookie domain/path to ensure the consent is applied
    * to the sites you want.
    */
   rememberConsentGiven = (hoursToExpire) => {
     if (this.configCookiesDisabled) {
       logConsoleError('rememberConsentGiven is called but cookies are disabled, consent will not be remembered')
       return
     }
     if (hoursToExpire) {
       hoursToExpire = hoursToExpire * 60 * 60 * 1000
     }
     this.setConsentGiven()
     var now = new Date().getTime()
     this.setCookie(this.CONSENT_COOKIE_NAME, now, hoursToExpire, this.configCookiePath, this.configCookieDomain, this.configCookieIsSecure)
   }

   /**
    * Calling this method will remove any previously given consent and during this page view no request
    * will be sent anymore ({@link requireConsent()}) will be called automatically to ensure the removed
    * consent will be enforced. You may call this method if the user removes consent manually, or if you
    * want to re-ask for consent after a specific time period.
    */
   forgetConsentGiven = () => {
     if (this.configCookiesDisabled) {
       logConsoleError('forgetConsentGiven is called but cookies are disabled, consent will not be forgotten')
       return
     }

     this.deleteCookie(this.CONSENT_COOKIE_NAME, this.configCookiePath, this.configCookieDomain)
     this.setCookie(this.CONSENT_REMOVED_COOKIE_NAME, new Date().getTime(), 0, this.configCookiePath, this.configCookieDomain, this.configCookieIsSecure)
     this.requireConsent()
   }

   /**
    * Returns true if user is opted out, false if otherwise.
    *
    * @returns {boolean}
    */
   isUserOptedOut = () => {
     return !this.configHasConsent
   }

   /**
    * Alias for forgetConsentGiven(). After calling this function, the user will no longer be tracked,
    * (even if they come back to the site).
    */
   optUserOut = this.forgetConsentGiven

   /**
    * Alias for rememberConsentGiven(). After calling this function, the current user will be tracked.
    */
   forgetUserOptOut = this.rememberConsentGiven
 }

 /**
  * Matomo 小程序客户端
  * use:
  * import matomo from './utils/matomo'
  * matomo.initTracker(reportUrl, 1) // 注意不要在App Class内部初始化，会跟踪不到App事件
  */
 class Matomo {
   constructor() {
     if (Matomo.prototype.Instance === undefined) {
       Matomo.prototype.Instance = this
     }
     return Matomo.prototype.Instance
   }

   _proxy_ret = (that, funcName, func) => {
     if (that[funcName]) {
       const origin = that[funcName]
       that[funcName] = function(param) {
         const res = origin.call(this, param)
         func.call(this, [param, res], funcName)
         return res
       }
     } else {
       that[funcName] = function(param) {
         func.call(this, param, funcName)
       }
     }
   }

   _proxy = (that, funcName, func) => {
     if (that[funcName]) {
       const origin = that[funcName]
       that[funcName] = function(param) {
         func.call(this, param, funcName)
         origin.call(this, param)
       }
     } else {
       that[funcName] = function(param) {
         func.call(this, param, funcName)
       }
     }
   }

   /**
    * 初始化一个跟踪器
    * @param {String} matomoUrl
    * @param {String} siteId
    * @param {Boolean} autoTrackPage 自动跟踪App、Page生命周期事件
    */
   initTracker = (matomoUrl, siteId, {
     autoTrackPage = true,
     pageScheme = 'mp://',
     pageTitles = {}
   } = {}) => {
     if (!this.tracker) {
       this.tracker = new Tracker(matomoUrl, siteId)
       this.tracker.pageScheme = pageScheme
       this.tracker.pageTitles = pageTitles

       // 注入到App实例
       this.AppProxy = App
       App = (app) => {
         app.matomo = this.tracker
         if (autoTrackPage) {
           this._proxy(app, 'onLaunch', this._appOnLaunch)
           this._proxy(app, 'onUnlaunch', this._appOnUnlaunch)
           this._proxy(app, 'onShow', this._appOnShow)
           this._proxy(app, 'onHide', this._appOnHide)
           this._proxy(app, 'onError', this._appOnError)
         }
         this.AppProxy(app)
       }

       // 注入到Page实例
       this.PageProxy = Page
       Page = (page) => {
         page.matomo = this.tracker
         if (autoTrackPage) {
           this._proxy(page, 'onLoad', this._pageOnLoad)
           this._proxy(page, 'onUnload', this._pageOnUnload)
           this._proxy(page, 'onShow', this._pageOnShow)
           this._proxy(page, 'onHide', this._pageOnHide)
           if (typeof page['onShareAppMessage'] !== 'undefined') {
             this._proxy_ret(page, 'onShareAppMessage', this._pageOnShareAppMessage)
           }
         }
         this.PageProxy(page)
       }
     }
     return this.tracker
   }

   _appOnLaunch = function(options) {
     const scene = options && options.scene || 'default'
     const shareFrom = options && options.query && (options.query.sharefrom || options.query.shareFrom) || 'default'
     const siteId = options && options.query && (options.query.siteId || options.query.siteid) || 'default'
     const param = serialiseObject(options)
     const onStartupKey = `<${scene}-${shareFrom}-${siteId}-${param}>`
     console.log('_appOnLaunch', options, onStartupKey)

     if (this.calledStartup !== onStartupKey) {
       this.calledStartup = onStartupKey
       this.matomo.setCustomDimension(1, scene)
       this.matomo.setCustomDimension(2, shareFrom)
       this.matomo.setCustomDimension(3, siteId)
       this.matomo.setCustomData(options)
       this.matomo.trackPageView('app/launch', `app/launch?${param}`)
     }
   }

   _appOnUnlaunch = function() {
     console.log('_appOnUnlaunch')
   }

   _appOnShow = function(options) {
     const scene = options && options.scene || 'default'
     const shareFrom = options && options.query && (options.query.sharefrom || options.query.shareFrom) || 'default'
     const siteId = options && options.query && (options.query.siteId || options.query.siteid) || 'default'
     const param = serialiseObject(options)
     const onStartupKey = `<${scene}-${shareFrom}-${siteId}-${param}>`
     console.log('_appOnShow', options, onStartupKey)

     if (this.calledStartup !== onStartupKey) {
       this.calledStartup = onStartupKey
       this.matomo.setCustomDimension(1, scene)
       this.matomo.setCustomDimension(2, shareFrom)
       this.matomo.setCustomDimension(3, siteId)
       this.matomo.setCustomData(options)
       this.matomo.trackPageView('app/show', `app/show?${param}`)
     }
   }

   _appOnHide = function() {
     console.log('_appOnHide')
   }

   _appOnError = function() {
     console.log('_appOnError')
   }

   _pageOnLoad = function(options) {
     console.log('_pageOnLoad', options)
     const url = getCurrentPageUrl()
     if (url && url !== 'module/index' && url !== 'pages/loading/index') {
       this.matomo.setCustomData(options)
       this.matomo.trackPageView(this.matomo.pageTitles[url] || url, `${url}?${serialiseObject(options)}`)
     }
   }

   _pageOnUnload = function() {
     console.log('_pageOnUnload')
   }

   _pageOnShow = function() {
     console.log('_pageOnShow')
   }

   _pageOnHide = function() {
     console.log('_pageOnHide')
   }

   _pageOnShareAppMessage = function(options) {
     console.log('_pageOnShareAppMessage', options)
     const sharefrom = (options[0] && options[0].from) || 'menu'
     this.matomo.trackEvent('share', sharefrom, serialiseObject(options))
   }
 }

 export default new Matomo()
