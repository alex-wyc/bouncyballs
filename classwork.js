var numbers = [1,2,3,4];

var newNumbers = numbers.filter(function(number) {
    return number % 2 == 1;
}).map(function(number) {
    return number * 2;
}).map(function(number) {
    return number + 1;
});

console.log('the doubled numbers are ', newNumbers);
