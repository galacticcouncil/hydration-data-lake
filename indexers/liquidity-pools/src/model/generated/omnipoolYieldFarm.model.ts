import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';
import { FarmState } from './_farmState';
import { YieldFarmLoyaltyCurve } from './_yieldFarmLoyaltyCurve';
import { FarmLifeState } from './_farmLifeState';

@Entity_()
export class OmnipoolYieldFarm {
  constructor(props?: Partial<OmnipoolYieldFarm>) {
    Object.assign(this, props);
  }

  /**
   * global farm ID
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  globalFarmId!: string;

  @Column_('text', { nullable: false })
  assetId!: string;

  @Column_('int4', { nullable: false })
  updatedAtRelayBlock!: number;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  totalShares!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  totalValuedShares!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  accumulatedRpvs!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  accumulatedRpz!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  multiplier!: bigint;

  @Column_('varchar', { length: 10, nullable: false })
  state!: FarmState;

  @Column_('int4', { nullable: false })
  entriesCount!: number;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  leftToDistribute!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  totalStopped!: bigint;

  @Column_('jsonb', {
    transformer: {
      to: (obj) => (obj == null ? undefined : obj.toJSON()),
      from: (obj) =>
        obj == null ? undefined : new YieldFarmLoyaltyCurve(undefined, obj),
    },
    nullable: true,
  })
  loyaltyCurve!: YieldFarmLoyaltyCurve | undefined | null;

  @Column_('jsonb', {
    transformer: {
      to: (obj) => obj.map((val: any) => val.toJSON()),
      from: (obj) =>
        marshal.fromList(
          obj,
          (val) => new FarmLifeState(undefined, marshal.nonNull(val))
        ),
    },
    nullable: false,
  })
  lifeStates!: FarmLifeState[];

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;

  @Column_('text', { nullable: true })
  eventId!: string | undefined | null;
}
