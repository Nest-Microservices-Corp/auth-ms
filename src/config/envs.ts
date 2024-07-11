import 'dotenv/config';
import * as joi from 'joi';

interface IEnvironments {
    NATS_SERVERS: string[];
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXP: string;
}

const envSchema = joi.object({
    NATS_SERVERS: joi.array().items( joi.string() ).required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXP: joi.string().required(),
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
    nats_servers: envVars.NATS_SERVERS,
    database_url: envVars.DATABASE_URL,
    jwt_secret: envVars.JWT_SECRET,
    jwt_exp: envVars.JWT_EXP,
};

