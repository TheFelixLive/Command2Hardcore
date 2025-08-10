import { system, world, EntityTypes, EffectTypes } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData  } from "@minecraft/server-ui"


const version_info = {
  name: "Command2Hardcore",
  version: "v.3.0.0",
  build: "B021",
  release_type: 0, // 0 = Development version (with debug); 1 = Beta version; 2 = Stable version
  unix: 1754828393,
  update_message_period_unix: 15897600, // Normally 6 months = 15897600
  uuid: "a9bdf889-7080-419c-b23c-adfc8704c4c1",
  changelog: {
    // new_features
    new_features: [
      "Time zones can now be determined automatically",
      "The About page got a redesigned"
    ],
    // general_changes
    general_changes: [
      "Added multiple menu support for v.2.0",
      "Changed some visual command icons",
      "Changed catiguration in command history "
    ],
    // bug_fixes
    bug_fixes: [
      "Permission should now work as intended",
      "Fixed a bug that caused the changelog to always display \"a few seconds ago\"",
      "Fixed a visual bug that caused empty categories to be displayed",
      "Fixed a bug that prevented the menu from being opened via a stick"
    ]
  }
}

const links = [
  {name: "§l§5Github:§r", link: "github.com/TheFelixLive/Command2Hardcore"},
  {name: "§l§8Curseforge:§r", link: "curseforge.com/projects/1277546"},
  {name: "§l§aMcpedl:§r", link: "mcpedl.com/com2hard"},
]

const timezone_list = [
  {
    name: "Baker Island Time",
    utc: -12,
    short: "BIT",
    location: ["Baker Island"],
    lang: ["en_us"]
  },
  {
    name: "Niue Time",
    utc: -11,
    short: "NUT",
    location: ["Niue", "American Samoa"],
    lang: ["en_us"]
  },
  {
    name: "Hawaii-Aleutian Standard Time",
    utc: -10,
    short: "HAST",
    location: ["Hawaii", "Honolulu"],
    lang: ["en_us"]
  },
  {
    name: "Marquesas Time",
    utc: -9.5,
    short: "MART",
    location: ["Marquesas Islands"],
    lang: ["fr_fr", "ty_ty"]
  },
  {
    name: "Alaska Standard Time",
    utc: -9,
    short: "AKST",
    location: ["Anchorage"],
    lang: ["en_us"]
  },
  {
    name: "Pacific Standard Time",
    utc: -8,
    short: "PST",
    location: ["Los Angeles (Winter)", "Vancouver (Winter)"],
    lang: ["en_us", "en_ca"]
  },
  {
    name: "Pacific Daylight / Mountain Standard Time",
    utc: -7,
    short: "PDT / MST",
    location: ["Los Angeles (Summer)", "Vancouver (Summer)", "Denver (Winter)", "Phoenix"],
    lang: ["en_us", "en_ca"]
  },
  {
    name: "Mountain Daylight / Central Standard Time",
    utc: -6,
    short: "MDT / CST",
    location: ["Denver (Summer)", "Chicago (Winter)", "Mexico City (Winter)"],
    lang: ["en_us", "es_mx"]
  },
  {
    name: "Central Daylight / Eastern Standard Time",
    utc: -5,
    short: "CDT / EST",
    location: ["Chicago (Summer)", "New York (Winter)", "Toronto (Winter)"],
    lang: ["en_us", "fr_ca", "fr_fr"]
  },
  {
    name: "Atlantic Standard / Eastern Daylight Time",
    utc: -4,
    short: "AST / EDT",
    location: ["Santiago (Winter)", "Caracas (Winter)", "New York (Summer)", "Toronto (Summer)"],
    lang: ["en_us", "es_cl", "es_ve", "fr_ca"]
  },
  {
    name: "Newfoundland Standard Time",
    utc: -3.5,
    short: "NST",
    location: ["St. John's (Winter)"],
    lang: ["en_ca"]
  },
  {
    name: "Atlantic Daylight / Argentina Time",
    utc: -3,
    short: "ADT / ART",
    location: ["Santiago (Summer)", "Buenos Aires", "São Paulo"],
    lang: ["es_cl", "es_ar", "pt_br"]
  },
  {
    name: "Newfoundland Daylight Time",
    utc: -2.5,
    short: "NDT",
    location: ["St. John's (Summer)"],
    lang: ["en_ca"]
  },
  {
    name: "South Georgia Time",
    utc: -2,
    short: "GST",
    location: ["South Georgia"],
    lang: ["en_gb"]
  },
  {
    name: "Azores Standard Time",
    utc: -1,
    short: "AZOT",
    location: ["Azores (Winter)"],
    lang: ["pt_pt"]
  },
  {
    name: "Greenwich Mean Time / Azores Summer Time",
    utc: 0,
    short: "GMT / AZOST",
    location: ["London (Winter)", "Reykjavík", "Azores (Summer)"],
    lang: ["en_gb", "is_is", "pt_pt"]
  },
  {
    name: "Central European Time / British Summer Time",
    utc: 1,
    short: "CET / BST",
    location: ["Berlin (Winter)", "Paris (Winter)", "Rome (Winter)", "London (Summer)"],
    lang: [ "de_de", "de_at", "de_ch", "fr_fr", "fr_be", "fr_ch", "it_it", "en_gb"]
  },
  {
    name: "Central European Summer / Eastern European Time",
    utc: 2,
    short: "CEST / EET",
    location: ["Berlin (Summer)", "Paris (Summer)", "Rome (Summer)", "Athens (Winter)", "Cairo (Winter)", "Helsinki (Winter)"],
    lang: ["de_de", "de_at", "de_ch", "fr_fr", "fr_be", "fr_ch", "it_it", "el_gr", "ar_eg", "ar_sa", "fi_fi", "sv_se"]
  },
  {
    name: "Eastern European Summer / Moscow Time",
    utc: 3,
    short: "EEST / MSK",
    location: ["Athens (Summer)", "Cairo (Summer)", "Moscow", "Istanbul"],
    lang: ["el_gr", "ar_eg", "ar_sa", "ru_ru", "ru_ua", "tr_tr"]
  },
  {
    name: "Iran Standard Time",
    utc: 3.5,
    short: "IRST",
    location: ["Tehran (Winter)"],
    lang: ["fa_ir"]
  },
  {
    name: "Iran Daylight Time / Gulf Standard Time",
    utc: 4,
    short: "IRDT / GST",
    location: ["Tehran (Summer)", "Dubai", "Abu Dhabi"],
    lang: ["fa_ir", "ar_ae", "ar_sa"]
  },
  {
    name: "Afghanistan Time",
    utc: 4.5,
    short: "AFT",
    location: ["Kabul"],
    lang: ["ps_af", "fa_ir"]
  },
  {
    name: "Pakistan Standard Time",
    utc: 5,
    short: "PKT",
    location: ["Karachi", "Islamabad"],
    lang: ["en_pk", "ur_pk"]
  },
  {
    name: "India Standard Time",
    utc: 5.5,
    short: "IST",
    location: ["New Delhi", "Mumbai", "Colombo"],
    lang: ["en_in", "hi_in", "si_lk", "ta_in", "ta_lk"]
  },
  {
    name: "Nepal Time",
    utc: 5.75,
    short: "NPT",
    location: ["Kathmandu"],
    lang: ["ne_np"]
  },
  {
    name: "Bangladesh Time",
    utc: 6,
    short: "BST",
    location: ["Dhaka"],
    lang: ["bn_bd"]
  },
  {
    name: "Cocos Islands Time",
    utc: 6.5,
    short: "CCT",
    location: ["Cocos Islands"],
    lang: ["en_au"]
  },
  {
    name: "Indochina Time",
    utc: 7,
    short: "ICT",
    location: ["Bangkok", "Hanoi", "Jakarta"],
    lang: ["th_th", "vi_vn", "id_id"]
  },
  {
    name: "China Standard Time",
    utc: 8,
    short: "CST",
    location: ["Beijing", "Shanghai", "Singapore"],
    lang: ["zh_cn", "en_sg", "ms_sg", "ta_sg"]
  },
  {
    name: "Australian Central Western Time",
    utc: 8.75,
    short: "ACWST",
    location: ["Eucla"],
    lang: ["en_au"]
  },
  {
    name: "Japan Standard Time",
    utc: 9,
    short: "JST",
    location: ["Tokyo", "Seoul"],
    lang: ["ja_jp", "ko_kr"]
  },
  {
    name: "Australian Central Standard Time",
    utc: 9.5,
    short: "ACST",
    location: ["Adelaide", "Darwin"],
    lang: ["en_au"]
  },
  {
    name: "Australian Eastern Standard Time",
    utc: 10,
    short: "AEST",
    location: ["Brisbane", "Melbourne", "Sydney"],
    lang: ["en_au"]
  },
  {
    name: "Lord Howe Standard Time",
    utc: 10.5,
    short: "LHST",
    location: ["Lord Howe Island"],
    lang: ["en_au"]
  },
  {
    name: "Solomon Islands Time",
    utc: 11,
    short: "SBT",
    location: ["Honiara", "New Caledonia"],
    lang: ["en_nz", "fr_nc"]
  },
  {
    name: "New Zealand Standard Time",
    utc: 12,
    short: "NZST",
    location: ["Wellington", "Auckland"],
    lang: ["en_nz", "mi_nz"]
  },
  {
    name: "Chatham Islands Standard Time",
    utc: 12.75,
    short: "CHAST",
    location: ["Chatham Islands"],
    lang: ["en_nz", "mi_nz"]
  },
  {
    name: "Tonga Time",
    utc: 13,
    short: "TOT",
    location: ["Tonga", "Tokelau"],
    lang: ["en_nz", "to_to"]
  },
  {
    name: "Line Islands Time",
    utc: 14,
    short: "LINT",
    location: ["Kiritimati", "Line Islands"],
    lang: ["en_ki", "gil_ki"]
  }
];


const entity_blocklist = [
  {
    id: "agent" // WTF
  },
  {
    id: "area_effect_cloud" // WTF
  },
  {
    id: "armor_stand"
  },
  {
    id: "arrow"
  },
  {
    id: "boat"
  },
  {
    id: "breeze_wind_charge_projectile"
  },
  {
    id: "chest_boat"
  },
  {
    id: "chest_minecart"
  },
  {
    id: "command_block_minecart"
  },
  {
    id: "dragon_fireball"
  },
  {
    id: "egg"
  },
  {
    id: "ender_crystal"
  },
  {
    id: "ender_pearl"
  },
  {
    id: "eye_of_ender_signal"
  },
  {
    id: "fireball"
  },
  {
    id: "fireworks_rocket"
  },
  {
    id: "fishing_hook"
  },
  {
    id: "hopper_minecart"
  },
  {
    id: "lightning_bolt"
  },
  {
    id: "lingering_potion"
  },
  {
    id: "llama_spit"
  },
  {
    id: "minecart"
  },
  {
    id: "npc"
  },
  {
    id: "ominous_item_spawner"
  },
  {
    id: "player" // Technically I could do player as goal but it could result to a soft lock if the selected player leaves... Maybe something for a future update
  },
  {
    id: "shulker_bullet"
  },
  {
    id: "small_fireball"
  },
  {
    id: "snowball"
  },
  {
    id: "splash_potion"
  },
  {
    id: "thrown_trident"
  },
  {
    id: "tnt"
  },
  {
    id: "tnt_minecart"
  },
  {
    id: "tripod_camera" // WTF
  },
  {
    id: "wind_charge_projectile"
  },
  {
    id: "wither_skull"
  },
  {
    id: "wither_skull_dangerous"
  },
  {
    id: "xp_bottle"
  },
  {
    id: "xp_orb"
  },
  {
    id: "zombie_horse" // Have you ever found it in survival?
  },
  // Minecraft still has the V1 Villagers in the code, the ones before 1.14, which you will no longer find because they are all replaced by V2 automatically
  {
    id: "zombie_villager"
  },
  {
    id: "villager"
  },
  // Only available if edu is activated
  {
    id: "balloon"
  },
    {
    id: "ice_bomb"
  }
]

const entity_exceptionlist = {
  evocation_illager: {
    icon: "textures/items/spawn_eggs/spawn_egg_evoker"
  },

  zombie_pigman: {
    icon: "textures/items/spawn_eggs/spawn_egg_zombified_piglin"
  },

  villager_v2: {
    icon: "textures/items/spawn_eggs/spawn_egg_villager"
  },

  zombie_villager_v2: {
    icon: "textures/items/spawn_eggs/spawn_egg_zombie_villager"
  }
}

console.log("Hello from " + version_info.name + " - "+version_info.version+" ("+version_info.build+") - Further debugging is "+ (version_info.release_type == 0? "enabled" : "disabled" ) + " by the version")

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
  Multiple menu v2
-------------------------*/

// Status
let system_privileges = 2

/* This variable contains the status (or permissions) of your add-on:
2 means the system is not active (no other packs found);
1 means the system is acting as a host;
0 means the system is acting as a client;
*/

/*------------------------
 Client (an addon only needs to have the client function to be recognizable)
-------------------------*/

system.afterEvents.scriptEventReceive.subscribe(async event=> {
   if (event.id === "multiple_menu:data" && world.isHardcore) {
    let player = event.sourceEntity, data, scoreboard = world.scoreboard.getObjective("mm_data")

    // Reads data from the scoreboard
    if (scoreboard) {
      try {
        data = JSON.parse(scoreboard.getParticipants()[0].displayName)
      } catch (e) {
        print("Wrong formated data: "+scoreboard.getParticipants()[0]) // Scoreboard IS available but contains garbisch
        world.scoreboard.removeObjective("mm_data")
        return -1
      }
    } else {
      // print("No Scoreboard!")
      return -1 // Scoreboard is not available: happens when an addon has already processed the request e.g. "open main menu"
    }


    // Initializing
    if (data.event == "mm_initializing") {
      scoreboard.removeParticipant(JSON.stringify(data))

      data.data.push({
        uuid: version_info.uuid,
        name: version_info.name,
        icon: "textures/ui/chat_send"
      })

      if (system_privileges == 2) system_privileges = 0;

      // Saves data in to the scoreboard
      scoreboard.setScore(JSON.stringify(data), 1)
    }

    // Will open the main menu of your addon
    if (data.event == "mm_open" && data.data.target == version_info.uuid) {
        main_menu(player);
        world.scoreboard.removeObjective("mm_data")
    }


    // Host Only (which is why system_privileges == 1): Opens the multiple menu, is called by other addons as a back button
    if (data.event == "mm_open" && data.data.target == "main" && system_privileges == 1) {
        multiple_menu(player);
        world.scoreboard.removeObjective("mm_data")
    }
   }
})

/*------------------------
 Host
-------------------------*/

let addon_list; // When initialized properly, it contains the data of all supported add-ons

system.run(() => {
  world.isHardcore? initialize_multiple_menu() : undefined
});

async function initialize_multiple_menu() {
  // This fallback ensures that even if multiple add-ons could act as host, only one of them will be used as the host.
  try {
    world.scoreboard.addObjective("mm_data");
    world.scoreboard.getObjective("mm_data").setScore(JSON.stringify({event: "mm_initializing", data:[]}), 1);

    print("Multiple Menu: Initializing Host");
    system_privileges = 1;
  } catch (e) {
    print("Multiple Menu: Already Initialized");
    return -1;
  }

  // Requests addon information. Look into the Client
  world.getDimension("overworld").runCommand("scriptevent multiple_menu:data");

  await system.waitTicks(2);
  print("Multiple Menu: successfully initialized as Host");

  // Evaluation of the add-on information
  let data = JSON.parse(world.scoreboard.getObjective("mm_data").getParticipants()[0].displayName)
  world.scoreboard.removeObjective("mm_data")

  addon_list = data.data

  if (data.data.length == 1) {
    print("Multiple Menu: no other plugin found");
    system_privileges = 2;
  }
}

function multiple_menu(player) {
  let form = new ActionFormData();
  let actions = [];

  form.title("Multiple menu v.2.0");
  form.body("Select an addon to open it's menu");

  addon_list.forEach((addon) => {
    // Icon
    if (addon.icon) {
      form.button(addon.name, addon.icon);
    }
    // Only Name
    else if (addon.name) {
      form.button(addon.name);
    } else {
      form.button(addon.uuid);
    }

    actions.push(() => {
      world.scoreboard.addObjective("mm_data");
      world.scoreboard.getObjective("mm_data").setScore(JSON.stringify({event: "mm_open", data:{target: addon.uuid}}), 1);
      player.runCommand("scriptevent multiple_menu:data");
    });
  });

  form.divider()
  form.label("Settings")

  form.button("Gestures", "textures/ui/sidebar_icons/emotes");
  actions.push(() => {
    settings_gestures(player)
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

/*------------------------
 Save Data
-------------------------*/


// Creates or Updates Save Data if not present
system.run(() => {
  let save_data = load_save_data();

  const default_save_data_structure = {utc: undefined, utc_auto: true};

  if (!save_data) {
      save_data = [default_save_data_structure];
      print("Creating save_data...");
  } else {
      let data_entry = save_data[0];
      let changes_made = false;

      function merge_defaults(target, defaults) {
          for (const key in defaults) {
              if (defaults.hasOwnProperty(key)) {
                  if (!target.hasOwnProperty(key)) {
                      target[key] = defaults[key];
                      changes_made = true;
                  } else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
                      if (typeof target[key] !== 'object' || target[key] === null || Array.isArray(target[key])) {
                          target[key] = defaults[key];
                          changes_made = true;
                      } else {
                          merge_defaults(target[key], defaults[key]);
                      }
                  }
              }
          }
      }

      merge_defaults(data_entry, default_save_data_structure);
      if (!Array.isArray(save_data) || save_data.length === 0) {
          save_data = [data_entry];
          changes_made = true;
      } else {
          save_data[0] = data_entry;
      }

      if (changes_made) {
          print("Missing save_data attributes found and added.");
      }
  }

  update_save_data(save_data);
})


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
function create_player_save_data(playerId, playerName) {
  let save_data = load_save_data();

  // Define the default structure for a new player's save data
  const default_player_save_data_structure = (is_op_initial) => ({
      id: playerId,
      name: playerName,
      op: is_op_initial, // This will be determined when the player is first added
      last_unix: Math.floor(Date.now() / 1000),
      gesture: { emote: false, sneak: true, nod: true, stick: true },
      command_history: [],
  });

  let player_sd_index = save_data.findIndex(entry => entry.id === playerId);
  let player_data;

  // Helper function to recursively merge default values
  const merge_defaults = (target, defaults) => {
      for (const key in defaults) {
          if (defaults.hasOwnProperty(key)) {
              if (!target.hasOwnProperty(key)) {
                  // Key is missing, add it with default value
                  target[key] = defaults[key];
              } else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
                  // If the default value is an object, recurse into it
                  if (typeof target[key] !== 'object' || target[key] === null || Array.isArray(target[key])) {
                      // If the existing value is not an object or is null/array, replace it with the default structure
                      target[key] = defaults[key];
                      changes_made = true;
                  } else {
                      merge_defaults(target[key], defaults[key]);
                  }
              }
          }
      }
  };

  if (player_sd_index === -1) {
      // Player does not exist, create new entry
      let should_be_op = true;

      for (let entry of save_data) {
          if (entry.op === true) {
              should_be_op = false;
              break;
          }
      }

      print(`Player ${playerName} (${playerId}) added with op=${should_be_op}!`);

      player_data = default_player_save_data_structure(should_be_op);
      save_data.push(player_data);
  } else {
      // Player exists, get their data
      player_data = save_data[player_sd_index];

      // Update player name if it's different
      if (player_data.name !== playerName) {
          player_data.name = playerName;
      }

      const dynamic_default_structure = default_player_save_data_structure(player_data.op);
      merge_defaults(player_data, dynamic_default_structure);

  }

  update_save_data(save_data);
  print(`Save data for player ${playerName} updated.`);
}

world.afterEvents.playerJoin.subscribe(({ playerId, playerName }) => {
  create_player_save_data(playerId, playerName);
})

world.afterEvents.playerSpawn.subscribe(async (eventData) => {
  const { player, initialSpawn } = eventData;
  if (!initialSpawn) return -1
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  await system.waitTicks(40); // Wait for the player to be fully joined

  if (!world.isHardcore) {
    return player.sendMessage("§l§4[§cError§4]§r This world is not a hardcore world! Use the native Chat instead!")
  }

  if (version_info.release_type !== 2 && save_data[player_sd_index].op) {
    player.sendMessage("§l§7[§f" + ("System") + "§7]§r "+ save_data[player_sd_index].name +" how is your experiences with "+ version_info.version +"? Does it meet your expectations? Would you like to change something and if so, what? Do you have a suggestion for a new feature? Share it at §l"+links[0].link)
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
});

/*------------------------
 Open the menu
-------------------------*/

// via. item
world.beforeEvents.itemUse.subscribe(event => {
  const save_data = load_save_data();
  const idx = save_data.findIndex(e => e.id === event.source.id);

  if (event.itemStack.typeId === "minecraft:stick" && save_data[idx].gesture.stick) {
      system.run(() => {
        if (save_data[idx].op && system_privileges !== 0) {
          event.source.playSound("random.pop2")
          system_privileges == 1 ? multiple_menu(event.source) : main_menu(event.source);
        }
      });
  }
});

// via. jump gesture
const gestureCooldowns_jump = new Map();
const gestureState_reset = new Map(); // Speichert, ob Sneak+Jump zurückgesetzt wurden

async function gesture_jump() {
  const now = Date.now();

  for (const player of world.getAllPlayers()) {
    const lastUsed = gestureCooldowns_jump.get(player.id) || 0;
    const state = gestureState_reset.get(player.id) || { reset: true }; // true = darf wieder ausgelöst werden

    const isSneaking = player.isSneaking;
    const isJumping = player.isJumping;

    // Wenn beide false sind, erlauben wir wieder eine Auslösung beim nächsten Mal
    if (!isSneaking && !isJumping) {
      gestureState_reset.set(player.id, { reset: true });
    }

    // Wenn beide true sind UND vorher ein Reset war UND Cooldown abgelaufen
    if (isSneaking && isJumping && state.reset && (now - lastUsed >= 100)) {
      const save_data = load_save_data();
      const idx = save_data.findIndex(e => e.id === player.id);
      if (save_data[idx].gesture.sneak && save_data[idx].op && system_privileges !== 0) {
        player.playSound("random.pop2")
        system_privileges == 1 ? multiple_menu(player) : main_menu(player);
      }

      gestureCooldowns_jump.set(player.id, now);
      gestureState_reset.set(player.id, { reset: false }); // Warten bis beide wieder false sind
      await system.waitTicks(10);
    }
  }
}




// via. emote gesture
const gestureCooldowns_emote = new Map();
const gestureState_reset_emote = new Map(); // Speichert, ob Emote zurückgesetzt wurde

async function gesture_emote() {
  const now = Date.now();

  for (const player of world.getAllPlayers()) {
    const lastUsed = gestureCooldowns_emote.get(player.id) || 0;
    const state = gestureState_reset_emote.get(player.id) || { reset: true };

    const isEmoting = player.isEmoting;

    // Wenn Emoting zwischendurch false ist → Reset erlauben
    if (!isEmoting) {
      gestureState_reset_emote.set(player.id, { reset: true });
    }

    // Wenn Emoting aktiv ist, Reset gesetzt ist und Cooldown abgelaufen ist → Menü öffnen
    if (isEmoting && state.reset && (now - lastUsed >= 100)) {
      const save_data = load_save_data();
      const idx = save_data.findIndex(e => e.id === player.id);
      if (save_data[idx].gesture.emote && save_data[idx].op && system_privileges !== 0) {
        player.playSound("random.pop2")
        system_privileges == 1 ? multiple_menu(player) : main_menu(player);
      }

      gestureCooldowns_emote.set(player.id, now);
      gestureState_reset_emote.set(player.id, { reset: false }); // Bis zum nächsten Emote-Ende blockieren
      await system.waitTicks(10);
    }
  }
}


// via. nod gesture
const playerHeadMovement = new Map();

async function gesture_nod() {
  const now = Date.now();

  for (const player of world.getAllPlayers()) {
    if (player.getGameMode() !== "Spectator") continue;

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
      const save_data = load_save_data();
      const idx = save_data.findIndex(e => e.id === player.id);
      if (save_data[idx].gesture.nod && save_data[idx].op && system_privileges !== 0) {
        player.playSound("random.pop2")
        system_privileges == 1 ? multiple_menu(player) : main_menu(player);
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

function print(input) {
  if (version_info.release_type === 0) {
    console.log(version_info.name + " - " + JSON.stringify(input))
  }
}

/*------------------------
 Time
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
 Internet API
-------------------------*/

async function fetchViaInternetAPI(url, timeoutMs = 20) {
  await system.waitTicks(1); // If mm_host gets initialisiert later

  // Wait until the line (the scoreboard) is free
  let objective = world.scoreboard.getObjective("mm_data");

  if (objective !== undefined) {
    await waitForNoObjective("mm_data");
  }

  world.scoreboard.addObjective("mm_data");
  objective = world.scoreboard.getObjective("mm_data");

  return new Promise((resolve, reject) => {
    try {
      // Payload bauen
      const payload = {
        event: "internet_api",
        data: {
          source: version_info.uuid,
          url: url
        }
      };

      // In Scoreboard schreiben und Event auslösen
      objective.setScore(JSON.stringify(payload), 1);
      world.getDimension("overworld").runCommand("scriptevent multiple_menu:data");

      // State für Cleanup
      let finished = false;
      let timerHandle = null;

      // Helper: safe cleanup (einmalig)
      const cleanup = () => {
        if (finished) return;
        finished = true;
        try { world.scoreboard.removeObjective("mm_data"); } catch (_) {}
        try { system.afterEvents.scriptEventReceive.unsubscribe(subscription); } catch (_) {}
        // Timer stoppen (versuche verschiedene API-Namen)
        try {
          if (timerHandle !== null) {
            if (typeof system.runTimeout === "function") system.runTimeout(timerHandle);
            else if (typeof system.runInterval === "function") system.runInterval(timerHandle);
            else if (typeof clearTimeout === "function") clearTimeout(timerHandle);
            else if (typeof clearInterval === "function") clearInterval(timerHandle);
          }
        } catch (_) {}
      };

      // Subscription für scriptevent
      const subscription = system.afterEvents.scriptEventReceive.subscribe(event => {
        if (event.id !== "multiple_menu:data") return;

        try {
          const board = world.scoreboard.getObjective("mm_data");
          if (!board) {
            // wurde möglicherweise bereits entfernt
            cleanup();
            return reject(new Error("Scoreboard mm_data nicht vorhanden nach Event."));
          }

          const participants = board.getParticipants();
          if (!participants || participants.length === 0) {
            // noch keine Daten — weiterwarten
            return;
          }

          const raw = participants[0].displayName;
          let data;
          try {
            data = JSON.parse(raw);
          } catch (e) {
            cleanup();
            return reject(new Error("Falsches Format im Scoreboard: " + e));
          }

          if (data.event === "internet_api" && data.data && data.data.target === version_info.uuid) {
            try {
              const answer = JSON.parse(data.data.answer);
              cleanup();
              return resolve(answer);
            } catch (e) {
              cleanup();
              return reject(new Error("Antwort konnte nicht als JSON geparst werden: " + e));
            }
          }
          // sonst: nicht für uns bestimmt -> ignorieren
        } catch (e) {
          cleanup();
          return reject(e);
        }
      });

      // Timeout einrichten: system.runTimeout bevorzugen, sonst runInterval-Fallback
      if (typeof system.runTimeout === "function") {
        timerHandle = system.runTimeout(() => {
          if (finished) return;
          cleanup();
          return reject(new Error("Timeout: keine Antwort von der Internet-API innerhalb " + timeoutMs + " ms"));
        }, timeoutMs);
      } else if (typeof system.runInterval === "function") {
        const start = Date.now();
        // poll alle 100ms auf Timeout
        timerHandle = system.runInterval(() => {
          if (finished) return;
          if (Date.now() - start >= timeoutMs) {
            cleanup();
            return reject(new Error("Timeout: keine Antwort von der Internet-API innerhalb " + timeoutMs + " ms"));
          }
        }, 100);
      } else {
        // Kein Timer verfügbar -> sofort aufräumen & Fehler
        cleanup();
        return reject(new Error("Keine Timer-Funktionen verfügbar (kein runTimeout/runInterval)."));
      }

    } catch (err) {
      try { world.scoreboard.removeObjective("mm_data"); } catch (_) {}
      return reject(err);
    }
  });
}

async function waitForNoObjective(name) {
  let obj = world.scoreboard.getObjective(name);
  while (obj) {
    // kleine Pause (z. B. 100ms), um den Server nicht zu blockieren
    await new Promise(resolve => system.runTimeout(resolve, 5)); // 5 Ticks warten
    obj = world.scoreboard.getObjective(name);
  }
}

/*------------------------
 Update data (github)
-------------------------*/

let github_data

system.run(() => {
  update_github_data()
});

async function update_github_data() {
  try {
    fetchViaInternetAPI("https://api.github.com/repos/TheFelixLive/Command2Hardcore/releases")
    .then(result => {
      print("API-Antwort erhalten");

      github_data = result.map(release => {
        const totalDownloads = release.assets?.reduce((sum, asset) => sum + (asset.download_count || 0), 0) || 0;
        return {
          tag: release.tag_name,
          name: release.name,
          prerelease: release.prerelease,
          published_at: release.published_at,
          body: release.body,
          download_count: totalDownloads
        };
      });

    })
    .catch(err => {
      print("Fehler beim Abruf: " + err);
    });

  } catch (e) {
  }
}

function compareVersions(version1, version2) {
  if (!version1 || !version2) return 0;

  // Entfernt 'v.' oder 'V.' am Anfang
  version1 = version1.replace(/^v\./i, '').trim();
  version2 = version2.replace(/^v\./i, '').trim();

  // Extrahiere Beta-Nummer aus "_1" oder " Beta 1"
  function extractBeta(version) {
    const betaMatch = version.match(/^(.*?)\s*(?:_|\sBeta\s*)(\d+)$/i);
    if (betaMatch) {
      return {
        base: betaMatch[1].trim(),
        beta: parseInt(betaMatch[2], 10)
      };
    }
    return {
      base: version,
      beta: null
    };
  }

  const v1 = extractBeta(version1);
  const v2 = extractBeta(version2);

  const v1Parts = v1.base.split('.').map(Number);
  const v2Parts = v2.base.split('.').map(Number);

  // Vergleicht Major, Minor, Patch
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const num1 = v1Parts[i] || 0;
    const num2 = v2Parts[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  // Wenn gleich, vergleiche Beta
  if (v1.beta !== null && v2.beta === null) return -1; // Beta < Vollversion
  if (v1.beta === null && v2.beta !== null) return 1;  // Vollversion > Beta

  if (v1.beta !== null && v2.beta !== null) {
    if (v1.beta > v2.beta) return 1;
    if (v1.beta < v2.beta) return -1;
  }

  return 0;
}

/*------------------------
 Auto Timezone
-------------------------*/

let server_ip, server_utc

system.run(() => {
  update_server_utc()
});

async function update_server_utc() {
  try {
    let response = await fetchViaInternetAPI("https://ipwho.is/?fields=ip,timezone");
    server_ip = response.ip
    server_utc = offsetToDecimal(response.timezone.utc)
  } catch (e) {}

  let save_data = load_save_data()

  if (save_data[0].utc_auto) {
    if (server_utc) {
      save_data[0].utc = server_utc
    } else if (!save_data[0].utc) {
      save_data[0].utc_auto = false
    }

    update_save_data(save_data)
  }
}

function offsetToDecimal(offsetStr) {
    // Prüfe auf das richtige Format (z. B. +02:00 oder -03:30)
    const match = offsetStr.match(/^([+-])(\d{2}):(\d{2})$/);
    if (!match) {
        throw new Error("Ungültiges Format. Erwartet wird z.B. '+02:00' oder '-03:30'");
    }

    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);

    // Umwandlung in Kommazahl (Dezimalstunden)
    const decimal = sign * (hours + minutes / 60);
    return decimal;
}

/*------------------------
 Commands
-------------------------*/

function anyPlayerHasEffect() {
  for (const player of world.getAllPlayers()) {
    for (const effectType of EffectTypes.getAll()) {
      if (player.getEffect(effectType)) {
        return true;
      }
    }
  }
  return false;
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

  // This function is missing because I was not satisfied with the indexing, but the UI is finished, including examples!
  if (version_info.release_type == 0) {
    form.button("Search", "textures/ui/magnifyingGlass")
    actions.push(() => search_menu(player));
    form.divider();
  }

  // Button: Commands

  if (world.isHardcore && save_data[player_sd_index].op) {
    form.button("Run GUI command §9[NEW]", "textures/ui/controller_glyph_color_switch");
    actions.push(() => {
      visual_command(player);
    });

    form.button("Run chat command", "textures/ui/chat_send");
    actions.push(() => {
      command_menu(player);
    });

    form.divider()
    if (save_data[player_sd_index].command_history.length !== 0) {
      form.label("Most recently used commands")
    }

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
        if (save_data[player_sd_index].quick_run) {
          execute_command(player, c.command, false)
        } else {
          command_menu(player, c.command);
        }
      });
    });

    // Show "Show more" button only if there are more than 2 entries in command history
    if (save_data[player_sd_index].command_history.length > 2) {
      form.button("Show more!");
      actions.push(() => {
        command_history_menu(player);
      });
    }

    if (save_data[player_sd_index].command_history.length !== 0) {
      form.divider()
    }
  }

  // Button: Settings
  form.button("Settings", "textures/ui/debug_glyph_color");
  actions.push(() => {
    settings_main(player);
  });

  if (system_privileges !== 2) {
    form.button("");
    actions.push(() => {
      world.scoreboard.addObjective("mm_data");
      world.scoreboard.getObjective("mm_data").setScore(JSON.stringify({event: "mm_open", data:{target: "main"}}), 1);
      player.runCommand("scriptevent multiple_menu:data");
    });
  }

  form.show(player).then((response) => {
    if (response.selection === undefined) {
      return -1;
    }

    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

/*------------------------
 Search
-------------------------*/

function search_menu(player, default_imput) {
  const form = new ModalFormData();
  const save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Search");
  form.textField("What are you looking for?", "e.g. Timezone settings", {tooltip: "Leave it blank to return to the main menu!", defaultValue: default_imput})


  form.show(player).then(response => {
    if (response.canceled) return -1

    let search_imput = response.formValues[0]
    if (search_imput == "") return main_menu(player)

    search_menu_result(player, undefined, search_imput)
  });
}

function search_menu_result(player, search_results, search_term) {
  const form = new ActionFormData();
  const save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
  let actions = []

  // Template

  form.title("Search");
  form.body("3 search results for \""+ search_term+"\"");

  form.divider();

  form.label("Permission - 1")

  form.button(player.name+"\n§o[...] "+search_term+" [...]", save_data[player_sd_index].op? "textures/ui/op" : "textures/ui/permissions_member_star"); // "search_term" here shut be prof rather the actuel term
  actions.push(() => {
    settings_rights_data(player, save_data[player_sd_index])
  });

  form.divider();

  form.label("Settings - 2")

  form.button("Debug\n§o[...] "+search_term+" [...]", "textures/ui/ui_debug_glyph_color");
  actions.push(() => {
    debug_main(player);
  });

  form.button("About", "textures/ui/infobulb");
  actions.push(() => {
    dictionary_about(player, false)
  });

  // Template - End

  form.divider();

  form.button("");
  actions.push(() => search_menu(player, search_term));


  form.show(player).then(response => {
    if (response.selection != null && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

/*------------------------
 Enter Command
-------------------------*/

function command_menu(player, command) {
  let form = new ModalFormData();
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  const playerNames = ["Server", ...world.getAllPlayers().map(p => p.name)];
  if (!playerNames.includes(player.name)) playerNames.unshift(player.name);

  form.title("Command");
  form.textField('Command', 'e.g. /say hallo world!', {defaultValue: command});
  form.dropdown('Execute by', playerNames, {defaultValueIndex: playerNames.indexOf(player.name), tooltip: "If you select other players it will run also at that location.\n§7§oNote: The Server doesn't have some properties!"});

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
      let form = new MessageFormData();
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
        form.button1(matchedBlock.rating === 2 ? "No risk no fun!" : "Try it!");
        actions.push(() => {
          return execute_command(player, cmd, byServer, save_data, player_sd_index);
        });
      }

      form.button2(""); // Cancel
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

function command_history_menu(player) {
  let form = new ActionFormData();
  let actions = [];

  let saveData = load_save_data();
  let playerIndex = saveData.findIndex(entry => entry.id === player.id);

  form.title("Command History");
  form.body("Select a command!");

  // defensiv: ensure history exists
  const history = Array.isArray(saveData[playerIndex].command_history)
    ? saveData[playerIndex].command_history.slice()
    : [];

  // Sort (neueste zuerst)
  let sortedHistory = history.sort((a, b) => b.unix - a.unix);

  const now = Math.floor(Date.now() / 1000);
  const utcOffsetMinutes = Math.round((saveData[0]?.utc || 0) * 60); // default 0 wenn nicht gesetzt

  // Lokalzeit / Mitternacht-Grenzen
  const nowLocal = new Date((now + utcOffsetMinutes * 60) * 1000);
  const midLocal = new Date(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate());
  const todayMid = Math.floor(midLocal.getTime() / 1000);
  const yestMid = todayMid - 24 * 3600;
  const week7Mid = todayMid - 7 * 24 * 3600;

  // English month names
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  let lastGroup = null;

  sortedHistory.forEach(entry => {
    const diffSec = now - entry.unix;

    // Lokale Zeit des Events
    const localUnix = entry.unix + utcOffsetMinutes * 60;
    const date = new Date(localUnix * 1000);

    const year = date.getFullYear();
    const month = date.getMonth();
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Gruppen- und Label-Logik
    let group, label;
    if (diffSec < 3600) {
      label = `${hour}:${String(minute).padStart(2,'0')} o'clock`;
      group = `minute-${hour}-${minute}`;
    } else if (diffSec < 4 * 3600 && localUnix >= todayMid) {
      label = `${hour} o'clock`;
      group = `hour-${hour}`;
    } else if (localUnix >= todayMid && hour < 4) {
      label = "Today Night";       group = "today-night";
    } else if (localUnix >= todayMid && hour < 12) {
      label = "Today Morning";     group = "today-morning";
    } else if (localUnix >= todayMid && hour < 16) {
      label = "Today Noon";        group = "today-noon";
    } else if (localUnix >= todayMid && hour < 20) {
      label = "Today Afternoon";   group = "today-afternoon";
    } else if (localUnix >= todayMid) {
      label = "Today Evening";     group = "today-evening";
    } else if (localUnix >= yestMid) {
      label = "Yesterday";         group = "yesterday";
    } else if (localUnix >= week7Mid) {
      label = "Last days";         group = "last-days";
    } else if (diffSec < 14 * 24 * 3600) {
      label = "Last week";         group = "last-week";
    } else if (year === nowLocal.getFullYear()) {
      label = monthNames[month];   group = `month-${month}`;
    } else {
      label = String(year);        group = `year-${year}`;
    }

    // Label pro Gruppe nur einmal anzeigen
    if (group !== lastGroup && saveData[0].utc) {
      form.label(label);
      lastGroup = group;
    }

    // Button mit Kommando-Infos
    const cmdName = (entry.command || "").split(" ")[0] || entry.command || "(unknown)";
    const statusText = entry.successful ? "§2ran§r" : "§cfailed§r";
    const relativeTime = getRelativeTime(diffSec);

    form.button(`${cmdName}\n${statusText} | ${relativeTime} ago`);
    actions.push(() => {
      if (saveData[playerIndex].quick_run) {
        execute_command(player, entry.command, false);
      } else {
        command_menu(player, entry.command);
      }
    });
  });


  form.button("");
  actions.push(() => main_menu(player));

  form.show(player).then(response => {
    if (response.selection === undefined) return -1;
    if (actions[response.selection]) actions[response.selection]();
  });
}


/*------------------------
 execute Command
-------------------------*/

function execute_command(player, cmd, byServer) {
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  try {
    let result = byServer
      ? world.getDimension("overworld").runCommand(cmd)
      : player.runCommand(cmd);

    const success = result.successCount > 0;

    let existingCommand = save_data[player_sd_index].command_history.find(entry => entry.command === cmd);

    if (existingCommand) {
      existingCommand.successful = success;
      existingCommand.unix = Math.floor(Date.now() / 1000);
    } else {
      save_data[player_sd_index].command_history.push({
        command: cmd,
        successful: success,
        unix: Math.floor(Date.now() / 1000)
      });
    }

    update_save_data(save_data);
    player.sendMessage(success ? "Command executed" : "§cCommand didn't execute");

  } catch (e) {
    let existingCommand = save_data[player_sd_index].command_history.find(entry => entry.command === cmd);

    if (existingCommand) {
      existingCommand.successful = false;
      existingCommand.unix = Math.floor(Date.now() / 1000);
    } else {
      save_data[player_sd_index].command_history.push({
        command: cmd,
        successful: false,
        unix: Math.floor(Date.now() / 1000)
      });
    }

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


/*------------------------
 visual_command
-------------------------*/

function visual_command(player) {
  let form = new ActionFormData();
  let actions = [];

  form.title("Visual commands");
  form.body("Select a command!");


  form.button("Enchant", "textures/items/book_enchanted");
  actions.push(() => visual_command_enchant(player));

  form.button("Effect", "textures/ui/absorption_effect");
  if (anyPlayerHasEffect()) {
      actions.push(() => visual_command_effect_select(player));
    } else {
      actions.push(() => visual_command_effect_add(player));
    }

  form.button("Summon", "textures/items/spawn_eggs/spawn_egg_agent");
  actions.push(() => all_EntityTypes(player));

  form.button("Time", "textures/items/clock_item");
  actions.push(() => visual_command_time(player));

  form.button("Weather", "textures/ui/cloud_only_storage");
  actions.push(() => visual_command_weather(player));

  form.divider()
  form.button("");
  actions.push(() => main_menu(player));

  form.show(player).then((response) => {
    if (response.selection === undefined) {
      return -1;
    }

    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });

}

/*------------------------
 visual_command: Enchant
-------------------------*/

function visual_command_enchant(player) {
  let form = new ActionFormData()
  let actions = []

  form.title("Visual commands - enchant");
  form.body("Select a type!");

  //form.divider()
  form.button("");
  actions.push(() => {
    return visual_command(player)
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
 visual_command: Effect
-------------------------*/

function visual_command_effect_select(player) {
  let form = new ActionFormData()
  let actions = []

  form.title("Visual commands - effect");
  form.body("Select a type!");


  form.button("Add an effect", "textures/ui/color_plus");
  actions.push(() => {
    return visual_command_effect_add(player)
  });

  form.button("Clear an effect", "textures/blocks/barrier");
  actions.push(() => {
    return visual_command_effect_clear_player(player)
  });

  form.divider()
  form.button("");
  actions.push(() => {
    return visual_command(player)
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

function visual_command_effect_clear_player(player) {
  let form = new ActionFormData()
  let actions = []

  form.title("Visual commands - effect");
  form.body("Select your target!");


  if (world.getAllPlayers().length === 1) {
    return visual_command_effect_clear_config(player, world.getAllPlayers()[0]);
  }

  for (const player of world.getAllPlayers()) {
    for (const effectType of EffectTypes.getAll()) {
      if (player.getEffect(effectType)) {
        form.button(player.name, "textures/ui/lan_icon");
        actions.push(() => {
          return visual_command_effect_clear_config(player, )
        });
      }
    }
  }

  form.divider()
  form.button("");
  actions.push(() => {
    return visual_command_effect_select(player)
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

function visual_command_effect_clear_config(player, target) {
  let form = new ActionFormData();
  const save_data = load_save_data();
  const player_sd_index = save_data.findIndex(e => e.id === player.id);
  let actions = [];

  form.title("Visual commands - effect");
  form.body("Select the effect you want to clear from " + target.name + "!");

  if (EffectTypes.getAll().filter(e => target.getEffect(e)).length == 1) {
    const command = `/effect "${target.name}" clear`;

    return save_data[player_sd_index].quick_run
      ? execute_command(player, command, false)
      : command_menu(player, command);
  }

  if (EffectTypes.getAll().filter(e => target.getEffect(e)).length > 1) {
    form.button("All effects", "textures/ui/store_sort_icon");
    actions.push(() => {
      const command = `/effect "${target.name}" clear`;

      save_data[player_sd_index].quick_run
        ? execute_command(player, command, false)
        : command_menu(player, command);
    });
    form.divider();
  }

  // Nur Effekte anzeigen, die der Target-Spieler auch wirklich hat
  EffectTypes.getAll()
    .filter(e => target.getEffect(e)) // <-- Nur aktive Effekte
    .sort((a, b) => a.getName().localeCompare(b.getName()))
    .forEach(e => {
      const id = e.getName().replace(/^minecraft:/, "");

      let icon;
      if (id !== "saturation" && id !== "instant_damage" && id !== "instant_health" && id !== "fatal_poison") {
        icon = "textures/ui/" + id + "_effect";
      }

      if (icon) {
        form.button(id, icon);
      } else {
        form.button(id);
      }

      actions.push(() => {
        const command = `/effect "${target.name}" clear ${id}`;

        save_data[player_sd_index].quick_run
          ? execute_command(player, command, false)
          : command_menu(player, command);
      });
  });

  form.divider();
  form.button(""); // Zurück-Button
  actions.push(() => visual_command_effect_select(player));

  form.show(player).then((response) => {
    if (response.selection === undefined) return -1;
    if (actions[response.selection]) actions[response.selection]();
  });
}

function visual_command_effect_add(player) {
  let form = new ActionFormData()
  let actions = []

  form.title("Visual commands - effect");
  form.body("Select an effect!");

  EffectTypes.getAll()
  .sort((a, b) => a.getName().localeCompare(b.getName()))
  .forEach(e => {

    const id = e.getName().replace(/^minecraft:/, "");

    let icon;
    if (id !== "empty" && id !== "saturation" && id !== "instant_damage" && id !== "instant_health" && id !== "fatal_poison") icon = "textures/ui/" + id + "_effect";

    if (id !== "empty") {
      if (icon) {
        form.button(id, icon);
      } else {
        form.button(id);
      }
      actions.push(() => visual_command_effect_config(player, id));
    }
  });

  form.divider()
  form.button("");
  actions.push(() => {
    if (anyPlayerHasEffect()) {
      return visual_command_effect_select(player)
    }
    return visual_command(player)
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

function visual_command_effect_config(player, id) {
  const form = new ModalFormData();
  const save_data = load_save_data();
  const player_sd_index = save_data.findIndex(e => e.id === player.id);
  form.title(id + " - config");

  const allPlayers = world.getAllPlayers();
  const playerNames = allPlayers.map(p => p.name);
  if (playerNames.length !== 1) {
    if (!playerNames.includes(player.name)) playerNames.unshift(player.name);
    form.dropdown('Target', playerNames, {
      defaultValueIndex: playerNames.indexOf(player.name)
    });
  }

  form.slider("Effect Level", 0, 255);
  form.slider("Duration (s)", 0, 999, { defaultValue: 20 });
  form.toggle("Disable Duration", { tooltip: "Sets the duration to infinity" });
  form.toggle("Hide Effect Particle", { defaultValue: true });

  form.show(player).then(resp => {
    if (!resp.formValues) return -1;

    let index = 0;
    const targetName = (playerNames.length !== 1)
      ? playerNames[resp.formValues[index++]]
      : player.name;

    const effectLevel = resp.formValues[index++];
    const duration = resp.formValues[index++];
    const disableDuration = resp.formValues[index++];
    const hideParticles = resp.formValues[index++];

    const durationValue = disableDuration ? "infinite" : duration;
    const hideFlag = hideParticles ? "true" : "false";

    const command = `/effect "${targetName}" ${id} ${durationValue} ${effectLevel} ${hideFlag}`;

    save_data[player_sd_index].quick_run
      ? execute_command(player, command, false)
      : command_menu(player, command);
    });

}

/*------------------------
 visual_command: Entity
-------------------------*/

function all_EntityTypes(player) {
  let form = new ActionFormData()
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
  let actions = []

  form.title("Visual commands - summon");
  form.body("What do you want to spawn?");

  EntityTypes.getAll()
  .sort((a, b) => a.id.localeCompare(b.id))
  .forEach(e => {

    const id = e.id.replace(/^minecraft:/, "");

    // Deletes all entries that are on the blocklist!
    if (!entity_blocklist.find(entity => entity.id == id)) {
      let icon = "textures/items/spawn_eggs/spawn_egg_" + id;

      if (entity_exceptionlist[id]) {
        icon = entity_exceptionlist[id].icon;
      }

      form.button({ rawtext: [{ translate: "entity." + id + ".name" }]}, icon);

      actions.push(() => save_data[player_sd_index].quick_run
        ? execute_command(player, "summon " + id, false)
        : command_menu(player, "summon " + id)
      );
    }
  });

  form.divider()
  form.button("");
  actions.push(() => {
    return visual_command(player)
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
 visual_command: Time
-------------------------*/

function visual_command_time(player) {
  const form = new ActionFormData();
  const actions = [];
  const saveData = load_save_data();
  const idx = saveData.findIndex(e => e.id === player.id);
  form.title("Visual commands - time");
  form.body("What's the time again?");

  // Define all weather options in one place
  [
    { label: "Midnight\n§90:00 o'clock",    icon: "textures/ui/time_6midnight", cmd: "/time set 18000" },
    { label: "Sunrise\n§e6:00 o'clock",    icon: "textures/ui/time_1sunrise",        cmd: "/time set 0"   },
    { label: "Day\n§b8:00 o'clock",             icon: "textures/ui/time_2day",         cmd: "/time set 1000"    },
    { label: "Noon\n§b12:00 o'clock",    icon: "textures/ui/time_3noon", cmd: "/time set 6000" },
    { label: "Sunset\n§e18:00 o'clock",    icon: "textures/ui/time_4sunset", cmd: "/time set 12000" },
    { label: "Night\n§919:00 o'clock",    icon: "textures/ui/time_5night", cmd: "/time set 13000" }
  ].forEach(opt => {
    form.button(opt.label, opt.icon);
    actions.push(() => saveData[idx].quick_run
      ? execute_command(player, opt.cmd, false)
      : command_menu(player, opt.cmd)
    );
  });

  // Back button
  form.divider()
  form.button("");
  actions.push(() => visual_command(player));

  form.show(player).then(resp => {
    if (resp.selection != null && actions[resp.selection]) {
      actions[resp.selection]();
    }
  });
}

/*------------------------
 visual_command: wheather
-------------------------*/

function visual_command_weather(player) {
  const form = new ActionFormData();
  const actions = [];
  const saveData = load_save_data();
  const idx = saveData.findIndex(e => e.id === player.id);
  form.title("Visual commands - weather");
  form.body("What will the weather be like?");

  // Define all weather options in one place
  [
    { label: "Sunny (clear)",    icon: "textures/ui/weather_clear",        cmd: "/weather clear"   },
    { label: "Rain",             icon: "textures/ui/weather_rain",         cmd: "/weather rain"    },
    { label: "Thunderstorms",    icon: "textures/ui/weather_thunderstorm", cmd: "/weather thunder" }
  ].forEach(opt => {
    form.button(opt.label, opt.icon);
    actions.push(() => saveData[idx].quick_run
      ? execute_command(player, opt.cmd, false)
      : command_menu(player, opt.cmd)
    );
  });

  // Back button
  form.divider()
  form.button("");
  actions.push(() => visual_command(player));

  form.show(player).then(resp => {
    if (resp.selection != null && actions[resp.selection]) {
      actions[resp.selection]();
    }
  });
}


/*------------------------
 Settings
-------------------------*/

function settings_main(player) {
  let form = new ActionFormData();
  let actions = [];
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Settings");
  form.body("Your self");

  // Button 2: Quick run
  form.button("Quick run\n" + (save_data[player_sd_index].quick_run ? "§aon" : "§coff"), (save_data[player_sd_index].quick_run ? "textures/ui/sprint_pressed" : "textures/ui/sprint"));
  actions.push(() => {
    if (!save_data[player_sd_index].quick_run) {
      save_data[player_sd_index].quick_run = true;
    } else {
      save_data[player_sd_index].quick_run = false;
    }
    update_save_data(save_data);
    settings_main(player);
  });

  // Button 3: Gestures
  if (system_privileges == 2) {
    form.button("Gestures", "textures/ui/sidebar_icons/emotes");
    actions.push(() => {
      settings_gestures(player)
    });
  }

  form.divider()

  // Button 1: Permission
  if (save_data[player_sd_index].op) {
    form.label("Multiplayer");

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

  // Button 4: UTC
  if (save_data[player_sd_index].op == true) {
      let zone = timezone_list.find(zone => zone.utc === save_data[0].utc), zone_text;

      if (!zone) {
        if (zone !== undefined) {
          zone = timezone_list.reduce((closest, current) => {
            const currentDiff = Math.abs(current.utc - save_data[0].utc);
            const closestDiff = Math.abs(closest.utc - save_data[0].utc);
            return currentDiff < closestDiff ? current : closest;
          });
          zone_text = "Prob. " + ("Prob. "+ zone.name.length > 30 ? zone.short : zone.name)
        }
      } else {
        zone_text = zone.name.length > 30 ? zone.short : zone.name
      }


    form.button(("Time zone") + (zone !== undefined? "\n§9"+zone_text : ""), "textures/ui/world_glyph_color_2x")
    actions.push(() => {
      if (save_data[0].utc_auto) return settings_time_zone_preview(player, zone)
      settings_time_zone(player, 0);
    });
    form.divider()
  }


  form.label("Version");

  // Button 5: Debug
  if (version_info.release_type == 0 && save_data[player_sd_index].op) {
    form.button("Debug\n", "textures/ui/ui_debug_glyph_color");
    actions.push(() => {
      debug_main(player);
    });
  }

  // Button 6: Dictionary
  form.button("About\n" + (github_data? (compareVersions(version_info.release_type === 2 ? github_data.find(r => !r.prerelease)?.tag : github_data[0]?.tag, version_info.version) !== 1? "" : "§9Update available!"): ""), "textures/ui/infobulb");
  actions.push(() => {
    dictionary_about(player, false)
  });

  form.divider()

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
 time_zone
-------------------------*/

function settings_time_zone(player, viewing_mode) {
  const form = new ActionFormData();
  const actions = [];
  const save_data = load_save_data();
  const now = new Date();

  let current_utc = save_data[0].utc;

  if (current_utc === undefined) {
    viewing_mode = 3;
  }

  form.body("Select your current time zone!").title("Time zone");

  const current_zone_index = timezone_list.findIndex(z => z.utc === current_utc)
    ?? timezone_list.reduce((closest, zone, i) =>
         Math.abs(zone.utc - current_utc) < Math.abs(timezone_list[closest].utc - current_utc) ? i : closest, 0);


  const renderZoneButton = (zone, index, switch_to_auto) => {
    const offsetMinutes = zone.utc * 60;

    // UTC-Zeit in Minuten seit Mitternacht
    const utcTotalMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

    // Lokale Zeit berechnen (immer positiv mit Modulo 1440)
    const totalMinutes = (utcTotalMinutes + offsetMinutes + 1440) % 1440;

    // Stunden und Minuten extrahieren
    const localHours = Math.floor(totalMinutes / 60);
    const localMinutes = totalMinutes % 60;

    // Funktion zur zweistelligen Formatierung
    const pad = (n) => n.toString().padStart(2, '0');

    // Zeitformatierung mit Farben je nach Tageszeit
    const getTimeFormat = (minutes) => {
      const timeString = `${pad(localHours)}:${pad(localMinutes)} o'clock`;

      if (minutes < 270) return "§9" + timeString;      // 00:00–04:30
      if (minutes < 360) return "§e" + timeString;      // 04:30–06:00
      if (minutes < 1020) return "§b" + timeString;     // 06:00–17:00
      if (minutes < 1140) return "§e" + timeString;     // 17:00–19:00
      return "§9" + timeString;                         // 19:00–00:00
    };

    // Name oder Kurzform je nach Länge
    const label = (switch_to_auto? "Automatically ("+zone.short+")" : (zone.name.length > 28 ? zone.short : zone.name)) + "\n" + getTimeFormat(totalMinutes);
    const getTimeIcon = (minutes) => {
      if (minutes < 270) return "textures/ui/time_6midnight";        // 00:00–04:30
      if (minutes < 360) return "textures/ui/time_1sunrise";         // 04:30–06:00
      if (minutes < 720) return "textures/ui/time_2day";             // 06:00–12:00
      if (minutes < 1020) return "textures/ui/time_3noon";           // 12:00–17:00
      if (minutes < 1140) return "textures/ui/time_4sunset";         // 17:00–19:00
      return "textures/ui/time_5night";                              // 19:00–00:00
    };

    const icon = index === current_zone_index
      ? "textures/ui/realms_slot_check"
      : getTimeIcon(totalMinutes);

    form.button(label, icon);

    actions.push(() => {
      if (switch_to_auto) {
        settings_time_zone_preview(player, zone, true, viewing_mode);
      } else if (icon === "textures/ui/realms_slot_check") {
        save_data.forEach(entry => {
          if (entry.time_source === 1) {
            entry.time_source = 0;
          }
        });
        save_data[0].utc = undefined;
        update_save_data(save_data);
        settings_time_zone(player);
      } else {
        settings_time_zone_preview(player, zone, false, viewing_mode);
      }
    });
  };




  const navButton = (label, icon, mode) => {
    form.button(label, icon);
    actions.push(() => settings_time_zone(player, mode));
  };

  const autoButton = () => {
    renderZoneButton(timezone_list.find(zone => zone.utc === server_utc), undefined, true)
  };

  const renderZones = (filterFn) => {
    timezone_list.forEach((zone, i) => {
      if (filterFn(i)) renderZoneButton(zone, i);
    });
  };

  if (viewing_mode === 0) {
    let start = Math.max(0, current_zone_index - 2);
    let end = Math.min(timezone_list.length - 1, current_zone_index + 2);

    if (start > 0) navButton("Show previous time zones", "textures/ui/up_arrow", 1);
    form.divider();
    for (let i = start; i <= end; i++) renderZoneButton(timezone_list[i], i);
    form.divider();
    if (end < timezone_list.length - 1) navButton("Show later time zones", "textures/ui/down_arrow", 2);
  } else {
    if (server_utc) {autoButton(); form.divider();}
    if (viewing_mode === 1) navButton("Show less", "textures/ui/down_arrow", 0);
    if (viewing_mode === 2 && current_zone_index !== 0) {navButton("Show previous time zones", "textures/ui/up_arrow", 3); form.divider();}
    if (viewing_mode === 3 && current_utc !== undefined) {navButton("Show less", "textures/ui/down_arrow", 2);}

    renderZones(i =>
      viewing_mode === 3 ||
      (viewing_mode === 1 && i <= current_zone_index) ||
      (viewing_mode === 2 && i >= current_zone_index)
    );

    if (viewing_mode === 1 && current_zone_index !== timezone_list.length) {form.divider(); navButton("Show later time zones", "textures/ui/down_arrow", 3);}
    if (viewing_mode === 2) {navButton("Show less", "textures/ui/up_arrow", 0)}
    if (viewing_mode === 3 && current_utc !== undefined) {navButton("Show less", "textures/ui/up_arrow", 1)}
    if (viewing_mode === 3 && current_utc == undefined) form.divider();
  }

  form.button("");
  actions.push(() => {
    settings_main(player);
  });

  form.show(player).then(res => {
    if (res.selection === undefined) {
      return -1
    } else {
      actions[res.selection]?.();
    }
  });
}

function settings_time_zone_preview (player, zone, switch_to_auto, viewing_mode) {
  const save_data = load_save_data();
  let form = new MessageFormData();
  const now = new Date();

  const offsetMinutes = zone.utc * 60;

  // UTC-Zeit in Minuten seit Mitternacht
  const utcTotalMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  // Lokale Zeit berechnen (immer positiv mit Modulo 1440)
  const totalMinutes = (utcTotalMinutes + offsetMinutes + 1440) % 1440;

  // Stunden und Minuten extrahieren
  const localHours = Math.floor(totalMinutes / 60);
  const localMinutes = totalMinutes % 60;

  // Funktion zur zweistelligen Formatierung
  const pad = (n) => n.toString().padStart(2, '0');

  // Zeitformatierung mit Farben je nach Tageszeit
  const getTimeFormat = (minutes) => {
    const timeString = `${pad(localHours)}:${pad(localMinutes)} o'clock`;

    if (minutes < 270) return "§9" + timeString;      // 00:00–04:30
    if (minutes < 360) return "§e" + timeString;      // 04:30–06:00
    if (minutes < 1020) return "§b" + timeString;     // 06:00–17:00
    if (minutes < 1140) return "§e" + timeString;     // 17:00–19:00
    return "§9" + timeString;                         // 19:00–00:00
  };


  form.title("Time zone");
  let subtitle = save_data[0].utc_auto? "Do you want to manually overwrite this time zone?" : "Do you want to use this time zone?"
  form.body(
    "Time zone: " + zone.name +
    "\nUTC: "+ (zone.utc >= 0 ? "+" : "") + zone.utc +
    "\nTime: " + getTimeFormat(totalMinutes) +
    "§r\nLocation: " + zone.location.join(", ") +
    "\n\n"+ subtitle +"\n "
  )

  form.button1(save_data[0].utc_auto? "Choose manually" : "Switch to " +zone.short);
  form.button2("");

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection == 0) {
      // Disable UTC auto
      if (save_data[0].utc_auto) {
        save_data[0].utc_auto = false
        save_data[0].utc = undefined
        update_save_data(save_data);
        return settings_time_zone(player, 0);

      // Enable UTC auto
      } else if (switch_to_auto) {
        save_data[0].utc_auto = true
        save_data[0].utc = server_utc
        update_save_data(save_data);
        return settings_main(player);

      } else {
        // Save manuall UTC
        save_data[0].utc = zone.utc;
        update_save_data(save_data);
        return settings_main(player);
      }
    }
    return save_data[0].utc_auto? settings_main(player) : settings_time_zone(player, viewing_mode)
  });

}

/*------------------------
 Gestures
-------------------------*/

function settings_gestures(player) {
  const form = new ActionFormData();
  const save_data = load_save_data();
  const idx = save_data.findIndex(e => e.id === player.id);
  const playerGestures = save_data[idx].gesture;
  let actions = [];

  const configured_gestures = {
    emote:    ["su","a","c"],
    sneak:    ["su","a","c"],
    nod:      ["sp"],
    stick:    ["su","a","c"]
  };

  form.title("Gestures");
  form.body("Choose your own configuration of how the menu should open!");

  const available = Object.keys(configured_gestures);

  // Hilfsfunktion für Großschreibung
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Zähle für jeden Modus (su, a, c, sp) wie viele Gesten aktiv sind
  const modeCounts = {
    su: 0, a: 0, c: 0, sp: 0
  };

  available.forEach(gesture => {
    if (playerGestures[gesture]) {
      configured_gestures[gesture].forEach(mode => {
        modeCounts[mode]++;
      });
    }
  });

  available.forEach(gesture => {
    const isOn = playerGestures[gesture];
    let label = `${capitalize(gesture)}\n${isOn ? "§aon" : "§coff"}`;
    let icon = isOn ? "textures/ui/toggle_on" : "textures/ui/toggle_off";
    let alwaysActive = false;

    // Wenn diese Geste aktiv ist und in einem Modus die einzige aktive Geste ist → restricted
    const restricted = isOn && configured_gestures[gesture].some(mode => modeCounts[mode] === 1);
    if (restricted) {
      label = `${capitalize(gesture)}\n§orestricted`;
      icon = "textures/ui/hammer_l_disabled";
      alwaysActive = true;
    }

    form.button(label, icon);

    actions.push(() => {
      if (!alwaysActive) {
        playerGestures[gesture] = !playerGestures[gesture];
        update_save_data(save_data);
      }
      settings_gestures(player);
    });
  });

  form.divider()
  form.button("");
  actions.push(() => {
    if (system_privileges == 2) {
      settings_main(player);
    } else {
      player.runCommand("scriptevent multiple_menu:open_main");
    }
  });

  form.show(player).then(response => {
    if (response.selection === undefined) {
      return -1
    }
    const sel = response.selection;
    if (typeof actions[sel] === "function") actions[sel]();
  });
}

/*------------------------
 Dictionary
-------------------------*/

function dictionary_about(player, show_ip) {
  let form = new ActionFormData()
  let actions = []

  let save_data = load_save_data()
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  let build_date = convertUnixToDate(version_info.unix, save_data[0].utc || 0);
  form.title("About")

  form.body("§lGeneral")
  form.label(
    "Name: " + version_info.name+ "\n"+
    "UUID: "+ version_info.uuid+
    (show_ip? "\n"+ "Public IP: "+server_ip : "")
  )

  form.label("§lVersion")
  form.label(
    "Version: " + version_info.version + "\n" +
    "Build: " + version_info.build + "\n" +
    "Release type: " + ["dev", "preview", "stable"][version_info.release_type] + "\n" +
    "Build date: " + (
      save_data[0].utc === undefined
        ? getRelativeTime(Math.floor(Date.now() / 1000) - version_info.unix, player) + " ago\n\n§7Note: Set the time zone to see detailed information"
        : `${build_date.day}.${build_date.month}.${build_date.year} ${build_date.hours}:${build_date.minutes}:${build_date.seconds} (UTC${build_date.utcOffset >= 0 ? '+' : ''}${build_date.utcOffset})`
    ) + "\n" +
    "Status: " + (github_data? (compareVersions((version_info.release_type === 2 ? github_data.find(r => !r.prerelease)?.tag : github_data[0]?.tag), version_info.version) !== 1? "§aLatest version" : "§6Update available!"): "§cFailed to fetch!")
  );

  form.label("§7© "+ (build_date.year > 2025 ? "2025 - " + build_date.year : build_date.year ) + " TheFelixLive. Licensed under the MIT License.")

  if (!show_ip && server_ip && save_data[player_sd_index].op) {
    form.button("Show Public IP");
    actions.push(() => {
      dictionary_about(player, true)
    });
    form.divider()
  }

  if (version_info.changelog.new_features.length > 0 || version_info.changelog.general_changes.length > 0 || version_info.changelog.bug_fixes.length > 0) {
    form.button("§9Changelog"+(github_data?"s":""));
    actions.push(() => {
      github_data? dictionary_about_changelog(player) : dictionary_about_changelog_legacy(player, build_date)
    });
  }

  form.button("§3Contact");
  actions.push(() => {
    dictionary_contact(player, build_date)
  });

  form.divider()
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

function dictionary_about_changelog(player) {
  const form = new ActionFormData();
  let save_data = load_save_data()
  const actions = [];

  // ---- 1) Hilfsdaten ----------------------------------------------------
  const installed   = version_info.version;        // z.B. "v1.5.0"
  const buildName   = version_info.build;          // z.B. "B123"
  const installDate = version_info.unix;           // z.B. "1700000000"

  // ---- 3) Neue Instanzen finden -----------------------------------------
  const latest_stable = github_data.find(r => !r.prerelease);
  let   latest_beta   = github_data.find(r => r.prerelease);

  // ---- 4) Beta-Versions-Filter (nach release_type) --------------------
  if (version_info.release_type === 2) { // „nur Beta zulassen“
    if (latest_beta && latest_stable) {
      const isBetaNewer = compareVersions(latest_beta.name, latest_stable.name) > 0;
      if (isBetaNewer) {
        // Nur die neueste Beta behalten
        github_data = github_data.filter(r => r === latest_beta || !r.prerelease);
      } else {
        // Stable neuer oder gleich → Betas entfernen
        github_data = github_data.filter(r => !r.prerelease);
        latest_beta = undefined;
      }
    } else {
      // Sicherheit: Alle Betas entfernen
      github_data = github_data.filter(r => !r.prerelease);
      latest_beta = undefined;
    }
  } else {
    // Wenn Stable neuer als Beta ist → Beta Label unterdrücken
    if (latest_beta && latest_stable) {
      const isStableNewer = compareVersions(latest_stable.name, latest_beta.name) > 0;
      if (isStableNewer) {
        latest_beta = undefined; // Kein Beta-Label später anzeigen
      }
    }
  }


  // ---- 5) Alle Einträge, inkl. eventuell fehlenden Installations‑Eintrag --
  const allData = [...github_data];

  // Prüfen, ob die installierte Version überhaupt in der Liste vorkommt
  const isInstalledListed = github_data.some(r => r.name === installed);
  if (!isInstalledListed) {
    // Dummy‑Objekt – so sieht es aus wie ein reguläres GitHub‑Release
    allData.push({
      name:        installed,
      published_at: installDate,
      prerelease:  false,          // wichtig, damit das Label nicht „(latest beta)“ bekommt
    });
  }

  // Sortieren (nach Version)
  allData.sort((a, b) => compareVersions(b.name, a.name));

  // ---- 6) UI bauen ----------------------------------------------------
  form.title("About");
  form.body("Select a version");

  allData.forEach(r => {
    // Prüfen, ob r.published_at schon Unix-Sekunden ist
    const publishedUnix = (typeof r.published_at === 'number' && r.published_at < 1e12)
      ? r.published_at // schon in Sekunden
      : Math.floor(new Date(r.published_at).getTime() / 1000); // in Sekunden umrechnen

    let label;
    let build_date = convertUnixToDate(publishedUnix, save_data[0].utc || 0);

    let build_text = (
      save_data[0].utc === undefined
        ? getRelativeTime(Math.floor(Date.now() / 1000) - publishedUnix, player) + " ago"
        : `${build_date.day}.${build_date.month}.${build_date.year}`
    );

    if (r === latest_beta && r.name === installed) {
      label = `${r.name} (${buildName})\n${build_text} §9(latest beta)`;
    } else {
      label = `${r.name}\n${build_text}`;

      if (r === latest_stable) {
        label += ' §a(latest version)';
      } else if (r === latest_beta) {
        label += ' §9(latest beta)';
      } else if (r.name === installed) {
        label += ' §6(installed version)';
      }
    }

    form.button(label);

    actions.push(() => {
      dictionary_about_changelog_view(player, r);
    });
  });


  // ---- 7) Footer‑Button -------------------------------------------------
  form.divider();
  form.button("");
  actions.push(() => {
    dictionary_about(player);
  });

  // ---- 8) Anzeigen -----------------------------------------------------
  form.show(player).then(response => {
    if (response.selection === undefined) return;
    if (actions[response.selection]) actions[response.selection]();
  });
}

function dictionary_about_changelog_view(player, version) {
  let save_data = load_save_data()
  const publishedUnix = (typeof version.published_at === 'number' && version.published_at < 1e12)
  ? version.published_at // schon in Sekunden
  : Math.floor(new Date(version.published_at).getTime() / 1000);

  let build_date = convertUnixToDate(publishedUnix, save_data[0].utc || 0);

  if (version.name == version_info.version) return dictionary_about_changelog_legacy(player, build_date)
  const form = new ActionFormData().title("Changelog - " + version.name);

  // TODO: Markdown support
  form.body(version.body)


  const dateStr = `${build_date.day}.${build_date.month}.${build_date.year}`;
  const relative = getRelativeTime(Math.floor(Date.now() / 1000) - publishedUnix);
  form.label(`§7As of ${dateStr} (${relative} ago)`);
  form.button("");

  form.show(player).then(res => {
    if (res.selection === 0) dictionary_about_changelog(player);
  });
}

function dictionary_about_changelog_legacy(player, build_date) {
  const { new_features, general_changes, bug_fixes } = version_info.changelog;
  const { unix } = version_info
  const sections = [
    { title: "§l§bNew Features§r", items: new_features },
    { title: "§l§aGeneral Changes§r", items: general_changes },
    { title: "§l§cBug Fixes§r", items: bug_fixes }
  ];

  const form = new ActionFormData().title("Changelog - " + version_info.version);

  let bodySet = false;
  for (let i = 0; i < sections.length; i++) {
    const { title, items } = sections[i];
    if (items.length === 0) continue;

    const content = title + "\n\n" + items.map(i => `- ${i}`).join("\n\n");

    if (!bodySet) {
      form.body(content);
      bodySet = true;
    } else {
      form.label(content);
    }

    // Add divider if there's at least one more section with items
    if (sections.slice(i + 1).some(s => s.items.length > 0)) {
      form.divider();
    }
  }

  const dateStr = `${build_date.day}.${build_date.month}.${build_date.year}`;
  const relative = getRelativeTime(Math.floor(Date.now() / 1000) - unix);
  form.label(`§7As of ${dateStr} (${relative} ago)`);
  form.button("");

  form.show(player).then(res => {
    if (res.selection === 0) github_data? dictionary_about_changelog(player) : dictionary_about(player);
  });
}

function dictionary_contact(player) {
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
  form.body("If you need want to report a bug, need help, or have suggestions to improvements to the project, you can reach me via these platforms:\n");

  for (const entry of links) {
    if (entry !== links[0]) form.divider()
    form.label(`${entry.name}\n${entry.link}`);
  }

  if (save_data[player_sd_index].op) {
    form.button("Dump SD" + (version_info.release_type !== 2? "\nvia. privat chat" : ""));
    actions.push(() => {
      player.sendMessage("§l§7[§f"+ ("System") + "§7]§r SD Dump:\n"+JSON.stringify(save_data))
    });

    if (version_info.release_type !== 2) {
      form.button("Dump SD\nvia. server console");
      actions.push(() => {
        print(JSON.stringify(save_data))
      });
    }
  }
  form.divider()
  form.button("");
  actions.push(() => {
    dictionary_about(player)
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
 Debug
-------------------------*/


function debug_main(player) {
  let form = new ActionFormData()
  let actions = []
  let save_data = load_save_data()
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.body("DynamicPropertyTotalByteCount: "+world.getDynamicPropertyTotalByteCount() +" of 32767 bytes used ("+Math.floor((world.getDynamicPropertyTotalByteCount()/32767)*100) +" Procent)")


  form.button("§e\"save_data\" Editor");
  actions.push(() => {
    debug_sd_editor(player, () => debug_main(player), [])
  });


  form.button("§aAdd player (save data)");
  actions.push(() => {
    return debug_add_fake_player(player);
  });

  form.button("§cRemove \"save_data\"");
  actions.push(() => {
    world.setDynamicProperty("com2hard:save_data", undefined);
    return close_world()
  });


  form.button("§cClose Server");
  actions.push(() => {
    return close_world()
  });

  form.divider()
  form.button("");
  actions.push(() => {
    return settings_main(player)
  });


  form.show(player).then((response) => {
    if (response.selection == undefined ) {
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function debug_sd_editor(player, onBack, path = []) {
  let actions = [];
  const save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  let current = save_data;
  for (const key of path) {
    current = current[key];
  }

  const returnToCurrentMenu = () => debug_sd_editor(player, onBack, path);

  // === A) Array-Branch ===
  if (path.length === 0 && Array.isArray(current)) {
    const form = new ActionFormData()
      .title("SD notepad v.2.0")
      .body(`Path: §7save_data/`);

    current.forEach((entry, idx) => {
      const label = idx === 0
        ? `Server [${idx}]`
        : `${entry.name ?? `Player ${idx}`} [${entry.id ?? idx}]`;
      form.button(label, "textures/ui/storageIconColor");

      // Push action for this entry
      actions.push(() => {
        debug_sd_editor(
          player,
          returnToCurrentMenu,
          [...path, idx]
        );
      });
    });

    form.button("§aAdd player", "textures/ui/color_plus");
    actions.push(() => {
      return debug_add_fake_player(player);
    });

    form.divider()
    form.button(""); // Back (no action needed here)

    form.show(player).then(res => {
      if (res.selection == undefined) {
        return -1
      }
      if (res.selection === current.length + 1) { // Back button index
        return onBack();
      }

      // Execute selected action
      actions[res.selection]?.();
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
      .title("SD notepad v.2.0")
      .body(`Path: §7${displayPath}`);

    // Dateneinträge als Buttons
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
        form.button(`${key}`, "textures/ui/storageIconColor");
      }

      // Aktionen pushen
      actions.push(() => {
        const nextPath = [...path, key];
        const fresh = load_save_data();
        let target = fresh;
        for (const k of nextPath.slice(0, -1)) {
          target = target[k];
        }
        const val = target[key];

        if (typeof val === "boolean") {
          target[key] = !val;
          update_save_data(fresh);
          returnToCurrentMenu();
        } else if (typeof val === "number" || typeof val === "string") {
          openTextEditor(
            player,
            String(val),
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
    });
    // Optional: Remove player
    if (path.length === 1 && path[0] !== 0) {
      form.button("§cRemove player", "textures/blocks/barrier");
      actions.push(() => {
        return handle_data_action(false, true, player, save_data[Number(path[0])], save_data[player_sd_index].lang);
      });
    }

    // Zurück-Button
    form.divider()
    form.button("");
    actions.push(() => onBack());

    form.show(player).then(res => {
      if (res.selection == undefined) {
        return -1
      }

      // Aktion ausführen
      const action = actions[res.selection];
      if (action) {
        action();
      }
    });

  }
}

function openTextEditor(player, current, path, onSave, onCancel) {
  let save_data = load_save_data()
  const displaySegments = path.map((seg, idx) => {
    if (idx === 0) {
      return seg === 0 ? "server" : save_data[Number(seg)]?.id ?? seg;
    }
    return seg;
  });

  const fullPath = `save_data/${displaySegments.join("/")}`;
  const form = new ModalFormData();
  form.title("Edit Text");
  form.textField(`Path: ${fullPath} > Value:`, "Enter text...", {defaultValue: current});
  form.submitButton("Save");

  form.show(player).then(res => {
    if (res.canceled) {
      return onCancel();
    }

    let input = res.formValues[0];
    // Wenn der String nur aus Ziffern besteht, in Zahl umwandeln
    if (/^\d+$/.test(input)) {
      input = Number(input);
    }

    onSave(input);
  });
}

function debug_add_fake_player(player) {
  let form = new ModalFormData();
  let UniqueId = ""+generateEntityUniqueId()

  form.textField("Player name", player.name);
  form.textField("Player id", UniqueId);
  form.submitButton("Add player")

  form.show(player).then((response) => {
    if (response.canceled) {
      return -1
    }

    let name = response.formValues[0]
    let id = response.formValues[1]

    if (id == "") {
      id = UniqueId
    }

    if (name == "") {
      name = player.name
    }

    create_player_save_data(id, name, {last_unix: undefined})
    return debug_sd_editor(player, () => debug_main(player), [])
  });
}

function generateEntityUniqueId() {
  // Erzeuge eine zufällige 64-Bit Zahl als BigInt
  // Wir erzeugen 2 * 32-Bit Teile und setzen sie zusammen
  const high = BigInt(Math.floor(Math.random() * 0x100000000)); // obere 32 Bit
  const low = BigInt(Math.floor(Math.random() * 0x100000000));  // untere 32 Bit

  let id = (high << 32n) | low;

  // Umwandlung in signed 64-Bit Bereich (zweier Komplement)
  // Wenn das höchste Bit (63.) gesetzt ist, wird die Zahl negativ
  if (id & (1n << 63n)) {
    id = id - (1n << 64n);
  }

  return id;
}



/*------------------------
 rights
-------------------------*/

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

  form.divider()
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
        form.button2("");
        form.button1("§aMake op");
        form.show(viewing_player).then((response) => {
          if (response.selection == undefined ) {
            return -1
          }
          if (response.selection == 0) {
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

  form.divider()
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
        .button2("")
        .button1("§cKick & Delete");

      confirm_form.show(viewing_player).then(confirm => {
        if (confirm.selection == undefined ) {
          return -1
        }
        if (confirm.selection === 0) {
          if (!world.getDimension("overworld").runCommand(`kick ${selected_player.name}`).successCount) {
            const host_form = new MessageFormData()
              .title("Host player information")
              .body(`${selected_player.name} is the host. To delete their data, the server must shut down. This usually takes 5 seconds`)
              .button2("")
              .button1("§cShutdown & Delete");

            host_form.show(viewing_player).then(host => {
              if (host.selection == undefined ) {
                return -1
              }
              if (host.selection === 0) {
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
      gesture_nod()
      gesture_jump()
      gesture_emote()

      let save_data = load_save_data();

      world.getAllPlayers().forEach(player => {
        let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
        // When a player's sd gets removed he will kick out of the game triggering this...
        if (player_sd_index) {
          save_data[player_sd_index].last_unix = Math.floor(Date.now() / 1000)
          update_save_data(save_data);
        }
      });

      await system.waitTicks(1);
    }
}

system.run(() => update_loop())