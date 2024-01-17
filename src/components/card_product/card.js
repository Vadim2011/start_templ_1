
// получаем все карточки продуктов в секции
const products = document.querySelectorAll('.product');

// перебираем каждую карточку
if (products) {
  products.forEach(el => {
    let currentProduct = el;
    // в карточке на выбираем каждый блок с картинкой
    const imageSwitchItems = currentProduct.querySelectorAll('.image-switch__item');
    // в карточке выбираем пустой блок с пагинац
    const imagePagination = currentProduct.querySelector('.image-pagination');
    // перебираем блоки с картинками
    if (imageSwitchItems.length > 1) {
      imageSwitchItems.forEach((el, index) => {
        // добавляем блоку с картинкой атрибут дата
        el.setAttribute('data-index', index);
        // добавляем на каждой итерации блок точки пагинац с атрибут дата
        imagePagination.innerHTML += `<li data-index="${index}"
        class="image-pagination__item ${index == 0 ? 'image-pagination__item--active' : ''}"></li>`

        // на каждый блок картинки навешиваем слушатель наведения мыши
        el.addEventListener('mouseenter', (e) => {
          // у всех точек удаляем актив
          currentProduct.querySelectorAll('.image-pagination__item').forEach(el => {
            el.classList.remove('image-pagination__item--active');
          });
          // добавляем актив на точку с атриб дата соотв атр дата блока картинки на который навели
          currentProduct.querySelector(`.image-pagination__item[data-index="${e.currentTarget.dataset.index}"]`).classList.add('image-pagination__item--active');
        });
        // удаляем у всех акт добавл акт к 0 точке при удаленни мыши из области
        el.addEventListener('mouseleave', (e) => {
          currentProduct.querySelectorAll('.image-pagination__item').forEach(el => {
            el.classList.remove('image-pagination__item--active');
          });
          currentProduct.querySelector(`.image-pagination__item[data-index="0"]`).classList.add('image-pagination__item--active');
        });
      });
    }
  })
}


