import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Aavepool} from "./aavepool.model"
import {Block} from "./block.model"

@Entity_()
export class AavepoolHistoricalData {
  constructor(props?: Partial<AavepoolHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <aavepoolId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Aavepool, {nullable: true})
  pool!: Aavepool

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liquidityIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liquidityOut!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
