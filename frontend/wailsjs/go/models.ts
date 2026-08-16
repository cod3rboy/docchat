export namespace ai {
	
	export class Message {
	    Content: string;
	    Role: string;
	
	    static createFrom(source: any = {}) {
	        return new Message(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Content = source["Content"];
	        this.Role = source["Role"];
	    }
	}

}

export namespace bindings {
	
	export class ModelSettings {
	    apiEndpoint: string;
	    apiKey: string;
	    primaryModel: string;
	    embeddingModel: string;
	
	    static createFrom(source: any = {}) {
	        return new ModelSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.apiEndpoint = source["apiEndpoint"];
	        this.apiKey = source["apiKey"];
	        this.primaryModel = source["primaryModel"];
	        this.embeddingModel = source["embeddingModel"];
	    }
	}

}

export namespace document {
	
	export class CreateDocumentRow {
	    ID: string;
	    Title: string;
	    Extension: string;
	    Workspace: string;
	    Created: string;
	
	    static createFrom(source: any = {}) {
	        return new CreateDocumentRow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	        this.Extension = source["Extension"];
	        this.Workspace = source["Workspace"];
	        this.Created = source["Created"];
	    }
	}
	export class GetDocumentRow {
	    ID: string;
	    Title: string;
	    Extension: string;
	    Workspace: string;
	    Created: string;
	
	    static createFrom(source: any = {}) {
	        return new GetDocumentRow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	        this.Extension = source["Extension"];
	        this.Workspace = source["Workspace"];
	        this.Created = source["Created"];
	    }
	}
	export class ListDocumentsRow {
	    ID: string;
	    Title: string;
	    Extension: string;
	    Workspace: string;
	    Created: string;
	
	    static createFrom(source: any = {}) {
	        return new ListDocumentsRow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	        this.Extension = source["Extension"];
	        this.Workspace = source["Workspace"];
	        this.Created = source["Created"];
	    }
	}

}

export namespace message {
	
	export class Message {
	    ID: string;
	    Role: string;
	    Content: string;
	    Thread: string;
	    Created: string;
	
	    static createFrom(source: any = {}) {
	        return new Message(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Role = source["Role"];
	        this.Content = source["Content"];
	        this.Thread = source["Thread"];
	        this.Created = source["Created"];
	    }
	}

}

export namespace thread {
	
	export class Thread {
	    ID: string;
	    Title: string;
	    Workspace: string;
	    Created: string;
	
	    static createFrom(source: any = {}) {
	        return new Thread(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	        this.Workspace = source["Workspace"];
	        this.Created = source["Created"];
	    }
	}

}

export namespace workspace {
	
	export class Workspace {
	    ID: string;
	    Name: string;
	    Candelete: boolean;
	    Canrename: boolean;
	    Created: string;
	
	    static createFrom(source: any = {}) {
	        return new Workspace(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Candelete = source["Candelete"];
	        this.Canrename = source["Canrename"];
	        this.Created = source["Created"];
	    }
	}

}

