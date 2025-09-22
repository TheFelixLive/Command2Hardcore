import { system, world, EntityTypes, EffectTypes, ItemTypes, BlockTypes, EnchantmentTypes, WeatherType, CustomCommandParamType, CommandPermissionLevel} from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData  } from "@minecraft/server-ui"


const version_info = {
  name: "Command2Hardcore",
  version: "v.4.0.0",
  build: "B026",
  release_type: 0, // 0 = Development version (with debug); 1 = Beta version; 2 = Stable version
  unix: 1758569760,
  update_message_period_unix: 15897600, // Normally 6 months = 15897600
  uuid: "a9bdf889-7080-419c-b23c-adfc8704c4c1",
  changelog: {
    // new_features
    new_features: [
      "Achievements can now be earned with this add-on (thks. to Coolboyzay7 & Littlewolf_guy)",
      "Added auto correction for commands in the ui",
      "Added limited support for custom commands (thks. to xAssassin)",
    ],
    // general_changes
    general_changes: [
    ],
    // bug_fixes
    bug_fixes: [
      "Fixed a bug where commmand didn't execute properly in multiplayer",
      "Fixed a bug where the visual effect command didn't work properly while clearing an effect in multiplayer",
    ]
  }
}

print("Hello from " + version_info.name + " - "+version_info.version+" ("+version_info.build+") - Further debugging is "+ (version_info.release_type == 0? "enabled" : "disabled" ) + " by the version")


/*------------------------
  Internal lists
-------------------------*/


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

const gamerules = [
  { key: "commandBlockOutput", type: "boolean", tooltip: "Command blocks output messages to operators." },
  { key: "commandBlocksEnabled", type: "boolean", tooltip: "Command blocks are enabled." },
  { key: "doDayLightCycle", type: "boolean", tooltip: "The daylight cycle progresses naturally." },
  { key: "doEntityDrops", type: "boolean", tooltip: "Entities drop items when destroyed." },
  { key: "doFireTick", type: "boolean", tooltip: "Fire spreads and extinguishes naturally." },
  { key: "doImmediateRespawn", type: "boolean", tooltip: "players respawn immediately without death screen." },
  { key: "doInsomnia", type: "boolean", tooltip: "Phantoms spawn when players haven’t slept." },
  { key: "doLimitedCrafting", type: "boolean", tooltip: "Only unlocked recipes can be crafted." },
  { key: "doMobLoot", type: "boolean", tooltip: "Mobs drop loot on death." },
  { key: "doMobSpawning", type: "boolean", tooltip: "Mobs spawn naturally." },
  { key: "doTileDrops", type: "boolean", tooltip: "Blocks drop items when broken." },
  { key: "doWeatherCycle", type: "boolean", tooltip: "Weather changes naturally." },

  { key: "drowningDamage", type: "boolean", tooltip: "players take damage from drowning." },
  { key: "fallDamage", type: "boolean", tooltip: "players take fall damage." },
  { key: "fireDamage", type: "boolean", tooltip: "players take damage from fire." },
  { key: "freezeDamage", type: "boolean", tooltip: "players take damage from freezing." },

  { key: "functionCommandLimit", type: "numberText", tooltip: "Max number of commands a function can run." },

  { key: "keepInventory", type: "boolean", tooltip: "players keep inventory after death." },
  { key: "maxCommandChainLength", type: "numberText", tooltip: "Maximum number of commands in a command chain." },

  { key: "mobGriefing", type: "boolean", tooltip: "Mobs can modify the world (e.g., Creepers explode blocks)." },
  { key: "naturalRegeneration", type: "boolean", tooltip: "players regenerate health naturally." },

  { key: "playersSleepingPercentage", type: "slider", min: 0, max: 100, step: 1, tooltip: "Percent of players required to sleep to skip the night." },

  { key: "projectilesCanBreakBlocks", type: "boolean", tooltip: "Projectiles can break blocks." },
  { key: "pvp", type: "boolean", tooltip: "players can damage each other (PvP enabled)." },

  { key: "randomTickSpeed", type: "slider", min: 0, max: 1000, step: 1, tooltip: "Rate of random ticks (affects growth, fire, etc.)." },

  { key: "recipesUnlock", type: "boolean", tooltip: "Recipes unlock automatically as you progress." },
  { key: "respawnBlocksExplode", type: "boolean", tooltip: "Respawn anchors explode when used improperly." },
  { key: "sendCommandFeedback", type: "boolean", tooltip: "Feedback from commands appears in chat." },
  { key: "showBorderEffect", type: "boolean", tooltip: "World border visual effect is visible." },
  { key: "showCoordinates", type: "boolean", tooltip: "Displays coordinates in the HUD." },
  { key: "showDaysPlayed", type: "boolean", tooltip: "Displays the number of in-game days played." },
  { key: "showDeathMessages", type: "boolean", tooltip: "Death messages are displayed in chat." },
  { key: "showRecipeMessages", type: "boolean", tooltip: "Recipe unlock messages are shown." },
  { key: "showTags", type: "boolean", tooltip: "Entity tags are shown (debug)." },

  { key: "spawnRadius", type: "slider", min: 0, max: 100, step: 1, tooltip: "Spawn radius from the world spawn point." },

  { key: "tntExplodes", type: "boolean", tooltip: "TNT can explode." },
  { key: "tntExplosionDropDecay", type: "boolean", tooltip: "Explosions reduce the amount of dropped items." }
];

const command_list = [
  // types: literal, string, int, float, bool, location, blocktype, itemtype, entityType, entityselector, playerselector, effectType, enchantType, weathertype, json, enum

  {
    name: "fill",
    aliases: ["fill"],
    description: "Fill area with blocks",
    syntaxes: [
      { type: "literal", value: "/fill" },
      { type: "location", name: "from" },
      { type: "location", name: "to" },
      { type: "blocktype", name: "block" },
      { type: "string", name: "data", optional: true },
      {
        type: "enum",
        name: "mode",
        optional: true,
        value: [
          { value: "destroy" },
          { value: "hollow" },
          { value: "keep" },
          { value: "outline" },
          {
            value: "replace",
            next: [
              { type: "blocktype", name: "oldBlock", optional: true },
              { type: "string", name: "oldData", optional: true }
            ]
          }
        ]
      }
    ]
  },

  {
    name: "effect",
    aliases: ["effect"],
    description: "Add/remove potion effects",
    vc_hiperlink: () => { if (anyplayerHasEffect()) visual_command_effect_select(player); else visual_command_effect_add(player); },
    syntaxes: [
      { type: "literal", value: "/effect" },
      { type: "entityselector", name: "target" },
      { type: "effecttype", name: "effect" },
      { type: "int", name: "seconds", optional: true },
      { type: "int", name: "amplifier", optional: true },
      { type: "bool", name: "hideParticles", optional: true }
    ]
  },

  {
    name: "give",
    aliases: ["give"],
    description: "Gives an item to a player",
    vc_hiperlink: () => {if (version_info == 0) all_ItemTypes(player); else undefined;},
    syntaxes: [
      { type: "literal", value: "/give" },
      { type: "playerselector", name: "target" },
      { type: "itemtype", name: "item" },
      { type: "int", name: "count", optional: true },
      { type: "string", name: "data", optional: true },
      { type: "json", name: "components", optional: true }
    ]
  },

  {
    name: "summon",
    aliases: ["summon"],
    description: "Summons an entity",
    vc_hiperlink: () => all_EntityTypes(player),
    syntaxes: [
      { type: "literal", value: "/summon" },
      { type: "entityType", name: "entityType" },
      { type: "location", name: "pos", optional: true },
      { type: "json", name: "components", optional: true }
    ]
  },

  {
    name: "teleport",
    aliases: ["teleport", "tp"],
    description: "Teleport entity or player",
    syntaxes: [
      { type: "literal", value: "/teleport" },
      {
        type: "entityselector",
        name: "victim",
        next: [
          {
            type: "entityselector",
            name: "destination",
            next: [
              { type: "bool", name: "checkForBlocks", optional: true }
            ]
          },
          {
            type: "location",
            name: "destination",
            next: [
              { type: "float", name: "yRot", optional: true },
              { type: "float", name: "xRot", optional: true },
              { type: "bool", name: "checkForBlocks", optional: true },
              {
                type: "literal",
                value: "facing",
                optional: true,
                next: [
                  { type: "location", name: "lookAtPosition", optional: true },
                  { type: "entityselector", name: "lookAtEntity", optional: true }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  {
    name: "playsound",
    aliases: ["playsound"],
    description: "Play a sound",
    syntaxes: [
      { type: "literal", value: "/playsound" },
      { type: "string", name: "sound" },
      { type: "playerselector", name: "targets", optional: true },
      { type: "location", name: "pos", optional: true },
      { type: "float", name: "volume", optional: true },
      { type: "float", name: "pitch", optional: true }
    ]
  },

  {
    name: "setblock",
    aliases: ["setblock"],
    description: "Set block at coordinates",
    syntaxes: [
      { type: "literal", value: "/setblock" },
      { type: "location", name: "pos" },
      { type: "blocktype", name: "block" },
      { type: "string", name: "data", optional: true },
      {
        type: "enum",
        name: "mode",
        optional: true,
        value: [{ value: "destroy" }, { value: "keep" }, { value: "replace" }]
      }
    ]
  },

  {
    name: "weather",
    aliases: ["weather"],
    vc_hiperlink: () => visual_command_weather(player),
    description: "Set or query the weather",
    syntaxes: [
      { type: "literal", value: "/weather" },
      { type: "weathertype", name: "type", optional: true },
      { type: "int", name: "duration", optional: true }
    ]
  },

  {
    name: "help",
    aliases: ["help", "?"],
    cc_hidden: true,
    description: "Show help for commands or a specific command",
    syntaxes: [
      { type: "literal", value: "/help" },
      { type: "string", name: "command", optional: true }
    ]
  },

  {
    name: "alwaysday",
    aliases: ["alwaysday"],
    description: "Toggle alwaysday",
    syntaxes: [
      { type: "literal", value: "/alwaysday" },
      { type: "bool", name: "enabled", optional: true }
    ]
  },

  {
    name: "daylock",
    aliases: ["daylock"],
    description: "Lock/unlock the time of day",
    syntaxes: [
      { type: "literal", value: "/daylock" },
      { type: "bool", name: "enabled", optional: true }
    ]
  },

  {
    name: "camera",
    aliases: ["camera"],
    description: "Control camera (Bedrock)",
    syntaxes: [
      { type: "literal", value: "/camera" },
      { type: "playerselector", name: "targets" },

      // Hauptaktionen als enum; jede Aktion kann eigene Next-Parameter haben
      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "set",
            next: [
              // preset name (CameraPresets)
              {
                type: "enum",
                name: "preset",
                value: [
                  { value: "minecraft:first_person" },
                  { value: "minecraft:fixed_boom" },
                  { value: "minecraft:follow_orbit" },
                  { value: "minecraft:free" },
                  { value: "minecraft:third_person" },
                  { value: "minecraft:third_person_front" },
                  { value: "minecraft:control_scheme_camera" }
                ]
              },

              // optional: ease <easeTime: float> <easeType: Easing>
              {
                type: "literal",
                value: "ease",
                optional: true,
                next: [
                  { type: "float", name: "easeTime" },
                  {
                    type: "enum",
                    name: "easing",
                    value: [
                      { value: "linear" },{ value: "spring" },{ value: "in_quad" },{ value: "out_quad" },
                      { value: "in_out_quad" },{ value: "in_cubic" },{ value: "out_cubic" },{ value: "in_out_cubic" },
                      { value: "in_quart" },{ value: "out_quart" },{ value: "in_out_quart" },{ value: "in_quint" },
                      { value: "out_quint" },{ value: "in_out_quint" },{ value: "in_sine" },{ value: "out_sine" },
                      { value: "in_out_sine" },{ value: "in_expo" },{ value: "out_expo" },{ value: "in_out_expo" },
                      { value: "in_circ" },{ value: "out_circ" },{ value: "in_out_circ" },{ value: "in_bounce" },
                      { value: "out_bounce" },{ value: "in_out_bounce" },{ value: "in_back" },{ value: "out_back" },
                      { value: "in_out_back" },{ value: "in_elastic" },{ value: "out_elastic" },{ value: "in_out_elastic" }
                    ]
                  }
                ]
              },

              // optional: pos <position: x y z>
              {
                type: "literal",
                value: "pos",
                optional: true,
                next: [
                  { type: "location", name: "position" }
                ]
              },

              // optional: rot <xRot: float> <yRot: float>
              {
                type: "literal",
                value: "rot",
                optional: true,
                next: [
                  { type: "float", name: "xRot" },
                  { type: "float", name: "yRot" }
                ]
              },

              // optional: facing <lookAtEntity | lookAtPosition>
              {
                type: "literal",
                value: "facing",
                optional: true,
                next: [
                  { type: "entityselector", name: "lookAtEntity", optional: true },
                  { type: "location", name: "lookAtPosition", optional: true }
                ]
              },

              // optional: view_offset <xViewOffset: float> <yViewOffset: float>
              {
                type: "literal",
                value: "view_offset",
                optional: true,
                next: [
                  { type: "float", name: "xViewOffset" },
                  { type: "float", name: "yViewOffset" }
                ]
              },

              // optional: entity_offset <xEntityOffset: float> <yEntityOffset: float> <zEntityOffset: float>
              {
                type: "literal",
                value: "entity_offset",
                optional: true,
                next: [
                  { type: "float", name: "xEntityOffset" },
                  { type: "float", name: "yEntityOffset" },
                  { type: "float", name: "zEntityOffset" }
                ]
              },

              // optional: rot + view_offset + entity_offset combinations are allowed via the next chains above
            ]
          },

          // entferne Ziel / Ziel setzen
          {
            value: "target_entity",
            next: [
              { type: "entityselector", name: "entity" },
              {
                type: "literal",
                value: "target_center_offset",
                optional: true,
                next: [
                  { type: "float", name: "xTargetCenterOffset" },
                  { type: "float", name: "yTargetCenterOffset" },
                  { type: "float", name: "zTargetCenterOffset" }
                ]
              }
            ]
          },
          { value: "remove_target" },

          // clear camera overrides
          { value: "clear" },

          // fade variants
          {
            value: "fade",
            next: [
              // fade time <fadeInSeconds: float> <holdSeconds: float> <fadeOutSeconds: float> [color <r g b>]
              {
                type: "literal",
                value: "time",
                next: [
                  { type: "float", name: "fadeInSeconds" },
                  { type: "float", name: "holdSeconds" },
                  { type: "float", name: "fadeOutSeconds" },
                  {
                    type: "literal",
                    value: "color",
                    optional: true,
                    next: [
                      { type: "int", name: "red" },
                      { type: "int", name: "green" },
                      { type: "int", name: "blue" }
                    ]
                  }
                ]
              },

              // fade color <r g b>
              {
                type: "literal",
                value: "color",
                next: [
                  { type: "int", name: "red" },
                  { type: "int", name: "green" },
                  { type: "int", name: "blue" }
                ]
              },

              // simple 'fade' with optional parameters
              { type: "literal", value: "", optional: true }
            ]
          },

          // fov_set / fov_clear
          {
            value: "fov_set",
            next: [
              { type: "float", name: "fov_value" },
              { type: "float", name: "fovEaseTime", optional: true },
              {
                type: "enum",
                name: "fovEaseType",
                optional: true,
                value: [
                  { value: "linear" },{ value: "spring" },{ value: "in_quad" },{ value: "out_quad" },
                  { value: "in_out_quad" },{ value: "in_cubic" },{ value: "out_cubic" },{ value: "in_out_cubic" },
                  { value: "in_quart" },{ value: "out_quart" },{ value: "in_out_quart" },{ value: "in_quint" },
                  { value: "out_quint" },{ value: "in_out_quint" },{ value: "in_sine" },{ value: "out_sine" },
                  { value: "in_out_sine" },{ value: "in_expo" },{ value: "out_expo" },{ value: "in_out_expo" },
                  { value: "in_circ" },{ value: "out_circ" },{ value: "in_out_circ" },{ value: "in_bounce" },
                  { value: "out_bounce" },{ value: "in_out_bounce" },{ value: "in_back" },{ value: "out_back" },
                  { value: "in_out_back" },{ value: "in_elastic" },{ value: "out_elastic" },{ value: "in_out_elastic" }
                ]
              }
            ]
          },
          {
            value: "fov_clear",
            next: [
              { type: "float", name: "fovEaseTime", optional: true },
              {
                type: "enum",
                name: "fovEaseType",
                optional: true,
                value: [
                  { value: "linear" },{ value: "spring" },{ value: "in_quad" },{ value: "out_quad" },
                  { value: "in_out_quad" },{ value: "in_cubic" },{ value: "out_cubic" },{ value: "in_out_cubic" },
                  { value: "in_quart" },{ value: "out_quart" },{ value: "in_out_quart" },{ value: "in_quint" },
                  { value: "out_quint" },{ value: "in_out_quint" },{ value: "in_sine" },{ value: "out_sine" },
                  { value: "in_out_sine" },{ value: "in_expo" },{ value: "out_expo" },{ value: "in_out_expo" },
                  { value: "in_circ" },{ value: "out_circ" },{ value: "in_out_circ" },{ value: "in_bounce" },
                  { value: "out_bounce" },{ value: "in_out_bounce" },{ value: "in_back" },{ value: "out_back" },
                  { value: "in_out_back" },{ value: "in_elastic" },{ value: "out_elastic" },{ value: "in_out_elastic" }
                ]
              }
            ]
          }

        ] // end action values
      } // end action enum
    ] // end syntaxes
  },

  {
    name: "clear",
    aliases: ["clear"],
    description: "Clear items from a player's inventory",
    syntaxes: [
      { type: "literal", value: "/clear" },
      { type: "playerselector", name: "player", optional: true },
      { type: "itemtype", name: "item", optional: true },
      { type: "int", name: "data", optional: true }
    ]
  },

  {
    name: "clearspawnpoint",
    aliases: ["clearspawnpoint"],
    description: "Clear world spawnpoint or player's spawn",
    syntaxes: [
      { type: "literal", value: "/clearspawnpoint" },
      { type: "playerselector", name: "player", optional: true }
    ]
  },

  {
    name: "clone",
    aliases: ["clone"],
    description: "Clone blocks from one region to another",
    syntaxes: [
      { type: "literal", value: "/clone" },
      { type: "location", name: "begin" },
      { type: "location", name: "end" },
      { type: "location", name: "destination" },
      {
        type: "enum",
        name: "mode",
        optional: true,
        value: [
          { value: "replace" },
          { value: "masked" },
          { value: "filtered" }
        ]
      },
      { type: "string", name: "filterBlock", optional: true }
    ]
  },

  {
    name: "damage",
    aliases: ["damage"],
    description: "Damage an entity",
    syntaxes: [
      { type: "literal", value: "/damage" },
      { type: "entityselector", name: "target" },
      { type: "int", name: "amount" },
      { type: "string", name: "damagetype", optional: true },
      { type: "entityselector", name: "source of the damage", optional: true },
    ]
  },

  {
    name: "dialogue",
    aliases: ["dialogue"],
    description: "Show dialogue to player (Bedrock)",
    syntaxes: [
      { type: "literal", value: "/dialogue" },
      { type: "playerselector", name: "player" },
      { type: "string", name: "dialogueId" }
    ]
  },

  {
    name: "difficulty",
    aliases: ["difficulty"],
    description: "Set or query difficulty",
    syntaxes: [
      { type: "literal", value: "/difficulty" },
      {
        type: "enum",
        name: "level",
        value: [{ value: "peaceful" }, { value: "easy" }, { value: "normal" }, { value: "hard" }]
      }
    ]
  },

  {
    name: "enchant",
    aliases: ["enchant"],
    vc_hiperlink: () => getCompatibleEnchantmentTypes(player.getComponent("minecraft:inventory")?.container?.getItem(player.selectedSlotIndex)).length > 0
      ? visual_command_enchant(player)
      : undefined,
    description: "Apply an enchantment to an item",
    syntaxes: [
      { type: "literal", value: "/enchant" },
      { type: "playerselector", name: "player" },
      { type: "enchanttype", name: "enchantment" },
      { type: "int", name: "level", optional: true }
    ]
  },

  {
    name: "event",
    aliases: ["event"],
    description: "Trigger a game event (Bedrock)",
    syntaxes: [
      { type: "literal", value: "/event" },
      { type: "string", name: "eventName" },
      { type: "entityselector", name: "target", optional: true }
    ]
  },

  {
    name: "experience",
    aliases: ["experience", "xp"],
    description: "Grant or set experience points/levels",
    syntaxes: [
      { type: "literal", value: "/experience" },
      { type: "playerselector", name: "player" },
      { type: "int", name: "amount" },
      {
        type: "enum",
        name: "type",
        optional: true,
        value: [{ value: "points" }, { value: "levels" }]
      }
    ]
  },

  {
    name: "fog",
    aliases: ["fog"],
    description: "Control fog (Bedrock)",
    syntaxes: [
      { type: "literal", value: "/fog" },

      // optional: Ziel-Spieler/Targets
      { type: "playerselector", name: "targets", optional: true },

      // Hauptaktionen als enum; jede Aktion kann eigene Next-Parameter haben
      {
        type: "enum",
        name: "action",
        value: [
          // Setze Fog-Parameter direkt
          {
            value: "set",
            next: [
              // Dichte (0.0 - 1.0 typisch)
              { type: "float", name: "density", optional: true },

              // Farbe als RGB
              {
                type: "literal",
                value: "color",
                optional: true,
                next: [
                  { type: "int", name: "red" },
                  { type: "int", name: "green" },
                  { type: "int", name: "blue" }
                ]
              },

              // Distanzbereich (start, optional end)
              {
                type: "literal",
                value: "distance",
                optional: true,
                next: [
                  { type: "float", name: "startDistance" },
                  { type: "float", name: "endDistance", optional: true }
                ]
              },

              // Übergang (Zeit + optionaler Easing-Typ)
              {
                type: "literal",
                value: "transition",
                optional: true,
                next: [
                  { type: "float", name: "timeSeconds" },
                  {
                    type: "enum",
                    name: "easing",
                    optional: true,
                    value: [
                      { value: "linear" },
                      { value: "spring" },
                      { value: "in_quad" },
                      { value: "out_quad" },
                      { value: "in_out_quad" },
                      { value: "in_cubic" },
                      { value: "out_cubic" },
                      { value: "in_out_cubic" }
                    ]
                  }
                ]
              }
            ]
          },

          // Setze eine vordefinierte Preset-Konfiguration
          {
            value: "preset",
            next: [
              {
                type: "enum",
                name: "presetName",
                value: [
                  { value: "default" },
                  { value: "dense" },
                  { value: "light" },
                  { value: "haze" },
                  { value: "underwater" }
                ]
              },

              // optional: Übergangszeit beim Wechsel des Presets
              { type: "float", name: "transitionTime", optional: true }
            ]
          },

          // Einfache Farbänderung
          {
            value: "color",
            next: [
              { type: "int", name: "red" },
              { type: "int", name: "green" },
              { type: "int", name: "blue" }
            ]
          },

          // Blend-Funktion: mischt von einer Farbe/Dichte zur anderen
          {
            value: "blend",
            next: [
              { type: "float", name: "durationSeconds" },
              { type: "float", name: "fromDensity" },
              { type: "int", name: "fromRed" },
              { type: "int", name: "fromGreen" },
              { type: "int", name: "fromBlue" },
              { type: "float", name: "toDensity" },
              { type: "int", name: "toRed" },
              { type: "int", name: "toGreen" },
              { type: "int", name: "toBlue" }
            ]
          },

          // Entferne/kläre alle Fog-Overrides
          { value: "clear" },

          // Setze Fog so, dass es dem aktuellen Wetter folgt (wenn relevant)
          { value: "follow_weather" },

          // Schalte Fog ein/aus (Kurzform)
          {
            value: "toggle",
            next: [{ type: "bool", name: "enabled", optional: true }]
          }
        ]
      }
    ]
  },


  {
    name: "function",
    aliases: ["function"],
    description: "Run a function",
    syntaxes: [
      { type: "literal", value: "/function" },
      { type: "string", name: "name" }
    ]
  },

  {
    name: "gamemode",
    aliases: ["gamemode", "gm"],
    description: "Set a player's game mode",
    syntaxes: [
      { type: "literal", value: "/gamemode" },
      {
        type: "enum",
        name: "mode",
        value: [{ value: "survival" }, { value: "creative" }, { value: "adventure" }, { value: "spectator" }, { value: "s" }, { value: "c" }]
      },
      { type: "playerselector", name: "target", optional: true }
    ]
  },

  {
    name: "gamerule",
    aliases: ["gamerule"],
    cc_hidden: true,
    description: "Set or query a gamerule",
    syntaxes: [
      { type: "literal", value: "/gamerule" },
      { type: "string", name: "rule" },
      { type: "string", name: "value", optional: true }
    ]
  },

  {
    name: "hud",
    aliases: ["hud"],
    description: "Control HUD elements",
    syntaxes: [
      { type: "literal", value: "/hud" },
      { type: "playerselector", name: "target" },
      {
        type: "enum",
        name: "visible",
        value: [
          { value: "hide" },
          { value: "reset" }
        ]
      },
      {
        type: "enum",
        name: "hud_element",
        optional: true,
        value: [
          { value: "hunger" },
          { value: "all" },
          { value: "paperdoll" },
          { value: "armor" },
          { value: "tooltips" },
          { value: "touch_controls" },
          { value: "crosshair" },
          { value: "hotbar" },
          { value: "health" },
          { value: "progress_bar" },
          { value: "air_bubbles" },
          { value: "horse_health" },
          { value: "status_effects" },
          { value: "item_text" }
        ]
      }
    ]
  },


  {
    name: "inputpermission",
    aliases: ["inputpermission"],
    description: "Grant or revoke input permissions",
    syntaxes: [
      { type: "literal", value: "/inputpermission" },
      {
        type: "enum",
        name: "subcommand",
        value: [
          { value: "set" },
          { value: "reset" },
          { value: "query" }
        ]
      },
      { type: "playerselector", name: "player" },
      {
        type: "enum",
        name: "permission",
        optional: true,
        value: [
          { value: "camera" },
          { value: "movement" },
          { value: "jump" },
          { value: "lateral_movement" },
          { value: "sneak" },
          { value: "dismount" },
          { value: "mount" },
          { value: "move_backward" },
          { value: "move_forward" },
          { value: "move_left" },
          { value: "move_right" },
          { value: "use_item" },
          { value: "all" }
        ]
      },
      { type: "bool", name: "value", optional: true }
    ]
  },

  {
    name: "kick",
    aliases: ["kick"],
    cc_hidden: true,
    description: "Kick a player from the server",
    syntaxes: [
      { type: "literal", value: "/kick" },
      { type: "playerselector", name: "player" },
      { type: "string", name: "reason", optional: true }
    ]
  },

  {
    name: "kill",
    aliases: ["kill"],
    description: "Kill entities",
    syntaxes: [
      { type: "literal", value: "/kill" },
      { type: "entityselector", name: "target", optional: true }
    ]
  },

  {
    name: "music",
    aliases: ["music"],
    description: "Play / queue / stop music tracks (Bedrock)",
    syntaxes: [
      { type: "literal", value: "/music" },

      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "play",
            next: [
              { type: "string", name: "trackName" },
              { type: "float", name: "volume", optional: true },
              { type: "float", name: "fadeSeconds", optional: true },
              {
                type: "enum",
                name: "repeatMode",
                optional: true,
                value: [
                  { value: "play_once" },
                  { value: "loop" }
                ]
              }
            ]
          },

          {
            value: "queue",
            next: [
              { type: "string", name: "trackName" },
              { type: "float", name: "volume", optional: true },
              { type: "float", name: "fadeSeconds", optional: true },
              {
                type: "enum",
                name: "repeatMode",
                optional: true,
                value: [
                  { value: "play_once" },
                  { value: "loop" }
                ]
              }
            ]
          },

          {
            value: "stop",
            next: [
              { type: "float", name: "fadeSeconds", optional: true }
            ]
          },

          {
            value: "volume",
            next: [
              { type: "float", name: "volume" }
            ]
          }
        ]
      }
    ]
  },

  {
    name: "particle",
    aliases: ["particle"],
    description: "Spawn particles",
    syntaxes: [
      { type: "literal", value: "/particle" },
      { type: "string", name: "particleName" },
      { type: "location", name: "pos", optional: true },
      { type: "int", name: "count", optional: true }
    ]
  },

  {
    name: "playanimation",
    aliases: ["playanimation"],
    description: "Play an animation on an entity",
    syntaxes: [
      { type: "literal", value: "/playanimation" },
      { type: "entityselector", name: "target" },
      { type: "string", name: "animation" }
    ]
  },

  {
    name: "recipe",
    aliases: ["recipe"],
    description: "Grant or revoke recipes",
    syntaxes: [
      { type: "literal", value: "/recipe" },
      { type: "playerselector", name: "player" },
      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "give",
            next: [
              { type: "string", name: "recipeName", optional: true },
              { type: "string", name: "recipeNamespace", optional: true }
            ]
          },
          {
            value: "take",
            next: [
              { type: "string", name: "recipeName", optional: true },
              { type: "string", name: "recipeNamespace", optional: true }
            ]
          },
          {
            value: "grant",
            next: [
              { type: "string", name: "recipeName", optional: true },
              { type: "string", name: "recipeNamespace", optional: true }
            ]
          },
          {
            value: "revoke",
            next: [
              { type: "string", name: "recipeName", optional: true },
              { type: "string", name: "recipeNamespace", optional: true }
            ]
          },
          {
            value: "all" // no next parameters needed
          },
          {
            value: "none" // no next parameters needed
          }
        ]
      }
    ]
  },


  {
    name: "replaceitem",
    aliases: ["replaceitem"],
    description: "Replaces items in inventories or block containers",
    syntaxes: [
      { type: "literal", value: "/replaceitem" },
      {
        type: "enum",
        name: "targetType",
        value: [
          {
            value: "entity",
            next: [
              { type: "entityselector", name: "target" },
              { type: "string", name: "slot" },
              { type: "itemtype", name: "item" },
              { type: "int", name: "count", optional: true },
              { type: "int", name: "data", optional: true },
              { type: "json", name: "components", optional: true }
            ]
          },
          {
            value: "block",
            next: [
              { type: "location", name: "pos" },
              { type: "string", name: "slot" },
              { type: "itemtype", name: "item" },
              { type: "int", name: "count", optional: true },
              { type: "int", name: "data", optional: true },
              { type: "json", name: "components", optional: true }
            ]
          }
        ]
      }
    ]
  },


  {
    name: "ride",
    aliases: ["ride"],
    description: "Manage entity riding (Bedrock)",
    syntaxes: [
      { type: "literal", value: "/ride" },
      { type: "entityselector", name: "rider" },

      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "start_riding",
            next: [
              { type: "entityselector", name: "ridee" },
              {
                type: "enum",
                name: "teleportRules",
                optional: true,
                value: [
                  { value: "teleport_rider" },
                  { value: "teleport_ridee" },
                  { value: "never" }
                ]
              },
              {
                type: "enum",
                name: "rideRules",
                optional: true,
                value: [
                  { value: "no_ride_change" },
                  { value: "allow_stacking" },
                  { value: "replace_rides" }
                ]
              }
            ]
          },

          { value: "stop_riding" },

          {
            value: "evict_riders",
            next: [
              { type: "entityselector", name: "ridee" }
            ]
          },

          {
            value: "summon_rider",
            next: [
              { type: "entityType", name: "entity" },
              { type: "location", name: "spawnPos", optional: true },
              { type: "string", name: "spawnEvent", optional: true }
            ]
          }
        ]
      }
    ]
  },


  {
    name: "schedule",
    aliases: ["schedule"],
    description: "Schedule a function or command",
    syntaxes: [
      { type: "literal", value: "/schedule" },

      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "function",
            next: [
              { type: "string", name: "functionName" },
              { type: "int", name: "ticks" },
              { type: "string", name: "target", optional: true }
            ]
          },
          {
            value: "add",
            next: [
              { type: "string", name: "functionName" },
              { type: "int", name: "ticks" },
              { type: "string", name: "target", optional: true }
            ]
          },
          {
            value: "run",
            next: [
              { type: "string", name: "functionName" },
              { type: "string", name: "target", optional: true }
            ]
          },
          {
            value: "clear",
            next: [
              { type: "string", name: "functionName", optional: true },
              { type: "string", name: "target", optional: true }
            ]
          }
        ]
      }
    ]
  },


  {
    name: "scoreboard",
    aliases: ["scoreboard"],
    description: "Manage objectives, players, and teams",
    syntaxes: [
      { type: "literal", value: "/scoreboard" },

      {
        type: "enum",
        name: "subcommand",
        value: [
          {
            value: "objectives",
            next: [
              {
                type: "enum",
                name: "action",
                value: [
                  {
                    value: "add",
                    next: [
                      { type: "string", name: "objective" },
                      { type: "string", name: "criteria", optional: true },
                      { type: "string", name: "displayName", optional: true }
                    ]
                  },
                  {
                    value: "remove",
                    next: [{ type: "string", name: "objective" }]
                  },
                  {
                    value: "setdisplay",
                    next: [
                      {
                        type: "enum",
                        name: "slot",
                        value: [
                          { value: "list" },
                          { value: "sidebar" },
                          { value: "belowName" }
                        ]
                      },
                      { type: "string", name: "objective", optional: true }
                    ]
                  },
                  { value: "list" }
                ]
              }
            ]
          },

          {
            value: "players",
            next: [
              {
                type: "enum",
                name: "action",
                value: [
                  {
                    value: "add",
                    next: [
                      { type: "playerselector", name: "player" },
                      { type: "string", name: "objective" },
                      { type: "int", name: "score", optional: true }
                    ]
                  },
                  {
                    value: "remove",
                    next: [
                      { type: "playerselector", name: "player" },
                      { type: "string", name: "objective", optional: true }
                    ]
                  },
                  {
                    value: "set",
                    next: [
                      { type: "playerselector", name: "player" },
                      { type: "string", name: "objective" },
                      { type: "int", name: "score" }
                    ]
                  },
                  {
                    value: "reset",
                    next: [
                      { type: "playerselector", name: "player", optional: true },
                      { type: "string", name: "objective", optional: true }
                    ]
                  },
                  { value: "list", next: [{ type: "playerselector", name: "player", optional: true }] }
                ]
              }
            ]
          }
        ]
      }
    ]
  },


  {
    name: "setworldspawn",
    aliases: ["setworldspawn"],
    description: "Set the world spawn position",
    syntaxes: [
      { type: "literal", value: "/setworldspawn" },
      { type: "location", name: "pos", optional: true }
    ]
  },

  {
    name: "spawnpoint",
    aliases: ["spawnpoint"],
    description: "Set a player's spawnpoint",
    syntaxes: [
      { type: "literal", value: "/spawnpoint" },
      { type: "playerselector", name: "player", optional: true },
      { type: "location", name: "pos", optional: true }
    ]
  },

  {
    name: "spreadplayers",
    aliases: ["spreadplayers"],
    description: "Spread entities around a point",
    syntaxes: [
      { type: "literal", value: "/spreadplayers" },
      { type: "location", name: "center" },
      { type: "float", name: "spreadDistance" },
      { type: "float", name: "maxRange" },
      { type: "entityselector", name: "targets" }
    ]
  },

  {
    name: "stopsound",
    aliases: ["stopsound"],
    description: "Stop sounds for players",
    syntaxes: [
      { type: "literal", value: "/stopsound" },
      { type: "playerselector", name: "targets" },
      { type: "string", name: "sound", optional: true }
    ]
  },

  {
    name: "structure",
    aliases: ["structure"],
    description: "Save, load, or manage structures",
    syntaxes: [
      { type: "literal", value: "/structure" },

      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "save",
            next: [
              { type: "string", name: "structureName" },
              { type: "location", name: "pos1" },
              { type: "location", name: "pos2" },
              {
                type: "enum",
                name: "mode",
                optional: true,
                value: [
                  { value: "replace" },
                  { value: "keep" },
                  { value: "merge" }
                ]
              },
              {
                type: "bool",
                name: "includeEntities",
                optional: true
              }
            ]
          },

          {
            value: "load",
            next: [
              { type: "string", name: "structureName" },
              { type: "location", name: "destination" },
              {
                type: "enum",
                name: "mode",
                optional: true,
                value: [
                  { value: "replace" },
                  { value: "ignore" },
                  { value: "masked" }
                ]
              },
              {
                type: "bool",
                name: "includeEntities",
                optional: true
              },
              {
                type: "enum",
                name: "rotation",
                optional: true,
                value: [
                  { value: "0" },
                  { value: "90" },
                  { value: "180" },
                  { value: "270" }
                ]
              },
              {
                type: "enum",
                name: "mirror",
                optional: true,
                value: [
                  { value: "none" },
                  { value: "left_right" },
                  { value: "front_back" }
                ]
              }
            ]
          },

          {
            value: "delete",
            next: [
              { type: "string", name: "structureName" }
            ]
          },

          {
            value: "list"
          },

          {
            value: "export",
            next: [
              { type: "string", name: "structureName" },
              { type: "string", name: "fileName", optional: true }
            ]
          },

          {
            value: "import",
            next: [
              { type: "string", name: "fileName" },
              { type: "string", name: "structureName", optional: true }
            ]
          }
        ]
      }
    ]
  },


  {
    name: "tag",
    aliases: ["tag"],
    description: "Add/remove/list tags on entities",
    syntaxes: [
      { type: "literal", value: "/tag" },
      {
        type: "entityselector",
        name: "target"
      },
      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "add",
            next: [
              { type: "string", name: "tag" }
            ]
          },
          {
            value: "remove",
            next: [
              { type: "string", name: "tag" }
            ]
          },
          {
            value: "list"
          }
        ]
      }
    ]
  },


  {
    name: "tellraw",
    aliases: ["tellraw"],
    cc_hidden: true,
    description: "Send JSON-formatted chat messages",
    syntaxes: [
      { type: "literal", value: "/tellraw" },
      { type: "playerselector", name: "target" },
      { type: "json", name: "message" }
    ]
  },

  {
    name: "testfor",
    aliases: ["testfor"],
    description: "Test for entities matching criteria",
    syntaxes: [
      { type: "literal", value: "/testfor" },
      { type: "entityselector", name: "target" }
    ]
  },

  {
    name: "testforblock",
    aliases: ["testforblock"],
    description: "Test a single block for a type/state",
    syntaxes: [
      { type: "literal", value: "/testforblock" },
      { type: "location", name: "pos" },
      { type: "blocktype", name: "block" },
      { type: "string", name: "data", optional: true }
    ]
  },

  {
    name: "testforblocks",
    aliases: ["testforblocks"],
    description: "Test that two regions contain identical blocks",
    syntaxes: [
      { type: "literal", value: "/testforblocks" },
      { type: "location", name: "begin" },
      { type: "location", name: "end" },
      { type: "location", name: "destination" },
      {
        type: "enum",
        name: "mode",
        optional: true,
        value: [
          { value: "all" },
          { value: "masked" },
          {
            value: "filtered",
            next: [
              { type: "blocktype", name: "filterBlock", optional: true },
              { type: "string", name: "filterData", optional: true }
            ]
          }
        ]
      }
    ]
  },


  {
    name: "tickingarea",
    aliases: ["tickingarea"],
    description: "Manage ticking areas (Bedrock)",
    syntaxes: [
      { type: "literal", value: "/tickingarea" },

      {
        type: "enum",
        name: "subcommand",
        value: [
          {
            value: "add",
            next: [
              {
                type: "location",
                name: "pos1"
              },
              {
                type: "location",
                name: "pos2",
                optional: true
              },
              {
                type: "string",
                name: "name",
                optional: true
              }
            ]
          },
          {
            value: "remove",
            next: [
              {
                type: "string",
                name: "name"
              }
            ]
          },
          {
            value: "list"
          },
          {
            value: "remove_all"
          }
        ]
      }
    ]
  },


  {
    name: "time",
    aliases: ["time"],
    description: "Change or query the time",
    vc_hiperlink: () => visual_command_time(player),
    syntaxes: [
      { type: "literal", value: "/time" },
      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "set",
            next: [
              {
                type: "enum",
                name: "timeType",
                value: [
                  { value: "day" },
                  { value: "night" },
                  { value: "noon" },
                  { value: "midnight" }
                ],
                optional: true
              },
              { type: "int", name: "ticks", optional: true }
            ]
          },
          {
            value: "add",
            next: [
              { type: "int", name: "ticks" }
            ]
          },
          {
            value: "query",
            next: [
              {
                type: "enum",
                name: "queryType",
                value: [
                  { value: "daytime" },
                  { value: "gametime" },
                  { value: "day" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },


  {
    name: "title",
    aliases: ["title"],
    description: "Display titles to players",
    syntaxes: [
      { type: "literal", value: "/title" },
      { type: "playerselector", name: "player" },
      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "title",
            next: [
              { type: "string", name: "text" }
            ]
          },
          {
            value: "subtitle",
            next: [
              { type: "string", name: "text" }
            ]
          },
          {
            value: "actionbar",
            next: [
              { type: "string", name: "text" }
            ]
          },
          {
            value: "times",
            next: [
              { type: "int", name: "fadeIn" },
              { type: "int", name: "stay" },
              { type: "int", name: "fadeOut" }
            ]
          },
          { value: "clear" },
          { value: "reset" }
        ]
      }
    ]
  },

  {
    name: "titleraw",
    aliases: ["titleraw"],
    description: "Display raw JSON titles",
    syntaxes: [
      { type: "literal", value: "/titleraw" },
      { type: "playerselector", name: "player" },
      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "title",
            next: [
              { type: "string", name: "text" }
            ]
          },
          {
            value: "subtitle",
            next: [
              { type: "string", name: "text" }
            ]
          },
          {
            value: "actionbar",
            next: [
              { type: "string", name: "text" }
            ]
          }
        ]
      },
      { type: "json", name: "message" }
    ]
  },

  {
    name: "toggledownfall",
    aliases: ["toggledownfall"],
    description: "Toggle rain/snow",
    syntaxes: [{ type: "literal", value: "/toggledownfall" }]
  },

  {
    name: "camerashake",
    aliases: ["camerashake"],
    description: "Shake the camera for one or more players (Bedrock)",
    syntaxes: [
      { type: "literal", value: "/camerashake" },
      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "start",
            next: [
              { type: "playerselector", name: "targets", optional: true },
              { type: "float", name: "amplitude" },
              { type: "int", name: "durationTicks" },
              { type: "string", name: "source", optional: true }
            ]
          },
          {
            value: "stop",
            next: [
              { type: "playerselector", name: "targets", optional: true }
            ]
          }
        ]
      }
    ]
  },

  {
    name: "list",
    aliases: ["list"],
    cc_hidden: true,
    description: "List players on the server or query server info",
    syntaxes: [
      { type: "literal", value: "/list" }
    ]
  },

  {
    name: "loot",
    aliases: ["loot"],
    description: "Give or spawn loot from a loot table",
    syntaxes: [
      { type: "literal", value: "/loot" },
      {
        type: "enum",
        name: "action",
        value: [
          {
            value: "give",
            next: [
              { type: "string", name: "lootTable" },
              { type: "playerselector", name: "target", optional: true },
              { type: "int", name: "count", optional: true }
            ]
          },
          {
            value: "spawn",
            next: [
              { type: "string", name: "lootTable" },
              { type: "location", name: "pos", optional: true },
              { type: "int", name: "count", optional: true }
            ]
          },
          {
            value: "insert",
            next: [
              { type: "string", name: "lootTable" },
              { type: "location", name: "containerPos" }
            ]
          }
        ]
      }
    ]
  },

  {
    name: "place",
    aliases: ["place"],
    description: "Place an item or block at a position (utility command)",
    syntaxes: [
      { type: "literal", value: "/place" },
      {
        type: "enum",
        name: "what",
        value: [
          {
            value: "block",
            next: [
              { type: "blocktype", name: "block" },
              { type: "location", name: "pos", optional: true },
              {
                type: "enum",
                name: "mode",
                optional: true,
                value: [
                  { value: "replace" },
                  { value: "keep" },
                  { value: "destroy" }
                ]
              }
            ]
          },
          {
            value: "item",
            next: [
              { type: "itemtype", name: "item" },
              { type: "location", name: "pos", optional: true }
            ]
          },
          {
            value: "structure",
            next: [
              { type: "string", name: "structureName" },
              { type: "location", name: "destination", optional: true },
              {
                type: "enum",
                name: "rotation",
                optional: true,
                value: [ { value: "0" }, { value: "90" }, { value: "180" }, { value: "270" } ]
              }
            ]
          }
        ]
      }
    ]
  },

  {
    name: "say",
    aliases: ["say"],
    cc_hidden: true,
    description: "Broadcast a chat message to all players",
    syntaxes: [
      { type: "literal", value: "/say" },
      { type: "string", name: "message" }
    ]
  },

  {
    name: "script",
    aliases: ["script"],
    description: "Debugging, profiling and diagnostics controls for the scripting system (Bedrock)",
    syntaxes: [
      { type: "literal", value: "/script" },

      {
        type: "enum",
        name: "category",
        value: [
          {
            value: "debugger",
            next: [
              {
                type: "enum",
                name: "debuggerAction",
                value: [
                  { value: "listen", next: [{ type: "int", name: "port" }] },
                  { value: "connect", next: [{ type: "string", name: "host", optional: true }, { type: "int", name: "port", optional: true }] },
                  { value: "close" }
                ]
              }
            ]
          },

          {
            value: "profiler",
            next: [
              {
                type: "enum",
                name: "profilerAction",
                value: [
                  { value: "start" },
                  { value: "stop" }
                ]
              }
            ]
          },

          {
            value: "diagnostics",
            next: [
              {
                type: "enum",
                name: "diagnosticsAction",
                value: [
                  { value: "startcapture" },
                  { value: "stopcapture" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  {
    name: "scriptevent",
    aliases: ["scriptevent"],
    description: "Trigger a script event (Bedrock scripting)",
    syntaxes: [
      { type: "literal", value: "/scriptevent" },
      { type: "string", name: "eventName" },
      { type: "entityselector", name: "target", optional: true },
      { type: "json", name: "eventData", optional: true }
    ]
  },

  {
    name: "tell",
    cc_hidden: true,
    aliases: ["tell", "msg", "w"],
    description: "Send a private message to another player (whisper)",
    syntaxes: [
      { type: "literal", value: "/tell" },
      { type: "playerselector", name: "target" },
      { type: "string", name: "message" }
    ]
  },

  {
    name: "transfer",
    aliases: ["transfer"],
    description: "Transfer a player to another server (proxy/bedrock linking)",
    syntaxes: [
      { type: "literal", value: "/transfer" },
      { type: "playerselector", name: "player" },
      { type: "string", name: "address" },
      { type: "int", name: "port", optional: true },
      { type: "string", name: "password", optional: true }
    ]
  },

  {
    name: "wsserver",
    aliases: ["wsserver"],
    description: "Start/stop/query the WebSocket server (dev/admin)",
    syntaxes: [
      { type: "literal", value: "/wsserver" },
      {
        type: "enum",
        name: "action",
        value: [
          { value: "start", next: [{ type: "int", name: "port", optional: true }] },
          { value: "stop" },
          { value: "status" }
        ]
      }
    ]
  }
];

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
   if (event.id === "multiple_menu:data" && (world.isHardcore || version_info.release_type == 0)) {
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
  (world.isHardcore || version_info.release_type == 0)? initialize_multiple_menu() : undefined
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
 CC Commands
-------------------------*/

function registerAllCommands(init) {
  // 1) register dynamic built-in enums
  const enumsDynamic = registerBuiltInDynamicEnums(init);

  // 2) iterate through command_list
  for (const cmd of command_list) {
    if (cmd.cc_hidden) {
      continue;
    }


    // aliases array (fallback: use cmd.name)
    const aliases = Array.isArray(cmd.aliases) && cmd.aliases.length ? cmd.aliases : [cmd.name];

    // build parameter lists from top-level syntaxes (siehe Hinweis oben)
    const { mandatory, optional } = buildParamsFromTopLevel(init, cmd, enumsDynamic);

    // Wenn nach dem Filtern *keine* Parameter übrig sind -> Command ausblenden
    if ((!mandatory || mandatory.length === 0) && (!optional || optional.length === 0)) {
      continue;
    }

    // For each alias we register a separate custom command named com2hard:<alias>
    for (const alias of aliases) {
      const regName = `com2hard:${alias}`;

      const commandDescriptor = {
        name: regName,
        description: cmd.description || "",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false,
        mandatoryParameters: mandatory,
        optionalParameters: optional
      };

      try {
        init.customCommandRegistry.registerCommand(commandDescriptor, (origin, ...args) => {
          system.run(() => {
            const player = origin.sourceEntity;

            function formatArg(v) {
              if (v === null) return "null";
              if (v === undefined) return "undefined";

              const t = typeof v;
              if (t === "string" || t === "number" || t === "boolean") return String(v);

              if (Array.isArray(v)) return v.map(formatArg).join(" ");

              if (t === "object") {
                const x = v.x ?? v.X;
                const y = v.y ?? v.Y;
                const z = v.z ?? v.Z;
                if (x !== undefined || y !== undefined || z !== undefined) {
                  return [x, y, z].filter(v => v !== undefined).map(String).join(" ");
                }

                if (v.hasOwnProperty("id")) {
                  if (typeof v.id === "number") {
                    // Spieler prüfen
                    const player = world.getAllPlayers().find(entity => entity.id === v.id);
                    if (player) return String(player.name);

                    // Entitys
                    const entity = world.getEntity(v.id);
                    if (entity) {
                      return `@e[x=${entity.location.x},y=${entity.location.y},z=${entity.location.z}, r=20, type=!player, c=1]`;
                    }
                  }

                  // Fallback falls nichts gefunden wird
                  return String(v.id);
                }
              }

              return String(v);
            }

            if (!player || player.typeId !== "minecraft:player") return {
                status: CustomCommandStatus.Failure,
                message: "Only players can use this command"
            };

            // kompletten Command bauen
            const argString = args.map(formatArg).join(" ").trim();
            const fullCommand = `/${alias}${argString ? " " + argString : ""}`;
            execute_command(player, fullCommand, player);
          });
        });

      } catch (e) {
        system.run(() => console.warn(`Konnte Befehl ${regName} nicht registrieren:`, e));
      }
    }
  }
}

system.beforeEvents.startup.subscribe((init) => {
  registerAllCommands(init);
});


/*------------------------
 Save Data
-------------------------*/

// Creates or Updates Save Data if not present
system.run(() => {
  let save_data = load_save_data();

  const default_save_data_structure = {utc: undefined, utc_auto: true, functions: []};

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
  const default_player_save_data_structure = () => ({
      id: playerId,
      name: playerName,
      last_unix: Math.floor(Date.now() / 1000),
      gesture: { emote: false, sneak: true, nod: true, stick: true },
      command_history: [],
      quick_run: false,
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
      // player does not exist, create new entry
      print(`player ${playerName} (${playerId}) added!`);

      player_data = default_player_save_data_structure();
      save_data.push(player_data);
  } else {
      // player exists, get their data
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

  if (!(world.isHardcore || version_info.release_type == 0)) {
    return player.sendMessage("§l§4[§cError§4]§r This world is not a hardcore world! Use the native Chat instead!")
  }

  if (version_info.release_type !== 2 && player.playerPermissionLevel === 2) {
    player.sendMessage("§l§7[§f" + ("System") + "§7]§r "+ save_data[player_sd_index].name +" how is your experiences with "+ version_info.version +"? Does it meet your expectations? Would you like to change something and if so, what? Do you have a suggestion for a new feature? Share it at §l"+links[0].link)
    player.playSound("random.pop")
  }

  // Help reminder: how to open the menu
  if (save_data[player_sd_index].last_unix == undefined || save_data[player_sd_index].last_unix > (Math.floor(Date.now() / 1000) + 604800)) {
    if (player.playerPermissionLevel === 2) {
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
        if (system_privileges !== 0) {
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
      if (save_data[idx].gesture.sneak && system_privileges !== 0) {
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
      if (save_data[idx].gesture.emote && system_privileges !== 0) {
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
      if (save_data[idx].gesture.nod && system_privileges !== 0) {
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

function markdownToMinecraft(md) {
  if (typeof md !== 'string') return '';

  // normalize newlines
  md = md.replace(/\r\n?/g, '\n');

  const UNSUPPORTED_MSG = '§o§7Tabelles are not supported! Visit GitHub for this.';

  // helper: map admonition type -> minecraft color code (choose sensible defaults)
  function admonColor(type) {
    const t = (type || '').toLowerCase();
    if (['caution', 'warning', 'danger', 'important'].includes(t)) return '§c'; // red
    if (['note', 'info', 'tip', 'hint'].includes(t)) return '§b'; // aqua
    return '§e'; // fallback: yellow
  }

  // inline processor (handles code spans first, then bold/italic/strike, links/images, etc.)
  function processInline(text) {
    if (!text) return '';

    // tokenise code spans to avoid further processing inside them
    const tokens = [];
    text = text.replace(/(`+)([\s\S]*?)\1/g, (m, ticks, code) => {
      const safe = code.replace(/\n+/g, ' '); // inline code -> single line
      const repl = '§7' + safe + '§r';
      tokens.push(repl);
      return `__MD_TOKEN_${tokens.length - 1}__`;
    });

    // images -> unsupported (replace whole image with message)
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, () => UNSUPPORTED_MSG);

    // links -> keep link text only (no URL)
    text = text.replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1');

    // bold: **text** or __text__ -> §ltext§r
    text = text.replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, '§l$2§r');

    // italic: *text* or _text_ -> §otext§r
    // (do after bold so that **...** won't be partially matched)
    text = text.replace(/(\*|_)(?=\S)([\s\S]*?\S)\1/g, '§o$2§r');

    // strikethrough: ~~text~~ -> use italic+gray as fallback (no §m)
    text = text.replace(/~~([\s\S]*?)~~/g, '§o§7$1§r');

    // simple HTML tags or raw tags -> treat as unsupported (avoid exposing markup)
    if (/<\/?[a-z][\s\S]*?>/i.test(text)) return UNSUPPORTED_MSG;

    // restore code tokens
    text = text.replace(/__MD_TOKEN_(\d+)__/g, (m, idx) => tokens[Number(idx)] || '');

    return text;
  }

  // 1) Replace fenced code blocks (```...```) with unsupported message
  md = md.replace(/```[\s\S]*?```/g, () => UNSUPPORTED_MSG);

  // 2) Replace GitHub-style admonition blocks: ::: type\n...\n:::
  md = md.replace(/::: *([A-Za-z0-9_-]+)\s*\n([\s\S]*?)\n:::/gmi, (m, type, content) => {
    // flatten content lines, then process inline inside
    const inner = processInline(content.replace(/\n+/g, ' ').trim());
    const cap = type.charAt(0).toUpperCase() + type.slice(1);
    return `§l${admonColor(type)}${cap}: ${inner}§r`;
  });

  // now process line-by-line for tables / headings / lists / blockquotes / admonitions-as-blockquotes
  const lines = md.split('\n');
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // trim trailing CR/ spaces
    const raw = line;

    //  ---- detect table: a row with '|' and a following separator row like "| --- | --- |" or "---|---"
    const nextLine = lines[i + 1] || '';
    const isTableRow = /\|/.test(line);
    const nextIsSeparator = /^\s*\|?[:\-\s|]+$/.test(nextLine);
    if (isTableRow && nextIsSeparator) {
      // consume all contiguous table rows
      out.push(UNSUPPORTED_MSG);
      i++; // skip the separator
      while (i + 1 < lines.length && /\|/.test(lines[i + 1])) i++;
      continue;
    }

    //  ---- headings (#, ##, ###) -> §l + content + §r + \n
    const hMatch = line.match(/^(#{1,3})\s*(.*)$/);
    if (hMatch) {
      const content = hMatch[2].trim();
      out.push('§l' + processInline(content) + '§r\n');
      continue;
    }

    //  ---- GitHub-style single-line admonition in > or plain "Caution: ..." at line start
    const admonLineMatch = raw.match(/^\s*(?:>\s*)?(?:\*\*)?(Caution|Warning|Note|Tip|Important|Danger|Info)(?:\*\*)?:\s*(.+)$/i);
    if (admonLineMatch) {
      const type = admonLineMatch[1];
      const content = admonLineMatch[2].trim();
      out.push(`§l${admonColor(type)}${type}: ${processInline(content)}§r`);
      continue;
    }

    //  ---- blockquote lines starting with '>'
    if (/^\s*>/.test(line)) {
      const content = line.replace(/^\s*>+\s?/, '');
      out.push('§o' + processInline(content) + '§r');
      continue;
    }

    //  ---- images or html inline -> unsupported
    if (/^!\[.*\]\(.*\)/.test(line) || /<[^>]+>/.test(line)) {
      out.push(UNSUPPORTED_MSG);
      continue;
    }

    //  ---- unordered list (-, *, +) -> bullet + inline
    if (/^\s*[-*+]\s+/.test(line)) {
      const item = line.replace(/^\s*[-*+]\s+/, '');
      out.push('• ' + processInline(item));
      continue;
    }

    //  ---- ordered list (1. 2. ...) -> bullet as well
    if (/^\s*\d+\.\s+/.test(line)) {
      const item = line.replace(/^\s*\d+\.\s+/, '');
      out.push('• ' + processInline(item));
      continue;
    }

    //  ---- default: process inline formatting
    // empty line -> keep empty
    if (line.trim() === '') {
      out.push('');
      continue;
    }

    out.push(processInline(line));
  }

  // join with newline and return
  return out.join('\n');
}

function toRoman(num) {
  if (num <= 0 || num >= 4000) return ""; // Römer nutzten keine 0 oder Zahlen >= 4000

  const romanNumerals = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1]
  ];

  let result = "";
  for (const [roman, value] of romanNumerals) {
    while (num >= value) {
      result += roman;
      num -= value;
    }
  }
  return result;
}

function humanizeId(id) {
  if (!id) return "";
  // id wie "bane_of_arthropods" -> "Bane of Arthropods"
  const smallWords = new Set(["of","the","and","to","in","by","for","on","with","a","an","or"]);
  const parts = id.replace(/^minecraft:/, "").split("_");
  const words = parts.map((w, idx) => {
    w = w.toLowerCase();
    if (idx > 0 && smallWords.has(w)) return w; // keep small words lowercase (except first)
    return w.charAt(0).toUpperCase() + w.slice(1);
  });
  return words.join(" ");
}

function areEnchantmentsIncompatible(item, e1, e2) {
  if (!item) return false;
  try {
    // Clone the item so we don't change the real one
    const copy = item.clone();
    const enchComp = copy.getComponent("minecraft:enchantable");
    if (!enchComp) return false;

    // erst e1 hinzufügen (Level 1 zum Test)
    try {
      enchComp.addEnchantment({ type: e1, level: 1 });
    } catch (errAdd) {
      // wenn addEnchantment für e1 schon fehlschlägt: dann behandeln wir es als inkompatibel
      // (sollte aber nicht passieren, weil e1 aus kompatiblen Enchants stammt)
      return true;
    }

    // jetzt prüfen ob e2 noch geht
    try {
      const ok = enchComp.canAddEnchantment({ type: e2, level: 1 });
      return !ok;
    } catch (err) {
      // Wenn canAddEnchantment eine Exception wirft, behandeln wir das als inkompatibel
      return true;
    }
  } catch (err) {
    // Bei unerwarteten Fehlern: konservativ annehmen, dass inkompatibel
    return true;
  }
}

function buildEnchantmentCategories(item, compatibleEnchants) {
  const n = compatibleEnchants.length;
  const adj = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (areEnchantmentsIncompatible(item, compatibleEnchants[i], compatibleEnchants[j])) {
        adj[i].push(j);
        adj[j].push(i);
      }
    }
  }

  // connected components
  const seen = new Array(n).fill(false);
  const comps = [];
  for (let i = 0; i < n; i++) {
    if (seen[i]) continue;
    const stack = [i];
    const comp = [];
    seen[i] = true;
    while (stack.length) {
      const u = stack.pop();
      comp.push(compatibleEnchants[u]);
      for (const v of adj[u]) {
        if (!seen[v]) {
          seen[v] = true;
          stack.push(v);
        }
      }
    }
    comps.push(comp);
  }
  return comps;
}

let currentWeather = WeatherType.Clear;

world.afterEvents.weatherChange.subscribe(ev => {
  currentWeather = ev.newWeather;
});

/*------------------------
  Custom Command Helpers
-------------------------*/

function registerBuiltInDynamicEnums(init) {
  const enums = {};

  function safeGetKeys(getAllCandidate, label) {
    try {
      if (!getAllCandidate || typeof getAllCandidate !== "function") {
        system.run(() => console.warn(`${label}.getAll ist nicht vorhanden oder keine Funktion.`));
        return [];
      }
      const all = getAllCandidate(); // synchron aufrufen
      // Wenn eine Hilfsfunktion getKeysFromGetAll existiert, verwende sie
      if (typeof getKeysFromGetAll === "function") {
        const keys = getKeysFromGetAll(all);
        return Array.isArray(keys) ? keys : [];
      }
      // Fallbacks
      if (Array.isArray(all)) return all.map(v => (typeof v === "object" ? (v.value ?? v.name ?? String(v)) : String(v)));
      if (all && typeof all === "object") return Object.keys(all);
      return [];
    } catch (e) {
      system.run(() => console.warn(`Fehler beim Erzeugen der ${label}-enum:`, e));
      return [];
    }
  }

  const effectValues = safeGetKeys(EffectTypes && EffectTypes.getAll, "EffectTypes");
  if (effectValues.length) {
    try {
      init.customCommandRegistry.registerEnum("com2hard:effectType", effectValues);
      enums.effectType = "com2hard:effectType";
    } catch (e) {
      system.run(() => console.warn("registerEnum effectType fehlgeschlagen:", e));
    }
  }

  const enchValues = safeGetKeys(EnchantmentTypes && EnchantmentTypes.getAll, "EnchantmentTypes");
  if (enchValues.length) {
    try {
      init.customCommandRegistry.registerEnum("com2hard:enchantType", enchValues);
      enums.enchantType = "com2hard:enchantType";
    } catch (e) {
      system.run(() => console.warn("registerEnum enchantType fehlgeschlagen:", e));
    }
  }

  const weatherValues = safeGetKeys(WeatherType && WeatherType.getAll, "WeatherType");
  if (weatherValues.length) {
    try {
      init.customCommandRegistry.registerEnum("com2hard:weathertype", weatherValues);
      enums.weathertype = "com2hard:weathertype";
    } catch (e) {
      system.run(() => console.warn("registerEnum weathertype fehlgeschlagen:", e));
    }
  }

  return enums;
}

// --- 2) registerInlineEnum: filtert Einträge mit 'next' heraus, registriert nur echte Werte ---
function registerInlineEnum(init, commandName, paramName, valuesArray) {
  if (!Array.isArray(valuesArray) || valuesArray.length === 0) return null;

  // Filter: entferne Objekte, die ein 'next' Feld besitzen (wie gewünscht)
  const filtered = valuesArray.filter(v => !(v && typeof v === "object" && Object.prototype.hasOwnProperty.call(v, "next")));
  if (filtered.length === 0) return null;

  // Mappe
  const entries = filtered.map(v => { if (v == null) return null; if (typeof v === "string") return v; if (typeof v === "object") return v.value ?? v.name ?? v.id ?? v.key ?? v.text ?? JSON.stringify(v); return String(v); }).filter(Boolean);

  if (entries.length === 0) return null;

  const enumId = `com2hard:${commandName}_${paramName}`;
  try {
    init.customCommandRegistry.registerEnum(enumId, entries);
    return enumId;
  } catch (e) {
    system.run(() => console.warn(`Enum ${enumId} konnte nicht registriert werden:`, e));
    return null;
  }
}

// --- 3) buildParamsFromTopLevel: dynamische Enums werden ausgelassen, wenn nicht registriert ---
function buildParamsFromTopLevel(init, cmd, enumsDynamic) {
  const mandatory = [];
  const optional = [];

  function mapSimpleType(typeStr) {
    switch (typeStr) {
      case "int": return CustomCommandParamType.Integer;
      case "float": return CustomCommandParamType.Float;
      case "string": return CustomCommandParamType.String; // json -> handled separately
      case "bool": return CustomCommandParamType.Boolean;
      case "location": return CustomCommandParamType.Location;
      case "blocktype": return CustomCommandParamType.BlockType;
      case "itemtype": return CustomCommandParamType.ItemType;
      case "entityType": return CustomCommandParamType.EntityType;
      case "entityselector": return CustomCommandParamType.EntitySelector;
      case "playerselector": return CustomCommandParamType.PlayerSelector;
      default:
        return null;
    }
  }

  for (const syn of cmd.syntaxes) {
    if (syn.type === "literal") continue;

    // Wenn das Syntax-Element ein 'next' hat, handelt es sich um verzweigte/nested Syntax,
    // die sich nicht flach in mandatory/optional abbilden lässt -> IGNORIEREN.
    if (syn && Object.prototype.hasOwnProperty.call(syn, "next") && Array.isArray(syn.next) && syn.next.length > 0) {
      system.run(() => console.warn(`Syntax-Element '${syn.name || syn.type}' in command '${cmd.name}' hat 'next' -> wird ignoriert (nicht abbildbar).`));
      continue;
    }

    if (syn.type === "json") {
      const param = { type: CustomCommandParamType.String, name: syn.name || "json", optional: !!syn.optional };
      (param.optional ? optional : mandatory).push(param);
      continue;
    }

    // Special: dynamische enums - nur hinzufügen, wenn enumsDynamic die registrierte Enum-ID liefert.
    if (syn.type === "effecttype" || syn.type === "enchanttype" || syn.type === "weathertype") {
      const enumKey = enumsDynamic && enumsDynamic[syn.type];
      if (enumKey) {
        const param = { type: CustomCommandParamType.Enum, name: syn.name, enumName: enumKey, optional: !!syn.optional };
        (param.optional ? optional : mandatory).push(param);
        continue;
      } else {
        // **IGNORIERE** den Parameter wenn die dynamische enum nicht verfügbar ist (wie 'next' ungenutzt).
        system.run(() => console.warn(`Dynamische enum '${syn.type}' nicht vorhanden -> Parameter '${syn.name}' wird zu Unbekannt.`));
      }
    }

    // inline enums
    if (syn.type === "enum" && syn.value) {
      const enumId = registerInlineEnum(init, cmd.name, syn.name || "enum", syn.value);
      if (!enumId) {
        // enum wurde herausgefiltert -> Parameter ignorieren
        system.run(() => console.log(`Inline-enum für ${cmd.name}.${syn.name} wurde herausgefiltert -> kein Parameter.`));
        continue;
      }
      const param = { type: CustomCommandParamType.Enum, name: enumId, optional: !!syn.optional };
      (param.optional ? optional : mandatory).push(param);
      continue;
    }

    const mapped = mapSimpleType(syn.type);
    if (mapped != null) {
      const param = { type: mapped, name: syn.name, optional: !!syn.optional };
      (param.optional ? optional : mandatory).push(param);
      continue;
    }

    // Unbekannter Typ: fallback zu String
    const param = { type: CustomCommandParamType.String, name: syn.name || syn.type, optional: !!syn.optional };
    (param.optional ? optional : mandatory).push(param);
    system.run(() => console.warn(`Unbekannter param type '${syn.type}' bei command '${cmd.name}' -> als String registriert.`));
  }

  return { mandatory, optional };
}


/*------------------------
 Command fixing helpers
-------------------------*/

function levenshtein(a, b) {
  const dp = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

function findClosest(input, list, typeName = "") {
  if (!list || list.length === 0) {
    print(`[DEBUG] Liste für Typ "${typeName}" ist leer!`);
    return null;
  }
  let closest = list[0];
  let minDist = levenshtein(input.toLowerCase(), closest.toLowerCase());
  for (const item of list) {
    const dist = levenshtein(input.toLowerCase(), item.toLowerCase());
    if (dist < minDist) {
      minDist = dist;
      closest = item;
    }
  }
  print(`[DEBUG] findClosest: "${input}" -> "${closest}" (Typ: ${typeName})`);
  return closest;
}

function fixSelector(input) {
  const validSelectors = ["@a", "@r", "@e", "@p", "@s"];
  if (validSelectors.includes(input)) {
    print(`[DEBUG] Selector "${input}" is in ${JSON.stringify(validSelectors)}.`);
    return input;
  }
  const playerNames = Array.from(world.getAllPlayers()).map(p => p.name);
  print(`[DEBUG] Available players: ${playerNames.join(", ")}`);
  const closestPlayer = findClosest(input, playerNames, "playerselector/entityselector");
  return closestPlayer || input;
}

function isValidLocation(input) {
  const parts = input.split(" ");
  if (parts.length !== 3) return false;
  return parts.every(p => /^~?$/.test(p) || !isNaN(parseFloat(p)));
}

function isValidJson(input) {
  const stack = [];
  const pairs = { "{": "}", "[": "]", "(": ")", '"': '"' };
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === "\\" && i + 1 < input.length) { i++; continue; }
    if ("{[(\"".includes(char)) stack.push(char);
    else if ("}])\"".includes(char)) {
      if (stack.length === 0) return false;
      const last = stack.pop();
      if (pairs[last] !== char) return false;
    }
  }
  return stack.length === 0;
}

function getKeysFromGetAll(getAllResult) {
  if (Array.isArray(getAllResult)) {
    return getAllResult.map(e => (e && e.id) ? e.id : e);
  }
  return Object.keys(getAllResult || {});
}

function fixArgument(typeDef, input) {
  const typeName = (typeof typeDef === "string")
    ? typeDef.toLowerCase()
    : ((typeDef && (typeDef.name || typeDef.type)) || "").toLowerCase();

  console.log(`[DEBUG] fixArgument: Typ="${typeName}" Input="${input}"`);

  const extractStrings = list => {
    if (!list) return [];
    if (Array.isArray(list)) {
      return list.map(e => {
        if (typeof e === "string") return e;
        if (e?.getName) try { return e.getName(); } catch(_) { return null; }
        return e?.id || e?.name || e?.value?.value || e?.value || null;
      }).filter(Boolean);
    }
    return Object.keys(list || {});
  };

  const safeNumber = (v, fallback) => Number.isFinite(+v) ? v : fallback;
  const stripMinecraft = s => (typeof s === "string") ? s.replace(/^minecraft:/i, "") : s;

  switch (typeName) {
    case "literal": {
      const exp = typeDef?.value || typeDef?.values || typeDef?.expected;
      let raw = String(input), hadSlash = raw.startsWith("/");
      if (hadSlash) raw = raw.slice(1);
      if (Array.isArray(exp) && exp.length) {
        const corrected = findClosest(raw, exp.map(v => (v?.value ?? v)), "literal");
        return hadSlash ? `/${corrected}` : corrected;
      }
      return input;
    }
    case "string":   return /\s/.test(input) ? `"${input}"` : input;
    case "int":      return safeNumber(input, "0");
    case "float":    return safeNumber(input, "0.0");
    case "bool":     return ["true","false"].includes(input?.toLowerCase()) ? input.toLowerCase() : "false";
    case "location": return isValidLocation(input) ? input : "~ ~ ~";

    case "blocktype":   return findClosest(input, extractStrings(BlockTypes.getAll()), "blocktype");
    case "itemtype": {
      const all = [...extractStrings(ItemTypes.getAll()), ...extractStrings(BlockTypes.getAll())];
      return findClosest(input, [...new Set(all)], "itemtype");
    }
    case "entitytype":  return findClosest(input, extractStrings(EntityTypes.getAll()), "entitytype");

    case "effecttype": {
      // Kandidaten und Input ohne "minecraft:" vergleichen => Ergebnis ohne Prefix zurückgeben
      const keys = extractStrings(EffectTypes.getAll()).map(k => stripMinecraft(k));
      const inp = stripMinecraft(String(input));
      return findClosest(inp, keys, "effecttype");
    }

    case "enchanttype": return findClosest(input, extractStrings(EnchantmentTypes.getAll()), "enchanttype");
    case "weathertype": return findClosest(input, extractStrings(WeatherType.getAll()), "weathertype");

    case "playerselector":
    case "entityselector": return fixSelector(input);

    case "enum": {
      const vals = (typeDef?.value || []).map(v => v?.value ?? v);
      return findClosest(input, vals, "enum");
    }
    case "json": return isValidJson(input) ? input : "{}";
    default:     return input;
  }
}

function fixSyntax(parts, syntaxList, index = 0) {
  const fixedParts = [];
  let fixAvailable = false;

  for (let i = 0; i < syntaxList.length && index < parts.length; i++) {
    const syntax = syntaxList[i];
    const part = parts[index];

    if (!syntax) {
      fixedParts.push(part);
      index++;
      continue;
    }

    let fixed = fixArgument(syntax.type, part);
    if (fixed !== part) fixAvailable = true;
    fixedParts.push(fixed);
    index++;

    // Prüfe verschachtelte next-Optionen
    if (syntax.next && syntax.next.length > 0 && index < parts.length) {
      const { fixedParts: nestedParts, fixAvailable: nestedFix } = fixSyntax(parts.slice(index), syntax.next, 0);
      fixedParts.push(...nestedParts);
      if (nestedFix) fixAvailable = true;
      index += nestedParts.length;
    }
  }

  return { fixedParts, fixAvailable, index };
}

function correctCommand(inputCommand) {
  print(`[DEBUG] Eingabe-Command: "${inputCommand}"`);

  const trimmed = inputCommand.trim();
  const hadLeadingSlash = trimmed.startsWith("/");

  // entferne genau ein führendes "/" (falls vorhanden) bevor wir splitten
  const withoutSlash = trimmed.replace(/^\//, "");
  const parts = withoutSlash.split(/\s+/);

  const cmdLiteral = parts[0]; // jetzt ohne "/"

  // Command-Namen / Alias via Levenshtein
  const commandNames = command_list.map(c => c.name).concat(command_list.flatMap(c => c.aliases || []));
  const closestCommandName = findClosest(cmdLiteral, commandNames, "command");
  const command = command_list.find(c => c.name === closestCommandName || (c.aliases || []).includes(closestCommandName));

  if (!command) return { fix_available: false, command: inputCommand };

  print(`[DEBUG] Gefundenes Command: "${command.name}"`);

  // Ersetze das erste Token durch den 'korrekten' Command-Namen (wichtig!)
  parts[0] = command.name;

  const { fixedParts, fixAvailable } = fixSyntax(parts, command.syntaxes);
  const fixedCommand = (hadLeadingSlash ? "/" : "") + fixedParts.join(" ");

  print(`[DEBUG] Korrigierter Command: "${fixedCommand}" fix_available=${fixAvailable}`);

  // vc_hiperlink hinzufügen, wenn vorhanden
  const result = { fix_available: fixAvailable, command: fixedCommand };
  if (command.vc_hiperlink !== undefined) {
    result.vc_hiperlink = command.vc_hiperlink;
  }

  return result;
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
 Visual Command Helpers
-------------------------*/

function anyplayerHasEffect() {
  for (const player of world.getAllPlayers()) {
    if (player.getEffects().length > 0) {
      return true;
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

function getCompatibleEnchantmentTypes(item) {
  if (!item) return [];

  // Enchantable-Component (gibt undefined wenn nicht vorhanden)
  let enchantable;
  try {
    enchantable = item.getComponent("minecraft:enchantable");
  } catch (err) {
    // Falls getComponent selbst Fehler wirft (selten): keine kompatiblen Enchants
    return [];
  }

  if (!enchantable) return [];

  // Alle EnchantmentTypes holen und sortieren (optional)
  const all = EnchantmentTypes.getAll().sort((a, b) => a.id.localeCompare(b.id));
  const compatible = [];

  for (const e of all) {
    try {
      // Test-Objekt: als 'type' das EnchantmentType-Objekt, level 1 verwenden
      const testEnchantment = { type: e, level: 1 };

      // canAddEnchantment kann Exceptions werfen (unknown id, level oob) — deshalb try/catch
      if (enchantable.canAddEnchantment(testEnchantment)) {
        compatible.push(e);
      }
    } catch (err) {
      // still ignore: wenn canAddEnchantment scheitert, ist das Enchant unbrauchbar für dieses Item
      // optional: world.say / print für Debugging
    }
  }

  return compatible;
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

    form.label("Functions");
    form.label("§7Comming soon")
    form.divider();
  }

  // Button: Commands & History
  if ((world.isHardcore || version_info.release_type == 0)) {
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
          execute_command(player, c.command)
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

    form.button("Visual commands", "textures/ui/controller_glyph_color_switch");
    actions.push(() => {
      visual_command(player);
    });
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

  form.button(player.name+"\n§o[...] "+search_term+" [...]", player.playerPermissionLevel === 2? "textures/ui/op" : "textures/ui/permissions_member_star"); // "search_term" here shut be prof rather the actuel term
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
        execute_command(player, entry.command, player);
      } else {
        command_menu(player, entry.command);
      }
    });
  });

  form.divider();
  form.button("");
  actions.push(() => main_menu(player));

  form.show(player).then(response => {
    if (response.selection === undefined) return -1;
    if (actions[response.selection]) actions[response.selection]();
  });
}

function command_menu(player, command) {
  let form = new ModalFormData();
  let save_data = load_save_data();

  const playerNames = ["Server", ...world.getAllPlayers().map(p => p.name)];
  if (!playerNames.includes(player.name)) playerNames.unshift(player.name);

  form.title("Command");
  form.textField("Command", "e.g. /say hallo world!", { defaultValue: command });
  form.dropdown(
    "Execute by",
    playerNames,
    { defaultValueIndex: playerNames.indexOf(player.name), tooltip: "If you select other players it will run also at that location.\n§7§oNote: The Server doesn't have some properties!" }
  );

  form.show(player).then(response => {
    if (response.canceled) return -1;
    if (!response.formValues[0]) return visual_command(player);

    let cmd = response.formValues[0].startsWith("/")
      ? response.formValues[0]
      : "/" + response.formValues[0];

    let targetIdentity;
    if (response.formValues[1] === 0) {
      targetIdentity = "server";
    } else {
      const targetName = playerNames[response.formValues[1]];
      targetIdentity = world.getAllPlayers().find(p => p.name === targetName);
    }

    execute_command(player, cmd, targetIdentity);
  });
}


/*------------------------
 execute Command
-------------------------*/

async function execute_command(source, cmd, target = "server") {
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === source.id);
  let can_run = true;

  let matchedBlock = null;
  for (const block of block_command_list) {
    if (cmd.toLowerCase().includes(block.command_prefix.toLowerCase())) {
      if (!matchedBlock || block.command_prefix.length > matchedBlock.command_prefix.length) {
        matchedBlock = block;
      }
    }
  }

  if (matchedBlock && matchedBlock.rating > 0 && world.isHardcore) {
    can_run = await new Promise(resolve => {
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
        actions.push(() => resolve(true));  // Spieler bestätigt
      }

      form.button2(""); // Cancel
      actions.push(() => resolve(false)); // Spieler bricht ab

      form.show(source).then((response_2) => {
        if (response_2.selection === undefined) return -1;
        else if (actions[response_2.selection]) actions[response_2.selection]();
      });
    });

    if (!can_run) return command_menu(source, cmd); // Abbrechen, falls Spieler nein sagt
  }

  try {
    let result = target === "server"
      ? world.getDimension("overworld").runCommand(cmd)
      : target.runCommand(cmd);

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
    source.sendMessage(success ? "Command executed" : "§cCommand didn't execute");
    return success;

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
    command_menu_result_e(source, e.message, cmd);
    source.sendMessage("§c" + e.message);
    return false;
  }
}

function command_menu_result_e(player, message, command) {
  let form = new ActionFormData();
  let actions = [];
  let suggestion = correctCommand(command) // Is disabled because it is not good enough yet

  form.title("Command Result");

  const errorSnippet = extractErrorSnippet(message);

  const highlightedCommand = highlightErrorInCommand(command, errorSnippet);
  form.body("Command:\n§o§7" + highlightedCommand);
  form.label("§rFailed with:\n§c" + message)

  if (suggestion && suggestion.fix_available) {
    form.label("Did you mean:\n§a§o§7" + suggestion.command);
  }

  if (suggestion && suggestion.fix_available) {
    form.divider();
    form.button("Use suggestion");
    actions.push(() => {
      execute_command(player, suggestion.command, player);
    });
  }

  if (suggestion && suggestion.fix_available && suggestion.vc_hiperlink !== undefined) {
    form.button("Visual command");
    actions.push(() => {
      suggestion.vc_hiperlink(player);
    });
    form.divider();
  }


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
  let save_data = load_save_data()
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);


  // Zwei Sammlungen: empfohlen und normal
  const recommendedEntries = [];
  const normalEntries = [];

  // Hilfsfunktion zum Registrieren eines Buttons (wird noch nicht ins Form eingefügt)
  function addEntry(label, icon, actionFn, recommended = false) {
    const entry = { label, icon, actionFn };
    if (recommended) recommendedEntries.push(entry);
    else normalEntries.push(entry);
  }

  form.title("Visual commands");
  form.body("Select a command!");

  // --- Enchant ---
  for (const p of world.getAllPlayers()) {
    const item = p.getComponent("minecraft:inventory")?.container?.getItem(p.selectedSlotIndex);
    if (!item) continue;

    const compatibleEnchants = getCompatibleEnchantmentTypes(item);
    if (!(compatibleEnchants.length > 0)) continue;

    addEntry("Enchant", "textures/items/book_enchanted", () => visual_command_enchant(player), p.name === player.name);
    break;
  }

  // --- Gamerule ---
  if (version_info.release_type !== 2) {
    addEntry("Gamerule", "textures/ui/icon_iron_pickaxe",
      () => { if (save_data[player_sd_index].quick_run) visual_command_gamerule(player); else visual_command_gamerule_quick_run(player); },
      false
    );
  }

  // --- Run via. Text box ---

  addEntry("Type a command", "textures/ui/chat_send",
    () => { command_menu(player); },
    false
  );



  // --- Effect: action hängt von anyplayerHasEffect() ab; markiere empfohlen wenn Effekte vorhanden sind ---
  const effectHas = anyplayerHasEffect();
  addEntry("Effect", "textures/ui/absorption_effect",
    () => { if (effectHas) visual_command_effect_select(player); else visual_command_effect_add(player); },
    player.getEffects().length > 0
  );

  // --- Summon ---
  addEntry("Summon", "textures/items/spawn_eggs/spawn_egg_agent", () => all_EntityTypes(player), false);

  // --- Give ---
  if (version_info.release_type == 0) {
    addEntry("Give", "textures/ui/recipe_book_icon", () => all_ItemTypes(player), false);
  }

  // --- Time ---
  addEntry("Time", "textures/items/clock_item", () => visual_command_time(player), !(world.getTimeOfDay() < 12000));

  // --- Weather ---
  addEntry("Weather", "textures/ui/cloud_only_storage", () => visual_command_weather(player), currentWeather !== WeatherType.Clear);


  recommendedEntries.sort((a, b) => a.label.localeCompare(b.label));
  normalEntries.sort((a, b) => a.label.localeCompare(b.label));

  if (recommendedEntries.length > 0) {
    form.label("Recommended");
    for (const e of recommendedEntries) {

      e.icon? form.button(e.label, e.icon) : form.button(e.label);
      actions.push(e.actionFn);
    }
    form.divider();
    form.label("More commands");
  }


  for (const e of normalEntries) {
    e.icon? form.button(e.label, e.icon) : form.button(e.label);
    actions.push(e.actionFn);
  }

  form.divider();
  form.button("");
  actions.push(() => main_menu(player));

  form.show(player).then((response) => {
    if (response.selection === undefined) {
      return -1;
    }
    const idx = response.selection;
    if (actions[idx]) {
      actions[idx]();
    }
  });
}

/*------------------------
 visual_command: Gamerule
-------------------------*/

function visual_command_gamerule_quick_run(player) {
  let form = new MessageFormData();
  let actions = [];
  let save_data = load_save_data()
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Quick run?");
  form.body("You must enable Quick run to continue!");

  form.button1("§aEnable")
  form.button2("");

  // Formular anzeigen
  form.show(player).then((response) => {
      if (response.selection == undefined) {
          return -1;
      }
      if (response.selection == 0) {
        save_data[player_sd_index].quick_run = true
        update_save_data(save_data)
        visual_command_gamerule(player)
      } else {
        visual_command(player)
      }
  });
}

function visual_command_gamerule(player) {
  let form = new ModalFormData();
  let actions = [];

  form.title("Visual commands - gamerule");

  const controls = [];

  // Add controls to form
  gamerules.forEach((g) => {
    const current = world.gameRules[g.key];

    if (g.type === "boolean") {
      form.toggle(g.key, { defaultValue: !!current, tooltip: g.tooltip });
      controls.push({ key: g.key, type: "boolean" });
    } else if (g.type === "slider") {
      const def = typeof current === "number" ? current : g.min;
      form.slider(g.key, g.min, g.max, { defaultValue: Number(def), tooltip: g.tooltip, valueStep: g.step ?? 1 });
      controls.push({ key: g.key, type: "number", input: "slider" });
    } else if (g.type === "numberText") {
      const defStr = (typeof current !== "undefined" && current !== null) ? String(current) : "";
      form.textField(g.key, "Enter a number", { defaultValue: defStr, tooltip: g.tooltip });
      controls.push({ key: g.key, type: "number", input: "text" });
    }
  });

  // Show form & apply changes
  form.show(player).then((response) => {
    if (response.canceled) {
      return;
    }

    const values = response.formValues;
    const changedRules = [];

    for (let i = 0; i < controls.length; i++) {
      const c = controls[i];
      const oldValue = world.gameRules[c.key];
      let newValue = values[i];

      if (c.type === "boolean") {
        newValue = Boolean(newValue);
        if (oldValue !== newValue) {
          changedRules.push({ key: c.key, value: newValue.toString() });
        }
      } else if (c.type === "number") {
        if (c.input === "slider") {
          newValue = Number(newValue);
          if (oldValue !== newValue) {
            changedRules.push({ key: c.key, value: newValue.toString() });
          }
        } else {
          const parsed = parseInt(String(newValue), 10);
          if (!Number.isNaN(parsed) && oldValue !== parsed) {
            changedRules.push({ key: c.key, value: parsed.toString() });
          } else if (Number.isNaN(parsed)) {
            player.sendMessage(`§cInvalid value for ${c.key}: ${newValue} (skipped)`);
          }
        }
      }
    }

    if (changedRules.length === 0) {
      return;
    }

    // Run commands sequentially for each changed gamerule:
    // command syntax: gamerule <name> <value>
    (async () => {
      for (const rule of changedRules) {
        const cmd = `gamerule ${rule.key} ${rule.value}`;
        try {
          execute_command(player, cmd, player)
        } catch (e) {
          player.sendMessage(`§cFailed to set ${rule.key}: ${e.message ?? e}`);
        }
      }
    })();
  });
}

/*------------------------
 visual_command: Enchant
-------------------------*/

function visual_command_enchant(player) {
  let form = new ActionFormData();
  let actions = [];

  form.title("Visual commands - enchant");
  form.body("Select a vailed Item!");

  world.getAllPlayers().forEach(p => {
      const item = p.getComponent("minecraft:inventory")?.container?.getItem(p.selectedSlotIndex);
      if (!item) return;

      const compatibleEnchants = getCompatibleEnchantmentTypes(item);
      if (!(compatibleEnchants.length > 0)) return;

      form.button({ rawtext: [{ translate: "item." + item.typeId.replace(/^[^:]+:/, "") + ".name" }, {text: `\n(${p.name})`}]});
      actions.push(() => {
        visual_command_enchant_type(player, p, item)
      });
  });


  form.divider()
  form.button("");
  actions.push(() => {
      return visual_command(player);
  });

  // Formular anzeigen
  form.show(player).then((response) => {
      if (response.selection == undefined) {
          return -1;
      }
      if (response.selection !== undefined && actions[response.selection]) {
          actions[response.selection]();
      }
  });
}

function visual_command_enchant_type(viewing_player, selected_player, item) {
  let form = new ActionFormData();
  let actions = [];

  // Kompatible Enchants holen
  const compatibleEnchants = getCompatibleEnchantmentTypes(item);

  form.title("Visual commands - enchant");
  form.body({ rawtext: [{text: "Select an enchantment for: "}, { translate: "item." + item.typeId.replace(/^[^:]+:/, "") + ".name" }, {text: " (possible: " + compatibleEnchants.length + ")"}]});

  let save_data = load_save_data();
  const player_sd_index = save_data.findIndex(e => e.id === viewing_player.id);

  // Kategorien bilden (connected components basierend auf Inkompatibilitäten)
  const categories = buildEnchantmentCategories(item, compatibleEnchants);

  // Für jede Kategorie: Buttons hinzufügen; zwischen Kategorien divider einfügen
  categories.forEach((cat, ci) => {
    if (ci > 0) form.divider(); // trennt Kategorien

    // Optional: wenn Kategorie mehr als 1 Element hat, können wir einen kleinen Gruppentext
    // (ActionForm hat keine echte section label, daher könnten wir z.B. den ersten Button präfixen).
    for (const e of cat) {
      const label = humanizeId(e.id) + (e.maxLevel > 1 ? " " + toRoman(e.maxLevel) : "");
      form.button(label);
      actions.push(() => {
        const command = `/enchant "${selected_player.name}" ${e.id} ` + (e.maxLevel > 1 ? e.maxLevel : "");

        if (save_data[player_sd_index].quick_run) {
          (execute_command(viewing_player, command, viewing_player) && getCompatibleEnchantmentTypes(item).length > 0)? visual_command_enchant_type(viewing_player, selected_player, selected_player.getComponent("minecraft:inventory")?.container?.getItem(selected_player.selectedSlotIndex)) : undefined

        } else {
          command_menu(viewing_player, command);
        }
      });
    }
  });

  form.divider();
  form.button("");
  actions.push(() => { visual_command_enchant(viewing_player); });

  form.show(viewing_player).then((response) => {
    if (response.selection == undefined) return -1;
    if (actions[response.selection]) actions[response.selection]();
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

  for (const selected_player of world.getAllPlayers()) {
    for (const effectType of EffectTypes.getAll()) {
      if (player.getEffect(effectType)) {
        form.button(selected_player.name, "textures/ui/lan_icon");
        actions.push(() => {
          return visual_command_effect_clear_config(player, selected_player)
        });
        break;
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
      ? execute_command(player, command, player)
      : command_menu(player, command);
  }

  if (EffectTypes.getAll().filter(e => target.getEffect(e)).length > 1) {
    form.button("All effects", "textures/ui/store_sort_icon");
    actions.push(() => {
      const command = `/effect "${target.name}" clear`;

      save_data[player_sd_index].quick_run
        ? execute_command(player, command, player)
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
          ? execute_command(player, command, player)
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
        form.button(humanizeId(id), icon);
      } else {
        form.button(humanizeId(id));
      }
      actions.push(() => visual_command_effect_config(player, id));
    }
  });

  form.divider()
  form.button("");
  actions.push(() => {
    if (anyplayerHasEffect()) {
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
  form.title(humanizeId(id) + " - config");

  const allplayers = world.getAllPlayers();
  const playerNames = allplayers.map(p => p.name);
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
      ? execute_command(player, command, player)
      : command_menu(player, command);
    });

}

/*------------------------
 visual_command: Give
-------------------------*/

function all_ItemTypes(player) {
  let form = new ActionFormData()
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
  let actions = []

  form.title("Visual commands - summon");
  form.body("What do you want to spawn?");

  ItemTypes.getAll()
  .sort((a, b) => a.id.localeCompare(b.id))
  .forEach(e => {

    const id = e.id.replace(/^minecraft:/, "");

    // Deletes all entries that are on the blocklist!
    if (!entity_blocklist.find(entity => entity.id == id)) {
      form.button(id);

      actions.push(() => save_data[player_sd_index].quick_run
        ? execute_command(player, "give \""+player.name+"\" " + id, player)
        : command_menu(player, "give \""+player.name+"\" " + id)
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
        ? execute_command(player, "summon " + id, player)
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
      ? execute_command(player, opt.cmd, player)
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
 visual_command: Weather
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
      ? execute_command(player, opt.cmd, player)
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
  if (player.playerPermissionLevel === 2) {
    form.label("Multiplayer");

    // Button 3: Permission
    const players = world.getAllPlayers();
    const ids = players.map(p => p.id);
    const names = save_data.slice(1).sort((a, b) =>
      ids.includes(a.id) && !ids.includes(b.id) ? -1 :
      ids.includes(b.id) && !ids.includes(a.id) ? 1 : 0
    ).map(e => e.name);

    if (names.length > 1) {
      form.button("Permission\n" + (() => {
        return names.length > 1 ? names.slice(0, -1).join(", ") + " u. " + names[names.length - 1] : names.join(", ");
      })(), "textures/ui/op");
      actions.push(() => {
        settings_rights_main(player)
      });
    }


    // Button 4: UTC
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
  if (version_info.release_type == 0 && player.playerPermissionLevel === 2) {
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

  if (!show_ip && server_ip && player.playerPermissionLevel === 2) {
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
  form.body(markdownToMinecraft(version.body))


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

  form.button("§cRemove \"save_data\"");
  actions.push(() => {
    world.setDynamicProperty("com2hard:save_data", undefined);
    return close_world()
  });


  form.button("§cClose Server");
  actions.push(() => {
    return close_world()
  });

  form.button("§9Test command fixer");
  actions.push(() => {
    return test_fix(player)
  })

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

function test_fix(player) {
  let form = new ModalFormData()
    .title("Command fixer test")
    .textField("Enter a command to fix", "e.g. /give @s diamond_sword 1")
  form.show(player).then(res => {
    if (res.formValues == undefined) {
      return -1
    }
    const input = res.formValues[0];
    print("Input: "+ input);
    print("Output: "+ JSON.stringify(correctCommand(input)));
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
        : `${entry.name ?? `player ${idx}`} [${entry.id ?? idx}]`;
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

  form.textField("player name", player.name);
  form.textField("player id", UniqueId);
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

function settings_rights_main(player) {
  let form = new ActionFormData();
  let save_data = load_save_data();

  form.title("Permissions");
  form.body("Select a player!");

  const players = world.getAllPlayers();
  const playerMap = new Map(players.map(p => [p.id, p])); // Schnelle Lookup-Map

  let newList = save_data.slice(1); // Eintrag 0 ignorieren

  const now = Math.floor(Date.now() / 1000);

  newList.sort((a, b) => {
    const aOnline = playerMap.has(a.id);
    const bOnline = playerMap.has(b.id);

    const aOp = aOnline ? playerMap.get(a.id)?.playerPermissionLevel === 2 : false;
    const bOp = bOnline ? playerMap.get(b.id)?.playerPermissionLevel === 2 : false;

    const aLastSeen = now - a.last_unix;
    const bLastSeen = now - b.last_unix;

    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    // Online-Status priorisieren
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;

    // Beide online
    if (aOnline && bOnline) {
      if (aOp && !bOp) return -1;
      if (!aOp && bOp) return 1;
      return aName.localeCompare(bName);
    }

    // Beide offline → zuletzt online zuerst
    return bLastSeen - aLastSeen;
  });

  newList.forEach(entry => {
    const isOnline = playerMap.has(entry.id);
    let displayName = entry.name;

    if (isOnline) {
      displayName += "\n§a(online)§r";
      const onlineplayer = playerMap.get(entry.id);
      if (onlineplayer?.playerPermissionLevel === 2) {
        form.button(displayName, "textures/ui/op");
      } else {
        form.button(displayName, "textures/ui/permissions_member_star");
      }
    } else {
      displayName += "\n§o(last seen " + getRelativeTime(now - entry.last_unix) + " ago)§r";
      form.button(displayName, "textures/ui/lan_icon");
    }
  });

  form.divider();
  form.button(""); // Zurück-Button

  form.show(player).then((response) => {
    if (response.selection === undefined) return -1;

    if (response.selection === newList.length) {
      return settings_main(player);
    } else {
      return settings_rights_data(player, newList[response.selection]);
    }
  });
}

function settings_rights_data(viewing_player, selected_save_data) {
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

          body_text += "Online: yes §7(for " + getRelativeTime(Math.floor(Date.now() / 1000) - selected_save_data.last_unix) + ")§r\n";
          body_text += "Permission level: "+ selected_player.playerPermissionLevel +"\n";
          body_text += "Platform: " + selected_player.clientSystemInfo.platformType + "\n";
          body_text += "Graphics mode: " + selected_player.graphicsMode + "\n";
          body_text += memory_text + "\n";
          body_text += input_text + "\n";

      } else {
          body_text += "Online: yes §7(for " + getRelativeTime(Math.floor(Date.now() / 1000) - selected_save_data.last_unix) + ")§r\n";
      }

  } else {
      body_text += "Online: no §7(last seen " + getRelativeTime(Math.floor(Date.now() / 1000) - selected_save_data.last_unix) + " ago)§r\n";
  }


  let actions = [];

  if (selected_save_data.id !== viewing_player.id) {
    form.title("Edit "+ selected_save_data.name +"'s permission");

    if (selected_player) {
      if (selected_player.playerPermissionLevel === 2) {
        form.label("§7This player is currently op! To change that open Minecraft's player Permission page.§r\n");

        /* Minecraft Bug: Op command doesn't via scripts
        form.button("§cMake deop");
        actions.push(() => {
          let player_sd_index = save_data.findIndex(entry => entry.id === selected_save_data.id)
          viewing_player.runCommand(`deop ${selected_save_data.name}`);
          update_save_data(save_data);
          return settings_rights_data(viewing_player, save_data[player_sd_index])
        });
        */
      } else {
        form.label("§7This player is currently not op! To change that open Minecraft's player Permission page.§r\n");

        form.button("Manage commands", "textures/ui/chat_send");
        actions.push(() => {
          settings_rights_manage_command(viewing_player, selected_save_data);
        });

        /* Minecraft Bug: Op command doesn't via scripts
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
              viewing_player.runCommand(`op ${selected_save_data.name}`);
              selected_save_data = save_data[player_sd_index]
              update_save_data(save_data);
            }

            return settings_rights_data(viewing_player, selected_save_data)
          });
        });
        */
      }
    } else {
      body_text += "\n";
    }
  } else {
    form.title("Edit your permission");
    body_text += "\n";
  }

  form.body(body_text);

  form.button("Manage save data", "textures/ui/storageIconColor");
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

function settings_rights_manage_command(viewing_player, selected_save_data) {
  let save_data = load_save_data()
  let actions = [];

  const form = new ActionFormData()
    .title(`Commands for ${selected_save_data.name}`)
    .body("§aAllowed commands (2):")
    .divider();

  form.button("/fill")
  form.button("/clone")


  form.label("§cResricted commands (0):");
  form.divider();

  form.button("/fill")
  form.button("/clone")


  form.divider();
  form.button("");
  actions.push(() => {
    settings_rights_data(viewing_player, selected_save_data);
  });

  form.show(viewing_player).then(response => {
    if (response.selection == undefined ) {
      return -1
    }


  });
}

function settings_rights_manage_sd(viewing_player, selected_save_data) {
  let save_data = load_save_data()
  const actions = [];
  const form = new ActionFormData()
    .title(`${selected_save_data.name}'s save data`)
    .body("Select an option!")


  form.button("§dReset save data")
  actions.push(() => {
    handle_data_action(true, false, viewing_player, selected_save_data);
  });

  form.button("§cDelete save data");
  actions.push(() => {
    handle_data_action(false, true, viewing_player, selected_save_data);
  });


  if (version_info.release_type == 0) {
    form.divider()
    form.button("§eOpen in SD Editor");
    actions.push(() => {
      debug_sd_editor(
        viewing_player,
        () => debug_sd_editor(viewing_player, () => debug_main(viewing_player), []),
        [save_data.findIndex(entry => entry.id === selected_save_data.id)]
      );
    });
  }

  form.divider()
  form.button("");
  actions.push(() => {
    settings_rights_data(viewing_player, selected_save_data);
  });

  form.show(viewing_player).then(response => {
    if (response.selection == undefined ) {
      return -1
    }
    const action = actions[response.selection];
    if (action) action();
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
  // Ein Objekt, um die vorherige Eintragsanzahl jedes Spielers zu speichern
  let previous_entry_counts = {};

  while (true) {
    gesture_nod()
    gesture_jump()
    gesture_emote()

    let save_data = load_save_data();

    world.getAllPlayers().forEach(player => {
      let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

      if (player_sd_index !== -1) {
        let player_entry = save_data[player_sd_index];
        let current_entry_count = player_entry.items ? player_entry.items.length : 0;

        if (previous_entry_counts[player.id] !== current_entry_count) {
          player_entry.last_unix = Math.floor(Date.now() / 1000);
          update_save_data(save_data);
        }

        previous_entry_counts[player.id] = current_entry_count;
      }
    });

    await system.waitTicks(1);
  }
}

system.run(() => update_loop());