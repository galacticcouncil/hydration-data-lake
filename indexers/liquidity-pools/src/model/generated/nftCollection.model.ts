import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"

@Entity_()
export class NftCollection {
  constructor(props?: Partial<NftCollection>) {
    Object.assign(this, props)
  }

  /**
   * collection ID 
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  collectionType!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  owner!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  issuer!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  admin!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  freezer!: Account

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalDeposit!: bigint

  @Column_("bool", {nullable: false})
  freeHolding!: boolean

  @Column_("bool", {nullable: false})
  isFrozen!: boolean

  @Column_("int4", {nullable: false})
  items!: number

  @Column_("int4", {nullable: false})
  itemMetadatas!: number

  @Column_("int4", {nullable: false})
  attributes!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  maxSupply!: bigint | undefined | null
}
