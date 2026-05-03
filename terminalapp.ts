/*import * as readline from 'readline-sync';
import {Speler, Positie} from './interfaces';

let spelers: Speler[] = [];
let posities: Positie[] = [];

async function main() {
    try {
        const positiesResponse = await fetch("https://raw.githubusercontent.com/matiastorfs/dataset-project-webontwikkeling/main/posities.json");
        posities = await positiesResponse.json();

        const playersResponse = await fetch("https://raw.githubusercontent.com/matiastorfs/dataset-project-webontwikkeling/main/spelers.json");
        spelers = await playersResponse.json();

        console.log("Welcome to the JSON data viewer!");
        const choices = ["View all data", "Filter by ID"];
        const answer = readline.keyInSelect(choices, "Please enter your choice: ");

        if (answer === 0) {
            spelers.forEach(spelerItem => {
                console.log(`- ${spelerItem.naam} (${spelerItem.id})`);
            });
        } 
        else if (answer === 1) {
            const id = readline.questionInt("Please enter the ID you want to filter by: ");
            const chosenPlayer = spelers.find(spelerItem => spelerItem.id === id);

            if (!chosenPlayer) {
                console.log(`Er bestaat geen speler met ID ${id}`);
            } 
            else {
                console.log(`- ${chosenPlayer.naam} (${chosenPlayer.id})`);
                console.log(`  - Description: ${chosenPlayer.beschrijving}`);
                console.log(`  - Age: ${chosenPlayer.leeftijd}`);
                console.log(`  - Active: ${chosenPlayer.isActief}`);
                console.log(`  - Birthdate: ${chosenPlayer.geboortedatum}`);
                console.log(`  - Status: ${chosenPlayer.status}`);
                console.log(`  - Hobbies: ${chosenPlayer.hobbies.join(", ")}`);
                console.log(`  - Position: ${chosenPlayer.positie.naam}`);
                console.log(`    - Verdededigend: ${chosenPlayer.positie.isVerdedigend ? "Ja" : "Nee"}`);
                console.log(`    - Positie beschrijving: ${chosenPlayer.positie.beschrijving}`);
            }
        }
    } 
    catch (error: any) {
        console.error(error);
    }
}
main();*/