import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Lbppool} from "./lbppool.model"

@Entity_()
export class LbppoolVolumeHistoricalData {
  constructor(props?: Partial<LbppoolVolumeHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * PoolId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Lbppool, {nullable: true})
  pool!: Lbppool

  @Column_("text", {nullable: false})
  assetAId!: string

  @Column_("text", {nullable: false})
  assetBId!: string

  @Column_("numeric", {nullable: false})
  averagePrice!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetAVolIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetAVolOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetATotalVolIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetATotalVolOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetAFeeVol!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBFeeVol!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetAFeesTotalVol!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBFeesTotalVol!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBVolIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBVolOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBTotalVolIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBTotalVolOut!: bigint

  @Column_("text", {nullable: false})
  assetAVolInNorm!: string

  @Column_("text", {nullable: false})
  assetAVolOutNorm!: string

  @Column_("text", {nullable: false})
  assetBVolInNorm!: string

  @Column_("text", {nullable: false})
  assetBVolOutNorm!: string

  @Column_("text", {nullable: false})
  assetAFeeVolNorm!: string

  @Column_("text", {nullable: false})
  assetBFeeVolNorm!: string

  @Column_("text", {nullable: false})
  assetATotalVolInNorm!: string

  @Column_("text", {nullable: false})
  assetATotalVolOutNorm!: string

  @Column_("text", {nullable: false})
  assetBTotalVolInNorm!: string

  @Column_("text", {nullable: false})
  assetBTotalVolOutNorm!: string

  @Column_("text", {nullable: false})
  assetAFeesTotalVolNorm!: string

  @Column_("text", {nullable: false})
  assetBFeesTotalVolNorm!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: true})
  blockId!: string | undefined | null
}
