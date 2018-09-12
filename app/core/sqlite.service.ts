import { Injectable } from "@angular/core";
var Sqlite = require("nativescript-sqlite");

@Injectable()
export class DatabaseService {

    public getdbConnection() {
        return new Sqlite('todo');
    }

    public closedbConnection() {
        new Sqlite('todo')
            .then((db) => {
                db.close();
                console.log("Sqlite Database closed");
            })
    }
}