const config = {
    DEFAULT_TYPE: "decrease",
    DEFAULT_BY: "percent",
    DEFAULT_VALUE: 10,
}

let options = {
    type: config.DEFAULT_TYPE,
    by: config.DEFAULT_BY,
    value: config.DEFAULT_VALUE,
}

chrome.storage.sync.get(options, (items) => options = items)

const calculateValue = (options, actualValue) => {
    let modifier = options.value
    if (modifier > 0 && options.by === "percent") {
        modifier = actualValue * (modifier / 100)
    }

    const result = options.type === "decrease" ? actualValue - modifier : actualValue + modifier
    return result > 0 ? result.toFixed(2) : 0
}

const main = () => {
    observePageNavigation()
    startScorecardsObserver()
}

const observePageNavigation = () => {
    let lastPath = location.pathname

    const pageObserver = new MutationObserver(() => {
        const currentPath = location.pathname
        if (currentPath !== lastPath) {
            lastPath = currentPath
            handlePath(currentPath)
        }
    })

    pageObserver.observe(document.documentElement, {childList: true, subtree: true})
}

const handlePath = (path) => {
    if (window.scorecardsObserver) {
        window.scorecardsObserver.disconnect()
        window.scorecardsObserver = null
    }

    const isHomePage = /^\/v2\/home/.test(path)
    const isOverviewPage = /^\/v2\/apps\/[^/]+\/overview/.test(path)

    if (isHomePage || isOverviewPage) {
        startScorecardsObserver()
    }
}

const startScorecardsObserver = () => {
    const containerObserver = new MutationObserver(() => {
        const container = document.querySelector('.scorecards-container')
        if (container) {
            containerObserver.disconnect()
            updateScorecards(container)

            // Observe changes within the scorecards-container
            window.scorecardsObserver = new MutationObserver(() => {
                updateScorecards(container)
            })

            window.scorecardsObserver.observe(container, {childList: true, subtree: true})
        }
    })

    containerObserver.observe(document.documentElement, {childList: true, subtree: true})
}

const updateScorecards = (container) => {
    // noinspection CssInvalidHtmlTagReference
    const scorecards = container.querySelectorAll('acx-scorecard')
    scorecards.forEach(scorecard => {
        const valueElem = scorecard.querySelector('.label-value')
        if (valueElem) {
            const actualValue = parseFloat(valueElem.textContent.replace('$', ''))
            valueElem.textContent = `$${calculateValue(options, actualValue)}`
        }
    })
}

main()
