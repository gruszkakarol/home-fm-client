import { Action, User, UserAction } from "../Actions/index";
export function user(state: User = {} as User, action: UserAction): User {
    switch (action.type) {
        case Action.SAVE_USER_PROFILE:
            return action.user;
        case Action.USER_FETCH_FAILED:

        default:
            return state;
    }
}
