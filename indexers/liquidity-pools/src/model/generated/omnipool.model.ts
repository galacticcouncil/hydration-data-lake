import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {OmnipoolAsset} from "./omnipoolAsset.model"

@Entity_()
export class Omnipool {
  constructor(props?: Partial<Omnipool>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  accountId!: string

  @Column_("bool", {nullable: true})
  isDestroyed!: boolean | undefined | null

  @Column_("int4", {nullable: true})
  destroyedAtParaBlockHeight!: number | undefined | null

  @OneToMany_(() => OmnipoolAsset, e => e.pool)
  assets!: OmnipoolAsset[]
}
