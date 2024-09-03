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
            const creator = (() => {
                const c = json['@attributes']?.['creator'];
                if (c === undefined) return 'Unknown';
                if (c.toLowerCase().includes('garmin')) return 'Garmin';
                if (c.toLowerCase().includes('strava')) return 'Strava';
                if (c.toLowerCase().includes('polar')) return 'Polar';
                if (c.toLowerCase().includes('samsung')) return 'Samsung';
                if (c.toLowerCase().includes('suunto')) return 'Suunto';
            })();
            const seg = json['trk']['trkseg'];

            for (let i = 0; i < seg['trkpt'].length; i++) {
                const s = new Segment({});
                s.id = i;
                s.time = seg['trkpt'][i]['time']['#text'];
                s.lat = Number(seg['trkpt'][i]['@attributes']['lat']);
                s.lon = Number(seg['trkpt'][i]['@attributes']['lon']);
                s.ele = Number(seg['trkpt'][i]['ele']?.['#text']) ?? 0;

                switch (creator) {
                    case 'Garmin':
                        s.hr = Number(seg['trkpt'][i]?.['extensions']?.["ns3:TrackPointExtension"]?.["ns3:hr"]?.["#text"]);
                        break;
                    case 'Strava':
                        s.hr = Number(seg['trkpt'][i]?.['extensions']?.["gpxtpx:TrackPointExtension"]?.["gpxtpx:hr"]?.["#text"]);
                        break;
                    case 'Samsung':
                        s.hr = Number(seg['trkpt'][i]?.['extensions']?.["gpxtpx:TrackPointExtension"]?.["gpxtpx:hr"]?.["#text"]);
                        break;
                }

                data.push(s);
            }

            const activity: Activity = new Activity(
                Math.floor(Number.MAX_SAFE_INTEGER * Math.random()),
                json['trk']['name']["#text"] ?? 'New Activity',
                new Date(json['metadata']?.['time']?.["#text"] ?? data[0].time),
                null as any,
                functions.distance(data),
                functions.deltaTime(data),
                functions.averageSpeed(data),
                functions.maxSpeed(data),
                functions.averageHr(data),
                functions.maxHr(data),
                functions.minHr(data),
                functions.elevationGain(data),
                functions.elevationLoss(data),
                functions.maxElevation(data),
                functions.minElevation(data),
                data
            );
            resolve(activity);
        }

        reader.readAsText(file);
    })
}