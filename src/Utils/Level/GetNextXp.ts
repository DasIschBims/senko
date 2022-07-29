const getNextXp = (level: number) => {
    return Math.floor(10*(level * level) + (55 * level) + 100);
}

export = getNextXp;
