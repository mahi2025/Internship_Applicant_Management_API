import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Applicant API (e2e)', () => {
  let app: INestApplication;
  let token: string;

  const applicant = () =>
    request(app.getHttpServer())
      .post('/api/applicants')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Mahlet',
        lastName: 'Tester',
        email: `test-${Date.now()}@example.com`,
        track: 'BACKEND_DEVELOPMENT',
      });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.setGlobalPrefix('api');

    await app.init();

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')

      .send({
        email: 'admin@gmail.com',
        password: 'AdminPassword',
      });

    token = response.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects unauthenticated request', async () => {
    await request(app.getHttpServer())
      .get('/api/applicants')

      .expect(401);
  });

  it('logs in admin', () => {
    expect(token).toBeDefined();
  });

  it('creates applicant', async () => {
    const res = await applicant().expect(201);

    expect(res.body.status).toBe('PENDING');
  });

  it('searches applicants', async () => {
    await applicant();

    const res = await request(app.getHttpServer())
      .get('/api/applicants?search=Mahlet')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('filters applicants by track', async () => {
    
    const res = await request(app.getHttpServer())
      .get('/api/applicants?track=BACKEND_DEVELOPMENT')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.data.every((a) => a.track === 'BACKEND_DEVELOPMENT')).toBe(
      true,
    );
  });

  it('updates applicant status', async () => {
    const created = await applicant();

    const id = created.body.id;

    const res = await request(app.getHttpServer())
      .patch(`/api/applicants/${id}/status`)

      .set('Authorization', `Bearer ${token}`)

      .send({
        status: 'SHORTLISTED',
      })

      .expect(200);

    expect(res.body.status).toBe('SHORTLISTED');
  });

  it('prevents rejected applicant acceptance', async () => {
    const created = await applicant();

    const id = created.body.id;

    await request(app.getHttpServer())
      .patch(`/api/applicants/${id}/status`)

      .set('Authorization', `Bearer ${token}`)

      .send({
        status: 'REJECTED',
      });

    await request(app.getHttpServer())
      .patch(`/api/applicants/${id}/status`)

      .set('Authorization', `Bearer ${token}`)

      .send({
        status: 'ACCEPTED',
      })

      .expect(422);
  });

  it('adds notes', async () => {
    const created = await applicant();

    const id = created.body.id;

    const res = await request(app.getHttpServer())
      .patch(`/api/applicants/${id}/notes`)

      .set('Authorization', `Bearer ${token}`)

      .send({
        notes: 'Strong backend candidate',
      })

      .expect(200);

    expect(res.body.notes).toBe('Strong backend candidate');
  });
});
