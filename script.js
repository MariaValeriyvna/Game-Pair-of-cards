window.addEventListener('DOMContentLoaded', function game() {
  class NewCard {
    constructor(number, i) {
      const description = [
        '',
        'Алексей Саврасов "Зимний пейзаж"',
        'Иван Шишкин "Парк в Павловске"',
        'Густав Климт "Поцелуй"',
        'Винсент Виллем Ван Гог "Звездная ночь"',
        'Винсент Виллем Ван Гог "Автопортрет с обрезанным ухом"',
        'Илья Репин "Л.Н.Толстой"',
        'Рафаэль Санти "Гений с ангельским характером"',
        'Ян ван Эйк "Дева Мария"',
        'Виктор Васнецов "Аленушка"',
        'Ян Вермер "Девушка с жемчужной сережкой"',
        'Пабло Пикасо "Девочка на шаре"',
        'Карл Брюллов "Итальянский полдень"',
        'Иван Айвазовский "Море"',
        'Карл Брюллов "Всадница"',
        'Леонардо да Винчи "Джоконда (Мона Лиза)"',
        'Исаак Левитан (Белая Сирень)"',
      ];
      this.pic = `url("./img/${number}.jpg")`;
      this.id = i;
      this.descriptionCard = description[number];
    }

    renderCard() {
      let card = document.createElement('li');
      card.classList.add('card');
      card.id = this.id;
      document.querySelector('.table').appendChild(card);
      return card;
    }
  }

  function renderPackCards(nums = 4) {
    let packCards = [];
    let arrNumbers = [];
    let unicNumbersForPackCards = new Set();
    let i = 0;
    const maxCounts = 16;
    while (i < nums) {
      let numberCard = choiseNumberForCard(arrNumbers, unicNumbersForPackCards);
      arrNumbers.push(numberCard);
      unicNumbersForPackCards.add(numberCard);
      let card = new NewCard(numberCard, i);
      packCards.push(card);
      card.render = card.renderCard();
      i++;
    }
    function choiseNumberForCard(arr, unicArr) {
      let number;
      if (unicArr.size !== nums / 2) number = randomNumber1(maxCounts, arr);
      else if (unicArr.size == nums / 2)
        number = randomNumber2(unicArr.size, Array.from(unicArr), arr);

      return number;
    }

    function randomNumber1(max, arr) {
      let number = Math.floor(Math.random() * max + 1);
      let arrRepeatNumbers = arr.filter((value) => value == number);
      if (arrRepeatNumbers.length == 2) number = randomNumber1(max, arr);
      return number;
    }

    function randomNumber2(max, unicArr, arr) {
      let index = Math.floor(Math.random() * max);
      let number = unicArr[index];
      let arrRepeatNumbers = arr.filter((value) => value == number);
      if (arrRepeatNumbers.length == 2) {
        unicArr.splice(index, 1);
        number = randomNumber2(unicArr.length, unicArr, arr);
      }
      return number;
    }

    return packCards;
  }

  function clearTable(arr = []) {
    arr = [];
    document.querySelector('.table').innerHTML = '';
    return arr;
  }

  let arrOpenCard = [];
  let countCouples = 0;
  let nums;
  let pack;
  let sec, secInt;
  function seconds(stop = false) {
    let tic = document.querySelector('.clock');
    if (stop) {
      clearInterval(secInt);
      return;
    }
    if (sec !== 0) clearInterval(secInt);
    sec = 0;
    secInt = setInterval(() => {
      let secTablo = `0${sec}`;
      if (secTablo.length > 2) secTablo = sec;
      tic.innerText = `:${secTablo}`;
      sec++;
    }, 1000);
  }
  document.querySelector('.rules-btn').addEventListener('click', function () {
    let numsCards = document.getElementById('numsCards');
    nums = Number(numsCards.value);
    if (nums % 2 || nums < 4 || nums > 32) {
      numsCards.value = 4;
      nums = 4;
    }
    pack = clearTable(pack);
    const winBlock = document.querySelector('.rules__win')
    if (winBlock)winBlock.remove();
    pack = renderPackCards(nums);
    seconds();
  });

  document.querySelector('.table').addEventListener('click', function (ev) {
    const targetCard = ev.target;
    const idCard = ev.target.id;

    if (
      targetCard.tagName !== 'LI' ||
      (targetCard.tagName === 'LI' &&
        targetCard.style.backgroundImage == pack[idCard].pic)
    )
      return;
    else {
      let desc = document.createElement('p');
      desc.classList.add('descrip');
      desc.innerText = pack[idCard].descriptionCard;
      document.getElementById(`${idCard}`).appendChild(desc);

      if (
        arrOpenCard.length === 2 &&
        arrOpenCard[0].style.backgroundImage !==
          arrOpenCard[1].style.backgroundImage
      ) {
        closeCard(arrOpenCard);
        arrOpenCard = [];
      } else if (arrOpenCard.length === 2) {
        arrOpenCard = [];
        countCouples++;
      }

      arrOpenCard.push(targetCard);
      targetCard.style.backgroundImage = pack[idCard].pic;
      if (countCouples === nums / 2 - 1 && arrOpenCard.length == 2) {
        let win = document.createElement('p');
        win.classList.add('rules__win');
        let resultSec = document.querySelector('.clock').innerText;
        win.innerText = `Все ${nums / 2} ${
          nums <= 8 ? 'пары' : 'пар'
        } открыты за ${resultSec.slice(1)} сек !`;
        document.querySelector('.win').appendChild(win);
        document.querySelector('.rules-btn').innerText = 'Сыграть еще раз?';
        seconds(true);
        arrOpenCard = [];
        countCouples = 0;
      }
    }

    function closeCard(cards) {
      cards.forEach(
        (card) =>
          setTimeout(() => {
            let cardParent = document.getElementById(card.id);
            if (cardParent.childNodes[0])
              cardParent.removeChild(cardParent.childNodes[0]);
            card.style.backgroundImage = `url('./img/card.jpg')`;
          }),
        1000
      );
      clearTimeout();
    }
  });
});
