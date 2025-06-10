import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import {DataStructureTypeName} from "./_dataStructureTypeName"

@Entity_()
export class DataStructureType {
  constructor(props?: Partial<DataStructureType>) {
    Object.assign(this, props)
  }

  /**
   * type_name
   */
  @PrimaryColumn_()
  id!: string

  @Column_("varchar", {length: 18, nullable: false})
  name!: DataStructureTypeName

  @Column_("text", {nullable: false})
  definition!: string
}
