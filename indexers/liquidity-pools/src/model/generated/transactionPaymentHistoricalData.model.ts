import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
  ManyToOne as ManyToOne_,
} from 'typeorm';
import * as marshal from './marshal';
import { Block } from './block.model';

@Entity_()
export class TransactionPaymentHistoricalData {
  constructor(props?: Partial<TransactionPaymentHistoricalData>) {
    Object.assign(this, props);
  }

  /**
   * block_height
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  nextFeeMultiplier!: bigint | undefined | null;

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;

  @Index_()
  @ManyToOne_(() => Block, { nullable: true })
  block!: Block;
}
