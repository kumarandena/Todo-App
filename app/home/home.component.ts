import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../core/sqlite.service";
import { prompt, PromptResult, inputType, PromptOptions } from "ui/dialogs";
import { confirm } from "ui/dialogs";
import { setNumber, setString } from "application-settings";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    db: any;

    public lists: Array<any>;

    constructor(
        private database: DatabaseService
    ) {
        this.lists = [];
    }

    ngOnInit(): void {
        this.selecttaskslist();
    }
    
    selecttaskslist() {
        this.lists = [];
        this.database.getdbConnection()
            .then(db => {
                db.all("SELECT id, list_name FROM lists").then(rows => {
                    for (var row in rows) {
                        this.lists.push({ id: rows[row][0], list_name: rows[row][1] });
                    }
                    this.db = db;
                }, error => {
                    console.log("SELECT ERROR", error);
                });
            });
    }

    createtasklist() {
        let options: PromptOptions = {
            title: "Todo list name",
            inputType: inputType.text,
            okButtonText: "OK",
            cancelButtonText: "Cancel",
            cancelable: true
        };

        prompt(options).then((result: PromptResult) => {
            console.log("Todo list name : " + JSON.stringify(result));
            if (result.result) {
                if (result.text.length > 0) {
                    this.db.execSQL("INSERT INTO lists (list_name) VALUES (?)", [result.text]).then(id => {
                        this.lists.push({ id: id, list_name: result.text });
                        console.log(result.text.toUpperCase() + " Task list added successfully")
                    }, error => {
                        console.log("INSERT ERROR", error);
                    });
                }
                else {
                    alert("Please enter the list name!");
                    return;
                }
            }
        });
    }

    deletetasklist(list, index) {
        let options = {
            title: "Tasklist Deletion",
            message: "Do you want to delete the tasklist?",
            okButtonText: "Yes",
            cancelButtonText: "No",
            neutralButtonText: "Cancel"
        };

        confirm(options).then((result: boolean) => {
            console.log(result);
            if (result) {
                this.db.execSQL("DELETE FROM lists WHERE id=?", [list.id]).then(() => {
                    console.log(list.list_name.toUpperCase() + " Task list deleted successfully!")
                });

                this.lists.splice(index, 1);
            }
        });
    }

    setListid(list) {
        setNumber("id", list.id);
        setString("listname", list.list_name);
    }

    cleartaskslist() {
        if (this.lists.length == 0) {
            alert("Task list is empty ☹️ !");
            return;
        }
        let options = {
            title: "Tasklist Clear",
            message: "Do you want to clear all the tasklists?",
            okButtonText: "Yes",
            cancelButtonText: "No",
            neutralButtonText: "Cancel"
        };

        confirm(options).then((result: boolean) => {
            console.log(result);
            if (result) {
                this.db.execSQL("DELETE FROM lists");
                this.db.execSQL("DELETE FROM tasks");
                this.lists = [];
                alert("Tasks list cleared successfully!");
            }
        });
    }

    edittasklist(list) { 
        let options: PromptOptions = {
            title: "Edit task list name",
            defaultText: list.list_name,
            inputType: inputType.text,
            okButtonText: "OK",
            cancelButtonText: "Cancel",
            cancelable: true
        };

        prompt(options).then((result: PromptResult) => {
            console.log("edit task l name : " + JSON.stringify(result));
            if (result.result) {
                if (result.text.length > 0) {

                    this.db.execSQL("UPDATE lists SET list_name=? WHERE id=?", [result.text, list.id]).then(() => {
                        console.log(list.list_name.toUpperCase() + " Task updated successfully!");
                        this.selecttaskslist();
                    });
                }
                else {
                    alert("Please edit the task name to update!");
                    return;
                }
            }
        });
    }

}
