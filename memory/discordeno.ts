import {
  startBot,
  cache,
  snowflakeToBigint,
} from "https://deno.land/x/discordeno/mod.ts";
import { TOKEN, OWNER_ID } from "../configs-deno.ts";
import { READY, SHARD_READY, logMemory } from "../utils/events-deno.ts";

const ddStarted = Date.now();
let ddTime = Date.now();
let ddcounter = 0;

startBot({
  token: TOKEN,
  intents: [
    "DirectMessageReactions",
    "DirectMessages",
    "GuildBans",
    "GuildEmojis",
    "GuildInvites",
    "GuildMembers",
    "GuildMessageReactions",
    "GuildMessages",
    "GuildVoiceStates",
    "Guilds",
  ],
  eventHandlers: {
    ready() {
      READY(ddStarted);
    },
    shardReady(id) {
      ddTime = SHARD_READY(id, ddTime);
    },
    messageCreate(message) {
      if (
        message.authorId !== snowflakeToBigint(OWNER_ID) ||
        message.content !== "!starttests"
      )
        return;

      ddcounter = logMemory(
        Deno.memoryUsage(),
        ddcounter,
        "discordeno",
        cache.guilds.size,
        cache.members.size,
        cache.messages.size,
        cache.channels.size
      );
      setInterval(() => {
        ddcounter = logMemory(
          Deno.memoryUsage(),
          ddcounter,
          "discordeno",
          cache.guilds.size,
          cache.members.size,
          cache.messages.size,
          cache.channels.size
        );
      }, 60000);
    },
  },
});
