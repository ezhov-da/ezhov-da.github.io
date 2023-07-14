const IS_ENABLED_CONSOLE_LOG = false

function example() {
    return `
# Housework
. list is not final

-- Car
- To wash a car
*
Don't forget to close the windows
*
- Check tire pressure

-- Cleaning
- Clean up the rooms
*
Decide what to do with old children's toys
*
`.trim()
}

function parseCheckListFromSimpleText(text) {
    let textLines = text.split("\n")
    let checkList = {title: null, items: [], blocks: []}
    let currentSection = null
    let currentItem = null

    let isStartBlock = false
    let textBlock = ""

    textLines.forEach(function callback(currentValue, index, array) {
        // if the block has started, add everything as is
        if (isStartBlock) {
            textBlock = textBlock + "\n" + currentValue
        }

        // search and set header
        if (currentValue.startsWith("#")) {
            checkList.title = currentValue.substring(1).trim()
        }

        if (currentValue.startsWith("--")) { // section search and installation
            let textItem = currentValue.substring(2).trim()
            currentItem = null
            currentSection = createCheckListItem(textItem)
            checkList.items.push(currentSection)
        } else if (currentValue.trim().startsWith("-")) { // search and set unfulfilled item
            let textItem = currentValue.trim().substring(1).trim()

            const newItem = createCheckListItem(textItem)
            if (currentSection !== null) {
                currentSection.items.push(newItem)
                currentItem = newItem
            } else {
                checkList.items.push(newItem)
            }
        } else if (currentValue.trim().startsWith("+")) { // search and installation of the completed item
            let textItem = currentValue.trim().substring(1).trim()

            const newItem = createCheckListItem(textItem, true)
            if (currentSection !== null) {
                currentItem.items.push(newItem)
                currentItem = newItem
            } else {
                checkList.items.push(newItem)
            }
        }

        if (currentValue.startsWith("*")) { // block search and identification
            if (isStartBlock) {
                let block = textBlock.substring(0, textBlock.length - 1).trim()
                if (currentItem !== null) {
                    currentItem.blocks.push(block)
                } else if (currentSection !== null) {
                    currentSection.blocks.push(block)
                } else {
                    checkList.blocks.push(block)
                }
                isStartBlock = false
                textBlock = ""
            } else {
                isStartBlock = true
            }
        }
    })

    return checkList
}

function createCheckListItem(text, isComplete = false) {
    return {text: text, isComplete: isComplete, items: [], blocks: []}
}

function toPlainTextFromBase64(base64) {
    return Base64.decode(base64)
}


function generateLink(plainText) {
    const base64 = toBase64FromPlainText(plainText)
    const link = window.location.origin + window.location.pathname

    log(window.location)
    return link + '?base64=' + base64
}

function toBase64FromPlainText(plainText) {
    return Base64.encode(plainText, true)
}

function log(text) {
    if (IS_ENABLED_CONSOLE_LOG) {
        console.log(text)
    }
}