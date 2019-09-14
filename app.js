var base = {
  resultsTag: document.querySelector("#results"),
  loaderTag: document.querySelector("#loading"),
  calculateBtn: document.querySelector(".btn"),
  loanAmountTag: document.querySelector("#amount"),
  interestTag: document.querySelector("#interest"),
  yearsTag: document.querySelector("#years"),
  monthlyPaymentTag: document.querySelector("#monthly-payment"),
  totalPaymentTag: document.querySelector("#total-payment"),
  totalInterestTag: document.querySelector("#total-interest"),
  headingTag: document.querySelector("h1.heading")
};

// UI CONTROLLER FUNCTIONS
function getLoanAmount() {
  return parseFloat(base.loanAmountTag.value);
}

function getInterest() {
  return parseFloat(base.interestTag.value);
}

function getYears() {
  return parseFloat(base.yearsTag.value);
}

// render results
function renderMonthlyPayment(loanCalculator) {
  base.monthlyPaymentTag.value = loanCalculator.monthlyPayment.toFixed(2);
}
function renderTotalPayment(loanCalculator) {
  base.totalPaymentTag.value = loanCalculator.totalPayment.toFixed(2);
}
function renderTotalInterest(loanCalculator) {
  base.totalInterestTag.value = loanCalculator.totalInterest.toFixed(2);
}

function renderResults(loanCalculator) {
  showResultForm();
  [renderMonthlyPayment, renderTotalPayment, renderTotalInterest].forEach(
    fn => {
      fn(loanCalculator);
    }
  );
}

function showResultForm() {
  base.resultsTag.style.display = "block";
}

function hideResultsForm() {
  base.resultsTag.style.display = "none";
}

function showLoader() {
  base.loaderTag.style.display = "block";
}

function hideLoader() {
  base.loaderTag.style.display = "none";
}
// Render Error
// remove Error Tag
function removeError() {
  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 3000);
}

// render error
function renderError(err) {
  var errorDiv = '<div class="alert alert-danger">' + err + "</div>";
  base.headingTag.insertAdjacentHTML("beforebegin", errorDiv);
}

// DATA CONTROLLER FUNCTION
function loanCalculator(loanAmount, interest, years) {
  this.loanAmount = loanAmount;
  this.interest = interest;
  this.years = years;
  this.principal = null;
  this.calculatedInterest = null;
  this.calculatedPayment = null;
  this.monthlyPayment = null;
  this.totalPayment = null;
  this.totalInterest = null;
}

// Getters
loanCalculator.prototype.getPrincipal = function() {
  return this.principal;
};

loanCalculator.prototype.getCalculatedInterest = function() {
  return this.calculatedInterest;
};

loanCalculator.prototype.getCalculatedPayment = function() {
  return this.calculatedPayment;
};

loanCalculator.prototype.getMonthlyPayment = function() {
  return this.monthlyPayment;
};

loanCalculator.prototype.getTotalPayment = function() {
  return this.totalPayment;
};

loanCalculator.prototype.getTotalInterest = function() {
  return this.totalInterest;
};
// Setters
loanCalculator.prototype.setPrincipal = function() {
  this.principal = this.loanAmount;
};

loanCalculator.prototype.setCalculatedInterest = function(interest) {
  this.calculatedInterest = interest / 100 / 12;
};

loanCalculator.prototype.setCalculatedPayment = function(years) {
  this.calculatedPayment = years * 12;
};

loanCalculator.prototype.setMonthlyPayment = function() {
  var x = Math.pow(1 + this.calculatedInterest, this.calculatedPayment);
  this.monthlyPayment =
    (this.principal * x * this.calculatedInterest) / (x - 1);
};

loanCalculator.prototype.setTotalPayment = function() {
  this.totalPayment = this.monthlyPayment * this.calculatedPayment;
};

loanCalculator.prototype.setTotalInterest = function() {
  this.totalInterest =
    this.monthlyPayment * this.calculatedPayment - this.principal;
};
// APP CONTROLLER
// Event Listeners:
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
  base.calculateBtn.addEventListener("click", function(e) {
    e.preventDefault();
    // Hide the results
    hideResultsForm();
    // Show Loader
    showLoader();
    // hide the loader and show the results
    setTimeout(() => {
      calculateResults();
    }, 2000);
  });
}

// calculate results function
function calculateResults() {
  //check if the user fill out all the input
  if (
    base.loanAmountTag.value &&
    base.interestTag.value &&
    base.yearsTag.value
  ) {
    // store data temporarily
    var loanAmount = getLoanAmount();
    var interest = getInterest();
    var years = getYears();

    // create loan Calculator Data Structure
    var loanCalc = new loanCalculator(loanAmount, interest, years);
    loanCalc.setPrincipal();
    loanCalc.setCalculatedInterest(interest);
    loanCalc.setCalculatedPayment(years);
    loanCalc.setMonthlyPayment();
    loanCalc.setTotalPayment();
    loanCalc.setTotalInterest();
    console.log(loanCalc);
    // hider loader
    hideLoader();
    // render the result UI
    renderResults(loanCalc);
    // console.log(loanCalc);
    // compute monthly payment
  } else {
    // hide the loader
    base.loaderTag.style.display = "none";
    // render error tag
    renderError("Please Check your numbers");
    // remove error tag
    removeError();
  }
}
