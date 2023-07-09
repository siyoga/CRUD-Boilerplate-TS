import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/modules/auth/auth.module';

describe('Auth controller', () => {
  let app: INestApplication;
  const testUser = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  beforeAll(async () => {
    const authModuleRef = Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = (await authModuleRef).createNestApplication();
    await app.init();
  });

  it('Register an account', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);
  });

  it('Do not allow register with exists email', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser)
      .expect(400);
  });

  it('Do not allow register with exists username', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser)
      .expect(400);
  });

  it('Log in to account', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: testUser.username, password: testUser.password })
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toBeDefined();
        expect(body.refreshToken).toBeDefined();
      });
  });

  it('If user not found return 400', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'INVALID_USERNAME', password: 'INVALID_PASSWORD' })
      .expect(400);
  });

  it('If password incorrect return 404, invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'INVALID_USERNAME', password: 'INVALID_PASSWORD' })
      .expect(400);
  });

  it('If correct refresh token passed, api should return 200 and new token pair', async () => {
    const tokenPair = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: testUser.username, password: testUser.password });

    return request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: tokenPair.body.refreshToken })
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toBeDefined();
        expect(body.refreshToken).toBeDefined();
      });
  });

  it('If invalid refresh token passed, api should return 404', async () => {
    return request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: 'INVALID_REFRESHTOKEN' })
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
