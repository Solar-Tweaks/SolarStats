import { validate } from 'jsonschema';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import Logger from '../Classes/Logger';
import { Config } from '../Types';

const customConfigPath = process.argv
  .find((arg) => arg.startsWith('--config='))
  ?.split('=')[1];
const filePath = customConfigPath || './config.json';

export default function getConfig(): Config {
  const exists = existsSync(filePath);

  if (!exists) {
    Logger.info(
      'Config does not exists! Creating a new one with default values...'
    );
    writeFileSync(filePath, JSON.stringify(defaultConfig, null, 2));
  }

  return readConfigSync();
}

export async function setValue(key: string, value: unknown): Promise<void> {
  const config = JSON.parse(await readFile(filePath, 'utf8'));
  config[key] = value;
  await writeFile(filePath, JSON.stringify(config, null, 2));
}

export async function readConfig(): Promise<Config> {
  const data = await readFile(filePath, 'utf8');

  try {
    const parsed = JSON.parse(data);
    if (validate(parsed, configSchema).valid) {
      return parsed;
    } else {
      throw new Error("Can't validate config file");
    }
  } catch (error) {
    Logger.error('Error while processing config file');
    throw error;
  }
}

export function readConfigSync(): Config {
  const data = readFileSync(filePath, 'utf8');

  try {
    const parsed = JSON.parse(data);
    if (validate(parsed, configSchema).valid) {
      return parsed;
    } else {
      throw new Error("Can't validate config file");
    }
  } catch (error) {
    Logger.error('Error while processing config file');
    throw error;
  }
}

// Automatically generated schema by `typescript-json-schema`
// Use `npm run generateConfigSchema` to regenerate
export const configSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    apiKey: {
      type: 'string',
    },
    autoDownloadUpdates: {
      type: 'boolean',
    },
    checkForUpdates: {
      type: 'boolean',
    },
    customEmotes: {
      additionalProperties: {
        type: 'string',
      },
      type: 'object',
    },
    modules: {
      additionalProperties: {
        type: 'boolean',
      },
      type: 'object',
    },
    server: {
      properties: {
        host: {
          type: 'string',
        },
        port: {
          type: 'number',
        },
      },
      type: 'object',
    },
    statistics: {
      type: 'boolean',
    },
  },
  type: 'object',
};

export const defaultConfig: Config = {
  apiKey: "I can't provide a key, sorry!",
  server: {
    host: 'hypixel.net',
    port: 25565,
  },
  customEmotes: {},
  checkForUpdates: true,
  autoDownloadUpdates: true,
  statistics: true,
  modules: {
    bedwarsWaypoints: true,
    heightLimitDelayFix: true,
    lunarCooldowns: true,
    bedwarsTeammates: true,
    mvpppEmotes: true,
    stats: true,
  },
};
