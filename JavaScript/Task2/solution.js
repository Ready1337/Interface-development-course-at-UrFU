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

/**
 * Добавляет телефоны <newPhones> в спискок телефонов и почты <newEmails> в список почт для контакта <name>
 * @param {string[]} newPhones - список телефонов для добавления к контакту <name>
 * @param {string[]} newEmails - список почт для добавления к контакту <name>
 * @param {string} name - имя контакта, в который необходимо записать новые данные
 * @returns 
 */
function addToCotact(newPhones, newEmails, name) {
    if (!phoneBook.has(name)) {
        return;
    }

    for (let i = 0; i < newPhones.length; i++) {
        phoneBook.get(name).phones.push(newPhones[i]);
    }

    for (let i = 0; i < newEmails.length; i++) {
        phoneBook.get(name).emails.push(newEmails[i]);
    }
}

/**
 * Удаляет телефоны <oldPhones> из списка телефонов и почты <oldEmails> из списка почт контакта <name>
 * @param {string[]} oldPhones - список телефонов для удаления из контакта <name>
 * @param {string[]} oldEmails - список почт для удаления из контакта <name>
 * @param {string} name - имя контакта, из которого необходимо удалить старые данные
 * @returns
 */
function removeFromContact(oldPhones, oldEmails, name) {
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
function matchData(pattern) {
    const matcher = new Map();

    const names = phoneBook.keys();
    for (let name in names) {
        matcher.set(name, 0);
    }


    for (let name of names) {
        if (name.indexOf(pattern) >= 0) {
            matcher.set(name, 1);
        }
        
        if (matcher.get(name) === 0) {
            const phones = phoneBook.get(name).phones;
            for (let phone of phones) {
                if (phone.indexOf(pattern) >= 0 && matcher.get(name) === 0){
                    matcher.set(name, 1);
                }
            }
        }

        if (matcher.get(name) === 0) {
            const emails = phoneBook.get(name).emails;
            for (let email of emails) {
                if (email.indexOf(pattern) >= 0 && matcher.get(name) === 0){
                    matcher.set(name, 1);
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
function showData(requestedFormat, pattern) {
    if (pattern === ''){
        return;
    }

    const data = [];

    const matcher = matchData(pattern);
    for (let match of matcher.keys()) {
        if (matcher.get(match) === 1) {
            let formattedData = ''

            let name = match;
            let emailsLine = getEmailsLine(match);
            let phonesLine = getPhonesLine(match);

            for (let i = 0;  i < requestedFormat.length ; i++) {
                let formatPart = requestedFormat[i];
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

                if (i < requestedFormat.length - 1) {
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
function deleteContactsWhere(pattern) {
    if (pattern === '') {
        return;
    }

    const matcher = matchData(pattern);
    for (const match of matcher.keys()) {
        if (matcher.get(match) === 1) {
            deleteContact(match);
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

    for (let i = 0; i < commandPatterns.length; i++) {
        if (commandPatterns[i].test(command)) {
            return i+1;
        }
    }

    return 0;
}

//todo
function checkCommand(command) {
    if (identifyCommand(command) !== 0) {
        return 1;
    }

    return 0;
}

//todo
function checkQuery(queryLine) {
    if (typeof queryLine !== 'string') {
        throw new TypeError('query is supposed to be string');
    }
    
    let commands = queryLine.split(';');

    if (queryLine[queryLine.length - 1] !== ';') {
        return syntaxError(commands.length, queryLine.length);
    }

    for (let i = 0; i < commands.length; i++) {
        let symbolPos = checkCommand(commands[i]);
        if (symbolPos === 0) {
            return syntaxError(i + 1, symbolPos);
        }
    }
}

/**
 * Собирает данные из команды <command> и возвращает часть данных, указанных в параметре <requiered>
 * @param {string} command - команда, из которой нужно собрать данные
 * @param {string} requiered - название части данных, которую необходимо вернуть
 * @returns 
 */
function getDataFromCommand(command, requiered) {
    const re = [
        /^Добавь (.+) для контакта ([^;]+)$/,
        /^Удали (.+) для контакта ([^;]+)$/
    ];

    let index = 1;
    if (re[0].test(command)){
        index = 0;
    }

    const allData = command.replace(re[index], '$1\n$2').split('\n');
    if (requiered === 'name'){
        return allData[1];
    }
    const phonesAndEmails = allData[0].split(' и ');
    
    const phones = [];
    const emails = [];
    for (let i = 0; i < phonesAndEmails.length; i++) {
        if (phonesAndEmails[i].length === 18 && phonesAndEmails[i][0] === 'т') {
            phones.push(phonesAndEmails[i].slice(8, phonesAndEmails[i].length));
        }
        else {
            emails.push(phonesAndEmails[i].slice(6, phonesAndEmails[i].length));
        }
    }

    if (requiered === 'phones') {
        return phones;
    }    

    return emails;
}

/**
 * Собирает данные из команды <command> и возвращает часть данных, указанных в параметре <requiered>
 * @param {*} command - команда, из которой нужно собрать данные 
 * @param {*} requiered - название части данных, которую необходимо вернуть
 * @returns 
 */
function getShowDataFromCommand(command, requiered) {
    const re = /^Покажи (.+) для контактов, где есть (.+)?$/;

    const allData = command.replace(re, '$1\n$2').split('\n');
    if (requiered === 'pattern') {
        const pattern = allData[1];
        return pattern;
    }
    const format = allData[0].split(' и ');

    return format;
}

/**
 * Вытягивает данные из команды и преобразует в формат, необходимый для работы с данными
 * @param {number} identifier - порядковый идентификатор переданной команды <command>
 * @param {string} command - команда для исполнения
 * @returns {Any} - данные в нужном формате
 */
function prepareData(identifier, command) {
    switch(identifier) {
        case 1:
            return command.slice(15, command.length);
        case 2:
            return command.slice(14, command.length);
        case 3:
            return {
              newPhones: getDataFromCommand(command, 'phones'),
              newEmails: getDataFromCommand(command, 'emails'),
              name: getDataFromCommand(command, 'name')
            };
        case 4:
            return {
              oldPhones: getDataFromCommand(command, 'phones'),
              oldEmails: getDataFromCommand(command, 'emails'),
              name: getDataFromCommand(command, 'name')
            };
        case 5:
            return {
                requestedFormat: getShowDataFromCommand(command, 'format'),
                pattern: getShowDataFromCommand(command, 'pattern')
            };
    }
}

/**
 * Исполняет команды в соответствии с заданным идентификатором <identifier>
 * @param {number} identifier - идентификатор 
 * @param {object} data - предобработанные данные в формате, необходимом для корректного выполнения комманд
 * @returns 
 */
function executeCommand(identifier, data){
    switch(identifier) {
        case 1:
            createContact(data);
            return [];
        case 2:
            deleteContact(data);
            return [];
        case 3:
            addToCotact(data.newPhones, data.newEmails, data.name);
            return [];
        case 4:
            removeFromContact(data.oldPhones, data.oldEmails, data.name);
            return [];
        case 5:
            return showData(data.requestedFormat, data.pattern);
    }
}

/**
 * Выполняет команды в соответствии с запросом <queryLine>
 * @param {*} queryLine - запрос
 * @returns {Any} - результат всех "покажи"
 */
function executeQuery(queryLine) {
    let showingResult = [];
    
    let commands = queryLine.split(';');
    for (let i = 0; i < commands.length; i++) {
        if (commands[i] !== '') {
            let commandIdentifier = identifyCommand(commands[i]);
            let commandData = prepareData(commandIdentifier, commands[i]);
            showingResult = showingResult.concat(executeCommand(commandIdentifier, commandData));
        }
    }

    return showingResult;
}

/**
 * Выполнение запроса на языке pbQL
 * @param {string} query
 * @returns {string[]} - строки с результатами запроса
 */
function run(query) {
    //checkQuery(query);

    return executeQuery(query);
}

module.exports = { phoneBook, run };