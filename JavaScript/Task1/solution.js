'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
    // Ваше решение
    if (!(Number.isInteger(a) && Number.isInteger(b))) {
        throw new TypeError();
    }

    return a + b;
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
    // Ваше решение
    if (!Number.isInteger(year)) {
        throw new TypeError();
    }

    if (year <= 0) {
        throw new RangeError();
    }

    return parseInt((year - 1) / 100) + 1;
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
    // Ваше решение
    if (typeof hexColor !== 'string') {
        throw new TypeError();
    }

    let isHexColol = hexColor.length === 7 && !isNaN(Number('0x' + hexColor.substr(1,6))) && hexColor.substr(0,1) === '#';
    if (!isHexColol) {
        throw new RangeError();
    }
    
    let red = parseInt(hexColor.substr(1, 2), 16);
    let green = parseInt(hexColor.substr(3, 2), 16);
    let blue = parseInt(hexColor.substr(5, 2), 16);

    return `(${red}, ${green}, ${blue})`;
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
    // Ваше решение
    if ((!isNaN(n) && String(n).includes('.')) || (n <= 0 && Number.isInteger(n))) {
        throw new RangeError();   
    }
    
    if (!Number.isInteger(n)) {
        throw new TypeError();
    }

    if (n < 3) {
        return 1;
    }

    let prev = 1;
    let xN = 2;
    for (let i = 0; i < n - 3; i++) {
        xN += prev;
        prev = xN - prev;
    }

    return xN;
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
    // Ваше решение
    if (!(Array.isArray(matrix)) || (Array.isArray(matrix) && matrix.length === 0) || (Array.isArray(matrix) && !Array.isArray(matrix[0]))) {
        throw new TypeError();
    }

    let M = matrix.length;
    let N = matrix[0].length;
    
    let transposedMatrix = [];
    for (let i = 0; i < N; i++) {
        transposedMatrix.push([]);
    }

    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            transposedMatrix[j][i] = matrix[i][j];
        }
    }

    return transposedMatrix;
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
    // Ваше решение
    if (!((!isNaN(n) && String(n).includes('.') || Number.isInteger(n)) && Number.isInteger(targetNs))) {
        throw new TypeError();
    }

    if (targetNs < 2 || targetNs > 36) {
        throw new RangeError();
    }

    return n.toString(targetNs);
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
    // Ваше решение
    if (typeof phoneNumber !== 'string') {
        throw new TypeError();
    }

    let correctLength = phoneNumber.length === 15;

    let correctPrefix = phoneNumber.substr(0, 6) === '8-800-';

    let suffixDigitsIsNumber = !isNaN(phoneNumber.substr(6,3) + phoneNumber.substr(10,2) + phoneNumber.substr(13,2));
    let suffixDashesExist = phoneNumber[9] + phoneNumber[12] === '--';
    let correctSuffix = suffixDigitsIsNumber && suffixDashesExist;

    return correctLength && correctPrefix && correctSuffix; 
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
    // Ваше решение
    if (typeof text !== 'string') {
        throw new TypeError();
    }

    let countSmiles = 0;
    for (let i = 0; i < text.length; i++) {
        if (i < text.length - 2 && text.substr(i, 3) === ':-)') {
            countSmiles += 1;
        }

        if (i > 1 && text.substr(i - 2, 3) === '(-:') {
            countSmiles += 1;
        }
    }

    return countSmiles;
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
    // Ваше решение
    function checkWin(attempt) {
        switch(attempt) {
            case 'xxx':
                return 'x';
            case 'ooo':
                return 'o';
        }

        return '';
    }

    let winner = '';

    for (let i = 0; i < field.length; i++) {
        let fieldColumn = checkWin(field[i][0] + field[i][1] + field[i][2]);
        let fieldRaw = checkWin(field[0][i] + field[1][i] + field[2][i]);

        winner += fieldColumn;
        winner += fieldRaw;
    }

    let mainDiagonal = checkWin(field[0][0] + field[1][1] + field[2][2]);
    let sideDiagobal = checkWin(field[0][2] + field[1][1] + field[2][0]);

    winner += mainDiagonal;
    winner += sideDiagobal;

    return (winner === 'x' || winner === 'o') ? winner : 'draw';
}

module.exports = {
    abProblem,
    centuryByYearProblem,
    colorsProblem,
    fibonacciProblem,
    matrixProblem,
    numberSystemProblem,
    phoneProblem,
    smilesProblem,
    ticTacToeProblem
};