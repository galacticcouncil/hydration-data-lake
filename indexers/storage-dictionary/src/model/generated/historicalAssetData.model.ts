import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class HistoricalAssetData {
  constructor(props?: Partial<HistoricalAssetData>) {
    Object.assign(this, props)
  }

  /**
   * <assetId>-<paraChainBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("int4", {nullable: false})
  assetId!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalIssuance!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  existentialDeposit!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number
}
