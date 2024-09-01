import { Activity } from "../models/activity";
import { Segment } from "../models/segment";
import * as functions from "./functions";

export function xmlToJson(xml: any) {
    let obj: any = {};

    if (xml.nodeType === 1) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                const attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    }
    else if (xml.nodeType === 3) {
        obj = xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;

            if (item.nodeType === 3 && item.nodeValue.trim() === "") {
                continue;
            }

            if (typeof (obj[nodeName]) === "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) === "undefined") {
                    const old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }

    return obj;
}

export async function readGpx(file: any): Promise<Activity> {
    return new Promise((resolve) => {
        const data: Segment[] = [];
        const reader = new FileReader();

        // Lire le fichier en tant que texte
        reader.onload = function (event: any) {
            const xmlData = event.target.result;

            // Parse XML et affichage en tant qu'objet DOM
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlData, "application/xml");

            const json = xmlToJson(xmlDoc.documentElement);
            const seg = json['trk']['trkseg'];

            for (let i = 0; i < seg['trkpt'].length; i++) {
                data.push({
                    id: i,
                    time: seg['trkpt'][i]['time']['#text'],
                    lat: Number(seg['trkpt'][i]['@attributes']['lat']),
                    lon: Number(seg['trkpt'][i]['@attributes']['lon']),
                    ele: Number(seg['trkpt'][i]['ele']?.['#text']) ?? 'N/A',
                    hr: Number(seg['trkpt'][i]?.['extensions']?.["gpxtpx:TrackPointExtension"]?.["gpxtpx:hr"]?.["#text"]) ?? 'N/A'
                })
            }

            const activity: Activity = new Activity(
                Math.floor(Number.MAX_SAFE_INTEGER * Math.random()),
                json['trk']['name']["#text"] ?? 'New Activity',
                json['metadata']?.['time']?.["#text"] ?? data[0].time,
                null as any,
                functions.distance(data),
                functions.deltaTime(data),
                functions.averageSpeed(data),
                functions.maxSpeed(data),
                functions.averageHr(data),
                functions.maxHr(data),
                functions.minHr(data),
                data
            );
            resolve(activity);
        }

        reader.readAsText(file);
    })
}