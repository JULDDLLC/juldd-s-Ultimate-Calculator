document.addEventListener('DOMContentLoaded', function() {
    // Freelance Rate Calculator
    const calculateRateBtn = document.getElementById('calculate-rate');
    const resetFreelanceBtn = document.getElementById('reset-freelance');
    const copyRateBtn = document.getElementById('copy-rate');
    
    if (calculateRateBtn) {
        calculateRateBtn.addEventListener('click', calculateFreelanceRate);
    }
    
    if (resetFreelanceBtn) {
        resetFreelanceBtn.addEventListener('click', resetFreelanceCalculator);
    }
    
    if (copyRateBtn) {
        copyRateBtn.addEventListener('click', copyRateToClipboard);
    }
    
    // Update project hours display when input changes
    const projectHoursInput = document.getElementById('project-hours');
    if (projectHoursInput) {
        projectHoursInput.addEventListener('input', function() {
            document.getElementById('project-hours-display').textContent = this.value;
        });
    }
    
    function calculateFreelanceRate() {
        // Get input values
        const targetIncome = parseFloat(document.getElementById('target-income').value);
        const billableHours = parseFloat(document.getElementById('billable-hours').value);
        const workWeeks = parseFloat(document.getElementById('work-weeks').value);
        const nonBillablePercent = parseFloat(document.getElementById('non-billable').value);
        const expenses = parseFloat(document.getElementById('expenses').value);
        const taxBuffer = parseFloat(document.getElementById('tax-buffer').value);
        const projectHours = parseFloat(document.getElementById('project-hours').value);
        
        // Calculate effective billable hours (accounting for non-billable time)
        const effectiveHoursPerWeek = billableHours * (1 - nonBillablePercent / 100);
        document.getElementById('effective-hours').textContent = effectiveHoursPerWeek.toFixed(1);
        
        // Calculate total hours per month
        const totalHoursPerMonth = effectiveHoursPerWeek * workWeeks;
        
        // Calculate required pre-tax income (including expenses and tax buffer)
        const requiredPreTaxIncome = targetIncome + expenses;
        const totalRequiredIncome = requiredPreTaxIncome / (1 - taxBuffer / 100);
        
        // Calculate hourly rate
        const hourlyRate = totalRequiredIncome / totalHoursPerMonth;
        document.getElementById('hourly-rate').textContent = '$' + hourlyRate.toFixed(2);
        
        // Calculate project rate
        const projectRate = hourlyRate * projectHours;
        document.getElementById('project-rate').textContent = '$' + projectRate.toFixed(2);
        
        // Calculate annual income estimate
        const annualIncome = hourlyRate * effectiveHoursPerWeek * workWeeks * 12;
        document.getElementById('annual-income').textContent = '$' + annualIncome.toFixed(2);
        
        // Apply animation to result cards
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach(card => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'pulse 0.5s';
            }, 10);
        });
    }
    
    function resetFreelanceCalculator() {
        // Reset all inputs to default values
        document.getElementById('target-income').value = 5000;
        document.getElementById('billable-hours').value = 30;
        document.getElementById('work-weeks').value = 4;
        document.getElementById('non-billable').value = 30;
        document.getElementById('expenses').value = 500;
        document.getElementById('tax-buffer').value = 20;
        document.getElementById('project-hours').value = 10;
        document.getElementById('project-hours-display').textContent = 10;
        
        // Reset results
        document.getElementById('effective-hours').textContent = '0';
        document.getElementById('hourly-rate').textContent = '$0';
        document.getElementById('project-rate').textContent = '$0';
        document.getElementById('annual-income').textContent = '$0';
    }
    
    function copyRateToClipboard() {
        const hourlyRate = document.getElementById('hourly-rate').textContent;
        
        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = hourlyRate;
        document.body.appendChild(tempInput);
        
        // Select and copy the text
        tempInput.select();
        document.execCommand('copy');
        
        // Remove the temporary input
        document.body.removeChild(tempInput);
        
        // Show feedback
        const copyBtn = document.getElementById('copy-rate');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }
    // Theme Switcher
    const themeSwitch = document.getElementById('checkbox');
    themeSwitch.addEventListener('change', function() {
        if(this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark';
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeSwitch.checked = false;
    }

    // Category Navigation
    const categoryItems = document.querySelectorAll('.category-item');
    const categoryContents = document.querySelectorAll('.category-content');

    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active category
            categoryItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected category content
            categoryContents.forEach(content => {
                if (content.id === category) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // Core Math Calculator
    const calculatorDisplay = document.querySelector('.calculator-current');
    const calculatorHistory = document.querySelector('.calculator-history');
    const calculatorButtons = document.querySelectorAll('.calculator-button');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetScreen = false;
    
    calculatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('number')) {
                inputNumber(button.textContent);
                updateScreen();
            } else if (button.classList.contains('operator')) {
                inputOperator(button.textContent);
                updateScreen();
            } else if (button.classList.contains('equals')) {
                calculate();
                updateScreen();
            } else if (button.classList.contains('clear')) {
                clear();
                updateScreen();
            } else if (button.classList.contains('decimal')) {
                inputDecimal();
                updateScreen();
            } else if (button.classList.contains('backspace')) {
                backspace();
                updateScreen();
            }
        });
    });
    
    function inputNumber(number) {
        if (currentInput === '0' || shouldResetScreen) {
            currentInput = number;
            shouldResetScreen = false;
        } else {
            currentInput += number;
        }
    }
    
    function inputOperator(op) {
        if (operation !== null) calculate();
        previousInput = currentInput;
        operation = op;
        shouldResetScreen = true;
        calculatorHistory.textContent = `${previousInput} ${operation}`;
    }
    
    function calculate() {
        if (operation === null || shouldResetScreen) return;
        
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                result = prev / current;
                break;
            default:
                return;
        }
        
        currentInput = result.toString();
        calculatorHistory.textContent = `${previousInput} ${operation} ${current} =`;
        operation = null;
    }
    
    function clear() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        calculatorHistory.textContent = '';
    }
    
    function inputDecimal() {
        if (shouldResetScreen) {
            currentInput = '0.';
            shouldResetScreen = false;
            return;
        }
        
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    }
    
    function backspace() {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') {
            currentInput = '0';
        }
    }
    
    function updateScreen() {
        calculatorDisplay.textContent = currentInput;
    }

    // Scientific Calculator
    const scientificDisplay = document.querySelector('#scientific-calculator .calculator-current');
    const scientificHistory = document.querySelector('#scientific-calculator .calculator-history');
    const scientificButtons = document.querySelectorAll('#scientific-calculator .calculator-button');
    
    let sciCurrentInput = '0';
    let sciPreviousInput = '';
    let sciOperation = null;
    let sciShouldResetScreen = false;
    
    scientificButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('number')) {
                sciInputNumber(button.textContent);
                sciUpdateScreen();
            } else if (button.classList.contains('operator')) {
                sciInputOperator(button.textContent);
                sciUpdateScreen();
            } else if (button.classList.contains('equals')) {
                sciCalculate();
                sciUpdateScreen();
            } else if (button.classList.contains('clear')) {
                sciClear();
                sciUpdateScreen();
            } else if (button.classList.contains('decimal')) {
                sciInputDecimal();
                sciUpdateScreen();
            } else if (button.classList.contains('backspace')) {
                sciBackspace();
                sciUpdateScreen();
            } else if (button.classList.contains('function')) {
                sciInputFunction(button.textContent);
                sciUpdateScreen();
            }
        });
    });
    
    function sciInputNumber(number) {
        if (sciCurrentInput === '0' || sciShouldResetScreen) {
            sciCurrentInput = number;
            sciShouldResetScreen = false;
        } else {
            sciCurrentInput += number;
        }
    }
    
    function sciInputOperator(op) {
        if (sciOperation !== null) sciCalculate();
        sciPreviousInput = sciCurrentInput;
        sciOperation = op;
        sciShouldResetScreen = true;
        scientificHistory.textContent = `${sciPreviousInput} ${sciOperation}`;
    }
    
    function sciCalculate() {
        if (sciOperation === null || sciShouldResetScreen) return;
        
        let result;
        const prev = parseFloat(sciPreviousInput);
        const current = parseFloat(sciCurrentInput);
        
        switch (sciOperation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                result = prev / current;
                break;
            case '^':
                result = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        sciCurrentInput = result.toString();
        scientificHistory.textContent = `${sciPreviousInput} ${sciOperation} ${current} =`;
        sciOperation = null;
    }
    
    function sciInputFunction(func) {
        const current = parseFloat(sciCurrentInput);
        let result;
        
        switch (func) {
            case 'sin':
                result = Math.sin(current);
                break;
            case 'cos':
                result = Math.cos(current);
                break;
            case 'tan':
                result = Math.tan(current);
                break;
            case 'log':
                result = Math.log10(current);
                break;
            case 'ln':
                result = Math.log(current);
                break;
            case '√':
                result = Math.sqrt(current);
                break;
            case 'x²':
                result = Math.pow(current, 2);
                break;
            case 'π':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            default:
                return;
        }
        
        scientificHistory.textContent = `${func}(${current}) =`;
        sciCurrentInput = result.toString();
    }
    
    function sciClear() {
        sciCurrentInput = '0';
        sciPreviousInput = '';
        sciOperation = null;
        scientificHistory.textContent = '';
    }
    
    function sciInputDecimal() {
        if (sciShouldResetScreen) {
            sciCurrentInput = '0.';
            sciShouldResetScreen = false;
            return;
        }
        
        if (!sciCurrentInput.includes('.')) {
            sciCurrentInput += '.';
        }
    }
    
    function sciBackspace() {
        sciCurrentInput = sciCurrentInput.slice(0, -1);
        if (sciCurrentInput === '') {
            sciCurrentInput = '0';
        }
    }
    
    function sciUpdateScreen() {
        scientificDisplay.textContent = sciCurrentInput;
    }

    // Time Calculator
    const timeCalculateBtn = document.getElementById('time-calculate-btn');
    if (timeCalculateBtn) {
        timeCalculateBtn.addEventListener('click', calculateTime);
    }
    
    function calculateTime() {
        const hours1 = parseInt(document.getElementById('time-hours1').value) || 0;
        const minutes1 = parseInt(document.getElementById('time-minutes1').value) || 0;
        const seconds1 = parseInt(document.getElementById('time-seconds1').value) || 0;
        
        const hours2 = parseInt(document.getElementById('time-hours2').value) || 0;
        const minutes2 = parseInt(document.getElementById('time-minutes2').value) || 0;
        const seconds2 = parseInt(document.getElementById('time-seconds2').value) || 0;
        
        const operation = document.getElementById('time-operation').value;
        
        let totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1;
        let totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2;
        let resultSeconds;
        
        switch (operation) {
            case 'add':
                resultSeconds = totalSeconds1 + totalSeconds2;
                break;
            case 'subtract':
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
        
        document.getElementById('time-result-hours').textContent = resultHours;
        document.getElementById('time-result-minutes').textContent = resultMinutes;
        document.getElementById('time-result-seconds').textContent = resultSecondsOnly;
    }

    // Tip Calculator
    const tipCalculateBtn = document.getElementById('tip-calculate-btn');
    if (tipCalculateBtn) {
        tipCalculateBtn.addEventListener('click', calculateTip);
    }
    
    function calculateTip() {
        const billAmount = parseFloat(document.getElementById('bill-amount').value);
        const tipPercentage = parseFloat(document.getElementById('tip-percentage').value);
        const numPeople = parseInt(document.getElementById('num-people').value) || 1;
        
        if (isNaN(billAmount) || isNaN(tipPercentage)) {
            return;
        }
        
        const tipAmount = billAmount * (tipPercentage / 100);
        const totalAmount = billAmount + tipAmount;
        const perPersonAmount = totalAmount / numPeople;
        
        document.getElementById('tip-amount').textContent = tipAmount.toFixed(2);
        document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
        document.getElementById('per-person-amount').textContent = perPersonAmount.toFixed(2);
    }

    // Calorie Calculator
    const calorieCalculateBtn = document.getElementById('calorie-calculate-btn');
    if (calorieCalculateBtn) {
        calorieCalculateBtn.addEventListener('click', calculateCalories);
    }
    
    function calculateCalories() {
        const age = parseInt(document.getElementById('calorie-age').value);
        const gender = document.querySelector('input[name="calorie-gender"]:checked').value;
        const weight = parseFloat(document.getElementById('calorie-weight').value);
        const height = parseFloat(document.getElementById('calorie-height').value);
        const activity = document.getElementById('calorie-activity').value;
        const goal = document.getElementById('calorie-goal').value;
        
        if (isNaN(age) || isNaN(weight) || isNaN(height)) {
            return;
        }
        
        // BMR calculation using Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        // Activity multiplier
        let tdee;
        switch (activity) {
            case 'sedentary':
                tdee = bmr * 1.2;
                break;
            case 'light':
                tdee = bmr * 1.375;
                break;
            case 'moderate':
                tdee = bmr * 1.55;
                break;
            case 'active':
                tdee = bmr * 1.725;
                break;
            case 'very-active':
                tdee = bmr * 1.9;
                break;
            default:
                tdee = bmr * 1.2;
        }
        
        // Goal adjustment
        let goalCalories;
        switch (goal) {
            case 'lose':
                goalCalories = tdee - 500;
                break;
            case 'maintain':
                goalCalories = tdee;
                break;
            case 'gain':
                goalCalories = tdee + 500;
                break;
            default:
                goalCalories = tdee;
        }
        
        // Calculate macros (protein, carbs, fat)
        // Protein: 30%, Carbs: 40%, Fat: 30%
        const protein = (goalCalories * 0.3) / 4; // 4 calories per gram of protein
        const carbs = (goalCalories * 0.4) / 4; // 4 calories per gram of carbs
        const fat = (goalCalories * 0.3) / 9; // 9 calories per gram of fat
        
        document.getElementById('bmr-result').textContent = Math.round(bmr);
        document.getElementById('tdee-result').textContent = Math.round(tdee);
        document.getElementById('goal-calories').textContent = Math.round(goalCalories);
        document.getElementById('protein-result').textContent = Math.round(protein);
        document.getElementById('carbs-result').textContent = Math.round(carbs);
        document.getElementById('fat-result').textContent = Math.round(fat);
        
        // Create macro chart
        const macroChartCanvas = document.getElementById('macro-chart');
        if (macroChartCanvas) {
            if (window.macroChart) {
                window.macroChart.destroy();
            }
            
            window.macroChart = new Chart(macroChartCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Protein', 'Carbs', 'Fat'],
                    datasets: [{
                        data: [30, 40, 30],
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.8)',
                            'rgba(236, 72, 153, 0.8)',
                            'rgba(139, 92, 246, 0.8)'
                        ],
                        borderColor: [
                            'rgba(99, 102, 241, 1)',
                            'rgba(236, 72, 153, 1)',
                            'rgba(139, 92, 246, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    }
                }
            });
        }
    }

    // Fitness Progress Calculator
    const fitnessCalculateBtn = document.getElementById('fitness-calculate-btn');
    if (fitnessCalculateBtn) {
        fitnessCalculateBtn.addEventListener('click', calculateFitness);
    }
    
    function calculateFitness() {
        const currentWeight = parseFloat(document.getElementById('current-weight').value);
        const goalWeight = parseFloat(document.getElementById('goal-weight').value);
        const currentBodyFat = parseFloat(document.getElementById('current-bodyfat').value);
        const goalBodyFat = parseFloat(document.getElementById('goal-bodyfat').value);
        const timeframe = parseInt(document.getElementById('fitness-timeframe').value);
        
        if (isNaN(currentWeight) || isNaN(goalWeight) || isNaN(currentBodyFat) || isNaN(goalBodyFat) || isNaN(timeframe)) {
            return;
        }
        
        const weightDifference = Math.abs(currentWeight - goalWeight);
        const weightChangePerWeek = weightDifference / timeframe;
        const bodyfatDifference = Math.abs(currentBodyFat - goalBodyFat);
        const bodyfatChangePerWeek = bodyfatDifference / timeframe;
        
        const currentLeanMass = currentWeight * (1 - currentBodyFat / 100);
        const goalLeanMass = goalWeight * (1 - goalBodyFat / 100);
        const leanMassChange = goalLeanMass - currentLeanMass;
        
        document.getElementById('weight-change-result').textContent = weightChangePerWeek.toFixed(2);
        document.getElementById('bodyfat-change-result').textContent = bodyfatChangePerWeek.toFixed(2);
        document.getElementById('lean-mass-result').textContent = leanMassChange.toFixed(2);
        
        // Create progress chart
        const fitnessChartCanvas = document.getElementById('fitness-chart');
        if (fitnessChartCanvas) {
            if (window.fitnessChart) {
                window.fitnessChart.destroy();
            }
            
            const labels = [];
            const weightData = [];
            const bodyfatData = [];
            
            for (let i = 0; i <= timeframe; i++) {
                labels.push(`Week ${i}`);
                
                if (goalWeight > currentWeight) {
                    weightData.push(currentWeight + (weightChangePerWeek * i));
                } else {
                    weightData.push(currentWeight - (weightChangePerWeek * i));
                }
                
                if (goalBodyFat > currentBodyFat) {
                    bodyfatData.push(currentBodyFat + (bodyfatChangePerWeek * i));
                } else {
                    bodyfatData.push(currentBodyFat - (bodyfatChangePerWeek * i));
                }
            }
            
            window.fitnessChart = new Chart(fitnessChartCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Weight (kg/lbs)',
                            data: weightData,
                            borderColor: 'rgba(99, 102, 241, 1)',
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            tension: 0.1,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Body Fat (%)',
                            data: bodyfatData,
                            borderColor: 'rgba(236, 72, 153, 1)',
                            backgroundColor: 'rgba(236, 72, 153, 0.2)',
                            tension: 0.1,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Weight',
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            },
                            ticks: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Body Fat %',
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            },
                            ticks: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        },
                        x: {
                            ticks: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    }
                }
            });
        }
    }

    // Subscription Tracker
    const addSubscriptionBtn = document.getElementById('add-subscription-btn');
    if (addSubscriptionBtn) {
        addSubscriptionBtn.addEventListener('click', addSubscription);
    }
    
    // Initialize subscriptions array from localStorage or empty array
    let subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
    
    // Display existing subscriptions on load
    displaySubscriptions();
    updateSubscriptionTotals();
    createSubscriptionChart();
    
    function addSubscription() {
        const name = document.getElementById('subscription-name').value;
        const cost = parseFloat(document.getElementById('subscription-cost').value);
        const cycle = document.getElementById('billing-cycle').value;
        
        if (!name || isNaN(cost)) {
            return;
        }
        
        // Convert cost to monthly equivalent
        let monthlyCost;
        switch (cycle) {
            case 'monthly':
                monthlyCost = cost;
                break;
            case 'quarterly':
                monthlyCost = cost / 3;
                break;
            case 'annually':
                monthlyCost = cost / 12;
                break;
            default:
                monthlyCost = cost;
        }
        
        const subscription = {
            id: Date.now(),
            name: name,
            cost: cost,
            cycle: cycle,
            monthlyCost: monthlyCost
        };
        
        subscriptions.push(subscription);
        
        // Save to localStorage
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        
        // Clear form
        document.getElementById('subscription-name').value = '';
        document.getElementById('subscription-cost').value = '';
        
        // Update display
        displaySubscriptions();
        updateSubscriptionTotals();
        createSubscriptionChart();
    }
    
    function displaySubscriptions() {
        const subscriptionList = document.getElementById('subscription-list');
        if (!subscriptionList) return;
        
        subscriptionList.innerHTML = '';
        
        subscriptions.forEach(sub => {
            const li = document.createElement('li');
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = sub.name;
            
            const costSpan = document.createElement('span');
            costSpan.textContent = `$${sub.cost} (${sub.cycle})`;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.classList.add('btn-danger');
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.addEventListener('click', () => deleteSubscription(sub.id));
            
            li.appendChild(nameSpan);
            li.appendChild(costSpan);
            li.appendChild(deleteBtn);
            
            subscriptionList.appendChild(li);
        });
    }
    
    function deleteSubscription(id) {
        subscriptions = subscriptions.filter(sub => sub.id !== id);
        
        // Save to localStorage
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        
        // Update display
        displaySubscriptions();
        updateSubscriptionTotals();
        createSubscriptionChart();
    }
    
    function updateSubscriptionTotals() {
        const monthlyTotal = document.getElementById('monthly-subscription-total');
        const annualTotal = document.getElementById('annual-subscription-total');
        
        if (!monthlyTotal || !annualTotal) return;
        
        const totalMonthly = subscriptions.reduce((total, sub) => total + sub.monthlyCost, 0);
        const totalAnnual = totalMonthly * 12;
        
        monthlyTotal.textContent = totalMonthly.toFixed(2);
        annualTotal.textContent = totalAnnual.toFixed(2);
    }
    
    function createSubscriptionChart() {
        const subscriptionChartCanvas = document.getElementById('subscription-chart');
        if (!subscriptionChartCanvas) return;
        
        if (window.subscriptionChart) {
            window.subscriptionChart.destroy();
        }
        
        // Only show top 5 subscriptions by cost
        const sortedSubs = [...subscriptions].sort((a, b) => b.monthlyCost - a.monthlyCost);
        const topSubs = sortedSubs.slice(0, 5);
        
        const labels = topSubs.map(sub => sub.name);
        const data = topSubs.map(sub => sub.monthlyCost);
        
        window.subscriptionChart = new Chart(subscriptionChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Cost ($)',
                    data: data,
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                        'rgba(99, 102, 241, 1)',
                        'rgba(236, 72, 153, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                        }
                    },
                    x: {
                        ticks: {
                            color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Home Renovation Calculator
    const renovationCalculateBtn = document.getElementById('renovation-calculate-btn');
    if (renovationCalculateBtn) {
        renovationCalculateBtn.addEventListener('click', calculateRenovation);
    }
    
    function calculateRenovation() {
        const squareFootage = parseFloat(document.getElementById('square-footage').value);
        const renovationType = document.getElementById('renovation-type').value;
        const qualityLevel = document.getElementById('quality-level').value;
        const location = document.getElementById('location-factor').value;
        
        if (isNaN(squareFootage)) {
            return;
        }
        
        // Base cost per square foot based on renovation type
        let baseCost;
        switch (renovationType) {
            case 'kitchen':
                baseCost = 150;
                break;
            case 'bathroom':
                baseCost = 250;
                break;
            case 'basement':
                baseCost = 50;
                break;
            case 'whole-house':
                baseCost = 100;
                break;
            case 'addition':
                baseCost = 200;
                break;
            default:
                baseCost = 100;
        }
        
        // Quality multiplier
        let qualityMultiplier;
        switch (qualityLevel) {
            case 'basic':
                qualityMultiplier = 0.8;
                break;
            case 'mid-range':
                qualityMultiplier = 1;
                break;
            case 'high-end':
                qualityMultiplier = 1.5;
                break;
            case 'luxury':
                qualityMultiplier = 2.5;
                break;
            default:
                qualityMultiplier = 1;
        }
        
        // Location multiplier
        let locationMultiplier;
        switch (location) {
            case 'low':
                locationMultiplier = 0.85;
                break;
            case 'average':
                locationMultiplier = 1;
                break;
            case 'high':
                locationMultiplier = 1.25;
                break;
            case 'very-high':
                locationMultiplier = 1.5;
                break;
            default:
                locationMultiplier = 1;
        }
        
        const totalCost = squareFootage * baseCost * qualityMultiplier * locationMultiplier;
        const materialsCost = totalCost * 0.4;
        const laborCost = totalCost * 0.35;
        const permitsCost = totalCost * 0.05;
        const designCost = totalCost * 0.1;
        const contingencyCost = totalCost * 0.1;
        
        document.getElementById('total-renovation-cost').textContent = totalCost.toFixed(2);
        document.getElementById('materials-cost').textContent = materialsCost.toFixed(2);
        document.getElementById('labor-cost').textContent = laborCost.toFixed(2);
        document.getElementById('permits-cost').textContent = permitsCost.toFixed(2);
        document.getElementById('design-cost').textContent = designCost.toFixed(2);
        document.getElementById('contingency-cost').textContent = contingencyCost.toFixed(2);
        
        // Create renovation cost breakdown chart
        const renovationChartCanvas = document.getElementById('renovation-chart');
        if (renovationChartCanvas) {
            if (window.renovationChart) {
                window.renovationChart.destroy();
            }
            
            window.renovationChart = new Chart(renovationChartCanvas, {
                type: 'pie',
                data: {
                    labels: ['Materials', 'Labor', 'Permits & Fees', 'Design & Planning', 'Contingency'],
                    datasets: [{
                        data: [40, 35, 5, 10, 10],
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.8)',
                            'rgba(236, 72, 153, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(239, 68, 68, 0.8)'
                        ],
                        borderColor: [
                            'rgba(99, 102, 241, 1)',
                            'rgba(236, 72, 153, 1)',
                            'rgba(139, 92, 246, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(239, 68, 68, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    }
                }
            });
        }
    }

    // Meal Cost Calculator
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    if (addIngredientBtn) {
        addIngredientBtn.addEventListener('click', addIngredient);
    }
    
    const calculateMealBtn = document.getElementById('calculate-meal-btn');
    if (calculateMealBtn) {
        calculateMealBtn.addEventListener('click', calculateMealCost);
    }
    
    // Initialize ingredients array
    let ingredients = [];
    
    function addIngredient() {
        const name = document.getElementById('ingredient-name').value;
        const cost = parseFloat(document.getElementById('ingredient-cost').value);
        const quantity = parseFloat(document.getElementById('ingredient-quantity').value);
        
        if (!name || isNaN(cost) || isNaN(quantity)) {
            return;
        }
        
        const ingredient = {
            id: Date.now(),
            name: name,
            cost: cost,
            quantity: quantity
        };
        
        ingredients.push(ingredient);
        
        // Clear form
        document.getElementById('ingredient-name').value = '';
        document.getElementById('ingredient-cost').value = '';
        document.getElementById('ingredient-quantity').value = '';
        
        // Update display
        displayIngredients();
    }
    
    function displayIngredients() {
        const ingredientList = document.getElementById('ingredient-list');
        if (!ingredientList) return;
        
        ingredientList.innerHTML = '';
        
        ingredients.forEach(ing => {
            const li = document.createElement('li');
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = ing.name;
            
            const costSpan = document.createElement('span');
            costSpan.textContent = `$${ing.cost} x ${ing.quantity}`;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.classList.add('btn-danger');
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.addEventListener('click', () => deleteIngredient(ing.id));
            
            li.appendChild(nameSpan);
            li.appendChild(costSpan);
            li.appendChild(deleteBtn);
            
            ingredientList.appendChild(li);
        });
    }
    
    function deleteIngredient(id) {
        ingredients = ingredients.filter(ing => ing.id !== id);
        
        // Update display
        displayIngredients();
    }
    
    function calculateMealCost() {
        const servings = parseInt(document.getElementById('meal-servings').value) || 1;
        
        if (ingredients.length === 0) {
            return;
        }
        
        const totalCost = ingredients.reduce((total, ing) => total + (ing.cost * ing.quantity), 0);
        const costPerServing = totalCost / servings;
        
        document.getElementById('total-meal-cost').textContent = totalCost.toFixed(2);
        document.getElementById('cost-per-serving').textContent = costPerServing.toFixed(2);
    }

    // Take-Home Pay Calculator
    const calculateTakeHomeBtn = document.getElementById('calculate-takehome-btn');
    if (calculateTakeHomeBtn) {
        calculateTakeHomeBtn.addEventListener('click', calculateTakeHomePay);
    }
    
    function calculateTakeHomePay() {
        const salary = parseFloat(document.getElementById('annual-salary').value);
        const payFrequency = document.getElementById('pay-frequency').value;
        const taxRate = parseFloat(document.getElementById('tax-rate').value);
        const retirement = parseFloat(document.getElementById('retirement-contribution').value);
        const insurance = parseFloat(document.getElementById('insurance-premium').value);
        const otherDeductions = parseFloat(document.getElementById('other-deductions').value) || 0;
        
        if (isNaN(salary) || isNaN(taxRate) || isNaN(retirement) || isNaN(insurance)) {
            return;
        }
        
        // Calculate deductions
        const taxDeduction = salary * (taxRate / 100);
        const retirementDeduction = salary * (retirement / 100);
        const insuranceDeduction = insurance * 12; // Assuming monthly insurance premium
        const totalDeductions = taxDeduction + retirementDeduction + insuranceDeduction + otherDeductions;
        
        const takeHomePay = salary - totalDeductions;
        
        // Calculate per-period pay
        let periodsPerYear;
        switch (payFrequency) {
            case 'weekly':
                periodsPerYear = 52;
                break;
            case 'biweekly':
                periodsPerYear = 26;
                break;
            case 'semimonthly':
                periodsPerYear = 24;
                break;
            case 'monthly':
                periodsPerYear = 12;
                break;
            default:
                periodsPerYear = 12;
        }
        
        const perPeriodPay = takeHomePay / periodsPerYear;
        
        document.getElementById('annual-takehome').textContent = takeHomePay.toFixed(2);
        document.getElementById('per-period-takehome').textContent = perPeriodPay.toFixed(2);
        document.getElementById('tax-deduction').textContent = taxDeduction.toFixed(2);
        document.getElementById('retirement-deduction').textContent = retirementDeduction.toFixed(2);
        document.getElementById('insurance-deduction').textContent = insuranceDeduction.toFixed(2);
        document.getElementById('other-deduction').textContent = otherDeductions.toFixed(2);
        
        // Create take-home pay breakdown chart
        const takehomeChartCanvas = document.getElementById('takehome-chart');
        if (takehomeChartCanvas) {
            if (window.takehomeChart) {
                window.takehomeChart.destroy();
            }
            
            window.takehomeChart = new Chart(takehomeChartCanvas, {
                type: 'pie',
                data: {
                    labels: ['Take-Home Pay', 'Taxes', 'Retirement', 'Insurance', 'Other Deductions'],
                    datasets: [{
                        data: [
                            takeHomePay,
                            taxDeduction,
                            retirementDeduction,
                            insuranceDeduction,
                            otherDeductions
                        ],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(99, 102, 241, 0.8)',
                            'rgba(236, 72, 153, 0.8)',
                            'rgba(139, 92, 246, 0.8)'
                        ],
                        borderColor: [
                            'rgba(16, 185, 129, 1)',
                            'rgba(239, 68, 68, 1)',
                            'rgba(99, 102, 241, 1)',
                            'rgba(236, 72, 153, 1)',
                            'rgba(139, 92, 246, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    }
                }
            });
        }
    }

    // Commute Cost Calculator
    const calculateCommuteBtn = document.getElementById('calculate-commute-btn');
    if (calculateCommuteBtn) {
        calculateCommuteBtn.addEventListener('click', calculateCommuteCost);
    }
    
    function calculateCommuteCost() {
        const distance = parseFloat(document.getElementById('commute-distance').value);
        const daysPerWeek = parseInt(document.getElementById('commute-days').value);
        const transportType = document.getElementById('transport-type').value;
        const fuelCost = parseFloat(document.getElementById('fuel-cost').value) || 0;
        const fuelEfficiency = parseFloat(document.getElementById('fuel-efficiency').value) || 0;
        const publicTransportCost = parseFloat(document.getElementById('public-transport-cost').value) || 0;
        const maintenanceCost = parseFloat(document.getElementById('maintenance-cost').value) || 0;
        const parkingCost = parseFloat(document.getElementById('parking-cost').value) || 0;
        
        if (isNaN(distance) || isNaN(daysPerWeek)) {
            return;
        }
        
        // Calculate trips per year (assuming 50 working weeks)
        const tripsPerYear = daysPerWeek * 50 * 2; // Multiply by 2 for round trip
        
        // Calculate total distance per year
        const distancePerYear = distance * tripsPerYear;
        
        // Calculate costs based on transport type
        let annualCost;
        
        if (transportType === 'car') {
            // Car costs: fuel + maintenance + parking
            const fuelCostPerYear = (distancePerYear / fuelEfficiency) * fuelCost;
            const maintenanceCostPerYear = distancePerYear * (maintenanceCost / 100); // Maintenance cost per 100 units
            const parkingCostPerYear = parkingCost * daysPerWeek * 50; // Assuming daily parking cost
            
            annualCost = fuelCostPerYear + maintenanceCostPerYear + parkingCostPerYear;
        } else {
            // Public transport costs
            annualCost = publicTransportCost * daysPerWeek * 50;
        }
        
        const monthlyCost = annualCost / 12;
        const dailyCost = annualCost / (daysPerWeek * 50);
        
        document.getElementById('annual-commute-cost').textContent = annualCost.toFixed(2);
        document.getElementById('monthly-commute-cost').textContent = monthlyCost.toFixed(2);
        document.getElementById('daily-commute-cost').textContent = dailyCost.toFixed(2);
        document.getElementById('distance-per-year').textContent = distancePerYear.toFixed(0);
    }

    // Break-Even Calculator
    const calculateBreakevenBtn = document.getElementById('calculate-breakeven-btn');
    if (calculateBreakevenBtn) {
        calculateBreakevenBtn.addEventListener('click', calculateBreakeven);
    }
    
    function calculateBreakeven() {
        const fixedCosts = parseFloat(document.getElementById('fixed-costs').value);
        const unitPrice = parseFloat(document.getElementById('unit-price').value);
        const unitCost = parseFloat(document.getElementById('unit-cost').value);
        
        if (isNaN(fixedCosts) || isNaN(unitPrice) || isNaN(unitCost)) {
            return;
        }
        
        const contributionMargin = unitPrice - unitCost;
        const breakEvenUnits = fixedCosts / contributionMargin;
        const breakEvenRevenue = breakEvenUnits * unitPrice;
        
        document.getElementById('contribution-margin').textContent = contributionMargin.toFixed(2);
        document.getElementById('breakeven-units').textContent = Math.ceil(breakEvenUnits);
        document.getElementById('breakeven-revenue').textContent = breakEvenRevenue.toFixed(2);
        
        // Create break-even chart
        const breakevenChartCanvas = document.getElementById('breakeven-chart');
        if (breakevenChartCanvas) {
            if (window.breakevenChart) {
                window.breakevenChart.destroy();
            }
            
            // Create data points for the chart
            const maxUnits = Math.ceil(breakEvenUnits * 2);
            const labels = [];
            const revenueData = [];
            const totalCostData = [];
            const fixedCostData = [];
            
            for (let i = 0; i <= maxUnits; i += Math.ceil(maxUnits / 10)) {
                labels.push(i);
                revenueData.push(i * unitPrice);
                totalCostData.push(fixedCosts + (i * unitCost));
                fixedCostData.push(fixedCosts);
            }
            
            window.breakevenChart = new Chart(breakevenChartCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Revenue',
                            data: revenueData,
                            borderColor: 'rgba(16, 185, 129, 1)',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'Total Cost',
                            data: totalCostData,
                            borderColor: 'rgba(239, 68, 68, 1)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'Fixed Cost',
                            data: fixedCostData,
                            borderColor: 'rgba(99, 102, 241, 1)',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            fill: false,
                            borderDash: [5, 5]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Units',
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            },
                            ticks: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        },
                        annotation: {
                            annotations: {
                                breakEvenPoint: {
                                    type: 'point',
                                    xValue: breakEvenUnits,
                                    yValue: breakEvenRevenue,
                                    backgroundColor: 'rgba(255, 99, 132, 1)',
                                    radius: 5
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Product Pricing Calculator
    const calculatePricingBtn = document.getElementById('calculate-pricing-btn');
    if (calculatePricingBtn) {
        calculatePricingBtn.addEventListener('click', calculateProductPricing);
    }
    
    function calculateProductPricing() {
        const productCost = parseFloat(document.getElementById('product-cost').value);
        const desiredMargin = parseFloat(document.getElementById('desired-margin').value);
        const competitorPrice = parseFloat(document.getElementById('competitor-price').value) || 0;
        const marketPosition = document.getElementById('market-position').value;
        
        if (isNaN(productCost) || isNaN(desiredMargin)) {
            return;
        }
        
        // Calculate cost-based price
        const costBasedPrice = productCost / (1 - (desiredMargin / 100));
        
        // Calculate market-based price
        let marketBasedPrice;
        switch (marketPosition) {
            case 'budget':
                marketBasedPrice = competitorPrice * 0.8;
                break;
            case 'competitive':
                marketBasedPrice = competitorPrice;
                break;
            case 'premium':
                marketBasedPrice = competitorPrice * 1.2;
                break;
            case 'luxury':
                marketBasedPrice = competitorPrice * 1.5;
                break;
            default:
                marketBasedPrice = competitorPrice;
        }
        
        // Calculate value-based price (average of cost and market)
        const valueBasedPrice = (costBasedPrice + marketBasedPrice) / 2;
        
        // Calculate profit at each price point
        const costBasedProfit = costBasedPrice - productCost;
        const marketBasedProfit = marketBasedPrice - productCost;
        const valueBasedProfit = valueBasedPrice - productCost;
        
        // Calculate margin at each price point
        const costBasedMarginActual = (costBasedProfit / costBasedPrice) * 100;
        const marketBasedMargin = (marketBasedProfit / marketBasedPrice) * 100;
        const valueBasedMargin = (valueBasedProfit / valueBasedPrice) * 100;
        
        document.getElementById('cost-based-price').textContent = costBasedPrice.toFixed(2);
        document.getElementById('market-based-price').textContent = marketBasedPrice.toFixed(2);
        document.getElementById('value-based-price').textContent = valueBasedPrice.toFixed(2);
        document.getElementById('cost-based-profit').textContent = costBasedProfit.toFixed(2);
        document.getElementById('market-based-profit').textContent = marketBasedProfit.toFixed(2);
        document.getElementById('value-based-profit').textContent = valueBasedProfit.toFixed(2);
        document.getElementById('cost-based-margin').textContent = costBasedMarginActual.toFixed(2);
        document.getElementById('market-based-margin').textContent = marketBasedMargin.toFixed(2);
        document.getElementById('value-based-margin').textContent = valueBasedMargin.toFixed(2);
    }

    // ROI/Ad Spend Calculator
    const calculateRoiBtn = document.getElementById('calculate-roi-btn');
    if (calculateRoiBtn) {
        calculateRoiBtn.addEventListener('click', calculateRoi);
    }
    
    function calculateRoi() {
        const adSpend = parseFloat(document.getElementById('ad-spend').value);
        const revenue = parseFloat(document.getElementById('ad-revenue').value);
        const conversionRate = parseFloat(document.getElementById('conversion-rate').value);
        const averageOrderValue = parseFloat(document.getElementById('average-order-value').value);
        
        if (isNaN(adSpend) || isNaN(revenue) || isNaN(conversionRate) || isNaN(averageOrderValue)) {
            return;
        }
        
        // Calculate ROI
        const profit = revenue - adSpend;
        const roi = (profit / adSpend) * 100;
        
        // Calculate ROAS (Return on Ad Spend)
        const roas = revenue / adSpend;
        
        // Calculate CPA (Cost Per Acquisition)
        const estimatedClicks = adSpend / (averageOrderValue * (conversionRate / 100));
        const conversions = estimatedClicks * (conversionRate / 100);
        const cpa = adSpend / conversions;
        
        // Calculate CLV (Customer Lifetime Value) to CAC (Customer Acquisition Cost) ratio
        // Assuming CLV is 3 times the average order value for this example
        const clv = averageOrderValue * 3;
        const clvCacRatio = clv / cpa;
        
        document.getElementById('roi-result').textContent = roi.toFixed(2);
        document.getElementById('roas-result').textContent = roas.toFixed(2);
        document.getElementById('cpa-result').textContent = cpa.toFixed(2);
        document.getElementById('clv-cac-ratio').textContent = clvCacRatio.toFixed(2);
        
        // Create ROI chart
        const roiChartCanvas = document.getElementById('roi-chart');
        if (roiChartCanvas) {
            if (window.roiChart) {
                window.roiChart.destroy();
            }
            
            window.roiChart = new Chart(roiChartCanvas, {
                type: 'bar',
                data: {
                    labels: ['Ad Spend', 'Revenue', 'Profit'],
                    datasets: [{
                        label: 'Amount ($)',
                        data: [adSpend, revenue, profit],
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(99, 102, 241, 0.8)'
                        ],
                        borderColor: [
                            'rgba(239, 68, 68, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(99, 102, 241, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        },
                        x: {
                            ticks: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    // Carbon Footprint Calculator
    const calculateCarbonBtn = document.getElementById('calculate-carbon-btn');
    if (calculateCarbonBtn) {
        calculateCarbonBtn.addEventListener('click', calculateCarbonFootprint);
    }
    
    function calculateCarbonFootprint() {
        const electricityUsage = parseFloat(document.getElementById('electricity-usage').value) || 0;
        const gasUsage = parseFloat(document.getElementById('gas-usage').value) || 0;
        const carMiles = parseFloat(document.getElementById('car-miles').value) || 0;
        const flightHours = parseFloat(document.getElementById('flight-hours').value) || 0;
        const meatConsumption = parseFloat(document.getElementById('meat-consumption').value) || 0;
        const wasteProduction = parseFloat(document.getElementById('waste-production').value) || 0;
        
        // Carbon factors (kg CO2e per unit)
        const electricityFactor = 0.5; // per kWh
        const gasFactor = 2.0; // per therm
        const carFactor = 0.4; // per mile
        const flightFactor = 90; // per hour
        const meatFactor = 6.0; // per kg
        const wasteFactor = 0.5; // per kg
        
        // Calculate carbon footprint for each category
        const electricityCarbon = electricityUsage * electricityFactor;
        const gasCarbon = gasUsage * gasFactor;
        const carCarbon = carMiles * carFactor;
        const flightCarbon = flightHours * flightFactor;
        const meatCarbon = meatConsumption * meatFactor;
        const wasteCarbon = wasteProduction * wasteFactor;
        
        // Calculate total carbon footprint
        const totalCarbon = electricityCarbon + gasCarbon + carCarbon + flightCarbon + meatCarbon + wasteCarbon;
        
        // Calculate average per category
        const averageElectricity = 300 * electricityFactor; // Average monthly electricity usage
        const averageGas = 50 * gasFactor; // Average monthly gas usage
        const averageCar = 1000 * carFactor; // Average monthly car miles
        const averageFlight = 2 * flightFactor; // Average monthly flight hours
        const averageMeat = 5 * meatFactor; // Average monthly meat consumption
        const averageWaste = 20 * wasteFactor; // Average monthly waste production
        
        // Calculate total average
        const totalAverage = averageElectricity + averageGas + averageCar + averageFlight + averageMeat + averageWaste;
        
        // Calculate percentage compared to average
        const percentageOfAverage = (totalCarbon / totalAverage) * 100;
        
        document.getElementById('total-carbon').textContent = totalCarbon.toFixed(2);
        document.getElementById('electricity-carbon').textContent = electricityCarbon.toFixed(2);
        document.getElementById('gas-carbon').textContent = gasCarbon.toFixed(2);
        document.getElementById('car-carbon').textContent = carCarbon.toFixed(2);
        document.getElementById('flight-carbon').textContent = flightCarbon.toFixed(2);
        document.getElementById('meat-carbon').textContent = meatCarbon.toFixed(2);
        document.getElementById('waste-carbon').textContent = wasteCarbon.toFixed(2);
        document.getElementById('average-comparison').textContent = percentageOfAverage.toFixed(2);
        
        // Create carbon footprint chart
        const carbonChartCanvas = document.getElementById('carbon-chart');
        if (carbonChartCanvas) {
            if (window.carbonChart) {
                window.carbonChart.destroy();
            }
            
            window.carbonChart = new Chart(carbonChartCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Electricity', 'Gas', 'Car Travel', 'Flights', 'Meat Consumption', 'Waste'],
                    datasets: [{
                        data: [
                            electricityCarbon,
                            gasCarbon,
                            carCarbon,
                            flightCarbon,
                            meatCarbon,
                            wasteCarbon
                        ],
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.8)',
                            'rgba(236, 72, 153, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(245, 158, 11, 0.8)'
                        ],
                        borderColor: [
                            'rgba(99, 102, 241, 1)',
                            'rgba(236, 72, 153, 1)',
                            'rgba(139, 92, 246, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(239, 68, 68, 1)',
                            'rgba(245, 158, 11, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    }
                }
            });
        }
    }

    // Trip Budget Calculator
    const calculateTripBtn = document.getElementById('calculate-trip-btn');
    if (calculateTripBtn) {
        calculateTripBtn.addEventListener('click', calculateTripBudget);
    }
    
    function calculateTripBudget() {
        const tripDuration = parseInt(document.getElementById('trip-duration').value);
        const numTravelers = parseInt(document.getElementById('num-travelers').value);
        const destination = document.getElementById('trip-destination').value;
        const accommodationCost = parseFloat(document.getElementById('accommodation-cost').value);
        const transportationCost = parseFloat(document.getElementById('transportation-cost').value);
        const foodCostPerDay = parseFloat(document.getElementById('food-cost').value);
        const activitiesCost = parseFloat(document.getElementById('activities-cost').value);
        const miscCost = parseFloat(document.getElementById('misc-cost').value) || 0;
        
        if (isNaN(tripDuration) || isNaN(numTravelers) || isNaN(accommodationCost) || 
            isNaN(transportationCost) || isNaN(foodCostPerDay) || isNaN(activitiesCost)) {
            return;
        }
        
        // Calculate total costs
        const totalAccommodation = accommodationCost * tripDuration;
        const totalFood = foodCostPerDay * tripDuration * numTravelers;
        const totalActivities = activitiesCost * numTravelers;
        const totalMisc = miscCost;
        
        const totalTripCost = transportationCost + totalAccommodation + totalFood + totalActivities + totalMisc;
        const costPerPerson = totalTripCost / numTravelers;
        const costPerDay = totalTripCost / tripDuration;
        
        document.getElementById('total-trip-cost').textContent = totalTripCost.toFixed(2);
        document.getElementById('cost-per-person').textContent = costPerPerson.toFixed(2);
        document.getElementById('cost-per-day').textContent = costPerDay.toFixed(2);
        document.getElementById('accommodation-total').textContent = totalAccommodation.toFixed(2);
        document.getElementById('food-total').textContent = totalFood.toFixed(2);
        document.getElementById('activities-total').textContent = totalActivities.toFixed(2);
        document.getElementById('transportation-total').textContent = transportationCost.toFixed(2);
        document.getElementById('misc-total').textContent = totalMisc.toFixed(2);
        
        // Create trip budget chart
        const tripChartCanvas = document.getElementById('trip-chart');
        if (tripChartCanvas) {
            if (window.tripChart) {
                window.tripChart.destroy();
            }
            
            window.tripChart = new Chart(tripChartCanvas, {
                type: 'pie',
                data: {
                    labels: ['Transportation', 'Accommodation', 'Food', 'Activities', 'Miscellaneous'],
                    datasets: [{
                        data: [
                            transportationCost,
                            totalAccommodation,
                            totalFood,
                            totalActivities,
                            totalMisc
                        ],
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.8)',
                            'rgba(236, 72, 153, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(239, 68, 68, 0.8)'
                        ],
                        borderColor: [
                            'rgba(99, 102, 241, 1)',
                            'rgba(236, 72, 153, 1)',
                            'rgba(139, 92, 246, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(239, 68, 68, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    }
                }
            });
        }
    }

    // Jet Lag Calculator
    const calculateJetlagBtn = document.getElementById('calculate-jetlag-btn');
    if (calculateJetlagBtn) {
        calculateJetlagBtn.addEventListener('click', calculateJetLag);
    }
    
    function calculateJetLag() {
        const departureTimezone = parseInt(document.getElementById('departure-timezone').value);
        const arrivalTimezone = parseInt(document.getElementById('arrival-timezone').value);
        const flightDuration = parseInt(document.getElementById('flight-duration').value);
        const travelDirection = document.getElementById('travel-direction').value;
        const sleepQuality = document.getElementById('sleep-quality').value;
        
        if (isNaN(departureTimezone) || isNaN(arrivalTimezone) || isNaN(flightDuration)) {
            return;
        }
        
        // Calculate time zone difference
        const timezoneDifference = Math.abs(arrivalTimezone - departureTimezone);
        
        // Calculate base recovery days (1 day per 1-2 time zones crossed)
        let baseRecoveryDays = Math.ceil(timezoneDifference / 2);
        
        // Adjust for travel direction (eastward travel is typically harder to adjust to)
        if (travelDirection === 'east') {
            baseRecoveryDays *= 1.5;
        }
        
        // Adjust for sleep quality
        let sleepFactor;
        switch (sleepQuality) {
            case 'poor':
                sleepFactor = 1.5;
                break;
            case 'average':
                sleepFactor = 1;
                break;
            case 'good':
                sleepFactor = 0.8;
                break;
            default:
                sleepFactor = 1;
        }
        
        const adjustedRecoveryDays = baseRecoveryDays * sleepFactor;
        
        // Calculate optimal adjustment strategy
        let adjustmentStrategy;
        if (timezoneDifference <= 2) {
            adjustmentStrategy = "Minimal adjustment needed. Try to adapt to local time immediately.";
        } else if (timezoneDifference <= 4) {
            adjustmentStrategy = "Moderate adjustment needed. Start adjusting 1-2 days before travel.";
        } else if (timezoneDifference <= 8) {
            adjustmentStrategy = "Significant adjustment needed. Start adjusting 2-3 days before travel.";
        } else {
            adjustmentStrategy = "Major adjustment needed. Start adjusting 3-4 days before travel.";
        }
        
        // Calculate best times for light exposure and melatonin
        let lightExposure, melatoninTiming;
        
        if (travelDirection === 'east') {
            lightExposure = "Seek morning light at destination and avoid afternoon light.";
            melatoninTiming = "Take melatonin in the early evening at destination (5-7 PM).";
        } else {
            lightExposure = "Seek afternoon light at destination and avoid morning light.";
            melatoninTiming = "Take melatonin before bedtime at destination (10 PM-midnight).";
        }
        
        document.getElementById('timezone-difference').textContent = timezoneDifference;
        document.getElementById('recovery-days').textContent = Math.ceil(adjustedRecoveryDays);
        document.getElementById('adjustment-strategy').textContent = adjustmentStrategy;
        document.getElementById('light-exposure').textContent = lightExposure;
        document.getElementById('melatonin-timing').textContent = melatoninTiming;
        
        // Create jet lag recovery chart
        const jetlagChartCanvas = document.getElementById('jetlag-chart');
        if (jetlagChartCanvas) {
            if (window.jetlagChart) {
                window.jetlagChart.destroy();
            }
            
            // Create data for recovery curve
            const labels = [];
            const alertnessData = [];
            const recoveryDays = Math.ceil(adjustedRecoveryDays);
            
            for (let i = 0; i <= recoveryDays; i++) {
                labels.push(`Day ${i}`);
                
                // Alertness starts at 30% and gradually increases to 100%
                // Using a sigmoid function for a more realistic recovery curve
                const alertness = 30 + (70 * (1 / (1 + Math.exp(-1.5 * (i - recoveryDays/2)))));
                alertnessData.push(alertness);
            }
            
            window.jetlagChart = new Chart(jetlagChartCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Alertness Level (%)',
                        data: alertnessData,
                        borderColor: 'rgba(99, 102, 241, 1)',
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            min: 0,
                            max: 100,
                            ticks: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        },
                        x: {
                            ticks: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    }
                }
            });
        }
    }

    // Learning Curve Calculator
    const calculateLearningBtn = document.getElementById('calculate-learning-btn');
    if (calculateLearningBtn) {
        calculateLearningBtn.addEventListener('click', calculateLearningCurve);
    }
    
    function calculateLearningCurve() {
        const initialTime = parseFloat(document.getElementById('initial-time').value);
        const learningRate = parseFloat(document.getElementById('learning-rate').value);
        const repetitions = parseInt(document.getElementById('repetitions').value);
        const skillComplexity = document.getElementById('skill-complexity').value;
        
        if (isNaN(initialTime) || isNaN(learningRate) || isNaN(repetitions)) {
            return;
        }
        
        // Adjust learning rate based on skill complexity
        let adjustedLearningRate;
        switch (skillComplexity) {
            case 'simple':
                adjustedLearningRate = learningRate * 1.2;
                break;
            case 'moderate':
                adjustedLearningRate = learningRate;
                break;
            case 'complex':
                adjustedLearningRate = learningRate * 0.8;
                break;
            case 'very-complex':
                adjustedLearningRate = learningRate * 0.6;
                break;
            default:
                adjustedLearningRate = learningRate;
        }
        
        // Calculate time for each repetition using the power law of practice
        const times = [];
        let totalTime = 0;
        
        for (let i = 1; i <= repetitions; i++) {
            const time = initialTime * Math.pow(i, -adjustedLearningRate/100);
            times.push(time);
            totalTime += time;
        }
        
        // Calculate improvement percentage
        const improvementPercentage = ((initialTime - times[times.length - 1]) / initialTime) * 100;
        
        // Calculate time to reach 80% proficiency
        const proficiencyTarget = initialTime * 0.2; // 80% reduction in time
        let proficiencyRepetitions = 0;
        
        for (let i = 0; i < times.length; i++) {
            if (times[i] <= proficiencyTarget) {
                proficiencyRepetitions = i + 1;
                break;
            }
        }
        
        if (proficiencyRepetitions === 0 && times.length > 0) {
            // Extrapolate if we haven't reached 80% proficiency yet
            proficiencyRepetitions = Math.ceil(Math.pow(initialTime / proficiencyTarget, 1 / (adjustedLearningRate/100)));
        }
        
        document.getElementById('final-time').textContent = times[times.length - 1].toFixed(2);
        document.getElementById('total-practice-time').textContent = totalTime.toFixed(2);
        document.getElementById('improvement-percentage').textContent = improvementPercentage.toFixed(2);
        document.getElementById('proficiency-repetitions').textContent = proficiencyRepetitions;
        
        // Create learning curve chart
        const learningChartCanvas = document.getElementById('learning-chart');
        if (learningChartCanvas) {
            if (window.learningChart) {
                window.learningChart.destroy();
            }
            
            const labels = [];
            for (let i = 1; i <= repetitions; i++) {
                labels.push(`Rep ${i}`);
            }
            
            window.learningChart = new Chart(learningChartCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Time per Repetition',
                        data: times,
                        borderColor: 'rgba(99, 102, 241, 1)',
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Time',
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            },
                            ticks: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Repetitions',
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            },
                            ticks: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8f9fa' : '#212529'
                            }
                        }
                    }
                }
            });
        }
    }
});