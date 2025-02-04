import { Client, GatewayIntents } from "https://deno.land/x/harmony/mod.ts";
import { TOKEN, OWNER_ID } from "../configs-deno.ts";
import { READY, SHARD_READY, logMemory } from "../utils/events-deno.ts";

const client = new Client({ token: TOKEN });

const harmonyStarted = Date.now();
let harmonyTime = Date.now();
let harmonyCounter = 1;

client
  .on("ready", () => {
    READY(harmonyStarted);
  })
  .on("shardReady", (id) => {
    harmonyTime = SHARD_READY(id, harmonyTime);
  })
  .on("message", (message) => {
    if (message.author.id !== OWNER_ID || message.content !== "!starttests")
      return;

    harmonyCounter = logMemory(
      Deno.memoryUsage(),
      harmonyCounter,
      "harmony",
      0,
      0,
      0,
      0
    );
    setInterval(() => {
      harmonyCounter = logMemory(
        Deno.memoryUsage(),
        harmonyCounter,
        "harmony",
        0,
        0,
        0,
        0
      );
    }, 60000);
  });

client.connect(TOKEN, [
  GatewayIntents.DIRECT_MESSAGE_REACTIONS,
  GatewayIntents.GUILD_BANS,
  GatewayIntents.GUILD_EMOJIS,
  GatewayIntents.GUILD_INVITES,
  GatewayIntents.GUILD_MEMBERS,
  GatewayIntents.GUILD_MESSAGE_REACTIONS,
  GatewayIntents.GUILD_MESSAGES,
  GatewayIntents.GUILD_VOICE_STATES,
  GatewayIntents.GUILDS,
]);
