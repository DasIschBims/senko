const getNextXp = (level: number) => {
    return Math.floor(10*(level ^ 2) + (55 * level) + 100);
}

export = getNextXp;