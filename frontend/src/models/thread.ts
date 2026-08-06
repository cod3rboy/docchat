import { thread } from "../../wailsjs/go/models";

export class Thread {
  public readonly id: string;
  private _title: string;
  public readonly workspaceId: string;
  public readonly created: Date;

  constructor(record: thread.Thread) {
    this.id = record.ID;
    this._title = record.Title;
    this.workspaceId = record.Workspace;
    this.created = new Date(record.Created);
  }

  public get title(): string {
    return this._title;
  }

  public changeTitle(title: string): void {
    this._title = title;
  }
}
