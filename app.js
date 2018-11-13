let storage = {
    income_items: [],
    expenses_items: [],
    income_values_arr: [],
    expenses_values_arr: [],
    income_sum: 0,
    expenses_sum: 0,
    available: 0
};


const income_arr = storage.income_values_arr;

// UI Elements
const income_list = document.querySelector('.income .income__list');
const expenses_list = document.querySelector('.expenses .expenses__list');
const form = document.forms['add_new_item_form'];
const add_description = document.querySelector('.add__description');
const add_value = document.querySelector('.add__value');
const add_type = document.querySelector('.add__type');
const selected_option = document.querySelector('select').selectedIndex;
const submit_buttton = document.querySelector('button');
const add_block = document.querySelector('.add');

// Events

/**
 * form.addEventListener('submit') - добавление через форму нового объекта ("+" - income / "-" - expenses)
 */
const add_item = form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (document.querySelector('select').selectedIndex === 0) {
        add_new_income_item(add_description.value, add_value.value);
        form.reset();
        storage.income_sum = storage.income_sum + +storage.income_items[storage.income_items.length - 1].value
        document.querySelector('.budget__income--value').innerText = '+ ' + storage.income_sum + '.00';
    } else if (document.querySelector('select').selectedIndex === 1) {
        add_new_expenses_item(add_description.value, add_value.value);
        add_description.value = '';
        add_value.value = '';
        storage.expenses_sum = storage.expenses_sum + +storage.expenses_items[storage.expenses_items.length - 1].value
        document.querySelector('.budget__expenses--value').innerText = '- ' + storage.expenses_sum + '.00';
    }

    storage.available = storage.income_sum - storage.expenses_sum;
    document.querySelector('.budget__value').innerText = storage.available + '.00';
});

/**
 * 
 */
const add_red_focus = add_type.addEventListener('click', (e) => {

    if (document.querySelector('select').selectedIndex === 1) {
        const add_type_red_focus = add_type.classList.add('red-focus');
        const add_description_red_focus = add_description.classList.add('red-focus');
        const add_value_red_focus = add_value.classList.add('red-focus');
        const submit_buttton_red_focus = submit_buttton.classList.add('red');
    } else if (document.querySelector('select').selectedIndex === 0) {
        const add_type_red_focus_remove = add_type.classList.remove('red-focus');
        const add_description_red_focus_remove = add_description.classList.remove('red-focus');
        const add_value_red_focus_remove = add_value.classList.remove('red-focus');
        const submit_buttton_red_focus_remove = submit_buttton.classList.remove('red');
    }
});


/**
 * income_list.addEventListener('click') - удаление income-элемента
 */
income_list.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
        let deleted_item_value = +e.target.closest('div .item__delete').previousElementSibling.innerText;
        storage.income_sum = storage.income_sum - deleted_item_value;
        document.querySelector('.budget__income--value').innerText = '+ ' + storage.income_sum + '.00';

        storage.available = storage.available - deleted_item_value;
        document.querySelector('.budget__value').innerText = storage.available + '.00';
    }

    if (e.target.closest('button')) {
        const id = e.target.closest('.item').dataset.itemId;
        delete_item(id);
    }

});

/**
 * expenses_list.addEventListener('click') - удаление expenses-элемента
 */
expenses_list.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
        let deleted_item_value = +e.target.closest('div .item__delete').previousElementSibling.innerText;
        storage.expenses_sum = storage.expenses_sum - deleted_item_value;
        document.querySelector('.budget__expenses--value').innerText = '- ' + storage.expenses_sum + '.00';

        storage.available = storage.available + deleted_item_value;
        document.querySelector('.budget__value').innerText = storage.available + '.00';
    }

    if (e.target.closest('button')) {
        const id = e.target.closest('.item').dataset.itemId;
        delete_item(id);
    }
});

/**
 * generate_id - создает произвольную строку 
 * @returns {string} - новый id
 */

const generate_id = () => {
    const words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let id = "";

    for (let i = 0; i < 10; i++) {
        let index = Math.floor(Math.random() * words.length);
        id += words[index];
    }

    return id;
}

/**
 * add_new_income_item - функция для добавления нового income
 * @param {string} description - описание 
 * @param {number} value - значение
 */

const add_new_income_item = (description, value) => {
    const new_income_item = { description, value, id: generate_id() };

    storage.income_items.push(new_income_item);

    add_new_income_item_template(new_income_item);

    return storage.income_items;
}

/**
 * add_new_income_item_template - функция добавления add_new_income_item в шаблон
 * @param {*} income 
 */

const add_new_income_item_template = (income) => {
    const template = create_income_tempate(income);
    income_list.insertAdjacentHTML("beforeend", template);
}

/**
 * create_income_tempate - функция для добавления шаблона
 * @param income
 */

const create_income_tempate = (income) => {
    return `
     <div class="item clearfix" data-item-id="${income.id}">
        <div class="item__description">${income.description}</div>
        <div class="right clearfix">
            <div class="item__value">${income.value}</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline remove-item"></i></button>
            </div>
        </div>
     </div>
     `;
}

/**
 * add_new_expenses_item - функция для добавления нового expenses
 * @param {string} description - описание 
 * @param {number} value - значение
 */

const add_new_expenses_item = (description, value) => {
    const new_expenses_item = { description, value, id: generate_id() };

    storage.expenses_items.push(new_expenses_item);

    add_new_expenses_item_template(new_expenses_item);

    return storage.expenses_items;
}

/**
 * add_new_expenses_item_template - функция добавления add_new_income_item в шаблон
 * @param {*} expenses 
 */

const add_new_expenses_item_template = (expenses) => {
    const template = create_expenses_tempate(expenses);
    expenses_list.insertAdjacentHTML("beforeend", template);
}

/**
 * create_expenses_tempate - функция для добавления шаблона
 * @param expenses
 */

const create_expenses_tempate = (expenses) => {
    return `
     <div class="item clearfix" data-item-id="${expenses.id}">
        <div class="item__description">${expenses.description}</div>
        <div class="right clearfix">
            <div class="item__value">${expenses.value}</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline remove-item"></i></button>
            </div>
        </div>
     </div>
     `;
}

/**
 * delete_todo_item - удаление одной задачи
 * @param {sting} id 
 */

const delete_item = id => {
    storage.income_items = storage.income_items.filter(item => item.id !== id);
    storage.expenses_items = storage.expenses_items.filter(item => item.id !== id);

    delete_item_from_html(id);

    return storage.income_items, storage.expenses_items;
}

const delete_item_from_html = id => {
    const target = document.querySelector(`[data-item-id="${id}"]`);
    const target_parent = target.parentElement;
    target_parent.removeChild(target);
}