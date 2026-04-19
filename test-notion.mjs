import { Client } from "@notionhq/client";
const notion = new Client({ auth: "dummy" });
console.log(typeof notion.databases.query);
