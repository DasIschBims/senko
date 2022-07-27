const servercount = document.getElementById('server-count');
const usercount = document.getElementById('user-count');
const uptime = document.getElementById('uptime');
const commandcount = document.getElementById('command-count');

const url = "https://senko.dasischbims.social/api/infos";

function getBotInfo (url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        servercount.innerHTML = data.guildCount + " Servers";
        usercount.innerHTML = data.userCount + " Users";
        uptime.innerHTML = Math.floor(data.uptime / 1000) + "s Uptime";
        commandcount.innerHTML = data.commands + " Commands";
    }).catch(error => {
        servercount.innerHTML = "Error occured while";
        usercount.innerHTML = "loading the data.";
        uptime.innerHTML = "";
        commandcount.innerHTML = "";
        console.warn(error);
    });
};

getBotInfo(url);
