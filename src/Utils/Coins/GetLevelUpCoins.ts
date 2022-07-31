import getNextXp from "../Level/GetNextXp";

const getLevelUpCoins = (level: number) => {
    const nextXP = getNextXp(level);
    const coins = Math.floor(Math.random() * (nextXP * 0.2) + nextXP * 0.4);
    return coins;
}

export = getLevelUpCoins;