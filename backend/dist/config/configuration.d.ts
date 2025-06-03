import * as Joi from 'joi';
declare const _default: () => {
    port: number;
    nodeEnv: string;
    appName: string;
    appVersion: string;
    appDescription: string;
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    cors: {
        origin: string;
    };
    database: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        synchronize: boolean;
        logging: boolean;
    };
    aws: {
        accessKeyId: string | undefined;
        secretAccessKey: string | undefined;
        region: string;
        s3: {
            bucketName: string;
            publicUrl: string | undefined;
        };
    };
    email: {
        host: string | undefined;
        port: number;
        secure: boolean;
        auth: {
            user: string | undefined;
            pass: string | undefined;
        };
        from: string;
    };
    frontendUrl: string;
    apiUrl: string;
};
export default _default;
export declare const validationSchema: Joi.ObjectSchema<any>;
