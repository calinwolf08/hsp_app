import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } from '$env/static/private';

const poolConfig = {
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_DATABASE,
};

console.log('======================')
console.log(poolConfig);
console.log('======================')

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: new Pool(poolConfig),
    advanced: {
        database: {
            generateId: false,
        }
    },
    user: {
        modelName: 'users',
        fields: {
            // id: 'better_auth_id',
            name: 'first_name',
            emailVerified: 'email_verified',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    },
    session: {
        modelName: 'sessions',
        fields: {
            // id: 'better_auth_id',
            userId: 'user_id',
            expiresAt: 'expires_at',
            ipAddress: 'ip_address',
            userAgent: 'user_agent',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    },
    account: {
        modelName: 'accounts',
        fields: {
            // id: 'better_auth_id',
            userId: 'user_id',
            accountId: 'account_id',
            providerId: 'provider_id',
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
            idToken: 'id_token',
            accessTokenExpiresAt: 'access_token_expires_at',
            refreshTokenExpiresAt: 'refresh_token_expires_at',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    },
    verification: {
        modelName: 'verifications',
        fields: {
            // id: 'better_auth_id',
            expiresAt: 'expires_at',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    },
});

