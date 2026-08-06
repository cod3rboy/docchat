import { workspace } from "../../wailsjs/go/models";

export class Workspace {
  public readonly id: string;
  public readonly name: string;
  public readonly canDelete: boolean;
  public readonly canRename: boolean;
  public readonly created: Date;

  constructor(record: workspace.Workspace) {
    this.id = record.ID;
    this.name = record.Name;
    this.canDelete = record.Candelete;
    this.canRename = record.Canrename;
    this.created = new Date(record.Created);
  }
}
