const url = "https://senko.dasischbims.social/api";

// Bot Info

const servercount = document.getElementById("server-count");
const usercount = document.getElementById("user-count");
const uptime = document.getElementById("uptime");
const commandcount = document.getElementById("command-count");

let responseStatusInfos;

function getBotInfo(url) {
    fetch(url + "/infos")
        .then(function (response) {
            responseStatusInfos = response.status;
            return response.json();
        })
        .then(data => {
            servercount.innerHTML = data.guildCount + " Servers";
            usercount.innerHTML = data.userCount + " Users";

            let uptime_seconds = Math.floor(data.uptime / 1000);
            let uptime_hours = Math.floor(uptime_seconds / 3600);
            let uptime_minutes = Math.floor((uptime_seconds - (uptime_hours * 3600)) / 60);
            let uptime_seconds_left = uptime_seconds - (uptime_hours * 3600) - (uptime_minutes * 60);
            uptime.innerHTML = uptime_hours + " hours, " + uptime_minutes + " minutes and " + uptime_seconds_left + " seconds of uptime.";
            setInterval(function () {
                uptime_seconds++;
                uptime_hours = Math.floor(uptime_seconds / 3600);
                uptime_minutes = Math.floor((uptime_seconds - (uptime_hours * 3600)) / 60);
                uptime_seconds_left = uptime_seconds - (uptime_hours * 3600) - (uptime_minutes * 60);
                uptime.innerHTML = uptime_hours + " hours, " + uptime_minutes + " minutes and " + uptime_seconds_left + " seconds of uptime.";
            }, 1000);
            commandcount.innerHTML = data.commands + " Commands";
        }).catch(error => {
            if (responseStatusInfos == 429) {
                servercount.innerHTML = "You sent too";
                usercount.innerHTML = "many requests.";
                uptime.innerHTML = "";
                commandcount.innerHTML = "";
                return;
            }
            console.warn(error);
            servercount.innerHTML = "Error occured while";
            usercount.innerHTML = "loading the data.";
            uptime.innerHTML = "";
            commandcount.innerHTML = "";
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
const errorMessage = document.getElementById("error-message");

let responseStatusUser;

function getUserInfo(userId, guildId) {
    fetch(url + "/users/" + guildId + "/" + userId)
        .then(function (response) {
            responseStatusUser = response.status;
            return response.json();
        })
        .then(data => {
            if (data.error) {
                errorMessage.innerHTML = "An error occured while loading the data.";
                levelCard.classList.add("display-none");
                errorCard.classList.remove("display-none");
            } else {
                userAvatar.src = data.avatarURL;
                userName.innerHTML = data.username + "#" + data.discriminator;
                levelInfo.innerHTML = "Level: " + data.level;
                xpInfo.innerHTML = "XP: " + data.xp + " / " + data.xpRequired;
                errorMessage.innerHTML = "An error occured while loading the data.";
                errorCard.classList.add("display-none");
                levelCard.classList.remove("display-none");
            }
        }).catch(error => {
            if (userIdInput.value == "" || guildIdInput.value == "") {
                errorMessage.innerHTML = "Please enter a user Id and a guild Id.";
                levelCard.classList.add("display-none");
                errorCard.classList.remove("display-none");
            } else if (responseStatusUser == 404) {
                errorMessage.innerHTML = "Didn't find that user in the database.";
                levelCard.classList.add("display-none");
                errorCard.classList.remove("display-none");
            } else if (responseStatusUser == 429) {
                errorMessage.innerHTML = "You sent too many requests.";
                levelCard.classList.add("display-none");
                errorCard.classList.remove("display-none");
            } else {
                console.warn(error);
                errorMessage.innerHTML = "An error occured while loading the data.";
                levelCard.classList.add("display-none");
                errorCard.classList.remove("display-none");
            }
        });
}

getLevelButton.addEventListener("click", function (e) {
    e.preventDefault();
    let userId = userIdInput.value;
    let guildId = guildIdInput.value;
    getUserInfo(userId, guildId);
});
