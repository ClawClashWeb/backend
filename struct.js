import * as s from "superstruct";

export const createUser = s.object({
    userId: s.size(s.string(), 2, 20),
    userpassword: s.size(s.string(), 2, 20),
    nickname: s.string(),
});
