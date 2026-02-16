// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient } from '../../generated/prisma/client';
// import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// @Injectable()
// export class PrismaService
//   extends PrismaClient
//   implements OnModuleInit, OnModuleDestroy
// {
//   constructor() {
//     const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
//     super({ adapter, log: ['info', 'warn', 'error'] });
//   }

//   async onModuleInit() {
//     try {
//       await this.$connect();
//       await this.$queryRaw`SELECT 1`;
//       console.log('✅ Prisma connected to MySQL');
//     } catch (error) {
//       console.error('❌ Prisma connection error:', error);
//       throw error;
//     }
//   }

//   async onModuleDestroy() {
//     await this.$disconnect();
//     console.log('🔌 Prisma disconnected from MySQL');
//   }
// }

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { createPool } from 'mariadb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
    // const adapter = new PrismaMariaDb({
    //   acquireTimeout: 10000,
    // });
    const poolConfig = {
      host: config.get('database.host'),
      user: config.get('database.user'),
      password: config.get('database.password'),
      database: config.get('database.name'),
      connectionLimit: 10,
    };

    const adapter = new PrismaMariaDb(poolConfig);
    super({
      adapter,
      log: ['info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma connected successfully');
    } catch (e) {
      console.error('❌ Connection failed', e);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
