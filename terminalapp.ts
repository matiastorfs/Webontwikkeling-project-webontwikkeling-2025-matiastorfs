import * as readline from 'readline-sync';
import {Speler, Positie} from './interfaces';

let spelers: Speler[] = [];
let posities: Positie[] = [];

async function main() {
    try {
        const positiesResponse = await fetch("https://raw.githubusercontent.com/matiastorfs/dataset-project-webontwikkeling/main/posities.json");
        posities = await positiesResponse.json();

        const spelersResponse = await fetch("https://raw.githubusercontent.com/matiastorfs/dataset-project-webontwikkeling/main/spelers.json");
        const spelersData: Speler[] = await spelersResponse.json();

        spelers = spelersData.map(spelerItem => {
            const volledigePositie = posities.find(posities => posities.id === spelerItem.positie.id);
            return {
                id: spelerItem.id,
                naam: spelerItem.naam,
                beschrijving: spelerItem.beschrijving,
                leeftijd: spelerItem.leeftijd,
                isActief: spelerItem.isActief,
                geboortedatum: spelerItem.geboortedatum,
                imageUrl: spelerItem.imageUrl,
                status: spelerItem.status,
                hobbies: spelerItem.hobbies,
                positie: volledigePositie ? volledigePositie : spelerItem.positie
            };
        });

        console.log("Welcome to the JSON data viewer!");
        const choices = ["View all data", "Filter by ID"];
        const answer = readline.keyInSelect(choices, "Please enter your choice: ");

        if (answer === 0) {
            spelers.forEach(spelerItem => {
                console.log(`- ${spelerItem.naam} (${spelerItem.id})`);
            });
        } else if (answer === 1) {
            const id = readline.questionInt("Please enter the ID you want to filter by: ");
            const chosenPlayer = spelers.find(spelerItem => spelerItem.id === id);

            if (!chosenPlayer) {
                console.log(`Geen speler gevonden met ID ${id}`);
            } else {
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
};
main();