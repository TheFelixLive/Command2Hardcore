import { world, system } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData  } from "@minecraft/server-ui"

const version_info = {
  name: "Command2Hardcore",
  version: "v.2.0.0",
  build: "B005",
  release_type: 0, // 0 = Development version (with debug); 1 = Beta version; 2 = Stable version
  unix: 1749126247,
  update_message_period_unix: 15897600, // Normally 6 months = 15897600
  changelog: {
    // new_features
    new_features: [
    ],
    // general_changes
    general_changes: [
    ],
    // bug_fixes
    bug_fixes: [
    ]
  }
}

let block_command_list = [
  /* Legend:
  rating = 0 - no warning
  rating = 1 - behaves strangely
  rating = 2 - bricks the world
  */
  {command_prefix: "gamemode", rating: 1},
  {command_prefix: "gamemode spectator", rating: 2},
  {command_prefix: "kill", rating: 2},
]

/*------------------------
  Handshake with timer
-------------------------*/

let use_timer = false

async function timer_handshake() {
  await system.waitTicks(1);

  if (version_info.release_type == 0) {
    console.log("Com2Hard: Sending handshake!")
  }
  world.getDimension("overworld").runCommand("scriptevent timerv:api_client_mode")

  await system.waitTicks(1);
  try {
    world.scoreboard.removeObjective("timer_handshake");
    use_timer = true
    if (version_info.release_type == 0) {
      console.log("Com2Hard: Handshake complete!");
    }
  } catch {
    if (version_info.release_type == 0) {
      console.log("Com2Hard: Handshake timeout!");
    }
  }

}

timer_handshake()


system.afterEvents.scriptEventReceive.subscribe(event=> {
  if (event.id === "timerv:api_menu_parent") {
    return main_menu(event.sourceEntity)
  }
});

/*------------------------
 Save Data
-------------------------*/

// Creates Save Data if not present
let save_data = load_save_data()  
if (!save_data) {
    save_data = [{update_message_unix: (version_info.unix + version_info.update_message_period_unix)}]
    
    if (version_info.release_type == 0) {
      console.log("Creating save_data...");
    }

    update_save_data(save_data)
}


// Load & Save Save data
function load_save_data() {
    let rawData = world.getDynamicProperty("com2hard:save_data");

    if (!rawData) {
        return;
    }

    return JSON.parse(rawData);
}


function update_save_data(input) {
    world.setDynamicProperty("com2hard:save_data", JSON.stringify(input))
};

function delete_player_save_data(player) {
  let save_data = load_save_data();

  save_data = save_data.filter(entry => entry.id !== player.id);
  update_save_data(save_data);
}



// Add player if not present
function create_player_save_data (playerId, playerName) {
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === playerId);

  if (save_data[player_sd_index] == undefined) {
      let shout_be_op = true;
  
      for (let entry of save_data) {
          if (entry.op === true) {
              shout_be_op = false;
              break;
          }
      }

      if (version_info.release_type == 0) {
        console.log(`Player ${playerName} (${playerId}) added with op=${shout_be_op}!`);
      }

      save_data.push({
          id: playerId,
          name: playerName,
          op: shout_be_op,
          command_history: [],
          last_unix: undefined
      });
  } else if (save_data[player_sd_index].name !== playerName) {
      save_data[player_sd_index].name = playerName;
  }

  update_save_data(save_data);
}

world.afterEvents.playerJoin.subscribe(async({ playerId, playerName }) => {
  create_player_save_data(playerId, playerName);

  let player;
  while (!player) {
    player = world.getAllPlayers().find(player => player.id == playerId)
    await system.waitTicks(1);
  }
  // I don't know why but in single player, the server is active about 60 ticks before the player of the server is reachable via getAllPlayers
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === playerId);

  if (!world.isHardcore) {
    return player.sendMessage("§l§4[§cError§4]§r This world is not a hardcore world! Use the native Chat instead!")
  }

  if (version_info.release_type !== 2 && save_data[player_sd_index].op) {
    player.sendMessage("§l§7[§f" + ("System") + "§7]§r "+ save_data[player_sd_index].name +" how is your experiences with "+ version_info.version +"? Does it meet your expectations? Would you like to change something and if so, what? Do you have a suggestion for a new feature? Share it at §lgithub.com/TheFelixLive/Command2Hardcore")
    player.playSound("random.pop")
  }

  // Help reminder: how to open the menu
  if (save_data[player_sd_index].last_unix == undefined || save_data[player_sd_index].last_unix > (Math.floor(Date.now() / 1000) + 604800)) {
    if (save_data[player_sd_index].op) {
      player.sendMessage("§l§6[§eHelp§6]§r You can always open the menu with the sneak-jump (or in spectator with the nod) gesture or with a stick")
      player.playSound("random.pop")
    }
    if (save_data[player_sd_index].last_unix == undefined) {
      save_data[player_sd_index].last_unix = Math.floor(Date.now() / 1000)
      update_save_data(save_data)
    }
  }


  // Update popup
  if (save_data[player_sd_index].op && (Math.floor(Date.now() / 1000)) > save_data[0].update_message_unix) {
    let form = new ActionFormData();
    form.title("Update time!");
    form.body("Your current version (" + version_info.version + ") is older than 6 months.\nThere MIGHT be a newer version out. Feel free to update to enjoy the latest features!\n\nCheck out: §7github.com/TheFelixLive/Command2Hardcore");
    form.button("Mute");

    const showForm = async () => {
      form.show(player).then((response) => {
        if (response.canceled && response.cancelationReason === "UserBusy") {
          showForm()
        } else {
          if (response.selection === 0) {
            save_data[0].update_message_unix = (Math.floor(Date.now() / 1000)) + version_info.update_message_period_unix;
            update_save_data(save_data);
          }
        }
      });
    };
    showForm();
  }
});

world.afterEvents.playerLeave.subscribe(({ playerId, playerName }) => {
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === playerId);

  // When a player's sd gets removed he will kick out of the game triggering this...
  if (player_sd_index) {
    save_data[player_sd_index].last_unix = Math.floor(Date.now() / 1000)
    update_save_data(save_data);
  }
});


/*------------------------
 Open the menu
-------------------------*/


// via. item
world.beforeEvents.itemUse.subscribe(event => {
	if (event.itemStack.typeId === "minecraft:stick") {
    let player = event.source
    system.run(() => {
      let save_data = load_save_data();
      let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

      if (save_data[player_sd_index].op) {
        return main_menu(player)
      } else {
        player.sendMessage("§l§7[§fSystem§7]§r You do not have the right permission to run commands! Ask "+ getBestPlayerName(save_data) +" for a promotion.")
      }
    });
	}
});

// via. jump gesture
const gestureCooldowns = new Map();

async function gesture_jump() {
  const now = Date.now();

  for (const player of world.getAllPlayers()) {
    const lastUsed = gestureCooldowns.get(player.id) || 0;

    if (player.isSneaking && player.isJumping) {
      if (now - lastUsed >= 100) { // 2 Sekunden Cooldown
        let save_data = load_save_data();
        let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

        if (save_data[player_sd_index].op) {
          main_menu(player)
        } else {
          player.sendMessage("§l§7[§fSystem§7]§r You do not have the right permission to run commands! Ask "+ getBestPlayerName(save_data) +" for a promotion.")
        }
        gestureCooldowns.set(player.id, now);
        await system.waitTicks(10)
      }
    }
  }
}



// via. gesture
const playerHeadMovement = new Map();

async function gesture_nod() {
  const now = Date.now();

  for (const player of world.getAllPlayers()) {
    if (player.getGameMode() !== "spectator") continue;

    const { x: pitch } = player.getRotation();

    const prev = playerHeadMovement.get(player.id) || {
      state: "idle",
      timestamp: now,
    };
    let { state, timestamp: lastTime } = prev;

    if (state === "idle" && pitch < -13) {
      state = "lookingUp";
      lastTime = now;
    }
    else if (state === "lookingUp" && pitch > 13) {
      let save_data = load_save_data();
      let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

      if (save_data[player_sd_index].op) {
        main_menu(player)
      } else {
        player.sendMessage("§l§7[§fSystem§7]§r You do not have the right permission to run commands! Ask "+ getBestPlayerName(save_data) +" for a promotion.")
      }

      state = "idle";
      lastTime = now;
    }
    else if (state === "lookingUp" && now - lastTime > 1000) {
      state = "idle";
      lastTime = now;
    }

    playerHeadMovement.set(player.id, { state, timestamp: lastTime });
  }
}




/*------------------------
 general helper functions
-------------------------*/

function getRelativeTime(diff) {
  let seconds = diff;
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let months = Math.floor(days / 30);
  let years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  }
  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `a few seconds`;
}


function getBestPlayerName(save_data) {
  const playerIds = world.getAllPlayers().map(player => player.id);
  const candidates = save_data.filter(entry => entry.op === true);

  const exactMatches = candidates.filter(entry => playerIds.includes(entry.id));
  if (exactMatches.length > 0) {
    return exactMatches[0].name;
  }

  const now = Date.now();
  let best = candidates[0];
  let bestDiff = Math.abs(best.last_unix * 1000 - now);

  for (let i = 1; i < candidates.length; i++) {
    const entry = candidates[i];
    const diff = Math.abs(entry.last_unix * 1000 - now);
    if (diff < bestDiff) {
      best = entry;
      bestDiff = diff;
    }
  }

  return best.name;
}



function convertUnixToDate(unixSeconds, utcOffset) {
  const date = new Date(unixSeconds*1000);
  const localDate = new Date(date.getTime() + utcOffset * 60 * 60 * 1000);

  // Format the date (YYYY-MM-DD HH:MM:SS)
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(localDate.getUTCDate()).padStart(2, '0');
  const hours = String(localDate.getUTCHours()).padStart(2, '0');
  const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(localDate.getUTCSeconds()).padStart(2, '0');
  
  return {
    day: day,
    month: month,
    year: year,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    utcOffset: utcOffset
  };
}






/*------------------------
 Menus
-------------------------*/

function main_menu(player) {
  let form = new ActionFormData();
  let actions = [];

  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Main menu");
  form.body("Select an option!");


  // Timer: menu
  if (use_timer) {
    form.button("Timer V", "textures/ui/timer");
    actions.push(() => {
      player.runCommand("/scriptevent timerv:api_menu")
    });
  }

  // Button: Commands

  if (world.isHardcore) {
    form.button("Run new command", "textures/ui/chat_send");
    actions.push(() => {
      command_menu(player);
    });

    // Sort the command history by unix timestamp and get the last 4 entries
    let sortedHistory = save_data[player_sd_index].command_history
      .sort((a, b) => b.unix - a.unix)  // Sort by unix timestamp, descending
      .slice(0, 2);  // Take the most recent 2 entries

    sortedHistory.forEach(c => {
      let commandText = c.command.split(" ")[0];  // Only take the part before the first space
      let statusText = c.successful ? "§2ran§r" : "§cfailed§r";
      let relativeTime = getRelativeTime(Math.floor(Date.now() / 1000) - c.unix);
      
      form.button(`${commandText}\n${statusText} | ${relativeTime} ago`);
      actions.push(() => {
        command_menu(player, c.command);
      });
    });

    // Show "Show more" button only if there are more than 2 entries in command history
    if (save_data[player_sd_index].command_history.length > 2) {
      form.button("Show more!");
      actions.push(() => {
        command_history_menu(player);
      });
    }
  }

  // Button: Settings
  form.button(use_timer? "Settings\n(Com2Hard)" : "Settings", "textures/ui/automation_glyph_color");
  actions.push(() => {
    settings_main(player);
  });

  form.show(player).then((response) => {
    if (response.selection === undefined) {
      return -1;
    }

    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
}



function command_history_menu(player) {
  let form = new ActionFormData();
  let actions = [];

  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Command History");
  form.body("Select a commend!");

  // Sort the command history by unix timestamp and get the last 4 entries
  let sortedHistory = save_data[player_sd_index].command_history
    .sort((a, b) => b.unix - a.unix)  // Sort by unix timestamp, descending

  sortedHistory.forEach(c => {
    let commandText = c.command.split(" ")[0];  // Only take the part before the first space
    let statusText = c.successful ? "§2ran§r" : "§cfailed§r";
    let relativeTime = getRelativeTime(Math.floor(Date.now() / 1000) - c.unix);
    
    form.button(`${commandText}\n${statusText} | ${relativeTime} ago`);
    actions.push(() => {
      command_menu(player, c.command);
    });
  });

  form.button("");
  actions.push(() => {
    main_menu(player);
  });

  form.show(player).then((response) => {
    if (response.selection === undefined) {
      return -1;
    }

    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
}



function command_menu(player, command) {
  let form = new ModalFormData();
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  const playerNames = ["Server", ...world.getAllPlayers().map(p => p.name)];
  if (!playerNames.includes(player.name)) playerNames.unshift(player.name);

  form.title("Command");
  form.textField('Command', 'e.g. /say hallo world!', command);
  form.dropdown('Execute by', playerNames, playerNames.indexOf(player.name));

  form.show(player).then(response => {
    if (response.canceled) return -1;
    if (!response.formValues[0]) return main_menu(player);

    let cmd = response.formValues[0].startsWith("/") ? response.formValues[0] : "/" + response.formValues[0];
    const byServer = response.formValues[1] === 0;

    let matchedBlock = null;
    for (const block of block_command_list) {
      if (cmd.toLowerCase().includes(block.command_prefix.toLowerCase())) {
        if (!matchedBlock || block.command_prefix.length > matchedBlock.command_prefix.length) {
          matchedBlock = block;
        }
      }
    }

    if (matchedBlock) {
      let form = new ActionFormData();
      let actions = [];
      form.title("Warning");
      form.body(
        matchedBlock.rating === 1
          ? `The §l/${matchedBlock.command_prefix}§r command behaves differently than expected in §chardcore mode§r.\n\nDo you want to run it anyways?`
          : matchedBlock.rating === 2
            ? `The /${matchedBlock.command_prefix}§r command will most likely §4§llose your hardcore world!§r\n\nDo you really want that?`
            : ""
      );

      if (matchedBlock.rating > 0) {
        form.button(matchedBlock.rating === 2 ? "No risk no fun!" : "Try it!");
        actions.push(() => {
          return execute_command(player, cmd, byServer, save_data, player_sd_index);
        });
      }

      form.button(""); // Cancel
      actions.push(() => {
        return command_menu(player, cmd);
      });

      form.show(player).then((response_2) => {
        if (response_2.selection === undefined) return -1;
        if (actions[response_2.selection]) actions[response_2.selection]();
      });
    } else {
      execute_command(player, cmd, byServer, save_data, player_sd_index);
    }
  });
}




function execute_command(player, cmd, byServer, save_data, player_sd_index) {
  try {
    let result = byServer
      ? world.getDimension("overworld").runCommand(cmd)
      : player.runCommand(cmd);

    const success = result.successCount > 0;

    save_data[player_sd_index].command_history.push({
      command: cmd,
      successful: success,
      unix: Math.floor(Date.now() / 1000)
    });
    update_save_data(save_data);

    player.sendMessage(success ? "Command executed" : "§cCommand didn't execute");
  } catch (e) {
    save_data[player_sd_index].command_history.push({
      command: cmd,
      successful: false,
      unix: Math.floor(Date.now() / 1000)
    });
    update_save_data(save_data);

    command_menu_result_e(player, e.message, cmd);
    player.sendMessage("§c" + e.message);
  }
}


function command_menu_result_e(player, message, command) {
  let form = new ActionFormData();
  let actions = [];

  form.title("Command Result");

  const errorSnippet = extractErrorSnippet(message);

  const highlightedCommand = highlightErrorInCommand(command, errorSnippet);

  form.body("Command:\n§o§7" + highlightedCommand + "\n\n§rFailed with:\n§c" + message);

  form.button("Try again");
  actions.push(() => {
    command_menu(player, command);
  });

  form.button("");
  actions.push(() => {
    main_menu(player);
  });

  form.show(player).then((response) => {
    if (response.selection == undefined) {
      return -1;
    }

    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function extractErrorSnippet(message) {
  const match = message.match(/"([^"]+)"/);
  return match ? match[1] : '';
}

function highlightErrorInCommand(command, errorSnippet) {
  if (!errorSnippet) return command;

  const highlightedSnippet = '§c' + errorSnippet + '§7';
  return command.replace(errorSnippet, highlightedSnippet);
}


// execute as @s at @z run function timer/ui/menu/new



/*------------------------
 Settings
-------------------------*/


function settings_main(player) {
  let form = new ActionFormData();
  let actions = [];
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Settings");
  form.body("Select an option!");


  // Button 1: Permission
  if (save_data[player_sd_index].op) {
    form.button("Permission\n" + (() => {
      const players = world.getAllPlayers();
      const ids = players.map(p => p.id);
      const names = save_data.slice(1).sort((a, b) =>
        ids.includes(a.id) && !ids.includes(b.id) ? -1 :
        ids.includes(b.id) && !ids.includes(a.id) ? 1 : 0
      ).map(e => e.name);
      return names.length > 1 ? names.slice(0, -1).join(", ") + " u. " + names[names.length - 1] : names.join(", ");
    })(), "textures/ui/op");
    actions.push(() => {
      settings_rights_main(player, true)
    });  
  }

  // Button 2: Debug
  if (version_info.release_type == 0 && save_data[player_sd_index].op) {
    form.button("Debug\n", "textures/ui/ui_debug_glyph_color");
    actions.push(() => {
      debug_main(player);
    });
  }

  // Button 3: Dictionary
  form.button("About\n", "textures/ui/infobulb");
  actions.push(() => {
    dictionary_about_version(player)
  });

  // Back to main menu
  form.button("");
  actions.push(() => {
    main_menu(player)
  });

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }

    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

/*------------------------
 Dictionary
-------------------------*/

function dictionary_about_version(player) {
  let form = new ActionFormData()
  let actions = []
  let build_date = convertUnixToDate(version_info.unix, 0);
  form.title("About")
  form.body(
    "Name: " + version_info.name + "\n" +
    "Version: " + version_info.version + ((Math.floor(Date.now() / 1000)) > (version_info.update_message_period_unix + version_info.unix)? " §a(update time)§r" : " (" + version_info.build + ")") + "\n" +
    "Release type: " + ["dev", "preview", "stable"][version_info.release_type] + "\n" +
    "Build date: " + `${build_date.day}.${build_date.month}.${build_date.year} ${build_date.hours}:${build_date.minutes}:${build_date.seconds} (UTC${build_date.utcOffset >= 0 ? '+' : ''}${build_date.utcOffset})` +

    "\n\n§7© "+ (build_date.year > 2025? "2025 - "+build_date.year : build_date.year )+" TheFelixLive. All rights reserved."
  )

  if (version_info.changelog.new_features.length > 0 || version_info.changelog.general_changes.length > 0 || version_info.changelog.bug_fixes.length > 0) {
    form.button("§9Changelog");
    actions.push(() => {
      dictionary_about_version_changelog(player, build_date)
    });
  }

  form.button("§3Contact");
  actions.push(() => {
    dictionary_contact(player, build_date)
  });

  form.button("");
  actions.push(() => {
    return settings_main(player);
  });

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function dictionary_contact(player, build_date) {
  let form = new ActionFormData()
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  // Yes, that's right, you're not dumping the full "save_data". The player names are removed here for data protection reasons
  save_data = save_data.map(entry => {
    if ("name" in entry) {
      return { ...entry, name: "" };
    }
    return entry;
  });
  // and this adds information about the dump date and version to ensure whether a dump matches a bug
  save_data.push({ dump_unix:Math.floor(Date.now() / 1000), name:version_info.name, version:version_info.version, build:version_info.build });

  let actions = []
  form.title("Contact")
  form.body("If you need want to report a bug, need help, or have suggestions to improvements to the project, you can reach me via these platforms:\n\n§l§5Github:§r github.com/TheFelixLive/Command2Hardcore/issues\n\n§8Curseforge:§r curseforge.com/projects/1277546");

  if (save_data[player_sd_index].op) {
    form.button("Dump SD" + (version_info.release_type !== 2? "\nvia. privat chat" : ""));
    actions.push(() => {
      player.sendMessage("§l§7[§f"+ ("System") + "§7]§r SD Dump:\n"+JSON.stringify(save_data))
    });

    if (version_info.release_type !== 2) {
      form.button("Dump SD\nvia. server console");
      actions.push(() => {
        console.log(JSON.stringify(save_data))
      });
    }
  }

  form.button("");
  actions.push(() => {
    dictionary_about_version(player, build_date)
  });

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function dictionary_about_version_changelog(player, build_date) {
  let form = new ActionFormData()
  form.title("Changelog - "+version_info.version)
  let bodyText = "";
  if (version_info.changelog.new_features.length > 0) {
    bodyText += "§l§bNew Features§r\n\n";
    version_info.changelog.new_features.forEach(feature => {
      bodyText += `- ${feature}\n\n`;
    });
  }

  if (version_info.changelog.general_changes.length > 0) {
    bodyText += "§l§aGeneral Changes§r\n\n";
    version_info.changelog.general_changes.forEach(change => {
      bodyText += `- ${change}\n\n`;
    });
  }

  if (version_info.changelog.bug_fixes.length > 0) {
    bodyText += "§l§cBug fixes§r\n\n";
    version_info.changelog.bug_fixes.forEach(fix => {
      bodyText += `- ${fix}\n\n`;
    });
  }

  bodyText += `§7As of ${build_date.day}.${build_date.month}.${build_date.year} (`+ getRelativeTime(Math.floor(Date.now() / 1000) - version_info.unix) + " ago)";

  form.body(bodyText);
  form.button("");

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection == 0) {
      dictionary_about_version(player)
    }
  });
}




/*------------------------
 Debug
-------------------------*/

function debug_main(player) {
  let form = new ActionFormData()

  form.body("DynamicPropertyTotalByteCount: "+world.getDynamicPropertyTotalByteCount() +" of 32767 bytes used")
  form.button("§e\"save_data\" Editor");
  form.button("§aAdd player (save data)");
  form.button("§cRemove \"save_data\"");
  form.button("§cClose Server");
  form.button("");

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection == 0) return debug_sd_editor(player, () => debug_main(player), []);
    if (response.selection == 1) return debug_add_fake_player(player);
    if (response.selection == 2) {world.setDynamicProperty("com2hard:save_data", undefined); close_world()}
    if (response.selection == 3) {close_world()}
    if (response.selection == 4) {
      return settings_main(player)
    };
  });
}



function debug_sd_editor(player, onBack, path = []) {
  const save_data = load_save_data();

  let current = save_data;
  for (const key of path) {
    current = current[key];
  }

  const returnToCurrentMenu = () => debug_sd_editor(player, onBack, path);

  if (Array.isArray(current)) {
    const form = new ActionFormData()
      .title("Debug Editor v.1.0")
      .body(`Path: §7save_data/`);

    current.forEach((entry, idx) => {
      const label = idx === 0
        ? `Server [${idx}]`
        : `${entry.name ?? `Player ${idx}`} [${entry.id ?? idx}]`;
      form.button(label, "textures/ui/storageIconColor");
    });

    form.button(""); // Back

    form.show(player).then(res => {
      if (res.canceled) return;
      if (res.selection === current.length) {
        return onBack();
      }
      debug_sd_editor(
        player,
        returnToCurrentMenu,
        [...path, res.selection]
      );
    });

  // === B) Object-Branch ===
  } else if (current && typeof current === "object") {
    const keys = Object.keys(current);
    const displaySegments = path.map((seg, idx) => {
      if (idx === 0) {
        return seg === 0 ? "server" : save_data[Number(seg)]?.id ?? seg;
      }
      return seg;
    });
  const displayPath = `save_data/${displaySegments.join("/")}`;
    const form = new ActionFormData()
      .title("Debug Editor v.1.0")
      .body(`Path: §7${displayPath}`);

    keys.forEach(key => {
      const val = current[key];
      if (typeof val === "boolean") {
        form.button(
          `${key}\n${val ? "§aON" : "§cOFF"}`,
          val ? "textures/ui/toggle_on" : "textures/ui/toggle_off"
        );
      } else if (typeof val === "number") {
        form.button(`${key}: ${val}§r\n§9type: number`, "textures/ui/editIcon");
      } else if (typeof val === "string") {
        form.button(`${key}: ${val}§r\n§9type: string`, "textures/ui/editIcon");
      } else {
        form.button(`${key}`, "textures/ui/storageIconColor"); // verschachteltes Objekt/Array
      }
    });

    form.button(""); // Back

    form.show(player).then(res => {
      if (res.selection == undefined ) {
        return -1
      }
      // 1. Back-Button?
      if (res.selection === keys.length) {
        return onBack();
      }

      const key = keys[res.selection];
      const nextPath = [...path, key];
      const fresh = load_save_data();
      let target = fresh;
      for (const k of nextPath.slice(0, -1)) {
        target = target[k];
      }
      const val = target[key];
      if (typeof val === "boolean") {
        // Boolean-Toggle
        target[key] = !val;
        update_save_data(fresh);
        returnToCurrentMenu();

      } else if (typeof val === "number") {
        // Number-Editor
        openNumberEditor(
          player,
          val,
          nextPath,
          newVal => {
            target[key] = newVal;
            update_save_data(fresh);
            returnToCurrentMenu();
          },
          () => {
            return -1
          }
        );

      } else if (typeof val === "string") {
        // Text-Editor
        openTextEditor(
          player,
          val,
          nextPath,
          newText => {
            target[key] = newText;
            update_save_data(fresh);
            returnToCurrentMenu();
          },
          () => {
            return -1
          }
        );

      } else {
        debug_sd_editor(player, returnToCurrentMenu, nextPath);
      }
    });
  }
}





function openNumberEditor(player, current, path, onSave, onCancel) {
  const displaySegments = path.map((seg, idx) => {
    if (idx === 0) {
      return seg === 0 ? "server" : save_data[Number(seg)]?.id ?? seg;
    }
    return seg;
  });
  const fullPath = `save_data/${displaySegments.join("/")}`;
  const form = new ModalFormData();
  form.title("Edit Number");
  form.slider(`Path: §7${fullPath} > Value`, 0, 100, 1, current);
  form.submitButton("Save");
  form.show(player).then(res => {
    if (res.canceled) {
      return onCancel();
    }
    onSave(res.formValues[0]);
  });
}

function openTextEditor(player, current, path, onSave, onCancel) {
  const displaySegments = path.map((seg, idx) => {
    if (idx === 0) {
      return seg === 0 ? "server" : save_data[Number(seg)]?.id ?? seg;
    }
    return seg;
  });
  const fullPath = `save_data/${displaySegments.join("/")}`;
  const form = new ModalFormData();
  form.title("Edit Text");
  form.textField(`Path: ${fullPath} > Value:`, "Enter text...", current);
  form.submitButton("Save");
  form.show(player).then(res => {
    if (res.canceled) {
      return onCancel();
    }
    onSave(res.formValues[0]);
  });
}




function debug_add_fake_player(player) {
  let form = new ModalFormData();

  form.textField("Player name", player.name);
  form.textField("Player id", player.id);
  form.submitButton("Add player")

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    create_player_save_data(response.formValues[1], response.formValues[0])
    return debug_main(player)
  });
}

function settings_rights_main(player, came_from_settings) {
  let form = new ActionFormData();
  let save_data = load_save_data();

  form.title("Permissions");
  form.body("Select a player!");


  const players = world.getAllPlayers();
  const playerIds = players.map(player => player.id);
  
  let newList = save_data.slice(1);
  
  newList.sort((a, b) => {
    const now = Math.floor(Date.now() / 1000);

    const aOnline = playerIds.includes(a.id);
    const bOnline = playerIds.includes(b.id);

    const aOp = a.op;
    const bOp = b.op;

    const aLastSeen = now - a.last_unix;
    const bLastSeen = now - b.last_unix;

    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;

    if (aOnline && bOnline) {
      if (aOp && !bOp) return -1;
      if (!aOp && bOp) return 1;

      return aName.localeCompare(bName);
    }
    return aLastSeen - bLastSeen;
  });

  
  newList.forEach(entry => {
    const isOnline = playerIds.includes(entry.id);
    let displayName = entry.name;

    if (isOnline) {
      displayName += "\n§a(online)§r";
    } else {
      displayName += "\n§o(last seen " + getRelativeTime(Math.floor(Date.now() / 1000) - entry.last_unix) + " ago)§r";
    }

    if (entry.op) {
      form.button(displayName, "textures/ui/op");
    } else {
      form.button(displayName, "textures/ui/permissions_member_star");
    }
  });

  form.button("");

  if (newList.length == 1) {
    if (came_from_settings) {
      return settings_rights_data(player, newList[0]);
    } else {
      return settings_main(player);
    }
  }
  

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection === newList.length) {
      return settings_main(player);
    } else {
      return settings_rights_data(player, newList[response.selection]);
    }
  });
}

function settings_rights_data(viewing_player, selected_save_data) {
  let save_data = load_save_data()
  let selected_player = world.getAllPlayers().find(player => player.id == selected_save_data.id);
  let form = new ActionFormData();

  let body_text = "";

  body_text += "Name: " + selected_save_data.name + " (id: " + selected_save_data.id + ")\n";

  if (selected_player) {
      if (version_info.release_type == 0) {
          let memory_text = "";
          switch (selected_player.clientSystemInfo.memoryTier) {
              case 0:
                  memory_text = "Client Total Memory: Under 1.5 GB (Super Low)";
                  break;
              case 1:
                  memory_text = "Client Total Memory: 1.5 - 2.0 GB (Low)";
                  break;
              case 2:
                  memory_text = "Client Total Memory: 2.0 - 4.0 GB (Mid)";
                  break;
              case 3:
                  memory_text = "Client Total Memory: 4.0 - 8.0 GB (High)";
                  break;
              case 4:
                  memory_text = "Client Total Memory: Over 8.0 GB (Super High)";
                  break;
          }

          let input_text = "";
          switch (selected_player.inputInfo.lastInputModeUsed) {
              case "Gamepad":
                  input_text = "Input: Gamepad";
                  break;
              case "KeyboardAndMouse":
                  input_text = "Input: Mouse & Keyboard";
                  break;
              case "MotionController":
                  input_text = "Input: Motion controller";
                  break;
              case "Touch":
                  input_text = "Input: Touch";
                  break;
          }

          body_text += "Online: yes\n";
          body_text += "Platform: " + selected_player.clientSystemInfo.platformType + "\n";
          body_text += memory_text + "\n";
          body_text += input_text + "\n";

      } else {
          body_text += "Online: yes\n";
      }

  } else {
      body_text += "Online: no §7(last seen " + getRelativeTime(Math.floor(Date.now() / 1000) - selected_save_data.last_unix) + " ago)§r\n";
  }

  body_text += "\n";

  form.body(body_text);
  let actions = [];

  if (selected_save_data.id !== viewing_player.id) {
    form.title("Edit "+ selected_save_data.name +"'s permission");
    if (selected_save_data.op) {
      
      form.button("§cMake deop");
      actions.push(() => {
        let player_sd_index = save_data.findIndex(entry => entry.id === selected_save_data.id)
        save_data[player_sd_index].op = false
        update_save_data(save_data);
        return settings_rights_data(viewing_player, save_data[player_sd_index])
      });

    } else {

      form.button("§aMake op");
      actions.push(() => {
        form = new MessageFormData();
        form.title("Op advantages");
        form.body("Your are trying to add op advantages to "+selected_save_data.name+". With them he would be able to:\n\n- Run all kinds off command\n- Mange save data\n\nAre you sure you want to add them?\n ");
        form.button1("");
        form.button2("§aMake op");
        form.show(viewing_player).then((response) => {
          if (response.selection == undefined ) {
            return -1
          }
          if (response.selection == 1) {
            let player_sd_index = save_data.findIndex(entry => entry.id === selected_save_data.id)
            save_data[player_sd_index].op = true
            selected_save_data = save_data[player_sd_index]
            update_save_data(save_data);
          }

          return settings_rights_data(viewing_player, selected_save_data)
        });
      });

    }
  } else {
    form.title("Edit your permission");
  }
  
  form.button("Manage save data");
  actions.push(() => {
    settings_rights_manage_sd(viewing_player, selected_save_data);
  });
  
  form.button("");
  actions.push(() => {
    settings_rights_main(viewing_player, false);
  });

  form.show(viewing_player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function settings_rights_manage_sd(viewing_player, selected_save_data) {
  const form = new ActionFormData()
    .title(`${selected_save_data.name}'s save data`)
    .body("Select an option!")
    .button("§dReset save data")
    .button("§cDelete save data")
    .button("");

  form.show(viewing_player).then(response => {
    if (response.selection == undefined ) {
      return -1
    }

    const is_reset = response.selection === 0;
    const is_delete = response.selection === 1;

    if (response.selection === 2) {
      settings_rights_data(viewing_player, selected_save_data);
    } else {
      handle_data_action(is_reset, is_delete, viewing_player, selected_save_data);
    }
  });
}

function handle_data_action(is_reset, is_delete, viewing_player, selected_save_data) {
  const selected_player = world.getAllPlayers().find(p => p.id === selected_save_data.id);
  if (is_reset) {
    delete_player_save_data(selected_save_data);
    create_player_save_data(selected_save_data.id, selected_save_data.name);
    return settings_rights_main(viewing_player, false);
  }

  if (is_delete) {
    if (selected_player) {
      const confirm_form = new MessageFormData()
        .title("Online player information")
        .body(`Are you sure you want to remove ${selected_player.name}'s save data?\nThey must disconnect from the world!`)
        .button1("")
        .button2("§cKick & Delete");

      confirm_form.show(viewing_player).then(confirm => {
        if (confirm.selection == undefined ) {
          return -1
        }
        if (confirm.selection === 1) {
          if (!world.getDimension("overworld").runCommand(`kick ${selected_player.name}`).successCount) {
            const host_form = new MessageFormData()
              .title("Host player information")
              .body(`${selected_player.name} is the host. To delete their data, the server must shut down. This usually takes 5 seconds`)
              .button1("")
              .button2("§cShutdown & Delete");

            host_form.show(viewing_player).then(host => {
              if (host.selection == undefined ) {
                return -1
              }
              if (host.selection === 1) {
                delete_player_save_data(selected_save_data);
                return close_world();
              } else {
                settings_rights_manage_sd(viewing_player, selected_save_data);
              }
            });
          } else {
            delete_player_save_data(selected_save_data);
            settings_rights_main(viewing_player, false);
          }
        } else {
          settings_rights_manage_sd(viewing_player, selected_save_data);
        }
      });

    } else {
      delete_player_save_data(selected_save_data);
      settings_rights_main(viewing_player, false);
    }
  }
}




/*------------------------
 Update loop
-------------------------*/

function close_world() {
  world.sendMessage("Closing World! Auto Save is disabled! Please wait...");
  while (true) {}
}

async function update_loop() {
    while (true) {
      let save_data = load_save_data();
      gesture_nod()
      gesture_jump()

      


      await system.waitTicks(1);
    }
}

update_loop();