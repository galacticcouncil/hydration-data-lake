import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {LbppoolAssetsData} from "./lbppoolAssetsData.model"

@Entity_()
export class Lbppool {
  constructor(props?: Partial<Lbppool>) {
    Object.assign(this, props)
  }

  /**
   * xykPoolAddress-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  /**
   * XYK pool address
   */
  @Column_("text", {nullable: false})
  poolAddress!: string

  @Column_("int4", {nullable: false})
  assetAId!: number

  @Column_("int4", {nullable: false})
  assetBId!: number

  @Column_("text", {nullable: false})
  owner!: string

  @Column_("int4", {nullable: true})
  start!: number | undefined | null

  @Column_("int4", {nullable: true})
  end!: number | undefined | null

  @Column_("int4", {nullable: false})
  initialWeight!: number

  @Column_("int4", {nullable: false})
  finalWeight!: number

  @Column_("text", {nullable: false})
  weightCurve!: string

  @Column_("int4", {array: true, nullable: false})
  fee!: (number)[]

  @Column_("text", {nullable: true})
  feeCollector!: string | undefined | null

  @Column_("text", {nullable: false})
  repayTarget!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @OneToMany_(() => LbppoolAssetsData, e => e.pool)
  assets!: LbppoolAssetsData[]
}
