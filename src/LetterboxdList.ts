import axios from "axios"
import parse, { HTMLElement } from "node-html-parser"

export class LetterboxdList {

    private readonly url: string

    constructor(listURL: string) {
        this.url = listURL
    }

    getTitles(): Promise<string[]> {
        return axios.get(this.url)
            .then(response => {
                return parse(response.data)
                        .querySelectorAll('.poster')
                        .flatMap(node => (node as HTMLElement).childNodes)
                        .filter(node => node instanceof HTMLElement)
                        .map(node => (node as HTMLElement).getAttribute("alt") as string)
                        .filter(title => !!title)
            })
    }
}