var service = {
    cars: JSON.parse(localStorage.getItem('cars')) || [],
    history: JSON.parse(localStorage.getItem('history')) || [],
    save_data: function() {
        localStorage.setItem('cars', JSON.stringify(this.cars));
        localStorage.setItem('history', JSON.stringify(this.history));
    },
    add_car: function(series, year, purpose, manufacter) {
        let id = this.cars.length ? this.cars[this.cars.length - 1].id + 1 : 1;
        this.cars.push({ id, series, year, purpose, manufacter });
        this.history.push(`Добавлена новая запись с ID ${id}`);
        this.save_data();
    },
    remove_car: function(id) {
        this.cars = this.cars.filter(car => car.id !== id);
        this.history.push(`Запись с ID ${id} была удалена`);
        this.save_data();
        update_tabl();
    },
    get_manufacter_by_purpose: function(purpose) {
        return [...new Set(this.cars.filter(car => car.purpose === purpose).map(car => car.manufacter))];
    },
    add_property_to_car: function(id, key, value) {
        let car = this.cars.find(car => car.id === id);
        if (car) {
            car[key] = value;
            this.save_data();
            update_tabl();
        }
    },
    add_new_input_field: function(propertyName) {
        let container = document.getElementById('new_properties_container');
        if (document.getElementById(`input_${propertyName}`)) {
            alert("Это свойство уже добавлено!");
            return;
        }
        let div = document.createElement('div');
        div.className = "input1";
        div.innerHTML = 
        `
            <label for="input_${propertyName}">Введите ${propertyName}:</label>
            <input type="text" id="input_${propertyName}" placeholder="${propertyName}">
            <button onclick="save_new_property('${propertyName}')">Добавить свойство</button>
        `;
        container.appendChild(div);
    },
    find_car_by_id: function(id) {
        return this.cars.find(car => car.id === id) || null;
    },
    display_car_info: function(id) {
        let car = this.find_car_by_id(id);
        if (car) {
            let infoText = 
            `
                Серия: ${car.series}  
                Год изготовления: ${car.year}  
                Назначение: ${car.purpose}  
                Производитель: ${car.manufacter}
            `;
            let additionalProps = Object.keys(car).filter(key => !["id", "series", "year", "purpose", "manufacter"].includes(key));
            additionalProps.forEach(key => {
                infoText += `\n${key}: ${car[key]}`;
            });
            alert(infoText);
        } else {
            alert("Автомобиль не найден!");
        }
    }
};

function save_new_property(propertyName) {
    let id = parseInt(document.getElementById('select_item').value);
    let value = document.getElementById(`input_${propertyName}`).value;
    if (!id) {
        alert("Выберите автомобиль!");
        return;
    }
    if (!value) {
        alert("Введите значение свойства!");
        return;
    }
    service.add_property_to_car(id, propertyName, value);
}

function update_car_list() {
    let select = document.getElementById('select_item');
    select.innerHTML = "";
    service.cars.forEach(car => {
        let option = document.createElement('option');
        option.value = car.id;
        option.textContent = `ID: ${car.id} (${car.series})`;
        select.appendChild(option);
    });
}

function update_table_headers() {
    let thead = document.getElementById('car_table').querySelector('thead');
    let allKeys = new Set(service.cars.flatMap(car => Object.keys(car)));
    if (allKeys.size > 0) {
        let headerRow = document.createElement('tr');
        let headerMap = {
            id: "ID",
            series: "Серия",
            year: "Год",
            purpose: "Назначение",
            manufacter: "Производитель"
        };
        allKeys.forEach(key => {
            let th = document.createElement('th');
            th.textContent = headerMap[key] || key;
            headerRow.appendChild(th);
        });
        thead.innerHTML = "";
        thead.appendChild(headerRow);
    }
}

function update_tabl() {
    let tbody = document.getElementById('car_table').querySelector('tbody');
    tbody.innerHTML = "";
    service.cars.forEach(car => {
        let row = document.createElement('tr');
        Object.keys(car).forEach(key => {
            let cell = document.createElement('td');
            cell.textContent = car[key];
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
    update_table_headers();
    update_history(); 
}

function update_history() {
    let historyList = document.getElementById('history_list');
    historyList.innerHTML = "";
    service.history.forEach(entry => {
        let listItem = document.createElement('li');
        listItem.textContent = entry;
        historyList.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    update_car_list();
    update_tabl();
    update_history(); 
});

document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();
    let series = document.getElementById('series').value;
    let year = document.getElementById('year').value;
    let purpose = document.getElementById('purpose').value;
    let manufacter = document.getElementById('manufacter').value;
    service.add_car(series, year, purpose, manufacter);
    update_car_list();
    update_tabl();
    this.reset();
});

document.getElementById('clear_but').addEventListener('click', function() {
    document.getElementById('form').reset();
});

document.getElementById('delete_car').addEventListener('click', function() {
    let id = parseInt(document.getElementById('select_item').value);
    if (id) {
        service.remove_car(id);
        update_car_list();
        update_tabl();
    }
});

document.getElementById('show_manufacter').addEventListener('click', function() {
    let purpose = prompt("Введите назначение:");
    if (purpose) {
        alert("Производители: " + service.get_manufacter_by_purpose(purpose).join(', '));
    }
});

document.getElementById('add_new_input').addEventListener('click', function() {
    let propertyName = prompt("Введите название нового свойства:");
    if (propertyName) {
        service.add_new_input_field(propertyName);
    }
});

document.getElementById('search_car').addEventListener('click', function() {
    let id = parseInt(prompt("Введите ID автомобиля:"));
    service.display_car_info(id);
});