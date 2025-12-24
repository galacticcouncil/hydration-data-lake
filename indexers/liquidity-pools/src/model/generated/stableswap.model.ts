import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
  OneToMany as OneToMany_,
} from 'typeorm';
import * as marshal from './marshal';
import { StableswapLifeState } from './_stableswapLifeState';
import { StableswapAsset } from './stableswapAsset.model';

@Entity_()
export class Stableswap {
  constructor(props?: Partial<Stableswap>) {
    Object.assign(this, props);
  }

  /**
   * poolId - share token ID (e.g. 102)
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  accountId!: string;

  @Column_('text', { nullable: false })
  shareTokenId!: string;

  @Index_()
  @Column_('int4', { nullable: false })
  createdAtParaBlockHeight!: number;

  @Column_('int4', { nullable: false })
  createdAtRelayBlockHeight!: number;

  @Column_('text', { nullable: true })
  createdAtBlockId!: string | undefined | null;

  @Column_('bool', { nullable: true })
  isDestroyed!: boolean | undefined | null;

  @Column_('jsonb', {
    transformer: {
      to: (obj) => obj.map((val: any) => val.toJSON()),
      from: (obj) =>
        marshal.fromList(
          obj,
          (val) => new StableswapLifeState(undefined, marshal.nonNull(val))
        ),
    },
    nullable: false,
  })
  lifeStates!: StableswapLifeState[];

  @OneToMany_(() => StableswapAsset, (e) => e.pool)
  assets!: StableswapAsset[];
}
