angular.module('expenseSplitterApp', [])
    .controller('ExpenseController', function () {
        // (unchanged controller code from the previous example)
        var expenseCtrl = this;

        expenseCtrl.expenses = [];
        expenseCtrl.newExpense = { description: '', amount: 0, splitBy: 'equal', customSplit: '' };

        expenseCtrl.addExpense = function () {
            expenseCtrl.expenses.push(angular.copy(expenseCtrl.newExpense));
            expenseCtrl.newExpense = { description: '', amount: 0, splitBy: 'equal', customSplit: '' };
        };

        expenseCtrl.removeExpense = function (index) {
            expenseCtrl.expenses.splice(index, 1);
        };

        expenseCtrl.getPeople = function () {
            var people = [];
            angular.forEach(expenseCtrl.expenses, function (expense) {
                if (expense.splitBy === 'custom') {
                    var names = expense.customSplit.split(',').map(function (name) {
                        return name.trim();
                    });
                    people = people.concat(names);
                }
            });
            return Array.from(new Set(people));
        };

        expenseCtrl.calculateOwes = function (person) {
            var totalOwes = 0;

            angular.forEach(expenseCtrl.expenses, function (expense) {
                if (expense.splitBy === 'equal') {
                    totalOwes += expense.amount / expenseCtrl.getPeople().length;
                } else if (expense.splitBy === 'custom') {
                    var names = expense.customSplit.split(',').map(function (name) {
                        return name.trim();
                    });

                    if (names.indexOf(person) !== -1) {
                        totalOwes += expense.amount / names.length;
                    }
                }
            });

            return totalOwes;
        };
        
        // New properties for the calculator
        this.calculatorAmount = 0;
        this.calculatorPeople = 1;
        this.calculatedSplit = null;

        // Calculator functions
        this.calculateEqualSplit = function () {
            if (this.calculatorAmount > 0 && this.calculatorPeople > 0) {
                var equalAmount = this.calculatorAmount / this.calculatorPeople;
                this.calculatedSplit = {};

                angular.forEach(this.getPeople(), function (person) {
                    this.calculatedSplit[person] = equalAmount;
                }, this);
            }
        };

        this.calculateCustomSplit = function () {
            if (this.calculatorAmount > 0 && this.calculatorPeople > 0) {
                this.calculatedSplit = {};

                angular.forEach(this.getPeople(), function (person) {
                    var customAmount = parseFloat(prompt('Enter the amount for ' + person + ':') || 0);
                    this.calculatedSplit[person] = customAmount || 0;
                }, this);
            }
        };
    });
