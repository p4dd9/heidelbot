import fetch from 'node-fetch';
import { TWITCH_VAR } from './config';
import { startOfMonth, lastDayOfMonth, format } from 'date-fns';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { sendMessageToChannel } from '../discordClient';
import { CHANNEL } from '../consts/channel';

/**
 * OAuth authorization code flow
 * https://dev.twitch.tv/docs/authentication/getting-tokens-oauth#oauth-authorization-code-flow
 *
 * TODO:
 * - Prod: Feed system and persist token until next deployment
 * - Dev: Initially fetch token (4hrs expiry) by hand - prepare helper if api used
 */
export class TwitchClient {
    clientId;

    clientSecret;

    accessToken;

    refreshToken;

    constructor() {
        this.clientId = TWITCH_VAR.CLIENT_ID;
        this.clientSecret = TWITCH_VAR.SECRET;
    }

    async start() {
        this.fetchCSV();
    }

    async fetchCSV() {
        try {
            await this.fetchExtensionAnalytics();
        } catch (e) {
            console.log(e);
            // refresh access_token
        }
    }

    async refreshAccessToken() {
        try {
            const url = `https://id.twitch.tv/oauth2/token?&refresh_token=${this.refreshToken}&client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=refresh_token`;
            const res = await fetch(url, {
                method: 'POST',
            });
            const data = await res.json();
            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;
        } catch (e) {
            console.error(`Refreshing access token failed: ${e}`);
        }
    }

    async validateAccessToken() {
        try {
            const url = 'https://id.twitch.tv/oauth2/validate';
            console.info('Validating Access Token ... ');
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });
            const data = await res.json();
            console.log(data);
        } catch (e) {
            console.error(e);
        }
    }

    async fetchExtensionAnalytics() {
        try {
            const started_at = format(
                startOfMonth(new Date()),
                "yyyy-MM-dd'T'hh:mm:ss'Z'",
            );
            const ended_at = format(
                lastDayOfMonth(new Date()),
                "yyyy-MM-dd'T'hh:mm:ss'Z'",
            );
            const url = `https://api.twitch.tv/helix/analytics/extensions?started_at=${started_at}&ended_at=${ended_at}&extension_id=${TWITCH_VAR.CLIENT_ID}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Client-Id': this.clientId,
                },
            });
            const data = await res.json();
            const csvResponse = await fetch(data.data[0].URL);
            const buffer = await csvResponse.buffer();

            const readable = new Readable();
            readable._read = () => {};
            readable.push(buffer);
            readable.push(null);

            let msgForDiscord = '';
            readable
                .pipe(csv({ delimiter: ',' }))
                .on('data', (row) => {
                    msgForDiscord += `${row.Date} - Unique Viewers Last 30 Days: ${row['Unique Viewers Last 30 Days']} \n`;
                })
                .on('end', () => {
                    sendMessageToChannel(
                        msgForDiscord,
                        CHANNEL.itshammertimelogs,
                    );
                    console.log('CSV file successfully processed');
                });
            return data;
        } catch (e) {
            console.error(e);
            return {};
        }
    }
}
