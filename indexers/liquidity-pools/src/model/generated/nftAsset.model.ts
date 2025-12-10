import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {NftCollection} from "./nftCollection.model"
import {Account} from "./account.model"

@Entity_()
export class NftAsset {
  constructor(props?: Partial<NftAsset>) {
    Object.assign(this, props)
  }

  /**
   * asset ID 
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => NftCollection, {nullable: true})
  collection!: NftCollection

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  owner!: Account

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  deposit!: bigint

  @Column_("bool", {nullable: false})
  isFrozen!: boolean
}
