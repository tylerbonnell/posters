import readline from "readline"
import { MPDCPosterSource } from "./MPDCPosterSource"
import { PosterSource } from "./PosterSource"
import { LetterboxdList } from "./LetterboxdList"
import { PosterListing } from "./PosterListing"
import { normalize } from "./TitleNormalizer"

console.log("Scraping poster sources...")

const sources: PosterSource[] = [
    new MPDCPosterSource("https://www.movieposters.com/collections/size-27-x-39", 50),
    new MPDCPosterSource("https://www.movieposters.com/collections/size-27-x-40", 150),
]

Promise.all(sources.map(source => source.getPosterUrls())).then(sources => {
    const listings = new Map<string, PosterListing>()
    sources.forEach(source => source.forEach((listing, title) => listings.set(normalize(title), listing)))

    console.log(`Found ${listings.size} posters.\n`)

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const promptForLetterboxd = () => {
        rl.question('enter Letterboxd list URL: ', (url: string) => {
            if (url === "") {
                process.exit()
            }
            console.log("\nResults:")
            new LetterboxdList(url).getTitles().then(titles => {
                for (const title of titles) {
                    const listing = listings.get(normalize(title))
                    if (listing) {
                        console.log(`${title} ${listing.url}`)
                    }
                }
                console.log()
                promptForLetterboxd()
            })
        });
    }
    
    promptForLetterboxd()
})
