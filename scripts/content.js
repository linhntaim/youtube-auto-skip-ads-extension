function debug(...out) {
    console.debug('YtbASAds:', ...out)
}

class AdObserverManager
{
    constructor() {
        this.observers = new Map()
    }

    observed(node) {
        return node in this.observers
    }

    createObserver(node, callback, config = {childList: true}) {
        const observer = new MutationObserver(callback)
        observer.observe(node, config)
        this.observers[node] = observer
        return this
    }
}

class AdSkipper
{
    keepSkipping(adModuleNode) {
        setTimeout(() => {
            if (adModuleNode.childNodes.length) {
                debug('Ad is!')
                this.skip(adModuleNode)
            }
        }, 250)
    }

    skip(adModuleNode) {
        if (adModuleNode.childNodes.length) {
            debug('Ad found! Skipping ...')
            try {
                const adSkipButtonNode = adModuleNode.querySelector('.ytp-ad-skip-button')
                if (adSkipButtonNode) {
                    debug('Skip via button ...')
                    adSkipButtonNode.click()
                }
                else {
                    debug('Skip via video ...')
                    const mainVideoNode = document.querySelector('.html5-main-video')
                    mainVideoNode.currentTime = mainVideoNode.duration
                }
            }
            catch (e) {
                debug('Failed to skip ad!', e)
            }

            this.keepSkipping(adModuleNode)
        }
        else {
            debug('Ad skipped!')
        }
    }
}

class App
{
    constructor() {
        this.adObserverManager = new AdObserverManager()
    }

    createTitleObserver() {
        this.adObserverManager.createObserver(
            document.querySelector('title'),
            () => {
                debug('Title updated --> URL might change!')

                this.createAdModuleObservers()
            },
        )
    }

    createAdModuleObservers() {
        debug('Finding ad ...')
        document.querySelectorAll('.ytp-ad-module')
            .forEach(node => {
                if (this.adObserverManager.observed(node)) {
                    debug('Already observed!')
                    return
                }
                this.skipAd(node)
                this.adObserverManager.createObserver(node, () => this.skipAd(node))
                debug('Newly observed!')
            })
    }

    skipAd(adModuleNode) {
        new AdSkipper().skip(adModuleNode)
    }

    mount() {
        debug('App mounting ...')
        this.createTitleObserver()
        this.createAdModuleObservers()
        debug('App mounted!')
    }
}

new App().mount()
