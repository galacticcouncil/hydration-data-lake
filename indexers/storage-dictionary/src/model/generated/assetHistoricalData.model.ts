import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {AssetDynamicFee} from "./_assetDynamicFee"

@Entity_()
export class AssetHistoricalData {
  constructor(props?: Partial<AssetHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <assetId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalIssuance!: bigint

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new AssetDynamicFee(undefined, obj)}, nullable: true})
  dynamicFee!: AssetDynamicFee | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  existentialDeposit!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayBlockHeight!: number
}
