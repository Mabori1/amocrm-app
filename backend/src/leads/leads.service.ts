import axios from 'axios';
import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';

import {
  client_id,
  client_secret,
  redirect_uri,
  username,
} from 'amo-client.json';

const url = `https://${username}.amocrm.ru/api/v4`;

const myPath = './tokens.json';
let access_token = getToken();
const logger = new Logger('AMO');

export interface Lead {
  pipeline_id: number;
  status_id: number;
  id: number;
  name: string;
  price: number;
  created_at: number;
  user: string;
  status_name: string;
  status_color: string;
  contacts: {
    contact_name: string;
    contact_phone: string;
    contact_email: string;
  }[];
}

@Injectable()
export class LeadsService {
  async findAll(query?: string | null) {
    return await leads(query);
  }
}

async function leads(query: string) {
  query && query.length > 2 ? query : (query = '');
  let attempt = 0;

  try {
    return await getLeads();
  } catch (e) {
    logger.error('ошибка 1', e);
    return { message: 'Query error access' };
  }

  async function getLeads() {
    if (attempt > 5) return;
    attempt += 1;
    try {
      const answer: Lead[] = [];

      const leads = await axios.get(`${url}/leads`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          query,
          with: 'contacts',
        },
      });

      if (!leads.data) {
        return answer;
      }

      for (const item of leads.data._embedded.leads) {
        const lead: Lead = {
          pipeline_id: item.pipeline_id,
          status_id: item.status_id,

          id: item.id,
          name: item.name,
          price: item.price,
          created_at: Number(item.created_at + '000'),
          user: '',
          status_name: '',
          status_color: '',
          contacts: [],
        };
        const user = await axios.get(`${url}/users/${item.created_by}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        lead.user = user.data.name;

        interface Pipeline {
          id: number;
          name: string;
          color: string;
        }

        const pipelines = await axios.get<Pipeline>(
          `${url}/leads/pipelines/${lead.pipeline_id}/statuses/${lead.status_id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        );

        lead.status_name = pipelines.data.name;
        lead.status_color = pipelines.data.color;

        for (const contact of item._embedded.contacts) {
          const resContact = await axios.get(`${url}/contacts/${contact.id}`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          const contactRes: Lead['contacts'][0] = {
            contact_name: resContact.data.name as string,
            contact_phone: resContact.data.custom_fields_values[0].values[0]
              .value as string,
            contact_email: resContact.data.custom_fields_values[1].values[0]
              .value as string,
          };

          lead.contacts.push(contactRes);
        }

        answer.push(lead);
      }
      return answer;
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          await refreshTokens();
          return await getLeads();
        }
      }
      logger.error('ошибка 2');
      return { message: 'Request error' };
    }
  }
}

async function refreshTokens() {
  let content: { access_token: string; refresh_token: string } =
    await JSON.parse(fs.readFileSync(myPath, 'utf8'));

  const new_data = await axios.post(
    `https://${username}.amocrm.ru/oauth2/access_token`,
    {
      client_id: client_id,
      client_secret: client_secret,
      grant_type: 'refresh_token',
      refresh_token: content.refresh_token,
      redirect_uri: redirect_uri,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  content = {
    access_token: new_data.data.access_token,
    refresh_token: new_data.data.refresh_token,
  };

  fs.writeFileSync(myPath, JSON.stringify(content, null, 2));

  const contentNew = await JSON.parse(fs.readFileSync(myPath, 'utf8'));

  access_token = contentNew.access_token;
  logger.log('Refresh tokens');
}

async function getToken() {
  const { access_token } = await JSON.parse(fs.readFileSync(myPath, 'utf8'));
  return access_token;
}
