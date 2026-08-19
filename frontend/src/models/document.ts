import { document } from "../../wailsjs/go/models";
import pdf from "../assets/images/filetypes/pdf.png";
import text from "../assets/images/filetypes/txt.png";
import markdown from "../assets/images/filetypes/md.png";
import unknown from "../assets/images/filetypes/unknown.png";

export class Document {
  public readonly id: string;
  public readonly title: string;
  public readonly extension: string;
  public readonly embedId: string;
  public readonly indexed: boolean;
  public readonly workspaceId: string;
  public readonly created: Date;

  constructor(record: document.ListDocumentsRow) {
    this.id = record.ID;
    this.title = record.Title;
    this.extension = record.Extension;
    this.embedId = record.Embedid;
    this.indexed = record.Indexed;
    this.workspaceId = record.Workspace;
    this.created = new Date(record.Created);
  }

  public get fileIcon(): string {
    switch (this.extension) {
      case "pdf":
        return pdf;
      case "txt":
        return text;
      case "md":
        return markdown;
      default:
        return unknown;
    }
  }

  public get fileName(): string {
    return this.title + "." + this.extension;
  }
}
