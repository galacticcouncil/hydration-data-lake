import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {HsmCollateral} from "./hsmCollateral.model"

@Entity_()
export class HsmCollateralConfigHistoricalData {
  constructor(props?: Partial<HsmCollateralConfigHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <hsm_collateral_id>-<block_height>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => HsmCollateral, {nullable: true})
  collateral!: HsmCollateral

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  purchaseFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  maxBuyPriceCoefficient!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  buybackRate!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  buyBackFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  maxInHolding!: bigint

  @Index_()
  @Column_("timestamp with time zone", {nullable: false})
  paraTimestamp!: Date

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: true})
  blockId!: string | undefined | null
}
