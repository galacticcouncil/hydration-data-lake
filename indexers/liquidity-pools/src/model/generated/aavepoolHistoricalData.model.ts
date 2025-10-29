import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Aavepool} from "./aavepool.model"
import {Asset} from "./asset.model"

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

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  reserveAsset!: Asset | undefined | null

  @Column_("text", {nullable: true})
  reserveAssetRegistryId!: string | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  aToken!: Asset | undefined | null

  @Column_("text", {nullable: true})
  aTokenRegistryId!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liquidityIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liquidityOut!: bigint

  /**
   * Ref asset value of liquidityIn property - what actual amount of collateral is locked in pool 
   */
  @Column_("text", {nullable: true})
  tvlInRefAssetNorm!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  aTokenTotalSupply!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  variableDebtTokenTotalSupply!: bigint | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
