const IS_ENABLED_CONSOLE_LOG = false

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
                currentSection.items.push(newItem)
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

// --- COOKIE ---
const LANG_COOKIE_NAME = 'CHECKLIST_LANG'

function initLangCookie() {
    let langCookie = getCookie(LANG_COOKIE_NAME)
    if (langCookie === undefined) {
        setCookie(LANG_COOKIE_NAME, Langs.EN)
    }
}

function selectedLang() {
    let langCookie = getCookie(LANG_COOKIE_NAME)
    return AVAILABLE_LANGS.find(({lang}) => lang === langCookie)
}

function saveLangCookie(lang) {
    setCookie(LANG_COOKIE_NAME, lang)
}

//https://learn.javascript.ru/cookie
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

//https://learn.javascript.ru/cookie
function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

// --- TRANSLATE ---

const Langs = {
    EN: 'EN',
    RU: 'RU'
}

const AVAILABLE_LANGS = [
    {
        lang: Langs.EN,
        icon: 'checklist_flag_united_kingdom_48x48.png',
        translate: {
            title: 'Checklist',
            aboutMenu: 'About',
            createMenu: 'Create',
            showOriginalTextButton: 'Show original text',
            originalText: 'Original text',
            originalTextCreateButton: 'Create',
            originalTextCreatedLink: 'Created link',
            blockText: 'block',
            aboutContent: `
            <p>This application supports the checklist format described by <a
                    href="https://github.com/ezhov-da/checklist">here</a>.</p>
            <p>For any issues with the app, file <a href="https://github.com/ezhov-da/checklist-js/issues">issue</a> to
                help improve the app.</p>
            <p></p>
            <p>Home <a href="https://github.com/ezhov-da/checklist-js">page</a> of the project.</p>
            <p></p>
            <blockquote>
                <p><strong>Important!</strong> The application does not interact with the server, which means that no
                    information is transmitted over the network.</p>
                <p>The application works with data by converting it to <a href="https://en.wikipedia.org/wiki/Base64">Base64</a>&nbsp;and
                    passing it as a query parameter.</p>
                <p>This means that any checklist link you send contains this data almost in the clear. Therefore, do not
                    add passwords or any other information to the checklists that you do not want to be compromised.</p>
            </blockquote>
            `,
            createText: 'Checklist plain text format',
            createPasteButton: 'Paste example',
            pasteExample: `
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
            `.split("\n").map(v => v.trim()).join("\n").trim(),
            createTextareaPlaceholder: 'Paste or type checklist plain text format',
            createButtonText: 'Create',
            createdLinkText: 'Created link',
            footerContent: `
            <p>
                <strong>Checklist</strong> by <a href="https://github.com/ezhov-da">Denis Ezhov</a>. The <a
                href="https://github.com/ezhov-da/checklist-js">source</a> code is
                licensed
                <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
            </p>
            `,

        }
    },
    {
        lang: Langs.RU,
        icon: 'checklist_flag_russia_48x48.png',
        translate: {
            title: 'Чек-лист',
            aboutMenu: 'О приложении',
            createMenu: 'Создать',
            showOriginalTextButton: 'Показать оригинальный текст',
            originalText: 'Оригинальный текст',
            originalTextCreateButton: 'Создать',
            originalTextCreatedLink: 'Созданная ссылка',
            blockText: 'блок',
            aboutContent: `
            <p>Это приложение поддерживает формат чек-листов описанный <a href="https://github.com/ezhov-da/checklist">здесь</a>.</p>
            <p>По любым проблемам в работе приложения заводите <a href="https://github.com/ezhov-da/checklist-js/issues">issue</a> - это поможет улучшить работу приложения.</p>
            <p></p>
            <p>Домашняя <a href="https://github.com/ezhov-da/checklist-js">страница</a> проекта.</p>
            <p></p>
            <blockquote>
                <p><strong>Важно!</strong> Приложение не взаимодействет с сервером, а это значит, что никакая информация не передаётся по сети.</p>
                <p>Приложение работает c данными путём конвертирования их в <a href="https://en.wikipedia.org/wiki/Base64">Base64</a>&nbsp;и указания их в качестве параметра запроса.</p>
                <p>Это значит, что любая отправленная вами ссылка с чеклистом содержит эти данные практически в открытом виде. Поэтому, не добавляйте в чеклисты пароли и любую другую инфрмацию, компроментации которой вы не хотите.</p>
            </blockquote>
            `,
            createText: 'Чек-лист в простом формате',
            createPasteButton: 'Вставить пример',
            pasteExample: `
                # Домашние дела
                . список неокончательный
                                
                -- Машина
                - Помыть машину
                 *
                 Не забыть закрыть окна
                 *
                 - Проверить давление в шинах
                               
                 -- Уборка
                 - Уборка комнат
                 *
                 Решить, что делать со старыми детскими игрушками
                 *
            `.split("\n").map(v => v.trim()).join("\n").trim(),
            createTextareaPlaceholder: 'Вставьте или введите чек-лист в простом формате',
            createButtonText: 'Создать',
            createdLinkText: 'Созданная ссылка',
            footerContent: `
            <p>
                 <strong>Чек-лист</strong>, автор <a href="https://github.com/ezhov-da">Денис Ежов</a>. 
                 <a href="https://github.com/ezhov-da/checklist-js">Исходный</a> код
                 под лицензией <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
             </p>
            `,
        }
    }
]