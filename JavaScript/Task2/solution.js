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
 * Создает новый контакт с именем <name> с пустыми списками телефонов и почт
 * @param {string} name - имя контакта, содержащее любые символы, кроме ;
*/
function createContact(command) {
    let name = command.slice(15, command.length);
    
    if (phoneBook.has(name)) {
        return;
    }

    phoneBook.set(name, {phones: [], emails: []});
}

/**
 * Удаляет контакт с именем <name>
 * @param {string} name - имя контакта, содержащее любые символы, кроме ;
 */
function deleteContact(command) {
    let name = command.slice(14, command.length);

    phoneBook.delete(name);
}

/**
 * Собирает данные из команды <command> и возвращает часть данных, указанных в параметре <requiered>
 * @param {string} command - команда, из которой нужно собрать данные
 * @param {string} requiered - название части данных, которую необходимо вернуть
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

function getPhones(phonesLine) {
    const phonesAndEmails = phonesLine.split(' и ');
    const phones = [];

    for (let i = 0; i < phonesAndEmails.length; i++) {
        if (phonesAndEmails[i].slice(0, 7) === 'телефон') {
            phones.push(phonesAndEmails[i].slice(8, phonesAndEmails[i].length));
        }
    }

    return phones;
}

function getEmails(emailsLine) {
    const phonesAndEmails = emailsLine.split(' и ');
    const emails = [];

    for (let i = 0; i < phonesAndEmails.length; i++) {
        if (phonesAndEmails[i].slice(0, 5) === 'почту') {
            emails.push(phonesAndEmails[i].slice(6, phonesAndEmails[i].length));
        }
    }

    return emails;
}

/**
 * Добавляет телефоны <newPhones> в спискок телефонов и почты <newEmails> в список почт для контакта <name>
 * @param {string[]} newPhones - список телефонов для добавления к контакту <name>
 * @param {string[]} newEmails - список почт для добавления к контакту <name>
 * @param {string} name - имя контакта, в который необходимо записать новые данные
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
 * Удаляет телефоны <oldPhones> из списка телефонов и почты <oldEmails> из списка почт контакта <name>
 * @param {string[]} oldPhones - список телефонов для удаления из контакта <name>
 * @param {string[]} oldEmails - список почт для удаления из контакта <name>
 * @param {string} name - имя контакта, из которого необходимо удалить старые данные
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
 * @returns {Map} - результат разметки телефонной книги. 1 - контакт помечен, 0 - контакт не помечен
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
 * Возвращает информацию из телефонной книги <phoneBook> в виде списка строк в запрашиваемом формате <requestedFormat>
 * Информация возвращается в соответствии с запращиваемыми полями, для подходящих под запрос <pattern> контактов
 * Более подробно поведение функциии описано в постановке задачи
 * @param {string[]} requestedFormat - формат, который должен соблюдаться строками в возвращаемом списке
 * @param {string} pattern - паттерн, в соответствии с которым информация о контакте отображается или не отображается 
 * @returns {string []} - информация из телефонной книги <phoneBook> в виде списка строк в запрашиваемом формате <requestedFormat>
 * @example
    phoneBook = {
        'Егор' => {
            phones: [ '5556667788' ],
            emails: [ 'egor.zinovjev2013@yandex.ru' ]
        },
        'Клон Егора' => {
            phones: [ '5556667788' ],
            emails: [ 'egor.zinovjev2013@yandex.ru' ]
        }
        'Совсем не Е Г О Р' => {
            phones: [ '5556667788' ],
            emails: [ 'egor.zinovjev2013@yandex.ru' ]
        }
    }
 
    requestedFormat = [
        'почты',
        'почты',
        'имя',
        'телефоны'
    ];
    
    pattern = 'Егор';
    console.log(showData(requestedFormat, pattern));
     // [ 'egor.zinovjev2013@yandex.ru;egor.zinovjev2013@yandex.ru;Егор;+7 (555) 666-77-88', egor.zinovjev2013@yandex.ru;egor.zinovjev2013@yandex.ru;Клон Егора;+7 (555) 666-77-88' ]
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
 * Удаляет контакты из телефонной книги, содержащие подстроку <pattern>
 * @param {string} pattern - подстрока для удаления контактов 
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
 * @param {string} command
 * @returns {number} - порядковый индентификатор переданной команды <command>
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
 * Исполняет команды в соответствии с заданным идентификатором <identifier>
 * @param {number} identifier - идентификатор 
 * @param {object} data - предобработанные данные в формате, необходимом для корректного выполнения комманд
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
        return syntaxError(commands.length, query.length);
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