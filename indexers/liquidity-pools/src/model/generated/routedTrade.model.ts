import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, OneToMany as OneToMany_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"
import {RoutedTradeAssetBalance} from "./routedTradeAssetBalance.model"
import {Swap} from "./swap.model"

@Entity_()
export class RoutedTrade {
    constructor(props?: Partial<RoutedTrade>) {
        Object.assign(this, props)
    }

    /**
     * <blockHeight>-<routerIncrementalId || swapId> (e.g. 6516718-3094 || 6516718-0006516718-9965d-000107)
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: true})
    routeId!: string | undefined | null

    @OneToMany_(() => RoutedTradeAssetBalance, e => e.routedTrade)
    inputs!: RoutedTradeAssetBalance[]

    @OneToMany_(() => RoutedTradeAssetBalance, e => e.routedTrade)
    outputs!: RoutedTradeAssetBalance[]

    @StringColumn_({array: true, nullable: false})
    inputAssetIds!: (string)[]

    @StringColumn_({array: true, nullable: false})
    outputAssetIds!: (string)[]

    @StringColumn_({array: true, nullable: false})
    allInvolvedAssetIds!: (string)[]

    @StringColumn_({array: true, nullable: false})
    participantSwappers!: (string)[]

    @StringColumn_({array: true, nullable: false})
    participantFillers!: (string)[]

    @StringColumn_({array: true, nullable: false})
    feeRecipients!: (string)[]

    @OneToMany_(() => Swap, e => e.routedTrade)
    swaps!: Swap[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
