//17.Необходимо реализовать простое поле ввода адреса с функцией геокодинга: пользователь 
// вводит данные в поле с помощью одного из геоинформационных сервисов (Яндекс.Карты, ДаДата, GraphHopper),
//  подбирается адрес. Найденные данные должны отображаться в выпадающем списке, из которого можно выбрать
//   подходящее значение. Реализовать дебоунсинг и защиту от троттлинга с помощью замыканий.

//Будем использовать JavaScript API и HTTP Геокодер яндекса.

function debounce(func, delay) {
    let timerId;
    return function(...args) {
     //При каждом вызове функции сначала очищается предыдущий таймер дебаунсинга (timeoutId).
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
      // Затем устанавливается новый таймер дебаунсинга. Это гарантирует,
      // что функция будет вызвана только после того, как не было ввода в течение delay миллисекунд.
    };
  }
//Функция дебаунса будет вызывать переданную функцию только после того,
// как пройдет определенное время с момента последнего вызова.

const inputHandler = (e) => {
    //Если значение инпута не пустое ..
    e.target.value.length > 0 ?
    // .. делаем запрос к API
    ymaps.ready(init(e.target.value))
    //.. в обратном случае убираем блок вариантов
    : optionsWrapper.style.display = 'none'
}

const debouncedHandleInput = debounce(inputHandler, 800);
//Функция будет вызвана с задержкой дебаунсинга (800 мс), 
//чтобы обработать последний ввод после окончания серии быстрых вызовов. 

let input = document.querySelector('.input');
//При вводе в инпут обрабатываем поле
input.addEventListener('input', debouncedHandleInput)

let optionsWrapper = document.querySelector('.options__wrapper');
optionsWrapper.addEventListener('click', (e) => {
    //при клике заменяем поле инпута содержимым выбранного варианта
    input.value =  e.target.innerText
    if(e.target.classList.contains('item')) {
    //и скрываем блок вариантов
        optionsWrapper.style.display = 'none'
    }
})

const init = (text) => {
    ymaps.geocode(text, { results: 5})
    .then(function (res) {
        let optionsWrapper = document.querySelector('.options__wrapper');
        //Отчищаем блок вариантов
        optionsWrapper.innerHTML = ''
        //Делаем его видимым
        optionsWrapper.style.display = 'block' 
        for (let i = 0; i < 5; i++) {
            //Для каждого найденного варианта создаем свой блок и добавляем в блок вариантов
            let object = res.geoObjects.get(i)
            let option = document.createElement('div');
            option.className = 'item'
            option.textContent = object.properties._data.description + ' ' + object.properties._data.name;
            optionsWrapper.appendChild(option);
        }       
    });
}


