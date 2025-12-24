import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
} from 'typeorm';

@Entity_()
export class AaveFacilitator {
  constructor(props?: Partial<AaveFacilitator>) {
    Object.assign(this, props);
  }

  /**
   * <facilitator_h160_address>
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  label!: string;

  @Column_('bool', { nullable: false })
  isRemoved!: boolean;
}
