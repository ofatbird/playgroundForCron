const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
(async function loop() {
    for (let i = 0; i <= 10; i++) {
        await delay(5000);
        console.log(i);
    }
})();