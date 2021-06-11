import readline from "readline"
import { MPDCPosterSource } from "./MPDCPosterSource"
import { PosterSource } from "./PosterSource"

console.log("Scraping poster sources...")

const sources: PosterSource[] = [
    // new MPDCPosterSource("https://www.movieposters.com/collections/size-27-x-39"),
    // new MPDCPosterSource("https://www.movieposters.com/collections/size-27-x-40"),
]

Promise.all(sources.map(source => source.getPosterUrls())).then(sources => {
    const result = new Map<string, string>()
    sources.forEach(source => source.forEach((v, k) => result.set(k, v)))

    console.log(`Found ${result.size} posters.`)

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const promptForLetterboxd = () => {
        rl.question("enter Letterboxd list URL: ", function(url: string) {
            promptForLetterboxd()
        });
    }
    
    promptForLetterboxd()
})
