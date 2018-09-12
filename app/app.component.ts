import { Component } from "@angular/core";
import { DatabaseService } from "./core/sqlite.service";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent {
    constructor(private database: DatabaseService) {
        this.database.getdbConnection()
            .then(db => {
                db.execSQL("CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY AUTOINCREMENT, list_name TEXT)").then(id => {
                    console.log("table created!")
                }, error => {
                    console.log("CREATE TABLE ERROR", error);
                    });
                db.execSQL("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, list_id INTEGER, task_name TEXT)").then(id => {
                    console.log(" tasks table created!")
                }, error => {
                    console.log("CREATE TABLE ERROR", error);
                });
            });
    }

}
