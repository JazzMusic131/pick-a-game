export const initPickAGame = () => {

    const pickBtn = document.getElementById('pick-btn');

    if (!pickBtn) {
        return;
    }


    let elemGameResults = document.getElementById("game-results");

    pickBtn.addEventListener('click', () => {

        let elemGamer = document.getElementById("gamer-select");
        const gamerId = elemGamer.value;

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
                query: `query GetRandomGame {
                    entries(
                        section: "games"
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
                            ownersTable {
                                ... on ownerRow_Entry {
                                ownedBy {
                                    ... on gamer_Entry {
                                        id
                                        title
                                    }
                                }
                                hoursPlayed
                                wasPicked
                                }
                            }
                        }
                    }
                }`
            })
        })
        .then(response => response.json()) // Parse the response body as JSON
        .then(data => data.data.entries) // Get the entry data
        .then(data => {

            // Filter games (only games with no hours played based on user)
            let filteredGames = [];
            Object.entries(data).forEach(([key, value]) => {
                Object.entries(value.ownersTable).forEach(([ownersKey, ownersValue]) => {
                    if (ownersValue.ownedBy[0].id == gamerId && ownersValue.hoursPlayed == 0) {
                        filteredGames.push(data[key]);
                    }
                });
            });

            // Pick random game
            if (filteredGames.length !== 0) {

                const randomGame = getRandomGame(filteredGames);
                const releaseYear = (randomGame.data.releaseDate) ? new Date(randomGame.data.releaseDate).getFullYear() : null;
                console.log(randomGame.data);

                // Display game
                if (elemGameResults) {

                    let elemGameTitle = elemGameResults.querySelector("#game-title");
                    let elemSteamLink = elemGameResults.querySelector("#game-steam-link");
                    let elemUserScore = elemGameResults.querySelector("#game-userscore");
                    let elemUserScoreCount = elemGameResults.querySelector("#game-userscore-count");
                    let elemWilson = elemGameResults.querySelector("#game-wilson");
                    let elemSdb = elemGameResults.querySelector("#game-sdb");

                    // Title
                    let title;
                    title = `${randomGame.data.title}`;
                    if (releaseYear) {
                        title += ` (${releaseYear})`;
                    }
                    elemGameTitle.innerHTML = title;

                    // Steam ID
                    elemSteamLink.href = `https://store.steampowered.com/app/${randomGame.data.steamId}`;

                    // Steam User Score
                    if (randomGame.data.steamUserScore) {
                        elemUserScore.innerHTML = `User Score: ${randomGame.data.steamUserScore.toString()}`;
                    } else {
                        elemUserScore.innerHTML = "";
                    }

                    // User Score Count
                    if (randomGame.data.userScoreCount) {
                        elemUserScoreCount.innerHTML = `User Score Count: ${randomGame.data.userScoreCount.toString()}`;
                    } else {
                        elemUserScoreCount.innerHTML = "";
                    }

                    // https://robbreport.com/wp-content/uploads/2022/11/1-16.jpg?w=1000
                    if (randomGame.data.wilsonScore) {
                        elemWilson.innerHTML = `Wilson Score: ${randomGame.data.wilsonScore.toString()}`;
                    } else {
                        elemWilson.innerHTML = "";
                    }

                    // SDB Rating
                    if (randomGame.data.sdbRating) {
                        elemSdb.innerHTML = `SDB Rating: ${randomGame.data.sdbRating.toString()}`;
                    } else {
                        elemSdb.innerHTML = "";
                    }

                    elemGameResults.classList.add('opacity-100');
                    elemGameResults.classList.remove('opacity-0');

                }

            } else {
                let elemGameTitle = elemGameResults.querySelector("#game-title");
                elemGameTitle.innerHTML = `You've played everything, bruv`;
                elemGameResults.classList.add('opacity-100');
                elemGameResults.classList.remove('opacity-0');
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