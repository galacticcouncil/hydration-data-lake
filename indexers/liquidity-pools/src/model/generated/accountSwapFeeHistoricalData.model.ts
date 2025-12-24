import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  OneToMany as OneToMany_,
  Index as Index_,
} from 'typeorm';
import { AccountAssetSwapFeeHistoricalData } from './accountAssetSwapFeeHistoricalData.model';

@Entity_()
export class AccountSwapFeeHistoricalData {
  constructor(props?: Partial<AccountSwapFeeHistoricalData>) {
    Object.assign(this, props);
  }

  /**
   * <address>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  accountId!: string;

  @OneToMany_(() => AccountAssetSwapFeeHistoricalData, (e) => e.collection)
  fees!: AccountAssetSwapFeeHistoricalData[];

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;
}
