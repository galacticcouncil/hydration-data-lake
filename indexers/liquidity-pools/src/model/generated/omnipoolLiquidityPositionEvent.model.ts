import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';
import { OmnipoolLiquidityPosition } from './omnipoolLiquidityPosition.model';
import { OmnipoolLiquidityPositionStatus } from './_omnipoolLiquidityPositionStatus';

@Entity_()
export class OmnipoolLiquidityPositionEvent {
  constructor(props?: Partial<OmnipoolLiquidityPositionEvent>) {
    Object.assign(this, props);
  }

  /**
   * <position_id>-<event_id>
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { array: true, nullable: true })
  traceIds!: string[] | undefined | null;

  @Index_()
  @ManyToOne_(() => OmnipoolLiquidityPosition, { nullable: true })
  position!: OmnipoolLiquidityPosition;

  @Column_('varchar', { length: 24, nullable: false })
  eventName!: OmnipoolLiquidityPositionStatus;

  @Column_('text', { nullable: true })
  accountId!: string | undefined | null;

  @Column_('text', { nullable: true })
  assetId!: string | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  amount!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  sharesAmount!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  price!: bigint | undefined | null;

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;

  @Column_('text', { nullable: false })
  eventId!: string;
}
