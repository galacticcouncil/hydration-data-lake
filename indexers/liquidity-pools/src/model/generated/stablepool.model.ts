import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {StablepoolAsset} from "./stablepoolAsset.model"

@Entity_()
export class Stablepool {
  constructor(props?: Partial<Stablepool>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("int4", {nullable: false})
  createdAtParaBlock!: number

  @Column_("bool", {nullable: true})
  isDestroyed!: boolean | undefined | null

  @Column_("int4", {nullable: true})
  destroyedAtParaBlock!: number | undefined | null

  @OneToMany_(() => StablepoolAsset, e => e.pool)
  assets!: StablepoolAsset[]
}
