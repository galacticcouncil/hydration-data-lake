import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';
import { YieldFarmDepositStatus } from './_yieldFarmDepositStatus';
import { XykYieldFarmEntry } from './_xykYieldFarmEntry';

@Entity_()
export class XykYieldFarmDeposit {
  constructor(props?: Partial<XykYieldFarmDeposit>) {
    Object.assign(this, props);
  }

  /**
   * deposit ID
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: true })
  nftId!: string | undefined | null;

  @Column_('text', { nullable: false })
  xykpoolId!: string;

  @Column_('text', { nullable: false })
  accountId!: string;

  @Column_('text', { nullable: false })
  lpAssetId!: string;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  initialAmount!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  amount!: bigint;

  /**
   * should be either SharesDeposited or DepositDestroyed
   */
  @Column_('varchar', { length: 17, nullable: false })
  status!: YieldFarmDepositStatus;

  @Column_('jsonb', {
    transformer: {
      to: (obj) => obj.map((val: any) => val.toJSON()),
      from: (obj) =>
        marshal.fromList(
          obj,
          (val) => new XykYieldFarmEntry(undefined, marshal.nonNull(val))
        ),
    },
    nullable: false,
  })
  entries!: XykYieldFarmEntry[];

  @Index_()
  @Column_('int4', { nullable: false })
  createdAtParaBlockHeight!: number;

  @Index_()
  @Column_('int4', { nullable: true })
  destroyedAtParaBlockHeight!: number | undefined | null;
}
