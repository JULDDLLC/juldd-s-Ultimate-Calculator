(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // .wrangler/tmp/bundle-RIIFuj/checked-fetch.js
  var urls = /* @__PURE__ */ new Set();
  function checkURL(request, init) {
    const url = request instanceof URL ? request : new URL(
      (typeof request === "string" ? new Request(request, init) : request).url
    );
    if (url.port && url.port !== "443" && url.protocol === "https:") {
      if (!urls.has(url.toString())) {
        urls.add(url.toString());
        console.warn(
          `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
        );
      }
    }
  }
  __name(checkURL, "checkURL");
  globalThis.fetch = new Proxy(globalThis.fetch, {
    apply(target, thisArg, argArray) {
      const [request, init] = argArray;
      checkURL(request, init);
      return Reflect.apply(target, thisArg, argArray);
    }
  });

  // .wrangler/tmp/bundle-RIIFuj/strip-cf-connecting-ip-header.js
  function stripCfConnectingIPHeader(input, init) {
    const request = new Request(input, init);
    request.headers.delete("CF-Connecting-IP");
    return request;
  }
  __name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
  globalThis.fetch = new Proxy(globalThis.fetch, {
    apply(target, thisArg, argArray) {
      return Reflect.apply(target, thisArg, [
        stripCfConnectingIPHeader.apply(null, argArray)
      ]);
    }
  });

  // C:/Users/juldd/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
  var __facade_middleware__ = [];
  function __facade_register__(...args) {
    __facade_middleware__.push(...args.flat());
  }
  __name(__facade_register__, "__facade_register__");
  function __facade_registerInternal__(...args) {
    __facade_middleware__.unshift(...args.flat());
  }
  __name(__facade_registerInternal__, "__facade_registerInternal__");
  function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
    const [head, ...tail] = middlewareChain;
    const middlewareCtx = {
      dispatch,
      next(newRequest, newEnv) {
        return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
      }
    };
    return head(request, env, ctx, middlewareCtx);
  }
  __name(__facade_invokeChain__, "__facade_invokeChain__");
  function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
    return __facade_invokeChain__(request, env, ctx, dispatch, [
      ...__facade_middleware__,
      finalMiddleware
    ]);
  }
  __name(__facade_invoke__, "__facade_invoke__");

  // C:/Users/juldd/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/loader-sw.ts
  var __FACADE_EVENT_TARGET__;
  if (globalThis.MINIFLARE) {
    __FACADE_EVENT_TARGET__ = new (Object.getPrototypeOf(WorkerGlobalScope))();
  } else {
    __FACADE_EVENT_TARGET__ = new EventTarget();
  }
  function __facade_isSpecialEvent__(type) {
    return type === "fetch" || type === "scheduled";
  }
  __name(__facade_isSpecialEvent__, "__facade_isSpecialEvent__");
  var __facade__originalAddEventListener__ = globalThis.addEventListener;
  var __facade__originalRemoveEventListener__ = globalThis.removeEventListener;
  var __facade__originalDispatchEvent__ = globalThis.dispatchEvent;
  globalThis.addEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.addEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalAddEventListener__(type, listener, options);
    }
  };
  globalThis.removeEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.removeEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalRemoveEventListener__(type, listener, options);
    }
  };
  globalThis.dispatchEvent = function(event) {
    if (__facade_isSpecialEvent__(event.type)) {
      return __FACADE_EVENT_TARGET__.dispatchEvent(event);
    } else {
      return __facade__originalDispatchEvent__(event);
    }
  };
  globalThis.addMiddleware = __facade_register__;
  globalThis.addMiddlewareInternal = __facade_registerInternal__;
  var __facade_waitUntil__ = Symbol("__facade_waitUntil__");
  var __facade_response__ = Symbol("__facade_response__");
  var __facade_dispatched__ = Symbol("__facade_dispatched__");
  var __Facade_ExtendableEvent__ = class ___Facade_ExtendableEvent__ extends Event {
    static {
      __name(this, "__Facade_ExtendableEvent__");
    }
    [__facade_waitUntil__] = [];
    waitUntil(promise) {
      if (!(this instanceof ___Facade_ExtendableEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this[__facade_waitUntil__].push(promise);
    }
  };
  var __Facade_FetchEvent__ = class ___Facade_FetchEvent__ extends __Facade_ExtendableEvent__ {
    static {
      __name(this, "__Facade_FetchEvent__");
    }
    #request;
    #passThroughOnException;
    [__facade_response__];
    [__facade_dispatched__] = false;
    constructor(type, init) {
      super(type);
      this.#request = init.request;
      this.#passThroughOnException = init.passThroughOnException;
    }
    get request() {
      return this.#request;
    }
    respondWith(response) {
      if (!(this instanceof ___Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      if (this[__facade_response__] !== void 0) {
        throw new DOMException(
          "FetchEvent.respondWith() has already been called; it can only be called once.",
          "InvalidStateError"
        );
      }
      if (this[__facade_dispatched__]) {
        throw new DOMException(
          "Too late to call FetchEvent.respondWith(). It must be called synchronously in the event handler.",
          "InvalidStateError"
        );
      }
      this.stopImmediatePropagation();
      this[__facade_response__] = response;
    }
    passThroughOnException() {
      if (!(this instanceof ___Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#passThroughOnException();
    }
  };
  var __Facade_ScheduledEvent__ = class ___Facade_ScheduledEvent__ extends __Facade_ExtendableEvent__ {
    static {
      __name(this, "__Facade_ScheduledEvent__");
    }
    #scheduledTime;
    #cron;
    #noRetry;
    constructor(type, init) {
      super(type);
      this.#scheduledTime = init.scheduledTime;
      this.#cron = init.cron;
      this.#noRetry = init.noRetry;
    }
    get scheduledTime() {
      return this.#scheduledTime;
    }
    get cron() {
      return this.#cron;
    }
    noRetry() {
      if (!(this instanceof ___Facade_ScheduledEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#noRetry();
    }
  };
  __facade__originalAddEventListener__("fetch", (event) => {
    const ctx = {
      waitUntil: event.waitUntil.bind(event),
      passThroughOnException: event.passThroughOnException.bind(event)
    };
    const __facade_sw_dispatch__ = /* @__PURE__ */ __name(function(type, init) {
      if (type === "scheduled") {
        const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
          scheduledTime: Date.now(),
          cron: init.cron ?? "",
          noRetry() {
          }
        });
        __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
        event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      }
    }, "__facade_sw_dispatch__");
    const __facade_sw_fetch__ = /* @__PURE__ */ __name(function(request, _env, ctx2) {
      const facadeEvent = new __Facade_FetchEvent__("fetch", {
        request,
        passThroughOnException: ctx2.passThroughOnException
      });
      __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
      facadeEvent[__facade_dispatched__] = true;
      event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      const response = facadeEvent[__facade_response__];
      if (response === void 0) {
        throw new Error("No response!");
      }
      return response;
    }, "__facade_sw_fetch__");
    event.respondWith(
      __facade_invoke__(
        event.request,
        globalThis,
        ctx,
        __facade_sw_dispatch__,
        __facade_sw_fetch__
      )
    );
  });
  __facade__originalAddEventListener__("scheduled", (event) => {
    const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
      scheduledTime: event.scheduledTime,
      cron: event.cron,
      noRetry: event.noRetry.bind(event)
    });
    __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
    event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
  });

  // C:/Users/juldd/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
  var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } finally {
      try {
        if (request.body !== null && !request.bodyUsed) {
          const reader = request.body.getReader();
          while (!(await reader.read()).done) {
          }
        }
      } catch (e) {
        console.error("Failed to drain the unused request body.", e);
      }
    }
  }, "drainBody");
  var middleware_ensure_req_body_drained_default = drainBody;

  // C:/Users/juldd/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
  function reduceError(e) {
    return {
      name: e?.name,
      message: e?.message ?? String(e),
      stack: e?.stack,
      cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
    };
  }
  __name(reduceError, "reduceError");
  var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } catch (e) {
      const error = reduceError(e);
      return Response.json(error, {
        status: 500,
        headers: { "MF-Experimental-Error-Stack": "true" }
      });
    }
  }, "jsonError");
  var middleware_miniflare3_json_error_default = jsonError;

  // .wrangler/tmp/bundle-RIIFuj/middleware-insertion-facade.js
  __facade_registerInternal__([middleware_ensure_req_body_drained_default, middleware_miniflare3_json_error_default]);

  // script.js
  document.addEventListener("DOMContentLoaded", function() {
    const basicCalc = new BasicCalculator();
    const scientificCalc = new ScientificCalculator();
    const cryptoCalc = new CryptocurrencyCalculator();
    const unitConverter = new UnitConverter();
    const history = new CalculationHistory();
    const themeManager = new ThemeManager();
    const calculateRateBtn = document.getElementById("calculate-rate");
    const resetFreelanceBtn = document.getElementById("reset-freelance");
    const copyRateBtn = document.getElementById("copy-rate");
    if (calculateRateBtn) {
      calculateRateBtn.addEventListener("click", calculateFreelanceRate);
    }
    if (resetFreelanceBtn) {
      resetFreelanceBtn.addEventListener("click", resetFreelanceCalculator);
    }
    if (copyRateBtn) {
      copyRateBtn.addEventListener("click", copyRateToClipboard);
    }
    const projectHoursInput = document.getElementById("project-hours");
    if (projectHoursInput) {
      projectHoursInput.addEventListener("input", function() {
        document.getElementById("project-hours-display").textContent = this.value;
      });
    }
    function calculateFreelanceRate() {
      const targetIncome = parseFloat(document.getElementById("target-income").value);
      const billableHours = parseFloat(document.getElementById("billable-hours").value);
      const workWeeks = parseFloat(document.getElementById("work-weeks").value);
      const nonBillablePercent = parseFloat(document.getElementById("non-billable").value);
      const expenses = parseFloat(document.getElementById("expenses").value);
      const taxBuffer = parseFloat(document.getElementById("tax-buffer").value);
      const projectHours = parseFloat(document.getElementById("project-hours").value);
      const effectiveHoursPerWeek = billableHours * (1 - nonBillablePercent / 100);
      document.getElementById("effective-hours").textContent = effectiveHoursPerWeek.toFixed(1);
      const totalHoursPerMonth = effectiveHoursPerWeek * workWeeks;
      const requiredPreTaxIncome = targetIncome + expenses;
      const totalRequiredIncome = requiredPreTaxIncome / (1 - taxBuffer / 100);
      const hourlyRate = totalRequiredIncome / totalHoursPerMonth;
      document.getElementById("hourly-rate").textContent = "$" + hourlyRate.toFixed(2);
      const projectRate = hourlyRate * projectHours;
      document.getElementById("project-rate").textContent = "$" + projectRate.toFixed(2);
      const annualIncome = hourlyRate * effectiveHoursPerWeek * workWeeks * 12;
      document.getElementById("annual-income").textContent = "$" + annualIncome.toFixed(2);
      const resultCards = document.querySelectorAll(".result-card");
      resultCards.forEach((card) => {
        card.style.animation = "none";
        setTimeout(() => {
          card.style.animation = "pulse 0.5s";
        }, 10);
      });
      history.addCalculation("Freelance Rate", `$${targetIncome} target income`, `$${hourlyRate.toFixed(2)}/hour`);
    }
    __name(calculateFreelanceRate, "calculateFreelanceRate");
    function resetFreelanceCalculator() {
      document.getElementById("target-income").value = 5e3;
      document.getElementById("billable-hours").value = 30;
      document.getElementById("work-weeks").value = 4;
      document.getElementById("non-billable").value = 30;
      document.getElementById("expenses").value = 500;
      document.getElementById("tax-buffer").value = 20;
      document.getElementById("project-hours").value = 10;
      document.getElementById("project-hours-display").textContent = 10;
      document.getElementById("effective-hours").textContent = "0";
      document.getElementById("hourly-rate").textContent = "$0";
      document.getElementById("project-rate").textContent = "$0";
      document.getElementById("annual-income").textContent = "$0";
    }
    __name(resetFreelanceCalculator, "resetFreelanceCalculator");
    function copyRateToClipboard() {
      const hourlyRate = document.getElementById("hourly-rate").textContent;
      navigator.clipboard.writeText(hourlyRate).then(() => {
        showToast("Rate copied to clipboard!");
      }).catch(() => {
        const tempInput = document.createElement("input");
        tempInput.value = hourlyRate;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        showToast("Rate copied to clipboard!");
      });
    }
    __name(copyRateToClipboard, "copyRateToClipboard");
    const categoryItems = document.querySelectorAll(".category-item");
    const categoryContents = document.querySelectorAll(".category-content");
    categoryItems.forEach((item) => {
      item.addEventListener("click", function() {
        const category = this.getAttribute("data-category");
        categoryItems.forEach((item2) => item2.classList.remove("active"));
        this.classList.add("active");
        categoryContents.forEach((content) => {
          if (content.id === category) {
            content.classList.add("active");
          } else {
            content.classList.remove("active");
          }
        });
      });
    });
    const timeCalculateBtn = document.getElementById("time-calculate-btn");
    if (timeCalculateBtn) {
      timeCalculateBtn.addEventListener("click", calculateTime);
    }
    function calculateTime() {
      const hours1 = parseInt(document.getElementById("time-hours1").value) || 0;
      const minutes1 = parseInt(document.getElementById("time-minutes1").value) || 0;
      const seconds1 = parseInt(document.getElementById("time-seconds1").value) || 0;
      const hours2 = parseInt(document.getElementById("time-hours2").value) || 0;
      const minutes2 = parseInt(document.getElementById("time-minutes2").value) || 0;
      const seconds2 = parseInt(document.getElementById("time-seconds2").value) || 0;
      const operation = document.getElementById("time-operation").value;
      let totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1;
      let totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2;
      let resultSeconds;
      switch (operation) {
        case "add":
          resultSeconds = totalSeconds1 + totalSeconds2;
          break;
        case "subtract":
          resultSeconds = totalSeconds1 - totalSeconds2;
          if (resultSeconds < 0) resultSeconds = 0;
          break;
        default:
          resultSeconds = 0;
      }
      const resultHours = Math.floor(resultSeconds / 3600);
      resultSeconds %= 3600;
      const resultMinutes = Math.floor(resultSeconds / 60);
      const resultSecondsOnly = resultSeconds % 60;
      document.getElementById("time-result-hours").textContent = resultHours;
      document.getElementById("time-result-minutes").textContent = resultMinutes;
      document.getElementById("time-result-seconds").textContent = resultSecondsOnly;
      const input = `${hours1}:${minutes1}:${seconds1} ${operation} ${hours2}:${minutes2}:${seconds2}`;
      const result = `${resultHours}:${resultMinutes}:${resultSecondsOnly}`;
      history.addCalculation("Time Calculator", input, result);
    }
    __name(calculateTime, "calculateTime");
    const tipCalculateBtn = document.getElementById("tip-calculate-btn");
    if (tipCalculateBtn) {
      tipCalculateBtn.addEventListener("click", calculateTip);
    }
    function calculateTip() {
      const billAmount = parseFloat(document.getElementById("bill-amount").value);
      const tipPercentage = parseFloat(document.getElementById("tip-percentage").value);
      const numPeople = parseInt(document.getElementById("num-people").value) || 1;
      if (isNaN(billAmount) || isNaN(tipPercentage)) {
        showToast("Please enter valid bill amount and tip percentage", "error");
        return;
      }
      const tipAmount = billAmount * (tipPercentage / 100);
      const totalAmount = billAmount + tipAmount;
      const perPersonAmount = totalAmount / numPeople;
      animateValue("tip-amount", 0, tipAmount, 500);
      animateValue("total-amount", 0, totalAmount, 500);
      animateValue("per-person-amount", 0, perPersonAmount, 500);
      history.addCalculation("Tip Calculator", `$${billAmount} bill, ${tipPercentage}% tip`, `$${totalAmount.toFixed(2)} total`);
    }
    __name(calculateTip, "calculateTip");
    document.addEventListener("click", function(e) {
      if (e.target.matches(".copy-result")) {
        copyToClipboard(e.target.dataset.value || e.target.textContent);
      }
    });
    document.addEventListener("keydown", function(e) {
      if (e.ctrlKey && e.key === "h") {
        e.preventDefault();
        toggleHistory();
      }
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        themeManager.toggleTheme();
      }
    });
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
    inputs.forEach((input) => {
      input.addEventListener("input", debounce(saveInputState, 500));
    });
    loadInputStates();
  });
  var BasicCalculator = class {
    static {
      __name(this, "BasicCalculator");
    }
    constructor() {
      this.display = document.querySelector(".calculator-current");
      this.history = document.querySelector(".calculator-history");
      this.currentInput = "0";
      this.operator = null;
      this.previousInput = null;
      this.waitingForOperand = false;
      this.calculationHistory = [];
      this.init();
    }
    init() {
      document.querySelectorAll(".calculator-button").forEach((button) => {
        button.addEventListener("click", (e) => {
          this.handleButtonClick(e.target);
        });
      });
      document.addEventListener("keydown", (e) => this.handleKeyboard(e));
      this.addButtonAnimations();
    }
    handleButtonClick(button) {
      const value = button.textContent;
      button.classList.add("pressed");
      setTimeout(() => button.classList.remove("pressed"), 150);
      if (button.classList.contains("number")) {
        this.inputNumber(value);
      } else if (button.classList.contains("operator")) {
        this.inputOperator(value);
      } else if (button.classList.contains("equals")) {
        this.calculate();
      } else if (button.classList.contains("clear")) {
        this.clear();
      } else if (button.classList.contains("decimal")) {
        this.inputDecimal();
      } else if (button.classList.contains("backspace")) {
        this.backspace();
      }
      this.updateDisplay();
    }
    inputNumber(num) {
      if (this.waitingForOperand) {
        this.currentInput = num;
        this.waitingForOperand = false;
      } else {
        this.currentInput = this.currentInput === "0" ? num : this.currentInput + num;
      }
    }
    inputDecimal() {
      if (this.waitingForOperand) {
        this.currentInput = "0.";
        this.waitingForOperand = false;
      } else if (this.currentInput.indexOf(".") === -1) {
        this.currentInput += ".";
      }
    }
    inputOperator(nextOperator) {
      const inputValue = parseFloat(this.currentInput);
      if (this.previousInput === null) {
        this.previousInput = inputValue;
      } else if (this.operator) {
        const currentValue = this.previousInput || 0;
        const newValue = this.performCalculation(currentValue, inputValue, this.operator);
        this.currentInput = String(newValue);
        this.previousInput = newValue;
      }
      this.waitingForOperand = true;
      this.operator = nextOperator;
      if (this.history) {
        this.history.textContent = `${this.previousInput} ${nextOperator}`;
      }
    }
    calculate() {
      const inputValue = parseFloat(this.currentInput);
      if (this.previousInput !== null && this.operator) {
        const newValue = this.performCalculation(this.previousInput, inputValue, this.operator);
        const calculation = `${this.previousInput} ${this.operator} ${inputValue} = ${newValue}`;
        this.calculationHistory.push(calculation);
        if (window.history) {
          window.history.addCalculation("Basic Calculator", `${this.previousInput} ${this.operator} ${inputValue}`, newValue.toString());
        }
        this.currentInput = String(newValue);
        this.previousInput = null;
        this.operator = null;
        this.waitingForOperand = true;
        if (this.history) {
          this.history.textContent = calculation;
        }
      }
    }
    performCalculation(firstOperand, secondOperand, operator) {
      switch (operator) {
        case "+":
          return firstOperand + secondOperand;
        case "-":
          return firstOperand - secondOperand;
        case "\xD7":
          return firstOperand * secondOperand;
        case "\xF7":
          if (secondOperand === 0) {
            showToast("Cannot divide by zero!", "error");
            return firstOperand;
          }
          return firstOperand / secondOperand;
        default:
          return secondOperand;
      }
    }
    clear() {
      this.currentInput = "0";
      this.previousInput = null;
      this.operator = null;
      this.waitingForOperand = false;
      if (this.history) {
        this.history.textContent = "";
      }
    }
    backspace() {
      this.currentInput = this.currentInput.slice(0, -1);
      if (this.currentInput === "") {
        this.currentInput = "0";
      }
    }
    updateDisplay() {
      if (this.display) {
        this.display.textContent = this.formatNumber(this.currentInput);
      }
    }
    formatNumber(num) {
      const number = parseFloat(num);
      if (isNaN(number)) return num;
      if (Math.abs(number) >= 1e3) {
        return number.toLocaleString();
      }
      return num;
    }
    handleKeyboard(e) {
      if (e.target.tagName === "INPUT") return;
      if (/\d/.test(e.key)) {
        this.inputNumber(e.key);
        this.updateDisplay();
      } else if (e.key === ".") {
        this.inputDecimal();
        this.updateDisplay();
      } else if (e.key === "+") {
        this.inputOperator("+");
        this.updateDisplay();
      } else if (e.key === "-") {
        this.inputOperator("-");
        this.updateDisplay();
      } else if (e.key === "*") {
        this.inputOperator("\xD7");
        this.updateDisplay();
      } else if (e.key === "/") {
        e.preventDefault();
        this.inputOperator("\xF7");
        this.updateDisplay();
      } else if (e.key === "Enter" || e.key === "=") {
        this.calculate();
        this.updateDisplay();
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
        this.clear();
        this.updateDisplay();
      } else if (e.key === "Backspace") {
        this.backspace();
        this.updateDisplay();
      }
    }
    addButtonAnimations() {
      const style = document.createElement("style");
      style.textContent = `
            .calculator-button.pressed {
                transform: scale(0.95);
                background-color: var(--accent-color);
                color: white;
            }
            
            .calculator-button {
                transition: all 0.15s ease;
            }
        `;
      document.head.appendChild(style);
    }
  };
  var ScientificCalculator = class extends BasicCalculator {
    static {
      __name(this, "ScientificCalculator");
    }
    constructor() {
      super();
      this.display = document.querySelector("#scientific-calculator .calculator-current");
      this.history = document.querySelector("#scientific-calculator .calculator-history");
      this.memory = 0;
      this.angleMode = "degrees";
      this.initScientific();
    }
    initScientific() {
      document.querySelectorAll("#scientific-calculator .calculator-button").forEach((button) => {
        button.addEventListener("click", (e) => {
          this.handleScientificClick(e.target);
        });
      });
    }
    handleScientificClick(button) {
      const value = button.textContent;
      button.classList.add("pressed");
      setTimeout(() => button.classList.remove("pressed"), 150);
      if (button.classList.contains("function")) {
        this.inputFunction(value);
      } else {
        this.handleButtonClick(button);
      }
    }
    inputFunction(func) {
      const current = parseFloat(this.currentInput);
      let result;
      try {
        switch (func) {
          case "sin":
            result = Math.sin(this.angleMode === "degrees" ? current * Math.PI / 180 : current);
            break;
          case "cos":
            result = Math.cos(this.angleMode === "degrees" ? current * Math.PI / 180 : current);
            break;
          case "tan":
            result = Math.tan(this.angleMode === "degrees" ? current * Math.PI / 180 : current);
            break;
          case "log":
            if (current <= 0) throw new Error("Invalid input for logarithm");
            result = Math.log10(current);
            break;
          case "ln":
            if (current <= 0) throw new Error("Invalid input for natural logarithm");
            result = Math.log(current);
            break;
          case "\u221A":
            if (current < 0) throw new Error("Invalid input for square root");
            result = Math.sqrt(current);
            break;
          case "\u03C0":
            result = Math.PI;
            break;
          case "e":
            result = Math.E;
            break;
          case "x\xB2":
            result = current * current;
            break;
          case "1/x":
            if (current === 0) throw new Error("Cannot divide by zero");
            result = 1 / current;
            break;
          case "x!":
            if (current < 0 || !Number.isInteger(current)) throw new Error("Invalid input for factorial");
            result = this.factorial(current);
            break;
          case "^":
            this.inputOperator("^");
            return;
          default:
            return;
        }
        if (window.history) {
          window.history.addCalculation("Scientific Calculator", `${func}(${current})`, result.toString());
        }
        if (this.history) {
          this.history.textContent = `${func}(${current}) = ${result}`;
        }
        this.currentInput = result.toString();
        this.updateDisplay();
      } catch (error) {
        showToast(error.message, "error");
      }
    }
    factorial(n) {
      if (n === 0 || n === 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    }
    performCalculation(firstOperand, secondOperand, operator) {
      if (operator === "^") {
        return Math.pow(firstOperand, secondOperand);
      }
      return super.performCalculation(firstOperand, secondOperand, operator);
    }
  };
  var CryptocurrencyCalculator = class {
    static {
      __name(this, "CryptocurrencyCalculator");
    }
    constructor() {
      this.baseUrl = "https://api.coingecko.com/api/v3";
      this.cache = /* @__PURE__ */ new Map();
      this.cacheExpiry = 6e4;
      this.cryptoMap = {
        "bitcoin": "bitcoin",
        "ethereum": "ethereum",
        "tether": "tether",
        "binance-coin": "binancecoin",
        "solana": "solana",
        "ripple": "ripple",
        "cardano": "cardano",
        "dogecoin": "dogecoin"
      };
      this.init();
    }
    init() {
      const calculateBtn = document.getElementById("crypto-calculate-btn");
      if (calculateBtn) {
        calculateBtn.addEventListener("click", () => this.calculateCrypto());
      }
    }
    async getCryptoPrice(fromCrypto, toCurrency) {
      const cacheKey = `${fromCrypto}-${toCurrency}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
      try {
        const cryptoId = this.cryptoMap[fromCrypto] || fromCrypto;
        const response = await fetch(
          `${this.baseUrl}/simple/price?ids=${cryptoId}&vs_currencies=${toCurrency}&include_24hr_change=true&include_market_cap=true`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch crypto data");
        }
        const data = await response.json();
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        return data;
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        showToast("Failed to fetch cryptocurrency data. Please try again.", "error");
        return null;
      }
    }
    async calculateCrypto() {
      const fromCrypto = document.getElementById("crypto-from").value;
      const toCurrency = document.getElementById("crypto-to").value;
      const amount = parseFloat(document.getElementById("crypto-amount").value);
      if (isNaN(amount) || amount <= 0) {
        showToast("Please enter a valid amount", "error");
        return;
      }
      const priceData = await this.getCryptoPrice(fromCrypto, toCurrency);
      if (priceData) {
        const rate = priceData[fromCrypto][toCurrency];
        const result = amount * rate;
        document.getElementById("crypto-result").textContent = `${result.toFixed(8)} ${toCurrency.toUpperCase()}`;
        document.getElementById("crypto-rate").textContent = `1 ${fromCrypto.toUpperCase()} = ${rate.toFixed(8)} ${toCurrency.toUpperCase()}`;
      }
    }
  };
  var UnitConverter = class {
    static {
      __name(this, "UnitConverter");
    }
    constructor() {
      this.conversions = {
        length: {
          meter: 1,
          kilometer: 1e-3,
          centimeter: 100,
          millimeter: 1e3,
          inch: 39.3701,
          foot: 3.28084,
          yard: 1.09361,
          mile: 621371e-9
        },
        weight: {
          kilogram: 1,
          gram: 1e3,
          pound: 2.20462,
          ounce: 35.274,
          ton: 1e-3,
          stone: 0.157473
        },
        temperature: {
          celsius: /* @__PURE__ */ __name((c) => ({ celsius: c, fahrenheit: c * 9 / 5 + 32, kelvin: c + 273.15 }), "celsius"),
          fahrenheit: /* @__PURE__ */ __name((f) => ({ fahrenheit: f, celsius: (f - 32) * 5 / 9, kelvin: (f - 32) * 5 / 9 + 273.15 }), "fahrenheit"),
          kelvin: /* @__PURE__ */ __name((k) => ({ kelvin: k, celsius: k - 273.15, fahrenheit: (k - 273.15) * 9 / 5 + 32 }), "kelvin")
        },
        area: {
          "square-meter": 1,
          "square-kilometer": 1e-6,
          "square-centimeter": 1e4,
          "square-inch": 1550.0031,
          "square-foot": 10.7639,
          "acre": 247105e-9,
          "hectare": 1e-4
        },
        volume: {
          liter: 1,
          milliliter: 1e3,
          gallon: 0.264172,
          quart: 1.05669,
          pint: 2.11338,
          cup: 4.22675,
          "fluid-ounce": 33.814,
          tablespoon: 67.628,
          teaspoon: 202.884
        },
        speed: {
          "meter-per-second": 1,
          "kilometer-per-hour": 3.6,
          "mile-per-hour": 2.23694,
          "foot-per-second": 3.28084,
          knot: 1.94384
        }
      };
      this.init();
    }
    init() {
      const convertBtn = document.getElementById("unit-convert-btn");
      const typeSelect = document.getElementById("conversion-type");
      if (convertBtn) {
        convertBtn.addEventListener("click", () => this.convert());
      }
      if (typeSelect) {
        typeSelect.addEventListener("change", () => this.updateUnitOptions());
      }
      this.updateUnitOptions();
    }
    updateUnitOptions() {
      const typeSelect = document.getElementById("conversion-type");
      const fromSelect = document.getElementById("unit-from");
      const toSelect = document.getElementById("unit-to");
      if (!typeSelect || !fromSelect || !toSelect) return;
      const selectedType = typeSelect.value;
      const units = this.conversions[selectedType];
      if (!units) return;
      fromSelect.innerHTML = "";
      toSelect.innerHTML = "";
      Object.keys(units).forEach((unit) => {
        const option1 = document.createElement("option");
        option1.value = unit;
        option1.textContent = unit.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
        fromSelect.appendChild(option1);
        const option2 = document.createElement("option");
        option2.value = unit;
        option2.textContent = unit.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
        toSelect.appendChild(option2);
      });
    }
    convert() {
      const value = parseFloat(document.getElementById("unit-value").value);
      const type = document.getElementById("conversion-type").value;
      const fromUnit = document.getElementById("unit-from").value;
      const toUnit = document.getElementById("unit-to").value;
      if (isNaN(value)) {
        showToast("Please enter a valid number", "error");
        return;
      }
      const result = this.performConversion(value, fromUnit, toUnit, type);
      if (result !== null) {
        const resultElement = document.getElementById("conversion-result");
        const formulaElement = document.getElementById("conversion-formula");
        if (resultElement) {
          resultElement.textContent = `${result.toFixed(6)} ${toUnit.replace("-", " ")}`;
        }
        if (formulaElement) {
          formulaElement.textContent = this.getFormula(fromUnit, toUnit, type);
        }
        if (window.history) {
          window.history.addCalculation("Unit Converter", `${value} ${fromUnit}`, `${result.toFixed(6)} ${toUnit}`);
        }
      }
    }
    performConversion(value, fromUnit, toUnit, type) {
      if (type === "temperature") {
        return this.convertTemperature(value, fromUnit, toUnit);
      }
      const conversions = this.conversions[type];
      if (!conversions || !conversions[fromUnit] || !conversions[toUnit]) {
        showToast("Invalid conversion units", "error");
        return null;
      }
      const baseValue = value / conversions[fromUnit];
      return baseValue * conversions[toUnit];
    }
    convertTemperature(value, fromUnit, toUnit) {
      const tempConversions = this.conversions.temperature[fromUnit](value);
      return tempConversions[toUnit];
    }
    getFormula(fromUnit, toUnit, type) {
      if (type === "temperature") {
        return this.getTemperatureFormula(fromUnit, toUnit);
      }
      const conversions = this.conversions[type];
      if (!conversions) return "";
      const factor = conversions[toUnit] / conversions[fromUnit];
      return `${toUnit} = ${fromUnit} \xD7 ${factor.toFixed(6)}`;
    }
    getTemperatureFormula(fromUnit, toUnit) {
      const formulas = {
        "celsius-fahrenheit": "\xB0F = (\xB0C \xD7 9/5) + 32",
        "fahrenheit-celsius": "\xB0C = (\xB0F - 32) \xD7 5/9",
        "celsius-kelvin": "K = \xB0C + 273.15",
        "kelvin-celsius": "\xB0C = K - 273.15",
        "fahrenheit-kelvin": "K = (\xB0F - 32) \xD7 5/9 + 273.15",
        "kelvin-fahrenheit": "\xB0F = (K - 273.15) \xD7 9/5 + 32"
      };
      return formulas[`${fromUnit}-${toUnit}`] || "";
    }
  };
  var CalculationHistory = class {
    static {
      __name(this, "CalculationHistory");
    }
    constructor() {
      this.history = JSON.parse(localStorage.getItem("calcHistory")) || [];
      this.maxHistory = 50;
      this.createHistoryPanel();
    }
    createHistoryPanel() {
      if (!document.getElementById("history-panel")) {
        const panel = document.createElement("div");
        panel.id = "history-panel";
        panel.className = "history-panel";
        panel.innerHTML = `
                <div class="history-header">
                    <h3>Calculation History</h3>
                    <div class="history-controls">
                        <button onclick="window.history.clearHistory()" class="btn-danger">Clear All</button>
                        <button onclick="toggleHistory()" class="btn-secondary">Close</button>
                    </div>
                </div>
                <div id="calculation-history" class="history-content"></div>
            `;
        document.body.appendChild(panel);
      }
      this.updateHistoryDisplay();
    }
    addCalculation(type, input, result) {
      const calculation = {
        id: Date.now(),
        type,
        input,
        result,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.history.unshift(calculation);
      if (this.history.length > this.maxHistory) {
        this.history = this.history.slice(0, this.maxHistory);
      }
      this.saveHistory();
      this.updateHistoryDisplay();
    }
    saveHistory() {
      localStorage.setItem("calcHistory", JSON.stringify(this.history));
    }
    clearHistory() {
      this.history = [];
      this.saveHistory();
      this.updateHistoryDisplay();
      showToast("History cleared!");
    }
    updateHistoryDisplay() {
      const historyContainer = document.getElementById("calculation-history");
      if (!historyContainer) return;
      if (this.history.length === 0) {
        historyContainer.innerHTML = '<p class="no-history">No calculations yet</p>';
        return;
      }
      historyContainer.innerHTML = this.history.map((calc) => `
            <div class="history-item" onclick="copyToClipboard('${calc.result}')">
                <div class="history-type">${calc.type}</div>
                <div class="history-calculation">${calc.input} = ${calc.result}</div>
                <div class="history-time">${new Date(calc.timestamp).toLocaleString()}</div>
            </div>
        `).join("");
    }
  };
  var ThemeManager = class {
    static {
      __name(this, "ThemeManager");
    }
    constructor() {
      this.currentTheme = localStorage.getItem("theme") || "dark";
      this.init();
    }
    init() {
      this.applyTheme(this.currentTheme);
      this.updateExistingToggle();
    }
    updateExistingToggle() {
      const themeSwitch = document.getElementById("checkbox");
      if (themeSwitch) {
        themeSwitch.checked = this.currentTheme === "light";
        themeSwitch.addEventListener("change", () => {
          this.currentTheme = themeSwitch.checked ? "light" : "dark";
          this.applyTheme(this.currentTheme);
          localStorage.setItem("theme", this.currentTheme);
        });
      }
    }
    toggleTheme() {
      this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
      this.applyTheme(this.currentTheme);
      localStorage.setItem("theme", this.currentTheme);
      const themeSwitch = document.getElementById("checkbox");
      if (themeSwitch) {
        themeSwitch.checked = this.currentTheme === "light";
      }
    }
    applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  };
  function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + (end - start) * progress;
      element.textContent = `$${current.toFixed(2)}`;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    __name(update, "update");
    requestAnimationFrame(update);
  }
  __name(animateValue, "animateValue");
  function debounce(func, wait) {
    let timeout;
    return /* @__PURE__ */ __name(function executedFunction(...args) {
      const later = /* @__PURE__ */ __name(() => {
        clearTimeout(timeout);
        func(...args);
      }, "later");
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }, "executedFunction");
  }
  __name(debounce, "debounce");
  function saveInputState() {
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
    const state = {};
    inputs.forEach((input) => {
      if (input.id) {
        state[input.id] = input.value;
      }
    });
    localStorage.setItem("inputState", JSON.stringify(state));
  }
  __name(saveInputState, "saveInputState");
  function loadInputStates() {
    const state = JSON.parse(localStorage.getItem("inputState") || "{}");
    Object.keys(state).forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.value = state[id];
      }
    });
  }
  __name(loadInputStates, "loadInputStates");
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard!");
    }).catch(() => {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      showToast("Copied to clipboard!");
    });
  }
  __name(copyToClipboard, "copyToClipboard");
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3e3);
  }
  __name(showToast, "showToast");
  function toggleHistory() {
    const panel = document.getElementById("history-panel");
    if (panel) {
      panel.classList.toggle("show");
    }
  }
  __name(toggleHistory, "toggleHistory");
  window.history = null;
  document.addEventListener("DOMContentLoaded", function() {
    if (!window.history) {
      window.history = new CalculationHistory();
    }
  });
})();
//# sourceMappingURL=script.js.map
