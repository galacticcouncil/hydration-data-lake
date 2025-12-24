import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
  OneToMany as OneToMany_,
} from 'typeorm';
import { AccountType } from './_accountType';
import { Event } from './event.model';
import { Lbppool } from './lbppool.model';
import { Xykpool } from './xykpool.model';
import { Omnipool } from './omnipool.model';
import { Stableswap } from './stableswap.model';
import { Hsmpool } from './hsmpool.model';
import { ChainActivityTrace } from './chainActivityTrace.model';
import { AccountChainActivityTrace } from './accountChainActivityTrace.model';

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props);
  }

  /**
   * <address>
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('varchar', { length: 10, nullable: false })
  accountType!: AccountType;

  @Column_('text', { nullable: true })
  boundEvmAddress!: string | undefined | null;

  @Index_()
  @ManyToOne_(() => Event, { nullable: true })
  evmAddressBoundEvent!: Event | undefined | null;

  @Index_()
  @ManyToOne_(() => Lbppool, { nullable: true })
  lbppool!: Lbppool | undefined | null;

  @Index_()
  @ManyToOne_(() => Xykpool, { nullable: true })
  xykpool!: Xykpool | undefined | null;

  @Index_()
  @ManyToOne_(() => Omnipool, { nullable: true })
  omnipool!: Omnipool | undefined | null;

  @Index_()
  @ManyToOne_(() => Stableswap, { nullable: true })
  stableswap!: Stableswap | undefined | null;

  @Index_()
  @ManyToOne_(() => Hsmpool, { nullable: true })
  hsmpool!: Hsmpool | undefined | null;

  @OneToMany_(() => ChainActivityTrace, (e) => e.originator)
  initiatedActions!: ChainActivityTrace[];

  @OneToMany_(() => AccountChainActivityTrace, (e) => e.account)
  participatedActions!: AccountChainActivityTrace[];
}
