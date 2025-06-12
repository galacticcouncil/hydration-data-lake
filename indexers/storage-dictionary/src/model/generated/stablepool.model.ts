import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {StablepoolAssetData} from "./stablepoolAssetData.model"

@Entity_()
export class Stablepool {
  constructor(props?: Partial<Stablepool>) {
    Object.assign(this, props)
  }

  /**
   * stablepoolId-paraChainBlockHeight
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

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @OneToMany_(() => StablepoolAssetData, e => e.pool)
  assets!: StablepoolAssetData[]
}
