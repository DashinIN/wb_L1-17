//17.Необходимо реализовать простое поле ввода адреса с функцией геокодинга: пользователь 
// вводит данные в поле с помощью одного из геоинформационных сервисов (Яндекс.Карты, ДаДата, GraphHopper),
//  подбирается адрес. Найденные данные должны отображаться в выпадающем списке, из которого можно выбрать
//   подходящее значение. Реализовать дебоунсинг и защиту от троттлинга с помощью замыканий.

//Будем использовать JavaScript API и HTTP Геокодер яндекса.

function debounceAndThrottle(func, delay, limit) {
    let timeoutId; //Управление таймерами
    let inThrottle; //Состояние тротлинга
  
    return function (...args) {
       //При каждом вызове функции сначала очищается предыдущий таймер дебаунсинга (timeoutId).
       clearTimeout(timeoutId);
        //Внутри функции проверяется, не включен ли уже режим защиты от тротлинга (inThrottle). 
      if (!inThrottle) {
        //Если не включен, функция вызывается и режим защиты от тротлинга включается. 
        func.apply(this, args);
        inThrottle = true;
        // Затем устанавливается таймер, который через limit миллисекунд
        // снова выключит режим защиты от тротлинга.
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
      // Затем устанавливается новый таймер дебаунсинга. Это гарантирует,
      // что функция будет вызвана только после того, как не было ввода в течение delay миллисекунд.
    };
  }


const inputHandler = (e) => {
    //Если значение инпута не пустое ..
    e.target.value.length > 0 ?
    // .. делаем запрос к API
    ymaps.ready(init(e.target.value))
    //.. в обратном случае убираем блок вариантов
    : optionsWrapper.style.display = 'none'
}

const debouncedAndThrottledHandleInput = debounceAndThrottle(inputHandler, 500, 2000);
//Когда начинается ввод, функция будет вызвана с задержкой дебаунсинга (500 мс), 
//чтобы обработать последний ввод после окончания серии быстрых вызовов. 
//При этом она будет ограничена защитой от тротлинга, чтобы удерживать интервал 
//между вызовами не менее 2000 мс.

let input = document.querySelector('.input');
//При вводе в инпут обрабатываем поле
input.addEventListener('input', debouncedAndThrottledHandleInput)

let optionsWrapper = document.querySelector('.options__wrapper');
optionsWrapper.addEventListener('click', (e) => {
    //при клике заменяем поле инпута содержимым выбранного варианта
    input.value =  e.target.innerText
    if(e.target.classList.contains('item')) {
    //и скрываем блок вариантов
        optionsWrapper.style.display = 'none'
    }
}
)

const init = (text) => {
    console.log('Вызов API')

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


