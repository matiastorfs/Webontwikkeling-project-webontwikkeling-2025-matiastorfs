import * as readline from 'readline-sync';

console.log("Welcome to the JSON data viewer!");

let choices: string[] = ["View all data", "Filter by ID"];

let answer: number = readline.keyInSelect(choices, "Please enter your choice:");

if (answer === 0) {
    console.log("Showing all data...");
}
else if (answer === 1) {
    let id = readline.questionInt("Please enter the ID you want to filter by:  ");
    console.log("You entered ID:", id);
}
else {
    console.log("Cancelled.");
}