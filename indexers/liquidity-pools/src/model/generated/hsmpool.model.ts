import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {AaveFacilitator} from "./aaveFacilitator.model"
import {HsmCollateral} from "./hsmCollateral.model"

@Entity_()
export class Hsmpool {
  constructor(props?: Partial<Hsmpool>) {
    Object.assign(this, props)
  }

  /**
   * poolId
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  accountId!: string

  @Index_()
  @ManyToOne_(() => AaveFacilitator, {nullable: true})
  facilitator!: AaveFacilitator

  @OneToMany_(() => HsmCollateral, e => e.pool)
  collaterals!: HsmCollateral[]
}
