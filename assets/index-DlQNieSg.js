var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _numbers, _setShow, _lottoNumbers, _show, _show2, _issuedLottoNumbers, _matchedLottoStatus, _lottoStatus, _price, _winningHistory, _target, _show3;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const customCreateElement = (tagInfo) => {
  const { tagName, className, text } = tagInfo;
  const $tag = document.createElement(tagName);
  if (className) $tag.className = className;
  if (text) $tag.textContent = text;
  return $tag;
};
class Nav {
  constructor($target) {
    this.render($target);
  }
  render($target) {
    const $nav = customCreateElement({
      tagName: "nav",
      className: "nav"
    });
    const $title = customCreateElement({
      tagName: "h1",
      className: "title",
      text: "🎱 행운의 로또"
    });
    $nav.appendChild($title);
    $target.appendChild($nav);
  }
}
class Footer {
  constructor($target) {
    this.render($target);
  }
  render($target) {
    const $footer = document.createElement("footer");
    const $text = document.createElement("p");
    $footer.className = "footer";
    $text.className = "footer-text";
    $text.innerText = "Copyright 2023. woowacourse";
    $footer.appendChild($text);
    $target.appendChild($footer);
  }
}
const PRICE = Object.freeze({
  UNIT: 1e3,
  MIN: 1e3,
  MAX: 1e5
});
const LOTTO_NUMBER = Object.freeze({
  MIN: 1,
  MAX: 45,
  LENGTH: 6
});
const LOTTO_STATUS = Object.freeze([
  { RANK: 1, COUNT: 6, REWORD: 2e9, IS_BONUS: false },
  { RANK: 2, COUNT: 5, REWORD: 3e7, IS_BONUS: true },
  { RANK: 3, COUNT: 5, REWORD: 15e5, IS_BONUS: false },
  { RANK: 4, COUNT: 4, REWORD: 5e4, IS_BONUS: false },
  { RANK: 5, COUNT: 3, REWORD: 5e3, IS_BONUS: false }
]);
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const OUTPUT = Object.freeze({
  BUY_COUNT: "개를 구매했습니다.",
  WINNING_HISTORY: `
당첨통계`,
  LINE: "--------------------"
});
const ERROR_PREFIX = "[ERROR]";
const ERROR = Object.freeze({
  EMPTY: "빈 값은 입력할 수 없습니다.",
  NOT_NUMBER: "숫자가 아닌 값은 입력할 수 없습니다.",
  INVALID_RANGE: "범위를 벗어난 입력은 할 수 없습니다.",
  INCLUDE: "보너스 번호는 로또 번호와 중복될 수 없습니다.",
  UNIT: "구입 금액은 1000원 단위로 입력해야 합니다.",
  INVALID_RETRY_STRING: "y 또는 n을 입력해주세요.",
  LENGTH: "로또 번호는 6개여야 합니다.",
  DUPLICATE: "중복된 숫자가 있습니다."
});
const throwError = (message) => {
  throw new Error(`${ERROR_PREFIX} ${message}`);
};
const Validator = {
  empty: (input) => {
    if (input === "") {
      throwError(ERROR.EMPTY);
    }
  },
  range: ({ min, max }, number) => {
    if (number < min || number > max) {
      throwError(ERROR.INVALID_RANGE);
    }
  },
  number: (input) => {
    if (isNaN(Number(input))) {
      throwError(ERROR.NOT_NUMBER);
    }
  }
};
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _numbers);
    __privateSet(this, _numbers, this.sortLottoNumber(numbers));
    this.validate(__privateGet(this, _numbers));
  }
  validate(numbers) {
    numbers.forEach((number) => {
      Validator.empty(number);
      Validator.number(number);
      Validator.range({ min: LOTTO_NUMBER.MIN, max: LOTTO_NUMBER.MAX }, number);
    });
    if (new Set(numbers).size !== numbers.length) {
      throwError(ERROR.DUPLICATE);
    }
    if (numbers.length !== LOTTO_NUMBER.LENGTH) {
      throwError(ERROR.LENGTH);
    }
  }
  sortLottoNumber(numbers) {
    const arr = [...numbers];
    return arr.sort((a, b) => a - b);
  }
  getLottoNumbers() {
    return __privateGet(this, _numbers);
  }
  getSameNumbersLength(givenLottoNumber) {
    return __privateGet(this, _numbers).filter((number) => givenLottoNumber.includes(number)).length;
  }
  hasNumber(number) {
    return __privateGet(this, _numbers).includes(number);
  }
}
_numbers = new WeakMap();
const LottoFactory = {
  generateLottoNumbers: () => {
    const randomNumberStore = /* @__PURE__ */ new Set();
    while (randomNumberStore.size < LOTTO_NUMBER.LENGTH) {
      const number = getRandomNumber(LOTTO_NUMBER.MIN, LOTTO_NUMBER.MAX);
      randomNumberStore.add(number);
    }
    return [...randomNumberStore];
  },
  issueLottos: (count) => {
    return Array.from({ length: count }, () => {
      const lottoNumbers = LottoFactory.generateLottoNumbers();
      return new Lotto(lottoNumbers);
    });
  }
};
const divideByUnit = (unit, price) => Number(price / unit);
const validatePrice = (price) => {
  Validator.empty(price);
  Validator.number(price);
  Validator.range({ min: PRICE.MIN, max: PRICE.MAX }, price);
  if (price % PRICE.UNIT !== 0) {
    throwError(ERROR.UNIT);
  }
};
function create(createState) {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (nextState !== state) {
      const previousState = state;
      state = replace ? nextState : { ...state, ...nextState };
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const subscribeWithSelector = (listener, selector = getState, equalityFn = Object.is) => {
    let currentSlice = selector(state);
    function listenerToAdd() {
      const nextSlice = selector(state);
      if (!equalityFn(currentSlice, nextSlice)) {
        const previousSlice = currentSlice;
        listener(currentSlice = nextSlice, previousSlice);
      }
    }
    listeners.add(listenerToAdd);
    return () => listeners.delete(listenerToAdd);
  };
  const subscribe = (listener, selector, equalityFn) => {
    if (selector || equalityFn) {
      return subscribeWithSelector(listener, selector, equalityFn);
    }
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => listeners.clear();
  const resetState = () => {
    state = createState(setState, getState, { setState, getState });
    listeners.forEach((listener) => listener(state, state));
  };
  const api = { setState, getState, subscribe, destroy, resetState };
  state = createState(setState, getState, api);
  return api;
}
const lottoTransactionStore = create((set) => ({
  lottoTransaction: {
    price: 0,
    lottos: []
  },
  setLottoTransaction: (newLottoTransaction) => set((state) => ({
    lottoTransaction: { ...state.lottoTransaction, ...newLottoTransaction }
  }))
}));
class PurchaseForm {
  constructor($target, setShow) {
    __privateAdd(this, _setShow);
    this.$target = $target;
    __privateSet(this, _setShow, setShow);
    this.render($target);
  }
  render() {
    const $form = document.createElement("form");
    const $label = customCreateElement({
      tagName: "label",
      className: "purchase-form-info-text",
      text: "구입할 금액을 입력해주세요."
    });
    $label.setAttribute("for", "price");
    const $div = customCreateElement({
      tagName: "div",
      className: "purchase-form-input-wrap"
    });
    const $input = customCreateElement({
      tagName: "input",
      className: "purchase-form-input"
    });
    $input.placeholder = "금액";
    $input.id = "price";
    const $button = customCreateElement({
      tagName: "button",
      className: "purchase-form-button",
      text: "구입"
    });
    $button.type = "submit";
    $form.appendChild($label);
    $div.appendChild($input);
    $div.appendChild($button);
    $form.appendChild($div);
    $form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit($input);
    });
    this.$target.appendChild($form);
  }
  handleSubmit($input) {
    const price = $input.value;
    try {
      validatePrice(price);
    } catch (e) {
      alert(e.message);
      return;
    }
    const countNumber = divideByUnit(PRICE.UNIT, price);
    const lottos = LottoFactory.issueLottos(countNumber);
    __privateGet(this, _setShow).call(this, true);
    lottoTransactionStore.setState((state) => ({
      lottoTransaction: { ...state.lottoTransaction, price, lottos }
    }));
    const inputs = document.querySelectorAll(
      ".lotto-numbers-wrap > .number-input"
    );
    inputs[0].focus();
  }
}
_setShow = new WeakMap();
class LottoHistoryItem {
  constructor($target, lottoNumbers) {
    __privateAdd(this, _lottoNumbers);
    __privateSet(this, _lottoNumbers, lottoNumbers);
    this.render($target);
  }
  render($target) {
    const $li = customCreateElement({
      tagName: "li",
      className: "lotto-history-item"
    });
    const $lottoIconText = customCreateElement({
      tagName: "span",
      className: "lotto-history-item-icon",
      text: "🎟️"
    });
    const $lottoNumbersText = customCreateElement({
      tagName: "span",
      className: "lotto-history-item-text",
      text: __privateGet(this, _lottoNumbers).join(", ")
    });
    $li.appendChild($lottoIconText);
    $li.appendChild($lottoNumbersText);
    $target.appendChild($li);
  }
}
_lottoNumbers = new WeakMap();
class LottoPurchaseHistory {
  constructor($target, show) {
    __privateAdd(this, _show);
    __privateSet(this, _show, show);
    this.render($target);
  }
  render($target) {
    const { lottos, price } = lottoTransactionStore.getState().lottoTransaction;
    const countNumber = divideByUnit(PRICE.UNIT, price);
    const $div = document.createElement("div");
    const $lottosWrap = customCreateElement({
      tagName: "div",
      className: "lotto-list-wrap"
    });
    const $text = customCreateElement({
      tagName: "p",
      text: `총 ${countNumber}${OUTPUT.BUY_COUNT}`
    });
    const $ul = customCreateElement({
      tagName: "ul",
      className: "lotto-history-list"
    });
    if (!__privateGet(this, _show)) {
      $div.className = "hidden";
    }
    lottos.map((lotto) => new LottoHistoryItem($ul, lotto.getLottoNumbers()));
    $div.appendChild($text);
    $lottosWrap.appendChild($ul);
    $div.appendChild($lottosWrap);
    $target.appendChild($div);
  }
}
_show = new WeakMap();
class Button {
  constructor($target, onClick, text, type = "button") {
    this.render($target, onClick, text, type);
  }
  render($target, onClick, text, type) {
    const $button = customCreateElement({
      tagName: "button",
      className: "full-button",
      text
    });
    $button.type = type;
    $button.addEventListener("click", onClick);
    $target.appendChild($button);
  }
}
const validateBonusNumber = (enteredLottoNumbers, bonusNumber) => {
  Validator.empty(bonusNumber);
  Validator.number(bonusNumber);
  Validator.range(
    { min: LOTTO_NUMBER.MIN, max: LOTTO_NUMBER.MAX },
    bonusNumber
  );
  if (enteredLottoNumbers.includes(bonusNumber)) {
    throwError(ERROR.INCLUDE);
  }
};
const winningLottoInfoStore = create((set) => ({
  winningLottoInfo: {
    winningNumbers: [],
    bonusNumber: 0
  },
  setLottoTransaction: (newWinningLottoInfo) => set((state) => ({
    winningLottoInfo: { ...state.winningLottoInfo, ...newWinningLottoInfo }
  }))
}));
class WinningNumbersInput {
  constructor($target, winningNumbers) {
    this.render($target, winningNumbers);
  }
  render($target, winningNumbers) {
    const $fieldset = customCreateElement({
      tagName: "div",
      className: "lotto-number-input-wrap"
    });
    const $text = customCreateElement({ tagName: "legend", text: "당첨 번호" });
    const $inputWrap = customCreateElement({
      tagName: "div",
      className: "lotto-numbers-wrap"
    });
    const $inputs = this.createInput(winningNumbers);
    $fieldset.appendChild($text);
    $inputs.forEach(($input) => $inputWrap.appendChild($input));
    $fieldset.appendChild($inputWrap);
    $target.appendChild($fieldset);
  }
  createInput(winningNumbers) {
    return Array.from({ length: LOTTO_NUMBER.LENGTH }, (_, index) => {
      const input = customCreateElement({
        tagName: "input",
        className: "number-input"
      });
      input.value = winningNumbers[index] ?? "";
      input.id = `lotto${index}`;
      input.name = "lotto[]";
      return input;
    });
  }
}
class BonusNumberInput {
  constructor($target, bonusNumber) {
    this.render($target, bonusNumber);
  }
  render($target, bonusNumber) {
    const $div = customCreateElement({
      tagName: "div",
      className: "lotto-number-input-wrap bonus-input-wrap"
    });
    const $text = customCreateElement({ tagName: "span", text: "보너스 번호" });
    const $input = customCreateElement({
      tagName: "input",
      className: "number-input"
    });
    $input.value = bonusNumber === 0 ? "" : bonusNumber;
    $div.appendChild($text);
    $div.appendChild($input);
    $target.appendChild($div);
  }
}
class LottoWinningInfoForm {
  constructor($target, show) {
    __privateAdd(this, _show2);
    __publicField(this, "handleSubmit", () => {
      const $lottoNumbers = document.querySelectorAll(
        ".lotto-numbers-wrap > .number-input"
      );
      const winningNumbers = [];
      $lottoNumbers.forEach(($lottoNumber) => {
        winningNumbers.push($lottoNumber.value);
      });
      try {
        new Lotto(winningNumbers);
      } catch (e) {
        alert(e.message);
        return;
      }
      const $bonusNumber = document.querySelector(
        ".bonus-input-wrap > .number-input"
      );
      const bonusNumber = $bonusNumber.value;
      try {
        validateBonusNumber(winningNumbers, bonusNumber);
      } catch (e) {
        alert(e.message);
        return;
      }
      winningLottoInfoStore.setState((state) => ({
        winningLottoInfo: {
          ...state.winningLottoInfo,
          winningNumbers: winningNumbers.map(Number),
          bonusNumber: Number(bonusNumber)
        }
      }));
    });
    __privateSet(this, _show2, show);
    this.render($target);
  }
  render($target) {
    const $div = customCreateElement({
      tagName: "div",
      className: `${!__privateGet(this, _show2) ? "hidden" : ""} lotto-winning-info-form`
    });
    const $infoText = customCreateElement({
      tagName: "p",
      className: `${!__privateGet(this, _show2) ? "hidden" : ""} lotto-winning-info-form`,
      text: "지난 주 당첨번호 6개와 보너스 번호 1개를 입력해주세요."
    });
    const $form = customCreateElement({
      tagName: "form"
    });
    const $inputsContainer = customCreateElement({
      tagName: "div",
      className: "lotto-number-input-container"
    });
    $div.appendChild($infoText);
    $form.appendChild($inputsContainer);
    $div.appendChild($form);
    const { winningNumbers, bonusNumber } = winningLottoInfoStore.getState().winningLottoInfo;
    new WinningNumbersInput($inputsContainer, winningNumbers);
    new BonusNumberInput($inputsContainer, bonusNumber);
    new Button($form, () => {
    }, "결과 확인하기", "submit");
    $form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    $target.appendChild($div);
  }
}
_show2 = new WeakMap();
class StatisticsTable {
  constructor($target, lottoHistory) {
    this.render($target, lottoHistory);
  }
  render($target, lottoHistory) {
    const $table = customCreateElement({ tagName: "table" });
    const $tableHead = customCreateElement({
      tagName: "tr",
      className: "table-head"
    });
    const tableHeadTexts = ["일치 갯수", "당첨금", "당첨 개수"];
    tableHeadTexts.forEach((text) => {
      const $row = customCreateElement({
        tagName: "th",
        className: "col",
        text
      });
      $tableHead.appendChild($row);
    });
    $table.appendChild($tableHead);
    Object.entries(lottoHistory).toReversed().forEach(([rank, count]) => {
      const { REWORD, COUNT: MATCH_COUNT } = LOTTO_STATUS.find(
        (status) => status.RANK === Number(rank)
      );
      if (Number(rank) === 2) {
        const $tableRow2 = this.createTableRow({
          matchedCount: "5개+보너스볼",
          reword: REWORD.toLocaleString("ko-KR"),
          winningCount: count
        });
        $table.appendChild($tableRow2);
        return;
      }
      const $tableRow = this.createTableRow({
        matchedCount: `${MATCH_COUNT}개`,
        reword: REWORD.toLocaleString("ko-KR"),
        winningCount: count
      });
      $table.appendChild($tableRow);
    });
    $target.appendChild($table);
  }
  createTableRow(tableInfo) {
    const { matchedCount, reword, winningCount } = tableInfo;
    const $tableRow = customCreateElement({
      tagName: "tr",
      className: "tabel-row"
    });
    const $tableRow1 = customCreateElement({
      tagName: "td",
      text: matchedCount
    });
    const $tableRow2 = customCreateElement({
      tagName: "td",
      text: reword.toLocaleString("ko-KR")
    });
    const $tableRow3 = customCreateElement({
      tagName: "td",
      text: `${winningCount}개`
    });
    [$tableRow1, $tableRow2, $tableRow3].forEach(
      ($row) => $tableRow.appendChild($row)
    );
    return $tableRow;
  }
}
class WinningStatistic {
  constructor(winningResult, setInit) {
    this.init(winningResult, setInit);
  }
  render($target) {
    $target.appendChild(this.$div);
  }
  init(winningResult, setInit) {
    this.$div = customCreateElement({
      tagName: "div",
      className: "winning-static-container"
    });
    const $title = customCreateElement({
      tagName: "p",
      className: "winning-static-title",
      text: "🏆 당첨 통계 🏆"
    });
    this.$div.appendChild($title);
    new StatisticsTable(this.$div, winningResult.lottoHistory);
    const $rateText = customCreateElement({
      tagName: "p",
      className: "rate-text",
      text: `당신의 총 수익률은 ${winningResult.rate}입니다.`
    });
    const $footer = customCreateElement({
      tagName: "div",
      className: "winning-static-footer"
    });
    $footer.appendChild($rateText);
    this.$div.appendChild($footer);
    new Button($footer, () => setInit(), "다시 시작하기");
  }
}
class Modal {
  constructor($target, childRender) {
    this.render($target, childRender);
  }
  render($target, childRender) {
    const $modalBg = customCreateElement({
      tagName: "div",
      className: "modal-bg"
    });
    const $modal = customCreateElement({
      tagName: "div",
      className: "modal"
    });
    const $buttonWrap = customCreateElement({
      tagName: "div",
      className: "modal-close-button-wrap"
    });
    const $button = customCreateElement({
      tagName: "button",
      className: "modal-close-button"
    });
    const $iconImage = document.createElement("img");
    $iconImage.src = "../../public/x.svg";
    $button.appendChild($iconImage);
    $button.addEventListener("click", () => {
      this.closeModal($modalBg, $modal);
    });
    $modalBg.addEventListener("click", (e) => {
      if (!e.target.closest(".modal")) {
        this.closeModal($modalBg, $modal);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (!$modalBg.classList.contains("modal-none") && e.key === "Escape") {
        this.closeModal($modalBg, $modal);
      }
    });
    $buttonWrap.appendChild($button);
    $modal.appendChild($buttonWrap);
    childRender($modal);
    $modalBg.appendChild($modal);
    $target.appendChild($modalBg);
  }
  closeModal($modalBg, $modal) {
    $modalBg.classList.add("modal-none");
    $modal.classList.add("modal-none");
  }
}
class LottoMachine {
  constructor(issuedLottoNumbers) {
    __privateAdd(this, _issuedLottoNumbers);
    __privateAdd(this, _matchedLottoStatus);
    __privateSet(this, _issuedLottoNumbers, issuedLottoNumbers);
    __privateSet(this, _matchedLottoStatus, []);
  }
  updateStatus(callback) {
    const currentStatus = LOTTO_STATUS.find(callback);
    __privateGet(this, _matchedLottoStatus).push(currentStatus);
  }
  getMatchingNumbers(enteredLottoNumbers) {
    return __privateGet(this, _issuedLottoNumbers).map((lotto) => {
      return lotto.getSameNumbersLength(enteredLottoNumbers);
    });
  }
  getHasBonusNumbers(bonusLottoNumbers) {
    return __privateGet(this, _issuedLottoNumbers).map((lotto) => {
      return lotto.hasNumber(bonusLottoNumbers);
    });
  }
  updateAllLottoStatus(enteredLottoNumbers, bonusLottoNumber) {
    const matchingNumbers = this.getMatchingNumbers(enteredLottoNumbers);
    const isBonusArray = this.getHasBonusNumbers(bonusLottoNumber);
    matchingNumbers.forEach((matchingNumber, index) => {
      if (matchingNumber < 3) return;
      if (matchingNumber === 5 && isBonusArray[index]) {
        this.updateStatus((status) => status.COUNT === 5 && status.IS_BONUS);
        return;
      }
      this.updateStatus(
        (status) => status.COUNT === matchingNumber && !status.IS_BONUS
      );
    });
  }
  getMatchedLottoStatus() {
    return __privateGet(this, _matchedLottoStatus);
  }
}
_issuedLottoNumbers = new WeakMap();
_matchedLottoStatus = new WeakMap();
class LottoResult {
  constructor(lottoStatus, price) {
    __privateAdd(this, _lottoStatus);
    __privateAdd(this, _price);
    __privateAdd(this, _winningHistory);
    __privateSet(this, _lottoStatus, lottoStatus);
    __privateSet(this, _price, price);
    __privateSet(this, _winningHistory, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    this.updateWinningHistory();
  }
  updateWinningHistory() {
    __privateGet(this, _lottoStatus).forEach((status) => {
      __privateGet(this, _winningHistory)[status.RANK] += 1;
    });
  }
  getWinningHistory() {
    return __privateGet(this, _winningHistory);
  }
  calculateTotalProfit() {
    return __privateGet(this, _lottoStatus).reduce((acc, cur) => acc + cur.REWORD, 0);
  }
  calculateRate() {
    return (this.calculateTotalProfit() / __privateGet(this, _price) * 100).toFixed(1);
  }
}
_lottoStatus = new WeakMap();
_price = new WeakMap();
_winningHistory = new WeakMap();
class LottoGame {
  constructor($target) {
    __privateAdd(this, _target);
    __privateAdd(this, _show3);
    __publicField(this, "$div");
    __publicField(this, "setShow", (newState) => {
      __privateSet(this, _show3, newState);
      this.render();
    });
    __publicField(this, "setInit", () => {
      __privateSet(this, _show3, false);
      lottoTransactionStore.resetState();
      winningLottoInfoStore.resetState();
    });
    __privateSet(this, _target, $target);
    __privateSet(this, _show3, false);
    lottoTransactionStore.subscribe(() => this.render());
    winningLottoInfoStore.subscribe(() => this.render());
    this.renderStaticElement();
    this.render();
  }
  renderStaticElement() {
    const $div = customCreateElement({
      tagName: "div",
      className: "lotto-winning-result-container"
    });
    const $title = customCreateElement({
      tagName: "div",
      className: "lotto-winning-result-title",
      text: "🎱 내 번호 당첨 확인 🎱"
    });
    $div.appendChild($title);
    __privateGet(this, _target).appendChild($div);
    new PurchaseForm($div, this.setShow);
    this.$div = customCreateElement({
      tagName: "div"
    });
    $div.appendChild(this.$div);
  }
  resetStaticElements() {
    const $modal = document.querySelector(".modal-bg");
    if ($modal) $modal.remove();
    const $input = document.querySelector(".purchase-form-input");
    $input.value = "";
  }
  render() {
    this.resetStaticElements();
    this.$div.replaceChildren();
    const $modal = document.querySelector(".modal-bg");
    if ($modal) $modal.remove();
    const $input = document.querySelector(".purchase-form-input");
    $input.value = "";
    this.$div.replaceChildren();
    new LottoPurchaseHistory(this.$div, __privateGet(this, _show3));
    new LottoWinningInfoForm(this.$div, __privateGet(this, _show3));
    const winningResult = this.calculateWinningResult();
    if (!winningResult) return;
    const winningStatistic = new WinningStatistic(winningResult, this.setInit);
    new Modal(__privateGet(this, _target), ($target) => winningStatistic.render($target));
  }
  calculateWinningResult() {
    const { winningNumbers, bonusNumber } = winningLottoInfoStore.getState().winningLottoInfo;
    const { lottos, price } = lottoTransactionStore.getState().lottoTransaction;
    if (winningNumbers.length === 0 && bonusNumber === 0) return;
    const lottoMachine = new LottoMachine(lottos);
    lottoMachine.updateAllLottoStatus(winningNumbers, bonusNumber);
    const lottoStatus = lottoMachine.getMatchedLottoStatus();
    const lottoResult = new LottoResult(lottoStatus, price);
    const lottoHistory = lottoResult.getWinningHistory();
    const rate = lottoResult.calculateRate();
    return { lottoHistory, rate };
  }
}
_target = new WeakMap();
_show3 = new WeakMap();
class App {
  constructor() {
    this.render();
  }
  render() {
    const $body = document.querySelector("body");
    const $container = customCreateElement({
      tagName: "section",
      className: "container"
    });
    new Nav($body);
    $body.appendChild($container);
    new LottoGame($container);
    new Footer($body);
  }
}
new App();
