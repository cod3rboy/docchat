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

