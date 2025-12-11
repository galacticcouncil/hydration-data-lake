import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {OmnipoolLiquidityPositionStatus} from "./_omnipoolLiquidityPositionStatus"
import {OmnipoolLiquidityPositionEvent} from "./omnipoolLiquidityPositionEvent.model"

@Entity_()
export class OmnipoolLiquidityPosition {
    constructor(props?: Partial<OmnipoolLiquidityPosition>) {
        Object.assign(this, props)
    }

    /**
     * <position ID>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @StringColumn_({nullable: false})
    assetId!: string

    @StringColumn_({nullable: false})
    omnipoolAssetId!: string

    @BigIntColumn_({nullable: false})
    initialAmount!: bigint

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    sharesAmount!: bigint

    @StringColumn_({nullable: true})
    positionNftId!: string | undefined | null

    @BigIntColumn_({nullable: true})
    price!: bigint | undefined | null

    /**
     * should be either PositionCreated or PositionDestroyed
     */
    @Column_("varchar", {length: 24, nullable: false})
    status!: OmnipoolLiquidityPositionStatus

    @OneToMany_(() => OmnipoolLiquidityPositionEvent, e => e.position)
    positionEvents!: OmnipoolLiquidityPositionEvent[]

    @Index_()
    @IntColumn_({nullable: false})
    createdAtParaBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: true})
    destroyedAtParaBlockHeight!: number | undefined | null

    @StringColumn_({nullable: true})
    eventId!: string | undefined | null
}
