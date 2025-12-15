import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class NftAsset {
  constructor(props?: Partial<NftAsset>) {
    Object.assign(this, props)
  }

  /**
   * <collection_id>-<item_id>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  collectionId!: string

  @Column_("text", {nullable: false})
  ownerId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  deposit!: bigint

  @Column_("bool", {nullable: false})
  isFrozen!: boolean
}
