import 'dotenv/config';
import * as joi from 'joi';

interface IEnvironments {
    // PORT: number;
    NATS_SERVERS: string[];
    DATABASE_URL: string;
}

const envSchema = joi.object({
    // PORT: joi.number().required()
    NATS_SERVERS: joi.array().items( joi.string() ).required(),
    DATABASE_URL: joi.string().required(),
})
.unknown( true );

const { error, value } = envSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});


if( error ) {
    throw new Error(`Config validation falied: ${ error.message }`);
}

const envVars: IEnvironments = value;

export const envs = {
    // port: envVars.PORT
    nats_servers: envVars.NATS_SERVERS,
    database_url: envVars.DATABASE_URL,
};

