
var test = {
    "Вопрос 1":[
        "Вариант ответа № 1",
        "Вариант ответа № 2",
        "Вариант ответа № 3"
    ],

    "Вопрос 2":[
        "Вариант ответа № 1",
        "Вариант ответа № 2",
        "Вариант ответа № 3"

    ],

    "Вопрос 3":[
        "Вариант ответа № 1",
        "Вариант ответа № 2",
        "Вариант ответа № 3"
    ]
};

var rightAnswers = {
    "Вопрос 1":[
        "Вариант ответа № 2"
    ],

    "Вопрос 2":[
        "Вариант ответа № 3"
    ],

    "Вопрос 3":[
        "Вариант ответа № 1"
    ]
};

var pageBuilder = {
    createElem: function(tag, className) {
        var elem = document.createElement(tag);
        if (className) {
            elem.classList.add(className);
        }
        return elem;
    },

    appendElem: function(parent, newElem, className, inText) {
        var elem = this.createElem(newElem, className);
        elem = parent.appendChild(elem);
        if(inText != '') {
            elem.innerHTML = inText;
        }
        return elem;
    },

    createForm: function (parent,obj,className) {
        var form = this.appendElem(parent, 'form', className, '');
        var formlist;

        for (var questions in obj) {
            formlist = pageBuilder.appendElem(form, 'ul', 'test_form__item', questions);
            for(var answers in obj[questions]) {
                pageBuilder.createCheckBox(formlist, 'test_form__checkbox', questions, obj[questions][answers]);
            }
        }
        pageBuilder.createSubmit(form, 'test_form__submit', 'проверить мои результаты');
    },

    createCheckBox: function(parent, className, name, inText) {
        var label = this.createElem('label', '');
        var elem = this.createElem('input', className);
        var span = this.createElem('span', 'checkbox_span');
        label = parent.appendChild(label);
        elem.type = "checkbox";
        elem.name = name;
        elem.value = inText;
        label.appendChild(elem);
        elem = label.appendChild(span);
        elem.innerHTML = inText;

    },

    createSubmit: function(parent, className, value) {
        var elem = this.appendElem(parent, 'input', className, '');
        elem.type = "button";
        elem.value = value;
    },

    init: function() {
        var wrapper = this.appendElem(document.body, 'div', 'wrapper', '<h1>тест по программированию</h1>');
        this.createForm(wrapper, test, 'test_form');


    }
};

var testStorage = {

    supportStorage: function () {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            alert('LocalStorage нет!!!');
            return false;
        }

    },

    fillStorage: function (obj, name) {
        if (this.supportStorage()) {
            localStorage[name] = JSON.stringify(obj);
            return true;
        } else {
            alert('Нет localStorage !!!');
            return false;
        }
    },

    receiveStorage: function (name) {
            return JSON.parse(localStorage[name]);
        }
};

var Resault= {

    normalizeAnswers: function (name) {
        var answerArray = testStorage.receiveStorage(name);
        var normalizeObj = {};
        var answer = [];
        for (var i = 0; i < answerArray.length; i++) {

            var item = answerArray[i];
            var itemName = item.name;
            var itemValue = item.value;

            if (itemName in normalizeObj) {
                answer.push(itemValue);
                normalizeObj[itemName] = answer;
            } else {
                answer = [];
                answer.push(itemValue);
                normalizeObj[itemName] = answer;
            }
        }
        return normalizeObj;
    },

    arrayEqual: function (a, b) {
        return a.length == b.length
            ? a.every(function (el, i) {
            return el === b[i];
        }, b)
            : false;
    },

    checkAnswers: function (testObj, userObj) {

        for (var item in testObj) {
            if (item in userObj) {
                if (!(Resault.arrayEqual(testObj[item], userObj[item]))) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    },

    fillResault: function (testObj, userObj, resault) {
        var msg1;

        if (resault) {
            msg1 = '<div class="modal_resault">тест здан</div>';
        } else {
            msg1 = '<div class="modal_resault resault_fail">Тест не сдан</div></br>';
            msg1 += '<div class="modal_head">ответы:</div>';
            for (var questions in userObj) {
                msg1 += '</br>' + questions + ':</br> ';
                for (var answers in userObj[questions]) {
                    msg1 += userObj[questions][answers] + '</br>';
                }
            }
        }
        msg1 = msg1 + '<br/><div class="modal_head">Правильные ответы:</div>';
        for (questions in testObj) {
            msg1 += '</br>' + questions + ':</br>';
            for (answers in testObj[questions]) {
                msg1 += testObj[questions][answers] + '</br>';
            }
        }

        return msg1;
    }
   

};

$(function () {
    pageBuilder.init();

    $('.test_form__submit').on('click',function () {

        if( testStorage.fillStorage($('.test_form').serializeArray(), 'userAnswers') ){
            var norm = Resault.normalizeAnswers('userAnswers');
            
            if(Resault.checkAnswers( rightAnswers, norm)) {
                $('.modal-body').html(Resault.fillResault(rightAnswers, norm, 1));
            } else {
                $('.modal-body').html(Resault.fillResault(rightAnswers, norm, 0));
            }
            $('.modal').modal('show');

        }
        $('.test_form__checkbox').prop('checked', false);
    })
});

