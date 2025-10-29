import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Stableswap} from "./stableswap.model"
import {StableswapAssetHistoricalData} from "./stableswapAssetHistoricalData.model"
import {StableswapPegsSource} from "./_stableswapPegsSource"

@Entity_()
export class StableswapHistoricalData {
  constructor(props?: Partial<StableswapHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <stableswapId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Stableswap, {nullable: true})
  pool!: Stableswap

  @OneToMany_(() => StableswapAssetHistoricalData, e => e.poolHistoricalData)
  assetsHistoricalData!: StableswapAssetHistoricalData[]

  @Column_("int4", {nullable: false})
  initialAmplification!: number

  @Column_("int4", {nullable: false})
  finalAmplification!: number

  @Column_("int4", {nullable: false})
  initialAmplificationChangeAtBlockHeight!: number

  @Column_("int4", {nullable: false})
  finalAmplificationChangeAtBlockHeight!: number

  @Column_("int4", {nullable: false})
  fee!: number

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.map((val: any) => marshal.bigint.toJSON(val))), from: obj => marshal.fromList(obj, val => marshal.fromList(val, val => marshal.bigint.fromJSON(val)))}, nullable: false})
  pegs!: ((bigint)[])[]

  @Column_("int4", {nullable: true})
  maxPegUpdate!: number | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new StableswapPegsSource(undefined, marshal.nonNull(val)))}, nullable: true})
  pegSources!: (StableswapPegsSource)[] | undefined | null

  @Column_("text", {nullable: true})
  tvlTotalInRefAssetNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
