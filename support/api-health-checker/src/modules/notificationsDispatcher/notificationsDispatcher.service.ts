import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  DiscordClientProvider,
  DiscordClientProviderToken,
} from '../../providers/discordClient.provider';
import { AppConfig } from '../../config.module';
import { EmbedBuilder } from 'discord.js';
import { GlobalStatusName } from '../../types/common';
import { IndexerStatusResponse } from '../apiGateway/dto/indexerStatus.response';
import {
  RedisOmClientProvider,
  RedisOmClientProviderToken,
} from '../../providers/redisOmClient.provider';
import {
  NotificationTriggersStateEntity,
  RedisOmEntityId,
} from '../../types/redisOm';
import BigNumber from 'bignumber.js';

export enum MessageThemeColor {
  RED = 0xef8d49,
  GREEN = 0x2a7754,
}

@Injectable()
export class NotificationsDispatcherService implements OnModuleInit {
  private bnFormatConfig = {
    decimalSeparator: ',',
    groupSeparator: ' ',
    groupSize: 3,
  };

  constructor(
    private appConfig: AppConfig,
    @Inject(DiscordClientProviderToken)
    private readonly discordClientProvider: DiscordClientProvider,
    @Inject(RedisOmClientProviderToken)
    private readonly redisOmClientProvider: RedisOmClientProvider,
  ) {}

  async onModuleInit() {
    this.discordClientProvider.addHandlerToChannelMessage(
      'check_status',
      async (message) => {
        // Ignore messages from bots (including your own bot)
        if (message.author.bot) return;

        // Only listen to messages from specific channel if needed
        if (message.channelId === this.appConfig.DISCORD_ALERTS_CHANEL) {
          console.log(
            `New message from ${message.author.username}: ${message.content}`,
          );

          // // Your reaction logic here
          // // For example, react to messages containing certain keywords
          // if (message.content.toLowerCase().includes('hello')) {
          //   message.reply('Hello there! 👋');
          // }
          //
          // // Or add emoji reactions
          // if (message.content.toLowerCase().includes('good')) {
          //   message.react('👍');
          // }
        }
      },
    );
  }

  async updateNotificationTriggersState({
    changeDirection,
    statusName,
  }: {
    changeDirection: 'reduce' | 'increase';
    statusName: GlobalStatusName;
  }) {
    const state =
      await this.redisOmClientProvider.notificationTriggersStateRepository.fetch(
        RedisOmEntityId.NOTIFICATION_TRIGGERS_STATE,
      );

    switch (statusName) {
      case GlobalStatusName.SWAPS:
        state.swappedEventsTrackingStatus =
          changeDirection === 'reduce' ? -1 : 1;
        break;
      case GlobalStatusName.MM_EVENTS:
        state.mmEventsTrackingStatus = changeDirection === 'reduce' ? -1 : 1;
        break;
      case GlobalStatusName.LATEST_PROCESSED_BLOCKS:
        state.processedBlocksDifference = changeDirection === 'reduce' ? -1 : 1;
        break;
    }
    await this.redisOmClientProvider.notificationTriggersStateRepository.save(
      RedisOmEntityId.NOTIFICATION_TRIGGERS_STATE,
      state,
    );
  }

  async processCheckNotificationTriggersStateJob() {
    const triggersState =
      await this.redisOmClientProvider.notificationTriggersStateRepository.fetch(
        RedisOmEntityId.NOTIFICATION_TRIGGERS_STATE,
      );

    if (
      triggersState.mmEventsTrackingStatus === 0 &&
      triggersState.swappedEventsTrackingStatus === 0 &&
      triggersState.processedBlocksDifference === 0
    )
      return;

    const globalStatuses = await this.getAllGlobalStatus();

    await this.broadcastGlobalStatusUpdateDiscord({
      globalStatuses,
      triggersState,
    });

    triggersState.processedBlocksDifference = 0;
    triggersState.swappedEventsTrackingStatus = 0;
    triggersState.mmEventsTrackingStatus = 0;

    await this.redisOmClientProvider.notificationTriggersStateRepository.save(
      RedisOmEntityId.NOTIFICATION_TRIGGERS_STATE,
      triggersState,
    );
  }

  // async broadcastGlobalStatusUpdate({
  //   changeDirection,
  //   statusName,
  // }: {
  //   changeDirection: 'reduce' | 'increase';
  //   statusName: GlobalStatusName;
  // }) {
  //   const globalStatuses = await this.getAllGlobalStatus();
  //
  //   if (changeDirection === 'reduce') {
  //     await this.broadcastGlobalStatusReducedDiscord({
  //       globalStatuses,
  //       statusName,
  //     });
  //   } else if (changeDirection === 'increase') {
  //     await this.broadcastGlobalStatusIncreasedDiscord({
  //       globalStatuses,
  //       statusName,
  //     });
  //   }
  // }

  private async getAllGlobalStatus(): Promise<IndexerStatusResponse> {
    const swappedEventsStatus =
      await this.redisOmClientProvider.swapsTrackingStatusRepository.fetch(
        RedisOmEntityId.SWAPPED_EVENTS_STATUS_SCORE,
      );
    const mmEventsStatus =
      await this.redisOmClientProvider.mmEventsTrackingStatusRepository.fetch(
        RedisOmEntityId.MM_EVENTS_STATUS_SCORE,
      );
    const latestProcessedBlocks =
      await this.redisOmClientProvider.latestProcessedBlocksRepository.fetch(
        RedisOmEntityId.LATEST_PROCESSED_BLOCKS,
      );

    return {
      latestIndexerBlockHeight:
        latestProcessedBlocks.latestIndexerBlockHeight ?? 0,
      latestOnChainBlockHeight:
        latestProcessedBlocks.latestOnChainBlockHeight ?? 0,
      swappedEventsTrackingStatusScore:
        swappedEventsStatus.swappedEventsTrackingStatusScore ?? 0,
      mmEventsTrackingStatusScore:
        mmEventsStatus.mmEventsTrackingStatusScore ?? 0,
    };
  }

  private async broadcastGlobalStatusUpdateDiscord({
    globalStatuses,
    triggersState,
  }: {
    globalStatuses: IndexerStatusResponse;
    triggersState: NotificationTriggersStateEntity;
  }) {
    const preFields = [];

    switch (triggersState.swappedEventsTrackingStatus) {
      case -1:
        preFields.push({
          name: ` - :warning: SWAP events status score reduced.`,
          value: '',
        });
        break;
      case 1:
        preFields.push({
          name: ` - :arrow_upper_right: SWAP events status score improved.`,
          value: '',
        });
        break;
    }
    switch (triggersState.mmEventsTrackingStatus) {
      case -1:
        preFields.push({
          name: ` - :warning: MM events status score reduced.`,
          value: '',
        });
        break;
      case 1:
        preFields.push({
          name: ` - :arrow_upper_right: MM events status score improved.`,
          value: '',
        });
        break;
    }
    switch (triggersState.processedBlocksDifference) {
      case -1:
        preFields.push({
          name: ` - :warning: Indexer blocks processing delay.`,
          value: '',
        });
        break;
      case 1:
        preFields.push({
          name: ` - :arrow_upper_right: Indexer blocks processing delay improved.`,
          value: '',
        });
        break;
    }

    preFields.push({ name: '\u200B', value: '\u200B' });

    const embed = this.getDiscordMessageEmbed({
      globalStatuses,
      color: MessageThemeColor.RED,
      title: 'Following metrics have been changed:',
      description: '',
      preFields,
    });

    await this.discordClientProvider.broadcastMessage({ embeds: [embed] });
  }

  // private async broadcastGlobalStatusIncreasedDiscord({
  //   globalStatuses,
  //   statusName,
  // }: {
  //   globalStatuses: IndexerStatusResponse;
  //   statusName: GlobalStatusName;
  // }) {
  //   let title = '';
  //   switch (statusName) {
  //     case GlobalStatusName.SWAPS:
  //       title = `:arrow_upper_right: SWAP events status score improved.`;
  //       break;
  //     case GlobalStatusName.MM_EVENTS:
  //       title = `:arrow_upper_right: Money Market events status score improved.`;
  //       break;
  //     case GlobalStatusName.LATEST_PROCESSED_BLOCKS:
  //       title = `:arrow_upper_right: Indexer blocks processing delay improved.`;
  //       break;
  //   }
  //
  //   const embed = this.getDiscordMessageEmbed({
  //     globalStatuses,
  //     statusName,
  //     color: MessageThemeColor.GREEN,
  //     title,
  //   });
  //
  //   await this.discordClientProvider.broadcastMessage({ embeds: [embed] });
  // }

  private getDiscordMessageEmbed({
    globalStatuses,
    color,
    title,
    description,
    preFields,
  }: {
    globalStatuses: IndexerStatusResponse;
    color: MessageThemeColor;
    title: string;
    description: string;
    preFields: Array<{ name: string; value: string }>;
  }) {
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      // .setURL('https://discord.js.org/')
      .setAuthor({
        name: 'Liquidity pools indexer health checker',
        iconURL:
          'https://uploads-ssl.webflow.com/63b5a9958fccedcf67d716ac/64662df3a5a568fd99e3600c_Squid_Pose_1_White-transparent-slim%201.png',
      })
      // .setDescription(description)
      // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
      .addFields(
        ...preFields,
        // { name: '\u200B', value: '\u200B' },
        {
          name: `- :repeat: SWAP events status score - ${this.getNumberIcon(globalStatuses.swappedEventsTrackingStatusScore)}`,
          value: '',
        },
        {
          name: `- :moneybag: MM events status score - ${this.getNumberIcon(globalStatuses.mmEventsTrackingStatusScore)}`,
          value: '',
        },
        {
          name: 'Chain block',
          value: `${BigNumber(globalStatuses.latestOnChainBlockHeight).toFormat(this.bnFormatConfig)}`,
          inline: true,
        },
        {
          name: 'Indexer block',
          value: `${BigNumber(globalStatuses.latestIndexerBlockHeight).toFormat(this.bnFormatConfig)}`,
          inline: true,
        },
        {
          name: '**Difference**',
          value: `${BigNumber(globalStatuses.latestOnChainBlockHeight - globalStatuses.latestIndexerBlockHeight).toFormat(this.bnFormatConfig)}`,
          inline: true,
        },
      )
      // .addFields({
      //   name: 'Inline field title',
      //   value: 'Some value here',
      //   inline: true,
      // })
      // .setImage('https://i.imgur.com/AfFp7pu.png')
      .setTimestamp();
    // .setFooter({
    //   text: 'Some footer text here',
    //   iconURL: 'https://i.imgur.com/AfFp7pu.png',
    // });

    return embed;
  }

  private getNumberIcon(number: number): string {
    switch (number) {
      case 0:
        return `:zero:`;
      case 1:
        return `:one:`;
      case 2:
        return `:two:`;
      case 3:
        return `:three:`;
      case 4:
        return `:four:`;
      case 5:
        return `:five:`;
      default:
        return `${number}`;
    }
  }
}
