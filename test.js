

(async () => {
    const { ytmp4 } = require("ruhend-scraper")
    const url = 'https://youtu.be/KgWp7NwDiws?si=rAWwKS8ZN6EHKHwZ'
const data =  await ytmp4(url)
console.log(data)
    
})()