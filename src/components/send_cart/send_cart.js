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
  // 2step
  const orderModalOpenProd = document.querySelector('.order-modal__open-btn');
  const orderModalList = document.querySelector('.order-modal__list');
  const orderModalQuantity = document.querySelector('.order-modal__quantity > span');
  const orderModalSumm = document.querySelector('.order-modal__summ > span');

  let productArray = [];


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
    orderModalSumm.textContent = `${normalPrice(price)}`;
  }

  const printQuantity = () => {
    // let length = cartProductsList.querySelector('.simplebar-content').children.length; // cart-content__list
    let length = cartProductsList.children.length;
    // console.log(length);
    cartQuantity.textContent = length;
    orderModalQuantity.textContent = length;
    length > 0 ? cart.classList.add('active') : cart.classList.remove('active');
  }

  const generateCartProduct = (id, img, title, price) => {
    return `
  <li class="cart-content__item">
    <article class="cart-content__product cart-product product-id" data-id="${id}">
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


  const generateModalProduct = (id, img, title, price) => {
    return `
          <li class="order-modal__item">
            <article class="order-modal__product order-product product-id"  data-id="${id}">
              <img src="${img}" alt="candele" class="order-product__img">
              <div class="order-product__body">
                <h3 class="order-product__title">${title}</h3>
                <span class="order-product__price">${price}</span>
              </div>
              <button class="order-product__delete" aria-label="удалить">удалить</button>
            </article>
          </li>
          `;
  };
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
      orderModalList.insertAdjacentHTML('afterbegin', generateModalProduct(id, img, title, priceString));
      printQuantity();

      self.disabled = true;

    })
  });

  const deleteProducts = (id_for_del) => {
    // let id = productParent.querySelector('.product-id').dataset.id;
    let itemProd = document.querySelector(`.product[data-id="${id_for_del}"]`);
    itemProd.querySelector('.product__btn').disabled = false;
    //product-price__current
    let currentPrice = parseInt(priceWithoutSpace(itemProd.querySelector('.product-price__current').textContent));
    minusFullPrice(currentPrice);
    printFullPrice();

    cartProductsList.querySelector(`[data-id="${id_for_del}"]`).parentElement.remove();
    // productParent.remove();

    orderModalList.querySelector(`[data-id="${id_for_del}"]`).parentElement.remove();

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
      deleteProducts(e.target.closest('.cart-content__item').querySelector('.product-id').dataset.id);
    }
  });

  orderModalList.addEventListener('click', (e) => {
    if (e.target.classList.contains('order-product__delete')) {
      deleteProducts(e.target.closest('.order-modal__item').querySelector('.product-id').dataset.id);
    }
  });

  // 2step orderModalList
  let flagOrderModal = 0;
  orderModalOpenProd.addEventListener('click', (e) => {
    if (flagOrderModal == 0) {
      orderModalOpenProd.classList.add('open');
      orderModalList.classList.add('open');
      // или получить высоту скрытого блока
      // orderModalList.getElementsByClassName.maxHeight = orderModalList.scrollHeight + 'px';
      // orderModalList.style.display = 'block';
      flagOrderModal = 1;
    } else {
      orderModalOpenProd.classList.remove('open');
      orderModalList.classList.remove('open');
      // orderModalList.getElementsByClassName.maxHeight = null;
      // orderModalList.style.display = 'none';
      flagOrderModal = 0;
    }

  });

  // необходимо дописать из orderModalList получить все Id передать json {order: [id1, id2...]}
  document.querySelector('.order-modal__form').addEventListener('submit', (e) => {
    let selfTarget = e.currentTarget;
    e.preventDefault();
    let formData = new FormData(selfTarget);

    let name = selfTarget.querySelector('[name="name"]').value;
    let tel = selfTarget.querySelector('[name="tel"]').value;
    let email = selfTarget.querySelector('[name="email"]').value;


    let array = orderModalList.children;

    for (let elem of array) {
      productArray.push(elem.querySelector('.order-product').dataset.id);

    };

    formData.append('products', JSON.stringify(productArray));
    formData.append('name', name);
    formData.append('tel', tel);
    formData.append('email', email);

    // тестовый код =====================
    console.log(productArray);
    console.log(formData);

    let response = fetch('/send-email', {
      method: 'POST',
      body: (formData),
      headers: { 'Content-Type': 'application/json' },
    });
    // ================================
    selfTarget.reset();
  });

})();




