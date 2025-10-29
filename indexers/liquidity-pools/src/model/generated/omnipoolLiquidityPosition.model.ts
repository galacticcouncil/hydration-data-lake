import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {OmnipoolAsset} from "./omnipoolAsset.model"
import {NftAsset} from "./nftAsset.model"
import {OmnipoolLiquidityPositionStatus} from "./_omnipoolLiquidityPositionStatus"
import {OmnipoolLiquidityPositionEvent} from "./omnipoolLiquidityPositionEvent.model"
import {Event} from "./event.model"

@Entity_()
export class OmnipoolLiquidityPosition {
    constructor(props?: Partial<OmnipoolLiquidityPosition>) {
        Object.assign(this, props)
    }

    /**
     * position ID
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @Index_()
    @ManyToOne_(() => OmnipoolAsset, {nullable: true})
    omnipoolAsset!: OmnipoolAsset

    @BigIntColumn_({nullable: false})
    initialAmount!: bigint

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: false})
    sharesAmount!: bigint

    @Index_()
    @ManyToOne_(() => NftAsset, {nullable: true})
    positionNft!: NftAsset

    /**
     * should be either PositionCreated or PositionDestroyed
     */
    @Column_("varchar", {length: 24, nullable: false})
    status!: OmnipoolLiquidityPositionStatus

    @OneToMany_(() => OmnipoolLiquidityPositionEvent, e => e.position)
    positionEvents!: OmnipoolLiquidityPositionEvent[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
