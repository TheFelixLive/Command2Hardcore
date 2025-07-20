# Command2Hardcore
<img src="https://github.com/user-attachments/assets/093e94d3-f5dd-4dbf-aa71-5da9e38741eb" width="1920" height="auto" />

## About
Normally, you can't execute commands in hardcore mode. Not even if you explicitly want to! That's where this add-on comes in, allowing you to execute commands comfortably via a small detour!

# Execute commands
1. Open the menu (by sneaking and jumping at the same time, noding in spectator mode or by interacting with a stick)
2. Select `Run a new Command`
3. Enter your Command & Have fun!

> [!NOTE]
> Commands like `/gamemode` will run but don't do anything.
It's an limitation of Minecraft

## Intuitiveness
Some commands can be entirely configuration via the menu. It's called visuel command

![Minecraft 24 06 2025 22_07_41](https://github.com/user-attachments/assets/4baef785-b802-432f-91d6-f507472f21d5)

### What's wrong?
If you do have a syntax misstage in your command, the addon will also display it in a littly ui to help you understand what went wrong

![Image](https://github.com/user-attachments/assets/ef4b2e37-3a38-4dd6-a26a-dd4ee877f12b)

## History
Every command that's being execute will be sorted to your world, so you can run them again whenever you want even when you left the world.
> I think console players will love that...

![Minecraft 23 06 2025 17_11_28](https://github.com/user-attachments/assets/79047fdf-9972-4bc0-a593-55314e98072b)

# Multiplayer
By default, your friends don't have permission to prevent them turning your world to the next 2b2t server.
However, with the permission feature under settings, you can change this for each player individually, even for players who have long since gone offline.

![Image](https://github.com/user-attachments/assets/77915bc5-f7fe-4379-89e9-950c11d31e4a)

# Planned features
- A central search
- A system that recognizes and fixes some syntax misstage
- A blacklist for command that can be modified

# Installation
1. **Download** the latest release from [here](https://github.com/TheFelixLive/Command2Hardcore/releases/latest).
2. **Open** the `.mcpack` or `.mcaddon` file with Minecraft.
3. **Create** a new world OR **edit** an existing world
4. **Navigate to**: Behavior packs.
5. **Click on** "Available"
6. **Activate** the Addon
7. `Play` or `Create` your World

# Multiple Menu
This add-on supports multiple menus. But what does that actually mean?
If you have at least two add-ons and want to open the menu, they will be displayed simultaneously. With multiple menu, the add-ons can communicate with each other, and only one menu will open. Just look for this icon: <img src="https://github.com/user-attachments/assets/43fc6418-62e1-424d-aeaa-424be79eff39" width="20" height="auto" />

![Minecraft 07 07 2025 14_29_26](https://github.com/user-attachments/assets/99c7853d-ced4-4ddc-9280-112d37675118)

> Was captured while the Timer and Command2Hard were active

<details>
<summary>Implication in your addon</summary>
<p>If you want you can copy this code to your own addon to implement the Multiple Menu System. I do my best to describe what function have to be when called.</p>

<pre><code>
/* ─────────────────────────────────────────────────────────
This code is part of the Multiple Menu System by TheFelixLive:
─────────────────────────────────────────────────────────*/

// MUST CHAGE: Addon informations
let addon_name = "My new Addon"
let addon_uuid = 41bc0f18-edc3-427a-a5a8-36dede25df56 // Doesn't have to be a UUID, it just has to be unique
let addon_texture_path = "textures/ui/hardcore/heart"

let main_menu = (player) => {
   your_menu(player); // This function is called when your addon is selected
}

// Make sure that multiple_menu(player) is called by your addon! If multiple_menu isn't enabled, it will automatically open your menu.


// Required models
import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui"

// Status
let system_privileges = 2

/* This variable contains the status (or permissions) of your add-on:
2 means the system is not active (no other packs founded);
1 means the system is acting as a host;
0 means the system is acting as a client;
*/



/*------------------------
 Client (an addon only needs to have the client function to be recognizable)
-------------------------*/

system.afterEvents.scriptEventReceive.subscribe(event=> {
   let player = event.sourceEntity

   // Sends the addon information to the host
   if (event.id === "multiple_menu:initialize") {
      world.scoreboard.getObjective("multiple_menu_name").setScore(addon_uuid + "_" + addon_name, 1);
      world.scoreboard.getObjective("multiple_menu_icon").setScore(addon_uuid + "_" + addon_texture_path, 1);
      if (system_privileges == 2) system_privileges = 0;
   }

   // Host Only (which is why system_privileges == 1): Opens the multiple menu, is called by other addons as a back button
   if (event.id === "multiple_menu:open_main" && system_privileges == 1) {
      multiple_menu(player);
   }

   // Will open the main menu of your addon
   if (event.id === "multiple_menu:open_"+addon_uuid) {
      main_menu(player);
   }
})

/*------------------------
 Host
-------------------------*/

let addon_name, addon_id, addon_icon; // When initialized properly, it contains the data of all supported add-ons

system.run(() => {
   initialize_multiple_menu()
});

async function initialize_multiple_menu() {
   // This fallback ensures that even if multiple add-ons could act as host, only one of them will be used as the host.
   try {
      world.scoreboard.addObjective("multiple_menu_name");
      world.scoreboard.addObjective("multiple_menu_icon");
      console.log("Multiple Menu: Initializing Host");
      system_privileges = 1;
   } catch (e) {
      console.log("Multiple Menu: Already Initialized");
      return -1;
   }

   // Requests addon informations. Look into the Client
   world.getDimension("overworld").runCommand("scriptevent multiple_menu:initialize");

   await system.waitTicks(2);
   console.log("Multiple Menu: successfully initialized as Host");

   // Evaluation of the add-on information
   const participants = world.scoreboard.getObjective("multiple_menu_name").getParticipants();
   addon_id = participants.map(p => p.displayName.split("_")[0]);
   addon_name = participants.map(p => p.displayName.split("_").slice(1).join("_"));
   addon_icon = world.scoreboard.getObjective("multiple_menu_icon").getParticipants().map(p => p.displayName.split("_").slice(1).join("_"));

   if (addon_id.length == 1) {
      console.log("Multiple Menu: no other plugin found");
      system_privileges = 2;
   }

   world.scoreboard.removeObjective("multiple_menu_name")
   world.scoreboard.removeObjective("multiple_menu_icon")
}

/*------------------------
 Host Only: Menu
-------------------------*/

function multiple_menu(player) {
   // Skips the multiple_menu
   if (system_privileges == 2) return main_menu(player);

   let form = new ActionFormData();
   let actions = [];

   form.title("Multiple menu v.1.0");
   form.body("Select an addon to open it's menu");

   // Adds every Addon as a button
   addon_name.forEach((name, index) => {
      form.button(name, addon_icon[index]);

      actions.push(() => {
         player.runCommand("scriptevent multiple_menu:open_"+ addon_id[index]);
      });
   });

   form.show(player).then((response) => {
      if (response.selection == undefined ) {
         return -1
      }

      if (actions[response.selection]) {
         actions[response.selection]();
      }
   });
}

</code></pre>

</details>



# License & Attribution
This project is licensed under the [MIT License](./LICENSE).

### Attribution Requirements
1. **Social Media Reviews:**
   - If you share reviews, screenshots, videos, or posts about this project on social media what I would preshade, please include:
     - the project name: **Command2Hardcore**
     - the official download link: `https://github.com/TheFelixLive/Command2Hardcore`
     - the creator: **TheFelixLive**

2. **Using Code in Your Own Projects:**
   - You are allowed to use code snippets from this repository in your own projects under the following conditions:
     - The copied code does **not** make up the **majority** of your project.
     - The reused code must be **clearly marked** with a comment in your code, for example:
        ```
        /* ─────────────────────────────────────────────────────────
           This code is part of Command2Hardcore by TheFelixLive:
           https://github.com/TheFelixLive/Command2Hardcore
        ─────────────────────────────────────────────────────────*/
        ```

> Thank you for respecting the license terms and supporting this project!
