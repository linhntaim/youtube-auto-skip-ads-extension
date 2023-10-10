function debug(debug) {
    console.debug(`YtbASAds:`, debug)
}

const els = {}

function regEl(name, el) {
    els[name] = el
}

function getEl(name) {
    return els[name]
}

const INTERVAL = 200
const DELAY_BEFORE_RESTART_INTERVAL = 1000
let intervalId = null

function startDetectingAd() {
    intervalId = setInterval(detectAd, INTERVAL)
}

function restartDetectingAd() {
    debug('Keep detecting ad ...')
    setTimeout(startDetectingAd, DELAY_BEFORE_RESTART_INTERVAL)
}

function stopDetectingAd() {
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
    }
}

function detectAd() {
    if (hasAdSkip()) {
        skipAd(skipAdViaButton)
    }
    else if (hasAd()) {
        skipAd(skipAdViaPlay)
    }
}

function hasAd() {
    const adModuleEl = document.querySelector('.ytp-ad-module')
    return adModuleEl?.childNodes.length
}

function hasAdSkip() {
    const adSkipEl = document.querySelector('.ytp-ad-skip-button')
    if (adSkipEl) {
        regEl('adSkip', adSkipEl)
        return true
    }
    return false
}

function skipAd(skip) {
    stopDetectingAd()
    debug('Ad found. Skipping ...')
    try {
        skip()
        debug('Ad skipped!')
    }
    catch (e) {
        debug('Ad not skipped!', e)
    }
    restartDetectingAd()
}

function skipAdViaPlay() {
    let video = document.querySelector('.html5-main-video')
    video.currentTime = video.duration
}

function skipAdViaButton() {
    getEl('adSkip').click()
}

debug('Start detecting ad ...')
startDetectingAd()
