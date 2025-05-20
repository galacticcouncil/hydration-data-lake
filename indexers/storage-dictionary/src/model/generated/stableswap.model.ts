import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {StableswapPegsSource} from "./_stableswapPegsSource"
import {StableswapAssetData} from "./stableswapAssetData.model"

@Entity_()
export class Stableswap {
  constructor(props?: Partial<Stableswap>) {
    Object.assign(this, props)
  }

  /**
   * stablepoolId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("int4", {nullable: false})
  poolId!: number

  @Index_()
  @Column_("text", {nullable: false})
  poolAddress!: string

  @Column_("int4", {nullable: false})
  initialAmplification!: number

  @Column_("int4", {nullable: false})
  finalAmplification!: number

  @Column_("int4", {nullable: false})
  initialBlock!: number

  @Column_("int4", {nullable: false})
  finalBlock!: number

  @Column_("int4", {nullable: false})
  fee!: number

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.map((val: any) => marshal.bigint.toJSON(val))), from: obj => marshal.fromList(obj, val => marshal.fromList(val, val => marshal.bigint.fromJSON(val)))}, nullable: false})
  pegs!: ((bigint)[])[]

  @Column_("int4", {nullable: true})
  maxPegUpdate!: number | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new StableswapPegsSource(undefined, marshal.nonNull(val)))}, nullable: true})
  pegSources!: (StableswapPegsSource)[] | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @OneToMany_(() => StableswapAssetData, e => e.pool)
  assets!: StableswapAssetData[]
}
