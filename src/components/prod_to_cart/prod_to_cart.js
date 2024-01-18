(() => {
  // получение кнопки товара для добавления в корзиру
  const productBtn = document.querySelectorAll('.product__btn');
  // получение корзины блока списка
  const cartProductsList = document.querySelector('.cart-content__list');
  // получение корзины текста блока
  const cart = document.querySelector('.cart');
  // получ колличества в корзине
  const cartQuantity = document.querySelector('.cart__quantity');
  // получ эл тотальной суммы
  const fullPrice = document.querySelector('.fullprice');

  let price = 0;

  const randomId = () => {
    // рандомный id для карточки товара
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const priceWithoutSpace = (str) => {
    // удаление пробелов
    return str.replace(/\s/g, '');
  };

  const normalPrice = (str) => {
    // преобразование числа в строку с пробелами и знаком валюты
    return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  }

  const plusFullPrice = (currentPrice) => {
    return price += currentPrice;
  }

  const minusFullPrice = (currentPrice) => {
    return price -= currentPrice;
  }

  const printFullPrice = () => {
    fullPrice.textContent = `${normalPrice(price)} ₽`;
  }

  const printQuantity = () => {
    // let length = cartProductsList.querySelector('.simplebar-content').children.length; // cart-content__list
    let length = cartProductsList.children.length;
    // console.log(length);
    cartQuantity.textContent = length;
    length > 0 ? cart.classList.add('active') : cart.classList.remove('active');
  }

  const generateCartProduct = (id, img, title, price) => {
    return `
  <li class="cart-content__item">
    <article class="cart-content__product cart-product" data-id="${id}">
      <img src="${img}" alt="candele" class="cart-product__img">
      <div class="cart-product__body">
        <h3 class="cart-product__title">${title}</h3>
        <span class="cart-product__price">${price}</span>
      </div>
      <button class="cart-product__delete" aria-label="удалить товар">
      </button>
    </article>
  </li>
  `;
  }

  // обработка действий клипа на кн товара

  productBtn.forEach(el => {
    el.closest('.product').setAttribute('data-id', randomId());
    el.addEventListener('click', (e) => {
      let self = e.currentTarget;
      let parent = self.closest('.product');
      let id = parent.dataset.id;
      let img = parent.querySelector('.image-switch__img img').getAttribute('src');
      let title = parent.querySelector('.product__title').textContent;
      let priceString = parent.querySelector('.product-price__current').textContent;
      let priceNumber = parseInt(priceWithoutSpace(parent.querySelector('.product-price__current').textContent));

      // console.log(self);
      // console.log(parent);
      // console.log(id);
      // console.log(img);
      // console.log(title);
      // console.log(priceString);
      // console.log(priceNumber);

      // summ
      // print full price
      // add to cart
      // count and print quantity
      // dasabled btn   self.disable = true;

      plusFullPrice(priceNumber);
      printFullPrice();
      // cartProductsList.querySelector('.simplebar-content').insertAdjacentHTML('afterbegin', generateCartProduct(id, img, title, priceString));
      cartProductsList.insertAdjacentHTML('afterbegin', generateCartProduct(id, img, title, priceString));

      printQuantity();

      self.disabled = true;

    })
  });

  const deleteProducts = (productParent) => {
    let id = productParent.querySelector('.cart-product').dataset.id;
    document.querySelector(`.product[data-id="${id}"]`).querySelector('.product__btn').disabled = false;
    let currentPrice = parseInt(priceWithoutSpace(productParent.querySelector('.cart-product__price').textContent));
    minusFullPrice(currentPrice);
    printFullPrice();
    productParent.remove();

    printQuantity();

    // get id
    // disabled false
    // minus price
    // print full price
    // remove productParent
    // count and print quantity

  };

  cartProductsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-product__delete')) {
      deleteProducts(e.target.closest('.cart-content__item'));
    }
  });
})();




