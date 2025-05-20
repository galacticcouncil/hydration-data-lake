import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"

@Entity_()
export class Aavepool {
  constructor(props?: Partial<Aavepool>) {
    Object.assign(this, props)
  }

  /**
   * <aavepoolId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  poolId!: string

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  reserveAsset!: Asset

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  aToken!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liquidityIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liquidityOut!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayBlockHeight!: number
}
