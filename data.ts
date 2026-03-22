import { Positie, Speler } from "./interfaces";


export async function getData() {
    const positiesResponse = await fetch("https://raw.githubusercontent.com/matiastorfs/dataset-project-webontwikkeling/main/posities.json");
    let posities: Positie[] = await positiesResponse.json();

    const playersResponse = await fetch("https://raw.githubusercontent.com/matiastorfs/dataset-project-webontwikkeling/main/spelers.json");
    let spelers: Speler[] = await playersResponse.json();

    return { posities, spelers };
}