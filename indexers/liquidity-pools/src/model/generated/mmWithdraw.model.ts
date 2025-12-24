import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';
import { RoutedTrade } from './routedTrade.model';
import { Event } from './event.model';

@Entity_()
export class MmWithdraw {
  constructor(props?: Partial<MmWithdraw>) {
    Object.assign(this, props);
  }

  /**
   * <event_id>
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { array: true, nullable: true })
  traceIds!: string[] | undefined | null;

  @Column_('text', { nullable: false })
  assetId!: string;

  @Column_('text', { nullable: false })
  accountFromId!: string;

  @Column_('text', { nullable: false })
  accountToId!: string;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  amount!: bigint | undefined | null;

  @Index_()
  @ManyToOne_(() => RoutedTrade, { nullable: true })
  initiatedByTrade!: RoutedTrade | undefined | null;

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;

  @Index_()
  @ManyToOne_(() => Event, { nullable: true })
  event!: Event;
}
