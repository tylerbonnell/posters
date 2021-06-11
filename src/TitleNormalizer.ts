export const normalize = (title: string) => {
    title = title.toLowerCase()
    if (title.startsWith("the ")) {
        title = title.replace("the ", "")
    }
    return title
}