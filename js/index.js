const url = "https://senko.dasischbims.social/api";

// Bot Info

const servercount = document.getElementById("server-count");
const usercount = document.getElementById("user-count");
const uptime = document.getElementById("uptime");
const commandcount = document.getElementById("command-count");

function getBotInfo (url) {
    fetch(url + "/infos")
    .then(response => response.json())
    .then(data => {
        servercount.innerHTML = data.guildCount + " Servers";
        usercount.innerHTML = data.userCount + " Users";
        // get the uptime from data.uptime and format it to hours, minutes and seconds, then update it every second to make it look cool
        let uptime_seconds = Math.floor(data.uptime / 1000);
        let uptime_hours = Math.floor(uptime_seconds / 3600);
        let uptime_minutes = Math.floor((uptime_seconds - (uptime_hours * 3600)) / 60);
        let uptime_seconds_left = uptime_seconds - (uptime_hours * 3600) - (uptime_minutes * 60);
        uptime.innerHTML = uptime_hours + " hours, " + uptime_minutes + " minutes and " + uptime_seconds_left + " seconds";
        setInterval(function() {
            uptime_seconds++;
            uptime_hours = Math.floor(uptime_seconds / 3600);
            uptime_minutes = Math.floor((uptime_seconds - (uptime_hours * 3600)) / 60);
            uptime_seconds_left = uptime_seconds - (uptime_hours * 3600) - (uptime_minutes * 60);
            uptime.innerHTML = uptime_hours + " hours, " + uptime_minutes + " minutes and " + uptime_seconds_left + " seconds";
        }, 1000);
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

// User Info

const userIdInput = document.getElementById("user-id");
const guildIdInput = document.getElementById("guild-id");
const getLevelButton = document.getElementById("get-level");
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const levelInfo = document.getElementById("level-info");
const xpInfo = document.getElementById("xp-info");
const levelCard = document.getElementById("level-card");
const errorCard = document.getElementById("error-card");

function getUserInfo (userId, guildId) {
    fetch(url + "/users/" + guildId + "/" + userId)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            levelCard.classList.add("display-none");
            errorCard.classList.remove("display-none");
        } else {
            userAvatar.src = data.avatarURL;
            userName.innerHTML = data.username + "#" + data.discriminator;
            levelInfo.innerHTML = "Level: " + data.level;
            xpInfo.innerHTML = "XP: " + data.xp + " / " + data.xpRequired;
            errorCard.classList.add("display-none");
            levelCard.classList.remove("display-none");
        }
    }).catch(error => {
        console.warn(error);
    });
}

getLevelButton.addEventListener("click", function() {
    let userId = userIdInput.value;
    let guildId = guildIdInput.value;
    getUserInfo(userId, guildId);
});