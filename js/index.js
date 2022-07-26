const servercount = document.getElementById('server-count');
const usercount = document.getElementById('user-count');

const url = "https://senko.dasischbims.social/api/infos";

function getBotInfo (url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        servercount.innerHTML = data.guildCount + " Servers";
        usercount.innerHTML = data.userCount + " Users";
    }).catch(error => {
        servercount.innerHTML = "Error occured while";
        usercount.innerHTML = "loading the data.";
        console.warn(error);
    });
};

getBotInfo(url);
