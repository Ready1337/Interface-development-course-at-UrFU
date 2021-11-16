'use strict';

/**
 * Телефонная книга
 */
const phoneBook = new Map();
const queryChecker = {
    correctness : true,
    commandPosition : 0,
    symbolPosition : 0
};

/**
 * Вызывайте эту функцию, если есть синтаксическая ошибка в запросе
 * @param {number} lineNumber – номер строки с ошибкой
 * @param {number} charNumber – номер символа, с которого запрос стал ошибочным
 */
function syntaxError(lineNumber, charNumber) {
    throw new Error(`SyntaxError: Unexpected token at ${lineNumber}:${charNumber}`);
}

/**
 * Создает новый контакт с именем <name> с пустыми списками телефонов и почт
 * @param {string} name - имя контакта, содержащее любые символы, кроме ;
*/
function createContact(name) {
    if (phoneBook.has(name)) {
        return;
    }

    phoneBook.set(name, {phones: [], emails: []});
}

/**
 * Удаляет контакт с именем <name>
 * @param {string} name - имя контакта, содержащее любые символы, кроме ;
 */
function deleteContact(name) {
    phoneBook.delete(name);
}

function addToCotact(phonesLine, emailsLine, name) {
    if (!phoneBook.has(name)) {
        return;
    }

    let newPhones = phonesLine.split('и');
    let newEmails = emailsLine.split('и');

    for (let i = 0; i < newPhones.length; i++) {
        phoneBook.get(name).phones.push(newPhones[i]);
    }

    for (let i = 0; i < newEmails.length; i++) {
        phoneBook.get(name).emails.push(newEmails[i]);
    }
}

function checkQuery(queryLine) {
    function tellChecker(commandPosition, symbolPosition) {
        queryChecker.correctness = false;
        queryChecker.commandPosition = commandPosition;
        queryChecker.symbolPosition = symbolPosition;
    }

    if (typeof queryLine !== 'string') {
        throw new TypeError('query is supposed to be string');
    }
    
    let queries = queryLine.split(';');

    if (queryLine[queryLine.length - 1] !== ';') {
        tellChecker(queries.length, queryLine.length);
    }

    let patterns = [
        /^Создай контакт [^;]+$/, //done
        /^Удали контакт [^;]+$/, //done
        /^Добавь телефон (\d{10}( и телефон)?)+ и почту (.+( и почту)?)+ для контакта [^;]+$/, //done
        /^Удали телефон (\d{10}и?)+ и почту (.+и?)+ для контакта [^;]+$/, //done
        /^Покажи почты и телефоны для контактов, где есть <запрос>$/,
        /^Удали контакты, где есть <запрос>$/,
    ]

    for (let query of queries) {
        if (/* проверка на корректность не пройдена*/) {
            
        }
    }



}

/**
 * Выполнение запроса на языке pbQL
 * @param {string} query
 * @returns {string[]} - строки с результатами запроса
 */
function run(query) {
    checkQuery(query);

    if (queryChecker.correctness === false) {
        return syntaxError(queryChecker.commandPosition, queryChecker.symbolPosition);
    }

    return [];
}


test = new Map();
test.set('', {p: [1], e: []})
console.log(test.get(''));

module.exports = { phoneBook, run };