import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';
import { YieldFarmDepositStatus } from './_yieldFarmDepositStatus';

@Entity_()
export class XykYieldFarmDepositEvent {
  constructor(props?: Partial<XykYieldFarmDepositEvent>) {
    Object.assign(this, props);
  }

  /**
   * event_id
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  depositId!: string;

  @Column_('varchar', { length: 17, nullable: false })
  eventName!: YieldFarmDepositStatus;

  @Column_('text', { nullable: true })
  globalFarmId!: string | undefined | null;

  @Column_('text', { nullable: true })
  yieldFarmId!: string | undefined | null;

  @Column_('text', { nullable: true })
  lpAssetId!: string | undefined | null;

  @Column_('text', { nullable: true })
  accountId!: string | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  amount!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  claimedAmount!: bigint | undefined | null;

  @Column_('text', { nullable: true })
  rewardAssetId!: string | undefined | null;

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;

  @Column_('text', { nullable: true })
  eventId!: string | undefined | null;
}
