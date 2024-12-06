const config = {
    DEFAULT_TYPE: "decrease",
    DEFAULT_BY: "percent",
    DEFAULT_VALUE: 10,
}

const getStoredOptions = () => {
    chrome.storage.sync.get(
        {
            type: config.DEFAULT_TYPE,
            by: config.DEFAULT_BY,
            value: config.DEFAULT_VALUE,
        },
        setupOptions
    )
}

const elements = {
    type: document.getElementsByName("type"),
    by: document.getElementsByName("by"),
    value: document.getElementById("value"),
    saveButton: document.getElementById("save"),
    alertSave: document.getElementById("alertSave"),
}

const setupOptions = (options) => {
    elements.type.forEach((radio) => {
        radio.checked = radio.value === options.type
    })

    elements.by.forEach((radio) => {
        radio.checked = radio.value === options.by
    })

    elements.value.value = options.value
}

const showSavedAlert = () => {
    elements.alertSave.classList.add("show")
    setTimeout(() => elements.alertSave.classList.remove("show"), 1000)
}

const saveOptions = () => {
    const type = [...elements.type].find((radio) => radio.checked)?.value || config.DEFAULT_TYPE
    const by = [...elements.by].find((radio) => radio.checked)?.value || config.DEFAULT_BY
    const value = parseInt(elements.value.value, config.DEFAULT_VALUE)

    chrome.storage.sync.set({type, by, value}, showSavedAlert)
}

document.addEventListener("DOMContentLoaded", getStoredOptions)
elements.saveButton.addEventListener("click", saveOptions)

