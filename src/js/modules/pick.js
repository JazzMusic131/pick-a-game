export const initPickAGame = () => {

    const pickBtn = document.getElementById('pick-btn');

    if (!pickBtn) {
        return;
    }


    let elemGameResults = document.getElementById("game-results");

    pickBtn.addEventListener('click', () => {

        if (elemGameResults) {
            if (elemGameResults.classList.contains('opacity-100')) {
                elemGameResults.classList.remove('opacity-100');
                elemGameResults.classList.add('opacity-0');
            }
        }

        const ApiUrl = import.meta.env.VITE_GRAPHQL_URL;
        const ApiToken = import.meta.env.VITE_CRAFT_GRAPHQL_TOKEN;

        let returnData = fetch(ApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + ApiToken
            },
            body: JSON.stringify({
                query: `query gameQuery {
                    entries(
                        section: "games"
                        hoursPlayed: 0
                        wasPicked: false
                        orderBy: "title"
                    ) {
                        id
                        title
                        ... on game_Entry {
                            steamId
                            releaseDate
                            steamUserScore
                            userScoreCount
                            wilsonScore
                            sdbRating
                            hoursPlayed
                            wasPicked
                        }
                    }
                }`
            })
        })
        .then(response => response.json()) // Parse the response body as JSON
        .then(data => data.data.entries) // Get the entry data
        .then(data => {

            // Pick random game
            const randomGame = getRandomGame(data);
            const releaseYear = new Date(randomGame.data.releaseDate).getFullYear();
            //console.log(`Random Game: ${randomGame.data.title}`);

            // Display game
            if (elemGameResults) {

                let elemGameTitle = elemGameResults.querySelector("#game-title");
                let elemSteamLink = elemGameResults.querySelector("#game-steam-link");
                let elemUserScore = elemGameResults.querySelector("#game-userscore");
                let elemUserScoreCount = elemGameResults.querySelector("#game-userscore-count");
                let elemWilson = elemGameResults.querySelector("#game-wilson");
                let elemSdb = elemGameResults.querySelector("#game-sdb");

                elemGameTitle.innerHTML = `${randomGame.data.title} (${releaseYear})`;
                elemSteamLink.href = `https://store.steampowered.com/app/${randomGame.data.steamId}`;
                elemUserScore.innerHTML = `User Score: ${randomGame.data.steamUserScore.toString()}`;
                elemUserScoreCount.innerHTML = `User Score Count: ${randomGame.data.userScoreCount.toString()}`;
                elemWilson.innerHTML = `Wilson Score: ${randomGame.data.wilsonScore.toString()}`;
                elemSdb.innerHTML = `SDB Rating: ${randomGame.data.sdbRating.toString()}`;

                elemGameResults.classList.add('opacity-100');
                elemGameResults.classList.remove('oopacity-0');

            }

        })
        .catch(error => console.error('Error fetching data: ', error));

    });

    function getRandomGame(obj) {

        const keys = Object.keys(obj);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex];
        const randomValue = obj[randomKey];

        return { key: randomKey, data: randomValue };

    }

}