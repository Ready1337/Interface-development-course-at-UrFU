'use strict';

/**
 * Телефонная книга
 */
const phoneBook = new Map();

/**
 * Вызывайте эту функцию, если есть синтаксическая ошибка в запросе
 * @param {number} lineNumber – номер строки с ошибкой
 * @param {number} charNumber – номер символа, с которого запрос стал ошибочным
 */
function syntaxError(lineNumber, charNumber) {
    throw new Error(`SyntaxError: Unexpected token at ${lineNumber}:${charNumber}`);
}

/**
 * Создает новый контакт с соответствующим именем из команды <command> с пустыми списками телефонов и почт
 * @param {string} command - команда с данными
*/
function createContact(command) {
    let name = command.slice(15, command.length);
    
    if (phoneBook.has(name)) {
        return;
    }

    phoneBook.set(name, {phones: [], emails: []});
}

/**
 * Удаляет контакт с соответствующим именем из команды <command> 
 * @param {string} command - команда с данными
 */
function deleteContact(command) {
    let name = command.slice(14, command.length);

    phoneBook.delete(name);
}

/**
 * Собирает данные из команды <command>
 * @param {string} command - команда с данными
 * @returns 
 */
 function getData(command) {
    const re = [
        /^Добавь (.+) для контакта ([^;]+)$/,
        /^Удали (.+) для контакта ([^;]+)$/
    ];

    let index = 1;
    if (re[0].test(command)){
        index = 0;
    }

    const data = command.replace(re[index], '$1\n$2').split('\n');
    return data;
}

/**
 * Собирает список телефонных номеров из строки <line>
 * @param {string} line - строка с телефонными номерами и почтами
 * @returns 
 */
function getPhones(line) {
    const phonesAndEmails = line.split(' и ');
    const phones = [];

    for (let i = 0; i < phonesAndEmails.length; i++) {
        if (phonesAndEmails[i].slice(0, 7) === 'телефон') {
            phones.push(phonesAndEmails[i].slice(8, phonesAndEmails[i].length));
        }
    }

    return phones;
}

/**
 * Собирает список почт из строки <line>
 * @param {string} line - строка с телефонными номерами и почтами
 * @returns 
 */
function getEmails(line) {
    const phonesAndEmails = line.split(' и ');
    const emails = [];

    for (let i = 0; i < phonesAndEmails.length; i++) {
        if (phonesAndEmails[i].slice(0, 5) === 'почту') {
            emails.push(phonesAndEmails[i].slice(6, phonesAndEmails[i].length));
        }
    }

    return emails;
}

/**
 * Добавляет телефоны в команде в список телефонов и почты в команде в список почт для контакта с соответствующим именем из команды <command>
 * @param {string} command - команда с данными
 * @returns 
 */
function addToCotact(command) {
    let data = getData(command);

    let name = data[1];
    let newPhones = getPhones(data[0]);
    let newEmails = getEmails(data[0]);
    
    if (!phoneBook.has(name)) {
        return;
    }

    for (let i = 0; i < newPhones.length; i++) {
        if (!phoneBook.get(name).phones.includes(newPhones[i])){
            phoneBook.get(name).phones.push(newPhones[i]);
        }
    }

    for (let i = 0; i < newEmails.length; i++) {
        if (!phoneBook.get(name).emails.includes(newEmails[i])) {
            phoneBook.get(name).emails.push(newEmails[i]);
        }
    }
}

/**
 * Удаляет телефоны в команде из списка телефонов и почты в команде из списка почт у контакта с соответствующим именем из команды <command>
 * @param {string} command - команда с данными
 * @returns 
 */
function removeFromContact(command) {
    let data = getData(command);

    let name = data[1];
    let oldPhones = getPhones(data[0]);
    let oldEmails = getEmails(data[0]);
    
    if (!phoneBook.has(name)) {
        return;
    }
    
    for (let i = 0; i < oldPhones.length; i++) {
        let position = phoneBook.get(name).phones.indexOf(oldPhones[i]);
        if (position >= 0) {
            phoneBook.get(name).phones.splice(position, 1);
        }
    }

    for (let i = 0; i < oldEmails.length; i++) {
        let position = phoneBook.get(name).emails.indexOf(oldEmails[i]);
        if (position >= 0) {
            phoneBook.get(name).emails.splice(position, 1);
        }
    }
}

/**
 * Помечает контакты в телефонной книге, в данных которых присутствует подстрока <pattern>
 * @param {string} pattern - подстрока для разметки
 * @returns {Map} - размеченная телефонная книга.
 */
function matchContacts(pattern) {
    const matcher = new Map();

    const names = phoneBook.keys();
    for (let name in names) {
        matcher.set(name, 'not matched');
    }


    for (let name of names) {
        if (name.indexOf(pattern) >= 0) {
            matcher.set(name, 'matched');
        }
        
        if (matcher.get(name) === 'not matched') {
            const phones = phoneBook.get(name).phones;
            for (let phone of phones) {
                if (phone.indexOf(pattern) >= 0 && matcher.get(name) === 'not matched'){
                    matcher.set(name, 'matched');
                }
            }
        }

        if (matcher.get(name) === 'not matched') {
            const emails = phoneBook.get(name).emails;
            for (let email of emails) {
                if (email.indexOf(pattern) >= 0 && matcher.get(name) === 'not matched'){
                    matcher.set(name, 'matched');
                }
            }
        }
    }

    return matcher;
}

/**
 * Возвращает строку с почтами контакта <name> в формате <email1>,<email2>,...,<emailN>
 * @param {string} name - имя контакта в телефонной книге
 * @returns {string} - строка в указанном формате
 */
function getEmailsLine(name) {
    let emailsLine = '';

    const emails = phoneBook.get(name).emails;
    for (let i = 0; i < emails.length; i++) {
        emailsLine += emails[i];

        if (i < emails.length - 1) {
            emailsLine += ',';
        }
    }

    return emailsLine;
}

/**
 * Возвращает строку с телефонами контакта <name> в формате <phone1>,<phone2>,...,<phoneN>
 * @param {string} name - имя контакта в телефонной книге в формате +7 (999) 888-77-66
 * @returns - строка в указанном формате
 */
 function getPhonesLine(name) {
    let phonesLine = '';

    const phones = phoneBook.get(name).phones;
    for (let i = 0; i < phones.length; i++) {
        phonesLine += `+7 (${phones[i].slice(0, 3)}) ${phones[i].slice(3, 6)}-${phones[i].slice(6, 8)}-${phones[i].slice(8, phones[i].length)}`;

        if (i < phones.length - 1) {
            phonesLine += ',';
        }
    }

    return phonesLine;
}


/**
 * Показывает информацию о контакте в соответствии с запросом из команды <command>
 * @param {string} command - команда с данными
 * @returns 
 */
function showData(command) {
    let data = command.replace(/^Покажи (.+) для контактов, где есть (.+)?$/, '$1\n$2').split('\n');
    let pattern = data[1];
    let format = data[0].split(' и ');
    
    if (pattern === ''){
        return;
    }

    const data = [];

    const matcher = matchContacts(pattern);
    for (let contact of matcher.keys()) {
        if (matcher.get(contact) === 'matched') {
            let formattedData = '';

            let name = contact;
            let emailsLine = getEmailsLine(contact);
            let phonesLine = getPhonesLine(contact);

            for (let i = 0;  i < format.length ; i++) {
                let formatPart = format[i];
                switch (formatPart) {
                    case 'имя':
                        formattedData += name;
                        break;
                    case 'почты':
                        formattedData += emailsLine;
                        break;
                    case 'телефоны':
                        formattedData += phonesLine;
                        break;
                    default:
                        break;
                }

                if (i < format.length - 1) {
                    formattedData += ';'
                }
            }

            data.push(formattedData);
        }
    }
    
    return data;
}

/**
 * Удаляет контакты из телефонной книги в соответствии с запросом из команды <command>
 * @param {string} command - команда с данными
 * @returns 
 */
function deleteContactsWhere(command) {
    let pattern = command.slice(24, command.length);
    
    if (pattern === '') {
        return;
    }

    const matcher = matchContacts(pattern);
    for (const contact of matcher.keys()) {
        if (matcher.get(contact) === 'matched') {
            deleteContact(contact);
        }
    }
}


/**
 * Идентификация комманд
 * @param {string} command - команда
 * @returns {number} - порядковый индентификатор команды <command>
 */
 function identifyCommand(command) {
    const commandPatterns = [
        /^Создай контакт ([^;]+)$/,
        /^Удали контакт ([^;]+)$/,
        /^Добавь (.+) для контакта ([^;]+)$/,
        /^Удали (.+) для контакта ([^;]+)$/,
        /^Покажи (.+) для контактов, где есть (.+)?$/,
        /^Удали контакты, где есть (.+)?$/,
    ];

    let identifier = 'not a command';

    for (let i = 0; i < commandPatterns.length; i++) {
        if (commandPatterns[i].test(command)) {
            identifier = i+1;
        }
    }

    return identifier;
}

/**
 * Выполняет команду <command>
 * @param {string} command - команда для выполнения
 * @returns 
 */
function executeCommand(command){
    let identifier = identifyCommand(command);

    switch(identifier) {
        case 1:
            createContact(command);
            return [];
        case 2:
            deleteContact(command);
            return [];
        case 3:
            addToCotact(command);
            return [];
        case 4:
            removeFromContact(command);
            return [];
        case 5:
            return showData(command);
        case 6:
            deleteContactsWhere(command);
            return [];
        default:
            return identifier;
    }
}

/**
 * Выполнение запроса на языке pbQL
 * @param {string} query
 * @returns {string[]} - строки с результатами запроса
 */
function run(query) {
    let showingResult = [];

    if (typeof query !== 'string') {
        throw new TypeError('query is supposed to be string');
    }
    
    if (query[query.length - 1] !== ';') {
        return syntaxError(1, query.length);
    }
    
    let commands = query.split(';');

    for (let i = 0; i < commands.length - 1; i++) {
        commandResult = executeCommand(commands[i]);
        if (commandResult === 'not a command') {
            return syntaxError(i + 1, 1);
        }
        
        showingResult = showingResult.concat(commandResult);
    }

    return showingResult;
}

module.exports = { phoneBook, run };