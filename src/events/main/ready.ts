import { client } from "../..";
import { Event } from "../../struct/types/Event";

export default new Event({
    name: "ready",
    once:  true,
    run() {
        const { commands, buttons, selects, modals } = client;
        console.log("Bot Z ROTS is ready!".green);
        console.log(`Commands loaded: ${commands.size}`.blue);
        console.log(`Buttons loaded: ${buttons.size}`.blue);
        console.log(`Selects loaded: ${selects.size}`.blue);
        console.log(`Modals loaded: ${modals.size}`.blue);
    }
})