import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  OneToMany as OneToMany_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';
import { AssetDynamicFee } from './_assetDynamicFee';
import { AssetAssetsPairVolume } from './assetAssetsPairVolume.model';

@Entity_()
export class AssetHistoricalData {
  constructor(props?: Partial<AssetHistoricalData>) {
    Object.assign(this, props);
  }

  /**
   * <assetId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  assetId!: string;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  totalIssuance!: bigint;

  @Column_('jsonb', {
    transformer: {
      to: (obj) => (obj == null ? undefined : obj.toJSON()),
      from: (obj) =>
        obj == null ? undefined : new AssetDynamicFee(undefined, obj),
    },
    nullable: true,
  })
  dynamicFee!: AssetDynamicFee | undefined | null;

  @Column_('text', { nullable: false })
  usdPriceNormalised!: string;

  @OneToMany_(() => AssetAssetsPairVolume, (e) => e.assetHistoricalData)
  assetPairVolumes!: AssetAssetsPairVolume[];

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;
}
