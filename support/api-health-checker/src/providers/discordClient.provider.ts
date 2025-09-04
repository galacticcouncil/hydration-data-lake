import { Injectable, Provider } from '@nestjs/common';
import { AppConfig } from '../config.module';
import {
  Client,
  GatewayIntentBits,
  Message,
  MessageCreateOptions,
  MessagePayload,
} from 'discord.js';

@Injectable()
export class DiscordClientProvider {
  private client: Client | null = null;

  private channelMessageHandlers: Map<
    string,
    (message: Message) => Promise<void>
  > = new Map();

  constructor(private appConfig: AppConfig) {}

  async getDiscordClient() {
    if (!this.client) await this.init();
    return this.client;
  }

  async init(): Promise<void> {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.MessageContent,
      ],
    });

    this.client.on('messageCreate', async (message: Message) => {
      for (const handler of this.channelMessageHandlers.values()) {
        await handler(message);
      }
    });

    return new Promise((resolve) => {
      this.client.once('ready', () => {
        console.log('discord ready');
        resolve();
      });
      this.client.login(this.appConfig.DISCORD_ALERTS_BOT_TOKEN);
    });
  }

  addHandlerToChannelMessage(
    id: string,
    handler: (message: Message) => Promise<void>,
  ) {
    this.channelMessageHandlers.set(id, handler);
  }

  deleteHandlerToChannelMessage(id: string) {
    this.channelMessageHandlers.delete(id);
  }

  async broadcastMessage(
    payload: string | MessagePayload | MessageCreateOptions,
  ) {
    // console.log(markdownToAnsi(message));

    const disClient = await this.getDiscordClient();
    if (!disClient) return;

    const channel = disClient.guilds.cache
      .get(this.appConfig.DISCORD_ALERTS_SERVER)
      .channels.cache.get(this.appConfig.DISCORD_ALERTS_CHANEL);

    if (channel && channel.isSendable()) {
      channel.send(payload);
    } else {
      console.error(new Error(`discord channel ${channel} not connected`));
    }
  }
}

export const DiscordClientProviderToken = 'DiscordClientProviderToken';

export const DiscordClientProviderFactory: Provider = {
  provide: DiscordClientProviderToken,
  useClass: DiscordClientProvider,
};
