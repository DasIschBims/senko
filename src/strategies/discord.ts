import passport from "passport";
import { Strategy } from "passport-discord";
import DiscordUserSchema from "../schemas/DiscordUser";

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    try {
        const user = DiscordUserSchema.findById(id);
        if (!user) throw new Error("User not found");
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

const passportStrat = passport.use(new Strategy({
    clientID: process.env.clientId,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.redirectURL,
    scope: ["identify", "guilds"]
}, async (accessToken: string, refreshToken: string, profile, done) => {
    try {
        const user = await DiscordUserSchema.findOne({ id: profile.id });
        if (!user) {
            let user = await DiscordUserSchema.create({
                id: profile.id,
                accessToken,
                refreshToken,
            });

            return done(null, user);
        } else if (user.accessToken !== accessToken && user.refreshToken !== refreshToken) {
            let user = await DiscordUserSchema.findOneAndUpdate({ id: profile.id }, {
                accessToken,
                refreshToken,
            });
            return done(null, user);
        } else {
            return done(null, user);
        }
    } catch (err) {
        console.log(err);
        return done(err, null);
    }
}))

export default passportStrat;