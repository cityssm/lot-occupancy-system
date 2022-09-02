/* eslint-disable node/no-extraneous-import, node/no-unpublished-import */

import fs from "node:fs";
import * as sql from "@cityssm/mssql-multi-pool";
import { soMSSQL } from "./config.js";
import type * as sqlTypes from "mssql";

async function importMaps() {
    let pool: sqlTypes.ConnectionPool;

    try {
        pool = await sql.connect(soMSSQL);

        const result = await pool.query(
            "select m.ID as mapId, m.Name as mapName," +
                " l.ID as layerId, l.Name as layerName, l.Image as layerImage" +
                " from Legacy_Maps m" +
                " left join Legacy_Layers l on m.ID = l.Map_ID"
        );

        for (const layer of result.recordset) {
            const imageBuffer: Buffer = layer.layerImage;

            const fileName =
                layer.mapName +
                " - " +
                layer.layerName +
                " (" +
                layer.mapId +
                ", " +
                layer.layerId +
                ").wmf";

            fs.writeFile("./temp/wmf/" + fileName, imageBuffer, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        }
    } catch {
        // ignore
    } finally {
        try {
            pool.close();
        } catch {
            // ignore
        }
    }
}

await importMaps();
