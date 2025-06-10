import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
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

  @Column_("text", {nullable: false})
  liquidityIn!: string

  @Column_("text", {nullable: false})
  liquidityOut!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
